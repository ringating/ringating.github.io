
// *******************
// *** asset stuff ***
// *******************

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

var balsamiqSans;
var textWobbleState = 0; // can be 0-8
var textOffsetX = 0;
var textOffsetY = 0;



// ******************
// *** game stuff ***
// ******************

var gameWidth = 631;
var gameHeight = 355;
var playerWidth = 87;
var playerHeight = 186;
var playerAttackDistanceX = 152; // if the other player is over this far away (relative), attack whiffs
var playerAttackDistanceY = 50; // if the other player is over this far off the ground (absolute), attack whiffs
var walkSpeed = 3.5;
var jumpSpeed = 18;
var launchSpeed = 22;
var gravity = 1;
var playerStartingOffset = 130;

var comboCounterOffsetX = 155;
var comboCounterOffsetY = 120;

var punchAnticipationFrames = 12;
var punchActiveFrames = 10;
var punchRecoveryFrames = 8;
var hitstunFrames = 12;
var knockdownMaxFrames = 90;
var wakeupFrames = 16;

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
        
        this.prevAttackInput = false; // attacks only come out on press (not hold), so this necessary
        
        this.comboCounter = 0;
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
        
        if(nextGameState.p1.state == ps.punching && nextGameState.p2.state == ps.punching && currentGameState.p1.stateFrameCount == currentGameState.p2.stateFrameCount)
        {
            if(currentGameState.p1.stateFrameCount > punchAnticipationFrames)
            {
                // trade!
                nextGameState.p1.state = ps.hitstun;
                nextGameState.p2.state = ps.hitstun;
            }
        }
        else if((nextGameState.p1.state == ps.punching) 
            && (nextGameState.p1.state == currentGameState.p1.state) 
            && (currentGameState.p1.stateFrameCount > punchAnticipationFrames) 
            && (currentGameState.p1.stateFrameCount <= punchAnticipationFrames + punchActiveFrames) 
            && (!nextGameState.p1.hitSomething) 
            && (nextGameState.p2.state != ps.knockdown) 
            && (nextGameState.p2.state != ps.wakeup)
            && (nextGameState.p2.state != ps.hitstun))
        {
            // p1 hit p2
            nextGameState.p1.hitSomething = true;
            nextGameState.p2.state = ps.hitstun;
            nextGameState.p2.comboCounter++;
        }
        else if((nextGameState.p2.state == ps.punching) 
            && (nextGameState.p2.state == currentGameState.p2.state) 
            && (currentGameState.p2.stateFrameCount > punchAnticipationFrames) 
            && (currentGameState.p2.stateFrameCount <= punchAnticipationFrames + punchActiveFrames) 
            && (!nextGameState.p2.hitSomething) 
            && (nextGameState.p1.state != ps.knockdown) 
            && (nextGameState.p1.state != ps.wakeup)
            && (nextGameState.p1.state != ps.hitstun))
        {
            // p2 hit p1
            nextGameState.p2.hitSomething = true;
            nextGameState.p1.state = ps.hitstun;
            nextGameState.p1.comboCounter++;
        }
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
    nextPlayer.comboCounter = currPlayer.comboCounter;
    
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
                nextPlayer.hitSomething = false;
            }
            break;
        
        case ps.hitstun:
            if(currPlayer.stateFrameCount > hitstunFrames)
            {
                nextPlayer.state = ps.launched;
                nextPlayer.velY = launchSpeed;
            }
            break;
        
        case ps.launched:
            if(currPlayer.posY <= 0)
            {
                nextPlayer.state = ps.knockdown;
                currPlayer.posY = 0;
            }
            else
            {
                nextPlayer.velX = currPlayer.velX;
                nextPlayer.velY = currPlayer.velY - gravity;
            }
            break;
        
        case ps.knockdown:
            if(currPlayer.stateFrameCount > knockdownMaxFrames || input.left || input.right || input.jump || input.attack)
            {
                nextPlayer.state = ps.wakeup;
                nextPlayer.comboCounter = 0;
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

function copyGameState(fromState, toState)
{
    // toState.p1.posX = fromState.p1.posX;
    // toState.p1.posY = fromState.p1.posY;
    // toState.p1.velX = fromState.p1.velX;
    // toState.p1.velY = fromState.p1.velY;
    // toState.p1.state = fromState.p1.state;
    // toState.p1.stateFrameCount = fromState.p1.stateFrameCount;
    // toState.p1.hitSomething = fromState.p1.hitSomething;
    // toState.p1.prevAttackInput = fromState.p1.prevAttackInput;
    // toState.p1.comboCounter = fromState.p1.comboCounter;
    
    // toState.p2.posX = ;
    // toState.p2.posY = ;
    // toState.p2.velX = ;
    // toState.p2.velY = ;
    // toState.p2.state = ;
    // toState.p2.stateFrameCount = ;
    // toState.p2.hitSomething = ;
    // toState.p2.prevAttackInput = ;
    // toState.p2.comboCounter = ;
    
    for (const player in fromState)
    {
        for (const property in fromState[player])
        {
            toState[player][property] = fromState[player][property];
        }
    }
}



// ********************************************
// *** functions that require a p5 instance ***
// ********************************************

function image_wobbly(p, spriteStr, xCoord, yCoord, flip)
{
    p.push();
        p.translate(xCoord, yCoord);
        if(flip)
        {
            p.scale(-1, 1);
        }
        let temp = wobbly_sprites[spriteStr];
        p.image(temp.arr[temp.frame], 0, 0, temp.arr[temp.frame].width, temp.arr[temp.frame].height);
    p.pop();
}

function check_update_wobbly_frames(p)
{
    if(p.frameCount % 12 === 0)
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
        
        let prevTextWobbleState = textWobbleState;
        textWobbleState = getRandomInt(9);
        if(prevTextWobbleState === textWobbleState)
        {
            textWobbleState = (++prevTextWobbleState) % 9;
        }
        switch(textWobbleState)
        {
            case 0:
                textOffsetX = -1;
                textOffsetY = -1;
                break;
            case 1:
                textOffsetX = 0;
                textOffsetY = -1;
                break;
            case 2:
                textOffsetX = 1;
                textOffsetY = -1;
                break;
            case 3:
                textOffsetX = -1;
                textOffsetY = 0;
                break;
            case 4:
                textOffsetX = 0;
                textOffsetY = 0;
                break;
            case 5:
                textOffsetX = 1;
                textOffsetY = 0;
                break;
            case 6:
                textOffsetX = -1;
                textOffsetY = 1;
                break;
            case 7:
                textOffsetX = 0;
                textOffsetY = 1;
                break;
            case 8:
                textOffsetX = 1;
                textOffsetY = 1;
                break;
        }
    }
}

