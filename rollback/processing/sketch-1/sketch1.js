// sprite arrays
var game_window = [];
var player_hitstun = [];
var player_idle = [];
var player_knockdown = [];
var player_launch_apex = [];
var player_launch_falling = [];
var player_launch_rising = [];
var player_punch_anticipation = [];
var player_punch_full = [];
var player_punch_partial = [];
var player_wakeup = [];
var player_walk1 = [];
var player_walk2 = [];
var player_walk3 = [];

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
    game_window[0] = loadImage("http://whiffpunish.com/rollback/processing/assets/game-window/game-window-1.png");
    game_window.push( loadImage("http://whiffpunish.com/rollback/processing/assets/game-window/game-window-2.png") );
    game_window.push( loadImage("http://whiffpunish.com/rollback/processing/assets/game-window/game-window-3.png") );
    game_window.push( loadImage("http://whiffpunish.com/rollback/processing/assets/game-window/game-window-4.png") );
}

function setup()
{
	frameRate(60);
	createCanvas(1600, 900);
	background(0);
    textAlign(LEFT, BOTTOM);
}

function draw() 
{
    image(game_window[0], 0, 0);
}

// function keyPressed()
// {
    // switch(keyCode)
    // {
        // case 38: // up arrow
            // break;
        // case 40: // down arrow
            // break;
        // case 39: // right arrow
            // break;
        // case 37: // left arrow
            // break;
        // case 13: // enter
            // paused  = !paused;
            // //console.log("toggling pause");
            // break;
    // }
// }