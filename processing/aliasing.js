var fps = 60;
var cyclesPerSec = 2;
var samplesPerSec = 2.2;
var rotationRadius = 200;

var framesUntilUpdate = (1/samplesPerSec) * fps;

var shape = 
{
    d: 80,
    pos: 0,
    speed: cyclesPerSec/fps // in % of the period per frame
}


var afterimage = 
{
    alpha: 1,
    delta: 1/framesUntilUpdate,
    pos: 0
}



var frameCounter = 0;

var xOffset = 0;



function setup()
{
	frameRate(fps);
	createCanvas(windowWidth, windowHeight);
	background(255);
}

function draw() 
{
	// draw
    background(255);
    
    push();
        noStroke();
        translate(windowWidth/2,windowHeight/2);
        
        fill("rgba(0,0,0,1)");
        circle(-xOffset +cos(shape.pos * TWO_PI) * rotationRadius, -sin(shape.pos * TWO_PI) * rotationRadius, shape.d);
        
        fill("rgba(0,0,0," + afterimage.alpha + ")");
        circle(xOffset + cos(afterimage.pos * TWO_PI) * rotationRadius, -sin(afterimage.pos * TWO_PI) * rotationRadius, shape.d);
    pop();
    
    
    // update states
    shape.pos += shape.speed;
    shape.pos %= 1;
    
    frameCounter++;
    if(frameCounter >= framesUntilUpdate)
    {
        frameCounter = 0;
        afterimage.pos = shape.pos;
        afterimage.alpha = 1;
    }
    
    afterimage.alpha -= afterimage.delta;
}