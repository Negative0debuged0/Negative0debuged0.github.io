export default function(ctx) {
    return {
        drawCosmicTree(landmarks, width, height, color) {
            const time = Date.now() * 0.001;
            
            // Dark mystical background with rocky texture
            ctx.globalAlpha = 0.9;
            const faceCenter = landmarks[168]; // nose bridge
            if (faceCenter) {
                const gradient = ctx.createRadialGradient(
                    faceCenter.x * width, faceCenter.y * height, 30,
                    faceCenter.x * width, faceCenter.y * height, 150
                );
                gradient.addColorStop(0, 'rgba(20, 20, 40, 0.8)');
                gradient.addColorStop(0.5, 'rgba(40, 20, 60, 0.6)');
                gradient.addColorStop(1, 'rgba(10, 10, 20, 0.3)');
                
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(faceCenter.x * width, faceCenter.y * height, 150, 0, Math.PI * 2);
                ctx.fill();
            }
            
            // Tree-like branching structure on forehead (pyramid top)
            const forehead = landmarks[10];
            if (forehead) {
                // Main pyramid structure
                ctx.strokeStyle = '#4a4a5a';
                ctx.fillStyle = 'rgba(30, 30, 50, 0.7)';
                ctx.lineWidth = 3;
                
                const pyramidTop = { x: forehead.x * width, y: forehead.y * height - 30 };
                const pyramidLeft = { x: forehead.x * width - 25, y: forehead.y * height + 10 };
                const pyramidRight = { x: forehead.x * width + 25, y: forehead.y * height + 10 };
                
                ctx.beginPath();
                ctx.moveTo(pyramidTop.x, pyramidTop.y);
                ctx.lineTo(pyramidLeft.x, pyramidLeft.y);
                ctx.lineTo(pyramidRight.x, pyramidRight.y);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                
                // Starry interior of pyramid
                for (let star = 0; star < 12; star++) {
                    const starAlpha = Math.sin(time * 3 + star) * 0.4 + 0.6;
                    const starX = pyramidTop.x + (Math.random() - 0.5) * 40;
                    const starY = pyramidTop.y + Math.random() * 30;
                    
                    // Check if star is inside pyramid
                    if (this.isPointInTriangle(starX, starY, pyramidTop, pyramidLeft, pyramidRight)) {
                        ctx.fillStyle = `rgba(150, 200, 255, ${starAlpha})`;
                        this.drawStar(ctx, starX, starY, 1.5, starAlpha);
                    }
                }
                
                // Tree trunk branching lines with glow
                ctx.strokeStyle = '#6a4c93';
                ctx.lineWidth = 2;
                ctx.shadowBlur = 8;
                ctx.shadowColor = '#4a90e2';
                
                // Main trunk
                ctx.beginPath();
                ctx.moveTo(forehead.x * width, forehead.y * height + 10);
                ctx.lineTo(forehead.x * width, forehead.y * height + 40);
                ctx.stroke();
                
                // Branching patterns
                const branches = [
                    { angle: -0.5, length: 20, start: 15 },
                    { angle: 0.5, length: 20, start: 15 },
                    { angle: -0.3, length: 15, start: 25 },
                    { angle: 0.3, length: 15, start: 25 },
                    { angle: -0.7, length: 12, start: 35 },
                    { angle: 0.7, length: 12, start: 35 }
                ];
                
                for (const branch of branches) {
                    const startX = forehead.x * width;
                    const startY = forehead.y * height + 10 + branch.start;
                    const endX = startX + Math.sin(branch.angle) * branch.length;
                    const endY = startY + Math.cos(branch.angle) * branch.length;
                    
                    ctx.beginPath();
                    ctx.moveTo(startX, startY);
                    ctx.lineTo(endX, endY);
                    ctx.stroke();
                    
                    // Sub-branches
                    for (let i = 0; i < 2; i++) {
                        const subAngle = branch.angle + (i - 0.5) * 0.4;
                        const subLength = branch.length * 0.6;
                        const subEndX = endX + Math.sin(subAngle) * subLength;
                        const subEndY = endY + Math.cos(subAngle) * subLength;
                        
                        ctx.beginPath();
                        ctx.moveTo(endX, endY);
                        ctx.lineTo(subEndX, subEndY);
                        ctx.stroke();
                    }
                }
                
                ctx.shadowBlur = 0;
            }
            
            // Mystical eyes with blue-purple glow and rocky texture
            const leftEye = landmarks[468];
            const rightEye = landmarks[473];
            
            if (leftEye && rightEye) {
                for (const eye of [leftEye, rightEye]) {
                    // Rocky eye socket
                    ctx.fillStyle = 'rgba(60, 60, 80, 0.8)';
                    ctx.strokeStyle = '#4a4a5a';
                    ctx.lineWidth = 2;
                    
                    ctx.beginPath();
                    ctx.arc(eye.x * width, eye.y * height, 15, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.stroke();
                    
                    // Inner mystical glow
                    const eyeGlow = Math.sin(time * 2) * 0.3 + 0.7;
                    const eyeGradient = ctx.createRadialGradient(
                        eye.x * width, eye.y * height, 3,
                        eye.x * width, eye.y * height, 12
                    );
                    eyeGradient.addColorStop(0, `rgba(100, 150, 255, ${eyeGlow})`);
                    eyeGradient.addColorStop(0.7, `rgba(60, 100, 200, ${eyeGlow * 0.7})`);
                    eyeGradient.addColorStop(1, 'rgba(30, 50, 100, 0)');
                    
                    ctx.fillStyle = eyeGradient;
                    ctx.beginPath();
                    ctx.arc(eye.x * width, eye.y * height, 12, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Central mystical core
                    ctx.fillStyle = `rgba(150, 200, 255, ${eyeGlow})`;
                    ctx.beginPath();
                    ctx.arc(eye.x * width, eye.y * height, 4, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Floating light particles around eyes
                    for (let particle = 0; particle < 8; particle++) {
                        const particleAngle = (particle * Math.PI * 2) / 8 + time * 1.5;
                        const particleRadius = 18 + Math.sin(time * 3 + particle) * 3;
                        const particleX = eye.x * width + Math.cos(particleAngle) * particleRadius;
                        const particleY = eye.y * height + Math.sin(particleAngle) * particleRadius;
                        const particleAlpha = Math.sin(time * 4 + particle) * 0.4 + 0.3;
                        
                        ctx.fillStyle = `rgba(100, 150, 255, ${particleAlpha})`;
                        ctx.beginPath();
                        ctx.arc(particleX, particleY, 1.5, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
            }
            
            // Mystical mouth with dark rocky texture and inner glow
            const mouth = landmarks[13];
            if (mouth) {
                // Rocky mouth structure
                ctx.fillStyle = 'rgba(40, 40, 60, 0.9)';
                ctx.strokeStyle = '#4a4a5a';
                ctx.lineWidth = 2;
                
                ctx.beginPath();
                ctx.ellipse(mouth.x * width, mouth.y * height, 20, 8, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
                
                // Inner mystical glow
                const mouthGlow = Math.sin(time * 2.5) * 0.4 + 0.6;
                ctx.fillStyle = `rgba(80, 120, 200, ${mouthGlow})`;
                ctx.beginPath();
                ctx.ellipse(mouth.x * width, mouth.y * height, 15, 5, 0, 0, Math.PI * 2);
                ctx.fill();
                
                // Central light beam
                ctx.fillStyle = `rgba(120, 160, 255, ${mouthGlow})`;
                ctx.beginPath();
                ctx.ellipse(mouth.x * width, mouth.y * height, 8, 2, 0, 0, Math.PI * 2);
                ctx.fill();
            }
            
            // Rocky face outline with mystical texture
            const faceOutline = [10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109];
            
            ctx.strokeStyle = '#6a4c93';
            ctx.lineWidth = 2;
            ctx.shadowBlur = 6;
            ctx.shadowColor = '#4a90e2';
            
            ctx.beginPath();
            for (let i = 0; i < faceOutline.length; i++) {
                const point = landmarks[faceOutline[i]];
                const rockiness = Math.sin(time * 5 + i * 0.3) * 2;
                
                if (i === 0) {
                    ctx.moveTo(point.x * width + rockiness, point.y * height);
                } else {
                    ctx.lineTo(point.x * width + rockiness, point.y * height);
                }
            }
            ctx.closePath();
            ctx.stroke();
            
            ctx.shadowBlur = 0;
            
            // Scattered mystical stars across the face
            for (let star = 0; star < 25; star++) {
                const starX = (0.2 + Math.random() * 0.6) * width;
                const starY = (0.1 + Math.random() * 0.8) * height;
                const starBrightness = Math.sin(time * 2 + star) * 0.5 + 0.5;
                const starSize = 1 + Math.random() * 2;
                
                ctx.fillStyle = `rgba(150, 200, 255, ${starBrightness})`;
                this.drawStar(ctx, starX, starY, starSize, starBrightness);
            }
            
            // Two bright stars at the base (like in the image)
            const baseLeft = { x: faceCenter.x * width - 60, y: faceCenter.y * height + 80 };
            const baseRight = { x: faceCenter.x * width + 60, y: faceCenter.y * height + 80 };
            
            const baseStarGlow = Math.sin(time * 1.5) * 0.3 + 0.7;
            ctx.fillStyle = `rgba(100, 200, 255, ${baseStarGlow})`;
            this.drawStar(ctx, baseLeft.x, baseLeft.y, 4, baseStarGlow);
            this.drawStar(ctx, baseRight.x, baseRight.y, 4, baseStarGlow);
            
            ctx.globalAlpha = 1;
        },

        drawHandCosmicTree(landmarks, width, height, color) {
            const time = Date.now() * 0.001;
            
            // Dark mystical hand with tree-like structure
            ctx.globalAlpha = 0.9;
            
            // Dark background aura around hand
            const palm = landmarks[0];
            const handGradient = ctx.createRadialGradient(
                palm.x * width, palm.y * height, 15,
                palm.x * width, palm.y * height, 60
            );
            handGradient.addColorStop(0, 'rgba(40, 40, 60, 0.4)');
            handGradient.addColorStop(0.7, 'rgba(20, 20, 40, 0.2)');
            handGradient.addColorStop(1, 'rgba(10, 10, 20, 0)');
            
            ctx.fillStyle = handGradient;
            ctx.beginPath();
            ctx.arc(palm.x * width, palm.y * height, 60, 0, Math.PI * 2);
            ctx.fill();
            
            // Tree-like hand structure with rocky texture
            const connections = [
                [0, 1], [1, 2], [2, 3], [3, 4],
                [0, 5], [5, 6], [6, 7], [7, 8],
                [0, 9], [9, 10], [10, 11], [11, 12],
                [0, 13], [13, 14], [14, 15], [15, 16],
                [0, 17], [17, 18], [18, 19], [19, 20]
            ];
            
            // Main branch structure with glow
            ctx.strokeStyle = '#6a4c93';
            ctx.lineWidth = 3;
            ctx.shadowBlur = 6;
            ctx.shadowColor = '#4a90e2';
            
            ctx.beginPath();
            for (const connection of connections) {
                const start = landmarks[connection[0]];
                const end = landmarks[connection[1]];
                const rockiness = Math.sin(time * 4 + connection[0]) * 1;
                
                ctx.moveTo(start.x * width + rockiness, start.y * height);
                ctx.lineTo(end.x * width + rockiness, end.y * height);
            }
            ctx.stroke();
            
            ctx.shadowBlur = 0;
            
            // Mystical nodes at joints with rocky texture
            for (let i = 0; i < landmarks.length; i++) {
                const joint = landmarks[i];
                const nodeGlow = Math.sin(time * 3 + i) * 0.3 + 0.7;
                
                // Rocky node base
                ctx.fillStyle = 'rgba(60, 60, 80, 0.8)';
                ctx.strokeStyle = '#4a4a5a';
                ctx.lineWidth = 1;
                
                ctx.beginPath();
                ctx.arc(joint.x * width, joint.y * height, 3, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
                
                // Inner mystical glow
                ctx.fillStyle = `rgba(100, 150, 255, ${nodeGlow * 0.6})`;
                ctx.beginPath();
                ctx.arc(joint.x * width, joint.y * height, 2, 0, Math.PI * 2);
                ctx.fill();
            }
            
            // Tree growth at fingertips with mystical energy
            const fingertips = [4, 8, 12, 16, 20];
            for (const tip of fingertips) {
                const point = landmarks[tip];
                
                // Main branch tip
                ctx.strokeStyle = '#6a4c93';
                ctx.lineWidth = 2;
                ctx.shadowBlur = 4;
                ctx.shadowColor = '#4a90e2';
                
                // Small branches growing from fingertips
                for (let branch = 0; branch < 3; branch++) {
                    const branchAngle = (branch - 1) * 0.4;
                    const branchLength = 8 + Math.sin(time * 2 + tip + branch) * 3;
                    const branchX = point.x * width + Math.sin(branchAngle) * branchLength;
                    const branchY = point.y * height - Math.cos(branchAngle) * branchLength;
                    
                    ctx.beginPath();
                    ctx.moveTo(point.x * width, point.y * height);
                    ctx.lineTo(branchX, branchY);
                    ctx.stroke();
                    
                    // Leaf-like mystical particles at branch ends
                    const leafGlow = Math.sin(time * 4 + tip + branch) * 0.4 + 0.6;
                    ctx.fillStyle = `rgba(100, 150, 255, ${leafGlow})`;
                    ctx.beginPath();
                    ctx.arc(branchX, branchY, 1.5, 0, Math.PI * 2);
                    ctx.fill();
                }
                
                ctx.shadowBlur = 0;
            }
            
            // Mystical palm symbol (tree root system)
            ctx.strokeStyle = 'rgba(100, 150, 255, 0.7)';
            ctx.lineWidth = 1.5;
            
            ctx.save();
            ctx.translate(palm.x * width, palm.y * height);
            ctx.rotate(time * 0.3);
            
            // Root-like pattern
            for (let root = 0; root < 8; root++) {
                const rootAngle = (root * Math.PI * 2) / 8;
                const rootLength = 12;
                
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(Math.cos(rootAngle) * rootLength, Math.sin(rootAngle) * rootLength);
                ctx.stroke();
                
                // Sub-roots
                for (let subRoot = 0; subRoot < 2; subRoot++) {
                    const subAngle = rootAngle + (subRoot - 0.5) * 0.3;
                    const subLength = rootLength * 0.6;
                    const subStartX = Math.cos(rootAngle) * rootLength * 0.7;
                    const subStartY = Math.sin(rootAngle) * rootLength * 0.7;
                    
                    ctx.beginPath();
                    ctx.moveTo(subStartX, subStartY);
                    ctx.lineTo(
                        subStartX + Math.cos(subAngle) * subLength,
                        subStartY + Math.sin(subAngle) * subLength
                    );
                    ctx.stroke();
                }
            }
            
            ctx.restore();
            
            // Floating mystical particles around hand
            for (let particle = 0; particle < 20; particle++) {
                const particleAngle = (particle * Math.PI * 2) / 20 + time * 1.2;
                const particleRadius = 40 + Math.sin(time * 2 + particle) * 15;
                const particleX = palm.x * width + Math.cos(particleAngle) * particleRadius;
                const particleY = palm.y * height + Math.sin(particleAngle) * particleRadius;
                const particleAlpha = Math.sin(time * 3 + particle) * 0.4 + 0.3;
                
                ctx.fillStyle = `rgba(100, 150, 255, ${particleAlpha})`;
                ctx.beginPath();
                ctx.arc(particleX, particleY, 1, 0, Math.PI * 2);
                ctx.fill();
            }
            
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
        },

        isPointInTriangle(px, py, p1, p2, p3) {
            const denominator = (p2.y - p3.y) * (p1.x - p3.x) + (p3.x - p2.x) * (p1.y - p3.y);
            const a = ((p2.y - p3.y) * (px - p3.x) + (p3.x - p2.x) * (py - p3.y)) / denominator;
            const b = ((p3.y - p1.y) * (px - p3.x) + (p1.x - p3.x) * (py - p3.y)) / denominator;
            const c = 1 - a - b;
            
            return a >= 0 && b >= 0 && c >= 0;
        }
    };
}