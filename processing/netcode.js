// game options
var gameWidth = 500;
var gameHeight = 500;
var playerWidth = 55;
var playerHeight = 100;
var walkSpeed = 5; // in units/frame
var jumpSpeed = 20; // in units/frame
var gravity = 1; // in units/frame/frame

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

class PlayerInputs
{
	constructor(left, right, jump)
	{
		this.left = left;
		this.right = right;
		this.jump = jump;
	}
}

function generateNextGameState(currentGameState, currentPlayerInput)
{
	var nextGameState = new GameState(currentGameState.posX, currentGameState.posY, currentGameState.velX,currentGameState.velY);
	
	// gravity
	if(currentGameState.posY > 0)
	{
		nextGameState.velY -= gravity;
	}
	else
	{
		nextGameState.velY = 0;
	}
	
	// jump
	if(currentPlayerInput.jump && (currentGameState.posY == 0))
	{
		nextGameState.velY = jumpSpeed;
	}
	
	// walk
	nextGameState.velX = 0;
	if(currentPlayerInput.right){ nextGameState.velX += walkSpeed; /*console.log("trying to move right! velX="+nextGameState.velX);*/ }
	if(currentPlayerInput.left) { nextGameState.velX -= walkSpeed; }
	
	// update position using velocity
	nextGameState.posX += nextGameState.velX;
	nextGameState.posY += nextGameState.velY;
	
	// "collision" resolution
	nextGameState.posX = Math.max(playerWidth/2, Math.min(gameWidth - (playerWidth/2), nextGameState.posX));
	console.log(nextGameState.posX);
	
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
	
	// game state stuff
	var localGamestate = new GameState(0,0,0,0);
	var localPlayerInputs = new PlayerInputs(0,0,0);
	
	function getPlayerInputs()
	{
		return new PlayerInputs(
			sketch.keyIsDown(65) == true, // a
			sketch.keyIsDown(68) == true, // d
			(sketch.keyIsDown(87) || sketch.keyIsDown(32)) == true // w or space
		);
	}

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
		sketch.fill(0);
		drawGameState(localGamestate, 0, 0, lvlWidth/3, lvlHeight);
		drawGameState(localGamestate, lvlWidth/3, 0, lvlWidth/3, lvlHeight);
		drawGameState(localGamestate, 2*lvlWidth/3, 0, lvlWidth/3, lvlHeight);
	}
	
	function drawGameState(gs, x, y, w, h)
	{
		sketch.rectMode(sketch.CENTER);
		sketch.rect(
			x + sketch.map(gs.posX, 0, gameWidth, 0, w),
			y + h - sketch.map(gs.posY + (playerHeight/2), 0, gameHeight, 0, h),
			sketch.map(playerWidth, 0, gameWidth, 0, w),
			sketch.map(playerHeight, 0, gameHeight, 0, h)
		);
	}

	sketch.setup = function()
	{
		mySetup();
		myDraw();
	}
	
	sketch.draw = function()
	{
		localPlayerInputs = getPlayerInputs();
		localGamestate = generateNextGameState(localGamestate, localPlayerInputs);
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

