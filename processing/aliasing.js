class TemporalPoint
{
    constructor(value, currentTime)
    {
        this.value = value;
        this.time = currentTime;
    }
}

class TemporalCurve
{
    constructor()
    {
        this.points = new Array();
    }
    
    addPoint(value, currentTime)
    {
        this.points.push(new TemporalPoint(value, currentTime));
    }
    
    cullPointsOlderThan(age, currentTime)
    {
        while(this.points.length > 0 && currentTime - this.points[0].time > age)
        {
            this.points.shift();
        }
    }
}

// options

var cyclesPerSec = 1;
var samplesPerSec = 1;
var rotationRadius = 200;
var xOffset = 600;
var secPerFPSUpdate = .1;
var curveAge = 2;


// variables, will change programatically

var timeSinceStart = 0;
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
    pos: 0,
    cyclesPerSec: 0
}

var pastPos = 
{
    a:0,
    b:0,
    delta:0, // difference between a and b, used to get c
    s:0
}

var realCurve = new TemporalCurve();
var sampledCurve = new TemporalCurve();
var onlySamplePoints = new TemporalCurve();
var addSamplePoint = false;


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
    timeSinceStart += dt;
    fps = 1/dt;
    samplesPerSec = Math.max(samplesPerSec, 0);
    secPerSample = 1/samplesPerSec;
    fpsTimer += dt;
    
    
    // update states of circles
    shape.speed = cyclesPerSec/fps;
    shape.pos = mod1(shape.pos + shape.speed);
    
    timer += dt;
    if(timer > secPerSample)
    {
        timer %= secPerSample;
        sample.pos = shape.pos;
        // sample.pos = lerp(sample.pos, shape.pos, 1-timer);
        //prevShapePos
        addSamplePoint = true;
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
    
    reconstructed.cyclesPerSec = pastPos.delta * samplesPerSec;
    
    
    // update states of curves
    realCurve.addPoint(-sin(shape.pos * TWO_PI), timeSinceStart);
    realCurve.cullPointsOlderThan(curveAge, timeSinceStart);
    
    sampledCurve.addPoint(-sin(reconstructed.pos * TWO_PI), timeSinceStart);
    sampledCurve.cullPointsOlderThan(curveAge, timeSinceStart);
    
    if(addSamplePoint)
    {
        addSamplePoint = false;
        onlySamplePoints.addPoint(-sin(sample.pos * TWO_PI), timeSinceStart);
    }
    onlySamplePoints.cullPointsOlderThan(curveAge, timeSinceStart);
    
    
    
    // draw
    background(255);
    textAlign(LEFT, TOP);
    if(fpsTimer > secPerFPSUpdate)
    {
        drawnFPS = fps.toPrecision(3);
        fpsTimer %= secPerFPSUpdate;
    }
    text(drawnFPS,1,1);
    
    push();
        noStroke();
        translate(windowWidth/2,windowHeight/2);
        
        textAlign(CENTER, CENTER);
        
        textSize(32);
        text("cycles per sec: " + cyclesPerSec, -xOffset, 320);
        text("samples per sec: " + samplesPerSec, 0, 320);
        text("cycles per sec:", xOffset - 30, 320);
        textAlign(LEFT, CENTER);
        text(toOneDecimalPlace("" + reconstructed.cyclesPerSec), xOffset + 85, 320);
        
        textAlign(CENTER, CENTER);
        textSize(20);
        text("(adjust with up/down arrows)", -xOffset, 354);
        text("(adjust with left/right arrows)", 0, 354);
        text("interpreted from sampled positions", xOffset, 354);
        
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
        
        // wave stuff
        noFill();
        stroke("rgba(0,0,0,0.12)");
        strokeWeight(2);
        rectMode(CENTER);
        rect(-xOffset, -350, 400, 100);
        rect( xOffset, -350, 400, 100);
        rect(       0, -350, 400, 100);
        stroke(0);
        drawTemporalCurve(-xOffset, -350, 400, 100, realCurve,    1, curveAge, timeSinceStart);
        drawTemporalCurve( xOffset, -350, 400, 100, sampledCurve, 1, curveAge, timeSinceStart);
        stroke("rgba(0,0,0,0.32)");
        noFill();
        drawTemporalCurve( xOffset, -350, 400, 100, realCurve,    1, curveAge, timeSinceStart);
        stroke("rgba(126,69,183,0.75)");
        strokeWeight(10);
        drawTemporalCurvePoints( xOffset, -350, 400, 100, onlySamplePoints, 1, curveAge, timeSinceStart);
        drawTemporalCurvePoints(-xOffset, -350, 400, 100, onlySamplePoints, 1, curveAge, timeSinceStart);
        drawTemporalCurvePoints(       0, -350, 400, 100, onlySamplePoints, 1, curveAge, timeSinceStart);
        stroke(0);
        drawTemporalCurveHead(-xOffset, -350, 400, 100, realCurve,    1, curveAge, timeSinceStart);
        drawTemporalCurveHead( xOffset, -350, 400, 100, sampledCurve, 1, curveAge, timeSinceStart);
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

function toOneDecimalPlace(numStr)
{
    var retStr;
    if(numStr.indexOf('.') >= 0)
    {
        retStr = numStr.slice(0, numStr.indexOf('.') + 2);
    }
    else
    {
        retStr = numStr;
    }
    return retStr;
}

// this only works since the values it's called on can only be adjusted in 1/10 increments
// function getPrecision(num)
// {
    // var numStr = ""+num;
    // var prec = numStr.length;
    // if(numStr.indexOf('0') == 0)
        // prec--;
    // if(numStr.indexOf('.') >= 0)
        // prec--;
    // return prec;
// }


function drawTemporalCurve(xOffset, yOffset, width, height, tCurve, amplitude, timeWindow, currentTime)
{
    beginShape();
    
    for(let i = 0; i < tCurve.points.length; ++i)
    {
        curveVertex
        (
            map(tCurve.points[i].time, currentTime - timeWindow, currentTime, xOffset - width/2, xOffset + width/2),
            map(tCurve.points[i].value, -amplitude, amplitude, yOffset - height/2, yOffset + height/2)
        );
    }
    
    endShape();
}

function drawTemporalCurvePoints(xOffset, yOffset, width, height, tCurve, amplitude, timeWindow, currentTime)
{
    for(let i = 0; i < tCurve.points.length; ++i)
    {
        point
        (
            map(tCurve.points[i].time, currentTime - timeWindow, currentTime, xOffset - width/2, xOffset + width/2),
            map(tCurve.points[i].value, -amplitude, amplitude, yOffset - height/2, yOffset + height/2)
        );
    }
}

function drawTemporalCurveHead(xOffset, yOffset, width, height, tCurve, amplitude, timeWindow, currentTime)
{
    point
    (
        map(tCurve.points[tCurve.points.length-1].time, currentTime - timeWindow, currentTime, xOffset - width/2, xOffset + width/2),
        map(tCurve.points[tCurve.points.length-1].value, -amplitude, amplitude, yOffset - height/2, yOffset + height/2)
    );
}