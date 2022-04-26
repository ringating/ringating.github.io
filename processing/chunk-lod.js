const chunk0Length = 10;

var lodChunkSizes = [chunk0Length, chunk0Length*2, chunk0Length*4, chunk0Length*8]; // pixels, each size up is double the prior
var lodDistances = [2, 2, 2, 2]; // measured in lengths of their associated LoD. must be even to prevent overlap w/ bordering smaller chunks

var canvasLength = 0;
for(let i = 0; i < lodChunkSizes.length; ++i)
{
    canvasLength += lodChunkSizes[i] * lodDistances[i];
}
canvasLength *= 2;

const canvasLengthInChunks = Math.floor( canvasLength / lodChunkSizes[0] );

class Coord // used for returning
{
    constructor(x, y)
    {
        this.x = x;
        this.y = y;
    }
}

class Chunk
{
    constructor(lod, x, y)
    {
        this.lod = lod;
        this.x = x;
        this.y = y;
    }
    
    get str()
    {
        GetChunkStr(lod, x, y);
    }
}

var lodChunks = [[],[],[],[]];


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
    
    var origin = GetClosestChunkOrigin(mouseX, mouseY);
    var takenOffsets = {};
    
    for(let lod = 1; lod < 2; ++lod)
    {
        for(let x = -(lodDistances[lod]-1); x < lodDistances[lod] - 1; ++x)
        {
            for(let y = -(lodDistances[lod]-1); y < lodDistances[lod] - 1; ++y)
            {
                chunk0Offset = GetChunk0Coord(lod, x, y);                                       // the offset from the cursor, in chunk0 units
                chunk0Coord = new Coord(chunk0Offset.x + origin.x, chunk0Offset.y + origin.y);  // the actual coord to draw from, in chunk0 units
                
                offsetStr = CoordToString(chunk0Coord);
                
                if(takenOffsets.hasOwnProperty(offsetStr))
                {
                    //console.log("skipping");
                    continue;
                }
                else
                {
                    takenOffsets[offsetStr] = true;
                    
                    DrawChunkRect(lod, x, y);
                    
                    //console.log("lod " + lod);
                }
            }
        }
    }
    
    //console.log("end of draw");
}



// other functions

function GetChunkStr(lod, x, y)
{
    return "" + lod + "," + x + "," + y;
}

function CoordToString(coord)
{
    return "" + coord.x + "," + coord.y;
}

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

function GetChunk0Coord(lod, lodX, lodY)
{
    var scalar = lodChunkSizes[lod] / lodChunkSizes[0];
    
    return new Coord(Math.round(lodX * scalar), Math.round(lodY * scalar));
}

function GetChunkThatContainsPoint(x, y)
{
    return GetClosestChunkOrigin(x - lodChunkSizes[0]/2, y - lodChunkSizes[0]/2);
    //return new Coord(ConvertToChunkUnits(x - lodChunkSizes[0]/2), ConvertToChunkUnits(y - lodChunkSizes[0]/2));
}

function GetClosestChunkOrigin(x, y)
{
    return new Coord(ConvertToChunkUnits(x), ConvertToChunkUnits(y));
}

function ConvertToChunkUnits(pixels)
{
    return Math.round(pixels/lodChunkSizes[0]);
}

function ConvertCoordLoD(oldCoord, oldLoD, newLoD)
{
    
}