import { particlePresets } from './ParticlePresets.js';
import { colorThemes, applyColorTheme } from './ColorThemes.js';

export class PresetManager {
  constructor(particleSystem) {
    this.particleSystem = particleSystem;
    this.presets = particlePresets;
    this.themes = colorThemes;
    this.currentPresetIndex = 0;
    this.currentThemeIndex = 0;
    this.presetKeys = Object.keys(this.presets);
    this.themeKeys = Object.keys(this.themes);
    
    this.setupPresetControls();
    this.setupThemeControls();
    this.setupKeyboardShortcuts();
  }
  
  setupPresetControls() {
    const presetSection = document.createElement('div');
    presetSection.className = 'settings-group';
    presetSection.innerHTML = `
      <div class="settings-group-title">Presets & Themes</div>
      <div class="settings-group-content">
        <label class="tooltip">
          Particle Preset:
          <span class="tooltip-text">Quick-apply predefined particle settings</span>
          <select id="particle-preset">
            <option value="">-- Select Preset --</option>
            ${this.presetKeys.map(key => 
              `<option value="${key}">${this.presets[key].name}</option>`
            ).join('')}
          </select>
        </label>
        <p id="preset-description" style="font-size: 0.8em; color: #aaa; margin: 5px 0 10px 0;">
          Select a preset or press 'P' to cycle through presets
        </p>
        
        <label class="tooltip">
          Color Theme:
          <span class="tooltip-text">Change the color scheme of the simulation</span>
          <select id="color-theme">
            <option value="">-- Select Theme --</option>
            ${this.themeKeys.map(key => 
              `<option value="${key}">${this.themes[key].name}</option>`
            ).join('')}
          </select>
        </label>
        <p id="theme-description" style="font-size: 0.8em; color: #aaa; margin: 5px 0 10px 0;">
          Select a theme or press 'T' to cycle through themes
        </p>
      </div>
    `;
    
    // Insert at the top of the controls
    const controlsContent = document.querySelector('.controls-content');
    controlsContent.insertBefore(presetSection, controlsContent.firstChild);
    
    // Set up event listeners
    document.getElementById('particle-preset').addEventListener('change', (e) => {
      if (e.target.value) {
        this.applyPreset(e.target.value);
      }
    });
    
    document.getElementById('color-theme').addEventListener('change', (e) => {
      if (e.target.value) {
        this.applyTheme(e.target.value);
      }
    });
  }
  
  setupThemeControls() {
    // Add CSS variables for theming
    const style = document.createElement('style');
    style.textContent = `
      :root {
        --panel-bg: rgba(15, 15, 20, 0.85);
        --title-color: #4CAF50;
        --text-color: #ffffff;
        --slider-bg: linear-gradient(to right, #2c3e50, #3498db);
        --button-bg: linear-gradient(45deg, #2c3e50, #4CAF50);
        --highlight-color: #4CAF50;
      }
      
      .controls {
        background: var(--panel-bg);
        color: var(--text-color);
      }
      
      .settings-group-title {
        color: var(--title-color);
        border-bottom-color: rgba(var(--title-color), 0.3);
      }
      
      button {
        background: var(--button-bg);
      }
      
      input[type="range"] {
        background: var(--slider-bg);
      }
      
      .parameter-value {
        color: var(--highlight-color);
      }
      
      /* Help Panel Styling */
      .help-panel {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 80%;
        max-width: 800px;
        max-height: 80vh;
        background: var(--panel-bg);
        border-radius: 15px;
        box-shadow: 0 0 30px rgba(0, 0, 0, 0.7);
        z-index: 1000;
        display: none;
        opacity: 0;
        transition: opacity 0.3s;
        overflow-y: auto;
        border: 1px solid rgba(255, 255, 255, 0.1);
      }
      
      .help-panel.visible {
        opacity: 1;
      }
      
      .help-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px 20px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }
      
      .help-header h2 {
        margin: 0;
        color: var(--title-color);
      }
      
      #close-help-btn {
        background: none;
        border: none;
        color: var(--text-color);
        font-size: 24px;
        cursor: pointer;
      }
      
      .help-content {
        padding: 20px;
        color: var(--text-color);
      }
      
      .help-section {
        margin-bottom: 20px;
      }
      
      .help-section h3 {
        color: var(--title-color);
        margin-top: 0;
      }
      
      .shortcuts-table {
        width: 100%;
        border-collapse: collapse;
      }
      
      .shortcuts-table td {
        padding: 8px 15px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      }
      
      .shortcuts-table td:first-child {
        width: 120px;
      }
      
      kbd {
        background: rgba(255, 255, 255, 0.1);
        padding: 2px 6px;
        border-radius: 4px;
        font-family: monospace;
        box-shadow: 0 2px 0 rgba(0, 0, 0, 0.2);
      }
      
      .help-tips li {
        margin-bottom: 8px;
      }
      
      /* Snapshot System Styling */
      .snapshot-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: none;
        justify-content: center;
        align-items: flex-end;
        padding-bottom: 50px;
        z-index: 999;
        opacity: 0;
        transition: opacity 0.3s;
      }
      
      .snapshot-overlay.active {
        opacity: 1;
      }
      
      .snapshot-controls {
        background: var(--panel-bg);
        padding: 15px 20px;
        border-radius: 10px;
        display: flex;
        gap: 10px;
      }
    `;
    document.head.appendChild(style);
  }
  
  setupKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      // 'P' key for cycling presets
      if (e.key.toLowerCase() === 'p' && !e.ctrlKey && !e.target.matches('input, textarea')) {
        this.cycleToNextPreset();
        e.preventDefault();
      }
      
      // 'T' key for cycling themes
      if (e.key.toLowerCase() === 't' && !e.ctrlKey && !e.target.matches('input, textarea')) {
        this.cycleToNextTheme();
        e.preventDefault();
      }
      
      // Number keys 1-9 for particle types
      if (!e.ctrlKey && !e.altKey && e.key >= '1' && e.key <= '9' && !e.target.matches('input, textarea')) {
        this.selectParticleTypeByNumber(parseInt(e.key));
        e.preventDefault();
      }
      
      // 'F' key for fullscreen - moved to main.js for global handling
    });
  }
  
  applyPreset(presetKey) {
    const preset = this.presets[presetKey];
    if (!preset) return;
    
    // Save current particles and their positions
    const currentParticles = this.particleSystem.particles.slice();
    
    // Apply preset settings - only apply type, trails, connection radius and custom colors
    this.particleSystem.particleType = preset.type;
    this.particleSystem.enableTrails = preset.trails;
    this.particleSystem.trailLength = preset.trailLength || 20;
    this.particleSystem.connectionRadius = preset.connectionRadius;
    this.particleSystem.customParticleColor = preset.customColor;
    
    // Update particles with new settings - preserving gravity and other physics properties
    for (let i = 0; i < currentParticles.length; i++) {
      const p = currentParticles[i];
      p.type = preset.type;
      p.trailEnabled = preset.trails;
      p.maxTrailLength = preset.trailLength || 20;
      p.customColor = preset.customColor;
      
      // Force particles to update properties based on type
      p.setupParticleProperties();
    }
    
    // Make sure we keep the existing particles instead of clearing them
    this.particleSystem.particles = currentParticles;
    
    // Update UI to match
    this.updateUIFromSystem();
    
    // Show description
    document.getElementById('preset-description').textContent = preset.description;
    
    // Show preview panel - new feature
    this.showPresetPreview(preset);
    
    window.showNotification(`Applied preset: ${preset.name}`, "info");
    
    // If history manager exists, record this action
    if (this.particleSystem.historyManager) {
      this.particleSystem.historyManager.recordAction(`Applied preset: ${preset.name}`);
    }
  }
  
  applyTheme(themeKey) {
    const theme = this.themes[themeKey];
    if (!theme) return;
    
    applyColorTheme(theme, this.particleSystem);
    
    // Show description
    document.getElementById('theme-description').textContent = theme.description;
    
    window.showNotification(`Applied theme: ${theme.name}`, "info");
  }
  
  cycleToNextPreset() {
    this.currentPresetIndex = (this.currentPresetIndex + 1) % this.presetKeys.length;
    const nextPresetKey = this.presetKeys[this.currentPresetIndex];
    
    // Update select element
    document.getElementById('particle-preset').value = nextPresetKey;
    
    // Apply the preset
    this.applyPreset(nextPresetKey);
  }
  
  cycleToNextTheme() {
    this.currentThemeIndex = (this.currentThemeIndex + 1) % this.themeKeys.length;
    const nextThemeKey = this.themeKeys[this.currentThemeIndex];
    
    // Update select element
    document.getElementById('color-theme').value = nextThemeKey;
    
    // Apply the theme
    this.applyTheme(nextThemeKey);
  }
  
  selectParticleTypeByNumber(num) {
    const particleTypes = [
      'plasma',
      'electric',
      'organic',
      'cosmic',
      'quantum',
      'magnetic',
      'fire',
      'water',
      'crystal'
    ];
    
    if (num >= 1 && num <= particleTypes.length) {
      const type = particleTypes[num - 1];
      
      // Update system
      this.particleSystem.particleType = type;
      
      // Update UI
      document.getElementById('particle-type').value = type;
      
      window.showNotification(`Particle type: ${type}`, "info");
    }
  }
  
  updateUIFromSystem() {
    const particleTypeSelect = document.getElementById('particle-type');
    const particleMassSlider = document.getElementById('particle-mass');
    const gravityToggle = document.getElementById('gravity-toggle');
    const enableTrailsToggle = document.getElementById('enable-trails');
    const trailLengthSlider = document.getElementById('trail-length');
    const connectionRadiusSlider = document.getElementById('connection-radius');
    const interactionModeSelect = document.getElementById('interaction-mode');
    const interactionStrengthSlider = document.getElementById('interaction-strength');
    
    if (particleTypeSelect) particleTypeSelect.value = this.particleSystem.particleType;
    if (particleMassSlider) {
      particleMassSlider.value = this.particleSystem.particleMass;
      document.getElementById('particle-mass-value').textContent = 
        this.particleSystem.particleMass.toFixed(1);
    }
    if (gravityToggle) {
      gravityToggle.checked = this.particleSystem.particleGravity;
      document.getElementById('gravity-toggle-value').textContent = 
        this.particleSystem.particleGravity ? 'On' : 'Off';
    }
    if (enableTrailsToggle) {
      enableTrailsToggle.checked = this.particleSystem.enableTrails;
      document.getElementById('trail-toggle-value').textContent = 
        this.particleSystem.enableTrails ? 'On' : 'Off';
      document.getElementById('trail-settings').style.display = 
        this.particleSystem.enableTrails ? 'block' : 'none';
    }
    if (trailLengthSlider) {
      trailLengthSlider.value = this.particleSystem.trailLength;
      document.getElementById('trail-length-value').textContent = 
        this.particleSystem.trailLength;
    }
    if (connectionRadiusSlider) {
      connectionRadiusSlider.value = this.particleSystem.connectionRadius;
      document.getElementById('connection-radius-value').textContent = 
        `${Math.round(this.particleSystem.connectionRadius)}px`;
    }
    if (interactionModeSelect) interactionModeSelect.value = this.particleSystem.interactionMode;
    if (interactionStrengthSlider) {
      interactionStrengthSlider.value = this.particleSystem.interactionStrength;
      document.getElementById('interaction-strength-value').textContent = 
        this.particleSystem.interactionStrength.toFixed(1);
    }
    
    // Update particle mass and gravity UI
    if (particleMassSlider) {
      particleMassSlider.value = this.particleSystem.particleMass;
      document.getElementById('particle-mass-value').textContent = 
        this.particleSystem.particleMass.toFixed(1);
    }
    if (gravityToggle) {
      gravityToggle.checked = this.particleSystem.particleGravity;
      document.getElementById('gravity-toggle-value').textContent = 
        this.particleSystem.particleGravity ? 'On' : 'Off';
    }
  }
  
  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        window.showNotification(`Error attempting to enable fullscreen: ${err.message}`, "error");
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }
  
  showPresetPreview(preset) {
    // Remove any existing preview
    const existingPreview = document.getElementById('preset-preview');
    if (existingPreview) {
      existingPreview.remove();
    }
    
    // Create preview panel
    const previewPanel = document.createElement('div');
    previewPanel.id = 'preset-preview';
    previewPanel.className = 'preset-preview-panel';
    
    // Create a small canvas to show the preset
    previewPanel.innerHTML = `
      <div class="preview-header">
        <h3>${preset.name}</h3>
        <button class="close-preview-btn">×</button>
      </div>
      <div class="preview-content">
        <p>${preset.description}</p>
        <div class="property-list">
          <div class="property"><strong>Type:</strong> ${preset.type}</div>
          <div class="property"><strong>Trails:</strong> ${preset.trails ? 'Enabled' : 'Disabled'}</div>
          <div class="property"><strong>Connection Radius:</strong> ${preset.connectionRadius}px</div>
        </div>
      </div>
    `;
    
    // Add to document
    document.body.appendChild(previewPanel);
    
    // Set timeout to auto-hide
    setTimeout(() => {
      previewPanel.classList.add('show');
      
      setTimeout(() => {
        previewPanel.classList.remove('show');
        setTimeout(() => previewPanel.remove(), 500);
      }, 3000);
    }, 10);
    
    // Close when button clicked
    previewPanel.querySelector('.close-preview-btn').addEventListener('click', () => {
      previewPanel.classList.remove('show');
      setTimeout(() => previewPanel.remove(), 500);
    });
  }
}