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
playerStartingOffset = 130;

punchAnticipationFrames = 8;
punchActiveFrames = 15;
punchRecoveryFrames = 7;
hitstunFrames = 12;
knockdownMaxFrames = 90;
wakeupFrames = 16;

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
    
    
    
    updatePlayer(nextGameState.p1, currentGameState.p1, currentP1Input);
    updatePlayer(nextGameState.p2, currentGameState.p2, currentP2Input);
    
    
    
    // resolve "collision"
    
    if(nextGameState.p1.posX < playerWidth/2)
    {
        nextGameState.p1.posX = playerWidth/2;
    }
    
    if(nextGameState.p2.posX > gameWidth - playerWidth/2)
    {
        nextGameState.p2.posX = gameWidth - playerWidth/2;
    }
    
    if(nextGameState.p2.posX - nextGameState.p1.posX < playerWidth)
    {
        let avg = (nextGameState.p1.posX + nextGameState.p2.posX) / 2;
        nextGameState.p1.posX = avg - playerWidth/2;
        nextGameState.p2.posX = avg + playerWidth/2;
    }
    
    
    
    // attack stuff
    
    if(nextGameState.p2.posX - nextGameState.p1.posX < playerAttackDistanceX && Math.abs(nextGameState.p1.posY - nextGameState.p2.posY) < playerAttackDistanceY)
    {
        // players are in range to be hit, given either one is actually attacking
        
        
    }
    
    
    
    // update stateFrameCount for both players
    
    if(nextGameState.p1.state == currentGameState.p1.state)
        nextGameState.p1.stateFrameCount = currentGameState.p1.stateFrameCount + 1;
    else
        nextGameState.p1.stateFrameCount = 1;
    
    if(nextGameState.p2.state == currentGameState.p2.state)
        nextGameState.p2.stateFrameCount = currentGameState.p2.stateFrameCount + 1;
    else
        nextGameState.p2.stateFrameCount = 1;
    
    
    
	return nextGameState;
}

