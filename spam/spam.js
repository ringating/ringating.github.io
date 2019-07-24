// settings
var bgRed   = 255;
var bgGreen = 255;
var bgBlue  = 255;
var maxFrameRate = 60;
var canvasWidth = 1920;
var canvasHeight = 1080;
var imageWidth = 200;
var imageHeight = 200;

// everything else

var imageFolderName = "images";
var imageNames = 
[
"4head.png",
"AYAYA.png",
"BabyRage.png",
"BibleThump.png",
"CiGrip.png",
"cmonBruh.png",
"DCOLON.png",
"elegiggle-png-7.png",
"FeelsAmazingMan.png",
"FeelsBadMan.png",
"feelsgoodman.png",
"FeelsWeirdMan.png",
"FrankerZ.png",
"GachiGASM.png",
"HYPERS.png",
"Jebaited.png",
"KKona.png",
"LUL.png",
"monkaHmm.png",
"monkas.png",
"NaM.png",
"OMEGALUL.png",
"PepeHands.png",
"Pog.png",
"PogChamp.png",
"POGGERS.png",
"PogU.png",
"PogYou.png",
"Shroud.png",
"SMOrc.png",
"TriHard.png",
"WeirdChamp.png",
"WutFace.png",
]
var images;
var testImage;

console.log(imageNames);

function preload()
{
	/*images = new Array(imageNames.length);
	console.log(images);
	for(let i = 0; i < images.length; ++i)
	{
		images[i] = loadImage(imageFolderName + "/" + imageNames[i]);
		console.log(images[i]);
	}*/
	
	testImage = loadImage("spam/images/PogU.png");
}

function setup()
{
	frameRate(maxFrameRate);
	createCanvas(canvasWidth, canvasHeight);
	background(255);
}

function draw() 
{
	//if( !keyIsDown(SPACE) ){ return; }
	
	image(testImage, 200, 200);
}