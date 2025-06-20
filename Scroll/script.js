let scrollProgress = 0;
let sections = [];
let chaosLevel = 0;
let lastScrollTop = 0;

let bossMode = false;
let bossHealth = 100;
let bossEntity = null;
let crosshair = null;
let bossUI = null;
let orbsContainer = null;
let corruptionOverlay = null;
let bossAttackTimer = null;
let bossDefeated = false;

const container = document.getElementById('container');
const body = document.body;

// Chaos phrases to randomly display
const chaosTexts = [
    "ERROR 404: REALITY NOT FOUND",
    "THE VOID STARES BACK",
    "DESCENDING INTO MADNESS",
    "CHAOS REIGNS SUPREME",
    "ABANDON ALL HOPE",
    "GLITCH IN THE MATRIX",
    "REALITY IS BREAKING",
    "LOST IN THE ABYSS",
    "ENTER THE VOID",
    "SANITY OVERLOAD",
    "SYSTEM FAILURE",
    "WELCOME TO HELL",
    "DARKNESS CONSUMES",
    "FRACTURED REALITY",
    "THE END IS NEAR"
];

function createSection(index) {
    const section = document.createElement('section');
    section.className = 'section';
    section.id = `section-${index}`;
    
    const title = document.createElement('h1');
    const description = document.createElement('p');
    
    if (index === 0) {
        title.textContent = 'Order';
        description.textContent = 'Everything is calm and structured here.';
    } else if (index < 5) {
        title.textContent = 'Slight Disturbance';
        description.textContent = 'Something feels... different.';
    } else if (index < 10) {
        title.textContent = 'Growing Chaos';
        description.textContent = 'The world begins to shift and warp.';
    } else if (index < 20) {
        title.textContent = 'MALFUNCTION';
        description.textContent = 'R3@L1TY 1S BR3@K1NG D0WN...';
    } else {
        title.textContent = getRandomChaosText();
        description.textContent = getRandomChaosText();
    }
    
    section.appendChild(title);
    section.appendChild(description);
    
    return section;
}

function getRandomChaosText() {
    return chaosTexts[Math.floor(Math.random() * chaosTexts.length)];
}

function addChaosElements(section, level) {
    // Remove existing chaos elements
    section.querySelectorAll('.chaos-element').forEach(el => el.remove());
    
    if (level < 5) return;
    
    const numElements = Math.min(level * 2, 50);
    
    for (let i = 0; i < numElements; i++) {
        const element = document.createElement('div');
        element.className = 'chaos-element';
        
        if (Math.random() < 0.7) {
            // Text elements with fracturing
            let text = getRandomChaosText();
            if (level > 10) {
                // Fracture text by randomly inserting characters
                text = text.split('').map(char => 
                    Math.random() < 0.3 ? char + '█' + String.fromCharCode(33 + Math.random() * 93) : char
                ).join('');
            }
            element.innerHTML = `<span class="chaos-text">${text}</span>`;
        } else {
            // Glowing lines and fracture elements
            if (Math.random() < 0.5) {
                element.innerHTML = '<div class="glowing-line"></div>';
                element.querySelector('.glowing-line').style.width = Math.random() * 300 + 'px';
            } else {
                element.innerHTML = '<div class="fracture-line"></div>';
            }
        }
        
        // Random positioning
        element.style.left = Math.random() * 100 + '%';
        element.style.top = Math.random() * 100 + '%';
        element.style.animationDelay = Math.random() * 2 + 's';
        element.style.transform = `rotate(${Math.random() * 360}deg) scale(${0.5 + Math.random() * 1.5})`;
        
        // Add fracture classes for higher chaos levels
        if (level > 8) {
            element.classList.add('fracture-element');
        }
        if (level > 15) {
            element.classList.add('extreme-glitch');
        }
        
        section.appendChild(element);
    }
}

