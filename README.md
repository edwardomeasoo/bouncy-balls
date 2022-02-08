# Bouncy Ball Display in Window
Practice for object theory and syntax details.
Using the [Canvas](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Client-side_web_APIs/Drawing_graphics) API and [requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) API, write a bouncing balls demo.
The balls will bounce around the screen, and change colour when they touch each other.
## Version 1
- Balls will start with random position, velocity, colour.
- Balls will bounce (reverse velocity) if they hit an edge of the window.
- If two balls collide, they will both be assigned a new random colour.
## Version 2
- Refactor Ball class to extend from a generic Shape class.
- Create a user controllable "evil circle", which will eat any ball it touches.
- Add a score counter to track the number of balls left to capture.
