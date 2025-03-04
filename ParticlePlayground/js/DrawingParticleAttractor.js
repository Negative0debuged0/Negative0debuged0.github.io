export class DrawingParticleAttractor {
  constructor(lines) {
    this.lines = lines;
    this.attractionStrength = 1.2; 
    this.snapDistance = 8;  
    this.returnForce = 0.3; 
  }
  
  applyForceToParticle(particle) {
    if (this.lines.length === 0) return;
    
    // Only apply to particles that are part of the drawing
    if (!particle.isPartOfDrawing) return;
    
    // Find the closest point on any line
    let closestPoint = null;
    let minDistance = Infinity;
    
    for (const line of this.lines) {
      const point = this.findClosestPointOnLine(particle, line);
      const distance = Math.hypot(point.x - particle.x, point.y - particle.y);
      
      if (distance < minDistance) {
        minDistance = distance;
        closestPoint = point;
      }
    }
    
    // Apply force toward the closest point
    if (closestPoint) {
      const dx = closestPoint.x - particle.x;
      const dy = closestPoint.y - particle.y;
      const distance = Math.hypot(dx, dy);
      
      // Progressive force - stronger when far from the line
      const distanceFactor = 1 + Math.min(5, distance * 0.05);
      const force = Math.min(2, this.attractionStrength * distanceFactor);
      
      // Apply force toward the line with stronger return for distant particles
      particle.speedX += dx * force * this.returnForce;
      particle.speedY += dy * force * this.returnForce;
      
      // Dampen speed more aggressively to prevent oscillation
      particle.speedX *= 0.9;
      particle.speedY *= 0.9;
      
      // If very close to the line, snap to it and reduce speed significantly
      if (distance < this.snapDistance) {
        particle.speedX *= 0.7;
        particle.speedY *= 0.7;
        
        // When extremely close, add small random movement to prevent stacking
        if (distance < 2) {
          particle.speedX += (Math.random() - 0.5) * 0.05;
          particle.speedY += (Math.random() - 0.5) * 0.05;
        }
      }
    }
  }
  
  findClosestPointOnLine(particle, line) {
    const x1 = line.start.x;
    const y1 = line.start.y;
    const x2 = line.end.x;
    const y2 = line.end.y;
    
    // Calculate the position of closest point on line segment
    const A = particle.x - x1;
    const B = particle.y - y1;
    const C = x2 - x1;
    const D = y2 - y1;
    
    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    let param = -1;
    
    if (lenSq !== 0) {
      param = dot / lenSq;
    }
    
    let xx, yy;
    
    if (param < 0) {
      xx = x1;
      yy = y1;
    } else if (param > 1) {
      xx = x2;
      yy = y2;
    } else {
      xx = x1 + param * C;
      yy = y1 + param * D;
    }
    
    return { x: xx, y: yy };
  }
}