export class HelpSystem {
  constructor() {
    this.isVisible = false;
    this.createHelpPanel();
    this.setupShortcuts();
    
    // Add search functionality to help content
    this.setupHelpSearch();
  }
  
  createHelpPanel() {
    const helpPanel = document.createElement('div');
    helpPanel.id = 'help-panel';
    helpPanel.className = 'help-panel';
    helpPanel.innerHTML = `
      <div class="help-header">
        <h2>Keyboard Shortcuts & Help</h2>
        <button id="close-help-btn">×</button>
      </div>
      <div class="help-content">
        <div class="help-section">
          <h3>Essential Shortcuts</h3>
          <table class="shortcuts-table">
            <tr><td><kbd>I</kbd></td><td>Spawn interactive circle</td></tr>
            <tr><td><kbd>B</kbd></td><td>Open battle configuration</td></tr>
            <tr><td><kbd>Y</kbd></td><td>Spawn reality bubble</td></tr>
            <tr><td><kbd>W</kbd></td><td>Toggle weather system</td></tr>
            <tr><td><kbd>Space</kbd></td><td>Pause/resume simulation</td></tr>
            <tr><td><kbd>C</kbd></td><td>Clear all particles</td></tr>
            <tr><td><kbd>H</kbd></td><td>Toggle black hole</td></tr>
            <tr><td><kbd>F1</kbd> or <kbd>?</kbd></td><td>Show/hide this help</td></tr>
          </table>
        </div>
        
        <div class="help-section">
          <h3>Advanced Controls</h3>
          <table class="shortcuts-table">
            <tr><td><kbd>P</kbd></td><td>Cycle through particle presets</td></tr>
            <tr><td><kbd>T</kbd></td><td>Cycle through color themes</td></tr>
            <tr><td><kbd>Ctrl</kbd>+<kbd>Z</kbd></td><td>Undo action</td></tr>
            <tr><td><kbd>Ctrl</kbd>+<kbd>Y</kbd></td><td>Redo action</td></tr>
            <tr><td><kbd>Alt</kbd>+<kbd>Click</kbd></td><td>Create reality bubble at cursor</td></tr>
            <tr><td><kbd>1</kbd>-<kbd>9</kbd></td><td>Select different particle types</td></tr>
            <tr><td><kbd>S</kbd></td><td>Toggle snapshot mode</td></tr>
            <tr><td><kbd>F</kbd></td><td>Toggle fullscreen</td></tr>
          </table>
        </div>
        
        <div class="help-section">
          <h3>Tips & Tricks</h3>
          <ul class="help-tips">
            <li>Try spawning interactive circles with different interaction modes</li>
            <li>Dimensional Rift mode sends particles to alternate dimensions</li>
            <li>Reality Bubbles change the laws of physics inside them</li>
            <li>Use the presets for quickly setting up interesting effects</li>
            <li>Draw mode lets you spawn particles by drawing lines</li>
            <li>Set up battles between teams of particles</li>
            <li>Weather effects can interact with your particles</li>
          </ul>
        </div>
      </div>
    `;
    
    document.body.appendChild(helpPanel);
    
    // Add event listener for close button
    document.getElementById('close-help-btn').addEventListener('click', () => {
      this.hideHelp();
    });
  }
  
  setupShortcuts() {
    window.addEventListener('keydown', (e) => {
      // F1 or ? key to show help
      if (e.key === 'F1' || e.key === '?') {
        this.toggleHelp();
        e.preventDefault();
      }
      
      // ESC to close help if visible
      if (e.key === 'Escape' && this.isVisible) {
        this.hideHelp();
        e.preventDefault();
      }
    });
  }
  
  setupHelpSearch() {
    // Add search box to help panel
    const helpHeader = document.querySelector('.help-header');
    const searchDiv = document.createElement('div');
    searchDiv.className = 'help-search';
    searchDiv.innerHTML = `
      <input type="text" id="help-search" placeholder="Search for commands...">
    `;
    helpHeader.insertAdjacentElement('afterend', searchDiv);
    
    // Set up search functionality
    const searchInput = document.getElementById('help-search');
    searchInput.addEventListener('input', (e) => {
      const searchTerm = e.target.value.toLowerCase();
      const helpRows = document.querySelectorAll('.shortcuts-table tr');
      
      helpRows.forEach(row => {
        const text = row.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
          row.style.display = '';
          // Highlight matching text
          if (searchTerm.length > 0) {
            row.classList.add('highlight-match');
          } else {
            row.classList.remove('highlight-match');
          }
        } else {
          row.style.display = 'none';
        }
      });
      
      // Also search in tips
      const tipItems = document.querySelectorAll('.help-tips li');
      tipItems.forEach(item => {
        const text = item.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
          item.style.display = '';
          if (searchTerm.length > 0) {
            item.classList.add('highlight-match');
          } else {
            item.classList.remove('highlight-match');
          }
        } else {
          item.style.display = 'none';
        }
      });
    });
  }
  
  toggleHelp() {
    if (this.isVisible) {
      this.hideHelp();
    } else {
      this.showHelp();
    }
  }
  
  showHelp() {
    const helpPanel = document.getElementById('help-panel');
    helpPanel.style.display = 'block';
    
    // Fade in animation
    setTimeout(() => {
      helpPanel.classList.add('visible');
    }, 10);
    
    this.isVisible = true;
  }
  
  hideHelp() {
    const helpPanel = document.getElementById('help-panel');
    helpPanel.classList.remove('visible');
    
    // Wait for transition to complete before hiding
    setTimeout(() => {
      helpPanel.style.display = 'none';
    }, 300);
    
    this.isVisible = false;
  }
}