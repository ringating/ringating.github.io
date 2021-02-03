const gameWidth = 800;
const gameHeight = 800;

var bgColor;
var colliderColor;
var hazardColor;
var playerColor;
var spawnColor;
var coinColor;
var playerSize = .04;
var coinSize = .03;
var spawnSize = .06;

var currGameState = 0;
var nextGameState = 0;
var prevGameState = 0;
var playerPos;
var coins;
var currPRNG;

class Coord
{
    constructor(_x, _y)
    {
        this.x = _x;
        this.y = _y;
    }
}

class RectNorm
{
    constructor(_x1, _y1, _x2, _y2)
    {
        this.x1 = _x1;
        this.y1 = _y1;
        this.x2 = _x2;
        this.y2 = _y2;
    }
}

class Level
{
    constructor(_colliders, _hazards, _spawnPos, _seed)
    {
        this.colliders = _colliders;
        this.hazards = _hazards;
        this.spawnPos = _spawnPos;
        this.seed = _seed;
    }
}

var levels = new Array();

levels.push(new Level(
    [new RectNorm(0, .3, .66666, .36666), new RectNorm(.33333, .63333, 1, .69999)],
    [],
    new Coord(.15, .15),
    1337 ^ 0xDEADBEEF
));

levels.push(new Level(
    [],
    [new RectNorm(0, .3, .66666, .36666), new RectNorm(.33333, .63333, 1, .69999)],
    new Coord(.15, .15),
    1337 ^ 0xDEADBEEF
));

function setup()
{
    frameRate(60);
	let c = createCanvas(gameWidth, gameHeight);
    // c.elt.style = 'max-width: 100%; max-height: 100%;';
	textAlign(CENTER, CENTER);
    textSize(12);
    fill(255);
    strokeWeight(1);
    
    bgColor =           color(255,255,255);
    colliderColor =     color(  0,  0,  0);
    hazardColor =       color(255,  0,  0);
    playerColor =       color(  0,127,255);
    spawnColor =        color(  0,191,  0);
    coinColor =         color(255,195,  0);
    
    currPRNG = mulberry32(1);
    print(currPRNG());
    print(currPRNG());
    print(currPRNG());
    print(currPRNG());
}

function draw() 
{
    switch(currGameState)
    {
        case 0:
            stateMainMenu();
            break;
        
        case 1:
            stateGameplay();
            break;
        
        default:
            break;
    }
    
    background(colliderColor);
    drawLevel(10, 10, gameWidth-10, gameHeight-10, levels[1]);
    
    prevGameState = currGameState;
    currGameState = nextGameState;
}

function stateMainMenu()
{
    // show coin multiplier, speed multiplier, and buttons to upgrade each
    // level buttons: level preview, coin goal
    
    if(prevGameState == 1)
    {
        
    }
}

// function statePlanning(){}

function stateGameplay()
{
    // show collected coin count
    // coins, player, base (spawn and turn-in)
    // level: solid boxes and hazard boxes
}

function drawLevel(x1, y1, x2, y2, lvl)
{
    push();
    
    translate(x1, y1);
    scale(abs(x2-x1), abs(y2-y1));
    rectMode(CORNERS);
    noStroke();
    
    fill(bgColor);
    rect(0,0,1,1);
    
    fill(colliderColor);
    lvl.colliders.forEach( r => 
    {
        rect(r.x1, r.y1, r.x2, r.y2);
    });
    
    fill(hazardColor);
    lvl.hazards.forEach( r => 
    {
        rect(r.x1, r.y1, r.x2, r.y2);
    });
    
    fill(spawnColor);
    circle(lvl.spawnPos.x, lvl.spawnPos.y, spawnSize);
    
    pop();
}

function rectOverlap(rect1, rect2)
{
    var verticalOverlap =   rangeOverlap(rect1.y1, rect1.y2, rect2.y1, rect2.y2);
    var horizontalOverlap = rangeOverlap(rect1.x1, rect1.x2, rect2.x1, rect2.x2);
    
    return (verticalOverlap && horizontalOverlap);
}

function rangeOverlap(start1, end1, start2, end2)
{
    return 
    (
        valueInRange(start2, start1, end1) ||
        valueInRange(end2,   start1, end1) ||
        valueInRange(start1, start2, end2) ||
        valueInRange(end1,   start2, end2)
    );
}

function valueInRange(value, rangeStart, rangeEnd)
{
    var rangeMax = max(rangeStart, rangeEnd);
    var rangeMin = min(rangeStart, rangeEnd);
    
    return ((value <= rangeMax) && (value >= rangeMin));
}

function getRandomInt(max)
{
  return Math.floor(Math.random() * Math.floor(max));
}

function mulberry32(a) // PRNG from https://stackoverflow.com/a/521323
{
    return function() 
    {
      var t = a += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}





































