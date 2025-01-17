class Particle {
  constructor(x, y, canvas, type = 'plasma') {
    this.x = x;
    this.y = y;
    this.canvas = canvas;
    this.type = type;
    this.setupParticleProperties();
  }

  setupParticleProperties() {
    // Ensure radius is always positive and within reasonable bounds
    this.radius = Math.max(1, Math.min(Math.random() * 5, 10));
    this.color = this.getColorForType();
    this.speedX = (Math.random() - 0.5) * 4;
    this.speedY = (Math.random() - 0.5) * 4;
    this.originalColor = this.color;
    this.highlighted = false;
    this.mass = 1; // Default mass
    this.hasGravity = true;

    // Simplified type-specific properties
    switch (this.type) {
      case 'plasma':
        this.energyFactor = Math.random();
        break;
      case 'electric':
        this.charge = Math.random() > 0.5 ? 1 : -1;
        break;
      case 'organic':
        this.flexibility = Math.random();
        break;
      case 'cosmic':
        this.gravitationalFactor = Math.random();
        break;
      case 'quantum':
        this.quantumFactor = Math.random();
        break;
      case 'magnetic':
        this.magneticStrength = Math.random();
        break;
    }
  }

  getColorForType() {
    switch (this.type) {
      case 'plasma':
        return `hsl(200, 100%, 50%)`;
      case 'electric':
        return `hsl(240, 100%, 50%)`;
      case 'organic':
        return `hsl(120, 70%, 50%)`;
      case 'cosmic':
        return `hsla(${Math.random() * 360}, 100%, 60%, 0.7)`;
      case 'quantum':
        return `hsl(280, 100%, 50%)`;
      case 'magnetic':
        return `hsl(0, 100%, 50%)`;
      default:
        return this.getRandomColor();
    }
  }

  getRandomColor() {
    const hue = Math.random() * 360;
    return `hsl(${hue}, 70%, 50%)`;
  }

  update(mouseX, mouseY, interactionMode, interactionStrength, interactionRadius, simulationSpeed = 1) {
    // Store the original position before updates
    const originalX = this.x;
    const originalY = this.y;

    // Constrain particles within screen boundaries
    const padding = this.radius; // Add a small padding to keep full particle visible

    // Horizontal boundary constraints
    if (this.x < padding) {
      this.x = padding;
      // Remove x-direction bouncing when gravity is on
      if (!this.hasGravity) {
        this.speedX = Math.abs(this.speedX); // Bounce right
      }
    } else if (this.x > this.canvas.width - padding) {
      this.x = this.canvas.width - padding;
      // Remove x-direction bouncing when gravity is on
      if (!this.hasGravity) {
        this.speedX = -Math.abs(this.speedX); // Bounce left
      }
    }

    // Vertical boundary constraints
    if (this.y < padding) {
      this.y = padding;
      // Remove y-direction bouncing when gravity is on
      if (!this.hasGravity) {
        this.speedY = Math.abs(this.speedY); // Bounce down
      }
    } else if (this.y > this.canvas.height - padding) {
      // Ground collision prevention
      this.y = this.canvas.height - padding;
      
      // Stop vertical movement when hitting the ground
      if (this.hasGravity) {
        this.speedY = 0;
        
        // Add friction to horizontal movement when on the ground
        this.speedX *= 0.9;
      } else {
        // If gravity is off, bounce as before
        this.speedY = -Math.abs(this.speedY); // Bounce up
      }
    }

    // Regular particle movement
    this.x += this.speedX * simulationSpeed;
    this.y += this.speedY * simulationSpeed;

    // Ensure minimum visibility and speed
    this.radius = Math.max(1, Math.min(this.radius, 10)); // Constrain radius
    const minSpeed = 0.1;
    const maxSpeed = 10;
    this.speedX = Math.sign(this.speedX) * Math.max(minSpeed, Math.min(Math.abs(this.speedX), maxSpeed));
    this.speedY = Math.sign(this.speedY) * Math.max(minSpeed, Math.min(Math.abs(this.speedY), maxSpeed));

    if (mouseX !== null && mouseY !== null && interactionMode !== 'none') {
      const dx = this.x - mouseX;
      const dy = this.y - mouseY;
      const distance = Math.hypot(dx, dy);

      if (distance < interactionRadius) {
        const force = (interactionRadius - distance) / interactionRadius;
        
        switch (interactionMode) {
          case 'pulse':
            this.radius = 4 + Math.sin(Date.now() * 0.01) * 2 * interactionStrength;
            this.highlighted = true;
            break;
          case 'explode':
            this.speedX += dx * 0.05 * force * interactionStrength;
            this.speedY += dy * 0.05 * force * interactionStrength;
            this.highlighted = true;
            break;
          case 'attract':
            this.speedX -= dx * 0.01 * force * interactionStrength;
            this.speedY -= dy * 0.01 * force * interactionStrength;
            this.highlighted = true;
            break;
          case 'repel':
            this.speedX += dx * 0.02 * force * interactionStrength;
            this.speedY += dy * 0.02 * force * interactionStrength;
            this.highlighted = true;
            break;
          case 'swirl':
            const angle = Math.atan2(dy, dx);
            const rotationSpeed = 0.1 * interactionStrength;
            this.speedX = Math.cos(angle + Math.PI/2) * rotationSpeed * force;
            this.speedY = Math.sin(angle + Math.PI/2) * rotationSpeed * force;
            this.highlighted = true;
            break;
          case 'scatter':
            this.speedX += (Math.random() - 0.5) * 0.5 * force * interactionStrength;
            this.speedY += (Math.random() - 0.5) * 0.5 * force * interactionStrength;
            this.highlighted = true;
            break;
          case 'gravitate':
            const gravitationalPull = 0.05 * interactionStrength;
            this.speedX -= dx * gravitationalPull * force;
            this.speedY -= dy * gravitationalPull * force;
            this.highlighted = true;
            break;
          case 'merge':
            this.radius = Math.min(this.radius + 0.5 * force * interactionStrength, 20);
            this.speedX *= 0.9;
            this.speedY *= 0.9;
            this.color = this.blendColors(this.color, 'white', 0.2 * force);
            this.highlighted = true;
            break;
          case 'split':
            if (this.radius > 2) {
              this.radius = Math.max(this.radius - 0.3 * force * interactionStrength, 1);
              this.speedX *= 1.1;
              this.speedY *= 1.1;
              this.color = this.blendColors(this.color, 'red', 0.2 * force);
            }
            this.highlighted = true;
            break;
          case 'connect':
            this.highlighted = true;
            break;
        }
      } else {
        this.highlighted = false;
      }
    }

    // Add constraint for linked particles
    if (this.linkedParticle) {
      const maxLinkDistance = 50; // Maximum allowed distance between linked particles
      const dx = this.x - this.linkedParticle.x;
      const dy = this.y - this.linkedParticle.y;
      const distance = Math.hypot(dx, dy);

      if (distance > maxLinkDistance) {
        // If particles are too far apart, bring them closer
        const pullFactor = 0.1; // Adjust this to control the strength of the connection
        const targetX = this.linkedParticle.x + (dx / distance) * maxLinkDistance;
        const targetY = this.linkedParticle.y + (dy / distance) * maxLinkDistance;

        // Gradually move the particle towards the target position
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

  blendColors(color1, color2, ratio) {
    // Ensure color1 and color2 are valid colors
    color1 = color1 || this.getRandomColor();
    color2 = color2 || this.getRandomColor();

    // If color is in HSL format, convert to RGB first
    if (color1.startsWith('hsl')) {
      color1 = this.hslToRgb(color1);
    }
    if (color2.startsWith('hsl')) {
      color2 = this.hslToRgb(color2);
    }

    // Ensure hex colors start with #
    color1 = color1.startsWith('#') ? color1 : `#${color1}`;
    color2 = color2.startsWith('#') ? color2 : `#${color2}`;

    const c1 = this.hexToRgb(color1);
    const c2 = this.hexToRgb(color2);

    if (!c1 || !c2) {
      return this.getRandomColor(); // Fallback if conversion fails
    }

    const r = Math.round(c1.r + (c2.r - c1.r) * ratio);
    const g = Math.round(c1.g + (c2.g - c1.g) * ratio);
    const b = Math.round(c1.b + (c2.b - c1.b) * ratio);
    return `rgb(${r}, ${g}, ${b})`;
  }

  hslToRgb(hsl) {
    // Parse HSL string
    const match = hsl.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
    if (!match) return this.getRandomColor();

    const h = parseInt(match[1]);
    const s = parseInt(match[2]) / 100;
    const l = parseInt(match[3]) / 100;

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;

    let r = 0, g = 0, b = 0;

    if (h < 60) { r = c; g = x; b = 0; }
    else if (h < 120) { r = x; g = c; b = 0; }
    else if (h < 180) { r = 0; g = c; b = x; }
    else if (h < 240) { r = 0; g = x; b = c; }
    else if (h < 300) { r = x; g = 0; b = c; }
    else { r = c; g = 0; b = x; }

    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return `rgb(${r}, ${g}, ${b})`;
  }

  hexToRgb(hex) {
    // Remove # if present
    hex = hex.replace(/^#/, '');

    // Handle 3-digit and 6-digit hex codes
    if (hex.length === 3) {
      hex = hex.split('').map(char => char + char).join('');
    }

    // Ensure hex is 6 characters long
    if (hex.length !== 6) {
      console.warn(`Invalid hex color: ${hex}`);
      return this.getRandomRgb();
    }

    try {
      return {
        r: parseInt(hex.substr(0, 2), 16),
        g: parseInt(hex.substr(2, 2), 16),
        b: parseInt(hex.substr(4, 2), 16)
      };
    } catch (error) {
      console.warn(`Error converting hex to RGB: ${hex}`, error);
      return this.getRandomRgb();
    }
  }

  getRandomRgb() {
    return {
      r: Math.floor(Math.random() * 256),
      g: Math.floor(Math.random() * 256),
      b: Math.floor(Math.random() * 256)
    };
  }

  draw(ctx) {
    const safeRadius = Math.max(0.1, this.radius);

    ctx.beginPath();
    ctx.arc(this.x, this.y, safeRadius, 0, Math.PI * 2);
    
    if (this.highlighted) {
      ctx.fillStyle = 'white';
    } else {
      ctx.fillStyle = this.color;
    }
    
    ctx.fill();
  }

  checkCollisionWithObject(object) {
    // Removed, handled by ParticleSystem
  }
}

class PhysicsObject {
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
    this.color = this.getRandomColor();
    this.isDragging = false;
    this.offsetX = 0;
    this.offsetY = 0;
    this.dragStartLocation = null;
  }

  getRandomColor() {
    const hue = Math.random() * 360;
    return `hsl(${hue}, 70%, 50%)`;
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

class InteractiveCircle {
  constructor(x, y, canvas, interactionMode, interactionStrength, interactionRadius, hasPhysics = true) {
    this.x = x;
    this.y = y;
    this.canvas = canvas;
    this.radius = 20;
    this.interactionMode = interactionMode;
    this.interactionStrength = interactionStrength;
    this.interactionRadius = interactionRadius;
    this.color = this.getRandomColor();
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

  getRandomColor() {
    const hue = Math.random() * 360;
    return `hsl(${hue}, 70%, 50%)`;
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

class ParticleSystem {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    
    if (!this.canvas) {
      console.error(`Canvas with id ${canvasId} not found`);
      return;
    }

    try {
      this.ctx = this.canvas.getContext('2d');
    } catch (error) {
      console.error('Could not get canvas context:', error);
      return;
    }

    this.particles = [];
    this.mouseX = null;
    this.mouseY = null;
    this.interactionMode = 'none';
    this.physicsObjects = [];
    this.interactiveCircles = [];
    this.spawnSize = 20;
    this.spawnMass = 1;
    this.selectedObject = null;

    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());

    this.particleCount = 100;
    this.particleType = 'plasma';
    this.initParticles();

    this.interactionStrength = 5;
    this.interactionRadius = 100;
    this.connectionRadius = 100;

    this.simulationSpeed = 1;

    this.setupControls();
    this.setupSpawnControls();

    this.animationFrameId = null;
    this.animate();

    this.frameCount = 0;
    this.lastTime = performance.now();
    this.fps = 0;

    this.updateValueDisplays();

    // Add clear particles button handler
    const clearParticlesBtn = document.getElementById('clear-particles-btn');
    clearParticlesBtn.addEventListener('click', () => {
      this.clearAllParticles();
    });

    // Add keyboard event listener
    window.addEventListener('keydown', (e) => {
      if (e.key.toLowerCase() === 'r') {
        const popup = document.getElementById('circle-popup');
        const overlay = document.getElementById('overlay');
        popup.classList.add('active');
        overlay.classList.add('active');
      }
    });

    // Add popup menu handling
    this.setupPopupMenu();

    this.particleMass = 1;
    this.particleGravity = true;
  }

  handleMouseMove(e) {
    const rect = this.canvas.getBoundingClientRect();
    this.mouseX = e.clientX - rect.left;
    this.mouseY = e.clientY - rect.top;

    if (this.selectedObject) {
      this.selectedObject.drag(this.mouseX, this.mouseY);
    } else {
      for (const circle of this.interactiveCircles) {
        if (circle.isDragging) {
          circle.drag(this.mouseX, this.mouseY);
          break;
        }
      }
    }
  }

  handleMouseLeave() {
    this.mouseX = null;
    this.mouseY = null;
    if(this.selectedObject) {
      this.selectedObject.stopDrag()
      this.selectedObject = null;
    }
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  initParticles() {
    this.particles = [];
    for (let i = 0; i < this.particleCount; i++) {
      const x = Math.random() * this.canvas.width;
      const y = Math.random() * this.canvas.height;
      const particle = new Particle(x, y, this.canvas, this.particleType);
      particle.mass = this.particleMass; // Set particle mass
      particle.hasGravity = this.particleGravity; // Set particle gravity
      this.particles.push(particle);
    }
  }

  updateValueDisplays() {
    const particleCountValue = document.getElementById('particle-count-value');
    const simulationSpeedValue = document.getElementById('simulation-speed-value');
    const interactionStrengthValue = document.getElementById('interaction-strength-value');
    const interactionRadiusValue = document.getElementById('interaction-radius-value');
    const connectionRadiusValue = document.getElementById('connection-radius-value');
    const fpsCounter = document.getElementById('fps-counter');
    const gravityToggleValue = document.getElementById('gravity-toggle-value');

    if (particleCountValue) particleCountValue.textContent = this.particles.length;
    if (simulationSpeedValue) simulationSpeedValue.textContent = `${this.simulationSpeed.toFixed(1)}x`;
    if (interactionStrengthValue) interactionStrengthValue.textContent = this.interactionStrength.toFixed(1);
    if (interactionRadiusValue) interactionRadiusValue.textContent = `${Math.round(this.interactionRadius)}px`;
    if (connectionRadiusValue) connectionRadiusValue.textContent = `${Math.round(this.connectionRadius)}px`;
    if (fpsCounter) fpsCounter.textContent = `FPS: ${Math.round(this.fps)}`;
    if (gravityToggleValue) gravityToggleValue.textContent = this.particleGravity ? 'On' : 'Off';
  }

  setupControls() {
    this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
    this.canvas.addEventListener('mouseleave', this.handleMouseLeave.bind(this));

    this.canvas.addEventListener('mousedown', (e) => {
      if (this.interactionMode === 'connect') {
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        const closestParticle = this.particles.reduce((closest, particle) => {
          const distance = Math.hypot(particle.x - mouseX, particle.y - mouseY);
          return distance < closest.distance ? { particle, distance } : closest;
        }, { particle: null, distance: Infinity }).particle;

        if (closestParticle) {
          if(!this.connectStart) {
            this.connectStart = closestParticle;
          }
          else {
            this.connectTwoParticles(this.connectStart, closestParticle);
            this.connectStart = null;
          }
        }
      } else {
        // Select and drag objects
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        for (const obj of this.physicsObjects) {
          const dx = mouseX - obj.x;
          const dy = mouseY - obj.y;
          const distance = Math.hypot(dx, dy);
          if(distance < obj.size + 5) {
            this.selectedObject = obj;
            this.selectedObject.startDrag(mouseX, mouseY);
            break;
          }
        }
        
        for (const circle of this.interactiveCircles) {
          const dx = mouseX - circle.x;
          const dy = mouseY - circle.y;
          const distance = Math.hypot(dx, dy);
          if(distance < circle.radius + 5) {
            circle.startDrag(mouseX, mouseY);
            break;
          }
        }
      }
    });
    this.canvas.addEventListener('mouseup', (e) => {
      if(this.selectedObject) {
        this.selectedObject.stopDrag();
        this.selectedObject = null;
      }
      
      for (const circle of this.interactiveCircles) {
        if (circle.isDragging) {
           circle.stopDrag();
        }
      }
    });

    const particleCountSlider = document.getElementById('particle-count');
    const particleTypeSelect = document.getElementById('particle-type');
    const resetBtn = document.getElementById('reset-btn');
    const interactionModeSelect = document.getElementById('interaction-mode');
    const particleMassSlider = document.getElementById('particle-mass'); 
    const gravityToggle = document.getElementById('gravity-toggle');

    particleCountSlider.addEventListener('input', (e) => {
      this.particleCount = parseInt(e.target.value);
      this.initParticles();
      this.updateValueDisplays();
    });

    particleTypeSelect.addEventListener('change', (e) => {
      this.particleType = e.target.value;
      this.initParticles();
    });
    
    particleMassSlider.addEventListener('input', (e) => {
        this.particleMass = parseFloat(e.target.value);
        this.particles.forEach(particle => particle.mass = this.particleMass);
        document.getElementById('particle-mass-value').textContent = this.particleMass.toFixed(1); 
    });
    
    resetBtn.addEventListener('click', () => this.initParticles());

    interactionModeSelect.addEventListener('change', (e) => {
      this.interactionMode = e.target.value;
    });

    gravityToggle.addEventListener('change', (e) => {
      this.particleGravity = e.target.checked;
      this.particles.forEach(particle => particle.hasGravity = this.particleGravity);
      document.getElementById('gravity-toggle-value').textContent = this.particleGravity ? 'On' : 'Off';
    });

    const interactionStrengthSlider = document.getElementById('interaction-strength');
    const interactionRadiusSlider = document.getElementById('interaction-radius');
    const connectionRadiusSlider = document.getElementById('connection-radius');

    interactionStrengthSlider.addEventListener('input', (e) => {
      this.interactionStrength = parseFloat(e.target.value);
      this.updateValueDisplays();
    });

    interactionRadiusSlider.addEventListener('input', (e) => {
      this.interactionRadius = parseFloat(e.target.value);
      this.updateValueDisplays();
    });

    connectionRadiusSlider.addEventListener('input', (e) => {
      this.connectionRadius = parseFloat(e.target.value);
      this.updateValueDisplays();
    });

    const simulationSpeedSlider = document.getElementById('simulation-speed');
    simulationSpeedSlider.addEventListener('input', (e) => {
      this.simulationSpeed = parseFloat(e.target.value);
      this.updateValueDisplays();
    });
  }

  setupSpawnControls() {
    const spawnCircle = document.getElementById('spawn-circle');
    const spawnSquare = document.getElementById('spawn-square');
    const spawnTriangle = document.getElementById('spawn-triangle');
    const spawnSizeSlider = document.getElementById('spawn-size');
    const spawnMassSlider = document.getElementById('spawn-mass');

    const spawnObject = (type, e) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const obj = new PhysicsObject(x, y, type, this.spawnSize, this.spawnMass, this.canvas);
      this.physicsObjects.push(obj);
    };

    spawnCircle.addEventListener('click', () => {
      const mouseHandler = (e) => {
        spawnObject('circle', e);
        this.canvas.removeEventListener('click', mouseHandler);
      };
      this.canvas.addEventListener('click', mouseHandler);
    });

    spawnSquare.addEventListener('click', () => {
      const mouseHandler = (e) => {
        spawnObject('square', e);
        this.canvas.removeEventListener('click', mouseHandler);
      };
      this.canvas.addEventListener('click', mouseHandler);
    });

    spawnTriangle.addEventListener('click', () => {
      const mouseHandler = (e) => {
        spawnObject('triangle', e);
        this.canvas.removeEventListener('click', mouseHandler);
      };
      this.canvas.addEventListener('click', mouseHandler);
    });

    spawnSizeSlider.addEventListener('input', (e) => {
      this.spawnSize = parseInt(e.target.value);
      document.getElementById('spawn-size-value').textContent = `${this.spawnSize}px`;
    });

    spawnMassSlider.addEventListener('input', (e) => {
      this.spawnMass = parseFloat(e.target.value);
      document.getElementById('spawn-mass-value').textContent = this.spawnMass.toFixed(1);
    });
  }

  setupPopupMenu() {
    const popup = document.getElementById('circle-popup');
    const overlay = document.getElementById('overlay');
    const spawnBtn = document.getElementById('spawn-circle-btn');
    const cancelBtn = document.getElementById('cancel-circle-btn');
    const strengthSlider = document.getElementById('popup-strength');
    const radiusSlider = document.getElementById('popup-radius');
    const physicsToggle = document.getElementById('popup-physics-toggle');
    const strengthValue = document.getElementById('popup-strength-value');
    const radiusValue = document.getElementById('popup-radius-value');

    // Update value displays
    strengthSlider.addEventListener('input', () => {
      strengthValue.textContent = strengthSlider.value;
    });

    radiusSlider.addEventListener('input', () => {
      radiusValue.textContent = `${radiusSlider.value}px`;
    });

    spawnBtn.addEventListener('click', () => {
      const mode = document.getElementById('popup-interaction-mode').value;
      const strength = parseFloat(strengthSlider.value);
      const radius = parseFloat(radiusSlider.value);
      const hasPhysics = physicsToggle.checked;
    
      const circle = new InteractiveCircle(
        this.mouseX || this.canvas.width/2,
        this.mouseY || this.canvas.height/2,
        this.canvas,
        mode,
        strength,
        radius,
        hasPhysics
      );
      this.interactiveCircles.push(circle);
      
      popup.classList.remove('active');
      overlay.classList.remove('active');
    });

    cancelBtn.addEventListener('click', () => {
      popup.classList.remove('active');
      overlay.classList.remove('active');
    });

    // Close popup when clicking overlay
    overlay.addEventListener('click', () => {
      popup.classList.remove('active');
      overlay.classList.remove('active');
    });
  }

  animate() {
    this.frameCount++;
    const currentTime = performance.now();
    const elapsed = currentTime - this.lastTime;

    if (elapsed >= 1000) {
      this.fps = this.frameCount / (elapsed / 1000);
      this.frameCount = 0;
      this.lastTime = currentTime;
      this.updateValueDisplays();
    }

    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.particles.forEach(particle => {
      // Check collision with physics objects
      this.physicsObjects.forEach(obj => {
        this.checkCollisionWithObject(particle, obj);
      });

      // Apply effects from interactive circles
      this.interactiveCircles.forEach(circle => {
        circle.affect(particle);
      });

      particle.update(
        this.mouseX, 
        this.mouseY, 
        this.interactionMode, 
        this.interactionStrength, 
        this.interactionRadius,
        this.simulationSpeed  
      );
      particle.draw(this.ctx);
    });

    // Update and draw interactive circles with physics
    this.interactiveCircles.forEach(circle => {
      circle.update(this.simulationSpeed);
      circle.draw(this.ctx);
    });

    // Collision detection between physics objects
    for (let i = 0; i < this.physicsObjects.length; i++) {
      for (let j = i + 1; j < this.physicsObjects.length; j++) {
        this.checkObjectCollision(this.physicsObjects[i], this.physicsObjects[j]);
      }
    }

    this.physicsObjects.forEach(obj => {
      obj.update(this.simulationSpeed);
      obj.draw(this.ctx);
    });

    this.connectParticles();

    this.animationFrameId = requestAnimationFrame(() => this.animate());
  }

  checkCollisionWithObject(particle, object) {
    const dx = particle.x - object.x;
    const dy = particle.y - object.y;
    const distance = Math.hypot(dx, dy);
    const minDistance = particle.radius + object.size;

    if (distance < minDistance) {
      // Improved collision response
      const angle = Math.atan2(dy, dx);
      const totalMass = particle.mass + object.mass; // Use radius as particle mass
      
      // Calculate relative velocity
      const relativeVelocityX = particle.speedX - object.speedX;
      const relativeVelocityY = particle.speedY - object.speedY;
      
      // Calculate impulse
      const impulse = (-(1 + 0.5) * (relativeVelocityX * Math.cos(angle) + relativeVelocityY * Math.sin(angle))) / 
                     ((1 / particle.mass + 1 / object.mass));
      
      // Apply impulse
      particle.speedX += (impulse * Math.cos(angle)) / particle.mass;
      particle.speedY += (impulse * Math.sin(angle)) / particle.mass;
      object.speedX -= (impulse * Math.cos(angle)) / object.mass;
      object.speedY -= (impulse * Math.sin(angle)) / object.mass;
      
      // Add some energy loss
      particle.speedX *= 0.85;
      particle.speedY *= 0.85;
      object.speedX *= 0.95;
      object.speedY *= 0.95;
      
      // Prevent sticking by ensuring minimum separation
      const overlap = minDistance - distance;
      const separationX = overlap * Math.cos(angle);
      const separationY = overlap * Math.sin(angle);
      
      particle.x += separationX * (object.mass / totalMass);
      particle.y += separationY * (object.mass / totalMass);
      object.x -= separationX * (particle.mass / totalMass);
      object.y -= separationY * (particle.mass / totalMass);
    }
  }

  checkObjectCollision(obj1, obj2) {
    const dx = obj1.x - obj2.x;
    const dy = obj1.y - obj2.y;
    const distance = Math.hypot(dx, dy);
    const minDistance = obj1.size + obj2.size;

    if (distance < minDistance) {
      const angle = Math.atan2(dy, dx);
      const totalMass = obj1.mass + obj2.mass;

      // Calculate relative velocity
      const relativeVelocityX = obj1.speedX - obj2.speedX;
      const relativeVelocityY = obj1.speedY - obj2.speedY;
      
      // Calculate impulse with improved elasticity
      const impulse = (-(1 + 0.8) * (relativeVelocityX * Math.cos(angle) + relativeVelocityY * Math.sin(angle))) / 
                     ((1 / obj1.mass + 1 / obj2.mass));

      // Apply impulse with improved momentum conservation
      obj1.speedX += (impulse * Math.cos(angle)) / obj1.mass;
      obj1.speedY += (impulse * Math.sin(angle)) / obj1.mass;
      obj2.speedX -= (impulse * Math.cos(angle)) / obj2.mass;
      obj2.speedY -= (impulse * Math.sin(angle)) / obj2.mass;

      // Prevent objects from sticking together
      const overlap = minDistance - distance;
      const separationX = overlap * Math.cos(angle);
      const separationY = overlap * Math.sin(angle);
      
      obj1.x += separationX * (obj2.mass / totalMass);
      obj1.y += separationY * (obj2.mass / totalMass);
      obj2.x -= separationX * (obj1.mass / totalMass);
      obj2.y -= separationY * (obj1.mass / totalMass);

      // Add angular momentum transfer
      const relativeSpeed = Math.hypot(relativeVelocityX, relativeVelocityY);
      obj1.rotationSpeed += (relativeSpeed * 0.01) * (Math.random() - 0.5);
      obj2.rotationSpeed += (relativeSpeed * 0.01) * (Math.random() - 0.5);

      // Add some energy loss
      obj1.speedX *= 0.95;
      obj1.speedY *= 0.95;
      obj2.speedX *= 0.95;
      obj2.speedY *= 0.95;
      
      // Dampen rotation
      obj1.rotationSpeed *= 0.98;
      obj2.rotationSpeed *= 0.98;
    }
  }

  connectParticles() {
    for (let i = 0; i < this.particles.length; i++) {
      const p1 = this.particles[i];
      
      for (let j = i + 1; j < this.particles.length; j++) {
        const p2 = this.particles[j];
        const distance = Math.hypot(p1.x - p2.x, p1.y - p2.y);

        if (distance < this.connectionRadius) {
          this.ctx.beginPath();
          this.ctx.moveTo(p1.x, p1.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.strokeStyle = `rgba(255, 255, 255, ${1 - distance / this.connectionRadius})`;
          this.ctx.stroke();
        }
      }
      
      if (p1.linkedParticle) {
        this.ctx.beginPath();
        this.ctx.moveTo(p1.x, p1.y);
        this.ctx.lineTo(p1.linkedParticle.x, p1.linkedParticle.y);
        this.ctx.strokeStyle = 'rgba(255, 0, 0, 0.8)'; 
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        this.ctx.lineWidth = 1; 
      }
    }
  }

  connectTwoParticles(p1, p2) {
    // Only connect if not already connected
    if (p1.linkedParticle !== p2 && p2.linkedParticle !== p1) {
      p1.linkedParticle = p2;
      p2.linkedParticle = p1;
    } else {
      // If already connected, disconnect
      p1.linkedParticle = null;
      p2.linkedParticle = null;
    }
  }

  clearAllParticles() {
    this.particles = [];
    this.physicsObjects = [];
    this.interactiveCircles = []; // Clear interactive circles too
    this.updateValueDisplays();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  try {
    new ParticleSystem('particle-canvas');
    
    const controlsPanel = document.getElementById('controls-panel');
    const minimizeBtn = document.getElementById('minimize-btn');
    
    minimizeBtn.addEventListener('click', () => {
      controlsPanel.classList.toggle('minimized');
      minimizeBtn.textContent = controlsPanel.classList.contains('minimized') ? '+' : '−';
    });
  } catch (error) {
    console.error('Error initializing Particle System:', error);
  }
});