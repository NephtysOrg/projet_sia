function Game() {
    THREE.Scene.call(this);
    this.player;
    this.cameras = Array();
    this.cameras_views = Array();
    this.current_camera;
    this.current_difficulty;
    this.current_level;
    this.current_environment = new Environement();
    this.keyboard = new THREEx.KeyboardState();
    this.camera_control;
    this.states = {
        STARTING : "starting",
        PAUSED: "paused",
        PLAYING: "playing",
        INITIALIZING: "initializing"
    };
    this.current_state = this.states.STARTING;
    
    
    var wasPressed = {};
    var _this = this;
    _this.keyboard.domElement.addEventListener('keydown', function (event) {
        if (_this.keyboard.eventMatches(event, 'p')) {
            wasPressed['p'] = true;
            if (_this.current_state === _this.states.PAUSED){
                _this.current_state = _this.states.PLAYING;
            }else if (_this.current_state === _this.states.PLAYING){
                _this.current_state = _this.states.PAUSED;
            };
        }
    });
    // listen on keyup to maintain ```wasPressed``` array
    _this.keyboard.domElement.addEventListener('keyup', function (event) {
        if (_this.keyboard.eventMatches(event, 'p')) {
            wasPressed['p'] = false;
        }
    });
}
;

// Create a Army.prototype object that inherits from Group.prototype
Game.prototype = Object.create(THREE.Scene.prototype);
// Set the "constructor" property to refer to Army
Game.prototype.constructor = Game;

Game.prototype.init = function () {
    this.current_difficulty = 1;
    this.player = new Player(player_data, 3, 10, this);
    this.player.position.y = min_height + this.player.height;
    this.add(this.player);
    this.current_level = new Level(this.current_difficulty, this.player, this);
    this.current_level.init();
    this.add(this.current_level);
    this.current_environment.init();
    this.add(this.current_environment);
    this._init_cameras();
    this._init_HTML();
    THREEx.WindowResize.bind(renderer, this.current_camera);
    this._computeTransition("level");
};

Game.prototype._init_HTML = function () {
    document.getElementById("score").innerHTML = this.player.score;
    document.getElementById("level").innerHTML = this.current_difficulty;
    document.getElementById("life").innerHTML = this.player.lives;
    document.getElementById("killable").innerHTML = this.player.killable;
};

Game.prototype._init_cameras_views = function (){
   var cam_pos;
   var cam_look;
   var one_view;
   
   //// Default view ///////////////
   cam_pos = new THREE.Vector3(0, min_height*2,100);
   cam_look = new THREE.Vector3(0,1,0);
   one_view = new Array();
   one_view.push(cam_pos);
   one_view.push(cam_look);
   this.cameras_views.push(one_view);
   
   /// old view //////////////
   cam_pos = new THREE.Vector3(0,0,1500);
   cam_look = new THREE.Vector3(0,0,-1);
   one_view = new Array();
   one_view.push(cam_pos);
   one_view.push(cam_look);
   this.cameras_views.push(one_view);
   
   //// player view ///////////////
   cam_pos = new THREE.Vector3(200,0,100);
   cam_look = new THREE.Vector3(-1,1,0);
   one_view = new Array();
   one_view.push(cam_pos);
   one_view.push(cam_look);
   this.cameras_views.push(one_view);
};

Game.prototype._init_cameras = function () {
    //Init cameras views
    this._init_cameras_views();
    
    //don't touch this
    var camera = new THREE.PerspectiveCamera(35,
    window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(0, min_height*2, 100);
    camera.lookAt(new THREE.Vector3(0,max_height,0));
    this.add(camera);
    this.cameras.push(camera);
    
    //handle this
    //let put the old camera
    var oldview = this.cameras_views[1];
    var test_camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 10000);
    //console.log(oldview[0].x,oldview[0].y,oldview[0].z);
    test_camera.position.set(oldview[0].x,oldview[0].y,oldview[0].z);
    test_camera.lookAt(oldview[1]);
    this.add(test_camera);
    this.cameras.push(test_camera);
    
    //Set the current camera
    this.current_camera = this.cameras[0];
};

Game.prototype.cameraManagement = function(){
    //the camera's transition loop
    var ccam_pos = this.current_camera.position;
    //console.log(ccam_pos);
    //console.log(this.cameras_views[0][0]);
    
    /*if(ccam_pos === this.cameras_views[0][0] ){
       console.log("greeting position -> default position"); 
    }*/
    var pos0 = this.cameras_views[0][0];
    var pos1 = this.cameras_views[1][0];
    var pos2 = this.cameras_views[2][0];
   
    if(ccam_pos.x === pos0.x && ccam_pos.y === pos0.y && ccam_pos.z === pos0.z ){
        console.log("default position -> old position");
        this.cameraTransition(this.cameras_views[1][0],this.cameras_views[1][1]);
    }
    if(ccam_pos === this.cameras_views[1][0] ){
        console.log("old position -> player position"); 
    }
    
    if(ccam_pos === this.cameras_views[2][0]){
        console.log("player position -> funny position"); 
    }
};

