//----------------------------------------------------------------------------
//
//  Constructors
//


function emptyModelFeatures() {

	// EMPTY MODEL

	this.vertices = [];

	this.normals = [];

	// Transformation parameters

	// Displacement vector
	
	this.tx = 0.0;
	
	this.ty = 0.0;
	
	this.tz = 0.0;	
	
	// Rotation angles	
	
	this.rotAngleXX = 0;
	
	this.rotAngleYY = 0;
	
	this.rotAngleZZ = 0.0;	

	// Scaling factors
	
	this.sx = 1.0;
	
	this.sy = 1.0;
	
	this.sz = 1.0;		
	
	// Animation controls
	
	this.rotXXOn = true;
	
	this.rotYYOn = true;
	
	this.rotZZOn = true;
	
	this.rotXXSpeed = 1.0;
	
	this.rotYYSpeed = 1.0;
	
	this.rotZZSpeed = 1.0;
	
	this.rotXXDir = 1;
	
	this.rotYYDir = 1;
	
	this.rotZZDir = 1;
	
	// Material features
	
	this.kAmbi = [ 0.2, 0.2, 0.2 ];
	
	this.kDiff = [ 0.7, 0.7, 0.7 ];

	this.kSpec = [ 0.7, 0.7, 0.7 ];

	this.nPhong = 100;

	//TIPO DE OBJETO

	this.type= null;
}

function singleTriangleModel( ) {
	
	var triangle = new emptyModelFeatures();
	
	// Default model has just ONE TRIANGLE

	triangle.vertices = [

		// FRONTAL TRIANGLE
		 
		-0.5, -0.5,  0.5,
		 
		 0.5, -0.5,  0.5,
		 
		 0.5,  0.5,  0.5,
	];

	triangle.normals = [

		// FRONTAL TRIANGLE
		 
		 0.0,  0.0,  1.0,
		 
		 0.0,  0.0,  1.0,
		 
		 0.0,  0.0,  1.0,
	];

	return triangle;
}


function simpleCubeModel( ) {
	
	var cube = new emptyModelFeatures();
	
	cube.vertices = [

		-1.000000, -1.000000,  1.000000, 
		 1.000000,  1.000000,  1.000000, 
		-1.000000,  1.000000,  1.000000, 
		-1.000000, -1.000000,  1.000000,
		 1.000000, -1.000000,  1.000000, 
		 1.000000,  1.000000,  1.000000, 
         1.000000, -1.000000,  1.000000, 
		 1.000000, -1.000000, -1.000000, 
		 1.000000,  1.000000, -1.000000, 
         1.000000, -1.000000,  1.000000, 
         1.000000,  1.000000, -1.000000, 
         1.000000,  1.000000,  1.000000, 
        -1.000000, -1.000000, -1.000000, 
        -1.000000,  1.000000, -1.000000,
         1.000000,  1.000000, -1.000000, 
        -1.000000, -1.000000, -1.000000, 
         1.000000,  1.000000, -1.000000, 
         1.000000, -1.000000, -1.000000, 
        -1.000000, -1.000000, -1.000000, 
		-1.000000, -1.000000,  1.000000, 
		-1.000000,  1.000000, -1.000000, 
		-1.000000, -1.000000,  1.000000, 
		-1.000000,  1.000000,  1.000000, 
		-1.000000,  1.000000, -1.000000, 
		-1.000000,  1.000000, -1.000000, 
		-1.000000,  1.000000,  1.000000, 
		 1.000000,  1.000000, -1.000000, 
		-1.000000,  1.000000,  1.000000, 
		 1.000000,  1.000000,  1.000000, 
		 1.000000,  1.000000, -1.000000, 
		-1.000000, -1.000000,  1.000000, 
		-1.000000, -1.000000, -1.000000,
		 1.000000, -1.000000, -1.000000, 
		-1.000000, -1.000000,  1.000000, 
		 1.000000, -1.000000, -1.000000, 
		 1.000000, -1.000000,  1.000000, 	 
	];

	computeVertexNormals( cube.vertices, cube.normals );

	return cube;
}


function cubeModel( subdivisionDepth = 0 ) {
	
	var cube = new simpleCubeModel();
	
	midPointRefinement( cube.vertices, subdivisionDepth );
	
	computeVertexNormals( cube.vertices, cube.normals );
	
	return cube;
}


function simpleTetrahedronModel( ) {
	
	var tetra = new emptyModelFeatures();
	
	tetra.vertices = [

		-1.000000,  0.000000, -0.707000, 
         0.000000,  1.000000,  0.707000, 
         1.000000,  0.000000, -0.707000, 
         1.000000,  0.000000, -0.707000, 
         0.000000,  1.000000,  0.707000, 
         0.000000, -1.000000,  0.707000, 
        -1.000000,  0.000000, -0.707000, 
         0.000000, -1.000000,  0.707000, 
         0.000000,  1.000000,  0.707000, 
        -1.000000,  0.000000, -0.707000, 
         1.000000,  0.000000, -0.707000, 
         0.000000, -1.000000,  0.707000,
	];

	computeVertexNormals( tetra.vertices, tetra.normals );

	return tetra;
}


