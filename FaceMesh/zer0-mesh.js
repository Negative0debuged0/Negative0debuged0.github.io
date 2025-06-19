export default function(ctx) {
    // Cache commonly used values and patterns
    const matrixChars = '01ZERØ{}[]<>/\\|#$%^&*+=~`"\'';
    const codeElements = ['null', 'void', '404', 'err', '0x00'];
    let lastDrawTime = 0;
    const MIN_FRAME_TIME = 16; // Cap at ~60fps

    return {
        drawZer0(landmarks, width, height, color) {
            // Skip frames if too soon since last draw
            const currentTime = Date.now();
            if (currentTime - lastDrawTime < MIN_FRAME_TIME) return;
            lastDrawTime = currentTime;

            const time = currentTime * 0.001;
            
            // Base chromatic aberration effect
            ctx.globalCompositeOperation = 'lighter';
            
            // Optimize matrix background by reducing density
            this.drawCodeMatrix(ctx, width, height, time);
            
            // Reduce error message frequency
            if (Math.random() > 0.7) {
                this.drawErrorMessages(ctx, width, height, time);
            }

            // RGB Channel Splits with optimized calculations
            const channels = [
                { color: 'rgba(255, 0, 0, 0.7)', offsetRange: 8 },
                { color: 'rgba(200, 0, 0, 0.7)', offsetRange: 6 },
                { color: 'rgba(150, 0, 0, 0.7)', offsetRange: 4 }
            ];

            // Cache facial feature connections
            const connections = [10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109];

            // Batch rendering for color channels
            for (const channel of channels) {
                ctx.strokeStyle = channel.color;
                ctx.lineWidth = 1;
                ctx.beginPath();

                for (let i = 0; i < connections.length - 1; i++) {
                    const start = landmarks[connections[i]];
                    const end = landmarks[connections[i + 1]];

                    if (start && end) {
                        const glitchX = (Math.random() - 0.5) * channel.offsetRange;
                        const glitchY = (Math.random() - 0.5) * channel.offsetRange;
                        const waveOffset = Math.sin(time * 0.005 + i * 0.1) * 3;

                        // Add code segments less frequently
                        if (i % 5 === 0) {
                            this.drawCodeSegment(ctx, 
                                start.x * width + glitchX, 
                                start.y * height + glitchY,
                                end.x * width + glitchX,
                                end.y * height + glitchY,
                                time
                            );
                        }

                        ctx.moveTo(start.x * width + glitchX + waveOffset, start.y * height + glitchY);
                        ctx.lineTo(end.x * width + glitchX + waveOffset, end.y * height + glitchY);
                    }
                }
                ctx.stroke();
            }

            // Optimize code artifacts
            ctx.fillStyle = 'rgba(255, 0, 0, 0.4)';
            ctx.font = '8px monospace';
            for (let i = 0; i < landmarks.length; i += 4) { // Reduced frequency
                if (Math.random() > 0.9) {
                    const landmark = landmarks[i];
                    const element = codeElements[Math.floor(Math.random() * codeElements.length)];
                    ctx.fillText(element, landmark.x * width, landmark.y * height);
                }
            }

            // Enhanced facial features with optimized code elements
            const keyPoints = {
                leftEye: [33, 7, 163, 144, 145, 153, 154, 155, 133, 33],
                rightEye: [362, 382, 381, 380, 374, 373, 390, 249, 263, 362],
                mouth: [78, 80, 13, 312, 310, 415, 308, 318, 402, 317, 14, 87, 178, 88]
            };

            ctx.globalAlpha = 0.8;
            ctx.strokeStyle = 'rgba(255, 50, 50, 0.8)';
            ctx.lineWidth = 2;

            // Batch render facial features
            for (const feature in keyPoints) {
                const points = keyPoints[feature];
                const timeOffset = time * 0.003;

                // Draw code brackets around eyes only
                if (feature === 'leftEye' || feature === 'rightEye') {
                    const center = landmarks[points[0]];
                    this.drawCodeBrackets(ctx, center.x * width, center.y * height, time);
                }

                if (feature === 'mouth') {
                    const mouthCenter = landmarks[13];
                    const mouthTop = landmarks[78];
                    const mouthBottom = landmarks[14];
                    
                    if (mouthCenter && mouthTop && mouthBottom) {
                        const mouthHeight = Math.abs(mouthTop.y - mouthBottom.y) * height;
                        const isOpen = mouthHeight > 5;
                        
                        ctx.beginPath();
                        const leftCorner = landmarks[78];
                        const rightCorner = landmarks[308];
                        
                        if (isOpen) {
                            const openAmount = Math.min(mouthHeight * 1.5, 30);
                        
                            ctx.moveTo(leftCorner.x * width, leftCorner.y * height);
                            ctx.lineTo(rightCorner.x * width, rightCorner.y * height);
                            ctx.lineTo(rightCorner.x * width, mouthBottom.y * height + openAmount * 0.5);
                            ctx.lineTo(leftCorner.x * width, mouthBottom.y * height + openAmount * 0.5);
                            ctx.closePath();
                            
                            ctx.fillStyle = 'rgba(20, 0, 0, 0.8)';
                            ctx.fill();
                            
                            // Reduced binary stream density
                            ctx.fillStyle = 'rgba(255, 0, 0, 0.6)';
                            ctx.font = '8px monospace';
                            const streamCount = Math.min(Math.floor(openAmount / 10) + 2, 5);
                            for (let i = 0; i < streamCount; i++) {
                                const y = mouthTop.y * height + (openAmount * (i + 1) / (streamCount + 1));
                                ctx.fillText('01', mouthCenter.x * width - 10, y);
                            }
                        } else {
                            const glitchOffset = Math.sin(time * 10) * 2;
                            const centerY = (leftCorner.y + rightCorner.y) * height / 2;
                            
                            const segments = 3; // Reduced segments
                            for (let i = 0; i < segments; i++) {
                                const startX = leftCorner.x * width + (rightCorner.x - leftCorner.x) * width * i / segments;
                                const endX = leftCorner.x * width + (rightCorner.x - leftCorner.x) * width * (i + 1) / segments;
                                const offsetY = Math.sin(time * 5 + i) * 1;
                                
                                ctx.moveTo(startX - glitchOffset, centerY + offsetY);
                                ctx.lineTo(endX + glitchOffset, centerY + offsetY);
                            }
                        }
                        ctx.stroke();
                        
                        // Digital corners
                        this.drawDigitalCorner(ctx, leftCorner.x * width, leftCorner.y * height, isOpen ? 4 : 3);
                        this.drawDigitalCorner(ctx, rightCorner.x * width, rightCorner.y * height, isOpen ? 4 : 3);
                        
                        // Status text only when state changes
                        if (Math.random() > 0.8) {
                            ctx.fillStyle = 'rgba(255, 0, 0, 0.4)';
                            ctx.font = '6px monospace';
                            ctx.fillText(isOpen ? 'OPEN' : 'CLOSED', mouthCenter.x * width - 20, mouthCenter.y * height - 15);
                        }
                    }
                } else {
                    ctx.beginPath();
                    for (let i = 0; i < points.length; i++) {
                        const point = landmarks[points[i]];
                        const glitchOffset = Math.sin(timeOffset + i * 0.5) * 4;

                        if (i === 0) {
                            ctx.moveTo(point.x * width + glitchOffset, point.y * height);
                        } else {
                            ctx.lineTo(point.x * width + glitchOffset, point.y * height);
                        }
                    }
                    ctx.closePath();
                    ctx.stroke();
                }
            }

            // Add function signatures less frequently
            if (Math.random() > 0.7) {
                const forehead = landmarks[10];
                if (forehead) {
                    ctx.font = '10px monospace';
                    ctx.fillStyle = 'rgba(255, 50, 50, 0.6)';
                    const codeLines = [
                        'class Zer0 extends Null {',
                        '  constructor() {',
                        '    super(void);',
                        '  }',
                        '}'
                    ];
                    
                    for (let i = 0; i < codeLines.length; i++) {
                        ctx.fillText(codeLines[i], 
                            forehead.x * width - 80, 
                            forehead.y * height - 30 + (i * 10));
                    }
                }
            }

            // Reduced frequency of status indicators and memory addresses
            if (Math.random() > 0.6) {
                this.drawSystemStatus(ctx, landmarks, width, height, time);
                this.drawMemoryAddresses(ctx, landmarks, width, height, time);
            }

            // Enhanced terminal less frequently
            if (Math.random() > 0.7) {
                this.drawEnhancedTerminal(ctx, landmarks, width, height, time);
            }

            ctx.globalCompositeOperation = 'source-over';
            ctx.globalAlpha = 1;
        },

        drawCodeMatrix(ctx, width, height, time) {
            // Reduced matrix density
            ctx.fillStyle = 'rgba(255, 0, 0, 0.1)';
            ctx.font = '10px monospace';
            
            for (let i = 0; i < 40; i++) { // Reduced from 70 to 40
                const x = Math.random() * width;
                const y = ((time * 100 + i * 50) % height);
                const char = matrixChars[Math.floor(Math.random() * matrixChars.length)];
                const alpha = Math.sin(time + i) * 0.3 + 0.3;
                ctx.fillStyle = `rgba(255, 0, 0, ${alpha})`;
                ctx.fillText(char, x, y);
            }
        },

        drawErrorMessages(ctx, width, height, time) {
            const errors = [
                'ERR_NULL_POINTER',
                'SEGMENTATION_FAULT',
                'MEMORY_CORRUPTION',
                'STACK_OVERFLOW',
                'BUFFER_OVERFLOW'
            ];
            
            ctx.font = '8px monospace';
            ctx.fillStyle = 'rgba(255, 30, 30, 0.5)';
            
            for (let i = 0; i < 3; i++) {
                const error = errors[Math.floor(time + i) % errors.length];
                const y = (time * 50 + i * 30) % height;
                ctx.fillText(error, 10, y);
            }
        },

        drawSystemStatus(ctx, landmarks, width, height, time) {
            const statuses = [
                'CPU: 99.9%',
                'MEM: 0xFFFF',
                'SYS: CRITICAL',
                'NET: OFFLINE'
            ];

            ctx.font = '8px monospace';
            ctx.fillStyle = 'rgba(255, 50, 50, 0.7)';
            
            const rightTemple = landmarks[356];
            if (rightTemple) {
                statuses.forEach((status, i) => {
                    const blink = Math.sin(time * 3 + i) > 0 ? 1 : 0.5;
                    ctx.fillStyle = `rgba(255, 50, 50, ${blink})`;
                    ctx.fillText(status, 
                        rightTemple.x * width + 20, 
                        rightTemple.y * height + i * 10);
                });
            }
        },

        drawMemoryAddresses(ctx, landmarks, width, height, time) {
            ctx.font = '7px monospace';
            ctx.fillStyle = 'rgba(255, 30, 30, 0.6)';
            
            const addresses = Array.from({length: 8}, (_, i) => 
                `0x${(Math.floor(time * 1000) + i * 16).toString(16).toUpperCase().padStart(8, '0')}`
            );
            
            const leftTemple = landmarks[127];
            if (leftTemple) {
                addresses.forEach((addr, i) => {
                    ctx.fillText(addr, 
                        leftTemple.x * width - 70, 
                        leftTemple.y * height + i * 8);
                });
            }
        },

        drawEnhancedTerminal(ctx, landmarks, width, height, time) {
            const chin = landmarks[152];
            if (chin) {
                ctx.strokeStyle = 'rgba(255, 50, 50, 0.6)';
                ctx.fillStyle = 'rgba(20, 0, 0, 0.3)';
                ctx.lineWidth = 1;
                
                const termX = chin.x * width - 70;
                const termY = chin.y * height + 20;
                ctx.fillRect(termX, termY, 140, 60);
                ctx.strokeRect(termX, termY, 140, 60);
                
                // Terminal header
                ctx.fillStyle = 'rgba(255, 50, 50, 0.8)';
                ctx.fillRect(termX, termY, 140, 12);
                ctx.font = '8px monospace';
                ctx.fillStyle = 'rgba(20, 0, 0, 0.8)';
                ctx.fillText('ZER0 TERMINAL v1.0', termX + 5, termY + 8);
                
                // Terminal content
                ctx.fillStyle = 'rgba(255, 50, 50, 0.8)';
                const commands = [
                    '> initialize.exe',
                    '> loading modules...',
                    '> system.void.null',
                    `> ${Math.floor(time * 100) % 1000}ms`
                ];
                
                commands.forEach((cmd, i) => {
                    const blink = i === commands.length - 1 ? 
                        (Math.floor(time * 2) % 2 ? '_' : '') : '';
                    ctx.fillText(cmd + blink, termX + 5, termY + 25 + i * 10);
                });
            }
        },

        drawCodeBrackets(ctx, x, y, time) {
            const brackets = ['<', '>', '{', '}', '[', ']'];
            ctx.font = '12px monospace';
            ctx.fillStyle = 'rgba(255, 50, 50, 0.8)';
            
            brackets.forEach((bracket, i) => {
                const offset = Math.sin(time * 2 + i) * 5;
                ctx.fillText(bracket, x + offset - 20 + i * 8, y);
            });
        },

        drawCodeSegment(ctx, x1, y1, x2, y2, time) {
            const codeSnippets = ['if(', 'while(', 'for(', 'return', 'void'];
            const snippet = codeSnippets[Math.floor(time % codeSnippets.length)];
            
            ctx.save();
            ctx.translate((x1 + x2) / 2, (y1 + y2) / 2);
            ctx.rotate(Math.atan2(y2 - y1, x2 - x1));
            ctx.fillStyle = 'rgba(255, 50, 50, 0.6)';
            ctx.font = '8px monospace';
            ctx.fillText(snippet, 0, 0);
            ctx.restore();
        },

        drawHexScroll(ctx, width, height, time) {
            ctx.font = '8px monospace';
            ctx.fillStyle = 'rgba(255, 30, 30, 0.4)';
            
            for (let i = 0; i < 10; i++) {
                const hex = '0x' + Math.floor(Math.random() * 16777215).toString(16);
                ctx.fillText(hex, 10, height - 10 - i * 10);
            }
        },

        drawTerminalWindow(ctx, landmarks, width, height, time) {
            const chin = landmarks[152];
            if (chin) {
                ctx.strokeStyle = 'rgba(255, 50, 50, 0.6)';
                ctx.fillStyle = 'rgba(20, 0, 0, 0.3)';
                ctx.lineWidth = 1;
                
                // Terminal window
                const termX = chin.x * width - 50;
                const termY = chin.y * height + 20;
                ctx.fillRect(termX, termY, 100, 40);
                ctx.strokeRect(termX, termY, 100, 40);
                
                // Terminal content
                ctx.fillStyle = 'rgba(255, 50, 50, 0.8)';
                ctx.font = '8px monospace';
                ctx.fillText('> zer0.exe', termX + 5, termY + 15);
                ctx.fillText('> executing...', termX + 5, termY + 30);
            }
        },

        drawHandZer0(landmarks, width, height, color) {
            const time = Date.now() * 0.001;
            
            // Red cyberpunk hand with enhanced coding elements
            ctx.globalAlpha = 0.9;
            
            // Binary streams flowing through palm
            const palm = landmarks[0];
            const binaryStream = '01001010101000111101';
            ctx.font = '8px monospace';
            
            for (let i = 0; i < 8; i++) {
                const streamAngle = (i * Math.PI * 2) / 8 + time;
                const streamLength = 40;
                const startX = palm.x * width;
                const startY = palm.y * height;
                
                for (let j = 0; j < 5; j++) {
                    const t = j / 4;
                    const x = startX + Math.cos(streamAngle) * (streamLength * t);
                    const y = startY + Math.sin(streamAngle) * (streamLength * t);
                    const char = binaryStream[(i + j + Math.floor(time * 5)) % binaryStream.length];
                    const alpha = 1 - t;
                    
                    ctx.fillStyle = `rgba(255, 0, 0, ${alpha})`;
                    ctx.fillText(char, x, y);
                }
            }
            
            // Enhanced digital aura with code matrix
            const handGradient = ctx.createRadialGradient(
                palm.x * width, palm.y * height, 20,
                palm.x * width, palm.y * height, 70
            );
            handGradient.addColorStop(0, 'rgba(255, 50, 50, 0.4)');
            handGradient.addColorStop(0.6, 'rgba(200, 30, 30, 0.2)');
            handGradient.addColorStop(1, 'rgba(150, 20, 20, 0)');
            
            ctx.fillStyle = handGradient;
            ctx.beginPath();
            ctx.arc(palm.x * width, palm.y * height, 70, 0, Math.PI * 2);
            ctx.fill();
            
            // Code segments along bones
            const connections = [
                [0, 1], [1, 2], [2, 3], [3, 4],
                [0, 5], [5, 6], [6, 7], [7, 8],
                [0, 9], [9, 10], [10, 11], [11, 12],
                [0, 13], [13, 14], [14, 15], [15, 16],
                [0, 17], [17, 18], [18, 19], [19, 20]
            ];
            
            // Enhanced connection lines with code flow
            ctx.strokeStyle = 'rgba(255, 80, 80, 0.9)';
            ctx.lineWidth = 3;
            ctx.shadowBlur = 8;
            ctx.shadowColor = 'rgba(255, 60, 60, 0.6)';
            
            // Draw code-like structures along connections
            for (const connection of connections) {
                const start = landmarks[connection[0]];
                const end = landmarks[connection[1]];
                const glitch = Math.sin(time * 8 + connection[0]) * 1;
                
                // Main connection line
                ctx.beginPath();
                ctx.moveTo(start.x * width + glitch, start.y * height);
                ctx.lineTo(end.x * width + glitch, end.y * height);
                ctx.stroke();
                
                // Add code segments along connections
                const midX = (start.x + end.x) * width / 2;
                const midY = (start.y + end.y) * height / 2;
                const codeSnippets = ['if()', 'void', 'null', 'return', '0x00'];
                ctx.font = '6px monospace';
                ctx.fillStyle = `rgba(255, 50, 50, ${0.7 + Math.sin(time * 3) * 0.3})`;
                ctx.fillText(codeSnippets[connection[0] % codeSnippets.length], midX, midY);
            }
            
            // Enhanced digital nodes at joints with hex codes
            for (let i = 0; i < landmarks.length; i++) {
                const joint = landmarks[i];
                const nodeGlow = Math.sin(time * 4 + i) * 0.3 + 0.7;
                
                // Hexagonal node base
                ctx.beginPath();
                this.drawHexNode(ctx, joint.x * width, joint.y * height, 4, time + i);
                ctx.fillStyle = `rgba(255, 80, 80, ${nodeGlow})`;
                ctx.fill();
                ctx.stroke();
                
                // Memory addresses at major joints
                if ([0, 5, 9, 13, 17].includes(i)) {
                    const addr = (0xFFF0 + i).toString(16).toUpperCase();
                    ctx.fillStyle = `rgba(255, 120, 120, ${nodeGlow})`;
                    ctx.font = '6px monospace';
                    ctx.textAlign = 'center';
                    ctx.fillText(`0x${addr}`, joint.x * width, joint.y * height - 8);
                }
            }
            
            // Enhanced fingertip displays with terminal windows
            const fingertips = [4, 8, 12, 16, 20];
            const commands = ['pwd>', 'ls>', 'cd>', 'rm>', 'su>'];
            
            for (let i = 0; i < fingertips.length; i++) {
                const tip = landmarks[fingertips[i]];
                const tipGlow = Math.sin(time * 3 + i) * 0.3 + 0.7;
                
                // Mini terminal window
                ctx.fillStyle = 'rgba(20, 20, 20, 0.8)';
                ctx.strokeStyle = `rgba(255, 80, 80, ${tipGlow})`;
                ctx.lineWidth = 1;
                
                // Terminal box
                ctx.fillRect(tip.x * width - 15, tip.y * height - 15, 30, 20);
                ctx.strokeRect(tip.x * width - 15, tip.y * height - 15, 30, 20);
                
                // Command text
                ctx.fillStyle = `rgba(255, 120, 120, ${tipGlow})`;
                ctx.font = '6px monospace';
                ctx.textAlign = 'left';
                ctx.fillText(commands[i], tip.x * width - 12, tip.y * height - 5);
                
                // Blinking cursor
                if (Math.floor(time * 2) % 2 === 0) {
                    ctx.fillText('_', tip.x * width + 8, tip.y * height - 5);
                }
                
                // Data streams from terminals
                for (let stream = 0; stream < 3; stream++) {
                    const streamAngle = (stream * Math.PI * 2) / 3 + time * 2;
                    const streamLength = 12;
                    const bits = '10';
                    
                    for (let bit = 0; bit < 3; bit++) {
                        const t = bit / 2;
                        const x = tip.x * width + Math.cos(streamAngle) * (streamLength * t);
                        const y = tip.y * height + Math.sin(streamAngle) * (streamLength * t);
                        const alpha = 1 - t;
                        
                        ctx.fillStyle = `rgba(255, 100, 100, ${alpha})`;
                        ctx.fillText(bits[bit % 2], x, y);
                    }
                }
            }
            
            // Enhanced palm interface with system status
            const interfaceSize = 30;
            ctx.fillStyle = 'rgba(20, 20, 20, 0.8)';
            ctx.strokeStyle = 'rgba(255, 60, 60, 0.9)';
            ctx.lineWidth = 1;
            
            // Main interface panel
            ctx.fillRect(palm.x * width - interfaceSize/2, palm.y * height - interfaceSize/2, interfaceSize, interfaceSize);
            ctx.strokeRect(palm.x * width - interfaceSize/2, palm.y * height - interfaceSize/2, interfaceSize, interfaceSize);
            
            // Status text
            ctx.font = '6px monospace';
            ctx.fillStyle = `rgba(255, 120, 120, ${0.7 + Math.sin(time * 2) * 0.3})`;
            ctx.textAlign = 'left';
            const stats = [
                'SYS:ACTIVE',
                `MEM:${Math.floor(time * 100) % 1000}KB`,
                'CPU:99.9%'
            ];
            
            stats.forEach((stat, i) => {
                ctx.fillText(stat, palm.x * width - 12, palm.y * height - 8 + i * 8);
            });
            
            // Matrix rain effect around hand
            const matrixChars = '01ZER0<>{}[]()!=';
            for (let i = 0; i < 20; i++) {
                const angle = (i * Math.PI * 2) / 20 + time;
                const radius = 60 + Math.sin(time * 2 + i) * 10;
                const x = palm.x * width + Math.cos(angle) * radius;
                const y = palm.y * height + Math.sin(angle) * radius;
                const char = matrixChars[Math.floor((time * 5 + i) % matrixChars.length)];
                const alpha = 0.3 + Math.sin(time * 3 + i) * 0.2;
                
                ctx.fillStyle = `rgba(255, 80, 80, ${alpha})`;
                ctx.font = '8px monospace';
                ctx.fillText(char, x, y);
            }
            
            ctx.globalAlpha = 1;
        },

        drawDigitalCorner(ctx, x, y, size) {
            // Draw a digital-style corner marker
            ctx.strokeStyle = 'rgba(255, 0, 0, 0.8)';
            ctx.lineWidth = 1;
            
            // Horizontal line
            ctx.beginPath();
            ctx.moveTo(x - size, y);
            ctx.lineTo(x + size, y);
            ctx.stroke();
            
            // Vertical line
            ctx.beginPath(); 
            ctx.moveTo(x, y - size);
            ctx.lineTo(x, y + size);
            ctx.stroke();
            
            // Corner dot
            ctx.fillStyle = 'rgba(255, 0, 0, 0.9)';
            ctx.beginPath();
            ctx.arc(x, y, 1, 0, Math.PI * 2);
            ctx.fill();
        },

        drawHexNode(ctx, x, y, size, rotation) {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rotation);
            
            ctx.beginPath();
            for (let i = 0; i < 6; i++) {
                const angle = (i * Math.PI * 2) / 6;
                const px = Math.cos(angle) * size;
                const py = Math.sin(angle) * size;
                if (i === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
            }
            ctx.closePath();
            
            ctx.restore();
        }
    };
}