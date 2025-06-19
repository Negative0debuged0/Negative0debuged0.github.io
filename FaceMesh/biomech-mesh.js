export default function(ctx) {
    return {
        drawBiomech(landmarks, width, height, color) {
            const time = Date.now() * 0.002;
            
            // Biomechanical fusion of organic and mechanical
            ctx.strokeStyle = '#2F4F4F';
            ctx.fillStyle = '#708090';
            ctx.lineWidth = 2;
            ctx.globalAlpha = 0.9;
            
            // Cybernetic eyes with organic tendrils
            const leftEye = landmarks[468];
            const rightEye = landmarks[473];
            
            if (leftEye && rightEye) {
                // Mechanical iris with organic outer ring
                ctx.strokeStyle = '#FF6347';
                ctx.lineWidth = 3;
                
                // Left eye - inner mechanical
                ctx.beginPath();
                ctx.arc(leftEye.x * width, leftEye.y * height, 8, 0, Math.PI * 2);
                ctx.stroke();
                
                // Organic tendrils around left eye
                ctx.strokeStyle = '#8FBC8F';
                ctx.lineWidth = 2;
                for (let i = 0; i < 6; i++) {
                    const angle = (i * Math.PI * 2) / 6;
                    const tendrilLength = 15 + Math.sin(time * 3 + i) * 5;
                    const startX = leftEye.x * width + Math.cos(angle) * 12;
                    const startY = leftEye.y * height + Math.sin(angle) * 12;
                    
                    ctx.beginPath();
                    ctx.moveTo(startX, startY);
                    
                    for (let j = 1; j <= 3; j++) {
                        const segmentX = startX + Math.cos(angle + Math.sin(time + j) * 0.5) * (j * 5);
                        const segmentY = startY + Math.sin(angle + Math.sin(time + j) * 0.5) * (j * 5);
                        ctx.lineTo(segmentX, segmentY);
                    }
                    ctx.stroke();
                }
                
                // Right eye (mirror)
                ctx.strokeStyle = '#FF6347';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.arc(rightEye.x * width, rightEye.y * height, 8, 0, Math.PI * 2);
                ctx.stroke();
                
                ctx.strokeStyle = '#8FBC8F';
                ctx.lineWidth = 2;
                for (let i = 0; i < 6; i++) {
                    const angle = (i * Math.PI * 2) / 6;
                    const startX = rightEye.x * width + Math.cos(angle) * 12;
                    const startY = rightEye.y * height + Math.sin(angle) * 12;
                    
                    ctx.beginPath();
                    ctx.moveTo(startX, startY);
                    
                    for (let j = 1; j <= 3; j++) {
                        const segmentX = startX + Math.cos(angle + Math.sin(time + j + 3) * 0.5) * (j * 5);
                        const segmentY = startY + Math.sin(angle + Math.sin(time + j + 3) * 0.5) * (j * 5);
                        ctx.lineTo(segmentX, segmentY);
                    }
                    ctx.stroke();
                }
            }
            
            // Bio-mechanical mouth with breathing apparatus
            const mouth = landmarks[13];
            if (mouth) {
                // Mechanical breathing filter
                ctx.strokeStyle = '#2F4F4F';
                ctx.lineWidth = 3;
                
                ctx.beginPath();
                ctx.arc(mouth.x * width, mouth.y * height, 15, 0, Math.PI * 2);
                ctx.stroke();
                
                // Organic breathing tubes
                ctx.strokeStyle = '#8FBC8F';
                ctx.lineWidth = 2;
                
                for (let i = 0; i < 4; i++) {
                    const angle = (i * Math.PI) / 2;
                    const pulse = Math.sin(time * 4 + i) * 2;
                    
                    ctx.beginPath();
                    ctx.moveTo(
                        mouth.x * width + Math.cos(angle) * 15,
                        mouth.y * height + Math.sin(angle) * 15
                    );
                    ctx.lineTo(
                        mouth.x * width + Math.cos(angle) * (25 + pulse),
                        mouth.y * height + Math.sin(angle) * (25 + pulse)
                    );
                    ctx.stroke();
                }
                
                // Central breathing indicator
                ctx.fillStyle = `rgba(255, 0, 0, ${0.5 + Math.sin(time * 6) * 0.3})`;
                ctx.beginPath();
                ctx.arc(mouth.x * width, mouth.y * height, 4, 0, Math.PI * 2);
                ctx.fill();
            }
            
            // Neural implant on forehead
            const forehead = landmarks[10];
            if (forehead) {
                ctx.strokeStyle = '#4169E1';
                ctx.lineWidth = 2;
                
                // Neural interface grid
                const gridSize = 5;
                for (let x = -2; x <= 2; x++) {
                    for (let y = -1; y <= 1; y++) {
                        const nodeX = forehead.x * width + x * gridSize;
                        const nodeY = forehead.y * height + y * gridSize;
                        const activity = Math.sin(time * 8 + x + y) * 0.5 + 0.5;
                        
                        ctx.globalAlpha = activity;
                        ctx.beginPath();
                        ctx.arc(nodeX, nodeY, 2, 0, Math.PI * 2);
                        ctx.fill();
                        
                        // Neural connections
                        if (x < 2) {
                            ctx.beginPath();
                            ctx.moveTo(nodeX, nodeY);
                            ctx.lineTo(nodeX + gridSize, nodeY);
                            ctx.stroke();
                        }
                        if (y < 1) {
                            ctx.beginPath();
                            ctx.moveTo(nodeX, nodeY);
                            ctx.lineTo(nodeX, nodeY + gridSize);
                            ctx.stroke();
                        }
                    }
                }
            }
            
            ctx.globalAlpha = 1;
        },

        drawHandBiomech(landmarks, width, height, color) {
            const time = Date.now() * 0.002;
            
            // Bio-mechanical hand fusion
            ctx.strokeStyle = '#2F4F4F';
            ctx.lineWidth = 2;
            ctx.globalAlpha = 0.9;
            
            // Mechanical skeleton with organic overlay
            const connections = [
                [0, 1], [1, 2], [2, 3], [3, 4],
                [0, 5], [5, 6], [6, 7], [7, 8],
                [0, 9], [9, 10], [10, 11], [11, 12],
                [0, 13], [13, 14], [14, 15], [15, 16],
                [0, 17], [17, 18], [18, 19], [19, 20]
            ];
            
            // Draw mechanical structure
            ctx.beginPath();
            for (const connection of connections) {
                const start = landmarks[connection[0]];
                const end = landmarks[connection[1]];
                ctx.moveTo(start.x * width, start.y * height);
                ctx.lineTo(end.x * width, end.y * height);
            }
            ctx.stroke();
            
            // Organic tissue growth between joints
            ctx.strokeStyle = '#8FBC8F';
            ctx.lineWidth = 1;
            
            for (let i = 0; i < landmarks.length; i++) {
                const landmark = landmarks[i];
                const growth = Math.sin(time * 3 + i) * 3 + 5;
                
                if (i % 3 === 0) { // Only on some joints
                    ctx.globalAlpha = 0.6;
                    ctx.beginPath();
                    ctx.arc(landmark.x * width, landmark.y * height, growth, 0, Math.PI * 2);
                    ctx.stroke();
                }
            }
            
            // Cybernetic fingertips
            const fingertips = [4, 8, 12, 16, 20];
            ctx.strokeStyle = '#FF6347';
            ctx.lineWidth = 3;
            ctx.globalAlpha = 0.9;
            
            for (const tip of fingertips) {
                const point = landmarks[tip];
                
                // Mechanical fingertip
                ctx.beginPath();
                ctx.arc(point.x * width, point.y * height, 4, 0, Math.PI * 2);
                ctx.stroke();
                
                // Energy emanation
                const energy = Math.sin(time * 5 + tip) * 0.3 + 0.7;
                ctx.fillStyle = `rgba(255, 99, 71, ${energy})`;
                ctx.beginPath();
                ctx.arc(point.x * width, point.y * height, 2, 0, Math.PI * 2);
                ctx.fill();
            }
            
            ctx.globalAlpha = 1;
        }
    };
}