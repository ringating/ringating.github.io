var button1 = 'a';
var button2 = 'w';
var button3 = 'd';

var b1, b2, b3, preb1, preb2, preb3 = false;

function checkButton(button)
{
	switch(button)
	{
		case button1:
			return b1;
		case button2:
			return b2;
		case button3:
			return b3;
		default:
			return false;
	}
}

class ActionState
{
	constructor(name)
	{
		this.transitions = new Array();
		this.name = name;
	}
	
	addTransition(transition)
	{
		this.transitions.push(transition);
	}
}

class ActTransButton
{
	constructor(nextState, button)
	{
		this.button = button;
		this.nextState = nextState;
	}
	
	checkTransition()
	{
		return checkButton(this.button);
	}
	
	updateEndTime(){}
}

class ActTransTimer
{
	constructor(nextState, timer)
	{
		this.nextState = nextState;
		this.timer = timer;
		this.endTime = 0;
	}
	
	checkTransition()
	{
		//console.log("Date.now()   = " + Date.now());
		//console.log("this.endTime = " + this.endTime);
		return (Date.now() >= this.endTime);
	}
	
	updateEndTime()
	{
		this.endTime = Date.now() + this.timer;
	}
}

class ActionFSM
{
	constructor()
	{
		this.states = new Array();
		this.currentState = "";
	}
	
	addState(newState)
	{
		this.states.push(newState);
	}
	
	addTransition(stateName, transition)
	{
		this.states[this.stateIndex(stateName)].addTransition(transition);
	}
	
	stateIndex(stateName)
	{
		for(let i = 0; i < this.states.length; ++i)
		{
			if(this.states[i].name == stateName)
			{
				return i;
			}
		}
		console.log("state \"" + stateName + "\" not found");
		return -1;
	}
	
	setCurrentState(stateName)
	{
		var i = this.stateIndex(stateName);
		if(i > -1)
		{
			this.currentState = stateName;
			for(let j = 0; j < this.states[i].transitions.length; ++j)
			{
				this.states[i].transitions[j].updateEndTime;
			}
		}
	}
	
	updateState()
	{
		var currStateIndex = this.stateIndex(this.currentState);
		for(let i = 0; i < this.states[currStateIndex].transitions.length; ++i)
		{
			if(this.states[currStateIndex].transitions[i].checkTransition())
			{
				this.currentState = this.states[currStateIndex].transitions[i].nextState;
				//console.log("now updating endTimes for " + this.currentState);
				this.updateStateTransitionEndTimes(this.currentState);
				return;
			}
		}
	}
	
	updateStateTransitionEndTimes(stateName)
	{
		var i = this.stateIndex(stateName);
		if(i > -1)
		{
			for(let j = 0; j < this.states[i].transitions.length; ++j)
			{
				this.states[i].transitions[j].updateEndTime();
			}
		}
	}
}


// ~ ~ ~ MAIN ~ ~ ~ //

var myFSM = new ActionFSM();

myFSM.addState(new ActionState("neutral"));
myFSM.addState(new ActionState("attack small"));
myFSM.addState(new ActionState("attack medium"));
myFSM.addState(new ActionState("attack large"));

myFSM.addState(new ActionState("neutral-c"));
myFSM.addState(new ActionState("attack small-c"));
myFSM.addState(new ActionState("attack medium-c"));
myFSM.addState(new ActionState("attack large-c"));

myFSM.addTransition("neutral", new ActTransButton("attack small", button1));

myFSM.addTransition("attack small", new ActTransTimer("attack small-c", 500));
myFSM.addTransition("attack small-c", new ActTransTimer("neutral", 250));
myFSM.addTransition("attack small-c", new ActTransButton("attack medium", button2));

myFSM.addTransition("attack medium", new ActTransTimer("attack medium-c", 500));
myFSM.addTransition("attack medium-c", new ActTransTimer("neutral", 250));
myFSM.addTransition("attack medium-c", new ActTransButton("attack large", button3));

//myFSM.addTransition("attack large", new ActTransTimer("attack large-c", 500));
//myFSM.addTransition("attack large-c", new ActTransTimer("neutral", 250));
myFSM.addTransition("attack large", new ActTransTimer("neutral", 750));

myFSM.setCurrentState("neutral");

/*setInterval(function()
{
	myFSM.updateState();
	
	console.log("state => " + myFSM.currentState);
	
	b1 = false;
	b2 = false;
	b3 = false;
}, 20);*/

function keyPressed()
{
	if (key.toLowerCase() == button1.toLowerCase()) { b1 = true; }
	if (key.toLowerCase() == button2.toLowerCase()) { b2 = true; }
	if (key.toLowerCase() == button3.toLowerCase()) { b3 = true; }
}

function setup()
{
	frameRate(60);
	createCanvas(windowWidth, windowHeight);
}

function draw() 
{
	// fsm stuff
	
	myFSM.updateState();
	
	//console.log("state => " + myFSM.currentState);
	
	b1 = false;
	b2 = false;
	b3 = false;
	
	// actually draw
	
	background(255);
	
	textSize(20);
	textAlign(LEFT, TOP);
	fill(127);
	text("attack1 button: " + button1 + "\nattack2 button: " + button2 + "\nattack3 button: " + button3, 0, 0);
	
	textAlign(LEFT, CENTER);
	textSize(64);
	fill(0);
	//text("state: " + myFSM.currentState, canvas.width/2-240, canvas.height/2);
    text("state: " + myFSM.currentState, 0, 140);
}