export class DrawingManager {
    constructor(ctx) {
        this.ctx = ctx;
        this.faceTessellation = null;
        
        // Performance optimization - cache calculations
        this.cachedConnections = null;
        this.cachedTriangles = null;
        this.particlePool = [];
        this.maxParticles = 100;
        this.lastTime = 0;
        this.animationSpeed = 1;
        
        // Pre-calculate common values
        this.initializeCache();
        
        // Load additional mesh modules
        this.loadMeshModules();
    }

    setFaceTessellation(tessellation) {
        this.faceTessellation = tessellation;
    }

    initializeCache() {
        this.cachedConnections = this.getFaceConnections();
        this.cachedTriangles = this.getTriangleConnections();
        
        // Initialize particle pool
        for (let i = 0; i < this.maxParticles; i++) {
            this.particlePool.push({
                x: 0, y: 0, size: 0, alpha: 0, active: false,
                vx: 0, vy: 0, life: 0, maxLife: 0
            });
        }
    }

    drawMesh(landmarks, width, height, meshStyle, color) {
        // Early return for performance
        if (!landmarks || landmarks.length === 0) return;
        
        switch (meshStyle) {
            case 'wireframe':
                this.drawWireframe(landmarks, width, height, color);
                break;
            case 'dots':
                this.drawDots(landmarks, width, height, color);
                break;
            case 'triangles':
                this.drawTriangles(landmarks, width, height, color);
                break;
            case 'skeleton':
                this.drawSkeleton(landmarks, width, height, color);
                break;
            case 'contours':
                this.drawContours(landmarks, width, height, color);
                break;
            case 'iris':
                this.drawIris(landmarks, width, height, color);
                break;
            case 'detailed':
                this.drawDetailed(landmarks, width, height, color);
                break;
            case 'neon':
                this.drawNeon(landmarks, width, height, color);
                break;
            case 'particles':
                this.drawParticlesOptimized(landmarks, width, height, color);
                break;
            case 'constellation':
                this.drawConstellation(landmarks, width, height, color);
                break;
            case 'digital':
                this.drawDigital(landmarks, width, height, color);
                break;
            case 'retro':
                this.drawRetro(landmarks, width, height, color);
                break;
            case 'hologram':
                this.drawHologram(landmarks, width, height, color);
                break;
            case 'geometric':
                this.drawGeometric(landmarks, width, height, color);
                break;
            case 'pulse':
                this.drawPulse(landmarks, width, height, color);
                break;
            case 'matrix':
                this.drawMatrix(landmarks, width, height, color);
                break;
            case 'blueprint':
                this.drawBlueprint(landmarks, width, height);
                break;
            case 'glitch':
                this.drawGlitch(landmarks, width, height, color);
                break;
            case 'ink_sketch':
                this.drawInkSketch(landmarks, width, height, color);
                break;
            case 'fire':
                this.drawFireOptimized(landmarks, width, height, color);
                break;
            case 'cyberpunk':
                this.drawCyberpunk(landmarks, width, height, color);
                break;
            case 'tribal':
                this.drawTribal(landmarks, width, height, color);
                break;
            case 'crystal':
                this.drawCrystal(landmarks, width, height, color);
                break;
            case 'gothic':
                this.drawGothic(landmarks, width, height, color);
                break;
            case 'organic':
                this.drawOrganic(landmarks, width, height, color);
                break;
            case 'quantum':
                this.drawQuantum(landmarks, width, height, color);
                break;
            case 'steampunk':
                this.drawSteampunk(landmarks, width, height, color);
                break;
            case 'biomech':
                this.drawBiomech(landmarks, width, height, color);
                break;
            case 'neural':
                this.drawNeural(landmarks, width, height, color);
                break;
            case 'fractal':
                this.drawFractal(landmarks, width, height, color);
                break;
            case 'void':
                this.drawVoid(landmarks, width, height, color);
                break;
            case 'plasma':
                this.drawPlasma(landmarks, width, height, color);
                break;
            case 'ethereal':
                this.drawEthereal(landmarks, width, height, color);
                break;
            case 'celestial':
                this.drawCelestial(landmarks, width, height, color);
                break;
            case 'mechanical':
                this.drawMechanical(landmarks, width, height, color);
                break;
            case 'mystic':
                this.drawMystic(landmarks, width, height, color);
                break;
            case 'laser':
                this.drawLaser(landmarks, width, height, color);
                break;
            case 'cosmic':
                this.drawCosmic(landmarks, width, height, color);
                break;
            case 'cosmictree':
                this.drawCosmicTree(landmarks, width, height, color);
                break;
            case 'zer0':
                this.drawZer0(landmarks, width, height, color);
                break;
        }
    }
    
    drawWireframe(landmarks, width, height, color) {
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 0.5;
        this.ctx.globalAlpha = 0.7;
        
        // Use full tessellation for a dense "true" wireframe look.
        // Fallback to cached connections if tessellation data isn't loaded yet.
        const connections = this.faceTessellation || this.cachedConnections;
        
        this.ctx.beginPath();
        for (const connection of connections) {
            const start = landmarks[connection[0]];
            const end = landmarks[connection[1]];
            
            if (start && end) {
                this.ctx.moveTo(start.x * width, start.y * height);
                this.ctx.lineTo(end.x * width, end.y * height);
            }
        }
        this.ctx.stroke();
        this.ctx.globalAlpha = 1;
    }
    
    drawDots(landmarks, width, height, color) {
        this.ctx.fillStyle = color;
        this.ctx.globalAlpha = 0.8;
        
        for (const landmark of landmarks) {
            this.ctx.beginPath();
            this.ctx.arc(landmark.x * width, landmark.y * height, 2, 0, 2 * Math.PI);
            this.ctx.fill();
        }
        this.ctx.globalAlpha = 1;
    }
    
