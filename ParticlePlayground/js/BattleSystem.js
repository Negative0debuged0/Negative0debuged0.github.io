export class BattleSystem {
  constructor(particleSystem) {
    this.particleSystem = particleSystem;
    this.isActive = false;
    this.team1 = [];
    this.team2 = [];
    this.team1Color = "#ff0000";
    this.team2Color = "#0000ff";
    this.team1ConnectionColor = "#ff0000";
    this.team2ConnectionColor = "#0000ff";
    this.team1Health = 3;
    this.team2Health = 3;
    this.setupBattleControls();
    
    // Add keyboard shortcut for battle mode popup
    window.addEventListener('keydown', (e) => {
      if (e.key.toLowerCase() === 'b') {
        this.showBattlePopup();
      }
    });
  }
  
  setupBattleControls() {
    const battleSection = document.createElement('div');
    battleSection.className = 'settings-group';
    battleSection.innerHTML = `
      <div class="settings-group-title">Battle Mode (Beta)</div>
      <div class="checkbox-wrapper tooltip">
        <input type="checkbox" id="battle-mode-toggle">
        <label for="battle-mode-toggle">Enable Battle Mode</label>
        <span class="parameter-value" id="battle-mode-value">Off</span>
        <span class="tooltip-text">Create team battles with particles</span>
      </div>
      <button id="battle-setup-btn" disabled>Press B to open config</button>
      <div id="battle-status" style="display:none;">
        <p style="font-size: 0.8em; color: #aaa; margin-top: 10px;">
          Team 1: <span id="team1-status">0</span> particles
          <br>
          Team 2: <span id="team2-status">0</span> particles
        </p>
      </div>
    `;
    
    const controlsContent = document.querySelector('.controls-content');
    if (!controlsContent) {
      console.error('Controls content element not found');
      return;
    }
    controlsContent.appendChild(battleSection);
    
    const battleModeToggle = document.getElementById('battle-mode-toggle');
    const battleModeValue = document.getElementById('battle-mode-value');
    const battleSetupBtn = document.getElementById('battle-setup-btn');
    const battleStatus = document.getElementById('battle-status');
    
    battleModeToggle.addEventListener('change', () => {
      this.toggleBattleMode();
      battleModeValue.textContent = this.isActive ? 'On' : 'Off';
      battleSetupBtn.disabled = !this.isActive;
      battleStatus.style.display = this.isActive ? 'block' : 'none';
      
      if (!this.isActive) {
        this.endBattle();
      }
    });
    
    battleSetupBtn.addEventListener('click', () => {
      this.showBattlePopup();
    });
    
    // Setup popup handlers - with safety checks
    const startBattleBtn = document.getElementById('start-battle-btn');
    const cancelBattleBtn = document.getElementById('cancel-battle-btn');
    const battlePopup = document.getElementById('battle-popup');
    const overlay = document.getElementById('overlay');
    
    if (startBattleBtn && cancelBattleBtn && battlePopup && overlay) {
      startBattleBtn.addEventListener('click', () => {
        this.startBattle();
        battlePopup.classList.remove('active');
        battlePopup.style.display = 'none';
        overlay.classList.remove('active');
        overlay.style.display = 'none';
      });
      
      cancelBattleBtn.addEventListener('click', () => {
        battlePopup.classList.remove('active');
        battlePopup.style.display = 'none';
        overlay.classList.remove('active');
        overlay.style.display = 'none';
      });
    } else {
      console.error('One or more battle controls not found');
    }
    
    // Team 1 settings
    const team1Count = document.getElementById('team1-count');
    const team1CountValue = document.getElementById('team1-count-value');
    team1Count.addEventListener('input', () => {
      team1CountValue.textContent = team1Count.value;
    });
    
    const team1Color = document.getElementById('team1-color');
    const team1ColorValue = document.getElementById('team1-color-value');
    team1Color.addEventListener('input', () => {
      team1ColorValue.textContent = team1Color.value;
      this.team1Color = team1Color.value;
    });
    
    const team1Connection = document.getElementById('team1-connection');
    const team1ConnectionValue = document.getElementById('team1-connection-value');
    team1Connection.addEventListener('input', () => {
      team1ConnectionValue.textContent = team1Connection.value;
      this.team1ConnectionColor = team1Connection.value;
    });
    
    // Team 1 health slider
    const team1Health = document.getElementById('team1-health');
    const team1HealthValue = document.getElementById('team1-health-value');
    team1Health.addEventListener('input', () => {
      team1HealthValue.textContent = team1Health.value;
      this.team1Health = parseInt(team1Health.value);
    });
    
    // Team 2 settings
    const team2Count = document.getElementById('team2-count');
    const team2CountValue = document.getElementById('team2-count-value');
    team2Count.addEventListener('input', () => {
      team2CountValue.textContent = team2Count.value;
    });
    
    const team2Color = document.getElementById('team2-color');
    const team2ColorValue = document.getElementById('team2-color-value');
    team2Color.addEventListener('input', () => {
      team2ColorValue.textContent = team2Color.value;
      this.team2Color = team2Color.value;
    });
    
    const team2Connection = document.getElementById('team2-connection');
    const team2ConnectionValue = document.getElementById('team2-connection-value');
    team2Connection.addEventListener('input', () => {
      team2ConnectionValue.textContent = team2Connection.value;
      this.team2ConnectionColor = team2Connection.value;
    });
    
    // Team 2 health slider
    const team2Health = document.getElementById('team2-health');
    const team2HealthValue = document.getElementById('team2-health-value');
    team2Health.addEventListener('input', () => {
      team2HealthValue.textContent = team2Health.value;
      this.team2Health = parseInt(team2Health.value);
    });
  }
  
  toggleBattleMode() {
    this.isActive = !this.isActive;
    
    // Apply visual change to show battle mode is on
    const controlsPanel = document.getElementById('controls-panel');
    if (this.isActive) {
      controlsPanel.classList.add('battle-mode');
    } else {
      controlsPanel.classList.remove('battle-mode');
    }
    
    return this.isActive;
  }
  
  showBattlePopup() {
    const battlePopup = document.getElementById('battle-popup');
    const overlay = document.getElementById('overlay');
    
    if (!battlePopup || !overlay) {
      console.error('Battle popup or overlay element not found');
      return;
    }
    
    // Force display property for Firefox
    battlePopup.style.display = 'block';
    overlay.style.display = 'block';
    
    battlePopup.classList.add('active');
    overlay.classList.add('active');
  }
  
  startBattle() {
    // Enable battle mode if not already enabled
    if (!this.isActive) {
      this.toggleBattleMode();
      document.getElementById('battle-mode-toggle').checked = true;
      document.getElementById('battle-mode-value').textContent = 'On';
      document.getElementById('battle-setup-btn').disabled = false;
      document.getElementById('battle-status').style.display = 'block';
    }
    
    // Clear current particles
    this.particleSystem.clearAllParticles();
    
    // Get team sizes from sliders
    const team1Size = parseInt(document.getElementById('team1-count').value);
    const team2Size = parseInt(document.getElementById('team2-count').value);
    
    // Create team particles
    this.createTeams(team1Size, team2Size);
    
    // Update status display
    document.getElementById('team1-status').textContent = this.team1.length;
    document.getElementById('team2-status').textContent = this.team2.length;
  }
  
  createTeams(team1Size, team2Size) {
    this.team1 = [];
    this.team2 = [];
    
    // Create team 1 particles
    for (let i = 0; i < team1Size; i++) {
      const x = Math.random() * (this.particleSystem.canvas.width * 0.4); // Left side
      const y = Math.random() * this.particleSystem.canvas.height;
      
      const particle = this.particleSystem.addParticleAt(x, y);
      particle.team = 1;
      particle.customColor = this.team1Color;
      particle.radius = 3 + Math.random() * 2;
      particle.health = this.team1Health * 100 / 3; // Scale health based on slider
      particle.maxHealth = particle.health;
      particle.damage = 1 + Math.random() * 2;
      particle.attackSpeed = 0.5 + Math.random();
      particle.attackRange = 50 + Math.random() * 30;
      particle.attackCooldown = 0;
      particle.targetEnemy = null;
      
      this.team1.push(particle);
    }
    
    // Create team 2 particles
    for (let i = 0; i < team2Size; i++) {
      const x = this.particleSystem.canvas.width * 0.6 + Math.random() * (this.particleSystem.canvas.width * 0.4); // Right side
      const y = Math.random() * this.particleSystem.canvas.height;
      
      const particle = this.particleSystem.addParticleAt(x, y);
      particle.team = 2;
      particle.customColor = this.team2Color;
      particle.radius = 3 + Math.random() * 2;
      particle.health = this.team2Health * 100 / 3; // Scale health based on slider
      particle.maxHealth = particle.health;
      particle.damage = 1 + Math.random() * 2;
      particle.attackSpeed = 0.5 + Math.random();
      particle.attackRange = 50 + Math.random() * 30;
      particle.attackCooldown = 0;
      particle.targetEnemy = null;
      
      this.team2.push(particle);
    }
  }
  
  updateBattle() {
    if (!this.isActive) return;
    
    // Process team 1 attacks
    for (const particle of this.team1) {
      this.updateParticleBattle(particle, this.team2);
    }
    
    // Process team 2 attacks
    for (const particle of this.team2) {
      this.updateParticleBattle(particle, this.team1);
    }
    
    // Update team status
    this.team1 = this.team1.filter(p => !p.isDead);
    this.team2 = this.team2.filter(p => !p.isDead);
    
    document.getElementById('team1-status').textContent = this.team1.length;
    document.getElementById('team2-status').textContent = this.team2.length;
    
    // Check for battle end
    if (this.team1.length === 0 || this.team2.length === 0) {
      setTimeout(() => {
        if (this.isActive) {
          alert(`Team ${this.team1.length > 0 ? '1 (Red)' : '2 (Blue)'} wins the battle!`);
          this.endBattle();
        }
      }, 500);
    }
  }
  
  updateParticleBattle(particle, enemies) {
    // Skip if the particle is dead
    if (particle.isDead) return;
    
    // Decrease attack cooldown
    if (particle.attackCooldown > 0) {
      particle.attackCooldown -= this.particleSystem.simulationSpeed;
    }
    
    // Find target if none exists or current target is dead
    if (!particle.targetEnemy || particle.targetEnemy.isDead) {
      // Find the closest enemy
      let closestEnemy = null;
      let closestDistance = Infinity;
      
      for (const enemy of enemies) {
        if (enemy.isDead) continue;
        
        const distance = Math.hypot(particle.x - enemy.x, particle.y - enemy.y);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestEnemy = enemy;
        }
      }
      
      particle.targetEnemy = closestEnemy;
    }
    
    // Attack or move toward target
    if (particle.targetEnemy) {
      const dx = particle.targetEnemy.x - particle.x;
      const dy = particle.targetEnemy.y - particle.y;
      const distance = Math.hypot(dx, dy);
      
      if (distance < particle.attackRange) {
        // In attack range - aim and fire laser if cooldown is ready
        if (particle.attackCooldown <= 0) {
          this.performAttack(particle, particle.targetEnemy);
          particle.attackCooldown = 60 / particle.attackSpeed; // 60 frames at 60fps = 1 second
          
          // When firing, briefly flash the particle
          particle.highlighted = true;
          setTimeout(() => {
            if (particle && !particle.isDead) {
              particle.highlighted = false;
            }
          }, 100);
        }
        
        // Apply some repulsion to avoid stacking and circle around enemy
        const repulsionFactor = 0.05;
        const orbitFactor = 0.08;
        particle.speedX -= dx * repulsionFactor / Math.max(1, distance);
        particle.speedY -= dy * repulsionFactor / Math.max(1, distance);
        
        // Add slight orbiting behavior for more dynamic combat
        particle.speedX += dy * orbitFactor / Math.max(1, distance);
        particle.speedY -= dx * orbitFactor / Math.max(1, distance);
      } else {
        // Move toward target
        const moveFactor = 0.03;
        particle.speedX += dx * moveFactor / Math.max(1, distance);
        particle.speedY += dy * moveFactor / Math.max(1, distance);
      }
    }
    
    // Visual indicator for damaged particles
    if (particle.health < particle.maxHealth) {
      const healthFactor = particle.health / particle.maxHealth;
      particle.radius = (2 + Math.random() * 2) * healthFactor + 2;
      
      // Flash when hit
      if (particle.recentlyHit) {
        particle.highlighted = true;
        particle.recentlyHit = false;
        setTimeout(() => {
          if (particle && !particle.isDead) {
            particle.highlighted = false;
          }
        }, 100);
      }
    }
  }
  
  performAttack(attacker, target) {
    // Apply damage - one hit should reduce health by 1/N where N is the health setting
    const damageAmount = target.maxHealth / (target.team === 1 ? this.team1Health : this.team2Health);
    target.health -= damageAmount;
    target.recentlyHit = true;
    
    // Check if target should die
    if (target.health <= 0) {
      this.killParticle(target);
    }
    
    // Create attack line effect
    this.createAttackEffect(attacker, target);
  }
  
  createAttackEffect(attacker, target) {
    // Create a laser attack effect
    const attackColor = attacker.team === 1 ? 
      `${this.team1ConnectionColor}` : 
      `${this.team2ConnectionColor}`;
    
    // Add laser trail to attacker
    if (!attacker.attackTrails) attacker.attackTrails = [];
    
    // Create a laser beam effect
    attacker.attackTrails.push({
      startX: attacker.x,
      startY: attacker.y,
      endX: target.x,
      endY: target.y,
      color: attackColor,
      life: 15 // frames the trail will last
    });
    
    // Create impact effect on target
    target.attackTrails = target.attackTrails || [];
    
    // Add small particles around impact point
    const impactParticleCount = 3;
    for (let i = 0; i < impactParticleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = 5 + Math.random() * 5;
      
      target.attackTrails.push({
        startX: target.x,
        startY: target.y,
        endX: target.x + Math.cos(angle) * distance,
        endY: target.y + Math.sin(angle) * distance,
        color: `${attackColor}CC`, // Slightly more transparent
        life: 10
      });
    }
  }
  
  killParticle(particle) {
    // Dramatic death effect
    const deathParticleCount = 5;
    for (let i = 0; i < deathParticleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 2;
      
      const fragment = this.particleSystem.addParticleAt(particle.x, particle.y);
      fragment.customColor = particle.customColor;
      fragment.radius = 1 + Math.random();
      fragment.speedX = Math.cos(angle) * speed;
      fragment.speedY = Math.sin(angle) * speed;
      fragment.lifespan = 30 + Math.random() * 20;
    }
    
    // Mark particle as dead
    particle.isDead = true;
  }
  
  endBattle() {
    document.getElementById('battle-mode-toggle').checked = false;
    document.getElementById('battle-mode-value').textContent = 'Off';
    document.getElementById('battle-setup-btn').disabled = true;
    document.getElementById('battle-status').style.display = 'none';
    
    this.isActive = false;
    this.team1 = [];
    this.team2 = [];
    
    const controlsPanel = document.getElementById('controls-panel');
    controlsPanel.classList.remove('battle-mode');
  }
}