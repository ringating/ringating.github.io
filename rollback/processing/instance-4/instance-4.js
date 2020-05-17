var instance4 = function(p)
{
    var currState;
    var latencyArr = new Array();
    var inputArr = new Array();
    
    p.setup = function()
    {
        let myCanvas = p.createCanvas(947, 520);
        myCanvas.parent("#instance4");
        p.frameRate(60);
        p.background(0);
        p.textAlign(p.LEFT, p.BOTTOM);
        
        currState = new GameState();
        
        currState.p1.posX = playerStartingOffset;
        currState.p2.posX = gameWidth - playerStartingOffset;
    };
    
    p.draw = function()
    {
        latencyArr.push((Math.sin(p.frameCount / 45) + 1) * 36);
        inputArr.push( getInputs(p, new PlayerInputs(), 65, 68, 87, 32) ); // A D W Space
        
        if(inputArr.length * 16.66666666666 > latencyArr[latencyArr.length-1])
        {
            // update gamestate
            currState = generateNextGameState(currState, inputArr.shift(), getNoInput(new PlayerInputs()));
        }
        else
        {
            // don't update gamestate, instead allow input buffer to build up
        }
        
        p.background(255);
        draw_gamestate(p, currState, 0, 0);
        drawLatencyGraph(p, 647, 0, latencyArr, 300);
        drawInputDelay(p, inputArr, 86, 386);
    };
};

function drawInputDelay(p, inputs, x, y)
{
    let boxLength = 100;
    p.push();
        p.translate(x,y);
        
    p.pop();
    
    function drawInput(inputObj, i)
    {
        p.push();
            p.translate(i*boxLength, 0);
            
        p.pop();
    }
}

var p5_instance4; // initialized in base_game's setup function