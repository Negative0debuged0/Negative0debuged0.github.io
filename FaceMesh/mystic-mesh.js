export default function(ctx) {
    return {
        drawMystic(landmarks, width, height, color) {
            const time = Date.now() * 0.001;
            
            // Mystical magical face with runes and energy
            ctx.strokeStyle = color;
            ctx.fillStyle = color;
            ctx.lineWidth = 2;
            ctx.globalAlpha = 0.9;
            
            // Mystical eyes with arcane symbols
            const leftEye = landmarks[468];
            const rightEye = landmarks[473];
            
            if (leftEye && rightEye) {
                for (const eye of [leftEye, rightEye]) {
                    // Central mystical orb
                    const orbPower = Math.sin(time * 3) * 0.3 + 0.7;
                    ctx.fillStyle = `rgba(138, 43, 226, ${orbPower})`;
                    ctx.beginPath();
                    ctx.arc(eye.x * width, eye.y * height, 8, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Floating runes around eyes
                    const runes = ['ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ'];
                    for (let i = 0; i < runes.length; i++) {
                        const runeAngle = (i * Math.PI * 2) / runes.length + time * 0.5;
                        const runeRadius = 20 + Math.sin(time * 2 + i) * 5;
                        const runeX = eye.x * width + Math.cos(runeAngle) * runeRadius;
                        const runeY = eye.y * height + Math.sin(runeAngle) * runeRadius;
                        const runeAlpha = Math.sin(time * 4 + i) * 0.4 + 0.6;
                        
                        ctx.fillStyle = `rgba(255, 215, 0, ${runeAlpha})`;
                        ctx.font = '14px serif';
                        ctx.textAlign = 'center';
                        ctx.fillText(runes[i], runeX, runeY);
                    }
                    
                    // Mystical energy rings
                    for (let ring = 1; ring <= 3; ring++) {
                        const ringRadius = 12 + ring * 6;
                        const ringAlpha = (Math.sin(time * 2 + ring) * 0.3 + 0.4) / ring;
                        
                        ctx.strokeStyle = `rgba(255, 20, 147, ${ringAlpha})`;
                        ctx.lineWidth = 2;
                        ctx.beginPath();
                        ctx.arc(eye.x * width, eye.y * height, ringRadius, 0, Math.PI * 2);
                        ctx.stroke();
                    }
                }
            }
            
            // Mystical mouth with spell casting
            const mouth = landmarks[13];
            if (mouth) {
                // Incantation symbols flowing from mouth
                const spellSymbols = ['◉', '◎', '●', '○', '◐', '◑'];
                for (let i = 0; i < spellSymbols.length; i++) {
                    const symbolFlow = (time * 2 + i * 0.5) % 3;
                    const symbolX = mouth.x * width + (i - 2.5) * 8;
                    const symbolY = mouth.y * height - symbolFlow * 20;
                    const symbolAlpha = 1 - (symbolFlow / 3);
                    
                    if (symbolAlpha > 0) {
                        ctx.fillStyle = `rgba(255, 215, 0, ${symbolAlpha})`;
                        ctx.font = '12px serif';
                        ctx.textAlign = 'center';
                        ctx.fillText(spellSymbols[i], symbolX, symbolY);
                    }
                }
                
                // Magical aura around mouth
                const auraIntensity = Math.sin(time * 5) * 0.5 + 0.5;
                ctx.strokeStyle = `rgba(138, 43, 226, ${auraIntensity})`;
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.arc(mouth.x * width, mouth.y * height, 15, 0, Math.PI * 2);
                ctx.stroke();
            }
            
            // Third eye on forehead
            const forehead = landmarks[10];
            if (forehead) {
                // Third eye mystical symbol
                const thirdEyePower = Math.sin(time * 4) * 0.3 + 0.7;
                
                // Outer mystical circle
                ctx.strokeStyle = `rgba(255, 215, 0, ${thirdEyePower})`;
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.arc(forehead.x * width, forehead.y * height, 15, 0, Math.PI * 2);
                ctx.stroke();
                
                // Inner eye
                ctx.fillStyle = `rgba(138, 43, 226, ${thirdEyePower})`;
                ctx.beginPath();
                ctx.arc(forehead.x * width, forehead.y * height, 8, 0, Math.PI * 2);
                ctx.fill();
                
                // All-seeing pupil
                ctx.fillStyle = `rgba(255, 255, 255, ${thirdEyePower})`;
                ctx.beginPath();
                ctx.arc(forehead.x * width, forehead.y * height, 3, 0, Math.PI * 2);
                ctx.fill();
                
                // Mystical rays
                for (let ray = 0; ray < 8; ray++) {
                    const rayAngle = (ray * Math.PI * 2) / 8 + time;
                    const rayLength = 20 + Math.sin(time * 3 + ray) * 8;
                    
                    ctx.strokeStyle = `rgba(255, 215, 0, ${thirdEyePower * 0.7})`;
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo(
                        forehead.x * width + Math.cos(rayAngle) * 15,
                        forehead.y * height + Math.sin(rayAngle) * 15
                    );
                    ctx.lineTo(
                        forehead.x * width + Math.cos(rayAngle) * rayLength,
                        forehead.y * height + Math.sin(rayAngle) * rayLength
                    );
                    ctx.stroke();
                }
            }
            
            // Mystical tattoos on cheeks
            const leftCheek = landmarks[234];
            const rightCheek = landmarks[454];
            
            for (const cheek of [leftCheek, rightCheek]) {
                if (cheek) {
                    // Spiral mystical tattoo
                    ctx.strokeStyle = `rgba(255, 20, 147, 0.8)`;
                    ctx.lineWidth = 2;
                    
                    ctx.beginPath();
                    for (let t = 0; t < 3 * Math.PI; t += 0.1) {
                        const spiralR = t * 2;
                        const x = cheek.x * width + spiralR * Math.cos(t + time);
                        const y = cheek.y * height + spiralR * Math.sin(t + time);
                        
                        if (t === 0) {
                            ctx.moveTo(x, y);
                        } else {
                            ctx.lineTo(x, y);
                        }
                    }
                    ctx.stroke();
                }
            }
            
            ctx.globalAlpha = 1;
        },

        drawHandMystic(landmarks, width, height, color) {
            const time = Date.now() * 0.001;
            
            // Mystical hand with magical energy
            ctx.strokeStyle = color;
            ctx.fillStyle = color;
            ctx.lineWidth = 2;
            ctx.globalAlpha = 0.9;
            
            // Mystical energy lines connecting joints
            const connections = [
                [0, 1], [1, 2], [2, 3], [3, 4],
                [0, 5], [5, 6], [6, 7], [7, 8],
                [0, 9], [9, 10], [10, 11], [11, 12],
                [0, 13], [13, 14], [14, 15], [15, 16],
                [0, 17], [17, 18], [18, 19], [19, 20]
            ];
            
            // Draw energy flows with mystical glow
            ctx.strokeStyle = `rgba(138, 43, 226, 0.8)`;
            ctx.lineWidth = 2;
            ctx.shadowBlur = 10;
            ctx.shadowColor = 'rgba(138, 43, 226, 0.5)';
            
            ctx.beginPath();
            for (const connection of connections) {
                const start = landmarks[connection[0]];
                const end = landmarks[connection[1]];
                const flow = Math.sin(time * 4 + connection[0]) * 2;
                
                ctx.moveTo(start.x * width + flow, start.y * height);
                ctx.lineTo(end.x * width + flow, end.y * height);
            }
            ctx.stroke();
            
            ctx.shadowBlur = 0;
            
            // Mystical orbs at each joint
            for (let i = 0; i < landmarks.length; i++) {
                const joint = landmarks[i];
                const orbPower = Math.sin(time * 3 + i) * 0.3 + 0.7;
                
                ctx.fillStyle = `rgba(255, 215, 0, ${orbPower})`;
                ctx.beginPath();
                ctx.arc(joint.x * width, joint.y * height, 3, 0, Math.PI * 2);
                ctx.fill();
                
                // Energy wisps around joints
                if (i % 4 === 0) {
                    for (let wisp = 0; wisp < 4; wisp++) {
                        const wispAngle = (wisp * Math.PI * 2) / 4 + time * 2;
                        const wispRadius = 8 + Math.sin(time * 6 + wisp) * 3;
                        const wispX = joint.x * width + Math.cos(wispAngle) * wispRadius;
                        const wispY = joint.y * height + Math.sin(wispAngle) * wispRadius;
                        const wispAlpha = Math.sin(time * 5 + wisp) * 0.3 + 0.4;
                        
                        ctx.fillStyle = `rgba(255, 20, 147, ${wispAlpha})`;
                        ctx.beginPath();
                        ctx.arc(wispX, wispY, 1, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
            }
            
            // Spell casting from fingertips
            const fingertips = [4, 8, 12, 16, 20];
            const spellElements = ['✦', '✧', '✩', '✪', '✫'];
            
            for (let i = 0; i < fingertips.length; i++) {
                const tip = landmarks[fingertips[i]];
                
                // Magical sparks
                for (let spark = 0; spark < 6; spark++) {
                    const sparkAngle = (spark * Math.PI * 2) / 6 + time * 3;
                    const sparkRadius = 12 + Math.sin(time * 8 + spark) * 6;
                    const sparkX = tip.x * width + Math.cos(sparkAngle) * sparkRadius;
                    const sparkY = tip.y * height + Math.sin(sparkAngle) * sparkRadius;
                    const sparkAlpha = Math.sin(time * 10 + spark) * 0.4 + 0.3;
                    
                    ctx.fillStyle = `rgba(255, 215, 0, ${sparkAlpha})`;
                    ctx.font = '8px serif';
                    ctx.textAlign = 'center';
                    ctx.fillText(spellElements[i], sparkX, sparkY);
                }
                
                // Central magical focus
                const focusPower = Math.sin(time * 4 + i) * 0.3 + 0.7;
                ctx.fillStyle = `rgba(138, 43, 226, ${focusPower})`;
                ctx.beginPath();
                ctx.arc(tip.x * width, tip.y * height, 4, 0, Math.PI * 2);
                ctx.fill();
            }
            
            // Mystical pentagram in palm
            const palm = landmarks[0];
            ctx.strokeStyle = `rgba(255, 215, 0, 0.8)`;
            ctx.lineWidth = 2;
            
            ctx.save();
            ctx.translate(palm.x * width, palm.y * height);
            ctx.rotate(time * 0.5);
            
            // Draw pentagram
            ctx.beginPath();
            for (let i = 0; i < 5; i++) {
                const angle1 = (i * 2 * Math.PI) / 5 - Math.PI / 2;
                const angle2 = ((i + 2) * 2 * Math.PI) / 5 - Math.PI / 2;
                const x1 = 10 * Math.cos(angle1);
                const y1 = 10 * Math.sin(angle1);
                const x2 = 10 * Math.cos(angle2);
                const y2 = 10 * Math.sin(angle2);
                
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
            }
            ctx.stroke();
            
            ctx.restore();
            
            ctx.globalAlpha = 1;
        }
    };
}