import { ParticleSystem } from './ParticleSystem.js';

document.addEventListener('DOMContentLoaded', () => {
  try {
    new ParticleSystem('particle-canvas');
    
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
    
    // Update info section with new drawing feature
    const infoContent = document.querySelector('.info-content');
    const drawingInfoElement = document.createElement('p');
    drawingInfoElement.innerHTML = '🔹 Use the <strong>Draw Mode</strong> to create shapes for particles to follow';
    infoContent.appendChild(drawingInfoElement);
    
  } catch (error) {
    console.error('Error initializing Particle System:', error);
  }
});