function tetrahedronModel( subdivisionDepth = 0 ) {
	
	var tetra = new simpleTetrahedronModel();
	
	midPointRefinement( tetra.vertices, subdivisionDepth );
	
	computeVertexNormals( tetra.vertices, tetra.normals );
	
	return tetra;
}


function sphereModel( subdivisionDepth = 2 ) {
	
	var sphere = new simpleCubeModel();
	
	midPointRefinement( sphere.vertices, subdivisionDepth );
	
	moveToSphericalSurface( sphere.vertices )
	
	computeVertexNormals( sphere.vertices, sphere.normals );
	
	return sphere;
}


//TIPOS

var types= ["Enemy1", "Enemy2", "Enemy3", "Chicken", "Grass", "Road", "Block"];
//----------------------------------------------------------------------------
//
//  Instantiating scene models
//

// ZZ dos inimigos para estarem sempre na estrada:
// (-0.9,-1.4, -1.8), (-3.4, -4.3), (-5.9, -6.8), (-8.4, -9.3), (-10.9, -11.8)

var relvatx = 0.0;
var relvaty = -0.3;
// tz -> variavel

var relvasx = 3;
var relvasy = 0.002;
var relvasz = 0.5;


var sceneModels = [];

// galinha for now
sceneModels.push( new simpleCubeModel() );

sceneModels[0].tx = 0.0; sceneModels[0].ty = 0.0; sceneModels[0].tz = -0.5;
sceneModels[0].sx = sceneModels[0].sy = sceneModels[0].sz = 0.2;
sceneModels[0].kDiff = [1,1,1];
sceneModels[0].type = "Chicken"


//obstaculo
sceneModels.push( new simpleCubeModel() );

sceneModels[1].tx = 1.5; sceneModels[1].ty = 0.0; sceneModels[1].tz = -3.4;

sceneModels[1].sx = sceneModels[1].sy = sceneModels[1].sz = 0.2;
sceneModels[1].kDiff = [0,0,1];
sceneModels[1].type = "Enemy1"

// ob 2
sceneModels.push( new simpleCubeModel() ); 

sceneModels[2].tx = 0.5; sceneModels[2].ty = 0.0; sceneModels[2].tz = -4.3;

sceneModels[2].sx = sceneModels[2].sy = sceneModels[2].sz = 0.2;
sceneModels[2].kDiff = [0,0,1];
sceneModels[2].type = "Enemy2"

// chao
sceneModels.push( new simpleCubeModel() );

sceneModels[3].tx = 0.0; sceneModels[3].ty = -0.3; sceneModels[3].tz = -13;

sceneModels[3].sx = 3;
sceneModels[3].sy = 0.001;
sceneModels[3].sz = 13;
sceneModels[3].kDiff = [0.18,0.18,0.18];
sceneModels[3].type = "Road"


// "relva"1
sceneModels.push( new simpleCubeModel() );

sceneModels[4].tx = relvatx; sceneModels[4].ty = relvaty; sceneModels[4].tz = -0.5;

sceneModels[4].sx = relvasx;
sceneModels[4].sy = relvasy;
sceneModels[4].sz = relvasz;
sceneModels[4].type = "Grass"


// cor
sceneModels[4].kDiff = [0,1,0];

// "relva"2
sceneModels.push( new simpleCubeModel() );

sceneModels[5].tx = relvatx; sceneModels[5].ty = relvaty; sceneModels[5].tz = -3;

sceneModels[5].sx = relvasx;
sceneModels[5].sy = relvasy;
sceneModels[5].sz = relvasz;
//cor
sceneModels[5].kDiff = [0,1,0];
sceneModels[5].type = "Grass"


// relva3
sceneModels.push( new simpleCubeModel() );

sceneModels[6].tx = relvatx; sceneModels[6].ty = relvaty; sceneModels[6].tz = -5.5;

sceneModels[6].sx = relvasx;
sceneModels[6].sy = relvasy;
sceneModels[6].sz = relvasz;
sceneModels[6].kDiff = [0,1,0];
sceneModels[6].type = "Grass"


// relva4
sceneModels.push( new simpleCubeModel() );

sceneModels[7].tx = relvatx; sceneModels[7].ty = relvaty; sceneModels[7].tz = -8;

sceneModels[7].sx = relvasx;
sceneModels[7].sy = relvasy;
sceneModels[7].sz = relvasz;
sceneModels[7].kDiff = [0,1,0];
sceneModels[7].type = "Grass"

