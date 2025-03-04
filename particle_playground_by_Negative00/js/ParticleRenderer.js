import { hexToRgb } from './ColorUtils.js';

export function drawParticle(ctx, particle) {
  const safeRadius = Math.max(0.1, particle.radius);
  
  // Draw trail if enabled
  if (particle.trailEnabled && particle.trail.length > 1) {
    drawParticleTrail(ctx, particle, safeRadius);
  }

  // Apply opacity if lifespan is set
  const finalOpacity = particle.lifespan > 0 ? particle.opacity : 1;
  
  // Apply special rendering for certain particle types
  if (particle.type === 'quantum' && Math.random() < 0.3) {
    // Quantum particles occasionally appear in multiple places
    drawQuantumParticle(ctx, particle, safeRadius, finalOpacity);
  } else if (particle.type === 'crystal') {
    // Crystal particles are more angular
    drawCrystalParticle(ctx, particle, safeRadius, finalOpacity);
  } else {
    // Standard circular particle for other types
    drawStandardParticle(ctx, particle, safeRadius, finalOpacity);
  }
}

function drawParticleTrail(ctx, particle, radius) {
  ctx.beginPath();
  
  // Safety check for empty trail
  if (!particle.trail.length) return;
  
  ctx.moveTo(particle.trail[0].x, particle.trail[0].y);
  
  for (let i = 1; i < particle.trail.length; i++) {
    if (!isFinite(particle.trail[i].x) || !isFinite(particle.trail[i].y)) continue;
    ctx.lineTo(particle.trail[i].x, particle.trail[i].y);
  }
  
  // Check if trail exists and has valid coordinates before creating gradient
  if (particle.trail.length < 2 || 
      !isFinite(particle.trail[0].x) || !isFinite(particle.trail[0].y) || 
      !isFinite(particle.x) || !isFinite(particle.y)) {
    return;  // Skip drawing trail if coordinates aren't valid
  }
  
  // Create gradient for trail with more safety checks
  try {
    // Make sure we're using valid coordinates for gradient endpoints
    let startX = particle.trail[0].x;
    let startY = particle.trail[0].y;
    let endX = particle.x;
    let endY = particle.y;
    
    // Extra validation to ensure numbers are finite
    if (!isFinite(startX)) startX = 0;
    if (!isFinite(startY)) startY = 0;
    if (!isFinite(endX)) endX = 0;
    if (!isFinite(endY)) endY = 0;
    
    const gradient = ctx.createLinearGradient(startX, startY, endX, endY);
    
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
    
    // Customize trail colors based on particle type
    if (particle.type === 'fire') {
      gradient.addColorStop(1, 'rgba(255, 100, 0, 0.7)');
    } else if (particle.type === 'cosmic') {
      gradient.addColorStop(1, 'rgba(180, 100, 255, 0.5)');
    } else if (particle.type === 'plasma') {
      gradient.addColorStop(1, 'rgba(0, 200, 255, 0.6)');
    } else {
      gradient.addColorStop(1, particle.color);
    }
    
    ctx.strokeStyle = gradient;
  } catch (e) {
    // Fallback if gradient creation fails
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    console.warn('Gradient creation failed', e);
  }
  
  ctx.lineWidth = radius * 0.8;
  ctx.stroke();
}

