// Bookmarklet to apply Zer0's dark theme to any website
(function() {
    // Check if theme is already applied
    if (document.querySelector('#zero-theme-style')) {
        // Toggle theme off
        const themeStyle = document.querySelector('#zero-theme-style');
        if (themeStyle.disabled) {
            themeStyle.disabled = false;
            // Re-enable cursor if it exists
            if (window.zeroCursor) {
                window.zeroCursor.enable();
            }
            console.log('Zer0 Theme enabled');
        } else {
            themeStyle.disabled = true;
            // Disable cursor if it exists
            if (window.zeroCursor) {
                window.zeroCursor.disable();
            }
            console.log('Zer0 Theme disabled');
        }
        return;
    }
    
    // Create style element
    const style = document.createElement('style');
    style.id = 'zero-theme-style';
    
    // Define theme colors
    const theme = {
        mainBg: '#000000',
        cardBg: '#0a0a0a',
        textColor: '#ffffff',
        accentColor: '#ffffff',
        headerBg: '#000000',
        cardHover: '#0f0f0f',
        cardBorder: 'rgba(255, 255, 255, 0.2)',
        linkColor: '#ffffff'
    };
    
    // CSS rules for the theme
    style.textContent = `
        /* Zero Theme - Easily toggle with the bookmarklet */
        :root {
            --zero-main-bg: ${theme.mainBg};
            --zero-card-bg: ${theme.cardBg};
            --zero-text-color: ${theme.textColor};
            --zero-accent-color: ${theme.accentColor};
            --zero-header-bg: ${theme.headerBg};
            --zero-card-hover: ${theme.cardHover};
            --zero-card-border: ${theme.cardBorder};
        }
        
        /* Basic elements */
        body {
            background-color: var(--zero-main-bg) !important;
            color: var(--zero-text-color) !important;
        }
        
        /* Headers */
        h1, h2, h3, h4, h5, h6 {
            color: var(--zero-text-color) !important;
        }
        
        /* Links */
        a {
            color: var(--zero-accent-color) !important;
        }
        
        /* Buttons */
        button, .button, [role="button"], input[type="button"], input[type="submit"] {
            background-color: var(--zero-card-bg) !important;
            color: var(--zero-text-color) !important;
            border: 1px solid var(--zero-card-border) !important;
            border-radius: 5px !important;
        }
        
        button:hover, .button:hover, [role="button"]:hover, input[type="button"]:hover, input[type="submit"]:hover {
            background-color: var(--zero-card-hover) !important;
            box-shadow: 0 0 5px var(--zero-accent-color) !important;
        }
        
        /* Containers, divs, sections */
        div, section, header, footer, nav, aside, main, article {
            background-color: transparent !important;
        }
        
        /* Make sure text is visible */
        div, section, header, footer, nav, aside, main, article, p, span, li {
            color: var(--zero-text-color) !important;
        }
        
        /* Cards, panels, boxes */
        .card, [class*="card"], [class*="panel"], [class*="box"], [class*="container"] {
            background-color: var(--zero-card-bg) !important;
            border: 1px solid var(--zero-card-border) !important;
            color: var(--zero-text-color) !important;
        }
        
        /* Headers and navigation */
        header, nav, [role="navigation"], [class*="navbar"], [class*="header"], [class*="nav"] {
            background-color: var(--zero-header-bg) !important;
            border-bottom: 1px solid var(--zero-accent-color) !important;
        }
        
        /* Inputs */
        input, textarea, select {
            background-color: var(--zero-card-bg) !important;
            color: var(--zero-text-color) !important;
            border: 1px solid var(--zero-card-border) !important;
        }
        
        /* Tables */
        table, tr, td, th {
            background-color: var(--zero-card-bg) !important;
            color: var(--zero-text-color) !important;
            border-color: var(--zero-card-border) !important;
        }
        
        /* List items */
        li, ul, ol {
            color: var(--zero-text-color) !important;
        }
        
        /* Code blocks */
        pre, code {
            background-color: var(--zero-card-bg) !important;
            color: var(--zero-text-color) !important;
            border: 1px solid var(--zero-card-border) !important;
        }
        
        /* Fix modal and popups to ensure they're visible */
        [class*="modal"], [class*="popup"], [class*="dialog"], [class*="overlay"] {
            background-color: rgba(0, 0, 0, 0.85) !important;
            backdrop-filter: blur(5px) !important;
            z-index: 9999 !important;
        }
        
        /* Ensure dropdowns and tooltips appear above other content */
        [class*="dropdown"], [class*="tooltip"], [class*="menu"], [role="menu"], 
        [aria-haspopup="true"] + div, [aria-expanded="true"] + div {
            z-index: 9990 !important;
            position: relative !important;
            background-color: var(--zero-card-bg) !important;
            border: 1px solid var(--zero-card-border) !important;
        }
        
        /* Fix images and SVGs to prevent black boxes */
        img, svg {
            background-color: transparent !important;
            border: none !important;
            box-shadow: none !important;
        }
        
        /* Fix SVG fill and stroke colors when needed */
        svg path, svg rect, svg circle, svg ellipse, svg line, svg polyline, svg polygon {
            background-color: transparent !important;
        }
        
        /* Preserve image aspect ratio and prevent distortion */
        img {
            max-width: 100% !important;
            height: auto !important;
            object-fit: contain !important;
        }
        
        /* Fix background images */
        [style*="background-image"] {
            background-color: transparent !important;
        }
        
        /* Custom Cursor Styles */
        .zero-cursor {
            position: fixed;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background-color: transparent !important;
            border: 2px solid var(--zero-accent-color);
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
            background-color: var(--zero-accent-color) !important;
            pointer-events: none;
            z-index: 999999;
            transition: opacity 0.3s;
            box-shadow: 0 0 5px var(--zero-accent-color);
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
            background-color: transparent !important;
        }
        
        .zero-cursor-svg svg {
            width: 100%;
            height: 100%;
            background-color: transparent !important;
        }
        
        .zero-cursor-svg svg * {
            background-color: transparent !important;
        }
        
        @keyframes zero-pulse {
            0% { transform: scale(1); opacity: 0.8; }
            50% { transform: scale(1.2); opacity: 0.5; }
            100% { transform: scale(1); opacity: 0.8; }
        }
        
        @keyframes float-around {
            0% { transform: translate(0, 0); }
            25% { transform: translate(50px, 150px); }
            50% { transform: translate(100px, 0); }
            75% { transform: translate(50px, -150px); }
            100% { transform: translate(0, 0); }
        }
        
        .zero-floating-particle {
            position: absolute;
            border-radius: 50%;
            background-color: var(--zero-accent-color) !important;
            z-index: -1;
            box-shadow: 0 0 2px var(--zero-accent-color);
            will-change: left, top, transform;
            animation: float-around var(--duration, 60s) linear infinite;
            animation-delay: var(--delay, 0s);
            pointer-events: none;
        }
        
        .zero-bg-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            pointer-events: none;
            overflow: hidden;
            background-color: transparent !important;
        }
        
        /* Overrides for common website elements */
        /* YouTube */
        ytd-app, #content, .ytd-watch-flexy, #columns {
            background-color: var(--zero-main-bg) !important;
        }
        
        ytd-thumbnail, #thumbnail, ytd-rich-grid-media, ytd-rich-item-renderer {
            background-color: transparent !important;
        }
        
        /* Discord */
        .container-1eFtFS, .chat-2ZfjoI, .container-1NXEkR, .panels-3wFtMD, .sidebar-1tnWFu {
            background-color: var(--zero-main-bg) !important;
        }
        
        .messageContent-2t3eCI, .embedFull-1HGV2S {
            background-color: var(--zero-card-bg) !important;
            border-radius: 5px !important;
            padding: 5px !important;
        }
        
        /* Google */
        .RNNXgb, .o3j99, .minidiv .sfbg, .dodTBe {
            background-color: var(--zero-main-bg) !important;
        }
        
        .g, .kp-wholepage {
            background-color: var(--zero-card-bg) !important;
            border-radius: 8px !important;
            padding: 10px !important;
            margin-bottom: 10px !important;
        }
        
        /* Gmail */
        .nH, .Bs, .G-atb {
            background-color: var(--zero-main-bg) !important;
        }
        
        /* Fix for interfaces with fixed position elements */
        [style*="position: fixed"], [style*="position:fixed"] {
            background-color: transparent !important;
        }
        
        /* Fix videos and iframes */
        video, iframe {
            background-color: transparent !important;
        }
        
        /* Preserve site logos */
        [class*="logo"], [id*="logo"], [class*="brand"], [id*="brand"] {
            background-color: transparent !important;
        }
        
        /* Fix for dark text on dark background */
        [style*="color: black"], [style*="color:#000"], [style*="color: #000"],
        [style*="color: rgb(0, 0, 0)"], [style*="color:rgb(0,0,0)"],
        [style*="color: rgba(0, 0, 0"], [style*="color:rgba(0,0,0"] {
            color: var(--zero-text-color) !important;
        }
        
        /* Prevent content from appearing above modals/overlays */
        .zero-theme-active [style*="z-index:"], .zero-theme-active [style*="z-index: "] {
            z-index: auto !important;
        }
        
        /* Fix for dropdowns and popups */
        .zero-theme-active [class*="dropdown"], 
        .zero-theme-active [class*="popup"],
        .zero-theme-active [class*="tooltip"],
        .zero-theme-active [class*="menu"],
        .zero-theme-active [role="menu"],
        .zero-theme-active [aria-haspopup="true"] + div {
            position: relative !important;
            z-index: 9995 !important;
        }
        
        /* Make sure text is properly contrasted */
        .zero-theme-active [style*="color: white"], 
        .zero-theme-active [style*="color:#fff"], 
        .zero-theme-active [style*="color: #fff"],
        .zero-theme-active [style*="color: rgb(255, 255, 255)"], 
        .zero-theme-active [style*="color:rgb(255,255,255)"] {
            color: var(--zero-text-color) !important;
            text-shadow: 0 0 2px rgba(0, 0, 0, 0.5) !important;
        }
        
        /* Fix layer stacking issues */
        .zero-theme-active {
            --backdrop-z-index: 9998;
            --popup-z-index: 9999;
            --dropdown-z-index: 9995;
            --cursor-z-index: 10000;
        }
        
        .zero-theme-active [class*="backdrop"], 
        .zero-theme-active [class*="overlay"],
        .zero-theme-active [class*="modal-backdrop"],
        .zero-theme-active [class*="drawer-backdrop"] {
            z-index: var(--backdrop-z-index) !important;
        }
        
        .zero-theme-active [class*="modal"],
        .zero-theme-active [class*="dialog"],
        .zero-theme-active [class*="drawer"] {
            z-index: var(--popup-z-index) !important;
        }
        
        /* Fix text visibility within inputs */
        .zero-theme-active input, 
        .zero-theme-active textarea, 
        .zero-theme-active select {
            color: var(--zero-text-color) !important;
            background-color: var(--zero-card-bg) !important;
        }
        
        /* Fix for scrollbars */
        .zero-theme-active ::-webkit-scrollbar {
            width: 10px !important;
            height: 10px !important;
        }
        
        .zero-theme-active ::-webkit-scrollbar-track {
            background: var(--zero-main-bg) !important;
        }
        
        .zero-theme-active ::-webkit-scrollbar-thumb {
            background: var(--zero-accent-color) !important;
            border-radius: 5px !important;
        }
    `;
    
    // Append style to head
    document.head.appendChild(style);
    
    // Add class to document for more targeted CSS
    document.documentElement.classList.add('zero-theme-active');
    
    // Create toggle button
    const toggleButton = document.createElement('div');
    toggleButton.id = 'zero-theme-toggle';
    toggleButton.innerHTML = 'Zer0 Theme';
    toggleButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: #0a0a0a;
        color: #ffffff;
        padding: 8px 12px;
        border-radius: 5px;
        border: 1px solid #ffffff;
        z-index: 9999;
        font-family: Arial, sans-serif;
        font-size: 14px;
        cursor: pointer;
        box-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
    `;
    
    // Toggle theme on click
    toggleButton.addEventListener('click', function() {
        style.disabled = !style.disabled;
        // Toggle cursor alongside the theme
        if (window.zeroCursor) {
            if (style.disabled) {
                window.zeroCursor.disable();
                document.documentElement.style.cursor = 'auto';
                document.body.style.cursor = 'auto';
                document.documentElement.classList.remove('zero-theme-active');
            } else {
                window.zeroCursor.enable();
                document.documentElement.style.cursor = 'none';
                document.body.style.cursor = 'none';
                document.documentElement.classList.add('zero-theme-active');
            }
        } else {
            if (style.disabled) {
                document.documentElement.classList.remove('zero-theme-active');
            } else {
                document.documentElement.classList.add('zero-theme-active');
            }
        }
        console.log(style.disabled ? 'Zer0 Theme disabled' : 'Zer0 Theme enabled');
    });
    
    // Append toggle button to body
    document.body.appendChild(toggleButton);
    
    // Create background particles container
    const bgContainer = document.createElement('div');
    bgContainer.className = 'zero-bg-container';
    document.body.appendChild(bgContainer);
    
    // Create floating background particles
    function createBackgroundParticles() {
        const particlesCount = 30;
        
        for (let i = 0; i < particlesCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'zero-floating-particle';
            
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
            particle.style.setProperty('--duration', `${duration}s`);
            particle.style.setProperty('--delay', `${delay}s`);
            particle.style.opacity = (Math.random() * 0.2 + 0.05).toString();
            
            bgContainer.appendChild(particle);
        }
    }
    
    // Create interactive background
    function setupInteractiveBackground() {
        const maxDots = 10;
        const dots = [];
        
        // Create background dots
        for (let i = 0; i < maxDots; i++) {
            const dot = document.createElement('div');
            dot.className = 'zero-floating-particle';
            dot.style.animation = 'none';
            bgContainer.appendChild(dot);
            
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
    
    // Initialize custom cursor
    function initCustomCursor() {
        // If custom cursor already exists, don't re-create it
        if (window.zeroCursor) return;
        
        // Create custom cursor elements
        const cursor = document.createElement('div');
        cursor.className = 'zero-cursor';
        document.body.appendChild(cursor);
        
        const cursorDot = document.createElement('div');
        cursorDot.className = 'zero-cursor-dot';
        document.body.appendChild(cursorDot);
        
        // Add SVG container for custom cursor shapes with more elements
        const cursorSvg = document.createElement('div');
        cursorSvg.className = 'zero-cursor-svg';
        cursorSvg.innerHTML = `
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle class="zero-cursor-click-circle" cx="20" cy="20" r="15" stroke="var(--zero-accent-color)" stroke-width="1.5" opacity="0"/>
                <path class="zero-cursor-arrow" d="M20 10L10 30L20 25L30 30L20 10Z" fill="var(--zero-accent-color)" opacity="0"/>
                <rect class="zero-cursor-plus-h" x="13" y="19" width="14" height="2" fill="var(--zero-accent-color)" opacity="0"/>
                <rect class="zero-cursor-plus-v" x="19" y="13" width="2" height="14" fill="var(--zero-accent-color)" opacity="0"/>
                <path class="zero-cursor-text" d="M12 15V25M28 15V25M16 15H24M16 25H24" stroke="var(--zero-accent-color)" stroke-width="1.5" opacity="0"/>
                <path class="zero-cursor-grab" d="M14 20V16M14 20V24M14 20H12M20 17V13M20 17V24M20 17H18M26 20V16M26 20V24M26 20H24" stroke="var(--zero-accent-color)" stroke-width="1.5" opacity="0"/>
                <path class="zero-cursor-pointer" d="M20 10L25 25L20 22L15 25L20 10Z" fill="var(--zero-accent-color)" opacity="0"/>
            </svg>
        `;
        document.body.appendChild(cursorSvg);
        
        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;
        let cursorDotX = 0, cursorDotY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Get element under the cursor for context-specific styling
            const element = document.elementFromPoint(e.clientX, e.clientY);
            if (element) {
                updateCursorStyle(element);
            }
        });
        
        // Create a smoother animation loop
        function animateCursor() {
            // Calculate the distance between cursor position and target position
            const lagFactor = 0.15; 
            const dotLagFactor = 0.3; 
            
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
        
        // Hide default cursor
        document.documentElement.style.cursor = 'none';
        document.body.style.cursor = 'none';
        
        // Apply cursor: none to all elements (for higher specificity)
        const styleEl = document.createElement('style');
        styleEl.textContent = `
            * {
                cursor: none !important;
            }
        `;
        document.head.appendChild(styleEl);
        
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
        
        // Handle mouse clicks
        document.addEventListener('mousedown', () => {
            cursor.style.transform = `translate(-50%, -50%) scale(0.8)`;
            cursorDot.style.transform = `translate(-50%, -50%) scale(0.8)`;
            cursorSvg.style.transform = `translate(-50%, -50%) scale(0.8)`;
            
            const clickCircle = cursorSvg.querySelector('.zero-cursor-click-circle');
            if (clickCircle) {
                clickCircle.style.opacity = '1';
                clickCircle.style.animation = 'zero-pulse 0.5s ease-out';
            }
        });
        
        document.addEventListener('mouseup', () => {
            cursor.style.transform = `translate(-50%, -50%) scale(1)`;
            cursorDot.style.transform = `translate(-50%, -50%) scale(1)`;
            cursorSvg.style.transform = `translate(-50%, -50%) scale(1)`;
        });
        
        // Function to update cursor style based on hovered element
        function updateCursorStyle(element) {
            // Helper function to check if element or parent has tag/class
            function hasParentWithTagOrClass(el, tags, classes) {
                if (!el) return false;
                
                let current = el;
                while (current && current !== document.documentElement) {
                    // Check for tag match
                    if (tags && tags.includes(current.tagName)) return true;
                    
                    // Check for class match
                    if (classes) {
                        for (const cls of classes) {
                            if (current.classList && current.classList.contains(cls)) return true;
                        }
                    }
                    
                    current = current.parentElement;
                }
                return false;
            }
            
            // Reset cursor styles
            cursor.style.width = '20px';
            cursor.style.height = '20px';
            cursor.style.backgroundColor = 'transparent';
            cursor.style.mixBlendMode = 'difference';
            cursor.style.borderRadius = '50%';
            cursorDot.style.opacity = '1';
            
            // Hide all SVG elements
            const svgElements = cursorSvg.querySelectorAll('circle, path, rect');
            svgElements.forEach(el => {
                el.style.opacity = '0';
                el.style.animation = 'none';
            });
            
            // Check element type and update cursor accordingly
            const isLink = element.tagName === 'A' || 
                           hasParentWithTagOrClass(element, ['A'], ['link', 'button-link']);
                           
            const isButton = element.tagName === 'BUTTON' || 
                             element.type === 'button' || 
                             element.type === 'submit' || 
                             hasParentWithTagOrClass(element, ['BUTTON'], ['btn', 'button']);
                             
            const isInput = element.tagName === 'INPUT' || 
                           element.tagName === 'TEXTAREA' || 
                           element.getAttribute('contenteditable') === 'true';
                           
            const isClickable = element.onclick || 
                               window.getComputedStyle(element).cursor === 'pointer' ||
                               hasParentWithTagOrClass(element, null, ['clickable', 'selectable']);
            
            if (isLink || isClickable) {
                cursor.style.width = '40px';
                cursor.style.height = '40px';
                cursor.style.mixBlendMode = 'screen';
                
                const pointer = cursorSvg.querySelector('.zero-cursor-pointer');
                if (pointer) pointer.style.opacity = '0.8';
                
                const clickCircle = cursorSvg.querySelector('.zero-cursor-click-circle');
                if (clickCircle) {
                    clickCircle.style.opacity = '0.5';
                    clickCircle.style.animation = 'zero-pulse 1.5s infinite';
                }
            } else if (isButton) {
                cursor.style.width = '40px';
                cursor.style.height = '40px';
                cursor.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                cursor.style.mixBlendMode = 'screen';
                
                const plusH = cursorSvg.querySelector('.zero-cursor-plus-h');
                const plusV = cursorSvg.querySelector('.zero-cursor-plus-v');
                if (plusH && plusV) {
                    plusH.style.opacity = '1';
                    plusV.style.opacity = '1';
                }
                
                const clickCircle = cursorSvg.querySelector('.zero-cursor-click-circle');
                if (clickCircle) {
                    clickCircle.style.opacity = '0.8';
                    clickCircle.style.animation = 'zero-pulse 1.5s infinite';
                }
            } else if (isInput) {
                cursor.style.width = '3px';
                cursor.style.height = '25px';
                cursor.style.borderRadius = '1px';
                cursor.style.backgroundColor = 'var(--zero-accent-color)';
                cursor.style.opacity = '0.7';
                cursorDot.style.opacity = '0';
                
                const textCursor = cursorSvg.querySelector('.zero-cursor-text');
                if (textCursor) textCursor.style.opacity = '0.8';
            }
        }
        
        // Create cursor API
        window.zeroCursor = {
            enabled: true,
            elements: {cursor, cursorDot, cursorSvg},
            disable: function() {
                this.elements.cursor.style.display = 'none';
                this.elements.cursorDot.style.display = 'none';
                this.elements.cursorSvg.style.display = 'none';
                document.documentElement.style.cursor = '';
                document.body.style.cursor = '';
                styleEl.disabled = true;
                this.enabled = false;
            },
            enable: function() {
                this.elements.cursor.style.display = 'block';
                this.elements.cursorDot.style.display = 'block';
                this.elements.cursorSvg.style.display = 'block';
                document.documentElement.style.cursor = 'none';
                document.body.style.cursor = 'none';
                styleEl.disabled = false;
                this.enabled = true;
            }
        };
    }
    
    // Initialize features
    createBackgroundParticles();
    setupInteractiveBackground();
    initCustomCursor();
    
    console.log('Zer0 Theme applied! Click the button in the bottom right to toggle.');
})();