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
   this.direction;
   this.raycaster = new THREE.Raycaster();
   Structure3d.call(this,bullet_data);
};

// Create a Bullet.prototype object that inherits from Group.prototype
Bullet.prototype = Object.create(Structure3d.prototype);
// Set the "constructor" property to refer to Bullet
Bullet.prototype.constructor = Bullet;

Bullet.prototype.move = function(direction) {
        console.log("-> bullet.move()");
        this.direction = direction;
        this.translateX(direction[0]*this.speed);
        this.translateY(direction[1]*this.speed);
        this.translateZ(direction[2]*this.speed);
        this.collide();
        console.log("<- bullet.move()");

};

Bullet.prototype.collide = function (){
    // Just for the f*** raycaster who only accpet vectors
    var vector_direction = new THREE.Vector3(this.direction[0],this.direction[1],this.direction[2]);
//    console.log("bullet pos : "+this.position.y +"bullet dir : "+this.direction);
//    console.log(scene.children);
    this.raycaster.set(this.position,vector_direction);
    	// calculate objects intersecting the picking ray
	var intersects = this.raycaster.intersectObjects( army ,true);
        console.log(intersects);
}