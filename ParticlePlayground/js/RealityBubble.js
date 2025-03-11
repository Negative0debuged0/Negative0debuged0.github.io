import { getRandomColor } from './ColorUtils.js';

export class RealityBubble {
  constructor(x, y, radius, lifespan, canvas) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.maxRadius = radius;
    this.lifespan = lifespan; // in frames
    this.age = 0;
    this.canvas = canvas;
    this.color = getRandomColor();
    this.active = true;
    this.pulsePhase = 0;
    
    // Physics alteration properties
    this.gravityMultiplier = Math.random() * 4 - 2; // -2 to 2
    this.timeMultiplier = 0.1 + Math.random() * 3.9; // 0.1 to 4
    this.frictionMultiplier = Math.random() * 2; // 0 to 2
    this.particleInteraction = Math.random() > 0.5; // particles interact or not
    this.colorCycleSpeed = Math.random() * 0.1;
    this.velocityRotation = (Math.random() * 2 - 1) * 0.1; // -0.1 to 0.1
    
    // Visual properties
    this.borderWidth = 2;
    this.borderPulse = true;
    this.fillOpacity = 0.1;
    this.borderColor = this.generateBorderColor();
    
    // Behavior settings
    this.drifting = Math.random() > 0.7;
    this.driftSpeedX = (Math.random() - 0.5) * 0.5;
    this.driftSpeedY = (Math.random() - 0.5) * 0.5;
    this.pulsing = Math.random() > 0.3;
    this.pulseFrequency = 0.02 + Math.random() * 0.03;
    this.pulseAmplitude = 0.1 + Math.random() * 0.2;
  }
  
  generateBorderColor() {
    // Create a complementary color to the fill
    const hslMatch = this.color.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
    if (hslMatch) {
      const h = (parseInt(hslMatch[1]) + 180) % 360;
      return `hsl(${h}, 100%, 50%)`;
    }
    return '#ffffff';
  }
  
  update() {
    // Increase age
    this.age++;
    
    // Check if bubble should expire
    if (this.age >= this.lifespan) {
      this.active = false;
      return;
    }
    
    // Update pulse phase
    this.pulsePhase += this.pulseFrequency;
    
    // Apply pulsing effect
    if (this.pulsing) {
      const pulseRatio = 1 + Math.sin(this.pulsePhase) * this.pulseAmplitude;
      this.radius = this.maxRadius * pulseRatio;
    }
    
    // Apply drifting motion
    if (this.drifting) {
      this.x += this.driftSpeedX;
      this.y += this.driftSpeedY;
      
      // Bounce off canvas edges
      if (this.x - this.radius < 0 || this.x + this.radius > this.canvas.width) {
        this.driftSpeedX *= -1;
      }
      if (this.y - this.radius < 0 || this.y + this.radius > this.canvas.height) {
        this.driftSpeedY *= -1;
      }
    }
    
    // Update border color for cycling effect
    if (this.colorCycleSpeed > 0) {
      const hue = (this.age * this.colorCycleSpeed) % 360;
      this.color = `hsl(${hue}, 80%, 50%)`;
      this.borderColor = `hsl(${(hue + 180) % 360}, 100%, 50%)`;
    }
  }
  
  contains(x, y) {
    return Math.hypot(x - this.x, y - this.y) <= this.radius;
  }
  
  affectParticle(particle) {
    if (!this.active) return;
    
    if (!this.contains(particle.x, particle.y)) return;
    
    // Store original properties if not already stored
    if (!particle.originalProperties) {
      particle.originalProperties = {
        hasGravity: particle.hasGravity,
        mass: particle.mass,
        color: particle.color,
        speedX: particle.speedX,
        speedY: particle.speedY
      };
    }
    
    // Apply reality bubble effects
    
    // 1. Gravity modification
    particle.hasGravity = this.gravityMultiplier !== 0;
    if (particle.hasGravity) {
      particle.speedY += 0.2 * particle.mass * this.gravityMultiplier;
    }
    
    // 2. Time dilation (affects particle speed)
    particle.x += particle.speedX * (this.timeMultiplier - 1);
    particle.y += particle.speedY * (this.timeMultiplier - 1);
    
    // 3. Friction modification
    const frictionFactor = 1 - (0.01 * this.frictionMultiplier);
    particle.speedX *= frictionFactor;
    particle.speedY *= frictionFactor;
    
    // 4. Velocity rotation (changes direction gradually)
    if (this.velocityRotation !== 0) {
      const speed = Math.hypot(particle.speedX, particle.speedY);
      const angle = Math.atan2(particle.speedY, particle.speedX) + this.velocityRotation;
      particle.speedX = Math.cos(angle) * speed;
      particle.speedY = Math.sin(angle) * speed;
    }
    
    // 5. Visual effects - temporary color change
    const hue = (this.age * this.colorCycleSpeed * 5) % 360;
    particle.color = `hsl(${hue}, 100%, 50%)`;
    
    // Tag the particle as being in a reality bubble
    particle.inRealityBubble = true;
  }
  
  resetParticle(particle) {
    if (particle.originalProperties && particle.inRealityBubble) {
      // Restore original properties with smooth transition
      particle.hasGravity = particle.originalProperties.hasGravity;
      particle.mass = particle.originalProperties.mass;
      particle.color = particle.originalProperties.color;
      
      // Clear stored properties and tag
      delete particle.originalProperties;
      particle.inRealityBubble = false;
    }
  }
  
  draw(ctx) {
    if (!this.active) return;
    
    // Calculate opacity based on lifespan
    const lifeRatio = 1 - (this.age / this.lifespan);
    const opacity = this.fillOpacity * lifeRatio;
    
    // Draw bubble fill
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color.replace(')', `, ${opacity})`).replace('rgb', 'rgba').replace('hsl', 'hsla');
    ctx.fill();
    
    // Draw bubble border
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    
    // Pulsing border effect
    if (this.borderPulse) {
      const pulseOpacity = 0.5 + Math.sin(this.pulsePhase * 2) * 0.5;
      ctx.strokeStyle = this.borderColor.replace(')', `, ${pulseOpacity})`).replace('rgb', 'rgba').replace('hsl', 'hsla');
      ctx.lineWidth = this.borderWidth * (1 + Math.sin(this.pulsePhase * 3) * 0.3);
    } else {
      ctx.strokeStyle = this.borderColor.replace(')', `, 0.8)`).replace('rgb', 'rgba').replace('hsl', 'hsla');
      ctx.lineWidth = this.borderWidth;
    }
    
    ctx.stroke();
    
    // Draw bubble label/info
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';
    
    // Show bubble properties
    const gravityText = this.gravityMultiplier.toFixed(1);
    const timeText = this.timeMultiplier.toFixed(1);
    ctx.fillText(`G:${gravityText} T:${timeText}`, this.x, this.y);
  }
}