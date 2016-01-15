
THREE.VRHUD = function (w, h) {
	this.scene = new THREE.Scene();
	this.camera = new THREE.PerspectiveCamera(45, w/h, 1, 10000);
	this.scene.add(this.camera);
};

THREE.VRHUD.prototype.resize = function (w, h) {
	this.camera.aspect = w/h;
	this.camera.updateProjectionMatrix();
};

THREE.VRHUD.prototype.render = function (mainScene, mainCamera, renderer, w, h) {
    _width = w/2;
    _height = h;

    mainCameras = new THREE.VRHUD.StreoCameras(mainCamera);
    HUDCameras = new THREE.VRHUD.StreoCameras(this.camera);

    renderer.setScissor( 0, 0, _width, _height );
    renderer.setViewport( 0, 0, _width, _height );
    renderer.render( mainScene, mainCameras.left );
    renderer.clearDepth();
    renderer.render( this.scene, HUDCameras.left );

    renderer.setScissor( _width, 0, _width, _height );
    renderer.setViewport( _width, 0, _width, _height );
    renderer.render( mainScene, mainCameras.right );
    renderer.clearDepth();
    renderer.render( this.scene, HUDCameras.right );
};
	
THREE.VRHUD.prototype.addCrosshair = function (mesh) {
	this.crosshair = mesh;
	this.scene.add(this.crosshair);
};

THREE.VRHUD.Crosshair = function(mesh) {
	this.mesh = mesh;
};

THREE.VRHUD.prototype.addLabel = function (top, left, botton ,right) {
};

/**
 * Off-axis stereoscopic effect based on http://paulbourke.net/stereographics/stereorender/
 */
THREE.VRHUD.StreoCameras = function ( camera ) {

	this.separation = 3;
	this.focalLength = 15;

	var _width, _height;

	var _position = new THREE.Vector3();
	var _quaternion = new THREE.Quaternion();
	var _scale = new THREE.Vector3();

	var cameras = {
		left :  new THREE.PerspectiveCamera(),
		right : new THREE.PerspectiveCamera()
	};

	var _fov;
	var _outer, _inner, _top, _bottom;
	var _ndfl, _halfFocalWidth, _halfFocalHeight;
	var _innerFactor, _outerFactor;

	camera.matrixWorld.decompose( _position, _quaternion, _scale );

	_fov = THREE.Math.radToDeg( 2 * Math.atan( Math.tan( THREE.Math.degToRad( camera.fov ) * 0.5 ) ) );

	_ndfl = camera.near / this.focalLength;
	_halfFocalHeight = Math.tan( THREE.Math.degToRad( _fov ) * 0.5 ) * this.focalLength;
	_halfFocalWidth = _halfFocalHeight * 0.5 * camera.aspect;

	_top = _halfFocalHeight * _ndfl;
	_bottom = -_top;
	_innerFactor = ( _halfFocalWidth + this.separation / 2.0 ) / ( _halfFocalWidth * 2.0 );
	_outerFactor = 1.0 - _innerFactor;

	_outer = _halfFocalWidth * 2.0 * _ndfl * _outerFactor;
	_inner = _halfFocalWidth * 2.0 * _ndfl * _innerFactor;

	cameras.left.projectionMatrix.makeFrustum(
		-_outer,
		_inner,
		_bottom,
		_top,
		camera.near,
		camera.far
	);

	cameras.left.position.copy( _position );
	cameras.left.quaternion.copy( _quaternion );
	cameras.left.translateX( - this.separation / 2.0 );

	cameras.right.projectionMatrix.makeFrustum(
		-_inner,
		_outer,
		_bottom,
		_top,
		camera.near,
		camera.far
	);

	cameras.right.position.copy( _position );
	cameras.right.quaternion.copy( _quaternion );
	cameras.right.translateX( this.separation / 2.0 );
	
	return cameras;
};
