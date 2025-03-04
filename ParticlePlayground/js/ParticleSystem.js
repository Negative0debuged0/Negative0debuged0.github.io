import { Particle } from './Particle.js';
import { PhysicsObject } from './PhysicsObject.js';
import { InteractiveCircle } from './InteractiveCircle.js';
import { drawParticle, drawConnections, drawPhysicsObject, drawInteractiveCircle } from './ParticleRenderer.js';
import { handleCollision, handleObjectCollision, checkPhysicsObjectCollision } from './ParticlePhysics.js';
import { setupControlsEventHandlers, setupSpawnControls, setupPopupMenu } from './EventHandlers.js';
import { getConnectionColor } from './ParticleTypes.js';
import { DrawManager } from './DrawManager.js';
import { DrawingParticleAttractor } from './DrawingParticleAttractor.js';

export class ParticleSystem {
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
    this.connectStart = null;
    this.pausePhysics = false;

    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());

    this.particleCount = 100;
    this.particleType = 'plasma';
    this.customParticleColor = null;
    this.customConnectionColor = null;
    this.enableTrails = false;
    this.trailLength = 20;
    this.collisionEffect = 'none';
    this.particleLifespan = 0; // 0 means infinite
    
    this.initParticles();

    this.interactionStrength = 5;
    this.interactionRadius = 100;
    this.connectionRadius = 100;

    this.simulationSpeed = 1;

    this.setupEventListeners();
    setupControlsEventHandlers(this);
    setupSpawnControls(this);
    setupPopupMenu(this);

    this.animationFrameId = null;
    this.animate();

    this.frameCount = 0;
    this.lastTime = performance.now();
    this.fps = 0;

    this.updateValueDisplays();

    this.particleMass = 1;
    this.particleGravity = false; // Changed to false to disable gravity by default
    
    // Initialize drawing system
    this.drawManager = new DrawManager(this);
    this.drawingAttractor = null;
  }

  setupEventListeners() {
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
      this.selectedObject.stopDrag();
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
      
      // Add index for optimization of connection rendering
      particle.index = i;
      
      // Store reference to the particle system
      particle.particleSystem = this;
      
      // These properties will be set by the particle's setupParticleProperties method
      // based on its type, but we'll also respect the global settings if the user has 
      // manually configured them
      if (this.particleMass !== 1) {
        particle.mass = this.particleMass; // Override default mass if user changed it
      }
      if (!this.particleGravity) {
        particle.hasGravity = false; // Override gravity if user turned it off
      }
      
      particle.customColor = this.customParticleColor; // Set custom color if defined
      particle.trailEnabled = this.enableTrails || particle.trailEnabled; // Enable trails if set or if particle type requires
      particle.maxTrailLength = this.trailLength || particle.maxTrailLength; // Set trail length
      particle.collisionEffect = this.collisionEffect; // Set collision effect
      particle.lifespan = this.particleLifespan; // Set lifespan
      
      // Set explosion and split handlers
      particle.onExplosion = (x, y) => this.createExplosionEffect(x, y);
      particle.onSplit = (p) => this.splitParticle(p);
      
      this.particles.push(particle);
    }
  }
  
  createExplosionEffect(x, y) {
    // Create small explosion particles
    const particleCount = 8;
    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 / particleCount) * i;
      const particle = new Particle(x, y, this.canvas, this.particleType);
      particle.radius = 2;
      particle.speedX = Math.cos(angle) * 3;
      particle.speedY = Math.sin(angle) * 3;
      particle.mass = this.particleMass * 0.5;
      particle.hasGravity = this.particleGravity;
      particle.customColor = "#FF4500"; // Orange-red for explosion
      particle.lifespan = 100; // Short lifespan
      this.particles.push(particle);
    }
  }
  
  splitParticle(particle) {
    if (particle.radius < 2) return;
    
    // Create two smaller particles
    for (let i = 0; i < 2; i++) {
      const angle = Math.random() * Math.PI * 2;
      const newParticle = new Particle(particle.x, particle.y, this.canvas, this.particleType);
      newParticle.radius = particle.radius * 0.7;
      newParticle.speedX = particle.speedX + Math.cos(angle) * 2;
      newParticle.speedY = particle.speedY + Math.sin(angle) * 2;
      newParticle.mass = particle.mass * 0.5;
      newParticle.hasGravity = this.particleGravity;
      newParticle.customColor = particle.customColor;
      this.particles.push(newParticle);
    }
    
    // Mark original particle for removal
    particle.isDead = true;
  }

  updateValueDisplays() {
    const particleCountValue = document.getElementById('particle-count-value');
    const simulationSpeedValue = document.getElementById('simulation-speed-value');
    const interactionStrengthValue = document.getElementById('interaction-strength-value');
    const interactionRadiusValue = document.getElementById('interaction-radius-value');
    const connectionRadiusValue = document.getElementById('connection-radius-value');
    const fpsCounter = document.getElementById('fps-counter');
    const gravityToggleValue = document.getElementById('gravity-toggle-value');
    const trailLengthValue = document.getElementById('trail-length-value');
    const particleLifespanValue = document.getElementById('particle-lifespan-value');

    if (particleCountValue) particleCountValue.textContent = this.particles.length;
    if (simulationSpeedValue) simulationSpeedValue.textContent = `${this.simulationSpeed.toFixed(1)}x`;
    if (interactionStrengthValue) interactionStrengthValue.textContent = this.interactionStrength.toFixed(1);
    if (interactionRadiusValue) interactionRadiusValue.textContent = `${Math.round(this.interactionRadius)}px`;
    if (connectionRadiusValue) connectionRadiusValue.textContent = `${Math.round(this.connectionRadius)}px`;
    if (fpsCounter) fpsCounter.textContent = `FPS: ${Math.round(this.fps)}`;
    if (gravityToggleValue) gravityToggleValue.textContent = this.particleGravity ? 'On' : 'Off';
    if (trailLengthValue) trailLengthValue.textContent = this.trailLength;
    if (particleLifespanValue) {
      particleLifespanValue.textContent = this.particleLifespan > 0 ? 
        `${this.particleLifespan}` : "Infinite";
    }
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

    // Remove dead particles
    this.particles = this.particles.filter(particle => !particle.isDead);

    // Optimize performance by reducing calculation frequency when FPS drops
    let shouldSkipParticleCollisions = false;
    if (this.fps < 30 && this.particles.length > 200) {
      shouldSkipParticleCollisions = true;
    }
    
    // Update drawing system if it exists
    if (this.drawManager) {
      this.drawManager.update();
      
      // Create particle attractor for drawing lines if needed
      if (this.drawManager.drawingSystem.isActive && this.drawManager.drawingSystem.lines.length > 0) {
        if (!this.drawingAttractor) {
          this.drawingAttractor = new DrawingParticleAttractor(this.drawManager.drawingSystem.lines);
          
          // Apply custom strength from slider if it exists
          const strengthSlider = document.getElementById('drawing-strength');
          if (strengthSlider) {
            this.drawingAttractor.attractionStrength = parseFloat(strengthSlider.value);
          }
        } else {
          this.drawingAttractor.lines = this.drawManager.drawingSystem.lines;
        }
      } else if (!this.drawManager.drawingSystem.isActive) {
        // If draw mode was deactivated, release all particles
        if (this.drawingAttractor) {
          this.particles.forEach(particle => {
            particle.isPartOfDrawing = false;
          });
          this.drawingAttractor = null;
        }
      }
    }
    
    // Process remaining particles
    this.particles.forEach(particle => {
      // Check collision with physics objects
      this.physicsObjects.forEach(obj => {
        handleObjectCollision(particle, obj);
      });

      // Apply effects from interactive circles
      this.interactiveCircles.forEach(circle => {
        circle.affect(particle);
      });
      
      // Apply drawing attractor forces if active
      if (this.drawingAttractor && this.drawManager.drawingSystem.isActive) {
        this.drawingAttractor.applyForceToParticle(particle);
      }

      // Update physics regardless of draw mode
      particle.update(
        this.mouseX, 
        this.mouseY, 
        this.interactionMode, 
        this.interactionStrength, 
        this.interactionRadius,
        this.simulationSpeed  
      );
      
      drawParticle(this.ctx, particle);
    });

    // Only check particle-to-particle collisions when needed (optimization)
    if (!shouldSkipParticleCollisions && !this.pausePhysics) {
      // We'll limit how many particles we check collisions for when we have many
      const collisionCheckLimit = Math.min(this.particles.length, 200);
      for (let i = 0; i < collisionCheckLimit; i++) {
        for (let j = i + 1; j < collisionCheckLimit; j++) {
          handleCollision(this.particles[i], this.particles[j]);
        }
      }
    }
    
    // Update and draw interactive circles with physics
    this.interactiveCircles.forEach(circle => {
      if (!this.pausePhysics) {
        circle.update(this.simulationSpeed);
      }
      drawInteractiveCircle(this.ctx, circle);
    });

    // Collision detection between physics objects
    if (!this.pausePhysics) {
      for (let i = 0; i < this.physicsObjects.length; i++) {
        for (let j = i + 1; j < this.physicsObjects.length; j++) {
          checkPhysicsObjectCollision(this.physicsObjects[i], this.physicsObjects[j]);
        }
      }

      this.physicsObjects.forEach(obj => {
        obj.update(this.simulationSpeed);
        drawPhysicsObject(this.ctx, obj);
      });
    } else {
      // Just draw the objects without updating them
      this.physicsObjects.forEach(obj => {
        drawPhysicsObject(this.ctx, obj);
      });
    }

    // Draw connections between particles
    drawConnections(this.ctx, this.particles, this.connectionRadius, getConnectionColor);

    this.animationFrameId = requestAnimationFrame(() => this.animate());
  }

  addParticleAt(x, y) {
    const particle = new Particle(x, y, this.canvas, this.particleType);
    
    // Add index for optimization of connection rendering
    particle.index = this.particles.length;
    
    // Apply current settings
    if (this.particleMass !== 1) {
      particle.mass = this.particleMass;
    }
    
    particle.hasGravity = this.particleGravity;
    particle.customColor = this.customParticleColor;
    particle.trailEnabled = this.enableTrails;
    particle.maxTrailLength = this.trailLength;
    particle.collisionEffect = this.collisionEffect;
    particle.lifespan = this.particleLifespan;
    
    // Set explosion and split handlers
    particle.onExplosion = (x, y) => this.createExplosionEffect(x, y);
    particle.onSplit = (p) => this.splitParticle(p);
    
    this.particles.push(particle);
    return particle;
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