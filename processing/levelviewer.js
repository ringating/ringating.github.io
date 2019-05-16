var argStr = "";
var canvasWidth = 0;
var canvasHeight = 0;
var cellLength = 0;

function setup()
{
	createCanvas(windowWidth, windowHeight);
	console.log(canvas.width + " " + canvas.height);
	strokeWeight(2);
	argStr = getURL();
	argStr = argStr.slice(argStr.indexOf("?") + 1);
	console.log("argStr = \"" + argStr + "\"")
	
	if(canvasWidth != canvas.width || canvasHeight != canvas.height)
	{
		canvasWidth = canvas.width;
		canvasHeight = canvas.height;
		console.log("in draw(), width="+canvasWidth+", height="+canvasHeight);
		
		// ----- draw -----
		
		fill(0);
		background(255);
		
		textAlign(CENTER, CENTER);
		textSize(60);
		text(argStr, canvasWidth/2, canvasHeight/2);
		
		//draw grid
		// asdf
		
	}
}

function draw() 
{
	/*if(canvasWidth != canvas.width || canvasHeight != canvas.height)
	{
		canvasWidth = canvas.width;
		canvasHeight = canvas.height;
		console.log("in draw(), width="+canvasWidth+", height="+canvasHeight);
		
		// ----- draw -----
		
		fill(0);
		background(255);
		
		textAlign(CENTER, CENTER);
		textSize(60);
		text(argStr, canvasWidth/2, canvasHeight/2);
		
		//draw grid
		// asdf
		
	}*/
	
}

function windowResized()
{
	//resizeCanvas(windowWidth, windowHeight);
}