/**
 * Custom cursor bridge for easy implementation across multiple websites
 * Simply import this file into any website to use the custom cursor
 */

// Helper to check if an element or its ancestors have a certain class
function hasParentWithClass(element, className) {
    let current = element;
    while (current !== null) {
        if (current.classList && current.classList.contains(className)) {
            return true;
        }
        current = current.parentElement;
    }
    return false;
}

// Create custom cursor elements
function createCursorElements() {
    // Create main cursor circle
    const cursor = document.createElement('div');
    cursor.className = 'cursor';
    document.body.appendChild(cursor);
    
    // Create cursor dot
    const cursorDot = document.createElement('div');
    cursorDot.className = 'cursor-dot';
    document.body.appendChild(cursorDot);
    
    // Add SVG container for custom cursor shapes
    const cursorSvg = document.createElement('div');
    cursorSvg.className = 'cursor-svg';
    cursorSvg.innerHTML = `
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle class="cursor-click-circle" cx="20" cy="20" r="15" stroke="var(--accent-color, #ffffff)" stroke-width="1.5" opacity="0"/>
            <path class="cursor-arrow" d="M20 10L10 30L20 25L30 30L20 10Z" fill="var(--accent-color, #ffffff)" opacity="0"/>
            <rect class="cursor-plus-h" x="13" y="19" width="14" height="2" fill="var(--accent-color, #ffffff)" opacity="0"/>
            <rect class="cursor-plus-v" x="19" y="13" width="2" height="14" fill="var(--accent-color, #ffffff)" opacity="0"/>
            <path class="cursor-text" d="M12 15V25M28 15V25M16 15H24M16 25H24" stroke="var(--accent-color, #ffffff)" stroke-width="1.5" opacity="0"/>
            <path class="cursor-grab" d="M14 20V16M14 20V24M14 20H12M20 17V13M20 17V24M20 17H18M26 20V16M26 20V24M26 20H24" stroke="var(--accent-color, #ffffff)" stroke-width="1.5" opacity="0"/>
            <path class="cursor-pointer" d="M20 10L25 25L20 22L15 25L20 10Z" fill="var(--accent-color, #ffffff)" opacity="0"/>
        </svg>
    `;
    document.body.appendChild(cursorSvg);
    
    return { cursor, cursorDot, cursorSvg };
}

