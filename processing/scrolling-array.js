const arrSize = 9;
const tileSize = 25;

class Coord // used for returning
{
    constructor(x, y)
    {
        this.x = x;
        this.y = y;
    }
}

class ScrollingArray
{
    constructor()
    {
        this.origin = new Coord(0,0);
        
        // initialize array
        let count = 0;
        this.arr = new Array(arrSize);
        for(let i = 0; i < arrSize; ++i)
        {
            this.arr[i] = new Array(arrSize);
            for(let j = 0; j < arrSize; ++j)
            {
                //this.arr[i][j] = getRandomInt(10);
                //this.arr[i][j] = (i + j) % arrSize;
                this.arr[i][j] = count++;
            }
        }
    }
    
    get array()
    {
        var retArr = new Array(arrSize);
        for(let i = 0; i < arrSize; ++i)
        {
            retArr[i] = new Array(arrSize);
            for(let j = 0; j < arrSize; ++j)
            {
                retArr[i][j] = this.arr[(this.origin.x + i) % arrSize][(this.origin.y + j) % arrSize];
            }
        }
        
        return retArr;
    }
    
    scrollHorizontal(dir) // 1 or -1
    {
        this.origin.x = (this.origin.x + dir + arrSize) % arrSize;
    }
    
    scrollVertical(dir) // 1 or -1
    {
        this.origin.y = (this.origin.y + dir + arrSize) % arrSize;
    }
}

var SA;

// p5js callbacks

function setup()
{
    SA = new ScrollingArray();
    frameRate(60);
	let c = createCanvas(tileSize * arrSize, tileSize * arrSize);
    // c.elt.style = 'max-width: 100%; max-height: 100%;';
	textAlign(CENTER, CENTER);
    fill(255);
    noStroke();
    textSize(12);
}

function draw() 
{
    background(0);

    var tempArr = SA.array;
    
    for(let i = 0; i < arrSize; ++i)
        for(let j = 0; j < arrSize; ++j)
            text(""+tempArr[i][j], i*tileSize + tileSize/2, j*tileSize + tileSize/2);
}

function keyPressed() {
    
    switch(keyCode)
    {
        case RIGHT_ARROW:
            SA.scrollHorizontal(-1);
            break;
        case LEFT_ARROW:
            SA.scrollHorizontal(1);
            break;
        case UP_ARROW:
            SA.scrollVertical(1);
            break;
        case DOWN_ARROW:
            SA.scrollVertical(-1);
            break;
    }
}

// // from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
// function getRandomInt(max) {
  // return Math.floor(Math.random() * Math.floor(max));
// }