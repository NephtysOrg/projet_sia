var requestId;
var renderer;

if (Detector.webgl) {
    renderer = new THREE.WebGLRenderer({antialias: true});

} else {
    renderer = new THREE.CanvasRenderer();
}

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMapType = THREE.PCFSoftShadowMap;
renderer.shadowMapEnabled = true;
renderer.gammaInput = true;
renderer.gammaOutput = true;

document.body.appendChild(renderer.domElement);


var game = new Game();
if (!game.init())
    loop();

game.debug();
function loop() {
    requestId = window.requestAnimationFrame(loop);
    render();
    game.animate();
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
