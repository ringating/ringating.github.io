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
	if(windowWidth > windowHeight)
	{
		return maxCanvasDimension;
	}
	else
	{
		return (windowWidth/windowHeight)*maxCanvasDimension;
	}
}

function calcHeight()
{
	if(windowHeight > windowWidth)
	{
		return maxCanvasDimension;
	}
	else
	{
		return (windowHeight/windowWidth)*maxCanvasDimension;
	}
}

function setup()
{
	myCanvas = createCanvas(calcWidth(), calcHeight());
	canvasElt = myCanvas.elt;
	canvasElt.style.width = '100%';
	canvasElt.style.height = '100%';
	
	//createCanvas(windowWidth, windowHeight);
	console.log(canvas.width + " " + canvas.height);
	
	strokeWeight(2);
	argStr = getURL();
	argStr = argStr.slice(argStr.indexOf("?") + 1);
	console.log("argStr = \"" + argStr + "\"")
}

function draw() 
{
	if(canvasWidth != canvas.width || canvasHeight != canvas.height || forceDraw)
	{
		canvasWidth = canvas.width;
		canvasHeight = canvas.height;
		console.log("in draw(), width="+canvasWidth+", height="+canvasHeight);
		
		// ----- draw -----
		
		fill(255);
		background(0);
		
		textAlign(CENTER, CENTER);
		textSize(60);
		text(argStr, canvasWidth/2, canvasHeight/2);
		
		//draw grid
		// asdf
		
	}
}

function windowResized()
{
	resizeCanvas(calcWidth(), calcHeight());
	canvasElt.style.width = '100%';
	canvasElt.style.height = '100%';
	forceDraw = true;
}