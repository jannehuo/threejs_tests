var camera;
var scene;
var renderer;
var cube;
var frustum;
var cameraViewProjectionMatrix;
var bbox;

var w = window.innerWidth;
var h = window.innerHeight;

var counter = 0;

var cubeArr;
var cubes = 1000;

var raycaster;
var mouse;

window.onload = function() {
	createScene();
	cubeArr = createRandomCubes();
	console.log(cubeArr);
	render();
	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
};

function createScene() {
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera( 75, w / h, 0.1, 100 );
	renderer = new THREE.WebGLRenderer();
	camera.position.z = 5;

	frustum = new THREE.Frustum();
	cameraViewProjectionMatrix = new THREE.Matrix4();

	raycaster = new THREE.Raycaster();
	mouse = new THREE.Vector2();

	renderer.setSize(w,h);
	
	document.body.appendChild( renderer.domElement );

	//createCube();
	boxHelper(false);
}

function createCube() {
	var geometry = new THREE.BoxGeometry( 1, 1, 1 );
	var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
	cube = new THREE.Mesh( geometry, material );
	scene.add( cube );
	//cube.position.set(0,0,0);
	
}

function render() {
	requestAnimationFrame( render );
	raycaster.setFromCamera( mouse, camera );
	var intersects = raycaster.intersectObjects( scene.children );
	
	_.each(intersects,function(intersect){
		intersect.object.deltaX *= -1;
		intersect.object.deltaY *= -1;
	});

	_.each(cubeArr,function(c,i){
		
		c.rotation.y += c.rotationVal;
		c.position.x += c.deltaX;
		c.position.y += c.deltaY;
		//c.position.z += c.deltaZ;
		if(!checkVisibility(c)) {
			c.position.set(0,0,0);
		}
	});

	renderer.render( scene, camera );
}

function createRandomCubes() {
	var arr = [];
	for (var i = 0; i < cubes; i++) {
		var size = _.random(0,0.5,true);
		
		var geometry = new THREE.BoxGeometry( size, size, size );
		var material = new THREE.MeshBasicMaterial( { color: randColor(),wireframe:true } );
		var c = new THREE.Mesh( geometry, material );
		
		c.deltaX = randVal(100).x / 10000;
		c.deltaY = randVal(100).y / 10000;
		c.deltaZ = randVal(100).z;
		c.rotationVal = _.random(0.01,0.02,true);
		arr.push(c);
		scene.add(c);
	}
	
	return arr;
}

function onDocumentMouseMove(event) {
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

function randVal(radius) {
	var angle = Math.random()*Math.PI*2;
	var values = {
		x : Math.cos(angle)*radius,
		y : Math.sin(angle)*radius,
		z : _.random(0.01,0.09, true)
	};
	
	return values; 
}

function checkVisibility(object) {
	camera.updateMatrixWorld(); // make sure the camera matrix is updated
	camera.matrixWorldInverse.getInverse( camera.matrixWorld );
	cameraViewProjectionMatrix.multiplyMatrices( camera.projectionMatrix, camera.matrixWorldInverse );
	frustum.setFromMatrix( cameraViewProjectionMatrix );
	return frustum.intersectsObject(object);
}

function boxHelper(on) {
	if(on) {
		var hex  = 0xff0000;

		var sphereMaterial = new THREE.MeshLambertMaterial( {color: 0x00ff00} );
		var sphere = new THREE.Mesh( new THREE.SphereGeometry( 1, 1, 1), sphereMaterial );
		scene.add( sphere );

		bbox = new THREE.BoundingBoxHelper( sphere, hex );
		bbox.update();
		scene.add( bbox );
		console.log(bbox);
	}
}

function randColor() {
	var hex = Math.floor( Math.random() * 0xFFFFFF );
	var res = document.getElementById('result');
	var result = "#" + hex.toString(16);
	
	/*var colors = [
		"#0B2161",
		"#08298A",
		"#0431B4",
		"#5882FA",
		"#2E64FE",
		"#0040FF",
		"#013ADF",
		"#013ADF"
	];
	var result = _.sample(colors);*/
	return result;
}
