var instance2 = function(p)
{
    var currState;
    var startState;
    
    var recordButton;
    var playbackButton;
    
    var recording;
    var playingBack;
    
    var recordedInputs = new Array();
    var playbackFrameCount = 0;
    
    p.setup = function()
    {
        let myCanvas = p.createCanvas(647, 374);
        myCanvas.parent("#instance2");
        p.frameRate(60);
        p.background(255);
        p.textAlign(p.LEFT, p.BOTTOM);
        
        startState = new GameState();
        startState.p1.posX = playerStartingOffset;
        startState.p2.posX = gameWidth - playerStartingOffset;
        
        currState = new GameState();
        copyGameState(startState, currState);
        
        recordButton = p.select("#recordButton");
        playbackButton = p.select("#playbackButton");
        
        playbackButton.elt.setAttribute("disabled", "");
        
        recordButton.mousePressed(record);
        playbackButton.mousePressed(playback);
    };
    
    p.draw = function()
    {
        if(!elementIsVisible(p.select("#instance2").elt))
        {
            p.frameRate(2);
            return;
        }
        else
        {
            p.frameRate(60);
        }
        
        inputsP1 = new PlayerInputs();
        inputsP2 = new PlayerInputs();
        
        if(!recording && !playingBack)
        {
            // free play
            getInputs(p, inputsP1, 65, 68, 87, 32); // A D W Space
            getNoInput(inputsP2);
            currState = generateNextGameState(currState, inputsP1, inputsP2);
        }
        else
        {
            if(recording)
            {
                getInputs(p, inputsP1, 65, 68, 87, 32); // A D W Space
                getNoInput(inputsP2);
                currState = generateNextGameState(currState, inputsP1, inputsP2);
                
                recordedInputs.push(inputsP1);
            }
            
            if(playingBack)
            {
                getNoInput(inputsP2);
                currState = generateNextGameState(currState, recordedInputs[playbackFrameCount], inputsP2);
                playbackFrameCount++;
                
                if(playbackFrameCount >= recordedInputs.length)
                {
                    stopPlayback();
                }
            }
        }
        
        draw_gamestate(p, currState, 0, 0);
    };
    
    function record()
    {
        if(!recording)
        {
            // start recording
            recording = true;
            recordButton.elt.value = "stop recording";
            playbackButton.elt.setAttribute("disabled", "");
            
            copyGameState(startState, currState);
            playbackFrameCount = 0;
            recordedInputs = new Array();
        }
        else
        {
            // stop recording
            recording = false;
            playbackButton.elt.removeAttribute("disabled");
            recordButton.elt.value = "record inputs";
        }
        
    }
    
    function playback()
    {
        if(!playingBack)
        {
            // start playback
            playingBack = true;
            recordButton.elt.setAttribute("disabled", "");
            playbackButton.elt.value = "stop playback";
            
            copyGameState(startState, currState);
            playbackFrameCount = 0;
        }
        else
        {
            // stop playback
            stopPlayback();
        }
    }
    
    function stopPlayback()
    {
        playingBack = false;
        recordButton.elt.removeAttribute("disabled");
        playbackButton.elt.value = "playback recording";
    }
};

var p5_instance2; // initialized in base_game's setup function