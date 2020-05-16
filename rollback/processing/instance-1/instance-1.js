var instance1 = function(p)
{
    var currState;
    
    p.setup = function()
    {
        let myCanvas = p.createCanvas(647, 374);
        myCanvas.parent("#instance1");
        p.frameRate(60);
        p.background(0);
        p.textAlign(p.LEFT, p.BOTTOM);
        
        currState = new GameState();
        
        currState.p1.posX = playerStartingOffset;
        currState.p2.posX = gameWidth - playerStartingOffset;
    };
    
    p.draw = function()
    {
        check_update_wobbly_frames();

        inputsP1 = new PlayerInputs();
        inputsP2 = new PlayerInputs();
        
        getInputs(p, inputsP1, 65, 68, 87, 32); // A D W Space
        getInputs(p, inputsP2, 37, 39, 38, 96); // Left Right Up Num0
        
        currState = generateNextGameState(currState, inputsP1, inputsP2);
        
        //console.log("p1:" + currState.p1.stateFrameCount + " p2:" + currState.p2.stateFrameCount);
        
        draw_gamestate(p, currState, 0, 0);
    };
};

var p5_instance1; // initialized in base_game's setup function