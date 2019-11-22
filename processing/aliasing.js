// options

var cyclesPerSec = .5;
var samplesPerSec = 2;
var rotationRadius = 200;
var xOffset = 600;
var secPerFPSUpdate = .1;


// variables, will change programatically

var fps = 60;
var dt = 1/60; // deltaTime, but in seconds

var secPerSample = 1/samplesPerSec;
var timer = 0;

var fpsTimer = 0;
var drawnFPS = fps.toPrecision(3);;

var shape = 
{
    d: 80,
    pos: 0,
    speed: cyclesPerSec/fps // in % of a revolution per frame
}

var sample = 
{
    alpha: 1,
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
    delta:0, // difference between a and b, used to get c
    s:0
}


// p5js callbacks

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
    secPerSample = 1/samplesPerSec;
    fpsTimer += dt;
    
    
    // update states
    shape.speed = cyclesPerSec/fps;
    shape.pos = mod1(shape.pos + shape.speed);
    
    timer += dt;
    if(timer > secPerSample)
    {
        timer %= secPerSample;
        sample.pos = shape.pos;
        // sample.pos = lerp(sample.pos, shape.pos, 1-timer);
        //prevShapePos
        console.log(sample);
    }
    
    sample.alpha = 1 - (timer / secPerSample);
    
    if(sample.pos != pastPos.a)
    {
        pastPos.b = pastPos.a;
        pastPos.a = sample.pos;
        
        pastPos.delta = pastPos.a - pastPos.b;
        if (Math.abs(pastPos.delta) > 0.5)
        {
            pastPos.s = -pastPos.delta / abs(pastPos.delta);
            pastPos.delta = ( mod1( pastPos.delta * pastPos.s ) ) * pastPos.s; 
        }
    }
    
    reconstructed.pos = lerp(pastPos.a, pastPos.a + pastPos.delta, timer/secPerSample) % 1;
    
    
    
    // draw
    background(255);
    textAlign(LEFT, TOP);
    // text(dt.toPrecision(5),0,0);
    // text(timer,0,0);
    if(fpsTimer > secPerFPSUpdate)
    {
        drawnFPS = fps.toPrecision(3);
        fpsTimer %= secPerFPSUpdate;
    }
        
    text(drawnFPS,0,0);
    
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
        fill("rgba(126,69,183," + sample.alpha + ")");
        circle(-xOffset + cos(sample.pos * TWO_PI) * rotationRadius, -sin(sample.pos * TWO_PI) * rotationRadius, shape.d);
        
        // solo sampling circle
        fill("rgba(126,69,183," + sample.alpha + ")");
        circle(cos(sample.pos * TWO_PI) * rotationRadius, -sin(sample.pos * TWO_PI) * rotationRadius, shape.d);
        
        // reconstructed signal circle
        fill("rgba(0,0,0,1)");
        circle(xOffset + cos(reconstructed.pos * TWO_PI) * rotationRadius, -sin(reconstructed.pos * TWO_PI) * rotationRadius, shape.d);
        // reconstructed signal's sampling circle
        fill("rgba(126,69,183," + sample.alpha + ")");
        circle(xOffset + cos(sample.pos * TWO_PI) * rotationRadius, -sin(sample.pos * TWO_PI) * rotationRadius, shape.d);
    pop();
    
    
    
}

function keyPressed()
{
    switch(keyCode) // up arrow
    {
        case 38: // up arrow
            cyclesPerSec = Math.round(cyclesPerSec*10 + 1)/10;
            break;
        case 40: // down arrow
            cyclesPerSec = Math.round(cyclesPerSec*10 - 1)/10;
            break;
        case 39: // right arrow
            samplesPerSec = Math.round(samplesPerSec*10 + 1)/10;
            break;
        case 37: // left arrow
            samplesPerSec = Math.round(samplesPerSec*10 - 1)/10;
            break;
    }
}


// r mod 1, behaves the way google's calculator does (js's % doesn't work this way)
function mod1(r)
{
    if(r < 0)
        return 1+(r%1);
    return r%1;
}