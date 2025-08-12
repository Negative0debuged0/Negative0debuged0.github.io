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
    },
    
    // Aurora visualization
    drawAurora(ctx, frequencyData, canvas, sensitivity, colorTheme, customColor, customGradientColors) {
        const width = canvas.width;
        const height = canvas.height;
        
        // Semi-transparent clear for trails
        ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
        ctx.fillRect(0, 0, width, height);
        
        // Calculate audio levels
        const bassLevel = VisualizerCore.getAverageFrequency(frequencyData, 0, 10) * sensitivity / 255;
        const midLevel = VisualizerCore.getAverageFrequency(frequencyData, 10, 100) * sensitivity / 255;
        
        // Animation time
        const time = performance.now() * 0.001;
        
        // Aurora parameters
        const layers = 5; // Number of aurora bands
        const points = 100; // Resolution of each band
        
        // Draw sky background with stars
        ctx.fillStyle = 'rgb(5, 8, 22)';
        ctx.fillRect(0, 0, width, height);
        
        // Draw stars
        for (let i = 0; i < 100; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height * 0.7;
            const size = Math.random() * 2 + 0.5;
            const brightness = Math.random() * 0.7 + 0.3;
            
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${brightness})`;
            ctx.fill();
        }
        
        // Draw aurora layers from back to front
        for (let layer = 0; layer < layers; layer++) {
            // Each layer gets data from different frequency ranges
            const freqStart = Math.floor((layer / layers) * frequencyData.length * 0.8);
            const freqEnd = Math.floor(((layer + 1) / layers) * frequencyData.length * 0.8);
            
            // Create aurora path
            ctx.beginPath();
            
            // Start at bottom left
            ctx.moveTo(0, height);
            
            // Get layer intensity
            const layerAmplitude = VisualizerCore.getAverageFrequency(frequencyData, freqStart, freqEnd) * sensitivity / 255;
            
            // Base Y position for this layer (higher layers are higher in the sky)
            const baseY = height * 0.4 + (height * 0.3 * layer / (layers - 1));
            
            // Draw aurora wave
            for (let i = 0; i <= points; i++) {
                const x = (width / points) * i;
                const xOffset = (i / points) * 10 + layer * 5; // Offset for wave calculation
                
                // Create wave with multiple sine components for organic look
                // Scale with audio level
                const wave = 
                    Math.sin(xOffset + time * (0.5 + layer * 0.1)) * 30 * (1 + layerAmplitude * 2) +
                    Math.sin(xOffset * 2 + time * 0.7) * 15 * (1 + layerAmplitude) +
                    Math.sin(xOffset * 0.5 - time * 0.3) * 10 * (1 + bassLevel);
                
                // Y position with wave
                const y = baseY + wave;
                
                ctx.lineTo(x, y);
            }
            
            // Complete the path (bottom right to bottom left)
            ctx.lineTo(width, height);
            ctx.lineTo(0, height);
            
            // Get colors based on theme
            let gradient;
            
            if (colorTheme === 'custom') {
                const rgb = VisualizerCore.hexToRgb(customColor);
                gradient = ctx.createLinearGradient(0, baseY - 50, 0, height);
                gradient.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${0.1 + layerAmplitude * 0.3})`);
                gradient.addColorStop(0.5, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${0.05 + layerAmplitude * 0.2})`);
                gradient.addColorStop(1, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0)`);
            } else if (colorTheme === 'custom-gradient') {
                const colorIndex = layer % customGradientColors.length;
                const rgb = VisualizerCore.hexToRgb(customGradientColors[colorIndex]);
                gradient = ctx.createLinearGradient(0, baseY - 50, 0, height);
                gradient.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${0.1 + layerAmplitude * 0.3})`);
                gradient.addColorStop(0.5, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${0.05 + layerAmplitude * 0.2})`);
                gradient.addColorStop(1, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0)`);
            } else if (colorTheme === 'gradient') {
                const hue1 = (layer / layers) * 180 + 180; // 180-360 (cyan to magenta)
                const hue2 = ((layer + 1) / layers) * 180 + 180;
                gradient = ctx.createLinearGradient(0, baseY - 50, 0, height);
                gradient.addColorStop(0, `hsla(${hue1}, 100%, 70%, ${0.1 + layerAmplitude * 0.3})`);
                gradient.addColorStop(0.5, `hsla(${hue2}, 100%, 60%, ${0.05 + layerAmplitude * 0.2})`);
                gradient.addColorStop(1, `hsla(${hue2}, 100%, 60%, 0)`);
            } else if (colorTheme === 'blue') {
                const hue = 180 + layer * 10;
                gradient = ctx.createLinearGradient(0, baseY - 50, 0, height);
                gradient.addColorStop(0, `hsla(${hue}, 100%, 70%, ${0.1 + layerAmplitude * 0.3})`);
                gradient.addColorStop(0.5, `hsla(${hue + 10}, 100%, 60%, ${0.05 + layerAmplitude * 0.2})`);
                gradient.addColorStop(1, `hsla(${hue + 20}, 100%, 60%, 0)`);
            } else if (colorTheme === 'green') {
                const hue = 120 + layer * 10;
                gradient = ctx.createLinearGradient(0, baseY - 50, 0, height);
                gradient.addColorStop(0, `hsla(${hue}, 100%, 70%, ${0.1 + layerAmplitude * 0.3})`);
                gradient.addColorStop(0.5, `hsla(${hue - 10}, 100%, 60%, ${0.05 + layerAmplitude * 0.2})`);
                gradient.addColorStop(1, `hsla(${hue - 20}, 100%, 60%, 0)`);
            } else if (colorTheme === 'purple') {
                const hue = 270 + layer * 10;
                gradient = ctx.createLinearGradient(0, baseY - 50, 0, height);
                gradient.addColorStop(0, `hsla(${hue}, 100%, 70%, ${0.1 + layerAmplitude * 0.3})`);
                gradient.addColorStop(0.5, `hsla(${hue + 10}, 100%, 60%, ${0.05 + layerAmplitude * 0.2})`);
                gradient.addColorStop(1, `hsla(${hue + 20}, 100%, 60%, 0)`);
            }
            
            // Apply gradient fill
            ctx.fillStyle = gradient;
            ctx.fill();
            
            // Add lines on top for the aurora effect
            ctx.beginPath();
            for (let i = 0; i <= points; i++) {
                const x = (width / points) * i;
                const xOffset = (i / points) * 10 + layer * 5;
                
                const wave = 
                    Math.sin(xOffset + time * (0.5 + layer * 0.1)) * 30 * (1 + layerAmplitude * 2) +
                    Math.sin(xOffset * 2 + time * 0.7) * 15 * (1 + layerAmplitude) +
                    Math.sin(xOffset * 0.5 - time * 0.3) * 10 * (1 + bassLevel);
                
                const y = baseY + wave;
                
                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            
            // Style and draw the line
            ctx.lineWidth = 2 + layerAmplitude * 5;
            
            if (colorTheme === 'custom') {
                const rgb = VisualizerCore.hexToRgb(customColor);
                ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${0.3 + layerAmplitude * 0.5})`;
            } else if (colorTheme === 'custom-gradient') {
                const colorIndex = layer % customGradientColors.length;
                const rgb = VisualizerCore.hexToRgb(customGradientColors[colorIndex]);
                ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${0.3 + layerAmplitude * 0.5})`;
            } else if (colorTheme === 'gradient') {
                const hue = (layer / layers) * 180 + 180;
                ctx.strokeStyle = `hsla(${hue}, 100%, 70%, ${0.3 + layerAmplitude * 0.5})`;
            } else if (colorTheme === 'blue') {
                const hue = 180 + layer * 10;
                ctx.strokeStyle = `hsla(${hue}, 100%, 70%, ${0.3 + layerAmplitude * 0.5})`;
            } else if (colorTheme === 'green') {
                const hue = 120 + layer * 10;
                ctx.strokeStyle = `hsla(${hue}, 100%, 70%, ${0.3 + layerAmplitude * 0.5})`;
            } else if (colorTheme === 'purple') {
                const hue = 270 + layer * 10;
                ctx.strokeStyle = `hsla(${hue}, 100%, 70%, ${0.3 + layerAmplitude * 0.5})`;
            }
            
            // Add glow when audio is intense
            if (layerAmplitude > 0.5) {
                ctx.shadowColor = ctx.strokeStyle;
                ctx.shadowBlur = 5 + layerAmplitude * 15;
            }
            
            ctx.stroke();
            
            // Reset shadow
            ctx.shadowBlur = 0;
        }
        
        // Draw subtle mountains as silhouette
        ctx.beginPath();
        
        // Start at bottom left
        ctx.moveTo(0, height);
        
        // Create a jagged mountain outline
        const mountainPoints = 20;
        const mountainHeight = height * 0.15;
        
        for (let i = 0; i <= mountainPoints; i++) {
            const x = (width / mountainPoints) * i;
            
            // Create uneven mountains
            const y = height - mountainHeight * 
                (0.5 + 0.5 * Math.sin(i * 5) + 0.2 * Math.sin(i * 13));
            
            ctx.lineTo(x, y);
        }
        
        // Complete the path
        ctx.lineTo(width, height);
        ctx.closePath();
        
        // Fill with dark color
        ctx.fillStyle = 'rgba(5, 10, 20, 0.9)';
        ctx.fill();
    },
    
    // Liquid Landscape Visualization
    drawLiquidscape(ctx, frequencyData, canvas, sensitivity, colorTheme, customColor, customGradientColors) {
        const width = canvas.width;
        const height = canvas.height;
        
        // Clear with fade effect
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.fillRect(0, 0, width, height);
        
        // Calculate audio levels
        const bassLevel = VisualizerCore.getAverageFrequency(frequencyData, 0, 10) * sensitivity / 255;
        const midLevel = VisualizerCore.getAverageFrequency(frequencyData, 10, 100) * sensitivity / 255;
        
        // Animation time
        const time = performance.now() * 0.001;
        
        // Landscape parameters
        const layerCount = 5; // Number of liquid layers
        const horizonY = height * 0.5; // Horizon line position
        const liquidHeight = height * 0.5; // Height of liquid area
        
        // Draw sky background
        const skyGradient = ctx.createLinearGradient(0, 0, 0, horizonY);
        
        // Get colors based on theme
        if (colorTheme === 'custom') {
            const rgb = VisualizerCore.hexToRgb(customColor);
            skyGradient.addColorStop(0, `rgba(${rgb.r/5}, ${rgb.g/5}, ${rgb.b/5}, 1)`);
            skyGradient.addColorStop(1, `rgba(${rgb.r/3}, ${rgb.g/3}, ${rgb.b/3}, 1)`);
        } else if (colorTheme === 'custom-gradient') {
            if (customGradientColors.length >= 2) {
                const rgb1 = VisualizerCore.hexToRgb(customGradientColors[0]);
                const rgb2 = VisualizerCore.hexToRgb(customGradientColors[1]);
                skyGradient.addColorStop(0, `rgba(${rgb1.r/5}, ${rgb1.g/5}, ${rgb1.b/5}, 1)`);
                skyGradient.addColorStop(1, `rgba(${rgb2.r/3}, ${rgb2.g/3}, ${rgb2.b/3}, 1)`);
            } else {
                const rgb = VisualizerCore.hexToRgb(customGradientColors[0]);
                skyGradient.addColorStop(0, `rgba(${rgb.r/5}, ${rgb.g/5}, ${rgb.b/5}, 1)`);
                skyGradient.addColorStop(1, `rgba(${rgb.r/3}, ${rgb.g/3}, ${rgb.b/3}, 1)`);
            }
        } else if (colorTheme === 'gradient') {
            skyGradient.addColorStop(0, 'rgba(10, 10, 40, 1)');
            skyGradient.addColorStop(1, 'rgba(40, 10, 40, 1)');
        } else if (colorTheme === 'blue') {
            skyGradient.addColorStop(0, 'rgba(5, 10, 30, 1)');
            skyGradient.addColorStop(1, 'rgba(20, 40, 80, 1)');
        } else if (colorTheme === 'green') {
            skyGradient.addColorStop(0, 'rgba(5, 20, 10, 1)');
            skyGradient.addColorStop(1, 'rgba(10, 30, 20, 1)');
        } else if (colorTheme === 'purple') {
            skyGradient.addColorStop(0, 'rgba(20, 5, 30, 1)');
            skyGradient.addColorStop(1, 'rgba(40, 10, 60, 1)');
        }
        
        // Draw sky
        ctx.fillStyle = skyGradient;
        ctx.fillRect(0, 0, width, horizonY);
        
        // Draw stars in the sky
        for (let i = 0; i < 50; i++) {
            const x = Math.random() * width;
            const y = Math.random() * horizonY * 0.9;
            const size = Math.random() * 1.5 + 0.5;
            const brightness = Math.random() * 0.7 + 0.3;
            
            // Make some stars twinkle based on the audio
            const twinkle = Math.sin(time * 3 + i) * midLevel;
            const finalBrightness = brightness + twinkle * 0.3;
            
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${finalBrightness})`;
            ctx.fill();
        }
        
        // Draw a moon or sun
        const glowSize = 30 + bassLevel * 20;
        const glowX = width * 0.8;
        const glowY = horizonY * 0.3;
        
        // Create a glow effect
        const moonGlow = ctx.createRadialGradient(
            glowX, glowY, 0,
            glowX, glowY, glowSize
        );
        
        if (colorTheme === 'custom') {
            const rgb = VisualizerCore.hexToRgb(customColor);
            moonGlow.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.7)`);
            moonGlow.addColorStop(0.5, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.3)`);
            moonGlow.addColorStop(1, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0)`);
        } else if (colorTheme === 'custom-gradient') {
            const rgb = VisualizerCore.hexToRgb(customGradientColors[0]);
            moonGlow.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.7)`);
            moonGlow.addColorStop(0.5, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.3)`);
            moonGlow.addColorStop(1, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0)`);
        } else if (colorTheme === 'gradient') {
            moonGlow.addColorStop(0, 'rgba(255, 200, 100, 0.7)');
            moonGlow.addColorStop(0.5, 'rgba(255, 150, 50, 0.3)');
            moonGlow.addColorStop(1, 'rgba(255, 100, 50, 0)');
        } else if (colorTheme === 'blue') {
            moonGlow.addColorStop(0, 'rgba(180, 230, 255, 0.7)');
            moonGlow.addColorStop(0.5, 'rgba(100, 200, 255, 0.3)');
            moonGlow.addColorStop(1, 'rgba(50, 150, 255, 0)');
        } else if (colorTheme === 'green') {
            moonGlow.addColorStop(0, 'rgba(180, 255, 200, 0.7)');
            moonGlow.addColorStop(0.5, 'rgba(100, 255, 150, 0.3)');
            moonGlow.addColorStop(1, 'rgba(50, 200, 100, 0)');
        } else if (colorTheme === 'purple') {
            moonGlow.addColorStop(0, 'rgba(230, 180, 255, 0.7)');
            moonGlow.addColorStop(0.5, 'rgba(200, 100, 255, 0.3)');
            moonGlow.addColorStop(1, 'rgba(150, 50, 255, 0)');
        }
        
        // Draw the glowing orb
        ctx.beginPath();
        ctx.arc(glowX, glowY, glowSize, 0, Math.PI * 2);
        ctx.fillStyle = moonGlow;
        ctx.fill();
        
        // Draw the solid center of the orb
        ctx.beginPath();
        ctx.arc(glowX, glowY, glowSize * 0.3, 0, Math.PI * 2);
        
        if (colorTheme === 'custom') {
            const rgb = VisualizerCore.hexToRgb(customColor);
            ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.9)`;
        } else if (colorTheme === 'custom-gradient') {
            const rgb = VisualizerCore.hexToRgb(customGradientColors[0]);
            ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.9)`;
        } else if (colorTheme === 'gradient') {
            ctx.fillStyle = 'rgba(255, 220, 150, 0.9)';
        } else if (colorTheme === 'blue') {
            ctx.fillStyle = 'rgba(200, 240, 255, 0.9)';
        } else if (colorTheme === 'green') {
            ctx.fillStyle = 'rgba(200, 255, 220, 0.9)';
        } else if (colorTheme === 'purple') {
            ctx.fillStyle = 'rgba(240, 200, 255, 0.9)';
        }
        
        ctx.fill();
        
        // Draw liquid layers from back to front
        for (let layer = 0; layer < layerCount; layer++) {
            // Get frequency data for this layer
            const freqStart = Math.floor((layer / layerCount) * frequencyData.length * 0.8);
            const freqEnd = Math.floor(((layer + 1) / layerCount) * frequencyData.length * 0.8);
            const layerData = frequencyData.slice(freqStart, freqEnd);
            
            // Calculate layer Y position (lower layers are higher)
            const layerBaseY = horizonY + (liquidHeight / layerCount) * layer;
            
            // Create wavelike path
            ctx.beginPath();
            
            // Start at left edge
            ctx.moveTo(0, height);
            
            // Create wave points
            const waveSegments = 50;
            const waveWidth = width / waveSegments;
            
            for (let i = 0; i <= waveSegments; i++) {
                const x = i * waveWidth;
                
                // Use frequency data to modify the wave height
                // Lower frequencies affect wave more
                const dataIndex = Math.min(Math.floor(i / waveSegments * layerData.length), layerData.length - 1);
                const waveHeight = (layerData[dataIndex] / 255) * sensitivity * 50 * (1 - layer / layerCount);
                
                // Create compound wave with multiple frequencies
                // Use animation time for wave movement
                const xOffset = (x / width) * 5 + time * (0.5 - layer * 0.1);
                const wave = 
                    Math.sin(xOffset) * waveHeight * 0.8 + 
                    Math.sin(xOffset * 2.5) * waveHeight * 0.3 +
                    Math.cos(xOffset * 1.5) * waveHeight * 0.2;
                
                // Calculate final Y position
                const y = layerBaseY + wave;
                
                ctx.lineTo(x, y);
            }
            
            // Complete the path
            ctx.lineTo(width, height);
            ctx.lineTo(0, height);
            ctx.closePath();
            
            // Create gradient fill
            const gradient = ctx.createLinearGradient(0, layerBaseY, 0, height);
            
            // Different colors based on theme and layer
            if (colorTheme === 'custom') {
                const rgb = VisualizerCore.hexToRgb(customColor);
                gradient.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${0.8 - layer * 0.1})`);
                gradient.addColorStop(1, `rgba(${rgb.r/2}, ${rgb.g/2}, ${rgb.b/2}, ${0.5 - layer * 0.1})`);
            } else if (colorTheme === 'custom-gradient') {
                const colorIndex = layer % customGradientColors.length;
                const rgb = VisualizerCore.hexToRgb(customGradientColors[colorIndex]);
                gradient.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${0.8 - layer * 0.1})`);
                gradient.addColorStop(1, `rgba(${rgb.r/2}, ${rgb.g/2}, ${rgb.b/2}, ${0.5 - layer * 0.1})`);
            } else if (colorTheme === 'gradient') {
                const hueTop = (layer / layerCount) * 300;
                const hueBottom = ((layer + 1) / layerCount) * 300;
                gradient.addColorStop(0, `hsla(${hueTop}, 100%, 60%, ${0.8 - layer * 0.1})`);
                gradient.addColorStop(1, `hsla(${hueBottom}, 80%, 40%, ${0.5 - layer * 0.1})`);
            } else if (colorTheme === 'blue') {
                const hueTop = 180 + (layer / layerCount) * 40;
                const hueBottom = 190 + (layer / layerCount) * 40;
                gradient.addColorStop(0, `hsla(${hueTop}, 100%, 60%, ${0.8 - layer * 0.1})`);
                gradient.addColorStop(1, `hsla(${hueBottom}, 80%, 40%, ${0.5 - layer * 0.1})`);
            } else if (colorTheme === 'green') {
                const hueTop = 120 + (layer / layerCount) * 40;
                const hueBottom = 130 + (layer / layerCount) * 40;
                gradient.addColorStop(0, `hsla(${hueTop}, 100%, 60%, ${0.8 - layer * 0.1})`);
                gradient.addColorStop(1, `hsla(${hueBottom}, 80%, 40%, ${0.5 - layer * 0.1})`);
            } else if (colorTheme === 'purple') {
                const hueTop = 270 + (layer / layerCount) * 40;
                const hueBottom = 280 + (layer / layerCount) * 40;
                gradient.addColorStop(0, `hsla(${hueTop}, 100%, 60%, ${0.8 - layer * 0.1})`);
                gradient.addColorStop(1, `hsla(${hueBottom}, 80%, 40%, ${0.5 - layer * 0.1})`);
            }
            
            // Fill the layer
            ctx.fillStyle = gradient;
            ctx.fill();
            
            // Add glowing line at the top of the wave
            ctx.beginPath();
            
            // Create the top line only
            for (let i = 0; i <= waveSegments; i++) {
                const x = i * waveWidth;
                
                const dataIndex = Math.min(Math.floor(i / waveSegments * layerData.length), layerData.length - 1);
                const waveHeight = (layerData[dataIndex] / 255) * sensitivity * 50 * (1 - layer / layerCount);
                
                const xOffset = (x / width) * 5 + time * (0.5 - layer * 0.1);
                const wave = 
                    Math.sin(xOffset) * waveHeight * 0.8 + 
                    Math.sin(xOffset * 2.5) * waveHeight * 0.3 +
                    Math.cos(xOffset * 1.5) * waveHeight * 0.2;
                
                const y = layerBaseY + wave;
                
                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            
            // Style and stroke the line
            if (colorTheme === 'custom') {
                const rgb = VisualizerCore.hexToRgb(customColor);
                ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${0.9 - layer * 0.1})`;
            } else if (colorTheme === 'custom-gradient') {
                const colorIndex = layer % customGradientColors.length;
                const rgb = VisualizerCore.hexToRgb(customGradientColors[colorIndex]);
                ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${0.9 - layer * 0.1})`;
            } else if (colorTheme === 'gradient') {
                const hue = (layer / layerCount) * 300;
                ctx.strokeStyle = `hsla(${hue}, 100%, 70%, ${0.9 - layer * 0.1})`;
            } else if (colorTheme === 'blue') {
                const hue = 180 + (layer / layerCount) * 40;
                ctx.strokeStyle = `hsla(${hue}, 100%, 70%, ${0.9 - layer * 0.1})`;
            } else if (colorTheme === 'green') {
                const hue = 120 + (layer / layerCount) * 40;
                ctx.strokeStyle = `hsla(${hue}, 100%, 70%, ${0.9 - layer * 0.1})`;
            } else if (colorTheme === 'purple') {
                const hue = 270 + (layer / layerCount) * 40;
                ctx.strokeStyle = `hsla(${hue}, 100%, 70%, ${0.9 - layer * 0.1})`;
            }
            
            ctx.lineWidth = 2;
            
            // Add glow based on bass level
            if (bassLevel > 0.5) {
                ctx.shadowColor = ctx.strokeStyle;
                ctx.shadowBlur = 10 * bassLevel;
            }
            
            ctx.stroke();
            
            // Reset shadow
            ctx.shadowBlur = 0;
        }
    },
    
    // Vortex Visualization
    drawVortex(ctx, frequencyData, canvas, sensitivity, colorTheme, customColor, customGradientColors) {
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
        
        // Vortex parameters
        const maxRadius = Math.min(width, height) * 0.45;
        const arms = 4 + Math.floor(bassLevel * 6); // Number of spiral arms
        const swirls = 6; // Number of swirls per arm
        
        // Rotation speed based on bass
        const rotation = time * (0.2 + bassLevel * 0.5);
        
        // Draw background glow
        const bgGlow = ctx.createRadialGradient(
            centerX, centerY, 0,
            centerX, centerY, maxRadius * 1.5
        );
        
        // Background colors based on theme
        if (colorTheme === 'custom') {
            const rgb = VisualizerCore.hexToRgb(customColor);
            bgGlow.addColorStop(0, `rgba(${rgb.r/4}, ${rgb.g/4}, ${rgb.b/4}, 0.2)`);
            bgGlow.addColorStop(0.6, `rgba(${rgb.r/8}, ${rgb.g/8}, ${rgb.b/8}, 0.1)`);
            bgGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        } else if (colorTheme === 'custom-gradient') {
            if (customGradientColors.length >= 2) {
                const rgb1 = VisualizerCore.hexToRgb(customGradientColors[0]);
                const rgb2 = VisualizerCore.hexToRgb(customGradientColors[1]);
                bgGlow.addColorStop(0, `rgba(${rgb1.r/4}, ${rgb1.g/4}, ${rgb1.b/4}, 0.2)`);
                bgGlow.addColorStop(0.6, `rgba(${rgb2.r/8}, ${rgb2.g/8}, ${rgb2.b/8}, 0.1)`);
                bgGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
            } else {
                const rgb = VisualizerCore.hexToRgb(customGradientColors[0]);
                bgGlow.addColorStop(0, `rgba(${rgb.r/4}, ${rgb.g/4}, ${rgb.b/4}, 0.2)`);
                bgGlow.addColorStop(0.6, `rgba(${rgb.r/8}, ${rgb.g/8}, ${rgb.b/8}, 0.1)`);
                bgGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
            }
        } else if (colorTheme === 'gradient') {
            bgGlow.addColorStop(0, 'rgba(60, 15, 60, 0.2)');
            bgGlow.addColorStop(0.6, 'rgba(30, 10, 30, 0.1)');
            bgGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        } else if (colorTheme === 'blue') {
            bgGlow.addColorStop(0, 'rgba(15, 30, 60, 0.2)');
            bgGlow.addColorStop(0.6, 'rgba(10, 20, 40, 0.1)');
            bgGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        } else if (colorTheme === 'green') {
            bgGlow.addColorStop(0, 'rgba(15, 60, 30, 0.2)');
            bgGlow.addColorStop(0.6, 'rgba(10, 40, 20, 0.1)');
            bgGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        } else if (colorTheme === 'purple') {
            bgGlow.addColorStop(0, 'rgba(40, 10, 60, 0.2)');
            bgGlow.addColorStop(0.6, 'rgba(30, 5, 40, 0.1)');
            bgGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        }
        
        // Draw background glow
        ctx.beginPath();
        ctx.arc(centerX, centerY, maxRadius * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = bgGlow;
        ctx.fill();
        
        // Draw each spiral arm
        for (let arm = 0; arm < arms; arm++) {
            // Base angle for this arm
            const armAngle = (arm / arms) * Math.PI * 2;
            
            // Get frequency data for this arm
            const armStart = Math.floor((arm / arms) * frequencyData.length);
            const armEnd = Math.floor(((arm + 1) / arms) * frequencyData.length);
            const armData = frequencyData.slice(armStart, armEnd);
            
            // Draw swirl particles for this arm
            for (let swirl = 0; swirl < swirls; swirl++) {
                // Position along arm (0-1)
                const pos = swirl / swirls;
                
                // Get frequency value for this position
                const freqIndex = Math.floor(pos * armData.length);
                const freqValue = armData[freqIndex] / 255 * sensitivity;
                
                // Skip if too quiet
                if (freqValue < 0.1) continue;
                
                // Calculate spiral position
                const radius = maxRadius * pos * (0.8 + bassLevel * 0.3);
                const spiralAngle = armAngle + rotation + pos * Math.PI * 2 * 2; // 2 full revolutions
                
                const x = centerX + Math.cos(spiralAngle) * radius;
                const y = centerY + Math.sin(spiralAngle) * radius;
                
                // Calculate particle size based on audio
                const size = 2 + freqValue * 20;
                
                // Determine color based on theme and position
                let color;
                if (colorTheme === 'custom') {
                    const rgb = VisualizerCore.hexToRgb(customColor);
                    color = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${freqValue * 0.8})`;
                } else if (colorTheme === 'custom-gradient') {
                    const colorIndex = (arm + swirl) % customGradientColors.length;
                    const rgb = VisualizerCore.hexToRgb(customGradientColors[colorIndex]);
                    color = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${freqValue * 0.8})`;
                } else if (colorTheme === 'gradient') {
                    const hue = (arm / arms + pos) * 360;
                    color = `hsla(${hue}, 100%, 60%, ${freqValue * 0.8})`;
                } else if (colorTheme === 'blue') {
                    const hue = 180 + (arm / arms + pos) * 60;
                    color = `hsla(${hue}, 100%, 60%, ${freqValue * 0.8})`;
                } else if (colorTheme === 'green') {
                    const hue = 120 + (arm / arms + pos) * 60;
                    color = `hsla(${hue}, 100%, 60%, ${freqValue * 0.8})`;
                } else if (colorTheme === 'purple') {
                    const hue = 270 + (arm / arms + pos) * 60;
                    color = `hsla(${hue}, 100%, 60%, ${freqValue * 0.8})`;
                }
                
                // Draw the particle with glow effect
                ctx.beginPath();
                ctx.arc(x, y, size, 0, Math.PI * 2);
                ctx.fillStyle = color;
                
                // Add glow for higher values
                if (freqValue > 0.5) {
                    ctx.shadowColor = color;
                    ctx.shadowBlur = size;
                }
                
                ctx.fill();
                
                // Reset shadow
                ctx.shadowBlur = 0;
                
                // Draw line connecting to next point in spiral
                if (swirl < swirls - 1) {
                    const nextPos = (swirl + 1) / swirls;
                    const nextRadius = maxRadius * nextPos * (0.8 + bassLevel * 0.3);
                    const nextAngle = armAngle + rotation + nextPos * Math.PI * 2 * 2;
                    
                    const nextX = centerX + Math.cos(nextAngle) * nextRadius;
                    const nextY = centerY + Math.sin(nextAngle) * nextRadius;
                    
                    ctx.beginPath();
                    ctx.moveTo(x, y);
                    ctx.lineTo(nextX, nextY);
                    ctx.strokeStyle = color;
                    ctx.lineWidth = 1 + freqValue * 2;
                    ctx.stroke();
                }
            }
        }
        
        // Draw center vortex
        const centerGlow = ctx.createRadialGradient(
            centerX, centerY, 0,
            centerX, centerY, maxRadius * 0.3 * (1 + bassLevel * 0.5)
        );
        
        // Center colors based on theme
        if (colorTheme === 'custom') {
            const rgb = VisualizerCore.hexToRgb(customColor);
            centerGlow.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.9)`);
            centerGlow.addColorStop(0.7, `rgba(${rgb.r/2}, ${rgb.g/2}, ${rgb.b/2}, 0.3)`);
            centerGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        } else if (colorTheme === 'custom-gradient') {
            if (customGradientColors.length >= 2) {
                const rgb1 = VisualizerCore.hexToRgb(customGradientColors[0]);
                const rgb2 = VisualizerCore.hexToRgb(customGradientColors[1]);
                centerGlow.addColorStop(0, `rgba(${rgb1.r}, ${rgb1.g}, ${rgb1.b}, 0.9)`);
                centerGlow.addColorStop(0.7, `rgba(${rgb2.r/2}, ${rgb2.g/2}, ${rgb2.b/2}, 0.3)`);
                centerGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
            } else {
                const rgb = VisualizerCore.hexToRgb(customGradientColors[0]);
                centerGlow.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.9)`);
                centerGlow.addColorStop(0.7, `rgba(${rgb.r/2}, ${rgb.g/2}, ${rgb.b/2}, 0.3)`);
                centerGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
            }
        } else if (colorTheme === 'gradient') {
            centerGlow.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
            centerGlow.addColorStop(0.3, 'rgba(255, 107, 107, 0.6)');
            centerGlow.addColorStop(0.7, 'rgba(134, 117, 169, 0.3)');
            centerGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        } else if (colorTheme === 'blue') {
            centerGlow.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
            centerGlow.addColorStop(0.3, 'rgba(18, 194, 233, 0.6)');
            centerGlow.addColorStop(0.7, 'rgba(196, 113, 237, 0.3)');
            centerGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        } else if (colorTheme === 'green') {
            centerGlow.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
            centerGlow.addColorStop(0.3, 'rgba(113, 178, 128, 0.6)');
            centerGlow.addColorStop(0.7, 'rgba(19, 78, 94, 0.3)');
            centerGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        } else if (colorTheme === 'purple') {
            centerGlow.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
            centerGlow.addColorStop(0.3, 'rgba(142, 45, 226, 0.6)');
            centerGlow.addColorStop(0.7, 'rgba(74, 0, 224, 0.3)');
            centerGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        }
        
        // Draw center glow
        ctx.beginPath();
        ctx.arc(centerX, centerY, maxRadius * 0.3 * (1 + bassLevel * 0.5), 0, Math.PI * 2);
        ctx.fillStyle = centerGlow;
        ctx.fill();
    }
};

export default WaveformVisualizers;