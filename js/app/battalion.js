/**
 * battalion of alien
 * @param {type} batalion_data
 * @param {type} battalion_speed
 * @param {type} alien_point
 * @param {type} alien_number
 * @param {type} position_y
 * @param {type} strength
 * @param {type} army
 * @returns {Battalion}
 */
function Battalion(batalion_data, battalion_speed, alien_point, alien_number, position_y,strength, army) {
    THREE.Group.call(this);
    
    this.aliens = new Array();          // Alien of alien
    this.speed = battalion_speed;       // Moving speed
    this.direction = [1, 0, 0];         // 1rst direction
    this.strength = strength;           // fire computation helper
    this.army = army;

    var step = map_width / alien_number;
    for (var i = -alien_number / 2; i < alien_number / 2; i++) {
        var tmp_alien = new Alien(batalion_data, battalion_speed , alien_point,this.strength, this);
        tmp_alien.position.x = i * step;
        tmp_alien.position.y = position_y;
        this.aliens.push(tmp_alien);
        this.add(tmp_alien);
    }
    
    this.setColor();
};

Battalion.prototype = Object.create(THREE.Group.prototype);
Battalion.prototype.constructor = Battalion;


/**
 * Move the entiere battalion and check if left or right bounds are out of the map
 */
Battalion.prototype.move = function () {
    var bottom = [0, -this.aliens[0].height / this.speed, 0];
    for (var i = 0; i < this.aliens.length; i++) {
        this.aliens[i].move(this.direction);
    }
    if ((this.leftOverflow() || this.rightOverflow())) {
        if (!this.bottomOverflow() && game.player.killable === true) {
            for (var i = 0; i < this.aliens.length; i++) {
                this.aliens[i].move(bottom);
            }
        }
        this.direction[0] = -this.direction[0];
        this.direction[1] = -this.direction[1];
        this.direction[2] = -this.direction[2];
    }
};

/**
 * 
 * @returns {undefined}
 */
Battalion.prototype.setColor = function(){
   var color = toyColors[Math.floor(Math.random() * 4) + 0]
   for(var i=0; i < this.aliens.length; i++){
       this.aliens[i].setColor(color);
   }
}; 


/**
 * Check if the alien on the right of the batallion is out of map
 * @returns {Boolean}
 */
Battalion.prototype.rightOverflow = function () {
    if (this.aliens[this.aliens.length - 1].position.x >= max_width) {
        return true;
    } else {
        return false;
    }
};

/**
 * Check if the alien on the left of the batallion is out of map
 * @returns {Boolean}
 */
Battalion.prototype.leftOverflow = function () {
    if (this.aliens[0].position.x < min_width) {
        return true;
    } else {
        return false;
    }
};

/**
 * Check if the battalion will not collide with the next one when going down
 * @returns {Boolean}
 */
Battalion.prototype.bottomOverflow = function () {
    var my_index = this.army.battalions.indexOf(this);
    if ((my_index >= 0) && (my_index < this.army.battalions.length - 1)) {
        if (this.army.battalions[my_index + 1] && (this.aliens[0].position.y - this.army.battalions[my_index + 1].aliens[0].position.y <= 5 * this.aliens[0].height)) {
            return true;
        }
    }
    return false;
};

/**
 * Check if the battailion isnt going to collide defenses
 * @returns {Boolean}
 */
Battalion.prototype.bunkerOverflow = function () {
    var y_limit = game.player.position.y;
    if(game.current_level.defense.bunkers.length > 0){
        y_limit =  game.current_level.defense.bunkers[0].position.y;
    }
    if(this.aliens[0]!== undefined && this.aliens[0].position.y <= y_limit){
        return true;
    }
    return false;
};


/**
 * Remove a given alien from battalion and command to kill me if i am empty
 * @param {type} alien
 */
Battalion.prototype.destroyAlien = function (alien) {
    var i = this.aliens.indexOf(alien);
    if (i > -1) {
        // Removing bullets of alien, not realist but funny
        while(this.aliens[i].bullets.length > 0){
                this.aliens[i].destroyBullet(this.aliens[i].bullets[this.aliens[i].bullets.length-1]);
        }
        this.remove(this.aliens[i]);
        this.aliens.splice(i, 1);
    }
    if (this.aliens.length === 0) {
        this.army.destroyBatallion(this);
    }
};

/**
 * Command alien to fire
 */
Battalion.prototype.fire = function () {
    for (var i = 0; i < this.aliens.length; i++)
                this.aliens[i].fire();
};

/**
 * Command alien to move their bullets
 */
Battalion.prototype.moveBullets = function () {
    for (var i = 0; i < this.aliens.length; i++) {
        this.aliens[i].moveBullets();
    }
};