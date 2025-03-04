import { getRandomColor } from './ColorUtils.js';

export class InteractiveCircle {
  constructor(x, y, canvas, interactionMode, interactionStrength, interactionRadius, hasPhysics = true) {
    this.x = x;
    this.y = y;
    this.canvas = canvas;
    this.radius = 20;
    this.interactionMode = interactionMode;
    this.interactionStrength = interactionStrength;
    this.interactionRadius = interactionRadius;
    this.color = getRandomColor();
    this.hasPhysics = hasPhysics;
    
    // Physics properties
    this.speedX = 0;
    this.speedY = 0;
    this.mass = 1;
    this.isDragging = false;
    this.offsetX = 0;
    this.offsetY = 0;
    this.dragStartLocation = null;
  }

  startDrag(mouseX, mouseY) {
    this.isDragging = true;
    this.offsetX = mouseX - this.x;
    this.offsetY = mouseY - this.y;
    this.dragStartLocation = {x: this.x, y: this.y}
  }

  drag(mouseX, mouseY) {
    if (this.isDragging) {
      this.x = mouseX - this.offsetX;
      this.y = mouseY - this.offsetY;

      // Reset speed when dragging
      this.speedX = 0;
      this.speedY = 0;
    }
  }

  stopDrag() {
    if (this.isDragging) {
      this.isDragging = false;

      // Apply a drag momentum
      if(this.dragStartLocation) {
        const dx = this.x - this.dragStartLocation.x
        const dy = this.y - this.dragStartLocation.y
        this.speedX = dx * 0.5
        this.speedY = dy * 0.5
        this.dragStartLocation = null;
      }
    }
  }

  update(simulationSpeed = 1) {
    // Skip physics update if dragging or if physics is disabled
    if (this.isDragging || !this.hasPhysics) return;
  
    // Apply gravity
    this.speedY += 0.2 * this.mass * simulationSpeed;

    // Update position
    this.x += this.speedX * simulationSpeed;
    this.y += this.speedY * simulationSpeed;

    // Bounce off walls
    if (this.x < this.radius) {
      this.x = this.radius;
      this.speedX = Math.abs(this.speedX) * 0.8;
    } else if (this.x > this.canvas.width - this.radius) {
      this.x = this.canvas.width - this.radius;
      this.speedX = -Math.abs(this.speedX) * 0.8;
    }

    // Bounce off floor and ceiling
    if (this.y < this.radius) {
      this.y = this.radius;
      this.speedY = Math.abs(this.speedY) * 0.8;
    } else if (this.y > this.canvas.height - this.radius) {
      this.y = this.canvas.height - this.radius;
      this.speedY = -Math.abs(this.speedY) * 0.8;
      
      // Apply friction when on ground
      this.speedX *= 0.95;
    }

    // Limit speeds
    const maxSpeed = 20;
    this.speedX = Math.min(Math.max(this.speedX, -maxSpeed), maxSpeed);
    this.speedY = Math.min(Math.max(this.speedY, -maxSpeed), maxSpeed);
  }

  affect(particle) {
    const dx = particle.x - this.x;
    const dy = particle.y - this.y;
    const distance = Math.hypot(dx, dy);

    if (distance < this.interactionRadius) {
      const force = (this.interactionRadius - distance) / this.interactionRadius;
      
      switch (this.interactionMode) {
        case 'pulse':
          particle.radius = 4 + Math.sin(Date.now() * 0.01) * 2 * this.interactionStrength;
          particle.highlighted = true;
          break;
        case 'explode':
          particle.speedX += dx * 0.05 * force * this.interactionStrength;
          particle.speedY += dy * 0.05 * force * this.interactionStrength;
          particle.highlighted = true;
          break;
        case 'attract':
          particle.speedX -= dx * 0.01 * force * this.interactionStrength;
          particle.speedY -= dy * 0.01 * force * this.interactionStrength;
          particle.highlighted = true;
          break;
        case 'repel':
          particle.speedX += dx * 0.02 * force * this.interactionStrength;
          particle.speedY += dy * 0.02 * force * this.interactionStrength;
          particle.highlighted = true;
          break;
        case 'swirl':
          const angle = Math.atan2(dy, dx);
          const rotationSpeed = 0.1 * this.interactionStrength;
          particle.speedX = Math.cos(angle + Math.PI/2) * rotationSpeed * force;
          particle.speedY = Math.sin(angle + Math.PI/2) * rotationSpeed * force;
          particle.highlighted = true;
          break;
        case 'scatter':
          particle.speedX += (Math.random() - 0.5) * 0.5 * force * this.interactionStrength;
          particle.speedY += (Math.random() - 0.5) * 0.5 * force * this.interactionStrength;
          particle.highlighted = true;
          break;
        case 'gravitate':
          const gravitationalPull = 0.05 * this.interactionStrength;
          particle.speedX -= dx * gravitationalPull * force;
          particle.speedY -= dy * gravitationalPull * force;
          particle.highlighted = true;
          break;
        case 'merge':
          particle.radius = Math.min(particle.radius + 0.5 * force * this.interactionStrength, 20);
          particle.speedX *= 0.9;
          particle.speedY *= 0.9;
          particle.color = particle.blendColors(particle.color, 'white', 0.2 * force);
          particle.highlighted = true;
          break;
      }
    }
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}