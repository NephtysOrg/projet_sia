/**
 * 
 * @param {type} alien_data
 * @param {type} speed
 * @param {type} score_value
 * @returns {Alien}
 */
function Alien(alien_data, speed, score_value, strength, batallion) {
    this.speed = speed;
    this.strength = strength;
    this.score_value = score_value;
    this.bullets = new Array();
    this.batallion = batallion;
    this.direction = [0, -1, 0]; //pointing to -y (Alien direction)
    this.can_fire = true;
    this.engage = false;
    
    Structure3d.call(this, alien_data);
    this.rotation.z += -90 * Math.PI / 180;
    this.scale.set(4, 4, 4);
}
;

// Create a Structure3d.prototype object that inherits from Structure3d.prototype
Alien.prototype = Object.create(Structure3d.prototype);
// Set the "constructor" property to refer to Bullet
Alien.prototype.constructor = Alien;

Alien.prototype.move = function (direction) {
    //console.log("-> Alien.move()");
    this.position.x += (direction[0] * this.speed);
    this.position.y += (direction[1] * this.speed);
    this.position.z += (direction[2] * this.speed);
    //console.log("<- Alien.move()");

};

Alien.prototype.fire = function () {
    if(this.engage){
        if (this.can_fire) {
            console.log("-> alien.fire()");
            this.can_fire = false;
            var tmp_bullet = new Bullet(bullet_data, this.strength * 8 / 2, this);
            tmp_bullet.position.set(this.position.x + (this.height), this.position.y - this.width, this.position.z);
            game.add(tmp_bullet);
            this.bullets.push(tmp_bullet);
            var that = this;    //setTimeOut use the global scope so the keyword this need to be changed
            setTimeout(function () {
                that.can_fire = true;
            }, 300 / that.strength * (Math.floor((Math.random() * 100) + 1)));

            console.log("<- alien.fire()");
        }
    }else{
        var that = this;    //setTimeOut use the global scope so the keyword this need to be changed
            setTimeout(function () {
               that.engage = true;
            }, 1000 / that.strength * (Math.floor((Math.random() * 100) + 1)));
    }
};

Alien.prototype.destroyBullet = function (bullet) {
    var i = this.bullets.indexOf(bullet);
    game.remove(this.bullets[i]);
    this.bullets.splice(i, 1);
};

Alien.prototype.moveBullets = function () {
    for (var i = 0; i < this.bullets.length; i++) {
        this.bullets[i].move(this.direction);
        if (this.bullets[i] && this.bullets[i].position.y <= min_height - margin) {
            this.destroyBullet(this.bullets[i]);
        }
    }
};


Alien.prototype.printPosition = function () {
    console.log(this.position);
};