function updateChaosLevel() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    
    scrollProgress = scrollTop / (documentHeight - windowHeight);
    chaosLevel = Math.floor(scrollTop / windowHeight);
    
    // Trigger boss fight at deep chaos levels
    if (chaosLevel >= 25 && !bossMode && !bossDefeated) {
        initiateBossFight();
        return;
    }
    
    // Only continue with normal chaos if not in boss mode
    if (bossMode) return;
    
    // Create new sections if needed
    while (sections.length <= chaosLevel + 5) {
        const newSection = createSection(sections.length);
        container.appendChild(newSection);
        sections.push(newSection);
    }
    
    // Apply chaos effects to visible sections
    sections.forEach((section, index) => {
        if (index <= chaosLevel + 2) {
            const sectionChaos = Math.max(0, index - 2);
            
            // Apply progressive glitch effects
            section.classList.remove('glitch', 'fracture-glitch', 'extreme-fracture');
            if (sectionChaos > 3 && Math.random() < 0.4) {
                if (sectionChaos > 12) {
                    section.classList.add('extreme-fracture');
                } else if (sectionChaos > 7) {
                    section.classList.add('fracture-glitch');
                } else {
                    section.classList.add('glitch');
                }
                
                setTimeout(() => {
                    section.classList.remove('glitch', 'fracture-glitch', 'extreme-fracture');
                }, 300 + Math.random() * 500);
            }
            
            // Distort text with increasing fracture
            if (sectionChaos > 5) {
                const title = section.querySelector('h1');
                const p = section.querySelector('p');
                
                if (Math.random() < 0.3) {
                    let titleText = getRandomChaosText();
                    let pText = getRandomChaosText();
                    
                    // Progressive text fracturing
                    if (sectionChaos > 10) {
                        titleText = titleText.split('').map(char => 
                            Math.random() < 0.4 ? char + '░▒▓'[Math.floor(Math.random() * 3)] : char
                        ).join('');
                        pText = pText.split('').map(char => 
                            Math.random() < 0.3 ? '█' + char + '█' : char
                        ).join('');
                    }
                    
                    title.textContent = titleText;
                    p.textContent = pText;
                }
                
                // Intensify text effects
                const glowIntensity = Math.min(sectionChaos * 3, 50);
                const chaosColor = sectionChaos > 10 ? 
                    `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.8)` : 
                    'rgba(255, 255, 255, 0.8)';
                
                title.style.textShadow = `0 0 ${glowIntensity}px ${chaosColor}`;
                p.style.textShadow = `0 0 ${glowIntensity / 2}px ${chaosColor}`;
                
                // Add fracture transforms
                if (sectionChaos > 8) {
                    const fractureX = (Math.random() - 0.5) * sectionChaos * 2;
                    const fractureY = (Math.random() - 0.5) * sectionChaos * 2;
                    title.style.transform = `translate(${fractureX}px, ${fractureY}px)`;
                    p.style.transform = `translate(${-fractureX}px, ${-fractureY}px)`;
                }
            }
            
            // Add chaos elements
            addChaosElements(section, sectionChaos);
            
            // Enhanced randomization for fracturing
            if (sectionChaos > 15) {
                const randomX = (Math.random() - 0.5) * 200;
                const randomY = (Math.random() - 0.5) * 200;
                const randomRotate = (Math.random() - 0.5) * 30;
                const randomScale = 0.7 + Math.random() * 0.6;
                section.style.transform = `translate(${randomX}px, ${randomY}px) rotate(${randomRotate}deg) scale(${randomScale})`;
            }
        }
    });
    
    // Enhanced global chaos effects
    if (chaosLevel > 10) {
        // Aggressive screen shake
        if (Math.random() < 0.15) {
            const shakeIntensity = Math.min(chaosLevel, 20);
            body.style.transform = `translate(${(Math.random() - 0.5) * shakeIntensity}px, ${(Math.random() - 0.5) * shakeIntensity}px) rotate(${(Math.random() - 0.5) * 2}deg)`;
            setTimeout(() => body.style.transform = 'none', 50 + Math.random() * 100);
        }
        
        // Screen tear effect
        if (Math.random() < 0.08) {
            createScreenTear();
        }
        
        // Enhanced background chaos
        if (Math.random() < 0.1) {
            const colors = ['#111', '#222', '#000', '#333'];
            body.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            setTimeout(() => body.style.backgroundColor = '#000', 30 + Math.random() * 70);
        }
    }
    
    // Void overlay intensity
    let voidOverlay = document.querySelector('.void');
    if (!voidOverlay) {
        voidOverlay = document.createElement('div');
        voidOverlay.className = 'void';
        body.appendChild(voidOverlay);
    }
    
    const voidOpacity = Math.min(chaosLevel * 0.05, 0.7);
    voidOverlay.style.opacity = voidOpacity;
    
    lastScrollTop = scrollTop;
}

