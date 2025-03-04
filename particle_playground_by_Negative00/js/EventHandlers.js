import { PhysicsObject } from './PhysicsObject.js';
import { InteractiveCircle } from './InteractiveCircle.js';

export function setupControlsEventHandlers(system) {
  const particleCountSlider = document.getElementById('particle-count');
  const particleTypeSelect = document.getElementById('particle-type');
  const resetBtn = document.getElementById('reset-btn');
  const interactionModeSelect = document.getElementById('interaction-mode');
  const particleMassSlider = document.getElementById('particle-mass'); 
  const gravityToggle = document.getElementById('gravity-toggle');

  particleCountSlider.addEventListener('input', (e) => {
    system.particleCount = parseInt(e.target.value);
    system.initParticles();
    system.updateValueDisplays();
  });

  particleTypeSelect.addEventListener('change', (e) => {
    system.particleType = e.target.value;
    system.initParticles();
  });
  
  particleMassSlider.addEventListener('input', (e) => {
    system.particleMass = parseFloat(e.target.value);
    system.particles.forEach(particle => particle.mass = system.particleMass);
    document.getElementById('particle-mass-value').textContent = system.particleMass.toFixed(1); 
  });
  
  resetBtn.addEventListener('click', () => system.initParticles());

  interactionModeSelect.addEventListener('change', (e) => {
    system.interactionMode = e.target.value;
  });

  gravityToggle.addEventListener('change', (e) => {
    system.particleGravity = e.target.checked;
    system.particles.forEach(particle => particle.hasGravity = system.particleGravity);
    document.getElementById('gravity-toggle-value').textContent = system.particleGravity ? 'On' : 'Off';
  });

  const interactionStrengthSlider = document.getElementById('interaction-strength');
  const interactionRadiusSlider = document.getElementById('interaction-radius');
  const connectionRadiusSlider = document.getElementById('connection-radius');

  interactionStrengthSlider.addEventListener('input', (e) => {
    system.interactionStrength = parseFloat(e.target.value);
    system.updateValueDisplays();
  });

  interactionRadiusSlider.addEventListener('input', (e) => {
    system.interactionRadius = parseFloat(e.target.value);
    system.updateValueDisplays();
  });

  connectionRadiusSlider.addEventListener('input', (e) => {
    system.connectionRadius = parseFloat(e.target.value);
    system.updateValueDisplays();
  });

  const simulationSpeedSlider = document.getElementById('simulation-speed');
  simulationSpeedSlider.addEventListener('input', (e) => {
    system.simulationSpeed = parseFloat(e.target.value);
    system.updateValueDisplays();
  });
  
  const particleColorPicker = document.getElementById('particle-color');
  particleColorPicker.addEventListener('input', (e) => {
    system.customParticleColor = e.target.value;
    document.getElementById('particle-color-value').textContent = system.customParticleColor;
    system.particles.forEach(particle => {
      particle.customColor = system.customParticleColor;
    });
  });
  
  const resetParticleColorBtn = document.getElementById('reset-particle-color');
  resetParticleColorBtn.addEventListener('click', () => {
    system.customParticleColor = null;
    document.getElementById('particle-color-value').textContent = 'Default';
    system.particles.forEach(particle => {
      particle.customColor = null;
    });
  });
  
  const connectionColorPicker = document.getElementById('connection-color');
  connectionColorPicker.addEventListener('input', (e) => {
    system.customConnectionColor = e.target.value;
    document.getElementById('connection-color-value').textContent = system.customConnectionColor;
  });
  
  const resetConnectionColorBtn = document.getElementById('reset-connection-color');
  resetConnectionColorBtn.addEventListener('click', () => {
    system.customConnectionColor = null;
    document.getElementById('connection-color-value').textContent = 'Default';
  });
  
  const enableTrailsToggle = document.getElementById('enable-trails');
  enableTrailsToggle.addEventListener('change', (e) => {
    system.enableTrails = e.target.checked;
    system.particles.forEach(particle => {
      particle.trailEnabled = system.enableTrails;
    });
    document.getElementById('trail-toggle-value').textContent = system.enableTrails ? 'On' : 'Off';
    document.getElementById('trail-settings').style.display = system.enableTrails ? 'block' : 'none';
  });
  
  const trailLengthSlider = document.getElementById('trail-length');
  trailLengthSlider.addEventListener('input', (e) => {
    system.trailLength = parseInt(e.target.value);
    system.particles.forEach(particle => {
      particle.maxTrailLength = system.trailLength;
    });
    document.getElementById('trail-length-value').textContent = system.trailLength;
  });
  
  const collisionEffectRadios = document.querySelectorAll('input[name="collision-effect"]');
  collisionEffectRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      if (e.target.checked) {
        system.collisionEffect = e.target.value;
        system.particles.forEach(particle => {
          particle.collisionEffect = system.collisionEffect;
        });
      }
    });
  });
  
  const particleLifespanSlider = document.getElementById('particle-lifespan');
  particleLifespanSlider.addEventListener('input', (e) => {
    system.particleLifespan = parseInt(e.target.value);
    document.getElementById('particle-lifespan-value').textContent = 
      system.particleLifespan > 0 ? `${system.particleLifespan}` : "Infinite";
  });
  
  const clearParticlesBtn = document.getElementById('clear-particles-btn');
  clearParticlesBtn.addEventListener('click', () => {
    system.clearAllParticles();
  });
  
  // Info section toggle
  const infoSection = document.getElementById('info-section');
  const infoMinimizeBtn = document.getElementById('info-minimize-btn');
  
  infoMinimizeBtn.addEventListener('click', () => {
    infoSection.classList.toggle('minimized');
    infoMinimizeBtn.textContent = infoSection.classList.contains('minimized') ? '+' : '−';
  });
}

