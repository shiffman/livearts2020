/**
 * @author mrdoob / http://mrdoob.com
 * @modified by obviousjim / http://specular.cc
 */

var camera, cameraTarget, cameraDummy;
var scene, scene2;
var renderer;


var rotation = 0, rotationTarget = 0;

var ray, projector, mouse;
var videos, objects;

var MOUSEOVERED = null, CLICKED = null;

var init = function () {

	camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 5000 );

	cameraTarget = new THREE.Vector3( 0, 0, - 1500 );

	cameraDummy = new THREE.Object3D();
	cameraDummy.add( camera );

	scene = new THREE.Scene();
	scene.add( cameraDummy );

	ray = new THREE.Ray();
	projector = new THREE.Projector();
	mouse = new THREE.Vector2();

	scene2 = new THREE.Scene();

	angle = ( Math.PI * 2 ) / VideoFiles.length;
	videos = [];
	objects = [];

	var geometry = new THREE.IcosahedronGeometry( 400, 0 );

	for ( var i = 0; i < VideoFiles.length; i++ ) {

		var video = new RGBDVideo( VideoFiles[i] );
		video.position.x = Math.sin( i * angle ) * 800;
		video.position.z = Math.cos( i * angle ) * 800;
		video.rotation.y = i * angle;

		scene.add( video );
		videos.push( video );

		var sphere = new THREE.Mesh( geometry );
		sphere.position.x = Math.sin( i * angle ) * 500;
		sphere.position.y = - 100;
		sphere.position.z = Math.cos( i * angle ) * 500;
		sphere.updateMatrix();
		sphere.updateMatrixWorld();

		objects.push( sphere );

		sphere.material.opacity = 0.5;

	}

	var ratio = window.devicePixelRatio || 1;

	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth * ratio, window.innerHeight * ratio );
	renderer.domElement.style.width = window.innerWidth + 'px';
	renderer.domElement.style.height = window.innerHeight + 'px';
	document.body.appendChild( renderer.domElement );

	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = 0;

	document.addEventListener( 'mousedown', onDocumentMouseDown, false );
	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	document.addEventListener( 'click', onDocumentClick, false );

	cameraDummy.position.set( Math.sin( 0 ) * 1500, 2000, 0 );

	new TWEEN.Tween( cameraDummy.position )
		.to( { z: Math.cos( 0 ) * 1500 }, 3000 )
		.easing( TWEEN.Easing.Exponential.Out )
		.start();

	new TWEEN.Tween( cameraDummy.position )
		.to( { y: - 30 }, 5000 )
		.easing( TWEEN.Easing.Exponential.Out )
		.start();

	window.addEventListener( 'resize', onWindowResize, false );

};

var onDocumentMouseDownX = 0;

var onDocumentMouseDown = function ( event ) {

	onDocumentMouseDownX = event.clientX;

	var onDocumentMouseMove = function ( event ) {

		document.body.style.cursor = 'move';

		var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;

		rotationTarget -= movementX * 0.005;

	};

	var onDocumentMouseUp = function ( event ) {

		document.body.style.cursor = 'pointer';

		document.removeEventListener( 'mousemove', onDocumentMouseMove );
		document.removeEventListener( 'mouseup', onDocumentMouseUp );

	};

	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	document.addEventListener( 'mouseup', onDocumentMouseUp, false );

};

var onDocumentMouseMove = function ( event ) {

	event.preventDefault();

	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

};

var onDocumentClick = function ( event ) {

	if ( Math.abs( event.clientX - onDocumentMouseDownX ) > 2 ) return;

	if ( MOUSEOVERED === null ) return;
	if ( videos[ MOUSEOVERED ].isPlaying() === true ) return;

	if ( CLICKED !== null ) {

		var video = videos[ CLICKED ];
		video.pause();

	}

	TWEEN.removeAll();

	var start = rotation; // CLICKED || 0;
	var end = MOUSEOVERED;

	// fix 360

	if ( end - start >= 5 ) end -= 10;

	rotationTarget = end;

	CLICKED = MOUSEOVERED;

	var video = videos[ CLICKED ];
	video.play();

};

var onWindowResize = function () {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

};

var animate = function () {

	requestAnimationFrame( animate );

	TWEEN.update();

	stats.begin();

	var x = mouse.x * 100.0;
	var y = mouse.y * 100.0;

	camera.position.x += ( x - camera.position.x ) * 0.1;
	camera.position.y += ( y - camera.position.y ) * 0.1;


	camera.lookAt( cameraTarget );

	rotation += ( rotationTarget - rotation ) * 0.1;

	cameraDummy.position.x = Math.sin( rotation * angle ) * 1500;
	cameraDummy.position.z = Math.cos( rotation * angle ) * 1500;
	cameraDummy.rotation.y = rotation * angle;

	//

	var vector = new THREE.Vector3( mouse.x, mouse.y, 1 );
	projector.unprojectVector( vector, camera );

	ray.origin.copy( cameraDummy.position );
	ray.direction.copy( vector.subSelf( cameraDummy.position ).normalize() );

	var intersections = ray.intersectObjects( objects );

	if ( intersections.length > 0 ) {

		var object = objects.indexOf( intersections[ 0 ].object );

		if ( MOUSEOVERED !== object ) {

			document.body.style.cursor = 'pointer';

			if ( MOUSEOVERED !== null ) videos[ MOUSEOVERED ].rollout();

			MOUSEOVERED = object;

			videos[ MOUSEOVERED ].rollover();

		}

	} else {

		document.body.style.cursor = '';

		if ( MOUSEOVERED !== null ) videos[ MOUSEOVERED ].rollout();

		MOUSEOVERED = null;

	}

	renderer.render( scene, camera );

	stats.end();

};

if ( System.support.webgl === true ) {

	init();
	animate();

} else {

	var message = document.createElement( 'div' );
	message.id = 'message';
	message.innerHTML = 'Either your graphics card or your browser does not support WebGL. Try <a href="http://www.google.com/chrome/">Google Chrome</a><br />or <a href="http://www.khronos.org/webgl/wiki_1_15/index.php/Getting_a_WebGL_Implementation">view a list</a> of WebGL compatible browsers.';
	document.body.appendChild( message );

}

