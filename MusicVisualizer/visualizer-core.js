// Core functionality for the music visualizer
const VisualizerCore = {
    // Audio processing
    setupAudioNodes(audioContext) {
        const analyser = audioContext.createAnalyser();
        const gainNode = audioContext.createGain();
        
        // Configure analyser
        analyser.fftSize = 2048;
        analyser.smoothingTimeConstant = 0.6;
        
        return { analyser, gainNode };
    },
    
    // Process audio data
    getFrequencyData(analyser) {
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(dataArray);
        return dataArray;
    },
    
    getTimeData(analyser) {
        const dataArray = new Uint8Array(analyser.fftSize);
        analyser.getByteTimeDomainData(dataArray);
        return dataArray;
    },
    
    // Calculate average frequency for a range
    getAverageFrequency(frequencyData, start, end) {
        let sum = 0;
        const count = end - start;
        
        for (let i = start; i < end; i++) {
            sum += frequencyData[i];
        }
        
        return sum / count;
    },
    
    // Get dominant frequency
    getDominantFrequency(frequencyData, analyser) {
        let max = 0;
        let maxIndex = 0;
        
        for (let i = 0; i < frequencyData.length; i++) {
            if (frequencyData[i] > max) {
                max = frequencyData[i];
                maxIndex = i;
            }
        }
        
        const nyquist = analyser.context.sampleRate / 2;
        const frequency = maxIndex * nyquist / analyser.fftSize;
        
        return {
            frequency,
            magnitude: max / 255
        };
    },
    
    // Color utilities
    getHueFromFrequency(frequency) {
        // Map frequency range to color hue (0-360)
        const minFreq = 20;
        const maxFreq = 20000;
        const logMin = Math.log(minFreq);
        const logMax = Math.log(maxFreq);
        const logFreq = Math.log(Math.max(frequency, minFreq));
        
        // Use logarithmic scale for better distribution
        return 360 * (logFreq - logMin) / (logMax - logMin);
    },
    
    // Converts hex color to RGB components
    hexToRgb(hex) {
        hex = hex.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        return { r, g, b };
    },
    
    // Create gradient for visualizer
    createGradient(ctx, width, height, colorTheme, customColor, customGradientColors) {
        let gradient;
        
        // Determine gradient type based on dimensions
        if (width > height) {
            gradient = ctx.createLinearGradient(0, 0, width, 0);
        } else {
            gradient = ctx.createLinearGradient(0, 0, 0, height);
        }
        
        if (colorTheme === 'custom') {
            const color = this.hexToRgb(customColor);
            gradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, 0.8)`);
            gradient.addColorStop(0.5, `rgba(${color.r}, ${color.g}, ${color.b}, 1)`);
            gradient.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0.8)`);
        } else if (colorTheme === 'custom-gradient') {
            if (customGradientColors && customGradientColors.length > 0) {
                customGradientColors.forEach((color, index) => {
                    const position = index / (customGradientColors.length - 1);
                    gradient.addColorStop(position, color);
                });
            } else {
                // Fallback if no custom colors provided
                gradient.addColorStop(0, 'rgba(255, 107, 107, 1)');
                gradient.addColorStop(1, 'rgba(78, 205, 196, 1)');
            }
        } else if (colorTheme === 'gradient') {
            gradient.addColorStop(0, 'rgba(255, 107, 107, 1)');
            gradient.addColorStop(0.25, 'rgba(78, 205, 196, 1)');
            gradient.addColorStop(0.5, 'rgba(134, 117, 169, 1)');
            gradient.addColorStop(0.75, 'rgba(255, 190, 11, 1)');
            gradient.addColorStop(1, 'rgba(255, 107, 107, 1)');
        } else if (colorTheme === 'blue') {
            gradient.addColorStop(0, 'rgba(18, 194, 233, 1)');
            gradient.addColorStop(0.5, 'rgba(196, 113, 237, 1)');
            gradient.addColorStop(1, 'rgba(246, 79, 89, 1)');
        } else if (colorTheme === 'green') {
            gradient.addColorStop(0, 'rgba(19, 78, 94, 1)');
            gradient.addColorStop(1, 'rgba(113, 178, 128, 1)');
        } else if (colorTheme === 'purple') {
            gradient.addColorStop(0, 'rgba(142, 45, 226, 1)');
            gradient.addColorStop(1, 'rgba(74, 0, 224, 1)');
        }
        
        return gradient;
    },
    
    // Helper for animation timing
    getAnimationTime() {
        return performance.now() * 0.001;
    }
};

export default VisualizerCore;