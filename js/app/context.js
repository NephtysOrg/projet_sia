/* 
 * In this file, we declare all shared variables
 */
var unit_size = 1;
var map_width = 500;
var map_height = 800;
var max_height = map_height / 2;
var min_height = -map_height / 2;
var max_width = map_width / 2;
var min_width = -map_width / 2;
var margin = 50;



var invader1_data = [   [0, 0, 2, 0, 0, 0, 0, 0, 2, 0, 0],
                        [0, 0, 0, 3, 0, 0, 0, 3, 0, 0, 0],
                        [0, 0, 3, 3, 4, 4, 4, 3, 3, 0, 0],
                        [0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0],
                        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                        [1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1],
                        [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1],
                        [0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0]];

var invader2_data = [   [0,0,0,3,3,0,0,0],
                        [0,0,3,3,3,3,0,0],
                        [0,3,3,3,3,3,3,0],
                        [3,3,0,3,3,0,3,3],
                        [3,3,3,3,3,3,3,3],
                        [0,3,0,3,3,0,3,0],
                        [3,0,0,0,0,0,0,3],
                        [0,3,0,0,0,0,3,0]];

var invader3_data = [   [0,0,0,0,3,3,3,3,0,0,0,0],
                        [0,3,3,3,3,3,3,3,3,3,3,0],
                        [3,3,3,3,3,3,3,3,3,3,3,3],
                        [3,3,3,0,0,3,3,0,0,3,3,3],
                        [3,3,3,3,3,3,3,3,3,3,3,3],
                        [0,0,0,3,3,0,0,3,3,0,0,0],
                        [0,0,3,3,0,3,3,0,3,3,0,0],
                        [3,3,0,0,0,0,0,0,0,0,3,3]];
                    
var invaders_data = new Array();
invaders_data.push(invader1_data);
invaders_data.push(invader2_data);
invaders_data.push(invader3_data);

/*invaders_data.push(invader4_data);
invaders_data.push(invader5_data);*/


var player_data = [ [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1],
                    [0, 0, 0, 0, 1, 1, 2, 2, 2, 1, 0],
                    [0, 1, 1, 1, 1, 2, 3, 2, 0, 0, 0],
                    [1, 2, 2, 2, 2, 3, 3, 3, 2, 0, 0],
                    [0, 1, 1, 1, 1, 2, 3, 2, 0, 0, 0],
                    [0, 0, 0, 0, 1, 1, 2, 2, 2, 1, 0],
                    [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1]];


var bunker_data = [ [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                    [1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1],
                    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]];


var bullet_data = [ [0, 0, 0, 1, 2, 3, 2, 1, 0, 0, 0],
                    [0, 0, 0, 1, 2, 3, 2, 1, 0, 0, 0],
                    [0, 0, 0, 1, 2, 3, 2, 1, 0, 0, 0],
                    [0, 0, 0, 0, 1, 2, 1, 0, 0, 0, 0],
                    [0, 0, 0, 0, 1, 2, 1, 0, 0, 0, 0],
                    [0, 0, 0, 0, 1, 2, 1, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0]];

/* colors */
var red     = "0xF22248";
var orange  = "0xFF530D";
var pink    = "0xE800F9";
var green   = "0x72FF0D";
var yellow  = "0xF7FF00"

var toyColors = new Array();

toyColors.push(red);
toyColors.push(orange);
toyColors.push(pink);
toyColors.push(green);
toyColors.push(yellow);