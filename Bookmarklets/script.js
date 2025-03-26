// Bookmarklets page script
import config from '../config.js';
import { initOptions } from '../options.js';
import { createCustomCursor } from '../cursor.js';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize options
    initOptions();
    
    // Initialize custom cursor if enabled
    if (config.options.customCursor) {
        createCustomCursor();
    }
    
    // Create floating background particles
    if (config.options.backgroundParticles) {
        createFloatingBackgroundParticles();
    }
    
    // Create interactive background
    if (config.options.interactiveBackground) {
        createInteractiveBackground();
    }
    
    // Add hover effect to code samples to make them easy to copy
    const codeBlocks = document.querySelectorAll('pre code');
    codeBlocks.forEach(block => {
        block.addEventListener('click', () => {
            const selection = window.getSelection();
            const range = document.createRange();
            range.selectNodeContents(block);
            selection.removeAllRanges();
            selection.addRange(range);
            
            try {
                document.execCommand('copy');
                showNotification('Code copied to clipboard!');
            } catch (err) {
                console.error('Failed to copy code', err);
                showNotification('Failed to copy code', true);
            }
        });
        
        // Add copy indicator
        block.setAttribute('title', 'Click to copy');
        
        // Add copy icon
        const copyIcon = document.createElement('div');
        copyIcon.className = 'copy-icon';
        copyIcon.innerHTML = '';
        copyIcon.style.position = 'absolute';
        copyIcon.style.top = '5px';
        copyIcon.style.right = '5px';
        copyIcon.style.fontSize = '16px';
        copyIcon.style.opacity = '0.7';
        copyIcon.style.cursor = 'pointer';
        
        block.parentNode.style.position = 'relative';
        block.parentNode.appendChild(copyIcon);
        
        copyIcon.addEventListener('click', () => {
            const selection = window.getSelection();
            const range = document.createRange();
            range.selectNodeContents(block);
            selection.removeAllRanges();
            selection.addRange(range);
            
            try {
                document.execCommand('copy');
                showNotification('Code copied to clipboard!');
            } catch (err) {
                console.error('Failed to copy code', err);
                showNotification('Failed to copy code', true);
            }
        });
    });
});

// Create floating background particles (imported from main script.js)
function createFloatingBackgroundParticles() {
    const container = document.createElement('div');
    container.className = 'floating-bg-particles';
    document.body.appendChild(container);
    
    const particlesCount = 50;
    const particles = [];
    
    for (let i = 0; i < particlesCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'floating-particle';
        
        // Randomize particle properties
        const size = Math.random() * 3 + 1;
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        const duration = Math.random() * 60 + 30;
        const delay = Math.random() * 10;
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${posX}%`;
        particle.style.top = `${posY}%`;
        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay = `${delay}s`;
        particle.style.opacity = (Math.random() * 0.2 + 0.05).toString();
        
        container.appendChild(particle);
        
        // Store particle information for mouse interaction
        particles.push({
            element: particle,
            x: posX,
            y: posY,
            size: size,
            speed: 0.05 + Math.random() * 0.1,
            originalX: posX,
            originalY: posY,
        });
    }
    
    // Add mouse interaction
    let mouseX = 0;
    let mouseY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) * 100;
        mouseY = (e.clientY / window.innerHeight) * 100;
    });
    
    // Animation loop for mouse interaction
    function animateParticles() {
        particles.forEach(particle => {
            // Calculate distance between mouse and particle
            const dx = mouseX - particle.x;
            const dy = mouseY - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Apply attraction force if mouse is close
            if (distance < 30) {
                // Stronger attraction when closer
                const force = (30 - distance) / 30;
                
                // Move towards mouse
                particle.x += dx * force * particle.speed;
                particle.y += dy * force * particle.speed;
            } else {
                // Return slowly to original position
                particle.x += (particle.originalX - particle.x) * 0.01;
                particle.y += (particle.originalY - particle.y) * 0.01;
            }
            
            // Update particle position
            particle.element.style.left = `${particle.x}%`;
            particle.element.style.top = `${particle.y}%`;
        });
        
        requestAnimationFrame(animateParticles);
    }
    
    animateParticles();
}

// Create interactive background (imported from main script.js)
function createInteractiveBackground() {
    const container = document.createElement('div');
    container.className = 'interactive-bg';
    document.body.appendChild(container);
    
    const maxDots = 20;
    const dots = [];
    
    // Create background dots
    for (let i = 0; i < maxDots; i++) {
        const dot = document.createElement('div');
        dot.className = 'bg-dot';
        container.appendChild(dot);
        dots.push({ 
            element: dot, 
            size: Math.random() * 80 + 40, 
            active: false 
        });
        
        // Position the dot randomly off-screen initially
        dot.style.width = `${dots[i].size}px`;
        dot.style.height = `${dots[i].size}px`;
        dot.style.left = `-100px`;
        dot.style.top = `-100px`;
    }
    
    // Handle mouse movement
    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        
        // Find an inactive dot to activate
        let activated = false;
        for (let i = 0; i < dots.length; i++) {
            if (!dots[i].active && !activated) {
                dots[i].active = true;
                activated = true;
                
                const dot = dots[i].element;
                dot.style.left = `${mouseX - dots[i].size / 2}px`;
                dot.style.top = `${mouseY - dots[i].size / 2}px`;
                dot.style.opacity = '0.08'; 
                dot.style.transform = 'scale(1)';
                
                // Deactivate after animation
                setTimeout(() => {
                    dot.style.opacity = '0';
                    dot.style.transform = 'scale(0)';
                    
                    // Reset after transition
                    setTimeout(() => {
                        dots[i].active = false;
                    }, 1000);
                }, 500);
            }
        }
    });
}

// Show notification
function showNotification(message, isError = false) {
    // Create notification element if it doesn't exist
    let notification = document.querySelector('.notification');
    
    if (!notification) {
        notification = document.createElement('div');
        notification.className = 'notification';
        document.body.appendChild(notification);
    }
    
    // Set error class if needed
    if (isError) {
        notification.classList.add('error');
    } else {
        notification.classList.remove('error');
    }
    
    // Show message
    notification.textContent = message;
    notification.classList.add('active');
    
    // Hide after 3 seconds
    setTimeout(() => {
        notification.classList.remove('active');
    }, 3000);
}