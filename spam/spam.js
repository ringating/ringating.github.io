// settings
var imagesPerFrame = 2;
var maxFrameRate = 60;
var bgRed   = 255;
var bgGreen = 255;
var bgBlue  = 255;
var canvasWidth = 1920;
var canvasHeight = 1080;
var imageLength = 200;
var imageLengthVar = 80;

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
var indexArray = [];

console.log(imageNames);

function resetIndexArray()
{
	indexArray = [];
	for(let i = 0; i < images.length; ++i)
	{
		indexArray.push(i);
	}
}

function fetchImage()
{
	if(indexArray.length < 1){ resetIndexArray(); }
	var subIndex = randInt(indexArray.length-1);
	var index = indexArray[subIndex];
	indexArray.splice(subIndex, 1);
	return images[index];
}

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
	background(bgRed, bgGreen, bgBlue);
}

function draw() 
{
	if( keyIsDown(32) ){ return; }
	
	for(let i = 0; i < imagesPerFrame; ++i)
	{
		imageR(
			fetchImage(), 
			randIntRange(-imageLength, canvas.width + imageLength), 
			randIntRange(-imageLength, canvas.height + imageLength)
		);
	}
	
}

function randInt(max)
{
	return Math.floor(Math.random() * Math.floor(max));
}

function randIntRange(min, max)
{
	return Math.floor(min + randInt(max-min));
}

function imageR(img, x, y)
{
	var len = imageLength + randIntRange(-imageLengthVar, imageLengthVar);
	if(img.width/img.height > 1)
	{
		image(img, x, y, len, (len/img.width)*img.height);
	}
	else
	{
		image(img, x, y, (len/img.height)*img.width, len);
	}
}