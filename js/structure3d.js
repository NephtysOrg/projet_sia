/**
 * This class define a basic structure object
 * @param {type} mesh_data
 * @returns {Structure3d}
 */
function Structure3d(mesh_data){
    
    THREE.Group.call(this); // Inheritance of Group
    this.hitbox;
    this.width = mesh_data.length;
    this.height = mesh_data[0].length;
    this.depth = 0;
    this.geometry;
    this.material = new THREE.MeshNormalMaterial();

    for (var i = 0; i < mesh_data.length; i++) {
        for (var j = 0; j < mesh_data[i].length; j++) {
            if (mesh_data[i][j] !== 0) {
                if (mesh_data[i][j] > this.depth)
                    this.depth = mesh_data[i][j] ;
                this.geometry =  new THREE.BoxGeometry(unit_size, unit_size, mesh_data[i][j]);
                var unitary_mesh = new THREE.Mesh(this.geometry, this.material);
                unitary_mesh.position.set(i,j,0);
                this.add(unitary_mesh);
            }
        }
    }
    // adding hitbox for collision detection
   var mat = new THREE.MeshBasicMaterial({wireframe : true});
   var geo = new THREE.BoxGeometry(unit_size*this.width,unit_size*this.height,unit_size*this.depth);
   hitbox = new THREE.Mesh(geo,mat);
   hitbox.translateX((this.width/2) - (unit_size/2));
   hitbox.translateY((this.height/2)- (unit_size/2));
   this.add(hitbox);
};

// Create a Structure3d.prototype object that inherits from Group.prototype
Structure3d.prototype = Object.create(THREE.Group.prototype);
// Set the "constructor" property to refer to Structure3d
Structure3d.prototype.constructor = Structure3d;

