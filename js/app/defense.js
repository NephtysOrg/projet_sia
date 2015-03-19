define(['app/bunker',
        'three'],function(Bunker,THREE){
        console.log("scripts loaded for defense.js");
function Defense(bunker_number, bunker_datas, bunker_strengths,movable,speed,level){
        THREE.Group.call(this);
        this.level = level;
        this.bunkers = new Array();
        this.movable = movable;
        this.direction = [-1,0,0];
        
        var step = map_width / bunker_number;
        for (var i = 0; i < bunker_number; i++) {
            var tmp = new Bunker(bunker_datas[i],bunker_strengths[i],speed);
            this.bunkers.push(tmp);
            tmp.position.x = min_width +(i * step);
            tmp.position.y = this.level.player.position.y + margin*2;
            tmp.rotation.z = -90 * Math.PI / 180;
            this.add(tmp);
        }
};

// Create a Army.prototype object that inherits from Group.prototype
Defense.prototype = Object.create(THREE.Group.prototype);
// Set the "constructor" property to refer to Army
Defense.prototype.constructor = Defense;

Defense.prototype.killAll = function(){
    while (this.bunkers.length > 0){
        var i = this.bunkers.length-1;
        if(i > -1){
            this.remove(this.bunkers[i]);
            this.bunkers.splice(i,1);
        }
    }
};


Defense.prototype.rightOverflow = function () {
    if (this.bunkers[this.bunkers.length - 1].position.x >= max_width - margin) {
        return true;
    } else {
        return false;
    }
};

Defense.prototype.leftOverflow = function () {
    if (this.bunkers[0].position.x < min_width) {
        return true;
    } else {
        return false;
    }
};

Defense.prototype.move = function () {
    if(this.movable === true){
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
return Defense;
});