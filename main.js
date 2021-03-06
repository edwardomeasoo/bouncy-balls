// setup canvas

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

const scoreDisplay = document.querySelector('#ball-count');
// function to generate random number

function random(min, max) {
  const num = Math.floor(Math.random() * (max - min + 1)) + min;
  return num;
}

// generates a random color represented as an rgb() string
function randomRGB() {
  return `rgb(${random(0,255)},${random(0,255)},${random(0,255)})`;
}

class Shape {
  constructor( x, y, velX, velY ) {
    // x and y coord are measured from top left corner of window as (0,0)
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
  }
}

// ball object, created with inputs x, y, velX, velY, color, size
class Ball extends Shape {
  constructor( x, y, velX, velY, color, size ) {
    super( x, y, velX, velY );
    this.color = color;
    this.size = size; // size = radius in px
    this.exists = true; // tracks if ball has been eaten by player
  }

  // drawing the ball, based on position, size, colour
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
      if (!(this === ball) && ball.exists) {
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

// player controlled object
class EvilCircle extends Shape {
  constructor( x, y ) {
    super( x, y, 20, 20 );
    this.color = 'white';
    this.size = 10; // size = radius in px
    // enable user to move evil circle with wasd
    window.addEventListener('keydown', (e) => {
      switch( e.key ) {
        case 'w':
          this.y -= this.velY;
          break;
        case 'a':
          this.x -= this.velX;
          break;
        case 's':
          this.y += this.velY;
          break;
        case 'd':
          this.x += this.velX;
          break;
      }
    });
  }

  // drawing the evil circle - don't fill, only outline
  draw() {
    ctx.beginPath();
    ctx.strokeStyle = this.color;
    // increase line thickness
    ctx.lineWidth = 3;
    // draw arc: x&y of arc center, radius, start and end position of arc in radians
    ctx.arc( this.x, this.y, this.size, 0, 2 * Math.PI );
    ctx.stroke(); // finish path started with beginPath(), fill area with fillStyle
  }

  // updating evil circle position - bounce if evil circle hits edge of window
  checkBounds() {
    // right edge
    if ((this.x + this.size) >= width) { this.x -= this.size; }
    // left edge
    if ((this.x - this.size) <= 0) { this.x += this.size; }
    // bottom edge
    if ((this.y - this.size) <= 0) { this.y += this.size; }
    // top edge
    if ((this.y + this.size) >= height) { this.y -= this.size; }
  }

  collisionDetect() {
    for (const ball of balls) {
      // check if ball has already been eaten
      if (ball.exists) {
        const dx = this.x - ball.x;
        const dy = this.y - ball.y;
        const dist = Math.sqrt( dx ** 2 + dy ** 2 );

        // check collision, update color of both balls
        if (dist < (this.size + ball.size )) {
          ball.exists = false;
        }
      }
    }
  }
}

// create, add Ball instances to canvas
const balls = [];

while (balls.length < 25) {
  const size = random(10,20);
  const ball = new Ball(
    // initial position > 1 width away from window edge
    random( 0+size, width-size ),
    random( 0+size, width-size ),
    random( -5, 5 ),
    random( -5, 5 ),
    randomRGB(),
    size
  );

  balls.push(ball);
}

const ec = new EvilCircle( 
  random( 10, width-10 ), 
  random( 10, width-10 )
  );

function loop() { 
  // animation loop- each new frame will darken previous frame, then draw new balls
  // draw rectangle to fill window, colour it transparent black
  ctx.fillStyle = 'rgba(0,0,0,0.25)'; 
  ctx.fillRect( 0, 0, width, height );

  // draw balls and evil circle, update position
  let ballCount = 0;
  for (const ball of balls) {
    if (ball.exists) {  
      ball.draw();
      ball.update();
      ball.collisionDetect();
      ballCount++;
    }
    ec.draw();
    ec.checkBounds();
    ec.collisionDetect();
  }
  scoreDisplay.textContent = ballCount;
  requestAnimationFrame(loop);
}

loop();