/*
  Code modified from:
  http://www.lostdecadegames.com/how-to-make-a-simple-html5-canvas-game/
  using graphics purchased from vectorstock.com
*/

/* Initialization.
Here, we create and add our "canvas" to the page.
We also load all of our images. 
*/
console.log("hello");
let canvas;
let ctx;
let width = 1500;
let height = 700;
let speed = 9;

canvas = document.createElement("canvas");
ctx = canvas.getContext("2d");
canvas.width = width;
canvas.height = height;
document.body.appendChild(canvas);

let bgReady, heroReady, monsterReady;
let bgImage, heroImage, monsterImage;
const rocks = ["rock1", "rock2", "rock3", "rock4", "rock5"];
const monsters = [
  "monster1",
  "monster01",
  "monster02",
  "monster03",
  "monster04",
  "monster05"
];
const heroHeight = 120;
const heroWidth = 100;
const monsterHeight = 150;
const monsterWidth = 200;
let velX, velY;
const maxVel = 10;

let monstersNum = 0;
let isWon = false;
let isOver = false;

let startTime, elapsedTime;
const SECONDS_PER_ROUND = 30;

function randomNumber(range) {
  return Math.floor(Math.random() * range);
}

function loadImages() {
  bgImage = new Image();
  bgImage.onload = function() {
    // show the background image
    bgReady = true;
  };
  bgImage.src = "images/bg.png";
  heroImage = new Image();
  heroImage.onload = function() {
    // show the hero image
    heroReady = true;
  };
  heroImage.src = "images/hero1.png";

  monsterImage = new Image();
  monsterImage.onload = function() {
    // show the monster image
    monsterReady = true;
  };
  monsterImage.src = `images/${
    monsters[randomNumber(monsters.length - 1)]
  }.png`;
}

/**
 * Setting up our characters.
 *
 * Note that heroX represents the X position of our hero.
 * heroY represents the Y position.
 * We'll need these values to know where to "draw" the hero.
 *
 * The same applies to the monster.
 */

let heroX, heroY, monsterX, monsterY;
let keysDown = {};

function newGame() {
  heroX = canvas.width / 2;
  heroY = canvas.height / 2;

  monsterX = randomNumber(width - monsterWidth) + 10;
  monsterY = randomNumber(height - monsterHeight) + 10;
  velX = randomNumber(maxVel);
  velY = randomNumber(maxVel);

  monstersNum = 0;
  isWon = false;
  isOver = false;

  startTime = Date.now();
  elapsedTime = 0;

  keysDown = {};
}

/**
 * Keyboard Listeners
 * You can safely ignore this part, for now.
 *
 * This is just to let JavaScript know when the user has pressed a key.
 */
let buttonX = 600;
let buttonY = 400;
let buttonW = 400;
let buttonH = 50;

function setupKeyboardListeners() {
  // Check for keys pressed where key represents the keycode captured
  // For now, do not worry too much about what's happening here.
  addEventListener(
    "keydown",
    function(key) {
      keysDown[key.keyCode] = true;
    },
    false
  );

  addEventListener(
    "keyup",
    function(key) {
      delete keysDown[key.keyCode];
    },
    false
  );

  addEventListener("click", function(event) {
    // Control that click event occurred within position of button
    // NOTE: This assumes canvas is positioned at top left corner
    if (
      event.x > buttonX &&
      event.x < buttonX + buttonW &&
      event.y > buttonY &&
      event.y < buttonY + buttonH
    ) {
      newGame();
    }
  });
}

/**
 *  Update game objects - change player position based on key pressed
 *  and check to see if the monster has been caught!
 *
 *  If you change the value of 5, the player will move at a different rate.
 */
let update = function() {
  // Update the time.
  elapsedTime = Math.floor((Date.now() - startTime) / 1000);

  // Update game state
  if (monstersNum >= 20) {
    isWon = true;
  } else if (elapsedTime >= SECONDS_PER_ROUND) {
    isOver = true;
  }
  if (38 in keysDown && heroY > 10) {
    // Player is holding up key
    heroY -= speed;
  }
  if (40 in keysDown && heroY < height - heroHeight) {
    // Player is holding down key
    heroY += speed;
  }
  if (37 in keysDown && heroX > 10) {
    // Player is holding left key
    heroX -= speed;
  }
  if (39 in keysDown && heroX < width - heroWidth) {
    // Player is holding right key
    heroX += speed;
  }

  monsterX = (monsterX + (velX - maxVel / 2) + width) % width;
  monsterY = (monsterY + (velY - maxVel / 2) + height) % height;
  // Check if player and monster collided. Our images
  // are about 32 pixels big.
  let distanceX = heroX - monsterX;
  let distanceY = heroY - monsterY;
  if (
    distanceX <= monsterWidth &&
    distanceX >= -heroWidth &&
    distanceY <= monsterHeight &&
    distanceY >= -heroHeight
  ) {
    // Pick a new location for the monster.
    // Note: Change this to place the monster at a new, random location.
    monsterX = randomNumber(width - monsterWidth) + 10;
    monsterY = randomNumber(height - monsterHeight) + 10;
    velX = randomNumber(maxVel);
    velY = randomNumber(maxVel);
    monsterImage.src = `images/${
      monsters[randomNumber(monsters.length - 1)]
    }.png`;
    monstersNum += 1;
  }
};

/**
 * This function, render, runs as often as possible.
 */
var render = function() {
  if (bgReady) {
    ctx.drawImage(bgImage, 0, 0, width, height);
    ctx.font = "30pt Georgia";
    ctx.fillStyle = "white";
  }
  if (heroReady) {
    ctx.drawImage(heroImage, heroX, heroY, heroWidth, heroHeight);
  }
  if (monsterReady) {
    ctx.drawImage(
      monsterImage,
      monsterX,
      monsterY,
      monsterWidth,
      monsterHeight
    );
  }
  ctx.fillText(`Seconds Remaining: ${SECONDS_PER_ROUND - elapsedTime}`, 20, 50);
  ctx.fillText(`Monsters caught: ${monstersNum}`, width * 0.7, 50);
  if (isOver) {
    ctx.fillText("Time's up! Game Over!", buttonX, buttonY - 20);
    ctx.font = "18pt Georgia";
    ctx.fillText("Click to start a new game.", buttonX + 50, buttonY + 30);
  } else if (isWon) {
    ctx.fillText(
      `You won! You finished in ${elapsedTime}`,
      buttonX,
      buttonY - 20
    );
    ctx.font = "18pt Georgia";
    ctx.fillText("Click to start a new game.", buttonX + 50, buttonY + 30);
  }
};

/**
 * The main game loop. Most every game will have two distinct parts:
 * update (updates the state of the game, in this case our hero and monster)
 * render (based on the state of our game, draw the right things)
 */
var main = function() {
  if (!(isOver || isWon)) {
    update();
  }

  render();
  // Request to do this again ASAP. This is a special method
  // for web browsers.
  requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame.
// Safely ignore this line. It's mostly here for people with old web browsers.
var w = window;
requestAnimationFrame =
  w.requestAnimationFrame ||
  w.webkitRequestAnimationFrame ||
  w.msRequestAnimationFrame ||
  w.mozRequestAnimationFrame;

// Let's play this game!
loadImages();
setupKeyboardListeners();
newGame();
main();
