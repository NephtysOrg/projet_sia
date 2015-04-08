var requestId;
var renderer;

if (Detector.webgl) {
    renderer = new THREE.WebGLRenderer({antialias: false});

} else {
    renderer = new THREE.CanvasRenderer();
}

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMapType = THREE.PCFSoftShadowMap;
//renderer.shadowMapEnabled = true;
//renderer.gammaInput = true;
//renderer.gammaOutput = true;

document.body.appendChild(renderer.domElement);


var stats = new Stats();
//stats.setMode(1); // 0: fps, 1: ms

// align top-left
stats.domElement.style.position = 'absolute';
stats.domElement.style.left = '10px';
stats.domElement.style.bottom = '5px';
document.body.appendChild( stats.domElement );

var game = new Game();
if (!game.init())
    loop();

//game.debug();
function loop() {
    requestId = window.requestAnimationFrame(loop);
    render();
    stats.begin();
    game.animate();
    stats.end(); 
}

function start() {
    if (!requestId) {
        loop();
    }
}

function stop() {
    if (requestId) {
        window.cancelAnimationFrame(requestId);
        requestId = undefined;
    }
}
function render() {
    renderer.render(game, game.current_camera);
}
