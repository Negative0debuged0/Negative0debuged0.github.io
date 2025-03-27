// Waveform-based visualizations
import VisualizerCore from './visualizer-core.js';

const WaveformVisualizers = {
    // Oscilloscope visualization
    drawOscilloscope(ctx, timeData, canvas, sensitivity, colorTheme, customColor) {
        const width = canvas.width;
        const height = canvas.height;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        const centerY = height / 2;
        const sliceWidth = width / timeData.length;
        
        // Create gradient for waveform
        let gradient;
        if (colorTheme === 'custom') {
            const rgb = VisualizerCore.hexToRgb(customColor);
            gradient = ctx.createLinearGradient(0, centerY - 50, 0, centerY + 50);
            gradient.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.8)`);
            gradient.addColorStop(0.5, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`);
            gradient.addColorStop(1, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.8)`);
        } else if (colorTheme === 'gradient') {
            gradient = ctx.createLinearGradient(0, 0, width, 0);
            gradient.addColorStop(0, 'rgba(255, 107, 107, 1)');
            gradient.addColorStop(0.25, 'rgba(78, 205, 196, 1)');
            gradient.addColorStop(0.5, 'rgba(134, 117, 169, 1)');
            gradient.addColorStop(0.75, 'rgba(255, 190, 11, 1)');
            gradient.addColorStop(1, 'rgba(255, 107, 107, 1)');
        } else if (colorTheme === 'blue') {
            gradient = ctx.createLinearGradient(0, 0, width, 0);
            gradient.addColorStop(0, 'rgba(18, 194, 233, 1)');
            gradient.addColorStop(0.5, 'rgba(196, 113, 237, 1)');
            gradient.addColorStop(1, 'rgba(246, 79, 89, 1)');
        } else if (colorTheme === 'green') {
            gradient = ctx.createLinearGradient(0, 0, width, 0);
            gradient.addColorStop(0, 'rgba(19, 78, 94, 1)');
            gradient.addColorStop(1, 'rgba(113, 178, 128, 1)');
        } else if (colorTheme === 'purple') {
            gradient = ctx.createLinearGradient(0, 0, width, 0);
            gradient.addColorStop(0, 'rgba(142, 45, 226, 1)');
            gradient.addColorStop(1, 'rgba(74, 0, 224, 1)');
        }
        
        // Draw oscilloscope line
        ctx.beginPath();
        
        for (let i = 0; i < timeData.length; i++) {
            // Convert audio data value (0-255) to y-coordinate
            // Apply sensitivity to increase/decrease amplitude
            const audioValue = timeData[i] / 128.0 - 1; // Range: -1 to 1
            const y = centerY + (audioValue * centerY * sensitivity);
            
            if (i === 0) {
                ctx.moveTo(0, y);
            } else {
                ctx.lineTo(i * sliceWidth, y);
            }
        }
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Add oscilloscope grid
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        
        // Horizontal center line
        ctx.beginPath();
        ctx.moveTo(0, centerY);
        ctx.lineTo(width, centerY);
        ctx.stroke();
        
        // Vertical lines
        const verticalLines = 10;
        for (let i = 1; i < verticalLines; i++) {
            const x = (width / verticalLines) * i;
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }
        
        // Horizontal amplitude lines
        const amplitudeLines = 4;
        for (let i = 1; i <= amplitudeLines; i++) {
            const y1 = centerY - (height / (amplitudeLines * 2)) * i;
            const y2 = centerY + (height / (amplitudeLines * 2)) * i;
            
            ctx.beginPath();
            ctx.moveTo(0, y1);
            ctx.lineTo(width, y1);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(0, y2);
            ctx.lineTo(width, y2);
            ctx.stroke();
        }
    },
    
    // Waveform visualization
    drawWaveform(ctx, timeData, frequencyData, canvas, sensitivity, colorTheme, customColor) {
        const width = canvas.width;
        const height = canvas.height;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Draw background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillRect(0, 0, width, height);
        
        // Calculate audio levels for modulation
        const bassLevel = VisualizerCore.getAverageFrequency(frequencyData, 0, 10) * sensitivity / 255;
        
        // Determine colors based on theme
        let waveColor, fillColor;
        if (colorTheme === 'custom') {
            const rgb = VisualizerCore.hexToRgb(customColor);
            waveColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`;
            fillColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.2)`;
        } else if (colorTheme === 'gradient') {
            waveColor = 'rgb(255, 107, 107)';
            fillColor = 'rgba(255, 107, 107, 0.2)';
        } else if (colorTheme === 'blue') {
            waveColor = 'rgb(18, 194, 233)';
            fillColor = 'rgba(18, 194, 233, 0.2)';
        } else if (colorTheme === 'green') {
            waveColor = 'rgb(113, 178, 128)';
            fillColor = 'rgba(113, 178, 128, 0.2)';
        } else if (colorTheme === 'purple') {
            waveColor = 'rgb(142, 45, 226)';
            fillColor = 'rgba(142, 45, 226, 0.2)';
        }
        
        // Draw multiple offset waveforms
        const offsetLayers = 3;
        const centerY = height / 2;
        
        for (let layer = 0; layer < offsetLayers; layer++) {
            // Calculate layer offset
            const offset = 5 + layer * 5 + (bassLevel * 10);
            
            // Draw top wave
            ctx.beginPath();
            
            const sliceWidth = width / timeData.length;
            
            for (let i = 0; i < timeData.length; i++) {
                const audioValue = (timeData[i] / 128.0 - 1) * sensitivity;
                const y = centerY - offset + (audioValue * centerY * 0.7);
                
                if (i === 0) {
                    ctx.moveTo(0, y);
                } else {
                    // Use quadratic curves for smoother terrain
                    const prevX = (i - 1) * sliceWidth;
                    const prevValue = (timeData[i - 1] / 128.0 - 1) * sensitivity;
                    const prevY = centerY - offset + (prevValue * centerY * 0.7);
                    
                    const cpX = (prevX + i * sliceWidth) / 2;
                    ctx.quadraticCurveTo(cpX, prevY, i * sliceWidth, y);
                }
            }
            
            // Complete waveform to create shape for filling
            ctx.lineTo(width, centerY - offset);
            ctx.lineTo(0, centerY - offset);
            ctx.closePath();
            
            // Fill with transparent color
            ctx.fillStyle = fillColor;
            ctx.fill();
            
            // Draw stroke
            ctx.strokeStyle = waveColor;
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // Draw bottom wave (mirror of top)
            ctx.beginPath();
            
            for (let i = 0; i < timeData.length; i++) {
                const audioValue = (timeData[i] / 128.0 - 1) * sensitivity;
                const y = centerY + offset - (audioValue * centerY * 0.7);
                
                if (i === 0) {
                    ctx.moveTo(0, y);
                } else {
                    ctx.lineTo(i * sliceWidth, y);
                }
            }
            
            // Complete waveform to create shape for filling
            ctx.lineTo(width, centerY + offset);
            ctx.lineTo(0, centerY + offset);
            ctx.closePath();
            
            // Fill with transparent color
            ctx.fillStyle = fillColor;
            ctx.fill();
            
            // Draw stroke
            ctx.strokeStyle = waveColor;
            ctx.lineWidth = 2;
            ctx.stroke();
        }
        
        // Draw center line
        ctx.beginPath();
        ctx.moveTo(0, centerY);
        ctx.lineTo(width, centerY);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1;
        ctx.stroke();
    },
    
    // Terrain visualization
    drawTerrain(ctx, frequencyData, canvas, sensitivity, colorTheme, customColor) {
        const width = canvas.width;
        const height = canvas.height;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Draw sky background
        let gradientSky;
        if (colorTheme === 'custom') {
            const rgb = VisualizerCore.hexToRgb(customColor);
            gradientSky = ctx.createLinearGradient(0, 0, 0, height * 0.6);
            gradientSky.addColorStop(0, `rgba(${rgb.r/4}, ${rgb.g/4}, ${rgb.b/4}, 1)`);
            gradientSky.addColorStop(1, `rgba(${rgb.r/2}, ${rgb.g/2}, ${rgb.b/2}, 1)`);
        } else if (colorTheme === 'gradient') {
            gradientSky = ctx.createLinearGradient(0, 0, 0, height * 0.6);
            gradientSky.addColorStop(0, 'rgba(20, 20, 50, 1)');
            gradientSky.addColorStop(1, 'rgba(100, 50, 100, 1)');
        } else if (colorTheme === 'blue') {
            gradientSky = ctx.createLinearGradient(0, 0, 0, height * 0.6);
            gradientSky.addColorStop(0, 'rgba(10, 10, 50, 1)');
            gradientSky.addColorStop(1, 'rgba(18, 94, 233, 1)');
        } else if (colorTheme === 'green') {
            gradientSky = ctx.createLinearGradient(0, 0, 0, height * 0.6);
            gradientSky.addColorStop(0, 'rgba(10, 30, 10, 1)');
            gradientSky.addColorStop(1, 'rgba(19, 78, 54, 1)');
        } else if (colorTheme === 'purple') {
            gradientSky = ctx.createLinearGradient(0, 0, 0, height * 0.6);
            gradientSky.addColorStop(0, 'rgba(20, 0, 50, 1)');
            gradientSky.addColorStop(1, 'rgba(74, 0, 174, 1)');
        }
        
        ctx.fillStyle = gradientSky;
        ctx.fillRect(0, 0, width, height);
        
        // Draw stars in the sky
        for (let i = 0; i < 50; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height * 0.6;
            const radius = Math.random() * 1.5 + 0.5;
            const opacity = Math.random() * 0.8 + 0.2;
            
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
            ctx.fill();
        }
        
        // Draw multiple terrain layers
        const layers = 3;
        const baseHeight = height * 0.6;
        const layerHeight = height * 0.4 / layers;
        
        for (let layer = 0; layer < layers; layer++) {
            // Use different part of frequency data for each layer
            const layerFreqStart = Math.floor(frequencyData.length * layer / layers);
            const layerFreqEnd = Math.floor(frequencyData.length * (layer + 1) / layers);
            const layerFreqData = frequencyData.slice(layerFreqStart, layerFreqEnd);
            
            // Create terrain path
            ctx.beginPath();
            
            // Start at left edge
            ctx.moveTo(0, height);
            
            // Draw terrain line
            const segmentWidth = width / layerFreqData.length;
            
            for (let i = 0; i < layerFreqData.length; i++) {
                const value = layerFreqData[i] * sensitivity / 255;
                const x = i * segmentWidth;
                const y = baseHeight + (layer * layerHeight) - (value * layerHeight * 2);
                
                if (i === 0) {
                    ctx.lineTo(x, y);
                } else {
                    // Use quadratic curves for smoother terrain
                    const prevX = (i - 1) * segmentWidth;
                    const prevValue = layerFreqData[i - 1] * sensitivity / 255;
                    const prevY = baseHeight + (layer * layerHeight) - (prevValue * layerHeight * 2);
                    
                    const cpX = (prevX + x) / 2;
                    ctx.quadraticCurveTo(cpX, prevY, x, y);
                }
            }
            
            // Complete the path
            ctx.lineTo(width, height);
            ctx.closePath();
            
            // Fill with gradient based on theme and layer
            let terrainGradient;
            if (colorTheme === 'custom') {
                const rgb = VisualizerCore.hexToRgb(customColor);
                const layerFactor = (layers - layer) / layers;
                
                terrainGradient = ctx.createLinearGradient(0, baseHeight, 0, height);
                terrainGradient.addColorStop(0, `rgba(${rgb.r * layerFactor}, ${rgb.g * layerFactor}, ${rgb.b * layerFactor}, 1)`);
                terrainGradient.addColorStop(1, `rgba(${rgb.r * layerFactor * 0.5}, ${rgb.g * layerFactor * 0.5}, ${rgb.b * layerFactor * 0.5}, 1)`);
            } else if (colorTheme === 'gradient') {
                terrainGradient = ctx.createLinearGradient(0, baseHeight, 0, height);
                if (layer === 0) {
                    terrainGradient.addColorStop(0, 'rgba(255, 107, 107, 1)');
                    terrainGradient.addColorStop(1, 'rgba(200, 80, 80, 1)');
                } else if (layer === 1) {
                    terrainGradient.addColorStop(0, 'rgba(78, 205, 196, 1)');
                    terrainGradient.addColorStop(1, 'rgba(50, 180, 170, 1)');
                } else {
                    terrainGradient.addColorStop(0, 'rgba(134, 117, 169, 1)');
                    terrainGradient.addColorStop(1, 'rgba(100, 90, 130, 1)');
                }
            } else if (colorTheme === 'blue') {
                terrainGradient = ctx.createLinearGradient(0, baseHeight, 0, height);
                terrainGradient.addColorStop(0, `rgba(18, 194, 233, ${1 - layer * 0.2})`);
                terrainGradient.addColorStop(1, `rgba(18, 144, 233, ${1 - layer * 0.2})`);
            } else if (colorTheme === 'green') {
                terrainGradient = ctx.createLinearGradient(0, baseHeight, 0, height);
                terrainGradient.addColorStop(0, `rgba(113, 178, 128, ${1 - layer * 0.2})`);
                terrainGradient.addColorStop(1, `rgba(80, 130, 90, ${1 - layer * 0.2})`);
            } else if (colorTheme === 'purple') {
                terrainGradient = ctx.createLinearGradient(0, baseHeight, 0, height);
                terrainGradient.addColorStop(0, `rgba(142, 45, 226, ${1 - layer * 0.2})`);
                terrainGradient.addColorStop(1, `rgba(100, 30, 170, ${1 - layer * 0.2})`);
            }
            
            ctx.fillStyle = terrainGradient;
            ctx.fill();
            
            // Add grid lines for effect
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 - layer * 0.03})`;
            ctx.lineWidth = 1;
            ctx.stroke();
        }
    },
    
    // Fountain visualization
    drawFountain(ctx, frequencyData, canvas, sensitivity, colorTheme, customColor, particles = []) {
        const width = canvas.width;
        const height = canvas.height;
        
        // Clear canvas with fade effect
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, width, height);
        
        // Calculate bass for fountain intensity
        const bassLevel = VisualizerCore.getAverageFrequency(frequencyData, 0, 10) * sensitivity / 255;
        const midLevel = VisualizerCore.getAverageFrequency(frequencyData, 10, 100) * sensitivity / 255;
        
        // Fountain source position
        const fountainX = width / 2;
        const fountainY = height * 0.8;
        
        // Create new particles based on audio intensity
        const particlesToCreate = Math.floor(bassLevel * 10) + 1;
        
        for (let i = 0; i < particlesToCreate; i++) {
            // Calculate initial velocity based on audio
            const speed = 7 + bassLevel * 15;
            const angle = Math.PI / 2 - (Math.random() * Math.PI / 4) + (Math.random() * Math.PI / 4);
            
            // Create particle
            const particle = {
                x: fountainX + (Math.random() * 30 - 15),
                y: fountainY,
                vx: Math.cos(angle) * speed * (0.7 + Math.random() * 0.6),
                vy: -Math.sin(angle) * speed * (0.7 + Math.random() * 0.6),
                size: 3 + Math.random() * 4 * (bassLevel + 0.5),
                life: 100 + Math.random() * 50,
                hue: 0, // Will be set based on color theme
                gravity: 0.2 + midLevel * 0.3
            };
            
            // Set color based on theme
            if (colorTheme === 'custom') {
                particle.color = customColor;
            } else if (colorTheme === 'gradient') {
                particle.hue = Math.random() * 360;
            } else if (colorTheme === 'blue') {
                particle.hue = 180 + Math.random() * 60;
            } else if (colorTheme === 'green') {
                particle.hue = 90 + Math.random() * 60;
            } else if (colorTheme === 'purple') {
                particle.hue = 270 + Math.random() * 60;
            }
            
            particles.push(particle);
        }
        
        // Draw water base
        const waterGradient = ctx.createLinearGradient(0, height * 0.8, 0, height);
        
        if (colorTheme === 'custom') {
            const rgb = VisualizerCore.hexToRgb(customColor);
            waterGradient.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.7)`);
            waterGradient.addColorStop(1, `rgba(${rgb.r * 0.5}, ${rgb.g * 0.5}, ${rgb.b * 0.5}, 0.4)`);
        } else if (colorTheme === 'gradient') {
            waterGradient.addColorStop(0, 'rgba(78, 205, 196, 0.7)');
            waterGradient.addColorStop(1, 'rgba(78, 205, 196, 0.4)');
        } else if (colorTheme === 'blue') {
            waterGradient.addColorStop(0, 'rgba(18, 194, 233, 0.7)');
            waterGradient.addColorStop(1, 'rgba(18, 194, 233, 0.4)');
        } else if (colorTheme === 'green') {
            waterGradient.addColorStop(0, 'rgba(113, 178, 128, 0.7)');
            waterGradient.addColorStop(1, 'rgba(113, 178, 128, 0.4)');
        } else if (colorTheme === 'purple') {
            waterGradient.addColorStop(0, 'rgba(142, 45, 226, 0.7)');
            waterGradient.addColorStop(1, 'rgba(142, 45, 226, 0.4)');
        }
        
        // Draw water waves
        const waveHeight = 5 + bassLevel * 10;
        const waveCount = 5;
        const waveSegments = 10;
        const time = performance.now() * 0.001;
        
        ctx.beginPath();
        ctx.moveTo(0, height);
        
        for (let wave = 0; wave < waveCount; wave++) {
            const baseY = height - (waveHeight * (waveCount - wave)) + (Math.sin(time * 2) * waveHeight * 0.3);
            
            for (let i = 0; i <= waveSegments; i++) {
                const x = (width / waveSegments) * i;
                const waveOffset = Math.sin(i / 2 + time * 3 + wave) * waveHeight;
                const y = baseY + waveOffset;
                
                if (i === 0 && wave === 0) {
                    ctx.lineTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
        }
        
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.fillStyle = waterGradient;
        ctx.fill();
        
        // Update and draw particles
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            
            // Update position
            p.x += p.vx;
            p.y += p.vy;
            
            // Apply gravity
            p.vy += p.gravity;
            
            // Apply drag
            p.vx *= 0.99;
            
            // Update life
            p.life--;
            
            // Calculate opacity based on life
            const opacity = p.life / 100;
            
            // Draw particle
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            
            if (colorTheme === 'custom') {
                const rgb = VisualizerCore.hexToRgb(p.color);
                ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
            } else {
                ctx.fillStyle = `hsla(${p.hue}, 100%, 70%, ${opacity})`;
            }
            
            ctx.fill();
            
            // Remove dead particles or those below water level
            if (p.life <= 0 || p.y > height * 0.8) {
                // Create a splash effect for particles hitting water
                if (p.y > height * 0.8 && p.vy > 1) {
                    for (let j = 0; j < 3; j++) {
                        const splashP = {
                            x: p.x,
                            y: height * 0.8,
                            vx: (Math.random() * 2 - 1) * 3,
                            vy: -Math.random() * 2 - 1,
                            size: p.size * 0.5,
                            life: 30 + Math.random() * 20,
                            hue: p.hue,
                            color: p.color,
                            gravity: p.gravity * 0.5
                        };
                        particles.push(splashP);
                    }
                }
                
                particles.splice(i, 1);
                i--;
            }
        }
        
        // Add glow to fountain source
        const glow = ctx.createRadialGradient(
            fountainX, fountainY, 0,
            fountainX, fountainY, 40 + bassLevel * 30
        );
        
        if (colorTheme === 'custom') {
            const rgb = VisualizerCore.hexToRgb(customColor);
            glow.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.5)`);
            glow.addColorStop(1, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0)`);
        } else if (colorTheme === 'gradient') {
            glow.addColorStop(0, 'rgba(255, 255, 255, 0.5)');
            glow.addColorStop(1, 'rgba(255, 255, 255, 0)');
        } else if (colorTheme === 'blue') {
            glow.addColorStop(0, 'rgba(18, 194, 233, 0.5)');
            glow.addColorStop(1, 'rgba(18, 194, 233, 0)');
        } else if (colorTheme === 'green') {
            glow.addColorStop(0, 'rgba(113, 178, 128, 0.5)');
            glow.addColorStop(1, 'rgba(113, 178, 128, 0)');
        } else if (colorTheme === 'purple') {
            glow.addColorStop(0, 'rgba(142, 45, 226, 0.5)');
            glow.addColorStop(1, 'rgba(142, 45, 226, 0)');
        }
        
        ctx.beginPath();
        ctx.arc(fountainX, fountainY, 40 + bassLevel * 30, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();
        
        return particles;
    },
    
    // Rings visualization
    drawRings(ctx, frequencyData, canvas, sensitivity, colorTheme, customColor) {
        const width = canvas.width;
        const height = canvas.height;
        
        // Clear canvas with semi-transparency for trails
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.fillRect(0, 0, width, height);
        
        const centerX = width / 2;
        const centerY = height / 2;
        
        // Group frequency data into bands
        const bands = 8;
        const bandValues = [];
        
        for (let i = 0; i < bands; i++) {
            const startIndex = Math.floor(i * frequencyData.length / bands);
            const endIndex = Math.floor((i + 1) * frequencyData.length / bands);
            
            let sum = 0;
            for (let j = startIndex; j < endIndex; j++) {
                sum += frequencyData[j];
            }
            
            const average = sum / (endIndex - startIndex);
            bandValues.push(average * sensitivity / 255);
        }
        
        // Calculate max radius for the outermost ring
        const maxRadius = Math.min(width, height) * 0.4;
        
        // Draw concentric rings for each frequency band
        for (let i = 0; i < bands; i++) {
            const value = bandValues[i];
            const baseRadius = (maxRadius / bands) * (i + 1);
            const ringThickness = Math.max(2, value * 10);
            
            // Ring radius varies with the audio level
            const radius = baseRadius + (value * maxRadius * 0.1);
            
            // Determine color based on theme
            let ringColor;
            if (colorTheme === 'custom') {
                const rgb = VisualizerCore.hexToRgb(customColor);
                ringColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`;
            } else if (colorTheme === 'gradient') {
                const hue = (i / bands) * 360;
                ringColor = `hsla(${hue}, 100%, ${50 + value * 30}%, ${0.7 + value * 0.3})`;
            } else if (colorTheme === 'blue') {
                const hue = 190 + (i / bands) * 60; // 190-250 (blue to purple)
                ringColor = `hsla(${hue}, 100%, ${50 + value * 30}%, ${0.7 + value * 0.3})`;
            } else if (colorTheme === 'green') {
                const hue = 90 + (i / bands) * 60; // 90-150 (green to teal)
                ringColor = `hsla(${hue}, 100%, ${50 + value * 30}%, ${0.7 + value * 0.3})`;
            } else if (colorTheme === 'purple') {
                const hue = 250 + (i / bands) * 60; // 250-310 (purple to pink)
                ringColor = `hsla(${hue}, 100%, ${50 + value * 30}%, ${0.7 + value * 0.3})`;
            }
            
            // Draw the ring
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.lineWidth = ringThickness;
            ctx.strokeStyle = ringColor;
            ctx.stroke();
            
            // Add distortions to rings based on high frequencies
            if (i > 4) { // Only for higher frequency bands
                const segments = 12;
                const angleStep = (Math.PI * 2) / segments;
                
                ctx.beginPath();
                
                for (let s = 0; s < segments; s++) {
                    const angle = s * angleStep;
                    const distortionAmount = value * 20; // Distortion based on audio level
                    
                    // Add randomness to distortion
                    const randomDist = (Math.random() - 0.5) * distortionAmount;
                    const distRadius = radius + randomDist;
                    
                    const x = centerX + Math.cos(angle) * distRadius;
                    const y = centerY + Math.sin(angle) * distRadius;
                    
                    if (s === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                }
                
                ctx.closePath();
                ctx.lineWidth = 1;
                ctx.strokeStyle = ringColor;
                ctx.stroke();
            }
        }
        
        // Draw center circle
        const pulseSize = 20 + (bandValues[0] * 30);
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, pulseSize, 0, Math.PI * 2);
        
        // Center gradient
        const centerGradient = ctx.createRadialGradient(
            centerX, centerY, 0,
            centerX, centerY, pulseSize
        );
        
        if (colorTheme === 'custom') {
            const rgb = VisualizerCore.hexToRgb(customColor);
            centerGradient.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`);
            centerGradient.addColorStop(1, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1)`);
        } else if (colorTheme === 'gradient') {
            centerGradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
            centerGradient.addColorStop(1, 'rgba(255, 107, 107, 0.1)');
        } else if (colorTheme === 'blue') {
            centerGradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
            centerGradient.addColorStop(1, 'rgba(18, 194, 233, 0.1)');
        } else if (colorTheme === 'green') {
            centerGradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
            centerGradient.addColorStop(1, 'rgba(113, 178, 128, 0.1)');
        } else if (colorTheme === 'purple') {
            centerGradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
            centerGradient.addColorStop(1, 'rgba(142, 45, 226, 0.1)');
        }
        
        ctx.fillStyle = centerGradient;
        ctx.fill();
    }
};

export default WaveformVisualizers;