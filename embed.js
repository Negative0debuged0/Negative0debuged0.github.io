// This is a lightweight script that websites can embed to show players
(function() {
  // Only inject once
  if (window.playersInitialized) return;
  window.playersInitialized = true;

  // Wait for document body to be ready
  function init() {
    if (!document.body) {
      window.requestAnimationFrame(init);
      return;
    }

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

    // Load Gun.js with retry mechanism
    function loadGunWithRetry(retries = 3) {
      return new Promise((resolve, reject) => {
        if (window.Gun) {
          resolve(window.Gun);
          return;
        }

        const gunScript = document.createElement('script');
        gunScript.src = 'https://cdn.jsdelivr.net/npm/gun/gun.js';
        
        gunScript.onload = () => {
          if (window.Gun) {
            resolve(window.Gun);
          } else {
            reject(new Error('Gun not found after script load'));
          }
        };

        gunScript.onerror = () => {
          if (retries > 0) {
            console.log('Retrying Gun.js load...');
            setTimeout(() => {
              loadGunWithRetry(retries - 1).then(resolve).catch(reject);
            }, 1000);
          } else {
            reject(new Error('Failed to load Gun.js'));
          }
        };

        document.head.appendChild(gunScript);
      });
    }

    // Initialize players with error handling
    async function initializePlayers() {
      try {
        const Gun = await loadGunWithRetry();
        
        const gun = new Gun({
          peers: [
            'https://gun-peer1.herokuapp.com/gun',
            'https://gun-peer2.herokuapp.com/gun',
            'https://gun-peer3.herokuapp.com/gun'
          ]
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
          if (!data || !data.site || data.site !== window.location.href || 
              (data.heartbeat && Date.now() - data.heartbeat > 15000)) {
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

        // Subscribe to player updates with error handling
        gun.get('players').map().on((data, id) => {
          try {
            if (data) {
              updateExternalPlayer(id, data);
            }
          } catch (error) {
            console.error('Error updating external player:', error);
          }
        });

        // Cleanup disconnected players periodically
        setInterval(() => {
          const now = Date.now();
          document.querySelectorAll('.external-player').forEach(playerEl => {
            const id = playerEl.id.replace('external-player-', '');
            gun.get('players').get(id).once((data) => {
              if (!data || !data.heartbeat || now - data.heartbeat > 15000) {
                playerEl.remove();
              }
            });
          });
        }, 5000);

      } catch (error) {
        console.error('Failed to initialize players:', error);
      }
    }

    // Start initialization
    initializePlayers();
  }

  // Start the initialization process
  init();
})();
