export default function(ctx) {
    return {
        drawVoid(landmarks, width, height, color) {
            const time = Date.now() * 0.002;
            
            // Void/darkness consuming the face
            ctx.globalCompositeOperation = 'difference';
            ctx.strokeStyle = '#FFFFFF';
            ctx.fillStyle = '#000000';
            ctx.lineWidth = 2;
            ctx.globalAlpha = 0.9;
            
            // Void eyes - black holes with event horizons
            const leftEye = landmarks[468];
            const rightEye = landmarks[473];
            
            if (leftEye && rightEye) {
                for (const eye of [leftEye, rightEye]) {
                    // Event horizon rings
                    for (let ring = 1; ring <= 5; ring++) {
                        const radius = ring * 4;
                        const distortion = Math.sin(time * 3 + ring) * 2;
                        const alpha = 1 - (ring / 5);
                        
                        ctx.globalAlpha = alpha * 0.8;
                        ctx.strokeStyle = '#FFFFFF';
                        ctx.lineWidth = 3 - ring * 0.4;
                        
                        ctx.beginPath();
                        for (let angle = 0; angle < Math.PI * 2; angle += 0.1) {
                            const r = radius + Math.sin(angle * 8 + time * 5) * distortion;
                            const x = eye.x * width + r * Math.cos(angle);
                            const y = eye.y * height + r * Math.sin(angle);
                            
                            if (angle === 0) {
                                ctx.moveTo(x, y);
                            } else {
                                ctx.lineTo(x, y);
                            }
                        }
                        ctx.closePath();
                        ctx.stroke();
                    }
                    
                    // Central singularity
                    ctx.fillStyle = '#000000';
                    ctx.globalAlpha = 1;
                    ctx.beginPath();
                    ctx.arc(eye.x * width, eye.y * height, 3, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
            
            // Void mouth - reality tear
            const mouth = landmarks[13];
            if (mouth) {
                // Jagged tear in reality
                ctx.strokeStyle = '#FFFFFF';
                ctx.lineWidth = 3;
                ctx.globalAlpha = 0.9;
                
                const tearWidth = 30;
                const tearHeight = 8;
                
                ctx.beginPath();
                for (let i = 0; i <= 10; i++) {
                    const t = i / 10;
                    const x = mouth.x * width + (t - 0.5) * tearWidth;
                    const y = mouth.y * height + Math.sin(t * Math.PI * 4 + time * 8) * tearHeight * Math.sin(t * Math.PI);
                    
                    if (i === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                }
                ctx.stroke();
                
                // Void seeping out
                for (let i = 0; i < 8; i++) {
                    const seepX = mouth.x * width + (Math.random() - 0.5) * tearWidth;
                    const seepY = mouth.y * height + Math.random() * 20;
                    const seepAlpha = Math.random() * 0.5;
                    
                    ctx.fillStyle = `rgba(0, 0, 0, ${seepAlpha})`;
                    ctx.beginPath();
                    ctx.arc(seepX, seepY, Math.random() * 3, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
            
            // Void tendrils from temples
            const leftTemple = landmarks[127];
            const rightTemple = landmarks[356];
            
            for (const temple of [leftTemple, rightTemple]) {
                if (temple) {
                    ctx.strokeStyle = '#FFFFFF';
                    ctx.lineWidth = 2;
                    
                    for (let tendril = 0; tendril < 5; tendril++) {
                        const angle = (tendril / 5) * Math.PI + time + (temple === leftTemple ? 0 : Math.PI);
                        const length = 40 + Math.sin(time * 2 + tendril) * 20;
                        
                        ctx.globalAlpha = 0.7 - tendril * 0.1;
                        ctx.beginPath();
                        ctx.moveTo(temple.x * width, temple.y * height);
                        
                        for (let segment = 1; segment <= 10; segment++) {
                            const t = segment / 10;
                            const x = temple.x * width + Math.cos(angle) * length * t + Math.sin(time * 4 + segment) * 5;
                            const y = temple.y * height + Math.sin(angle) * length * t + Math.cos(time * 3 + segment) * 5;
                            ctx.lineTo(x, y);
                        }
                        ctx.stroke();
                    }
                }
            }
            
            // Reality distortion around face outline
            const facePoints = [10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109];
            
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 1;
            ctx.globalAlpha = 0.6;
            
            ctx.beginPath();
            for (let i = 0; i < facePoints.length; i++) {
                const point = landmarks[facePoints[i]];
                const distortion = Math.sin(time * 5 + i) * 8;
                const x = point.x * width + distortion;
                const y = point.y * height + Math.cos(time * 3 + i) * 4;
                
                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.closePath();
            ctx.stroke();
            
            ctx.globalCompositeOperation = 'source-over';
            ctx.globalAlpha = 1;
        },

        drawHandVoid(landmarks, width, height, color) {
            const time = Date.now() * 0.002;
            
            // Void consuming the hand
            ctx.globalCompositeOperation = 'difference';
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 2;
            ctx.globalAlpha = 0.8;
            
            // Void emanation from palm
            const palm = landmarks[0];
            if (palm) {
                for (let ring = 1; ring <= 6; ring++) {
                    const radius = ring * 5;
                    const distortion = Math.sin(time * 4 + ring) * 3;
                    const alpha = 1 - (ring / 6);
                    
                    ctx.globalAlpha = alpha * 0.7;
                    ctx.beginPath();
                    
                    for (let angle = 0; angle < Math.PI * 2; angle += 0.2) {
                        const r = radius + Math.sin(angle * 6 + time * 8) * distortion;
                        const x = palm.x * width + r * Math.cos(angle);
                        const y = palm.y * height + r * Math.sin(angle);
                        
                        if (angle === 0) {
                            ctx.moveTo(x, y);
                        } else {
                            ctx.lineTo(x, y);
                        }
                    }
                    ctx.closePath();
                    ctx.stroke();
                }
            }
            
            // Void fingers - reality tears
            const fingertips = [4, 8, 12, 16, 20];
            for (const tip of fingertips) {
                const point = landmarks[tip];
                
                // Finger void tear
                ctx.globalAlpha = 0.9;
                ctx.lineWidth = 3;
                
                ctx.beginPath();
                for (let i = 0; i <= 8; i++) {
                    const t = i / 8;
                    const tearLength = 15;
                    const x = point.x * width + (t - 0.5) * tearLength;
                    const y = point.y * height + Math.sin(t * Math.PI * 3 + time * 6) * 3;
                    
                    if (i === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                }
                ctx.stroke();
                
                // Void particles escaping
                for (let particle = 0; particle < 4; particle++) {
                    const particleX = point.x * width + (Math.random() - 0.5) * 20;
                    const particleY = point.y * height + Math.random() * 15;
                    const particleAlpha = Math.random() * 0.6;
                    
                    ctx.fillStyle = `rgba(0, 0, 0, ${particleAlpha})`;
                    ctx.beginPath();
                    ctx.arc(particleX, particleY, Math.random() * 2, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
            
            // Distorted hand structure
            const connections = [
                [0, 1], [1, 2], [2, 3], [3, 4],
                [0, 5], [5, 6], [6, 7], [7, 8],
                [0, 9], [9, 10], [10, 11], [11, 12],
                [0, 13], [13, 14], [14, 15], [15, 16],
                [0, 17], [17, 18], [18, 19], [19, 20]
            ];
            
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 1;
            ctx.globalAlpha = 0.5;
            
            ctx.beginPath();
            for (const connection of connections) {
                const start = landmarks[connection[0]];
                const end = landmarks[connection[1]];
                
                const distortionStart = Math.sin(time * 6 + connection[0]) * 6;
                const distortionEnd = Math.sin(time * 6 + connection[1]) * 6;
                
                ctx.moveTo(start.x * width + distortionStart, start.y * height);
                ctx.lineTo(end.x * width + distortionEnd, end.y * height);
            }
            ctx.stroke();
            
            ctx.globalCompositeOperation = 'source-over';
            ctx.globalAlpha = 1;
        }
    };
}