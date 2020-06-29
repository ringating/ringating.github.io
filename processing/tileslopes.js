const tileType = 
{
    "none": 0,
    "full": 1,
    "slopeTop": 2,
    "slopeMiddle": 3,
    "slopeBottom": 4
};

const cardinal = 
{
    "N": 0,
    "S": 1,
    "E": 2,
    "W": 3,
    "NE": 4,
    "NW": 5,
    "SE": 6,
    "SW": 7
};

var tileSize = 70;
var gridWidth = 16;
var gridHeight = 9;

var cornerReticleOffset = 5;
var cornerReticleLength = 10;

var vertSelectRadius = 15;

var tiles;
var mouseWasPressed;
var draggingSlope;
var reticleColor;
var validColor;
var invalidColor;
var currColor;

class Coord // used for returning
{
    constructor(x, y)
    {
        this.x = x;
        this.y = y;
    }
}

var dragVert = new Coord(0,0);

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
    
    setLeftVert(left) // relevant for slopeTop
    {
        this.leftVert = left;
        this.rightVert = !left;
    }
    
    setRightVert(right) // relevant for slopeTop
    {
        this.leftVert = !right;
        this.rightVert = right;
    }
}



// p5js callbacks

function setup()
{
    frameRate(60);
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
    
    draggingSlope = false;
    
    reticleColor = color("#A17FFF");
    validColor = color("#00FF00");
    invalidColor = color("#FF0000");
}

function draw() 
{
    background(255);
    
    for(let i = 0; i < gridWidth; ++i)
        for(let j = 0; j < gridHeight; ++j)
            drawTile(i,j);
    
    drawGridLines();
    updateMouseStuff();
    drawReticleStuff();
    
    mouseWasPressed = mouseIsPressed;
}



// other functions

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
            push();
                noFill();
                stroke(0);
                strokeWeight(2);
                
                let topVertPixel = new Coord(0,y*tileSize);
                if(tiles[x][y].leftVert)
                {
                    topVertPixel.x = x*tileSize;
                }
                else
                {
                    topVertPixel.x = (x+1)*tileSize;
                }
                circle(topVertPixel.x, topVertPixel.y+5, 10);
                
                let bottomVertPixel = new Coord(0,0);
                let slopeDir;
                if(isATopOfB(x, y, x+1, y))
                    slopeDir = cardinal.E;
                else if(isATopOfB(x, y, x-1, y))
                    slopeDir = cardinal.W;
                else if(isATopOfB(x, y, x, y-1))
                    slopeDir = cardinal.N;
                else if(isATopOfB(x, y, x, y+1))
                    slopeDir = cardinal.S;
                
            pop();
            break;
    }
}

function isATopOfB(ax, ay, bx, by)
{
    if(ax < 0 || ay < 0 || bx < 0 || by < 0)
        return false;
    
    if(ax >= gridWidth || ay >= gridHeight || bx >= gridWidth || by >= gridHeight)
        return false;
    
    if(tiles[bx][by].topX == ax && tiles[bx][by].topY == ay)
        return true;
    
    return false;
}

function updateMouseStuff()
{
    if(mouseIsPressed)
    {
        if(!mouseWasPressed)
        {
            if(distanceToNearestVert(mouseX, mouseY) <= vertSelectRadius)
            {
                draggingSlope = true;
                dragVert = pixelToVert(mouseX, mouseY);
            }
            else
            {
                let tileCoord = pixelToTile(mouseX, mouseY);
                let x = tileCoord.x;
                let y = tileCoord.y;
                
                if(mouseButton === LEFT && x >= 0 && x < gridWidth && y >= 0 && y < gridHeight)
                {
                    toggleTile(x, y);
                }
            }
        }
        else //if(mouseWasPressed)
        {
            if(draggingSlope)
            {
                let cursorVert = pixelToVert(mouseX, mouseY);
                if(slopeVertsAreValid(dragVert.x, dragVert.y, cursorVert.x, cursorVert.y))
                {
                    currColor = validColor;
                }
                else
                {
                    currColor = invalidColor;
                }
                push();
                    noFill();
                    stroke(currColor);
                    strokeWeight(2);
                    line(dragVert.x*tileSize, dragVert.y*tileSize, cursorVert.x*tileSize, cursorVert.y*tileSize);
                    circle(dragVert.x*tileSize, dragVert.y*tileSize, vertSelectRadius*2);
                    circle(cursorVert.x*tileSize, cursorVert.y*tileSize, vertSelectRadius*2);
                pop();
            }
        }
    }
    else
    {
        if(mouseWasPressed)
        {
            if(draggingSlope)
            {
                // try to create the resulting slope
                let cursorVert = pixelToVert(mouseX, mouseY);
                if(slopeVertsAreValid(dragVert.x, dragVert.y, cursorVert.x, cursorVert.y))
                {
                    let topTile = getTopOfSlope(dragVert.x, dragVert.y, cursorVert.x, cursorVert.y);
                    tiles[topTile.x][topTile.y].type = tileType.slopeTop;
                    
                    // set top tile properties
                    let cursorIsLeft = cursorVert.x < dragVert.x;
                    if(cursorVert.y < dragVert.y)
                    {
                        tiles[topTile.x][topTile.y].setLeftVert(cursorIsLeft);
                    }
                    else
                    {
                        tiles[topTile.x][topTile.y].setLeftVert(!cursorIsLeft);
                    }
                    
                    if(Math.abs(dragVert.x-cursorVert.x) > 1 || Math.abs(dragVert.y-cursorVert.y) > 1)
                    {
                        // create bottom and middle slope tiles
                    }
                    
                }
            }
            draggingSlope = false;
        }
    }
}