// relva5
sceneModels.push( new simpleCubeModel() );

sceneModels[8].tx = relvatx; sceneModels[8].ty = relvaty; sceneModels[8].tz = -10.5;

sceneModels[8].sx = relvasx;
sceneModels[8].sy = relvasy;
sceneModels[8].sz = relvasz;
sceneModels[8].kDiff = [0,1,0];
sceneModels[8].type = "Grass"


// arbusto 1
sceneModels.push( new simpleCubeModel() );

sceneModels[9].tx = 1; sceneModels[9].ty = 0.0; sceneModels[9].tz = -2.5;

sceneModels[9].sx = 0.3;
sceneModels[9].sy = 0.2;
sceneModels[9].sz = 0.2;
sceneModels[9].kDiff = [0,1,1];
sceneModels[9].type = "Block"


// arbusto 2
sceneModels.push( new simpleCubeModel() );

sceneModels[10].tx = 1; sceneModels[9].ty = 0.0; sceneModels[9].tz = -7.5;

sceneModels[10].sx = 0.3;
sceneModels[10].sy = 0.2;
sceneModels[10].sz = 0.2;
sceneModels[10].kDiff = [0,1,1];
sceneModels[10].type = "Block"

// addEnemy1(-1);
// addEnemy2(-1.4);
addEnemy2(-1.9);

addEnemy2(-3.4);
addEnemy1(-4.3);

addEnemy1(-5.9);
addEnemy2(-6.8);

addEnemy2(-8.4);
addEnemy1(-9.3);

addEnemy2(-10.9);
addEnemy1(-11.8);


//--------------


function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

var space = -11.75;

function addEnemy1(z_value){		// anda para a esquerda
	//obstaculo
	var a = sceneModels.length
	sceneModels.push( new simpleCubeModel() );

	//sceneModels[a].tx = getRandomArbitrary(-0.8,0.8); sceneModels[a].ty = 0.0; sceneModels[a].tz = getRandomArbitrary(-0.75 + space-1, -0.75+space-0);
	sceneModels[a].tx = getRandomArbitrary(0,3); sceneModels[a].ty = 0.0; sceneModels[a].tz = z_value;
	console.log(sceneModels[a].tx)

	sceneModels[a].sx = sceneModels[a].sy = sceneModels[a].sz = 0.2;
	sceneModels[a].kDiff = [1,0,1];
	sceneModels[a].type = "Enemy1"
}

function addEnemy2(z_value){	// anda para a direita
	// ob 2
	var a = sceneModels.length
	sceneModels.push( new simpleCubeModel() ); 

	//sceneModels[a].tx = getRandomArbitrary(-0.8, 0.8); sceneModels[a].ty = 0.0; sceneModels[a].tz = getRandomArbitrary(-2 + space-1, -2+space);
	sceneModels[a].tx = getRandomArbitrary(-3, 0); sceneModels[a].ty = 0.0; sceneModels[a].tz = z_value;

	sceneModels[a].sx = sceneModels[a].sy = sceneModels[a].sz = 0.2;
	sceneModels[a].kDiff = [0,0,1];
	sceneModels[a].type = "Enemy2"
}

