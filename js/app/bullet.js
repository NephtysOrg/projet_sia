/**
 * A bullet shotted
 * @param {type} bullet_data
 * @param {type} speed
 * @param {type} color
 * @param {type} light_param
 * @param {type} owner
 * @returns {Bullet}
 */
function Bullet(bullet_data, speed,color,light_param, owner) {
    Structure3d.call(this, bullet_data);
    
    this.speed = speed;
    this.owner = owner;
    this.direction = new THREE.Vector3();
    this.light = light_param;
    if(this.light !== undefined){
        this.light.visible = true;
        this.light.intensity = 3;
        this.light.position.copy(this.position);
    }
        
    
    this.raycaster;
    for(var i = 0 ; i < this.children.length; i++){
        this.children[i].material.color.setHex(color);
    }
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
        this.owner.destroyBullet(this);
    }

    this.position.x += direction.x * this.speed;
    this.position.y += direction.y * this.speed;
    this.position.z += direction.z * this.speed;
     if(this.light !== undefined){
         console.log(this.light);
        this.light.position.copy(this.position);
     }
    this.collide();
    //console.log("<- bullet.move()");

};

Bullet.prototype.collide = function () {
    // Just for the f*** raycaster who only accpet vectors
    var vector_direction = new THREE.Vector3(this.direction.x, this.direction.y, this.direction.z);
    var ray_pos = new THREE.Vector3(this.position.x+(this.width/2),this.position.y,this.position.z);
    this.raycaster = new THREE.Raycaster(ray_pos, vector_direction, 0, margin); // Vertical
    // calculate objects intersecting the picking ray
    if(this.owner instanceof Player)
        var intersects = this.raycaster.intersectObjects(game.current_level.army.children.concat(game.current_level.defense),true);
    if(this.owner instanceof Alien)
        var intersects = this.raycaster.intersectObjects(game.player.children.concat(game.current_level.defense),true);
    
    if (intersects.length > 0) {
        var intersect = intersects[0].object.parent;
        
        if (intersect instanceof Alien && intersects[0].distance <= 10 && this.owner instanceof Player) {
            console.log('Player killed alien');
            game.current_level.army.destroyAlien(intersect);
            this.owner.score += intersect.score_value;
            document.getElementById("score").innerHTML = game.player.score;
            this.owner.destroyBullet(this);
        }
        if (intersect instanceof Bullet && intersects[0].distance <= 10) {
            console.log('bullet killed bullet');
            intersect.owner.destroyBullet(intersect);
            this.owner.destroyBullet(this);
        }
        
        if (intersect instanceof Player && intersects[0].distance <= 10 && this.owner instanceof Alien) 	{
            console.log('Alien killed player');
            if(intersect.killable){
                game.pp_manager.startEffect("glitch", 0.2);
                intersect.lives--;
                document.getElementById("life").innerHTML = game.player.lives;
            }
            this.owner.destroyBullet(this);
        }
        
        if (intersect instanceof Bunker && intersects[0].distance <= 20 ){
            console.log('Bunker touched by a bullet');
            console.log();
            intersect.autoDestruction(intersects[0].object); 
            this.owner.destroyBullet(this);
        }
                 
    }
};
