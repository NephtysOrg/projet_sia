function Level (dificulty,player,game){
    THREE.Group.call(this);
    this.difficulty = dificulty;
    this.army;
    this.player = player;
    this.defense;
    this.game = game;
};

// Create a Army.prototype object that inherits from Group.prototype
Level.prototype = Object.create(THREE.Group.prototype);
// Set the "constructor" property to refer to Army
Level.prototype.constructor = Level;

Level.prototype.init=function(){
    var battalion_number = this.difficulty*2;
    var alien_datas = new Array();
    var scores = new Array();
    var speeds = new Array();
    var alien_numbers = new Array();
    var army_strength = this.difficulty;
    for (var i = 0; i < battalion_number; i++){
        alien_datas.push(invader1_data);
        scores.push(50*this.difficulty);
        speeds.push(Math.floor((Math.random() * 1*this.difficulty) + 1));
        alien_numbers.push(Math.floor((Math.random() * this.difficulty) + 2));
    }
    this.difficulty ++;
    var bunker_number = (this.difficulty<=6)?this.difficulty:6;
    var bunker_datas = new Array();
    var bunker_strengths = new Array();
    var movable = Math.random()<.8;
    for (var i = 0; i < bunker_number; i++){
        bunker_datas.push(bunker_data);
        bunker_strengths.push(2*Math.floor((Math.random() * this.difficulty) + 1));
    }
    
    this.army = new Army(battalion_number,alien_numbers,speeds,alien_datas,scores,army_strength,this);
    this.add(this.army);
    this.defense = new Defense(bunker_number,bunker_datas,bunker_strengths,movable,this.difficulty/10,this);
    this.add(this.defense);
};

Level.prototype.clear = function (){
    if(this.defense)
        this.defense.killAll();
    if(this.army)
        this.army.killAll();
    if(this.player)
        this.player.clearBullets();
    
};


Level.prototype.isOver = function (){
    var tmp = this.army.battalions[this.army.battalions.length - 1];
//    if(){
//        
//    }
};