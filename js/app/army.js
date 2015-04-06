/**
 * 
 * @param {type} batallion_number
 * @param {type} alien_numbers
 * @param {type} speeds
 * @param {type} datas
 * @param {type} scores
 * @returns {Army}
 */
function Army(batallion_number, alien_numbers, speeds, datas, scores,strength,level) {
    THREE.Group.call(this);
    this.battalions = new Array();
    this.strength = strength;
    this.level = level;

    var step = (map_height / (batallion_number)) / 2;
    for (var i = 0; i < batallion_number; i++) {
        var tmp = new Battalion(datas[i], speeds[i], scores[i], alien_numbers[i], max_height - (i * step),this.strength, this);
        this.battalions.push(tmp);
        this.add(tmp);
    }
}
;

// Create a Army.prototype object that inherits from Group.prototype
Army.prototype = Object.create(THREE.Group.prototype);
// Set the "constructor" property to refer to Army
Army.prototype.constructor = Army;

Army.prototype.move = function () {
    for (var i = 0; i < this.battalions.length; i++) {
        this.battalions[i].move();
    }
};

Army.prototype.destroyAlien = function (alien) {
    alien.batallion.destroyAlien(alien);
};

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

Army.prototype.printPosition = function () {
    for (var i = 0; i < this.battalions.length; i++) {
        console.log("Battalion[" + i + "]");
        this.battalions[i].printPosition();
    }
};

Army.prototype.fire = function () {
    for (var i = 0; i < this.battalions.length; i++) {
        this.battalions[this.battalions.length-1].fire();
    }
};

Army.prototype.moveBullets = function () {
    for (var i = 0; i < this.battalions.length; i++) {
        this.battalions[i].moveBullets();
    }
};

Army.prototype.animate = function () {
   this.fire();
    this.move();
   this.moveBullets();
};

Army.prototype.killAll = function () {
    while (this.battalions.length>0) {
        while(this.battalions[this.battalions.length-1].aliens.length > 0)
            this.battalions[this.battalions.length-1].destroyAlien(this.battalions[this.battalions.length-1].aliens[this.battalions[this.battalions.length-1].aliens.length-1]);
    }
};