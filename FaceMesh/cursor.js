// Custom cursor functionality
import config from './config.js';

// Create custom cursor
export function createCustomCursor() {
    const cursor = document.createElement('div');
    cursor.className = 'cursor';
    document.body.appendChild(cursor);
    
    const cursorDot = document.createElement('div');
    cursorDot.className = 'cursor-dot';
    document.body.appendChild(cursorDot);
    
    // Add SVG container for custom cursor shapes with more elements
    const cursorSvg = document.createElement('div');
    cursorSvg.className = 'cursor-svg';
    cursorSvg.innerHTML = `
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle class="cursor-click-circle" cx="20" cy="20" r="15" stroke="var(--accent-color)" stroke-width="1.5" opacity="0"/>
            <path class="cursor-arrow" d="M20 10L10 30L20 25L30 30L20 10Z" fill="var(--accent-color)" opacity="0"/>
            <rect class="cursor-plus-h" x="13" y="19" width="14" height="2" fill="var(--accent-color)" opacity="0"/>
            <rect class="cursor-plus-v" x="19" y="13" width="2" height="14" fill="var(--accent-color)" opacity="0"/>
            <path class="cursor-text" d="M12 15V25M28 15V25M16 15H24M16 25H24" stroke="var(--accent-color)" stroke-width="1.5" opacity="0"/>
            <path class="cursor-grab" d="M14 20V16M14 20V24M14 20H12M20 17V13M20 17V24M20 17H18M26 20V16M26 20V24M26 20H24" stroke="var(--accent-color)" stroke-width="1.5" opacity="0"/>
            <path class="cursor-pointer" d="M20 10L25 25L20 22L15 25L20 10Z" fill="var(--accent-color)" opacity="0"/>
        </svg>
    `;
    document.body.appendChild(cursorSvg);
    
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let cursorDotX = 0, cursorDotY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Create a smoother animation loop
    function animateCursor() {
        // Calculate the distance between cursor position and target position
        const lagFactor = 0.15; // Reduced for more responsiveness
        const dotLagFactor = 0.3; // Faster for cursor dot
        
        // Apply easing to cursor movement
        cursorX += (mouseX - cursorX) * lagFactor;
        cursorY += (mouseY - cursorY) * lagFactor;
        
        // The dot follows slightly faster than the circle
        cursorDotX += (mouseX - cursorDotX) * dotLagFactor;
        cursorDotY += (mouseY - cursorDotY) * dotLagFactor;
        
        cursor.style.left = `${cursorX}px`;
        cursor.style.top = `${cursorY}px`;
        
        cursorDot.style.left = `${cursorDotX}px`;
        cursorDot.style.top = `${cursorDotY}px`;
        
        cursorSvg.style.left = `${cursorX}px`;
        cursorSvg.style.top = `${cursorY}px`;
        
        requestAnimationFrame(animateCursor);
    }
    
    animateCursor();
    
    // Hide default cursor on all elements with more specificity
    document.documentElement.style.cursor = 'none';
    Array.from(document.styleSheets).forEach(styleSheet => {
        try {
            if (styleSheet.cssRules) {
                Array.from(styleSheet.cssRules).forEach(rule => {
                    if (rule.style && rule.style.cursor) {
                        rule.style.cursor = 'none';
                    }
                });
            }
        } catch (e) {
            // Catch security errors from cross-origin stylesheets
        }
    });
    
    // Handle cursor disappearing when leaving window
    document.addEventListener('mouseout', () => {
        cursor.style.opacity = '0';
        cursorDot.style.opacity = '0';
        cursorSvg.style.opacity = '0';
    });
    
    document.addEventListener('mouseover', () => {
        cursor.style.opacity = '1';
        cursorDot.style.opacity = '1';
        cursorSvg.style.opacity = '1';
    });
    
    // Add subtle rotation based on movement direction
    let lastMouseX = 0;
    let lastMouseY = 0;
    let rotationAngle = 0;
    
    setInterval(() => {
        // Calculate movement direction
        const moveX = mouseX - lastMouseX;
        const moveY = mouseY - lastMouseY;
        
        if (Math.abs(moveX) > 1 || Math.abs(moveY) > 1) {
            rotationAngle = Math.atan2(moveY, moveX) * (180 / Math.PI);
            cursor.style.transform = `translate(-50%, -50%) rotate(${rotationAngle}deg) scale(${Math.min(1 + Math.abs(moveX + moveY) * 0.003, 1.15)})`;
        } else {
            cursor.style.transform = `translate(-50%, -50%) scale(1)`;
        }
        
        lastMouseX = mouseX;
        lastMouseY = mouseY;
    }, 50);
    
    // Advanced element detection for cursor styles
    function setupCursorForElements() {
        // Reset all cursor states
        const resetCursorState = () => {
            cursor.style.width = '20px';
            cursor.style.height = '20px';
            cursor.style.backgroundColor = 'transparent';
            cursor.style.mixBlendMode = 'difference';
            cursor.style.borderRadius = '50%';
            
            // Hide all SVG elements
            const svgElements = cursorSvg.querySelectorAll('path, rect, circle');
            svgElements.forEach(el => {
                el.style.opacity = '0';
                el.style.animation = 'none';
            });
        };

        // Use ResizeObserver and MutationObserver to detect DOM changes
        const observer = new MutationObserver(() => {
            setupInteractions();
        });
        
        observer.observe(document.body, { 
            childList: true, 
            subtree: true,
            attributes: true,
            attributeFilter: ['class', 'style']
        });
        
        // Detect all elements at a position
        function getElementsAtPoint(x, y) {
            const elements = [];
            let element = document.elementFromPoint(x, y);
            
            while (element && element !== document.documentElement) {
                elements.push(element);
                element.style.pointerEvents = 'none';
                element = document.elementFromPoint(x, y);
            }
            
            // Restore pointer events
            elements.forEach(el => el.style.pointerEvents = '');
            
            return elements;
        }
        
        // Add mouse tracking to detect hovered elements in real-time
        document.addEventListener('mousemove', (e) => {
            const elements = getElementsAtPoint(e.clientX, e.clientY);
            updateCursorForElements(elements);
        });
        
        function updateCursorForElements(elements) {
            // Default state
            resetCursorState();
            
            if (!elements.length) return;
            
            // Check for element types in priority order
            const hasLink = elements.some(el => el.tagName === 'A' || el.classList.contains('project-link'));
            const hasButton = elements.some(el => 
                el.tagName === 'BUTTON' || 
                el.classList.contains('button-card') || 
                el.classList.contains('hover-btn') || 
                el.classList.contains('project-card') ||
                el.classList.contains('flipper') ||
                el.getAttribute('role') === 'button'
            );
            const hasTextField = elements.some(el => 
                el.tagName === 'INPUT' || 
                el.tagName === 'TEXTAREA' || 
                el.classList.contains('comment-textarea') ||
                el.classList.contains('comment-input') ||
                el.getAttribute('contenteditable') === 'true'
            );
            const hasText = elements.some(el => 
                el.tagName === 'P' || 
                el.tagName === 'H1' || 
                el.tagName === 'H2' || 
                el.tagName === 'H3' || 
                el.tagName === 'H4' || 
                el.tagName === 'H5' || 
                el.tagName === 'H6' || 
                el.tagName === 'SPAN' || 
                el.tagName === 'LI'
            );
            const hasDraggable = elements.some(el => 
                el.getAttribute('draggable') === 'true' ||
                el.classList.contains('draggable')
            );
            
            // Apply cursor styles based on element type
            if (hasLink) {
                cursor.style.width = '40px';
                cursor.style.height = '40px';
                cursor.style.mixBlendMode = 'screen';
                
                const arrow = cursorSvg.querySelector('.cursor-pointer');
                if (arrow) {
                    arrow.style.opacity = '0.8';
                }
                
                const clickCircle = cursorSvg.querySelector('.cursor-click-circle');
                if (clickCircle) {
                    clickCircle.style.opacity = '0.5';
                    clickCircle.style.animation = 'pulse 1.5s infinite';
                }
            } else if (hasButton) {
                cursor.style.width = '40px';
                cursor.style.height = '40px';
                cursor.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                cursor.style.mixBlendMode = 'screen';
                
                const plusH = cursorSvg.querySelector('.cursor-plus-h');
                const plusV = cursorSvg.querySelector('.cursor-plus-v');
                if (plusH && plusV) {
                    plusH.style.opacity = '1';
                    plusV.style.opacity = '1';
                }
                
                const clickCircle = cursorSvg.querySelector('.cursor-click-circle');
                if (clickCircle) {
                    clickCircle.style.opacity = '0.8';
                    clickCircle.style.animation = 'pulse 1.5s infinite';
                }
            } else if (hasTextField) {
                cursor.style.width = '3px';
                cursor.style.height = '25px';
                cursor.style.borderRadius = '1px';
                cursor.style.backgroundColor = 'var(--accent-color)';
                cursor.style.opacity = '0.7';
                cursorDot.style.opacity = '0';
                
                const textCursor = cursorSvg.querySelector('.cursor-text');
                if (textCursor) {
                    textCursor.style.opacity = '0.8';
                }
            } else if (hasDraggable) {
                cursor.style.width = '30px';
                cursor.style.height = '30px';
                
                const grabCursor = cursorSvg.querySelector('.cursor-grab');
                if (grabCursor) {
                    grabCursor.style.opacity = '0.8';
                }
            } else if (hasText) {
                cursor.style.width = '3px';
                cursor.style.height = '25px';
                cursor.style.borderRadius = '1px';
                cursor.style.backgroundColor = 'var(--accent-color)';
                cursor.style.opacity = '0.7';
                cursorDot.style.opacity = '0';
            }
        }
        
        function setupInteractions() {
            // Handle clicks for better feedback
            document.addEventListener('mousedown', () => {
                cursor.style.transform = `translate(-50%, -50%) scale(0.8)`;
                cursorDot.style.transform = `translate(-50%, -50%) scale(0.8)`;
                cursorSvg.style.transform = `translate(-50%, -50%) scale(0.8)`;
                
                // Show ripple effect
                const clickCircle = cursorSvg.querySelector('.cursor-click-circle');
                if (clickCircle) {
                    clickCircle.style.opacity = '1';
                    clickCircle.style.animation = 'pulse 0.5s ease-out';
                }
            });
            
            document.addEventListener('mouseup', () => {
                cursor.style.transform = `translate(-50%, -50%) scale(1)`;
                cursorDot.style.transform = `translate(-50%, -50%) scale(1)`;
                cursorSvg.style.transform = `translate(-50%, -50%) scale(1)`;
            });
        }
        
        setupInteractions();
    }
    
    // Initialize advanced element detection
    setupCursorForElements();
}

// Toggle cursor visibility based on options
export function toggleCursor(enabled) {
    if (enabled) {
        document.body.style.cursor = 'none';
        document.documentElement.style.cursor = 'none';
        const cursor = document.querySelector('.cursor');
        const cursorDot = document.querySelector('.cursor-dot');
        const cursorSvg = document.querySelector('.cursor-svg');
        
        if (cursor) {
            cursor.style.display = 'block';
            cursorDot.style.display = 'block';
            cursorSvg.style.display = 'block';
        } else {
            createCustomCursor();
        }
    } else {
        document.body.style.cursor = 'auto';
        document.documentElement.style.cursor = '';
        const cursor = document.querySelector('.cursor');
        const cursorDot = document.querySelector('.cursor-dot');
        const cursorSvg = document.querySelector('.cursor-svg');
        
        if (cursor) {
            cursor.style.display = 'none';
            cursorDot.style.display = 'none';
            cursorSvg.style.display = 'none';
        }
        
        // Reset cursor for all elements
        document.querySelectorAll('*').forEach(el => {
            el.style.cursor = '';
        });
    }
}