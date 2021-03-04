var gameDuration = 10;
var lockoutDuration = 0.6;
var left = 0;
var up = 1;
var right = 2;
var shakesPerSec = 8;
var shakeRotationsPerSec = 0.25;
var shakeDuration = 0.4;
var arrowZoomDuration = 0.5;

var score = 0;
var highScore = 0;
var state = "menu"; // menu, gaming, results
var gameStartTime = -1000;
var timeLastLockedOut = -1000;
var direction = 0;
var elapsedTime = 0;
var timeLastScored = -1000;
var oldDir = 1;

function setup()
{
    frameRate(60);
	let c = createCanvas(windowWidth, windowHeight);
    // c.elt.style = 'max-width: 100%; max-height: 100%;';
	textAlign(CENTER, CENTER);
    textSize(12);
    fill(255);
    strokeWeight(1);
    angleMode(DEGREES);
    noStroke();
}

function draw() 
{
    background(0);
    
    switch(state)
    {
        case "menu":
            drawMenu();
            break;
        
        case "gaming":
            drawGaming();
            break;
        
        case "results":
            drawResults();
            break;
    }
    
    elapsedTime += (deltaTime/1000);
}

function drawMenu()
{
    textSize(windowWidth * 0.1);
    text("react", windowWidth*0.5, windowHeight*0.4);
    textSize(windowWidth * 0.03);
    text("press any arrow key to start", windowWidth/2, windowHeight*0.6);
    
    if(highScore > 0)
    {
        textSize(windowWidth * 0.02);
        text("high score: " + highScore, windowWidth/2, windowHeight*0.95);
    }
}

function drawGaming()
{
    let shake = getShake();
    let shakeAmount = max(0, shakeDuration - timeSinceLastLockout()) / shakeDuration;
    
    translate(
        shake.x * shakeAmount * windowWidth * 0.01,
        shake.y * shakeAmount * windowWidth * 0.01
    );
    
    // draw prev arrow success zoom
    let percentZoomed = (elapsedTime - timeLastScored) / arrowZoomDuration;
    let zoomColor = lerp(.4, 0, percentZoomed);
    let zoomScale = lerp(.2, .9, percentZoomed);
    
    fill(zoomColor * 255);
    textSize(windowWidth * zoomScale);
    
    switch(oldDir)
    {
        case up:
            text("↑", windowWidth/2, windowHeight/2);
            break;
        
        case left:
            text("←", windowWidth/2, windowHeight/2);
            break;
        
        case right:
            text("→", windowWidth/2, windowHeight/2);
            break;
    }
    
    
    // draw current arrow
    textSize(windowWidth * 0.15);
    fill(255);
    let drawDir = (timeSinceLastLockout() > lockoutDuration) ? direction : oldDir;
    switch(drawDir)
    {
        case up:
            text("↑", windowWidth/2, windowHeight/2);
            break;
        
        case left:
            text("←", windowWidth/2, windowHeight/2);
            break;
        
        case right:
            text("→", windowWidth/2, windowHeight/2);
            break;
    }
    
    // draw timer progress bar
    fill(0.4 * 255);
    rect(0, windowHeight*0.95, windowWidth, windowHeight*0.1);
    fill(0.8 * 255);
    rect(0, windowHeight*0.95, windowWidth * ((elapsedTime - gameStartTime) / gameDuration), windowHeight*0.1);
    
    if(timeSinceLastLockout() < lockoutDuration)
    {
        // draw lockout X
        textSize(windowWidth * 0.2);
        fill(color(255,0,0));
        text("X", windowWidth/2, windowHeight/2);
    }
    
    if(elapsedTime - gameStartTime > gameDuration)
    {
        if(score > highScore)
        {
            highScore = score;
        }
        
        state = "results";
    }
}

function drawResults()
{
    textSize(windowWidth * 0.1);
    fill(255);
    
    text("score: " + score, windowWidth*0.5, windowHeight*0.4);
    text("high score: " + highScore, windowWidth*0.5, windowHeight*0.6);
}

function getRandomInt(max)
{
    return Math.floor(Math.random() * Math.floor(max));
}

function windowResized()
{
    resizeCanvas(windowWidth, windowHeight);
}

function timeSinceLastLockout()
{
    return elapsedTime - timeLastLockedOut;
}

function keyPressed()
{
    let inputDir = -2;
    
    switch(keyCode)
    {
        case RIGHT_ARROW:
            inputDir = right;
            break;
            
        case LEFT_ARROW:
            inputDir = left;
            break;
            
        case UP_ARROW:
            inputDir = up;
            break;
        
        case DOWN_ARROW:
            inputDir = -1;
            break;
    }
    
    switch(state)
    {
        case "menu":
            if(inputDir >= -1)
            {
                timeLastLockedOut = -1000;
                timeLastScored = -1000;
                gameStartTime = elapsedTime;
                score = 0;
                direction = getRandomInt(3);
                state = "gaming";
            }
            break;
        
        case "gaming":
            if(timeSinceLastLockout() > lockoutDuration)
            {
                if(inputDir >= 0)
                {
                    oldDir = direction;
                    
                    if(inputDir === direction)
                    {
                        ++score;
                        timeLastScored = elapsedTime;
                        direction = getRandomInt(3);
                    }
                    else
                    {
                        timeLastLockedOut = elapsedTime;
                        direction = getRandomInt(3);
                    }
                }
            }
            break;
        
        case "results":
            if(elapsedTime - gameStartTime > gameDuration + 0.5)
            {
                if(inputDir >= -1)
                {
                    state = "menu";
                }
            }
            break;
    }
}

function getShake()
{
    let ret = new Object();
    let shakeScalar = sin(elapsedTime * shakesPerSec * 360);
    
    ret.x = cos(elapsedTime * shakeRotationsPerSec * 360) * shakeScalar;
    ret.y = sin(elapsedTime * shakeRotationsPerSec * 360) * shakeScalar;
    
    return ret;
}




