function initiateBossFight() {
    bossMode = true;
    const bossFight = document.getElementById('boss-fight');
    bossEntity = document.getElementById('boss-entity');
    crosshair = document.getElementById('crosshair');
    bossUI = document.getElementById('boss-ui');
    orbsContainer = document.getElementById('orbs-container');
    corruptionOverlay = document.getElementById('corruption-overlay');
    
    // Disable scrolling
    body.style.overflow = 'hidden';
    
    // Show boss fight with formation animation
    bossFight.classList.remove('hidden');
    
    // Start the entity formation animation
    startEntityFormation();
}

function startEntityFormation() {
    // Collect all chaos elements and glitch text
    const chaosElements = document.querySelectorAll('.chaos-element');
    const formationElements = [];
    
    // Create formation elements from existing chaos
    chaosElements.forEach((element, index) => {
        const formationElement = element.cloneNode(true);
        formationElement.classList.add('formation-element');
        
        // Get current position
        const rect = element.getBoundingClientRect();
        formationElement.style.position = 'fixed';
        formationElement.style.left = rect.left + 'px';
        formationElement.style.top = rect.top + 'px';
        formationElement.style.zIndex = '10001';
        formationElement.style.pointerEvents = 'none';
        
        document.body.appendChild(formationElement);
        formationElements.push(formationElement);
        
        // Hide original element
        element.style.opacity = '0';
    });
    
    // Add additional formation particles
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'formation-element formation-particle';
        particle.innerHTML = getRandomChaosText();
        particle.style.position = 'fixed';
        particle.style.left = Math.random() * window.innerWidth + 'px';
        particle.style.top = Math.random() * window.innerHeight + 'px';
        particle.style.color = '#fff';
        particle.style.fontSize = '1rem';
        particle.style.fontFamily = 'Space Mono, monospace';
        particle.style.textShadow = '0 0 10px #fff';
        particle.style.zIndex = '10001';
        particle.style.pointerEvents = 'none';
        
        document.body.appendChild(particle);
        formationElements.push(particle);
    }
    
    // Hide boss entity initially
    bossEntity.style.opacity = '0';
    bossEntity.style.transform = 'translateX(-50%) scale(0)';
    
    // Animate formation elements toward boss center
    const bossCenterX = window.innerWidth / 2;
    const bossCenterY = window.innerHeight * 0.35; // Boss position
    
    formationElements.forEach((element, index) => {
        setTimeout(() => {
            element.style.transition = 'all 2s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            element.style.transform = `translate(${bossCenterX - parseInt(element.style.left)}px, ${bossCenterY - parseInt(element.style.top)}px) scale(0.1) rotate(720deg)`;
            element.style.opacity = '0.8';
        }, index * 50);
    });
    
    // Complete formation after animation
    setTimeout(() => {
        // Remove formation elements
        formationElements.forEach(element => element.remove());
        
        // Reveal boss entity with dramatic entrance
        bossEntity.style.transition = 'all 1s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        bossEntity.style.opacity = '1';
        bossEntity.style.transform = 'translateX(-50%) scale(1)';
        
        // Screen flash effect
        const flash = document.createElement('div');
        flash.style.position = 'fixed';
        flash.style.top = '0';
        flash.style.left = '0';
        flash.style.width = '100%';
        flash.style.height = '100%';
        flash.style.background = '#fff';
        flash.style.opacity = '1';
        flash.style.zIndex = '10002';
        flash.style.pointerEvents = 'none';
        flash.style.transition = 'opacity 0.5s ease';
        
        document.body.appendChild(flash);
        
        setTimeout(() => {
            flash.style.opacity = '0';
            setTimeout(() => flash.remove(), 500);
        }, 100);
        
        // Initialize boss behaviors after formation
        setTimeout(() => {
            startBossAttacks();
            
            // Add event listeners
            document.addEventListener('mousemove', updateCrosshair);
            document.addEventListener('click', shootOrb);
            
            // Update boss health display
            updateBossHealthBar();
        }, 1000);
    }, 2500);
}

