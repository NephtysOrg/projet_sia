function Battalion(batalion_data, battalion_speed, alien_point, alien_number) {
    THREE.Group.call(this);
    this.aliens = new Array();

    console.log('-> Battalion() ' + alien_number);


    var step = map_width / alien_number
    for (var i = -alien_number / 2; i < alien_number / 2; i++) {
        var tmp_alien = new Alien(batalion_data, battalion_speed, alien_point);
        tmp_alien.position.x = i * step;
        this.add(tmp_alien);
        this.aliens.push(tmp_alien);
    }
    console.log('<- Battalion() ' + this.aliens.length);
};

// Create a Battalion.prototype object that inherits from Group.prototype
Battalion.prototype = Object.create(THREE.Group.prototype);
// Set the "constructor" property to refer to Battalion
Battalion.prototype.constructor = Battalion;


Battalion.prototype.move = function (direction) {
    for (var i = 0; i < this.aliens.length; i++) {
            this.aliens[i].move(direction);
    }
};


Battalion.prototytpe.rightOverflow = function (){
    if(this.aliens[this.aliens.length - 1].position.x < max_width){
        console.log("not right overflow");
        return false;
    }else{
        return true;
    } 
};

Battalion.prototytpe.leftOverflow = function (){
    if(this.aliens[0].position.x > min_width){
        console.log("not left overflow");
        return false;
    }else{
        return true;
    }
};