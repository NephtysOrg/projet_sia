function Alien(alien_data,speed,score_value){
   this.speed = speed;
   this.score_value = score_value;
   this.bullets = new Array();
   
   Structure3d.call(this,alien_data);
};

// Create a Structure3d.prototype object that inherits from Structure3d.prototype
Alien.prototype = Object.create(Structure3d.prototype);
// Set the "constructor" property to refer to Bullet
Alien.prototype.constructor = Alien;

Alien.prototype.move = function(direction) {
        console.log("-> Alien.move()");
        this.translateX(direction[0]*this.speed);
        this.translateY(direction[1]*this.speed);
        this.translateZ(direction[2]*this.speed);
        console.log("<- Alien.move()");

};

Alien.prototype.fire = function() {
    if(this.can_fire){
         console.log("-> alien.fire()");
        this.can_fire=false;
        var tmp_bullet = new Bullet(bullet_data,10,this);
        tmp_bullet.position.set(this.position.x,this.position.y,this.position.z);
        this.bullets.push(tmp_bullet);
        var that = this;    //setTimeOut use the global scope so the keyword this need to be changed
        setTimeout(function () {
                that.can_fire = true;
            }, 200);
            
    console.log("<- alien.fire()");
    }
};