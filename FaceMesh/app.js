import { DrawingManager } from './drawing.js';

class FaceMeshCamera {
    constructor() {
        // Check if we're in OBS mode
        const urlParams = new URLSearchParams(window.location.search);
        this.isOBSMode = urlParams.get('obs') === 'true';
        
        // Performance optimization variables
        this.targetFPS = 30;
        this.frameInterval = 1000 / this.targetFPS;
        this.lastFrameTime = 0;
        this.skipFrames = 0;
        this.maxSkipFrames = 2;
        
        if (this.isOBSMode) {
            this.initOBSMode();
        } else {
            this.initNormalMode();
        }
    }
    
    initOBSMode() {
        const urlParams = new URLSearchParams(window.location.search);
        // Hide main container and show OBS container
        document.getElementById('mainContainer').style.display = 'none';
        const obsContainer = document.getElementById('obsContainer');
        obsContainer.style.display = 'block';
        
        this.video = document.getElementById('obsVideo');
        this.canvas = document.getElementById('obsCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.drawingManager = new DrawingManager(this.ctx);
        
        this.showMesh = true;
        this.showVideo = urlParams.get('showvideo') === 'true'; 
        this.meshStyle = urlParams.get('style') || 'wireframe';
        this.backgroundColor = `#${urlParams.get('bgcolor') || '000000'}`;
        this.faceColor = `#${urlParams.get('facecolor') || '00ff00'}`;
        this.leftHandColor = `#${urlParams.get('lefthandcolor') || 'ff6b6b'}`;
        this.rightHandColor = `#${urlParams.get('righthandcolor') || '4ecdc4'}`;

        obsContainer.style.background = this.backgroundColor;
        if(this.backgroundColor === '#000000') {
             obsContainer.style.background = 'transparent';
             document.body.style.background = 'transparent';
        }
        
        this.faceCount = 0;
        this.handCount = 0;
        this.lastTime = performance.now();
        this.frameCount = 0;
        this.fps = 0;
        
        this.loadFaceMesh().then(() => {
            this.startCamera();
        });
    }
    
    initNormalMode() {
        this.video = document.getElementById('video');
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.drawingManager = new DrawingManager(this.ctx);
        
        this.toggleCameraBtn = document.getElementById('toggleCamera');
        this.toggleMeshBtn = document.getElementById('toggleMesh');
        this.toggleVideoBtn = document.getElementById('toggleVideo');
        this.meshStyleSelect = document.getElementById('meshStyle');
        this.bgColorPicker = document.getElementById('bgColor');
        this.faceColorPicker = document.getElementById('faceColor');
        this.leftHandColorPicker = document.getElementById('leftHandColor');
        this.rightHandColorPicker = document.getElementById('rightHandColor');
        this.faceCountSpan = document.getElementById('faceCount');
        this.fpsSpan = document.getElementById('fps');
        
        this.faceMesh = null;
        this.hands = null;
        this.camera = null;
        this.isRunning = false;
        this.showMesh = true;
        this.showVideo = true;
        this.meshStyle = 'wireframe';
        this.backgroundColor = '#000000';
        this.faceColor = '#00ff00';
        this.leftHandColor = '#ff6b6b';
        this.rightHandColor = '#4ecdc4';
        
        this.faceCount = 0;
        this.handCount = 0;
        this.lastTime = performance.now();
        this.frameCount = 0;
        this.fps = 0;
        
        this.initEventListeners();
        this.loadFaceMesh();
    }
    
    initEventListeners() {
        this.toggleCameraBtn.addEventListener('click', () => this.toggleCamera());
        this.toggleMeshBtn.addEventListener('click', () => this.toggleMesh());
        this.toggleVideoBtn.addEventListener('click', () => this.toggleVideo());
        this.meshStyleSelect.addEventListener('change', (e) => {
            this.meshStyle = e.target.value;
        });
        this.bgColorPicker.addEventListener('input', (e) => {
            this.backgroundColor = e.target.value;
            if (!this.showVideo) {
                this.canvas.style.background = this.backgroundColor;
            }
        });
        this.faceColorPicker.addEventListener('input', (e) => this.faceColor = e.target.value);
        this.leftHandColorPicker.addEventListener('input', (e) => this.leftHandColor = e.target.value);
        this.rightHandColorPicker.addEventListener('input', (e) => this.rightHandColor = e.target.value);
    }
    
    async loadFaceMesh() {
        try {
            // Load MediaPipe scripts
            await this.loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils@0.3.1640029074/camera_utils.js');
            await this.loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils@0.3.1620248257/drawing_utils.js');
            await this.loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4.1633559619/face_mesh.js');
            await this.loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1646424915/hands.js');
            
            if (window.FACEMESH_TESSELLATION) {
                this.drawingManager.setFaceTessellation(window.FACEMESH_TESSELLATION);
            }
            
            this.faceMesh = new FaceMesh({
                locateFile: (file) => {
                    return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4.1633559619/${file}`;
                }
            });
            
            this.faceMesh.setOptions({
                maxNumFaces: 4,
                refineLandmarks: true,
                minDetectionConfidence: 0.3,
                minTrackingConfidence: 0.3
            });
            
            this.hands = new Hands({
                locateFile: (file) => {
                    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1646424915/${file}`;
                }
            });
            
            this.hands.setOptions({
                maxNumHands: 2,
                modelComplexity: 1,
                minDetectionConfidence: 0.3,
                minTrackingConfidence: 0.3
            });
            
            this.faceMesh.onResults((results) => this.onFaceResults(results));
            this.hands.onResults((results) => this.onHandResults(results));
            
            this.toggleCameraBtn.disabled = false;
            this.toggleCameraBtn.textContent = 'Start Camera';
            
        } catch (error) {
            console.error('Error loading FaceMesh:', error);
            this.showError('Failed to load face detection. Please refresh the page.');
        }
    }
    
    loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }
    
