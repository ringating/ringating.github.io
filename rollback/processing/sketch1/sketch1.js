
var winWidth = 323;
var winHeight = 297;

var tickDuration = 20; // in frames
var tickFrameCount = 0;

var img_bg;
var img_input_glow;
var img_input_left;
var img_input_neutral;
var img_input_right;
var img_render_glow;
var img_render_guy;
var img_update_glow;


// p5js callbacks

function preload()
{
    img_bg              = loadImage("bg.png");
    img_input_glow      = loadImage("input-glow.png");
    img_input_left      = loadImage("input-left.png");
    img_input_neutral   = loadImage("input-neutral.png");
    img_input_right     = loadImage("input-right.png");
    img_render_glow     = loadImage("render-glow.png");
    img_render_guy      = loadImage("render-guy.png");
    img_update_glow     = loadImage("update-glow.png");
}

function setup()
{
	frameRate(60);
	createCanvas(winWidth, winHeight);
	background(255);
}

function draw() 
{
    image(img_bg, 0, 0);
    
    if(keyIsDown(37))
        image(img_input_left,0,0);
    if(keyIsDown(39))
        image(img_input_right,0,0);
    if( !(keyIsDown(37)||keyIsDown(39)) || (keyIsDown(37)&&keyIsDown(39)))
        image(img_input_neutral,0,0);
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