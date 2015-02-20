/* 
 * In this file, we declare all shared variables
 */

var scene, renderer;
var camera, cameraControl;
var mesh;
var player;
var arm;
var unit_size = 1 ;
var player_speed = 5;
var keyboard = new THREEx.KeyboardState();
var clock ;
var map_width = 200;
var map_height = 300;
var max_height = map_height/2;
var min_height = -map_height/2;

var max_width = map_width/2;
var min_width = -map_width/2;
var margin = 50;

var invader1_data = [   [0,0,2,0,0,0,0,0,2,0,0],
                        [0,0,0,3,0,0,0,3,0,0,0],
                        [0,0,3,3,4,4,4,3,3,0,0],
                        [0,1,1,0,1,1,1,0,1,1,0],
                        [1,1,1,1,1,1,1,1,1,1,1],
                        [1,0,1,1,1,1,1,1,1,0,1],
                        [1,0,1,0,0,0,0,0,1,0,1],
                        [0,0,0,1,1,0,1,1,0,0,0] ];
                    
var player_data = [
                        [0,0,0,0,0,1,0,0,0,0,0],
                        [0,0,1,0,1,2,1,0,1,0,0],
                        [0,0,1,1,2,3,2,1,1,0,0],
                        [0,0,1,1,2,3,2,1,1,0,0],
                        [0,1,1,1,1,2,1,1,1,1,0],
                        [1,1,1,1,1,1,1,1,1,1,1] ];
                    
 
var block_data = [      [1,1,1,1,1,1,1,1,1,1,1],
                        [1,1,1,1,1,0,1,1,1,1,1],
                        [1,1,1,1,0,0,0,1,1,1,1],
                        [0,1,1,0,0,0,0,0,1,1,0],
                        [1,0,0,0,0,0,0,0,0,0,1] ];
                   
                   
var bullet_data = [     [0,0,0,1,1,1,1,1,0,0,0],
                        [0,0,0,1,1,1,1,1,0,0,0],
                        [0,0,0,0,1,1,1,0,0,0,0],
                        [0,0,0,0,1,1,1,0,0,0,0],
                        [0,0,0,0,1,1,1,0,0,0,0] ];
                    
                    
var map;
var army;
var player;