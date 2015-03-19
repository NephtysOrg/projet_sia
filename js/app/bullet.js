/**
 * @param {type} bullet_data
 * @param {type} speed
 * @param {type} owner
 * @returns {Bullet}
 */
define(['app/structure3d',
        'app/alien',
        'app/bullet',
        'app/player',
        'app/bunker',
        'three'], function(Structure3d,Alien,Bullet,Player,Bunker,THREE){
console.log("scripts loaded for structure3d.js");
function Bullet(bullet_data, speed, owner) {
    this.speed = speed;
    this.owner = owner;
    this.direction;
    this.raycaster = new THREE.Raycaster(); // Vertical
    Structure3d.call(this, bullet_data);
};

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
    var ray_pos = new THREE.Vector3(this.position.x+(this.width/2),this.position.y,this.position.z);
    this.raycaster.set(ray_pos, vector_direction);
    // calculate objects intersecting the picking ray
    var intersects = this.raycaster.intersectObjects(game.children, true);
    
    if (intersects.length > 0) {
        var intersect = intersects[0].object.parent;
        
        if (typeof Intersect === Alien && intersects[0].distance <= 5 && this.owner instanceof Player) {
            console.log('Player killed alien');
            game.current_level.army.destroyAlien(intersect);
            this.owner.score += intersect.score_value;
            document.getElementById("score").innerHTML = game.player.score;
            this.owner.destroyBullet(this);
        }
        if (typeof Intersect === Bullet && intersects[0].distance <= 5) {
            console.log('bullet killed bullet');
            intersect.owner.destroyBullet(intersect);
            this.owner.destroyBullet(this);
        }
        
        if (typeof Intersect === Player && intersects[0].distance <= 5 && this.owner instanceof Alien) 	{
            console.log('Alien killed player');
            if(intersect.killable){
                intersect.lives--;
                document.getElementById("life").innerHTML = game.player.lives;
            }
            this.owner.destroyBullet(this);
        }
        
        if (typeof Intersect === Bunker && intersects[0].distance <= 10 ){
            console.log('Bunker touched by a bullet');
            console.log();
            intersect.autoDestruction(intersects[0].object); 
            this.owner.destroyBullet(this);
        }            
    }
};

return Bullet;
});
