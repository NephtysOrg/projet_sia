/**
 * @returns {Bunker}
 */

function Bunker(bunker_data, strenght){
    this.strenght = strenght;
    Structure3d.call(this, bunker_data);
    this.scale.set(4,4,4);
};

//Create a Bunker.prototype object that inherits from Group.prototype
Bunker.prototype = Object.create(Structure3d.prototype);
//Set the "constructor" property to refer to Bunker
Bunker.prototype.constructor = Bunker;

//A function that destroy a part of the current bunker
Bunker.prototype.autoDestruction = function () {
    console.log("-> Bunker.autoDestruction()");
    scene.remove(this);
    //second step : destruct a part of the bunker
    console.log("<- Bunker.autoDestruction()");  
};


