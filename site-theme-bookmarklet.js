// Bookmarklet to apply Zer0's dark theme to any website
(function() {
    // Check if theme is already applied
    if (document.querySelector('#zero-theme-style')) {
        // Toggle theme off
        const themeStyle = document.querySelector('#zero-theme-style');
        if (themeStyle.disabled) {
            themeStyle.disabled = false;
            console.log('Zer0 Theme enabled');
        } else {
            themeStyle.disabled = true;
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
            background-color: var(--zero-main-bg) !important;
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
        
        /* Overrides for common website elements */
        /* YouTube */
        ytd-app, #content, .ytd-watch-flexy {
            background-color: var(--zero-main-bg) !important;
        }
        
        /* Discord */
        .container-1eFtFS, .chat-2ZfjoI, .container-1NXEkR, .panels-3wFtMD {
            background-color: var(--zero-main-bg) !important;
        }
        
        /* Google */
        .RNNXgb, .o3j99, .minidiv .sfbg {
            background-color: var(--zero-main-bg) !important;
        }
        
        /* Add more site-specific overrides as needed */
    `;
    
    // Append style to head
    document.head.appendChild(style);
    
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
        console.log(style.disabled ? 'Zer0 Theme disabled' : 'Zer0 Theme enabled');
    });
    
    // Append toggle button to body
    document.body.appendChild(toggleButton);
    
    console.log('Zer0 Theme applied! Click the button in the bottom right to toggle.');
})();