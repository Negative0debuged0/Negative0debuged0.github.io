// DREAMSTAT1C Website Script
document.addEventListener('DOMContentLoaded', () => {
    // Initialize video embeds
    initializeVideoEmbeds();
    
    // Initialize custom cursor
    createCustomCursor();
    
    // Initialize floating particles
    createFloatingParticles();
    
    // Smooth scrolling for navigation
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    console.log('DREAMSTAT1C website loaded successfully!');
});

// Video embed configuration for easy modification
const videoEmbeds = [
    {
        id: "oZRgCjsGLAs",
        title: "Screws loose Remix/Cover (Original by @Zr03e )",
        displayTitle: "Screws Loose Remix/Cover",
        description: "Original by @Zr03e"
    },
    {
        id: "E4kuOPReKaE", 
        title: "Zero_one Remix/Cover - Dreamstatic (Original by @TheLivingTombstone )",
        displayTitle: "Zero_one Remix/Cover",
        description: "Original by @TheLivingTombstone"
    }
];

function initializeVideoEmbeds() {
    const musicGrid = document.querySelector('.music-grid');
    if (!musicGrid) return;
    
    // Clear existing content
    musicGrid.innerHTML = '';
    
    videoEmbeds.forEach(video => {
        const videoCard = document.createElement('div');
        videoCard.className = 'music-card video-embed';
        
        videoCard.innerHTML = `
            <iframe 
                src="https://www.youtube.com/embed/${video.id}" 
                title="${video.title}" 
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                referrerpolicy="strict-origin-when-cross-origin" 
                allowfullscreen>
            </iframe>
            <div class="video-info">
                <h4>${video.displayTitle}</h4>
                <p>${video.description}</p>
            </div>
        `;
        
        musicGrid.appendChild(videoCard);
    });
}

// Custom cursor with purple-red gradient
function createCustomCursor() {
    const cursor = document.createElement('div');
    cursor.className = 'cursor';
    document.body.appendChild(cursor);
    
    const cursorDot = document.createElement('div');
    cursorDot.className = 'cursor-dot';
    document.body.appendChild(cursorDot);
    
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let cursorDotX = 0, cursorDotY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function animateCursor() {
        const lagFactor = 0.15;
        const dotLagFactor = 0.3;
        
        cursorX += (mouseX - cursorX) * lagFactor;
        cursorY += (mouseY - cursorY) * lagFactor;
        
        cursorDotX += (mouseX - cursorDotX) * dotLagFactor;
        cursorDotY += (mouseY - cursorDotY) * dotLagFactor;
        
        cursor.style.left = `${cursorX}px`;
        cursor.style.top = `${cursorY}px`;
        
        cursorDot.style.left = `${cursorDotX}px`;
        cursorDot.style.top = `${cursorDotY}px`;
        
        requestAnimationFrame(animateCursor);
    }
    
    animateCursor();
    
    // Enhanced hover effects
    document.querySelectorAll('a, .music-card').forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.style.width = '40px';
            cursor.style.height = '40px';
            cursor.style.borderWidth = '1px';
        });
        
        element.addEventListener('mouseleave', () => {
            cursor.style.width = '20px';
            cursor.style.height = '20px';
            cursor.style.borderWidth = '2px';
        });
    });
    
    // Click effects
    document.addEventListener('mousedown', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(0.8)';
        cursorDot.style.transform = 'translate(-50%, -50%) scale(0.8)';
    });
    
    document.addEventListener('mouseup', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
    });
}

// Floating particles background
function createFloatingParticles() {
    const container = document.querySelector('.particles-container');
    const particlesCount = 30;
    
    for (let i = 0; i < particlesCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random properties
        const size = Math.random() * 4 + 2;
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        const duration = Math.random() * 10 + 8;
        const delay = Math.random() * 5;
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${posX}%`;
        particle.style.top = `${posY}%`;
        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay = `${delay}s`;
        particle.style.opacity = (Math.random() * 0.5 + 0.3).toString();
        
        container.appendChild(particle);
    }
}