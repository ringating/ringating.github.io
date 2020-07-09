var voxelSize = 20;

var sampleVoxelObject =
{
    "voxels":[[1,0,1,3],[1,0,0,3],[2,0,-1,21],[1,0,-1,32],[0,0,-1,32],[0,1,-1,21],[0,2,-1,21],[1,2,-1,21],[2,2,-1,21],[2,1,-1,21],[0,1,0,4],[0,1,1,4],[2,1,0,9],[2,1,1,9],[1,2,0,30],[1,2,1,30],[-4,0,2,29],[-5,0,2,29],[-5,0,1,29],[-5,0,0,29],[-4,0,0,29],[-4,0,-1,29],[-3,0,-1,29],[-3,0,-2,29],[-4,0,-2,29],[-5,0,-2,29],[-6,0,-2,29],[-6,0,-3,29],[-5,0,-3,29],[-3,-1,-1,8],[-2,-1,-1,8],[-2,-2,-1,8],[-2,-2,0,8],[-1,-2,0,8],[0,-2,0,8],[-2,-2,-2,8],[-2,-2,-3,8],[-1,-2,-3,8],[0,-2,-3,8],[1,-2,-3,8],[1,-1,-1,8],[1,-2,-1,8],[1,-2,0,8],[1,-2,-2,8],[3,1,1,8],[3,0,-1,8],[3,1,-1,8],[3,1,0,8],[4,1,1,8],[3,1,2,8],[3,2,1,8],[4,1,-1,8],[2,2,1,8],[4,2,1,8],[5,1,1,8],[3,2,2,8],[4,2,2,8],[5,2,1,8],[4,2,3,8],[5,2,2,8],[5,3,1,8],[6,2,1,8],[5,2,3,8],[5,3,2,8],[5,3,3,8],[4,3,3,8],[5,3,4,8],[5,4,3,8],[6,3,4,8],[6,3,3,8],[5,4,2,8],[6,3,5,8],[6,4,4,8],[6,3,2,8],[7,3,4,8],[7,3,3,8],[6,4,2,8],[7,4,4,8],[7,5,4,8],[8,4,4,8],[7,4,5,8],[6,4,5,8],[5,3,5,8],[3,3,3,8],[4,3,4,8],[4,3,5,8],[3,3,4,8],[4,4,5,8],[13,0,9,8],[2,3,3,8],[3,4,4,8],[3,4,5,8],[2,4,4,8],[2,4,3,8],[1,4,4,8],[2,4,5,8],[0,4,4,8],[1,5,4,8],[0,5,4,8],[1,4,5,8],[2,5,5,8],[12,0,9,8],[1,4,3,8],[0,5,3,8],[-1,5,4,8],[1,5,5,8],[0,4,3,8],[-1,5,3,8],[-2,5,4,8],[-1,6,4,8],[-2,5,3,8],[-2,6,4,8],[-3,5,3,8],[-3,6,4,8],[-3,6,3,8],[-4,6,4,8],[13,0,10,8],[-4,6,3,8],[-4,7,4,8],[-5,6,3,8],[-5,6,4,8],[-5,7,4,8],[-1,6,5,8],[0,5,5,8],[1,5,6,8],[-1,6,6,8],[0,5,6,8],[0,6,6,8],[1,5,7,8],[-1,6,7,8],[0,5,7,8],[0,5,8,8],[1,5,8,8],[-1,6,8,8],[0,6,8,8],[0,5,9,8],[-1,7,8,8],[-1,6,9,8],[0,6,9,8],[-1,7,9,8],[0,7,9,8],[0,6,10,8],[-1,7,10,8],[0,6,11,8],[-1,7,11,8],[-1,8,10,8],[-1,7,12,8],[-1,8,11,8],[-1,8,12,8],[-1,9,12,8],[-1,8,13,8],[1,5,3,8],[2,5,4,8],[1,6,3,8],[2,5,3,8],[2,6,4,8],[1,7,3,8],[2,6,3,8],[2,7,4,8],[2,7,3,8],[3,6,4,8],[1,8,3,8],[1,7,2,8],[2,6,2,8],[2,7,2,8],[2,8,3,8],[3,7,3,8],[2,8,2,8],[1,8,2,8],[3,8,3,8],[2,9,3,8],[2,9,2,8],[3,7,2,8],[3,8,2,8],[1,9,2,8],[2,10,2,8],[2,9,1,8],[3,9,2,8],[1,10,2,8],[2,11,2,8],[2,10,1,8],[1,11,2,8],[1,11,1,8],[2,11,1,8],[2,12,2,8],[3,11,2,8],[2,12,1,8],[3,12,2,8],[3,11,1,8],[1,12,2,8],[2,11,0,8],[2,13,1,8],[3,12,1,8],[1,12,1,8],[2,14,1,8],[2,13,0,8],[3,13,1,8],[2,14,0,8],[3,14,1,8],[2,15,1,8],[5,3,0,19],[4,3,1,19],[3,3,1,19],[2,2,0,19],[3,2,0,19],[4,2,0,19],[5,2,0,19],[5,3,-1,19],[5,4,0,19],[4,3,0,19],[5,4,-1,19],[5,3,-2,19],[6,3,1,19],[6,4,-1,19],[5,4,-2,19],[5,3,-3,19],[6,3,-2,19],[6,4,-2,19],[6,3,-3,19],[5,4,-3,19],[6,4,-3,19],[6,5,-2,19],[6,4,-4,19],[6,5,-3,19],[6,5,-4,19],[6,4,-5,19],[7,4,-4,19],[5,5,-3,19],[5,4,-4,19],[6,5,-5,19],[7,4,-5,19],[6,4,-6,19],[6,5,-6,19],[7,4,-6,19],[6,5,-7,19],[6,4,-7,19],[7,4,-7,19],[7,5,-6,19],[6,6,-5,19],[6,6,-6,19],[7,5,-7,19],[6,5,-8,19],[6,6,-7,19],[7,5,-8,19],[7,6,-7,19],[6,6,-8,19],[7,6,-8,19],[7,5,-9,19],[7,6,-9,19],[7,6,-10,19],[2,1,2,32],[1,1,1,32],[1,2,2,32],[2,2,2,32],[3,2,3,32],[3,1,3,32],[2,2,3,32],[3,2,4,32],[3,1,4,32],[2,1,3,32],[2,1,4,32],[2,2,4,32],[3,2,5,32],[1,1,3,32],[2,1,5,32],[2,0,5,32],[0,-3,0,32],[0,-2,1,32],[1,-3,-1,32],[1,-3,0,32],[1,-4,-1,32],[1,-4,0,32],[1,-3,-2,32],[0,-3,-3,32],[0,-4,0,32],[1,0,-2,32],[0,0,-2,32],[0,-2,-2,32],[0,-3,-2,32],[0,-4,-3,32],[0,0,-4,32],[-1,0,-4,32],[-1,-3,-3,32],[0,-4,-2,32],[1,-4,-2,32],[0,-5,-3,32],[0,-5,-2,32],[1,-5,-2,32],[0,-6,-2,32],[-1,0,-5,32],[0,0,-5,32],[0,-5,-1,32],[0,-6,-1,32],[0,-7,-2,32],[1,-5,-1,32],[0,-7,-1,32],[1,-6,-1,32],[0,-8,-1,32],[1,-7,-1,32],[0,-8,0,32],[0,-9,-1,32],[1,-7,0,32],[0,-9,0,32],[1,-8,0,32],[0,-9,1,32],[0,-10,0,32],[0,-10,1,32],[1,-9,0,32],[0,-11,1,32],[0,-10,2,32],[0,-11,2,32],[0,-12,2,32],[1,-9,1,32],[1,-10,0,32],[1,-10,1,32],[1,-11,1,32],[0,-13,2,32],[0,-13,3,32],[0,-14,2,32],[0,-14,3,32],[1,-12,1,32],[0,-15,3,32],[-6,0,0,5],[-6,1,0,5],[-6,0,1,5],[-6,0,2,5],[-7,0,1,5],[-7,0,2,5],[-7,1,2,5],[-8,0,1,5],[-8,1,2,5],[-8,2,2,5],[-9,1,2,5],[-9,2,2,5],[-9,1,3,5],[-10,1,2,5],[-10,2,2,5],[-10,2,3,5],[-11,2,2,5],[-11,2,3,5],[-11,3,3,5],[-12,3,3,5],[-7,-1,2,5],[-6,-1,1,5],[-6,-1,0,5],[-7,-1,1,5],[-8,-1,1,5],[-7,-1,0,5],[-8,-2,1,5],[-9,-2,1,5],[-8,-2,0,5],[0,1,3,5],[-9,-3,1,5],[-9,-2,0,5],[-8,-3,0,5],[-10,-3,1,5],[-9,-3,0,5],[-10,-3,0,5],[-11,-3,0,5],[-10,-4,0,5],[-11,-4,0,5],[-11,-4,-1,5],[-12,-4,-1,5],[-12,-5,-1,5],[-13,-5,-1,5],[-14,-5,-1,5],[-13,-5,-2,5],[-13,-6,-2,5],[-14,-5,-2,5],[-14,-6,-2,5],[-15,-6,-2,5],[-16,-6,-2,5],[-15,-7,-2,5],[-16,-7,-2,5]],
    "palette":[853769,2230549,3999000,11343896,14241548,16750606,16775513,14087784,9435703,1482278,1858858,866338,859423,6431,12600,25687,36205,574623,5889968,11200714,4572633,2463183,154009,1653393,1053752,593177,1381688,3024461,5647987,10500766,13133199,15577017,16238809,16249806,15852719,15191187,13737585,10382671,7549486,5056048,2365216,1839638,1052946,2105891,5792098,11120816,13817559,15856369]
};

function setup()
{
    createCanvas(800, 600, WEBGL);
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

// function colorDecimalToHex(decimalColor)
// {
    // return decimalColor.toString(16);
// }