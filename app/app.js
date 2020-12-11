//----------------------------------------------------------------------------
//
// Global Variables
//

var gl = null; // WebGL context

var shaderProgram = null;

var triangleVertexPositionBuffer = null;
	
var triangleVertexNormalBuffer = null;	

// The GLOBAL transformation parameters

var globalAngleYY = 0.0;

var globalTx = 0.0;
var globalTy = 0.0;
var globalTz = 0.0;

// GLOBAL Animation controls

var globalRotationYY_ON = 0;

var globalRotationYY_DIR = 1;

var globalRotationYY_SPEED = 1;

// To allow choosing the way of drawing the model triangles

var primitiveType = null;
 
// To allow choosing the projection type

var projectionType = 1;

// NEW --- The viewer position

// It has to be updated according to the projection type

var pos_Viewer = [ 0.0, 0.0, 0.0, 1.0 ];



//----------------------------------------------------------------------------
//
// NEW - To count the number of frames per second (fps)
//

var elapsedTime = 0;

var frameCount = 0;

var lastfpsTime = new Date().getTime();;


function countFrames() {
	
   var now = new Date().getTime();

   frameCount++;
   
   elapsedTime += (now - lastfpsTime);

   lastfpsTime = now;

   if(elapsedTime >= 1000) {
	   
       fps = frameCount;
       
       frameCount = 0;
       
       elapsedTime -= 1000;
	   
	   document.getElementById('fps').innerHTML = 'fps:' + fps;
   }
}


//----------------------------------------------------------------------------
//
// The WebGL code
//

//----------------------------------------------------------------------------
//
//  Rendering
//

// Handling the Vertex Coordinates and the Vertex Normal Vectors

function initBuffers( model ) {	
	
	// Vertex Coordinates
		
	triangleVertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.vertices), gl.STATIC_DRAW);
	triangleVertexPositionBuffer.itemSize = 3;
	triangleVertexPositionBuffer.numItems =  model.vertices.length / 3;			

	// Associating to the vertex shader
	
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 
			triangleVertexPositionBuffer.itemSize, 
			gl.FLOAT, false, 0, 0);
	
	// Vertex Normal Vectors
		
	triangleVertexNormalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexNormalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array( model.normals), gl.STATIC_DRAW);
	triangleVertexNormalBuffer.itemSize = 3;
	triangleVertexNormalBuffer.numItems = model.normals.length / 3;			

	// Associating to the vertex shader
	
	gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, 
			triangleVertexNormalBuffer.itemSize, 
			gl.FLOAT, false, 0, 0);	
}

//----------------------------------------------------------------------------

//  Drawing the model

function drawModel( model,
					mvMatrix,
					primitiveType ) {

	// The the global model transformation is an input
	
	// Concatenate with the particular model transformations
	
    // Pay attention to transformation order !!
    
	mvMatrix = mult( mvMatrix, translationMatrix( model.tx, model.ty, model.tz ) );
						 
	mvMatrix = mult( mvMatrix, rotationZZMatrix( model.rotAngleZZ ) );
	
	mvMatrix = mult( mvMatrix, rotationYYMatrix( model.rotAngleYY ) );
	
	mvMatrix = mult( mvMatrix, rotationXXMatrix( model.rotAngleXX ) );
	
	mvMatrix = mult( mvMatrix, scalingMatrix( model.sx, model.sy, model.sz ) );
						 
	// Passing the Model View Matrix to apply the current transformation
	
	var mvUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
	
	gl.uniformMatrix4fv(mvUniform, false, new Float32Array(flatten(mvMatrix)));
    
	// Associating the data to the vertex shader
	
	// This can be done in a better way !!

	// Vertex Coordinates and Vertex Normal Vectors
	
	initBuffers(model);
	
	// Material properties
	
	gl.uniform3fv( gl.getUniformLocation(shaderProgram, "k_ambient"), 
		flatten(model.kAmbi) );
    
    gl.uniform3fv( gl.getUniformLocation(shaderProgram, "k_diffuse"),
        flatten(model.kDiff) );
    
    gl.uniform3fv( gl.getUniformLocation(shaderProgram, "k_specular"),
        flatten(model.kSpec) );

	gl.uniform1f( gl.getUniformLocation(shaderProgram, "shininess"), 
		model.nPhong );

    // Light Sources
	
	var numLights = lightSources.length;
	
	gl.uniform1i( gl.getUniformLocation(shaderProgram, "numLights"), 
		numLights );

	//Light Sources
	
	for(var i = 0; i < lightSources.length; i++ )
	{
		gl.uniform1i( gl.getUniformLocation(shaderProgram, "allLights[" + String(i) + "].isOn"),
			lightSources[i].isOn );
    
		gl.uniform4fv( gl.getUniformLocation(shaderProgram, "allLights[" + String(i) + "].position"),
			flatten(lightSources[i].getPosition()) );
    
		gl.uniform3fv( gl.getUniformLocation(shaderProgram, "allLights[" + String(i) + "].intensities"),
			flatten(lightSources[i].getIntensity()) );
    }
        
	// Drawing 
	
	// primitiveType allows drawing as filled triangles / wireframe / vertices
	
	if( primitiveType == gl.LINE_LOOP ) {
		
		// To simulate wireframe drawing!
		
		// No faces are defined! There are no hidden lines!
		
		// Taking the vertices 3 by 3 and drawing a LINE_LOOP
		
		var i;
		
		for( i = 0; i < triangleVertexPositionBuffer.numItems / 3; i++ ) {
		
			gl.drawArrays( primitiveType, 3 * i, 3 ); 
		}
	}	
	else {
				
		gl.drawArrays(primitiveType, 0, triangleVertexPositionBuffer.numItems); 
		
	}	
}

