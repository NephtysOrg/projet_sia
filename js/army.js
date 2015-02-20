/**
 * 
 * @param {type} batallion_number
 * @param {type} alien_numbers
 * @param {type} speeds
 * @param {type} datas
 * @param {type} scores
 * @returns {Army}
 */
function Army(batallion_number,alien_numbers,speeds,datas,scores){
    THREE.Group.call(this);
    this.battalions = new Array();
    var step = (map_height/(batallion_number))/2;

    
    for(var i = 0; i < batallion_number ;i++){
            var tmp = new Battalion(datas[i],speeds[i],scores[i],alien_numbers[i]);
            this.battalions.push(tmp);
            tmp.position.y = max_height - (i*step);
            this.add(tmp);
    }
};

// Create a Army.prototype object that inherits from Group.prototype
Army.prototype = Object.create(THREE.Group.prototype);
// Set the "constructor" property to refer to Army
Army.prototype.constructor = Army;

Army.prototype.move = function (){
    for (var i =0; i<this.battalions.length; i++){
        this.battalions[i].move();
    }
}