// Basic visualization styles
import VisualizerCore from './visualizer-core.js';

const BasicVisualizers = {
    // Bar visualization 
    drawBars(ctx, frequencyData, canvas, sensitivity, colorTheme, customColor, customGradientColors) {
        const width = canvas.width;
        const height = canvas.height;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        const barCount = Math.min(100, width / 8);
        const barWidth = width / barCount;
        const dataStep = Math.floor(frequencyData.length / barCount);
        
        // Create gradient for bars
        const gradient = VisualizerCore.createGradient(ctx, width, height, colorTheme, customColor, customGradientColors);
        
        for (let i = 0; i < barCount; i++) {
            // Get frequency value and apply sensitivity
            const dataIndex = i * dataStep;
            const value = frequencyData[dataIndex] * sensitivity / 255;
            
            const barHeight = value * height * 0.8;
            const x = i * barWidth;
            const y = height - barHeight;
            
            // Set color based on theme
            ctx.fillStyle = gradient;
            
            // Draw bar with rounded corners
            ctx.beginPath();
            ctx.moveTo(x + 2, y);
            ctx.lineTo(x + barWidth - 2, y);
            ctx.quadraticCurveTo(x + barWidth, y, x + barWidth, y + 2);
            ctx.lineTo(x + barWidth, height - 2);
            ctx.quadraticCurveTo(x + barWidth, height, x + barWidth - 2, height);
            ctx.lineTo(x + 2, height);
            ctx.quadraticCurveTo(x, height, x, height - 2);
            ctx.lineTo(x, y + 2);
            ctx.quadraticCurveTo(x, y, x + 2, y);
            ctx.fill();
        }
    },
    
    // Circular visualization
    drawCircular(ctx, frequencyData, canvas, sensitivity, colorTheme, customColor, customGradientColors) {
        const width = canvas.width;
        const height = canvas.height;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(centerX, centerY) * 0.7;
        const barCount = 180;
        const dataStep = Math.floor(frequencyData.length / barCount);
        
        // Create gradient
        const gradient = VisualizerCore.createGradient(ctx, width, height, colorTheme, customColor, customGradientColors);
        
        for (let i = 0; i < barCount; i++) {
            // Get frequency value and apply sensitivity
            const dataIndex = i * dataStep;
            const value = frequencyData[dataIndex] * sensitivity / 255;
            
            const barHeight = value * radius * 0.5;
            const angle = (i / barCount) * Math.PI * 2;
            
            const innerX = centerX + Math.cos(angle) * (radius - barHeight);
            const innerY = centerY + Math.sin(angle) * (radius - barHeight);
            const outerX = centerX + Math.cos(angle) * radius;
            const outerY = centerY + Math.sin(angle) * radius;
            
            // Set color based on theme
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 3;
            
            // Draw line from inner to outer point
            ctx.beginPath();
            ctx.moveTo(innerX, innerY);
            ctx.lineTo(outerX, outerY);
            ctx.stroke();
        }
        
        // Draw inner circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * 0.2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.fill();
    },
    
    // Wave visualization
    drawWave(ctx, frequencyData, canvas, sensitivity, colorTheme, customColor, customGradientColors) {
        const width = canvas.width;
        const height = canvas.height;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        const dataStep = Math.floor(frequencyData.length / width);
        
        // Create gradient
        const gradient = VisualizerCore.createGradient(ctx, width, height, colorTheme, customColor, customGradientColors);
        
        // Draw two waves: one from top, one from bottom
        for (let wave = 0; wave < 2; wave++) {
            ctx.beginPath();
            
            const baseline = wave === 0 ? height * 0.3 : height * 0.7;
            
            for (let x = 0; x < width; x++) {
                const dataIndex = x * dataStep;
                const value = frequencyData[dataIndex] * sensitivity / 255;
                
                // Calculate y position: one wave goes up, the other goes down
                const y = baseline + (wave === 0 ? -value * height * 0.25 : value * height * 0.25);
                
                if (x === 0) {
                    ctx.moveTo(x, y);
                } else {
                    // Use quadratic curves for smoother waves
                    const prevX = x - 1;
                    const prevDataIndex = prevX * dataStep;
                    const prevValue = frequencyData[prevDataIndex] * sensitivity / 255;
                    const prevY = baseline + (wave === 0 ? -prevValue * height * 0.25 : prevValue * height * 0.25);
                    
                    const cpX = x - 0.5;
                    const cpY = (y + prevY) / 2;
                    
                    ctx.quadraticCurveTo(cpX, cpY, x, y);
                }
            }
            
            // Close the path to create a solid shape
            ctx.lineTo(width, wave === 0 ? 0 : height);
            ctx.lineTo(0, wave === 0 ? 0 : height);
            ctx.closePath();
            
            ctx.fillStyle = gradient;
            ctx.fill();
        }
    },
    
    // Particles visualization
    drawParticles(ctx, frequencyData, canvas, sensitivity, colorTheme, customColor, customGradientColors, particles = []) {
        const width = canvas.width;
        const height = canvas.height;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        const centerY = height / 2;
        const dataStep = Math.floor(frequencyData.length / 10);
        
        // Create particles based on audio data
        for (let i = 0; i < 10; i++) {
            const dataIndex = i * dataStep;
            const value = frequencyData[dataIndex] * sensitivity / 255;
            
            // Only create particles if there's significant audio data
            if (value > 0.1) {
                // Create 1-3 particles based on intensity
                const count = Math.floor(value * 3) + 1;
                
                for (let j = 0; j < count; j++) {
                    const size = value * 20 + 5;
                    const x = Math.random() * width;
                    const y = centerY + (Math.random() * 100 - 50);
                    const speedX = (Math.random() - 0.5) * 5;
                    const speedY = (Math.random() - 0.5) * 5;
                    const life = value * 100 + 50;
                    
                    // Determine color based on theme
                    let color;
                    if (colorTheme === 'custom') {
                        color = customColor;
                    } else if (colorTheme === 'custom-gradient') {
                        const colorIndex = Math.floor(Math.random() * customGradientColors.length);
                        color = customGradientColors[colorIndex];
                    } else if (colorTheme === 'gradient') {
                        const hue = (Math.random() * 360) % 360;
                        color = `hsl(${hue}, 80%, ${50 + value * 30}%)`;
                    } else if (colorTheme === 'blue') {
                        const blueColors = ['#12c2e9', '#c471ed', '#f64f59'];
                        color = blueColors[Math.floor(Math.random() * blueColors.length)];
                    } else if (colorTheme === 'green') {
                        color = Math.random() < 0.5 ? '#134e5e' : '#71b280';
                    } else if (colorTheme === 'purple') {
                        color = Math.random() < 0.5 ? '#8e2de2' : '#4a00e0';
                    }
                    
                    particles.push({
                        x, y, size, speedX, speedY, life, maxLife: life, color
                    });
                }
            }
        }
        
        // Update and draw particles
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            
            // Update position
            p.x += p.speedX;
            p.y += p.speedY;
            
            // Fade out based on life
            p.life--;
            const opacity = p.life / p.maxLife;
            
            // Draw particle
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            
            // Parse the color to apply opacity
            if (!p.color) {
                ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
            } else if (typeof p.color === 'string' && p.color.startsWith('#')) {
                const rgb = VisualizerCore.hexToRgb(p.color);
                ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
            } else if (typeof p.color === 'string' && p.color.startsWith('rgb')) {
                const rgba = p.color.replace('rgb', 'rgba').replace(')', `, ${opacity})`);
                ctx.fillStyle = rgba;
            } else if (typeof p.color === 'string' && p.color.startsWith('hsl')) {
                const hsla = p.color.replace('hsl', 'hsla').replace(')', `, ${opacity})`);
                ctx.fillStyle = hsla;
            } else {
                ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
            }
            
            ctx.fill();
            
            // Remove dead particles
            if (p.life <= 0) {
                particles.splice(i, 1);
                i--;
            }
        }
        
        // Limit the number of particles for performance
        if (particles.length > 200) {
            particles.splice(0, particles.length - 200);
        }
        
        return particles;
    }
};

export default BasicVisualizers;