//----------------------------------------------------------------------------

//  Drawing the 3D scene

function drawScene() {
	
	var pMatrix;
	
	var mvMatrix = mat4();
	
	// Clearing the frame-buffer and the depth-buffer
	
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	// Computing the Projection Matrix
	
	if( projectionType == 0 ) {
		
		// For now, the default orthogonal view volume
		
		pMatrix = ortho( -1.0, 1.0, -1.0, 1.0, -1.0, 1.0 );
		
		// Global transformation !!
		
		globalTy = 0.0;
		
		// NEW --- The viewer is on the ZZ axis at an indefinite distance
		
		pos_Viewer[0] = pos_Viewer[1] = pos_Viewer[3] = 0.0;
		
		pos_Viewer[2] = 1.0;  
		
		// TO BE DONE !
		
		// Allow the user to control the size of the view volume
	}
	else {	

		// A standard view volume.
		
		// Viewer is at (0,0,0)
		
		// Ensure that the model is "inside" the view volume
		
		pMatrix = perspective( 45, 1, 0.05, 15 );
		
		// Global transformation !!
		
		globalTy = -1;
		globalTx = -0.5;
		globalTz = -2.5;

		// NEW --- The viewer is on (0,0,0)
		
		pos_Viewer[0] = pos_Viewer[1] = pos_Viewer[2] = 0.0;
		
		pos_Viewer[3] = 1.0;  
		
		// TO BE DONE !
		
		// Allow the user to control the size of the view volume
	}
	
	// Passing the Projection Matrix to apply the current projection
	
	var pUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
	
	gl.uniformMatrix4fv(pUniform, false, new Float32Array(flatten(pMatrix)));
	
	// NEW --- Passing the viewer position to the vertex shader
	
	gl.uniform4fv( gl.getUniformLocation(shaderProgram, "viewerPosition"),
        flatten(pos_Viewer) );
	
	// GLOBAL TRANSFORMATION FOR THE WHOLE SCENE
	
	mvMatrix = translationMatrix( globalTx, globalTy, globalTz);

	
	// NEW - Updating the position of the light sources, if required
	
	// FOR EACH LIGHT SOURCE
	    
	for(var i = 0; i < lightSources.length; i++ )
	{
		// Animating the light source, if defined
		    
		var lightSourceMatrix = mat4();

		if( !lightSources[i].isOff() ) {
				
			// COMPLETE THE CODE FOR THE OTHER ROTATION AXES

			if( lightSources[i].isRotYYOn() ) 
			{
				lightSourceMatrix = mult( 
						lightSourceMatrix, 
						rotationYYMatrix( lightSources[i].getRotAngleYY() ) );
			}
		}
		
		// NEW Passing the Light Souree Matrix to apply
	
		var lsmUniform = gl.getUniformLocation(shaderProgram, "allLights["+ String(i) + "].lightSourceMatrix");
	
		gl.uniformMatrix4fv(lsmUniform, false, new Float32Array(flatten(lightSourceMatrix)));
	}
			
	// Instantianting all scene models
	
	for(var i = 0; i < sceneModels.length; i++ )
	{ 
		drawModel( sceneModels[i],
			   mvMatrix,
	           primitiveType );
	}
	           
	// NEW - Counting the frames
	
	countFrames();

	colision();
}

