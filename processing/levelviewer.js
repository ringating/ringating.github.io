var myp5 = new p5( function( sketch )
{
	var argStr = "";
	var canvasWidth = 0;
	var canvasHeight = 0;
	var cellLength = 0;
	var maxCanvasDimension = 800;
	var myCanvas;
	var canvasElt;
	var forceDraw = false;

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
		
		sketch.strokeWeight(2);
		argStr = sketch.getURL();
		argStr = argStr.slice(argStr.indexOf("?") + 1);
		console.log("argStr = \"" + argStr + "\"");
	}

	function myDraw()
	{
		console.log("in draw(), canvasWidth="+canvasWidth+", canvasHeight="+canvasHeight);
			
		// ----- draw -----
		
		sketch.fill(255);
		sketch.background(0);
		
		sketch.textAlign(sketch.CENTER, sketch.CENTER);
		sketch.textSize(60);
		sketch.text(argStr, myCanvas.width/2, myCanvas.height/2);
		
		//draw grid
		// asdf
	}

	sketch.setup = function()
	{
		mySetup();
		myDraw();
	}

	/*function draw() 
	{
		if(canvasWidth != canvas.width || canvasHeight != canvas.height || forceDraw)
		{
			canvasWidth = canvas.width;
			canvasHeight = canvas.height;
		}
	}*/

	sketch.windowResized = function()
	{
		sketch.resizeCanvas(calcWidth(), calcHeight());
		canvasElt.style.width = '100%';
		canvasElt.style.height = '100%';
		myDraw();
	}
});

