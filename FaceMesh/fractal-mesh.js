export default function(ctx) {
    return {
        drawFractal(landmarks, width, height, color) {
            const time = Date.now() * 0.001;
            
            // Fractal pattern generation on face
            ctx.strokeStyle = color;
            ctx.lineWidth = 1;
            ctx.globalAlpha = 0.8;
            
            // Fractal eyes - Mandelbrot-inspired
            const leftEye = landmarks[468];
            const rightEye = landmarks[473];
            
            if (leftEye && rightEye) {
                for (const eye of [leftEye, rightEye]) {
                    this.drawFractalSpiral(ctx, eye.x * width, eye.y * height, 20, 5, time);
                }
            }
            
            // Fractal mouth - Koch snowflake inspired
            const mouth = landmarks[13];
            if (mouth) {
                this.drawKochLine(ctx, 
                    mouth.x * width - 15, mouth.y * height,
                    mouth.x * width + 15, mouth.y * height,
                    3, time
                );
            }
            
            // Sierpinski triangle on forehead
            const forehead = landmarks[10];
            if (forehead) {
                this.drawSierpinskiTriangle(ctx, 
                    forehead.x * width, forehead.y * height - 10,
                    forehead.x * width - 15, forehead.y * height + 15,
                    forehead.x * width + 15, forehead.y * height + 15,
                    3
                );
            }
            
            // Dragon curve cheeks
            const leftCheek = landmarks[234];
            const rightCheek = landmarks[454];
            
            if (leftCheek) {
                this.drawDragonCurve(ctx, leftCheek.x * width, leftCheek.y * height, 8, 4, time);
            }
            if (rightCheek) {
                this.drawDragonCurve(ctx, rightCheek.x * width, rightCheek.y * height, 8, 4, time + Math.PI);
            }
            
            ctx.globalAlpha = 1;
        },

        drawHandFractal(landmarks, width, height, color) {
            const time = Date.now() * 0.001;
            
            // Fractal patterns on hand
            ctx.strokeStyle = color;
            ctx.lineWidth = 1;
            ctx.globalAlpha = 0.8;
            
            // Fractal tree growth from palm
            const palm = landmarks[0];
            if (palm) {
                this.drawFractalTree(ctx, palm.x * width, palm.y * height, 0, 15, 4, time);
            }
            
            // L-system patterns on fingers
            const fingertips = [4, 8, 12, 16, 20];
            for (let i = 0; i < fingertips.length; i++) {
                const tip = landmarks[fingertips[i]];
                this.drawLSystem(ctx, tip.x * width, tip.y * height, 8, 3, time + i);
            }
            
            // Julia set inspired pattern around hand
            for (let i = 0; i < landmarks.length; i += 3) {
                const landmark = landmarks[i];
                this.drawJuliaPoint(ctx, landmark.x * width, landmark.y * height, time + i);
            }
            
            ctx.globalAlpha = 1;
        },

        drawFractalSpiral(ctx, centerX, centerY, maxRadius, iterations, time) {
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(time);
            
            for (let i = 0; i < iterations; i++) {
                const radius = maxRadius * (1 - i / iterations);
                const angle = i * Math.PI * 2 / 3;
                
                ctx.beginPath();
                for (let t = 0; t < Math.PI * 2; t += 0.1) {
                    const r = radius * Math.exp(-t * 0.1);
                    const x = r * Math.cos(t + angle);
                    const y = r * Math.sin(t + angle);
                    
                    if (t === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                }
                ctx.stroke();
            }
            
            ctx.restore();
        },

        drawKochLine(ctx, x1, y1, x2, y2, depth, time) {
            if (depth === 0) {
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();
                return;
            }
            
            const dx = x2 - x1;
            const dy = y2 - y1;
            
            const x3 = x1 + dx / 3;
            const y3 = y1 + dy / 3;
            const x5 = x1 + 2 * dx / 3;
            const y5 = y1 + 2 * dy / 3;
            
            const angle = Math.atan2(dy, dx) - Math.PI / 3 + Math.sin(time) * 0.2;
            const dist = Math.sqrt(dx * dx + dy * dy) / 3;
            const x4 = x3 + dist * Math.cos(angle);
            const y4 = y3 + dist * Math.sin(angle);
            
            this.drawKochLine(ctx, x1, y1, x3, y3, depth - 1, time);
            this.drawKochLine(ctx, x3, y3, x4, y4, depth - 1, time);
            this.drawKochLine(ctx, x4, y4, x5, y5, depth - 1, time);
            this.drawKochLine(ctx, x5, y5, x2, y2, depth - 1, time);
        },

        drawSierpinskiTriangle(ctx, x1, y1, x2, y2, x3, y3, depth) {
            if (depth === 0) {
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.lineTo(x3, y3);
                ctx.closePath();
                ctx.stroke();
                return;
            }
            
            const mx1 = (x1 + x2) / 2;
            const my1 = (y1 + y2) / 2;
            const mx2 = (x2 + x3) / 2;
            const my2 = (y2 + y3) / 2;
            const mx3 = (x3 + x1) / 2;
            const my3 = (y3 + y1) / 2;
            
            this.drawSierpinskiTriangle(ctx, x1, y1, mx1, my1, mx3, my3, depth - 1);
            this.drawSierpinskiTriangle(ctx, mx1, my1, x2, y2, mx2, my2, depth - 1);
            this.drawSierpinskiTriangle(ctx, mx3, my3, mx2, my2, x3, y3, depth - 1);
        },

        drawDragonCurve(ctx, startX, startY, length, iterations, time) {
            let sequence = '1';
            
            for (let i = 0; i < iterations; i++) {
                sequence = sequence + '1' + sequence.split('').reverse().map(c => c === '1' ? '0' : '1').join('');
            }
            
            ctx.save();
            ctx.translate(startX, startY);
            ctx.rotate(time * 0.5);
            
            let x = 0, y = 0;
            let angle = 0;
            const step = length / sequence.length;
            
            ctx.beginPath();
            ctx.moveTo(x, y);
            
            for (const char of sequence) {
                x += step * Math.cos(angle);
                y += step * Math.sin(angle);
                ctx.lineTo(x, y);
                
                angle += char === '1' ? Math.PI / 2 : -Math.PI / 2;
            }
            
            ctx.stroke();
            ctx.restore();
        },

        drawFractalTree(ctx, startX, startY, angle, length, depth, time) {
            if (depth === 0) return;
            
            const endX = startX + length * Math.cos(angle);
            const endY = startY + length * Math.sin(angle);
            
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.stroke();
            
            const branchAngle = Math.PI / 6 + Math.sin(time + depth) * 0.3;
            const newLength = length * 0.7;
            
            this.drawFractalTree(ctx, endX, endY, angle + branchAngle, newLength, depth - 1, time);
            this.drawFractalTree(ctx, endX, endY, angle - branchAngle, newLength, depth - 1, time);
        },

        drawLSystem(ctx, centerX, centerY, size, iterations, time) {
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(time);
            
            let pattern = 'F';
            for (let i = 0; i < iterations; i++) {
                pattern = pattern.replace(/F/g, 'F+F-F-F+F');
            }
            
            let x = 0, y = 0;
            let angle = 0;
            const step = size / Math.sqrt(pattern.length);
            
            ctx.beginPath();
            ctx.moveTo(x, y);
            
            for (const char of pattern) {
                switch (char) {
                    case 'F':
                        x += step * Math.cos(angle);
                        y += step * Math.sin(angle);
                        ctx.lineTo(x, y);
                        break;
                    case '+':
                        angle += Math.PI / 2;
                        break;
                    case '-':
                        angle -= Math.PI / 2;
                        break;
                }
            }
            
            ctx.stroke();
            ctx.restore();
        },

        drawJuliaPoint(ctx, x, y, time) {
            const c = { real: Math.cos(time) * 0.7, imag: Math.sin(time) * 0.7 };
            let z = { real: (x - 400) / 200, imag: (y - 300) / 200 };
            
            let iterations = 0;
            const maxIterations = 20;
            
            while (iterations < maxIterations && (z.real * z.real + z.imag * z.imag) < 4) {
                const tempReal = z.real * z.real - z.imag * z.imag + c.real;
                z.imag = 2 * z.real * z.imag + c.imag;
                z.real = tempReal;
                iterations++;
            }
            
            if (iterations < maxIterations) {
                const alpha = iterations / maxIterations;
                ctx.fillStyle = `rgba(255, 100, 150, ${alpha})`;
                ctx.beginPath();
                ctx.arc(x, y, 1, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    };
}