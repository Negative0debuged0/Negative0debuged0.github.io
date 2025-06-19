export default function(ctx) {
    return {
        drawEthereal(landmarks, width, height, color) {
            const time = Date.now() * 0.001;
            
            // Ethereal, ghostly appearance
            ctx.strokeStyle = color;
            ctx.fillStyle = color;
            ctx.lineWidth = 1;
            ctx.globalAlpha = 0.6;
            
            // Ethereal eyes with floating orbs
            const leftEye = landmarks[468];
            const rightEye = landmarks[473];
            
            if (leftEye && rightEye) {
                for (const eye of [leftEye, rightEye]) {
                    // Central ethereal orb
                    const orbGlow = Math.sin(time * 3) * 0.3 + 0.7;
                    ctx.fillStyle = `rgba(200, 200, 255, ${orbGlow})`;
                    ctx.beginPath();
                    ctx.arc(eye.x * width, eye.y * height, 6, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Floating spirit particles
                    for (let spirit = 0; spirit < 12; spirit++) {
                        const spiritAngle = (spirit * Math.PI * 2) / 12 + time * 0.5;
                        const spiritRadius = 15 + Math.sin(time * 2 + spirit) * 8;
                        const spiritX = eye.x * width + Math.cos(spiritAngle) * spiritRadius;
                        const spiritY = eye.y * height + Math.sin(spiritAngle) * spiritRadius;
                        const spiritAlpha = Math.sin(time * 4 + spirit) * 0.3 + 0.4;
                        
                        ctx.fillStyle = `rgba(150, 150, 255, ${spiritAlpha})`;
                        ctx.beginPath();
                        ctx.arc(spiritX, spiritY, 2, 0, Math.PI * 2);
                        ctx.fill();
                        
                        // Ethereal trails
                        ctx.strokeStyle = `rgba(180, 180, 255, ${spiritAlpha * 0.5})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(eye.x * width, eye.y * height);
                        ctx.lineTo(spiritX, spiritY);
                        ctx.stroke();
                    }
                }
            }
            
            // Ethereal mouth - whispered words
            const mouth = landmarks[13];
            if (mouth) {
                // Breath visualization
                for (let breath = 0; breath < 15; breath++) {
                    const breathX = mouth.x * width + (breath - 7) * 3;
                    const breathY = mouth.y * height + Math.sin(time * 6 + breath) * 8;
                    const breathLife = (time * 2 + breath * 0.2) % 2;
                    const breathAlpha = breathLife < 1 ? breathLife : 2 - breathLife;
                    
                    ctx.fillStyle = `rgba(220, 220, 255, ${breathAlpha * 0.6})`;
                    ctx.beginPath();
                    ctx.arc(breathX, breathY - breathLife * 20, 1, 0, Math.PI * 2);
                    ctx.fill();
                }
                
                // Whisper lines
                ctx.strokeStyle = `rgba(200, 200, 255, 0.7)`;
                ctx.lineWidth = 1;
                for (let whisper = 0; whisper < 3; whisper++) {
                    const whisperY = mouth.y * height + whisper * 4;
                    ctx.beginPath();
                    for (let x = -15; x <= 15; x += 2) {
                        const waveY = whisperY + Math.sin((x + time * 50 + whisper * 20) * 0.3) * 2;
                        if (x === -15) {
                            ctx.moveTo(mouth.x * width + x, waveY);
                        } else {
                            ctx.lineTo(mouth.x * width + x, waveY);
                        }
                    }
                    ctx.stroke();
                }
            }
            
            // Ethereal crown on forehead
            const forehead = landmarks[10];
            if (forehead) {
                // Floating crown elements
                for (let crown = 0; crown < 7; crown++) {
                    const crownAngle = (crown * Math.PI * 2) / 7;
                    const crownRadius = 25;
                    const crownHeight = Math.sin(time * 3 + crown) * 5 + 10;
                    const crownX = forehead.x * width + Math.cos(crownAngle) * crownRadius;
                    const crownY = forehead.y * height - crownHeight;
                    const crownAlpha = Math.sin(time * 2 + crown) * 0.3 + 0.5;
                    
                    // Crown gem
                    ctx.fillStyle = `rgba(255, 255, 200, ${crownAlpha})`;
                    ctx.beginPath();
                    ctx.arc(crownX, crownY, 3, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Crown beam
                    ctx.strokeStyle = `rgba(255, 255, 150, ${crownAlpha * 0.7})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(crownX, crownY);
                    ctx.lineTo(crownX, crownY - 15);
                    ctx.stroke();
                }
            }
            
            // Ethereal aura around face
            const facePoints = [10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109];
            
            // Soft aura outline
            ctx.strokeStyle = `rgba(180, 180, 255, 0.4)`;
            ctx.lineWidth = 3;
            ctx.beginPath();
            for (let i = 0; i < facePoints.length; i++) {
                const point = landmarks[facePoints[i]];
                const auraOffset = Math.sin(time * 4 + i) * 5;
                const x = point.x * width + Math.cos(i * 0.5) * auraOffset;
                const y = point.y * height + Math.sin(i * 0.5) * auraOffset;
                
                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.closePath();
            ctx.stroke();
            
            // Floating essence particles around face
            for (let essence = 0; essence < 25; essence++) {
                const essenceAngle = (essence * Math.PI * 2) / 25 + time * 0.3;
                const essenceRadius = 60 + Math.sin(time * 1.5 + essence) * 20;
                const faceCenter = landmarks[168];
                const essenceX = faceCenter.x * width + Math.cos(essenceAngle) * essenceRadius;
                const essenceY = faceCenter.y * height + Math.sin(essenceAngle) * essenceRadius;
                const essenceAlpha = Math.sin(time * 3 + essence) * 0.4 + 0.2;
                
                ctx.fillStyle = `rgba(200, 255, 255, ${essenceAlpha})`;
                ctx.beginPath();
                ctx.arc(essenceX, essenceY, 1, 0, Math.PI * 2);
                ctx.fill();
            }
            
            ctx.globalAlpha = 1;
        },

        drawHandEthereal(landmarks, width, height, color) {
            const time = Date.now() * 0.001;
            
            // Ethereal, ghostly hand
            ctx.strokeStyle = color;
            ctx.fillStyle = color;
            ctx.lineWidth = 1;
            ctx.globalAlpha = 0.6;
            
            // Ethereal hand structure
            const connections = [
                [0, 1], [1, 2], [2, 3], [3, 4],
                [0, 5], [5, 6], [6, 7], [7, 8],
                [0, 9], [9, 10], [10, 11], [11, 12],
                [0, 13], [13, 14], [14, 15], [15, 16],
                [0, 17], [17, 18], [18, 19], [19, 20]
            ];
            
            // Soft, glowing hand outline
            ctx.strokeStyle = `rgba(180, 180, 255, 0.7)`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            for (const connection of connections) {
                const start = landmarks[connection[0]];
                const end = landmarks[connection[1]];
                const flow = Math.sin(time * 3 + connection[0]) * 2;
                
                ctx.moveTo(start.x * width + flow, start.y * height);
                ctx.lineTo(end.x * width + flow, end.y * height);
            }
            ctx.stroke();
            
            // Spirit orbs at joints
            for (let i = 0; i < landmarks.length; i++) {
                const joint = landmarks[i];
                const orbSize = Math.sin(time * 4 + i) * 1 + 2;
                const orbAlpha = Math.sin(time * 2 + i) * 0.3 + 0.5;
                
                ctx.fillStyle = `rgba(200, 200, 255, ${orbAlpha})`;
                ctx.beginPath();
                ctx.arc(joint.x * width, joint.y * height, orbSize, 0, Math.PI * 2);
                ctx.fill();
            }
            
            // Ethereal energy flowing from fingertips
            const fingertips = [4, 8, 12, 16, 20];
            for (const tip of fingertips) {
                const point = landmarks[tip];
                
                // Energy wisps
                for (let wisp = 0; wisp < 8; wisp++) {
                    const wispAngle = (wisp * Math.PI * 2) / 8 + time * 2;
                    const wispRadius = 10 + Math.sin(time * 5 + wisp) * 5;
                    const wispX = point.x * width + Math.cos(wispAngle) * wispRadius;
                    const wispY = point.y * height + Math.sin(wispAngle) * wispRadius;
                    const wispAlpha = Math.sin(time * 6 + wisp) * 0.4 + 0.3;
                    
                    ctx.fillStyle = `rgba(220, 220, 255, ${wispAlpha})`;
                    ctx.beginPath();
                    ctx.arc(wispX, wispY, 1, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Wisp trails
                    ctx.strokeStyle = `rgba(200, 200, 255, ${wispAlpha * 0.5})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(point.x * width, point.y * height);
                    ctx.lineTo(wispX, wispY);
                    ctx.stroke();
                }
                
                // Central ethereal glow
                const glowIntensity = Math.sin(time * 3 + tip) * 0.3 + 0.7;
                ctx.fillStyle = `rgba(255, 255, 200, ${glowIntensity})`;
                ctx.beginPath();
                ctx.arc(point.x * width, point.y * height, 4, 0, Math.PI * 2);
                ctx.fill();
            }
            
            // Hand aura
            const palm = landmarks[0];
            for (let aura = 0; aura < 20; aura++) {
                const auraAngle = (aura * Math.PI * 2) / 20 + time * 0.5;
                const auraRadius = 40 + Math.sin(time * 2 + aura) * 15;
                const auraX = palm.x * width + Math.cos(auraAngle) * auraRadius;
                const auraY = palm.y * height + Math.sin(auraAngle) * auraRadius;
                const auraAlpha = Math.sin(time * 3 + aura) * 0.3 + 0.2;
                
                ctx.fillStyle = `rgba(180, 255, 255, ${auraAlpha})`;
                ctx.beginPath();
                ctx.arc(auraX, auraY, 1, 0, Math.PI * 2);
                ctx.fill();
            }
            
            ctx.globalAlpha = 1;
        }
    };
}