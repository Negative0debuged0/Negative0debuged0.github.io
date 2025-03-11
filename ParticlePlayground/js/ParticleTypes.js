import { getRandomColor } from './ColorUtils.js';

export function getColorForType(type, customColor) {
  // Use custom color if provided
  if (customColor) {
    return customColor;
  }
  
  switch (type) {
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
    case 'fire':
      return `hsl(${15 + Math.random() * 25}, 100%, 50%)`;
    case 'water':
      return `hsl(${190 + Math.random() * 30}, 80%, 60%)`;
    case 'crystal':
      return `hsla(${170 + Math.random() * 40}, 90%, 70%, 0.8)`;
    default:
      return getRandomColor();
  }
}

export function setupParticlePropertiesByType(particle) {
  // Type-specific properties with unique behaviors
  switch (particle.type) {
    case 'plasma':
      particle.energyFactor = Math.random();
      particle.radius = 3 + Math.random() * 3;
      particle.mass = 0.8;
      particle.hasGravity = false;
      particle.trailEnabled = true;
      particle.maxTrailLength = 15;
      break;
    case 'electric':
      particle.charge = Math.random() > 0.5 ? 1 : -1;
      particle.radius = 2 + Math.random() * 2;
      particle.mass = 0.5;
      particle.hasGravity = false;
      particle.speedX *= 1.5;
      particle.speedY *= 1.5;
      break;
    case 'organic':
      particle.flexibility = Math.random();
      particle.radius = 4 + Math.random() * 4;
      particle.mass = 1.2;
      particle.hasGravity = true;
      particle.speedX *= 0.7;
      particle.speedY *= 0.7;
      break;
    case 'cosmic':
      particle.gravitationalFactor = Math.random();
      particle.radius = 1 + Math.random() * 6;
      particle.mass = 0.3 + Math.random() * 1.5;
      particle.hasGravity = false;
      particle.trailEnabled = true;
      particle.maxTrailLength = 30;
      break;
    case 'quantum':
      particle.quantumFactor = Math.random();
      particle.radius = 1 + Math.random() * 3;
      particle.mass = 0.2;
      particle.hasGravity = false;
      particle.speedX *= 2;
      particle.speedY *= 2;
      break;
    case 'magnetic':
      particle.magneticStrength = Math.random();
      particle.radius = 3 + Math.random() * 3;
      particle.mass = 1.5;
      particle.hasGravity = true;
      break;
    case 'fire':
      particle.heatLevel = Math.random();
      particle.radius = 2 + Math.random() * 4;
      particle.mass = 0.3;
      particle.hasGravity = false;
      particle.trailEnabled = true;
      particle.maxTrailLength = 10;
      break;
    case 'water':
      particle.viscosity = Math.random();
      particle.radius = 3 + Math.random() * 3;
      particle.mass = 1.1;
      particle.hasGravity = true;
      particle.speedX *= 0.8;
      particle.speedY *= 0.8;
      break;
    case 'crystal':
      particle.refractiveIndex = 0.5 + Math.random() * 0.5;
      particle.radius = 4 + Math.random() * 2;
      particle.mass = 1.8;
      particle.hasGravity = true;
      particle.speedX *= 0.6;
      particle.speedY *= 0.6;
      break;
  }
}

export function getConnectionColor(type1, type2, alpha) {
  if (type1 === type2) {
    // For same particle types, use a color based on the particle type
    switch (type1) {
      case 'plasma': return `rgba(0, 200, 255, ${alpha})`;
      case 'electric': return `rgba(100, 100, 255, ${alpha})`;
      case 'organic': return `rgba(100, 255, 100, ${alpha})`;
      case 'cosmic': return `rgba(180, 100, 255, ${alpha})`;
      case 'quantum': return `rgba(255, 100, 255, ${alpha})`;
      case 'magnetic': return `rgba(255, 100, 100, ${alpha})`;
      case 'fire': return `rgba(255, 120, 50, ${alpha})`;
      case 'water': return `rgba(50, 150, 255, ${alpha})`;
      case 'crystal': return `rgba(180, 255, 230, ${alpha})`;
      default: return `rgba(255, 255, 255, ${alpha})`;
    }
  } else {
    // For different particle types, use white
    return `rgba(255, 255, 255, ${alpha})`;
  }
}