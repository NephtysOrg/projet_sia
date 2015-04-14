/**
 * Army of battalion of alien
 * 
 * @param {type} batallion_number
 * @param {type} alien_numbers
 * @param {type} speeds
 * @param {type} datas
 * @param {type} scores
 * @param {type} strength
 * @param {type} level
 * @returns {Army}
 */
function Army(batallion_number, alien_numbers, speeds, datas, scores, strength, level) {
    THREE.Group.call(this);
    
    this.battalions = new Array();          // Little group of troops ( a line )
    this.strength = strength;               // Army strength depending on level
    this.level = level;                     // Current level playing

    var step = (map_height / (batallion_number)) / 2;
    for (var i = 0; i < batallion_number; i++) {
        
        var tmp = new Battalion(datas[i], speeds[i], scores[i], alien_numbers[i], max_height - (i * step), this.strength, this);
        this.battalions.push(tmp);
        this.add(tmp);
    }
}
;

Army.prototype = Object.create(THREE.Group.prototype);
Army.prototype.constructor = Army;

/**
 * Move each battaillon and check if the last one is not on the defense
 */
Army.prototype.move = function () {
    for (var i = 0; i < this.battalions.length; i++) {
        this.battalions[i].move();
    }
    if (this.battalions[this.battalions.length - 1].bunkerOverflow()) {
        this.level.game.current_state = this.level.game.states.OVER;
    }
};
/**
 *  Command the batallion to destroy an alien
 * @param {type} alien
 */
Army.prototype.destroyAlien = function (alien) {
    alien.batallion.destroyAlien(alien);
};

/**
 * Remove a bataillon (when is empty) and check if there is others left
 * @param {type} batallion
 * @returns {undefined}
 */
Army.prototype.destroyBatallion = function (batallion) {
    var i = this.battalions.indexOf(batallion);
    if (i > -1) {
        this.remove(this.battalions[i]);
        game.remove(this.battalions[i]);
        this.battalions.splice(i, 1);
    }

    if (this.battalions.length === 0) {
        this.level.game.current_state = this.level.game.states.INITIALIZING;
    }
};

/**
 * Command the last batallion to fire
 */
Army.prototype.fire = function () {
    if (this.battalions.length > 0)
        this.battalions[this.battalions.length - 1].fire();
};

/**
 * Command the last batallion to move the bullets
 */
Army.prototype.moveBullets = function () {
    for (var i = 0; i < this.battalions.length; i++) {
        this.battalions[i].moveBullets();
    }
};

/**
 * Army animation
 */
Army.prototype.animate = function () {
    this.fire();
    this.move();
    this.moveBullets();
};

/**
 * Remove all the aliens of the army. (cheat code pressed)
 */
Army.prototype.killAll = function () {
    while (this.battalions.length > 0) {
        if(this.battalions[this.battalions.length - 1] !== undefined)
            while (this.battalions[this.battalions.length - 1].aliens.length > 0)
                this.battalions[this.battalions.length - 1].destroyAlien(this.battalions[this.battalions.length - 1].aliens[this.battalions[this.battalions.length - 1].aliens.length - 1]);
    }
};