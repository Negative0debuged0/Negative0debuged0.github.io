import { getRandomColor } from './ColorUtils.js';

export class PhysicsObject {
  constructor(x, y, type, size, mass, canvas) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.size = size;
    this.mass = mass;
    this.canvas = canvas;
    this.speedX = 0;
    this.speedY = 0;
    this.rotation = 0;
    this.rotationSpeed = 0;
    this.color = getRandomColor();
    this.isDragging = false;
    this.offsetX = 0;
    this.offsetY = 0;
    this.dragStartLocation = null;
  }

  startDrag(mouseX, mouseY) {
    this.isDragging = true;
    this.offsetX = mouseX - this.x;
    this.offsetY = mouseY - this.y;
    this.speedX = 0;
    this.speedY = 0;
    this.rotationSpeed = 0;
    this.dragStartLocation = {x: this.x, y: this.y}
  }

  drag(mouseX, mouseY) {
    if (this.isDragging) {
      this.x = mouseX - this.offsetX;
      this.y = mouseY - this.offsetY;
    }
  }

  stopDrag() {
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

  update(simulationSpeed = 1) {
    if(this.isDragging) return;
    // Apply gravity
    this.speedY += 0.2 * this.mass * simulationSpeed;

    // Update position
    this.x += this.speedX * simulationSpeed;
    this.y += this.speedY * simulationSpeed;

    // Update rotation
    this.rotation += this.rotationSpeed * simulationSpeed;

    // Bounce off walls
    if (this.x < this.size) {
      this.x = this.size;
      this.speedX = Math.abs(this.speedX) * 0.8;
    } else if (this.x > this.canvas.width - this.size) {
      this.x = this.canvas.width - this.size;
      this.speedX = -Math.abs(this.speedX) * 0.8;
    }

    // Bounce off floor and ceiling
    if (this.y < this.size) {
      this.y = this.size;
      this.speedY = Math.abs(this.speedY) * 0.8;
    } else if (this.y > this.canvas.height - this.size) {
      this.y = this.canvas.height - this.size;
      this.speedY = -Math.abs(this.speedY) * 0.8;
      
      // Apply friction when on ground
      this.speedX *= 0.95;
      this.rotationSpeed *= 0.95;
    }

    // Limit speeds
    const maxSpeed = 20;
    this.speedX = Math.min(Math.max(this.speedX, -maxSpeed), maxSpeed);
    this.speedY = Math.min(Math.max(this.speedY, -maxSpeed), maxSpeed);
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.fillStyle = this.color;

    switch (this.type) {
      case 'circle':
        ctx.beginPath();
        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
        ctx.fill();
        break;
      case 'square':
        ctx.fillRect(-this.size, -this.size, this.size * 2, this.size * 2);
        break;
      case 'triangle':
        ctx.beginPath();
        ctx.moveTo(0, -this.size);
        ctx.lineTo(this.size, this.size);
        ctx.lineTo(-this.size, this.size);
        ctx.closePath();
        ctx.fill();
        break;
    }

    ctx.restore();
  }
}