/**
 * Group of bunker
 * @param {type} bunker_number
 * @param {type} bunker_datas
 * @param {type} bunker_strengths
 * @param {type} movable
 * @param {type} speed
 * @param {type} level
 * @returns {Defense}
 */
function Defense(bunker_number, bunker_datas, bunker_strengths, movable, speed, level) {
    THREE.Group.call(this);
    
    this.level = level;             // Attached level
    this.bunkers = new Array();     // Bunker's array
    this.movable = movable;         // Movable true/false
    this.direction = [-1, 0, 0];    // First move direction

    var step = map_width / bunker_number;
    for (var i = 0; i < bunker_number; i++) {
        var tmp = new Bunker(bunker_datas[i], bunker_strengths[i], speed, this);
        this.bunkers.push(tmp);
        tmp.position.x = min_width + (i * step);
        tmp.position.y = this.level.player.position.y + margin * 4;
        tmp.rotation.z = -90 * Math.PI / 180;
        this.add(tmp);
    }
}
;

Defense.prototype = Object.create(THREE.Group.prototype);
Defense.prototype.constructor = Defense;

/**
 * remove an empty bunker from defense
 * @param {type} bunker
 */
Defense.prototype.removeBunker = function (bunker) {
    var i = this.bunkers.indexOf(bunker);
    if (i > -1) {
        this.remove(this.bunkers[i]);
        this.bunkers.splice(i, 1);
    }
};

/**
 * Clear defense
 */
Defense.prototype.killAll = function () {
    while (this.bunkers.length > 0) {
        this.removeBunker(this.bunkers[this.bunkers.length - 1]);
    }
};

/**
 * If the right bunker go out of map
 * @returns {Boolean}
 */
Defense.prototype.rightOverflow = function () {
    if (this.bunkers[this.bunkers.length - 1].position.x >= max_width - margin) {
        return true;
    } else {
        return false;
    }
};

/**
 * If the left bunker go out of map
 * @returns {Boolean}
 */
Defense.prototype.leftOverflow = function () {
    if (this.bunkers[0].position.x < min_width) {
        return true;
    } else {
        return false;
    }
};

/**
 * Move and check if right or left overflow
 */
Defense.prototype.move = function () {
    if (this.movable === true && this.bunkers.length > 0) {
        for (var i = 0; i < this.bunkers.length; i++) {
            this.bunkers[i].move(this.direction);
        }
        if ((this.leftOverflow() || this.rightOverflow())) {
            this.direction[0] = -this.direction[0];
            this.direction[1] = -this.direction[1];
            this.direction[2] = -this.direction[2];
        }
    }
};