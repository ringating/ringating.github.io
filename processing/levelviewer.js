var myp5 = new p5( function( sketch )
{
	// options
	var maxCanvasDimension = 1600;
	var cellGap = 4;
	
	// variables
	var argStr;
	var argArr;
	var lvl;
	var numRows;
	var numCols;
	var cellLength;
	var myCanvas;
	var canvasElt;
	
	// game options, units are in cells
	var playerDiameter = 1 / 1.61803398875; // ~0.618
	var gravity = 9.8;
	var jumpSpeed = 6;
	var bounceScalar = 0.5;
	
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
		
		argStr = sketch.getURL();
		argStr = argStr.slice(argStr.indexOf("?") + 1);
		console.log("argStr = \"" + argStr + "\"");
		argArr = argStr.split(',');
		
		numRows = argArr[0];
		numCols = argArr[1];
		
		lvl = new Array(numRows);
		for(let i = 0; i < numRows; ++i)
		{
			lvl[i] = new Array();
		}
		
		for(let row = 0; row < numRows; ++row)
		{
			for(let col = 0; col < numCols; ++col)
			{
				lvl[row][col] = '1' === argArr[row+2].charAt(col);
			}
		}
	}

	function myDraw()
	{
		sketch.strokeWeight(0);
		sketch.background(60);
		
		//sketch.textAlign(sketch.CENTER, sketch.CENTER);
		//sketch.textSize(60);
		//sketch.text(argStr, myCanvas.width/2, myCanvas.height/2);
		
		// draw rectangle
		var lvlWidth;
		var lvlHeight;
		if(numCols/numRows < myCanvas.width/myCanvas.height)
		{
			// height limited
			lvlHeight = myCanvas.height;
			lvlWidth = (numCols/numRows) * lvlHeight;
		}
		else
		{
			// width limited
			lvlWidth = myCanvas.width;
			lvlHeight = (numRows/numCols) * lvlWidth;			
		}
		sketch.fill(255);
		sketch.translate(myCanvas.width/2, myCanvas.height/2);
		sketch.rectMode(sketch.CENTER);
		sketch.rect(0, 0, lvlWidth, lvlHeight);
		sketch.translate(-lvlWidth/2, -lvlHeight/2);
		
		//draw level
		cellLength = lvlWidth / numCols;
		sketch.rectMode(sketch.CORNER);
		sketch.fill(0);
		for(let row = 0; row < numRows; ++row)
		{
			for(let col = 0; col < numCols; ++col)
			{
				if(lvl[row][col])
				{
					sketch.rect(
						col*cellLength+(cellGap/2),
						row*cellLength+(cellGap/2),
						cellLength-cellGap,
						cellLength-cellGap
					);
				}
			}
		}
		
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

