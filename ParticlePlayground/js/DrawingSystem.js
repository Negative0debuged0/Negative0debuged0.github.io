export class DrawingSystem {
  constructor(canvas, particleSystem) {
    this.canvas = canvas;
    this.particleSystem = particleSystem;
    this.ctx = canvas.getContext('2d');
    this.isDrawing = false;
    this.isActive = false;
    this.points = [];
    this.lines = [];
    this.setupEventListeners();
  }

  setupEventListeners() {
    this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
    this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
    this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
    this.canvas.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
  }

  handleMouseDown(e) {
    if (!this.isActive) return;
    
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    this.isDrawing = true;
    this.points.push({ x, y });
  }
  
  handleMouseMove(e) {
    if (!this.isActive || !this.isDrawing) return;
    
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const prevPoint = this.points[this.points.length - 1];
    this.lines.push({
      start: { x: prevPoint.x, y: prevPoint.y },
      end: { x, y }
    });
    
    this.points.push({ x, y });
  }
  
  handleMouseUp() {
    this.isDrawing = false;
    
    // After drawing is complete, spawn particles along the drawn path
    if (this.isActive && this.lines.length > 0) {
      this.spawnParticlesAlongPath();
      // Clear the lines immediately after spawning particles
      this.clear();
    }
  }
  
  handleMouseLeave() {
    this.isDrawing = false;
  }
  
  spawnParticlesAlongPath() {
    // Calculate total length of all lines
    let totalLength = 0;
    this.lines.forEach(line => {
      const dx = line.end.x - line.start.x;
      const dy = line.end.y - line.start.y;
      totalLength += Math.sqrt(dx * dx + dy * dy);
    });
    
    // Determine number of particles to spawn based on line length
    // Reduced density for fewer particles
    const particleDensity = 0.03; 
    const particlesToSpawn = Math.min(15, Math.max(3, Math.round(totalLength * particleDensity))); 
    
    // Distribute particles along the lines
    let particlesAdded = 0;
    
    this.lines.forEach(line => {
      const dx = line.end.x - line.start.x;
      const dy = line.end.y - line.start.y;
      const length = Math.sqrt(dx * dx + dy * dy);
      
      // Calculate particles to place on this line proportional to its length
      const particlesOnLine = Math.max(1, Math.ceil(length / totalLength * particlesToSpawn));
      
      for (let i = 0; i < particlesOnLine && particlesAdded < particlesToSpawn; i++) {
        const ratio = i / particlesOnLine;
        const x = line.start.x + dx * ratio;
        const y = line.start.y + dy * ratio;
        
        // Spawn new particle
        const particle = this.particleSystem.addParticleAt(x, y);
        
        // Slightly randomize initial velocities
        particle.speedX = (Math.random() - 0.5) * 0.5;
        particle.speedY = (Math.random() - 0.5) * 0.5;
        
        particlesAdded++;
      }
    });
  }

  clear() {
    this.points = [];
    this.lines = [];
    this.isDrawing = false;
  }

  draw() {
    if (!this.isActive) return;
    
    // Draw current lines being drawn
    this.ctx.beginPath();
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    this.ctx.lineWidth = 2;
    
    for (let i = 0; i < this.lines.length; i++) {
      const line = this.lines[i];
      this.ctx.moveTo(line.start.x, line.start.y);
      this.ctx.lineTo(line.end.x, line.end.y);
    }
    
    this.ctx.stroke();
  }
  
  toggle() {
    this.isActive = !this.isActive;
    
    if (this.isActive) {
      this.clear();
    }
    
    return this.isActive;
  }
}