/**
 * Create the game
 * @returns {Game}
 */
function Game() {
    THREE.Scene.call(this);

    this.player;                                    // the player
    this.current_camera;                            // the only camera
    this.cameras_views = Array();                   // camera view managed with tween
    this.camera_states = {// the possible camera state
        GREETING: "greeting",
        DEFAULT: "default",
        OLD: "old",
        FUNNY: "funny",
        PLAYER: "player"};
    this.current_camera_state;                      // the current camera state
    this.current_difficulty;                        // The level number -1
    this.current_level;                             // the current level (Its not a number but a class)
    this.current_environment = new Environement();  // The current environment

    this.keyboard = new THREEx.KeyboardState();     // handling key press
    this.pp_manager;                                // post processing class manager
    this.sound_manager = new SoundManager();
    this.states = {// game possible state
        GREETING: "greeting",
        PAUSED: "paused",
        PLAYING: "playing",
        INITIALIZING: "initializing",
        OVER: "over"};
    this.current_state = this.states.GREETING;      // Current game state

    this.logo;                                      // Game logo basically Space Invaders
    
    // debug 
    this.camera_control;
    this.rendererStats;
    
    // add non repeat on certain key press (not managed by default by threex)
    var wasPressed = {};
    var _this = this;
    _this.keyboard.domElement.addEventListener('keydown', function (event) {
        if (_this.keyboard.eventMatches(event, 'p')) {
            wasPressed['p'] = true;
            if (_this.current_state === _this.states.PAUSED) {
                _this.current_state = _this.states.PLAYING;
            } else if (_this.current_state === _this.states.PLAYING) {
                _this.current_state = _this.states.PAUSED;
            }
        }
        if (_this.keyboard.eventMatches(event, 'c') && !wasPressed['c']) {
            wasPressed['c'] = true;
            _this.cameraManagement();
        }
    });
    // listen on keyup to maintain ```wasPressed``` array
    _this.keyboard.domElement.addEventListener('keyup', function (event) {
        if (_this.keyboard.eventMatches(event, 'p')) {
            wasPressed['p'] = false;
        }
        if (_this.keyboard.eventMatches(event, 'c')) {
            wasPressed['c'] = false;
        }
    });
}
;

Game.prototype = Object.create(THREE.Scene.prototype);
Game.prototype.constructor = Game;


/**
 * Initialize the game
 */
Game.prototype.init = function () {
    this.current_difficulty = 1;
    this.sound_manager.musics["stay"].loop().play().fadeIn(50000).fadeOut(50000);
    this.player = new Player(player_data, 3, 10, this);
    this.player.position.y = min_height + this.player.height;
    this.add(this.player);
    this.current_level = new Level(this.current_difficulty, this.player, this);
    this.current_level.init();
    this.add(this.current_level);
    this.current_environment.init();
    this.add(this.current_environment);
    this._init_camera();
    this._init_HTML();
    this.hideInfos();
    var link = "&nbsp;&nbsp;&nbsp;&nbsp;<a onClick=\"game.sound_manager.muteMusics()\" ><span id=\"music\" ><i class=\"fa fa-music\"></i></span></a>";
    this.displayLogo("SPACE INVADERS 3D", "Press ENTER to play"+link);
    this.pp_manager = new PostProcessingManager(renderer, this);
    THREEx.WindowResize.bind(renderer, this.current_camera);
    THREEx.FullScreen.bindKey({ charCode : 'F11'.charCodeAt(0) });
};


/**
 * Init the screen info display in HTML
 */
Game.prototype._init_HTML = function () {
    this.displayScore();
    this.displayLevel();
    this.displayKillable();
    this.displayLives();
};

/**
 * Create camera views
 */
