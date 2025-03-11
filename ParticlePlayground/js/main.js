import { ParticleSystem } from './ParticleSystem.js';

document.addEventListener('DOMContentLoaded', () => {
  try {
    const particleSystem = new ParticleSystem('particle-canvas');
    window.particleSystem = particleSystem; // Make it accessible for debugging
    
    // Automatically reset the system once when page loads
    setTimeout(() => {
      particleSystem.initParticles();
      
      // Spawn a few reality bubbles at startup
      if (particleSystem.realityBubbleManager) {
        for (let i = 0; i < 2; i++) {
          particleSystem.realityBubbleManager.spawnRandomBubble();
        }
      }
      
      // Show brief intro notification
      window.showNotification("Welcome! Press F1 or ? for help and keyboard shortcuts", "info");
    }, 100);

    // Create notification system
    const notificationSystem = document.createElement('div');
    notificationSystem.id = 'notification-system';
    document.body.appendChild(notificationSystem);

    window.showNotification = function(message, type = 'info') {
      const notification = document.createElement('div');
      notification.className = `notification ${type}`;
      notification.innerHTML = message;
      notificationSystem.appendChild(notification);

      setTimeout(() => {
        notification.classList.add('show');
      }, 10);

      setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
          notification.remove();
        }, 500);
      }, 3000);
    };

    const controlsPanel = document.getElementById('controls-panel');
    const minimizeBtn = document.getElementById('minimize-btn');

    minimizeBtn.addEventListener('click', () => {
      controlsPanel.classList.toggle('minimized');
      minimizeBtn.textContent = controlsPanel.classList.contains('minimized') ? '+' : '−';
    });

    const infoSection = document.getElementById('info-section');
    const infoMinimizeBtn = document.getElementById('info-minimize-btn');

    infoMinimizeBtn.addEventListener('click', () => {
      infoSection.classList.toggle('minimized');
      infoMinimizeBtn.textContent = infoSection.classList.contains('minimized') ? '+' : '−';
    });
    
    // Make all settings groups minimizable
    const setupMinimizableSections = () => {
      const settingsGroups = document.querySelectorAll('.settings-group');
      settingsGroups.forEach(group => {
        // Skip if already processed
        if (group.querySelector('.settings-group-content')) return;
        
        // Get all content except the title
        const title = group.querySelector('.settings-group-title');
        const content = document.createElement('div');
        content.className = 'settings-group-content';
        
        // Move all elements except title into the content div
        Array.from(group.childNodes).forEach(node => {
          if (node !== title && node.nodeType === 1) {
            content.appendChild(node);
          }
        });
        
        // Add the content div back to the group
        group.appendChild(content);
        
        // Add click event to title
        if (title) {
          title.addEventListener('click', () => {
            group.classList.toggle('minimized');
          });
        }
      });
    };
    
    // Initial setup and also run when any new content might be added
    setupMinimizableSections();
    // Run again after a delay to catch elements added after initial load
    setTimeout(setupMinimizableSections, 500);
    
    // Add settings search functionality
    addSettingsSearch();
    
    // Add fullscreen button
    addFullscreenButton();
    
    // Add "Back to Top" button
    addBackToTopButton();
    
    // Add keyboard shortcut hints to all elements with tooltips
    addKeyboardShortcutHints();

    // Update info section with new features
    const infoContent = document.querySelector('.info-content');
    infoContent.innerHTML = `
      <p>🔹 Press <strong>I</strong> to spawn an interactive circle</p>
      <p>🔹 You can scroll down the GUI to explore more options</p>
      <p>🔹 Interact with particles using different modes</p>
      <p>🔹 If something doesn't work, try to clear all and reset system if it still doesnt work report the bug in my discord</p>
      <p>🔹 you can minimize the GUI by pressing the minus next to the GUI title</p>
      <ul style="color: #ddd; font-size: 0.9em; padding-left: 20px;">
        <li>I - Spawn interactive circle</li>
        <li>B - Open battle configuration</li>
        <li>Y - Spawn reality bubble</li>
        <li>Space - Pause/resume simulation</li>
        <li>C - Clear all particles</li>
      </ul>
    `;

    // Add keyboard shortcuts info
    const keyboardShortcuts = document.createElement('div');
    keyboardShortcuts.className = 'settings-group';
    keyboardShortcuts.innerHTML = `
      <div class="settings-group-title">Keyboard Shortcuts</div>
      <ul style="color: #ddd; font-size: 0.9em; padding-left: 20px;">
        <li>R - Spawn interactive circle</li>
        <li>B - Open battle configuration</li>
        <li>Y - Spawn reality bubble</li>
        <li>W - Toggle weather system</li>
        <li>Space - Pause/resume simulation</li>
        <li>C - Clear all particles</li>
        <li>F - Toggle fullscreen</li>
        <li>F1 or ? - Show help panel</li>
        <li>ESC - Close popup dialogs</li>
      </ul>
    `;
    document.querySelector('.controls-content').appendChild(keyboardShortcuts);

    // Add global key handlers
    window.addEventListener('keydown', (e) => {
      if (e.key === ' ' && !e.repeat) { // Space bar for pause/resume
        particleSystem.pausePhysics = !particleSystem.pausePhysics;
        window.showNotification(particleSystem.pausePhysics ? 'Simulation paused' : 'Simulation resumed', 'info');
      }

      if (e.key.toLowerCase() === 'c' && !e.repeat) { // C for clear
        particleSystem.clearAllParticles();
        window.showNotification('All particles cleared', 'info');
      }
      
      // ESC key to close all popups
      if (e.key === 'Escape') {
        closeAllPopups();
      }
    });

  } catch (error) {
    console.error('Error initializing Particle System:', error);
  }
});

