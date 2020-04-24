var winWidth = 323;
var winHeight = 297;

var paused = false;

var tickDuration = 30; // in frames
var tickFrameCount = 0;
var currState = 0;

var curr_prevState = 5;
var curr_nextState = 5;
var curr_input = 0;

var next_input = 0;

var render_state = 5;

var inputText = "e";

var guy_x_at_1 = 64;
var guy_y = 95;

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
    img_bg              = loadImage("http://whiffpunish.com/rollback/processing/sketch1/bg.png");
    img_input_glow      = loadImage("http://whiffpunish.com/rollback/processing/sketch1/input-glow.png");
    img_input_left      = loadImage("http://whiffpunish.com/rollback/processing/sketch1/input-left.png");
    img_input_neutral   = loadImage("http://whiffpunish.com/rollback/processing/sketch1/input-neutral.png");
    img_input_right     = loadImage("http://whiffpunish.com/rollback/processing/sketch1/input-right.png");
    img_render_glow     = loadImage("http://whiffpunish.com/rollback/processing/sketch1/render-glow.png");
    img_render_guy      = loadImage("http://whiffpunish.com/rollback/processing/sketch1/render-guy.png");
    img_update_glow     = loadImage("http://whiffpunish.com/rollback/processing/sketch1/update-glow.png");
}

function setup()
{
	frameRate(60);
	createCanvas(winWidth, winHeight);
	background(255);
    textAlign(LEFT, BOTTOM);
}

function draw() 
{
    image(img_bg, 0, 0);
    
    if(paused)
    {
        tickFrameCount = 1;
    }
    else
    {
        tickFrameCount++;
    
        if(tickFrameCount >= tickDuration)
        {
            tickFrameCount = 0;
            currState = (currState+1)%3;
            //console.log("currState = " + currState);
        }
    }
    
    switch (currState) 
    {
        case 0: // update
            if(tickFrameCount == 0)
            {
                // do once per cycle
                curr_input = next_input;
                curr_prevState = curr_nextState;
                curr_nextState = Math.min(Math.max(curr_prevState + curr_input, 1), 9);
                
                switch(curr_input)
                {
                    case -1:
                        inputText = "◄";
                        break;
                    case 0:
                        inputText = "■";
                        break;
                    case 1:
                        inputText = "►";
                        break;
                }
            }
            image(img_update_glow,0,0);
            break;
            
        case 1: // render
            render_state = curr_nextState;
            image(img_render_glow,0,0);
            break;
            
        case 2: // input
            image(img_input_glow,0,0);
            if(keyIsDown(37) && !keyIsDown(39))
            {
                image(img_input_left,0,0);
                next_input = -1;
            }
            if(keyIsDown(39) && !keyIsDown(37))
            {
                image(img_input_right,0,0);
                next_input = 1;
            }
            if( !(keyIsDown(37)||keyIsDown(39)) || (keyIsDown(37)&&keyIsDown(39)))
            {
                image(img_input_neutral,0,0);
                next_input = 0;
            }
            break;
    }
    
    image(img_render_guy, guy_x_at_1 + 19*(render_state-1), guy_y);
    
    text(""+curr_prevState, 46, 272);
    text(inputText, 91, 269);
    text(""+curr_nextState, 136, 272);
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
        case 13: // enter
            paused  = !paused;
            //console.log("toggling pause");
            break;
    }
}