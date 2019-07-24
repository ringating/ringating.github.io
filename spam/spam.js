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

var imageFolderPath = "spam/images";
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
	images = new Array(imageNames.length);
	console.log(images);
	for(let i = 0; i < images.length; ++i)
	{
		images[i] = loadImage(imageFolderPath + "/" + imageNames[i]);
		console.log(images[i]);
	}
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
	
	imageR(images[0], 200, 200);
}

function imageR(img, x, y)
{
	if(img.width/img.height > imageWidth/imageHeight)
	{
		image(img, x, y, imageWidth, (imageWidth/img.width)*img.height);
	}
	else
	{
		image(img, x, y, (imageHeight/img.height)*img.width, imageHeight);
	}
}