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
    
    // After drawing is complete, create particles along the drawn path
    if (this.isActive && this.lines.length > 0) {
      this.createParticlesAlongPath();
    }
  }
  
  handleMouseLeave() {
    this.isDrawing = false;
  }
  
  createParticlesAlongPath() {
    // Calculate total length of all lines
    let totalLength = 0;
    this.lines.forEach(line => {
      const dx = line.end.x - line.start.x;
      const dy = line.end.y - line.start.y;
      totalLength += Math.sqrt(dx * dx + dy * dy);
    });
    
    // Use existing particles to distribute along the path
    const particleCount = this.particleSystem.particles.length;
    const particlesPerLength = particleCount / Math.max(1, totalLength);
    
    // Mark all particles as not being part of drawing initially
    this.particleSystem.particles.forEach(particle => {
      particle.isPartOfDrawing = false;
    });
    
    // Distribute existing particles along the lines
    let particlesAssigned = 0;
    
    // First pass: More uniform distribution of particles
    this.lines.forEach(line => {
      const dx = line.end.x - line.start.x;
      const dy = line.end.y - line.start.y;
      const length = Math.sqrt(dx * dx + dy * dy);
      
      // Calculate particles to place on this line proportional to its length
      const particlesOnLine = Math.max(1, Math.ceil(length * particlesPerLength));
      
      for (let i = 0; i < particlesOnLine && particlesAssigned < particleCount; i++) {
        const ratio = i / particlesOnLine;
        const x = line.start.x + dx * ratio;
        const y = line.start.y + dy * ratio;
        
        // Position existing particles
        if (particlesAssigned < particleCount) {
          const particle = this.particleSystem.particles[particlesAssigned];
          particle.x = x;
          particle.y = y;
          // Reset speed to prevent immediate departure from the line
          particle.speedX = (Math.random() - 0.5) * 0.2; // Reduced speed
          particle.speedY = (Math.random() - 0.5) * 0.2; // Reduced speed
          // Mark the particle as being part of the drawing
          particle.isPartOfDrawing = true;
          particlesAssigned++;
        }
      }
    });
    
    // Second pass: Fill in gaps by distributing remaining particles
    if (particlesAssigned < particleCount) {
      const remainingParticles = particleCount - particlesAssigned;
      const gapFillersPerLine = Math.ceil(remainingParticles / Math.max(1, this.lines.length));
      
      this.lines.forEach(line => {
        const dx = line.end.x - line.start.x;
        const dy = line.end.y - line.start.y;
        
        for (let i = 0; i < gapFillersPerLine && particlesAssigned < particleCount; i++) {
          const ratio = (i + 0.5) / (gapFillersPerLine + 1); // Position in gaps
          const x = line.start.x + dx * ratio;
          const y = line.start.y + dy * ratio;
          
          const particle = this.particleSystem.particles[particlesAssigned];
          particle.x = x;
          particle.y = y;
          particle.speedX = (Math.random() - 0.5) * 0.1; // Even slower speed
          particle.speedY = (Math.random() - 0.5) * 0.1;
          particle.isPartOfDrawing = true;
          particlesAssigned++;
        }
      });
    }
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