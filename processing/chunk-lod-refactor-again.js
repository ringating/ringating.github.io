const chunk0Length = 10;

var lodChunkSizes = [chunk0Length, chunk0Length*2, chunk0Length*4, chunk0Length*8]; // pixels, each size up is double the prior
//var lodChunkCounts = [2, 2, 2, 2]; // # of each lod's chunks to draw. must be even.

var lodCutoffs = [50, 100, 200, 300]; // in pixels

var canvasLength = 800;

class Coord // used for returning
{
    constructor(x, y)
    {
        this.x = x;
        this.y = y;
    }
}


// p5js callbacks

function setup()
{
    frameRate(60);
	let c = createCanvas(canvasLength, canvasLength);
    // c.elt.style = 'max-width: 100%; max-height: 100%;';
}

function draw() 
{
    background(0);
    stroke(255);
    strokeWeight(1);
    noFill();
    
    var chunkArr = new Array(lodChunkSizes.length);
    for(let i = 0; i < chunkArr.length; ++i)
    {
        chunkArr[i] = new Array();
    }
    
    var biggestLoD = lodChunkSizes.length - 1;
    
    var containingBiggestChunk = GetChunkCoord(
        biggestLoD, 
        mouseX - lodChunkSizes[biggestLoD]/2, 
        mouseY - lodChunkSizes[biggestLoD]/2
    );
    
    var containingSmallestChunk = GetChunkCoord(
        0, 
        mouseX - lodChunkSizes[0]/2, 
        mouseY - lodChunkSizes[0]/2
    );
    
    // fill the whole visible region with the largest chunks
    var biggestChunkRadius = ConvertToChunkUnits(biggestLoD, lodCutoffs[biggestLoD]);
    for(let i = -biggestChunkRadius; i <= biggestChunkRadius; ++i)
    {
        for(let j = -biggestChunkRadius; j <= biggestChunkRadius; ++j)
        {
            var coord = new Coord(
                i + containingBiggestChunk.x, 
                j + containingBiggestChunk.y
            );
            
            //let distance = GetDistanceBetweenChunks(0, containingSmallestChunk, biggestLoD, coord);
            let distance = GetDistanceToChunkFromMouse(biggestLoD, coord);
            
            if(distance <= lodCutoffs[biggestLoD])
            {
                chunkArr[biggestLoD].push(coord)
            }
        }
    }
    
    for(let i = 0; i < chunkArr[biggestLoD].length; ++i)
    {
        DrawChunkRect(biggestLoD, chunkArr[biggestLoD][i]);
    }
}



// other functions

function GetChunkCoord(lod, pixelX, pixelY)
{
    let x = Math.round(pixelX / lodChunkSizes[lod]);
    let y = Math.round(pixelY / lodChunkSizes[lod]);
    return new Coord(x, y);
}

function DrawChunkRect(lod, lodCoord)
{
    rect
    (
        0.5 + lodCoord.x * lodChunkSizes[lod], 
        0.5 + lodCoord.y * lodChunkSizes[lod], 
        lodChunkSizes[lod], 
        lodChunkSizes[lod]
    );
}

function DrawChunkRectAlt(lod, currLodX, currLodY)
{
    rect
    (
        0.5 + currLodX * lodChunkSizes[lod], 
        0.5 + currLodY * lodChunkSizes[lod], 
        lodChunkSizes[lod], 
        lodChunkSizes[lod]
    );
}

function ConvertToChunkUnits(lod, pixels)
{
    return Math.round(pixels/lodChunkSizes[lod]);
}

function GetCenterOfChunk(lod, lodX, lodY)
{
    return new Coord(
        lodX * lodChunkSizes[lod] + lodChunkSizes[lod]/2,
        lodY * lodChunkSizes[lod] + lodChunkSizes[lod]/2
    );
}

function GetDistanceBetweenChunks(lodA, coordA, lodB, coordB)
{
    let pixelA = GetCenterOfChunk(lodA, coordA.x, coordA.y);
    let pixelB = GetCenterOfChunk(lodB, coordB.x, coordB.y);
    return Math.hypot(pixelA.x - pixelB.x, pixelA.y - pixelB.y);
}

function GetDistanceToChunkFromMouse(lod, chunkCoord)
{
    let chunkCenterPixel = GetCenterOfChunk(lod, chunkCoord.x, chunkCoord.y);
    return Math.hypot(chunkCenterPixel.x - mouseX, chunkCenterPixel.y - mouseY);
}