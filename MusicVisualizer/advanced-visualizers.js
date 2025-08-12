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
    },
    
    // Neon Waves Visualization
    drawNeonWaves(ctx, frequencyData, canvas, sensitivity, colorTheme, customColor, customGradientColors) {
        const width = canvas.width;
        const height = canvas.height;
        
        // Clear canvas with fade effect for trails
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.fillRect(0, 0, width, height);
        
        // Parameters
        const centerY = height / 2;
        const waveCount = 5;
        const waveHeight = height / (waveCount * 3);
        
        // Calculate levels for intensity
        const bassLevel = VisualizerCore.getAverageFrequency(frequencyData, 0, 10) * sensitivity / 255;
        const midLevel = VisualizerCore.getAverageFrequency(frequencyData, 10, 100) * sensitivity / 255;
        
        // Animation time
        const time = performance.now() * 0.001;
        
        // Process for each wave
        for (let wave = 0; wave < waveCount; wave++) {
            // Determine wave Y position (evenly spaced)
            const baseY = wave * height / waveCount + height / (waveCount * 2);
            
            // Calculate wave intensity from frequency data
            // Use different frequency bands for each wave
            const freqStart = Math.floor((wave / waveCount) * frequencyData.length * 0.8);
            const freqEnd = Math.floor(((wave + 1) / waveCount) * frequencyData.length * 0.8);
            const waveIntensity = VisualizerCore.getAverageFrequency(frequencyData, freqStart, freqEnd) * sensitivity / 255;
            
            // Get color based on theme
            let strokeColor;
            if (colorTheme === 'custom') {
                const rgb = VisualizerCore.hexToRgb(customColor);
                strokeColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.8)`;
            } else if (colorTheme === 'custom-gradient') {
                // Use one color from the custom gradient
                const colorIndex = wave % customGradientColors.length;
                const rgb = VisualizerCore.hexToRgb(customGradientColors[colorIndex]);
                strokeColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.8)`;
            } else if (colorTheme === 'gradient') {
                const hue = (wave / waveCount) * 360;
                strokeColor = `hsla(${hue}, 100%, 60%, 0.8)`;
            } else if (colorTheme === 'blue') {
                const hue = 190 + (wave / waveCount) * 60;
                strokeColor = `hsla(${hue}, 100%, 60%, 0.8)`;
            } else if (colorTheme === 'green') {
                const hue = 90 + (wave / waveCount) * 60;
                strokeColor = `hsla(${hue}, 100%, 60%, 0.8)`;
            } else if (colorTheme === 'purple') {
                const hue = 250 + (wave / waveCount) * 50;
                strokeColor = `hsla(${hue}, 100%, 60%, 0.8)`;
            }
            
            // Draw wave
            ctx.beginPath();
            
            // Create wave points
            const segments = 100;
            const segmentWidth = width / segments;
            
            for (let i = 0; i <= segments; i++) {
                const x = i * segmentWidth;
                
                // Calculate wave height using sine wave modulated by frequency data
                // Add variations for each wave
                const wavePhase = time * (1 + wave * 0.2) + i * 0.05;
                const waveFactor = waveIntensity * waveHeight * (1 + bassLevel * 2);
                
                // Add multiple sine waves with different frequencies for complexity
                const y = baseY + 
                    Math.sin(wavePhase) * waveFactor +
                    Math.sin(wavePhase * 2.5) * waveFactor * 0.5 +
                    Math.sin(wavePhase * 0.5 + wave) * waveFactor * 0.3;
                
                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            
            // Style the line
            ctx.strokeStyle = strokeColor;
            ctx.lineWidth = 3 + waveIntensity * 5;
            
            // Add glow effect
            ctx.shadowColor = strokeColor;
            ctx.shadowBlur = 15 + midLevel * 20;
            
            ctx.stroke();
            
            // Reset shadow for next wave
            ctx.shadowBlur = 0;
        }
    },
    
    // Starfield Visualization
    drawStarfield(ctx, frequencyData, canvas, sensitivity, colorTheme, customColor, customGradientColors) {
        const width = canvas.width;
        const height = canvas.height;
        
        // Semi-transparent clear for trails
        ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
        ctx.fillRect(0, 0, width, height);
        
        const centerX = width / 2;
        const centerY = height / 2;
        
        // Calculate audio levels
        const bassLevel = VisualizerCore.getAverageFrequency(frequencyData, 0, 10) * sensitivity / 255;
        const midLevel = VisualizerCore.getAverageFrequency(frequencyData, 10, 50) * sensitivity / 255;
        const highLevel = VisualizerCore.getAverageFrequency(frequencyData, 50, 200) * sensitivity / 255;
        
        // Starfield parameters
        const starCount = 300;
        const starSpeed = 2 + bassLevel * 10;
        
        // Create star particles if not already created
        if (!this.stars || this.stars.length === 0) {
            this.stars = [];
            for (let i = 0; i < starCount; i++) {
                // Random position in 3D space
                const x = (Math.random() - 0.5) * width * 2;
                const y = (Math.random() - 0.5) * height * 2;
                const z = Math.random() * width;
                
                // Random star type (affects size and color)
                const type = Math.floor(Math.random() * 3);
                
                this.stars.push({ x, y, z, type });
            }
        }
        
        // Update and draw stars
        for (let i = 0; i < this.stars.length; i++) {
            const star = this.stars[i];
            
            // Move star (z direction = towards viewer)
            star.z -= starSpeed * (1 + star.z / width * 0.5);
            
            // Reset star if it moves past the viewer
            if (star.z <= 0) {
                star.x = (Math.random() - 0.5) * width * 2;
                star.y = (Math.random() - 0.5) * height * 2;
                star.z = width;
            }
            
            // Project 3D position to 2D screen
            const scaleFactor = width / star.z;
            const projectedX = centerX + star.x * scaleFactor;
            const projectedY = centerY + star.y * scaleFactor;
            
            // Skip if outside of viewport
            if (
                projectedX < 0 || projectedX > width ||
                projectedY < 0 || projectedY > height
            ) {
                continue;
            }
            
            // Calculate star size based on z position and audio
            const sizeFactor = (1 - star.z / width) * (1 + bassLevel);
            let size = star.type === 0 ? 1 * sizeFactor : 
                      star.type === 1 ? 2 * sizeFactor :
                      3 * sizeFactor;
            
            // Make some stars pulse with the music
            if (star.type === 2) {
                size += highLevel * 3;
            }
            
            // Calculate star color based on type and theme
            let starColor;
            if (colorTheme === 'custom') {
                const rgb = VisualizerCore.hexToRgb(customColor);
                starColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${sizeFactor})`;
            } else if (colorTheme === 'custom-gradient') {
                const colorIndex = Math.floor(i % customGradientColors.length);
                const rgb = VisualizerCore.hexToRgb(customGradientColors[colorIndex]);
                starColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${sizeFactor})`;
            } else if (colorTheme === 'gradient') {
                const hue = (star.z / width) * 360;
                starColor = `hsla(${hue}, 100%, 80%, ${sizeFactor})`;
            } else if (colorTheme === 'blue') {
                const hue = 180 + (star.z / width) * 60;
                starColor = `hsla(${hue}, 100%, 80%, ${sizeFactor})`;
            } else if (colorTheme === 'green') {
                const hue = 90 + (star.z / width) * 60;
                starColor = `hsla(${hue}, 100%, 80%, ${sizeFactor})`;
            } else if (colorTheme === 'purple') {
                const hue = 270 + (star.z / width) * 60;
                starColor = `hsla(${hue}, 100%, 80%, ${sizeFactor})`;
            }
            
            // Draw star with glow effect
            ctx.beginPath();
            ctx.arc(projectedX, projectedY, size, 0, Math.PI * 2);
            ctx.fillStyle = starColor;
            
            // Add glow effect for larger stars
            if (star.type === 2 || size > 2) {
                ctx.shadowColor = starColor;
                ctx.shadowBlur = size * 2;
            }
            
            ctx.fill();
            
            // Reset shadow
            ctx.shadowBlur = 0;
            
            // Draw motion streak for faster stars
            if (star.z < width * 0.5 && star.type === 2) {
                ctx.beginPath();
                ctx.moveTo(projectedX, projectedY);
                
                // Calculate previous position
                const prevScaleFactor = width / (star.z + starSpeed);
                const prevX = centerX + star.x * prevScaleFactor;
                const prevY = centerY + star.y * prevScaleFactor;
                
                ctx.lineTo(prevX, prevY);
                ctx.strokeStyle = starColor;
                ctx.lineWidth = size / 2;
                ctx.stroke();
            }
        }
        
        // Add a central glow effect that responds to the bass
        if (bassLevel > 0.5) {
            const glowSize = 50 + bassLevel * 100;
            const glowOpacity = (bassLevel - 0.5) * 2 * 0.3;
            
            let glowColor;
            if (colorTheme === 'custom') {
                const rgb = VisualizerCore.hexToRgb(customColor);
                glowColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${glowOpacity})`;
            } else if (colorTheme === 'custom-gradient') {
                const rgb = VisualizerCore.hexToRgb(customGradientColors[0]);
                glowColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${glowOpacity})`;
            } else if (colorTheme === 'gradient') {
                glowColor = `rgba(255, 107, 107, ${glowOpacity})`;
            } else if (colorTheme === 'blue') {
                glowColor = `rgba(18, 194, 233, ${glowOpacity})`;
            } else if (colorTheme === 'green') {
                glowColor = `rgba(113, 178, 128, ${glowOpacity})`;
            } else if (colorTheme === 'purple') {
                glowColor = `rgba(142, 45, 226, ${glowOpacity})`;
            }
            
            const glow = ctx.createRadialGradient(
                centerX, centerY, 0,
                centerX, centerY, glowSize
            );
            
            glow.addColorStop(0, glowColor);
            glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
            
            ctx.beginPath();
            ctx.arc(centerX, centerY, glowSize, 0, Math.PI * 2);
            ctx.fillStyle = glow;
            ctx.fill();
        }
    },
    
    // Kaleidoscope Visualization
    drawKaleidoscope(ctx, frequencyData, canvas, sensitivity, colorTheme, customColor, customGradientColors) {
        const width = canvas.width;
        const height = canvas.height;
        
        // Clear canvas with fade effect
        ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
        ctx.fillRect(0, 0, width, height);
        
        const centerX = width / 2;
        const centerY = height / 2;
        
        // Calculate audio levels
        const bassLevel = VisualizerCore.getAverageFrequency(frequencyData, 0, 10) * sensitivity / 255;
        const midLevel = VisualizerCore.getAverageFrequency(frequencyData, 10, 100) * sensitivity / 255;
        const highLevel = VisualizerCore.getAverageFrequency(frequencyData, 100, 200) * sensitivity / 255;
        
        // Animation time
        const time = performance.now() * 0.001;
        
        // Kaleidoscope parameters
        const segments = 8 + Math.floor(bassLevel * 8); // Number of mirror segments
        const radius = Math.min(width, height) * 0.4 * (1 + bassLevel * 0.3);
        const innerRadius = radius * 0.2;
        
        // Radial gradient for background
        const bgGradient = ctx.createRadialGradient(
            centerX, centerY, innerRadius,
            centerX, centerY, radius
        );
        
        // Get background colors based on theme
        let color1, color2;
        if (colorTheme === 'custom') {
            const rgb = VisualizerCore.hexToRgb(customColor);
            color1 = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.2)`;
            color2 = `rgba(${rgb.r/3}, ${rgb.g/3}, ${rgb.b/3}, 0)`;
        } else if (colorTheme === 'custom-gradient') {
            if (customGradientColors.length >= 2) {
                const rgb1 = VisualizerCore.hexToRgb(customGradientColors[0]);
                const rgb2 = VisualizerCore.hexToRgb(customGradientColors[1]);
                color1 = `rgba(${rgb1.r}, ${rgb1.g}, ${rgb1.b}, 0.2)`;
                color2 = `rgba(${rgb2.r/3}, ${rgb2.g/3}, ${rgb2.b/3}, 0)`;
            } else {
                const rgb = VisualizerCore.hexToRgb(customGradientColors[0]);
                color1 = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.2)`;
                color2 = `rgba(${rgb.r/3}, ${rgb.g/3}, ${rgb.b/3}, 0)`;
            }
        } else if (colorTheme === 'gradient') {
            color1 = 'rgba(255, 107, 107, 0.2)';
            color2 = 'rgba(134, 117, 169, 0)';
        } else if (colorTheme === 'blue') {
            color1 = 'rgba(18, 194, 233, 0.2)';
            color2 = 'rgba(196, 113, 237, 0)';
        } else if (colorTheme === 'green') {
            color1 = 'rgba(113, 178, 128, 0.2)';
            color2 = 'rgba(19, 78, 94, 0)';
        } else if (colorTheme === 'purple') {
            color1 = 'rgba(142, 45, 226, 0.2)';
            color2 = 'rgba(74, 0, 224, 0)';
        }
        
        bgGradient.addColorStop(0, color1);
        bgGradient.addColorStop(1, color2);
        
        // Draw background
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fillStyle = bgGradient;
        ctx.fill();
        
        // Save the context for clipping
        ctx.save();
        
        // Create a circular clipping region
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.clip();
        
        // Draw kaleidoscope segments
        const segmentAngle = (Math.PI * 2) / segments;
        
        for (let i = 0; i < segments; i++) {
            // Rotate to the current segment
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(i * segmentAngle);
            
            // Draw shapes based on audio data
            const shapesCount = 5;
            
            for (let j = 0; j < shapesCount; j++) {
                // Use different frequency ranges for each shape
                const freqStart = Math.floor((j / shapesCount) * frequencyData.length * 0.7);
                const freqEnd = Math.floor(((j + 1) / shapesCount) * frequencyData.length * 0.7);
                const amplitude = VisualizerCore.getAverageFrequency(frequencyData, freqStart, freqEnd) * sensitivity / 255;
                
                // Skip if amplitude is too low
                if (amplitude < 0.1) continue;
                
                // Calculate shape size based on audio and distance from center
                const distance = innerRadius + (radius - innerRadius) * (j / shapesCount);
                const shapeSize = amplitude * 50 * (1 + j / shapesCount);
                
                // Position with some oscillation
                const angle = time * (0.2 + j * 0.1) + i * 0.3;
                const x = distance * Math.cos(angle);
                const y = distance * Math.sin(angle);
                
                // Determine shape color based on theme and position
                let shapeColor;
                if (colorTheme === 'custom') {
                    const rgb = VisualizerCore.hexToRgb(customColor);
                    shapeColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${0.7 * amplitude})`;
                } else if (colorTheme === 'custom-gradient') {
                    const colorIndex = (i + j) % customGradientColors.length;
                    const rgb = VisualizerCore.hexToRgb(customGradientColors[colorIndex]);
                    shapeColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${0.7 * amplitude})`;
                } else if (colorTheme === 'gradient') {
                    const hue = ((i + j) / (segments + shapesCount)) * 360;
                    shapeColor = `hsla(${hue}, 100%, 60%, ${0.7 * amplitude})`;
                } else if (colorTheme === 'blue') {
                    const hue = 180 + ((i + j) / (segments + shapesCount)) * 60;
                    shapeColor = `hsla(${hue}, 100%, 60%, ${0.7 * amplitude})`;
                } else if (colorTheme === 'green') {
                    const hue = 90 + ((i + j) / (segments + shapesCount)) * 60;
                    shapeColor = `hsla(${hue}, 100%, 60%, ${0.7 * amplitude})`;
                } else if (colorTheme === 'purple') {
                    const hue = 270 + ((i + j) / (segments + shapesCount)) * 60;
                    shapeColor = `hsla(${hue}, 100%, 60%, ${0.7 * amplitude})`;
                }
                
                // Add glow
                ctx.shadowColor = shapeColor;
                ctx.shadowBlur = 10 * amplitude;
                
                // Draw different shape types
                switch (j % 3) {
                    case 0: // Circle
                        ctx.beginPath();
                        ctx.arc(x, y, shapeSize, 0, Math.PI * 2);
                        ctx.fillStyle = shapeColor;
                        ctx.fill();
                        break;
                        
                    case 1: // Triangle
                        ctx.beginPath();
                        const tSize = shapeSize * 1.5;
                        ctx.moveTo(x, y - tSize);
                        ctx.lineTo(x + tSize * 0.866, y + tSize * 0.5); // 0.866 = sqrt(3)/2
                        ctx.lineTo(x - tSize * 0.866, y + tSize * 0.5);
                        ctx.closePath();
                        ctx.fillStyle = shapeColor;
                        ctx.fill();
                        break;
                        
                    case 2: // Square
                        ctx.beginPath();
                        const sSize = shapeSize * 0.8;
                        ctx.rect(x - sSize, y - sSize, sSize * 2, sSize * 2);
                        ctx.fillStyle = shapeColor;
                        ctx.fill();
                        break;
                }
                
                // Reset shadow
                ctx.shadowBlur = 0;
            }
            
            ctx.restore();
        }
        
        // Restore context (remove clipping)
        ctx.restore();
        
        // Draw a pulsing ring around the kaleidoscope
        if (bassLevel > 0.2) {
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.lineWidth = 2 + bassLevel * 10;
            
            // Get ring color based on theme
            let ringColor;
            if (colorTheme === 'custom') {
                const rgb = VisualizerCore.hexToRgb(customColor);
                ringColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${bassLevel * 0.7})`;
            } else if (colorTheme === 'custom-gradient') {
                const rotatingIndex = Math.floor(time * 2) % customGradientColors.length;
                const rgb = VisualizerCore.hexToRgb(customGradientColors[rotatingIndex]);
                ringColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${bassLevel * 0.7})`;
            } else if (colorTheme === 'gradient') {
                const hue = (time * 50) % 360;
                ringColor = `hsla(${hue}, 100%, 70%, ${bassLevel * 0.7})`;
            } else if (colorTheme === 'blue') {
                ringColor = `rgba(18, 194, 233, ${bassLevel * 0.7})`;
            } else if (colorTheme === 'green') {
                ringColor = `rgba(113, 178, 128, ${bassLevel * 0.7})`;
            } else if (colorTheme === 'purple') {
                ringColor = `rgba(142, 45, 226, ${bassLevel * 0.7})`;
            }
            
            ctx.strokeStyle = ringColor;
            ctx.shadowColor = ringColor;
            ctx.shadowBlur = 10;
            ctx.stroke();
            
            // Reset shadow
            ctx.shadowBlur = 0;
        }
    },
    
    // DNA Helix Visualization
    drawDNAHelix(ctx, frequencyData, canvas, sensitivity, colorTheme, customColor, customGradientColors) {
        const width = canvas.width;
        const height = canvas.height;
        
        // Semi-transparent clear for trails
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, width, height);
        
        const centerX = width / 2;
        const time = performance.now() * 0.001;
        
        // Calculate audio levels
        const bassLevel = VisualizerCore.getAverageFrequency(frequencyData, 0, 10) * sensitivity / 255;
        const midLevel = VisualizerCore.getAverageFrequency(frequencyData, 10, 100) * sensitivity / 255;
        
        // DNA parameters
        const helixHeight = height * 0.8;
        const helixWidth = width * 0.3;
        const turns = 4 + bassLevel * 4;
        const points = 100;
        
        // Draw two intertwined helixes
        for (let helix = 0; helix < 2; helix++) {
            ctx.beginPath();
            
            for (let i = 0; i < points; i++) {
                const t = i / points;
                const y = (height - helixHeight) / 2 + t * helixHeight;
                const angle = t * turns * Math.PI * 2 + time + helix * Math.PI;
                const radius = helixWidth * (0.5 + midLevel * 0.3);
                const x = centerX + Math.cos(angle) * radius;
                
                // Vary the line width based on audio
                const lineWidth = 2 + (frequencyData[Math.floor(t * frequencyData.length)] / 255) * sensitivity * 8;
                
                // Draw point
                ctx.beginPath();
                ctx.arc(x, y, lineWidth / 2, 0, Math.PI * 2);
                
                // Color based on theme and helix
                let color;
                if (colorTheme === 'custom') {
                    const rgb = VisualizerCore.hexToRgb(customColor);
                    color = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${0.8})`;
                } else if (colorTheme === 'custom-gradient') {
                    const colorIndex = helix % customGradientColors.length;
                    const rgb = VisualizerCore.hexToRgb(customGradientColors[colorIndex]);
                    color = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${0.8})`;
                } else if (colorTheme === 'gradient') {
                    const hue = helix === 0 ? 120 : 300; // Green and magenta
                    color = `hsla(${hue}, 100%, 60%, 0.8)`;
                } else if (colorTheme === 'blue') {
                    color = helix === 0 ? 'rgba(18, 194, 233, 0.8)' : 'rgba(196, 113, 237, 0.8)';
                } else if (colorTheme === 'green') {
                    color = helix === 0 ? 'rgba(113, 178, 128, 0.8)' : 'rgba(19, 78, 94, 0.8)';
                } else if (colorTheme === 'purple') {
                    color = helix === 0 ? 'rgba(142, 45, 226, 0.8)' : 'rgba(74, 0, 224, 0.8)';
                }
                
                ctx.fillStyle = color;
                ctx.fill();
                
                // Draw connections between helixes
                if (i % 10 === 0) {
                    const otherAngle = angle + Math.PI;
                    const otherX = centerX + Math.cos(otherAngle) * radius;
                    
                    ctx.beginPath();
                    ctx.moveTo(x, y);
                    ctx.lineTo(otherX, y);
                    ctx.strokeStyle = color;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }
    },
    
    // Matrix Rain Visualization
    drawMatrixRain(ctx, frequencyData, canvas, sensitivity, colorTheme, customColor, customGradientColors) {
        const width = canvas.width;
        const height = canvas.height;
        
        // Clear with fade effect
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, width, height);
        
        // Initialize matrix columns if not exists
        if (!this.matrixColumns) {
            this.matrixColumns = [];
            const columnCount = Math.floor(width / 20);
            
            for (let i = 0; i < columnCount; i++) {
                this.matrixColumns.push({
                    x: i * 20,
                    y: Math.random() * height,
                    speed: 2 + Math.random() * 8,
                    chars: []
                });
            }
        }
        
        // Matrix characters
        const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789';
        
        // Calculate audio intensity
        const bassLevel = VisualizerCore.getAverageFrequency(frequencyData, 0, 50) * sensitivity / 255;
        
        // Update and draw columns
        this.matrixColumns.forEach((column, index) => {
            // Speed based on audio
            column.speed = 2 + bassLevel * 10 + Math.random() * 3;
            
            // Move column down
            column.y += column.speed;
            
            // Reset if off screen
            if (column.y > height + 50) {
                column.y = -50 - Math.random() * 500;
                column.chars = [];
            }
            
            // Get color
            let color;
            if (colorTheme === 'custom') {
                const rgb = VisualizerCore.hexToRgb(customColor);
                color = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`;
            } else if (colorTheme === 'custom-gradient') {
                const colorIndex = index % customGradientColors.length;
                const rgb = VisualizerCore.hexToRgb(customGradientColors[colorIndex]);
                color = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`;
            } else {
                color = 'rgba(0, 255, 0, 1)'; // Classic green
            }
            
            // Draw characters in column
            const charHeight = 20;
            const charCount = Math.floor(height / charHeight) + 5;
            
            for (let i = 0; i < charCount; i++) {
                const y = column.y - i * charHeight;
                
                if (y > -charHeight && y < height + charHeight) {
                    // Character opacity decreases with distance from head
                    const opacity = Math.max(0, 1 - i * 0.1);
                    
                    ctx.fillStyle = color.replace('1)', `${opacity})`);
                    ctx.font = `${16 + bassLevel * 8}px monospace`;
                    ctx.fillText(
                        chars[Math.floor(Math.random() * chars.length)],
                        column.x,
                        y
                    );
                }
            }
        });
    },
    
    // Mandala Visualization
    drawMandala(ctx, frequencyData, canvas, sensitivity, colorTheme, customColor, customGradientColors) {
        const width = canvas.width;
        const height = canvas.height;
        
        // Semi-transparent clear
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.fillRect(0, 0, width, height);
        
        const centerX = width / 2;
        const centerY = height / 2;
        const time = performance.now() * 0.001;
        
        // Calculate audio levels
        const bassLevel = VisualizerCore.getAverageFrequency(frequencyData, 0, 10) * sensitivity / 255;
        const midLevel = VisualizerCore.getAverageFrequency(frequencyData, 10, 100) * sensitivity / 255;
        
        // Mandala parameters
        const layers = 8;
        const maxRadius = Math.min(width, height) * 0.4 * (1 + bassLevel * 0.3);
        const petals = 12 + Math.floor(midLevel * 12);
        
        for (let layer = 0; layer < layers; layer++) {
            const layerRadius = (maxRadius / layers) * (layer + 1);
            const layerPetals = petals + layer * 2;
            const rotation = time * (0.1 + layer * 0.05) + layer * Math.PI / 6;
            
            // Get frequency data for this layer
            const freqIndex = Math.floor((layer / layers) * frequencyData.length);
            const amplitude = frequencyData[freqIndex] * sensitivity / 255;
            
            ctx.beginPath();
            
            for (let i = 0; i <= layerPetals; i++) {
                const angle = (i / layerPetals) * Math.PI * 2 + rotation;
                
                // Create petal shape with audio modulation
                const petalRadius = layerRadius * (0.7 + amplitude * 0.5);
                const innerRadius = layerRadius * 0.3;
                
                // Outer point of petal
                const outerX = centerX + Math.cos(angle) * petalRadius;
                const outerY = centerY + Math.sin(angle) * petalRadius;
                
                // Inner points for petal shape
                const leftAngle = angle - Math.PI / layerPetals;
                const rightAngle = angle + Math.PI / layerPetals;
                const leftX = centerX + Math.cos(leftAngle) * innerRadius;
                const leftY = centerY + Math.sin(leftAngle) * innerRadius;
                const rightX = centerX + Math.cos(rightAngle) * innerRadius;
                const rightY = centerY + Math.sin(rightAngle) * innerRadius;
                
                // Draw petal
                if (i === 0) {
                    ctx.moveTo(outerX, outerY);
                } else {
                    ctx.lineTo(outerX, outerY);
                }
                
                // Create curved petal shape
                ctx.quadraticCurveTo(leftX, leftY, centerX, centerY);
                ctx.quadraticCurveTo(rightX, rightY, outerX, outerY);
            }
            
            ctx.closePath();
            
            // Color based on theme and layer
            let color;
            if (colorTheme === 'custom') {
                const rgb = VisualizerCore.hexToRgb(customColor);
                color = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${0.3 + amplitude * 0.4})`;
            } else if (colorTheme === 'custom-gradient') {
                const colorIndex = layer % customGradientColors.length;
                const rgb = VisualizerCore.hexToRgb(customGradientColors[colorIndex]);
                color = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${0.3 + amplitude * 0.4})`;
            } else if (colorTheme === 'gradient') {
                const hue = (layer / layers) * 360;
                color = `hsla(${hue}, 100%, 60%, ${0.3 + amplitude * 0.4})`;
            } else if (colorTheme === 'blue') {
                const hue = 200 + layer * 15;
                color = `hsla(${hue}, 100%, 60%, ${0.3 + amplitude * 0.4})`;
            } else if (colorTheme === 'green') {
                const hue = 100 + layer * 15;
                color = `hsla(${hue}, 100%, 60%, ${0.3 + amplitude * 0.4})`;
            } else if (colorTheme === 'purple') {
                const hue = 280 + layer * 15;
                color = `hsla(${hue}, 100%, 60%, ${0.3 + amplitude * 0.4})`;
            }
            
            ctx.fillStyle = color;
            ctx.fill();
            
            ctx.strokeStyle = color;
            ctx.lineWidth = 1 + amplitude * 3;
            ctx.stroke();
        }
    },
    
    // Neural Network Visualization
    drawNeuralNetwork(ctx, frequencyData, canvas, sensitivity, colorTheme, customColor, customGradientColors) {
        const width = canvas.width;
        const height = canvas.height;
        
        // Clear with fade
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, width, height);
        
        // Initialize network if not exists
        if (!this.networkNodes) {
            this.networkNodes = [];
            const nodeCount = 50;
            
            for (let i = 0; i < nodeCount; i++) {
                this.networkNodes.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: (Math.random() - 0.5) * 2,
                    vy: (Math.random() - 0.5) * 2,
                    connections: [],
                    activity: 0
                });
            }
        }
        
        // Calculate audio levels
        const bassLevel = VisualizerCore.getAverageFrequency(frequencyData, 0, 20) * sensitivity / 255;
        const midLevel = VisualizerCore.getAverageFrequency(frequencyData, 20, 100) * sensitivity / 255;
        
        // Update nodes
        this.networkNodes.forEach((node, index) => {
            // Move nodes slightly
            node.x += node.vx * (0.5 + bassLevel);
            node.y += node.vy * (0.5 + bassLevel);
            
            // Bounce off walls
            if (node.x < 0 || node.x > width) node.vx *= -1;
            if (node.y < 0 || node.y > height) node.vy *= -1;
            
            // Keep in bounds
            node.x = Math.max(0, Math.min(width, node.x));
            node.y = Math.max(0, Math.min(height, node.y));
            
            // Update activity based on audio
            const freqIndex = Math.floor((index / this.networkNodes.length) * frequencyData.length);
            node.activity = frequencyData[freqIndex] * sensitivity / 255;
        });
        
        // Draw connections
        for (let i = 0; i < this.networkNodes.length; i++) {
            const nodeA = this.networkNodes[i];
            
            for (let j = i + 1; j < this.networkNodes.length; j++) {
                const nodeB = this.networkNodes[j];
                const distance = Math.sqrt(
                    Math.pow(nodeA.x - nodeB.x, 2) + Math.pow(nodeA.y - nodeB.y, 2)
                );
                
                // Connect nearby active nodes
                if (distance < 150 && (nodeA.activity > 0.1 || nodeB.activity > 0.1)) {
                    const opacity = Math.max(nodeA.activity, nodeB.activity) * (1 - distance / 150);
                    
                    ctx.beginPath();
                    ctx.moveTo(nodeA.x, nodeA.y);
                    ctx.lineTo(nodeB.x, nodeB.y);
                    
                    // Color based on theme
                    let color;
                    if (colorTheme === 'custom') {
                        const rgb = VisualizerCore.hexToRgb(customColor);
                        color = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
                    } else if (colorTheme === 'custom-gradient') {
                        const colorIndex = i % customGradientColors.length;
                        const rgb = VisualizerCore.hexToRgb(customGradientColors[colorIndex]);
                        color = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
                    } else if (colorTheme === 'gradient') {
                        const hue = (distance / 150) * 120 + 180; // Cyan to blue
                        color = `hsla(${hue}, 100%, 60%, ${opacity})`;
                    } else if (colorTheme === 'blue') {
                        color = `rgba(18, 194, 233, ${opacity})`;
                    } else if (colorTheme === 'green') {
                        color = `rgba(113, 178, 128, ${opacity})`;
                    } else if (colorTheme === 'purple') {
                        color = `rgba(142, 45, 226, ${opacity})`;
                    }
                    
                    ctx.strokeStyle = color;
                    ctx.lineWidth = 1 + nodeA.activity * 3;
                    ctx.stroke();
                }
            }
        }
        
        // Draw nodes
        this.networkNodes.forEach((node, index) => {
            if (node.activity > 0.05) {
                const size = 3 + node.activity * 15;
                
                ctx.beginPath();
                ctx.arc(node.x, node.y, size, 0, Math.PI * 2);
                
                // Color based on theme
                let color;
                if (colorTheme === 'custom') {
                    const rgb = VisualizerCore.hexToRgb(customColor);
                    color = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${node.activity})`;
                } else if (colorTheme === 'custom-gradient') {
                    const colorIndex = index % customGradientColors.length;
                    const rgb = VisualizerCore.hexToRgb(customGradientColors[colorIndex]);
                    color = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${node.activity})`;
                } else if (colorTheme === 'gradient') {
                    const hue = node.activity * 240; // Red to blue based on activity
                    color = `hsla(${hue}, 100%, 60%, ${node.activity})`;
                } else if (colorTheme === 'blue') {
                    color = `rgba(18, 194, 233, ${node.activity})`;
                } else if (colorTheme === 'green') {
                    color = `rgba(113, 178, 128, ${node.activity})`;
                } else if (colorTheme === 'purple') {
                    color = `rgba(142, 45, 226, ${node.activity})`;
                }
                
                ctx.fillStyle = color;
                ctx.fill();
                
                // Add glow effect for high activity
                if (node.activity > 0.7) {
                    ctx.shadowColor = color;
                    ctx.shadowBlur = size;
                    ctx.fill();
                    ctx.shadowBlur = 0;
                }
            }
        });
    },
    
    // Crystalline Visualization
    drawCrystalline(ctx, frequencyData, canvas, sensitivity, colorTheme, customColor, customGradientColors) {
        const width = canvas.width;
        const height = canvas.height;
        
        // Clear with fade
        ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
        ctx.fillRect(0, 0, width, height);
        
        const centerX = width / 2;
        const centerY = height / 2;
        const time = performance.now() * 0.001;
        
        // Calculate audio levels
        const bassLevel = VisualizerCore.getAverageFrequency(frequencyData, 0, 10) * sensitivity / 255;
        const midLevel = VisualizerCore.getAverageFrequency(frequencyData, 10, 100) * sensitivity / 255;
        
        // Crystal parameters
        const crystalCount = 6 + Math.floor(bassLevel * 6);
        const maxRadius = Math.min(width, height) * 0.3 * (1 + bassLevel * 0.5);
        
        for (let crystal = 0; crystal < crystalCount; crystal++) {
            const angle = (crystal / crystalCount) * Math.PI * 2 + time * 0.2;
            const distance = maxRadius * (0.3 + Math.sin(time * 2 + crystal) * 0.2);
            const crystalX = centerX + Math.cos(angle) * distance;
            const crystalY = centerY + Math.sin(angle) * distance;
            
            // Get audio data for this crystal
            const freqIndex = Math.floor((crystal / crystalCount) * frequencyData.length);
            const amplitude = frequencyData[freqIndex] * sensitivity / 255;
            
            // Crystal size based on audio
            const crystalSize = 20 + amplitude * 80;
            const sides = 6; // Hexagonal crystals
            
            // Draw crystal
            ctx.beginPath();
            
            for (let side = 0; side <= sides; side++) {
                const sideAngle = (side / sides) * Math.PI * 2 + time + crystal;
                const sideRadius = crystalSize * (0.8 + Math.sin(time * 3 + side) * 0.2);
                const x = crystalX + Math.cos(sideAngle) * sideRadius;
                const y = crystalY + Math.sin(sideAngle) * sideRadius;
                
                if (side === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            
            ctx.closePath();
            
            // Color based on theme
            let color;
            if (colorTheme === 'custom') {
                const rgb = VisualizerCore.hexToRgb(customColor);
                color = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${0.3 + amplitude * 0.5})`;
            } else if (colorTheme === 'custom-gradient') {
                const colorIndex = crystal % customGradientColors.length;
                const rgb = VisualizerCore.hexToRgb(customGradientColors[colorIndex]);
                color = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${0.3 + amplitude * 0.5})`;
            } else if (colorTheme === 'gradient') {
                const hue = (crystal / crystalCount) * 360;
                color = `hsla(${hue}, 100%, 70%, ${0.3 + amplitude * 0.5})`;
            } else if (colorTheme === 'blue') {
                color = `rgba(18, 194, 233, ${0.3 + amplitude * 0.5})`;
            } else if (colorTheme === 'green') {
                color = `rgba(113, 178, 128, ${0.3 + amplitude * 0.5})`;
            } else if (colorTheme === 'purple') {
                color = `rgba(142, 45, 226, ${0.3 + amplitude * 0.5})`;
            }
            
            ctx.fillStyle = color;
            ctx.fill();
            
            ctx.strokeStyle = color;
            ctx.lineWidth = 2 + amplitude * 4;
            ctx.stroke();
            
            // Add inner glow
            if (amplitude > 0.5) {
                ctx.shadowColor = color;
                ctx.shadowBlur = crystalSize / 2;
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        }
    },
    
    // Plasma Visualization
    drawPlasma(ctx, frequencyData, canvas, sensitivity, colorTheme, customColor, customGradientColors) {
        const width = canvas.width;
        const height = canvas.height;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        const time = performance.now() * 0.001;
        
        // Calculate audio levels
        const bassLevel = VisualizerCore.getAverageFrequency(frequencyData, 0, 20) * sensitivity / 255;
        const midLevel = VisualizerCore.getAverageFrequency(frequencyData, 20, 100) * sensitivity / 255;
        
        // Create image data for pixel manipulation
        const imageData = ctx.createImageData(width, height);
        const data = imageData.data;
        
        // Plasma parameters
        const scale = 0.01 + bassLevel * 0.02;
        const speed = time * (0.5 + midLevel);
        
        for (let x = 0; x < width; x += 2) { // Skip pixels for performance
            for (let y = 0; y < height; y += 2) {
                // Plasma equation
                const plasma = 
                    Math.sin((x * scale) + speed) +
                    Math.sin((y * scale) + speed * 1.5) +
                    Math.sin(((x + y) * scale * 0.5) + speed * 2) +
                    Math.sin((Math.sqrt(x * x + y * y) * scale) + speed * 3);
                
                // Normalize to 0-1
                const normalized = (plasma + 4) / 8;
                
                // Get colors based on theme
                let r, g, b;
                if (colorTheme === 'custom') {
                    const rgb = VisualizerCore.hexToRgb(customColor);
                    r = rgb.r * normalized;
                    g = rgb.g * normalized;
                    b = rgb.b * normalized;
                } else if (colorTheme === 'custom-gradient') {
                    // Cycle through gradient colors based on plasma value
                    const colorIndex = Math.floor(normalized * (customGradientColors.length - 1));
                    const rgb = VisualizerCore.hexToRgb(customGradientColors[colorIndex]);
                    r = rgb.r;
                    g = rgb.g;
                    b = rgb.b;
                } else if (colorTheme === 'gradient') {
                    const hue = normalized * 360;
                    const hsl = this.hslToRgb(hue / 360, 1, 0.5 + normalized * 0.3);
                    r = hsl.r;
                    g = hsl.g;
                    b = hsl.b;
                } else if (colorTheme === 'blue') {
                    r = 18 * normalized;
                    g = 194 * normalized;
                    b = 233;
                } else if (colorTheme === 'green') {
                    r = 19 * normalized;
                    g = 178 * normalized;
                    b = 94 * normalized;
                } else if (colorTheme === 'purple') {
                    r = 142 * normalized;
                    g = 45 * normalized;
                    b = 226;
                }
                
                // Set pixel data (fill 2x2 block for performance)
                for (let dx = 0; dx < 2 && x + dx < width; dx++) {
                    for (let dy = 0; dy < 2 && y + dy < height; dy++) {
                        const index = ((y + dy) * width + (x + dx)) * 4;
                        data[index] = r;     // Red
                        data[index + 1] = g; // Green
                        data[index + 2] = b; // Blue
                        data[index + 3] = 255; // Alpha
                    }
                }
            }
        }
        
        // Draw the image data
        ctx.putImageData(imageData, 0, 0);
    },
    
    // HSL to RGB conversion helper
    hslToRgb(h, s, l) {
        let r, g, b;
        
        if (s === 0) {
            r = g = b = l;
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1/6) return p + (q - p) * 6 * t;
                if (t < 1/2) return q;
                if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            };
            
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }
        
        return {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255)
        };
    },
    
    // Hologram Visualization
    drawHologram(ctx, frequencyData, canvas, sensitivity, colorTheme, customColor, customGradientColors) {
        const width = canvas.width;
        const height = canvas.height;
        
        // Clear with fade
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.fillRect(0, 0, width, height);
        
        const centerX = width / 2;
        const centerY = height / 2;
        const time = performance.now() * 0.001;
        
        // Calculate audio levels
        const bassLevel = VisualizerCore.getAverageFrequency(frequencyData, 0, 20) * sensitivity / 255;
        const midLevel = VisualizerCore.getAverageFrequency(frequencyData, 20, 100) * sensitivity / 255;
        
        // Hologram scan lines
        const scanLineCount = 20 + Math.floor(midLevel * 30);
        const scanLineSpacing = height / scanLineCount;
        
        for (let i = 0; i < scanLineCount; i++) {
            const y = (i * scanLineSpacing + time * 100) % height;
            const opacity = 0.1 + bassLevel * 0.3;
            
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            
            let color;
            if (colorTheme === 'custom') {
                const rgb = VisualizerCore.hexToRgb(customColor);
                color = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
            } else {
                color = `rgba(0, 255, 255, ${opacity})`; // Classic hologram cyan
            }
            
            ctx.strokeStyle = color;
            ctx.lineWidth = 1;
            ctx.stroke();
        }
        
        // Holographic data visualization
        const dataPoints = 50;
        const dataRadius = Math.min(width, height) * 0.3;
        
        ctx.beginPath();
        for (let i = 0; i < dataPoints; i++) {
            const angle = (i / dataPoints) * Math.PI * 2;
            const freqIndex = Math.floor((i / dataPoints) * frequencyData.length);
            const amplitude = frequencyData[freqIndex] * sensitivity / 255;
            
            const radius = dataRadius * (0.5 + amplitude);
            const x = centerX + Math.cos(angle + time) * radius;
            const y = centerY + Math.sin(angle + time) * radius;
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.closePath();
        
        // Hologram style
        let strokeColor;
        if (colorTheme === 'custom') {
            const rgb = VisualizerCore.hexToRgb(customColor);
            strokeColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.8)`;
        } else if (colorTheme === 'custom-gradient') {
            const rgb = VisualizerCore.hexToRgb(customGradientColors[0]);
            strokeColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.8)`;
        } else {
            strokeColor = 'rgba(0, 255, 255, 0.8)';
        }
        
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 2 + bassLevel * 4;
        ctx.stroke();
        
        // Add glow effect
        ctx.shadowColor = strokeColor;
        ctx.shadowBlur = 10 + midLevel * 20;
        ctx.stroke();
        ctx.shadowBlur = 0;
    },
    
    // Fireworks Visualization
    drawFireworks(ctx, frequencyData, canvas, sensitivity, colorTheme, customColor, customGradientColors, particles = []) {
        const width = canvas.width;
        const height = canvas.height;
        
        // Clear with fade
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, width, height);
        
        // Calculate audio levels
        const bassLevel = VisualizerCore.getAverageFrequency(frequencyData, 0, 20) * sensitivity / 255;
        const midLevel = VisualizerCore.getAverageFrequency(frequencyData, 20, 100) * sensitivity / 255;
        
        // Create fireworks based on bass hits
        if (bassLevel > 0.6) {
            const fireworksCount = Math.floor(bassLevel * 3) + 1;
            
            for (let f = 0; f < fireworksCount; f++) {
                const x = Math.random() * width;
                const y = Math.random() * height * 0.7; // Upper 70% of screen
                const particleCount = 20 + Math.floor(midLevel * 30);
                
                // Create explosion particles
                for (let i = 0; i < particleCount; i++) {
                    const angle = (Math.PI * 2 * i) / particleCount;
                    const speed = 2 + Math.random() * 8;
                    
                    particles.push({
                        x: x,
                        y: y,
                        vx: Math.cos(angle) * speed,
                        vy: Math.sin(angle) * speed,
                        size: 2 + Math.random() * 4,
                        life: 60 + Math.random() * 60,
                        maxLife: 60 + Math.random() * 60,
                        color: this.getFireworkColor(colorTheme, customColor, customGradientColors, f),
                        gravity: 0.1
                    });
                }
            }
        }
        
        // Update and draw particles
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            
            // Update physics
            p.x += p.vx;
            p.y += p.vy;
            p.vy += p.gravity; // Gravity
            p.vx *= 0.98; // Air resistance
            p.life--;
            
            // Draw particle
            const opacity = p.life / p.maxLife;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = p.color.replace('1)', `${opacity})`);
            ctx.fill();
            
            // Add trail effect
            if (p.life > p.maxLife * 0.5) {
                ctx.beginPath();
                ctx.arc(p.x - p.vx, p.y - p.vy, p.size * 0.5, 0, Math.PI * 2);
                ctx.fillStyle = p.color.replace('1)', `${opacity * 0.5})`);
                ctx.fill();
            }
            
            // Remove dead particles
            if (p.life <= 0) {
                particles.splice(i, 1);
                i--;
            }
        }
        
        return particles;
    },
    
    // Helper function for firework colors
    getFireworkColor(colorTheme, customColor, customGradientColors, index) {
        if (colorTheme === 'custom') {
            const rgb = VisualizerCore.hexToRgb(customColor);
            return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`;
        } else if (colorTheme === 'custom-gradient') {
            const colorIndex = index % customGradientColors.length;
            const rgb = VisualizerCore.hexToRgb(customGradientColors[colorIndex]);
            return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`;
        } else {
            const colors = [
                'rgba(255, 100, 100, 1)', // Red
                'rgba(100, 255, 100, 1)', // Green
                'rgba(100, 100, 255, 1)', // Blue
                'rgba(255, 255, 100, 1)', // Yellow
                'rgba(255, 100, 255, 1)', // Magenta
                'rgba(100, 255, 255, 1)'  // Cyan
            ];
            return colors[index % colors.length];
        }
    },
    
    // Cyberspace Visualization
    drawCyberspace(ctx, frequencyData, canvas, sensitivity, colorTheme, customColor, customGradientColors) {
        const width = canvas.width;
        const height = canvas.height;
        
        // Clear with fade
        ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
        ctx.fillRect(0, 0, width, height);
        
        const time = performance.now() * 0.001;
        
        // Calculate audio levels
        const bassLevel = VisualizerCore.getAverageFrequency(frequencyData, 0, 20) * sensitivity / 255;
        const midLevel = VisualizerCore.getAverageFrequency(frequencyData, 20, 100) * sensitivity / 255;
        
        // Draw grid perspective effect
        const gridSize = 50;
        const perspectiveY = height * 0.6;
        const vanishingPointX = width / 2;
        
        // Horizontal lines (receding into distance)
        for (let i = 0; i < 20; i++) {
            const y = perspectiveY + i * (gridSize + bassLevel * 20);
            if (y > height) break;
            
            const perspective = 1 - (y - perspectiveY) / (height - perspectiveY);
            const lineWidth = perspective * width * 0.8;
            const startX = vanishingPointX - lineWidth / 2;
            const endX = vanishingPointX + lineWidth / 2;
            
            ctx.beginPath();
            ctx.moveTo(startX, y);
            ctx.lineTo(endX, y);
            
            let color;
            if (colorTheme === 'custom') {
                const rgb = VisualizerCore.hexToRgb(customColor);
                color = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${perspective * 0.5})`;
            } else {
                color = 'rgba(0, 255, 255, ${perspective * 0.5})'; // Cyan grid
            }
            
            ctx.strokeStyle = color;
            ctx.lineWidth = 1;
            ctx.stroke();
        }
        
        // Vertical lines
        const verticalLines = 15;
        for (let i = 0; i < verticalLines; i++) {
            const x = (i / (verticalLines - 1)) * width;
            
            ctx.beginPath();
            ctx.moveTo(x, perspectiveY);
            ctx.lineTo(vanishingPointX, height);
            
            let color;
            if (colorTheme === 'custom') {
                const rgb = VisualizerCore.hexToRgb(customColor);
                color = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.3)`;
            } else {
                color = 'rgba(0, 255, 255, 0.3)';
            }
            
            ctx.strokeStyle = color;
            ctx.lineWidth = 1;
            ctx.stroke();
        }
        
        // Floating data cubes
        const cubeCount = Math.floor(10 + midLevel * 15);
        for (let i = 0; i < cubeCount; i++) {
            const freqIndex = Math.floor((i / cubeCount) * frequencyData.length);
            const amplitude = frequencyData[freqIndex] * sensitivity / 255;
            
            if (amplitude > 0.1) {
                const x = (i / cubeCount) * width;
                const y = perspectiveY - amplitude * 200;
                const size = 10 + amplitude * 30;
                
                // Draw wireframe cube
                ctx.strokeStyle = colorTheme === 'custom' ? 
                    customColor : 'rgba(0, 255, 255, 0.8)';
                ctx.lineWidth = 1 + amplitude * 2;
                
                // Simple cube wireframe
                ctx.strokeRect(x - size/2, y - size/2, size, size);
                ctx.strokeRect(x - size/3, y - size/3, size * 2/3, size * 2/3);
                
                // Connect corners for 3D effect
                ctx.beginPath();
                ctx.moveTo(x - size/2, y - size/2);
                ctx.lineTo(x - size/3, y - size/3);
                ctx.moveTo(x + size/2, y - size/2);
                ctx.lineTo(x + size/3, y - size/3);
                ctx.moveTo(x - size/2, y + size/2);
                ctx.lineTo(x - size/3, y + size/3);
                ctx.moveTo(x + size/2, y + size/2);
                ctx.lineTo(x + size/3, y + size/3);
                ctx.stroke();
            }
        }
    },
    
    // Wormhole Visualization
    drawWormhole(ctx, frequencyData, canvas, sensitivity, colorTheme, customColor, customGradientColors) {
        const width = canvas.width;
        const height = canvas.height;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        const centerX = width / 2;
        const centerY = height / 2;
        const time = performance.now() * 0.001;
        
        // Calculate audio levels
        const bassLevel = VisualizerCore.getAverageFrequency(frequencyData, 0, 20) * sensitivity / 255;
        const midLevel = VisualizerCore.getAverageFrequency(frequencyData, 20, 100) * sensitivity / 255;
        
        // Wormhole parameters
        const maxRadius = Math.min(width, height) * 0.4;
        const rings = 30 + Math.floor(bassLevel * 20);
        const rotation = time * (0.5 + bassLevel);
        
        // Draw wormhole rings
        for (let ring = 0; ring < rings; ring++) {
            const ringProgress = ring / rings;
            const radius = maxRadius * (1 - ringProgress);
            
            if (radius < 5) continue;
            
            // Get audio data for this ring
            const freqIndex = Math.floor(ringProgress * frequencyData.length);
            const amplitude = frequencyData[freqIndex] * sensitivity / 255;
            
            // Ring distortion based on audio
            const segments = 24;
            ctx.beginPath();
            
            for (let segment = 0; segment <= segments; segment++) {
                const angle = (segment / segments) * Math.PI * 2 + rotation * (1 + ringProgress);
                const distortion = amplitude * radius * 0.3;
                const segmentRadius = radius + Math.sin(angle * 3) * distortion;
                
                const x = centerX + Math.cos(angle) * segmentRadius;
                const y = centerY + Math.sin(angle) * segmentRadius;
                
                if (segment === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            
            ctx.closePath();
            
            // Color based on depth and theme
            const depth = 1 - ringProgress;
            let color;
            if (colorTheme === 'custom') {
                const rgb = VisualizerCore.hexToRgb(customColor);
                color = `rgba(${rgb.r * depth}, ${rgb.g * depth}, ${rgb.b * depth}, ${depth * 0.8})`;
            } else if (colorTheme === 'custom-gradient') {
                const colorIndex = Math.floor(ringProgress * (customGradientColors.length - 1));
                const rgb = VisualizerCore.hexToRgb(customGradientColors[colorIndex]);
                color = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${depth * 0.8})`;
            } else if (colorTheme === 'gradient') {
                const hue = ringProgress * 360;
                color = `hsla(${hue}, 100%, ${30 + depth * 40}%, ${depth * 0.8})`;
            } else if (colorTheme === 'blue') {
                color = `rgba(18, 194, 233, ${depth * 0.8})`;
            } else if (colorTheme === 'green') {
                color = `rgba(113, 178, 128, ${depth * 0.8})`;
            } else if (colorTheme === 'purple') {
                color = `rgba(142, 45, 226, ${depth * 0.8})`;
            }
            
            ctx.strokeStyle = color;
            ctx.lineWidth = 1 + amplitude * 5;
            ctx.stroke();
            
            // Add glow for intense audio
            if (amplitude > 0.7) {
                ctx.shadowColor = color;
                ctx.shadowBlur = 10;
                ctx.stroke();
                ctx.shadowBlur = 0;
            }
        }
        
        // Draw event horizon (center)
        const horizonRadius = 10 + bassLevel * 20;
        const horizonGradient = ctx.createRadialGradient(
            centerX, centerY, 0,
            centerX, centerY, horizonRadius
        );
        
        if (colorTheme === 'custom') {
            const rgb = VisualizerCore.hexToRgb(customColor);
            horizonGradient.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`);
            horizonGradient.addColorStop(1, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0)`);
        } else {
            horizonGradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
            horizonGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        }
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, horizonRadius, 0, Math.PI * 2);
        ctx.fillStyle = horizonGradient;
        ctx.fill();
    }
};

export default AdvancedVisualizers;