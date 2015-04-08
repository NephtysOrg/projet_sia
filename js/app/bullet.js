/**
 * 
 * @param {type} bullet_data
 * @param {type} speed
 * @param {type} owner
 * @returns {Bullet}
 */
function Bullet(bullet_data, speed,color, owner) {

    Structure3d.call(this, bullet_data);
    this.speed = speed;
    this.owner = owner;
    this.direction = new THREE.Vector3();
    this.raycaster;
    this.color = color;
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
    this.translateX(direction.x * this.speed);
    this.translateY(direction.y * this.speed);
    this.translateZ(direction.z * this.speed);
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
            
            game.information_group.remove(game.information["score"]);
            var text3d = new THREE.TextGeometry(this.owner.score, {size: 30,height: 15,curveSegments: 1,font: "helvetiker",weight : "bold"});
            text3d.computeBoundingBox();
            var material = new THREE.MeshPhongMaterial( { color: 0x5555ff } );
            var mesh = new THREE.Mesh(text3d,material);
            mesh.position.set(min_height+180,max_height+margin,margin);
            mesh.rotation.x += 90 * Math.PI/180;
            game.information_group.add(mesh);
            game.information["score"] = mesh;
            
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
                intersect.lives--;
                document.getElementById("life").innerHTML ="";
                for(var i=0;i< intersect.lives ;i++){
                   document.getElementById("life").innerHTML += "<i class=\"fa fa-rocket\"></i>";
                }
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