function addSettingsSearch() {
  // Create search container
  const searchContainer = document.createElement('div');
  searchContainer.className = 'search-container';
  searchContainer.innerHTML = `
    <input type="text" id="settings-search" placeholder="Search settings...">
  `;
  
  // Insert at the top of controls content
  const controlsContent = document.querySelector('.controls-content');
  controlsContent.insertBefore(searchContainer, controlsContent.firstChild);
  
  // Setup search functionality
  const searchInput = document.getElementById('settings-search');
  searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase();
    
    if (searchTerm.length < 2) {
      // Reset all visibility when search is cleared
      document.querySelectorAll('.settings-group').forEach(group => {
        group.style.display = '';
        group.classList.remove('highlight-setting');
        
        // Expand all groups to show matches
        if (searchTerm.length > 0) {
          group.classList.remove('minimized');
        }
      });
      return;
    }
    
    // Search in all settings groups
    document.querySelectorAll('.settings-group').forEach(group => {
      const groupText = group.textContent.toLowerCase();
      const titleElement = group.querySelector('.settings-group-title');
      const titleText = titleElement ? titleElement.textContent.toLowerCase() : '';
      
      if (groupText.includes(searchTerm)) {
        group.style.display = '';
        group.classList.remove('minimized'); // Expand to show matches
        
        // Highlight if the title matches
        if (titleText.includes(searchTerm)) {
          titleElement.classList.add('highlight-setting');
        } else {
          titleElement.classList.remove('highlight-setting');
        }
        
        // Find and highlight matching labels or inputs
        group.querySelectorAll('label, select, button').forEach(element => {
          if (element.textContent.toLowerCase().includes(searchTerm)) {
            element.classList.add('highlight-setting');
          } else {
            element.classList.remove('highlight-setting');
          }
        });
      } else {
        group.style.display = 'none';
      }
    });
  });
}

function addFullscreenButton() {
  const fullscreenBtn = document.createElement('button');
  fullscreenBtn.className = 'fullscreen-button';
  fullscreenBtn.innerHTML = '⛶';
  fullscreenBtn.title = 'Toggle Fullscreen (F)';
  
  document.body.appendChild(fullscreenBtn);
  
  fullscreenBtn.addEventListener('click', toggleFullscreen);
  
  // Also add keyboard shortcut
  window.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'f' && !e.ctrlKey && !e.target.matches('input, textarea')) {
      e.preventDefault();
      toggleFullscreen();
    }
  });
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(err => {
      window.showNotification('Error enabling fullscreen: ' + err.message, 'error');
    });
    window.showNotification('Fullscreen enabled', 'info');
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
      window.showNotification('Fullscreen disabled', 'info');
    }
  }
}

function addBackToTopButton() {
  const backToTopBtn = document.createElement('button');
  backToTopBtn.className = 'back-to-top';
  backToTopBtn.innerHTML = '↑';
  backToTopBtn.title = 'Back to top';
  
  document.body.appendChild(backToTopBtn);
  
  // Show button when scrolled down in controls panel
  const controlsContent = document.querySelector('.controls-content');
  controlsContent.addEventListener('scroll', () => {
    if (controlsContent.scrollTop > 300) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });
  
  // Scroll back to top when clicked
  backToTopBtn.addEventListener('click', () => {
    controlsContent.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

function addKeyboardShortcutHints() {
  // Map of selectors to keyboard shortcuts
  const shortcutMap = {
    '#reset-btn': 'R',
    '#clear-particles-btn': 'C',
    '#battle-setup-btn': 'B',
    '#spawn-bubble-btn': 'Y',
    '#weather-toggle': 'W',
    '#settings-search': '/',
    '#help-search': '/',
    '.fullscreen-button': 'F',
    '#minimize-btn': 'M'
  };
  
  // Add keyboard hints to elements
  for (const [selector, key] of Object.entries(shortcutMap)) {
    const element = document.querySelector(selector);
    if (element) {
      // For buttons, add directly to the button text
      if (element.tagName === 'BUTTON') {
        const keyHint = document.createElement('span');
        keyHint.className = 'key-hint';
        keyHint.textContent = key;
        element.appendChild(keyHint);
      } 
      // For other elements, add to label or parent
      else {
        const label = element.closest('label') || element.parentElement;
        if (label) {
          const keyHint = document.createElement('span');
          keyHint.className = 'key-hint';
          keyHint.textContent = key;
          label.appendChild(keyHint);
        }
      }
    }
  }
}

function closeAllPopups() {
  // Close help panel if open
  const helpPanel = document.getElementById('help-panel');
  if (helpPanel && helpPanel.style.display !== 'none') {
    if (window.particleSystem && window.particleSystem.helpSystem) {
      window.particleSystem.helpSystem.hideHelp();
    }
  }
  
  // Close battle popup
  const battlePopup = document.getElementById('battle-popup');
  const overlay = document.getElementById('overlay');
  if (battlePopup && battlePopup.classList.contains('active')) {
    battlePopup.classList.remove('active');
    battlePopup.style.display = 'none';
    if (overlay) {
      overlay.classList.remove('active');
      overlay.style.display = 'none';
    }
  }
  
  // Close circle popup
  const circlePopup = document.getElementById('circle-popup');
  if (circlePopup && circlePopup.style.display !== 'none') {
    circlePopup.style.display = 'none';
    circlePopup.classList.remove('active');
    if (overlay) {
      overlay.classList.remove('active');
      overlay.style.display = 'none';
    }
  }
  
  // Close snapshot mode if active
  if (window.particleSystem && window.particleSystem.snapshotSystem && 
      window.particleSystem.snapshotSystem.isSnapshotMode) {
    window.particleSystem.snapshotSystem.toggleSnapshotMode();
  }
}