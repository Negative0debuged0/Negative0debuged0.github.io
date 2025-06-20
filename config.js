// Configuration settings for the website
export default {
    // Site colors - you can change these values to customize the theme
    accentColor: '#ffffff', // Changed from red to white
    
    // Base theme (not selectable by user anymore)
    baseTheme: {
        mainBg: '#000000',
        cardBg: '#0a0a0a',
        textColor: '#ffffff',
        accentColor: '#ffffff',
        headerBg: '#000000',
        cardHover: '#0f0f0f',
        cardBorder: 'rgba(255, 255, 255, 0.2)',
        glitchColor1: '#0ff',
        glitchColor2: '#f0f'
    },
    
    // Project data
    projects: [
        {
            title: "Particle Playground",
            description: "An interactive playground for experimenting with particle simulations and effects.",
            link: "https://negative0debuged0.github.io/ParticlePlayground/",
            thumbnail: "/2025-03-25_13-45.png"
        },
        {
            title: "Button Hover Effects",
            description: "A collection of stylish button hover animations and effects for web interfaces.",
            link: "ButtonHoverEffects/index.html",
            thumbnail: "/2025-03-25_15-44.png"
        },
        {
            title: "Whiteboard (Beta)",
            description: "A minimalist digital whiteboard application with drawing and collaboration tools.",
            link: "https://negative0debuged0.github.io/Whiteboard",
            thumbnail: "/2025-03-25_18-00.png"
        },
        {
            title: "Physics Sandbox",
            description: "An interactive physics simulation platform for exploring realistic object interactions.",
            link: "https://negative0debuged0.github.io/PhysicsSandbox",
            thumbnail: "/2025-03-25_19-46.png"
        },
        {
            title: "Music Visualizer",
            description: "Interactive audio visualizer that transforms music from file uploads or microphone input into stunning visual displays.",
            link: "MusicVisualizer/index.html",
            thumbnail: "/2025-03-27_15-20.png"
        },
        {
            title: "Bookmarklets",
            description: "Some bookmarklets I made. Please note that these may not work on all websites and may be buggy.",
            link: "https://negative0debuged0.github.io/Bookmarklets/",
            thumbnail: null
        },
        {
            title: "Face Mesh",
            description: "Face Meshes. please note that this may lag on some devices.",
            link: "https://negative0debuged0.github.io/FaceMesh/",
            thumbnail: "/2025-06-19_19-43.png"
        },
        {
            title: "Scroll...",
            description: "Just Scroll down",
            link: "https://negative0debuged0.github.io/Scroll/",
            thumbnail: null
        }
    ],
    
    // Options settings
    options: {
        customCursor: true,
        headerParticles: true,
        backgroundParticles: true,
        interactiveBackground: true,
        particleDensity: 'medium',
        particleSpeed: 'medium',
        animationIntensity: 'medium',
        useCustomAccentColor: false,
        customAccentColor: '#ffffff'
    }
};
