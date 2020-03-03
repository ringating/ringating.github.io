var north;
var south;
var east;
var west;

var up;
var down;
var left;
var right;

var w;
var a;
var s;
var d;

function keyPressed()
{
    setKey(keyCode, true);
}

function keyReleased()
{
    setKey(keyCode, false);
}

function setKey(kCode, isPressed)
{
    switch(kCode)
    {
        case 38:
            up = isPressed;
            break;
        case 40:
            down = isPressed;
            break;
        case 39:
            right = isPressed;
            break;
        case 37:
            left = isPressed;
            break;
        
        case 87:
            w = isPressed;
            break;
        case 65:
            a = isPressed;
            break;
        case 83:
            s = isPressed;
            break;
        case 68:
            d = isPressed;
            break;
    }
    
    north = w || up;
    south = s || down;
    east = d || right;
    west = a || left;
    
    console.log("input happened!");
}