Game.prototype._init_cameras_views = function () {
    var cam_pos;
    var cam_look;
    var one_view;

    //// greeting view ///////////////
    cam_pos = new THREE.Vector3(10000, -10000, 10000);
    cam_look = new THREE.Vector3(0, 0, 0);
    one_view = new Array();
    one_view.push(cam_pos);
    one_view.push(cam_look);
    this.cameras_views["greeting"] = one_view;

    //// Default view ///////////////
    cam_pos = new THREE.Vector3(0, min_height * 2, 100);
    cam_look = new THREE.Vector3(0, 1, 0);
    one_view = new Array();
    one_view.push(cam_pos);
    one_view.push(cam_look);
    this.cameras_views["default"] = one_view;

    //// player view ///////////////
    var aux_pos = new THREE.Vector3(this.player.position.x, this.player.position.y, this.player.position.z);
    //handling aux position
    aux_pos.x -= this.player.height;
    aux_pos.y -= this.player.height;
    aux_pos.z += this.player.height;
    ////////////////////////
    cam_pos = new THREE.Vector3(aux_pos.x, aux_pos.y, aux_pos.z);
    cam_look = this.player.direction;
    one_view = new Array();
    one_view.push(cam_pos);
    one_view.push(cam_look);
    this.cameras_views["player"] = one_view;

    /// old view //////////////
    cam_pos = new THREE.Vector3(0, min_height * 2 - 200, 800);
    cam_look = new THREE.Vector3(0, -1, -1);
    one_view = new Array();
    one_view.push(cam_pos);
    one_view.push(cam_look);
    this.cameras_views["old"] = one_view;

    /// funny view ////////////////
    cam_pos = new THREE.Vector3(max_width * 2, 700, 500);
    cam_look = new THREE.Vector3(-1, 0, 0);
    one_view = new Array();
    one_view.push(cam_pos);
    one_view.push(cam_look);
    this.cameras_views["funny"] = one_view;
};


/**
 * Create the camera and put her in default view
 */
Game.prototype._init_camera = function () {
    //Init cameras views
    this._init_cameras_views();

    //set the camera to default view
    var defview = this.cameras_views["greeting"];
    this.current_camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 10000);
    this.current_camera.position.set(defview[0].x, defview[0].y, defview[0].z);
    this.current_camera.lookAt(defview[1]);
    this.add(this.current_camera);
    this.current_camera_state = this.camera_states.GREETING;

};


/**
 * Usefull to follow the player in player view
 * @param {type} direction
 */
Game.prototype.cameraMove = function (direction) {
    this.current_camera.position.x += (direction[0] * this.player.speed);
    this.current_camera.position.y += (direction[1] * this.player.speed);
    this.current_camera.position.z += (direction[2] * this.player.speed);
};

/**
 * Manage camera transition
 */
Game.prototype.cameraManagement = function () {
    if (this.current_camera_state === this.camera_states.DEFAULT) {
        this.cameraTransition(this.cameras_views["player"][0], this.cameras_views["player"][1]);
        this.current_camera_state = this.camera_states.PLAYER;
    } else

    if (this.current_camera_state === this.camera_states.PLAYER) {
        this.cameraTransition(this.cameras_views["old"][0], this.cameras_views["old"][1]);
        this.current_camera_state = this.camera_states.OLD;
    } else

    if (this.current_camera_state === this.camera_states.OLD) {
        this.cameraTransition(this.cameras_views["funny"][0], this.cameras_views["funny"][1]);
        this.current_camera_state = this.camera_states.FUNNY;
    } else

    if (this.current_camera_state === this.camera_states.FUNNY) {
        this.cameraTransition(this.cameras_views["default"][0], this.cameras_views["default"][1]);
        this.current_camera_state = this.camera_states.DEFAULT;
    }
};

/**
 * Update player view when player move
 */
Game.prototype.update_player_view = function () {

    //// player view ///////////////
    var aux_pos = new THREE.Vector3(this.player.position.x, this.player.position.y, this.player.position.z);

    //handling aux position
    aux_pos.x -= this.player.height;
    aux_pos.y -= this.player.height;
    aux_pos.z += this.player.height;
    ////////////////////////
    cam_pos = new THREE.Vector3(aux_pos.x, aux_pos.y, aux_pos.z);
    cam_look = new THREE.Vector3(0, 1, 0);
    one_view = new Array();
    one_view.push(cam_pos);
    one_view.push(cam_look);

    this.cameras_views["player"] = one_view;
};

