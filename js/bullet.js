function Bullet(bullet_data,speed,owner){
   this.speed = speed;
   this.owner = owner;
   
   Structure3d.call(this,bullet_data);
};

// Create a Structure3d.prototype object that inherits from Group.prototype
Bullet.prototype = Object.create(THREE.Group.prototype);
// Set the "constructor" property to refer to Bullet
Bullet.prototype.constructor = Bullet;

Bullet.prototype.move = function(direction) {
    // Think to a clock...
        this.translateX(direction[0]*this.speed);
        this.translateY(direction[1]*this.speed);
        this.translateZ(direction[2]*this.speed);

};