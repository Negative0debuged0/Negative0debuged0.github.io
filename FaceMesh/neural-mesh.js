export default function(ctx) {
    return {
        drawNeural(landmarks, width, height, color) {
            const time = Date.now() * 0.003;
            
            // Neural network visualization on face
            ctx.strokeStyle = '#9370DB';
            ctx.fillStyle = '#DA70D6';
            ctx.lineWidth = 1;
            ctx.globalAlpha = 0.8;
            
            // Neural eyes with synaptic activity
            const leftEye = landmarks[468];
            const rightEye = landmarks[473];
            
            if (leftEye && rightEye) {
                // Neural network nodes in eyes
                const eyeNodes = [
                    { x: leftEye.x * width, y: leftEye.y * height },
                    { x: rightEye.x * width, y: rightEye.y * height }
                ];
                
                for (const eye of eyeNodes) {
                    // Central processing node
                    const activity = Math.sin(time * 4) * 0.5 + 0.5;
                    ctx.fillStyle = `rgba(147, 112, 219, ${activity})`;
                    ctx.beginPath();
                    ctx.arc(eye.x, eye.y, 8, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Surrounding neural connections
                    for (let i = 0; i < 8; i++) {
                        const angle = (i * Math.PI * 2) / 8;
                        const neuronX = eye.x + Math.cos(angle) * 20;
                        const neuronY = eye.y + Math.sin(angle) * 20;
                        const neuronActivity = Math.sin(time * 6 + i) * 0.5 + 0.5;
                        
                        // Neuron
                        ctx.fillStyle = `rgba(218, 112, 214, ${neuronActivity})`;
                        ctx.beginPath();
                        ctx.arc(neuronX, neuronY, 3, 0, Math.PI * 2);
                        ctx.fill();
                        
                        // Synaptic connection
                        if (neuronActivity > 0.7) {
                            ctx.strokeStyle = `rgba(147, 112, 219, ${neuronActivity})`;
                            ctx.lineWidth = 2;
                            ctx.beginPath();
                            ctx.moveTo(eye.x, eye.y);
                            ctx.lineTo(neuronX, neuronY);
                            ctx.stroke();
                        }
                    }
                }
                
                // Inter-eye neural pathway
                const pathActivity = Math.sin(time * 2) * 0.5 + 0.5;
                if (pathActivity > 0.6) {
                    ctx.strokeStyle = `rgba(255, 20, 147, ${pathActivity})`;
                    ctx.lineWidth = 3;
                    ctx.beginPath();
                    ctx.moveTo(leftEye.x * width, leftEye.y * height);
                    ctx.lineTo(rightEye.x * width, rightEye.y * height);
                    ctx.stroke();
                }
            }
            
            // Neural processing mouth
            const mouth = landmarks[13];
            if (mouth) {
                // Speech processing center
                ctx.strokeStyle = '#9370DB';
                ctx.lineWidth = 2;
                
                // Central speech node
                const speechActivity = Math.sin(time * 8) * 0.5 + 0.5;
                ctx.fillStyle = `rgba(147, 112, 219, ${speechActivity})`;
                ctx.beginPath();
                ctx.arc(mouth.x * width, mouth.y * height, 6, 0, Math.PI * 2);
                ctx.fill();
                
                // Speech pattern visualization
                for (let i = 0; i < 5; i++) {
                    const waveX = mouth.x * width + (i - 2) * 10;
                    const waveY = mouth.y * height + Math.sin(time * 10 + i) * 8;
                    const waveActivity = Math.sin(time * 6 + i) * 0.5 + 0.5;
                    
                    ctx.fillStyle = `rgba(218, 112, 214, ${waveActivity})`;
                    ctx.beginPath();
                    ctx.arc(waveX, waveY, 2, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
            
            // Cortical mapping on forehead
            const forehead = landmarks[10];
            if (forehead) {
                // Brainwave visualization
                ctx.strokeStyle = '#FF1493';
                ctx.lineWidth = 1;
                
                for (let wave = 0; wave < 3; wave++) {
                    ctx.beginPath();
                    for (let x = -30; x <= 30; x += 2) {
                        const waveY = forehead.y * height + Math.sin((x + time * 100 + wave * 50) * 0.1) * (5 + wave * 2);
                        if (x === -30) {
                            ctx.moveTo(forehead.x * width + x, waveY);
                        } else {
                            ctx.lineTo(forehead.x * width + x, waveY);
                        }
                    }
                    ctx.stroke();
                }
                
                // Cortical nodes
                for (let i = 0; i < 7; i++) {
                    const nodeX = forehead.x * width + (i - 3) * 8;
                    const nodeY = forehead.y * height;
                    const nodeActivity = Math.sin(time * 7 + i) * 0.5 + 0.5;
                    
                    ctx.fillStyle = `rgba(255, 20, 147, ${nodeActivity})`;
                    ctx.beginPath();
                    ctx.arc(nodeX, nodeY, 2, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
            
            ctx.globalAlpha = 1;
        },

        drawHandNeural(landmarks, width, height, color) {
            const time = Date.now() * 0.003;
            
            // Neural network hand mapping
            ctx.strokeStyle = '#9370DB';
            ctx.lineWidth = 1;
            ctx.globalAlpha = 0.8;
            
            // Create neural network between hand joints
            for (let i = 0; i < landmarks.length; i++) {
                for (let j = i + 1; j < landmarks.length; j++) {
                    const p1 = landmarks[i];
                    const p2 = landmarks[j];
                    const distance = Math.sqrt(
                        Math.pow((p1.x - p2.x) * width, 2) + 
                        Math.pow((p1.y - p2.y) * height, 2)
                    );
                    
                    // Only connect nearby joints
                    if (distance < 50) {
                        const connectionStrength = Math.sin(time * 5 + i + j) * 0.5 + 0.5;
                        if (connectionStrength > 0.7) {
                            ctx.strokeStyle = `rgba(147, 112, 219, ${connectionStrength})`;
                            ctx.beginPath();
                            ctx.moveTo(p1.x * width, p1.y * height);
                            ctx.lineTo(p2.x * width, p2.y * height);
                            ctx.stroke();
                        }
                    }
                }
            }
            
            // Neural activity at each joint
            for (let i = 0; i < landmarks.length; i++) {
                const landmark = landmarks[i];
                const activity = Math.sin(time * 8 + i) * 0.5 + 0.5;
                
                ctx.fillStyle = `rgba(218, 112, 214, ${activity})`;
                ctx.beginPath();
                ctx.arc(landmark.x * width, landmark.y * height, 3 + activity * 2, 0, Math.PI * 2);
                ctx.fill();
                
                // Neural impulse rings
                if (activity > 0.8) {
                    ctx.strokeStyle = `rgba(255, 20, 147, ${activity - 0.3})`;
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.arc(landmark.x * width, landmark.y * height, 8, 0, Math.PI * 2);
                    ctx.stroke();
                }
            }
            
            // Motor cortex signals to fingertips
            const fingertips = [4, 8, 12, 16, 20];
            for (const tip of fingertips) {
                const point = landmarks[tip];
                const signal = Math.sin(time * 10 + tip) * 0.5 + 0.5;
                
                if (signal > 0.6) {
                    // Signal trail
                    for (let trail = 0; trail < 5; trail++) {
                        const trailAlpha = (signal - 0.6) * (1 - trail * 0.2);
                        ctx.fillStyle = `rgba(255, 255, 255, ${trailAlpha})`;
                        ctx.beginPath();
                        ctx.arc(
                            point.x * width,
                            point.y * height - trail * 3,
                            1, 0, Math.PI * 2
                        );
                        ctx.fill();
                    }
                }
            }
            
            ctx.globalAlpha = 1;
        }
    };
}