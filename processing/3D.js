
function setup()
{
    createCanvas(800, 600, WEBGL);
}

function draw()
{
    background(100);
    rotateX(-pmouseY/100);
    rotateY(-pmouseX/100);
    
    for(let i = 0; i < abs(sin(millis()/400))*10; ++i)
    {
        box();
        translate(50,0,0);
        rotateX(-pmouseX/100);
    }
}