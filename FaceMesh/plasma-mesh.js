export default function(ctx) {
    return {
        drawPlasma(landmarks, width, height, color) {
            const time = Date.now() * 0.003;
            
            // Plasma energy facial features
            ctx.globalCompositeOperation = 'lighter';
            ctx.lineWidth = 2;
            ctx.globalAlpha = 0.9;
            
            // Plasma eyes with energy discharge
            const leftEye = landmarks[468];
            const rightEye = landmarks[473];
            
            if (leftEye && rightEye) {
                for (const eye of [leftEye, rightEye]) {
                    // Plasma core
                    const coreIntensity = Math.sin(time * 6) * 0.5 + 0.5;
                    ctx.fillStyle = `rgba(255, 100, 255, ${coreIntensity})`;
                    ctx.beginPath();
                    ctx.arc(eye.x * width, eye.y * height, 8, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Energy arcs
                    for (let arc = 0; arc < 8; arc++) {
                        const angle = (arc * Math.PI * 2) / 8 + time * 2;
                        const arcLength = 15 + Math.sin(time * 4 + arc) * 8;
                        const arcIntensity = Math.sin(time * 8 + arc) * 0.5 + 0.5;
                        
                        ctx.strokeStyle = `rgba(0, 255, 255, ${arcIntensity})`;
                        ctx.lineWidth = 3;
                        
                        // Lightning-like arc
                        ctx.beginPath();
                        ctx.moveTo(eye.x * width, eye.y * height);
                        
                        const segments = 5;
                        for (let seg = 1; seg <= segments; seg++) {
                            const t = seg / segments;
                            const baseX = eye.x * width + Math.cos(angle) * arcLength * t;
                            const baseY = eye.y * height + Math.sin(angle) * arcLength * t;
                            const jitter = Math.sin(time * 10 + arc + seg) * 3;
                            
                            ctx.lineTo(baseX + jitter, baseY + jitter);
                        }
                        ctx.stroke();
                    }
                    
                    // Plasma field
                    for (let field = 0; field < 20; field++) {
                        const fieldAngle = Math.random() * Math.PI * 2;
                        const fieldRadius = 20 + Math.random() * 15;
                        const fieldX = eye.x * width + Math.cos(fieldAngle) * fieldRadius;
                        const fieldY = eye.y * height + Math.sin(fieldAngle) * fieldRadius;
                        const fieldIntensity = Math.random() * 0.6;
                        
                        ctx.fillStyle = `rgba(255, 255, 100, ${fieldIntensity})`;
                        ctx.beginPath();
                        ctx.arc(fieldX, fieldY, 1, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
            }
            
            // Plasma mouth - energy beam
            const mouth = landmarks[13];
            if (mouth) {
                const beamIntensity = Math.sin(time * 5) * 0.5 + 0.5;
                
                // Central energy beam
                ctx.strokeStyle = `rgba(255, 50, 255, ${beamIntensity})`;
                ctx.lineWidth = 6;
                ctx.beginPath();
                ctx.moveTo(mouth.x * width - 20, mouth.y * height);
                ctx.lineTo(mouth.x * width + 20, mouth.y * height);
                ctx.stroke();
                
                // Plasma discharge above and below
                for (let discharge = 0; discharge < 10; discharge++) {
                    const dischargeX = mouth.x * width + (discharge - 5) * 4;
                    const dischargeY = mouth.y * height + (Math.random() - 0.5) * 20;
                    const dischargeIntensity = Math.random() * 0.8;
                    
                    ctx.fillStyle = `rgba(100, 255, 255, ${dischargeIntensity})`;
                    ctx.beginPath();
                    ctx.arc(dischargeX, dischargeY, 1, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
            
            // Plasma conduits on forehead
            const forehead = landmarks[10];
            if (forehead) {
                // Energy conduit network
                for (let conduit = 0; conduit < 3; conduit++) {
                    const conduitY = forehead.y * height + conduit * 8;
                    const flow = time * 3 + conduit;
                    
                    ctx.strokeStyle = `rgba(255, 150, 0, 0.8)`;
                    ctx.lineWidth = 2;
                    
                    ctx.beginPath();
                    for (let x = -25; x <= 25; x += 2) {
                        const waveY = conduitY + Math.sin((x + flow * 20) * 0.2) * 3;
                        if (x === -25) {
                            ctx.moveTo(forehead.x * width + x, waveY);
                        } else {
                            ctx.lineTo(forehead.x * width + x, waveY);
                        }
                    }
                    ctx.stroke();
                }
                
                // Plasma nodes
                for (let node = 0; node < 5; node++) {
                    const nodeX = forehead.x * width + (node - 2) * 12;
                    const nodeY = forehead.y * height;
                    const nodeActivity = Math.sin(time * 7 + node) * 0.5 + 0.5;
                    
                    ctx.fillStyle = `rgba(255, 200, 0, ${nodeActivity})`;
                    ctx.beginPath();
                    ctx.arc(nodeX, nodeY, 3, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
            
            // Plasma aura around face
            const faceCenter = landmarks[168];
            if (faceCenter) {
                for (let aura = 0; aura < 50; aura++) {
                    const auraAngle = Math.random() * Math.PI * 2;
                    const auraRadius = 100 + Math.random() * 50;
                    const auraX = faceCenter.x * width + Math.cos(auraAngle) * auraRadius;
                    const auraY = faceCenter.y * height + Math.sin(auraAngle) * auraRadius;
                    const auraIntensity = Math.random() * 0.4;
                    
                    ctx.fillStyle = `rgba(255, 100, 200, ${auraIntensity})`;
                    ctx.beginPath();
                    ctx.arc(auraX, auraY, 1, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
            
            ctx.globalCompositeOperation = 'source-over';
            ctx.globalAlpha = 1;
        },

        drawHandPlasma(landmarks, width, height, color) {
            const time = Date.now() * 0.003;
            
            // Plasma energy hand
            ctx.globalCompositeOperation = 'lighter';
            ctx.lineWidth = 2;
            ctx.globalAlpha = 0.9;
            
            // Plasma energy flow through hand
            const connections = [
                [0, 1], [1, 2], [2, 3], [3, 4],
                [0, 5], [5, 6], [6, 7], [7, 8],
                [0, 9], [9, 10], [10, 11], [11, 12],
                [0, 13], [13, 14], [14, 15], [15, 16],
                [0, 17], [17, 18], [18, 19], [19, 20]
            ];
            
            // Energy conduits
            for (const connection of connections) {
                const start = landmarks[connection[0]];
                const end = landmarks[connection[1]];
                const energyFlow = Math.sin(time * 8 + connection[0] + connection[1]) * 0.5 + 0.5;
                
                ctx.strokeStyle = `rgba(0, 255, 255, ${energyFlow})`;
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.moveTo(start.x * width, start.y * height);
                ctx.lineTo(end.x * width, end.y * height);
                ctx.stroke();
                
                // Energy particles along conduits
                for (let particle = 0; particle < 3; particle++) {
                    const t = (time * 2 + particle * 0.3) % 1;
                    const particleX = start.x * width + (end.x - start.x) * width * t;
                    const particleY = start.y * height + (end.y - start.y) * height * t;
                    
                    ctx.fillStyle = `rgba(255, 255, 100, ${energyFlow})`;
                    ctx.beginPath();
                    ctx.arc(particleX, particleY, 2, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
            
            // Plasma generators at fingertips
            const fingertips = [4, 8, 12, 16, 20];
            for (const tip of fingertips) {
                const point = landmarks[tip];
                const generatorPower = Math.sin(time * 6 + tip) * 0.5 + 0.5;
                
                // Generator core
                ctx.fillStyle = `rgba(255, 50, 255, ${generatorPower})`;
                ctx.beginPath();
                ctx.arc(point.x * width, point.y * height, 5, 0, Math.PI * 2);
                ctx.fill();
                
                // Plasma discharge
                for (let discharge = 0; discharge < 6; discharge++) {
                    const dischargeAngle = (discharge * Math.PI * 2) / 6 + time * 4;
                    const dischargeLength = 8 + Math.sin(time * 10 + discharge) * 4;
                    const dischargeX = point.x * width + Math.cos(dischargeAngle) * dischargeLength;
                    const dischargeY = point.y * height + Math.sin(dischargeAngle) * dischargeLength;
                    
                    ctx.strokeStyle = `rgba(100, 255, 255, ${generatorPower})`;
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo(point.x * width, point.y * height);
                    ctx.lineTo(dischargeX, dischargeY);
                    ctx.stroke();
                }
            }
            
            // Plasma field around hand
            for (let field = 0; field < 30; field++) {
                const fieldAngle = Math.random() * Math.PI * 2;
                const fieldRadius = 80 + Math.random() * 40;
                const palm = landmarks[0];
                const fieldX = palm.x * width + Math.cos(fieldAngle) * fieldRadius;
                const fieldY = palm.y * height + Math.sin(fieldAngle) * fieldRadius;
                const fieldIntensity = Math.random() * 0.5;
                
                ctx.fillStyle = `rgba(255, 150, 255, ${fieldIntensity})`;
                ctx.beginPath();
                ctx.arc(fieldX, fieldY, 1, 0, Math.PI * 2);
                ctx.fill();
            }
            
            ctx.globalCompositeOperation = 'source-over';
            ctx.globalAlpha = 1;
        }
    };
}