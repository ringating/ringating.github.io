const tileType = 
{
    "none": 0,
    "full": 1,
    "point": 2,
    "interp": 3
};

var tileSize = 70;
var gridWidth = 16;
var gridHeight = 9;

var tiles;



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
            tiles[i][j] = tileType.none;
        }
    }
}



function draw() 
{
    background(255);
    
    for(let i = 0; i < gridWidth; ++i)
        for(let j = 0; j < gridHeight; ++j)
            drawTile(i,j);
    
    drawGridLines();
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
    push();
        stroke(100);
        strokeWeight(2);
        translate(x*tileSize, y*tileSize);
        let cornerLength = 10;
        let cornerOffset = 5;
        let dotDiameter = 8;
        
        switch(tiles[x][y])
        {
            case tileType.none:
                break;
                
            case tileType.full:
                angleMode(DEGREES);
                for(let i = 0; i < 4; ++i)
                {
                    line(cornerOffset, cornerOffset, cornerOffset, cornerOffset+cornerLength);
                    line(cornerOffset, cornerOffset, cornerOffset+cornerLength, cornerOffset);
                    translate(0, tileSize);
                    rotate(-90);
                }
                break;
                
            case tileType.point:
                noStroke();
                fill(0);
                circle(tileSize/2, tileSize/2, dotDiameter);
                break;
                
            case tileType.interp:
                translate(tileSize/2, tileSize/2);
                textAlign(CENTER, CENTER);
                noStroke();
                fill(200);
                textSize(12);
                text("interp", 0, 0);
                break;
        }
    pop();
}



function mousePressed()
{
    if(mouseX >= 0 && mouseX < tileSize*gridWidth && mouseY >= 0 && mouseY < tileSize*gridHeight)
    {
        let x = Math.floor(mouseX / tileSize);
        let y = Math.floor(mouseY / tileSize);
        tiles[x][y] = (tiles[x][y] + 1) % 4;
    }
}