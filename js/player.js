/**
 * This class define a Player Object
 * @param {type} player_data
 * @param {type} lives
 * @returns {Player}
 */
function Player(player_data,lives){
    this.lives=lives;
    this.bullets;
    this.direction = new THREE.Vector3(0,0,-1); //pointing to -z (Player direction)
    this.score;
    this.can_fire = true;
    Structure3d.call(this,player_data);
};

// Create a Player.prototype object that inherits from Structure3d.prototype
Player.prototype = Object.create(Structure3d.prototype);
// Set the "constructor" property to refer to Player
Player.prototype.constructor = Player;

Player.prototype.fire = function() {
    console.log("-> player.fire()");
    if(can_fire){
        can_fire=false;
        // Shot a bullet and set a timer after
    }
    console.log("<- player.fire()");
};


Player.prototype.move = function(direction) {
    // Think to a clock...
        this.translateX(direction[0]*player_speed);
        this.translateY(direction[1]*player_speed);
        this.translateZ(direction[2]*player_speed);

};

/*Player.prototype.moveBullet = function() {
    for (var i=0; i< this.bullets.length ; i++){
        this.bullets.move(this.direction);
        if(this.bullets[i].position.z > max_height ){
            
        }
    }
};*/
