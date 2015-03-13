function Game (){
    THREE.Scene.call(this);
    this.player;
    this.cameras = Array();
    this.current_camera;
    this.current_difficulty;
    this.current_level;
    this.current_environment;
    this.keyboard = new THREEx.KeyboardState();
};

// Create a Army.prototype object that inherits from Group.prototype
Game.prototype = Object.create(THREE.Scene.prototype);
// Set the "constructor" property to refer to Army
Game.prototype.constructor = Game;

Game.prototype.init=function(){
    this.current_difficulty = 1;
    this.player = new Player(player_data, 3,10,this);
    this.player.position.y = min_height + this.player.height;
    this.add(this.player);
    this.current_level = new Level(this.current_difficulty, this.player,this);
    this.current_level.init();
    this.add(this.current_level);

    this._init_cameras();
    this._init_HTML();
        THREEx.WindowResize.bind(renderer, this.current_camera);
};

Game.prototype._init_HTML = function(){
    document.getElementById("score").innerHTML = this.player.score;
    document.getElementById("level").innerHTML = this.current_difficulty;
    document.getElementById("life").innerHTML = this.player.lives;
    document.getElementById("killable").innerHTML = this.player.killable;
};

Game.prototype._init_cameras = function(){
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

Game.prototype.animate = function(){
    this._handleKeyEvents();
    this.player.moveBullets();
    if ( this.current_level.army.operationnal) {
        this.current_level.army.animate();
        this.current_level.defense.move();
    }
    else {
        this.current_difficulty++;
        document.getElementById("level").innerHTML = game.current_difficulty;
        this.current_level.clear();
        this._computeTransition("level");
        this.current_level = new Level(game.current_difficulty, this.player);
        this.current_level.init();
        this.add(this.current_level);
    }
};

Game.prototype._handleKeyEvents = function () {
    if (this.player.lives === 0) {
        stop();
    }
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
        this.current_level.army.killAll();
    }
};

Game.prototype._computeTransition = function(type){
    switch (type){
        case "level" : 
            console.log("changing level");
            break;
        case "end" :
            this.player.explode();
            break;
    }
};