const tileType = 
{
    "none": 0,
    "full": 1,
    "slopeTop": 2,
    "slopeMiddle": 3,
    "slopeBottom": 4
};

var tileSize = 70;
var gridWidth = 16;
var gridHeight = 9;

var cornerReticleOffset = 5;
var cornerReticleLength = 10;

var vertSelectRadius = 15;

var tiles;
var mouseWasPressed;
var reticleColor;

class Coord // used for returning
{
    constructor(x, y)
    {
        this.x = x;
        this.y = y;
    }
}

class Tile
{
    constructor(type)
    {
        this.type = type;
    }
    
    setSlopeTop(x, y) // relevant for slopeMiddle or slopeBottom
    {
        this.topX = x;
        this.topY = y;
    }
    
    setLeftVert() // relevant for slopeTop
    {
        this.leftVert = true;
        this.rightVert = false;
    }
    
    setRightVert() // relevant for slopeTop
    {
        this.leftVert = false;
        this.rightVert = true;
    }
}



// p5js callbacks

function setup()
{
    frameRate(999);
	let c = createCanvas(tileSize * gridWidth, tileSize * gridHeight);
    // c.elt.style = 'max-width: 100%; max-height: 100%;';
	background(0);
    
    // initialize the tiles
    tiles = new Array(gridWidth);
    for(let i = 0; i < tiles.length; ++i)
    {
        tiles[i] = new Array(gridHeight);
        for(let j = 0; j < tiles[i].length; ++j)
        {
            tiles[i][j] = new Tile(tileType.none);
        }
    }
    
    mouseWasPressed = false;
    
    reticleColor = color("#A17FFF");
}



function draw() 
{
    background(255);
    
    for(let i = 0; i < gridWidth; ++i)
        for(let j = 0; j < gridHeight; ++j)
            drawTile(i,j);
    
    drawGridLines();
    
    drawReticleStuff();
}



function drawGridLines()
{
    push();
        stroke("rgba(0,0,0,0.25)");
        strokeWeight(1);
        for(let i = 0; i <= gridWidth; ++i)
        {
            line(i*tileSize, 0, i*tileSize, gridHeight*tileSize);
        }
        for(let i = 0; i <= gridHeight; ++i)
        {
            line(0, i*tileSize, gridWidth*tileSize, i*tileSize);
        }
    pop();
}



function drawTile(x, y)
{
    switch(tiles[x][y].type)
    {
        case tileType.none:
            break;
            
        case tileType.full:
            push();
                noFill();
                stroke(0);
                strokeWeight(2);
                square(x*tileSize + cornerReticleOffset, y*tileSize + cornerReticleOffset, tileSize - 2*cornerReticleOffset);
            pop();
            break;
            
        case tileType.slopeTop:
            // draw all of this slope's tiles
            
            break;
    }
}

function drawReticleStuff()
{
    let vertCoord = pixelToVert(mouseX, mouseY);
    let tileCoord = pixelToTile(mouseX, mouseY);
    
    if(distanceToNearestVert(mouseX, mouseY) <= vertSelectRadius)
    {
        drawVertReticle(vertCoord.x, vertCoord.y);
    }
    else
    {
        drawTileReticle(tileCoord.x, tileCoord.y);
    }
}

function drawTileReticle(x, y)
{
    for(let i = 0; i < 4; ++i)
    {
        drawCornerReticle(x, y, i);
    }
}

function drawCornerReticle(x, y, rotateCount) // rotate starts upper left and rotates counter-clockwise
{
    rotateCount = rotateCount % 4;
    
    push();
        stroke(reticleColor);
        strokeWeight(2);
        translate(x*tileSize, y*tileSize);
        angleMode(DEGREES);
        
        for(let i = 0; i < rotateCount; ++i)
        {
            translate(0, tileSize);
            rotate(-90);
        }
        
        line(cornerReticleOffset, cornerReticleOffset, cornerReticleOffset, cornerReticleOffset+cornerReticleLength);
        line(cornerReticleOffset, cornerReticleOffset, cornerReticleOffset+cornerReticleLength, cornerReticleOffset);
        
    pop();
}

function drawVertReticle(x, y)
{
    push();
        noFill();
        stroke(reticleColor);
        strokeWeight(2);
        circle(x*tileSize, y*tileSize, vertSelectRadius * 2);
    pop();
}

function pixelToTile(x, y)
{
    return new Coord(
        Math.floor(x / tileSize), 
        Math.floor(y / tileSize)
    );
}

function pixelToVert(x, y)
{
    return new Coord(
        Math.min(Math.max(0, Math.floor( (x+tileSize/2) / tileSize)), gridWidth), 
        Math.min(Math.max(0, Math.floor( (y+tileSize/2) / tileSize)), gridHeight) 
    );
}

function mousePressed()
{
    let tileCoord = pixelToTile(mouseX, mouseY)
    let x = tileCoord.x;
    let y = tileCoord.y;
    
    if(mouseButton === LEFT && x >= 0 && x < gridWidth && y >= 0 && y < gridHeight)
    {
        toggleTile(x, y);
    }
}


function toggleTile(x, y)
{
    switch(tiles[x][y].type)
    {
        case tileType.none:
            tiles[x][y].type = tileType.full;
            break;
                
        case tileType.full:
            tiles[x][y].type = tileType.none;
            break;
    }
}

function ensureSlopeValidity()
{
    var slopeWasValid = false;
    
    // check if valid, fix if not
    
    return slopeWasValid;
}

function deleteSlopeTile()
{
    
}

function distanceToNearestVert(x, y)
{
    let vertCoord = pixelToVert(x, y);
    let a = x - vertCoord.x * tileSize;
    let b = y - vertCoord.y * tileSize;
    return Math.sqrt(a*a + b*b);
}