function Environement(game) {
    THREE.Group.call(this);
    this.particles;
    this.ground;
    this.ground_lights = new Array();
}
;
var light1, light2, light3, light4, light5, light6;
// Create a Army.prototype object that inherits from Group.prototype
Environement.prototype = Object.create(THREE.Group.prototype);
// Set the "constructor" property to refer to Army
Environement.prototype.constructor = Environement;

Environement.prototype.animate = function () {
    // add some rotation to the system
    var time = Date.now() * 0.00025;
    
    var d1 = map_width/2;
    var d2 = map_height/2;
    this.particles.rotation.x +=  (Math.cos( time * 0.7 )+Math.sin( time * 0.7 ))/1000;
    this.particles.rotation.y += (Math.cos( time * 0.3 )+Math.sin( time * 0.3 ))/1000;
    for (var i = 0 ; i < this.ground_lights.length; i++){
        this.ground_lights[i][0].position.x = Math.sin( time * this.ground_lights[i][1] ) * d1;
	this.ground_lights[i][0].position.y = Math.cos( time * this.ground_lights[i][2] ) * d2;
    }
};

Environement.prototype.init = function () {
    				
    this.initGround();
    this.initParticles();
    this.initLights();
    this.add(this.ground);
    this.add(this.particles);
};

Environement.prototype.initGround = function () {
    this.ground = new THREE.Group();
    
    var groundColor = Please.make_color({hue: 120,saturation: .5});
    var totalGeom = new THREE.Geometry();
    console.log(Math.floor(Math.random() * 16777215).toString(16));
    var material = new THREE.MeshPhongMaterial( { 
    color: groundColor, 
    ambient: 0xffffff, // should generally match color
    specular: 0x050505,
    shininess: 100
} );
    for (var j = 0; j < map_height / 10; j++) {
        for (var i = 0; i < map_width / 10; i++) {
            var height = Math.floor((Math.random() * 50) + 0);
            var cubeGeometry = new THREE.BoxGeometry(8, 8, height);
            var cube = new THREE.Mesh(cubeGeometry, material);
            cube.position.z = -50;
            cube.position.x = -(map_width / 2) + 2 + (i * 10);
            cube.position.y = -(map_height / 2) + 2 + (j * 10);
            cube.updateMatrix();
            cube.castShadow = true;
            this.receiveShadow = true;
            totalGeom.merge(cube.geometry, cube.matrix);
        }
    }
    this.ground.add(new THREE.Mesh(totalGeom, material));
};

Environement.prototype.initParticles = function () {
    // create the particle variables
    var particleCount = 1800,
            particles = new THREE.Geometry();


    var pMaterial = new THREE.ParticleBasicMaterial({
        color: 0xFFFFFF,
        size: 10,
        map: THREE.ImageUtils.loadTexture(
                "medias/images/spikey.png"
                ),
        blending: THREE.AdditiveBlending,
        transparent: true
    });
    for (var p = 0; p < particleCount; p++) {
        var pX = Math.random() * 2 * map_height - map_height,
                pY = Math.random() * 2 * map_height - map_height,
                pZ = Math.random() * 2 * map_height - map_height,
                particle = new THREE.Vector3(pX, pY, pZ);
        particles.vertices.push(particle);
    }

    this.particles = new THREE.ParticleSystem(
            particles,
            pMaterial);


    this.particles.sortParticles = true;
};


Environement.prototype.initLights = function () {

    var light_numer = 6;
    var colors = Please.make_scheme(
{
    h: 130,
    s: .7,
    v: .75
},
{
    scheme_type: 'double',
    format: 'hex'
});
       console.log(colors);
    var intensity;
    var distance;
    var z;
    var sphere = new THREE.SphereGeometry( 1, 16, 8 );
    for (var i = 0 ; i < light_numer; i++){
        intensity = Math.floor((Math.random()*2)+1);
        distance = Math.floor((Math.random()*100)+50);
        z = -Math.floor((Math.random()*25)-10);
        
        light = new THREE.PointLight( colors[i], intensity, distance );
	light.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: colors[i] } ) ) );
        this.ground_lights[i] = new Array();
        this.ground_lights[i][0] = light;
        this.ground_lights[i][1] = Math.random(); // The speed of the light
        this.ground_lights[i][2] = Math.random(); // The speed of the light
        light.position.set(Math.random()*map_width,Math.random()*map_height,z);
	this.add( light );
    }
    console.log(this.ground_lights);

};

Environement.prototype.clearGround = function () {
    this.remove(this.ground);
};
       