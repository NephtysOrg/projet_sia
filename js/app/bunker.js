/**
 * 
 * @param {type} bunker_data
 * @param {type} strenght
 * @param {type} speed
 * @param {type} defense
 * @returns {Bunker}
 */
function Bunker(bunker_data, strenght, speed, defense) {
    Structure3d.call(this, bunker_data, false);

    this.strenght = strenght;       // Bunker resitance
    this.speed = speed;             // speed if movable
    this.defense = defense;         // attached group of bunker
    
        // Set Alien's Color
    for (var i = 0; i < this.children.length; i++) {
        this.children[i].material.color.setHex(0x2f2fff);
    }

    this.scale.set(6, 6, 6);
}
;

Bunker.prototype = Object.create(Structure3d.prototype);
Bunker.prototype.constructor = Bunker;

/**
 *  destroy a part of the current bunker
 */
Bunker.prototype.autoDestruction = function () {
    // We delete a random number of block, taking into account the bunker strength
    var deletion_number = Math.floor((Math.random() * (this.children.length / this.strenght)) + 1);
    // If the bunker is solid enough (length>5) we delete it block by block randomly. 
    // If isnt we delete every block.
    if (this.children.length > 5) {
        while (deletion_number > 0) {
            // For realistic deletion purposes we delete either the top or the bottom
            if (deletion_number % 2 === 0) {
                this.remove(this.children[this.children.length - 1]);
            } else {
                this.remove(this.children[0]);
            }
            deletion_number--;
        }
    } else {
        while (this.children.length > 0) {
            this.remove(this.children[this.children.length - 1]);
        }
    }
    if (this.children.length === 0) {
        this.defense.removeBunker(this);
    }
};

/**
 * Move the bunker
 * @param {type} direction
 */
Bunker.prototype.move = function (direction) {
    this.position.x += (direction[0] * this.speed);
    this.position.y += (direction[1] * this.speed);
    this.position.z += (direction[2] * this.speed);
};

