export default function(ctx) {
    return {
        drawSteampunk(landmarks, width, height, color) {
            const time = Date.now() * 0.001;
            ctx.strokeStyle = '#8B4513';
            ctx.fillStyle = '#CD853F';
            ctx.lineWidth = 2;
            ctx.globalAlpha = 0.9;
            
            // Victorian brass goggles for eyes
            const leftEye = landmarks[468];
            const rightEye = landmarks[473];
            
            if (leftEye && rightEye) {
                // Brass goggle frames
                ctx.strokeStyle = '#B8860B';
                ctx.lineWidth = 4;
                
                // Left goggle
                ctx.beginPath();
                ctx.arc(leftEye.x * width, leftEye.y * height, 20, 0, Math.PI * 2);
                ctx.stroke();
                
                // Inner lens with steam effect
                ctx.strokeStyle = '#87CEEB';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(leftEye.x * width, leftEye.y * height, 15, 0, Math.PI * 2);
                ctx.stroke();
                
                // Steam particles
                for (let i = 0; i < 5; i++) {
                    const steam = Math.sin(time * 3 + i) * 5;
                    ctx.fillStyle = `rgba(255, 255, 255, ${0.5 - i * 0.1})`;
                    ctx.beginPath();
                    ctx.arc(
                        leftEye.x * width + steam,
                        leftEye.y * height - 25 - i * 8,
                        2, 0, Math.PI * 2
                    );
                    ctx.fill();
                }
                
                // Right goggle (mirror)
                ctx.strokeStyle = '#B8860B';
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.arc(rightEye.x * width, rightEye.y * height, 20, 0, Math.PI * 2);
                ctx.stroke();
                
                ctx.strokeStyle = '#87CEEB';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(rightEye.x * width, rightEye.y * height, 15, 0, Math.PI * 2);
                ctx.stroke();
                
                // Right eye steam
                for (let i = 0; i < 5; i++) {
                    const steam = Math.sin(time * 3 + i + 1) * 5;
                    ctx.fillStyle = `rgba(255, 255, 255, ${0.5 - i * 0.1})`;
                    ctx.beginPath();
                    ctx.arc(
                        rightEye.x * width + steam,
                        rightEye.y * height - 25 - i * 8,
                        2, 0, Math.PI * 2
                    );
                    ctx.fill();
                }
                
                // Goggle bridge with gears
                const bridgeX = (leftEye.x + rightEye.x) * width / 2;
                const bridgeY = (leftEye.y + rightEye.y) * height / 2;
                
                ctx.strokeStyle = '#B8860B';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.moveTo(leftEye.x * width + 20, leftEye.y * height);
                ctx.lineTo(rightEye.x * width - 20, rightEye.y * height);
                ctx.stroke();
                
                // Central gear
                this.drawGear(ctx, bridgeX, bridgeY, 8, 8, time);
            }
            
            // Mechanical mouth with pipes
            const mouth = landmarks[13];
            if (mouth) {
                ctx.strokeStyle = '#8B4513';
                ctx.lineWidth = 3;
                
                // Main mouth pipe
                ctx.beginPath();
                ctx.arc(mouth.x * width, mouth.y * height, 12, 0, Math.PI);
                ctx.stroke();
                
                // Side pipes with valves
                const pipeLength = 25;
                ctx.beginPath();
                ctx.moveTo(mouth.x * width - 12, mouth.y * height);
                ctx.lineTo(mouth.x * width - 12 - pipeLength, mouth.y * height);
                ctx.moveTo(mouth.x * width + 12, mouth.y * height);
                ctx.lineTo(mouth.x * width + 12 + pipeLength, mouth.y * height);
                ctx.stroke();
                
                // Valve wheels
                this.drawGear(ctx, mouth.x * width - 12 - pipeLength, mouth.y * height, 6, 6, time * 2);
                this.drawGear(ctx, mouth.x * width + 12 + pipeLength, mouth.y * height, 6, 6, time * 2);
            }
            
            // Mechanical nose with pressure gauge
            const nose = landmarks[19];
            if (nose) {
                ctx.strokeStyle = '#B8860B';
                ctx.lineWidth = 2;
                
                // Pressure gauge
                ctx.beginPath();
                ctx.arc(nose.x * width, nose.y * height, 8, 0, Math.PI * 2);
                ctx.stroke();
                
                // Gauge needle
                const needleAngle = Math.sin(time * 2) * Math.PI / 4;
                ctx.beginPath();
                ctx.moveTo(nose.x * width, nose.y * height);
                ctx.lineTo(
                    nose.x * width + Math.cos(needleAngle) * 6,
                    nose.y * height + Math.sin(needleAngle) * 6
                );
                ctx.stroke();
            }
            
            // Forehead mechanical plate with rivets
            const forehead = landmarks[10];
            if (forehead) {
                ctx.fillStyle = '#8B4513';
                ctx.fillRect(
                    forehead.x * width - 25,
                    forehead.y * height - 5,
                    50, 15
                );
                
                // Rivets
                ctx.fillStyle = '#B8860B';
                for (let i = 0; i < 5; i++) {
                    ctx.beginPath();
                    ctx.arc(
                        forehead.x * width - 20 + i * 10,
                        forehead.y * height + 2,
                        2, 0, Math.PI * 2
                    );
                    ctx.fill();
                }
            }
            
            ctx.globalAlpha = 1;
        },

        drawHandSteampunk(landmarks, width, height, color) {
            const time = Date.now() * 0.001;
            
            // Mechanical hand with brass joints
            ctx.strokeStyle = '#B8860B';
            ctx.fillStyle = '#8B4513';
            ctx.lineWidth = 3;
            ctx.globalAlpha = 0.9;
            
            // Draw hand connections as brass pipes
            const connections = [
                [0, 1], [1, 2], [2, 3], [3, 4],
                [0, 5], [5, 6], [6, 7], [7, 8],
                [0, 9], [9, 10], [10, 11], [11, 12],
                [0, 13], [13, 14], [14, 15], [15, 16],
                [0, 17], [17, 18], [18, 19], [19, 20]
            ];
            
            ctx.beginPath();
            for (const connection of connections) {
                const start = landmarks[connection[0]];
                const end = landmarks[connection[1]];
                ctx.moveTo(start.x * width, start.y * height);
                ctx.lineTo(end.x * width, end.y * height);
            }
            ctx.stroke();
            
            // Brass joints at major points
            const joints = [0, 5, 9, 13, 17];
            for (const joint of joints) {
                const point = landmarks[joint];
                this.drawGear(ctx, point.x * width, point.y * height, 5, 6, time);
            }
            
            // Steam vents at fingertips
            const fingertips = [4, 8, 12, 16, 20];
            for (let i = 0; i < fingertips.length; i++) {
                const tip = landmarks[fingertips[i]];
                
                // Steam particles
                for (let j = 0; j < 3; j++) {
                    const steam = Math.sin(time * 4 + i + j) * 3;
                    ctx.fillStyle = `rgba(255, 255, 255, ${0.6 - j * 0.2})`;
                    ctx.beginPath();
                    ctx.arc(
                        tip.x * width + steam,
                        tip.y * height - 10 - j * 5,
                        1, 0, Math.PI * 2
                    );
                    ctx.fill();
                }
            }
            
            ctx.globalAlpha = 1;
        },

        drawGear(ctx, x, y, radius, teeth, rotation) {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rotation);
            
            ctx.beginPath();
            for (let i = 0; i < teeth * 2; i++) {
                const angle = (i * Math.PI) / teeth;
                const r = i % 2 === 0 ? radius : radius * 0.8;
                const px = r * Math.cos(angle);
                const py = r * Math.sin(angle);
                
                if (i === 0) {
                    ctx.moveTo(px, py);
                } else {
                    ctx.lineTo(px, py);
                }
            }
            ctx.closePath();
            ctx.stroke();
            
            // Center hole
            ctx.beginPath();
            ctx.arc(0, 0, radius * 0.3, 0, Math.PI * 2);
            ctx.stroke();
            
            ctx.restore();
        }
    };
}