requirejs.config({
    paths: {
        three :'../lib/three.min',
        Detector :'../lib/Detector',
        threexKeybordState:'../lib/THREEx.KeyboardState',
        threexWindowResize:'../lib/THREEx.WindowResize',
        OrbitalControls :'../lib/orbital',
        datgui:'../lib/dat.gui',
        app:'app'
    },
    shim: {
        three:{
            exports:'three'
        },
        Detector:{
            exports:'Detector'
        }
    }
});

require(['app/game','three','Detector','app/context'], function(Game,THREE,Detector){
    if (Detector.webgl) {
        renderer = new THREE.WebGLRenderer({antialias: true});
        console.log("WebGLRenderer created");
    } else {
        renderer = new THREE.CanvasRenderer();
        console.log 
    }

    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);


    game = new Game();

    console.log(game);
    if (!game.init())
        loop();

    //game.debug();
    function loop() {
        requestId = window.requestAnimationFrame(loop);
        render();

    //console.log(game.current_state);
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
});
