// This is a lightweight script that websites can embed to show players
(function() {
  // Only inject once
  if (window.playersInitialized) return;
  window.playersInitialized = true;

  // Add styles
  const style = document.createElement('style');
  style.textContent = `
    .external-player {
      position: fixed;
      pointer-events: none;
      z-index: 999999;
    }
    .external-player .body {
      width: 50px;
      height: 50px;
      position: relative;
      transition: all 0.3s;
    }
    .external-player .part {
      position: absolute;
      background: #ff4444;
      transition: all 0.3s;
    }
    .external-player.transformed .part {
      background: #4444ff;
    }
    .external-player .core {
      width: 30px;
      height: 30px;
      left: 10px;
      top: 10px;
    }
    .external-player .arm-left,
    .external-player .arm-right {
      width: 10px;
      height: 40px;
      top: 5px;
    }
    .external-player .arm-left {
      left: -5px;
    }
    .external-player .arm-right {
      right: -5px;
    }
    .external-player .leg-left,
    .external-player .leg-right {
      width: 10px;
      height: 20px;
      bottom: -15px;
    }
    .external-player .leg-left {
      left: 10px;
    }
    .external-player .leg-right {
      right: 10px;
    }
    .external-player.transformed .body {
      transform: rotate(90deg);
    }
    .external-player.transformed .arm-left {
      height: 60px;
      transform: rotate(-45deg);
    }
    .external-player.transformed .arm-right {
      height: 60px;
      transform: rotate(45deg);
    }
    .external-player.transformed .leg-left,
    .external-player.transformed .leg-right {
      height: 40px;
    }
  `;
  document.head.appendChild(style);

  // Create container for players
  const playersContainer = document.createElement('div');
  playersContainer.id = 'external-players';
  document.body.appendChild(playersContainer);

  // Load Gun.js
  const gunScript = document.createElement('script');
  gunScript.src = 'https://cdn.jsdelivr.net/npm/gun/gun.js';
  gunScript.onload = initializePlayers;
  document.head.appendChild(gunScript);

  function initializePlayers() {
    const gun = Gun({
      peers: ['https://gun-manhattan.herokuapp.com/gun']
    });

    function createExternalPlayer(id) {
      const player = document.createElement('div');
      player.className = 'external-player';
      player.id = `external-player-${id}`;
      
      const body = document.createElement('div');
      body.className = 'body';
      
      const parts = ['core', 'arm-left', 'arm-right', 'leg-left', 'leg-right'];
      parts.forEach(part => {
        const element = document.createElement('div');
        element.className = `part ${part}`;
        body.appendChild(element);
      });
      
      player.appendChild(body);
      return player;
    }

    function updateExternalPlayer(id, data) {
      if (!data || data.site !== window.location.href) {
        const existingPlayer = document.getElementById(`external-player-${id}`);
        if (existingPlayer) {
          existingPlayer.remove();
        }
        return;
      }
      
      let playerEl = document.getElementById(`external-player-${id}`);
      
      if (!playerEl) {
        playerEl = createExternalPlayer(id);
        playersContainer.appendChild(playerEl);
      }
      
      playerEl.style.transform = `translate(${data.x}px, ${data.y}px)`;
      if (data.transformed) {
        playerEl.classList.add('transformed');
      } else {
        playerEl.classList.remove('transformed');
      }
    }

    // Subscribe to player updates
    gun.get('players').map().on((data, id) => {
      if (data) {
        updateExternalPlayer(id, data);
      }
    });
  }
})();