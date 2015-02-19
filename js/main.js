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
    camera.position.set(0, 0, 300);
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

      player = new Player(invader1_data,3);
      player.position.y = min_height;
      //player.rotation.x = 10* Math.PI/180;
      
      var g = new THREE.PlaneGeometry(map_width,map_height,10);
      var m = new THREE.MeshBasicMaterial({color : 0xe576523});
      var plane = new THREE.Mesh(g,m);
      scene.add(plane);
      
      

      
      //console.log(struct.position.x+','+struct.position.y+','+struct.position.z);
      scene.add(player);
}


function animate() {
    requestAnimationFrame(animate);
    render();
    

      if (keyboard.pressed("left")){
          var dir = [-1,0,0];
          if(player.position.x > min_width)
                player.move(dir);
      }
      if (keyboard.pressed("right")){
          var dir = [1,0,0];
          if(player.position.x < max_width)
                player.move(dir);
      }
      if(keyboard.pressed("space")){
          console.log(player.can_fire);
          player.fire();
      }
    player.moveBullet();
    cameraControls.update();
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
