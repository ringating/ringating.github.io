const chunk0Length = 10;

var lodChunkSizes = [chunk0Length, chunk0Length*2, chunk0Length*4, chunk0Length*8]; // pixels, each size up is double the prior
//var lodChunkCounts = [2, 2, 2, 2]; // # of each lod's chunks to draw. must be even.

var lodStarts = [0, 2, 2, 2]; // distances (in each lod's own units) of how far to traverse out before starting

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
    
    for(let lod = 0; lod < lodChunkSizes.length; ++lod)
    {
        let mouseOff = lodChunkSizes[lod]/2;
        let originChunkCoord = GetChunkCoord(lod, mouseX - mouseOff, mouseY - mouseOff);
        
        DrawChunkRect(lod,  originChunkCoord.x + lodStarts[lod], originChunkCoord.y);
    }
}



// new functions

function GetChunkCoord(lod, pixelX, pixelY)
{
    let x = Math.round(pixelX / lodChunkSizes[lod]);
    let y = Math.round(pixelY / lodChunkSizes[lod]);
    return new Coord(x, y);
}

















// old functions

// function GetChunkStr(lod, x, y)
// {
    // return "" + lod + "," + x + "," + y;
// }

// function CoordToString(coord)
// {
    // return "" + coord.x + "," + coord.y;
// }

// function DrawChunkRect(lod, lodCoord)
// {
    // rect
    // (
        // 0.5 + lodCoord.x * lodChunkSizes[lod], 
        // 0.5 + lodCoord.y * lodChunkSizes[lod], 
        // lodChunkSizes[lod], 
        // lodChunkSizes[lod]
    // );
// }

function DrawChunkRect(lod, currLodX, currLodY)
{
    rect
    (
        0.5 + currLodX * lodChunkSizes[lod], 
        0.5 + currLodY * lodChunkSizes[lod], 
        lodChunkSizes[lod], 
        lodChunkSizes[lod]
    );
}

// function GetChunk0Coord(lod, lodX, lodY)
// {
    // var scalar = lodChunkSizes[lod] / lodChunkSizes[0];
    
    // return new Coord(Math.round(lodX * scalar), Math.round(lodY * scalar));
// }

// function GetChunkThatContainsPoint(x, y)
// {
    // return GetClosestChunkOrigin(x - lodChunkSizes[0]/2, y - lodChunkSizes[0]/2);
    // //return new Coord(ConvertToChunkUnits(x - lodChunkSizes[0]/2), ConvertToChunkUnits(y - lodChunkSizes[0]/2));
// }

// function GetClosestChunkOrigin(x, y)
// {
    // return new Coord(ConvertToChunkUnits(x), ConvertToChunkUnits(y));
// }

// function ConvertToChunkUnits(pixels)
// {
    // return Math.round(pixels/lodChunkSizes[0]);
// }

// function ConvertCoordLoD(oldCoord, oldLoD, newLoD)
// {
    
// }