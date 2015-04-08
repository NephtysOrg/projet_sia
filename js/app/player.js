/**
 * This class define a Player Object
 * @param {type} player_data
 * @param {type} lives
 * @returns {Player}
 */
function Player(player_data, lives, speed, game) {

    Structure3d.call(this, player_data);
    this.lives = lives;
    this.speed = speed;
    this.game = game;
    this.bullets = new Array();
    this.bullets_light = new Array();
    this.direction = new THREE.Vector3(0, 1, 0);
    this.score = 0;
    this.can_fire = true;
    this.killable = true;
    
    for(var i = 0 ; i < this.children.length; i++){
        this.children[i].material.color.setHex(0x00BFFF);
    }

    this.scale.set(4, 4, 4);
    this.rotation.z = -180 * Math.PI / 180;
    this.spotlight = new THREE.SpotLight(0xffffff);
    this.spotlight.angle = Math.PI / 10;
    this.spotlight.position.set(this.position.x, this.position.y + this.width, this.position.z);
    this.spotlight.shadowDarkness = 0.95;
    this.spotlight.intensity = .5;
    this.spotlight.target = this;
    // must enable shadow casting ability for the light
    this.spotlight.castShadow = true;
    this.add(this.spotlight);
    

    
    // Light 
    for(var i = 0; i < 4 ; i++){
        var tmp_bullet = new THREE.PointLight(0x00BFFF);
        tmp_bullet.intensity = 0;
        tmp_bullet.visible = false;
        tmp_bullet.distance = 60;
        this.bullets_light.push(tmp_bullet);
        game.add(tmp_bullet);
    }

    // Keyboard :  change state of player. 
    var wasPressed = {};
    var that = this;
    that.game.keyboard.domElement.addEventListener('keydown', function (event) {
        if (that.game.keyboard.eventMatches(event, 'i') && !wasPressed['i']) {
            wasPressed['i'] = true;
            that.killable = !that.killable;
            document.getElementById("killable").innerHTML = that.killable;

        }
    });
    // listen on keyup to maintain ```wasPressed``` array
    that.game.keyboard.domElement.addEventListener('keyup', function (event) {
        if (that.game.keyboard.eventMatches(event, 'i')) {
            wasPressed['i'] = false;
        }
    });
}
;

// Create a Player.prototype object that inherits from Structure3d.prototype
Player.prototype = Object.create(Structure3d.prototype);
// Set the "constructor" property to refer to Player
Player.prototype.constructor = Player;

Player.prototype.getLightAvaliable = function (){
    for(var i = 0; i < this.bullets_light.length; i++){
        if (this.bullets_light[i].intensity === 0){
            return this.bullets_light[i];
        }
    }
};

Player.prototype.fire = function () {
    if (this.can_fire) {
        console.log("-> player.fire()");
        this.spotlight.intensity = .7;
        this.can_fire = false;

        // fire a bullet
        var tmp_bullet = new Bullet(bullet_data, 15, 0x00BFFF,this.getLightAvaliable(), this);
        tmp_bullet.position.set(this.position.x - this.height, this.position.y, this.position.z);
        tmp_bullet.rotation.z += 90 * Math.PI / 180;
        this.game.add(tmp_bullet);
        this.bullets.push(tmp_bullet);

        var that = this;    //setTimeOut use the global scope so the keyword this need to be changed
        setTimeout(function () {
            that.spotlight.intensity = .5;
        }, 100);
        setTimeout(function () {

            that.can_fire = true;
        }, 500);

        console.log("<- player.fire()");
    }
};


Player.prototype.move = function (direction) {
    console.log("-> player.move()");
    this.position.x += (direction[0] * this.speed);
    this.position.y += (direction[1] * this.speed);
    this.position.z += (direction[2] * this.speed);
    console.log("-> player.move()");

};

Player.prototype.destroyBullet = function (bullet) {
    var i = this.bullets.indexOf(bullet);
    if (i > -1) {
        if(this.bullets[i].light !== undefined){
            this.bullets[i].light.visible = false;
            this.bullets[i].light.intensity = 0;
        }
        this.game.remove(this.bullets[i]);
        this.bullets.splice(i, 1);
        
    }
};

Player.prototype.moveBullets = function () {
    for (var i = 0; i < this.bullets.length; i++) {
        this.bullets[i].move(this.direction);
    }
};

Player.prototype.clearBullets = function () {
    while (this.bullets.length > 0) {
        this.destroyBullet(this.bullets[this.bullets.length - 1]);
    }
};


