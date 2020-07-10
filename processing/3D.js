var voxelSize = 10;

var sampleVoxelObject =
{
    "voxels":[],
    "palette":[853769,2230549,3999000,11343896,14241548,16750606,16775513,14087784,9435703,1482278,1858858,866338,859423,6431,574623,5889968,11200714,4572633,2463183,154009,1653393,1053752,593177,1381688,3024461,5647987,10500766,13133199,15577017,16238809,16249806,15852719,15191187,13737585,10382671,7549486,5056048,2365216,1839638,1052946,2105891,5792098,11120816,13817559,15856369]
};

function setup()
{
    createCanvas(800, 600, WEBGL);
    
    for(let i = 0; i < 18; ++i)
    {
        for(let j = 0; j < 18; ++j)
        {
            for(let k = 0; k < 18; ++k)
            {
                sampleVoxelObject.voxels.push([i,j,k,(i+j+k)%sampleVoxelObject.palette.length]);
            }
        }
    }
}

function draw()
{
    background(100);
    rotateX(-pmouseY/100);
    rotateY(-pmouseX/100);
    
    // for(let i = 0; i < abs(sin(millis()/400))*10; ++i)
    // {
        // box();
        // translate(50,0,0);
        // rotateX(-pmouseX/100);
    // }
    
    strokeWeight(1);
    stroke(color(255,0,0));
    line(0,0,0, 1000,0,0);
    stroke(color(0,255,0));
    line(0,0,0, 0,1000,0);
    stroke(color(0,0,255));
    line(0,0,0, 0,0,1000);
    
    directionalLight(color(255), -1, -1, -1);
    drawVoxelObject(sampleVoxelObject);
}

function drawVoxelObject(voxObj)
{
    voxObj.voxels.forEach(vox =>
    {
        push();
        translate(vox[2]*voxelSize, vox[1]*voxelSize, vox[0]*voxelSize);
        fill(color("#" + voxObj.palette[vox[3]].toString(16)));
        noStroke();
        box(voxelSize);
        pop();
    });
}

function getRandomInt(max)
{
  return Math.floor(Math.random() * Math.floor(max));
}