    async toggleCamera() {
        if (!this.isRunning) {
            await this.startCamera();
        } else {
            this.stopCamera();
        }
    }
    
    async startCamera() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    facingMode: 'user'
                }
            });
            
            this.video.srcObject = stream;
            
            this.video.onloadedmetadata = () => {
                this.canvas.width = this.video.videoWidth;
                this.canvas.height = this.video.videoHeight;
                
                this.camera = new Camera(this.video, {
                    onFrame: async () => {
                        await this.faceMesh.send({ image: this.video });
                        await this.hands.send({ image: this.video });
                    },
                    width: this.video.videoWidth,
                    height: this.video.videoHeight
                });
                
                this.camera.start();
                this.isRunning = true;
                this.toggleCameraBtn.textContent = 'Stop Camera';
                this.toggleMeshBtn.disabled = false;
                this.toggleVideoBtn.disabled = false;
                this.meshStyleSelect.disabled = false;
                this.bgColorPicker.disabled = false;
                this.faceColorPicker.disabled = false;
                this.leftHandColorPicker.disabled = false;
                this.rightHandColorPicker.disabled = false;
            };
            
        } catch (error) {
            console.error('Error starting camera:', error);
            this.showError('Failed to access camera. Please check permissions.');
        }
    }
    
    stopCamera() {
        if (this.camera) {
            this.camera.stop();
        }
        
        if (this.video.srcObject) {
            this.video.srcObject.getTracks().forEach(track => track.stop());
            this.video.srcObject = null;
        }
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.isRunning = false;
        this.toggleCameraBtn.textContent = 'Start Camera';
        this.toggleMeshBtn.disabled = true;
        this.toggleVideoBtn.disabled = true;
        this.meshStyleSelect.disabled = true;
        this.bgColorPicker.disabled = true;
        this.faceColorPicker.disabled = true;
        this.leftHandColorPicker.disabled = true;
        this.rightHandColorPicker.disabled = true;
        this.faceCountSpan.textContent = 'No faces detected';
        this.fpsSpan.textContent = 'FPS: 0';
    }
    
    toggleVideo() {
        this.showVideo = !this.showVideo;
        this.video.classList.toggle('hidden', !this.showVideo);
        this.toggleVideoBtn.textContent = this.showVideo ? 'Hide Video' : 'Show Video';
        
        // Update canvas background when video is hidden
        if (!this.showVideo) {
            this.canvas.style.background = this.backgroundColor;
        } else {
            this.canvas.style.background = 'transparent';
        }
    }
    
    toggleMesh() {
        this.showMesh = !this.showMesh;
        this.toggleMeshBtn.textContent = this.showMesh ? 'Hide Mesh' : 'Show Mesh';
    }
    
    onFaceResults(results) {
        this.faceResults = results;
        this.throttledUpdateDisplay();
    }
    
    onHandResults(results) {
        this.handResults = results;
        this.throttledUpdateDisplay();
    }
    
    throttledUpdateDisplay() {
        const now = performance.now();
        if (now - this.lastFrameTime < this.frameInterval) {
            this.skipFrames++;
            if (this.skipFrames < this.maxSkipFrames) {
                return;
            }
        }
        
        this.skipFrames = 0;
        this.lastFrameTime = now;
        this.updateDisplay();
    }
    
    updateDisplay() {
        this.updateFPS();
        
        // Clear with optimized method
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        let totalDetections = 0;
        
        // Draw face mesh
        if (this.faceResults && this.faceResults.multiFaceLandmarks && this.showMesh) {
            this.faceCount = this.faceResults.multiFaceLandmarks.length;
            totalDetections += this.faceCount;
            
            for (const landmarks of this.faceResults.multiFaceLandmarks) {
                this.drawingManager.drawMesh(landmarks, this.canvas.width, this.canvas.height, this.meshStyle, this.faceColor);
            }
        } else {
            this.faceCount = 0;
        }
        
        // Draw hands
        if (this.handResults && this.handResults.multiHandLandmarks && this.showMesh) {
            this.handCount = this.handResults.multiHandLandmarks.length;
            totalDetections += this.handCount;
            
            for (let i = 0; i < this.handResults.multiHandLandmarks.length; i++) {
                const landmarks = this.handResults.multiHandLandmarks[i];
                const handedness = this.handResults.multiHandedness[i];
                this.drawingManager.drawHand(landmarks, handedness, this.canvas.width, this.canvas.height, this.meshStyle, this.leftHandColor, this.rightHandColor);
            }
        } else {
            this.handCount = 0;
        }
        
        // Update display text (only in normal mode)
        if (!this.isOBSMode) {
            let displayText = '';
            if (this.faceCount > 0 || this.handCount > 0) {
                const parts = [];
                if (this.faceCount > 0) parts.push(`${this.faceCount} face${this.faceCount !== 1 ? 's' : ''}`);
                if (this.handCount > 0) parts.push(`${this.handCount} hand${this.handCount !== 1 ? 's' : ''}`);
                displayText = parts.join(', ') + ' detected';
            } else {
                displayText = 'No faces or hands detected';
            }
            this.faceCountSpan.textContent = displayText;
        }
    }
    
    updateFPS() {
        this.frameCount++;
        const now = performance.now();
        const delta = now - this.lastTime;
        
        if (delta >= 1000) {
            this.fps = Math.round((this.frameCount * 1000) / delta);
            if (!this.isOBSMode && this.fpsSpan) {
                this.fpsSpan.textContent = `FPS: ${this.fps}`;
            }
            this.frameCount = 0;
            this.lastTime = now;
        }
    }
    
    showError(message) {
        const container = document.querySelector('.container');
        const existingError = container.querySelector('.error');
        
        if (existingError) {
            existingError.remove();
        }
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error';
        errorDiv.textContent = message;
        container.insertBefore(errorDiv, container.querySelector('.camera-container'));
    }
}

new FaceMeshCamera();