// Pong Game Variables
const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Game constants
const WIDTH = canvas.width;
const HEIGHT = canvas.height;

const PADDLE_WIDTH = 12;
const PADDLE_HEIGHT = 100;
const PADDLE_MARGIN = 20;
const BALL_RADIUS = 10;
const PADDLE_SPEED = 6; // AI paddle speed

// Paddles and Ball
let leftPaddle = {
    x: PADDLE_MARGIN,
    y: HEIGHT/2 - PADDLE_HEIGHT/2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    color: '#04f9f9'
};
let rightPaddle = {
    x: WIDTH - PADDLE_MARGIN - PADDLE_WIDTH,
    y: HEIGHT/2 - PADDLE_HEIGHT/2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    color: '#ff2079'
};
let ball = {
    x: WIDTH/2,
    y: HEIGHT/2,
    radius: BALL_RADIUS,
    speed: 6,
    velocityX: 6 * (Math.random() < 0.5 ? 1 : -1),
    velocityY: 4 * (Math.random() < 0.5 ? 1 : -1),
    color: '#fff'
};

// Score
let leftScore = 0;
let rightScore = 0;

// Draw Rectangle
function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

// Draw Circle
function drawCircle(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI*2, false);
    ctx.closePath();
    ctx.fill();
}

// Draw Text
function drawText(text, x, y, color) {
    ctx.fillStyle = color;
    ctx.font = "50px Segoe UI, Arial";
    ctx.textAlign = "center";
    ctx.fillText(text, x, y);
}

// Draw Net
function drawNet() {
    for(let i = 0; i < HEIGHT; i += 30) {
        drawRect(WIDTH/2 - 2, i, 4, 18, "#fff");
    }
}

// Reset Ball
function resetBall() {
    ball.x = WIDTH/2;
    ball.y = HEIGHT/2;
    ball.velocityX = ball.speed * (Math.random() < 0.5 ? 1 : -1);
    ball.velocityY = (Math.random() * 6 - 3) || 3; // avoid 0 velocity
}

// Collision Detection
function collision(b, p) {
    return (
        b.x + b.radius > p.x &&
        b.x - b.radius < p.x + p.width &&
        b.y + b.radius > p.y &&
        b.y - b.radius < p.y + p.height
    );
}

// Update Game
function update() {
    // Move ball
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    // Top & Bottom wall collision
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > HEIGHT) {
        ball.velocityY = -ball.velocityY;
    }

    // Left paddle collision
    if (collision(ball, leftPaddle)) {
        ball.x = leftPaddle.x + leftPaddle.width + ball.radius; // reposition outside paddle
        let collidePoint = (ball.y - (leftPaddle.y + leftPaddle.height/2));
        collidePoint = collidePoint / (leftPaddle.height/2);
        let angle = collidePoint * (Math.PI/4);
        let direction = 1;
        ball.velocityX = direction * ball.speed * Math.cos(angle);
        ball.velocityY = ball.speed * Math.sin(angle);
        ball.speed += 0.5;
    }

    // Right paddle collision
    if (collision(ball, rightPaddle)) {
        ball.x = rightPaddle.x - ball.radius; // reposition outside paddle
        let collidePoint = (ball.y - (rightPaddle.y + rightPaddle.height/2));
        collidePoint = collidePoint / (rightPaddle.height/2);
        let angle = collidePoint * (Math.PI/4);
        let direction = -1;
        ball.velocityX = direction * ball.speed * Math.cos(angle);
        ball.velocityY = ball.speed * Math.sin(angle);
        ball.speed += 0.5;
    }

    // Left & Right wall (score)
    if (ball.x - ball.radius < 0) {
        rightScore++;
        ball.speed = 6;
        resetBall();
    }
    if (ball.x + ball.radius > WIDTH) {
        leftScore++;
        ball.speed = 6;
        resetBall();
    }

    // AI for right paddle
    let target = ball.y - rightPaddle.height/2;
    if (rightPaddle.y < target) {
        rightPaddle.y += Math.min(PADDLE_SPEED, target - rightPaddle.y);
    } else if (rightPaddle.y > target) {
        rightPaddle.y -= Math.min(PADDLE_SPEED, rightPaddle.y - target);
    }
    // Clamp right paddle within the canvas
    rightPaddle.y = Math.max(Math.min(rightPaddle.y, HEIGHT - rightPaddle.height), 0);
}

// Render Game
function render() {
    // Clear canvas
    drawRect(0, 0, WIDTH, HEIGHT, "#111");

    // Draw net
    drawNet();

    // Draw score
    drawText(leftScore, WIDTH/4, 60, "#04f9f9");
    drawText(rightScore, 3*WIDTH/4, 60, "#ff2079");

    // Draw paddles
    drawRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height, leftPaddle.color);
    drawRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height, rightPaddle.color);

    // Draw ball
    drawCircle(ball.x, ball.y, ball.radius, ball.color);
}

// Game Loop
function gameLoop() {
    update();
    render();
    requestAnimationFrame(gameLoop);
}

// Mouse Movement for left paddle
canvas.addEventListener('mousemove', function(evt) {
    let rect = canvas.getBoundingClientRect();
    let mouseY = evt.clientY - rect.top;
    leftPaddle.y = mouseY - leftPaddle.height / 2;
    // Clamp paddle within canvas
    leftPaddle.y = Math.max(Math.min(leftPaddle.y, HEIGHT - leftPaddle.height), 0);
});

// Start the game
gameLoop();