// Inject CSS styles needed for the cursor
function injectCursorStyles() {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        :root {
            --accent-color: #ffffff;
        }
        
        body * {
            cursor: none !important;
        }
        
        .cursor {
            position: fixed;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background-color: transparent;
            border: 2px solid var(--accent-color, #ffffff);
            pointer-events: none;
            transform: translate(-50%, -50%);
            z-index: 9999;
            mix-blend-mode: difference;
            transition: width 0.2s cubic-bezier(0.18, 0.89, 0.32, 1.28), 
                        height 0.2s cubic-bezier(0.18, 0.89, 0.32, 1.28), 
                        background-color 0.2s ease, 
                        border-radius 0.2s ease,
                        opacity 0.2s ease;
            will-change: transform;
            box-shadow: 0 0 5px rgba(255, 255, 255, 0.2);
        }
        
        .cursor-dot {
            position: fixed;
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background-color: var(--accent-color, #ffffff);
            pointer-events: none;
            z-index: 10000;
            transition: opacity 0.3s;
            box-shadow: 0 0 5px var(--accent-color, #ffffff);
            will-change: transform;
            transform: translate(-50%, -50%);
        }
        
        .cursor-svg {
            position: fixed;
            width: 40px;
            height: 40px;
            z-index: 10001;
            pointer-events: none;
            transform: translate(-50%, -50%);
            will-change: transform;
        }
        
        @keyframes pulse {
            0% { transform: scale(1); opacity: 0.8; }
            50% { transform: scale(1.2); opacity: 0.5; }
            100% { transform: scale(1); opacity: 0.8; }
        }
    `;
    document.head.appendChild(styleElement);
}

// Initialize and handle cursor movement
function initCursorMovement(elements) {
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let cursorDotX = 0, cursorDotY = 0;
    let lastMouseX = 0, lastMouseY = 0;
    
    // Track mouse position
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Animation loop for smooth cursor movement
    function animateCursor() {
        const lagFactor = 0.15;
        const dotLagFactor = 0.3;
        
        // Apply easing to cursor movement
        cursorX += (mouseX - cursorX) * lagFactor;
        cursorY += (mouseY - cursorY) * lagFactor;
        
        cursorDotX += (mouseX - cursorDotX) * dotLagFactor;
        cursorDotY += (mouseY - cursorDotY) * dotLagFactor;
        
        elements.cursor.style.left = `${cursorX}px`;
        elements.cursor.style.top = `${cursorY}px`;
        
        elements.cursorDot.style.left = `${cursorDotX}px`;
        elements.cursorDot.style.top = `${cursorDotY}px`;
        
        elements.cursorSvg.style.left = `${cursorX}px`;
        elements.cursorSvg.style.top = `${cursorY}px`;
        
        requestAnimationFrame(animateCursor);
    }
    
    animateCursor();
    
    // Handle cursor rotation based on movement
    setInterval(() => {
        const moveX = mouseX - lastMouseX;
        const moveY = mouseY - lastMouseY;
        
        if (Math.abs(moveX) > 1 || Math.abs(moveY) > 1) {
            const rotationAngle = Math.atan2(moveY, moveX) * (180 / Math.PI);
            elements.cursor.style.transform = `translate(-50%, -50%) rotate(${rotationAngle}deg) scale(${Math.min(1 + Math.abs(moveX + moveY) * 0.003, 1.15)})`;
        } else {
            elements.cursor.style.transform = `translate(-50%, -50%) scale(1)`;
        }
        
        lastMouseX = mouseX;
        lastMouseY = mouseY;
    }, 50);
    
    // Handle window focus and visibility
    document.addEventListener('mouseout', () => {
        elements.cursor.style.opacity = '0';
        elements.cursorDot.style.opacity = '0';
        elements.cursorSvg.style.opacity = '0';
    });
    
    document.addEventListener('mouseover', () => {
        elements.cursor.style.opacity = '1';
        elements.cursorDot.style.opacity = '1';
        elements.cursorSvg.style.opacity = '1';
    });
}

// Advanced element detection for cursor styles
function setupCursorInteractivity(elements) {
    // Get all elements at a point
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
    
    // Reset cursor to default state
    function resetCursorState() {
        elements.cursor.style.width = '20px';
        elements.cursor.style.height = '20px';
        elements.cursor.style.backgroundColor = 'transparent';
        elements.cursor.style.mixBlendMode = 'difference';
        elements.cursor.style.borderRadius = '50%';
        
        // Hide all SVG elements
        const svgElements = elements.cursorSvg.querySelectorAll('path, rect, circle');
        svgElements.forEach(el => {
            el.style.opacity = '0';
            el.style.animation = 'none';
        });
    }
    
    // Track mouse movement to detect hovered elements
    document.addEventListener('mousemove', (e) => {
        const elementsAtPoint = getElementsAtPoint(e.clientX, e.clientY);
        updateCursorForElements(elementsAtPoint);
    });
    
    // Update cursor based on element type
    function updateCursorForElements(elementsArray) {
        resetCursorState();
        
        if (!elementsArray.length) return;
        
        // Check for interactable elements
        const hasLink = elementsArray.some(el => 
            el.tagName === 'A' || 
            hasParentWithClass(el, 'project-link') ||
            el.getAttribute('role') === 'link'
        );
        
        const hasButton = elementsArray.some(el => 
            el.tagName === 'BUTTON' || 
            hasParentWithClass(el, 'button-card') || 
            hasParentWithClass(el, 'hover-btn') || 
            hasParentWithClass(el, 'project-card') ||
            hasParentWithClass(el, 'flipper') ||
            el.getAttribute('role') === 'button'
        );
        
        const hasTextField = elementsArray.some(el => 
            el.tagName === 'INPUT' || 
            el.tagName === 'TEXTAREA' || 
            hasParentWithClass(el, 'comment-textarea') ||
            hasParentWithClass(el, 'comment-input') ||
            el.getAttribute('contenteditable') === 'true'
        );
        
        const hasText = elementsArray.some(el => 
            ['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'SPAN', 'LI'].includes(el.tagName)
        );
        
        const hasDraggable = elementsArray.some(el => 
            el.getAttribute('draggable') === 'true' ||
            hasParentWithClass(el, 'draggable')
        );
        
        // Apply cursor styles based on element type
        if (hasLink) {
            elements.cursor.style.width = '40px';
            elements.cursor.style.height = '40px';
            elements.cursor.style.mixBlendMode = 'screen';
            
            const arrow = elements.cursorSvg.querySelector('.cursor-pointer');
            if (arrow) arrow.style.opacity = '0.8';
            
            const clickCircle = elements.cursorSvg.querySelector('.cursor-click-circle');
            if (clickCircle) {
                clickCircle.style.opacity = '0.5';
                clickCircle.style.animation = 'pulse 1.5s infinite';
            }
        } else if (hasButton) {
            elements.cursor.style.width = '40px';
            elements.cursor.style.height = '40px';
            elements.cursor.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            elements.cursor.style.mixBlendMode = 'screen';
            
            const plusH = elements.cursorSvg.querySelector('.cursor-plus-h');
            const plusV = elements.cursorSvg.querySelector('.cursor-plus-v');
            if (plusH && plusV) {
                plusH.style.opacity = '1';
                plusV.style.opacity = '1';
            }
            
            const clickCircle = elements.cursorSvg.querySelector('.cursor-click-circle');
            if (clickCircle) {
                clickCircle.style.opacity = '0.8';
                clickCircle.style.animation = 'pulse 1.5s infinite';
            }
        } else if (hasTextField) {
            elements.cursor.style.width = '3px';
            elements.cursor.style.height = '25px';
            elements.cursor.style.borderRadius = '1px';
            elements.cursor.style.backgroundColor = 'var(--accent-color, #ffffff)';
            elements.cursor.style.opacity = '0.7';
            elements.cursorDot.style.opacity = '0';
            
            const textCursor = elements.cursorSvg.querySelector('.cursor-text');
            if (textCursor) textCursor.style.opacity = '0.8';
        } else if (hasDraggable) {
            elements.cursor.style.width = '30px';
            elements.cursor.style.height = '30px';
            
            const grabCursor = elements.cursorSvg.querySelector('.cursor-grab');
            if (grabCursor) grabCursor.style.opacity = '0.8';
        } else if (hasText) {
            elements.cursor.style.width = '3px';
            elements.cursor.style.height = '25px';
            elements.cursor.style.borderRadius = '1px';
            elements.cursor.style.backgroundColor = 'var(--accent-color, #ffffff)';
            elements.cursor.style.opacity = '0.7';
            elements.cursorDot.style.opacity = '0';
        }
    }
    
    // Handle click interactions
    document.addEventListener('mousedown', () => {
        elements.cursor.style.transform = `translate(-50%, -50%) scale(0.8)`;
        elements.cursorDot.style.transform = `translate(-50%, -50%) scale(0.8)`;
        elements.cursorSvg.style.transform = `translate(-50%, -50%) scale(0.8)`;
        
        const clickCircle = elements.cursorSvg.querySelector('.cursor-click-circle');
        if (clickCircle) {
            clickCircle.style.opacity = '1';
            clickCircle.style.animation = 'pulse 0.5s ease-out';
        }
    });
    
    document.addEventListener('mouseup', () => {
        elements.cursor.style.transform = `translate(-50%, -50%) scale(1)`;
        elements.cursorDot.style.transform = `translate(-50%, -50%) scale(1)`;
        elements.cursorSvg.style.transform = `translate(-50%, -50%) scale(1)`;
    });
    
    // Set up observer to detect DOM changes
    const observer = new MutationObserver(() => {
        // When DOM changes, we don't need to do anything special
        // The mousemove event will pick up new elements
    });
    
    observer.observe(document.body, { 
        childList: true, 
        subtree: true,
        attributes: true,
        attributeFilter: ['class', 'style']
    });
}

// Main function to initialize custom cursor
function initCustomCursor(options = {}) {
    // Set accent color if provided
    if (options.accentColor) {
        document.documentElement.style.setProperty('--accent-color', options.accentColor);
    }
    
    // Hide default cursor
    document.documentElement.style.cursor = 'none';
    document.body.style.cursor = 'none';
    
    // Create cursor elements
    const cursorElements = createCursorElements();
    
    // Inject CSS styles
    injectCursorStyles();
    
    // Initialize cursor movement
    initCursorMovement(cursorElements);
    
    // Set up element interactivity
    setupCursorInteractivity(cursorElements);
    
    // Return API to control cursor
    return {
        // Method to change cursor color
        setColor: (color) => {
            document.documentElement.style.setProperty('--accent-color', color);
        },
        
        // Method to toggle cursor visibility
        toggle: (visible = true) => {
            const display = visible ? 'block' : 'none';
            cursorElements.cursor.style.display = display;
            cursorElements.cursorDot.style.display = display;
            cursorElements.cursorSvg.style.display = display;
            document.documentElement.style.cursor = visible ? 'none' : 'auto';
            document.body.style.cursor = visible ? 'none' : 'auto';
        },
        
        // Method to destroy the custom cursor and restore defaults
        destroy: () => {
            document.body.removeChild(cursorElements.cursor);
            document.body.removeChild(cursorElements.cursorDot);
            document.body.removeChild(cursorElements.cursorSvg);
            document.documentElement.style.cursor = 'auto';
            document.body.style.cursor = 'auto';
        }
    };
}

// Export the main function
export default initCustomCursor;