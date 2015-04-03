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
    this.tweenDone = Boolean(true);

    this.states = {
        STARTING: "starting",
        PAUSED: "paused",
        PLAYING: "playing",
        INITIALIZING: "initializing"
    };
    
    this.current_state = this.states.STARTING;
    
    this.cameraStates = {
        GREETING: "greeting",
        DEFAULT: "default",
        OLD: "old",
        FUNNY: "funny",
        PLAYER: "player"
    };
    
    this.current_camera_state;
    
    


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

Game.prototype.update_player_view = function(){
    /* This function update the player view */
    //// player view ///////////////
    var aux_pos = new THREE.Vector3(this.player.position.x,this.player.position.y,this.player.position.z);
    //handling aux position
    aux_pos.x -= this.player.height;
    aux_pos.y -= this.player.height;
    aux_pos.z += this.player.height;
    ////////////////////////
    cam_pos = new THREE.Vector3(aux_pos.x,aux_pos.y,aux_pos.z);  
    cam_look = new THREE.Vector3(0, 1, 0);
    one_view = new Array();
    one_view.push(cam_pos);
    one_view.push(cam_look);
    
    //this.cameras_views.push(one_view);
    this.cameras_views[2]=one_view;
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
    
    //// player view ///////////////
    var aux_pos = new THREE.Vector3(this.player.position.x,this.player.position.y,this.player.position.z);
    //handling aux position
    aux_pos.x -= this.player.height;
    aux_pos.y -= this.player.height;
    aux_pos.z += this.player.height;
    ////////////////////////
    cam_pos = new THREE.Vector3(aux_pos.x,aux_pos.y,aux_pos.z);  
    cam_look = new THREE.Vector3(0, 1, 0);
    one_view = new Array();
    one_view.push(cam_pos);
    one_view.push(cam_look);
    this.cameras_views.push(one_view);

    /// old view //////////////
    cam_pos = new THREE.Vector3(0,min_height * 2 - 200, 1000);
    cam_look = new THREE.Vector3(0, -1, -1);
    one_view = new Array();
    one_view.push(cam_pos);
    one_view.push(cam_look);
    this.cameras_views.push(one_view);

    /// funny view ////////////////
    cam_pos = new THREE.Vector3(max_width * 2,700 , 500);
    cam_look = new THREE.Vector3(-1, 0, 0);
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
    this.current_camera_state = this.cameraStates.DEFAULT;
    
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
    /*var ccam_pos = this.current_camera.position;

    var pos1 = this.cameras_views[1][0];        //default position
    var pos2 = this.cameras_views[2][0];        //player position
    var pos3 = this.cameras_views[3][0];        //old position
    var pos4 = this.cameras_views[4][0];        //player position*/
    
    

    if (this.current_camera_state === this.cameraStates.DEFAULT) {
        console.log("default position -> player position");
        this.cameraTransition(this.cameras_views[2][0], this.cameras_views[2][1]);
        this.current_camera_state = this.cameraStates.PLAYER;
    }else
    
    if(this.current_camera_state === this.cameraStates.PLAYER){
        console.log("player position -> old position");
        this.cameraTransition(this.cameras_views[3][0],this.cameras_views[3][1]);
        this.current_camera_state = this.cameraStates.OLD;
    }else

    if (this.current_camera_state === this.cameraStates.OLD) {
        console.log("old position -> funny position");
        this.cameraTransition(this.cameras_views[4][0], this.cameras_views[4][1]);
        this.current_camera_state = this.cameraStates.FUNNY;
    }else
    
    if(this.current_camera_state === this.cameraStates.FUNNY){
        console.log("funny position -> default position");
        this.cameraTransition(this.cameras_views[1][0],this.cameras_views[2][1]);
        this.current_camera_state = this.cameraStates.DEFAULT;
    } 
};

Game.prototype.cameraMove = function(direction){
    console.log("-> game.cameraMove()");
    this.current_camera.position.x += (direction[0] * this.player.speed);
    this.current_camera.position.y += (direction[1] * this.player.speed);
    this.current_camera.position.z += (direction[2] * this.player.speed);
    console.log("<- game.cameraMove()");
}

Game.prototype.cameraTransition = function(position, look) {
    var player_pos = this.player.position;
    var that = this;
    if(position.x === player_pos.x-that.player.height && position.y === player_pos.y-that.player.height && position.z === player_pos.z+that.player.height ){
        var tweenCam = new TWEEN.Tween(that.current_camera.position).to({
            x: position.x,
            y: position.y,
            z: position.z}, 2000)
            .easing(TWEEN.Easing.Linear.None)
            .onUpdate(function() {
            })
            .onComplete(function(){
                that.current_camera.position.x = that.player.position.x;
            })
            .start();
    }else{
        var tweenCamOther = new TWEEN.Tween(that.current_camera.position).to({
            x: position.x,
            y: position.y,
            z: position.z}, 3000)
            .easing(TWEEN.Easing.Linear.None)
            .onUpdate(function() {
                that.current_camera.lookAt(look);
            })
            .start();
    }

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
        if (this.player.position.x + this.player.height * 2 > min_width){
            this.player.move(dir);
            if(this.current_camera_state === this.cameraStates.PLAYER){
                    this.cameraMove(dir);          
            }
        }
        this.update_player_view();
    }
    
    if (this.keyboard.pressed("right")) {
        var dir = [1, 0, 0];
        if (this.player.position.x + (this.player.height) * 2 < max_width){
            this.player.move(dir);
            if(this.current_camera_state === this.cameraStates.PLAYER){
                    this.cameraMove(dir);
            }      
        }
        this.update_player_view();
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
