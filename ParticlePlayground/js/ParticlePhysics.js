import { calculateDistance } from 'utils';

export function applyInteraction(particle, mouseX, mouseY, interactionMode, interactionStrength, interactionRadius) {
  if (mouseX === null || mouseY === null || interactionMode === 'none') {
    return false;
  }

  const dx = particle.x - mouseX;
  const dy = particle.y - mouseY;
  const distance = calculateDistance(particle.x, particle.y, mouseX, mouseY);

  if (distance >= interactionRadius) {
    return false;
  }

  const force = (interactionRadius - distance) / interactionRadius;
  
  switch (interactionMode) {
    case 'pulse':
      particle.radius = 4 + Math.sin(Date.now() * 0.01) * 2 * interactionStrength;
      particle.highlighted = true;
      break;
    case 'explode':
      particle.speedX += dx * 0.05 * force * interactionStrength;
      particle.speedY += dy * 0.05 * force * interactionStrength;
      particle.highlighted = true;
      break;
    case 'attract':
      particle.speedX -= dx * 0.01 * force * interactionStrength;
      particle.speedY -= dy * 0.01 * force * interactionStrength;
      particle.highlighted = true;
      break;
    case 'repel':
      particle.speedX += dx * 0.02 * force * interactionStrength;
      particle.speedY += dy * 0.02 * force * interactionStrength;
      particle.highlighted = true;
      break;
    case 'swirl':
      const angle = Math.atan2(dy, dx);
      const rotationSpeed = 0.1 * interactionStrength;
      particle.speedX = Math.cos(angle + Math.PI/2) * rotationSpeed * force;
      particle.speedY = Math.sin(angle + Math.PI/2) * rotationSpeed * force;
      particle.highlighted = true;
      break;
    case 'scatter':
      particle.speedX += (Math.random() - 0.5) * 0.5 * force * interactionStrength;
      particle.speedY += (Math.random() - 0.5) * 0.5 * force * interactionStrength;
      particle.highlighted = true;
      break;
    case 'gravitate':
      const gravitationalPull = 0.05 * interactionStrength;
      particle.speedX -= dx * gravitationalPull * force;
      particle.speedY -= dy * gravitationalPull * force;
      particle.highlighted = true;
      break;
    case 'merge':
      particle.radius = Math.min(particle.radius + 0.5 * force * interactionStrength, 20);
      particle.speedX *= 0.9;
      particle.speedY *= 0.9;
      particle.color = particle.blendColors(particle.color, 'white', 0.2 * force);
      particle.highlighted = true;
      break;
    case 'split':
      if (particle.radius > 2) {
        particle.radius = Math.max(particle.radius - 0.3 * force * interactionStrength, 1);
        particle.speedX *= 1.1;
        particle.speedY *= 1.1;
        particle.color = particle.blendColors(particle.color, 'red', 0.2 * force);
      }
      particle.highlighted = true;
      break;
    case 'connect':
      particle.highlighted = true;
      break;
    case 'warp':
      // Time-space warp effect
      particle.x = particle.x + (Math.sin(Date.now() * 0.001) * 5 * force);
      particle.y = particle.y + (Math.cos(Date.now() * 0.001) * 5 * force);
      particle.highlighted = true;
      break;
    case 'freeze':
      // Slow down particles gradually
      particle.speedX *= (1 - 0.1 * force * interactionStrength);
      particle.speedY *= (1 - 0.1 * force * interactionStrength);
      particle.highlighted = true;
      break;
    case 'accelerate':
      // Speed up particles
      particle.speedX *= (1 + 0.05 * force * interactionStrength);
      particle.speedY *= (1 + 0.05 * force * interactionStrength);
      particle.highlighted = true;
      break;
    case 'orbit':
      // Make particles orbit around the mouse
      const orbitAngle = Math.atan2(dy, dx);
      const orbitDistance = Math.max(distance, 20);
      const orbitSpeed = 0.02 * interactionStrength;
      
      // Calculate target position on the orbit
      const targetX = mouseX + Math.cos(orbitAngle + orbitSpeed) * orbitDistance;
      const targetY = mouseY + Math.sin(orbitAngle + orbitSpeed) * orbitDistance;
      
      // Move towards the target position
      particle.speedX += (targetX - particle.x) * 0.1;
      particle.speedY += (targetY - particle.y) * 0.1;
      particle.highlighted = true;
      break;
    case 'colorShift':
      // Gradually shift color based on position
      const hue = (Math.atan2(dy, dx) / Math.PI * 180) + 180;
      particle.color = `hsl(${hue}, 100%, 50%)`;
      particle.highlighted = true;
      break;
    case 'wave':
      // Create wave-like motion
      const wavePhase = Date.now() * 0.001;
      const waveAmplitude = 2 * interactionStrength;
      particle.speedY += Math.sin(wavePhase + particle.x * 0.01) * waveAmplitude * force;
      particle.highlighted = true;
      break;
  }
  return true;
}

export function handleCollision(particle1, particle2) {
  const dx = particle1.x - particle2.x;
  const dy = particle1.y - particle2.y;
  const distance = Math.hypot(dx, dy);
  const minDistance = particle1.radius + particle2.radius;

  if (distance < minDistance) {
    // Calculate angle of collision
    const angle = Math.atan2(dy, dx);
    
    // Calculate masses
    const m1 = particle1.mass;
    const m2 = particle2.mass;
    const totalMass = m1 + m2;

    // Calculate velocities before collision
    const v1x = particle1.speedX;
    const v1y = particle1.speedY;
    const v2x = particle2.speedX;
    const v2y = particle2.speedY;

    // Elastic collision formulas
    // Velocity after collision for particle 1
    particle1.speedX = (v1x * (m1 - m2) + 2 * m2 * v2x) / totalMass;
    particle1.speedY = (v1y * (m1 - m2) + 2 * m2 * v2y) / totalMass;

    // Velocity after collision for particle 2
    particle2.speedX = (v2x * (m2 - m1) + 2 * m1 * v1x) / totalMass;
    particle2.speedY = (v2y * (m2 - m1) + 2 * m1 * v1y) / totalMass;

    // Separate the particles to prevent sticking
    const overlap = minDistance - distance;
    const separationX = overlap * Math.cos(angle);
    const separationY = overlap * Math.sin(angle);
    
    particle1.x += separationX * (m2 / totalMass);
    particle1.y += separationY * (m2 / totalMass);
    particle2.x -= separationX * (m1 / totalMass);
    particle2.y -= separationY * (m1 / totalMass);

    // Energy loss (not perfectly elastic)
    particle1.speedX *= 0.95;
    particle1.speedY *= 0.95;
    particle2.speedX *= 0.95;
    particle2.speedY *= 0.95;

    return true;
  }
  return false;
}

export function handleObjectCollision(particle, object) {
  const dx = particle.x - object.x;
  const dy = particle.y - object.y;
  const distance = Math.hypot(dx, dy);
  const minDistance = particle.radius + object.size;

  if (distance < minDistance) {
    // Improved collision response
    const angle = Math.atan2(dy, dx);
    const totalMass = particle.mass + object.mass;
    
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

    return true;
  }
  return false;
}

export function checkPhysicsObjectCollision(obj1, obj2) {
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

    return true;
  }
  return false;
}