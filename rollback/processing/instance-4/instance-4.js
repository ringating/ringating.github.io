var instance4 = function(p)
{
    var currState;
    var latencyArr = new Array();
    var waitedFrames = 0;
    
    p.setup = function()
    {
        let myCanvas = p.createCanvas(947, 374);
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
        
        if(latencyArr[latencyArr.length-1] < (waitedFrames+1)*16.66666666666)
        {
            // update gamestate
            inputsP1 = new PlayerInputs();
            inputsP2 = new PlayerInputs();
            
            getInputs(p, inputsP1, 65, 68, 87, 32); // A D W Space
            getNoInput(inputsP2);
            
            currState = generateNextGameState(currState, inputsP1, inputsP2);
            waitedFrames = 0;
        }
        else
        {
            // wait
            waitedFrames++;
        }
        
        p.background(255);
        draw_gamestate(p, currState, 0, 0);
        drawLatencyGraph(p, 647, 0, latencyArr, 300);
    };
};

var p5_instance4; // initialized in base_game's setup function