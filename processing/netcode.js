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
	var defaultDelayFrames = 10;
	var defaultHybridDelayFrames = 3;
	
	// variables
	var argStr;
	var myCanvas;
	var canvasElt;
	var delayFrames = defaultDelayFrames;
	var hybridDelayFrames = defaultHybridDelayFrames;
	
	// game state stuff
	var localGameState = new GameState(gameWidth/4,0,0,0);
	var localPlayerInputs = new PlayerInputs(0,0,0);
	
	var delayGameState = new GameState(gameWidth/4,0,0,0);
	var inputQueue = new Array(delayFrames); // assumed that elements initialize to undefined
	
	var rollbackGameState = new GameState(gameWidth/4,0,0,0);
	var rollbackInputQueue = new Array(hybridDelayFrames); // assumed that elements initialize to undefined
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
		sketch.textStyle(sketch.BOLD);
		sketch.text("rollback", 12, 8);
		sketch.textStyle(sketch.NORMAL);
		sketch.textSize(20);
		sketch.text("fixed input buffer:\nrollback/prediction:", 12, 44);
		sketch.text(hybridDelayFrames + " frames  ◄ ►\n" + (delayFrames - hybridDelayFrames) + " frames", 186, 44);
		sketch.textSize(28);
		sketch.textStyle(sketch.BOLD);
		sketch.text("delay (lockstep)", lvlWidth/2 + 12, 8);
		sketch.textStyle(sketch.NORMAL);
		sketch.textSize(20);
		sketch.text("input buffer: " + delayFrames + " frames", lvlWidth/2 + 12, 44);
		sketch.textSize(28);
		sketch.fill(255);
		sketch.textAlign(sketch.LEFT, sketch.BOTTOM);
		sketch.text("one-way network latency: " + delayFrames + " frames  ▲▼", 9, -8);
		sketch.textSize(20);
		sketch.text((delayFrames*2*16.66666666666).toFixed(2) + " ms ping or lower", 9, -44);
		sketch.textAlign(sketch.RIGHT, sketch.BOTTOM);
		//sketch.text("CONTROLS\n\nwalk with A and D\njump with W or Space\n\nadjust network latency with the Up and Down arrow keys\nadjust the fixed input buffer for \"rollback\" with the Left and Right arrow keys", lvlWidth - 8, -8);
		sketch.textSize(28);
		//sketch.textStyle(sketch.BOLD);
		sketch.text("CONTROLS", lvlWidth - 8, -62);
		sketch.textSize(20);
		sketch.textStyle(sketch.NORMAL);
		sketch.text("walk with A and D\njump with W or Space", lvlWidth - 8, -8);
		sketch.textAlign(sketch.LEFT, sketch.TOP);
		sketch.text("For reference, NRS games that utilize rollback netcode have a 3 frame\nconstant/fixed input buffer and support up to 7 frames of rollback/prediction.", 8, lvlHeight  + 8);
		sketch.textAlign(sketch.RIGHT, sketch.TOP);
		sketch.text("adjust certain values with the arrow keys.\nrefresh the page to reset these values.", lvlWidth - 8, lvlHeight  + 8);
		
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
		if(sketch.keyCode === 38) // up arrow
		{
			// increment delayFrames
			delayFrames++;
			inputQueue.unshift(undefined);
		}
		else if(sketch.keyCode === 40) // down arrow
		{
			// decrement delayFrames
			if(delayFrames > 0)
			{
				delayFrames--;
				inputQueue.shift();
				if(hybridDelayFrames > delayFrames)
				{
					// force decrement delay frames
					hybridDelayFrames--;
					rollbackInputQueue.shift();
				}
			}
		}
		else if(sketch.keyCode === 39) // right arrow
		{
			// increment hybridDelayFrames
			if(hybridDelayFrames < delayFrames)
			{
				hybridDelayFrames++;
				rollbackInputQueue.unshift(undefined);
			}
		}
		else if(sketch.keyCode === 37) // left arrow
		{
			// decrement hybridDelayFrames
			if(hybridDelayFrames > 0)
			{
				hybridDelayFrames--;
				rollbackInputQueue.shift();
			}
		}
	}
	
	sketch.draw = function()
	{
		localPlayerInputs = getPlayerInputs();
		
		// update fixed delay (local) gamestate
		//localGameState = generateNextGameState(localGameState, localPlayerInputs);
		rollbackInputQueue.push(localPlayerInputs);
		if(rollbackInputQueue[0] == undefined)
		{
			// use old game state (game hangs)
		}
		else
		{
			localGameState = generateNextGameState(localGameState, rollbackInputQueue[0]);
		}
		
		// update delay-based gamestate
		inputQueue.push(localPlayerInputs);
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
			for(let i = 0; i < (delayFrames - hybridDelayFrames); ++i)
			{
				rollbackGameState = generateNextGameState(rollbackGameState, bestRealInput);
			}
		}
		
		inputQueue.shift(); // remove inputQueue[0]
		rollbackInputQueue.shift();
		
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