function draw_gamestate(p, gamestate, posX, posY)
{
    p.push();
        
        p.translate(posX, posY);
        
        p.imageMode(p.CORNER);
        image_wobbly(p, "game_window", 0, 0, false);
        drawPlayer(p, gamestate.p1, false);
        drawPlayer(p, gamestate.p2, true);
        
        if(gamestate.p2.comboCounter > 1)
        {
            drawComboCounter(p, gamestate.p2, 8 + comboCounterOffsetX, 10 + comboCounterOffsetY)
        }
        
        if(gamestate.p1.comboCounter > 1)
        {
            drawComboCounter(p, gamestate.p1, 8 + gameWidth - comboCounterOffsetX, 10 + comboCounterOffsetY)
        }
            
    p.pop();
}

function drawComboCounter(p, player, posX, posY)
{
    p.push();
        
        p.textFont(balsamiqSans);
        
        p.textSize(24);
        p.textAlign(p.CENTER, p.CENTER);
        p.text("COMBO!", textOffsetX + posX, textOffsetY + posY - 10);
        
        p.textSize(48);
        p.textAlign(p.CENTER, p.TOP);
        p.text("" + player.comboCounter, textOffsetX + posX, textOffsetY + posY);
        
    p.pop();
}

function drawPlayer(p, player, flip)
{
    p.push();
        p.translate(8,10);
        p.imageMode(p.CENTER);
        switch(player.state)
        {
            case ps.neutral:
                if(player.velX != 0)
                {
                    if(p.frameCount % 46 > 26)
                        image_wobbly(p, (myXOR(!flip, player.velX > 0) ? "player_walk1" : "player_walk3"), player.posX, pyc(player.posY), flip);
                    else if(p.frameCount % 46 > 13)
                        image_wobbly(p, "player_walk2", player.posX, pyc(player.posY), flip);
                    else
                        image_wobbly(p, (myXOR(!flip, player.velX > 0) ? "player_walk3" : "player_walk1"), player.posX, pyc(player.posY), flip);
                }
                else
                    image_wobbly(p, "player_idle", player.posX, pyc(player.posY), flip);
                
                break;
                
            case ps.jumping:
                if(player.velY > 0)
                    image_wobbly(p, "player_jump_rising", player.posX, pyc(player.posY), flip);
                else
                    image_wobbly(p, "player_jump_falling", player.posX, pyc(player.posY), flip);
                break;
                
            case ps.punching:
                if(player.stateFrameCount <= punchAnticipationFrames)
                    image_wobbly(p, "player_punch_anticipation", player.posX, pyc(player.posY), flip);
                else if(player.stateFrameCount <= punchAnticipationFrames + punchActiveFrames)
                    image_wobbly(p, "player_punch_full", player.posX, pyc(player.posY), flip);
                else
                    image_wobbly(p, "player_punch_partial", player.posX, pyc(player.posY), flip);
                break;
                
            case ps.hitstun:
                image_wobbly(p, "player_hitstun", player.posX, pyc(player.posY), flip);
                break;
                
            case ps.launched:
                if(player.velY > 4.5)
                    image_wobbly(p, "player_launch_rising", player.posX, pyc(player.posY), flip);
                else if(player.velY < -4.5)
                    image_wobbly(p, "player_launch_falling", player.posX, pyc(player.posY), flip);
                else
                    image_wobbly(p, "player_launch_apex", player.posX, pyc(player.posY), flip);
                break;
                
            case ps.knockdown:
                image_wobbly(p, "player_knockdown", player.posX, pyc(player.posY), flip);
                break;
                
            case ps.wakeup:
                image_wobbly(p, "player_wakeup", player.posX, pyc(player.posY), flip);
                break;
        }
    p.pop();
}

