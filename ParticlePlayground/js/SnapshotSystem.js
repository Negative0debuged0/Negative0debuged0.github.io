export class SnapshotSystem {
  constructor(particleSystem) {
    this.particleSystem = particleSystem;
    this.canvas = particleSystem.canvas;
    this.isSnapshotMode = false;
    this.snapshotOverlay = null;
    
    this.setupSnapshotSystem();
    this.setupKeyboardShortcut();
  }
  
  setupSnapshotSystem() {
    // Create snapshot overlay element
    this.snapshotOverlay = document.createElement('div');
    this.snapshotOverlay.className = 'snapshot-overlay';
    this.snapshotOverlay.innerHTML = `
      <div class="snapshot-controls">
        <button id="take-snapshot-btn">Take Snapshot</button>
        <button id="exit-snapshot-btn">Exit</button>
      </div>
    `;
    document.body.appendChild(this.snapshotOverlay);
    
    // Set up event listeners
    document.getElementById('take-snapshot-btn').addEventListener('click', () => {
      this.takeSnapshot();
    });
    
    document.getElementById('exit-snapshot-btn').addEventListener('click', () => {
      this.toggleSnapshotMode();
    });
  }
  
  setupKeyboardShortcut() {
    window.addEventListener('keydown', (e) => {
      if (e.key.toLowerCase() === 's' && !e.ctrlKey) {
        this.toggleSnapshotMode();
        e.preventDefault();
      }
    });
  }
  
  toggleSnapshotMode() {
    this.isSnapshotMode = !this.isSnapshotMode;
    
    if (this.isSnapshotMode) {
      // Pause simulation for ALL elements
      this.wasPaused = this.particleSystem.pausePhysics;
      this.particleSystem.pausePhysics = true;
      
      // Show overlay
      this.snapshotOverlay.style.display = 'flex';
      setTimeout(() => {
        this.snapshotOverlay.classList.add('active');
      }, 10);
      
      // Enhance snapshot controls with more options
      this.enhanceSnapshotControls();
      
      window.showNotification("Snapshot mode activated. Simulation paused.", "info");
    } else {
      // Resume simulation if it wasn't paused before
      if (!this.wasPaused) {
        this.particleSystem.pausePhysics = false;
      }
      
      // Hide overlay
      this.snapshotOverlay.classList.remove('active');
      setTimeout(() => {
        this.snapshotOverlay.style.display = 'none';
      }, 300);
      
      window.showNotification("Snapshot mode deactivated", "info");
    }
  }
  
  enhanceSnapshotControls() {
    // Check if we've already enhanced controls
    if (this.snapshotOverlay.querySelector('#snapshot-quality')) {
      return;
    }
    
    // Add new options to snapshot controls
    const snapshotControls = this.snapshotOverlay.querySelector('.snapshot-controls');
    
    const qualityControl = document.createElement('div');
    qualityControl.className = 'snapshot-option';
    qualityControl.innerHTML = `
      <label>
        Quality:
        <select id="snapshot-quality">
          <option value="1">Standard</option>
          <option value="2" selected>High</option>
          <option value="4">Ultra</option>
        </select>
      </label>
    `;
    
    const formatControl = document.createElement('div');
    formatControl.className = 'snapshot-option';
    formatControl.innerHTML = `
      <label>
        Format:
        <select id="snapshot-format">
          <option value="png" selected>PNG</option>
          <option value="jpeg">JPEG</option>
        </select>
      </label>
    `;
    
    // Insert before the exit button
    const exitButton = document.getElementById('exit-snapshot-btn');
    snapshotControls.insertBefore(qualityControl, exitButton);
    snapshotControls.insertBefore(formatControl, exitButton);
    
    // Add keyboard shortcut for taking snapshot
    const shortcutHint = document.createElement('div');
    shortcutHint.className = 'snapshot-shortcut-hint';
    shortcutHint.textContent = 'Press Enter to capture';
    snapshotControls.appendChild(shortcutHint);
    
    // Add the keyboard handler
    this.keyHandler = (e) => {
      if (this.isSnapshotMode && e.key === 'Enter') {
        this.takeSnapshot();
      }
    };
    
    window.addEventListener('keydown', this.keyHandler);
  }

  takeSnapshot() {
    try {
      // Get quality and format settings
      const quality = parseInt(document.getElementById('snapshot-quality')?.value || 2);
      const format = document.getElementById('snapshot-format')?.value || 'png';
      
      // Create a clone of the canvas for snapshot
      const snapshotCanvas = document.createElement('canvas');
      snapshotCanvas.width = this.canvas.width * quality;
      snapshotCanvas.height = this.canvas.height * quality;
      const ctx = snapshotCanvas.getContext('2d');
      
      // Scale for higher quality
      ctx.scale(quality, quality);
      
      // First fill with background
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, snapshotCanvas.width, snapshotCanvas.height);
      
      // Draw the current canvas content
      ctx.drawImage(this.canvas, 0, 0);
      
      // Convert to data URL
      const imageData = snapshotCanvas.toDataURL(`image/${format}`, format === 'jpeg' ? 0.95 : 1.0);
      
      // Create a download link
      const link = document.createElement('a');
      link.href = imageData;
      link.download = `particle-sim-${new Date().toISOString().slice(0,19).replace(/:/g,'-')}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Add progress indicator and success animation
      const progressIndicator = document.createElement('div');
      progressIndicator.className = 'snapshot-progress';
      progressIndicator.innerHTML = '<div class="snapshot-success">✓</div>';
      document.body.appendChild(progressIndicator);
      
      setTimeout(() => {
        progressIndicator.classList.add('complete');
        setTimeout(() => {
          progressIndicator.remove();
        }, 1500);
      }, 10);
      
      window.showNotification(`Snapshot saved as ${format.toUpperCase()}!`, "info");
    } catch (error) {
      console.error("Error taking snapshot:", error);
      window.showNotification("Failed to take snapshot", "error");
    }
  }
}