export function setupSpawnControls(system) {
  const spawnCircle = document.getElementById('spawn-circle');
  const spawnSquare = document.getElementById('spawn-square');
  const spawnTriangle = document.getElementById('spawn-triangle');
  const spawnSizeSlider = document.getElementById('spawn-size');
  const spawnMassSlider = document.getElementById('spawn-mass');

  const spawnObject = (type, e) => {
    const rect = system.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const obj = new PhysicsObject(x, y, type, system.spawnSize, system.spawnMass, system.canvas);
    system.physicsObjects.push(obj);
  };

  spawnCircle.addEventListener('click', () => {
    const mouseHandler = (e) => {
      spawnObject('circle', e);
      system.canvas.removeEventListener('click', mouseHandler);
    };
    system.canvas.addEventListener('click', mouseHandler);
  });

  spawnSquare.addEventListener('click', () => {
    const mouseHandler = (e) => {
      spawnObject('square', e);
      system.canvas.removeEventListener('click', mouseHandler);
    };
    system.canvas.addEventListener('click', mouseHandler);
  });

  spawnTriangle.addEventListener('click', () => {
    const mouseHandler = (e) => {
      spawnObject('triangle', e);
      system.canvas.removeEventListener('click', mouseHandler);
    };
    system.canvas.addEventListener('click', mouseHandler);
  });

  spawnSizeSlider.addEventListener('input', (e) => {
    system.spawnSize = parseInt(e.target.value);
    document.getElementById('spawn-size-value').textContent = `${system.spawnSize}px`;
  });

  spawnMassSlider.addEventListener('input', (e) => {
    system.spawnMass = parseFloat(e.target.value);
    document.getElementById('spawn-mass-value').textContent = system.spawnMass.toFixed(1);
  });
}

export function setupPopupMenu(system) {
  const popup = document.getElementById('circle-popup');
  const overlay = document.getElementById('overlay');
  const spawnBtn = document.getElementById('spawn-circle-btn');
  const cancelBtn = document.getElementById('cancel-circle-btn');
  const strengthSlider = document.getElementById('popup-strength');
  const radiusSlider = document.getElementById('popup-radius');
  const physicsToggle = document.getElementById('popup-physics-toggle');
  const strengthValue = document.getElementById('popup-strength-value');
  const radiusValue = document.getElementById('popup-radius-value');

  // Add keyboard shortcut for showing popup
  window.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'r') {
      popup.classList.add('active');
      overlay.classList.add('active');
    }
  });

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
      system.mouseX || system.canvas.width/2,
      system.mouseY || system.canvas.height/2,
      system.canvas,
      mode,
      strength,
      radius,
      hasPhysics
    );
    system.interactiveCircles.push(circle);
    
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