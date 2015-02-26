/**
 * 
 * @param {type} batalion_data
 * @param {type} battalion_speed
 * @param {type} alien_point
 * @param {type} alien_number
 * @returns {Battalion}
 */
function Battalion(batalion_data, battalion_speed, alien_point, alien_number, position_y, arm) {
    THREE.Group.call(this);
    this.aliens = new Array();
    this.speed = battalion_speed;
    this.direction = [1, 0, 0];
    this.army = arm;
    console.log('-> Battalion() ');

    var step = map_width / alien_number;
    for (var i = -alien_number / 2; i < alien_number / 2; i++) {
        var tmp_alien = new Alien(batalion_data, battalion_speed, alien_point,this);
        tmp_alien.position.x = i * step;
        tmp_alien.position.y = position_y;
        this.aliens.push(tmp_alien);
        this.add(tmp_alien);
    }

    console.log('<- Battalion() ');
}
;

// Create a Battalion.prototype object that inherits from Group.prototype
Battalion.prototype = Object.create(THREE.Group.prototype);
// Set the "constructor" property to refer to Battalion
Battalion.prototype.constructor = Battalion;


Battalion.prototype.move = function () {
    var bottom = [0, -this.aliens[0].height, 0];
     for (var i = 0; i < this.aliens.length; i++) {
        this.aliens[i].move(this.direction);
    }
    if (this.leftOverflow() || this.rightOverflow()) {
        for (var i = 0; i < this.aliens.length; i++) {
            this.aliens[i].move(bottom);
        }
        this.direction[0] = -this.direction[0];
        this.direction[1] = -this.direction[1];
        this.direction[2] = -this.direction[2];
    }
   

};


Battalion.prototype.rightOverflow = function () {
    //console.log("Max_bat : " + this.aliens[this.aliens.length - 1].position.x);
    if (this.aliens[this.aliens.length - 1].position.x >= max_width) {
        return true;
    } else {
        return false;
    }
};

Battalion.prototype.leftOverflow = function () {
    //console.log("Min_bat : " + this.aliens[0].position.x);
    if (this.aliens[0].position.x < min_width) {
        return true;
    } else {
        return false;
    }
};

Battalion.prototype.printPosition = function() {
    for(var i = 0 ; i < this.aliens.length; i++){
        console.log("   Alien["+i+"]");
        this.aliens[i].printPosition();
    } 
}

Battalion.prototype.destroyAlien = function(alien){
    var i = this.aliens.indexOf(alien);
    if(i>-1){
        // Removing bullets of alien, not realist but funny
        for (var j =0; j<this.aliens[i].bullets.length; j++){
            this.aliens[i].destroyBullet(this.aliens[i].bullets[j]);
        }
        scene.remove(this.aliens[i]);
        this.remove(this.aliens[i]);
        this.aliens.splice(i, 1);
    }
    if(this.aliens.length === 0){
        this.army.destroyBatallion(this);
    }
};

Battalion.prototype.fire = function () {
    for(var i = 0; i < this.aliens.length; i++){
        if(i === Math.floor((Math.random() * this.aliens.length)))
        this.aliens[i].fire();
    }
};

Battalion.prototype.moveBullets = function (){
    for (var i = 0; i < this.aliens.length; i++){
        this.aliens[i].moveBullets();
    }
};