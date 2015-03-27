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
        STARTING: "starting",
        PAUSED: "paused",
        PLAYING: "playing",
        INITIALIZING: "initializing"
    };
    this.current_state = this.states.STARTING;


    var wasPressed = {};
    var _this = this;
    _this.keyboard.domElement.addEventListener('keydown', function(event) {
        if (_this.keyboard.eventMatches(event, 'p')) {
            wasPressed['p'] = true;
            if (_this.current_state === _this.states.PAUSED) {
                _this.current_state = _this.states.PLAYING;
            } else if (_this.current_state === _this.states.PLAYING) {
                _this.current_state = _this.states.PAUSED;
            }
            ;
        }
    });
    // listen on keyup to maintain ```wasPressed``` array
    _this.keyboard.domElement.addEventListener('keyup', function(event) {
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

Game.prototype.init = function() {
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

Game.prototype._init_HTML = function() {
    document.getElementById("score").innerHTML = this.player.score;
    document.getElementById("level").innerHTML = this.current_difficulty;
    document.getElementById("life").innerHTML = this.player.lives;
    document.getElementById("killable").innerHTML = this.player.killable;
};

Game.prototype._init_cameras_views = function() {
    var cam_pos;
    var cam_look;
    var one_view;

    //// greeting view ///////////////
    cam_pos = new THREE.Vector3(0, min_height * 2, 100);
    cam_look = new THREE.Vector3(0, -1, 0);
    one_view = new Array();
    one_view.push(cam_pos);
    one_view.push(cam_look);
    this.cameras_views.push(one_view);

    //// Default view ///////////////
    cam_pos = new THREE.Vector3(0, min_height * 2, 100);
    cam_look = new THREE.Vector3(0, 1, 0);
    one_view = new Array();
    one_view.push(cam_pos);
    one_view.push(cam_look);
    this.cameras_views.push(one_view);

    /// old view //////////////
    cam_pos = new THREE.Vector3(0,0, 1000);
    cam_look = new THREE.Vector3(0, 0, -1);
    one_view = new Array();
    one_view.push(cam_pos);
    one_view.push(cam_look);
    this.cameras_views.push(one_view);

    /// funny view ////////////////
    cam_pos = new THREE.Vector3(max_width * 2,700, 500);
    cam_look = new THREE.Vector3(-1, 0, 0);
    one_view = new Array();
    one_view.push(cam_pos);
    one_view.push(cam_look);
    this.cameras_views.push(one_view);

    //// player view ///////////////
    console.log("player view check");
    console.log(this.player.position);
    cam_pos = this.player.position;
    cam_look = new THREE.Vector3(0, 1, 0);
    one_view = new Array();
    one_view.push(cam_pos);
    one_view.push(cam_look);
    this.cameras_views.push(one_view);


};

Game.prototype._init_cameras = function() {
    //Init cameras views
    this._init_cameras_views();

    //set the camera to default view
    var defview = this.cameras_views[1];
    var temp_cam = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 10000);
    temp_cam.position.set(defview[0].x, defview[0].y, defview[0].z);
    temp_cam.lookAt(defview[1]);
    this.add(temp_cam);
    this.cameras.push(temp_cam);

    //Set the current camera
    this.current_camera = this.cameras[0];
    
    var wasPressed = {};
    var that = this;
    that.keyboard.domElement.addEventListener('keydown', function(event) {
        if (that.keyboard.eventMatches(event, 'c') && !wasPressed['c']) {
            wasPressed['c'] = true;
            console.log("camera transitions...");
            that.cameraManagement();
        }
    });
    // listen on keyup to maintain ```wasPressed``` array
    that.keyboard.domElement.addEventListener('keyup', function(event) {
        if (that.keyboard.eventMatches(event, 'c')) {
            wasPressed['c'] = false;
        }
    });
};

Game.prototype.cameraManagement = function() {
    var ccam_pos = this.current_camera.position;

    var pos1 = this.cameras_views[1][0];        //default pos
    var pos2 = this.cameras_views[2][0];        //old pos
    var pos3 = this.cameras_views[3][0];        //funny pos
    var pos4 = this.cameras_views[4][0];        //player pos
    

    if (ccam_pos.x === pos1.x && ccam_pos.y === pos1.y && ccam_pos.z === pos1.z) {
        console.log("default position -> old position");
        this.cameraTransition(this.cameras_views[2][0], this.cameras_views[2][1]);
    }

    if (ccam_pos.x === pos2.x && ccam_pos.y === pos2.y && ccam_pos.z === pos2.z) {
        console.log("old position -> funny position");
        this.cameraTransition(this.cameras_views[3][0], this.cameras_views[3][1]);
    }

    if(ccam_pos.x === pos3.x && ccam_pos.y === pos3.y && ccam_pos.z === pos3.z){
        console.log("funny position -> player position");
        //this.current_camera.rotation.y -= 123 * Math.PI / 180;
        this.cameraTransition(this.cameras_views[4][0],this.cameras_views[4][1]);
   
    }
    
    if(ccam_pos.x === pos4.x && ccam_pos.y === pos4.y && ccam_pos.z === pos4.z){
     console.log("player position -> default position");
     console.log(pos1);
     this.cameraTransition(this.cameras_views[1][0],this.cameras_views[1][1]);
    }
};

Game.prototype.cameraTransition = function(position, look) {
    console.log("camera transition function using tweenjs");
    console.log(look);
    var player_pos = this.player.position;
    var that = this;
    
    if(position.x === player_pos.x && position.y === player_pos.y && position.z === player_pos.z ){
        var tweenCam = new TWEEN.Tween(that.current_camera.position).to({
            x: position.x,
            y: position.y,
            z: position.z}, 3000)
            .easing(TWEEN.Easing.Linear.None)
            .onUpdate(function() {
                that.current_camera.lookAt(look);
            })
            .onComplete(function() {
                //that.current_camera.rotation.y = 180 * Math.PI / 180;
                //that.current_camera.rotation.z = -45 * Math.PI /180;
            })
            .start();
    
            console.log("tween to player pos");
        
    }else{
        var tweenCam = new TWEEN.Tween(that.current_camera.position).to({
            x: position.x,
            y: position.y,
            z: position.z}, 3000)
            .easing(TWEEN.Easing.Linear.None)
            .onUpdate(function() {
                that.current_camera.lookAt(look);
            })
            .start();
     console.log("tween to other pos");
    }
        console.log("end of camera transition");
};

Game.prototype.animate = function() {
    TWEEN.update();
    this.current_environment.animate();
    if (this.current_state === this.states.PLAYING) {
        this.player.moveBullets();
        this._handleKeyEvents();
        //this.current_level.army.animate();
        //this.current_level.defense.move();
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
        this.current_level = new Level(game.current_difficulty, this.player, this);
        this.current_level.init();
        this.add(this.current_level);
        this.current_state = this.states.PAUSED;
    }

    if (this.camera_control) {
        this.camera_control.update();
    }
};

Game.prototype._handleKeyEvents = function() {
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
};

Game.prototype._computeTransition = function(type) {
    switch (type) {
        case "level" :
            var level = "Level " + this.current_difficulty;
            (this.current_difficulty === 1) ? this._create_dialog(level, "#0f0", 5000) : this._create_dialog("Stage Clear <br>" + level, "#0f0", 5000);
            break;
        case "end" :
            this.player.explode();
            break;
    }
};

Game.prototype._create_dialog = function(text, color, duration) {
    document.getElementById("dialog").style.visibility = "visible";
    document.getElementById("dialog").style.color = color;
    document.getElementById("vertical-center").style.visibility = "visible";
    document.getElementById("vertical-center").innerHTML = text;
    var that = this;
    setTimeout(function() {
        document.getElementById("dialog").style.visibility = "hidden";
        document.getElementById("vertical-center").style.visibility = "hidden";
        that.current_state = that.states.PLAYING;
    }, duration);

};

Game.prototype.update = function() {
    this.current_environment.ground.children[0].material.needsUpdate = true;
    console.log(this.current_environment.ground.children[0].material);
};

Game.prototype.debug = function() {
    this.camera_control = new THREE.OrbitControls(this.current_camera);

    this.add(buildAxes(1000));
};
