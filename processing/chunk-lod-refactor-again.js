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
            
            let distance = GetDistanceToChunkFromMouse(biggestLoD, coord);
            
            if(distance <= lodCutoffs[biggestLoD])
            {
                chunkArr[biggestLoD].push(coord)
            }
        }
    }
    
    // subdivide big chunks into smaller ones
    for(let lod = lodChunkSizes.length - 2; lod >= 0; --lod)
    {
        for(let i = chunkArr[lod+1].length-1; i >= 0; --i) // traverse chunks backwards so you can remove the ones that get subdivided
        {
            //var bigChunkCenter = GetCenterOfChunk(lod+1, chunkArr[lod+1][i]);
            
            if(GetDistanceToChunkFromMouse(lod+1, chunkArr[lod+1][i]) < lodCutoffs[lod])
            {
                var subdivided = Subdivide(lod+1, chunkArr[lod+1][i]);
                chunkArr[lod] = chunkArr[lod].concat(subdivided);
                chunkArr[lod+1].splice(i, 1);
            }
        }
    }
    
    // draw all of the chunks
    for(let lod = 0; lod < lodChunkSizes.length; ++lod)
    {
        for(let i = 0; i < chunkArr[lod].length; ++i)
        {
            DrawChunkRect(lod, chunkArr[lod][i]);
        }
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

function GetCenterOfChunk(lod, chunkCoord)
{
    return new Coord(
        chunkCoord.x * lodChunkSizes[lod] + lodChunkSizes[lod]/2,
        chunkCoord.y * lodChunkSizes[lod] + lodChunkSizes[lod]/2
    );
}

// function GetDistanceBetweenChunks(lodA, coordA, lodB, coordB)
// {
    // let pixelA = GetCenterOfChunk(lodA, coordA);
    // let pixelB = GetCenterOfChunk(lodB, coordB);
    // return Math.hypot(pixelA.x - pixelB.x, pixelA.y - pixelB.y);
// }

function GetDistanceToChunkFromMouse(lod, chunkCoord)
{
    let chunkCenterPixel = GetCenterOfChunk(lod, chunkCoord);
    return Math.hypot(chunkCenterPixel.x - mouseX, chunkCenterPixel.y - mouseY);
}

function Subdivide(lod, coord) // returns an Array of the 4 smaller chunks that the chunk subdivides into
{
    var topLeft = new Coord(coord.x * 2, coord.y * 2);
    
    var b = new Coord(topLeft.x + 1, topLeft.y    );
    var c = new Coord(topLeft.x    , topLeft.y + 1);
    var d = new Coord(topLeft.x + 1, topLeft.y + 1);
    
    return [topLeft, b, c, d];
}