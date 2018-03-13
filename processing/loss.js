// written by Chris Kissler

var baseDiameter = 41;
var baseGap = 41;
var minWidth = 0.06;
var deadzone = 20;
var autoSpeedMax = 30;
var autoSpeedMin = 2;
var colorCountMax = 8;
var colorScalar = 28;

var mX;
var halfOff;
var scalar;
var autoDirection;
var autoMax;
var autoMin;
var autoAvg;
var colorCount;
var colorCountIncreasing;
var halfColumnCount;

function setup() 
{
	createCanvas(windowWidth, windowHeight);
	background(255);
	ellipseMode(CORNER);
	noStroke();
	fill(0);
	autoDirection = 1;
	autoMax = canvas.width - deadzone;
	autoMin = deadzone;
	autoAvg = (autoMax + autoMin)/2;
	mX = autoAvg;
}

function draw() 
{	
	background(255);
	halfOff = true;
	scalar = 1;
	halfColumnCount = 0;
	
	if (mouseX > deadzone && mouseX < canvas.width - deadzone && mouseY > deadzone && mouseY < canvas.height - deadzone)
	{
		mX = mouseX;
	}
	else
	{
		autoPlay();
	}
	
	for(k = -baseDiameter; k < canvas.width; k += scalar*(baseDiameter+baseGap)/2)
	{
		if(k < mX)
		{
			scalar = Math.max(map(cos(map(k,1-baseDiameter,mX,0,HALF_PI)),0,1,minWidth,1),minWidth);
		}
		else
		{
			scalar = Math.max(map(sin(map(k,mX,canvas.width,0,HALF_PI)),0,1,minWidth,1),minWidth);
		}
		
		colorCountIncreasing = true;
		drawColumn(k,baseDiameter*scalar);
		
		halfOff = !halfOff;		
	}
}

function drawColumn(x,width)
{	
	colorCount = colorCountMax - halfColumnCount - 1;
	
	if(halfOff)
	{
		var i = -(baseDiameter+baseGap)/2;
	}
	else
	{
		var i = 0;
		halfColumnCount += 1;
	}
	
	for(; i < canvas.height; i += baseDiameter + baseGap)
	{
		if(colorCountIncreasing)
		{
			colorCount += 1;
		}
		else
		{
			colorCount -= 1;
		}
		
		if(colorCount > colorCountMax)
		{
			colorCount = colorCountMax - (colorCount - colorCountMax);
			colorCountIncreasing = false;
		}
		
		fill(Math.max(colorCount*colorScalar,0));
		
		ellipse(x,i,width,baseDiameter);
	}
}

function autoPlay()
{
	mX += map(abs(mX-autoAvg),autoMin,autoMax,autoSpeedMin,autoSpeedMax) * autoDirection;
	
	if(mX > autoMax)
	{
		autoDirection = -1;
		mX = autoMax;
	}
	
	if(mX < autoMin)
	{
		autoDirection = 1;
		mX = autoMin;
	}
}