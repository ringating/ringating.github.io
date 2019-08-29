class GameState
{
	posX;
	posY;
	velX;
	velY;
	grounded;
	
	constructor(posX, posY, velX, velY, grounded)
	{
		this.posX = posX;
		this.posY = posY;
		this.velX = velX;
		this.velY = velY;
		this.grounded = grounded;
	}
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
	
	// game options, units are in cells
	var playerDiameter = 1 / 1.61803398875; // ~0.618
	var gravity = 9.8;
	var jumpSpeed = 6;
	
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

	sketch.setup = function()
	{
		mySetup();
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

