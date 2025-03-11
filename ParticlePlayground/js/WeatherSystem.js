export class WeatherSystem {
  constructor(particleSystem) {
    this.particleSystem = particleSystem;
    this.canvas = particleSystem.canvas;
    this.ctx = particleSystem.canvas.getContext('2d');
    this.isActive = false;
    this.weatherType = 'none'; // none, rain, snow, storm, wind, fog
    this.intensity = 0.5;
    this.particles = [];
    this.windDirection = 0; // radians
    this.windStrength = 0.2;
    this.lastLightningTime = 0;
    this.lightningActive = false;
    this.lightningOpacity = 0;
    this.fogDensity = 0.3;
    this.fogColor = 'rgba(200, 200, 255, 0.01)';
    this.setupWeatherControls();
    
    // Add keyboard shortcut for weather toggle
    window.addEventListener('keydown', (e) => {
      if (e.key.toLowerCase() === 'w') {
        this.toggleWeather();
      }
    });
  }
  
  setupWeatherControls() {
    const weatherSection = document.createElement('div');
    weatherSection.className = 'settings-group';
    weatherSection.innerHTML = `
      <div class="settings-group-title">Weather System</div>
      <div class="settings-group-content">
        <div class="checkbox-wrapper tooltip">
          <input type="checkbox" id="weather-toggle">
          <label for="weather-toggle">Enable Weather</label>
          <span class="parameter-value" id="weather-toggle-value">Off</span>
          <span class="tooltip-text">Add environmental effects to the simulation</span>
        </div>
        
        <label class="tooltip">
          Weather Type:
          <select id="weather-type">
            <option value="none">None</option>
            <option value="rain">Rain</option>
            <option value="snow">Snow</option>
            <option value="storm">Thunderstorm</option>
            <option value="wind">Wind</option>
            <option value="fog">Fog</option>
          </select>
          <span class="tooltip-text">Select different weather phenomena</span>
        </label>
        
        <label class="tooltip">
          Intensity: <span class="parameter-value" id="weather-intensity-value">0.5</span>
          <span class="tooltip-text">Control strength of weather effects</span>
          <input type="range" id="weather-intensity" min="0.1" max="1.0" value="0.5" step="0.1">
        </label>
        
        <label class="tooltip" id="wind-direction-container" style="display:none;">
          Wind Direction: <span class="parameter-value" id="wind-direction-value">0°</span>
          <span class="tooltip-text">Set wind direction in degrees</span>
          <input type="range" id="wind-direction" min="0" max="360" value="0" step="15">
        </label>
        
        <p style="font-size: 0.8em; color: #aaa; margin-top: 10px;">
          Press W to quickly toggle weather on/off.
        </p>
      </div>
    `;
    
    const controlsContent = document.querySelector('.controls-content');
    if (controlsContent) {
      controlsContent.appendChild(weatherSection);
    }
    
    // Set up event listeners for controls
    const weatherToggle = document.getElementById('weather-toggle');
    const weatherToggleValue = document.getElementById('weather-toggle-value');
    const weatherType = document.getElementById('weather-type');
    const intensitySlider = document.getElementById('weather-intensity');
    const intensityValue = document.getElementById('weather-intensity-value');
    const windDirectionSlider = document.getElementById('wind-direction');
    const windDirectionValue = document.getElementById('wind-direction-value');
    const windDirectionContainer = document.getElementById('wind-direction-container');
    
    weatherToggle.addEventListener('change', () => {
      this.isActive = weatherToggle.checked;
      weatherToggleValue.textContent = this.isActive ? 'On' : 'Off';
      
      if (this.isActive) {
        this.startWeather(weatherType.value);
      } else {
        this.stopWeather();
      }
    });
    
    weatherType.addEventListener('change', () => {
      this.weatherType = weatherType.value;
      
      // Show wind direction control only for wind weather
      windDirectionContainer.style.display = this.weatherType === 'wind' ? 'block' : 'none';
      
      if (this.isActive) {
        this.restartWeather();
      }
    });
    
    intensitySlider.addEventListener('input', () => {
      this.intensity = parseFloat(intensitySlider.value);
      intensityValue.textContent = this.intensity.toFixed(1);
      
      if (this.isActive) {
        this.restartWeather();
      }
    });
    
    windDirectionSlider.addEventListener('input', () => {
      const degrees = parseInt(windDirectionSlider.value);
      this.windDirection = (degrees * Math.PI) / 180;
      windDirectionValue.textContent = `${degrees}°`;
      
      if (this.isActive && this.weatherType === 'wind') {
        this.restartWeather();
      }
    });
  }
  
  toggleWeather() {
    const weatherToggle = document.getElementById('weather-toggle');
    weatherToggle.checked = !weatherToggle.checked;
    weatherToggle.dispatchEvent(new Event('change'));
  }
  
  startWeather(type) {
    this.weatherType = type;
    this.particles = [];
    
    // Create initial weather particles based on type
    const particleCount = Math.floor(this.canvas.width * this.canvas.height / 10000 * this.intensity);
    
    for (let i = 0; i < particleCount; i++) {
      this.createWeatherParticle();
    }
    
    if (this.weatherType === 'fog') {
      // For fog, create background overlay
      this.fogDensity = this.intensity * 0.5;
    }
  }
  
  stopWeather() {
    this.particles = [];
    this.weatherType = 'none';
    this.lightningActive = false;
  }
  
  createWeatherParticle() {
    let particle = {
      x: Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height,
      size: 0,
      speed: 0,
      color: '',
      angle: 0,
      lifetime: 0,
      maxLifetime: 0
    };
    
    // Configure particle based on weather type
    switch (this.weatherType) {
      case 'rain':
        particle.x = Math.random() * (this.canvas.width + 200) - 100;
        particle.y = -20;
        particle.size = 2 + Math.random() * 3;
        particle.speed = 10 + Math.random() * 10 * this.intensity;
        particle.color = 'rgba(120, 180, 255, 0.7)';
        particle.angle = Math.PI / 2 + (Math.random() * 0.2 - 0.1);
        break;
        
      case 'snow':
        particle.x = Math.random() * (this.canvas.width + 400) - 200;
        particle.y = -20;
        particle.size = 2 + Math.random() * 4;
        particle.speed = 1 + Math.random() * 3 * this.intensity;
        particle.color = 'rgba(255, 255, 255, 0.8)';
        particle.angle = Math.PI / 2 + (Math.random() * 0.6 - 0.3);
        particle.wobble = Math.random() * 0.1;
        particle.wobbleSpeed = 0.02 + Math.random() * 0.03;
        particle.wobblePos = Math.random() * Math.PI * 2;
        break;
        
      case 'storm':
        particle.x = Math.random() * (this.canvas.width + 200) - 100;
        particle.y = -20;
        particle.size = 3 + Math.random() * 2;
        particle.speed = 15 + Math.random() * 12 * this.intensity;
        particle.color = 'rgba(100, 150, 255, 0.8)';
        particle.angle = Math.PI / 2 + (Math.random() * 0.3 - 0.15);
        break;
        
      case 'wind':
        particle.x = this.windDirection < Math.PI ? -20 : this.canvas.width + 20;
        particle.y = Math.random() * this.canvas.height;
        particle.size = 1 + Math.random() * 2;
        particle.speed = 3 + Math.random() * 8 * this.intensity;
        particle.color = 'rgba(200, 200, 200, 0.4)';
        particle.angle = this.windDirection;
        particle.lifetime = 0;
        particle.maxLifetime = 100 + Math.random() * 100;
        break;
        
      case 'fog':
        particle.x = Math.random() * this.canvas.width;
        particle.y = Math.random() * this.canvas.height;
        particle.size = 50 + Math.random() * 100;
        particle.speed = 0.3 + Math.random() * 0.5 * this.intensity;
        particle.color = `rgba(220, 225, 255, ${0.02 + Math.random() * 0.04})`;
        particle.angle = Math.random() * Math.PI * 2;
        particle.lifetime = 0;
        particle.maxLifetime = 200 + Math.random() * 300;
        break;
    }
    
    this.particles.push(particle);
    return particle;
  }
  
  triggerLightning() {
    this.lightningActive = true;
    this.lightningOpacity = 0.8;
    this.lightningX = Math.random() * this.canvas.width;
    this.lightningBranches = [];
    
    // Create main lightning bolt
    this.createLightningBranch(this.lightningX, 0, Math.PI / 2, 30, 0);
    
    // Play thunder sound effect (if implemented)
    setTimeout(() => {
      // Audio would go here
    }, 100 + Math.random() * 300);
  }
  
  createLightningBranch(x, y, angle, segments, depth) {
    if (depth > 4) return; // Limit recursion depth
    
    const branches = [];
    let currentX = x;
    let currentY = y;
    
    for (let i = 0; i < segments; i++) {
      const segmentLength = (10 + Math.random() * 20) * (1 - depth * 0.2);
      const newAngle = angle + (Math.random() * 0.4 - 0.2);
      
      const nextX = currentX + Math.cos(newAngle) * segmentLength;
      const nextY = currentY + Math.sin(newAngle) * segmentLength;
      
      branches.push({
        x1: currentX, y1: currentY,
        x2: nextX, y2: nextY,
        width: 3 - depth * 0.5
      });
      
      // Possibly create a branch
      if (depth < 3 && Math.random() < 0.3) {
        const branchAngle = newAngle + (Math.random() * Math.PI / 2 - Math.PI / 4);
        this.createLightningBranch(currentX, currentY, branchAngle, 
                                  segments - i, depth + 1);
      }
      
      currentX = nextX;
      currentY = nextY;
    }
    
    this.lightningBranches.push(...branches);
  }
  
  updateLightning() {
    this.lightningOpacity -= 0.05;
    if (this.lightningOpacity <= 0) {
      this.lightningActive = false;
    }
  }
  
  drawWeather() {
    if (!this.isActive || this.weatherType === 'none') return;
    
    // Draw weather overlay for fog
    if (this.weatherType === 'fog') {
      this.ctx.fillStyle = this.fogColor;
      for (let i = 0; i < 5 * this.intensity; i++) {
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      }
    }
    
    // Draw lightning if active
    if (this.lightningActive) {
      this.ctx.strokeStyle = `rgba(210, 230, 255, ${this.lightningOpacity})`;
      this.ctx.shadowBlur = 15;
      this.ctx.shadowColor = 'white';
      
      for (const branch of this.lightningBranches) {
        this.ctx.beginPath();
        this.ctx.lineWidth = branch.width;
        this.ctx.moveTo(branch.x1, branch.y1);
        this.ctx.lineTo(branch.x2, branch.y2);
        this.ctx.stroke();
      }
      
      // Global light flash
      this.ctx.fillStyle = `rgba(200, 210, 255, ${this.lightningOpacity * 0.3})`;
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      
      this.ctx.shadowBlur = 0;
    }
    
    // Draw individual weather particles
    for (const p of this.particles) {
      if (this.weatherType === 'rain' || this.weatherType === 'storm') {
        // Draw rain drop
        this.ctx.strokeStyle = p.color;
        this.ctx.lineWidth = p.size * 0.5;
        this.ctx.beginPath();
        this.ctx.moveTo(p.x, p.y);
        this.ctx.lineTo(
          p.x - Math.cos(p.angle) * p.size * 2,
          p.y - Math.sin(p.angle) * p.size * 2
        );
        this.ctx.stroke();
      } else if (this.weatherType === 'snow') {
        // Draw snowflake
        this.ctx.fillStyle = p.color;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        this.ctx.fill();
      } else if (this.weatherType === 'wind') {
        // Draw wind streak
        this.ctx.strokeStyle = p.color;
        this.ctx.lineWidth = p.size * 0.5;
        this.ctx.beginPath();
        this.ctx.moveTo(p.x, p.y);
        this.ctx.lineTo(
          p.x - Math.cos(p.angle) * p.size * 6,
          p.y - Math.sin(p.angle) * p.size * 6
        );
        this.ctx.stroke();
      } else if (this.weatherType === 'fog') {
        // Draw fog patch
        this.ctx.fillStyle = p.color;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        this.ctx.fill();
      }
    }
  }
  
  applyWeatherForces() {
    if (!this.isActive || this.weatherType === 'none' || !this.particleSystem) return;
    
    const particles = this.particleSystem.particles;
    
    // Apply weather effects to system particles
    for (const particle of particles) {
      switch (this.weatherType) {
        case 'rain':
          // Rain makes particles wet - slows them down slightly, increases gravity
          particle.speedX *= 0.995;
          particle.speedY += 0.01 * this.intensity;
          break;
          
        case 'snow':
          // Snow causes gentle random motion and slight cooling effect
          particle.speedX += (Math.random() - 0.5) * 0.1 * this.intensity;
          particle.speedY *= 0.995; // Snow creates air resistance
          break;
          
        case 'storm':
          // Storm has random gusts and occasional lightning effects
          if (Math.random() < 0.05 * this.intensity) {
            // Random gusts
            const gustAngle = Math.random() * Math.PI * 2;
            particle.speedX += Math.cos(gustAngle) * 0.2 * this.intensity;
            particle.speedY += Math.sin(gustAngle) * 0.2 * this.intensity;
          }
          
          // When lightning strikes, affect nearby particles
          if (this.lightningActive && this.lightningOpacity > 0.5) {
            const dx = particle.x - this.lightningX;
            const dy = particle.y - 300; // Rough halfway point of lightning
            const distance = Math.hypot(dx, dy);
            
            if (distance < 300) {
              // Push particles away from lightning
              const force = (1 - distance / 300) * 2 * this.intensity;
              const angle = Math.atan2(dy, dx);
              particle.speedX += Math.cos(angle) * force;
              particle.speedY += Math.sin(angle) * force;
              
              // Briefly highlight particles near lightning
              particle.highlighted = true;
              setTimeout(() => {
                if (particle) particle.highlighted = false;
              }, 200);
            }
          }
          break;
          
        case 'wind':
          // Wind pushes particles in wind direction
          particle.speedX += Math.cos(this.windDirection) * 0.05 * this.intensity;
          particle.speedY += Math.sin(this.windDirection) * 0.05 * this.intensity;
          break;
          
        case 'fog':
          // Fog slows everything down slightly and reduces visibility
          particle.speedX *= 0.998;
          particle.speedY *= 0.998;
          break;
      }
    }
    
    // Apply weather effects to physics objects
    const physicsObjects = this.particleSystem.physicsObjects;
    for (const obj of physicsObjects) {
      switch (this.weatherType) {
        case 'wind':
          // Wind has stronger effect on physics objects
          obj.speedX += Math.cos(this.windDirection) * 0.01 * this.intensity * obj.size;
          obj.speedY += Math.sin(this.windDirection) * 0.01 * this.intensity * obj.size;
          break;
          
        case 'storm':
          // Storm affects objects more dramatically than particles
          if (this.lightningActive && this.lightningOpacity > 0.5) {
            const dx = obj.x - this.lightningX;
            const dy = obj.y - 300;
            const distance = Math.hypot(dx, dy);
            
            if (distance < 300) {
              const force = (1 - distance / 300) * 1 * this.intensity;
              const angle = Math.atan2(dy, dx);
              obj.speedX += Math.cos(angle) * force * 3;
              obj.speedY += Math.sin(angle) * force * 3;
              obj.rotationSpeed += (Math.random() - 0.5) * 0.1;
            }
          }
          break;
      }
    }
  }
  
  update() {
    if (!this.isActive) return;
    
    this.updateWeatherParticles();
    this.applyWeatherForces();
  }
  
  updateWeatherParticles() {
    // Remove offscreen particles
    this.particles = this.particles.filter(p => {
      // Check if particle is still visible
      return !(p.x < -50 || p.x > this.canvas.width + 50 || 
               p.y < -50 || p.y > this.canvas.height + 50 ||
               (p.lifetime > p.maxLifetime && p.maxLifetime > 0));
    });
    
    // Update positions of all particles
    for (const p of this.particles) {
      p.x += Math.cos(p.angle) * p.speed * this.intensity;
      p.y += Math.sin(p.angle) * p.speed * this.intensity;
      
      // Update lifetime for particles that have it
      if (p.maxLifetime > 0) {
        p.lifetime++;
      }
      
      // Apply weather-specific updates
      if (this.weatherType === 'snow') {
        // Add wobble to snow
        p.wobblePos += p.wobbleSpeed;
        p.x += Math.sin(p.wobblePos) * p.wobble * 2;
      }
    }
    
    // Add new particles
    const particlesNeeded = Math.floor(50 * this.intensity) - this.particles.length;
    for (let i = 0; i < particlesNeeded; i++) {
      this.createWeatherParticle();
    }
    
    // Random lightning for storms
    if (this.weatherType === 'storm') {
      if (Math.random() < 0.005 * this.intensity) {
        this.triggerLightning();
      }
      
      if (this.lightningActive) {
        this.updateLightning();
      }
    }
  }
  
  restartWeather() {
    // Store the current weather type
    const currentType = this.weatherType;
    
    // Stop the current weather
    this.stopWeather();
    
    // Start the weather again with the same type
    this.startWeather(currentType);
  }
}