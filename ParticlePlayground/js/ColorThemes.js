export const colorThemes = {
  "default": {
    name: "Default",
    background: "#000000",
    particles: null, // use type defaults
    connections: null, // use type defaults
    ui: {
      panelBackground: "rgba(15, 15, 20, 0.85)",
      titleColor: "#4CAF50",
      textColor: "#ffffff",
      sliderBackground: "linear-gradient(to right, #2c3e50, #3498db)",
      buttonBackground: "linear-gradient(45deg, #2c3e50, #4CAF50)",
      highlightColor: "#4CAF50"
    },
    description: "The standard dark theme"
  },
  "midnight-blue": {
    name: "Midnight Blue",
    background: "#0a1929",
    particles: {
      plasma: "#00a8ff",
      electric: "#0066ff",
      organic: "#00ff66",
      cosmic: "#aa55ff",
      quantum: "#ff00aa",
      magnetic: "#ff5500",
      fire: "#ff3300",
      water: "#00ddff",
      crystal: "#00ffcc"
    },
    connections: "#4488ff88",
    ui: {
      panelBackground: "rgba(10, 25, 50, 0.85)",
      titleColor: "#3498db",
      textColor: "#e0e0ff",
      sliderBackground: "linear-gradient(to right, #152642, #2980b9)",
      buttonBackground: "linear-gradient(45deg, #152642, #3498db)",
      highlightColor: "#3498db"
    },
    description: "Deep blue space theme"
  },
  "sunset": {
    name: "Sunset",
    background: "#1a0000",
    particles: {
      plasma: "#ff8800",
      electric: "#ffcc00",
      organic: "#ff6600",
      cosmic: "#ff3300",
      quantum: "#ff0055",
      magnetic: "#ff0000",
      fire: "#ff4400",
      water: "#00aaff",
      crystal: "#ffaa00"
    },
    connections: "#ff660088",
    ui: {
      panelBackground: "rgba(40, 10, 10, 0.85)",
      titleColor: "#ff5722",
      textColor: "#ffddcc",
      sliderBackground: "linear-gradient(to right, #4a1500, #ff5722)",
      buttonBackground: "linear-gradient(45deg, #4a1500, #ff5722)",
      highlightColor: "#ff5722"
    },
    description: "Warm sunset colors"
  },
  "matrix": {
    name: "Matrix",
    background: "#000500",
    particles: {
      plasma: "#00ff00",
      electric: "#88ff00",
      organic: "#00bb00",
      cosmic: "#00ff88",
      quantum: "#99ff00",
      magnetic: "#00ff44",
      fire: "#ffaa00",
      water: "#00ffff",
      crystal: "#99ffaa"
    },
    connections: "#00ff0088",
    ui: {
      panelBackground: "rgba(0, 20, 0, 0.9)",
      titleColor: "#00ff44",
      textColor: "#ccffcc",
      sliderBackground: "linear-gradient(to right, #002200, #00aa00)",
      buttonBackground: "linear-gradient(45deg, #001100, #00cc00)",
      highlightColor: "#00ff44"
    },
    description: "Digital green matrix style"
  },
  "neon": {
    name: "Neon",
    background: "#0a0a14",
    particles: {
      plasma: "#00ffff",
      electric: "#ff00ff",
      organic: "#ffff00",
      cosmic: "#ff00aa",
      quantum: "#00ffaa",
      magnetic: "#ff5500",
      fire: "#ff0055",
      water: "#00aaff",
      crystal: "#aaffff"
    },
    connections: "#ff00ff88",
    ui: {
      panelBackground: "rgba(25, 20, 40, 0.85)",
      titleColor: "#ff00ff",
      textColor: "#ffffff",
      sliderBackground: "linear-gradient(to right, #0a0a20, #ff00ff)",
      buttonBackground: "linear-gradient(45deg, #0a0a20, #ff00ff)",
      highlightColor: "#ff00ff"
    },
    description: "Vibrant neon colors"
  }
};

export function applyColorTheme(theme, system) {
  // Apply background color
  document.body.style.backgroundColor = theme.background;
  
  // Apply UI colors
  const root = document.documentElement;
  root.style.setProperty('--panel-bg', theme.ui.panelBackground);
  root.style.setProperty('--title-color', theme.ui.titleColor);
  root.style.setProperty('--text-color', theme.ui.textColor);
  root.style.setProperty('--slider-bg', theme.ui.sliderBackground);
  root.style.setProperty('--button-bg', theme.ui.buttonBackground);
  root.style.setProperty('--highlight-color', theme.ui.highlightColor);
  
  // Apply to particles
  if (system && theme.particles) {
    system.customConnectionColor = theme.connections;
    
    // Update existing particles
    system.particles.forEach(particle => {
      if (theme.particles[particle.type]) {
        particle.customColor = theme.particles[particle.type];
      }
    });
  }
  
  // Apply CSS variables to all relevant elements
  updateUIColors();
}

function updateUIColors() {
  // This function updates all elements that should reflect the theme colors
  document.querySelectorAll('.settings-group-title').forEach(el => {
    el.style.color = 'var(--title-color)';
    el.style.borderBottomColor = 'var(--title-color, #4CAF50)';
  });
  
  document.querySelectorAll('button').forEach(el => {
    el.style.background = 'var(--button-bg)';
  });
  
  document.querySelectorAll('input[type="range"]').forEach(el => {
    el.style.background = 'var(--slider-bg)';
  });
  
  document.querySelectorAll('.parameter-value').forEach(el => {
    el.style.color = 'var(--highlight-color)';
  });
}