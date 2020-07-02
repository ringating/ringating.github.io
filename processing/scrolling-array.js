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
        // let count = 0;
        this.arr = new Array(arrSize);
        for(let i = 0; i < arrSize; ++i)
        {
            this.arr[i] = new Array(arrSize);
            for(let j = 0; j < arrSize; ++j)
            {
                //this.arr[i][j] = getRandomInt(10);
                //this.arr[i][j] = (i + j) % arrSize;
                //this.arr[i][j] = count++;
                this.arr[i][j] = calcTile(i,j);
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
                retArr[i][j] = this.arr[wrap(this.origin.x + i)][wrap(this.origin.y + j)];
            }
        }
        
        return retArr;
    }
    
    scrollHorizontal(dir) // 1 or -1
    {
        this.origin.x += dir;
        
        if(dir === 1)
        {
            let col = wrap(this.origin.x - 1);
            let row;
            for(let j = 0; j < arrSize; ++j)
            {
                row = wrap(this.origin.y + j);
                this.arr[col][row] = calcTile(this.origin.x + arrSize, this.origin.y + j);
            }
        }
        else if(dir === -1)
        {
            let col = wrap(this.origin.x);
            let row;
            for(let j = 0; j < arrSize; ++j)
            {
                row = wrap(this.origin.y + j);
                this.arr[col][row] = calcTile(this.origin.x, this.origin.y + j);
            }
        }
    }
    
    scrollVertical(dir) // 1 or -1
    {
        this.origin.y += dir;
        
        if(dir === 1)
        {
            let row = wrap(this.origin.y - 1);
            let col;
            for(let i = 0; i < arrSize; ++i)
            {
                col = wrap(this.origin.x + i);
                this.arr[col][row] = calcTile(this.origin.x + i, this.origin.y + arrSize);
            }
        }
        else if(dir === -1)
        {
            let row = wrap(this.origin.y);
            let col;
            for(let i = 0; i < arrSize; ++i)
            {
                col = wrap(this.origin.x + i);
                this.arr[col][row] = calcTile(this.origin.x + i, this.origin.y);
            }
        }
    }
}

var SA;

// p5js callbacks

function setup()
{
    SA = new ScrollingArray();
    frameRate(60);
	let c = createCanvas(tileSize * arrSize * 2, tileSize * arrSize * 2);
    // c.elt.style = 'max-width: 100%; max-height: 100%;';
	textAlign(CENTER, CENTER);
    textSize(12);
    fill(255);
    strokeWeight(1);
}

var keyTimer = 0;
const keyDelay = 6;
var moved = false;

function draw() 
{
    // input/"speed" stuff
    if(keyTimer <= 0)
    {
        moved = tryMove();
    }
    else
        keyTimer--;
    
    if(moved)
        keyTimer = keyDelay;
    
    moved = false;
    
    // ...
    background(0);
    noStroke();

    // draw offset array
    var tempArr = SA.array;
    for(let i = 0; i < arrSize; ++i)
        for(let j = 0; j < arrSize; ++j)
            {
            push();
                if(tempArr[i][j] === 0)
                    fill(100);
                else
                    fill(255);
                text(""+tempArr[i][j], i*tileSize + tileSize/2, j*tileSize + tileSize/2);
            pop();
        }
    
    // draw a "player"
    let pos = Math.floor(arrSize/2)*tileSize;
    square(pos, pos, tileSize);
    
    // draw actual array w/ origin lines
    translate(arrSize*tileSize, arrSize*tileSize);
    for(let j = 0; j < arrSize; ++j)
        for(let i = 0; i < arrSize; ++i)
        {
            push();
                if(SA.arr[i][j] === 0)
                    fill(100);
                else
                    fill(255);
                text(""+SA.arr[i][j], i*tileSize + tileSize/2, j*tileSize + tileSize/2);
            pop();
        }
    stroke(color(255, 0, 0));
    line(Math.floor(tileSize * wrap(SA.origin.x))+0.5, 0.5, Math.floor(tileSize * wrap(SA.origin.x))+0.5, arrSize*tileSize+0.5);
    line(0.5, Math.floor(tileSize * wrap(SA.origin.y))+0.5, arrSize*tileSize+0.5, Math.floor(tileSize * wrap(SA.origin.y))+0.5);
}

function tryMove()
{
    let moved = false;
    
    if(keyIsDown(RIGHT_ARROW))
    {
        SA.scrollHorizontal(1);
        moved = true;
    }
        
    if(keyIsDown(LEFT_ARROW))
    {
       SA.scrollHorizontal(-1);
       moved = true;
    }
        
    if(keyIsDown(UP_ARROW))
    {
        SA.scrollVertical(-1);
        moved = true;
    }
    
    if(keyIsDown(DOWN_ARROW))
    {
        SA.scrollVertical(1);
        moved = true;
    }
    
    return moved;
}

function wrap(n)
{
    while(n < 0)
        n += arrSize;
    return (n) % arrSize;
}

function calcTile(i, j)
{
    // let sign = 1;
    // if((i < 0 || j < 0) && !(i < 0 && j < 0))
        // sign = -1;
    // return Math.min(Math.abs(i), Math.abs(j)) * sign;
    
    if(Math.random() < 0.1)
        return 1;
    else
        return 0;
}

// // from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
// function getRandomInt(max) {
  // return Math.floor(Math.random() * Math.floor(max));
// }