function colision(){
	for(i = 1; i < sceneModels.length; i++){
		if ( Math.abs(sceneModels[0].tx - sceneModels[i].tx) <= 0.2 && Math.abs(sceneModels[0].ty - sceneModels[i].ty) <= 0.2 
																	&& Math.abs(sceneModels[0].tz - sceneModels[i].tz) <= 0.2){
			alert("choque");
		}
	}
	
}

//----------------------------------------------------------------------------
//
//  NEW --- Animation
//

// Animation --- Updating transformation parameters

var lastTime = 0;

function animate() {
	
	var timeNow = new Date().getTime();
	
	if( lastTime != 0 ) {
		
		var elapsed = timeNow - lastTime;
		
		// Global rotation
		
		if( globalRotationYY_ON ) {

			globalAngleYY += globalRotationYY_DIR * globalRotationYY_SPEED * (90 * elapsed) / 1000.0;
	    }

		// For every model --- Local rotations
		// "dançar"
		// for(var i = 0; i < 5; i++ )
	    // {
		// 	if( sceneModels[i].rotXXOn ) {

		// 		sceneModels[i].rotAngleXX += sceneModels[i].rotXXDir * sceneModels[i].rotXXSpeed * (90 * elapsed) / 1000.0;
		// 	}

		// 	if( sceneModels[i].rotYYOn ) {

		// 		sceneModels[i].rotAngleYY += sceneModels[i].rotYYDir * sceneModels[i].rotYYSpeed * (90 * elapsed) / 1000.0;
		// 	}

		// 	if( sceneModels[i].rotZZOn ) {

		// 		sceneModels[i].rotAngleZZ += sceneModels[i].rotZZDir * sceneModels[i].rotZZSpeed * (90 * elapsed) / 1000.0;
		// 	}
		// }

		sceneModels[1].tx -= 0.01;
		//sceneModels[0].tz -= 0.01;
		
		// Rotating the light sources
	
		// for(var i = 0; i < lightSources.length; i++ )
	    // {
		// 	if( lightSources[i].isRotYYOn() ) {

		// 		var angle = lightSources[i].getRotAngleYY() + lightSources[i].getRotationSpeed() * (90 * elapsed) / 1000.0;
		
		// 		lightSources[i].setRotAngleYY( angle );
		// 	}
		// }
}
	
	lastTime = timeNow;
}


//----------------------------------------------------------------------------

// Timer

function tick() {
	
	requestAnimFrame(tick);
	
	drawScene();
	
	animate();
}


//----------------------------------------------------------------------------
//
//  User Interaction
//

function outputInfos(){
    
}

//----------------------------------------------------------------------------

