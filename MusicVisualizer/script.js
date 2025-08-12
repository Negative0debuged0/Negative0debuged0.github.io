// Music Visualizer - Main script
import { createCustomCursor, toggleCursor } from '../cursor.js';
import { initOptions, toggleOption } from '../options.js';
import { updateParticleSettings, updateAnimationSettings } from '../particles.js';
import { initColorPicker, updateAccentColor } from '../colorPicker.js';
import { applyTheme, saveOptions, loadOptions } from '../themes.js';
import config from '../config.js';

// Import visualizer modules
import VisualizerCore from './visualizer-core.js';
import BasicVisualizers from './basic-visualizers.js';
import AdvancedVisualizers from './advanced-visualizers.js';
import WaveformVisualizers from './waveform-visualizers.js';

document.addEventListener('DOMContentLoaded', () => {
    // Get shared config from parent window if in iframe, otherwise use local config
    const sharedConfig = window.parent.sharedConfig || config;
    if (window.parent.sharedConfig) {
        Object.assign(config.options, window.parent.sharedConfig.options);
    }
    
    // Initialize options panel
    initOptions();
    
    // Fix options button functionality
    const optionsButton = document.getElementById('options-button');
    const toggleOptionsPopup = (show) => {
        const popup = document.querySelector('.options-popup');
        if (popup) {
            if (show) {
                popup.classList.add('active');
            } else {
                popup.classList.remove('active');
            }
        }
    };
    
    optionsButton.addEventListener('click', () => {
        toggleOptionsPopup(true);
    });
    
    // Initialize custom cursor if enabled
    if (config.options.customCursor) {
        createCustomCursor();
        
        // Apply cursor: none to document body and all elements
        document.body.style.cursor = 'none';
        document.documentElement.style.cursor = 'none';
        
        // Get all elements with click events and ensure they have cursor:none
        const allClickableElements = document.querySelectorAll('a, button, .file-input-label, .color-option, .slider-control, #options-button, input[type="range"], input[type="color"]');
        allClickableElements.forEach(el => {
            el.style.cursor = 'none';
        });
    }
    
    // Style adjustments based on accent color
    document.documentElement.style.setProperty('--accent-color', sharedConfig?.accentColor || config.accentColor);
    
    // Initialize color picker for theme customization
    initColorPicker();
    
    // Music Visualizer specific initialization code
    initAudioVisualizer();
    
    // Handle preset buttons
    initPresetButtons();
    
    // Share config with parent
    window.sharedConfig = config;
});

function initPresetButtons() {
    const presetButtons = document.querySelectorAll('.preset-btn');
    
    presetButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const style = btn.dataset.style;
            const color = btn.dataset.color;
            
            // Prefer triggering the actual UI buttons so state stays in sync
            const targetStyleBtn = document.querySelector(`.vis-style-btn[data-style="${style}"]`);
            if (targetStyleBtn) targetStyleBtn.click();
            
            const targetColorBtn = document.querySelector(`.color-option[data-color="${color}"]`);
            if (targetColorBtn) targetColorBtn.click();
        });
    });
}

// Main function to initialize custom cursor
function initCustomCursor(options = {}) {
    // Set accent color if provided
    if (options.accentColor) {
        document.documentElement.style.setProperty('--accent-color', options.accentColor);
    }
    
    // Hide default cursor
    document.documentElement.style.cursor = 'none';
    document.body.style.cursor = 'none';
    
    // Create cursor elements
    const cursorElements = createCursorElements();
    
    // Inject CSS styles
    injectCursorStyles();
    
    // Initialize cursor movement
    initCursorMovement(cursorElements);
    
    // Set up element interactivity
    setupCursorInteractivity(cursorElements);
    
    // Return API to control cursor
    return {
        // Method to change cursor color
        setColor: (color) => {
            document.documentElement.style.setProperty('--accent-color', color);
        },
        
        // Method to toggle cursor visibility
        toggle: (visible = true) => {
            const display = visible ? 'block' : 'none';
            cursorElements.cursor.style.display = display;
            cursorElements.cursorDot.style.display = display;
            cursorElements.cursorSvg.style.display = display;
            document.documentElement.style.cursor = visible ? 'none' : 'auto';
            document.body.style.cursor = visible ? 'none' : 'auto';
        },
        
        // Method to destroy the custom cursor and restore defaults
        destroy: () => {
            document.body.removeChild(cursorElements.cursor);
            document.body.removeChild(cursorElements.cursorDot);
            document.body.removeChild(cursorElements.cursorSvg);
            document.documentElement.style.cursor = 'auto';
            document.body.style.cursor = 'auto';
        }
    };
}

