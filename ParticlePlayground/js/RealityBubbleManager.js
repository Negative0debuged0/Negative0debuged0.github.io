import { RealityBubble } from './RealityBubble.js';

export class RealityBubbleManager {
  constructor(particleSystem) {
    this.particleSystem = particleSystem;
    this.bubbles = [];
    this.maxBubbles = 5;
    this.isActive = true; 
    this.setupBubbleControls();
    
    // Add keyboard shortcut for bubble spawn
    window.addEventListener('keydown', (e) => {
      if (e.key.toLowerCase() === 'y') {
        this.spawnRandomBubble();
      }
    });
  }
  
  setupBubbleControls() {
    const bubbleSection = document.createElement('div');
    bubbleSection.className = 'settings-group';
    bubbleSection.innerHTML = `
      <div class="settings-group-title">Reality Bubbles</div>
      <div class="checkbox-wrapper tooltip">
        <input type="checkbox" id="bubble-mode-toggle" checked>
        <label for="bubble-mode-toggle">Enable Reality Bubbles</label>
        <span class="parameter-value" id="bubble-mode-value">On</span>
        <span class="tooltip-text">Create zones with altered physics laws</span>
      </div>
      <button id="spawn-bubble-btn">Spawn Bubble</button>
      <div class="bubble-settings" id="bubble-settings">
        <label class="tooltip">
          Max Bubbles: <span class="parameter-value" id="max-bubbles-value">5</span>
          <span class="tooltip-text">Maximum number of bubbles allowed</span>
          <input type="range" id="max-bubbles" min="1" max="10" value="5" step="1">
        </label>
        <p style="font-size: 0.8em; color: #aaa; margin-top: 10px;">
          Press Y to quickly spawn random bubbles.
        </p>
        <p style="font-size: 0.8em; color: #aaa; margin-top: 5px;">
          Active Bubbles: <span id="active-bubbles-count">0</span>
        </p>
      </div>
    `;
    
    const controlsContent = document.querySelector('.controls-content');
    if (!controlsContent) {
      console.error('Controls content element not found');
      return;
    }
    controlsContent.appendChild(bubbleSection);
    
    const bubbleModeToggle = document.getElementById('bubble-mode-toggle');
    const bubbleModeValue = document.getElementById('bubble-mode-value');
    const spawnBubbleBtn = document.getElementById('spawn-bubble-btn');
    const bubbleSettings = document.getElementById('bubble-settings');
    const maxBubblesSlider = document.getElementById('max-bubbles');
    
    bubbleModeToggle.addEventListener('change', () => {
      this.isActive = bubbleModeToggle.checked;
      bubbleModeValue.textContent = this.isActive ? 'On' : 'Off';
      spawnBubbleBtn.disabled = !this.isActive;
      bubbleSettings.style.display = this.isActive ? 'block' : 'none';
      
      if (this.isActive) {
        window.showNotification('Reality Bubbles enabled! Click anywhere or press Y to spawn a bubble.', 'info');
      } else {
        this.clearAllBubbles();
      }
    });
    
    spawnBubbleBtn.addEventListener('click', () => {
      if (this.isActive) {
        this.spawnBubbleAtMouse();
      }
    });
    
    maxBubblesSlider.addEventListener('input', () => {
      this.maxBubbles = parseInt(maxBubblesSlider.value);
      document.getElementById('max-bubbles-value').textContent = this.maxBubbles;
      
      // Remove excess bubbles if we now have too many
      while (this.bubbles.length > this.maxBubbles) {
        this.bubbles.shift(); // Remove oldest bubble
      }
    });
    
    this.particleSystem.canvas.addEventListener('click', (e) => {
      if (this.isActive && e.altKey) {
        const rect = this.particleSystem.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        this.spawnBubble(x, y, 50 + Math.random() * 100);
        window.showNotification('Reality Bubble spawned!', 'info');
      }
    });
  }
  
  spawnBubbleAtMouse() {
    const canvas = this.particleSystem.canvas;
    const mouseX = this.particleSystem.mouseX || canvas.width/2;
    const mouseY = this.particleSystem.mouseY || canvas.height/2;
    
    this.spawnBubble(mouseX, mouseY, 50 + Math.random() * 100);
  }
  
  spawnRandomBubble() {
    if (!this.isActive) return;
    
    const canvas = this.particleSystem.canvas;
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const radius = 80 + Math.random() * 120;
    
    this.spawnBubble(x, y, radius);
  }
  
  spawnBubble(x, y, radius) {
    if (this.bubbles.length >= this.maxBubbles) {
      // Remove the oldest bubble
      this.bubbles.shift();
    }
    
    const lifespan = 300 + Math.random() * 700; // 5-15 seconds at 60fps
    const bubble = new RealityBubble(x, y, radius, lifespan, this.particleSystem.canvas);
    this.bubbles.push(bubble);
    
    // Update the bubble count display
    const bubbleCountElement = document.getElementById('active-bubbles-count');
    if (bubbleCountElement) {
      bubbleCountElement.textContent = this.bubbles.length;
    }
  }
  
  clearAllBubbles() {
    this.bubbles = [];
    
    // Update the bubble count display
    const bubbleCountElement = document.getElementById('active-bubbles-count');
    if (bubbleCountElement) {
      bubbleCountElement.textContent = '0';
    }
    
    // Reset all particles that might have been in bubbles
    this.particleSystem.particles.forEach(particle => {
      if (particle.originalProperties) {
        // Restore original properties
        particle.hasGravity = particle.originalProperties.hasGravity;
        particle.mass = particle.originalProperties.mass;
        particle.color = particle.originalProperties.color;
        
        // Clear stored properties
        delete particle.originalProperties;
        particle.inRealityBubble = false;
      }
    });
  }
  
  update() {
    if (!this.isActive) return;
    
    // Remove expired bubbles
    const initialCount = this.bubbles.length;
    this.bubbles = this.bubbles.filter(bubble => bubble.active);
    
    // Update the bubble count if it changed
    if (initialCount !== this.bubbles.length) {
      const bubbleCountElement = document.getElementById('active-bubbles-count');
      if (bubbleCountElement) {
        bubbleCountElement.textContent = this.bubbles.length;
      }
    }
    
    // Update remaining bubbles
    this.bubbles.forEach(bubble => bubble.update());
    
    // Process particles for bubble effects
    this.processParticles();
  }
  
  processParticles() {
    // Reset all particles first
    this.particleSystem.particles.forEach(particle => {
      if (particle.inRealityBubble) {
        let stillInAnyBubble = false;
        
        // Check if particle is still in any bubble
        for (const bubble of this.bubbles) {
          if (bubble.contains(particle.x, particle.y)) {
            stillInAnyBubble = true;
            break;
          }
        }
        
        // If not in any bubble anymore, reset it
        if (!stillInAnyBubble) {
          for (const bubble of this.bubbles) {
            bubble.resetParticle(particle);
          }
        }
      }
    });
    
    // Apply active bubble effects
    for (const bubble of this.bubbles) {
      this.particleSystem.particles.forEach(particle => {
        bubble.affectParticle(particle);
      });
    }
  }
  
  draw(ctx) {
    if (!this.isActive) return;
    
    // Draw all bubbles
    this.bubbles.forEach(bubble => bubble.draw(ctx));
  }
}