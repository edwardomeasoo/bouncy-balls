// setup canvas

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

// function to generate random number

function random(min, max) {
  const num = Math.floor(Math.random() * (max - min + 1)) + min;
  return num;
}

// generates a random color represented as an rgb() string
function randomRGB() {
  return `rgb(${random(0,255)},${random(0,255)},${random(0,255)})`;
}

// ball object, created with inputs x, y, velX, velY, color, size
class Ball {
  constructor(x, y, velX, velY, color, size) {
    // x and y coord are measured from top left corner of window as (0,0)
    // size = radius in px
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.color = color;
    this.size = size;
  }

  // drawing the ball
  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    // draw arc: x&y of arc center, radius, start and end position of arc in radians
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill(); // finish path started with beginPath(), fill area with fillStyle
  }

  // updating ball position - reverse velocity if ball hits edge of window
  update() {
    // ball hits right edge
    if ((this.x + this.size) >= width) { this.velX = -(this.velX); }
    // ball hits left edge
    if ((this.x - this.size) <= 0) { this.velX = -this.velX; }
    // ball hits bottom edge
    if ((this.y - this.size) <= 0) { this.velY = -this.velY; }
    // ball hits top edge
    if ((this.y + this.size) >= height) { this.velY = -this.velY; }

    this.x += this.velX;
    this.y += this.velY;
  }

  collisionDetect() {
    for (const ball of balls) {
      // skip loop if ball being updated (this) is the ball being looped over (ball)
      if (!(this === ball)) {
        const dx = this.x - ball.x;
        const dy = this.y - ball.y;
        const dist = Math.sqrt( dx ** 2 + dy ** 2 );

        // check collision, update color of both balls
        if (dist < (this.size + ball.size )) {
          this.color = ball.color = randomRGB();
        }
      }
    }
  }
}

// add balls to canvas, animate them
const balls = [];

while (balls.length < 25) {
  const size = random(10,20);
  const ball = new Ball(
    // initial position > 1 width away from window edge
    random( 0+size, width-size ),
    random( 0+size, width-size ),
    random( -7, 7 ),
    random( -7, 7 ),
    randomRGB(),
    size
  );

  balls.push(ball);
}

function loop() { 
  // animation loop- each new frame will darken previous frame, then draw new balls
  // draw rectangle to fill window, colour it transparent black
  ctx.fillStyle = 'rgba(0,0,0,0.25)'; 
  ctx.fillRect( 0, 0, width, height );

  // draw balls, update position
  for (const ball of balls) {
    ball.draw();
    ball.update();
    ball.collisionDetect();
  }
  requestAnimationFrame(loop);
}

loop();