export default function(ctx) {
    return {
        drawCelestial(landmarks, width, height, color) {
            const time = Date.now() * 0.001;
            
            // Celestial cosmic face with stars and galaxies
            ctx.strokeStyle = color;
            ctx.fillStyle = color;
            ctx.lineWidth = 2;
            ctx.globalAlpha = 0.9;
            
            // Cosmic eyes with nebula effects
            const leftEye = landmarks[468];
            const rightEye = landmarks[473];
            
            if (leftEye && rightEye) {
                for (const eye of [leftEye, rightEye]) {
                    // Nebula core
                    const nebulaGlow = Math.sin(time * 2) * 0.3 + 0.7;
                    ctx.fillStyle = `rgba(138, 43, 226, ${nebulaGlow})`;
                    ctx.beginPath();
                    ctx.arc(eye.x * width, eye.y * height, 12, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Orbiting stars
                    for (let star = 0; star < 12; star++) {
                        const starAngle = (star * Math.PI * 2) / 12 + time * 0.5;
                        const starRadius = 20 + Math.sin(time * 3 + star) * 5;
                        const starX = eye.x * width + Math.cos(starAngle) * starRadius;
                        const starY = eye.y * height + Math.sin(starAngle) * starRadius;
                        const starBrightness = Math.sin(time * 4 + star) * 0.5 + 0.5;
                        
                        ctx.fillStyle = `rgba(255, 255, 255, ${starBrightness})`;
                        this.drawStar(ctx, starX, starY, 2, starBrightness);
                    }
                    
                    // Cosmic rings
                    for (let ring = 1; ring <= 3; ring++) {
                        ctx.strokeStyle = `rgba(70, 130, 180, ${0.5 - ring * 0.1})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.arc(eye.x * width, eye.y * height, 15 + ring * 8, 0, Math.PI * 2);
                        ctx.stroke();
                    }
                }
            }
            
            // Constellation mouth
            const mouth = landmarks[13];
            if (mouth) {
                // Create constellation pattern
                const constellationPoints = [
                    { x: mouth.x * width - 15, y: mouth.y * height - 5 },
                    { x: mouth.x * width - 5, y: mouth.y * height + 5 },
                    { x: mouth.x * width + 5, y: mouth.y * height - 8 },
                    { x: mouth.x * width + 15, y: mouth.y * height + 3 },
                    { x: mouth.x * width, y: mouth.y * height }
                ];
                
                // Draw constellation stars
                ctx.fillStyle = color;
                for (const point of constellationPoints) {
                    this.drawStar(ctx, point.x, point.y, 3, 0.8);
                }
                
                // Connect with constellation lines
                ctx.strokeStyle = `rgba(255, 255, 255, 0.6)`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                for (let i = 0; i < constellationPoints.length; i++) {
                    const point = constellationPoints[i];
                    if (i === 0) {
                        ctx.moveTo(point.x, point.y);
                    } else {
                        ctx.lineTo(point.x, point.y);
                    }
                }
                ctx.stroke();
            }
            
            // Galaxy spiral on forehead
            const forehead = landmarks[10];
            if (forehead) {
                ctx.strokeStyle = `rgba(147, 112, 219, 0.8)`;
                ctx.lineWidth = 2;
                
                // Draw spiral galaxy
                ctx.beginPath();
                for (let t = 0; t < 4 * Math.PI; t += 0.1) {
                    const radius = t * 2;
                    const x = forehead.x * width + radius * Math.cos(t + time);
                    const y = forehead.y * height + radius * Math.sin(t + time);
                    
                    if (t === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                }
                ctx.stroke();
                
                // Central black hole
                ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
                ctx.beginPath();
                ctx.arc(forehead.x * width,!forehead.y * height, 4, 0, Math.PI * 2);
                ctx.fill();
            }
            
            // Shooting stars across cheeks
            const leftCheek = landmarks[234];
            const rightCheek = landmarks[454];
            
            for (const cheek of [leftCheek, rightCheek]) {
                if (cheek) {
                    const meteorTrail = (time * 100) % 100;
                    ctx.strokeStyle = `rgba(255, 255, 100, 0.8)`;
                    ctx.lineWidth = 2;
                    
                    ctx.beginPath();
                    ctx.moveTo(cheek.x * width - meteorTrail, cheek.y * height - meteorTrail * 0.3);
                    ctx.lineTo(cheek.x * width - meteorTrail + 20, cheek.y * height - meteorTrail * 0.3 + 6);
                    ctx.stroke();
                    
                    // Meteor head
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
                    ctx.beginPath();
                    ctx.arc(cheek.x * width - meteorTrail + 20, cheek.y * height - meteorTrail * 0.3 + 6, 2, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
            
            ctx.globalAlpha = 1;
        },

        drawHandCelestial(landmarks, width, height, color) {
            const time = Date.now() * 0.001;
            
            // Celestial hand with cosmic energy
            ctx.strokeStyle = color;
            ctx.fillStyle = color;
            ctx.lineWidth = 1;
            ctx.globalAlpha = 0.8;
            
            // Constellation pattern on hand
            const connections = [
                [0, 1], [1, 2], [2, 3], [3, 4],
                [0, 5], [5, 6], [6, 7], [7, 8],
                [0, 9], [9, 10], [10, 11], [11, 12],
                [0, 13], [13, 14], [14, 15], [15, 16],
                [0, 17], [17, 18], [18, 19], [19, 20]
            ];
            
            // Draw constellation lines
            ctx.strokeStyle = `rgba(70, 130, 180, 0.6)`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            for (const connection of connections) {
                const start = landmarks[connection[0]];
                const end = landmarks[connection[1]];
                ctx.moveTo(start.x * width, start.y * height);
                ctx.lineTo(end.x * width, end.y * height);
            }
            ctx.stroke();
            
            // Stars at each joint
            for (let i = 0; i < landmarks.length; i++) {
                const joint = landmarks[i];
                const starBrightness = Math.sin(time * 3 + i) * 0.4 + 0.6;
                ctx.fillStyle = `rgba(255, 255, 255, ${starBrightness})`;
                this.drawStar(ctx, joint.x * width, joint.y * height, 2, starBrightness);
            }
            
            // Cosmic energy emanating from fingertips
            const fingertips = [4, 8, 12, 16, 20];
            for (const tip of fingertips) {
                const point = landmarks[tip];
                
                // Energy particles
                for (let particle = 0; particle < 8; particle++) {
                    const particleAngle = (particle * Math.PI * 2) / 8 + time * 2;
                    const particleRadius = 10 + Math.sin(time * 4 + particle) * 5;
                    const particleX = point.x * width + Math.cos(particleAngle) * particleRadius;
                    const particleY = point.y * height + Math.sin(particleAngle) * particleRadius;
                    const particleAlpha = Math.sin(time * 5 + particle) * 0.3 + 0.4;
                    
                    ctx.fillStyle = `rgba(138, 43, 226, ${particleAlpha})`;
                    ctx.beginPath();
                    ctx.arc(particleX, particleY, 1, 0, Math.PI * 2);
                    ctx.fill();
                }
                
                // Central cosmic energy
                const energyGlow = Math.sin(time * 3 + tip) * 0.3 + 0.7;
                ctx.fillStyle = `rgba(255, 255, 255, ${energyGlow})`;
                ctx.beginPath();
                ctx.arc(point.x * width, point.y * height, 3, 0, Math.PI * 2);
                ctx.fill();
            }
            
            // Galaxy spiral from palm
            const palm = landmarks[0];
            ctx.strokeStyle = `rgba(147, 112, 219, 0.5)`;
            ctx.lineWidth = 1;
            
            ctx.beginPath();
            for (let t = 0; t < 3 * Math.PI; t += 0.2) {
                const radius = t * 3;
                const x = palm.x * width + radius * Math.cos(t + time * 0.5);
                const y = palm.y * height + radius * Math.sin(t + time * 0.5);
                
                if (t === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.stroke();
            
            ctx.globalAlpha = 1;
        },

        drawStar(ctx, x, y, size, alpha) {
            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.translate(x, y);
            
            ctx.beginPath();
            for (let i = 0; i < 10; i++) {
                const angle = (i * Math.PI) / 5;
                const radius = i % 2 === 0 ? size : size * 0.4;
                const px = radius * Math.cos(angle);
                const py = radius * Math.sin(angle);
                
                if (i === 0) {
                    ctx.moveTo(px, py);
                } else {
                    ctx.lineTo(px, py);
                }
            }
            ctx.closePath();
            ctx.fill();
            
            ctx.restore();
        }
    };
}