/**
 * Tween transition
 * @param {type} position
 * @param {type} look
 */
Game.prototype.cameraTransition = function (position, look) {

    this.sound_manager.sound_effects["long_swoosh"].stop();
    this.sound_manager.sound_effects["long_swoosh"].play();
    
    switch (this.current_camera_state){
        case this.camera_states.DEFAULT: 
                var that = this;
            new TWEEN.Tween(that.current_camera.position).to({
            x: position.x,
            y: position.y,
            z: position.z}, 2000)
                .easing(TWEEN.Easing.Quadratic.Out)
                .onComplete(function () {
                    that.current_camera.position.x = that.player.position.x;
                })
                .start();
            break;
        case this.camera_states.GREETING:
                var that = this;
             new TWEEN.Tween(that.current_camera.position).to({
            x: position.x,
            y: position.y,
            z: position.z}, 5000)
                .easing(TWEEN.Easing.Quadratic.Out)
                .onUpdate(function () {
                    that.current_camera.lookAt(look);
                })
                .onComplete(function () {
                    that.current_camera_state = that.camera_states.DEFAULT;
                })
                .start();
            break;
        default :
                var that = this;
            new TWEEN.Tween(that.current_camera.position).to({
            x: position.x,
            y: position.y,
            z: position.z}, 3000)
                .easing(TWEEN.Easing.Quadratic.Out)
                .onUpdate(function () {
                    that.current_camera.lookAt(look);
                })
                .start();
            break;
    }
};

/**
 * Game animation
 * 
 */
Game.prototype.animate = function () {
    TWEEN.update();
    this.pp_manager.render();
    this.current_environment.animate();
    this._handleKeyEvents();

    if (this.current_state === this.states.PLAYING) {
        this.player.moveBullets();
        this.current_level.army.animate();
        this.current_level.defense.move();
        if (this.player.lives === 0) {
            this.current_state = this.states.OVER;
        }

    }

    if (this.current_state === this.states.OVER) {
        this._computeTransition("over");
    }

    if (this.current_state === this.states.INITIALIZING) {
        this.current_difficulty++;
        if(this.player.lives < 3){
            this.player.lives ++;
            this.displayLives();
        }
        this.sound_manager.sound_effects["positive_effect"].play();
        document.getElementById("level").innerHTML = this.current_difficulty;
        this._computeTransition("level");
        this.current_level.clear();
//        this.current_environment.clearGround();
//        this.current_environment.init();
        this.current_level = new Level(game.current_difficulty, this.player, this);
        this.current_level.init();
        this.add(this.current_level);
        this.current_state = this.states.PAUSED;
    }

    if (this.camera_control) {
        this.camera_control.update();
        this.rendererStats.update(renderer);
    }
};

/**
 * Manage keyboard event
 */
Game.prototype._handleKeyEvents = function () {
    if (this.keyboard.pressed("enter") && this.current_state === this.states.GREETING) {
        this.cameraTransition(this.cameras_views['default'][0], this.cameras_views['default'][1]);
        this._computeTransition("level");
        this.sound_manager.musics["stay"].fadeOut(10000);
        this.sound_manager.musics["veridis_quo"].loop().play().fadeIn(50000).fadeOut(50000);
        this.showInfos();
    }
    
    if (this.keyboard.pressed("enter") && this.current_state === this.states.OVER) {
        this.current_difficulty = -1;
        this.player.score = 0;
        this.player.lives = 3;
        this._init_HTML();
        this.current_state = this.states.INITIALIZING;
    }

    if (this.keyboard.pressed("left") && this.current_state === this.states.PLAYING) {
        var dir = [-1, 0, 0];
        if (this.player.position.x + this.player.height * 2 > min_width) {
            this.player.move(dir);
            if (this.current_camera_state === this.camera_states.PLAYER) {
                this.cameraMove(dir);
            }
        }
        this.update_player_view();
    }

    if (this.keyboard.pressed("right") && this.current_state === this.states.PLAYING) {
        var dir = [1, 0, 0];
        if (this.player.position.x + (this.player.height) * 2 < max_width) {
            this.player.move(dir);
            if (this.current_camera_state === this.camera_states.PLAYER) {
                this.cameraMove(dir);
            }
        }
        this.update_player_view();
    }

    if (this.keyboard.pressed("space") && this.current_state === this.states.PLAYING) {
        this.player.fire();
    }

    if (this.keyboard.pressed("k") && this.current_state === this.states.PLAYING) {
        this.current_level.clear();
    }
};

