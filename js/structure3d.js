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

    for (var i = 0; i < mesh_data.length; i++) {
        for (var j = 0; j < mesh_data[i].length; j++) {
            if (mesh_data[i][j] !== 0) {
                if (mesh_data[i][j] > this.depth)
                    this.depth = mesh_data[i][j] ;
                var unitary_mesh = new THREE.Mesh(new THREE.BoxGeometry(unit_size, unit_size, mesh_data[i][j]), new THREE.MeshNormalMaterial());
                unitary_mesh.position.set(i,j,0);
                this.add(unitary_mesh);
            }
        }
    }
    // adding hitbox for collision detectio
   hitbox = new THREE.Mesh(new THREE.BoxGeometry(unit_size*this.width,unit_size*this.height,unit_size*this.depth),new THREE.MeshBasicMaterial({wireframe : true}));
   hitbox.translateX((this.width/2) - (unit_size/2));
   hitbox.translateY((this.height/2)- (unit_size/2));
   this.add(hitbox);
};

// Create a Structure3d.prototype object that inherits from Group.prototype
Structure3d.prototype = Object.create(THREE.Group.prototype);
// Set the "constructor" property to refer to Structure3d
Structure3d.prototype.constructor = Structure3d;

Structure3d.prototype.my_rotate = function (axis, radians){
    rotWorldMatrix = new THREE.Matrix4();
    rotWorldMatrix.makeRotationAxis(axis.normalize(), radians);
        rotWorldMatrix.multiply(this.matrix);                // pre-multiply

    this.matrix = rotWorldMatrix;
   this.rotation.setFromRotationMatrix(this.matrix);
};