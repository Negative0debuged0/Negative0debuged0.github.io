import { DrawingSystem } from './DrawingSystem.js';

export class DrawManager {
  constructor(particleSystem) {
    this.particleSystem = particleSystem;
    this.drawingSystem = new DrawingSystem(particleSystem.canvas, particleSystem);
    this.setupDrawControls();
  }
  
  setupDrawControls() {
    const drawSection = document.createElement('div');
    drawSection.className = 'settings-group';
    drawSection.innerHTML = `
      <div class="settings-group-title">Drawing Tools</div>
      <div class="checkbox-wrapper tooltip">
        <input type="checkbox" id="draw-mode-toggle">
        <label for="draw-mode-toggle">Enable Draw Mode</label>
        <span class="parameter-value" id="draw-mode-value">Off</span>
        <span class="tooltip-text">Draw to spawn particles</span>
      </div>
      <button id="clear-drawing-btn" disabled>Clear Drawing</button>
      <div id="draw-instructions" style="display:none;">
        <p style="font-size: 0.8em; color: #aaa; margin-top: 10px;">
          Click and drag to draw. Particles will spawn along your drawing.
        </p>
      </div>
    `;
    
    const controlsContent = document.querySelector('.controls-content');
    controlsContent.appendChild(drawSection);
    
    const drawModeToggle = document.getElementById('draw-mode-toggle');
    const drawModeValue = document.getElementById('draw-mode-value');
    const clearDrawingBtn = document.getElementById('clear-drawing-btn');
    const drawInstructions = document.getElementById('draw-instructions');
    
    drawModeToggle.addEventListener('change', () => {
      const isActive = this.drawingSystem.toggle();
      drawModeValue.textContent = isActive ? 'On' : 'Off';
      clearDrawingBtn.disabled = !isActive;
      drawInstructions.style.display = isActive ? 'block' : 'none';
    });
    
    clearDrawingBtn.addEventListener('click', () => {
      this.drawingSystem.clear();
    });
  }
  
  update() {
    this.drawingSystem.draw();
  }
}