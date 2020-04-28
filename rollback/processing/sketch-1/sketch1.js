// sprite arrays
var wobbly_sprites = 
{
    game_window                 : {"frame":0, "arr":[]},
    player_hitstun              : {"frame":0, "arr":[]},
    player_idle                 : {"frame":0, "arr":[]},
    player_jump_rising          : {"frame":0, "arr":[]},
    player_jump_falling         : {"frame":0, "arr":[]},
    player_knockdown            : {"frame":0, "arr":[]},
    player_launch_apex          : {"frame":0, "arr":[]},
    player_launch_falling       : {"frame":0, "arr":[]},
    player_launch_rising        : {"frame":0, "arr":[]},
    player_punch_anticipation   : {"frame":0, "arr":[]},
    player_punch_full           : {"frame":0, "arr":[]},
    player_punch_partial        : {"frame":0, "arr":[]},
    player_wakeup               : {"frame":0, "arr":[]},
    player_walk1                : {"frame":0, "arr":[]},
    player_walk2                : {"frame":0, "arr":[]},
    player_walk3                : {"frame":0, "arr":[]}
}


// game constants
gameWidth = 631;
gameHeight = 355;
playerWidth = 87;
playerHeight = 186;
playerAttackDistanceX = 120; // if the other player is over this far away (relative), attack whiffs
playerAttackDistanceY = 150; // if the other player is over this far off the ground (absolute), attack whiffs
walkSpeed = 3.5;
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
    constructor()
    {
        this.posX = 0;
		this.posY = 0;
        
        this.velX = 0;
		this.velY = 0;
        
        this.state = ps.neutral;
        this.stateFrameCount = 1;
        
        this.hitSomething = false;
        
        this.prevAttackInput = false; // attacks only come out on press, so this is a necessary piece of state
    }
}

class GameState
{
    constructor()
	{
		this.p1 = new PlayerGameState();
		this.p2 = new PlayerGameState();
	}
}

class PlayerInputs
{
	constructor()
	{
		this.left = false;
		this.right = false;
		this.jump = false;
        this.attack = false;
	}
}

function generateNextGameState(currentGameState, currentP1Input, currentP2Input)
{
	var nextGameState = new GameState();
	
    if(currentGameState.p1.posY <= 0)
    {
        // grounded
        
        if(currentP1Input.jump)
        {
            nextGameState.p1.velY = jumpSpeed;
        }
        
        if(currentP1Input.left)
            nextGameState.p1.velX -= walkSpeed;
        if(currentP1Input.right)
            nextGameState.p1.velX += walkSpeed;
    }
    else
    {
        // airborne
        
        nextGameState.p1.velX = currentGameState.p1.velX;
        nextGameState.p1.velY = currentGameState.p1.velY - gravity;
    }
    
    nextGameState.p1.posX = currentGameState.p1.posX + nextGameState.p1.velX;
    nextGameState.p1.posY = currentGameState.p1.posY + nextGameState.p1.velY;
    
    if(nextGameState.p1.posY > 0) nextGameState.p1.state = ps.launched; else nextGameState.p1.state = ps.neutral;
    
	return nextGameState;
}



// p5js callbacks

function preload()
{
    wobbly_sprites.game_window.arr.push( loadImage("http://whiffpunish.com/rollback/processing/assets/game-window/game-window-1.png") );
    wobbly_sprites.game_window.arr.push( loadImage("http://whiffpunish.com/rollback/processing/assets/game-window/game-window-2.png") );
    wobbly_sprites.game_window.arr.push( loadImage("http://whiffpunish.com/rollback/processing/assets/game-window/game-window-3.png") );
    wobbly_sprites.game_window.arr.push( loadImage("http://whiffpunish.com/rollback/processing/assets/game-window/game-window-4.png") );
    
    for(let i = 0; i < 5; ++i)
    {
        wobbly_sprites.player_hitstun.arr.push(             loadImage("http://whiffpunish.com/rollback/processing/assets/player-hitstun/player-hitstun-"                        + (i+1) + ".png") );
        wobbly_sprites.player_idle.arr.push(                loadImage("http://whiffpunish.com/rollback/processing/assets/player-idle/player-idle-"                              + (i+1) + ".png") );
        wobbly_sprites.player_jump_falling.arr.push(        loadImage("http://whiffpunish.com/rollback/processing/assets/player-launch-falling/player-launch-falling-"          + (i+1) + ".png") ); // change this
        wobbly_sprites.player_jump_rising.arr.push(         loadImage("http://whiffpunish.com/rollback/processing/assets/player-launch-rising/player-launch-rising-"            + (i+1) + ".png") ); // change this
        wobbly_sprites.player_knockdown.arr.push(           loadImage("http://whiffpunish.com/rollback/processing/assets/player-knockdown/player-knockdown-"                    + (i+1) + ".png") );
        wobbly_sprites.player_launch_apex.arr.push(         loadImage("http://whiffpunish.com/rollback/processing/assets/player-launch-apex/player-launch-apex-"                + (i+1) + ".png") );
        wobbly_sprites.player_launch_falling.arr.push(      loadImage("http://whiffpunish.com/rollback/processing/assets/player-launch-falling/player-launch-falling-"          + (i+1) + ".png") );
        wobbly_sprites.player_launch_rising.arr.push(       loadImage("http://whiffpunish.com/rollback/processing/assets/player-launch-rising/player-launch-rising-"            + (i+1) + ".png") );
        wobbly_sprites.player_punch_anticipation.arr.push(  loadImage("http://whiffpunish.com/rollback/processing/assets/player-punch-anticipation/player-punch-anticipation-"  + (i+1) + ".png") );
        wobbly_sprites.player_punch_full.arr.push(          loadImage("http://whiffpunish.com/rollback/processing/assets/player-punch-full/player-punch-full-"                  + (i+1) + ".png") );
        wobbly_sprites.player_punch_partial.arr.push(       loadImage("http://whiffpunish.com/rollback/processing/assets/player-punch-partial/player-punch-partial-"            + (i+1) + ".png") );
        wobbly_sprites.player_wakeup.arr.push(              loadImage("http://whiffpunish.com/rollback/processing/assets/player-wakeup/player-wakeup-"                          + (i+1) + ".png") );
        wobbly_sprites.player_walk1.arr.push(               loadImage("http://whiffpunish.com/rollback/processing/assets/player-walk1/player-walk1-"                            + (i+1) + ".png") );
        wobbly_sprites.player_walk2.arr.push(               loadImage("http://whiffpunish.com/rollback/processing/assets/player-walk2/player-walk2-"                            + (i+1) + ".png") );
        wobbly_sprites.player_walk3.arr.push(               loadImage("http://whiffpunish.com/rollback/processing/assets/player-walk3/player-walk3-"                            + (i+1) + ".png") );
    }
}

