/**
 * Alien class that provide an enemy.
 * @param {type} alien_data
 * @param {type} speed
 * @param {type} score_value
 * @param {type} strength
 * @param {type} batallion
 * @param {type} color
 * @returns {Alien}
 */
function Alien(alien_data, speed, score_value, strength, batallion) {
    Structure3d.call(this, alien_data);

    this.speed = speed;                             // Speed Movement
    this.strength = strength;                       // Used to compute fire speed
    this.score_value = score_value;                 // Point to the player when killed
    this.bullets = new Array();                     // Bullet Storage
    this.bullets_light = new Array();               // Bullet light
    this.batallion = batallion;                     // Alien's batallion
    this.direction = new THREE.Vector3(0, -1, 0);   //pointing to -y (Alien direction)
    this.can_fire = true;                           // Shot Cadence
    this.engage = false;                            // 1rst shot delay


 
    // Positioning alien
    this.position.z += 15;
    this.rotation.z += -90 * Math.PI / 180;
    this.rotation.x += 90 * Math.PI / 180
    this.scale.set(4, 4, 4);

    // Light 
    for (var i = 0; i < 3; i++) {
        var tmp_bullet = new THREE.PointLight(0xff2222);
        tmp_bullet.intensity = 0;
        tmp_bullet.visible = false;
        tmp_bullet.distance = 60;
        this.bullets_light.push(tmp_bullet);
        game.add(tmp_bullet);
    }
};

Alien.prototype = Object.create(Structure3d.prototype);
Alien.prototype.constructor = Alien;

/**
 * 
 * @param {type} color
 * @returns {undefined}
 */
Alien.prototype.setColor = function (color){
    // Set Alien's Color
    for (var i = 0; i < this.children.length; i++) {
        //this.children[i].material.color.setHex(0x00FF00); 
        this.children[i].material.color.setHex(color);
    }
};


/**
 *  Alien movement management
 * @param {type} direction
 */
Alien.prototype.move = function (direction) {
    this.position.x += (direction[0] * this.speed);
    this.position.y += (direction[1] * this.speed);
    this.position.z += (direction[2] * this.speed);
};




/**
 * In order to illuminate a bullet, we select a non used light.
 * @returns {Light}
 */
Alien.prototype.getLightAvaliable = function () {
    for (var i = 0; i < this.bullets_light.length; i++) {
        if (this.bullets_light[i].intensity === 0) {
            return this.bullets_light[i];
        }
    }
};

/**
 *  Fire a bullet
 */
Alien.prototype.fire = function () {
    if (this.engage) {
        if (this.can_fire) {
            this.can_fire = false;
            var tmp_bullet = new Bullet(bullet_data, 5 + this.strength, 0xff0000, this.getLightAvaliable(), this);
            tmp_bullet.position.set(this.position.x + (this.height), this.position.y - this.width, 0);
            game.add(tmp_bullet);
            this.bullets.push(tmp_bullet);
            var that = this;
            setTimeout(function () {
                that.can_fire = true;
            }, (Math.floor((Math.random() * 10000) - this.strength * this.strength)));
        }
    } else {
        var that = this;
        setTimeout(function () {
            that.engage = true;
        }, Math.sqrt(that.strength) * (Math.floor((Math.random() * 100000) + 1)));
    }
};

/**
 *  Delete a bullet and her light
 * @param {type} bullet
 */
Alien.prototype.destroyBullet = function (bullet) {
    var i = this.bullets.indexOf(bullet);
    if (i > -1) {
        if (this.bullets[i].light !== undefined) {
            this.bullets[i].light.visible = false;
            this.bullets[i].light.intensity = 0;
        }
        game.remove(this.bullets[i]);
        this.bullets.splice(i, 1);

    }
};

/**
 * Move a bullet, collision are handled in the Bullet class
 */
Alien.prototype.moveBullets = function () {
    for (var i = 0; i < this.bullets.length; i++) {
        this.bullets[i].move(this.direction);
    }
};

Alien.prototype.getPointCanvas = function () {
    var message = "+" + this.score_value;
    var parameters = {fontsize: 46, fontface: "arcade_game"}
    
    if (parameters === undefined)
        parameters = {};

    var fontface = parameters.hasOwnProperty("fontface") ?
            parameters["fontface"] : "Arial";

    var fontsize = parameters.hasOwnProperty("fontsize") ?
            parameters["fontsize"] : 18;

    var borderThickness = parameters.hasOwnProperty("borderThickness") ?
            parameters["borderThickness"] : 4;

    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    context.font = "Bold " + fontsize + "px " + fontface;

    // text color
    context.fillStyle = "#ffffff";

    context.fillText(message, borderThickness, fontsize + borderThickness);

    // canvas contents will be used for a texture
    var texture = new THREE.Texture(canvas)
    texture.needsUpdate = true;

    var spriteMaterial = new THREE.SpriteMaterial(
            {map: texture, useScreenCoordinates: false});
    var sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(100, 50, 1.0);
    sprite.position.copy(this.position);
    
    
    var target_position = new THREE.Vector3(sprite.position.x, sprite.position.y, sprite.position.z+50);
   game.add( sprite );
            new TWEEN.Tween(sprite.position).to({
            x: target_position.x,
            y: target_position.y,
            z: target_position.z}, 1000)
                .easing(TWEEN.Easing.Quadratic.Out)
                .onComplete(function () {
                    game.remove(sprite);
                })
                .start();
    return sprite;
};

