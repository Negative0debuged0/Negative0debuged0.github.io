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
      <div class="settings-group-title">Drawing Tools (Beta)</div>
      <div class="checkbox-wrapper tooltip">
        <input type="checkbox" id="draw-mode-toggle">
        <label for="draw-mode-toggle">Enable Draw Mode</label>
        <span class="parameter-value" id="draw-mode-value">Off</span>
        <span class="tooltip-text">Draw shapes for particles to align to</span>
      </div>
      <button id="clear-drawing-btn" disabled>Clear Drawing</button>
      <label class="tooltip" id="drawing-strength-label" style="display:none;">
        Drawing Pull Strength: <span class="parameter-value" id="drawing-strength-value">1.2</span>
        <input type="range" id="drawing-strength" min="0.5" max="3" value="1.2" step="0.1">
      </label>
      <div id="draw-instructions" style="display:none;">
        <p style="font-size: 0.8em; color: #aaa; margin-top: 10px;">
          Click and drag to draw. Particles will align to your drawing.
        </p>
      </div>
    `;
    
    const controlsContent = document.querySelector('.controls-content');
    controlsContent.appendChild(drawSection);
    
    const drawModeToggle = document.getElementById('draw-mode-toggle');
    const drawModeValue = document.getElementById('draw-mode-value');
    const clearDrawingBtn = document.getElementById('clear-drawing-btn');
    const drawInstructions = document.getElementById('draw-instructions');
    const drawingStrengthLabel = document.getElementById('drawing-strength-label');
    const drawingStrengthSlider = document.getElementById('drawing-strength');
    
    drawModeToggle.addEventListener('change', () => {
      const isActive = this.drawingSystem.toggle();
      drawModeValue.textContent = isActive ? 'On' : 'Off';
      clearDrawingBtn.disabled = !isActive;
      drawInstructions.style.display = isActive ? 'block' : 'none';
      drawingStrengthLabel.style.display = isActive ? 'block' : 'none';
    });
    
    clearDrawingBtn.addEventListener('click', () => {
      this.drawingSystem.clear();
      
      // Reset all particles to not be part of a drawing
      this.particleSystem.particles.forEach(particle => {
        particle.isPartOfDrawing = false;
      });
    });
    
    drawingStrengthSlider.addEventListener('input', (e) => {
      const value = parseFloat(e.target.value);
      document.getElementById('drawing-strength-value').textContent = value.toFixed(1);
      
      // Update the attractor strength if it exists
      if (this.particleSystem.drawingAttractor) {
        this.particleSystem.drawingAttractor.attractionStrength = value;
      }
    });
  }
  
  update() {
    this.drawingSystem.draw();
  }
}