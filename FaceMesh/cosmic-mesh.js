export default function(ctx) {
    return {
        drawCosmic(landmarks, width, height, color) {
            const time = Date.now() * 0.001;
            
            // 3D cosmic head shape with depth
            ctx.globalAlpha = 0.9;
            
            // Create 3D head outline with cosmic glow
            const faceOutline = [10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109];
            
            // Draw 3D head depth layers
            for (let layer = 3; layer >= 0; layer--) {
                const layerOffset = layer * 3;
                const layerAlpha = 0.2 + (layer * 0.2);
                
                ctx.strokeStyle = `rgba(138, 43, 226, ${layerAlpha})`;
                ctx.lineWidth = 2 + layer;
                
                ctx.beginPath();
                for (let i = 0; i < faceOutline.length; i++) {
                    const point = landmarks[faceOutline[i]];
                    const x = point.x * width + layerOffset;
                    const y = point.y * height + layerOffset;
                    
                    if (i === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                }
                ctx.closePath();
                ctx.stroke();
            }
            
            // Create gradient purple background around face with 3D depth
            const faceCenter = landmarks[168]; // nose bridge
            if (faceCenter) {
                const gradient = ctx.createRadialGradient(
                    faceCenter.x * width, faceCenter.y * height, 50,
                    faceCenter.x * width, faceCenter.y * height, 200
                );
                gradient.addColorStop(0, 'rgba(138, 43, 226, 0.4)');
                gradient.addColorStop(0.3, 'rgba(75, 0, 130, 0.3)');
                gradient.addColorStop(0.7, 'rgba(25, 25, 112, 0.2)');
                gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
                
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(faceCenter.x * width, faceCenter.y * height, 200, 0, Math.PI * 2);
                ctx.fill();
            }
            
            // Scattered glowing stars all over the face
            for (let star = 0; star < 80; star++) {
                const starX = (Math.random() * 0.6 + 0.2) * width; // Focus stars around face area
                const starY = (Math.random() * 0.8 + 0.1) * height;
                const starSize = Math.random() * 3 + 0.5;
                const starBrightness = Math.sin(time * 3 + star) * 0.5 + 0.5;
                
                ctx.fillStyle = `rgba(255, 255, 255, ${starBrightness})`;
                this.drawStar(ctx, starX, starY, starSize, starBrightness);
            }
            
            // Realistic rigged cosmic eyes with proper facial anatomy
            const leftEyeOutline = [33, 7, 163, 144, 145, 153, 154, 155, 133, 173, 157, 158, 159, 160, 161, 246, 33];
            const rightEyeOutline = [362, 382, 381, 380, 374, 373, 390, 249, 263, 466, 388, 387, 386, 385, 384, 398, 362];
            const leftEyeCenter = landmarks[468];
            const rightEyeCenter = landmarks[473];
            
            if (leftEyeCenter && rightEyeCenter) {
                const eyes = [
                    { center: leftEyeCenter, outline: leftEyeOutline, direction: -1 },
                    { center: rightEyeCenter, outline: rightEyeOutline, direction: 1 }
                ];
                
                for (const eye of eyes) {
                    // Calculate realistic eye dimensions from landmarks
                    const eyePoints = eye.outline.map(idx => landmarks[idx]).filter(p => p);
                    const eyeLeft = Math.min(...eyePoints.map(p => p.x)) * width;
                    const eyeRight = Math.max(...eyePoints.map(p => p.x)) * width;
                    const eyeTop = Math.min(...eyePoints.map(p => p.y)) * height;
                    const eyeBottom = Math.max(...eyePoints.map(p => p.y)) * height;
                    const eyeWidth = eyeRight - eyeLeft;
                    const eyeHeight = eyeBottom - eyeTop;
                    const eyeCenterX = (eyeLeft + eyeRight) / 2;
                    const eyeCenterY = (eyeTop + eyeBottom) / 2;
                    
                    // 3D eye socket depth with proper shadowing
                    for (let depth = 3; depth >= 0; depth--) {
                        ctx.fillStyle = `rgba(25, 25, 112, ${0.1 + depth * 0.1})`;
                        const depthOffset = depth * 2;
                        
                        ctx.beginPath();
                        ctx.ellipse(
                            eyeCenterX + depthOffset * eye.direction,
                            eyeCenterY + depthOffset,
                            eyeWidth / 2 + depthOffset,
                            eyeHeight / 2 + depthOffset,
                            0, 0, Math.PI * 2
                        );
                        ctx.fill();
                    }
                    
                    // Realistic eye white (sclera) - almond shaped
                    const scleraGlow = Math.sin(time * 1.5) * 0.2 + 0.8;
                    const scleraGradient = ctx.createRadialGradient(
                        eyeCenterX, eyeCenterY, 0,
                        eyeCenterX, eyeCenterY, Math.max(eyeWidth, eyeHeight) / 2
                    );
                    scleraGradient.addColorStop(0, `rgba(255, 255, 255, ${scleraGlow})`);
                    scleraGradient.addColorStop(0.7, `rgba(245, 245, 255, ${scleraGlow * 0.95})`);
                    scleraGradient.addColorStop(1, `rgba(220, 220, 240, ${scleraGlow * 0.8})`);
                    
                    ctx.fillStyle = scleraGradient;
                    ctx.beginPath();
                    ctx.ellipse(eyeCenterX, eyeCenterY, eyeWidth / 2.2, eyeHeight / 2.2, 0, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Cosmic iris - much larger and more detailed
                    const irisWidth = eyeWidth * 0.35;
                    const irisHeight = eyeHeight * 0.45;
                    const irisPulse = Math.sin(time * 2.5) * 0.15 + 0.85;
                    
                    // Multi-layered cosmic iris
                    const irisGradient = ctx.createRadialGradient(
                        eyeCenterX, eyeCenterY, 0,
                        eyeCenterX, eyeCenterY, Math.max(irisWidth, irisHeight) * irisPulse
                    );
                    irisGradient.addColorStop(0, `rgba(200, 150, 255, ${scleraGlow})`);
                    irisGradient.addColorStop(0.2, `rgba(138, 43, 226, ${scleraGlow})`);
                    irisGradient.addColorStop(0.4, `rgba(75, 0, 130, ${scleraGlow * 0.9})`);
                    irisGradient.addColorStop(0.7, `rgba(25, 25, 112, ${scleraGlow * 0.8})`);
                    irisGradient.addColorStop(1, `rgba(10, 10, 50, ${scleraGlow * 0.6})`);
                    
                    ctx.fillStyle = irisGradient;
                    ctx.beginPath();
                    ctx.ellipse(eyeCenterX, eyeCenterY, irisWidth * irisPulse, irisHeight * irisPulse, 0, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Detailed iris patterns - cosmic texture
                    ctx.strokeStyle = `rgba(255, 255, 255, ${scleraGlow * 0.3})`;
                    ctx.lineWidth = 0.8;
                    
                    // Concentric elliptical rings
                    for (let ring = 1; ring <= 6; ring++) {
                        const ringAlpha = (scleraGlow * 0.4) / ring;
                        ctx.strokeStyle = `rgba(255, 255, 255, ${ringAlpha})`;
                        ctx.beginPath();
                        ctx.ellipse(
                            eyeCenterX, eyeCenterY,
                            (irisWidth * ring / 7) * irisPulse,
                            (irisHeight * ring / 7) * irisPulse,
                            0, 0, Math.PI * 2
                        );
                        ctx.stroke();
                    }
                    
                    // Cosmic radial patterns
                    for (let spoke = 0; spoke < 24; spoke++) {
                        const spokeAngle = (spoke * Math.PI * 2) / 24 + time * 0.2;
                        const spokeAlpha = Math.sin(time * 3 + spoke) * 0.2 + 0.3;
                        const spokeLength = Math.min(irisWidth, irisHeight) * 0.8 * irisPulse;
                        
                        ctx.strokeStyle = `rgba(180, 120, 255, ${spokeAlpha})`;
                        ctx.lineWidth = 0.6;
                        ctx.beginPath();
                        ctx.moveTo(
                            eyeCenterX + Math.cos(spokeAngle) * (spokeLength * 0.2),
                            eyeCenterY + Math.sin(spokeAngle) * (spokeLength * 0.2)
                        );
                        ctx.lineTo(
                            eyeCenterX + Math.cos(spokeAngle) * spokeLength,
                            eyeCenterY + Math.sin(spokeAngle) * spokeLength
                        );
                        ctx.stroke();
                    }
                    
                    // Realistic pupil with cosmic depth
                    const pupilWidth = irisWidth * 0.4 + Math.sin(time * 1.2) * (irisWidth * 0.1);
                    const pupilHeight = irisHeight * 0.4 + Math.sin(time * 1.2) * (irisHeight * 0.1);
                    
                    // Pupil depth shadow
                    ctx.fillStyle = `rgba(0, 0, 0, ${scleraGlow * 0.4})`;
                    ctx.beginPath();
                    ctx.ellipse(eyeCenterX + 1, eyeCenterY + 1, pupilWidth + 2, pupilHeight + 2, 0, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Main pupil
                    ctx.fillStyle = `rgba(5, 5, 25, ${scleraGlow * 0.98})`;
                    ctx.beginPath();
                    ctx.ellipse(eyeCenterX, eyeCenterY, pupilWidth, pupilHeight, 0, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Cosmic reflections and stars in pupil
                    for (let star = 0; star < 8; star++) {
                        const starAngle = (star * Math.PI * 2) / 8 + time * 1.5;
                        const starRadius = Math.min(pupilWidth, pupilHeight) * (0.3 + Math.random() * 0.4);
                        const starX = eyeCenterX + Math.cos(starAngle) * starRadius;
                        const starY = eyeCenterY + Math.sin(starAngle) * starRadius;
                        const starAlpha = Math.sin(time * 6 + star) * 0.3 + 0.4;
                        const starSize = 0.5 + Math.random() * 1;
                        
                        ctx.fillStyle = `rgba(138, 43, 226, ${starAlpha})`;
                        this.drawStar(ctx, starX, starY, starSize, starAlpha);
                    }
                    
                    // Realistic eye highlights
                    const mainHighlightX = eyeCenterX - irisWidth * 0.25;
                    const mainHighlightY = eyeCenterY - irisHeight * 0.3;
                    const highlightGlow = Math.sin(time * 1.8) * 0.2 + 0.8;
                    
                    // Main highlight - larger and more realistic
                    const highlightGradient = ctx.createRadialGradient(
                        mainHighlightX, mainHighlightY, 0,
                        mainHighlightX, mainHighlightY, 6
                    );
                    highlightGradient.addColorStop(0, `rgba(255, 255, 255, ${highlightGlow})`);
                    highlightGradient.addColorStop(0.5, `rgba(255, 255, 255, ${highlightGlow * 0.7})`);
                    highlightGradient.addColorStop(1, `rgba(255, 255, 255, 0)`);
                    
                    ctx.fillStyle = highlightGradient;
                    ctx.beginPath();
                    ctx.ellipse(mainHighlightX, mainHighlightY, 5, 7, -0.3, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Secondary smaller highlight
                    ctx.fillStyle = `rgba(255, 255, 255, ${highlightGlow * 0.6})`;
                    ctx.beginPath();
                    ctx.ellipse(mainHighlightX + irisWidth * 0.6, mainHighlightY + irisHeight * 0.5, 2, 3, 0.4, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Realistic upper and lower eyelids with cosmic glow
                    ctx.strokeStyle = `rgba(138, 43, 226, ${scleraGlow * 0.8})`;
                    ctx.lineWidth = 2.5;
                    ctx.shadowBlur = 8;
                    ctx.shadowColor = 'rgba(138, 43, 226, 0.4)';
                    
                    // Upper eyelid - more curved and realistic
                    ctx.beginPath();
                    ctx.moveTo(eyeLeft, eyeCenterY - eyeHeight * 0.1);
                    ctx.quadraticCurveTo(eyeCenterX, eyeTop - 2, eyeRight, eyeCenterY - eyeHeight * 0.1);
                    ctx.stroke();
                    
                    // Lower eyelid - subtle curve
                    ctx.beginPath();
                    ctx.moveTo(eyeLeft, eyeCenterY + eyeHeight * 0.2);
                    ctx.quadraticCurveTo(eyeCenterX, eyeBottom + 1, eyeRight, eyeCenterY + eyeHeight * 0.2);
                    ctx.stroke();
                    
                    // Eyelashes effect
                    ctx.lineWidth = 1;
                    ctx.shadowBlur = 4;
                    for (let lash = 0; lash < 12; lash++) {
                        const lashX = eyeLeft + (eyeWidth * lash / 11);
                        const lashLength = 4 + Math.sin(lash * 0.8) * 2;
                        const lashAngle = -0.2 + (lash / 11) * 0.4;
                        
                        ctx.beginPath();
                        ctx.moveTo(lashX, eyeTop - 2);
                        ctx.lineTo(
                            lashX + Math.sin(lashAngle) * lashLength,
                            eyeTop - 2 - Math.cos(lashAngle) * lashLength
                        );
                        ctx.stroke();
                    }
                    
                    ctx.shadowBlur = 0;
                }
            }
            
            // Enhanced rigged mouth with realistic lips and cosmic effects
            const upperLip = landmarks[13]; // Nose base - upper lip connection
            const lowerLip = landmarks[14]; // Lower lip center
            const leftMouth = landmarks[61]; // Left mouth corner
            const rightMouth = landmarks[291]; // Right mouth corner
            const mouthTop = landmarks[12]; // Upper lip top
            const mouthBottom = landmarks[15]; // Lower lip bottom
            
            if (upperLip && lowerLip && leftMouth && rightMouth) {
                // Calculate realistic mouth dimensions and opening
                const mouthCenterX = (leftMouth.x + rightMouth.x) * width / 2;
                const mouthCenterY = (upperLip.y + lowerLip.y) * height / 2;
                const mouthWidth = Math.abs(rightMouth.x - leftMouth.x) * width;
                const mouthHeight = Math.abs(upperLip.y - lowerLip.y) * height;
                const mouthOpening = Math.max(0, Math.min(1, mouthHeight / 25));
                
                // Cosmic mouth aura
                const mouthGlow = Math.sin(time * 3.5) * 0.4 + 0.6;
                const mouthGradient = ctx.createRadialGradient(
                    mouthCenterX, mouthCenterY, 8,
                    mouthCenterX, mouthCenterY, 40
                );
                mouthGradient.addColorStop(0, `rgba(138, 43, 226, ${mouthGlow * 0.8})`);
                mouthGradient.addColorStop(0.5, `rgba(75, 0, 130, ${mouthGlow * 0.4})`);
                mouthGradient.addColorStop(1, 'rgba(25, 25, 112, 0)');
                
                ctx.fillStyle = mouthGradient;
                ctx.beginPath();
                ctx.ellipse(mouthCenterX, mouthCenterY, 40, 25, 0, 0, Math.PI * 2);
                ctx.fill();
                
                if (mouthOpening > 0.2) {
                    // Mouth is open - draw realistic opened mouth
                    
                    // Inner mouth cavity with cosmic depth
                    const cavityGradient = ctx.createRadialGradient(
                        mouthCenterX, mouthCenterY, 0,
                        mouthCenterX, mouthCenterY, mouthWidth / 2
                    );
                    cavityGradient.addColorStop(0, `rgba(25, 25, 112, ${mouthOpening * 0.9})`);
                    cavityGradient.addColorStop(0.6, `rgba(10, 10, 50, ${mouthOpening * 0.8})`);
                    cavityGradient.addColorStop(1, `rgba(5, 5, 25, ${mouthOpening * 0.6})`);
                    
                    ctx.fillStyle = cavityGradient;
                    ctx.beginPath();
                    ctx.ellipse(
                        mouthCenterX, mouthCenterY,
                        mouthWidth / 2.5, mouthHeight * 0.8,
                        0, 0, Math.PI * 2
                    );
                    ctx.fill();
                    
                    // Upper lip - realistic curve
                    ctx.strokeStyle = `rgba(255, 200, 255, ${mouthGlow})`;
                    ctx.lineWidth = 3;
                    ctx.shadowBlur = 6;
                    ctx.shadowColor = 'rgba(138, 43, 226, 0.5)';
                    
                    ctx.beginPath();
                    ctx.moveTo(leftMouth.x * width, upperLip.y * height);
                    ctx.quadraticCurveTo(
                        mouthCenterX - mouthWidth * 0.15, upperLip.y * height - 3,
                        mouthCenterX, upperLip.y * height - 1
                    );
                    ctx.quadraticCurveTo(
                        mouthCenterX + mouthWidth * 0.15, upperLip.y * height - 3,
                        rightMouth.x * width, upperLip.y * height
                    );
                    ctx.stroke();
                    
                    // Lower lip - fuller curve
                    ctx.beginPath();
                    ctx.moveTo(leftMouth.x * width, lowerLip.y * height);
                    ctx.quadraticCurveTo(
                        mouthCenterX - mouthWidth * 0.2, lowerLip.y * height + 4,
                        mouthCenterX, lowerLip.y * height + 2
                    );
                    ctx.quadraticCurveTo(
                        mouthCenterX + mouthWidth * 0.2, lowerLip.y * height + 4,
                        rightMouth.x * width, lowerLip.y * height
                    );
                    ctx.stroke();
                    
                    // Teeth hint - cosmic white
                    if (mouthOpening > 0.5) {
                        ctx.fillStyle = `rgba(255, 255, 255, ${mouthOpening * 0.7})`;
                        ctx.beginPath();
                        ctx.ellipse(
                            mouthCenterX, upperLip.y * height + 2,
                            mouthWidth * 0.3, 2,
                            0, 0, Math.PI * 2
                        );
                        ctx.fill();
                    }
                    
                } else {
                    // Mouth is closed - draw as realistic lip line
                    
                    // Lip highlight gradient
                    const lipGradient = ctx.createLinearGradient(
                        leftMouth.x * width, mouthCenterY,
                        rightMouth.x * width, mouthCenterY
                    );
                    lipGradient.addColorStop(0, `rgba(255, 180, 255, ${mouthGlow * 0.6})`);
                    lipGradient.addColorStop(0.5, `rgba(255, 200, 255, ${mouthGlow * 0.8})`);
                    lipGradient.addColorStop(1, `rgba(255, 180, 255, ${mouthGlow * 0.6})`);
                    
                    ctx.strokeStyle = lipGradient;
                    ctx.lineWidth = 4;
                    ctx.shadowBlur = 8;
                    ctx.shadowColor = 'rgba(138, 43, 226, 0.4)';
                    
                    // Realistic closed lip curve
                    ctx.beginPath();
                    ctx.moveTo(leftMouth.x * width, mouthCenterY);
                    ctx.quadraticCurveTo(
                        mouthCenterX - mouthWidth * 0.15, mouthCenterY - 2,
                        mouthCenterX, mouthCenterY
                    );
                    ctx.quadraticCurveTo(
                        mouthCenterX + mouthWidth * 0.15, mouthCenterY - 2,
                        rightMouth.x * width, mouthCenterY
                    );
                    ctx.stroke();
                    
                    // Subtle lower lip shadow
                    ctx.strokeStyle = `rgba(100, 50, 150, ${mouthGlow * 0.4})`;
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo(leftMouth.x * width, mouthCenterY + 2);
                    ctx.quadraticCurveTo(
                        mouthCenterX, mouthCenterY + 4,
                        rightMouth.x * width, mouthCenterY + 2
                    );
                    ctx.stroke();
                }
                
                ctx.shadowBlur = 0;
                
                // Enhanced cosmic sparkles around mouth when speaking
                if (mouthOpening > 0.4) {
                    for (let sparkle = 0; sparkle < 16; sparkle++) {
                        const sparkleAngle = (sparkle * Math.PI * 2) / 16 + time * 1.8;
                        const sparkleRadius = 30 + Math.sin(time * 5 + sparkle) * 12;
                        const sparkleX = mouthCenterX + Math.cos(sparkleAngle) * sparkleRadius;
                        const sparkleY = mouthCenterY + Math.sin(sparkleAngle) * sparkleRadius;
                        const sparkleAlpha = Math.sin(time * 7 + sparkle) * 0.4 + 0.3;
                        const sparkleSize = 1.5 + Math.sin(time * 8 + sparkle) * 1;
                        
                        if (sparkle % 3 === 0) {
                            ctx.fillStyle = `rgba(255, 255, 255, ${sparkleAlpha})`;
                            this.drawStar(ctx, sparkleX, sparkleY, sparkleSize, sparkleAlpha);
                        } else {
                            ctx.fillStyle = `rgba(138, 43, 226, ${sparkleAlpha})`;
                            ctx.beginPath();
                            ctx.arc(sparkleX, sparkleY, sparkleSize * 0.8, 0, Math.PI * 2);
                            ctx.fill();
                        }
                    }
                }
            }
            
            // Cosmic constellation connecting facial features
            const constellationPoints = [leftEyeCenter, rightEyeCenter, mouthTop, landmarks[10]]; // eyes, mouth, forehead
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
            ctx.lineWidth = 1;
            
            ctx.beginPath();
            for (let i = 0; i < constellationPoints.length; i++) {
                const point = constellationPoints[i];
                if (point) {
                    if (i === 0) {
                        ctx.moveTo(point.x * width, point.y * height);
                    } else {
                        ctx.lineTo(point.x * width, point.y * height);
                    }
                }
            }
            ctx.stroke();
            
            // Enhanced floating cosmic particles with variety
            for (let particle = 0; particle < 45; particle++) {
                const particleAngle = (particle * Math.PI * 2) / 45 + time * 0.4;
                const particleRadius = 100 + Math.sin(time * 1.8 + particle) * 50;
                const particleX = faceCenter.x * width + Math.cos(particleAngle) * particleRadius;
                const particleY = faceCenter.y * height + Math.sin(particleAngle) * particleRadius;
                const particleAlpha = Math.sin(time * 2.5 + particle) * 0.4 + 0.3;
                const particleSize = Math.sin(time * 3.5 + particle) * 1.8 + 2.2;
                
                // Vary particle colors and shapes
                if (particle % 4 === 0) {
                    ctx.fillStyle = `rgba(138, 43, 226, ${particleAlpha})`;
                    this.drawStar(ctx, particleX, particleY, particleSize * 0.8, particleAlpha);
                } else if (particle % 4 === 1) {
                    ctx.fillStyle = `rgba(75, 0, 130, ${particleAlpha})`;
                    ctx.beginPath();
                    ctx.arc(particleX, particleY, particleSize, 0, Math.PI * 2);
                    ctx.fill();
                } else if (particle % 4 === 2) {
                    ctx.fillStyle = `rgba(255, 255, 255, ${particleAlpha})`;
                    this.drawStar(ctx, particleX, particleY, particleSize * 1.2, particleAlpha);
                } else {
                    ctx.fillStyle = `rgba(147, 112, 219, ${particleAlpha})`;
                    ctx.beginPath();
                    ctx.arc(particleX, particleY, particleSize * 0.6, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
            
            ctx.globalAlpha = 1;
        },

        drawHandCosmic(landmarks, width, height, color) {
            const time = Date.now() * 0.001;
            
            // Cosmic hand with starry glow
            ctx.globalAlpha = 0.9;
            
            // Purple gradient background around hand
            const palm = landmarks[0];
            const handGradient = ctx.createRadialGradient(
                palm.x * width, palm.y * height, 20,
                palm.x * width, palm.y * height, 80
            );
            handGradient.addColorStop(0, 'rgba(138, 43, 226, 0.3)');
            handGradient.addColorStop(0.5, 'rgba(75, 0, 130, 0.2)');
            handGradient.addColorStop(1, 'rgba(25, 25, 112, 0.1)');
            
            ctx.fillStyle = handGradient;
            ctx.beginPath();
            ctx.arc(palm.x * width, palm.y * height, 80, 0, Math.PI * 2);
            ctx.fill();
            
            // Cosmic hand structure
            const connections = [
                [0, 1], [1, 2], [2, 3], [3, 4],
                [0, 5], [5, 6], [6, 7], [7, 8],
                [0, 9], [9, 10], [10, 11], [11, 12],
                [0, 13], [13, 14], [14, 15], [15, 16],
                [0, 17], [17, 18], [18, 19], [19, 20]
            ];
            
            // Glowing hand lines
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.lineWidth = 2;
            ctx.shadowBlur = 10;
            ctx.shadowColor = 'rgba(138, 43, 226, 0.5)';
            
            ctx.beginPath();
            for (const connection of connections) {
                const start = landmarks[connection[0]];
                const end = landmarks[connection[1]];
                ctx.moveTo(start.x * width, start.y * height);
                ctx.lineTo(end.x * width, end.y * height);
            }
            ctx.stroke();
            
            ctx.shadowBlur = 0;
            
            // Stars at each joint
            for (let i = 0; i < landmarks.length; i++) {
                const joint = landmarks[i];
                const starBrightness = Math.sin(time * 3 + i) * 0.4 + 0.6;
                
                ctx.fillStyle = `rgba(255, 255, 255, ${starBrightness})`;
                this.drawStar(ctx, joint.x * width, joint.y * height, 2, starBrightness);
            }
            
            // Cosmic energy at fingertips
            const fingertips = [4, 8, 12, 16, 20];
            for (const tip of fingertips) {
                const point = landmarks[tip];
                
                // Fingertip glow
                const tipGlow = Math.sin(time * 4 + tip) * 0.3 + 0.7;
                const tipGradient = ctx.createRadialGradient(
                    point.x * width, point.y * height, 3,
                    point.x * width, point.y * height, 15
                );
                tipGradient.addColorStop(0, `rgba(138, 43, 226, ${tipGlow})`);
                tipGradient.addColorStop(1, 'rgba(75, 0, 130, 0)');
                
                ctx.fillStyle = tipGradient;
                ctx.beginPath();
                ctx.arc(point.x * width, point.y * height, 15, 0, Math.PI * 2);
                ctx.fill();
                
                // Cosmic particles from fingertips
                for (let particle = 0; particle < 5; particle++) {
                    const particleAngle = (particle * Math.PI * 2) / 5 + time * 2;
                    const particleRadius = 10 + Math.sin(time * 5 + particle) * 5;
                    const particleX = point.x * width + Math.cos(particleAngle) * particleRadius;
                    const particleY = point.y * height + Math.sin(particleAngle) * particleRadius;
                    const particleAlpha = Math.sin(time * 6 + particle) * 0.4 + 0.3;
                    
                    ctx.fillStyle = `rgba(255, 255, 255, ${particleAlpha})`;
                    this.drawStar(ctx, particleX, particleY, 1, particleAlpha);
                }
            }
            
            // Cosmic constellation in palm
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.lineWidth = 1;
            
            ctx.save();
            ctx.translate(palm.x * width, palm.y * height);
            ctx.rotate(time * 0.2);
            
            // Draw cosmic symbol
            ctx.beginPath();
            for (let i = 0; i < 6; i++) {
                const angle = (i * Math.PI * 2) / 6;
                const x = 8 * Math.cos(angle);
                const y = 8 * Math.sin(angle);
                
                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.closePath();
            ctx.stroke();
            
            ctx.restore();
            
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