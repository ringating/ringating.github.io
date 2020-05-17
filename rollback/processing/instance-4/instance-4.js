var instance4 = function(p)
{
    var myCanvas;
    var currState;
    var latencyArr = new Array();
    var inputArr = new Array();
    
    p.setup = function()
    {
        myCanvas = p.createCanvas(947, 520);
        myCanvas.parent("#instance4");
        p.frameRate(60);
        p.background(255);
        p.textAlign(p.LEFT, p.BOTTOM);
        
        currState = new GameState();
        
        currState.p1.posX = playerStartingOffset;
        currState.p2.posX = gameWidth - playerStartingOffset;
    };
    
    p.draw = function()
    {
        if(!elementIsVisible(p.select("#instance4").elt))
        {
            p.frameRate(2);
            return;
        }
        else
        {
            p.frameRate(60);
        }
        
        latencyArr.push((Math.sin(p.frameCount / 45) + 1) * 66);
        
        if(inputArr.length * 16.66666666666 > latencyArr[latencyArr.length-1])
        {
            // update gamestate
            currState = generateNextGameState(currState, inputArr.shift(), getNoInput(new PlayerInputs()));
        }
        else
        {
            // don't update gamestate, instead allow input buffer to build up
        }
        
        inputArr.push( getInputs(p, new PlayerInputs(), 65, 68, 87, 32) ); // A D W Space
        
        p.background(255);
        draw_gamestate(p, currState, 0, 0);
        drawLatencyGraph(p, 647, 0, latencyArr, 300);
        drawInputDelay(p, inputArr, 86, 386);
    };
};

const inDir = // enum for input directions
{
    "upLeft":   1,
    "up":       2,
    "upRight":  3,
    "left":     4,
    "neutral":  5,
    "right":    6
};

function drawInputDelay(p, inputs, x, y)
{
    let boxLength = 100;
    p.push();
        p.translate(x,y);
        p.rectMode(p.CORNER);
        p.noFill;
        p.strokeWeight(4);
        p.stroke(165);
        for(let i = 1; i < inputs.length - 1; ++i) // draw all but first and last box/input
        {
            p.square(boxLength*i, 0, boxLength);
            p.push();
                p.tint(255, 90)
                drawInput(inputs[i], i);
            p.pop();
        }
        
        p.stroke(0);
        if(inputs.length > 0)
        {
            // draw the first box/input
            p.square(0, 0, boxLength);
            drawInput(inputs[0], 0);
            p.push();
                p.noStroke();
                p.fill(0);
                p.textAlign(p.CENTER, p.TOP);
                p.text("delayed input", boxLength/2, boxLength + 6);
            p.pop();
        }
        if(inputs.length > 1)
        {
            // draw the last box/input
            p.square(boxLength*(inputs.length-1), 0, boxLength);
            drawInput(inputs[inputs.length-1], inputs.length-1);
            p.push();
                p.noStroke();
                p.fill(0);
                p.textAlign(p.CENTER, p.TOP);
                p.text("current input", boxLength*(inputs.length-1) + boxLength/2, boxLength + 6);
            p.pop();
        }
        
    p.pop();
    
    function drawInput(inputObj, i)
    {
        let inputDirection;
        
        p.push();
            p.translate(i*boxLength, 0);
            
            if(inputObj.jump)
            {
                if(myXOR(inputObj.left, inputObj.right))
                {
                    if(inputObj.left)
                    {
                        // up left
                        inputDirection = inDir.upLeft;
                    }
                    else
                    {
                        // up right
                        inputDirection = inDir.upRight;
                    }
                }
                else
                {
                    // up
                    inputDirection = inDir.up;
                }
            }
            else
            {
                if(myXOR(inputObj.left, inputObj.right))
                {
                    if(inputObj.left)
                    {
                        // left
                        inputDirection = inDir.left;
                    }
                    else
                    {
                        // right
                        inputDirection = inDir.right;
                    }
                }
                else
                {
                    // neutral
                    inputDirection = inDir.neutral;
                }
            }
            
            p.imageMode(p.CENTER);
            if(inputObj.attack || inputDirection != inDir.neutral)
            {
                if(inputObj.attack && inputDirection === inDir.neutral)
                {
                    // just attack
                    p.image(icon_attack, boxLength/2, boxLength/2);
                }
                else
                {
                    if(!inputObj.attack)
                    {
                        // just direction
                        drawRotatedDirectionIcon(inputDirection, boxLength/2, boxLength/2);
                    }
                    else
                    {
                        // attack and direction
                        p.image(icon_attack, boxLength*3/4, boxLength/2);
                        drawRotatedDirectionIcon(inputDirection, boxLength/4, boxLength/2);
                    }
                }
            }
            else
            {
                // no input
                p.strokeWeight(2);
                p.square(boxLength/2 - 5, boxLength/2 - 5, 10);
            }
            
        p.pop();
    }
    
    function drawRotatedDirectionIcon(direction, x, y)
    {
        p.push();
            p.translate(x,y);
            switch(direction)
            {
                case inDir.right:
                    break;
                case inDir.upRight:
                    p.rotate(-p.PI / 4);
                    break;
                case inDir.up:
                    p.rotate(-p.PI / 2);
                    break;
                case inDir.upLeft:
                    p.rotate(-3 * p.PI / 4);
                    break;
                case inDir.left:
                    p.rotate(-p.PI);
                    break;
            }
            p.image(icon_direction, 0, 0);
        p.pop();
    }
}

var p5_instance4; // initialized in base_game's setup function