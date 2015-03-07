/**
 * 
 * @param {type} bullet_data
 * @param {type} speed
 * @param {type} owner
 * @returns {Bullet}
 */
function Bullet(bullet_data, speed, owner) {
    this.speed = speed;
    this.owner = owner;
    this.direction;
    this.raycaster = new THREE.Raycaster(); // Vertical
    Structure3d.call(this, bullet_data);
}
;

// Create a Bullet.prototype object that inherits from Group.prototype
Bullet.prototype = Object.create(Structure3d.prototype);
// Set the "constructor" property to refer to Bullet
Bullet.prototype.constructor = Bullet;

Bullet.prototype.move = function (direction) {
    //console.log("-> bullet.move()");
    this.direction = direction;
    if (this.position.y >= max_height || this.position.y <= min_height) {
        console.log("removing");
        this.owner.destroyBullet(this);
    }
    this.translateX(direction[0] * this.speed);
    this.translateY(direction[1] * this.speed);
    this.translateZ(direction[2] * this.speed);
    this.collide();
    //console.log("<- bullet.move()");

};

Bullet.prototype.collide = function () {
    // Just for the f*** raycaster who only accpet vectors
    var vector_direction = new THREE.Vector3(this.direction[0], this.direction[1], this.direction[2]);
    this.raycaster.set(this.position, vector_direction);
    // calculate objects intersecting the picking ray
    var intersects = this.raycaster.intersectObjects(scene.children, true);
    
    if (intersects.length > 0) {
        var intersect = intersects[0].object.parent;
        
        if (intersect instanceof Alien && intersects[0].distance <= 5 && this.owner instanceof Player) {
            console.log('Player killed alien');
            level.army.destroyAlien(intersect);
            this.owner.score += intersect.score_value;
            this.owner.destroyBullet(this);
        }
        if (intersect instanceof Bullet && intersects[0].distance <= 5) {
            console.log('bullet killed bullet');
            intersect.owner.destroyBullet(intersect);
            this.owner.destroyBullet(this);
        }
        
        if (intersect instanceof Player && intersects[0].distance <= 5 && this.owner instanceof Alien) 	{
            console.log('Alien killed player');
            this.owner.lives--;
            this.owner.destroyBullet(this);
        }
        
        if (intersect instanceof Bunker && intersects[0].distance <= 5 ){
            console.log('Bunker touched by a bullet');
            console.log(intersect[0].object);
            intersect.autoDestruction(); 
            //intersect.autoDestruction();
            this.owner.destroyBullet(this);
        }
                 
    }
};