function updatePlayer(nextPlayer, currPlayer, input)
{
    nextPlayer.state = currPlayer.state;
    
    // player state transitions
    switch(currPlayer.state)
    {
        case ps.neutral:
            if(input.attack && !currPlayer.prevAttackInput)
            {
                nextPlayer.state = ps.punching;
            }
            else if(input.jump)
            {
                nextPlayer.state = ps.jumping;
                nextPlayer.velY = jumpSpeed;
            }
            if(input.left)
                nextPlayer.velX -= walkSpeed;
            if(input.right)
                nextPlayer.velX += walkSpeed;
            break;
        
        case ps.jumping:
            if(currPlayer.posY <= 0)
            {
                nextPlayer.state = ps.neutral;
                currPlayer.posY = 0;
            }
            else
            {
                nextPlayer.velX = currPlayer.velX;
                nextPlayer.velY = currPlayer.velY - gravity;
            }
            break;
        
        case ps.punching:
            if(currPlayer.stateFrameCount > (punchAnticipationFrames + punchActiveFrames + punchRecoveryFrames))
            {
                nextPlayer.state = ps.neutral;
            }
            break;
        
        case ps.hitstun:
            if(currPlayer.stateFrameCount > hitstunFrames)
            {
                nextPlayer.state = ps.launched;
                nextPlayer.velY = launchSpeed;
            }
            break;
        
        case ps.knockdown:
            if(currPlayer.stateFrameCount > knockdownMaxFrames || input.left || input.right || input.jump || input.attack)
            {
                nextPlayer.state = ps.wakeup;
            }
            break;
        
        case ps.wakeup:
            if(currPlayer.stateFrameCount > wakeupFrames)
            {
                nextPlayer.state = ps.neutral;
            }
            break;
    }
    
    nextPlayer.prevAttackInput = input.attack;
    
    nextPlayer.posX = currPlayer.posX + nextPlayer.velX;
    nextPlayer.posY = currPlayer.posY + nextPlayer.velY;
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

var currState;
var prevState;

function setup()
{
	frameRate(60);
	createCanvas(800, 450);
	background(0);
    textAlign(LEFT, BOTTOM);
    
    currState = new GameState();
    prevState = new GameState();
    
    currState.p1.posX = playerStartingOffset;
    currState.p2.posX = gameWidth - playerStartingOffset;
}

function draw() 
{
    check_update_wobbly_frames();

    inputsP1 = new PlayerInputs();
    inputsP2 = new PlayerInputs();
    
    getInputs(inputsP1, 65, 68, 87, 32); // A D W Space
    getInputs(inputsP2, 37, 39, 38, 96); // Left Right Up Num0
    
    currState = generateNextGameState(currState, inputsP1, inputsP2);
    
    //console.log("p1:" + currState.p1.state + " p2:" + currState.p2.state); // log each player's state
    
    draw_gamestate(currState);
}

function image_wobbly(spriteStr, xCoord, yCoord, flip)
{
    push();
        translate(xCoord, yCoord);
        if(flip)
        {
            scale(-1, 1);
        }
        let temp = wobbly_sprites[spriteStr];
        image(temp.arr[temp.frame], 0, 0, temp.arr[temp.frame].width, temp.arr[temp.frame].height);
    pop();
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
        image_wobbly("game_window", 0, 0, false);
        drawPlayer(gamestate.p1, false);
        drawPlayer(gamestate.p2, true);
    pop();
}

function drawPlayer(player, flip)
{
    push();
        translate(8,10);
        imageMode(CENTER);
        switch(player.state)
        {
            case ps.neutral:
                if(player.velX != 0)
                {
                    if(frameCount % 46 > 26)
                        image_wobbly((myXOR(!flip, player.velX > 0) ? "player_walk1" : "player_walk3"), player.posX, pyc(player.posY), flip);
                    else if(frameCount % 46 > 13)
                        image_wobbly("player_walk2", player.posX, pyc(player.posY), flip);
                    else
                        image_wobbly((myXOR(!flip, player.velX > 0) ? "player_walk3" : "player_walk1"), player.posX, pyc(player.posY), flip);
                }
                else
                    image_wobbly("player_idle", player.posX, pyc(player.posY), flip);
                
                break;
                
            case ps.jumping:
                if(player.velY > 0)
                    image_wobbly("player_jump_rising", player.posX, pyc(player.posY), flip);
                else
                    image_wobbly("player_jump_falling", player.posX, pyc(player.posY), flip);
                break;
                
            case ps.punching:
                if(player.stateFrameCount <= punchAnticipationFrames)
                    image_wobbly("player_punch_anticipation", player.posX, pyc(player.posY), flip);
                else if(player.stateFrameCount <= punchAnticipationFrames + punchActiveFrames)
                    image_wobbly("player_punch_full", player.posX, pyc(player.posY), flip);
                else
                    image_wobbly("player_punch_partial", player.posX, pyc(player.posY), flip);
                break;
                
            case ps.hitstun:
                image_wobbly("player_hitstun", player.posX, pyc(player.posY), flip);
                break;
                
            case ps.launched:
                if(player.velY > 4.5)
                    image_wobbly("player_launch_rising", player.posX, pyc(player.posY), flip);
                else if(player.velY < -4.5)
                    image_wobbly("player_launch_falling", player.posX, pyc(player.posY), flip);
                else
                    image_wobbly("player_launch_apex", player.posX, pyc(player.posY), flip);
                break;
                
            case ps.knockdown:
                image_wobbly("player_knockdown", player.posX, pyc(player.posY), flip);
                break;
                
            case ps.wakeup:
                image_wobbly("player_wakeup", player.posX, pyc(player.posY), flip);
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

function myXOR(op1, op2)
{
    return ((op1 || op2) && !(op1 && op2));
}

function getInputs(inputObj, leftKey, rightKey, jumpKey, attackKey)
{
    inputObj.left = keyIsDown(leftKey);
    inputObj.right = keyIsDown(rightKey);
    inputObj.jump = keyIsDown(jumpKey);
    inputObj.attack = keyIsDown(attackKey);
}