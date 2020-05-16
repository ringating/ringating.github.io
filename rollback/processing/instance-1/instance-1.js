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
        inputsP1 = new PlayerInputs();
        inputsP2 = new PlayerInputs();
        
        getInputs(p, inputsP1, 65, 68, 87, 32); // A D W Space
        getInputs(p, inputsP2, 37, 39, 38, 17); // Left Right Up RCtrl
        
        currState = generateNextGameState(currState, inputsP1, inputsP2);
        
        draw_gamestate(p, currState, 0, 0);
    };
};

var p5_instance1; // initialized in base_game's setup function