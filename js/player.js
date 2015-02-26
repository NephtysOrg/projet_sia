/**
 * This class define a Player Object
 * @param {type} player_data
 * @param {type} lives
 * @returns {Player}
 */
function Player(player_data,lives){
    this.lives=lives;
    this.bullets = new Array();
    this.direction = [0,1,0]; //pointing to y (Player direction)
    this.score = 0;
    this.can_fire = true;
    Structure3d.call(this,player_data);
};

// Create a Player.prototype object that inherits from Structure3d.prototype
Player.prototype = Object.create(Structure3d.prototype);
// Set the "constructor" property to refer to Player
Player.prototype.constructor = Player;


Player.prototype.fire = function() {
    if(this.can_fire){
         console.log("-> player.fire()");
        this.can_fire=false;
        var tmp_bullet = new Bullet(bullet_data,10,this);
        tmp_bullet.position.set(this.position.x,this.position.y+5,this.position.z);
        scene.add(tmp_bullet);
        this.bullets.push(tmp_bullet);
        var that = this;    //setTimeOut use the global scope so the keyword this need to be changed
        setTimeout(function () {
                that.can_fire = true;
            }, 200);
            
    console.log("<- player.fire()");
    }
};


Player.prototype.move = function(direction) {
  console.log("-> player.move()");
    // Think to a clock...
        this.translateX(direction[0]*player_speed);
        this.translateY(direction[1]*player_speed);
        this.translateZ(direction[2]*player_speed);
  console.log("-> player.move()");

};

Player.prototype.destroyBullet = function(bullet){
    var i = this.bullets.indexOf(bullet);
    scene.remove(this.bullets[i]);
    console.log(this.bullets);
    this.bullets.splice(i, 1);
    console.log(this.bullets);
};

Player.prototype.moveBullets = function() {
    for (var i=0; i< this.bullets.length ; i++){
        this.bullets[i].move(this.direction);
        if(this.bullets[i] && this.bullets[i].position.y >= max_height ){
            console.log("removing");
            this.destroyBullet(this.bullets[i]);
        }
    }
};



