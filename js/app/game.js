function Game() {
    THREE.Scene.call(this);
    this.player;
    this.cameras = Array();
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

Game.prototype._init_cameras = function () {
    var camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(0, 0, 1500);
    this.add(camera);
    this.cameras.push(camera);

    camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(0, 0, 1500);
    this.add(camera);
    this.cameras.push(camera);
    this.current_camera = this.cameras[0];
};

Game.prototype.animate = function () {
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
        document.getElementById("level").innerHTML = game.current_difficulty;
        this.current_level.clear();
        this.current_environment.clearGround();
        this.current_environment.init();
        this._computeTransition("level");
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

Game.prototype.debug = function () {
    this.camera_control = new THREE.OrbitControls(this.current_camera);
    
    this.add(buildAxes(1000));
};
