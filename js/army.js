/**
 * 
 * @param {type} batallion_number
 * @param {type} alien_numbers
 * @param {type} speeds
 * @param {type} datas
 * @param {type} scores
 * @returns {Army}
 */
function Army(batallion_number, alien_numbers, speeds, datas, scores) {
    THREE.Group.call(this);
    this.battalions = new Array();
    this.operationnal = true;

    var step = (map_height / (batallion_number)) / 2;
    for (var i = 0; i < batallion_number; i++) {
        var tmp = new Battalion(datas[i], speeds[i], scores[i], alien_numbers[i], max_height - (i * step), this);
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
        scene.remove(this.battalions[i]);
        this.battalions.splice(i, 1);
    }

    if (this.battalions.length === 0) {
        this.operationnal = false;
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
        this.battalions[i].fire();
    }
};

Army.prototype.moveBullets = function () {
    for (var i = 0; i < this.battalions.length; i++) {
        this.battalions[i].moveBullets();
    }
};

Army.prototype.animate = function () {
    //this.fire();
    //this.move();
    //this.moveBullets();
};

Army.prototype.killAll = function () {
    while (this.operationnal) {
        console.log("->killall()");
        for (var i = 0; i < this.battalions.length; i++) {
            for (var j = 0; j < this.battalions[i].aliens.length; j++) {
                console.log(level.children);
                console.log("i=" + i);
                console.log("j=" + j);
                this.battalions[i].destroyAlien(this.battalions[i].aliens[j]);
            }
        }
        console.log("<-killall()");
    }
};