function extendMap(){

	// var numEn1 = Math.floor(getRandomArbitrary(0, 4));
	// for(var i = 0; i < numEn1; i++) addEnemy1()


	// var numEn2 = Math.floor(getRandomArbitrary(0, 3));
	// for(var i = 0; i < numEn2; i++) addEnemy2()

	addEnemy1(-1 + space);
	addEnemy2(-1.4 + space);
	addEnemy1(-1.9 + space);

	addEnemy2(-3.4 + space);
	addEnemy1(-4.3 + space);

	addEnemy1(-5.9 + space);
	addEnemy2(-6.8 + space);

	addEnemy2(-8.4 + space);
	addEnemy1(-9.3 + space);

	addEnemy2(-10.9 + space);
	addEnemy1(-11.8 + space);
	
	var a = sceneModels.length
	// chao
	sceneModels.push( new simpleCubeModel() );

	sceneModels[a].tx = 0.0; sceneModels[a].ty = -0.3; sceneModels[a].tz = -13 + space;

	sceneModels[a].sx = 3;
	sceneModels[a].sy = 0.001;
	sceneModels[a].sz = 13;
	sceneModels[a].kDiff = [0.18,0.18,0.18];
	sceneModels[a].type = "Road"



	// "relva"1
	sceneModels.push( new simpleCubeModel() );

	sceneModels[a+1].tx = relvatx; sceneModels[a+1].ty = relvaty; sceneModels[a+1].tz = -0.5 + space;

	sceneModels[a+1].sx = relvasx;
	sceneModels[a+1].sy = relvasy;
	sceneModels[a+1].sz = relvasz;
	sceneModels[a+1].type = "Grass"


	// cor
	sceneModels[a+1].kDiff = [0,1,0];

	// "relva"2
	sceneModels.push( new simpleCubeModel() );

	sceneModels[a+2].tx = relvatx; sceneModels[a+2].ty = relvaty; sceneModels[a+2].tz = -3 + space;

	sceneModels[a+2].sx = relvasx;
	sceneModels[a+2].sy = relvasy;
	sceneModels[a+2].sz = relvasz;
	//cor
	sceneModels[a+2].kDiff = [0,1,0];
	sceneModels[a+2].type = "Grass"

	// relva3
	sceneModels.push( new simpleCubeModel() );

	sceneModels[a+3].tx = relvatx; sceneModels[a+3].ty = relvaty; sceneModels[a+3].tz = -5.5 + space;

	sceneModels[a+3].sx = relvasx;
	sceneModels[a+3].sy = relvasy;
	sceneModels[a+3].sz = relvasz;
	sceneModels[a+3].kDiff = [0,1,0];
	sceneModels[a+3].type = "Grass"

	// relva4
	sceneModels.push( new simpleCubeModel() );

	sceneModels[a+4].tx = relvatx; sceneModels[a+4].ty = relvaty; sceneModels[a+4].tz = -8 + space;

	sceneModels[a+4].sx = relvasx;
	sceneModels[a+4].sy = relvasy;
	sceneModels[a+4].sz = relvasz;
	sceneModels[a+4].kDiff = [0,1,0];
	sceneModels[a+4].type = "Grass"

	// relva5
	sceneModels.push( new simpleCubeModel() );

	sceneModels[a+5].tx = relvatx; sceneModels[a+5].ty = relvaty; sceneModels[a+5].tz = -10.5 + space;

	sceneModels[a+5].sx = relvasx;
	sceneModels[a+5].sy = relvasy;
	sceneModels[a+5].sz = relvasz;
	sceneModels[a+5].kDiff = [0,1,0];
	sceneModels[a+5].type = "Grass"

	// arbusto
	sceneModels.push( new simpleCubeModel() );

	sceneModels[a+6].tx = getRandomArbitrary(-1,1); sceneModels[a+6].ty = 0.0; sceneModels[a+6].tz = -2.5 + space;

	sceneModels[a+6].sx = 0.3;
	sceneModels[a+6].sy = 0.2;
	sceneModels[a+6].sz = 0.4;
	sceneModels[a+6].kDiff = [0,1,1];
	sceneModels[a+6].type = "Block"

	// arbusto 2
	sceneModels.push( new simpleCubeModel() );

	sceneModels[a+7].tx = getRandomArbitrary(-1,1); sceneModels[a+7].ty = 0.0; sceneModels[a+7].tz = -7.5 + space;

	sceneModels[a+7].sx = 0.3;
	sceneModels[a+7].sy = 0.2;
	sceneModels[a+7].sz = 0.4;
	sceneModels[a+7].kDiff = [0,1,1];
	sceneModels[a+7].type = "Block"

	// arbusto 3 - na mesma linha que o 2
	sceneModels.push( new simpleCubeModel() );

	sceneModels[a+8].tx = getRandomArbitrary(-1,1); sceneModels[a+8].ty = 0.0; sceneModels[a+8].tz = -7.5 + space;

	sceneModels[a+8].sx = 0.3;
	sceneModels[a+8].sy = 0.2;
	sceneModels[a+8].sz = 0.4;
	sceneModels[a+8].kDiff = [0,1,1];
	sceneModels[a+8].type = "Block"
}


// Model 1 --- Top Right

// sceneModels.push( new simpleCubeModel() );

// sceneModels[1].tx = 0.5; sceneModels[1].ty = 0.5;

// sceneModels[1].sx = sceneModels[1].sy = sceneModels[1].sz = 0.25;

// // Model 2 --- Bottom Right

// sceneModels.push( new tetrahedronModel( 1 ) );

// sceneModels[2].tx = 0.5; sceneModels[2].ty = -0.5;

// sceneModels[2].sx = sceneModels[2].sy = sceneModels[2].sz = 0.25;

// // Model 3 --- Bottom Left

// sceneModels.push( new cubeModel( 1 ) );

// sceneModels[3].tx = -0.5; sceneModels[3].ty = -0.5;

// sceneModels[3].sx = 0.4; sceneModels[3].sy = sceneModels[3].sz = 0.25;

// // Model 4 --- Middle

// sceneModels.push( new simpleCubeModel() );

// sceneModels[4].sx = 0.1; sceneModels[4].sy = 0.75; sceneModels[4].sz = 0.1;

// // Model 5 --- Middle

// sceneModels.push( new sphereModel( 3 ) );

// sceneModels[5].sx = 0.25; sceneModels[5].sy = 0.25; sceneModels[5].sz = 0.25;

