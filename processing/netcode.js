// game options
var gameWidth = 500;
var gameHeight = 500;
var playerWidth = 55;
var playerHeight = 100;
var walkSpeed = 2; // in units/frame
var jumpSpeed = 10; // in units/frame
var gravity = 4; // in units/frame/frame

class GameState
{
	constructor(posX, posY, velX, velY)
	{
		this.posX = posX;
		this.posY = posY;
		this.velX = velX;
		this.velY = velY;
	}
}

class PlayerInputs()
{
	constructor(left, right, jump)
	{
		this.left = left;
		this.right = right;
		this.jump = jump;
		this.jumpPrev = jumpPrev;
	}
}

function generateNextGameState(currentGameState, currentPlayerInput)
{
	var nextGameState = new GameState();
	
	// gravity
	if(currentGameState.posY > 0)
	{
		currentGameState.velY -= gravity;
	}
	else
	{
		currentGameState.velY = 0;
	}
	
	// jump
	if(currentPlayerInput.jump && (!currentPlayerInput.jumpPrev) && (currentGameState.posY == 0))
	{
		nextGameState.velY = jumpSpeed;
	}
	
	// walk
	nextGameState.velX = 0;
	if(currentPlayerInput.right){ nextGameState.velX += walkSpeed; }
	if(currentPlayerInput.left) { nextGameState.velX -= walkSpeed; }
	
	// update position using velocity
	currentGameState.posX += currentGameState.velX;
	currentGameState.posY += currentGameState.velY;
	
	// "collision" resolution
	currentGameState.posX = Math.max(0, Math.min(gameWidth - (playerWidth/2), currentGameState.posX));
	
	return nextGameState;
}

var myp5 = new p5( function( sketch )
{
	// options
	var maxCanvasDimension = 1600;
	var framerate = 60;
	
	var aspectRatio = 3/1;
	
	// variables
	var argStr;
	var myCanvas;
	var canvasElt;
	
	// game variables
	var pRadius = playerDiameter / 2;
	var xVel = 0;
	var yVel = 0;

	function calcWidth()
	{
		if(sketch.windowWidth > sketch.windowHeight)
		{
			return maxCanvasDimension;
		}
		else
		{
			return (sketch.windowWidth/sketch.windowHeight)*maxCanvasDimension;
		}
	}

	function calcHeight()
	{
		if(sketch.windowHeight > sketch.windowWidth)
		{
			return maxCanvasDimension;
		}
		else
		{
			return (sketch.windowHeight/sketch.windowWidth)*maxCanvasDimension;
		}
	}

	function mySetup()
	{
		myCanvas = sketch.createCanvas(calcWidth(), calcHeight());
		canvasElt = myCanvas.elt;
		canvasElt.style.width = '100%';
		canvasElt.style.height = '100%';
		
		console.log(myCanvas.width + " " + myCanvas.height);
		
		sketch.frameRate(framerate);
	}

	function myDraw()
	{
		sketch.strokeWeight(0);
		sketch.background(60);
		
		// draw rectangle
		var lvlWidth;
		var lvlHeight;
		if(aspectRatio < myCanvas.width/myCanvas.height)
		{
			// height limited
			lvlHeight = myCanvas.height;
			lvlWidth = aspectRatio * lvlHeight;
		}
		else
		{
			// width limited
			lvlWidth = myCanvas.width;
			lvlHeight = (1/aspectRatio) * lvlWidth;
		}
		sketch.fill(255);
		sketch.translate(myCanvas.width/2, myCanvas.height/2);
		sketch.rectMode(sketch.CENTER);
		sketch.rect(0, 0, lvlWidth, lvlHeight);
		sketch.translate(-lvlWidth/2, -lvlHeight/2);
		
		//draw stuff
		
		
	}
	
	function gameLoop()
	{
		
	}

	sketch.setup = function()
	{
		mySetup();
		myDraw();
	}
	
	sketch.draw = function()
	{
		gameLoop();
		myDraw();
	}

	sketch.windowResized = function()
	{
		sketch.resizeCanvas(calcWidth(), calcHeight());
		canvasElt.style.width = '100%';
		canvasElt.style.height = '100%';
		myDraw();
	}
});