Game.prototype.cameraTranslate = function(){
    var actualXpos =this.current_camera.position.x;
    var actualYpos =this.current_camera.position.y;
    var actualZpos =this.current_camera.position.z;
    
    console.log(this.current_camera.position);
    // Calculate the difference between current frame number and where we want to be:
    var differenceX = Math.abs(this.current_camera.position.x - actualXpos);
    actualXpos = this.current_camera.position.x ;
    var differenceY = Math.abs(this.current_camera.position.y - actualYpos);
    actualYpos = this.current_camera.position.y;
    var differenceZ = Math.abs(this.current_camera.position.z - actualZpos);
    actualZpos = this.current_camera.position.z;

    this.current_camera.position.x += differenceX;
    this.current_camera.position.y += differenceY;
    this.current_camera.position.z += differenceZ;
    /*this.current_camera.translateX( +differenceX);
    this.current_camera.translateY( +differenceY);
    this.current_camera.translateZ( +differenceZ);*/
    
    
};

Game.prototype.cameraTransition = function (position,look) {
    console.log("camera transition function using tweenjs");
    var tweenCam = new TWEEN.Tween(this.current_camera.position).to({
        x:position.x,
        y:position.y,
        z:position.z}, 600)
    .easing(TWEEN.Easing.Sinusoidal.InOut)
    .onUpdate(this.cameraTranslate())
    .start();
};

Game.prototype.animate = function () {
    TWEEN.update();
    this.current_environment.animate();
    if (this.current_state === this.states.PLAYING) {
        this.player.moveBullets();
        this._handleKeyEvents();
        this.current_level.army.animate();
        this.current_level.defense.move();
        if (this.player.lives === 0)
            stop();
          
    }
    if (this.current_state === this.states.INITIALIZING) {
        this.current_difficulty++;
        this._computeTransition("level");
        document.getElementById("level").innerHTML = game.current_difficulty;
        this.current_level.clear();
        //this.current_environment.clearGround();
       // this.current_environment.init();
        this.current_level = new Level(game.current_difficulty, this.player,this);
        this.current_level.init();
        this.add(this.current_level);
        this.current_state = this.states.PAUSED;
    }
    
    if (this.camera_control) {
        this.camera_control.update();
    }
};

Game.prototype._handleKeyEvents = function () {
    if (this.keyboard.pressed("left")) {
        var dir = [-1, 0, 0];
        if (this.player.position.x + this.player.height * 2 > min_width)
            this.player.move(dir);
    }
    if (this.keyboard.pressed("right")) {
        var dir = [1, 0, 0];
        if (this.player.position.x + (this.player.height) * 2 < max_width)
            this.player.move(dir);
    }
    if (this.keyboard.pressed("space")) {
        this.player.fire();
    }

    if (this.keyboard.pressed("k")) {
        this.current_level.clear();
    }
    
    //cameras transition
    if (this.keyboard.pressed("c")) {
        console.log("camera transitions...");
        this.cameraManagement();
    }
};

Game.prototype._computeTransition = function (type) {
    switch (type) {
        case "level" :
            var level = "Level "+this.current_difficulty;
            (this.current_difficulty === 1 )?this._create_dialog(level, "#0f0", 5000):this._create_dialog("Stage Clear <br>" + level, "#0f0", 5000);
            break;
        case "end" :
            this.player.explode();
            break;
    }
};

Game.prototype._create_dialog = function (text, color, duration) {
    document.getElementById("dialog").style.visibility = "visible";
    document.getElementById("dialog").style.color = color;
    document.getElementById("vertical-center").style.visibility = "visible";
    document.getElementById("vertical-center").innerHTML = text;
    var that = this;
    setTimeout(function () {
        document.getElementById("dialog").style.visibility = "hidden";
        document.getElementById("vertical-center").style.visibility = "hidden";
        that.current_state = that.states.PLAYING;
    }, duration);

};

Game.prototype.update = function (){
    this.current_environment.ground.children[0].material.needsUpdate = true;
    console.log(this.current_environment.ground.children[0].material);
};

Game.prototype.debug = function () {
    this.camera_control = new THREE.OrbitControls(this.current_camera);
    
    this.add(buildAxes(1000));
};
