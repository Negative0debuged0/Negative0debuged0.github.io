export default function(ctx) {
    return {
        drawLaser(landmarks, width, height, color) {
            const time = Date.now() * 0.002;
            
            // Futuristic laser face with scanning beams
            ctx.strokeStyle = color;
            ctx.fillStyle = color;
            ctx.lineWidth = 2;
            ctx.globalAlpha = 0.9;
            
            // Laser scanning eyes
            const leftEye = landmarks[468];
            const rightEye = landmarks[473];
            
            if (leftEye && rightEye) {
                for (const eye of [leftEye, rightEye]) {
                    // Central laser emitter
                    const laserPower = Math.sin(time * 8) * 0.5 + 0.5;
                    ctx.fillStyle = `rgba(255, 0, 0, ${laserPower})`;
                    ctx.beginPath();
                    ctx.arc(eye.x * width, eye.y * height, 6, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Scanning laser beams
                    for (let beam = 0; beam < 12; beam++) {
                        const beamAngle = (beam * Math.PI * 2) / 12 + time * 4;
                        const beamLength = 25 + Math.sin(time * 6 + beam) * 10;
                        const beamIntensity = Math.sin(time * 10 + beam) * 0.5 + 0.5;
                        
                        ctx.strokeStyle = `rgba(255, 0, 0, ${beamIntensity})`;
                        ctx.lineWidth = 2;
                        
                        // Pulsing laser beam
                        ctx.beginPath();
                        ctx.moveTo(eye.x * width, eye.y * height);
                        ctx.lineTo(
                            eye.x * width + Math.cos(beamAngle) * beamLength,
                            eye.y * height + Math.sin(beamAngle) * beamLength
                        );
                        ctx.stroke();
                        
                        // Beam end point
                        ctx.fillStyle = `rgba(255, 255, 255, ${beamIntensity})`;
                        ctx.beginPath();
                        ctx.arc(
                            eye.x * width + Math.cos(beamAngle) * beamLength,
                            eye.y * height + Math.sin(beamAngle) * beamLength,
                            1, 0, Math.PI * 2
                        );
                        ctx.fill();
                    }
                    
                    // Targeting reticle
                    ctx.strokeStyle = `rgba(0, 255, 255, ${laserPower})`;
                    ctx.lineWidth = 1;
                    
                    for (let ring = 1; ring <= 3; ring++) {
                        ctx.beginPath();
                        ctx.arc(eye.x * width, eye.y * height, ring * 8, 0, Math.PI * 2);
                        ctx.stroke();
                    }
                    
                    // Crosshairs
                    ctx.beginPath();
                    ctx.moveTo(eye.x * width - 25, eye.y * height);
                    ctx.lineTo(eye.x * width + 25, eye.y * height);
                    ctx.moveTo(eye.x * width, eye.y * height - 25);
                    ctx.lineTo(eye.x * width, eye.y * height + 25);
                    ctx.stroke();
                }
            }
            
            // Laser mouth with energy beam
            const mouth = landmarks[13];
            if (mouth) {
                // Central energy cannon
                const cannonPower = Math.sin(time * 6) * 0.5 + 0.5;
                
                // Cannon barrel
                ctx.fillStyle = '#2F4F4F';
                ctx.fillRect(mouth.x * width - 15, mouth.y * height - 4, 30, 8);
                
                // Energy core
                ctx.fillStyle = `rgba(0, 255, 255, ${cannonPower})`;
                ctx.beginPath();
                ctx.arc(mouth.x * width, mouth.y * height, 6, 0, Math.PI * 2);
                ctx.fill();
                
                // Laser beam emission
                if (cannonPower > 0.7) {
                    ctx.strokeStyle = `rgba(0, 255, 255, ${cannonPower})`;
                    ctx.lineWidth = 4;
                    
                    ctx.beginPath();
                    ctx.moveTo(mouth.x * width + 15, mouth.y * height);
                    ctx.lineTo(mouth.x * width + 60, mouth.y * height);
                    ctx.stroke();
                    
                    // Beam impact sparks
                    for (let spark = 0; spark < 8; spark++) {
                        const sparkAngle = Math.random() * Math.PI * 2;
                        const sparkLength = Math.random() * 15;
                        const sparkX = mouth.x * width + 60 + Math.cos(sparkAngle) * sparkLength;
                        const sparkY = mouth.y * height + Math.sin(sparkAngle) * sparkLength;
                        
                        ctx.fillStyle = `rgba(255, 255, 255, ${Math.random()})`;
                        ctx.beginPath();
                        ctx.arc(sparkX, sparkY, 1, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
            }
            
            // Laser array on forehead
            const forehead = landmarks[10];
            if (forehead) {
                // Laser emitter grid
                for (let x = -2; x <= 2; x++) {
                    for (let y = -1; y <= 1; y++) {
                        const emitterX = forehead.x * width + x * 8;
                        const emitterY = forehead.y * height + y * 8;
                        const emitterState = Math.sin(time * 12 + x + y) > 0;
                        
                        // Emitter housing
                        ctx.fillStyle = '#2F4F4F';
                        ctx.fillRect(emitterX - 2, emitterY - 2, 4, 4);
                        
                        // Laser dot
                        if (emitterState) {
                            ctx.fillStyle = 'rgba(255, 0, 0, 0.8)';
                            ctx.beginPath();
                            ctx.arc(emitterX, emitterY, 1, 0, Math.PI * 2);
                            ctx.fill();
                            
                            // Laser projection
                            ctx.strokeStyle = 'rgba(255, 0, 0, 0.3)';
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.moveTo(emitterX, emitterY);
                            ctx.lineTo(emitterX, emitterY - 30);
                            ctx.stroke();
                        }
                    }
                }
            }
            
            // Scanning beams across cheeks
            const leftCheek = landmarks[234];
            const rightCheek = landmarks[454];
            
            for (const cheek of [leftCheek, rightCheek]) {
                if (cheek) {
                    // Horizontal scanning beam
                    const scanPosition = (time * 50) % 40 - 20;
                    const scanIntensity = Math.sin(time * 8) * 0.3 + 0.7;
                    
                    ctx.strokeStyle = `rgba(0, 255, 0, ${scanIntensity})`;
                    ctx.lineWidth = 2;
                    
                    ctx.beginPath();
                    ctx.moveTo(cheek.x * width + scanPosition, cheek.y * height - 10);
                    ctx.lineTo(cheek.x * width + scanPosition, cheek.y * height + 10);
                    ctx.stroke();
                    
                    // Scan trail
                    for (let trail = 1; trail <= 5; trail++) {
                        const trailX = cheek.x * width + scanPosition - trail * 3;
                        const trailAlpha = scanIntensity * (1 - trail * 0.2);
                        
                        if (trailAlpha > 0) {
                            ctx.strokeStyle = `rgba(0, 255, 0, ${trailAlpha})`;
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.moveTo(trailX, cheek.y * height - 10);
                            ctx.lineTo(trailX, cheek.y * height + 10);
                            ctx.stroke();
                        }
                    }
                }
            }
            
            ctx.globalAlpha = 1;
        },

        drawHandLaser(landmarks, width, height, color) {
            const time = Date.now() * 0.002;
            
            // Futuristic laser hand with energy beams
            ctx.strokeStyle = color;
            ctx.fillStyle = color;
            ctx.lineWidth = 2;
            ctx.globalAlpha = 0.9;
            
            // Laser-guided hand structure
            const connections = [
                [0, 1], [1, 2], [2, 3], [3, 4],
                [0, 5], [5, 6], [6, 7], [7, 8],
                [0, 9], [9, 10], [10, 11], [11, 12],
                [0, 13], [13, 14], [14, 15], [15, 16],
                [0, 17], [17, 18], [18, 19], [19, 20]
            ];
            
            // Draw laser guidance system
            ctx.strokeStyle = `rgba(0, 255, 255, 0.6)`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            for (const connection of connections) {
                const start = landmarks[connection[0]];
                const end = landmarks[connection[1]];
                ctx.moveTo(start.x * width, start.y * height);
                ctx.lineTo(end.x * width, end.y * height);
            }
            ctx.stroke();
            
            // Laser emitters at each joint
            for (let i = 0; i < landmarks.length; i++) {
                const joint = landmarks[i];
                const emitterState = Math.sin(time * 8 + i) > 0.5;
                
                // Emitter housing
                ctx.fillStyle = '#2F4F4F';
                ctx.beginPath();
                ctx.arc(joint.x * width, joint.y * height, 2, 0, Math.PI * 2);
                ctx.fill();
                
                // Laser emission
                if (emitterState) {
                    ctx.fillStyle = 'rgba(255, 0, 0, 0.8)';
                    ctx.beginPath();
                    ctx.arc(joint.x * width, joint.y * height, 1, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
            
            // Laser cannons on fingertips
            const fingertips = [4, 8, 12, 16, 20];
            for (const tip of fingertips) {
                const point = landmarks[tip];
                const cannonPower = Math.sin(time * 6 + tip) * 0.5 + 0.5;
                
                // Cannon barrel
                ctx.fillStyle = '#2F4F4F';
                ctx.fillRect(point.x * width - 2, point.y * height - 6, 4, 8);
                
                // Energy core
                ctx.fillStyle = `rgba(0, 255, 255, ${cannonPower})`;
                ctx.beginPath();
                ctx.arc(point.x * width, point.y * height, 3, 0, Math.PI * 2);
                ctx.fill();
                
                // Laser beam
                if (cannonPower > 0.7) {
                    ctx.strokeStyle = `rgba(255, 0, 0, ${cannonPower})`;
                    ctx.lineWidth = 3;
                    
                    ctx.beginPath();
                    ctx.moveTo(point.x * width, point.y * height);
                    ctx.lineTo(point.x * width, point.y * height - 40);
                    ctx.stroke();
                    
                    // Beam endpoint
                    ctx.fillStyle = `rgba(255, 255, 255, ${cannonPower})`;
                    ctx.beginPath();
                    ctx.arc(point.x * width, point.y * height - 40, 2, 0, Math.PI * 2);
                    ctx.fill();
                }
                
                // Targeting system
                ctx.strokeStyle = `rgba(0, 255, 0, 0.6)`;
                ctx.lineWidth = 1;
                
                for (let ring = 1; ring <= 2; ring++) {
                    ctx.beginPath();
                    ctx.arc(point.x * width, point.y * height, ring * 6, 0, Math.PI * 2);
                    ctx.stroke();
                }
            }
            
            // Central control matrix in palm
            const palm = landmarks[0];
            
            // Control panel
            ctx.fillStyle = '#2F4F4F';
            ctx.fillRect(palm.x * width - 8, palm.y * height - 4, 16, 8);
            
            // Status LEDs
            for (let led = 0; led < 5; led++) {
                const ledX = palm.x * width - 6 + led * 3;
                const ledY = palm.y * height;
                const ledState = Math.sin(time * 10 + led) > 0;
                
                ctx.fillStyle = ledState ? 'rgba(255, 0, 0, 0.8)' : 'rgba(100, 0, 0, 0.3)';
                ctx.beginPath();
                ctx.arc(ledX, ledY, 1, 0, Math.PI * 2);
                ctx.fill();
            }
            
            // Scanning grid projection
            const gridSize = 30;
            const gridLines = 6;
            
            ctx.strokeStyle = 'rgba(0, 255, 0, 0.3)';
            ctx.lineWidth = 1;
            
            // Horizontal grid lines
            for (let i = 0; i < gridLines; i++) {
                const y = palm.y * height - gridSize/2 + (i * gridSize) / (gridLines - 1);
                ctx.beginPath();
                ctx.moveTo(palm.x * width - gridSize/2, y);
                ctx.lineTo(palm.x * width + gridSize/2, y);
                ctx.stroke();
            }
            
            // Vertical grid lines
            for (let i = 0; i < gridLines; i++) {
                const x = palm.x * width - gridSize/2 + (i * gridSize) / (gridLines - 1);
                ctx.beginPath();
                ctx.moveTo(x, palm.y * height - gridSize/2);
                ctx.lineTo(x, palm.y * height + gridSize/2);
                ctx.stroke();
            }
            
            ctx.globalAlpha = 1;
        }
    };
}