function updateCrosshair(e) {
    if (!crosshair) return;
    crosshair.style.left = e.clientX - 15 + 'px';
    crosshair.style.top = e.clientY - 15 + 'px';
}

function shootOrb(e) {
    if (!bossMode || bossDefeated) return;
    
    const orb = document.createElement('div');
    orb.className = 'stabilizing-orb';
    orb.style.left = e.clientX - 10 + 'px';
    orb.style.top = e.clientY - 10 + 'px';
    
    orbsContainer.appendChild(orb);
    
    // Animate orb with continuous tracking
    animateOrbToTarget(orb, e.clientX, e.clientY);
}

function animateOrbToTarget(orb, startX, startY) {
    const startTime = Date.now();
    const duration = 1500; // 1.5 seconds travel time
    
    function updateOrb() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Get current boss position (accounting for movements/charges)
        const bossRect = bossEntity.getBoundingClientRect();
        const targetX = bossRect.left + bossRect.width / 2;
        const targetY = bossRect.top + bossRect.height / 2;
        
        // Calculate current position with easing
        const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease-out cubic
        const currentX = startX + (targetX - startX) * easeProgress;
        const currentY = startY + (targetY - startY) * easeProgress;
        
        // Update orb position
        orb.style.left = currentX - 10 + 'px';
        orb.style.top = currentY - 10 + 'px';
        
        // Scale up as it approaches target
        const scale = 1 + progress * 0.5;
        orb.style.transform = `scale(${scale})`;
        
        if (progress < 1) {
            requestAnimationFrame(updateOrb);
        } else {
            // Check for hit when orb reaches target
            if (checkOrbHit(orb, targetX, targetY)) {
                damageBoss();
            }
            orb.remove();
        }
    }
    
    updateOrb();
}

function checkOrbHit(orb, targetX, targetY) {
    const orbRect = orb.getBoundingClientRect();
    const orbCenterX = orbRect.left + orbRect.width / 2;
    const orbCenterY = orbRect.top + orbRect.height / 2;
    
    // Check if orb is close to target position
    const distance = Math.sqrt(
        Math.pow(orbCenterX - targetX, 2) + Math.pow(orbCenterY - targetY, 2)
    );
    
    return distance < 100; // Hit detection radius
}

function damageBoss() {
    bossHealth -= 10;
    bossEntity.classList.add('damaged');
    
    setTimeout(() => {
        bossEntity.classList.remove('damaged');
    }, 500);
    
    updateBossHealthBar();
    
    if (bossHealth <= 0) {
        defeatBoss();
    }
}

function updateBossHealthBar() {
    const healthBar = document.getElementById('boss-health');
    if (healthBar) {
        healthBar.style.width = bossHealth + '%';
    }
}

function defeatBoss() {
    bossDefeated = true;
    
    // Stop boss attacks
    if (bossAttackTimer) {
        clearInterval(bossAttackTimer);
    }
    
    // Remove event listeners
    document.removeEventListener('mousemove', updateCrosshair);
    document.removeEventListener('click', shootOrb);
    
    // Start binary collapse animation
    startBinaryCollapseAnimation();
}

