// Bookmarklet to add custom cursor to any website
(function() {
    // Check if cursor is already initialized
    if (window.zeroCursor) return;
    
    // Create cursor elements
    function createCursorElements() {
        // Create main cursor circle
        const cursor = document.createElement('div');
        cursor.className = 'zero-cursor';
        document.body.appendChild(cursor);
        
        // Create cursor dot
        const cursorDot = document.createElement('div');
        cursorDot.className = 'zero-cursor-dot';
        document.body.appendChild(cursorDot);
        
        // Add SVG container for custom cursor shapes
        const cursorSvg = document.createElement('div');
        cursorSvg.className = 'zero-cursor-svg';
        cursorSvg.innerHTML = `
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle class="zero-cursor-click-circle" cx="20" cy="20" r="15" stroke="#ffffff" stroke-width="1.5" opacity="0"/>
                <path class="zero-cursor-arrow" d="M20 10L10 30L20 25L30 30L20 10Z" fill="#ffffff" opacity="0"/>
                <rect class="zero-cursor-plus-h" x="13" y="19" width="14" height="2" fill="#ffffff" opacity="0"/>
                <rect class="zero-cursor-plus-v" x="19" y="13" width="2" height="14" fill="#ffffff" opacity="0"/>
                <path class="zero-cursor-text" d="M12 15V25M28 15V25M16 15H24M16 25H24" stroke="#ffffff" stroke-width="1.5" opacity="0"/>
                <path class="zero-cursor-grab" d="M14 20V16M14 20V24M14 20H12M20 17V13M20 17V24M20 17H18M26 20V16M26 20V24M26 20H24" stroke="#ffffff" stroke-width="1.5" opacity="0"/>
                <path class="zero-cursor-pointer" d="M20 10L25 25L20 22L15 25L20 10Z" fill="#ffffff" opacity="0"/>
            </svg>
        `;
        document.body.appendChild(cursorSvg);
        
        return { cursor, cursorDot, cursorSvg };
    }

    // Add cursor styles
    function injectCursorStyles() {
        const style = document.createElement('style');
        style.textContent = `
            html *, body * {
                cursor: none !important;
            }
            
            .zero-cursor {
                position: fixed;
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background-color: transparent;
                border: 2px solid #ffffff;
                pointer-events: none;
                transform: translate(-50%, -50%);
                z-index: 999999;
                mix-blend-mode: difference;
                transition: width 0.2s ease, height 0.2s ease, background-color 0.2s ease;
                will-change: transform;
                box-shadow: 0 0 5px rgba(255, 255, 255, 0.2);
            }
            
            .zero-cursor-dot {
                position: fixed;
                width: 6px;
                height: 6px;
                border-radius: 50%;
                background-color: #ffffff;
                pointer-events: none;
                z-index: 999999;
                transition: opacity 0.3s;
                box-shadow: 0 0 5px #ffffff;
                will-change: transform;
                transform: translate(-50%, -50%);
            }
            
            .zero-cursor-svg {
                position: fixed;
                width: 40px;
                height: 40px;
                z-index: 999999;
                pointer-events: none;
                transform: translate(-50%, -50%);
                will-change: transform;
            }
            
            @keyframes zero-pulse {
                0% { transform: scale(1); opacity: 0.8; }
                50% { transform: scale(1.2); opacity: 0.5; }
                100% { transform: scale(1); opacity: 0.8; }
            }
        `;
        document.head.appendChild(style);
    }

    // Initialize cursor movement
    function initCursorMovement(elements) {
        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;
        let cursorDotX = 0, cursorDotY = 0;
        
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
            
            window.zeroCursorRAF = requestAnimationFrame(animateCursor);
        }
        
        animateCursor();
        
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
        
        // Handle clicks
        document.addEventListener('mousedown', () => {
            elements.cursor.style.transform = 'translate(-50%, -50%) scale(0.8)';
            elements.cursorDot.style.transform = 'translate(-50%, -50%) scale(0.8)';
            elements.cursorSvg.style.transform = 'translate(-50%, -50%) scale(0.8)';
            
            const clickCircle = elements.cursorSvg.querySelector('.zero-cursor-click-circle');
            if (clickCircle) {
                clickCircle.style.opacity = '1';
                clickCircle.style.animation = 'zero-pulse 0.5s ease-out';
            }
        });
        
        document.addEventListener('mouseup', () => {
            elements.cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            elements.cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
            elements.cursorSvg.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    }

    // Handle different element types
    function setupCursorInteractivity(elements) {
        function hasParentWithTag(element, tags) {
            let current = element;
            while (current) {
                if (tags.includes(current.tagName)) return true;
                current = current.parentElement;
            }
            return false;
        }
        
        document.addEventListener('mousemove', (e) => {
            const element = document.elementFromPoint(e.clientX, e.clientY);
            if (!element) return;
            
            // Reset cursor
            elements.cursor.style.width = '20px';
            elements.cursor.style.height = '20px';
            elements.cursor.style.backgroundColor = 'transparent';
            elements.cursor.style.mixBlendMode = 'difference';
            elements.cursor.style.borderRadius = '50%';
            elements.cursorDot.style.opacity = '1';
            
            // Hide all SVG elements
            const svgElements = elements.cursorSvg.querySelectorAll('path, rect, circle');
            svgElements.forEach(el => {
                el.style.opacity = '0';
                el.style.animation = 'none';
            });
            
            // Check element type
            const isLink = element.tagName === 'A' || hasParentWithTag(element, ['A']);
            const isButton = element.tagName === 'BUTTON' || element.type === 'button' || hasParentWithTag(element, ['BUTTON']);
            const isInput = element.tagName === 'INPUT' || element.tagName === 'TEXTAREA' || element.getAttribute('contenteditable') === 'true';
            
            if (isLink || isButton) {
                elements.cursor.style.width = '40px';
                elements.cursor.style.height = '40px';
                elements.cursor.style.mixBlendMode = 'screen';
                
                const pointer = elements.cursorSvg.querySelector('.zero-cursor-pointer');
                if (pointer) pointer.style.opacity = '0.8';
                
                const clickCircle = elements.cursorSvg.querySelector('.zero-cursor-click-circle');
                if (clickCircle) {
                    clickCircle.style.opacity = '0.5';
                    clickCircle.style.animation = 'zero-pulse 1.5s infinite';
                }
            } else if (isInput) {
                elements.cursor.style.width = '3px';
                elements.cursor.style.height = '25px';
                elements.cursor.style.borderRadius = '1px';
                elements.cursor.style.backgroundColor = '#ffffff';
                elements.cursor.style.opacity = '0.7';
                elements.cursorDot.style.opacity = '0';
                
                const textCursor = elements.cursorSvg.querySelector('.zero-cursor-text');
                if (textCursor) textCursor.style.opacity = '0.8';
            }
        });
    }

    // Initialize the custom cursor
    function init() {
        document.documentElement.style.cursor = 'none';
        document.body.style.cursor = 'none';
        
        injectCursorStyles();
        const cursorElements = createCursorElements();
        initCursorMovement(cursorElements);
        setupCursorInteractivity(cursorElements);
        
        // Save reference to cursor instance
        window.zeroCursor = {
            enabled: true,
            elements: cursorElements,
            disable: function() {
                this.elements.cursor.style.display = 'none';
                this.elements.cursorDot.style.display = 'none';
                this.elements.cursorSvg.style.display = 'none';
                document.documentElement.style.cursor = '';
                document.body.style.cursor = '';
                this.enabled = false;
                if (window.zeroCursorRAF) {
                    cancelAnimationFrame(window.zeroCursorRAF);
                }
            },
            enable: function() {
                this.elements.cursor.style.display = 'block';
                this.elements.cursorDot.style.display = 'block';
                this.elements.cursorSvg.style.display = 'block';
                document.documentElement.style.cursor = 'none';
                document.body.style.cursor = 'none';
                this.enabled = true;
                if (!window.zeroCursorRAF) {
                    initCursorMovement(this.elements);
                }
            },
            toggle: function() {
                if (this.enabled) {
                    this.disable();
                } else {
                    this.enable();
                }
            }
        };
        
        console.log('Zero Custom Cursor initialized!');
    }
    
    init();
})();