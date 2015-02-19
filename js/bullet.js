/**
 * 
 * @param {type} bullet_data
 * @param {type} speed
 * @param {type} owner
 * @returns {Bullet}
 */
function Bullet(bullet_data,speed,owner){
   this.speed = speed;
   this.owner = owner;
   
   Structure3d.call(this,bullet_data);
   scene.add(this);
};

// Create a Structure3d.prototype object that inherits from Group.prototype
Bullet.prototype = Object.create(THREE.Group.prototype);
// Set the "constructor" property to refer to Bullet
Bullet.prototype.constructor = Bullet;

Bullet.prototype.move = function(direction) {
        console.log("-> bullet.move()");
        this.translateX(direction[0]*this.speed);
        this.translateY(direction[1]*this.speed);
        this.translateZ(direction[2]*this.speed);
        console.log("<- bullet.move()");

};