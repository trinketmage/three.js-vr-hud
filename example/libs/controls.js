if (typeof bbs == "undefined" || !bbs) {
    var bbs = {};
}

if (typeof bbs.Game == "undefined" || !bbs.Game) {
    bbs.Game = {};
}

bbs.Game.Controls = function(options) {
	this.settings = options;
    this.init();
};
// ------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------
// Prototype

bbs.Game.Controls.prototype = {
    controls:null,
    listner: null,
    statusOrientation: false,

    // --------------------------------------------------------------------------------------------
    init: function() {

  		this.createControls();
        this.initEvents();
        this.fullscreen();
    },

    initEvents:function(){
        window.addEventListener('deviceorientation', 'onSetOrientationControls', true);
    },

    createControls: function() {
        this.controls = new THREE.OrbitControls(this.settings.camera, this.settings.element);
        this.controls.rotateUp(0);
        this.controls.target.set(
            this.settings.camera.position.x+0.1,
            this.settings.camera.position.y,
            this.settings.camera.position.z
        );
        this.controls.noZoom = this.settings.noZoom;
        this.controls.noPan = this.settings.noPan;

    },

    update: function(dt){

        this.controls.update(dt);
    },


    onSetOrientationControls: function(e) {
        if (!e.alpha) {
            return;
        }
        this.statusOrientation = true;

        this.controls = new THREE.DeviceOrientationControls(this.settings.camera, true);
        this.controls.connect();
        this.controls.update();

        this.settings.element.addEventListener('click', jQuery.proxy(this,'fullscreen'), false);
        
        window.removeEventListener('deviceorientation', this.listner, true);
    },

    fullscreen:function() {
        if (this.settings.container.requestFullscreen) {
            this.settings.container.requestFullscreen();
        } else if (this.settings.container.msRequestFullscreen) {
            this.settings.container.msRequestFullscreen();
        } else if (this.settings.container.mozRequestFullScreen) {
            this.settings.container.mozRequestFullScreen();
        } else if (this.settings.container.webkitRequestFullscreen) {
            this.settings.container.webkitRequestFullscreen();
        }
    },

    moveCamera: function(newPosition)
    {
        var that = this;
            this.controls.enabled = false;
            TWEEN.removeAll();
            if(!this.statusOrientation)
            {
                new TWEEN.Tween( this.controls.target0 )
                    .to( newPosition, 700 )
                    .easing( TWEEN.Easing.Linear.None)
                    .start(); 
                new TWEEN.Tween( this.controls.target )
                    .to( {
                        x: newPosition.x+.1,
                        y: newPosition.y,
                        z: newPosition.z
                    }, 700 )
                    .easing( TWEEN.Easing.Linear.None)
                    .start(); 
            }
            new TWEEN.Tween( this.controls.object.position )
                .to( newPosition, 700 )
                .easing( TWEEN.Easing.Linear.None)
                .onComplete(function(){
                    that.controls.enabled = true;
                })
                .start(); 
    }

};
