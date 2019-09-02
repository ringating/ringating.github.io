// game options
var gameWidth = 672;
var gameHeight = 378;
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
	if(currentGameState.posY <= 0)
	{
		nextGameState.velX = 0;
		if(currentPlayerInput.right){ nextGameState.velX += walkSpeed; }
		if(currentPlayerInput.left) { nextGameState.velX -= walkSpeed; }
	}
	
	// update position using velocity
	nextGameState.posX += nextGameState.velX;
	nextGameState.posY += nextGameState.velY;
	
	// "collision" resolution
	nextGameState.posX = Math.max(playerWidth/2, Math.min(gameWidth - (playerWidth/2), nextGameState.posX));
	
	return nextGameState;
}

var myp5 = new p5( function( sketch )
{
	// options
	var maxCanvasDimension = 1600;
	var framerate = 60;
	var aspectRatio = (gameWidth*2)/gameHeight;
	var defaultDelayFrames = 8;
	
	// variables
	var argStr;
	var myCanvas;
	var canvasElt;
	var delayFrames = defaultDelayFrames;
	
	// game state stuff
	var localGameState = new GameState(gameWidth/4,0,0,0);
	var localPlayerInputs = new PlayerInputs(0,0,0);
	
	var delayGameState = new GameState(gameWidth/4,0,0,0);
	var inputQueue = new Array(delayFrames); // initializes to undefined
	
	var rollbackGameState = new GameState(gameWidth/4,0,0,0);
	var bestRealInput;
	var bestRealGameState;
	
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
		
		
		// draw stuff
		
		// line
		sketch.fill(0);
		sketch.strokeWeight(4);
		sketch.strokeCap(sketch.SQUARE);
		sketch.line(lvlWidth/2, 0, lvlWidth/2, lvlHeight);
		sketch.strokeWeight(0);
		
		// text
		sketch.textAlign(sketch.LEFT, sketch.TOP);
		sketch.textSize(28);
		sketch.text("rollback", 12, 8);
		sketch.text("delay", lvlWidth/2 + 12, 8);
		sketch.fill(255);
		sketch.text("latency: " + delayFrames + " frames", 9, lvlHeight + 8);
		
		// rollback view
		sketch.push();
		sketch.fill(170,0,0);
		sketch.translate(lvlWidth,0);
		sketch.scale(-1,1);
		drawGameState(rollbackGameState, lvlWidth/2, 0, lvlWidth/2, lvlHeight);
		sketch.pop();
		sketch.fill(0,0,170);
		drawGameState(localGameState, 0, 0, lvlWidth/2, lvlHeight);
		//delay view
		sketch.push();
		sketch.fill(170,0,0);
		sketch.translate(lvlWidth,0);
		sketch.scale(-1,1);
		drawGameState(delayGameState, 0, 0, lvlWidth/2, lvlHeight);
		sketch.pop();
		sketch.fill(0,0,170);
		drawGameState(delayGameState, lvlWidth/2, 0, lvlWidth/2, lvlHeight);
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
	
	sketch.keyPressed = function()
	{
		if(sketch.keyCode === 38)
		{
			// increment delayFrames
			delayFrames++;
			inputQueue.unshift(undefined);
		}
		else if(sketch.keyCode === 40)
		{
			// decrement delayFrames
			if(delayFrames > 0)
			{
				delayFrames--;
				inputQueue.shift();
			}
		}
	}
	
	sketch.draw = function()
	{
		// update local gamestate
		localPlayerInputs = getPlayerInputs();
		localGameState = generateNextGameState(localGameState, localPlayerInputs);
		
		// update delay-based gamestate
		inputQueue.push(localPlayerInputs); // push new input to inputQueue
		if(inputQueue[0] == undefined)
		{
			// use old game state (game hangs)
		}
		else
		{
			delayGameState = generateNextGameState(delayGameState, inputQueue[0]);
			// store for rollback
			bestRealGameState = delayGameState;
			bestRealInput = inputQueue[0];
		}
		
		// update rollback gamestate
		if(bestRealInput != undefined)
		{
			rollbackGameState = bestRealGameState;
			for(let i = 0; i < delayFrames; ++i)
			{
				rollbackGameState = generateNextGameState(rollbackGameState, bestRealInput);
			}
		}
		
		inputQueue.shift(); // remove inputQueue[0]
		
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

