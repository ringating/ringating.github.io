
var winWidth = 323;
var winHeight = 297;

tickDuration = 20; // in frames

var img_bg;

// p5js callbacks

function preload()
{
    img_bg = loadImage("bg.png");
}

function setup()
{
	frameRate(60);
	createCanvas(winWidth, winHeight);
	background(255);
}

function draw() 
{
    background(0);
    fill(255);
    circle(winWidth/2, winHeight/2, winHeight/4);
    image(img_bg, 0, 0);
}

function keyPressed()
{
    switch(keyCode)
    {
        case 38: // up arrow
            break;
        case 40: // down arrow
            break;
        case 39: // right arrow
            break;
        case 37: // left arrow
            break;
    }
}