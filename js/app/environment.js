function Environement(game) {
    THREE.Group.call(this);
    this.particles;
    this.ground;
    this.lights;
}
;
// Create a Army.prototype object that inherits from Group.prototype
Environement.prototype = Object.create(THREE.Group.prototype);
// Set the "constructor" property to refer to Army
Environement.prototype.constructor = Environement;

Environement.prototype.animate = function () {
    // add some rotation to the system
    this.particles.rotation.x += 0.001;
    this.particles.rotation.y += 0.003;
}

Environement.prototype.init = function (){
    this.initGround();
    this.initParticles();
    this.initLights();
}

Environement.prototype.initGround = function () {
        // create the ground plane
        var planeGeometry = new THREE.PlaneGeometry(map_width, map_height);
        var planeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff,opacity : 0.1, transparent : true});
        var plane = new THREE.Mesh(planeGeometry, planeMaterial);
        // rotate and position the plane
        plane.rotation.x = 90 * Math.PI;
        plane.position.x = 0;
        plane.position.y = 0;
        plane.position.z = -10;
        // add the plane to the scene
        this.add(plane);
        
        
    var totalGeom = new THREE.Geometry();
    var materials  = new Array();
    for (var j = 0; j < (planeGeometry.parameters.height /15); j++) {
        for (var i = 0; i < planeGeometry.parameters.width / 15; i++) {
            var height = Math.floor((Math.random() * 50) + 1);
            var grayness = Math.random() * 0.5 + 0.25;
            var material = new THREE.MeshLambertMaterial({color: grayness});
            material.color.setRGB( grayness, grayness, grayness );
            materials.push(material);
            var cubeGeometry = new THREE.BoxGeometry(10, 10, height);
            var cube = new THREE.Mesh(cubeGeometry, material);
             cube.grayness = grayness; // *** NOTE THIS
            cube.position.z = -50;
            cube.position.x = -((planeGeometry.parameters.width) / 2) + 2 + (i * 15);
            cube.position.y = -((planeGeometry.parameters.height) / 2) + 2 + (j * 15);
            cube.updateMatrix();
            totalGeom.merge( cube.geometry, cube.matrix );
            //this.add(cube);
        }
    }
    this.add(new THREE.Mesh(totalGeom,new THREE.MeshFaceMaterial(materials)));
};

Environement.prototype.initParticles = function () {
    console.log("init env");
    // create the particle variables
    var particleCount = 1800,
            particles = new THREE.Geometry();


// create the particle variables
    var pMaterial = new THREE.ParticleBasicMaterial({
        color: 0xFFFFFF,
        size: 10,
        map: THREE.ImageUtils.loadTexture(
                "medias/images/spikey.png"
                ),
        blending: THREE.AdditiveBlending,
        transparent: true
    });


// now create the individual particles
    for (var p = 0; p < particleCount; p++) {

        // create a particle with random
        // position values, -250 -> 250
        var pX = Math.random() * 2 * map_height - map_height,
                pY = Math.random() * 2 * map_height - map_height,
                pZ = Math.random() * 2 * map_height - map_height,
                particle = new THREE.Vector3(pX, pY, pZ);

        // add it to the geometry
        particles.vertices.push(particle);
    }

// create the particle system
    this.particles = new THREE.ParticleSystem(
            particles,
            pMaterial);

    // also update the particle system to
    // sort the particles which enables
    // the behaviour we want
    this.particles.sortParticles = true;
    // add it to the scene
    this.add(this.particles);
};


Environement.prototype.initLights = function (){
     var directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
        directionalLight.position.set(-20, 40, 60);
        this.add(directionalLight);
        // add subtle ambient lighting
        var ambientLight = new THREE.AmbientLight(0x292929);
        this.add(ambientLight);
}