function getInputs(p, inputObj, leftKey, rightKey, jumpKey, attackKey)
{
    inputObj.left = p.keyIsDown(leftKey);
    inputObj.right = p.keyIsDown(rightKey);
    inputObj.jump = p.keyIsDown(jumpKey);
    inputObj.attack = p.keyIsDown(attackKey);
}

function getNoInput(inputObj)
{
    inputObj.left = false;
    inputObj.right = false;
    inputObj.jump = false;
    inputObj.attack = false;
}



// *********************************
// *** all other misc. functions ***
// *********************************

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


// **********
// *** actually initialize the base_game instance (loads assets in preload(), initializes all other sketches in setup(), updates wobbly values in draw())
// **********

var base_game = function(p)
{
    p.preload = function()
    {
        balsamiqSans = p.loadFont("http://whiffpunish.com/rollback/processing/assets/BalsamiqSans-Regular.ttf");
        
        wobbly_sprites.game_window.arr.push( p.loadImage("http://whiffpunish.com/rollback/processing/assets/game-window/game-window-1.png") );
        wobbly_sprites.game_window.arr.push( p.loadImage("http://whiffpunish.com/rollback/processing/assets/game-window/game-window-2.png") );
        wobbly_sprites.game_window.arr.push( p.loadImage("http://whiffpunish.com/rollback/processing/assets/game-window/game-window-3.png") );
        wobbly_sprites.game_window.arr.push( p.loadImage("http://whiffpunish.com/rollback/processing/assets/game-window/game-window-4.png") );
        
        for(let i = 0; i < 5; ++i)
        {
            wobbly_sprites.player_hitstun.arr.push(             p.loadImage("http://whiffpunish.com/rollback/processing/assets/player-hitstun/player-hitstun-"                          + (i+1) + ".png") );
            wobbly_sprites.player_idle.arr.push(                p.loadImage("http://whiffpunish.com/rollback/processing/assets/player-idle/player-idle-"                                + (i+1) + ".png") );
            wobbly_sprites.player_jump_falling.arr.push(        p.loadImage("http://whiffpunish.com/rollback/processing/assets/player-jump-falling/player-jump-falling-"                + (i+1) + ".png") );
            wobbly_sprites.player_jump_rising.arr.push(         p.loadImage("http://whiffpunish.com/rollback/processing/assets/player-jump-rising/player-jump-rising-"                  + (i+1) + ".png") );
            wobbly_sprites.player_knockdown.arr.push(           p.loadImage("http://whiffpunish.com/rollback/processing/assets/player-knockdown/player-knockdown-"                      + (i+1) + ".png") );
            wobbly_sprites.player_launch_apex.arr.push(         p.loadImage("http://whiffpunish.com/rollback/processing/assets/player-launch-apex/player-launch-apex-"                  + (i+1) + ".png") );
            wobbly_sprites.player_launch_falling.arr.push(      p.loadImage("http://whiffpunish.com/rollback/processing/assets/player-launch-falling/player-launch-falling-"            + (i+1) + ".png") );
            wobbly_sprites.player_launch_rising.arr.push(       p.loadImage("http://whiffpunish.com/rollback/processing/assets/player-launch-rising/player-launch-rising-"              + (i+1) + ".png") );
            wobbly_sprites.player_punch_anticipation.arr.push(  p.loadImage("http://whiffpunish.com/rollback/processing/assets/player-punch-anticipation/player-punch-anticipation-"    + (i+1) + ".png") );
            wobbly_sprites.player_punch_full.arr.push(          p.loadImage("http://whiffpunish.com/rollback/processing/assets/player-punch-full/player-punch-full-"                    + (i+1) + ".png") );
            wobbly_sprites.player_punch_partial.arr.push(       p.loadImage("http://whiffpunish.com/rollback/processing/assets/player-punch-partial/player-punch-partial-"              + (i+1) + ".png") );
            wobbly_sprites.player_wakeup.arr.push(              p.loadImage("http://whiffpunish.com/rollback/processing/assets/player-wakeup/player-wakeup-"                            + (i+1) + ".png") );
            wobbly_sprites.player_walk1.arr.push(               p.loadImage("http://whiffpunish.com/rollback/processing/assets/player-walk1/player-walk1-"                              + (i+1) + ".png") );
            wobbly_sprites.player_walk2.arr.push(               p.loadImage("http://whiffpunish.com/rollback/processing/assets/player-walk2/player-walk2-"                              + (i+1) + ".png") );
            wobbly_sprites.player_walk3.arr.push(               p.loadImage("http://whiffpunish.com/rollback/processing/assets/player-walk3/player-walk3-"                              + (i+1) + ".png") );
        }
    };
    
    p.setup = function()
    {
        p.createCanvas(1,1);
        p.frameRate(60);
        
        // initialize other sketches
        p5_instance1 = new p5(instance1);
        p5_instance2 = new p5(instance2);
    };
    
    p.draw = function()
    {
        check_update_wobbly_frames(p);
    };
};

var p5_base_game = new p5(base_game);