function createHorizontalSlope(topX, topY, bottomX, bottomY)
{
    
}

function createVerticalSlope(leftX, leftY, rightX, rightY)
{
    
}

function getTopOfSlope(x1, y1, x2, y2) // vert coords
{
    let ret = new Coord(0,0);
    if(y1 < y2)
    {
        if(x1 < x2)
        {
            // SE tile from x1,y1
            ret.x = x1;
            ret.y = y1;
        }
        else
        {
            // SW tile from x1,y1
            ret.x = x1-1;
            ret.y = y1;
        }
    }
    else
    {
        if(x2 < x1)
        {
            // SE tile from x2,y2
            ret.x = x2;
            ret.y = y2;
        }
        else
        {
            // SW tile from x2,y2
            ret.x = x2-1;
            ret.y = y2;
        }
    }
    return ret;
}

function getBottomOfSlope(x1, y1, x2, y2) // vert coords
{
    let ret = new Coord(0,0);
    if(y1 > y2)
    {
        if(x1 < x2)
        {
            // NE tile from x1,y1
            ret.x = x1;
            ret.y = y1-1;
        }
        else
        {
            // NW tile from x1,y1
            ret.x = x1-1;
            ret.y = y1-1;
        }
    }
    else
    {
        if(x2 > x1)
        {
            // NE tile from x2,y2
            ret.x = x2;
            ret.y = y2-1;
        }
        else
        {
            // NW tile from x2,y2
            ret.x = x2-1;
            ret.y = y2-1;
        }
    }
    return ret;
}

function slopeVertsAreValid(x1, y1, x2, y2) // vert coords
{
    if((Math.abs(x1-x2) != 1) && (Math.abs(y1-y2) != 1))
        return false;
    
    if((x1 === x2) || (y1 === y2))
        return false;
    
    let topTile = getTopOfSlope(x1, y1, x2, y2);
    let botTile = getBottomOfSlope(x1, y1, x2, y2);
    if(slopeIsBlocked(topTile.x, topTile.y, botTile.x, botTile.y))
        return false;
    
    return true;
}

function slopeIsBlocked(x1, y1, x2, y2) // tile coords
{
    if(x2 < x1 || y2 < y1)
    {
        let temp = x1;
        x1 = x2;
        x2 = temp;
        
        temp = y1;
        y1 = y2;
        y2 = temp;
    }
    
    for(let i = x1; i <= x2; ++i)
    {
        for(let j = y1; j <= y2; ++j)
        {
            if(tiles[i][j].type != tileType.none)
            {
                return true;
            }
        }
    }
    
    return false;
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
        
        case tileType.slopeTop:
        case tileType.slopeMiddle:
        case tileType.slopeBottom:
            deleteSlopeTile(x, y);
            break;
    }
}

function deleteSlopeTile(x, y)
{
    //TODO
}

function distanceToNearestVert(x, y)
{
    let vertCoord = pixelToVert(x, y);
    let a = x - vertCoord.x * tileSize;
    let b = y - vertCoord.y * tileSize;
    return Math.sqrt(a*a + b*b);
}