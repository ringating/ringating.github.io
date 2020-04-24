//var img_bg;

// game constants
gameWidth = 631;
gameHeight = 355;
playerWidth = 87;
playerHeight = 186;
playerAttackDistanceX = 120; // if the other player is over this far away (relative), attack whiffs
playerAttackDistanceY = 150; // if the other player is over this far off the ground (absolute), attack whiffs
jumpSpeed = 20;
launchSpeed = 40;
gravity = 1;

const ps = // ps stands for player states, this object is used as an enum
{
    "neutral":  1,
    "jumping":  2,
    "punching": 3,
    "hitstun":  4,
    "launched": 5,
    "knockdown":6,
    "wakeup":   7
};

class PlayerGameState
{
    // constructor(posX, posY, velX, velY, pstate, stateFrameCount, hitSomething, prevAttackInput)
	// {
		// this.posX = posX;
		// this.posY = posY;
        
        // this.velX = velX;
		// this.velY = velY;
        
        // this.state = pstate;
        // this.stateFrameCount = stateFrameCount;
        
        // this.hitSomething = hitSomething;
        
        // this.prevAttackInput = prevAttackInput; // attacks only come out on press, so this is necessary to check
	// }
    
    constructor()
    {
        this.posX = 0;
		this.posY = 0;
        
        this.velX = 0;
		this.velY = 0;
        
        this.state = ps.neutral;
        this.stateFrameCount = 1;
        
        this.hitSomething = false;
        
        this.prevAttackInput = false; // attacks only come out on press, so this is necessary to check
    }
}

class GameState
{
	// constructor(p1_pgs, p2_pgs)
	// {
		// this.p1 = p1_pgs;
		// this.p2 = p2_pgs;
	// }
    
    constructor()
	{
		this.p1 = new PlayerGameState();
		this.p2 = new PlayerGameState();
	}
}

class PlayerInputs
{
	constructor(left, right, jump, attack)
	{
		this.left = left;
		this.right = right;
		this.jump = jump;
        this.attack = attack;
	}
}

function generateNextGameState(currentGameState, currentP1Input, currentP2Input)
{
	var nextGameState = new GameState();
	
    
    
    
	return nextGameState;
}



// p5js callbacks

function preload()
{
    //img_bg = loadImage("bg.png");
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