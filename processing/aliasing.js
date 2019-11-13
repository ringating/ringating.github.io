var shape = 
{
    d: 200,
    pos: 0,
    speed: 10
}


var afterimage = 
{
    alpha: 1,
    delta: 1/120,
    pos: 0
}

var framesUntilUpdate = 120;
var frameCounter = 0;

var yOffset = shape.d/2


function setup()
{
	frameRate(240);
	createCanvas(windowWidth, windowHeight);
	background(255);
}

function draw() 
{
	// draw
    background(255);
    
    // push();
        // noStroke();
        // translate(-shape.d/2,windowHeight/2);
        // fill(0);
        // circle(shape.pos, -yOffset, shape.d);
        // fill(255 - (afterimage.alpha * 255));
        // circle(afterimage.pos, yOffset, shape.d);
    // pop();
    
    push();
        noStroke();
        translate(windowWidth/2,windowHeight/2);
        
        fill(0);
        circle(shape.pos, -yOffset, shape.d);
        
        fill(255 - (afterimage.alpha * 255));
        circle(afterimage.pos, yOffset, shape.d);
    pop();
    
    
    // update states
    shape.pos += shape.speed;
    
    if(shape.pos > windowWidth + shape.d/2)
        shape.pos = -shape.d/2 + (shape.pos - (windowWidth + shape.d/2));
    
    frameCounter++;
    if(frameCounter == framesUntilUpdate)
    {
        frameCounter = 0;
        afterimage.pos = shape.pos;
        afterimage.alpha = 1;
    }
    
    afterimage.alpha -= afterimage.delta;
}