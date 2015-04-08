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
    this.bullets_light = new Array();
    this.batallion = batallion;
    this.direction = new THREE.Vector3(0, -1, 0); //pointing to -y (Alien direction)
    this.can_fire = true;
    this.engage = false;
    
    Structure3d.call(this, alien_data);
            for(var i = 0 ; i < this.children.length; i++){
        this.children[i].material.color.setHex(0xFF0000);
    }
    this.position.z += 15;
    this.rotation.z += -90 * Math.PI / 180;
    this.rotation.x += 90 * Math.PI / 180;
    this.scale.set(4, 4, 4);
    
     // Light 
    for(var i = 0; i < 3 ; i++){
        var tmp_bullet = new THREE.PointLight(0xff2222);
        tmp_bullet.intensity = 0;
        tmp_bullet.visible = false;
        tmp_bullet.distance = 60;
        this.bullets_light.push(tmp_bullet);
        game.add(tmp_bullet);
    }
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

Alien.prototype.getLightAvaliable = function (){
    for(var i = 0; i < this.bullets_light.length; i++){
        if (this.bullets_light[i].intensity === 0){
            return this.bullets_light[i];
        }
    }
};

Alien.prototype.fire = function () {
    if(this.engage){
        if (this.can_fire) {
            console.log("-> alien.fire()");
            this.can_fire = false;
            var tmp_bullet = new Bullet(bullet_data, 5+this.strength,0xff0000,this.getLightAvaliable(), this);
            tmp_bullet.position.set(this.position.x + (this.height), this.position.y - this.width, 0);

            game.add(tmp_bullet);
            this.bullets.push(tmp_bullet);
            var that = this;    //setTimeOut use the global scope so the keyword this need to be changed
            setTimeout(function () {
                that.can_fire = true;
            }, (Math.floor((Math.random() * 10000) - this.strength*this.strength)));
            console.log("<- alien.fire()");
        }
    }else{
        var that = this;    //setTimeOut use the global scope so the keyword this need to be changed
            setTimeout(function () {
               that.engage = true;
            },  Math.sqrt(that.strength) * (Math.floor((Math.random() * 100000) + 1)));
    }
};

Alien.prototype.destroyBullet = function (bullet) {
    var i = this.bullets.indexOf(bullet);
    console.log(this.bullets_lights);
    if (i > -1) {
        if(this.bullets[i].light !== undefined){
            this.bullets[i].light.visible = false;
            this.bullets[i].light.intensity = 0;
        }
        game.remove(this.bullets[i]);
        this.bullets.splice(i, 1);
        
    }
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