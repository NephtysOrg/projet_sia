function Game() {
    THREE.Scene.call(this);
    this.player;
    // Cameras
    this.current_camera;
    this.cameras_views = Array();
    this.camera_states = {GREETING: "greeting", DEFAULT: "default", OLD: "old", FUNNY: "funny", PLAYER: "player"};
    this.current_camera_state;
    this.camera_light;
        
    this.current_difficulty;
    this.current_level;
    this.current_environment = new Environement();
    this.keyboard = new THREEx.KeyboardState();

    this.states = {STARTING: "starting", PAUSED: "paused", PLAYING: "playing", INITIALIZING: "initializing"};
    this.information_group = new THREE.Group();
    this.information = new Array();
    this.current_state = this.states.STARTING;
    
    // debug 
    this.camera_control;
    this.rendererStats;

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
            console.log("camera transitions...");
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
    this._init_camera();
    this._init_HTML();
    this._initInformation();
    THREEx.WindowResize.bind(renderer, this.current_camera);
    this._computeTransition("level");
};

Game.prototype._initInformation = function () {
    var material;
    var text3d;
    var mesh;
    var size = 30;
    var font_param = {size: size, height: 15, curveSegments: 1, font: "helvetiker", weight: "bold"};
    // SCORE String
    text3d = new THREE.TextGeometry("SCORE ", font_param);
    text3d.computeBoundingBox();
    material = new THREE.MeshPhongMaterial({color: 0xffffff});
    mesh = new THREE.Mesh(text3d, material);
    mesh.position.set(min_height, max_height + margin, margin);
    mesh.rotation.x += 90 * Math.PI / 180;
    this.information_group.add(mesh);


    // SCORE Value
    text3d = new THREE.TextGeometry(this.player.score, font_param);
    text3d.computeBoundingBox();
    material = new THREE.MeshPhongMaterial({color: 0x5555ff});
    mesh = new THREE.Mesh(text3d, material);
    mesh.position.set(min_height + 150, max_height + margin, margin);
    mesh.rotation.x += 90 * Math.PI / 180;
    this.information_group.add(mesh);
    this.information["score"] = mesh;

    // LEVEL String
    text3d = new THREE.TextGeometry("LEVEL ", font_param);
    text3d.computeBoundingBox();
    material = new THREE.MeshPhongMaterial({color: 0xffffff});
    mesh = new THREE.Mesh(text3d, material);
    mesh.position.set(max_width, max_height + margin, margin);
    mesh.rotation.x += 90 * Math.PI / 180;
    this.information_group.add(mesh);


    // LEVEL Value
    text3d = new THREE.TextGeometry(this.current_difficulty, font_param);
    text3d.computeBoundingBox();
    material = new THREE.MeshPhongMaterial({color: 0xff5555});
    mesh = new THREE.Mesh(text3d, material);
    mesh.position.set(max_width + 125, max_height + margin, margin);
    mesh.rotation.x += 90 * Math.PI / 180;
    this.information_group.add(mesh);
    this.information["level"] = mesh;

    this.add(this.information_group);
};

Game.prototype._init_HTML = function () {
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
    this.cameras_views["greeting"] = one_view;

    //// Default view ///////////////
    cam_pos = new THREE.Vector3(0, min_height * 2, 100);
    cam_look = new THREE.Vector3(0, 1, 0);
    one_view = new Array();
    one_view.push(cam_pos);
    one_view.push(cam_look);
    this.cameras_views["default"] = one_view;
    
    //// player view ///////////////
    var aux_pos = new THREE.Vector3(this.player.position.x,this.player.position.y,this.player.position.z);
    //handling aux position
    aux_pos.x -= this.player.height;
    aux_pos.y -= this.player.height;
    aux_pos.z += this.player.height;
    ////////////////////////
    cam_pos = new THREE.Vector3(aux_pos.x,aux_pos.y,aux_pos.z);  
    cam_look = this.player.direction;
    one_view = new Array();
    one_view.push(cam_pos);
    one_view.push(cam_look);
    this.cameras_views["player"] = one_view;

    /// old view //////////////
    cam_pos = new THREE.Vector3(0,min_height * 2 - 200, 1000);
    cam_look = new THREE.Vector3(0, -1, -1);
    one_view = new Array();
    one_view.push(cam_pos);
    one_view.push(cam_look);
    this.cameras_views["old"] = one_view;

    /// funny view ////////////////
    cam_pos = new THREE.Vector3(max_width * 2,700 , 500);
    cam_look = new THREE.Vector3(-1, 0, 0);
    one_view = new Array();
    one_view.push(cam_pos);
    one_view.push(cam_look);
    this.cameras_views["funny"] = one_view;
};

