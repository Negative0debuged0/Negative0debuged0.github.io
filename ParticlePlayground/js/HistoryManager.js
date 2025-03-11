export class HistoryManager {
  constructor(particleSystem) {
    this.particleSystem = particleSystem;
    this.history = [];
    this.redoStack = [];
    this.maxHistorySize = 20;
    this.currentState = null;
    this.isRecording = true;
    
    // Set up keyboard shortcuts
    window.addEventListener('keydown', (e) => {
      // Ctrl+Z for undo
      if (e.ctrlKey && e.key.toLowerCase() === 'z') {
        this.undo();
        e.preventDefault();
      }
      
      // Ctrl+Y for redo
      if (e.ctrlKey && e.key.toLowerCase() === 'y') {
        this.redo();
        e.preventDefault();
      }
    });
    
    // Initialize state
    this.saveCurrentState();
  }
  
  saveCurrentState() {
    if (!this.isRecording) return;
    
    // Create a snapshot of current system state
    const state = {
      particles: this.particleSystem.particles.map(p => this.serializeParticle(p)),
      physicsObjects: this.particleSystem.physicsObjects.map(o => this.serializePhysicsObject(o)),
      interactiveCircles: this.particleSystem.interactiveCircles.map(c => this.serializeInteractiveCircle(c)),
      settings: {
        particleType: this.particleSystem.particleType,
        particleCount: this.particleSystem.particleCount,
        interactionMode: this.particleSystem.interactionMode,
        interactionStrength: this.particleSystem.interactionStrength,
        interactionRadius: this.particleSystem.interactionRadius,
        connectionRadius: this.particleSystem.connectionRadius,
        particleMass: this.particleSystem.particleMass,
        particleGravity: this.particleSystem.particleGravity,
        particleLifespan: this.particleSystem.particleLifespan,
        enableTrails: this.particleSystem.enableTrails,
        trailLength: this.particleSystem.trailLength,
        customParticleColor: this.particleSystem.customParticleColor,
        customConnectionColor: this.particleSystem.customConnectionColor,
        simulationSpeed: this.particleSystem.simulationSpeed,
        spawnSize: this.particleSystem.spawnSize,
        spawnMass: this.particleSystem.spawnMass,
        timestamp: Date.now()
      }
    };
    
    // Add to history and limit size
    this.history.push(state);
    if (this.history.length > this.maxHistorySize) {
      this.history.shift();
    }
    
    // Clear redo stack when a new action is performed
    this.redoStack = [];
    
    this.currentState = state;
  }
  
  serializeParticle(particle) {
    return {
      x: particle.x,
      y: particle.y,
      type: particle.type,
      radius: particle.radius,
      color: particle.color,
      customColor: particle.customColor,
      speedX: particle.speedX,
      speedY: particle.speedY,
      mass: particle.mass,
      hasGravity: particle.hasGravity,
      trailEnabled: particle.trailEnabled,
      lifespan: particle.lifespan,
      age: particle.age,
      opacity: particle.opacity,
      highlighted: particle.highlighted
    };
  }
  
  serializePhysicsObject(obj) {
    return {
      x: obj.x,
      y: obj.y,
      type: obj.type,
      size: obj.size,
      mass: obj.mass,
      speedX: obj.speedX,
      speedY: obj.speedY,
      rotation: obj.rotation,
      rotationSpeed: obj.rotationSpeed,
      color: obj.color
    };
  }
  
  serializeInteractiveCircle(circle) {
    return {
      x: circle.x,
      y: circle.y,
      radius: circle.radius,
      interactionMode: circle.interactionMode,
      interactionStrength: circle.interactionStrength,
      interactionRadius: circle.interactionRadius,
      color: circle.color,
      hasPhysics: circle.hasPhysics,
      speedX: circle.speedX,
      speedY: circle.speedY
    };
  }
  
  undo() {
    if (this.history.length <= 1) {
      window.showNotification("Nothing to undo", "warning");
      return;
    }
    
    // Save current state to redo stack
    this.redoStack.push(this.history.pop());
    
    // Get previous state
    const previousState = this.history[this.history.length - 1];
    
    // Pause recording to prevent the restoration from being recorded
    this.isRecording = false;
    
    // Restore the previous state
    this.restoreState(previousState);
    
    // Resume recording
    this.isRecording = true;
    
    window.showNotification("Undo successful", "info");
  }
  
  redo() {
    if (this.redoStack.length === 0) {
      window.showNotification("Nothing to redo", "warning");
      return;
    }
    
    // Get the next state from redo stack
    const nextState = this.redoStack.pop();
    
    // Add current state to history
    this.history.push(nextState);
    
    // Pause recording to prevent the restoration from being recorded
    this.isRecording = false;
    
    // Restore the state
    this.restoreState(nextState);
    
    // Resume recording
    this.isRecording = true;
    
    window.showNotification("Redo successful", "info");
  }
  
  restoreState(state) {
    // Clear current particles and objects
    this.particleSystem.particles = [];
    this.particleSystem.physicsObjects = [];
    this.particleSystem.interactiveCircles = [];
    
    // Restore particles
    state.particles.forEach(p => {
      const particle = this.particleSystem.addParticleAt(p.x, p.y);
      Object.assign(particle, p);
    });
    
    // Restore physics objects
    state.physicsObjects.forEach(o => {
      const obj = new this.particleSystem.PhysicsObject(
        o.x, o.y, o.type, o.size, o.mass, this.particleSystem.canvas
      );
      Object.assign(obj, o);
      this.particleSystem.physicsObjects.push(obj);
    });
    
    // Restore interactive circles
    state.interactiveCircles.forEach(c => {
      const circle = new this.particleSystem.InteractiveCircle(
        c.x, c.y, this.particleSystem.canvas, 
        c.interactionMode, c.interactionStrength, c.interactionRadius, c.hasPhysics
      );
      Object.assign(circle, c);
      this.particleSystem.interactiveCircles.push(circle);
    });
    
    // Restore settings
    Object.assign(this.particleSystem, state.settings);
    
    // Update UI to reflect restored state
    this.particleSystem.updateValueDisplays();
    
    // Set current state
    this.currentState = state;
  }
  
  recordAction(actionName) {
    this.saveCurrentState();
    window.showNotification(`Action recorded: ${actionName}`, "info");
  }
}