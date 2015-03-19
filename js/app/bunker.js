/**
 * 
 * @param {type} bunker_data
 * @param {type} strenght
 * @returns {Bunker}
 */
define(['app/structure3d'],function(Structure3d){
    console.log("scripts loaded for bunker.js");
function Bunker(bunker_data, strenght,speed) {
    this.strenght = strenght;
    this.speed = speed;
    Structure3d.call(this, bunker_data, false);
    this.scale.set(4, 4, 4);
}
;

//Create a Bunker.prototype object that inherits from Group.prototype
Bunker.prototype = Object.create(Structure3d.prototype);
//Set the "constructor" property to refer to Bunker
Bunker.prototype.constructor = Bunker;

//A function that destroy a part of the current bunker
Bunker.prototype.autoDestruction = function () {
    console.log("-> Bunker.autoDestruction()");
    
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
    //second step : destruct a part of the bunker
    console.log("<- Bunker.autoDestruction()");
};

Bunker.prototype.move = function(direction) {
        //console.log("-> Alien.move()");
        this.position.x += (direction[0]*this.speed);
        this.position.y += (direction[1]*this.speed);
        this.position.z += (direction[2]*this.speed);
        //console.log("<- Alien.move()");

};
    return Bunker;
});

