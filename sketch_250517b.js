let moles = [];
let holes = [];
let score = 0;
let timer = 30;
let lastPop = 0;
let gameOver = false;
let gameStarted = false;
let frameCountStart = 0;

function setup() {
  createCanvas(600, 400);
  cursor('none');
  
  // Create 6 holes in a 3x2 grid
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 2; j++) {
      let x = 150 + j * 200;
      let y = 100 + i * 100;
      holes.push({ x: x, y: y });
      moles.push({ x: x, y: y, isUp: false, popTime: 0 });
    }
  }
}

function draw() {
  background(220);
  
  // Wait for 10 frames before starting the game to ensure initialization
  if (!gameStarted && frameCount < 10) {
    textSize(24);
    textAlign(CENTER);
    text('Loading...', width / 2, height / 2);
    return;
  }
  
  // Start the game after 10 frames
  if (!gameStarted) {
    gameStarted = true;
    frameCountStart = frameCount;
    console.log('Game started at frame:', frameCount);
  }
  
  // Display timer and score
  textSize(20);
  textAlign(LEFT);
  text('Score: ' + score, 10, 30);
  text('Time: ' + ceil(timer), 10, 60);
  
  // Update timer only if game is started and not over
  if (gameStarted && !gameOver) {
    timer -= deltaTime / 1000; // Decrease timer by seconds elapsed
    console.log('Timer:', timer, 'DeltaTime:', deltaTime); // Debug log
    if (timer <= 0) {
      timer = 0;
      gameOver = true;
      console.log('Game over triggered');
    }
  }
  
  // Handle mole popping
  if (!gameOver && millis() - lastPop > 1000) {
    popMole();
    lastPop = millis();
  }
  
  // Draw holes and moles
  for (let i = 0; i < holes.length; i++) {
    // Draw hole
    fill(0);
    ellipse(holes[i].x, holes[i].y, 50, 30);
    
    // Draw mole if up
    if (moles[i].isUp) {
      fill(139, 69, 19);
      ellipse(moles[i].x, moles[i].y - 20, 40, 40);
      fill(0);
      ellipse(moles[i].x - 10, moles[i].y - 25, 5, 5);
      ellipse(moles[i].x + 10, moles[i].y - 25, 5, 5);
      
      // Check if mole's time is up
      if (millis() - moles[i].popTime > 800) {
        moles[i].isUp = false;
      }
    }
  }
  
  // Draw hammer cursor
  fill(139, 69, 19);
  rect(mouseX - 10, mouseY - 30, 20, 30); // Handle
  fill(150);
  rect(mouseX - 20, mouseY - 30, 40, 20); // Head
  
  // Display game over screen
  if (gameOver) {
    textSize(32);
    textAlign(CENTER);
    fill(255, 0, 0);
    text('Game Over! Score: ' + score, width / 2, height / 2);
  }
}

function popMole() {
  // Find moles that are down
  let downMoles = moles.filter(mole => !mole.isUp);
  if (downMoles.length > 0) {
    let randomMole = random(downMoles);
    randomMole.isUp = true;
    randomMole.popTime = millis();
  }
}

function mousePressed() {
  if (!gameOver) {
    for (let mole of moles) {
      if (mole.isUp && dist(mouseX, mouseY, mole.x, mole.y - 20) < 20) {
        mole.isUp = false;
        score += 1;
      }
    }
  }
}
