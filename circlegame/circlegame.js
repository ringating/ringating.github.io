var startingRadius = 100; 	// starting radius of the circle
var minRadius = 30; 		// minimum radius of the circle
var radLerp = .0012; 		// lerp value for adjusting the radius each frame

var startingSpeed = 0;  	// starting speed, pixels/frame
var acceleration = .005; 	// pixels/frame/frame

var ang;					// the circle's trajectory, used with speed to update position
var speed;
var radius;

var x; 						// circle's x position
var y; 						// circle's y position
var px; 					// circle's previous x position, used to resolve edge collisions
var py; 					// circle's previous y position, used to resolve edge collisions

var playing;				// whether the game has started
var lost;					// whether the player has lost

var startTime; 				// time that the player starts the game, in ms
var endTime; 				// time that the player loses the game, in ms

function setup()
{
	angleMode(DEGREES);
	ellipseMode(RADIUS);
	createCanvas(windowWidth, windowHeight);
	background(255);
	ang = random(0,360);
	speed = startingSpeed;
	radius = startingRadius;
	fill(127);
	strokeWeight(2);
	
	playing = false;
	lost = false;
}

function draw() 
{
	background(255);
	if(playing)
	{
		if(!lost)
		{
			// move the circle
			x += cos(ang) * speed;
			y += sin(ang) * speed;
			speed += acceleration;
			radius = lerp(radius,minRadius,radLerp);

			// check edge of screen collision, resolve if necessary
			edgeCol();
			
			// draw circle
			fill(255);
			ellipse(x, y, radius, radius);
			
			// check if lost
			if(dist(x,y,mouseX,mouseY) > radius)
			{
				lost = true;
				endTime = millis();
			}
			
			// update px and py
			px = x;
			py = y;
		}
		else
		{
			// you've lost
			fill(0);
			textSize(32);
			textAlign(CENTER);
			text("game over", windowWidth/2, windowHeight/2);
			textSize(16);
			text("final time: " + ((endTime - startTime)/1000).toFixed(2) + " seconds", windowWidth/2, windowHeight/2 + 20);
			textSize(12);
			text("left click to play again", windowWidth/2, windowHeight/2 + 60);
			
			restart();
		}
	}
	else
	{
		// text to tell player to click to start
		fill(0);
		textSize(32);
		textAlign(CENTER);
		text("left click to start", windowWidth/2, windowHeight/2);
		textSize(16);
		text("try to keep your cursor within the circle", windowWidth/2, windowHeight/2 + 20);
		
		if(mouseIsPressed && mouseButton === LEFT)
		{
			// start
			playing = true;
			x = mouseX;
			y = mouseY;
			startTime = millis();
		}
	}	
}

function edgeCol()
{
	// left
	if(x - radius < 0)
	{
		ang = 90 - (ang - 90);
		x = px;
		//y = py;
	}
	
	// right
	if(x + radius > windowWidth)
	{
		ang = 180 - ang;
		x = px;
		//y = py;
	}
	
	// up
	if(y - radius < 0)
	{
		ang = 180 + (180 - ang);
		//x = px;
		y = py;
	}
	
	//down
	if(y + radius > windowHeight)
	{
		ang = 360 - ang;
		//x = px;
		y = py;
	}
}

function restart()
{
	if(mouseIsPressed && mouseButton === LEFT)
		{
			// reset values
			speed = startingSpeed;
			radius = startingRadius;
			ang = random(0,360);
			lost = false;
			
			// start
			playing = true;
			x = mouseX;
			y = mouseY;
			startTime = millis();
		}
}