function initAudioVisualizer() {
    // Audio context and nodes
    let audioContext;
    let audioSource;
    let analyser;
    let gainNode;
    let audioElement;
    let frequencyData;
    let timeData;
    let microphoneStream;
    let isPlaying = false;
    let isMicrophone = false;
    let hasAudioLoaded = false; // Track if audio has been loaded
    
    // Video export related variables
    let isRecordingExport = false;
    let exportCanvas = null;
    let exportCtx = null;
    let exportStream = null;
    let exportMediaRecorder = null;
    let exportRecordedChunks = [];
    let exportAnimationId = null;
    let exportQuality = { width: 1280, height: 720, fps: 30 }; // Performance-friendly defaults
    
    // Canvas elements
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    
    // Animation state
    let animationFrameId = null;
    let particlesArray = [];
    
    // Visualization settings
    let visualizationStyle = 'bars';
    let colorTheme = 'gradient';
    let customColor = '#ffffff';
    let sensitivity = 1.2;
    let smoothingTimeConstant = 0.6;
    // Expose for debugging (optional)
    window.__vv = { get style(){return visualizationStyle;}, set style(v){visualizationStyle=v;}, get color(){return colorTheme;}, set color(v){colorTheme=v;} };
    
    // UI Elements
    const fileInput = document.getElementById('audio-file');
    const fileName = document.getElementById('file-name');
    const micToggle = document.getElementById('mic-toggle');
    const visualizerMessage = document.getElementById('visualizer-message');
    const playPauseBtn = document.getElementById('play-pause');
    const muteToggleBtn = document.getElementById('mute-toggle');
    const volumeSlider = document.getElementById('volume');
    const sensitivitySlider = document.getElementById('sensitivity');
    const smoothingSlider = document.getElementById('smoothing');
    const styleButtons = document.querySelectorAll('.vis-style-btn');
    const colorOptions = document.querySelectorAll('.color-option');
    const customColorInput = document.getElementById('custom-color');
    const recordToggleBtn = document.getElementById('record-toggle');
    const downloadVideoBtn = document.getElementById('download-video');
    const progressSlider = document.getElementById('progress');
    const timeDisplay = document.getElementById('time-display');
    
    // Event listeners for sliders
    sensitivitySlider.addEventListener('input', (e) => {
        sensitivity = parseFloat(e.target.value);
    });

    smoothingSlider.addEventListener('input', (e) => {
        smoothingTimeConstant = parseFloat(e.target.value);
        if (analyser) {
            analyser.smoothingTimeConstant = smoothingTimeConstant;
        }
    });

    // Initialize audio context and nodes
    function initAudioContext() {
        try {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            analyser = audioContext.createAnalyser();
            gainNode = audioContext.createGain();
            
            // Configure analyser
            analyser.fftSize = 2048;
            analyser.smoothingTimeConstant = smoothingTimeConstant;
            
            // Initialize frequency and time data arrays
            frequencyData = new Uint8Array(analyser.frequencyBinCount);
            timeData = new Uint8Array(analyser.fftSize);
            
            return true;
        } catch (error) {
            console.error('Error initializing audio context:', error);
            return false;
        }
    }
    
    // Create popup elements
    const customGradientButton = document.querySelector('[data-color="custom-gradient"]');
    const customGradientPanel = document.getElementById('custom-gradient-panel');
    const addColorStopButton = document.querySelector('.add-color-stop');
    const applyGradientButton = document.querySelector('.apply-gradient');
    const gradientPreview = document.querySelector('.gradient-preview');

    // Custom gradient colors array
    let customGradientColors = ['#ff6b6b', '#4ecdc4'];

    // Update gradient preview 
    function updateGradientPreview() {
        const gradientCSS = `linear-gradient(90deg, ${customGradientColors.join(', ')})`;
        gradientPreview.style.background = gradientCSS;
        customGradientButton.style.background = gradientCSS;
    }

    // Initialize gradient preview
    updateGradientPreview();

    // Toggle custom gradient panel
    customGradientButton.addEventListener('click', (e) => {
        e.stopPropagation();
        customGradientPanel.classList.toggle('active');
        
        // Close panel if clicking anywhere else
        const closeOnOutsideClick = (event) => {
            if (!customGradientPanel.contains(event.target) && event.target !== customGradientButton) {
                customGradientPanel.classList.remove('active');
                document.removeEventListener('click', closeOnOutsideClick);
            }
        };
        
        document.addEventListener('click', closeOnOutsideClick);
    });

    // Add new color stop
    addColorStopButton.addEventListener('click', () => {
        const gradientColors = document.querySelector('.gradient-colors');
        const newStop = document.createElement('div');
        newStop.className = 'gradient-color-stop';
        newStop.innerHTML = `
            <input type="color" value="#ffffff">
            <button class="remove-color-stop">×</button>
        `;
        
        // Insert before the add button
        gradientColors.insertBefore(newStop, addColorStopButton);
        
        // Add event listener to the new color input
        const newColorInput = newStop.querySelector('input[type="color"]');
        newColorInput.addEventListener('input', () => {
            updateCustomGradientColors();
        });
        
        // Add event listener to remove button
        const removeButton = newStop.querySelector('.remove-color-stop');
        removeButton.addEventListener('click', (e) => {
            e.stopPropagation();
            newStop.remove();
            updateCustomGradientColors();
        });
        
        // Add the default color to the array
        customGradientColors.push('#ffffff');
        updateGradientPreview();
    });

    // Apply custom gradient
    applyGradientButton.addEventListener('click', () => {
        // Update active state of color options
        colorOptions.forEach(opt => opt.classList.remove('active'));
        customGradientButton.classList.add('active');
        
        // Set color theme to custom gradient
        colorTheme = 'custom-gradient';
        
        // Close the panel
        customGradientPanel.classList.remove('active');
    });

    // Initialize event listeners for existing color stops
    document.querySelectorAll('.gradient-color-stop input[type="color"]').forEach(input => {
        input.addEventListener('input', () => {
            updateCustomGradientColors();
        });
    });

    document.querySelectorAll('.remove-color-stop').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            // Don't remove if there are only 2 colors left
            const stops = document.querySelectorAll('.gradient-color-stop');
            if (stops.length <= 2) return;
            
            e.target.parentElement.remove();
            updateCustomGradientColors();
        });
    });

    // Update gradient colors array from inputs
    function updateCustomGradientColors() {
        const colorInputs = document.querySelectorAll('.gradient-color-stop input[type="color"]');
        customGradientColors = Array.from(colorInputs).map(input => input.value);
        updateGradientPreview();
    }

    // Initialize canvas size
    function resizeCanvas() {
        canvas.width = canvas.clientWidth * window.devicePixelRatio;
        canvas.height = canvas.clientHeight * window.devicePixelRatio;
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // File input handling
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file && file.type.includes('audio')) {
            fileName.textContent = file.name;
            const url = URL.createObjectURL(file);
            loadAudioFile(url, file.name);
            visualizerMessage.style.opacity = '0';
            
            // Switch to file input tab
            document.querySelector('.file-input-method').classList.add('active');
            document.querySelector('.mic-input-method').classList.remove('active');
            if (microphoneStream) {
                microphoneStream.getTracks().forEach(track => track.stop());
                microphoneStream = null;
                micToggle.classList.remove('active');
                micToggle.querySelector('.mic-text').textContent = 'Start Microphone';
            }
            isMicrophone = false;
        }
    });
    
    // Drag and drop handling
    const fileLabel = document.querySelector('.file-input-label');
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        fileLabel.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    ['dragenter', 'dragover'].forEach(eventName => {
        fileLabel.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        fileLabel.addEventListener(eventName, unhighlight, false);
    });
    
    function highlight() {
        fileLabel.classList.add('file-drop-active');
    }
    
    function unhighlight() {
        fileLabel.classList.remove('file-drop-active');
    }
    
    fileLabel.addEventListener('drop', handleDrop, false);
    
    function handleDrop(e) {
        const dt = e.dataTransfer;
        const file = dt.files[0];
        
        if (file && file.type.includes('audio')) {
            fileInput.files = dt.files;
            fileName.textContent = file.name;
            const url = URL.createObjectURL(file);
            loadAudioFile(url, file.name);
            visualizerMessage.style.opacity = '0';
            
            // Switch to file input tab
            document.querySelector('.file-input-method').classList.add('active');
            document.querySelector('.mic-input-method').classList.remove('active');
            if (microphoneStream) {
                microphoneStream.getTracks().forEach(track => track.stop());
                microphoneStream = null;
                micToggle.classList.remove('active');
                micToggle.querySelector('.mic-text').textContent = 'Start Microphone';
            }
            isMicrophone = false;
        }
    }
    
    // Audio controls functionality
    function togglePlayPause() {
        if (!audioElement) return;
        
        if (isPlaying) {
            audioElement.pause();
            isPlaying = false;
            playPauseBtn.innerHTML = `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 5V19L19 12L8 5Z" fill="var(--accent-color)"/>
                </svg>
            `;
        } else {
            audioElement.play().then(() => {
                isPlaying = true;
                playPauseBtn.innerHTML = `
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="6" y="4" width="4" height="16" fill="var(--accent-color)"/>
                        <rect x="14" y="4" width="4" height="16" fill="var(--accent-color)"/>
                    </svg>
                `;
                
                // Hide message when audio starts playing
                visualizerMessage.style.opacity = '0';
                
                // Restart visualization if it was stopped
                if (!animationFrameId) {
                    updateVisualization();
                }
            }).catch(error => {
                console.error('Error playing audio:', error);
            });
        }
    }
    
    function toggleMute() {
        if (!audioElement) return;
        
        audioElement.muted = !audioElement.muted;
        
        if (audioElement.muted) {
            muteToggleBtn.innerHTML = `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 9V15H7L12 20V4L7 9H3Z" fill="var(--accent-color)"/>
                    <line x1="23" y1="9" x2="17" y2="15" stroke="var(--accent-color)" stroke-width="2"/>
                    <line x1="17" y1="9" x2="23" y2="15" stroke="var(--accent-color)" stroke-width="2"/>
                </svg>
            `;
        } else {
            muteToggleBtn.innerHTML = `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 9V15H7L12 20V4L7 9H3Z" fill="var(--accent-color)"/>
                    <path d="M16.5 12C16.5 10.23 15.48 8.71 14 7.97V16.02C15.48 15.29 16.5 13.77 16.5 12Z" fill="var(--accent-color)"/>
                    <path d="M14 3.23V5.29C16.89 6.15 21 12C21 15.17 16.89 18.71 14 19.57V21.53C18.01 20.62 21 17.04 21 12C21 7.72 18.01 4.14 14 3.23Z" fill="var(--accent-color)"/>
                </svg>
            `;
        }
    }
    
    function updateVolume() {
        if (!audioElement) return;
        audioElement.volume = volumeSlider.value;
    }
    
    function updateProgress() {
        if (!audioElement || !audioElement.duration || isNaN(audioElement.duration)) return;
        
        const currentTime = audioElement.currentTime;
        const duration = audioElement.duration;
        const progress = (currentTime / duration) * 100;
        
        // Only update slider if user is not currently dragging it
        if (!progressSlider.classList.contains('dragging')) {
            progressSlider.value = progress;
        }
        
        // Format time display
        const formatTime = (time) => {
            if (isNaN(time)) return '0:00';
            const minutes = Math.floor(time / 60);
            const seconds = Math.floor(time % 60);
            return `${minutes}:${seconds.toString().padStart(2, '0')}`;
        };
        
        timeDisplay.textContent = `${formatTime(currentTime)} / ${formatTime(duration)}`;
    }
    
    function seekAudio() {
        if (!audioElement || !audioElement.duration || isNaN(audioElement.duration)) return;
        
        const seekTime = (progressSlider.value / 100) * audioElement.duration;
        audioElement.currentTime = seekTime;
    }
    
    // Add event listeners for visualization style and color options
    styleButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            styleButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Update visualization style
            visualizationStyle = btn.dataset.style;
        });
    });

    colorOptions.forEach(opt => {
        opt.addEventListener('click', (e) => {
            // Don't change active state for custom color picker input
            if (e.target.id === 'custom-color') return;
            
            // Don't close panel when interacting with it
            if (customGradientPanel.contains(e.target)) return;

            // Handle custom color picker separately
            if (opt.dataset.color === 'custom') {
                customColorInput.click();
                return;
            }
            
            // Handle custom gradient button
            if (opt.dataset.color === 'custom-gradient') {
                // Toggle panel, handled by another event listener
                return;
            }

            // Update active state
            colorOptions.forEach(o => o.classList.remove('active'));
            opt.classList.add('active');
            
            // Update color theme
            colorTheme = opt.dataset.color;
        });
    });
    
    customColorInput.addEventListener('input', (e) => {
        customColor = e.target.value;
        colorTheme = 'custom';
        
        // Update active state
        colorOptions.forEach(o => o.classList.remove('active'));
        const customColorBtn = document.querySelector('.color-option[data-color="custom"]');
        if (customColorBtn) {
            customColorBtn.classList.add('active');
            customColorBtn.style.background = customColor;
        }
    });

    // Progress slider drag handling
    let isProgressDragging = false;
    
    progressSlider.addEventListener('mousedown', () => {
        isProgressDragging = true;
        progressSlider.classList.add('dragging');
    });
    
    document.addEventListener('mouseup', () => {
        if (isProgressDragging) {
            isProgressDragging = false;
            progressSlider.classList.remove('dragging');
            seekAudio();
        }
    });
    
    progressSlider.addEventListener('input', () => {
        if (isProgressDragging) {
            seekAudio();
        }
    });
    
    // Microphone handling
    micToggle.addEventListener('click', () => {
        if (!microphoneStream) {
            initMicrophone();
        } else {
            stopMicrophone();
        }
    });
    
    async function initMicrophone() {
        try {
            // Initialize audio context if not already done
            if (!audioContext && !initAudioContext()) {
                throw new Error('Failed to initialize audio context');
            }
            
            // Resume audio context if suspended
            if (audioContext.state === 'suspended') {
                await audioContext.resume();
            }
            
            microphoneStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            audioSource = audioContext.createMediaStreamSource(microphoneStream);
            audioSource.connect(analyser);
            
            // Update UI
            micToggle.classList.add('active');
            micToggle.querySelector('.mic-text').textContent = 'Stop Microphone';
            visualizerMessage.style.opacity = '0';
            hasAudioLoaded = true; // Mark as having audio input
            
            // Switch to mic input tab
            document.querySelector('.mic-input-method').classList.add('active');
            document.querySelector('.file-input-method').classList.remove('active');
            
            // Stop audio playback if active
            if (audioElement && !audioElement.paused) {
                audioElement.pause();
                playPauseBtn.innerHTML = `
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 5V19L19 12L8 5Z" fill="var(--accent-color)"/>
                    </svg>
                `;
                isPlaying = false;
            }
            
            isMicrophone = true;
            
            // Start visualization
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
            updateVisualization();
        } catch (err) {
            console.error('Error accessing microphone:', err);
            alert('Unable to access microphone. Please check permissions and try again.');
        }
    }
    
    function stopMicrophone() {
        if (microphoneStream) {
            microphoneStream.getTracks().forEach(track => track.stop());
            microphoneStream = null;
            
            // Disconnect audio source
            if (audioSource) {
                audioSource.disconnect();
                audioSource = null;
            }
            
            // Update UI
            micToggle.classList.remove('active');
            micToggle.querySelector('.mic-text').textContent = 'Start Microphone';
            
            isMicrophone = false;
            hasAudioLoaded = false; // Reset audio loaded state
            
            // Show message if no audio playing
            if (!audioElement || audioElement.paused) {
                visualizerMessage.style.opacity = '1';
                
                // Stop animation
                if (animationFrameId) {
                    cancelAnimationFrame(animationFrameId);
                    animationFrameId = null;
                }
            }
        }
    }
    
    // Audio file handling
    function loadAudioFile(url, filename) {
        // Initialize audio context if not already done
        if (!audioContext && !initAudioContext()) {
            console.error('Failed to initialize audio context');
            return;
        }
        
        // Create new audio element
        if (audioElement) {
            audioElement.pause();
            audioElement = null;
        }
        
        audioElement = new Audio();
        audioElement.crossOrigin = 'anonymous';
        audioElement.preload = 'auto';
        
        // Set up event listeners
        audioElement.addEventListener('loadstart', () => {
            console.log('Loading started for:', filename);
        });
        
        audioElement.addEventListener('canplay', async () => {
            try {
                console.log('Audio can play:', filename);
                hasAudioLoaded = true; // Mark audio as loaded
                
                // Resume audio context if suspended
                if (audioContext.state === 'suspended') {
                    await audioContext.resume();
                }
                
                // Disconnect previous source
                if (audioSource) {
                    audioSource.disconnect();
                }
                
                // Create new source and connect
                audioSource = audioContext.createMediaElementSource(audioElement);
                audioSource.connect(gainNode);
                gainNode.connect(analyser);
                gainNode.connect(audioContext.destination);
                
                // Set volume
                audioElement.volume = volumeSlider.value || 0.7;
                
                // Enable audio controls
                playPauseBtn.disabled = false;
                muteToggleBtn.disabled = false;
                volumeSlider.disabled = false;
                progressSlider.disabled = false;
                
                // Update UI
                updateProgress();
                
                // Start playing automatically
                audioElement.play().then(() => {
                    isPlaying = true;
                    playPauseBtn.innerHTML = `
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="6" y="4" width="4" height="16" fill="var(--accent-color)"/>
                            <rect x="14" y="4" width="4" height="16" fill="var(--accent-color)"/>
                        </svg>
                    `;
                    
                    // Hide message when audio starts playing
                    visualizerMessage.style.opacity = '0';
                    
                    // Start visualization
                    if (animationFrameId) {
                        cancelAnimationFrame(animationFrameId);
                    }
                    updateVisualization();
                }).catch(error => {
                    console.error('Error auto-playing audio:', error);
                    // Enable manual play
                    isPlaying = false;
                });
                
            } catch (error) {
                console.error('Error setting up audio:', error);
            }
        });
        
        audioElement.addEventListener('loadedmetadata', () => {
            console.log('Metadata loaded, duration:', audioElement.duration);
            updateProgress();
        });
        
        audioElement.addEventListener('timeupdate', updateProgress);
        
        audioElement.addEventListener('ended', () => {
            isPlaying = false;
            playPauseBtn.innerHTML = `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 5V19L19 12L8 5Z" fill="var(--accent-color)"/>
                </svg>
            `;
            progressSlider.value = 0;
            updateProgress();
            
            // Stop the visualization when audio ends
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
                animationFrameId = null;
            }
            
            // Show message only if no audio has been loaded and not using microphone
            if (!hasAudioLoaded && !isMicrophone) {
                visualizerMessage.style.opacity = '1';
            }
        });
        
        audioElement.addEventListener('error', (e) => {
            console.error('Audio error:', e);
            alert('Error loading audio file. Please try a different file.');
        });
        
        // Load the audio file
        audioElement.src = url;
    }
    
    // Set up audio control event listeners
    playPauseBtn.addEventListener('click', togglePlayPause);
    muteToggleBtn.addEventListener('click', toggleMute);
    volumeSlider.addEventListener('input', updateVolume);
    
    // Video download functionality
    downloadVideoBtn.addEventListener('click', async () => {
        if (!hasAudioLoaded && !isMicrophone) {
            alert('Please load an audio file or enable microphone first.');
            return;
        }
        
        // Toggle start/stop recording
        if (!isRecordingExport) {
            await startExportRecording();
        } else {
            await stopExportRecording(true); // stop and save
        }
    });
    
    async function startExportRecording() {
        try {
            if (isRecordingExport) return;
            isRecordingExport = true;
            exportRecordedChunks = [];
            
            // Button UI -> "Stop & Save"
            downloadVideoBtn.disabled = false;
            downloadVideoBtn.innerHTML = `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="6" y="6" width="12" height="12" fill="var(--accent-color)"/>
                </svg>
                <span>Stop & Save</span>
            `;
            
            // Prepare export canvas at selected quality
            exportCanvas = document.createElement('canvas');
            exportCanvas.width = exportQuality.width;
            exportCanvas.height = exportQuality.height;
            exportCtx = exportCanvas.getContext('2d', { alpha: false, desynchronized: true });
            
            // Create MediaStream from canvas at target FPS
            const canvasStream = exportCanvas.captureStream(exportQuality.fps);
            exportStream = canvasStream;
            
            // Try to add audio track (file or mic)
            try {
                if (audioElement && !audioElement.muted) {
                    const recAC = new (window.AudioContext || window.webkitAudioContext)();
                    const source = recAC.createMediaElementSource(audioElement);
                    const destination = recAC.createMediaStreamDestination();
                    const recGain = recAC.createGain();
                    recGain.gain.value = 1.0;
                    source.connect(recGain);
                    recGain.connect(destination);
                    recGain.connect(recAC.destination);
                    
                    const videoTrack = canvasStream.getVideoTracks()[0];
                    const audioTrack = destination.stream.getAudioTracks()[0];
                    exportStream = new MediaStream([videoTrack, audioTrack]);
                } else if (isMicrophone && microphoneStream) {
                    const videoTrack = canvasStream.getVideoTracks()[0];
                    const audioTrack = microphoneStream.getAudioTracks()[0];
                    exportStream = new MediaStream([videoTrack, audioTrack]);
                }
            } catch (e) {
                console.warn('Audio could not be added to recording stream:', e);
                exportStream = canvasStream; // fallback to video-only
            }
            
            // Choose best supported recorder options
            let mediaRecorderOptions = {
                mimeType: 'video/webm; codecs=vp9,opus',
                videoBitsPerSecond: 8_000_000, // 8 Mbps for good quality at 720p30
                audioBitsPerSecond: 192_000
            };
            if (!MediaRecorder.isTypeSupported(mediaRecorderOptions.mimeType)) {
                mediaRecorderOptions = {
                    mimeType: 'video/webm; codecs=vp8,opus',
                    videoBitsPerSecond: 6_000_000,
                    audioBitsPerSecond: 160_000
                };
                if (!MediaRecorder.isTypeSupported(mediaRecorderOptions.mimeType)) {
                    mediaRecorderOptions = { mimeType: 'video/webm', videoBitsPerSecond: 5_000_000 };
                }
            }
            
            exportMediaRecorder = new MediaRecorder(exportStream, mediaRecorderOptions);
            exportMediaRecorder.ondataavailable = (event) => {
                if (event.data && event.data.size > 0) {
                    exportRecordedChunks.push(event.data);
                }
            };
            exportMediaRecorder.onstop = () => {
                // Compose blob and download
                const blob = new Blob(exportRecordedChunks, { type: exportMediaRecorder.mimeType || 'video/webm' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                // Keep .webm for compatibility even if the UI says MP4
                a.download = `music-visualizer-${Date.now()}.webm`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                URL.revokeObjectURL(url);
                
                // Cleanup
                cleanupExportResources();
                
                // Reset UI
                downloadVideoBtn.disabled = false;
                downloadVideoBtn.innerHTML = `
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" fill="var(--accent-color)"/>
                    </svg>
                    <span>Download MP4</span>
                `;
                
                console.log('Export completed successfully');
            };
            exportMediaRecorder.onerror = (event) => {
                console.error('Recording error:', event.error);
                alert('Recording failed. Please try again.');
                cleanupExportResources();
                downloadVideoBtn.disabled = false;
                downloadVideoBtn.innerHTML = `
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" fill="var(--accent-color)"/>
                    </svg>
                    <span>Download MP4</span>
                `;
            };
            
            // Start the recorder (collect in 1s chunks)
            exportMediaRecorder.start(1000);
            
            // Start export rendering loop at target FPS
            startExportRenderLoop();
        } catch (err) {
            console.error('Failed to start recording:', err);
            isRecordingExport = false;
            alert('Failed to start recording. Please try again.');
            downloadVideoBtn.innerHTML = `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" fill="var(--accent-color)"/>
                </svg>
                <span>Download MP4</span>
            `;
        }
    }
    
    async function stopExportRecording(save = true) {
        if (!isRecordingExport) return;
        isRecordingExport = false;
        
        // Stop the export render loop
        if (exportAnimationId) {
            cancelAnimationFrame(exportAnimationId);
            exportAnimationId = null;
        }
        
        // Stop the MediaRecorder (onstop will handle blob saving)
        if (exportMediaRecorder && exportMediaRecorder.state === 'recording') {
            try {
                exportMediaRecorder.stop();
            } catch (e) {
                console.warn('MediaRecorder stop error:', e);
                cleanupExportResources();
            }
        } else {
            cleanupExportResources();
        }
    }
    
    function cleanupExportResources() {
        exportMediaRecorder = null;
        exportRecordedChunks = [];
        
        if (exportStream) {
            exportStream.getTracks().forEach(t => t.stop());
            exportStream = null;
        }
        exportCanvas = null;
        exportCtx = null;
        // reset UI if still in recording state
        isRecordingExport = false;
    }
    
    function startExportRenderLoop() {
        const targetFPS = exportQuality.fps;
        const frameInterval = 1000 / targetFPS;
        let lastTime = performance.now();
        
        const renderFrame = () => {
            if (!isRecordingExport || !exportCtx || !exportCanvas) return;
            const now = performance.now();
            const elapsed = now - lastTime;
            if (elapsed >= frameInterval) {
                lastTime = now - (elapsed % frameInterval);
                
                // Fetch latest audio buffers
                if (analyser && frequencyData && timeData) {
                    analyser.getByteFrequencyData(frequencyData);
                    analyser.getByteTimeDomainData(timeData);
                }
                
                // Clear export canvas
                exportCtx.fillStyle = 'black';
                exportCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
                
                // Render current visualization to export canvas
                try {
                    renderVisualizationToCanvas(exportCtx, exportCanvas);
                } catch (e) {
                    console.error('Export render error:', e);
                }
            }
            exportAnimationId = requestAnimationFrame(renderFrame);
        };
        
        renderFrame();
    }
    
    // Helper function to render visualization to any canvas (shared by live and export)
    function renderVisualizationToCanvas(drawCtx, targetCanvas) {
        switch (visualizationStyle) {
            case 'bars':
                BasicVisualizers.drawBars(drawCtx, frequencyData, targetCanvas, sensitivity, colorTheme, customColor, customGradientColors);
                break;
            case 'circular':
                BasicVisualizers.drawCircular(drawCtx, frequencyData, targetCanvas, sensitivity, colorTheme, customColor, customGradientColors);
                break;
            case 'wave':
                BasicVisualizers.drawWave(drawCtx, frequencyData, targetCanvas, sensitivity, colorTheme, customColor, customGradientColors);
                break;
            case 'particles':
                particlesArray = BasicVisualizers.drawParticles(drawCtx, frequencyData, targetCanvas, sensitivity, colorTheme, customColor, customGradientColors, particlesArray);
                break;
            case 'spectrum':
                AdvancedVisualizers.drawSpectrum(drawCtx, frequencyData, targetCanvas, sensitivity, colorTheme, customColor);
                break;
            case 'fractal':
                AdvancedVisualizers.drawFractal(drawCtx, frequencyData, targetCanvas, sensitivity, colorTheme, customColor);
                break;
            case 'spiral':
                AdvancedVisualizers.drawSpiral(drawCtx, frequencyData, targetCanvas, sensitivity, colorTheme, customColor);
                break;
            case 'cubes':
                AdvancedVisualizers.drawCubes(drawCtx, frequencyData, targetCanvas, sensitivity, colorTheme, customColor);
                break;
            case 'galaxy':
                AdvancedVisualizers.drawGalaxy(drawCtx, frequencyData, targetCanvas, sensitivity, colorTheme, customColor);
                break;
            case 'neonwaves':
                AdvancedVisualizers.drawNeonWaves(drawCtx, frequencyData, targetCanvas, sensitivity, colorTheme, customColor, customGradientColors);
                break;
            case 'starfield':
                AdvancedVisualizers.drawStarfield(drawCtx, frequencyData, targetCanvas, sensitivity, colorTheme, customColor, customGradientColors);
                break;
            case 'kaleidoscope':
                AdvancedVisualizers.drawKaleidoscope(drawCtx, frequencyData, targetCanvas, sensitivity, colorTheme, customColor, customGradientColors);
                break;
            case 'dnahelix':
                AdvancedVisualizers.drawDNAHelix(drawCtx, frequencyData, targetCanvas, sensitivity, colorTheme, customColor, customGradientColors);
                break;
            case 'matrixrain':
                AdvancedVisualizers.drawMatrixRain(drawCtx, frequencyData, targetCanvas, sensitivity, colorTheme, customColor, customGradientColors);
                break;
            case 'mandala':
                AdvancedVisualizers.drawMandala(drawCtx, frequencyData, targetCanvas, sensitivity, colorTheme, customColor, customGradientColors);
                break;
            case 'neuralnetwork':
                AdvancedVisualizers.drawNeuralNetwork(drawCtx, frequencyData, targetCanvas, sensitivity, colorTheme, customColor, customGradientColors);
                break;
            case 'crystalline':
                AdvancedVisualizers.drawCrystalline(drawCtx, frequencyData, targetCanvas, sensitivity, colorTheme, customColor, customGradientColors);
                break;
            case 'plasma':
                AdvancedVisualizers.drawPlasma(drawCtx, frequencyData, targetCanvas, sensitivity, colorTheme, customColor, customGradientColors);
                break;
            case 'hologram':
                AdvancedVisualizers.drawHologram(drawCtx, frequencyData, targetCanvas, sensitivity, colorTheme, customColor, customGradientColors);
                break;
            case 'fireworks':
                particlesArray = AdvancedVisualizers.drawFireworks(drawCtx, frequencyData, targetCanvas, sensitivity, colorTheme, customColor, customGradientColors, particlesArray);
                break;
            case 'cyberspace':
                AdvancedVisualizers.drawCyberspace(drawCtx, frequencyData, targetCanvas, sensitivity, colorTheme, customColor, customGradientColors);
                break;
            case 'wormhole':
                AdvancedVisualizers.drawWormhole(drawCtx, frequencyData, targetCanvas, sensitivity, colorTheme, customColor, customGradientColors);
                break;
            case 'oscilloscope':
                WaveformVisualizers.drawOscilloscope(drawCtx, timeData, targetCanvas, sensitivity, colorTheme, customColor);
                break;
            case 'waveform':
                WaveformVisualizers.drawWaveform(drawCtx, timeData, frequencyData, targetCanvas, sensitivity, colorTheme, customColor);
                break;
            case 'terrain':
                WaveformVisualizers.drawTerrain(drawCtx, frequencyData, targetCanvas, sensitivity, colorTheme, customColor);
                break;
            case 'fountain':
                particlesArray = WaveformVisualizers.drawFountain(drawCtx, frequencyData, targetCanvas, sensitivity, colorTheme, customColor, particlesArray);
                break;
            case 'rings':
                WaveformVisualizers.drawRings(drawCtx, frequencyData, targetCanvas, sensitivity, colorTheme, customColor);
                break;
            case 'aurora':
                WaveformVisualizers.drawAurora(drawCtx, frequencyData, targetCanvas, sensitivity, colorTheme, customColor, customGradientColors);
                break;
            case 'liquidscape':
                WaveformVisualizers.drawLiquidscape(drawCtx, frequencyData, targetCanvas, sensitivity, colorTheme, customColor, customGradientColors);
                break;
            case 'vortex':
                WaveformVisualizers.drawVortex(drawCtx, frequencyData, targetCanvas, sensitivity, colorTheme, customColor, customGradientColors);
                break;
            default:
                BasicVisualizers.drawBars(drawCtx, frequencyData, targetCanvas, sensitivity, colorTheme, customColor, customGradientColors);
                break;
        }
    }
    
    // Main visualization loop
    function updateVisualization() {
        if (!analyser || !frequencyData || !timeData) {
            animationFrameId = requestAnimationFrame(updateVisualization);
            return;
        }
        
        // Get audio data
        analyser.getByteFrequencyData(frequencyData);
        analyser.getByteTimeDomainData(timeData);
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Continue visualization if we're playing audio or using microphone
        if (isPlaying || isMicrophone) {
            // Draw visualization based on selected style
            switch (visualizationStyle) {
                case 'bars':
                    BasicVisualizers.drawBars(ctx, frequencyData, canvas, sensitivity, colorTheme, customColor, customGradientColors);
                    break;
                case 'circular':
                    BasicVisualizers.drawCircular(ctx, frequencyData, canvas, sensitivity, colorTheme, customColor, customGradientColors);
                    break;
                case 'wave':
                    BasicVisualizers.drawWave(ctx, frequencyData, canvas, sensitivity, colorTheme, customColor, customGradientColors);
                    break;
                case 'particles':
                    particlesArray = BasicVisualizers.drawParticles(ctx, frequencyData, canvas, sensitivity, colorTheme, customColor, customGradientColors, particlesArray);
                    break;
                case 'spectrum':
                    AdvancedVisualizers.drawSpectrum(ctx, frequencyData, canvas, sensitivity, colorTheme, customColor);
                    break;
                case 'fractal':
                    AdvancedVisualizers.drawFractal(ctx, frequencyData, canvas, sensitivity, colorTheme, customColor);
                    break;
                case 'spiral':
                    AdvancedVisualizers.drawSpiral(ctx, frequencyData, canvas, sensitivity, colorTheme, customColor);
                    break;
                case 'cubes':
                    AdvancedVisualizers.drawCubes(ctx, frequencyData, canvas, sensitivity, colorTheme, customColor);
                    break;
                case 'galaxy':
                    AdvancedVisualizers.drawGalaxy(ctx, frequencyData, canvas, sensitivity, colorTheme, customColor);
                    break;
                case 'neonwaves':
                    AdvancedVisualizers.drawNeonWaves(ctx, frequencyData, canvas, sensitivity, colorTheme, customColor, customGradientColors);
                    break;
                case 'starfield':
                    AdvancedVisualizers.drawStarfield(ctx, frequencyData, canvas, sensitivity, colorTheme, customColor, customGradientColors);
                    break;
                case 'kaleidoscope':
                    AdvancedVisualizers.drawKaleidoscope(ctx, frequencyData, canvas, sensitivity, colorTheme, customColor, customGradientColors);
                    break;
                case 'dnahelix':
                    AdvancedVisualizers.drawDNAHelix(ctx, frequencyData, canvas, sensitivity, colorTheme, customColor, customGradientColors);
                    break;
                case 'matrixrain':
                    AdvancedVisualizers.drawMatrixRain(ctx, frequencyData, canvas, sensitivity, colorTheme, customColor, customGradientColors);
                    break;
                case 'mandala':
                    AdvancedVisualizers.drawMandala(ctx, frequencyData, canvas, sensitivity, colorTheme, customColor, customGradientColors);
                    break;
                case 'neuralnetwork':
                    AdvancedVisualizers.drawNeuralNetwork(ctx, frequencyData, canvas, sensitivity, colorTheme, customColor, customGradientColors);
                    break;
                case 'crystalline':
                    AdvancedVisualizers.drawCrystalline(ctx, frequencyData, canvas, sensitivity, colorTheme, customColor, customGradientColors);
                    break;
                case 'plasma':
                    AdvancedVisualizers.drawPlasma(ctx, frequencyData, canvas, sensitivity, colorTheme, customColor, customGradientColors);
                    break;
                case 'hologram':
                    AdvancedVisualizers.drawHologram(ctx, frequencyData, canvas, sensitivity, colorTheme, customColor, customGradientColors);
                    break;
                case 'fireworks':
                    particlesArray = AdvancedVisualizers.drawFireworks(ctx, frequencyData, canvas, sensitivity, colorTheme, customColor, customGradientColors, particlesArray);
                    break;
                case 'cyberspace':
                    AdvancedVisualizers.drawCyberspace(ctx, frequencyData, canvas, sensitivity, colorTheme, customColor, customGradientColors);
                    break;
                case 'wormhole':
                    AdvancedVisualizers.drawWormhole(ctx, frequencyData, canvas, sensitivity, colorTheme, customColor, customGradientColors);
                    break;
                case 'oscilloscope':
                    WaveformVisualizers.drawOscilloscope(ctx, timeData, canvas, sensitivity, colorTheme, customColor);
                    break;
                case 'waveform':
                    WaveformVisualizers.drawWaveform(ctx, timeData, frequencyData, canvas, sensitivity, colorTheme, customColor);
                    break;
                case 'terrain':
                    WaveformVisualizers.drawTerrain(ctx, frequencyData, canvas, sensitivity, colorTheme, customColor);
                    break;
                case 'fountain':
                    particlesArray = WaveformVisualizers.drawFountain(ctx, frequencyData, canvas, sensitivity, colorTheme, customColor, particlesArray);
                    break;
                case 'rings':
                    WaveformVisualizers.drawRings(ctx, frequencyData, canvas, sensitivity, colorTheme, customColor);
                    break;
                case 'aurora':
                    WaveformVisualizers.drawAurora(ctx, frequencyData, canvas, sensitivity, colorTheme, customColor, customGradientColors);
                    break;
                case 'liquidscape':
                    WaveformVisualizers.drawLiquidscape(ctx, frequencyData, canvas, sensitivity, colorTheme, customColor, customGradientColors);
                    break;
                case 'vortex':
                    WaveformVisualizers.drawVortex(ctx, frequencyData, canvas, sensitivity, colorTheme, customColor, customGradientColors);
                    break;
                default:
                    BasicVisualizers.drawBars(ctx, frequencyData, canvas, sensitivity, colorTheme, customColor, customGradientColors);
                    break;
            }
            
            // Continue animation loop
            animationFrameId = requestAnimationFrame(updateVisualization);
        } else {
            // If not playing and not using microphone, stop the visualization
            animationFrameId = null;
            
            // Show message only if no audio has been loaded and not using microphone
            if (!hasAudioLoaded && !isMicrophone) {
                visualizerMessage.style.opacity = '1';
            }
        }
    }
    
    // Make sure we stop recording when leaving the page or navigating away
    window.addEventListener('beforeunload', () => {
        if (isRecordingExport) {
            try { exportMediaRecorder && exportMediaRecorder.stop(); } catch (e) {}
        }
    });
}