var instance2 = function(p)
{
    var currState;
    var recordButton;
    var playbackButton;
    
    p.setup = function()
    {
        let myCanvas = p.createCanvas(647, 374);
        myCanvas.parent("#instance2");
        p.frameRate(60);
        p.background(0);
        p.textAlign(p.LEFT, p.BOTTOM);
        
        currState = new GameState();
        
        currState.p1.posX = playerStartingOffset;
        currState.p2.posX = gameWidth - playerStartingOffset;
        
        recordButton = p.select("#recordButton");
        playbackButton = p.select("#playbackButton");
        
        playbackButton.elt.setAttribute("disabled", "");
        
        recordButton.mousePressed(record);
    };
    
    p.draw = function()
    {
        inputsP1 = new PlayerInputs();
        inputsP2 = new PlayerInputs();
        
        getInputs(p, inputsP1, 65, 68, 87, 32); // A D W Space
        getInputs(p, inputsP2, 37, 39, 38, 96); // Left Right Up Num0
        
        currState = generateNextGameState(currState, inputsP1, inputsP2);
        
        draw_gamestate(p, currState, 0, 0);
    };
    
    function record()
    {
        recordButton.elt.value = "stop recording";
        playbackButton.elt.removeAttribute("disabled");
    }
};

var p5_instance2; // initialized in base_game's setup function