Game.prototype._init_camera = function() {
    //Init cameras views
    this._init_cameras_views();

    //set the camera to default view
    var defview = this.cameras_views["default"];
    this.current_camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 10000);
    this.current_camera.position.set(defview[0].x, defview[0].y, defview[0].z);
    this.current_camera.lookAt(defview[1]);
    this.add(this.current_camera);
    this.current_camera_state = this.camera_states.DEFAULT;
    
    // Light the cam 
    this.camera_light =  new THREE.SpotLight( 0xffffff, 0.1 );
    this.camera_light.castShadow = true;
    this.camera_light.shadowCameraVisible = true;
    this.camera_light.angle = Math.PI/8;
    this.current_camera.add( this.camera_light );
};

Game.prototype.cameraMove = function(direction){
    console.log("-> game.cameraMove()");
    this.current_camera.position.x += (direction[0] * this.player.speed);
    this.current_camera.position.y += (direction[1] * this.player.speed);
    this.current_camera.position.z += (direction[2] * this.player.speed);
    console.log("<- game.cameraMove()");
}

Game.prototype.cameraManagement = function() {
    if (this.current_camera_state === this.camera_states.DEFAULT) {
        console.log("default position -> player position");
        this.cameraTransition(this.cameras_views["player"][0], this.cameras_views["player"][1]);
        this.current_camera_state = this.camera_states.PLAYER;
    }else
    
    if(this.current_camera_state === this.camera_states.PLAYER){
        console.log("player position -> old position");
        this.cameraTransition(this.cameras_views["old"][0],this.cameras_views["old"][1]);
        this.current_camera_state = this.camera_states.OLD;
    }else

    if (this.current_camera_state === this.camera_states.OLD) {
        console.log("old position -> funny position");
        this.cameraTransition(this.cameras_views["funny"][0], this.cameras_views["funny"][1]);
        this.current_camera_state = this.camera_states.FUNNY;
    }else
    
    if(this.current_camera_state === this.camera_states.FUNNY){
        console.log("funny position -> default position");
        this.cameraTransition(this.cameras_views["default"][0],this.cameras_views["default"][1]);
        this.current_camera_state = this.camera_states.DEFAULT;
    } 
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
    
    this.cameras_views["player"]= one_view;
};

Game.prototype.cameraTransition = function(position, look) {
    var that = this;
    if(this.current_camera_state === this.camera_states.DEFAULT){
     new TWEEN.Tween(that.current_camera.position).to({
            x: position.x,
            y: position.y,
            z: position.z}, 2000)
            .easing(TWEEN.Easing.Linear.None)
            .onComplete(function(){
                that.current_camera.position.x = that.player.position.x;
            })
            .start();
    }else{
        new TWEEN.Tween(that.current_camera.position).to({
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

Game.prototype.animate = function () {
    TWEEN.update();
    this.camera_light.position.copy(this.current_camera.position);
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
        this.information_group.remove(this.information["level"]);
        var text3d = new THREE.TextGeometry(this.current_difficulty, {size: 30, height: 15, curveSegments: 1, font: "helvetiker", weight: "bold"});
        text3d.computeBoundingBox();
        var material = new THREE.MeshPhongMaterial({color: 0xff5555});
        var mesh = new THREE.Mesh(text3d, material);
        mesh.position.set(max_width + 125, max_height + margin, margin);
        mesh.rotation.x += 90 * Math.PI / 180;
        this.information_group.add(mesh);
        this.information["level"] = mesh;
        this.current_level.clear();
        this.current_environment.clearGround();
        this.current_environment.init();
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

Game.prototype._handleKeyEvents = function () {
 if (this.keyboard.pressed("left")) {
        var dir = [-1, 0, 0];
        if (this.player.position.x + this.player.height * 2 > min_width){
            this.player.move(dir);
            if(this.current_camera_state === this.camera_states.PLAYER){
                    this.cameraMove(dir);          
            }
        }
         this.update_player_view();
    }
    
    if (this.keyboard.pressed("right")) {
        var dir = [1, 0, 0];
        if (this.player.position.x + (this.player.height) * 2 < max_width){
            this.player.move(dir);
            if(this.current_camera_state === this.camera_states.PLAYER){
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

Game.prototype._computeTransition = function (type) {
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
    
    this.rendererStats   = new THREEx.RendererStats();
    this.rendererStats.domElement.style.position = 'absolute';
    this.rendererStats.domElement.style.left = '0px';
    this.rendererStats.domElement.style.bottom   = '0px';
    document.body.appendChild( this.rendererStats.domElement );

};
