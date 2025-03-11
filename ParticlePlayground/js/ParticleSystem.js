import { Particle } from './Particle.js';
import { PhysicsObject } from './PhysicsObject.js';
import { InteractiveCircle } from './InteractiveCircle.js';
import { drawParticle, drawConnections, drawPhysicsObject, drawInteractiveCircle } from './ParticleRenderer.js';
import { handleCollision, handleObjectCollision, checkPhysicsObjectCollision } from './ParticlePhysics.js';
import { setupControlsEventHandlers, setupSpawnControls, setupPopupMenu } from './EventHandlers.js';
import { getConnectionColor } from './ParticleTypes.js';
import { DrawManager } from './DrawManager.js';
import { DrawingParticleAttractor } from './DrawingParticleAttractor.js';
import { BattleSystem } from './BattleSystem.js';
import { RealityBubbleManager } from './RealityBubbleManager.js';
import { WeatherSystem } from './WeatherSystem.js';
import { HistoryManager } from './HistoryManager.js';
import { HelpSystem } from './HelpSystem.js';
import { SnapshotSystem } from './SnapshotSystem.js';
import { PresetManager } from './PresetManager.js';

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
    
    this.initParticles();

    this.interactionStrength = 5;
    this.interactionRadius = 100;
    this.connectionRadius = 100;
    this.showConnections = true; // Add new property for connection visibility

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
    
    // Initialize battle system
    this.battleSystem = new BattleSystem(this);
    
    // Initialize reality bubble system
    this.realityBubbleManager = new RealityBubbleManager(this);
    this.blackHoleActive = false;
    this.blackHole = null;
    this.setupBlackHoleMechanic();
    
    // Initialize weather system
    this.weatherSystem = new WeatherSystem(this);
    
    // Initialize new features
    this.historyManager = new HistoryManager(this);
    this.helpSystem = new HelpSystem();
    this.snapshotSystem = new SnapshotSystem(this);
    this.presetManager = new PresetManager(this);
    
    // Add for easy access in the history manager
    this.PhysicsObject = PhysicsObject;
    this.InteractiveCircle = InteractiveCircle;
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
    
    // Reset physics objects positions if any are out of bounds after resize
    this.physicsObjects.forEach(obj => {
      if (obj.x < obj.size) obj.x = obj.size;
      if (obj.y < obj.size) obj.y = obj.size;
      if (obj.x > this.canvas.width - obj.size) obj.x = this.canvas.width - obj.size;
      if (obj.y > this.canvas.height - obj.size) obj.y = this.canvas.height - obj.size;
    });
  }

  initParticles() {
    // Store current gravity and interaction mode settings before clearing
    const currentGravity = this.particleGravity;
    const currentInteractionMode = this.interactionMode;
    
    this.particles = [];
    for (let i = 0; i < this.particleCount; i++) {
      const x = Math.random() * this.canvas.width;
      const y = Math.random() * this.canvas.height;
      this.addParticleAt(x, y);
    }
    
    // Ensure preset application doesn't change gravity or interaction mode
    this.particleGravity = currentGravity;
    this.interactionMode = currentInteractionMode;
    
    // Update particles with current gravity setting
    this.particles.forEach(particle => {
      particle.hasGravity = this.particleGravity;
    });
    
    // Record this state in history if available
    if (this.historyManager) {
      this.historyManager.saveCurrentState();
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

    if (particleCountValue) particleCountValue.textContent = this.particles.length;
    if (simulationSpeedValue) simulationSpeedValue.textContent = `${this.simulationSpeed.toFixed(1)}x`;
    if (interactionStrengthValue) interactionStrengthValue.textContent = this.interactionStrength.toFixed(1);
    if (interactionRadiusValue) interactionRadiusValue.textContent = `${Math.round(this.interactionRadius)}px`;
    if (connectionRadiusValue) connectionRadiusValue.textContent = `${Math.round(this.connectionRadius)}px`;
    if (fpsCounter) fpsCounter.textContent = `FPS: ${Math.round(this.fps)}`;
    if (gravityToggleValue) gravityToggleValue.textContent = this.particleGravity ? 'On' : 'Off';
    if (trailLengthValue) trailLengthValue.textContent = this.trailLength;
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
    
    // Update battle system if active
    if (this.battleSystem && this.battleSystem.isActive) {
      this.battleSystem.updateBattle();
    }
    
    // Update reality bubbles
    if (this.realityBubbleManager) {
      this.realityBubbleManager.update();
    }
    
    // Update weather system
    if (this.weatherSystem) {
      this.weatherSystem.update();
    }
    
    // Process remaining particles
    if (!this.pausePhysics) {  
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
      });
    }
    
    // Draw all particles regardless of pause state
    this.particles.forEach(particle => {
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

    // Draw attack trails for battle particles
    this.particles.forEach(particle => {
      if (particle.attackTrails && particle.attackTrails.length > 0) {
        this.drawAttackTrails(particle);
      }
    });

    // Draw connections between particles with team-aware colors
    this.drawTeamConnections();

    // Draw reality bubbles
    if (this.realityBubbleManager) {
      this.realityBubbleManager.draw(this.ctx);
    }
    
    // Draw weather effects
    if (this.weatherSystem) {
      this.weatherSystem.drawWeather();
    }

    // Process black hole mechanics
    if (this.blackHoleActive && this.blackHole) {
      this.updateBlackHole();
      this.drawBlackHole();
    }

    this.animationFrameId = requestAnimationFrame(() => this.animate());
  }

  update() {
    this.drawingSystem.draw();
    
    // Remove references to drawing attractor since we no longer need it
    if (this.drawingAttractor) {
      this.drawingAttractor = null;
    }
  }

  drawAttackTrails(particle) {
    particle.attackTrails.forEach((trail, index) => {
      // Draw laser beam
      this.ctx.beginPath();
      this.ctx.moveTo(trail.startX, trail.startY);
      this.ctx.lineTo(trail.endX, trail.endY);
      
      // For laser effect, make the line thicker
      this.ctx.strokeStyle = trail.color;
      this.ctx.lineWidth = 2;
      
      // Add glow effect for lasers
      this.ctx.shadowBlur = 5;
      this.ctx.shadowColor = trail.color;
      
      this.ctx.stroke();
      
      // Reset shadow effect after drawing
      this.ctx.shadowBlur = 0;
      
      // Reduce trail life and remove if expired
      trail.life--;
      if (trail.life <= 0) {
        particle.attackTrails.splice(index, 1);
      }
    });
  }
  
  drawTeamConnections() {
    if (!this.showConnections) return; // Skip drawing connections if disabled
    
    if (!this.battleSystem || !this.battleSystem.isActive) {
      // Use original connection drawing if battle mode is not active
      drawConnections(this.ctx, this.particles, this.connectionRadius, getConnectionColor);
      return;
    }
    
    // Team 1 connections
    const team1 = this.particles.filter(p => p.team === 1);
    if (team1.length > 0) {
      this.ctx.strokeStyle = this.battleSystem.team1ConnectionColor + "40"; // 25% opacity
      this.ctx.lineWidth = 0.5;
      this.drawTeamConnectionsInternal(team1);
    }
    
    // Team 2 connections
    const team2 = this.particles.filter(p => p.team === 2);
    if (team2.length > 0) {
      this.ctx.strokeStyle = this.battleSystem.team2ConnectionColor + "40"; // 25% opacity
      this.ctx.lineWidth = 0.5;
      this.drawTeamConnectionsInternal(team2);
    }
  }
  
  drawTeamConnectionsInternal(teamParticles) {
    // Use optimized connection drawing approach for teams
    for (let i = 0; i < teamParticles.length; i++) {
      const p1 = teamParticles[i];
      
      for (let j = i + 1; j < teamParticles.length; j++) {
        const p2 = teamParticles[j];
        const distance = Math.hypot(p1.x - p2.x, p1.y - p2.y);
        
        // Draw connections only between nearby team members
        const teamConnectionRadius = this.connectionRadius * 0.7; // Shorter than regular connections
        if (distance < teamConnectionRadius) {
          this.ctx.beginPath();
          this.ctx.moveTo(p1.x, p1.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.stroke();
        }
      }
    }
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
    
    // Set explosion and split handlers
    particle.onExplosion = (x, y) => this.createExplosionEffect(x, y);
    particle.onSplit = (p) => this.splitParticle(p);
    
    // Store reference to the particle system on the particle
    particle.particleSystem = this;
    
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
    // First record current state if history manager exists
    if (this.historyManager) {
      this.historyManager.saveCurrentState();
    }
    
    this.particles = [];
    this.physicsObjects = [];
    this.interactiveCircles = []; // Clear interactive circles too
    this.updateValueDisplays();
    
    // Record the empty state
    if (this.historyManager) {
      this.historyManager.saveCurrentState();
    }
  }
  
  // ... existing code ...

  setupBlackHoleMechanic() {
    const blackHoleSection = document.createElement('div');
    blackHoleSection.className = 'settings-group';
    blackHoleSection.innerHTML = `
      <div class="settings-group-title">Black Hole</div>
      <div class="checkbox-wrapper tooltip">
        <input type="checkbox" id="black-hole-toggle">
        <label for="black-hole-toggle">Create Black Hole</label>
        <span class="parameter-value" id="black-hole-value">Off</span>
        <span class="tooltip-text">Creates a powerful gravitational singularity</span>
      </div>
      <div id="black-hole-settings" style="display:none;">
        <label class="tooltip">
          Gravitational Force: <span class="parameter-value" id="black-hole-force-value">5.0</span>
          <span class="tooltip-text">Strength of gravitational pull</span>
          <input type="range" id="black-hole-force" min="1" max="20" value="5" step="0.5">
        </label>
        <p style="font-size: 0.8em; color: #aaa; margin-top: 10px;">
          Click on canvas to place the black hole. Press H to toggle.
        </p>
      </div>
    `;
  
    const controlsContent = document.querySelector('.controls-content');
    if (controlsContent) {
      controlsContent.appendChild(blackHoleSection);
    }
  
    const blackHoleToggle = document.getElementById('black-hole-toggle');
    const blackHoleValue = document.getElementById('black-hole-value');
    const blackHoleSettings = document.getElementById('black-hole-settings');
    const blackHoleForce = document.getElementById('black-hole-force');
    const blackHoleForceValue = document.getElementById('black-hole-force-value');
  
    blackHoleToggle.addEventListener('change', () => {
      this.blackHoleActive = blackHoleToggle.checked;
      blackHoleValue.textContent = this.blackHoleActive ? 'On' : 'Off';
      blackHoleSettings.style.display = this.blackHoleActive ? 'block' : 'none';
      
      if (!this.blackHoleActive && this.blackHole) {
        this.blackHole = null;
      } else if (this.blackHoleActive && !this.blackHole) {
        // Create black hole in center of screen
        this.blackHole = {
          x: this.canvas.width / 2,
          y: this.canvas.height / 2,
          force: parseFloat(blackHoleForce.value),
          radius: 20,
          particles: []
        };
      }
    });
  
    blackHoleForce.addEventListener('input', () => {
      const force = parseFloat(blackHoleForce.value);
      blackHoleForceValue.textContent = force.toFixed(1);
      if (this.blackHole) {
        this.blackHole.force = force;
      }
    });
  
    // Add keyboard shortcut
    window.addEventListener('keydown', (e) => {
      if (e.key.toLowerCase() === 'h') {
        blackHoleToggle.checked = !blackHoleToggle.checked;
        blackHoleToggle.dispatchEvent(new Event('change'));
      }
    });
  
    // Click to place black hole
    this.canvas.addEventListener('click', (e) => {
      if (this.blackHoleActive && this.blackHole) {
        const rect = this.canvas.getBoundingClientRect();
        this.blackHole.x = e.clientX - rect.left;
        this.blackHole.y = e.clientY - rect.top;
      }
    });
  }

  updateBlackHole() {
    if (!this.blackHole) return;
    
    // Update black hole effect on particles
    this.particles.forEach(particle => {
      const dx = this.blackHole.x - particle.x;
      const dy = this.blackHole.y - particle.y;
      const distance = Math.hypot(dx, dy);
      
      // Calculate gravitational force (stronger as particles get closer)
      const gravitationalPull = this.blackHole.force * (1 + 10 / Math.max(10, distance));
      
      // Apply gravitational pull
      if (distance > this.blackHole.radius) {
        const angle = Math.atan2(dy, dx);
        particle.speedX += Math.cos(angle) * gravitationalPull * 0.1;
        particle.speedY += Math.sin(angle) * gravitationalPull * 0.1;
      } else {
        // Particle captured by black hole
        if (!this.blackHole.particles.includes(particle.index)) {
          particle.opacity = 0.7;
          particle.speedX *= 0.1;
          particle.speedY *= 0.1;
          this.blackHole.particles.push(particle.index);
        }
      }
    });
    
    // Update black hole effect on physics objects
    this.physicsObjects.forEach(obj => {
      const dx = this.blackHole.x - obj.x;
      const dy = this.blackHole.y - obj.y;
      const distance = Math.hypot(dx, dy);
      
      // Calculate gravitational pull (slightly weaker for objects)
      const gravitationalPull = this.blackHole.force * 0.5 * (1 + 5 / Math.max(5, distance));
      
      // Apply gravitational pull
      if (distance > this.blackHole.radius + obj.size) {
        const angle = Math.atan2(dy, dx);
        obj.speedX += Math.cos(angle) * gravitationalPull * 0.05;
        obj.speedY += Math.sin(angle) * gravitationalPull * 0.05;
        obj.rotationSpeed += gravitationalPull * 0.001;
      }
    });
    
    // Black hole slowly grows as it captures particles
    this.blackHole.radius = Math.min(80, 20 + this.blackHole.particles.length * 0.1);
  }

  drawBlackHole() {
    if (!this.blackHole) return;
    
    // Create radial gradient
    const gradient = this.ctx.createRadialGradient(
      this.blackHole.x, this.blackHole.y, 1,
      this.blackHole.x, this.blackHole.y, this.blackHole.radius * 2
    );
    
    gradient.addColorStop(0, 'rgba(0, 0, 0, 1)');
    gradient.addColorStop(0.3, 'rgba(20, 20, 40, 0.8)');
    gradient.addColorStop(0.7, 'rgba(40, 0, 80, 0.4)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    
    // Draw black hole
    this.ctx.beginPath();
    this.ctx.arc(this.blackHole.x, this.blackHole.y, this.blackHole.radius * 2, 0, Math.PI * 2);
    this.ctx.fillStyle = gradient;
    this.ctx.fill();
    
    // Draw event horizon
    this.ctx.beginPath();
    this.ctx.arc(this.blackHole.x, this.blackHole.y, this.blackHole.radius, 0, Math.PI * 2);
    this.ctx.fillStyle = 'black';
    this.ctx.fill();
    
    // Add accretion disk effect
    this.ctx.beginPath();
    this.ctx.arc(this.blackHole.x, this.blackHole.y, this.blackHole.radius * 1.2, 0, Math.PI * 2);
    this.ctx.strokeStyle = 'rgba(255, 100, 50, 0.7)';
    this.ctx.lineWidth = 3;
    this.ctx.stroke();
    
    // Add some glow
    this.ctx.beginPath();
    this.ctx.arc(this.blackHole.x, this.blackHole.y, this.blackHole.radius * 1.5, 0, Math.PI * 2);
    this.ctx.strokeStyle = 'rgba(100, 0, 255, 0.3)';
    this.ctx.lineWidth = 5;
    this.ctx.stroke();
  }
}