function setup()
{
	frameRate(60);
	createCanvas(800, 450);
	background(0);
    textAlign(LEFT, BOTTOM);
}

var currState = new GameState();
var prevState = new GameState();


function draw() 
{
    check_update_wobbly_frames();

    inputsP1 = new PlayerInputs();
    inputsP2 = new PlayerInputs();
    
    getInputs(inputsP1, 65, 68, 87, 32); // A D W Space
    getInputs(inputsP2, 37, 39, 38, 96); // Left Right Up Num0
    
    currState = generateNextGameState(currState, inputsP1, inputsP2);
    
    draw_gamestate(currState);
}

function image_wobbly(spriteStr, xCoord, yCoord)
{
    let temp = wobbly_sprites[spriteStr];
    image(temp.arr[temp.frame], xCoord, yCoord);
}

function check_update_wobbly_frames()
{
    if(frameCount % 12 === 0)
    {
        for(const spriteName in wobbly_sprites)
        {
            let prevFrame = wobbly_sprites[spriteName].frame;
            wobbly_sprites[spriteName].frame = getRandomInt(wobbly_sprites[spriteName].arr.length);
            if(prevFrame === wobbly_sprites[spriteName].frame)
            {
                wobbly_sprites[spriteName].frame = (++prevFrame) % wobbly_sprites[spriteName].arr.length;
            }
        }
    }
}

function draw_gamestate(gamestate)
{
    push();
        imageMode(CORNER);
        image_wobbly("game_window", 0, 0);
        translate(8,10);
        imageMode(CENTER);
        switch(gamestate.p1.state)
        {
            case ps.neutral:
                image_wobbly("player_idle", gamestate.p1.posX, pyc(gamestate.p1.posY)); // incomplete, must also include walking
                break;
                
            case ps.jumping:
                if(gamestate.p1.velY > 0)
                    image_wobbly("player_jump_rising", gamestate.p1.posX, pyc(gamestate.p1.posY));
                else
                    image_wobbly("player_jump_falling", gamestate.p1.posX, pyc(gamestate.p1.posY));
                break;
                
            case ps.punching:
                break;
                
            case ps.hitstun:
                image_wobbly("player_hitstun", gamestate.p1.posX, pyc(gamestate.p1.posY));
                break;
                
            case ps.launched:
                if(gamestate.p1.velY > 4.5)
                    image_wobbly("player_launch_rising", gamestate.p1.posX, pyc(gamestate.p1.posY));
                else if(gamestate.p1.velY < -4.5)
                    image_wobbly("player_launch_falling", gamestate.p1.posX, pyc(gamestate.p1.posY));
                else
                    image_wobbly("player_launch_apex", gamestate.p1.posX, pyc(gamestate.p1.posY));
                break;
                
            case ps.knockdown:
                image_wobbly("player_knockdown", gamestate.p1.posX, pyc(gamestate.p1.posY));
                break;
                
            case ps.wakeup:
                image_wobbly("player_wakeup", gamestate.p1.posX, pyc(gamestate.p1.posY));
                break;
        }
    pop();
}

function pyc(rawY) // player y coordinate
{
    return gameHeight - (playerHeight/2 + rawY);
}

function getRandomInt(max)
{
  return Math.floor(Math.random() * Math.floor(max));
}

function getInputs(inputObj, leftKey, rightKey, jumpKey, attackKey)
{
    inputObj.left = keyIsDown(leftKey);
    inputObj.right = keyIsDown(rightKey);
    inputObj.jump = keyIsDown(jumpKey);
    inputObj.attack = keyIsDown(attackKey);
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