function drawStandardParticle(ctx, particle, radius, opacity) {
  ctx.beginPath();
  ctx.arc(particle.x, particle.y, radius, 0, Math.PI * 2);
  
  if (particle.highlighted) {
    ctx.fillStyle = 'white';
  } else if (particle.customColor) {
    // Use the custom color with opacity if set
    const color = hexToRgb(particle.customColor);
    ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity})`;
  } else {
    // If the color is HSL, extract it to add opacity
    if (particle.color.startsWith('hsl')) {
      const hslMatch = particle.color.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
      if (hslMatch) {
        const [_, h, s, l] = hslMatch;
        ctx.fillStyle = `hsla(${h}, ${s}%, ${l}%, ${opacity})`;
      } else {
        ctx.fillStyle = particle.color;
      }
    } else {
      ctx.fillStyle = particle.color;
    }
  }
  
  ctx.fill();
}

function drawQuantumParticle(ctx, particle, radius, opacity) {
  // Draw main particle
  ctx.beginPath();
  ctx.arc(particle.x, particle.y, radius, 0, Math.PI * 2);
  
  // Quantum particles have a special glow
  if (particle.highlighted) {
    ctx.fillStyle = 'white';
  } else {
    ctx.fillStyle = `hsla(280, 100%, 50%, ${opacity})`;
  }
  ctx.fill();
  
  // Draw "ghost" particles to represent quantum uncertainty
  ctx.globalAlpha = 0.3 * opacity;
  ctx.beginPath();
  ctx.arc(particle.x + (Math.random() - 0.5) * 20, particle.y + (Math.random() - 0.5) * 20, radius * 0.7, 0, Math.PI * 2);
  ctx.fillStyle = `hsla(290, 100%, 70%, ${opacity})`;
  ctx.fill();
  
  ctx.beginPath();
  ctx.arc(particle.x + (Math.random() - 0.5) * 15, particle.y + (Math.random() - 0.5) * 15, radius * 0.5, 0, Math.PI * 2);
  ctx.fillStyle = `hsla(270, 100%, 80%, ${opacity})`;
  ctx.fill();
  ctx.globalAlpha = 1.0;
}

function drawCrystalParticle(ctx, particle, radius, opacity) {
  // Draw crystal-shaped particle
  ctx.beginPath();
  const sides = 6;
  const angleStep = (Math.PI * 2) / sides;
  
  for (let i = 0; i < sides; i++) {
    const angle = i * angleStep;
    const x = particle.x + Math.cos(angle) * radius;
    const y = particle.y + Math.sin(angle) * radius;
    
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  
  ctx.closePath();
  
  if (particle.highlighted) {
    ctx.fillStyle = 'white';
  } else if (particle.customColor) {
    const color = hexToRgb(particle.customColor);
    ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity})`;
  } else {
    // Add some translucency for crystal effect
    ctx.fillStyle = `hsla(170, 90%, 70%, ${opacity * 0.8})`;
  }
  
  ctx.fill();
  
  // Add a highlight effect
  ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.5})`;
  ctx.lineWidth = 1;
  ctx.stroke();
}

export function drawConnections(ctx, particles, connectionRadius, getConnectionColor) {
  // Performance optimization - use a grid-based approach for larger particle counts
  if (particles.length > 150) {
    drawConnectionsOptimized(ctx, particles, connectionRadius, getConnectionColor);
    return;
  }

  for (let i = 0; i < particles.length; i++) {
    const p1 = particles[i];
    
    for (let j = i + 1; j < particles.length; j++) {
      const p2 = particles[j];
      const distance = Math.hypot(p1.x - p2.x, p1.y - p2.y);

      if (distance < connectionRadius) {
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        
        const alpha = 1 - distance / connectionRadius;
        // Use custom connection color if provided
        if (p1.particleSystem && p1.particleSystem.customConnectionColor) {
          ctx.strokeStyle = `${p1.particleSystem.customConnectionColor}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`;
        } else {
          ctx.strokeStyle = getConnectionColor(p1.type, p2.type, alpha);
        }
        ctx.lineWidth = 0.5; // Thinner connection lines
        ctx.stroke();
      }
    }
    
    if (p1.linkedParticle) {
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p1.linkedParticle.x, p1.linkedParticle.y);
      ctx.strokeStyle = 'rgba(255, 0, 0, 0.8)'; 
      ctx.lineWidth = 1.5; // Slightly thinner linked particle connection
      ctx.stroke();
      ctx.lineWidth = 0.5; // Reset line width
    }
  }
}

// Add a new optimized draw connections method for better performance
function drawConnectionsOptimized(ctx, particles, connectionRadius, getConnectionColor) {
  // Create a spatial grid for faster neighbor lookup
  const cellSize = connectionRadius;
  const grid = {};
  
  // Sort particles into grid cells
  particles.forEach(p => {
    const cellX = Math.floor(p.x / cellSize);
    const cellY = Math.floor(p.y / cellSize);
    const cellId = `${cellX},${cellY}`;
    
    if (!grid[cellId]) {
      grid[cellId] = [];
    }
    grid[cellId].push(p);
  });
  
  // For each particle, only check neighbors in adjacent cells
  particles.forEach(p1 => {
    const cellX = Math.floor(p1.x / cellSize);
    const cellY = Math.floor(p1.y / cellSize);
    
    // Check the current cell and 8 neighboring cells
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        const neighborCellId = `${cellX + i},${cellY + j}`;
        const cellParticles = grid[neighborCellId];
        
        if (cellParticles) {
          cellParticles.forEach(p2 => {
            if (p1 !== p2) {
              const distance = Math.hypot(p1.x - p2.x, p1.y - p2.y);
              
              if (distance < connectionRadius) {
                // Only draw connection once (ensure we don't duplicate lines)
                if (p1.index < p2.index) {
                  ctx.beginPath();
                  ctx.moveTo(p1.x, p1.y);
                  ctx.lineTo(p2.x, p2.y);
                  
                  const alpha = 1 - distance / connectionRadius;
                  // Use custom connection color if provided
                  if (p1.particleSystem && p1.particleSystem.customConnectionColor) {
                    ctx.strokeStyle = `${p1.particleSystem.customConnectionColor}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`;
                  } else {
                    ctx.strokeStyle = getConnectionColor(p1.type, p2.type, alpha);
                  }
                  ctx.lineWidth = 0.5;
                  ctx.stroke();
                }
              }
            }
          });
        }
      }
    }
    
    // Draw linked particle connection
    if (p1.linkedParticle) {
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p1.linkedParticle.x, p1.linkedParticle.y);
      ctx.strokeStyle = 'rgba(255, 0, 0, 0.8)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.lineWidth = 0.5;
    }
  });
}

export function drawPhysicsObject(ctx, obj) {
  ctx.save();
  ctx.translate(obj.x, obj.y);
  ctx.rotate(obj.rotation);
  ctx.fillStyle = obj.color;

  switch (obj.type) {
    case 'circle':
      ctx.beginPath();
      ctx.arc(0, 0, obj.size, 0, Math.PI * 2);
      ctx.fill();
      break;
    case 'square':
      ctx.fillRect(-obj.size, -obj.size, obj.size * 2, obj.size * 2);
      break;
    case 'triangle':
      ctx.beginPath();
      ctx.moveTo(0, -obj.size);
      ctx.lineTo(obj.size, obj.size);
      ctx.lineTo(-obj.size, obj.size);
      ctx.closePath();
      ctx.fill();
      break;
  }

  ctx.restore();
}

export function drawInteractiveCircle(ctx, circle) {
  ctx.beginPath();
  ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
  ctx.fillStyle = circle.color;
  ctx.fill();
  
  // Add a subtle glow effect based on the interaction mode
  ctx.beginPath();
  ctx.arc(circle.x, circle.y, circle.radius + 5, 0, Math.PI * 2);
  
  let glowColor;
  switch(circle.interactionMode) {
    case 'attract': glowColor = 'rgba(0, 255, 0, 0.2)'; break;
    case 'repel': glowColor = 'rgba(255, 0, 0, 0.2)'; break;
    case 'swirl': glowColor = 'rgba(0, 100, 255, 0.2)'; break;
    case 'pulse': glowColor = 'rgba(255, 255, 0, 0.2)'; break;
    case 'explode': glowColor = 'rgba(255, 100, 0, 0.2)'; break;
    case 'gravitate': glowColor = 'rgba(100, 0, 255, 0.2)'; break;
    default: glowColor = 'rgba(255, 255, 255, 0.1)';
  }
  
  ctx.fillStyle = glowColor;
  ctx.fill();
}