function setEventListeners(){


	document.getElementById("obj-file").onchange = function(){
		
		var file = this.files[0];
		
		var reader = new FileReader();
		
		reader.onload = function( progressEvent ){
			
			// Entire file read as a string
			
			// The file lines
			
			var lines = this.result.split('\n');
			
			// The new vertices
			
			var newVertices = [];
			
			// The new normal vectors
			
			var newNormals = [];
			
			// Check every line and store 
    
			for(var line = 0; line < lines.length; line++){
      
				// The tokens/values in each line
    
			    // Separation between tokens is 1 or mode whitespaces
    
			    var tokens = lines[line].split(/\s\s*/);
			    
			    // Array of tokens; each token is a string
			    
			    if( tokens[0] == "v" ) 
			    {
					// For every vertex we have 3 floating point values
			
				    for( j = 1; j < 4; j++ ) {
					
						newVertices.push( parseFloat( tokens[ j ] ) );
					}
				}

			    if( tokens[0] == "vn" ) 
			    {
					// For every normal we have 3 floating point values
			
				    for( j = 1; j < 4; j++ ) {
					
						newNormals.push( parseFloat( tokens[ j ] ) );
					}
				}
			}	
						
			// Assigning to the current model
			
			vertices = newVertices.slice();
			
			normals = newNormals.slice();
			
			// Checking to see if the normals are defined on the file
			
			var chick = new emptyModelFeatures();
			chick.vertices = vertices;
			chick.normals = normals;
			chick.sx = 0.3; 
			chick.sy = 0.3;
			chick.sz = 0.3;

			if( normals.length == 0 )
			{
				computeVertexNormals( chick.vertices, chick.normals );
			}
						
			// To render the model just read

			sceneModels[0]=chick;

			sceneModels[sceneModels.length].tx = 1; sceneModels[sceneModels.length].ty = 0.0; sceneModels[sceneModels.length].tz = -0.5;

			sceneModels[sceneModels.length].sx = sceneModels[sceneModels.length].sy = sceneModels[sceneModels.length].sz = 0.1;
		
			initBuffers();

			// RESET the transformations - NEED AUXILIARY FUNCTION !!
			
			tx = ty = tz = 0.0;
						
			angleXX = angleYY = angleZZ = 0.0;
			
			sx = sy = sz = 0.7;
		};
		
		// Entire file read as a string
			
		reader.readAsText( file );		
	}

	document.addEventListener("keypress", function(event){

		// Getting the pressed key
	
		var key = event.keyCode; // ASCII
	
		switch(key){
			case 97 : // left
				if (sceneModels[0].tx >= -1){
					sceneModels[0].tx -= 0.25;
				}
			break;
			case 100 : //right
			if (sceneModels[0].tx <= 1){
				sceneModels[0].tx += 0.25;
			}
			break;
			case 119 : // front
				// if (sceneModels[0].tz >= -12)
				// {
				// 	sceneModels[0].tz -= 0.25;
				// }	
				for(i = 1; i < sceneModels.length; i++){
					sceneModels[i].tz += 0.25;
				}
				console.log(sceneModels[3].tz)
				if(sceneModels[3].tz == 0.75){
					console.log(roadModels);
					for(i = 0; i < lista.length; i++){
						sceneModels.push(lista[i]);
					}
					console.log(sceneModels + " - " + sceneModels.length);
				}
			break;
			case 115  : // back
			// if (sceneModels[0].tz <= 1.8)
			// {
			// 	sceneModels[0].tz += 0.25;
			// }	
			for(i = 1; i < sceneModels.length; i++){
				sceneModels[i].tz -= 0.25;
			}	
			
			break;
		}

			drawScene();
	});
	

	var projection = document.getElementById("projection-selection");
	
	projection.addEventListener("click", function(){
				
		// Getting the selection
		
		var p = projection.selectedIndex;
				
		switch(p){
			
			case 0 : projectionType = 0;
				break;
			
			case 1 : projectionType = 1;
				break;
		}  	
	}); 

	// Dropdown list
	
	var list = document.getElementById("rendering-mode-selection");
	
	list.addEventListener("click", function(){
				
		// Getting the selection
		
		var mode = list.selectedIndex;
				
		switch(mode){
			
			case 0 : primitiveType = gl.TRIANGLES;
				break;
			
			case 1 : primitiveType = gl.LINE_LOOP;
				break;
			
			case 2 : primitiveType = gl.POINTS;
				break;
		}
	});      

	// Button events
	
	document.getElementById("XX-on-off-button").onclick = function(){
		
		// Switching on / off
		
		// For every model
		
		for(var i = 0; i < sceneModels.length; i++ )
	    {
			if( sceneModels[i].rotXXOn ) {

				sceneModels[i].rotXXOn = false;
			}
			else {
				sceneModels[i].rotXXOn = true;
			}	
		}
	};

	document.getElementById("XX-direction-button").onclick = function(){
		
		// Switching the direction
		
		// For every model
		
		for(var i = 0; i < sceneModels.length; i++ )
	    {
			if( sceneModels[i].rotXXDir == 1 ) {

				sceneModels[i].rotXXDir = -1;
			}
			else {
				sceneModels[i].rotXXDir = 1;
			}	
		}
	};      

	document.getElementById("XX-slower-button").onclick = function(){
		
		// For every model
		
		for(var i = 0; i < sceneModels.length; i++ )
	    {
			sceneModels[i].rotXXSpeed *= 0.75; 
		}
	};      

	document.getElementById("XX-faster-button").onclick = function(){
		
		// For every model
		
		for(var i = 0; i < sceneModels.length; i++ )
	    {
			sceneModels[i].rotXXSpeed *= 1.25; 
		}
	};      

	document.getElementById("YY-on-off-button").onclick = function(){
		
		// Switching on / off
		
		// For every model
		
		for(var i = 0; i < sceneModels.length; i++ )
	    {
			if( sceneModels[i].rotYYOn ) {

				sceneModels[i].rotYYOn = false;
			}
			else {
				sceneModels[i].rotYYOn = true;
			}	
		}
	};

	document.getElementById("YY-direction-button").onclick = function(){
		
		// Switching the direction
		
		// For every model
		
		for(var i = 0; i < sceneModels.length; i++ )
	    {
			if( sceneModels[i].rotYYDir == 1 ) {

				sceneModels[i].rotYYDir = -1;
			}
			else {
				sceneModels[i].rotYYDir = 1;
			}	
		}
	};      

	document.getElementById("YY-slower-button").onclick = function(){

		// For every model
		
		for(var i = 0; i < sceneModels.length; i++ )
	    {
			sceneModels[i].rotYYSpeed *= 0.75; 
		}
	};      

	document.getElementById("YY-faster-button").onclick = function(){
		
		// For every model
		
		for(var i = 0; i < sceneModels.length; i++ )
	    {
			sceneModels[i].rotYYSpeed *= 1.25; 
		}
	};      

	document.getElementById("ZZ-on-off-button").onclick = function(){
		
		// Switching on / off
		
		// For every model
		
		for(var i = 0; i < sceneModels.length; i++ )
	    {
			if( sceneModels[i].rotZZOn ) {

				sceneModels[i].rotZZOn = false;
			}
			else {
				sceneModels[i].rotZZOn = true;
			}	
		}
	};

	document.getElementById("ZZ-direction-button").onclick = function(){
		
		// Switching the direction
		
		// For every model
		
		for(var i = 0; i < sceneModels.length; i++ )
	    {
			if( sceneModels[i].rotZZDir == 1 ) {

				sceneModels[i].rotZZDir = -1;
			}
			else {
				sceneModels[i].rotZZDir = 1;
			}	
		}
	};      

	document.getElementById("ZZ-slower-button").onclick = function(){
		
		// For every model
		
		for(var i = 0; i < sceneModels.length; i++ )
	    {
			sceneModels[i].rotZZSpeed *= 0.75; 
		}
	};      

	document.getElementById("ZZ-faster-button").onclick = function(){
		
		// For every model
		
		for(var i = 0; i < sceneModels.length; i++ )
	    {
			sceneModels[i].rotZZSpeed *= 1.25; 
		}
	};      
}

//----------------------------------------------------------------------------
//
// WebGL Initialization
//

function initWebGL( canvas ) {
	try {
		
		// Create the WebGL context
		
		// Some browsers still need "experimental-webgl"
		
		gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
		
		// DEFAULT: The viewport occupies the whole canvas 
		
		// DEFAULT: The viewport background color is WHITE
		
		// NEW - Drawing the triangles defining the model
		
		primitiveType = gl.TRIANGLES;
		
		// DEFAULT: Face culling is DISABLED
		
		// Enable FACE CULLING
		
		gl.enable( gl.CULL_FACE );
		
		// DEFAULT: The BACK FACE is culled!!
		
		// The next instruction is not needed...
		
		gl.cullFace( gl.BACK );
		
		// Enable DEPTH-TEST
		
		gl.enable( gl.DEPTH_TEST );
        
	} catch (e) {
	}
	if (!gl) {
		alert("Could not initialise WebGL, sorry! :-(");
	}        
}

//----------------------------------------------------------------------------

function runWebGL() {
	
	var canvas = document.getElementById("game-surface");
	
	initWebGL( canvas );

	shaderProgram = initShaders( gl );
	
	setEventListeners();
	
	tick();		// A timer controls the rendering / animation    

	outputInfos();
}