    drawTriangles(landmarks, width, height, color) {
        this.ctx.strokeStyle = color;
        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);
        this.ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.1)`;
        this.ctx.lineWidth = 0.5;
        this.ctx.globalAlpha = 0.6;
        
        // Draw triangular mesh using Delaunay-like connections
        const triangles = this.getTriangleConnections();
        
        for (const triangle of triangles) {
            const p1 = landmarks[triangle[0]];
            const p2 = landmarks[triangle[1]];
            const p3 = landmarks[triangle[2]];
            
            this.ctx.beginPath();
            this.ctx.moveTo(p1.x * width, p1.y * height);
            this.ctx.lineTo(p2.x * width, p2.y * height);
            this.ctx.lineTo(p3.x * width, p3.y * height);
            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.stroke();
        }
        this.ctx.globalAlpha = 1;
    }
    
    getFaceConnections() {
        // Simplified face mesh connections for wireframe
        return [
            // Face oval
            [10, 338], [338, 297], [297, 332], [332, 284], [284, 251], [251, 389], [389, 356],
            [356, 454], [454, 323], [323, 361], [361, 288], [288, 397], [397, 365], [365, 379],
            [379, 378], [378, 400], [400, 377], [377, 152], [152, 148], [148, 176], [176, 149],
            [149, 150], [150, 136], [136, 172], [172, 58], [58, 132], [132, 93], [93, 234],
            [234, 127], [127, 162], [162, 21], [21, 54], [54, 103], [103, 67], [67, 109],
            [109, 10], [10, 151], [151, 9], [9, 10],
            
            // Eyes
            [33, 7], [7, 163], [163, 144], [144, 145], [145, 153], [153, 154], [154, 155],
            [155, 133], [133, 173], [173, 157], [157, 158], [158, 159], [159, 160], [160, 161],
            [161, 246], [246, 33],
            
            [362, 382], [382, 381], [381, 380], [380, 374], [374, 373], [373, 390], [390, 249],
            [249, 263], [263, 466], [466, 388], [388, 387], [387, 386], [386, 385], [385, 384],
            [384, 398], [398, 362],
            
            // Nose
            [19, 94], [94, 125], [125, 141], [141, 235], [235, 31], [31, 228], [228, 229],
            [229, 230], [230, 231], [231, 232], [232, 233], [233, 244], [244, 245], [245, 122],
            [122, 6], [6, 202], [202, 214], [214, 234],
            
            // Mouth (outer)
            [61, 185], [185, 40], [40, 39], [39, 37], [37, 0], [0, 267], [267, 269], [269, 270], [270, 409], [409, 291], [291, 375], [375, 321], [321, 405], [405, 314], [314, 17], [17, 84], [84, 181], [181, 91], [91, 146], [146, 61],
            // Mouth (inner)
            [78, 191], [191, 80], [80, 81], [81, 82], [82, 13], [13, 312], [312, 311], [311, 310], [310, 415], [415, 308], [308, 324], [324, 318], [318, 402], [402, 317], [317, 14], [14, 87], [87, 178], [178, 88], [88, 95], [95, 78],
            // Mouth connections (vertical)
            [0, 13], [17, 14]
        ];
    }
    
    getTriangleConnections() {
        // Simplified triangular connections for demonstration
        return [
            [10, 151, 9], [151, 337, 299], [337, 299, 333], [299, 333, 298],
            [333, 298, 301], [298, 301, 284], [301, 284, 251], [284, 251, 389],
            [251, 389, 356], [389, 356, 454], [356, 454, 323], [454, 323, 361],
            [323, 361, 288], [361, 288, 397], [288, 397, 365], [397, 365, 379],
            [365, 379, 378], [379, 378, 400], [378, 400, 377], [400, 377, 152],
            [377, 152, 148], [152, 148, 176], [148, 176, 149], [176, 149, 150],
            [149, 150, 136], [150, 136, 172], [136, 172, 58], [172, 58, 132],
            [58, 132, 93], [132, 93, 234], [93, 234, 127], [234, 127, 162],
            [127, 162, 21], [162, 21, 54], [21, 54, 103], [54, 103, 67],
            [103, 67, 109], [67, 109, 10], [109, 10, 151]
        ];
    }
    
    drawHand(landmarks, handedness, width, height, meshStyle, leftHandColor, rightHandColor) {
        const isLeft = handedness.label === 'Left';
        const handColor = isLeft ? leftHandColor : rightHandColor;
        
        switch (meshStyle) {
            case 'wireframe':
                this.drawHandWireframe(landmarks, width, height, handColor);
                break;
            case 'dots':
                this.drawHandDots(landmarks, width, height, handColor);
                break;
            case 'triangles':
                this.drawHandTriangles(landmarks, width, height, handColor);
                break;
            case 'skeleton':
                this.drawHandSkeleton(landmarks, width, height, handColor);
                break;
            case 'contours':
                this.drawHandContours(landmarks, width, height, handColor);
                break;
            case 'iris':
                this.drawHandDots(landmarks, width, height, handColor); // fallback for hands
                break;
            case 'detailed':
                this.drawHandDetailed(landmarks, width, height, handColor);
                break;
            case 'neon':
                this.drawHandNeon(landmarks, width, height, handColor);
                break;
            case 'particles':
                this.drawHandParticles(landmarks, width, height, handColor);
                break;
            case 'constellation':
                this.drawHandConstellation(landmarks, width, height, handColor);
                break;
            case 'digital':
                this.drawHandDigital(landmarks, width, height, handColor);
                break;
            case 'retro':
                this.drawHandRetro(landmarks, width, height, handColor);
                break;
            case 'hologram':
                this.drawHandHologram(landmarks, width, height, handColor);
                break;
            case 'geometric':
                this.drawHandGeometric(landmarks, width, height, handColor);
                break;
            case 'pulse':
                this.drawHandPulse(landmarks, width, height, handColor);
                break;
            case 'matrix':
                this.drawHandMatrix(landmarks, width, height, handColor);
                break;
            case 'blueprint':
                this.drawHandBlueprint(landmarks, width, height, handColor);
                break;
            case 'glitch':
                this.drawHandGlitch(landmarks, width, height, handColor);
                break;
            case 'ink_sketch':
                this.drawHandInkSketch(landmarks, width, height, handColor);
                break;
            case 'fire':
                this.drawHandFire(landmarks, width, height, handColor);
                break;
            case 'cyberpunk':
                this.drawHandCyberpunk(landmarks, width, height, handColor);
                break;
            case 'tribal':
                this.drawHandTribal(landmarks, width, height, handColor);
                break;
            case 'crystal':
                this.drawHandCrystal(landmarks, width, height, handColor);
                break;
            case 'gothic':
                this.drawHandGothic(landmarks, width, height, handColor);
                break;
            case 'organic':
                this.drawHandOrganic(landmarks, width, height, handColor);
                break;
            case 'quantum':
                this.drawHandQuantum(landmarks, width, height, handColor);
                break;
            case 'steampunk':
                this.drawHandSteampunk(landmarks, width, height, handColor);
                break;
            case 'biomech':
                this.drawHandBiomech(landmarks, width, height, handColor);
                break;
            case 'neural':
                this.drawHandNeural(landmarks, width, height, handColor);
                break;
            case 'fractal':
                this.drawHandFractal(landmarks, width, height, handColor);
                break;
            case 'void':
                this.drawHandVoid(landmarks, width, height, handColor);
                break;
            case 'plasma':
                this.drawHandPlasma(landmarks, width, height, handColor);
                break;
            case 'ethereal':
                this.drawHandEthereal(landmarks, width, height, handColor);
                break;
            case 'celestial':
                this.drawHandCelestial(landmarks, width, height, handColor);
                break;
            case 'mechanical':
                this.drawHandMechanical(landmarks, width, height, handColor);
                break;
            case 'mystic':
                this.drawHandMystic(landmarks, width, height, handColor);
                break;
            case 'laser':
                this.drawHandLaser(landmarks, width, height, handColor);
                break;
            case 'cosmic':
                this.drawHandCosmic(landmarks, width, height, handColor);
                break;
            case 'cosmictree':
                this.drawHandCosmicTree(landmarks, width, height, handColor);
                break;
            case 'zer0':
                this.drawHandZer0(landmarks, width, height, handColor);
                break;
        }
    }
    
    drawHandWireframe(landmarks, width, height, color) {
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 2;
        this.ctx.globalAlpha = 0.8;
        
        // Hand connections
        const connections = [
            // Thumb
            [0, 1], [1, 2], [2, 3], [3, 4],
            // Index finger
            [0, 5], [5, 6], [6, 7], [7, 8],
            // Middle finger
            [0, 9], [9, 10], [10, 11], [11, 12],
            // Ring finger
            [0, 13], [13, 14], [14, 15], [15, 16],
            // Pinky
            [0, 17], [17, 18], [18, 19], [19, 20],
            // Palm
            [5, 9], [9, 13], [13, 17]
        ];
        
        this.ctx.beginPath();
        for (const connection of connections) {
            const start = landmarks[connection[0]];
            const end = landmarks[connection[1]];
            this.ctx.moveTo(start.x * width, start.y * height);
            this.ctx.lineTo(end.x * width, end.y * height);
        }
        this.ctx.stroke();
        this.ctx.globalAlpha = 1;
    }
    
    drawHandDots(landmarks, width, height, color) {
        this.ctx.fillStyle = color;
        this.ctx.globalAlpha = 0.8;
        
        for (let i = 0; i < landmarks.length; i++) {
            const landmark = landmarks[i];
            const radius = i === 0 ? 4 : 3; // Larger dot for wrist
            
            this.ctx.beginPath();
            this.ctx.arc(landmark.x * width, landmark.y * height, radius, 0, 2 * Math.PI);
            this.ctx.fill();
        }
        this.ctx.globalAlpha = 1;
    }
    
    drawHandTriangles(landmarks, width, height, color) {
        this.ctx.strokeStyle = color;
        this.ctx.fillStyle = color.replace('rgb', 'rgba').replace(')', ', 0.1)');
        this.ctx.lineWidth = 1;
        this.ctx.globalAlpha = 0.6;
        
        // Simple triangular connections for palm and fingers
        const triangles = [
            [0, 5, 9], [0, 9, 13], [0, 13, 17], [5, 9, 13],
            [1, 2, 5], [2, 3, 4], [5, 6, 7], [6, 7, 8],
            [9, 10, 11], [10, 11, 12], [13, 14, 15], [14, 15, 16],
            [17, 18, 19], [18, 19, 20]
        ];
        
        for (const triangle of triangles) {
            const p1 = landmarks[triangle[0]];
            const p2 = landmarks[triangle[1]];
            const p3 = landmarks[triangle[2]];
            
            this.ctx.beginPath();
            this.ctx.moveTo(p1.x * width, p1.y * height);
            this.ctx.lineTo(p2.x * width, p2.y * height);
            this.ctx.lineTo(p3.x * width, p3.y * height);
            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.stroke();
        }
        this.ctx.globalAlpha = 1;
    }
    
    drawHandSkeleton(landmarks, width, height, color) {
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 3;
        this.ctx.globalAlpha = 0.9;
        
        // Draw main hand structure only
        const connections = [
            [0, 5], [0, 9], [0, 13], [0, 17], // Palm to finger bases
            [5, 6], [9, 10], [13, 14], [17, 18], // First joints
            [6, 7], [10, 11], [14, 15], [18, 19], // Second joints
            [7, 8], [11, 12], [15, 16], [19, 20], // Fingertips
            [1, 2], [2, 3], [3, 4] // Thumb
        ];
        
        this.ctx.beginPath();
        for (const connection of connections) {
            const start = landmarks[connection[0]];
            const end = landmarks[connection[1]];
            this.ctx.moveTo(start.x * width, start.y * height);
            this.ctx.lineTo(end.x * width, end.y * height);
        }
        this.ctx.stroke();
        this.ctx.globalAlpha = 1;
    }
    
    drawHandContours(landmarks, width, height, color) {
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 4;
        this.ctx.globalAlpha = 0.8;
        
        // Draw finger outlines
        const fingers = [
            [0, 1, 2, 3, 4], // Thumb
            [0, 5, 6, 7, 8], // Index
            [0, 9, 10, 11, 12], // Middle
            [0, 13, 14, 15, 16], // Ring
            [0, 17, 18, 19, 20] // Pinky
        ];
        
        for (const finger of fingers) {
            this.ctx.beginPath();
            const firstPoint = landmarks[finger[0]];
            this.ctx.moveTo(firstPoint.x * width, firstPoint.y * height);
            
            for (let i = 1; i < finger.length; i++) {
                const point = landmarks[finger[i]];
                this.ctx.lineTo(point.x * width, point.y * height);
            }
            this.ctx.stroke();
        }
        
        // Draw palm outline
        this.ctx.beginPath();
        const palmPoints = [0, 5, 9, 13, 17];
        const firstPalmPoint = landmarks[palmPoints[0]];
        this.ctx.moveTo(firstPalmPoint.x * width, firstPalmPoint.y * height);
        for (let i = 1; i < palmPoints.length; i++) {
            const point = landmarks[palmPoints[i]];
            this.ctx.lineTo(point.x * width, point.y * height);
        }
        this.ctx.closePath();
        this.ctx.stroke();
        
        this.ctx.globalAlpha = 1;
    }
    
    drawHandDetailed(landmarks, width, height, color) {
        // Combine wireframe and dots
        this.drawHandWireframe(landmarks, width, height, color);
        
        this.ctx.fillStyle = color;
        this.ctx.globalAlpha = 0.6;
        
        // Draw joints as circles
        for (let i = 0; i < landmarks.length; i++) {
            const landmark = landmarks[i];
            const radius = [0, 5, 9, 13, 17].includes(i) ? 4 : 2; // Larger for major joints
            
            this.ctx.beginPath();
            this.ctx.arc(landmark.x * width, landmark.y * height, radius, 0, 2 * Math.PI);
            this.ctx.fill();
        }
        this.ctx.globalAlpha = 1;
    }
    
    drawSkeleton(landmarks, width, height, color) {
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 2;
        this.ctx.globalAlpha = 0.9;
        
        // Major facial structure lines
        const connections = [
            // Face outline
            [10, 151], [151, 9], [9, 10],
            [234, 93], [93, 132], [132, 58],
            [172, 136], [136, 150], [150, 149],
            [176, 148], [148, 152], [152, 377],
            [400, 378], [378, 379], [379, 365],
            [397, 288], [288, 361], [361, 323],
            
            // Eyes
            [33, 133], [362, 263],
            [7, 163], [382, 381],
            
            // Nose bridge
            [19, 94], [94, 125], [125, 141],
            [235, 31], [31, 228],
            
            // Mouth
            [61, 291], [13, 82], [14, 17]
        ];
        
        this.ctx.beginPath();
        for (const connection of connections) {
            const start = landmarks[connection[0]];
            const end = landmarks[connection[1]];
            
            this.ctx.moveTo(start.x * width, start.y * height);
            this.ctx.lineTo(end.x * width, end.y * height);
        }
        this.ctx.stroke();
        this.ctx.globalAlpha = 1;
    }
    
    drawContours(landmarks, width, height, color) {
        this.ctx.lineWidth = 3;
        this.ctx.globalAlpha = 0.8;
        
        // Different colored contours for different features
        const contours = [
            { points: [10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109], color: color, closed: true }, // Face
            { points: [33, 7, 163, 144, 145, 153, 154, 155, 133, 173, 157, 158, 159, 160, 161, 246], color: '#ff4444', closed: true }, // Left eye
            { points: [362, 382, 381, 380, 374, 373, 390, 249, 263, 466, 388, 387, 386, 385, 384, 398], color: '#ff4444', closed: true }, // Right eye
            { points: [61, 84, 17, 314, 405, 320, 307, 375, 321, 308, 324, 318], color: '#4488ff', closed: true }, // Outer lips
            { points: [78, 95, 88, 178, 87, 14, 317, 402, 318, 324, 308, 415, 310, 311, 312, 13, 82, 81, 80, 79], color: '#ff8844', closed: true } // Inner lips
        ];
        
        for (const contour of contours) {
            this.ctx.strokeStyle = contour.color;
            this.ctx.beginPath();
            
            const firstPoint = landmarks[contour.points[0]];
            this.ctx.moveTo(firstPoint.x * width, firstPoint.y * height);
            
            for (let i = 1; i < contour.points.length; i++) {
                const point = landmarks[contour.points[i]];
                this.ctx.lineTo(point.x * width, point.y * height);
            }
            
            if (contour.closed) {
                this.ctx.closePath();
            }
            this.ctx.stroke();
        }
        this.ctx.globalAlpha = 1;
    }
    
    drawIris(landmarks, width, height, color) {
        this.ctx.globalAlpha = 0.9;
        
        // Draw basic face outline
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        const facePoints = [10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109];
        const firstFacePoint = landmarks[facePoints[0]];
        this.ctx.moveTo(firstFacePoint.x * width, firstFacePoint.y * height);
        for (let i = 1; i < facePoints.length; i++) {
            const point = landmarks[facePoints[i]];
            this.ctx.lineTo(point.x * width, point.y * height);
        }
        this.ctx.closePath();
        this.ctx.stroke();
        
        // Draw detailed eyes with iris estimation
        const leftEyeCenter = landmarks[468]; // Left iris center
        const rightEyeCenter = landmarks[473]; // Right iris center
        
        if (leftEyeCenter && rightEyeCenter) {
            // Left eye
            this.ctx.strokeStyle = '#00ffff';
            this.ctx.fillStyle = 'rgba(0, 255, 255, 0.3)';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.arc(leftEyeCenter.x * width, leftEyeCenter.y * height, 8, 0, 2 * Math.PI);
            this.ctx.fill();
            this.ctx.stroke();
            
            // Right eye
            this.ctx.beginPath();
            this.ctx.arc(rightEyeCenter.x * width, rightEyeCenter.y * height, 8, 0, 2 * Math.PI);
            this.ctx.fill();
            this.ctx.stroke();
        }
        
        // Eye outlines
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 2;
        const leftEyePoints = [33, 7, 163, 144, 145, 153, 154, 155, 133, 173, 157, 158, 159, 160, 161, 246];
        const rightEyePoints = [362, 382, 381, 380, 374, 373, 390, 249, 263, 466, 388, 387, 386, 385, 384, 398];
        
        this.ctx.beginPath();
        const firstLeftPoint = landmarks[leftEyePoints[0]];
        this.ctx.moveTo(firstLeftPoint.x * width, firstLeftPoint.y * height);
        for (let i = 1; i < leftEyePoints.length; i++) {
            const point = landmarks[leftEyePoints[i]];
            this.ctx.lineTo(point.x * width, point.y * height);
        }
        this.ctx.closePath();
        this.ctx.stroke();
        
        this.ctx.globalAlpha = 1;
    }
    
    drawDetailed(landmarks, width, height, color) {
        // Combine multiple rendering techniques
        this.ctx.globalAlpha = 0.6;
        
        // Draw all landmarks as small dots
        this.ctx.fillStyle = '#888888';
        for (const landmark of landmarks) {
            this.ctx.beginPath();
            this.ctx.arc(landmark.x * width, landmark.y * height, 1, 0, 2 * Math.PI);
            this.ctx.fill();
        }
        
        // Draw wireframe
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 0.5;
        const connections = this.getFaceConnections();
        this.ctx.beginPath();
        for (const connection of connections) {
            const start = landmarks[connection[0]];
            const end = landmarks[connection[1]];
            this.ctx.moveTo(start.x * width, start.y * height);
            this.ctx.lineTo(end.x * width, end.y * height);
        }
        this.ctx.stroke();
        
        // Highlight key features
        this.ctx.fillStyle = '#ff0000';
        const keyPoints = [19, 94, 168, 8, 151, 10]; // Nose tip, forehead, chin
        for (const pointIndex of keyPoints) {
            const point = landmarks[pointIndex];
            this.ctx.beginPath();
            this.ctx.arc(point.x * width, point.y * height, 3, 0, 2 * Math.PI);
            this.ctx.fill();
        }
        
        this.ctx.globalAlpha = 1;
    }
    
    drawNeon(landmarks, width, height, color) {
        const time = Date.now() * 0.003;
        this.ctx.shadowBlur = 15;
        this.ctx.shadowColor = color;
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 3;
        this.ctx.globalAlpha = 0.9;
        
        const connections = this.getFaceConnections();
        this.ctx.beginPath();
        for (const connection of connections) {
            const start = landmarks[connection[0]];
            const end = landmarks[connection[1]];
            
            // Add digital glitch effect
            const glitch = Math.sin(time * 10 + connection[0]) * 0.002;
            this.ctx.moveTo(start.x * width + glitch, start.y * height);
            this.ctx.lineTo(end.x * width + glitch, end.y * height);
        }
        this.ctx.stroke();
        
        // Add glowing dots at key points
        this.ctx.fillStyle = '#ffffff';
        this.ctx.shadowBlur = 20;
        const keyPoints = [19, 94, 168, 8, 151, 10, 33, 362, 61, 291];
        for (const pointIndex of keyPoints) {
            const point = landmarks[pointIndex];
            this.ctx.beginPath();
            this.ctx.arc(point.x * width, point.y * height, 4, 0, 2 * Math.PI);
            this.ctx.fill();
        }
        
        this.ctx.shadowBlur = 0;
        this.ctx.globalAlpha = 1;
    }
    
    drawParticlesOptimized(landmarks, width, height, color) {
        const currentTime = performance.now();
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        
        // Limit particle updates to every few frames for performance
        if (deltaTime < 50) return; // Skip if less than 50ms has passed
        
        const time = currentTime * 0.005;
        let activeParticles = 0;
        
        // Update existing particles
        for (const particle of this.particlePool) {
            if (particle.active) {
                particle.life -= deltaTime;
                if (particle.life <= 0) {
                    particle.active = false;
                    continue;
                }
                
                particle.x += particle.vx;
                particle.y += particle.vy;
                particle.alpha = particle.life / particle.maxLife;
                activeParticles++;
            }
        }
        
        // Add new particles from landmarks (reduced rate)
        if (activeParticles < this.maxParticles / 2) {
            for (let i = 0; i < landmarks.length; i += 5) { // Reduced frequency
                const landmark = landmarks[i];
                const particle = this.getInactiveParticle();
                
                if (particle) {
                    particle.active = true;
                    particle.x = landmark.x * width;
                    particle.y = landmark.y * height;
                    particle.size = 2 + Math.random() * 2;
                    particle.vx = (Math.random() - 0.5) * 2;
                    particle.vy = (Math.random() - 0.5) * 2;
                    particle.life = particle.maxLife = 1000 + Math.random() * 1000;
                    particle.alpha = 1;
                }
            }
        }
        
        // Render particles in batch
        this.ctx.fillStyle = color;
        for (const particle of this.particlePool) {
            if (particle.active) {
                this.ctx.globalAlpha = particle.alpha * 0.8;
                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, particle.size, 0, 2 * Math.PI);
                this.ctx.fill();
            }
        }
        this.ctx.globalAlpha = 1;
    }
    
    getInactiveParticle() {
        return this.particlePool.find(p => !p.active);
    }
    
    drawConstellation(landmarks, width, height, color) {
        // Draw stars at landmark points
        this.ctx.fillStyle = color;
        this.ctx.globalAlpha = 0.9;
        
        for (const landmark of landmarks) {
            this.ctx.beginPath();
            this.ctx.arc(landmark.x * width, landmark.y * height, 1.5, 0, 2 * Math.PI);
            this.ctx.fill();
        }
        
        // Connect nearby landmarks with faint lines
        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);
        this.ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, 0.3)`;
        this.ctx.lineWidth = 0.5;
        this.ctx.beginPath();
        
        for (let i = 0; i < landmarks.length; i++) {
            for (let j = i + 1; j < landmarks.length; j++) {
                const p1 = landmarks[i];
                const p2 = landmarks[j];
                const distance = Math.sqrt(
                    Math.pow((p1.x - p2.x) * width, 2) + 
                    Math.pow((p1.y - p2.y) * height, 2)
                );
                
                if (distance < 30) {
                    this.ctx.moveTo(p1.x * width, p1.y * height);
                    this.ctx.lineTo(p2.x * width, p2.y * height);
                }
            }
        }
        this.ctx.stroke();
        this.ctx.globalAlpha = 1;
    }
    
    drawDigital(landmarks, width, height, color) {
        const time = Date.now() * 0.002;
        
        // Main grid pattern background around face
        this.ctx.strokeStyle = color.replace('rgb', 'rgba').replace(')', ', 0.2)');
        this.ctx.lineWidth = 0.5;
        
        // Create a digital grid pattern focused around facial features
        const faceCenter = landmarks[168]; // Nose bridge
        if (faceCenter) {
            const gridSize = 10;
            const gridRange = 200;
            const centerX = faceCenter.x * width;
            const centerY = faceCenter.y * height;
            
            // Horizontal lines
            for (let y = centerY - gridRange; y < centerY + gridRange; y += gridSize) {
                const distanceFromCenter = Math.abs(y - centerY);
                const glitchOffset = Math.sin(time * 5 + y * 0.1) * 2;
                this.ctx.globalAlpha = 0.1 + (1 - distanceFromCenter/gridRange) * 0.3;
                
                this.ctx.beginPath();
                this.ctx.moveTo(centerX - gridRange + glitchOffset, y);
                this.ctx.lineTo(centerX + gridRange + glitchOffset, y);
                this.ctx.stroke();
            }
            
            // Vertical lines
            for (let x = centerX - gridRange; x < centerX + gridRange; x += gridSize) {
                const distanceFromCenter = Math.abs(x - centerX);
                const glitchOffset = Math.cos(time * 5 + x * 0.1) * 2;
                this.ctx.globalAlpha = 0.1 + (1 - distanceFromCenter/gridRange) * 0.3;
                
                this.ctx.beginPath();
                this.ctx.moveTo(x, centerY - gridRange + glitchOffset);
                this.ctx.lineTo(x, centerY + gridRange + glitchOffset);
                this.ctx.stroke();
            }
        }

        // Digital facial features with unique styling
        const features = {
            leftEye: {
                outline: [33, 7, 163, 144, 145, 153, 154, 155, 133, 173, 157, 158, 159, 160, 161, 246],
                center: 468 // Left iris
            },
            rightEye: {
                outline: [362, 382, 381, 380, 374, 373, 390, 249, 263, 466, 388, 387, 386, 385, 384, 398],
                center: 473 // Right iris
            },
            mouth: [61, 291, 306, 292, 308, 324, 318, 402, 317, 14, 87, 178, 88, 95],
            nose: [168, 6, 197, 195, 5, 4, 1, 19, 94],
            jawline: [139, 34, 227, 137, 177, 215, 138, 135, 169, 170, 140, 171]
        };

        this.ctx.strokeStyle = color;
        this.ctx.fillStyle = color;
        this.ctx.lineWidth = 1.5;
        this.ctx.globalAlpha = 0.9;

        // Draw each color channel with unique distortion
        for (const [feature, points] of Object.entries(features)) {
            if (Array.isArray(points)) {
                // Draw feature outline with digital segments
                this.ctx.beginPath();
                for (let i = 0; i < points.length; i++) {
                    const point = landmarks[points[i]];
                    const glitch = Math.sin(time * 8 + i) * 0.001;
                    
                    if (i === 0) {
                        this.ctx.moveTo(point.x * width + glitch, point.y * height);
                    } else {
                        // Create digital stepping effect
                        const prev = landmarks[points[i-1]];
                        const midX = (prev.x + point.x) * width / 2;
                        const midY = (prev.y + point.y) * height / 2;
                        
                        this.ctx.lineTo(midX + glitch, prev.y * height);
                        this.ctx.lineTo(midX + glitch, point.y * height);
                        this.ctx.lineTo(point.x * width + glitch, point.y * height);
                    }
                }
                this.ctx.stroke();
            } else {
                // Special handling for eyes with iris
                const outline = points.outline;
                const center = points.center;
                
                // Draw eye outline with digital effect
                this.ctx.beginPath();
                for (let i = 0; i < outline.length; i++) {
                    const point = landmarks[outline[i]];
                    const glitch = Math.sin(time * 8 + i) * 0.001;
                    
                    if (i === 0) {
                        this.ctx.moveTo(point.x * width + glitch, point.y * height);
                    } else {
                        this.ctx.lineTo(point.x * width + glitch, point.y * height);
                    }
                }
                this.ctx.stroke();
                
                // Draw iris with digital circle effect
                this.ctx.beginPath();
                this.ctx.arc(landmarks[center].x * width, landmarks[center].y * height, 4, 0, Math.PI * 2);
                this.ctx.stroke();
            }
        }

        // Add digital data points at key facial landmarks
        const keyPoints = [33, 133, 362, 263, 61, 291, 168, 8, 468, 473];
        this.ctx.fillStyle = color;
        for (const point of keyPoints) {
            const landmark = landmarks[point];
            const size = 3 + Math.sin(time + point) * 0.001;
            const x = landmark.x * width;
            const y = landmark.y * height;
            
            // Draw digital square
            this.ctx.fillRect(x - size/2, y - size/2, size, size);
            
            // Add small connecting lines
            this.ctx.beginPath();
            this.ctx.moveTo(x + size, y);
            this.ctx.lineTo(x + size + 5, y);
            this.ctx.moveTo(x - size, y);
            this.ctx.lineTo(x - size - 5, y);
            this.ctx.stroke();
        }

        this.ctx.globalAlpha = 1;
    }
    
    drawRetro(landmarks, width, height, color) {
        const time = Date.now() * 0.001;
        
        // Retro scan lines effect
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 2;
        this.ctx.globalAlpha = 0.7;
        
        // Draw horizontal scan lines across face
        const faceCenter = landmarks[9]; // nose tip
        const scanY = faceCenter.y * height;
        const scanRange = 100;
        
        for (let y = scanY - scanRange; y < scanY + scanRange; y += 8) {
            const alpha = 1 - Math.abs(y - scanY) / scanRange;
            this.ctx.globalAlpha = alpha * 0.5;
            this.ctx.beginPath();
            this.ctx.moveTo(0, y + Math.sin(time + y * 0.1) * 2);
            this.ctx.lineTo(width, y + Math.sin(time + y * 0.1) * 2);
            this.ctx.stroke();
        }
        
        // Draw retro wireframe
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 1;
        this.ctx.globalAlpha = 0.8;
        
        const connections = this.getFaceConnections();
        this.ctx.beginPath();
        for (const connection of connections) {
            const start = landmarks[connection[0]];
            const end = landmarks[connection[1]];
            this.ctx.moveTo(start.x * width, start.y * height);
            this.ctx.lineTo(end.x * width, end.y * height);
        }
        this.ctx.stroke();
        this.ctx.globalAlpha = 1;
    }
    
    drawHologram(landmarks, width, height, color) {
        const time = Date.now() * 0.003;
        
        // Holographic interference patterns
        this.ctx.globalAlpha = 0.7;
        
        for (let offset = 0; offset < 3; offset++) {
            this.ctx.strokeStyle = color;
            this.ctx.globalAlpha = 0.3 + offset * 0.2;
            this.ctx.lineWidth = 1;
            
            const connections = this.getFaceConnections();
            this.ctx.beginPath();
            for (const connection of connections) {
                const start = landmarks[connection[0]];
                const end = landmarks[connection[1]];
                
                const offsetX = Math.sin(time + offset * 2) * 1.5;
                const offsetY = Math.cos(time + offset * 2) * 1.5;
                
                this.ctx.moveTo(start.x * width + offsetX, start.y * height + offsetY);
                this.ctx.lineTo(end.x * width + offsetX, end.y * height + offsetY);
            }
            this.ctx.stroke();
        }
        
        // Add holographic sparkles
        this.ctx.fillStyle = '#ffffff';
        for (let i = 0; i < landmarks.length; i += 8) {
            const landmark = landmarks[i];
            const sparkle = Math.sin(time * 5 + i) * 0.5 + 0.5;
            
            if (sparkle > 0.7) {
                this.ctx.globalAlpha = sparkle;
                this.ctx.beginPath();
                this.ctx.arc(landmark.x * width, landmark.y * height, 2, 0, 2 * Math.PI);
                this.ctx.fill();
            }
        }
        this.ctx.globalAlpha = 1;
    }
    
    drawGeometric(landmarks, width, height, color) {
        this.ctx.globalAlpha = 0.8;
        
        // Define key facial features with geometric patterns
        const features = {
            forehead: {
                points: [10, 151, 337, 299, 332, 337],
                shape: 'hexagon',
                color: '#4488ff',
                size: 20,
                rotation: Math.PI / 6
            },
            leftEye: {
                points: [33, 7, 163, 144, 145, 153],
                shape: 'diamond',
                color: '#44ff88',
                size: 15,
                pattern: 'concentric'
            },
            rightEye: {
                points: [362, 382, 381, 380, 374, 373],
                shape: 'diamond',
                color: '#44ff88',
                size: 15,
                pattern: 'concentric'
            },
            nose: {
                points: [5, 4, 1, 19, 94],
                shape: 'triangle',
                color: '#ff8844',
                size: 12,
                pattern: 'grid'
            },
            leftCheek: {
                points: [234, 127, 162],
                shape: 'pentagon',
                color: '#ff4488',
                size: 18
            },
            rightCheek: {
                points: [454, 359, 367],
                shape: 'pentagon',
                color: '#ff4488',
                size: 18
            },
            mouth: {
                points: [61, 291, 306, 292, 308, 324, 318, 402, 317, 14, 87, 178, 88, 95],
                shape: 'octagon',
                color: '#8844ff',
                size: 25,
                pattern: 'radial'
            }
        };

        // Draw each geometric feature
        for (const [name, feature] of Object.entries(features)) {
            const centerX = feature.points.reduce((sum, idx) => sum + landmarks[idx].x, 0) / feature.points.length * width;
            const centerY = feature.points.reduce((sum, idx) => sum + landmarks[idx].y, 0) / feature.points.length * height;
            
            // Draw main shape
            this.ctx.strokeStyle = feature.color;
            this.ctx.lineWidth = 2;
            this.drawComplexGeometricShape(centerX, centerY, feature.size, feature.shape, feature.pattern, feature.rotation);
            
            // Add inner patterns if specified
            if (feature.pattern === 'concentric') {
                for (let i = 0.8; i > 0.2; i -= 0.2) {
                    this.drawComplexGeometricShape(centerX, centerY, feature.size * i, feature.shape);
                }
            } else if (feature.pattern === 'grid') {
                this.drawGeometricGrid(centerX, centerY, feature.size, feature.color);
            } else if (feature.pattern === 'radial') {
                this.drawRadialPattern(centerX, centerY, feature.size, feature.color);
            }
        }
        
        // Connect features with sacred geometry lines
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 0.5;
        this.ctx.setLineDash([2, 2]);
        
        // Create geometric connections between features
        const connections = [
            ['leftEye', 'rightEye'],
            ['leftEye', 'nose'],
            ['rightEye', 'nose'],
            ['nose', 'mouth'],
            ['leftEye', 'leftCheek'],
            ['rightEye', 'rightCheek'],
            ['forehead', 'leftEye'],
            ['forehead', 'rightEye']
        ];
        
        for (const [start, end] of connections) {
            const startFeature = features[start];
            const endFeature = features[end];
            const angle = Math.atan2(endFeature.points[0], startFeature.points[0]);
            const startX = startFeature.points.reduce((sum, idx) => sum + landmarks[idx].x, 0) / startFeature.points.length * width;
            const startY = startFeature.points.reduce((sum, idx) => sum + landmarks[idx].y, 0) / startFeature.points.length * height;
            const endX = endFeature.points.reduce((sum, idx) => sum + landmarks[idx].x, 0) / endFeature.points.length * width;
            const endY = endFeature.points.reduce((sum, idx) => sum + landmarks[idx].y, 0) / endFeature.points.length * height;
            
            this.ctx.beginPath();
            this.ctx.moveTo(startX, startY);
            this.ctx.lineTo(endX, endY);
            this.ctx.stroke();
        }
        
        this.ctx.setLineDash([]);
        this.ctx.globalAlpha = 1;
    }

    drawComplexGeometricShape(x, y, size, shape, pattern, rotation = 0) {
        this.ctx.save();
        this.ctx.translate(x, y);
        if (rotation) this.ctx.rotate(rotation);
        
        this.ctx.beginPath();
        switch (shape) {
            case 'triangle':
                for (let i = 0; i < 3; i++) {
                    const angle = (i * 2 * Math.PI / 3) - Math.PI / 2;
                    const px = size * Math.cos(angle);
                    const py = size * Math.sin(angle);
                    i === 0 ? this.ctx.moveTo(px, py) : this.ctx.lineTo(px, py);
                }
                break;
            case 'diamond':
                this.ctx.moveTo(0, -size);
                this.ctx.lineTo(size, 0);
                this.ctx.lineTo(0, size);
                this.ctx.lineTo(-size, 0);
                break;
            case 'pentagon':
                for (let i = 0; i < 5; i++) {
                    const angle = (i * 2 * Math.PI / 5) - Math.PI / 2;
                    const px = size * Math.cos(angle);
                    const py = size * Math.sin(angle);
                    i === 0 ? this.ctx.moveTo(px, py) : this.ctx.lineTo(px, py);
                }
                break;
            case 'hexagon':
                for (let i = 0; i < 6; i++) {
                    const angle = (i * Math.PI / 3);
                    const px = size * Math.cos(angle);
                    const py = size * Math.sin(angle);
                    i === 0 ? this.ctx.moveTo(px, py) : this.ctx.lineTo(px, py);
                }
                break;
            case 'octagon':
                for (let i = 0; i < 8; i++) {
                    const angle = (i * Math.PI / 4);
                    const px = size * Math.cos(angle);
                    const py = size * Math.sin(angle);
                    i === 0 ? this.ctx.moveTo(px, py) : this.ctx.lineTo(px, py);
                }
                break;
        }
        this.ctx.closePath();
        this.ctx.stroke();
        this.ctx.restore();
    }

    drawGeometricGrid(x, y, size, color) {
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 0.5;
        
        // Draw mini grid pattern
        for (let i = -size; i <= size; i += size/4) {
            this.ctx.beginPath();
            this.ctx.moveTo(i, -size);
            this.ctx.lineTo(i, size);
            this.ctx.moveTo(-size, i);
            this.ctx.lineTo(size, i);
            this.ctx.stroke();
        }
        
        this.ctx.restore();
    }

    drawRadialPattern(x, y, size, color) {
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 0.5;
        
        // Draw radial lines
        for (let i = 0; i < 12; i++) {
            const angle = (i * Math.PI / 6);
            this.ctx.beginPath();
            this.ctx.moveTo(0, 0);
            this.ctx.lineTo(size * Math.cos(angle), size * Math.sin(angle));
            this.ctx.stroke();
        }
        
        // Draw concentric circles
        for (let i = 1; i <= 3; i++) {
            this.ctx.beginPath();
            this.ctx.arc(0, 0, size * i/3, 0, Math.PI * 2);
            this.ctx.stroke();
        }
        
        this.ctx.restore();
    }

    drawPulse(landmarks, width, height, color) {
        const time = Date.now() * 0.004;
        const pulse = Math.sin(time) * 0.5 + 0.5;
        
        // Pulsing rings from center of face
        const faceCenter = landmarks[9]; // nose tip
        const centerX = faceCenter.x * width;
        const centerY = faceCenter.y * height;
        
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 2;
        this.ctx.globalAlpha = 0.7;
        
        for (let ring = 0; ring < 5; ring++) {
            const radius = (20 + ring * 15) * (1 + pulse * 0.3);
            const alpha = 1 - ring * 0.2;
            
            this.ctx.globalAlpha = alpha * 0.7;
            this.ctx.beginPath();
            this.ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
            this.ctx.stroke();
        }
        
        // Pulsing dots at landmarks
        this.ctx.fillStyle = color;
        for (let i = 0; i < landmarks.length; i += 4) {
            const landmark = landmarks[i];
            const dotPulse = Math.sin(time * 2 + i * 0.1) * 0.5 + 0.5;
            const size = 2 + dotPulse * 3;
            
            this.ctx.globalAlpha = 0.8;
            this.ctx.beginPath();
            this.ctx.arc(landmark.x * width, landmark.y * height, size, 0, 2 * Math.PI);
            this.ctx.fill();
        }
        this.ctx.globalAlpha = 1;
    }
    
    drawMatrix(landmarks, width, height, color) {
        const time = Date.now() * 0.001;
        
        // Optimize matrix effect - reduce character density
        this.ctx.fillStyle = color;
        this.ctx.font = '12px monospace';
        this.ctx.globalAlpha = 0.9;
        
        const matrixChars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
        
        // Reduce landmark processing for performance
        const step = Math.max(1, Math.floor(landmarks.length / 15)); // Max 15 streams
        
        for (let i = 0; i < landmarks.length; i += step) {
            const landmark = landmarks[i];
            const x = landmark.x * width;
            const baseY = landmark.y * height;
            
            // Reduce character stream length
            for (let j = 0; j < 3; j++) { // Reduced from 5 to 3
                const y = baseY + (j * 15) + ((time + i*0.2) * 40) % 150;
                const charIndex = Math.floor((time + i + j) * 10) % matrixChars.length;
                const char = matrixChars[charIndex];
                
                const alpha = Math.max(0, 1 - j * 0.4 - ((time + i) * 40 % 150) / 150);
                this.ctx.globalAlpha = alpha * 0.8; // Reduced opacity for performance
                
                if (y > 0 && y < height) {
                    this.ctx.fillText(char, x - 6, y);
                }
            }
        }
        
        // Simplified face mesh for matrix
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 1;
        this.ctx.globalAlpha = 0.4; // Reduced opacity
        
        // Use cached connections for better performance
        this.ctx.beginPath();
        for (let i = 0; i < this.cachedConnections.length; i += 2) { // Skip every other connection
            const connection = this.cachedConnections[i];
            const start = landmarks[connection[0]];
            const end = landmarks[connection[1]];
            
            const glitch = Math.sin(time * 5 + connection[0]) * 0.001; // Reduced glitch intensity
            this.ctx.moveTo(start.x * width + glitch, start.y * height);
            this.ctx.lineTo(end.x * width + glitch, end.y * height);
        }
        this.ctx.stroke();
        
        this.ctx.globalAlpha = 1;
    }
    
    drawHandNeon(landmarks, width, height, color) {
        const time = Date.now() * 0.003;
        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = color;
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 3;
        this.ctx.globalAlpha = 0.9;
        
        this.drawHandWireframe(landmarks, width, height, color);
        
        // Add glowing fingertips
        this.ctx.fillStyle = '#ffffff';
        this.ctx.shadowBlur = 15;
        const fingertips = [4, 8, 12, 16, 20];
        for (const tip of fingertips) {
            const point = landmarks[tip];
            this.ctx.beginPath();
            this.ctx.arc(point.x * width, point.y * height, 3 + Math.sin(time) * 1, 0, 2 * Math.PI);
            this.ctx.fill();
        }
        
        this.ctx.shadowBlur = 0;
        this.ctx.globalAlpha = 1;
    }
    
    drawHandMatrix(landmarks, width, height, color) {
        const time = Date.now() * 0.001;
        
        // Matrix-style digital rain effect for hands
        this.ctx.fillStyle = color;
        this.ctx.font = '10px monospace';
        this.ctx.globalAlpha = 0.9;
        
        const matrixChars = '0123456789ABCDEF';
        
        for (let i = 0; i < this.cachedConnections.length; i++) {
            const connection = this.cachedConnections[i];
            const start = landmarks[connection[0]];
            const end = landmarks[connection[1]];
            const x = start.x * width;
            const baseY = start.y * height;
            
            // Create vertical streams of characters from joints
            for (let j = 0; j < 3; j++) {
                const y = baseY + (j * 12) + ((time + i*0.2) * 40) % 150;
                const charIndex = Math.floor((time + i + j) * 10) % matrixChars.length;
                const char = matrixChars[charIndex];
                
                const alpha = Math.max(0, 1 - j * 0.4);
                this.ctx.globalAlpha = alpha * 0.8;
                
                if (y > 0 && y < height) {
                    this.ctx.fillText(char, x - 5, y);
                }
            }
        }
        
        // Draw hand structure with matrix-style lines
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 1;
        this.ctx.globalAlpha = 0.6;
        
        this.drawHandWireframe(landmarks, width, height, color); // Re-use wireframe connections for structure
        this.ctx.globalAlpha = 1;
    }

    drawHandFire(landmarks, width, height, color) {
        const time = Date.now() * 0.005;
        
        this.ctx.save();
        this.ctx.globalCompositeOperation = 'lighter';
        
        for (let i = 0; i < landmarks.length; i++) {
            const landmark = landmarks[i];
            
            for (let j = 0; j < 3; j++) {
                const life = 0.6 + Math.random() * 0.4;
                const age = (time + landmark.y * 3 + j * 0.1) % 1;
                
                if (age < life) {
                    const particleX = landmark.x * width + (Math.random() - 0.5) * 5;
                    const particleY = landmark.y * height - (age / life) * 30 + j * 5;
                    const size = (1 - (age / life)) * 4 + 1;
                    const alpha = (1 - (age / life)) * 0.8;
                    
                    const r = parseInt(color.slice(1, 3), 16);
                    const g = parseInt(color.slice(3, 5), 16);
                    const b = parseInt(color.slice(5, 7), 16);
                    
                    this.ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
                    this.ctx.beginPath();
                    this.ctx.arc(particleX, particleY, size, 0, Math.PI * 2);
                    this.ctx.fill();
                }
            }
        }
        this.ctx.restore();
    }
    
    drawHandGlitch(landmarks, width, height, color) {
        const time = Date.now();

        // Chromatic Aberration Effect
        this.ctx.globalCompositeOperation = 'lighter';

        // RGB Channel Splits with dynamic offsets
        const channels = [
            { color: 'rgba(255, 0, 0, 0.7)', offsetRange: 8 },
            { color: 'rgba(0, 255, 0, 0.7)', offsetRange: 6 },
            { color: 'rgba(0, 0, 255, 0.7)', offsetRange: 4 }
        ];

        // Hand connections for glitch effect
        const connections = [
            [0, 1], [1, 2], [2, 3], [3, 4], // Thumb
            [0, 5], [5, 6], [6, 7], [7, 8], // Index
            [0, 9], [9, 10], [10, 11], [11, 12], // Middle
            [0, 13], [13, 14], [14, 15], [15, 16], // Ring
            [0, 17], [17, 18], [18, 19], [19, 20], // Pinky
            [5, 9], [9, 13], [13, 17] // Palm
        ];

        // Draw each color channel with unique distortion
        for (const channel of channels) {
            this.ctx.strokeStyle = channel.color;
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();

            for (const connection of connections) {
                const start = landmarks[connection[0]];
                const end = landmarks[connection[1]];

                if (start && end) {
                    // Create more dynamic glitch effect
                    const glitchX = (Math.random() - 0.5) * channel.offsetRange;
                    const glitchY = (Math.random() - 0.5) * channel.offsetRange;
                    const waveOffset = Math.sin(time * 0.005 + connection[0] * 0.1) * 3;

                    this.ctx.moveTo(
                        start.x * width + glitchX + waveOffset,
                        start.y * height + glitchY
                    );
                    this.ctx.lineTo(
                        end.x * width + glitchX + waveOffset,
                        end.y * height + glitchY
                    );
                }
            }
            this.ctx.stroke();
        }

        // Add digital noise artifacts
        this.ctx.fillStyle = color;
        this.ctx.globalAlpha = 0.4;
        for (let i = 0; i < landmarks.length; i++) {
            if (Math.random() > 0.85) {
                const landmark = landmarks[i];
                const size = Math.random() * 15 + 2;
                const offset = (Math.random() - 0.5) * 10;

                this.ctx.fillRect(
                    landmark.x * width + offset,
                    landmark.y * height + offset,
                    size, size
                );
            }
        }

        // Add emphasis on fingertips
        const fingertips = [4, 8, 12, 16, 20];
        this.ctx.globalAlpha = 0.8;
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        this.ctx.lineWidth = 2;

        for (const tipIndex of fingertips) {
            if (landmarks[tipIndex]) {
                const tip = landmarks[tipIndex];
                const timeOffset = time * 0.003;
                const glitchOffset = Math.sin(timeOffset + tipIndex * 0.5) * 4;

                this.ctx.beginPath();
                this.ctx.arc(
                    tip.x * width + glitchOffset,
                    tip.y * height,
                    4,
                    0,
                    Math.PI * 2
                );
                this.ctx.stroke();
            }
        }

        // Reset composite operation
        this.ctx.globalCompositeOperation = 'source-over';
        this.ctx.globalAlpha = 1;
    }
    
    drawHandConstellation(landmarks, width, height, color) {
        // Draw stars at landmarks
        this.ctx.fillStyle = color;
        this.ctx.globalAlpha = 0.9;
        
        for (const landmark of landmarks) {
            this.ctx.beginPath();
            this.ctx.arc(landmark.x * width, landmark.y * height, 1.5, 0, 2 * Math.PI);
            this.ctx.fill();
        }
        
        // Connect hand structure with constellation lines
        this.ctx.strokeStyle = color.replace('rgb', 'rgba').replace(')', ', 0.3)');
        this.ctx.lineWidth = 0.5;
        this.drawHandWireframe(landmarks, width, height, color);
        this.ctx.globalAlpha = 1;
    }
    
    drawHandDigital(landmarks, width, height, color) {
        const time = Date.now() * 0.002;
        
        // Digital wireframe with glitch
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 1;
        this.ctx.globalAlpha = 0.8;
        
        const connections = [
            [0, 1], [1, 2], [2, 3], [3, 4],
            [0, 5], [5, 6], [6, 7], [7, 8],
            [0, 9], [9, 10], [10, 11], [11, 12],
            [0, 13], [13, 14], [14, 15], [15, 16],
            [0, 17], [17, 18], [18, 19], [19, 20]
        ];
        
        this.ctx.beginPath();
        for (const connection of connections) {
            const start = landmarks[connection[0]];
            const end = landmarks[connection[1]];
            
            const glitch = Math.sin(time * 8 + connection[0]) * 0.001;
            this.ctx.moveTo(start.x * width + glitch, start.y * height);
            this.ctx.lineTo(end.x * width + glitch, end.y * height);
        }
        this.ctx.stroke();
        
        // Digital squares at joints
        this.ctx.fillStyle = color;
        const joints = [0, 5, 9, 13, 17];
        for (const joint of joints) {
            const landmark = landmarks[joint];
            const size = 4;
            this.ctx.fillRect(
                landmark.x * width - size/2,
                landmark.y * height - size/2,
                size, size
            );
        }
        this.ctx.globalAlpha = 1;
    }
    
    drawHandRetro(landmarks, width, height, color) {
        const time = Date.now() * 0.001;
        
        // Retro vector graphics style
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 2;
        this.ctx.globalAlpha = 0.8;
        
        // Draw hand with retro glow effect
        this.ctx.shadowBlur = 5;
        this.ctx.shadowColor = color;
        this.drawHandWireframe(landmarks, width, height, color);
        
        // Add retro grid pattern overlay
        this.ctx.strokeStyle = color.replace('rgb', 'rgba').replace(')', ', 0.3)');
        this.ctx.lineWidth = 1;
        this.ctx.shadowBlur = 0;
        
        const handBounds = this.getHandBounds(landmarks, width, height);
        for (let x = handBounds.minX; x < handBounds.maxX; x += 10) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, handBounds.minY);
            this.ctx.lineTo(x, handBounds.maxY);
            this.ctx.stroke();
        }
        
        this.ctx.globalAlpha = 1;
    }
    
    drawHandHologram(landmarks, width, height, color) {
        this.ctx.save();
        const time = Date.now() * 0.003;
        
        // Multiple offset layers for holographic effect
        for (let offset = 0; offset < 3; offset++) {
            const offsetX = Math.sin(time + offset * 2) * 1.5;
            const offsetY = Math.cos(time + offset * 2) * 1.5;
            const alpha = 0.3 + offset * 0.2;
            
            this.ctx.globalAlpha = alpha;
            this.ctx.strokeStyle = color;
            this.ctx.lineWidth = 1;
            
            const connections = [
                [0, 1], [1, 2], [2, 3], [3, 4],
                [0, 5], [5, 6], [6, 7], [7, 8],
                [0, 9], [9, 10], [10, 11], [11, 12],
                [0, 13], [13, 14], [14, 15], [15, 16],
                [0, 17], [17, 18], [18, 19], [19, 20]
            ];
            
            this.ctx.beginPath();
            for (const connection of connections) {
                const start = landmarks[connection[0]];
                const end = landmarks[connection[1]];
                this.ctx.moveTo(start.x * width + offsetX, start.y * height + offsetY);
                this.ctx.lineTo(end.x * width + offsetX, end.y * height + offsetY);
            }
            this.ctx.stroke();
        }
        this.ctx.restore();
        this.ctx.globalAlpha = 1;
    }
    
    drawHandGeometric(landmarks, width, height, color) {
        // Draw geometric shapes at finger joints
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 2;
        this.ctx.globalAlpha = 0.8;
        
        const joints = [
            { points: [1, 2, 3, 4], shape: 'triangle' }, // thumb
            { points: [5, 6, 7, 8], shape: 'diamond' }, // index
            { points: [9, 10, 11, 12], shape: 'hexagon' }, // middle
            { points: [13, 14, 15, 16], shape: 'pentagon' }, // ring
            { points: [17, 18, 19, 20], shape: 'triangle' } // pinky
        ];
        
        for (const finger of joints) {
            for (const jointIdx of finger.points) {
                const joint = landmarks[jointIdx];
                this.drawGeometricShape(joint.x * width, joint.y * height, 6, finger.shape);
            }
        }
        
        // Connect with lines
        this.ctx.strokeStyle = color.replace('rgb', 'rgba').replace(')', ', 0.5)');
        this.ctx.lineWidth = 1;
        this.drawHandWireframe(landmarks, width, height, color);
        this.ctx.globalAlpha = 1;
    }

    drawGeometricShape(x, y, size, shape) {
        this.ctx.save();
        this.ctx.translate(x, y);
        
        this.ctx.beginPath();
        switch (shape) {
            case 'triangle':
                for (let i = 0; i < 3; i++) {
                    const angle = (i * 2 * Math.PI / 3) - Math.PI / 2;
                    const px = size * Math.cos(angle);
                    const py = size * Math.sin(angle);
                    i === 0 ? this.ctx.moveTo(px, py) : this.ctx.lineTo(px, py);
                }
                break;
            case 'diamond':
                this.ctx.moveTo(0, -size);
                this.ctx.lineTo(size, 0);
                this.ctx.lineTo(0, size);
                this.ctx.lineTo(-size, 0);
                break;
            case 'pentagon':
                for (let i = 0; i < 5; i++) {
                    const angle = (i * 2 * Math.PI / 5) - Math.PI / 2;
                    const px = size * Math.cos(angle);
                    const py = size * Math.sin(angle);
                    i === 0 ? this.ctx.moveTo(px, py) : this.ctx.lineTo(px, py);
                }
                break;
            case 'hexagon':
                for (let i = 0; i < 6; i++) {
                    const angle = (i * Math.PI / 3);
                    const px = size * Math.cos(angle);
                    const py = size * Math.sin(angle);
                    i === 0 ? this.ctx.moveTo(px, py) : this.ctx.lineTo(px, py);
                }
                break;
        }
        this.ctx.closePath();
        this.ctx.stroke();
        this.ctx.restore();
    }

    drawHandPulse(landmarks, width, height, color) {
        const time = Date.now() * 0.004;
        const pulse = Math.sin(time) * 0.5 + 0.5;
        
        // Pulsing from palm center
        const palmCenter = landmarks[0];
        const centerX = palmCenter.x * width;
        const centerY = palmCenter.y * height;
        
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 2;
        this.ctx.globalAlpha = 0.6;
        
        for (let ring = 0; ring < 3; ring++) {
            const radius = (10 + ring * 8) * (1 + pulse * 0.5);
            this.ctx.globalAlpha = 0.6 - ring * 0.2;
            this.ctx.beginPath();
            this.ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
            this.ctx.stroke();
        }
        
        // Pulsing dots at fingertips
        this.ctx.fillStyle = color;
        const fingertips = [4, 8, 12, 16, 20];
        for (let i = 0; i < fingertips.length; i++) {
            const tip = landmarks[fingertips[i]];
            const dotPulse = Math.sin(time * 2 + i * 0.5) * 0.5 + 0.5;
            const size = 2 + dotPulse * 2;
            
            this.ctx.globalAlpha = 0.8;
            this.ctx.beginPath();
            this.ctx.arc(tip.x * width, tip.y * height, size, 0, 2 * Math.PI);
            this.ctx.fill();
        }
        this.ctx.globalAlpha = 1;
    }
    
    getHandBounds(landmarks, width, height) {
        let minX = width, minY = height, maxX = 0, maxY = 0;
        
        for (const landmark of landmarks) {
            const x = landmark.x * width;
            const y = landmark.y * height;
            minX = Math.min(minX, x);
            minY = Math.min(minY, y);
            maxX = Math.max(maxX, x);
            maxY = Math.max(maxY, y);
        }
        
        return { minX, minY, maxX, maxY };
    }
    
    drawBlueprint(landmarks, width, height) {
        this.ctx.save();
        
        this.drawBlueprintGrid(width, height);

        this.ctx.strokeStyle = '#ffffff'; 
        this.ctx.fillStyle = '#ffffff';
        this.ctx.lineWidth = 1;
        this.ctx.globalAlpha = 0.8;
        
        this.ctx.setLineDash([5, 5]);
        const connections = this.getFaceConnections();
        this.ctx.beginPath();
        for (const connection of connections) {
            const start = landmarks[connection[0]];
            const end = landmarks[connection[1]];
            if (start && end) {
                this.ctx.moveTo(start.x * width, start.y * height);
                this.ctx.lineTo(end.x * width, end.y * height);
            }
        }
        this.ctx.stroke();
        
        this.ctx.setLineDash([]);

        // Draw key facial measurements
        const keyPoints = [10, 152, 61, 291, 33, 263, 168, 8, 468, 473]; 
        for (const pointIndex of keyPoints) {
            if (!landmarks[pointIndex]) continue;
            const point = landmarks[pointIndex];
            this.ctx.beginPath();
            this.ctx.arc(point.x * width, point.y * height, 4, 0, 2 * Math.PI);
            this.ctx.stroke();
            this.ctx.fillText(`P${pointIndex}`, point.x * width + 8, point.y * height - 8);
        }
        
        this.ctx.strokeStyle = '#e74c3c';
        this.ctx.fillStyle = '#e74c3c';

        // Measurements
        const pLeftEye = landmarks[133]; 
        const pRightEye = landmarks[362];
        if (pLeftEye && pRightEye) {
            this.drawMeasurementLine(pLeftEye, pRightEye, width, height, "horizontal", -20, `eye_dist`);
        }

        const pTop = landmarks[10]; 
        const pBottom = landmarks[152]; 
        if(pTop && pBottom) {
             this.drawMeasurementLine(pTop, pBottom, width, height, "vertical", -40, `face_h`);
        }

        const pNoseTop = landmarks[168]; 
        const pNoseBottom = landmarks[4]; 
        if(pNoseTop && pNoseBottom) {
            this.drawMeasurementLine(pNoseTop, pNoseBottom, width, height, "vertical", 30, `nose_l`);
        }

        // Add glitch-style eyes and mouth
        const time = Date.now();
        const keyFeatures = {
            leftEye: [33, 7, 163, 144, 145, 153, 154, 155, 133, 33],
            rightEye: [362, 382, 381, 380, 374, 373, 390, 249, 263, 362],
            mouth: [61, 291, 306, 292, 308, 324, 318, 402, 317, 14, 87, 178, 88, 95]
        };

        this.ctx.globalAlpha = 0.8;
        this.ctx.strokeStyle = '#4488ff';
        this.ctx.lineWidth = 2;

        // Draw glitched facial features with technical aesthetic
        for (const feature in keyFeatures) {
            this.ctx.beginPath();
            const points = keyFeatures[feature];
            const timeOffset = time * 0.003;

            for (let i = 0; i <  points.length; i++) {
                const point = landmarks[points[i]];
                const glitchOffset = Math.sin(timeOffset + i * 0.5) * 4;

                if (i === 0) {
                    this.ctx.moveTo(point.x * width + glitchOffset, point.y * height);
                } else {
                    this.ctx.lineTo(point.x * width + glitchOffset, point.y * height);
                }
            }
            this.ctx.closePath();
            this.ctx.stroke();

            // Add technical markers at key points
            this.ctx.fillStyle = '#4488ff';
            points.forEach((pointIndex, i) => {
                const point = landmarks[pointIndex];
                if (i % 3 === 0) { // Add markers every few points
                    this.ctx.beginPath();
                    this.ctx.arc(point.x * width, point.y * height, 2, 0, Math.PI * 2);
                    this.ctx.fill();
                }
            });
        }

        this.ctx.restore();
    }

    drawBlueprintGrid(width, height) {
        this.ctx.save();
        this.ctx.strokeStyle = 'rgba(0, 128, 255, 0.2)'; 
        this.ctx.lineWidth = 0.5;
        const gridSize = 20;

        for (let x = 0; x < width; x += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, height);
            this.ctx.stroke();
        }
        for (let y = 0; y < height; y += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(width, y);
            this.ctx.stroke();
        }
        this.ctx.restore();
    }

    drawMeasurementLine(p1, p2, width, height, orientation, offset, label) {
        const x1 = p1.x * width;
        const y1 = p1.y * height;
        const x2 = p2.x * width;
        const y2 = p2.y * height;
        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2;
        const dist = Math.hypot(x1 - x2, y1 - y2);

        this.ctx.save();
        this.ctx.setLineDash([2, 3]);
        this.ctx.beginPath();
        if (orientation === 'horizontal') {
            const y = midY + offset;
            this.ctx.moveTo(x1, y1);
            this.ctx.lineTo(x1, y);
            this.ctx.moveTo(x2, y2);
            this.ctx.lineTo(x2, y);
            this.ctx.stroke();

            this.ctx.setLineDash([]);
            this.ctx.beginPath();
            this.ctx.moveTo(x1, y);
            this.ctx.lineTo(x2, y);
            this.ctx.moveTo(x1, y - 3);
            this.ctx.lineTo(x1, y + 3);
            this.ctx.moveTo(x2, y - 3);
            this.ctx.lineTo(x2, y + 3);
            this.ctx.stroke();

            this.ctx.fillText(`${label}: ${dist.toFixed(1)}`, midX - 30, offset > 0 ? y + 15 : y - 5);
        } else { 
            const x = midX + offset;
            this.ctx.moveTo(x1, y1);
            this.ctx.lineTo(x, y1);
            this.ctx.moveTo(x2, y2);
            this.ctx.lineTo(x, y2);
            this.ctx.stroke();

            this.ctx.setLineDash([]);
            this.ctx.beginPath();
            this.ctx.moveTo(x, y1);
            this.ctx.lineTo(x, y2);
             this.ctx.moveTo(x - 3, y1);
            this.ctx.lineTo(x + 3, y1);
            this.ctx.moveTo(x - 3, y2);
            this.ctx.lineTo(x + 3, y2);
            this.ctx.stroke();

            this.ctx.save();
            this.ctx.translate(x + (offset > 0 ? 15 : -15), midY);
            this.ctx.rotate(-Math.PI/2);
            this.ctx.textAlign = "center";
            this.ctx.fillText(`${label}: ${dist.toFixed(1)}`, 0, 0);
            this.ctx.restore();
        }
        this.ctx.restore();
    }
    
    drawHandBlueprint(landmarks, width, height, color) {
        this.ctx.strokeStyle = color;
        this.ctx.fillStyle = color;
        this.ctx.lineWidth = 1.5;
        this.ctx.globalAlpha = 0.9;
        this.ctx.font = '10px monospace';

        this.drawHandWireframe(landmarks, width, height, color);

        for (const landmark of landmarks) {
            this.ctx.beginPath();
            this.ctx.arc(landmark.x * width, landmark.y * height, 4, 0, 2 * Math.PI);
            this.ctx.stroke();
        }

        const fingerTips = { 'THUMB': 4, 'INDEX': 8, 'MIDDLE': 12, 'RING': 16, 'PINKY': 20 };
        for (const [name, index] of Object.entries(fingerTips)) {
            const tip = landmarks[index];
            if (tip) {
                this.ctx.save();
                this.ctx.translate(tip.x * width, tip.y * height);
                this.ctx.rotate(Math.PI / 6);
                this.ctx.fillText(name, 10, 5);
                this.ctx.restore();
            }
        }

        const p1 = landmarks[5]; 
        const p2 = landmarks[6]; 
        const p3 = landmarks[7]; 
        if (p1 && p2 && p3) {
            const angleRad = Math.atan2(p3.y - p2.y, p3.x - p2.x) - Math.atan2(p1.y - p2.y, p1.x - p2.x);
            const angleDeg = Math.abs(angleRad * 180 / Math.PI);
            
            this.ctx.fillStyle = color;
            this.ctx.fillText(`${angleDeg.toFixed(0)}°`, p2.x * width + 10, p2.y * height - 10);
            this.ctx.beginPath();
            this.ctx.moveTo(p2.x * width, p2.y * height);
            this.ctx.lineTo(p2.x * width, p2.y * height);
            this.ctx.arc(p2.x * width, p2.y * height, 10, 
                Math.atan2(p1.y - p2.y, p1.x - p2.x), 
                Math.atan2(p3.y - p2.y, p3.x - p2.x)
            );
            this.ctx.stroke();
        }
    }

    drawGlitch(landmarks, width, height, color) {
        this.ctx.save();
        const connections = this.getFaceConnections();
        const time = Date.now();

        // Chromatic Aberration Effect with increased intensity
        this.ctx.globalCompositeOperation = 'lighter';

        // RGB Channel Splits with dynamic offsets
        const channels = [
            { color: 'rgba(255, 0, 0, 0.7)', offsetRange: 8 },
            { color: 'rgba(0, 255, 0, 0.7)', offsetRange: 6 },
            { color: 'rgba(0, 0, 255, 0.7)', offsetRange: 4 }
        ];

        // Draw each color channel with unique distortion
        for (const channel of channels) {
            this.ctx.strokeStyle = channel.color;
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();

            for (const connection of connections) {
                const start = landmarks[connection[0]];
                const end = landmarks[connection[1]];

                if (start && end) {
                    // Create more dynamic glitch effect
                    const glitchX = (Math.random() - 0.5) * channel.offsetRange;
                    const glitchY = (Math.random() - 0.5) * channel.offsetRange;
                    const waveOffset = Math.sin(time * 0.005 + connection[0] * 0.1) * 3;

                    this.ctx.moveTo(
                        start.x * width + glitchX + waveOffset,
                        start.y * height + glitchY
                    );
                    this.ctx.lineTo(
                        end.x * width + glitchX + waveOffset,
                        end.y * height + glitchY
                    );
                }
            }
            this.ctx.stroke();
        }

        // Add digital noise artifacts
        this.ctx.fillStyle = color;
        this.ctx.globalAlpha = 0.4;
        for (let i = 0; i < landmarks.length; i++) {
            if (Math.random() > 0.85) {
                const landmark = landmarks[i];
                const size = Math.random() * 15 + 2;
                const offset = (Math.random() - 0.5) * 10;

                this.ctx.fillRect(
                    landmark.x * width + offset,
                    landmark.y * height + offset,
                    size, size
                );
            }
        }

        // Add emphasis on facial features (eyes, mouth)
        const keyPoints = {
            leftEye: [33, 7, 163, 144, 145, 153, 154, 155, 133, 33],
            rightEye: [362, 382, 381, 380, 374, 373, 390, 249, 263, 362],
            mouth: [61, 291, 306, 292, 308, 324, 318, 402, 317, 14, 87, 178, 88, 95]
        };

        this.ctx.globalAlpha = 0.8;
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        this.ctx.lineWidth = 2;

        // Draw glitched facial features with technical aesthetic
        for (const feature in keyPoints) {
            this.ctx.beginPath();
            const points = keyPoints[feature];
            const timeOffset = time * 0.003;

            for (let i = 0; i < points.length; i++) {
                const point = landmarks[points[i]];
                const glitchOffset = Math.sin(timeOffset + i * 0.5) * 4;

                if (i === 0) {
                    this.ctx.moveTo(point.x * width + glitchOffset, point.y * height);
                } else {
                    this.ctx.lineTo(point.x * width + glitchOffset, point.y * height);
                }
            }
            this.ctx.closePath();
            this.ctx.stroke();
        }

        this.ctx.restore();
    }

    drawInkSketch(landmarks, width, height, color) {
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 1.5;
        this.ctx.globalAlpha = 0.8;

        // Main face outline with sketchy effect
        const faceOutline = [10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109];
        this.drawSketchyPath(landmarks, faceOutline, width, height, 3, 4);

        // Eyes with multiple sketch layers for depth
        const leftEye = [33, 7, 163, 144, 145, 153, 154, 155, 133, 33];
        const rightEye = [362, 382, 381, 380, 374, 373, 390, 249, 263, 362];
        
        // Draw eyes multiple times for sketchy effect
        for (let i = 0; i < 3; i++) {
            this.ctx.globalAlpha = 0.3 + (i * 0.2);
            this.drawSketchyPath(landmarks, leftEye, width, height, 2, 3);
            this.drawSketchyPath(landmarks, rightEye, width, height, 2, 3);
        }

        // Eyebrows with rough, expressive strokes
        const leftBrow = [70, 63, 105, 66, 107, 55, 65, 52, 53, 46];
        const rightBrow = [336, 296, 334, 293, 300, 283, 282, 295, 285];
        this.ctx.lineWidth = 2;
        this.ctx.globalAlpha = 0.9;
        this.drawSketchyPath(landmarks, leftBrow, width, height, 4, 5);
        this.drawSketchyPath(landmarks, rightBrow, width, height, 4, 5);

        // Nose with delicate lines
        const nose = [168, 193, 122, 6, 351, 419, 456, 363, 360, 279, 279, 282, 283, 284];
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        if (nose.every(p => landmarks[p])) {
            this.ctx.moveTo(landmarks[168].x * width, landmarks[168].y * height);
            this.ctx.quadraticCurveTo(
                landmarks[13].x * width, landmarks[13].y * height + 5,
                landmarks[291].x * width, landmarks[291].y * height
            );
            this.ctx.stroke();
        }
        
        // Mouth with multiple layers for depth
        const outerLips = [61, 146, 91, 181, 84, 17, 314, 405, 321, 308, 324, 318, 402, 317, 14, 87, 178, 88, 95];
        const innerLips = [78, 95, 88, 178, 87, 14, 317, 402, 318, 324, 308, 415, 310, 311, 312, 13, 82, 81, 80, 79];
        
        // Draw lips with varying pressure effect
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        for (let i = 0; i < outerLips.length; i++) {
            const point = landmarks[outerLips[i]];
            const wave = Math.sin(time * 4 + i) * 2;
            
            if (i === 0) {
                this.ctx.moveTo(point.x * width, point.y * height + wave);
            } else {
                this.ctx.lineTo(point.x * width, point.y * height + wave);
            }
        }
        this.ctx.stroke();
        
        this.ctx.globalAlpha = 1;
    }

    drawSketchyPath(landmarks, points, width, height, amplitude, segments) {
        this.ctx.beginPath();
        for (let i = 0; i < points.length - 1; i++) {
            const start = landmarks[points[i]];
            const end = landmarks[points[i + 1]];
            this.drawWobblyLine(
                start.x * width, start.y * height,
                end.x * width, end.y * height,
                amplitude, segments
            );
        }

        this.ctx.globalAlpha *= 0.3;
        for (let i = 0; i < points.length - 1; i += 2) {
            if (Math.random() > 0.5) continue;
            const start = landmarks[points[i]];
            const end = landmarks[points[i + 1]];
            this.drawWobblyLine(
                start.x * width + (Math.random() - 0.5) * 2,
                start.y * height + (Math.random() - 0.5) * 2,
                end.x * width + (Math.random() - 0.5) * 2,
                end.y * height + (Math.random() - 0.5) * 2,
                amplitude * 1.5, segments
            );
        }
    }

    drawWobblyLine(x1, y1, x2, y2, amplitude, segments) {
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        const dx = x2 - x1;
        const dy = y2 - y1;

        for (let i = 1; i <= segments; i++) {
            const t = i / segments;
            const wobble = (Math.random() - 0.5) * amplitude * 2;
            const px = x1 + dx * t;
            const py = y1 + dy * t;

            this.ctx.lineTo(px + wobble, py + Math.random() * 2);
        }
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
    }

    drawFireOptimized(landmarks, width, height, color) {
        const currentTime = performance.now();

        // Limit fire effect updates for performance
        if (currentTime - this.lastTime < 100) return; // Update every 100ms

        const time = currentTime * 0.002;
        this.ctx.save();
        this.ctx.globalCompositeOperation = 'lighter';

        // Reduce particle count for performance
        const step = Math.max(1, Math.floor(landmarks.length / 20)); // Max 20 particle sources

        for (let i = 0; i < landmarks.length; i += step) {
            const landmark = landmarks[i];

            // Single particle per landmark for performance
            const life = 0.5 + Math.random() * 0.5;
            const age = (time + landmark.x * 3) % 1;

            if (age < life) {
                const particleX = landmark.x * width + (Math.random() - 0.5) * 3;
                const particleY = landmark.y * height - (age / life) * 25;
                const size = (1 - (age / life)) * 4 + 1;
                const alpha = (1 - (age / life)) * 0.6;

                const r = parseInt(color.slice(1, 3), 16);
                const g = parseInt(color.slice(3, 5), 16);
                const b = parseInt(color.slice(5, 7), 16);

                this.ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
                this.ctx.beginPath();
                this.ctx.arc(particleX, particleY, size, 0, Math.PI * 2);
                this.ctx.fill();
            }
        }
        this.ctx.restore();
    }

    drawHandFireOptimized(landmarks, width, height, color) {
        const currentTime = performance.now();

        // Limit updates for performance
        if (currentTime - this.lastTime < 80) return;

        const time = currentTime * 0.002;
        this.ctx.save();
        this.ctx.globalCompositeOperation = 'lighter';

        // Reduce particle density for hands
        for (let i = 0; i < landmarks.length; i += 2) {
            const landmark = landmarks[i];
            const life = 0.6 + Math.random() * 0.4;
            const age = (time + landmark.y * 3) % 1;

            if (age < life) {
                const particleX = landmark.x * width + (Math.random() - 0.5) * 4;
                const particleY = landmark.y * height - (age / life) * 20;
                const size = (1 - (age / life)) * 3 + 1;
                const alpha = (1 - (age / life)) * 0.7;

                const r = parseInt(color.slice(1, 3), 16);
                const g = parseInt(color.slice(3, 5), 16);
                const b = parseInt(color.slice(5, 7), 16);

                this.ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
                this.ctx.beginPath();
                this.ctx.arc(particleX, particleY, size, 0, Math.PI * 2);
                this.ctx.fill();
            }
        }
        this.ctx.restore();
    }

    drawHandParticles(landmarks, width, height, color) {
        const currentTime = performance.now();
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;

        // Limit particle updates to every few frames for performance
        if (deltaTime < 50) return;

        const time = currentTime * 0.005;
        let activeParticles = 0;

        // Update existing particles
        for (const particle of this.particlePool) {
            if (particle.active) {
                particle.life -= deltaTime;
                if (particle.life <= 0) {
                    particle.active = false;
                    continue;
                }

                particle.x += particle.vx;
                particle.y += particle.vy;
                particle.alpha = particle.life / particle.maxLife;
                activeParticles++;
            }
        }

        // Add new particles from hand landmarks
        if (activeParticles < this.maxParticles / 2) {
            for (const landmark of landmarks) {
                if (Math.random() > 0.7) { // Reduced emission rate for hands
                    const particle = this.getInactiveParticle();

                    if (particle) {
                        particle.active = true;
                        particle.x = landmark.x * width;
                        particle.y = landmark.y * height;
                        particle.size = 2 + Math.random() * 2;
                        particle.vx = (Math.random() - 0.5) * 2;
                        particle.vy = (Math.random() - 0.5) * 2 - 1; // Slight upward bias
                        particle.life = particle.maxLife = 500 + Math.random() * 500; // Shorter life for hand particles
                        particle.alpha = 1;
                    }
                }
            }
        }

        // Render particles in batch
        this.ctx.fillStyle = color;
        for (const particle of this.particlePool) {
            if (particle.active) {
                this.ctx.globalAlpha = particle.alpha * 0.8;
                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, particle.size, 0, 2 * Math.PI);
                this.ctx.fill();
            }
        }
        this.ctx.globalAlpha = 1;
    }

    drawCyberpunk(landmarks, width, height, color) {
        const time = Date.now() * 0.002;
        
        // Neon grid face outline with digital artifacts
        this.ctx.strokeStyle = '#00ffff';
        this.ctx.lineWidth = 2;
        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = '#00ffff';
        this.ctx.globalAlpha = 0.8;
        
        // High-tech face outline with scanlines
        const faceOutline = [10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109];
        this.ctx.beginPath();
        for (let i = 0; i < faceOutline.length; i++) {
            const point = landmarks[faceOutline[i]];
            const glitch = Math.sin(time * 15 + i) * 2;
            if (i === 0) {
                this.ctx.moveTo(point.x * width + glitch, point.y * height);
            } else {
                this.ctx.lineTo(point.x * width + glitch, point.y * height);
            }
        }
        this.ctx.closePath();
        this.ctx.stroke();
        
        // Cyberpunk eyes with targeting reticles
        const leftEye = landmarks[468];
        const rightEye = landmarks[473];
        
        if (leftEye && rightEye) {
            this.ctx.strokeStyle = '#ff0040';
            this.ctx.lineWidth = 3;
            this.ctx.shadowColor = '#ff0040';
            
            // Left eye targeting system
            this.ctx.beginPath();
            this.ctx.arc(leftEye.x * width, leftEye.y * height, 15, 0, Math.PI * 2);
            this.ctx.moveTo(leftEye.x * width - 20, leftEye.y * height);
            this.ctx.lineTo(leftEye.x * width + 20, leftEye.y * height);
            this.ctx.stroke();
            
            // Right eye targeting system
            this.ctx.beginPath();
            this.ctx.arc(rightEye.x * width, rightEye.y * height, 15, 0, Math.PI * 2);
            this.ctx.moveTo(rightEye.x * width - 20, rightEye.y * height);
            this.ctx.lineTo(rightEye.x * width + 20, rightEye.y * height);
            this.ctx.stroke();
        }
        
        // Neural interface mouth
        const mouth = [61, 291, 306, 292, 308, 324, 318, 402, 317, 14, 87, 178, 88, 95];
        this.ctx.strokeStyle = '#ffff00';
        this.ctx.lineWidth = 2;
        this.ctx.shadowColor = '#ffff00';
        this.ctx.beginPath();
        for (let i = 0; i < mouth.length; i++) {
            const point = landmarks[mouth[i]];
            const pulse = Math.sin(time * 8 + i * 0.5) * 1;
            if (i === 0) {
                this.ctx.moveTo(point.x * width + pulse, point.y * height);
            } else {
                this.ctx.lineTo(point.x * width + pulse, point.y * height);
            }
        }
        this.ctx.closePath();
        this.ctx.stroke();
        
        // Data streams from temples
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 1;
        this.ctx.shadowBlur = 5;
        const temple1 = landmarks[127];
        const temple2 = landmarks[356];
        
        if (temple1) {
            for (let i = 0; i < 5; i++) {
                const streamY = temple1.y * height + i * 8 + Math.sin(time * 5 + i) * 3;
                this.ctx.beginPath();
                this.ctx.moveTo(temple1.x * width - 30, streamY);
                this.ctx.lineTo(temple1.x * width - 10, streamY);
                this.ctx.stroke();
            }
        }
        
        if (temple2) {
            for (let i = 0; i < 5; i++) {
                const streamY = temple2.y * height + i * 8 + Math.sin(time * 5 + i) * 3;
                this.ctx.beginPath();
                this.ctx.moveTo(temple2.x * width + 10, streamY);
                this.ctx.lineTo(temple2.x * width + 30, streamY);
                this.ctx.stroke();
            }
        }
        
        this.ctx.shadowBlur = 0;
        this.ctx.globalAlpha = 1;
    }

    drawTribal(landmarks, width, height, color) {
        this.ctx.strokeStyle = color;
        this.ctx.fillStyle = color;
        this.ctx.lineWidth = 3;
        this.ctx.globalAlpha = 0.9;
        
        // Tribal war paint on forehead
        const forehead = landmarks[10];
        if (forehead) {
            this.ctx.beginPath();
            this.ctx.moveTo(forehead.x * width - 30, forehead.y * height + 10);
            this.ctx.lineTo(forehead.x * width, forehead.y * height - 10);
            this.ctx.lineTo(forehead.x * width + 30, forehead.y * height + 10);
            this.ctx.moveTo(forehead.x * width - 20, forehead.y * height + 20);
            this.ctx.lineTo(forehead.x * width + 20, forehead.y * height + 20);
            this.ctx.stroke();
        }
        
        // Ritual eyes with tribal symbols
        const leftEye = landmarks[468];
        const rightEye = landmarks[473];
        
        if (leftEye && rightEye) {
            this.ctx.lineWidth = 2;
            
            // Left eye tribal circle
            this.ctx.beginPath();
            this.ctx.arc(leftEye.x * width, leftEye.y * height, 12, 0, Math.PI * 2);
            this.ctx.stroke();
            
            // Tribal marks around left eye
            for (let i = 0; i < 8; i++) {
                const angle = (i * Math.PI * 2) / 8;
                const x1 = leftEye.x * width + Math.cos(angle) * 15;
                const y1 = leftEye.y * height + Math.sin(angle) * 15;
                const x2 = leftEye.x * width + Math.cos(angle) * 20;
                const y2 = leftEye.y * height + Math.sin(angle) * 20;
                this.ctx.beginPath();
                this.ctx.moveTo(x1, y1);
                this.ctx.lineTo(x2, y2);
                this.ctx.stroke();
            }
            
            // Right eye tribal circle
            this.ctx.beginPath();
            this.ctx.arc(rightEye.x * width, rightEye.y * height, 12, 0, Math.PI * 2);
            this.ctx.stroke();
            
            // Tribal marks around right eye
            for (let i = 0; i < 8; i++) {
                const angle = (i * Math.PI * 2) / 8;
                const x1 = rightEye.x * width + Math.cos(angle) * 15;
                const y1 = rightEye.y * height + Math.sin(angle) * 15;
                const x2 = rightEye.x * width + Math.cos(angle) * 20;
                const y2 = rightEye.y * height + Math.sin(angle) * 20;
                this.ctx.beginPath();
                this.ctx.moveTo(x1, y1);
                this.ctx.lineTo(x2, y2);
                this.ctx.stroke();
            }
        }
        
        // Sacred mouth with teeth pattern
        const mouthCenter = landmarks[13];
        if (mouthCenter) {
            this.ctx.lineWidth = 4;
            this.ctx.beginPath();
            for (let i = -3; i <= 3; i++) {
                const x = mouthCenter.x * width + i * 8;
                const y = mouthCenter.y * height;
                this.ctx.moveTo(x, y - 8);
                this.ctx.lineTo(x, y + 8);
            }
            this.ctx.stroke();
        }
        
        this.ctx.globalAlpha = 1;
    }

    drawCrystal(landmarks, width, height, color) {
        const time = Date.now() * 0.001;
        this.ctx.strokeStyle = color;
        this.ctx.fillStyle = color.replace('rgb', 'rgba').replace(')', ', 0.3)');
        this.ctx.lineWidth = 2;
        this.ctx.globalAlpha = 0.8;
        
        // Crystal formation eyes
        const leftEye = landmarks[468];
        const rightEye = landmarks[473];
        
        if (leftEye && rightEye) {
            const shimmer = Math.sin(time * 3) * 0.3 + 0.7;
            this.ctx.globalAlpha = shimmer;
            
            // Left eye
            this.drawCrystalShape(leftEye.x * width, leftEye.y * height, 15, 6);
            
            // Right eye
            this.drawCrystalShape(rightEye.x * width, rightEye.y * height, 15, 6);
        }
        
        // Crystalline mouth
        const mouthPoints = [61, 291, 306, 292, 308, 324, 318, 402, 317, 14, 87, 178, 88, 95];
        if (mouthPoints.every(p => landmarks[p])) {
            this.ctx.beginPath();
            this.ctx.moveTo(landmarks[61].x * width, landmarks[61].y * height);
            this.ctx.lineTo(landmarks[291].x * width, landmarks[291].y * height);
            this.ctx.lineTo(landmarks[17].x * width, landmarks[17].y * height);
            this.ctx.lineTo(landmarks[84].x * width, landmarks[84].y * height);
            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.stroke();
        }
        
        // Crystal formations on face
        const crystalPoints = [10, 152, 234, 454, 127, 356];
        for (const pointIndex of crystalPoints) {
            const point = landmarks[pointIndex];
            if (point) {
                const size = 8 + Math.sin(time * 2 + pointIndex) * 3;
                this.drawCrystalShape(point.x * width, point.y * height, size, 4);
            }
        }
        
        this.ctx.globalAlpha = 1;
    }

    drawCrystalShape(x, y, size, sides) {
        this.ctx.save();
        this.ctx.translate(x, y);
        
        this.ctx.beginPath();
        for (let i = 0; i < sides; i++) {
            const angle = (i * 2 * Math.PI) / sides;
            const px = size * Math.cos(angle);
            const py = size * Math.sin(angle);
            if (i === 0) {
                this.ctx.moveTo(px, py);
            } else {
                this.ctx.lineTo(px, py);
            }
        }
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
        
        this.ctx.restore();
    }

    drawGothic(landmarks, width, height, color) {
        this.ctx.strokeStyle = color;
        this.ctx.fillStyle = color;
        this.ctx.lineWidth = 2;
        this.ctx.globalAlpha = 0.9;
        
        // Gothic eye makeup
        const leftEye = landmarks[468];
        const rightEye = landmarks[473];
        
        if (leftEye && rightEye) {
            // Dramatic eye outline
            this.ctx.lineWidth = 4;
            this.ctx.beginPath();
            this.ctx.arc(leftEye.x * width, leftEye.y * height, 18, 0, Math.PI * 2);
            this.ctx.stroke();
            
            // Wing-like extensions
            this.ctx.beginPath();
            this.ctx.moveTo(leftEye.x * width - 20, leftEye.y * height);
            this.ctx.lineTo(leftEye.x * width + 20, leftEye.y * height);
            this.ctx.stroke();
        }
        
        // Dark lips
        const lipPoints = [61, 291, 17, 84];
        this.ctx.lineWidth = 6;
        this.ctx.beginPath();
        if (lipPoints.every(p => landmarks[p])) {
            this.ctx.moveTo(landmarks[61].x * width, landmarks[61].y * height);
            this.ctx.quadraticCurveTo(
                landmarks[13].x * width, landmarks[13].y * height + 5,
                landmarks[291].x * width, landmarks[291].y * height
            );
            this.ctx.stroke();
        }
        
        // Gothic cross on forehead
        const forehead = landmarks[10];
        if (forehead) {
            const centerX = forehead.x * width;
            const centerY = forehead.y * height + 15;
            
            this.ctx.lineWidth = 3;
            this.ctx.beginPath();
            this.ctx.moveTo(centerX, centerY - 15);
            this.ctx.lineTo(centerX, centerY + 15);
            this.ctx.moveTo(centerX - 10, centerY - 5);
            this.ctx.lineTo(centerX + 10, centerY - 5);
            this.ctx.stroke();
        }
        
        this.ctx.globalAlpha = 1;
    }

    drawOrganic(landmarks, width, height, color) {
        const time = Date.now() * 0.002;
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 2;
        this.ctx.globalAlpha = 0.8;
        
        // Organic flowing lines connecting features
        const connections = [
            [33, 468, 473, 33], // Eye connection
            [19, 94, 125, 141], // Nose bridge
            [61, 13, 291] // Mouth center
        ];
        
        for (const path of connections) {
            this.ctx.beginPath();
            for (let i = 0; i < path.length; i++) {
                const point = landmarks[path[i]];
                const flow = Math.sin(time * 3 + i) * 3;
                
                if (i === 0) {
                    this.ctx.moveTo(point.x * width + flow, point.y * height);
                } else {
                    const prevPoint = landmarks[path[i-1]];
                    const midX = (prevPoint.x + point.x) * width / 2;
                    const midY = (prevPoint.y + point.y) * height / 2 + flow;
                    
                    this.ctx.lineTo(midX, midY);
                }
            }
            this.ctx.stroke();
        }
        
        // Organic eye shapes
        const leftEye = landmarks[468];
        const rightEye = landmarks[473];
        
        if (leftEye && rightEye) {
            this.ctx.lineWidth = 3;
            
            // Leaf-like eye shape
            for (const eye of [leftEye, rightEye]) {
                this.ctx.beginPath();
                for (let i = 0; i < 8; i++) {
                    const angle = (i * Math.PI * 2) / 8;
                    const radius = 12 + Math.sin(angle * 2 + time) * 4;
                    const x = eye.x * width + Math.cos(angle) * radius;
                    const y = eye.y * height + Math.sin(angle) * radius;
                    
                    if (i === 0) {
                        this.ctx.moveTo(x, y);
                    } else {
                        this.ctx.lineTo(x, y);
                    }
                }
                this.ctx.closePath();
                this.ctx.stroke();
            }
        }
        
        // Vine-like mouth
        const mouthPoints = [61, 291, 306, 292, 308, 324, 318, 402, 317, 14, 87, 178, 88, 95];
        this.ctx.lineWidth = 4;
        this.ctx.beginPath();
        for (let i = 0; i < mouthPoints.length; i++) {
            const point = landmarks[mouthPoints[i]];
            const wave = Math.sin(time * 4 + i) * 2;
            
            if (i === 0) {
                this.ctx.moveTo(point.x * width, point.y * height + wave);
            } else {
                this.ctx.lineTo(point.x * width, point.y * height + wave);
            }
        }
        this.ctx.stroke();
        
        this.ctx.globalAlpha = 1;
    }

    drawQuantum(landmarks, width, height, color) {
        const time = Date.now() * 0.003;
        this.ctx.strokeStyle = color;
        this.ctx.fillStyle = color;
        this.ctx.globalAlpha = 0.8;
        
        // Quantum probability clouds around eyes
        const leftEye = landmarks[468];
        const rightEye = landmarks[473];
        
        if (leftEye && rightEye) {
            for (const eye of [leftEye, rightEye]) {
                // Multiple probability states
                for (let state = 0; state < 5; state++) {
                    const probability = Math.sin(time * 2 + state) * 0.5 + 0.5;
                    this.ctx.globalAlpha = probability * 0.6;
                    this.ctx.lineWidth = 1 + state;
                    
                    const offset = state * 3;
                    this.ctx.beginPath();
                    this.ctx.arc(
                        eye.x * width + Math.sin(time + state) * offset,
                        eye.y * height + Math.cos(time + state) * offset,
                        8 + state * 2,
                        0, Math.PI * 2
                    );
                    this.ctx.stroke();
                }
            }
        }
        
        // Quantum entanglement lines
        this.ctx.globalAlpha = 0.6;
        this.ctx.lineWidth = 1;
        this.ctx.setLineDash([2, 4]);
        
        const quantumPoints = [33, 362, 19, 61, 291];
        for (let i = 0; i < quantumPoints.length; i++) {
            for (let j = i + 1; j < quantumPoints.length; j++) {
                const p1 = landmarks[quantumPoints[i]];
                const p2 = landmarks[quantumPoints[j]];
                
                const entanglement = Math.sin(time * 5 + i + j) * 0.5 + 0.5;
                if (entanglement > 0.7) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(p1.x * width, p1.y * height);
                    this.ctx.lineTo(p2.x * width, p2.y * height);
                    this.ctx.stroke();
                }
            }
        }
        
        this.ctx.setLineDash([]);
        
        // Quantum superposition mouth
        const mouth = landmarks[13];
        if (mouth) {
            for (let i = 0; i < 3; i++) {
                const phase = Math.sin(time * 4 + i * 2) * 5;
                this.ctx.globalAlpha = 0.4 + i * 0.2;
                this.ctx.lineWidth = 3;
                
                this.ctx.beginPath();
                this.ctx.arc(
                    mouth.x * width + phase,
                    mouth.y * height,
                    15 - i * 3,
                    0, Math.PI
                );
                this.ctx.stroke();
            }
        }
        
        this.ctx.globalAlpha = 1;
    }

    // Hand drawing methods for new mesh types
    drawHandCyberpunk(landmarks, width, height, color) {
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 2;
        this.ctx.shadowBlur = 8;
        this.ctx.shadowColor = color;
        this.ctx.globalAlpha = 0.9;
        
        const connections = [
            [0, 1], [1, 2], [2, 3], [3, 4],
            [0, 5], [5, 6], [6, 7], [7, 8],
            [0, 9], [9, 10], [10, 11], [11, 12],
            [0, 13], [13, 14], [14, 15], [15, 16],
            [0, 17], [17, 18], [18, 19], [19, 20]
        ];
        
        this.ctx.beginPath();
        for (const connection of connections) {
            const start = landmarks[connection[0]];
            const end = landmarks[connection[1]];
            const glitch = Math.sin(time * 12 + connection[0]) * 1.5;
            this.ctx.moveTo(start.x * width + glitch, start.y * height);
            this.ctx.lineTo(end.x * width + glitch, end.y * height);
        }
        this.ctx.stroke();
        
        const fingertips = [4, 8, 12, 16, 20];
        this.ctx.strokeStyle = '#ff0040';
        this.ctx.shadowColor = '#ff0040';
        this.ctx.lineWidth = 2;
        
        for (const tip of fingertips) {
            const point = landmarks[tip];
            this.ctx.beginPath();
            this.ctx.arc(point.x * width, point.y * height, 6, 0, Math.PI * 2);
            this.ctx.moveTo(point.x * width - 8, point.y * height);
            this.ctx.lineTo(point.x * width + 8, point.y * height);
            this.ctx.stroke();
        }
        
        this.ctx.shadowBlur = 0;
        this.ctx.globalAlpha = 1;
    }

    drawHandTribal(landmarks, width, height, color) {
        this.ctx.strokeStyle = color;
        this.ctx.fillStyle = color;
        this.ctx.lineWidth = 3;
        this.ctx.globalAlpha = 0.9;
        
        this.drawHandWireframe(landmarks, width, height, color);
        
        const palm = landmarks[0];
        if (palm) {
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.arc(palm.x * width, palm.y * height, 15, 0, Math.PI * 2);
            this.ctx.stroke();
            
            const innerPalmPattern = [
                [5, 9], [9, 13], [13, 17],
                [5, 13], [9, 17]
            ];
            
            for (const connection of innerPalmPattern) {
                const start = landmarks[connection[0]];
                const end = landmarks[connection[1]];
                this.ctx.beginPath();
                this.ctx.moveTo(start.x * width, start.y * height);
                this.ctx.lineTo(end.x * width, end.y * height);
                this.ctx.stroke();
            }
        }
        
        const fingertips = [4, 8, 12, 16, 20];
        this.ctx.globalAlpha = 0.8;
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        this.ctx.lineWidth = 2;

        for (const joint of fingertips) {
            const point = landmarks[joint];
            this.ctx.beginPath();
            this.ctx.arc(point.x * width, point.y * height, 4, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        this.ctx.globalAlpha = 1;
    }

    drawHandCrystal(landmarks, width, height, color) {
        const time = Date.now() * 0.001;
        this.ctx.strokeStyle = color;
        this.ctx.fillStyle = color.replace('rgb', 'rgba').replace(')', ', 0.4)');
        this.ctx.lineWidth = 2;
        
        const shimmer = Math.sin(time * 3) * 0.3 + 0.7;
        this.ctx.globalAlpha = shimmer;
        
        const joints = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
        for (const joint of joints) {
            const point = landmarks[joint];
            const size = 4 + Math.sin(time * 2 + joint) * 2;
            this.drawCrystalShape(point.x * width, point.y * height, size, 6);
        }
        
        this.drawHandWireframe(landmarks, width, height, color);
        this.ctx.globalAlpha = 1;
    }

    drawHandGothic(landmarks, width, height, color) {
        this.ctx.strokeStyle = color;
        this.ctx.fillStyle = color;
        this.ctx.lineWidth = 3;
        this.ctx.globalAlpha = 0.9;
        
        const connections = [
            [0, 1], [1, 2], [2, 3], [3, 4],
            [0, 5], [5, 6], [6, 7], [7, 8],
            [0, 9], [9, 10], [10, 11], [11, 12],
            [0, 13], [13, 14], [14, 15], [15, 16],
            [0, 17], [17, 18], [18, 19], [19, 20]
        ];
        
        this.ctx.beginPath();
        for (const connection of connections) {
            const start = landmarks[connection[0]];
            const end = landmarks[connection[1]];
            this.ctx.moveTo(start.x * width, start.y * height);
            this.ctx.lineTo(end.x * width, end.y * height);
        }
        this.ctx.stroke();
        
        const fingertips = [4, 8, 12, 16, 20];
        this.ctx.lineWidth = 4;
        for (const tip of fingertips) {
            const point = landmarks[tip];
            this.ctx.beginPath();
            this.ctx.moveTo(point.x * width, point.y * height);
            this.ctx.lineTo(point.x * width + 8, point.y * height - 12);
            this.ctx.stroke();
        }
        
        this.ctx.globalAlpha = 1;
    }

    drawHandOrganic(landmarks, width, height, color) {
        const time = Date.now() * 0.002;
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 2;
        this.ctx.globalAlpha = 0.8;
        
        const connections = [
            [0, 1], [1, 2], [2, 3], [3, 4],
            [0, 5], [5, 6], [6, 7], [7, 8],
            [0, 9], [9, 10], [10, 11], [11, 12],
            [0, 13], [13, 14], [14, 15], [15, 16],
            [0, 17], [17, 18], [18, 19], [19, 20]
        ];
        
        this.ctx.beginPath();
        for (const connection of connections) {
            const start = landmarks[connection[0]];
            const end = landmarks[connection[1]];
            const flow = Math.sin(time * 3 + connection[0]) * 2;
            
            this.ctx.moveTo(start.x * width + flow, start.y * height);
            this.ctx.lineTo(end.x * width + flow, end.y * height);
        }
        this.ctx.stroke();
        
        const fingertips = [4, 8, 12, 16, 20];
        this.ctx.lineWidth = 3;
        for (const tip of fingertips) {
            const point = landmarks[tip];
            const growth = Math.sin(time * 2 + tip) * 3 + 5;
            
            this.ctx.beginPath();
            this.ctx.arc(point.x * width, point.y * height, growth, 0, Math.PI * 2);
            this.ctx.stroke();
        }
        
        this.ctx.globalAlpha = 1;
    }

    drawHandQuantum(landmarks, width, height, color) {
        const time = Date.now() * 0.003;
        this.ctx.strokeStyle = color;
        this.ctx.globalAlpha = 0.7;
        
        for (let state = 0; state < 3; state++) {
            const probability = Math.sin(time * 2 + state) * 0.5 + 0.5;
            this.ctx.globalAlpha = probability * 0.6;
            this.ctx.lineWidth = 1 + state;
            
            const connections = [
                [0, 1], [1, 2], [2, 3], [3, 4],
                [0, 5], [5, 6], [6, 7], [7, 8],
                [0, 9], [9, 10], [10, 11], [11, 12],
                [0, 13], [13, 14], [14, 15], [15, 16],
                [0, 17], [17, 18], [18, 19], [19, 20]
            ];
            
            this.ctx.beginPath();
            for (const connection of connections) {
                const start = landmarks[connection[0]];
                const end = landmarks[connection[1]];
                const offset = state * 2;
                
                this.ctx.moveTo(
                    start.x * width + Math.sin(time + state) * offset,
                    start.y * height + Math.cos(time + state) * offset
                );
                this.ctx.lineTo(
                    end.x * width + Math.sin(time + state) * offset,
                    end.y * height + Math.cos(time + state) * offset
                );
                this.ctx.stroke();
            }
        }
        this.ctx.globalAlpha = 1;
    }

    async loadMeshModules() {
        const modules = [
            './steampunk-mesh.js',
            './biomech-mesh.js', 
            './neural-mesh.js',
            './fractal-mesh.js',
            './void-mesh.js',
            './plasma-mesh.js',
            './ethereal-mesh.js',
            './celestial-mesh.js',
            './mechanical-mesh.js',
            './mystic-mesh.js',
            './laser-mesh.js',
            './cosmic-mesh.js',
            './cosmictree-mesh.js',
            './zer0-mesh.js'
        ];

        for (const modulePath of modules) {
            try {
                const module = await import(modulePath);
                Object.assign(this, module.default(this.ctx));
            } catch (error) {
                console.warn(`Failed to load mesh module: ${modulePath}`, error);
            }
        }
    }

    drawEthereal(landmarks, width, height, color) {
        this.drawWireframe(landmarks, width, height, color);
    }
    drawCelestial(landmarks, width, height, color) {
        this.drawWireframe(landmarks, width, height, color);
    }
    drawMechanical(landmarks, width, height, color) {
        this.drawWireframe(landmarks, width, height, color);
    }
    drawMystic(landmarks, width, height, color) {
        this.drawWireframe(landmarks, width, height, color);
    }
    drawLaser(landmarks, width, height, color) {
        this.drawWireframe(landmarks, width, height, color);
    }
    drawCosmic(landmarks, width, height, color) {
        this.drawWireframe(landmarks, width, height, color);
    }
    drawCosmicTree(landmarks, width, height, color) {
        this.drawWireframe(landmarks, width, height, color);
    }

    drawHandEthereal(landmarks, width, height, color) {
        this.drawHandWireframe(landmarks, width, height, color);
    }
    drawHandCelestial(landmarks, width, height, color) {
        this.drawHandWireframe(landmarks, width, height, color);
    }
    drawHandMechanical(landmarks, width, height, color) {
        this.drawHandWireframe(landmarks, width, height, color);
    }
    drawHandMystic(landmarks, width, height, color) {
        this.drawHandWireframe(landmarks, width, height, color);
    }
    drawHandLaser(landmarks, width, height, color) {
        this.drawHandWireframe(landmarks, width, height, color);
    }
    drawHandCosmic(landmarks, width, height, color) {
        this.drawHandWireframe(landmarks, width, height, color);
    }
    drawHandCosmicTree(landmarks, width, height, color) {
        this.drawHandWireframe(landmarks, width, height, color);
    }
    drawZer0(landmarks, width, height, color) {
        this.drawWireframe(landmarks, width, height, color);
    }
    drawHandZer0(landmarks, width, height, color) {
        this.drawHandWireframe(landmarks, width, height, color);
    }
}