import { getColorForType, setupParticlePropertiesByType } from './ParticleTypes.js';
import { blendColors, hexToRgb } from './ColorUtils.js';
import { applyInteraction } from './ParticlePhysics.js';

export class Particle {
  constructor(x, y, canvas, type = 'plasma') {
    this.x = x;
    this.y = y;
    this.canvas = canvas;
    this.type = type;
    this.isPartOfDrawing = false;
    this.particleSystem = null; 
    this.setupParticleProperties();
  }

  setupParticleProperties() {
    this.radius = Math.max(1, Math.min(Math.random() * 5, 10));
    this.color = this.getColorForType();
    this.speedX = (Math.random() - 0.5) * 4;
    this.speedY = (Math.random() - 0.5) * 4;
    this.originalColor = this.color;
    this.highlighted = false;
    this.mass = 1; 
    this.hasGravity = true;
    this.trailEnabled = false;
    this.trail = [];
    this.maxTrailLength = 20;
    this.collisionEffect = 'none';
    this.lifespan = 1000;
    this.age = 0;
    this.customColor = null;
    this.opacity = 1;
    
    setupParticlePropertiesByType(this);
  }

  getColorForType() {
    return getColorForType(this.type, this.customColor);
  }

  update(mouseX, mouseY, interactionMode, interactionStrength, interactionRadius, simulationSpeed = 1) {
    const originalX = this.x;
    const originalY = this.y;
    
    if (this.trailEnabled) {
      this.trail.push({x: this.x, y: this.y});
      if (this.trail.length > this.maxTrailLength) {
        this.trail.shift();
      }
    }
    
    this.age += simulationSpeed;
    if (this.lifespan > 0 && this.age >= this.lifespan) {
      this.isDead = true;
      return;
    }
    
    if (this.lifespan > 0) {
      this.opacity = 1 - (this.age / this.lifespan);
    }

    this.applyTypeSpecificBehavior(simulationSpeed);

    const padding = this.radius; 

    if (this.x < padding) {
      this.x = padding;
      if (!this.hasGravity) {
        this.speedX = Math.abs(this.speedX); 
      }
    } else if (this.x > this.canvas.width - padding) {
      this.x = this.canvas.width - padding;
      if (!this.hasGravity) {
        this.speedX = -Math.abs(this.speedX); 
      }
    }

    if (this.y < padding) {
      this.y = padding;
      if (!this.hasGravity) {
        this.speedY = Math.abs(this.speedY); 
      }
    } else if (this.y > this.canvas.height - padding) {
      this.y = this.canvas.height - padding;
      
      if (this.hasGravity) {
        this.speedY = 0;
        
        this.speedX *= 0.9;
        
        if (this.collisionEffect === 'bounce') {
          this.speedY = -Math.abs(this.speedY) * 0.6;
        } else if (this.collisionEffect === 'explode') {
          this.triggerExplosion();
        } else if (this.collisionEffect === 'split') {
          this.triggerSplit();
        }
      } else {
        this.speedY = -Math.abs(this.speedY); 
      }
    }

    this.x += this.speedX * simulationSpeed;
    this.y += this.speedY * simulationSpeed;

    this.radius = Math.max(1, Math.min(this.radius, 10)); 
    const minSpeed = 0.1;
    const maxSpeed = 10;
    this.speedX = Math.sign(this.speedX) * Math.max(minSpeed, Math.min(Math.abs(this.speedX), maxSpeed));
    this.speedY = Math.sign(this.speedY) * Math.max(minSpeed, Math.min(Math.abs(this.speedY), maxSpeed));

    const wasInteracted = applyInteraction(this, mouseX, mouseY, interactionMode, interactionStrength, interactionRadius);
    if (!wasInteracted) {
      this.highlighted = false;
    }

    if (this.linkedParticle) {
      const maxLinkDistance = 50; 
      const dx = this.x - this.linkedParticle.x;
      const dy = this.y - this.linkedParticle.y;
      const distance = Math.hypot(dx, dy);

      if (distance > maxLinkDistance) {
        const pullFactor = 0.1; 
        const targetX = this.linkedParticle.x + (dx / distance) * maxLinkDistance;
        const targetY = this.linkedParticle.y + (dy / distance) * maxLinkLength;

        this.x += (targetX - this.x) * pullFactor;
        this.y += (targetY - this.y) * pullFactor;
      }
    }
    
    if (this.hasGravity) {
      this.speedY += 0.2 * this.mass * simulationSpeed;
    }

    this.speedX *= 0.99;
    this.speedY *= 0.99;
  }
  
