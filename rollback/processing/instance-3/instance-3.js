var instance3 = function(p)
{
    var currState;
    var latencyArr = new Array();
    var waitedFrames = 0;
    
    p.setup = function()
    {
        let myCanvas = p.createCanvas(947, 374);
        myCanvas.parent("#instance3");
        p.frameRate(60);
        p.background(0);
        p.textAlign(p.LEFT, p.BOTTOM);
        
        currState = new GameState();
        
        currState.p1.posX = playerStartingOffset;
        currState.p2.posX = gameWidth - playerStartingOffset;
    };
    
    p.draw = function()
    {
        latencyArr.push((Math.sin(p.frameCount / 45) + 1) * 66);
        
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


function drawLatencyGraph(p, x, y, dataPoints, maxDataPoints)
{
    let graphWidth = 280;
    let graphHeight = 230;
    let graphX = 15;
    let graphY = 20;
    
    // remove old data points
    if(dataPoints.length > maxDataPoints)
    {
        let nOldDataPoints = dataPoints.length - maxDataPoints;
        for(let i = 0; i < nOldDataPoints; ++i)
        {
            dataPoints.shift();
        }
    }
    
    // find the max latency value for setting y scale of graph
    let maxLatency = 0;
    for(let i = 0; i < dataPoints.length; ++i)
    {
        if(dataPoints[i] > maxLatency)
        {
            maxLatency = dataPoints[i];
        }
    }
    
    p.push();
        p.translate(x, y);
        p.rectMode(p.CORNER);
        p.noStroke();
        p.fill(255);
        p.rect(0, 0, 300, 250);
        for(let i = 1; i < (maxLatency - 1) / 16.66666666666; ++i)
        {
            drawFrameLine(i);
        }
        p.stroke(0);
        p.strokeWeight(2);
        p.noFill();
        p.beginShape();
            p.vertex(graphX, graphY);
            p.vertex(graphX, graphY + graphHeight);
            p.vertex(graphX + graphWidth, graphY + graphHeight);
        p.endShape();
        p.line(graphX-3, graphY, graphX+3, graphY);
        p.strokeWeight(1);
        p.beginShape();
            for(let i = 0; i < dataPoints.length; ++i)
            {
                p.curveVertex(p.map(i, 0, maxDataPoints, graphX, graphX + graphWidth), p.map(dataPoints[i], 0, maxLatency, graphY + graphHeight, graphY));
            }
        p.endShape();
        if(dataPoints.length > 0)
        {
            p.strokeWeight(4);
            p.point(p.map(dataPoints.length - 1, 0, maxDataPoints, graphX, graphX + graphWidth), p.map(dataPoints[dataPoints.length - 1], 0, maxLatency, graphY + graphHeight, graphY));
        }
        p.noStroke();
        p.fill(0);
        p.textFont("Arial");
        p.text(Math.round(maxLatency) + " ms", graphX - 5, graphY);
    p.pop();
    
    function drawFrameLine(nFrames)
    {
        let yPos = p.map(nFrames*16.66666666666, 0, maxLatency, graphY+graphHeight, graphY);
        p.push();
            p.strokeWeight(1);
            p.stroke(128);
            p.noFill();
            p.line(graphX, yPos, graphX+graphWidth, yPos);
            p.textAlign(p.LEFT, p.BOTTOM);
            p.fill(128);
            p.noStroke();
            if(nFrames === 1)
            {
                p.text("1 frame", graphX + 2, yPos);
            }
            else
            {
                p.text(nFrames + " frames", graphX + 2, yPos);
            }
        p.pop();
    }
}


var p5_instance3; // initialized in base_game's setup function