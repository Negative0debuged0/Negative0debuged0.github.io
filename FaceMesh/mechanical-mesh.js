export default function(ctx) {
    return {
        drawMechanical(landmarks, width, height, color) {
            const time = Date.now() * 0.001;
            
            // Industrial mechanical face
            ctx.strokeStyle = '#696969';
            ctx.fillStyle = '#A9A9A9';
            ctx.lineWidth = 2;
            ctx.globalAlpha = 0.9;
            
            // Mechanical eyes with pistons
            const leftEye = landmarks[468];
            const rightEye = landmarks[473];
            
            if (leftEye && rightEye) {
                for (const eye of [leftEye, rightEye]) {
                    // Mechanical iris with rotation
                    ctx.strokeStyle = '#2F4F4F';
                    ctx.lineWidth = 3;
                    
                    ctx.save();
                    ctx.translate(eye.x * width, eye.y * height);
                    ctx.rotate(time * 2);
                    
                    // Iris mechanism
                    for (let i = 0; i < 8; i++) {
                        const angle = (i * Math.PI * 2) / 8;
                        ctx.beginPath();
                        ctx.moveTo(0, 0);
                        ctx.lineTo(Math.cos(angle) * 10, Math.sin(angle) * 10);
                        ctx.stroke();
                    }
                    
                    // Outer ring
                    ctx.beginPath();
                    ctx.arc(0, 0, 12, 0, Math.PI * 2);
                    ctx.stroke();
                    
                    ctx.restore();
                    
                    // Piston mechanism
                    const pistonExtension = Math.sin(time * 4) * 8 + 15;
                    ctx.strokeStyle = '#8B4513';
                    ctx.lineWidth = 4;
                    
                    ctx.beginPath();
                    ctx.moveTo(eye.x * width, eye.y * height - 12);
                    ctx.lineTo(eye.x * width, eye.y * height - pistonExtension);
                    ctx.stroke();
                    
                    // Piston head
                    ctx.fillStyle = '#A0522D';
                    ctx.fillRect(eye.x * width - 3, eye.y * height - pistonExtension - 5, 6, 5);
                }
            }
            
            // Mechanical mouth with hydraulics
            const mouth = landmarks[13];
            if (mouth) {
                // Main hydraulic cylinder
                ctx.strokeStyle = '#2F4F4F';
                ctx.lineWidth = 4;
                
                const cylinderWidth = 40;
                const cylinderHeight = 12;
                ctx.strokeRect(
                    mouth.x * width - cylinderWidth/2,
                    mouth.y * height - cylinderHeight/2,
                    cylinderWidth, cylinderHeight
                );
                
                // Hydraulic piston
                const pistonPos = Math.sin(time * 3) * 8;
                ctx.fillStyle = '#696969';
                ctx.fillRect(
                    mouth.x * width - 2,
                    mouth.y * height - cylinderHeight/2,
                    4, cylinderHeight
                );
                
                // Pressure gauges
                ctx.strokeStyle = '#B8860B';
                ctx.lineWidth = 2;
                
                for (let i = -1; i <= 1; i += 2) {
                    const gaugeX = mouth.x * width + i * 25;
                    const gaugeY = mouth.y * height;
                    
                    ctx.beginPath();
                    ctx.arc(gaugeX, gaugeY, 6, 0, Math.PI * 2);
                    ctx.stroke();
                    
                    // Gauge needle
                    const needleAngle = Math.sin(time * 2 + i) * Math.PI / 3;
                    ctx.beginPath();
                    ctx.moveTo(gaugeX, gaugeY);
                    ctx.lineTo(
                        gaugeX + Math.cos(needleAngle) * 4,
                        gaugeY + Math.sin(needleAngle) * 4
                    );
                    ctx.stroke();
                }
            }
            
            // Mechanical forehead with cooling vents
            const forehead = landmarks[10];
            if (forehead) {
                // Cooling vents
                ctx.strokeStyle = '#2F4F4F';
                ctx.lineWidth = 2;
                
                for (let vent = 0; vent < 5; vent++) {
                    const ventX = forehead.x * width + (vent - 2) * 8;
                    const ventY = forehead.y * height;
                    
                    ctx.beginPath();
                    ctx.moveTo(ventX, ventY - 10);
                    ctx.lineTo(ventX, ventY + 10);
                    ctx.stroke();
                    
                    // Heat visualization
                    const heat = Math.sin(time * 6 + vent) * 0.5 + 0.5;
                    ctx.fillStyle = `rgba(255, 100, 0, ${heat * 0.3})`;
                    ctx.fillRect(ventX - 1, ventY - 15, 2, 5);
                }
                
                // Central processor unit
                ctx.fillStyle = '#2F4F4F';
                ctx.fillRect(forehead.x * width - 15, forehead.y * height + 15, 30, 8);
                
                // LED indicators
                for (let led = 0; led < 6; led++) {
                    const ledX = forehead.x * width - 12 + led * 5;
                    const ledY = forehead.y * height + 19;
                    const ledState = Math.sin(time * 8 + led) > 0;
                    
                    ctx.fillStyle = ledState ? '#00FF00' : '#004400';
                    ctx.beginPath();
                    ctx.arc(ledX, ledY, 1.5, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
            
            // Mechanical joints at cheeks
            const leftCheek = landmarks[234];
            const rightCheek = landmarks[454];
            
            for (const cheek of [leftCheek, rightCheek]) {
                if (cheek) {
                    // Rotating joint
                    ctx.save();
                    ctx.translate(cheek.x * width, cheek.y * height);
                    ctx.rotate(time * 1.5);
                    
                    ctx.strokeStyle = '#8B4513';
                    ctx.lineWidth = 3;
                    
                    // Joint spokes
                    for (let i = 0; i < 6; i++) {
                        const angle = (i * Math.PI * 2) / 6;
                        ctx.beginPath();
                        ctx.moveTo(0, 0);
                        ctx.lineTo(Math.cos(angle) * 8, Math.sin(angle) * 8);
                        ctx.stroke();
                    }
                    
                    // Central hub
                    ctx.fillStyle = '#696969';
                    ctx.beginPath();
                    ctx.arc(0, 0, 3, 0, Math.PI * 2);
                    ctx.fill();
                    
                    ctx.restore();
                }
            }
            
            ctx.globalAlpha = 1;
        },

        drawHandMechanical(landmarks, width, height, color) {
            const time = Date.now() * 0.001;
            
            // Mechanical prosthetic hand
            ctx.strokeStyle = '#696969';
            ctx.fillStyle = '#A9A9A9';
            ctx.lineWidth = 2;
            ctx.globalAlpha = 0.9;
            
            // Mechanical hand structure with hydraulics
            const connections = [
                [0, 1], [1, 2], [2, 3], [3, 4],
                [0, 5], [5, 6], [6, 7], [7, 8],
                [0, 9], [9, 10], [10, 11], [11, 12],
                [0, 13], [13, 14], [14, 15], [15, 16],
                [0, 17], [17, 18], [18, 19], [19, 20]
            ];
            
            // Draw hydraulic lines
            ctx.strokeStyle = '#2F4F4F';
            ctx.lineWidth = 3;
            ctx.beginPath();
            for (const connection of connections) {
                const start = landmarks[connection[0]];
                const end = landmarks[connection[1]];
                ctx.moveTo(start.x * width, start.y * height);
                ctx.lineTo(end.x * width, end.y * height);
            }
            ctx.stroke();
            
            // Mechanical joints with rotation
            const joints = [0, 5, 9, 13, 17];
            for (const joint of joints) {
                const point = landmarks[joint];
                
                ctx.save();
                ctx.translate(point.x * width, point.y * height);
                ctx.rotate(time * 2 + joint);
                
                // Joint mechanism
                ctx.strokeStyle = '#8B4513';
                ctx.lineWidth = 2;
                
                for (let i = 0; i < 4; i++) {
                    const angle = (i * Math.PI * 2) / 4;
                    ctx.beginPath();
                    ctx.moveTo(0, 0);
                    ctx.lineTo(Math.cos(angle) * 4, Math.sin(angle) * 4);
                    ctx.stroke();
                }
                
                ctx.restore();
            }
            
            // Hydraulic actuators on fingers
            const fingertips = [4, 8, 12, 16, 20];
            for (const tip of fingertips) {
                const point = landmarks[tip];
                
                // Hydraulic cylinder
                ctx.strokeStyle = '#2F4F4F';
                ctx.lineWidth = 2;
                
                const cylinderLength = 12;
                ctx.strokeRect(
                    point.x * width - 2,
                    point.y * height - cylinderLength,
                    4, cylinderLength
                );
                
                // Piston head
                const pistonPos = Math.sin(time * 3 + tip) * 4;
                ctx.fillStyle = '#696969';
                ctx.fillRect(
                    point.x * width - 1,
                    point.y * height - cylinderLength + pistonPos,
                    2, 4
                );
                
                // Pressure indicator
                const pressure = Math.sin(time * 4 + tip) * 0.5 + 0.5;
                ctx.fillStyle = `rgba(255, 0, 0, ${pressure})`;
                ctx.beginPath();
                ctx.arc(point.x * width + 6, point.y * height - 6, 2, 0, Math.PI * 2);
                ctx.fill();
            }
            
            // Central control unit in palm
            const palm = landmarks[0];
            ctx.fillStyle = '#2F4F4F';
            ctx.fillRect(palm.x * width - 8, palm.y * height - 4, 16, 8);
            
            // Control panel LEDs
            for (let led = 0; led < 4; led++) {
                const ledX = palm.x * width - 6 + led * 4;
                const ledY = palm.y * height;
                const ledState = Math.sin(time * 6 + led) > 0;
                
                ctx.fillStyle = ledState ? '#00FF00' : '#004400';
                ctx.beginPath();
                ctx.arc(ledX, ledY, 1, 0, Math.PI * 2);
                ctx.fill();
            }
            
            // Cooling fans
            ctx.save();
            ctx.translate(palm.x * width, palm.y * height + 15);
            ctx.rotate(time * 8);
            
            ctx.strokeStyle = '#696969';
            ctx.lineWidth = 1;
            
            for (let blade = 0; blade < 6; blade++) {
                const angle = (blade * Math.PI * 2) / 6;
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(Math.cos(angle) * 6, Math.sin(angle) * 6);
                ctx.stroke();
            }
            
            ctx.restore();
            
            ctx.globalAlpha = 1;
        }
    };
}