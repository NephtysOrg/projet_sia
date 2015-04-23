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
invaders_data[0] = new Array();
invaders_data[0]["data"] = invader1_data;
invaders_data[0]["score"] = 10;

invaders_data[1] = new Array();
invaders_data[1]["data"] = invader2_data;
invaders_data[1]["score"] = 30;

invaders_data[2] = new Array();
invaders_data[2]["data"] = invader3_data;
invaders_data[2]["score"] = 50;


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



function distance (v1, v2)
{
    var dx = v1.x - v2.x;
    var dy = v1.y - v2.y;
    var dz = v1.z - v2.z;

    return Math.sqrt(dx*dx+dy*dy+dz*dz);
}