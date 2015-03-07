if (!init())
    animate();

function init() {
    if (Detector.webgl) {
        renderer = new THREE.WebGLRenderer({antialias: true});
    } else {
        renderer = new THREE.CanvasRenderer();
    }
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('container').appendChild(renderer.domElement);
    // create a scene
    scene = new THREE.Scene();
    // put a camera in the scene
    camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(0, 0, 800);
    scene.add(camera);
    // create a camera contol
    cameraControls = new THREE.OrbitControls(camera);
    // transparently support window resize
    THREEx.WindowResize.bind(renderer, camera);

    var light = new THREE.PointLight(0xffffff, 2);
    light.position.set(0, 0, 100);
    light.castShadow = true;
    scene.add(light);

    // Game goes here
    var axis = buildAxes(1000);
    scene.add(axis);

    //we add here a player
    player = new Player(player_data, 3);
    player.position.y = min_height + player.height;
    scene.add(player);

    //we add four bunkers
    bunker = new Bunker(bunker_data, 4);
    bunker.position.y = min_height + 100;
    bunker.rotation.z = -90 * Math.PI / 180;
    //bunker.rotation.y = 90 * Math.PI/180;

    level = new Level(difficulty);
    level.init();
    scene.add(level);

    var g = new THREE.PlaneGeometry(map_width + margin, map_height + margin, 10);
    var m = new THREE.MeshBasicMaterial({color: 0xe576523});
    var plane = new THREE.Mesh(g, m);
    scene.add(plane);

}


function animate() {
    requestAnimationFrame(animate);
    render();

    cameraControls.update();

    if (keyboard.pressed("left")) {
        var dir = [-1, 0, 0];
        if (player.position.x > min_width)
            player.move(dir);
    }
    if (keyboard.pressed("right")) {
        var dir = [1, 0, 0];
        if (player.position.x < max_width)
            player.move(dir);
    }
    if (keyboard.pressed("space")) {
        player.fire();
    }
    
    if (keyboard.pressed("k")) {
        level.army.killAll();                 
    }
    player.moveBullets();
    
    if(level.army.operationnal)
        level.army.animate();
    else{
        difficulty++;
        level = new Level(difficulty);
        level.init();
        scene.add(level);
    }

}

function render() {
    renderer.render(scene, camera);
}
















/*if (keyboard.pressed("left") && this.position.x > min_width)
 this.translateX(-player_speed);
 
 if (keyboard.pressed("right") && this.position.x < max_width)
 this.translateX(player_speed);
 if (keyboard.pressed("space") && !player.bullet)
 this.shoot();*/