function startBinaryCollapseAnimation() {
    // Remove existing boss classes
    bossEntity.classList.remove('boss-defeated');
    
    // Phase 1: Smooth collapse into itself
    bossEntity.style.transition = 'all 2s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
    bossEntity.style.transform = 'translateX(-50%) scale(0.1) rotate(720deg)';
    bossEntity.style.opacity = '0.8';
    
    // Add collapse glow effect
    bossEntity.style.filter = 'brightness(3) blur(2px)';
    bossEntity.style.boxShadow = '0 0 100px #fff, 0 0 200px #fff, 0 0 300px rgba(255,255,255,0.8)';
    
    // Phase 2: Giant explosion after collapse
    setTimeout(() => {
        // Create full-screen binary explosion
        const explosionContainer = document.createElement('div');
        explosionContainer.style.position = 'fixed';
        explosionContainer.style.top = '0';
        explosionContainer.style.left = '0';
        explosionContainer.style.width = '100vw';
        explosionContainer.style.height = '100vh';
        explosionContainer.style.pointerEvents = 'none';
        explosionContainer.style.overflow = 'hidden';
        explosionContainer.style.zIndex = '10003';
        
        document.body.appendChild(explosionContainer);
        
        // Reduced particle count for better performance
        const numParticles = 50; // Reduced from 150
        const binaryChars = '01';
        const particles = [];
        
        // Use screen center as explosion origin
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        
        for (let i = 0; i < numParticles; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'absolute';
            particle.style.left = centerX + 'px';
            particle.style.top = centerY + 'px';
            particle.style.color = '#fff';
            particle.style.fontSize = (0.8 + Math.random() * 1.2) + 'rem';
            particle.style.fontFamily = 'Space Mono, monospace';
            particle.style.textShadow = '0 0 10px #fff';
            particle.style.whiteSpace = 'nowrap';
            particle.style.opacity = '1';
            particle.style.willChange = 'transform, opacity'; // Optimize for animation
            
            // Generate shorter binary content for better performance
            let binaryContent = '';
            for (let j = 0; j < (4 + Math.floor(Math.random() * 6)); j++) { // Reduced length
                binaryContent += binaryChars[Math.floor(Math.random() * 2)];
            }
            particle.textContent = binaryContent;
            
            explosionContainer.appendChild(particle);
            
            // Pre-calculate animation values for better performance
            const angle = (Math.random() * Math.PI * 2);
            const velocity = 200 + Math.random() * 400; // Slightly reduced velocity
            const velocityX = Math.cos(angle) * velocity;
            const velocityY = Math.sin(angle) * velocity;
            const rotationSpeed = 180 + Math.random() * 180;
            
            // Store particle data for efficient animation
            particles.push({
                element: particle,
                startX: centerX,
                startY: centerY,
                velocityX,
                velocityY,
                rotationSpeed,
                startTime: Date.now() + (i * 5) // Stagger start times slightly
            });
        }
        
        // Use single animation loop for all particles
        const gravity = 200; // Reduced gravity
        const duration = 3000; // Reduced duration
        let animationId;
        
        function animateAllParticles() {
            const currentTime = Date.now();
            let activeParticles = 0;
            
            particles.forEach(particleData => {
                const { element, startX, startY, velocityX, velocityY, rotationSpeed, startTime } = particleData;
                
                if (currentTime < startTime) return;
                
                const elapsed = (currentTime - startTime) / 1000;
                
                if (elapsed < duration / 1000 && element.parentNode) {
                    activeParticles++;
                    
                    // Calculate position using transform for better performance
                    const x = velocityX * elapsed;
                    const y = velocityY * elapsed + 0.5 * gravity * elapsed * elapsed;
                    
                    const rotation = elapsed * rotationSpeed;
                    const scale = Math.max(0.1, 1 - elapsed * 0.4);
                    const opacity = Math.max(0, 1 - elapsed * 0.5);
                    
                    // Use single transform for all changes
                    element.style.transform = `translate(${x}px, ${y}px) rotate(${rotation}deg) scale(${scale})`;
                    element.style.opacity = opacity;
                } else if (element.parentNode) {
                    element.remove();
                }
            });
            
            if (activeParticles > 0) {
                animationId = requestAnimationFrame(animateAllParticles);
            } else {
                explosionContainer.remove();
            }
        }
        
        // Start the optimized animation loop
        animationId = requestAnimationFrame(animateAllParticles);
        
        // Create simplified flash effect
        const explosionFlash = document.createElement('div');
        explosionFlash.style.position = 'fixed';
        explosionFlash.style.top = '0';
        explosionFlash.style.left = '0';
        explosionFlash.style.width = '100vw';
        explosionFlash.style.height = '100vh';
        explosionFlash.style.background = 'radial-gradient(circle at center, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.2) 30%, transparent 70%)';
        explosionFlash.style.opacity = '1';
        explosionFlash.style.zIndex = '10004';
        explosionFlash.style.pointerEvents = 'none';
        explosionFlash.style.transition = 'opacity 0.8s ease-out';
        
        document.body.appendChild(explosionFlash);
        
        setTimeout(() => {
            explosionFlash.style.opacity = '0';
            setTimeout(() => explosionFlash.remove(), 800);
        }, 100);
        
        // Cleanup animation if needed
        setTimeout(() => {
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
            if (explosionContainer.parentNode) {
                explosionContainer.remove();
            }
        }, duration + 1000);
    }, 2000);
    
    // Hide boss entity completely during explosion
    setTimeout(() => {
        bossEntity.style.opacity = '0';
    }, 1800);
    
    // Victory sequence after explosion - reduced timeout
    setTimeout(() => {
        const bossFight = document.getElementById('boss-fight');
        bossFight.classList.add('hidden');
        body.style.overflow = 'auto';
        
        // Restore order to the page
        restoreOrder();
    }, 4000); // Reduced from 6000
}

