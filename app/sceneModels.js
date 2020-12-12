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


//----------------------------------------------------------------------------
//
//  Instantiating scene models
//

var sceneModels = [];

var roadModels = [];

// galinha for now
sceneModels.push( new simpleCubeModel() );

sceneModels[0].tx = 0.0; sceneModels[0].ty = 0.0; sceneModels[0].tz = -1;
sceneModels[0].sx = sceneModels[0].sy = sceneModels[0].sz = 0.1;
sceneModels[0].kDiff = [1,1,1];


//obstaculo
sceneModels.push( new simpleCubeModel() );

sceneModels[1].tx = -0.5; sceneModels[1].ty = 0.0; sceneModels[1].tz = -0.75;

sceneModels[1].sx = sceneModels[1].sy = sceneModels[1].sz = 0.1;
sceneModels[1].kDiff = [0,0,1];

// ob 2
sceneModels.push( new simpleCubeModel() ); 

sceneModels[2].tx = 0.5; sceneModels[2].ty = 0.0; sceneModels[2].tz = -11;

sceneModels[2].sx = sceneModels[2].sy = sceneModels[2].sz = 0.1;
sceneModels[2].kDiff = [0,0,1];

// chao
sceneModels.push( new simpleCubeModel() );

sceneModels[3].tx = 0.0; sceneModels[3].ty = -0.3; sceneModels[3].tz = -13;

sceneModels[3].sx = 3;
sceneModels[3].sy = 0.001;
sceneModels[3].sz = 13;
sceneModels[3].kDiff = [0.18,0.18,0.18];


// "relva"
sceneModels.push( new simpleCubeModel() );

sceneModels[4].tx = 0.0; sceneModels[4].ty = -0.3; sceneModels[4].tz = -5;

sceneModels[4].sx = 3;
sceneModels[4].sy = 0.002;
sceneModels[4].sz = 0.5;

// cor
sceneModels[4].kDiff = [0,1,0];

// "relva"
sceneModels.push( new simpleCubeModel() );

sceneModels[5].tx = 0.0; sceneModels[5].ty = -0.3; sceneModels[5].tz = -7;

sceneModels[5].sx = 3;
sceneModels[5].sy = 0.002;
sceneModels[5].sz = 0.5;
//cor
sceneModels[5].kDiff = [0,1,0];


for(i = 1; i < sceneModels.length; i++){
	roadModels.push(sceneModels[i]);
}
console.log(roadModels)
console.log("111");


// var lista = [];

// //obstaculo
// lista.push( new simpleCubeModel() );

// lista[0].tx = 1; lista[0].ty = 0.0; lista[0].tz = -0.75 - 11.75;

// lista[0].sx = lista[0].sy = lista[0].sz = 0.1;
// lista[0].kDiff = [0,0,1];

// // ob 2
// lista.push( new simpleCubeModel() ); 

// lista[1].tx = 0.5; lista[1].ty = 0.0; lista[1].tz = -7 - 11.75;

// lista[1].sx = lista[1].sy = lista[1].sz = 0.1;
// lista[1].kDiff = [0,0,1];

// // chao
// lista.push( new simpleCubeModel() );

// lista[2].tx = 0.0; lista[2].ty = -0.3; lista[2].tz = -13 - 11.75;

// lista[2].sx = 3;
// lista[2].sy = 0.001;
// lista[2].sz = 13;
// lista[2].kDiff = [0.18,0.18,0.18];


// // "relva"
// lista.push( new simpleCubeModel() );

// lista[3].tx = 0.0; lista[3].ty = -0.3; lista[3].tz = -5 - 11.75;

// lista[3].sx = 3;
// lista[3].sy = 0.002;
// lista[3].sz = 0.5;

// // cor
// lista[3].kDiff = [0,1,0];

// // "relva"
// lista.push( new simpleCubeModel() );

// lista[4].tx = 0.0; lista[4].ty = -0.3; lista[4].tz = -7 - 11.75;

// lista[4].sx = 3;
// lista[4].sy = 0.002;
// lista[4].sz = 0.5;
// //cor
// lista[4].kDiff = [0,1,0];

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function extendMap(){
	//obstaculo
	var a = sceneModels.length
	sceneModels.push( new simpleCubeModel() );

	sceneModels[a].tx = getRandomArbitrary(-1,1); sceneModels[a].ty = 0.0; sceneModels[a].tz = -0.75 - 11.75;
	console.log(sceneModels[a].tx)

	sceneModels[a].sx = sceneModels[a].sy = sceneModels[a].sz = 0.1;
	sceneModels[a].kDiff = [1,0,1];

	// ob 2
	sceneModels.push( new simpleCubeModel() ); 

	sceneModels[a+1].tx = getRandomArbitrary(-1.1, 1.1); sceneModels[a+1].ty = 0.0; sceneModels[a+1].tz = -7 - 11.75;

	sceneModels[a+1].sx = sceneModels[a+1].sy = sceneModels[a+1].sz = 0.1;
	sceneModels[a+1].kDiff = [0,0,1];

	// chao
	sceneModels.push( new simpleCubeModel() );

	sceneModels[a+2].tx = 0.0; sceneModels[a+2].ty = -0.3; sceneModels[a+2].tz = -13 - 11.75;

	sceneModels[a+2].sx = 3;
	sceneModels[a+2].sy = 0.001;
	sceneModels[a+2].sz = 13;
	sceneModels[a+2].kDiff = [0.18,0.18,0.18];


	// "relva"
	sceneModels.push( new simpleCubeModel() );

	sceneModels[a+3].tx = 0.0; sceneModels[a+3].ty = -0.3; sceneModels[a+3].tz = -5 - 11.75;

	sceneModels[a+3].sx = 3;
	sceneModels[a+3].sy = 0.002;
	sceneModels[a+3].sz = 0.5;

	// cor
	sceneModels[a+3].kDiff = [0,1,0];

	// "relva"
	sceneModels.push( new simpleCubeModel() );

	sceneModels[a+4].tx = 0.0; sceneModels[a+4].ty = -0.3; sceneModels[a+4].tz = -7 - 11.75;

	sceneModels[a+4].sx = 3;
	sceneModels[a+4].sy = 0.002;
	sceneModels[a+4].sz = 0.5;
	//cor
	sceneModels[a+4].kDiff = [0,1,0];
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