/**
 * Display a dialog in order to do a transition
 * @param {type} type
 */
Game.prototype._computeTransition = function (type) {
    switch (type) {
        case "level" :
            var level = "Level " + this.current_difficulty;
            (this.current_difficulty === 1) ? this._create_dialog(level,"", 5000) : this._create_dialog("Stage Clear <br>" + level,"", 5000);
            break;
        case "over" :
            this._create_dialog("Game Over","Press Enter to try Again", 0);
            break;
    }
};

/**
 * DIsplay a dialong in HTML
 * @param {type} text
 * @param {type} color
 * @param {type} duration
 */
Game.prototype._create_dialog = function (text,description, duration) {
    document.getElementById("vertical-center").style.background = 'rgba(0,191,255,0.3)';
    document.getElementById("main-title").innerHTML = text;
    document.getElementById("description").innerHTML = description;
    
    document.getElementById("dialog").style.visibility = "visible";
    document.getElementById("vertical-center").style.visibility = "visible";
    document.getElementById("main-title").style.visibility = "visible";
    document.getElementById("description").style.visibility = "visible";
    var that = this;
    if (duration > 0) {
        setTimeout(function () {
        document.getElementById("dialog").style.visibility = "hidden";
        document.getElementById("vertical-center").style.visibility = "hidden";
        document.getElementById("main-title").style.visibility = "hidden";
        document.getElementById("description").style.visibility = "hidden";
            that.current_state = that.states.PLAYING;
        }, duration);
    }
};

Game.prototype.debug = function () {
    this.camera_control = new THREE.OrbitControls(this.current_camera);

    this.add(buildAxes(1000));

    this.rendererStats = new THREEx.RendererStats();
    this.rendererStats.domElement.style.position = 'absolute';
    this.rendererStats.domElement.style.left = '0px';
    this.rendererStats.domElement.style.bottom = '0px';
    document.body.appendChild(this.rendererStats.domElement);

};


Game.prototype.displayLogo = function (text,description) {
    document.getElementById("dialog").style.visibility = "visible";
    document.getElementById("vertical-center").style.visibility = "visible";
    document.getElementById("vertical-center").style.background = 'transparent';
    document.getElementById("main-title").innerHTML = text;
     document.getElementById("description").innerHTML = description;
};


Game.prototype.displayScore = function (){
    document.getElementById("score").innerHTML = this.player.score;
};

Game.prototype.displayLevel = function (){
    document.getElementById("level").innerHTML = this.current_difficulty;
};

Game.prototype.displayLives = function (){
     document.getElementById("life").innerHTML = "";
    for (var i = 0; i < this.player.lives; i++) {
        document.getElementById("life").innerHTML += "<i class=\"fa fa-space-shuttle\"></i>";
    }
};

Game.prototype.displayKillable = function (){
    document.getElementById("killable").innerHTML = (this.player.killable)?"<i class=\"fa fa-times\"></i>":"<i class=\"fa fa-check\"></i>";
};

Game.prototype.hideInfos = function (){
     document.getElementById("info").style.visibility = "hidden";
};

Game.prototype.showInfos = function (){
     document.getElementById("info").style.visibility = "visible";
}