function startBossAttacks() {
    bossAttackTimer = setInterval(() => {
        if (bossDefeated) return;
        
        // Random corruption attack
        if (Math.random() < 0.3) {
            createCorruptionWave();
        }
        
        // Charging attack
        if (Math.random() < 0.4) {
            bossChargeAttack();
        }
        
        // Screen shake attack
        if (Math.random() < 0.2) {
            bossScreenShake();
        }
        
        // Chaos text attack
        if (Math.random() < 0.2) {
            bossTextAttack();
        }
    }, 2000);
}

function createCorruptionWave() {
    const wave = document.createElement('div');
    wave.className = 'corruption-wave';
    corruptionOverlay.appendChild(wave);
    
    corruptionOverlay.style.opacity = '1';
    
    setTimeout(() => {
        wave.remove();
        if (corruptionOverlay.children.length === 0) {
            corruptionOverlay.style.opacity = '0';
        }
    }, 2000);
}

function bossScreenShake() {
    const intensity = 20;
    const duration = 800;
    const startTime = Date.now();
    
    function shake() {
        const elapsed = Date.now() - startTime;
        if (elapsed < duration) {
            const progress = elapsed / duration;
            const currentIntensity = intensity * (1 - progress);
            
            body.style.transform = `translate(${(Math.random() - 0.5) * currentIntensity}px, ${(Math.random() - 0.5) * currentIntensity}px)`;
            requestAnimationFrame(shake);
        } else {
            body.style.transform = '';
        }
    }
    
    shake();
}

function bossTextAttack() {
    const attackTexts = [
        'YOUR STABILIZATION IS FUTILE',
        'CHAOS WILL CONSUME ALL',
        'EMBRACE THE VOID',
        'ORDER IS AN ILLUSION',
        'YOU CANNOT STOP THE ENTROPY'
    ];
    
    const text = document.createElement('div');
    text.textContent = attackTexts[Math.floor(Math.random() * attackTexts.length)];
    text.style.position = 'fixed';
    text.style.color = '#fff';
    text.style.fontSize = '2rem';
    text.style.fontFamily = 'Space Mono, monospace';
    text.style.textShadow = '0 0 20px #fff';
    text.style.zIndex = '10002';
    text.style.pointerEvents = 'none';
    text.style.left = Math.random() * (window.innerWidth - 400) + 'px';
    text.style.top = Math.random() * (window.innerHeight - 100) + 'px';
    text.style.animation = 'extremeGlitch 2s ease-out forwards';
    
    body.appendChild(text);
    
    setTimeout(() => {
        text.remove();
    }, 2000);
}

function bossChargeAttack() {
    if (!bossEntity || bossDefeated) return;
    
    // Add charging visual effect
    bossEntity.classList.add('boss-charging');
    
    // Get player position (use last mouse position or center screen)
    const targetX = window.lastMouseX || window.innerWidth / 2;
    const targetY = window.lastMouseY || window.innerHeight / 2;
    
    // Get boss current position
    const bossRect = bossEntity.getBoundingClientRect();
    const bossCenterX = bossRect.left + bossRect.width / 2;
    const bossCenterY = bossRect.top + bossRect.height / 2;
    
    // Calculate charge direction
    const deltaX = targetX - bossCenterX;
    const deltaY = targetY - bossCenterY;
    
    // Normalize and apply charge movement
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const chargeDistance = Math.min(distance, 200); // Limit charge distance
    
    const moveX = (deltaX / distance) * chargeDistance;
    const moveY = (deltaY / distance) * chargeDistance;
    
    // Apply charge transformation
    bossEntity.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    bossEntity.style.transform = `translateX(-50%) translate(${moveX}px, ${moveY}px) scale(1.2)`;
    
    // Return to original position after charge
    setTimeout(() => {
        bossEntity.style.transform = 'translateX(-50%) translate(0px, 0px) scale(1)';
        bossEntity.classList.remove('boss-charging');
    }, 300);
    
    // Create charge impact effect
    setTimeout(() => {
        const impact = document.createElement('div');
        impact.style.position = 'fixed';
        impact.style.left = targetX - 50 + 'px';
        impact.style.top = targetY - 50 + 'px';
        impact.style.width = '100px';
        impact.style.height = '100px';
        impact.style.background = 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%)';
        impact.style.borderRadius = '50%';
        impact.style.pointerEvents = 'none';
        impact.style.zIndex = '10002';
        impact.style.animation = 'impactFlash 0.5s ease-out forwards';
        
        document.body.appendChild(impact);
        
        setTimeout(() => impact.remove(), 500);
        
        // Screen shake on impact
        bossScreenShake();
    }, 250);
}

