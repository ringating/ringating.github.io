// options
var cyclesPerSec = 2;
var samplesPerSec = 2.2;
var rotationRadius = 200;
var xOffset = 600;


// variables, will change programatically
var fps = 60;
var framesUntilUpdate = (1/samplesPerSec) * fps;
var frameCounter = 0;
var dt = 1/60; // deltaTime, but in seconds

var secPerSample = 1/samplesPerSec;
var timer = 0;

var shape = 
{
    d: 80,
    pos: 0,
    speed: cyclesPerSec/fps // in % of a revolution per frame
}

var afterimage = 
{
    alpha: 1,
    delta: 1/framesUntilUpdate,
    pos: 0
}

var reconstructed = 
{
    pos:0,
    speed:0
}

var pastPos = 
{
    a:0,
    b:0,
    e:0, // for extrapolated
    delta:0 // difference between a and b, used to get c
}


function setup()
{
	frameRate(999);
	createCanvas(windowWidth, windowHeight);
	background(255);
}

function draw() 
{
    // update framerate-related stuff
    dt = deltaTime/1000;
    fps = 1/dt;
    framesUntilUpdate = (1/samplesPerSec) * fps;
    shape.speed = cyclesPerSec/fps;
    afterimage.delta = 1/framesUntilUpdate;
    
    
    // update states
    shape.pos += shape.speed;
    shape.pos %= 1;
    
    // frameCounter++;
    // if(frameCounter >= framesUntilUpdate)
    // {
        // frameCounter = 0;
        // afterimage.pos = shape.pos;
        // afterimage.alpha = 1;
    // }
    
    timer += dt;
    if(timer >= secPerSample)
    {
        timer = 0;
        afterimage.pos = shape.pos;
        afterimage.alpha = 1;
    }
    
    afterimage.alpha -= afterimage.delta;
    
    // reconstructed.pos += reconstructed.speed;
    if(afterimage.pos != pastPos.a)
    {
        pastPos.b = pastPos.a;
        pastPos.a = afterimage.pos;
        pastPos.delta = pastPos.a - pastPos.b;
        pastPos.c = pastPos.a + pastPos.delta;
    }
    
    reconstructed.pos = lerp(pastPos.a, pastPos.a + pastPos.delta, timer/secPerSample) % 1;
    
    
    
    // draw
    background(255);
    
    push();
        noStroke();
        translate(windowWidth/2,windowHeight/2);
        
        textAlign(CENTER, CENTER);
        textSize(32);
        
        text("cycles per sec: " + cyclesPerSec + "\nsamples per sec: " + samplesPerSec, 0, 340);
        
        // signal circle
        fill("rgba(0,0,0,1)");
        circle(-xOffset + cos(shape.pos * TWO_PI) * rotationRadius, -sin(shape.pos * TWO_PI) * rotationRadius, shape.d);
        // signal's sampling circle
        fill("rgba(0,0,0," + afterimage.alpha + ")");
        circle(-xOffset + cos(afterimage.pos * TWO_PI) * rotationRadius, -sin(afterimage.pos * TWO_PI) * rotationRadius, shape.d);
        
        // solo sampling circle
        fill("rgba(0,0,0," + afterimage.alpha + ")");
        circle(cos(afterimage.pos * TWO_PI) * rotationRadius, -sin(afterimage.pos * TWO_PI) * rotationRadius, shape.d);
        
        // reconstructed signal circle
        fill("rgba(0,0,0,1)");
        circle(xOffset + cos(reconstructed.pos * TWO_PI) * rotationRadius, -sin(reconstructed.pos * TWO_PI) * rotationRadius, shape.d);
        // reconstructed signal's sampling circle
        fill("rgba(0,0,0," + afterimage.alpha + ")");
        circle(xOffset + cos(afterimage.pos * TWO_PI) * rotationRadius, -sin(afterimage.pos * TWO_PI) * rotationRadius, shape.d);
    pop();
    
    
    
}