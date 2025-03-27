// Advanced visualization styles
import VisualizerCore from './visualizer-core.js';

const AdvancedVisualizers = {
    // Spectrum visualization
    drawSpectrum(ctx, frequencyData, canvas, sensitivity, colorTheme, customColor) {
        const width = canvas.width;
        const height = canvas.height;
        
        // Clear canvas with a semi-transparent black for trail effect
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.fillRect(0, 0, width, height);
        
        const centerY = height / 2;
        const barCount = width / 2;
        const barWidth = width / barCount;
        const dataStep = Math.floor(frequencyData.length / barCount);
        
        // Set blend mode for glow effect
        ctx.globalCompositeOperation = 'lighter';
        
        for (let i = 0; i < barCount; i++) {
            const dataIndex = i * dataStep;
            const value = frequencyData[dataIndex] * sensitivity / 255;
            
            const barHeight = Math.min(height, value * height * 0.8);
            
            // Mirror effect - bars extend from center both up and down
            const x = i * barWidth;
            const y1 = centerY - barHeight / 2;
            const y2 = centerY + barHeight / 2;
            
            // Color based on frequency value
            let hue;
            if (colorTheme === 'gradient') {
                hue = (i / barCount) * 360;
            } else if (colorTheme === 'blue') {
                hue = 210 + (value * 30);
            } else if (colorTheme === 'green') {
                hue = 120 + (value * 30);
            } else if (colorTheme === 'purple') {
                hue = 270 + (value * 30);
            } else if (colorTheme === 'custom') {
                const rgb = VisualizerCore.hexToRgb(customColor);
                ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${value})`;
            }
            
            if (colorTheme !== 'custom') {
                ctx.fillStyle = `hsla(${hue}, 100%, 60%, ${value * 0.8})`;
            }
            
            // Draw the bar
            ctx.beginPath();
            ctx.moveTo(x, centerY);
            ctx.lineTo(x, y1);
            ctx.lineTo(x + barWidth, y1);
            ctx.lineTo(x + barWidth, centerY);
            ctx.fill();
            
            ctx.beginPath();
            ctx.moveTo(x, centerY);
            ctx.lineTo(x, y2);
            ctx.lineTo(x + barWidth, y2);
            ctx.lineTo(x + barWidth, centerY);
            ctx.fill();
            
            // Draw mirrored bars on the right side
            const mirrorX = width - x - barWidth;
            
            ctx.beginPath();
            ctx.moveTo(mirrorX, centerY);
            ctx.lineTo(mirrorX, y1);
            ctx.lineTo(mirrorX + barWidth, y1);
            ctx.lineTo(mirrorX + barWidth, centerY);
            ctx.fill();
            
            ctx.beginPath();
            ctx.moveTo(mirrorX, centerY);
            ctx.lineTo(mirrorX, y2);
            ctx.lineTo(mirrorX + barWidth, y2);
            ctx.lineTo(mirrorX + barWidth, centerY);
            ctx.fill();
        }
        
        // Reset composite operation
        ctx.globalCompositeOperation = 'source-over';
    },
    
    // Fractal visualization
    drawFractal(ctx, frequencyData, canvas, sensitivity, colorTheme, customColor) {
        const width = canvas.width;
        const height = canvas.height;
        
        // Clear the canvas
        ctx.clearRect(0, 0, width, height);
        
        // Calculate bass and treble levels for fractal parameters
        const bassLevel = VisualizerCore.getAverageFrequency(frequencyData, 0, 10) * sensitivity / 255;
        const midLevel = VisualizerCore.getAverageFrequency(frequencyData, 10, 100) * sensitivity / 255;
        const trebleLevel = VisualizerCore.getAverageFrequency(frequencyData, 100, 200) * sensitivity / 255;
        
        const time = performance.now() * 0.001;
        const maxIterations = Math.floor(trebleLevel * 10) + 3;
        const centerX = width / 2;
        const centerY = height / 2;
        
        // Set fractal parameters based on audio levels
        const zoom = 2 + bassLevel * 2;
        const rotation = time * 0.2 + midLevel * Math.PI;
        
        // Create gradient
        let gradient;
        if (colorTheme === 'custom') {
            const rgb = VisualizerCore.hexToRgb(customColor);
            gradient = ctx.createRadialGradient(centerX, centerY, 10, centerX, centerY, width / 2);
            gradient.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`);
            gradient.addColorStop(1, `rgba(${rgb.r / 2}, ${rgb.g / 2}, ${rgb.b / 2}, 0.5)`);
        } else if (colorTheme === 'gradient') {
            gradient = ctx.createLinearGradient(0, 0, width, height);
            gradient.addColorStop(0, 'rgba(255, 107, 107, 1)');
            gradient.addColorStop(0.25, 'rgba(78, 205, 196, 1)');
            gradient.addColorStop(0.5, 'rgba(134, 117, 169, 1)');
            gradient.addColorStop(0.75, 'rgba(255, 190, 11, 1)');
            gradient.addColorStop(1, 'rgba(255, 107, 107, 1)');
        } else if (colorTheme === 'blue') {
            gradient = ctx.createRadialGradient(centerX, centerY, 10, centerX, centerY, width / 2);
            gradient.addColorStop(0, 'rgba(18, 194, 233, 1)');
            gradient.addColorStop(0.5, 'rgba(196, 113, 237, 1)');
            gradient.addColorStop(1, 'rgba(246, 79, 89, 0.7)');
        } else if (colorTheme === 'green') {
            gradient = ctx.createRadialGradient(centerX, centerY, 10, centerX, centerY, width / 2);
            gradient.addColorStop(0, 'rgba(113, 178, 128, 1)');
            gradient.addColorStop(1, 'rgba(19, 78, 94, 0.7)');
        } else if (colorTheme === 'purple') {
            gradient = ctx.createRadialGradient(centerX, centerY, 10, centerX, centerY, width / 2);
            gradient.addColorStop(0, 'rgba(142, 45, 226, 1)');
            gradient.addColorStop(1, 'rgba(74, 0, 224, 0.7)');
        }
        
        // Draw the fractal branches recursively
        const drawBranch = (x, y, length, angle, depth) => {
            if (depth === 0) return;
            
            const endX = x + Math.cos(angle) * length;
            const endY = y + Math.sin(angle) * length;
            
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(endX, endY);
            ctx.lineWidth = depth * 1.5;
            ctx.strokeStyle = gradient;
            ctx.stroke();
            
            // Recursive branches with audio-based angles
            const branchAngle = Math.PI / 4 + (trebleLevel * Math.PI / 4);
            drawBranch(endX, endY, length * 0.7, angle + branchAngle, depth - 1);
            drawBranch(endX, endY, length * 0.7, angle - branchAngle, depth - 1);
        };
        
        // Start the fractal from bottom center
        const startY = height * 0.8;
        const startAngle = -Math.PI / 2; // Upward
        const branchLength = height * 0.2 * (1 + bassLevel);
        
        drawBranch(centerX, startY, branchLength, startAngle + rotation * 0.1, maxIterations);
    },
    
    // Spiral visualization
    drawSpiral(ctx, frequencyData, canvas, sensitivity, colorTheme, customColor) {
        const width = canvas.width;
        const height = canvas.height;
        
        // Clear the canvas with a fade effect for trails
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, width, height);
        
        const centerX = width / 2;
        const centerY = height / 2;
        
        // Calculate audio levels
        const bassLevel = VisualizerCore.getAverageFrequency(frequencyData, 0, 10) * sensitivity / 255;
        const midLevel = VisualizerCore.getAverageFrequency(frequencyData, 10, 100) * sensitivity / 255;
        const trebleLevel = VisualizerCore.getAverageFrequency(frequencyData, 100, 200) * sensitivity / 255;
        
        // Animation time
        const time = performance.now() * 0.001;
        
        // Spiral parameters based on audio
        const maxRadius = Math.min(width, height) * 0.4 * (1 + bassLevel);
        const turns = 3 + midLevel * 5;
        const points = 100 + Math.floor(trebleLevel * 100);
        const arms = 5 + Math.floor(bassLevel * 5);
        const spiralTightness = turns * 2 * Math.PI;
        
        // Rotation speed based on bass
        const rotation = time * (0.2 + bassLevel * 0.3);
        
        // Draw spiral particles
        for (let i = 0; i < points; i++) {
            // Calculate particle position
            const pct = i / points;
            const armIndex = Math.floor(Math.random() * arms);
            const armOffset = (armIndex / arms) * Math.PI * 2;
            
            // Distance from center
            const dist = pct * maxRadius;
            const angle = armOffset + pct * spiralTightness + rotation;
            
            // Calculate position
            const x = centerX + Math.cos(angle) * dist;
            const y = centerY + Math.sin(angle) * dist;
            
            // Get audio data for this particle
            const dataIndex = Math.floor(pct * frequencyData.length);
            const value = frequencyData[dataIndex] * sensitivity / 255;
            
            // Particle size based on audio
            const size = 1 + value * 4;
            
            // Determine color based on theme and position in spiral
            let color;
            if (colorTheme === 'custom') {
                const rgb = VisualizerCore.hexToRgb(customColor);
                const brightness = 0.5 + value * 0.5;
                color = `rgba(${rgb.r * brightness}, ${rgb.g * brightness}, ${rgb.b * brightness}, ${0.7 + value * 0.3})`;
            } else if (colorTheme === 'gradient') {
                const hue = (armIndex / arms) * 360;
                color = `hsla(${hue}, 100%, ${50 + value * 30}%, ${0.7 + value * 0.3})`;
            } else if (colorTheme === 'blue') {
                const hue = 210 + (armIndex / arms) * 60;
                color = `hsla(${hue}, 100%, ${50 + value * 30}%, ${0.7 + value * 0.3})`;
            } else if (colorTheme === 'green') {
                const hue = 120 + (armIndex / arms) * 40;
                color = `hsla(${hue}, 100%, ${50 + value * 30}%, ${0.7 + value * 0.3})`;
            } else if (colorTheme === 'purple') {
                const hue = 270 + (armIndex / arms) * 40;
                color = `hsla(${hue}, 100%, ${50 + value * 30}%, ${0.7 + value * 0.3})`;
            }
            
            // Draw the particle
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.fill();
        }
        
        // Draw galaxy center
        const centerGlow = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, maxRadius * 0.2);
        centerGlow.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
        centerGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, maxRadius * 0.2, 0, Math.PI * 2);
        ctx.fillStyle = centerGlow;
        ctx.fill();
    },
    
    // 3D Cubes visualization
    drawCubes(ctx, frequencyData, canvas, sensitivity, colorTheme, customColor) {
        const width = canvas.width;
        const height = canvas.height;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        const time = performance.now() * 0.001;
        const centerX = width / 2;
        const centerY = height / 2;
        
        // Calculate audio levels
        const bassLevel = VisualizerCore.getAverageFrequency(frequencyData, 0, 10) * sensitivity / 255;
        const midLevel = VisualizerCore.getAverageFrequency(frequencyData, 10, 100) * sensitivity / 255;
        
        // Create grid of cubes
        const gridSize = 8;
        const spacing = Math.min(width, height) / (gridSize * 1.5);
        
        // Create colors
        let colors = [];
        if (colorTheme === 'custom') {
            const rgb = VisualizerCore.hexToRgb(customColor);
            colors = [
                `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.9)`,
                `rgba(${rgb.r * 0.8}, ${rgb.g * 0.8}, ${rgb.b * 0.8}, 0.8)`,
                `rgba(${rgb.r * 0.6}, ${rgb.g * 0.6}, ${rgb.b * 0.6}, 0.7)`
            ];
        } else if (colorTheme === 'gradient') {
            colors = [
                'rgba(255, 107, 107, 0.9)',
                'rgba(78, 205, 196, 0.8)',
                'rgba(134, 117, 169, 0.7)'
            ];
        } else if (colorTheme === 'blue') {
            colors = [
                'rgba(18, 194, 233, 0.9)',
                'rgba(196, 113, 237, 0.8)',
                'rgba(246, 79, 89, 0.7)'
            ];
        } else if (colorTheme === 'green') {
            colors = [
                'rgba(113, 178, 128, 0.9)',
                'rgba(66, 134, 85, 0.8)',
                'rgba(19, 78, 94, 0.7)'
            ];
        } else if (colorTheme === 'purple') {
            colors = [
                'rgba(142, 45, 226, 0.9)',
                'rgba(108, 22, 224, 0.8)',
                'rgba(74, 0, 224, 0.7)'
            ];
        }
        
        // Draw the grid of cubes
        const startX = centerX - (spacing * (gridSize - 1)) / 2;
        const startY = centerY - (spacing * (gridSize - 1)) / 2;
        
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                const x = startX + i * spacing;
                const y = startY + j * spacing;
                
                // Get frequency data for this position
                const freqIndex = Math.floor(((i * gridSize + j) / (gridSize * gridSize)) * frequencyData.length);
                const value = frequencyData[freqIndex] * sensitivity / 255;
                
                // Calculate cube size and rotation based on audio
                const size = spacing * 0.5 * (0.5 + value);
                const rotX = time + i * 0.1 + value * 2;
                const rotY = time * 0.7 + j * 0.1 + value * 2;
                
                // Draw 3D cube
                this.drawCube(ctx, x, y, size, rotX, rotY, colors);
            }
        }
    },
    
    // Helper method to draw a 3D cube
    drawCube(ctx, x, y, size, rotX, rotY, colors) {
        // Define cube vertices (center at origin)
        const vertices = [
            [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
            [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]
        ];
        
        // Define cube faces as vertex indices
        const faces = [
            [0, 1, 2, 3], // front
            [4, 5, 6, 7], // back
            [0, 1, 5, 4], // bottom
            [2, 3, 7, 6], // top
            [0, 3, 7, 4], // left
            [1, 2, 6, 5]  // right
        ];
        
        // Rotation matrices
        const cosX = Math.cos(rotX);
        const sinX = Math.sin(rotX);
        const cosY = Math.cos(rotY);
        const sinY = Math.sin(rotY);
        
        // Transform vertices
        const transformedVertices = vertices.map(v => {
            // Apply rotation X
            let x1 = v[0];
            let y1 = v[1] * cosX - v[2] * sinX;
            let z1 = v[1] * sinX + v[2] * cosX;
            
            // Apply rotation Y
            let x2 = x1 * cosY + z1 * sinY;
            let y2 = y1;
            let z2 = -x1 * sinY + z1 * cosY;
            
            // Scale and translate
            return [
                x + x2 * size,
                y + y2 * size,
                z2
            ];
        });
        
        // Calculate face depths for z-sorting
        const faceDepths = faces.map((face, i) => {
            const avgZ = face.reduce((sum, vertIndex) => sum + transformedVertices[vertIndex][2], 0) / face.length;
            return { index: i, z: avgZ };
        });
        
        // Sort faces by depth (painter's algorithm)
        faceDepths.sort((a, b) => b.z - a.z);
        
        // Draw faces from back to front
        faceDepths.forEach(({ index }) => {
            const face = faces[index];
            
            ctx.beginPath();
            ctx.moveTo(transformedVertices[face[0]][0], transformedVertices[face[0]][1]);
            
            for (let i = 1; i < face.length; i++) {
                ctx.lineTo(transformedVertices[face[i]][0], transformedVertices[face[i]][1]);
            }
            
            ctx.closePath();
            ctx.fillStyle = colors[index % colors.length];
            ctx.fill();
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.lineWidth = 1;
            ctx.stroke();
        });
    },
    
    // Galaxy visualization
    drawGalaxy(ctx, frequencyData, canvas, sensitivity, colorTheme, customColor) {
        const width = canvas.width;
        const height = canvas.height;
        
        // Semi-transparent clear for trails
        ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
        ctx.fillRect(0, 0, width, height);
        
        const centerX = width / 2;
        const centerY = height / 2;
        
        // Calculate audio levels
        const bassLevel = VisualizerCore.getAverageFrequency(frequencyData, 0, 10) * sensitivity / 255;
        const midLevel = VisualizerCore.getAverageFrequency(frequencyData, 10, 100) * sensitivity / 255;
        
        // Animation time
        const time = performance.now() * 0.001;
        
        // Galaxy parameters
        const arms = 4 + Math.floor(midLevel * 3);
        const particles = 200;
        const spiralTightness = 3 + bassLevel * 6;
        const maxRadius = Math.min(width, height) * 0.4 * (1 + bassLevel * 0.3);
        
        // Rotation speed based on bass
        const rotation = time * (0.1 + bassLevel * 0.2);
        
        // Draw galaxy particles
        for (let i = 0; i < particles; i++) {
            // Calculate particle position
            const pct = i / particles;
            const armIndex = Math.floor(Math.random() * arms);
            const armOffset = (armIndex / arms) * Math.PI * 2;
            
            // Distance from center
            const dist = pct * maxRadius;
            const angle = armOffset + pct * spiralTightness + rotation;
            
            // Calculate position
            const x = centerX + Math.cos(angle) * dist;
            const y = centerY + Math.sin(angle) * dist;
            
            // Get audio data for this particle
            const dataIndex = Math.floor(pct * frequencyData.length);
            const value = frequencyData[dataIndex] * sensitivity / 255;
            
            // Particle size based on audio
            const size = 1 + value * 4;
            
            // Determine color based on theme and position in spiral
            let color;
            if (colorTheme === 'custom') {
                const rgb = VisualizerCore.hexToRgb(customColor);
                const brightness = 0.5 + value * 0.5;
                color = `rgba(${rgb.r * brightness}, ${rgb.g * brightness}, ${rgb.b * brightness}, ${0.7 + value * 0.3})`;
            } else if (colorTheme === 'gradient') {
                const hue = (armIndex / arms) * 360;
                color = `hsla(${hue}, 100%, ${50 + value * 30}%, ${0.7 + value * 0.3})`;
            } else if (colorTheme === 'blue') {
                const hue = 210 + (armIndex / arms) * 60;
                color = `hsla(${hue}, 100%, ${50 + value * 30}%, ${0.7 + value * 0.3})`;
            } else if (colorTheme === 'green') {
                const hue = 120 + (armIndex / arms) * 40;
                color = `hsla(${hue}, 100%, ${50 + value * 30}%, ${0.7 + value * 0.3})`;
            } else if (colorTheme === 'purple') {
                const hue = 270 + (armIndex / arms) * 40;
                color = `hsla(${hue}, 100%, ${50 + value * 30}%, ${0.7 + value * 0.3})`;
            }
            
            // Draw the particle
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.fill();
        }
        
        // Draw galaxy center
        const centerGlow = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, maxRadius * 0.2);
        centerGlow.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
        centerGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, maxRadius * 0.2, 0, Math.PI * 2);
        ctx.fillStyle = centerGlow;
        ctx.fill();
    }
};

export default AdvancedVisualizers;