// Track mouse position for charge attacks
window.addEventListener('mousemove', (e) => {
    window.lastMouseX = e.clientX;
    window.lastMouseY = e.clientY;
});

// Initialize
sections.push(document.getElementById('section-0'));

// Scroll event listener
window.addEventListener('scroll', () => {
    updateChaosLevel();
    
    // Smooth continuous generation
    if (Math.random() < 0.3) {
        requestAnimationFrame(updateChaosLevel);
    }
});

// Initial setup
updateChaosLevel();

// Continuous chaos updates for high levels
setInterval(() => {
    if (chaosLevel > 10) {
        updateChaosLevel();
    }
}, 1000);

// Screen tear effect function
function createScreenTear() {
    const tear = document.createElement('div');
    tear.className = 'screen-tear';
    tear.style.top = Math.random() * 100 + '%';
    tear.style.height = (10 + Math.random() * 30) + 'px';
    tear.style.animationDuration = (0.1 + Math.random() * 0.3) + 's';
    
    body.appendChild(tear);
    
    setTimeout(() => {
        if (tear.parentNode) {
            tear.parentNode.removeChild(tear);
        }
    }, 500);
}

// Add random pixel corruption
function addPixelCorruption() {
    if (chaosLevel < 15) return;
    
    const corruption = document.createElement('div');
    corruption.className = 'pixel-corruption';
    corruption.style.left = Math.random() * 100 + '%';
    corruption.style.top = Math.random() * 100 + '%';
    corruption.style.width = (5 + Math.random() * 20) + 'px';
    corruption.style.height = (5 + Math.random() * 20) + 'px';
    
    body.appendChild(corruption);
    
    setTimeout(() => {
        if (corruption.parentNode) {
            corruption.parentNode.removeChild(corruption);
        }
    }, 200 + Math.random() * 300);
}

// Add pixel corruption periodically for extreme chaos
setInterval(() => {
    if (chaosLevel > 15 && Math.random() < 0.3) {
        addPixelCorruption();
    }
}, 200);

function restoreOrder() {
    // Clear all chaos elements and effects
    document.querySelectorAll('.chaos-element').forEach(el => el.remove());
    document.querySelectorAll('.formation-element').forEach(el => el.remove());
    document.querySelectorAll('.screen-tear').forEach(el => el.remove());
    document.querySelectorAll('.pixel-corruption').forEach(el => el.remove());
    
    // Reset body styles
    body.style.transform = '';
    body.style.backgroundColor = '#000';
    
    // Remove void overlay
    const voidOverlay = document.querySelector('.void');
    if (voidOverlay) {
        voidOverlay.remove();
    }
    
    // Reset all sections to order
    sections.forEach((section, index) => {
        if (index === 0) {
            section.querySelector('h1').textContent = 'Order Restored';
            section.querySelector('p').textContent = 'The chaos has been contained. Balance is restored to the digital realm.';
        } else {
            section.style.display = 'none';
        }
        
        // Clear all chaos effects
        section.classList.remove('glitch', 'fracture-glitch', 'extreme-fracture');
        section.style.transform = '';
        section.querySelector('h1').style.textShadow = '0 0 10px rgba(255, 255, 255, 0.5)';
        section.querySelector('p').style.textShadow = '';
    });
    
    // Reset scroll position
    window.scrollTo(0, 0);
    chaosLevel = 0;
    bossMode = false;
}