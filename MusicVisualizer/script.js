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
            
            // Update visualizer style
            const styleButtons = document.querySelectorAll('.vis-style-btn');
            styleButtons.forEach(styleBtn => {
                styleBtn.classList.remove('active');
                if (styleBtn.dataset.style === style) {
                    styleBtn.classList.add('active');
                }
            });
            
            // Update color theme
            const colorOptions = document.querySelectorAll('.color-option');
            colorOptions.forEach(colorOption => {
                colorOption.classList.remove('active');
                if (colorOption.dataset.color === color) {
                    colorOption.classList.add('active');
                }
            });
            
            // Update active styles in visualizer
            visualizationStyle = style;
            colorTheme = color;
        });
    });
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
    
    // Recording related variables
    let mediaRecorder;
    let recordedChunks = [];
    let isRecording = false;
    
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
            const url = URL.createObjectURL(file);
            fileName.textContent = file.name;
            loadAudioFile(url);
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
            loadAudioFile(url);
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
            if (!audioContext) {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
                setupAudioNodes();
            }
            
            microphoneStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            audioSource = audioContext.createMediaStreamSource(microphoneStream);
            audioSource.connect(analyser);
            
            // Update UI
            micToggle.classList.add('active');
            micToggle.querySelector('.mic-text').textContent = 'Stop Microphone';
            visualizerMessage.style.opacity = '0';
            
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
    function loadAudioFile(url) {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            setupAudioNodes();
        }
        
        // Create or reset audio element
        if (!audioElement) {
            audioElement = new Audio();
            
            // Connect audio element to audio context
            audioElement.addEventListener('canplay', () => {
                if (audioSource) audioSource.disconnect();
                audioSource = audioContext.createMediaElementSource(audioElement);
                audioSource.connect(gainNode);
                gainNode.connect(analyser);
                gainNode.connect(audioContext.destination);
                
                // Enable audio controls
                playPauseBtn.disabled = false;
                muteToggleBtn.disabled = false;
                volumeSlider.disabled = false;
                
                // Start playing
                audioElement.play();
                isPlaying = true;
                playPauseBtn.innerHTML = `
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="6" y="4" width="4" height="16" fill="var(--accent-color)"/>
                        <rect x="14" y="4" width="4" height="16" fill="var(--accent-color)"/>
                    </svg>
                `;
                
                // Start visualization
                if (animationFrameId) {
                    cancelAnimationFrame(animationFrameId);
                }
                updateVisualization();
            });
            
            // Add control event listeners
            playPauseBtn.addEventListener('click', togglePlayPause);
            muteToggleBtn.addEventListener('click', toggleMute);
            volumeSlider.addEventListener('input', updateVolume);
            
            // Handle audio end
            audioElement.addEventListener('ended', () => {
                isPlaying = false;
                playPauseBtn.innerHTML = `
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 5V19L19 12L8 5Z" fill="var(--accent-color)"/>
                    </svg>
                `;
            });
        }
        
        // Load the new audio file
        audioElement.src = url;
        audioElement.volume = volumeSlider.value;
    }
    
    function togglePlayPause() {
        if (!audioElement) return;
        
        if (isPlaying) {
            audioElement.pause();
            playPauseBtn.innerHTML = `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 5V19L19 12L8 5Z" fill="var(--accent-color)"/>
                </svg>
            `;
        } else {
            audioElement.play();
            playPauseBtn.innerHTML = `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="6" y="4" width="4" height="16" fill="var(--accent-color)"/>
                    <rect x="14" y="4" width="4" height="16" fill="var(--accent-color)"/>
                </svg>
            `;
            
            if (visualizerMessage.style.opacity !== '0') {
                visualizerMessage.style.opacity = '0';
            }
            
            // Restart visualization if needed
            if (!animationFrameId) {
                updateVisualization();
            }
        }
        
        isPlaying = !isPlaying;
    }
    
    function toggleMute() {
        if (!audioElement) return;
        
        audioElement.muted = !audioElement.muted;
        
        muteToggleBtn.innerHTML = audioElement.muted ? `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.5 12C16.5 10.23 15.48 8.71 14 7.97V10.18L16.45 12.63C16.48 12.43 16.5 12.22 16.5 12Z" fill="var(--accent-color)"/>
                <path d="M19 12C19 12.94 18.8 13.82 18.46 14.64L19.97 16.15C20.63 14.91 21 13.5 21 12C21 7.72 18.01 4.14 14 3.23V5.29C16.89 6.15 19 8.83 19 12Z" fill="var(--accent-color)"/>
                <path d="M4.27 3L3 4.27L7.73 9H3V15H7L12 20V13.27L16.25 17.52C15.58 18.04 14.83 18.45 14 18.7V20.77C15.38 20.45 16.63 19.81 17.69 18.95L19.73 21L21 19.73L12 10.73L4.27 3ZM12 4L9.91 6.09L12 8.18V4Z" fill="var(--accent-color)"/>
            </svg>
        ` : `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 9V15H7L12 20V4L7 9H3Z" fill="var(--accent-color)"/>
                <path d="M16.5 12C16.5 10.23 15.48 8.71 14 7.97V16.02C15.48 15.29 16.5 13.77 16.5 12Z" fill="var(--accent-color)"/>
                <path d="M14 3.23V5.29C16.89 6.15 19 8.83 19 12C19 15.17 16.89 17.85 14 18.71V20.77C18.01 19.86 21 16.28 21 12C21 7.72 18.01 4.14 14 3.23Z" fill="var(--accent-color)"/>
            </svg>
        `;
    }
    
    function updateVolume() {
        if (!audioElement) return;
        audioElement.volume = volumeSlider.value;
    }
    
    // Setup audio processing nodes
    function setupAudioNodes() {
        const nodes = VisualizerCore.setupAudioNodes(audioContext);
        analyser = nodes.analyser;
        gainNode = nodes.gainNode;
        
        // Configure analyser
        analyser.fftSize = 2048;
        analyser.smoothingTimeConstant = smoothingTimeConstant;
        
        frequencyData = new Uint8Array(analyser.frequencyBinCount);
        timeData = new Uint8Array(analyser.fftSize);
    }
    
    // Update analyser settings
    smoothingSlider.addEventListener('input', (e) => {
        smoothingTimeConstant = parseFloat(e.target.value);
        if (analyser) {
            analyser.smoothingTimeConstant = smoothingTimeConstant;
        }
    });
    
    sensitivitySlider.addEventListener('input', (e) => {
        sensitivity = parseFloat(e.target.value);
    });
    
    // Update visualization style
    styleButtons.forEach(button => {
        button.addEventListener('click', () => {
            styleButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            visualizationStyle = button.dataset.style;
        });
    });
    
    // Update color theme
    colorOptions.forEach(option => {
        option.addEventListener('click', () => {
            if (option.dataset.color === 'custom') {
                // Don't update active state for custom color button
                // as it contains an input field
                colorTheme = 'custom';
                customColor = customColorInput.value;
            } else {
                colorOptions.forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
                colorTheme = option.dataset.color;
            }
        });
    });
    
    customColorInput.addEventListener('input', (e) => {
        customColor = e.target.value;
        colorTheme = 'custom';
        
        // Set custom color as active
        colorOptions.forEach(opt => opt.classList.remove('active'));
        document.querySelector('[data-color="custom"]').classList.add('active');
    });
    
    // Recording functionality
    recordToggleBtn.addEventListener('click', toggleRecording);
    downloadVideoBtn.addEventListener('click', downloadVideo);
    
    function toggleRecording() {
        if (!isRecording) {
            startRecording();
        } else {
            stopRecording();
        }
    }
    
    function startRecording() {
        recordedChunks = [];
        const stream = canvas.captureStream(30); // 30 FPS
        
        // If audio is playing, add the audio track to the recording
        if (audioElement && isPlaying && !isMicrophone) {
            const audioTracks = audioContext.createMediaElementSource(audioElement).mediaStream.getAudioTracks();
            audioTracks.forEach(track => stream.addTrack(track));
        } else if (microphoneStream && isMicrophone) {
            // If using microphone, add the microphone audio
            microphoneStream.getAudioTracks().forEach(track => stream.addTrack(track));
        }
        
        // Set up media recorder with appropriate options
        const options = { mimeType: 'video/webm; codecs=vp9' };
        
        try {
            mediaRecorder = new MediaRecorder(stream, options);
        } catch (e) {
            // If VP9 is not supported, try other formats
            try {
                mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
            } catch (e2) {
                try {
                    mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/mp4' });
                } catch (e3) {
                    console.error('Recording not supported in this browser');
                    alert('Recording is not supported in your browser');
                    return;
                }
            }
        }
        
        // Set up event handlers
        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                recordedChunks.push(event.data);
            }
        };
        
        mediaRecorder.onstop = () => {
            // Enable download button when recording is complete
            downloadVideoBtn.disabled = false;
        };
        
        // Start recording
        mediaRecorder.start(100); // Collect data every 100ms
        isRecording = true;
        
        // Update UI
        recordToggleBtn.classList.add('recording');
        recordToggleBtn.querySelector('span').textContent = 'Stop Recording';
        recordToggleBtn.querySelector('svg').innerHTML = `
            <rect x="8" y="8" width="8" height="8" fill="var(--accent-color)"/>
        `;
    }
    
    function stopRecording() {
        if (mediaRecorder && isRecording) {
            mediaRecorder.stop();
            isRecording = false;
            
            // Update UI
            recordToggleBtn.classList.remove('recording');
            recordToggleBtn.querySelector('span').textContent = 'Start Recording';
            recordToggleBtn.querySelector('svg').innerHTML = `
                <circle cx="12" cy="12" r="8" fill="var(--accent-color)"/>
            `;
        }
    }
    
    function downloadVideo() {
        if (recordedChunks.length === 0) {
            console.error('No recorded data available');
            return;
        }
        
        // Create a blob from the recorded chunks
        const blob = new Blob(recordedChunks, { type: 'video/webm' });
        
        // Convert to MP4 using FFmpeg or a similar tool would be ideal,
        // but for browser compatibility we'll use webm and rename to mp4
        // A server-side conversion would be better for true MP4 format
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'music-visualization.mp4';
        document.body.appendChild(a);
        a.click();
        
        // Clean up
        setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            downloadVideoBtn.disabled = true;
            recordedChunks = [];
        }, 100);
    }
    
    // Main visualization loop
    function updateVisualization() {
        if (!analyser) {
            animationFrameId = requestAnimationFrame(updateVisualization);
            return;
        }
        
        // Get audio data
        analyser.getByteFrequencyData(frequencyData);
        analyser.getByteTimeDomainData(timeData);
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Check if there's any audio data (non-zero values)
        const hasAudioData = Array.from(frequencyData).some(value => value > 0);
        
        // If no audio data is detected and not using microphone,
        // we might be at the end of the audio or between tracks
        if (!hasAudioData && !isMicrophone) {
            // Only request next frame if we're playing audio
            if (isPlaying || isMicrophone) {
                animationFrameId = requestAnimationFrame(updateVisualization);
            } else {
                animationFrameId = null;
            }
            return;
        }
        
        // Draw visualization based on selected style
        switch (visualizationStyle) {
            // Basic visualizers
            case 'bars':
                BasicVisualizers.drawBars(ctx, frequencyData, canvas, sensitivity, colorTheme, customColor);
                break;
            case 'circular':
                BasicVisualizers.drawCircular(ctx, frequencyData, canvas, sensitivity, colorTheme, customColor);
                break;
            case 'wave':
                BasicVisualizers.drawWave(ctx, frequencyData, canvas, sensitivity, colorTheme, customColor);
                break;
            case 'particles':
                particlesArray = BasicVisualizers.drawParticles(ctx, frequencyData, canvas, sensitivity, colorTheme, customColor, particlesArray);
                break;
                
            // Advanced visualizers
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
                
            // Waveform visualizers
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
                
            default:
                BasicVisualizers.drawBars(ctx, frequencyData, canvas, sensitivity, colorTheme, customColor);
        }
        
        // Continue animation loop
        animationFrameId = requestAnimationFrame(updateVisualization);
    }
}