  triggerExplosion() {
    if (typeof this.onExplosion === 'function') {
      this.onExplosion(this.x, this.y);
    }
  }
  
  triggerSplit() {
    if (typeof this.onSplit === 'function') {
      this.onSplit(this);
    }
  }

  blendColors(color1, color2, ratio) {
    return blendColors(color1, color2, ratio);
  }

  applyTypeSpecificBehavior(simulationSpeed) {
    switch (this.type) {
      case 'plasma':
        this.radius = 3 + Math.sin(this.age * 0.05) * this.energyFactor * 2;
        if (Math.random() < 0.05) {
          this.speedX += (Math.random() - 0.5) * 0.5;
          this.speedY += (Math.random() - 0.5) * 0.5;
        }
        break;
        
      case 'electric':
        if (this.age % 10 < 5) {
          this.speedX += 0.2 * this.charge;
        } else {
          this.speedX -= 0.2 * this.charge;
        }
        if (Math.random() < 0.02) {
          this.highlighted = true;
          setTimeout(() => { this.highlighted = false; }, 50);
        }
        break;
        
      case 'organic':
        this.speedX *= 0.99;
        this.speedY *= 0.99;
        if (this.radius < 10) {
          this.radius += 0.01 * this.flexibility;
        }
        break;
        
      case 'cosmic':
        this.speedX += Math.sin(this.age * 0.02) * 0.03 * this.gravitationalFactor;
        this.speedY += Math.cos(this.age * 0.02) * 0.03 * this.gravitationalFactor;
        if (Math.random() < 0.05 && !this.customColor) {
          this.color = `hsla(${(this.age * 0.1) % 360}, 100%, 60%, 0.7)`;
        }
        break;
        
      case 'quantum':
        if (Math.random() < 0.01 * this.quantumFactor) {
          this.x += (Math.random() - 0.5) * 50;
          this.y += (Math.random() - 0.5) * 50;
          this.highlighted = true;
          setTimeout(() => { this.highlighted = false; }, 100);
        }
        this.speedX += (Math.random() - 0.5) * 0.3;
        this.speedY += (Math.random() - 0.5) * 0.3;
        break;
        
      case 'magnetic':
        this.radius = 3 + Math.sin(this.age * 0.1) * 0.5;
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const dx = centerX - this.x;
        const dy = centerY - this.y;
        const dist = Math.hypot(dx, dy);
        if (dist > 10) {
          this.speedX += (dx / dist) * 0.01 * this.magneticStrength;
          this.speedY += (dy / dist) * 0.01 * this.magneticStrength;
        }
        break;
        
      case 'fire':
        if (this.hasGravity) {
          this.speedY -= 0.1 * this.heatLevel;
        }
        this.radius *= (0.9 + Math.random() * 0.2);
        if (!this.customColor) {
          const hue = 15 + Math.random() * 25;
          const brightness = 40 + this.heatLevel * 60;
          this.color = `hsl(${hue}, 100%, ${brightness}%)`;
        }
        this.opacity = 1 - (this.age / this.lifespan) * (1 + this.heatLevel);
        break;
        
      case 'water':
        this.speedX *= 0.98;
        this.speedY *= 0.98;
        if (this.hasGravity) {
          this.speedY += 0.05 * this.viscosity;
        }
        this.speedX += Math.sin(this.age * 0.05) * 0.03;
        break;
        
      case 'crystal':
        if (Math.random() < 0.02 * this.refractiveIndex) {
          this.highlighted = true;
          setTimeout(() => { this.highlighted = false; }, 50);
        }
        this.speedX *= 0.99;
        this.speedY *= 0.99;
        break;
    }
  }
}