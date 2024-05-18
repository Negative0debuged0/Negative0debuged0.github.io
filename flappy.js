const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let bird = new Image();
bird.src = "https://via.placeholder.com/50"; // Default placeholder image

let birdX = 50;
let birdY = 150;
let birdWidth = 50;
let birdHeight = 50;
let gravity = 0.6;
let lift = -15;
let velocity = 0;

let pipes = [];
let frameCount = 0;
let gameStarted = false;

document.addEventListener("keydown", () => {
    if (!gameStarted) {
        gameStarted = true;
        loop();
    }
    velocity += lift;
});

document.getElementById("imageUpload").addEventListener("change", function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            bird.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

function drawBird() {
    ctx.drawImage(bird, birdX, birdY, birdWidth, birdHeight);
}

function drawPipes() {
    pipes.forEach(pipe => {
        ctx.fillStyle = "#8B4513"; // Brown color for pipes
        ctx.fillRect(pipe.x, 0, pipe.width, pipe.top);
        ctx.fillRect(pipe.x, canvas.height - pipe.bottom, pipe.width, pipe.bottom);
    });
}

function updatePipes() {
    if (frameCount % 90 === 0) {
        const pipeWidth = 50;
        const pipeGap = 150;
        const pipeTopHeight = Math.floor(Math.random() * (canvas.height - pipeGap));
        const pipeBottomHeight = canvas.height - pipeGap - pipeTopHeight;

        pipes.push({
            x: canvas.width,
            width: pipeWidth,
            top: pipeTopHeight,
            bottom: pipeBottomHeight
        });
    }

    pipes.forEach(pipe => {
        pipe.x -= 2;
    });

    pipes = pipes.filter(pipe => pipe.x + pipe.width > 0);
}

function detectCollision() {
    for (const pipe of pipes) {
        if (
            birdX < pipe.x + pipe.width &&
            birdX + birdWidth > pipe.x &&
            (birdY < pipe.top || birdY + birdHeight > canvas.height - pipe.bottom)
        ) {
            return true;
        }
    }
    return birdY + birdHeight > canvas.height || birdY < 0;
}

function loop() {
    if (detectCollision()) {
        alert("Game Over!");
        document.location.reload();
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBird();
    drawPipes();
    updatePipes();

    velocity += gravity;
    birdY += velocity;

    frameCount++;
    requestAnimationFrame(loop);
}

drawBird();
