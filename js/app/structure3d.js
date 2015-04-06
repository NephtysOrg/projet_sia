/**
 * This class define a basic structure object
 * @param {type} mesh_data
 * @returns {Structure3d}
 */
function Structure3d(mesh_data,hitboxed){
    
    THREE.Group.call(this); // Inheritance of Group
    this.hitbox;
    this.width = mesh_data.length;
    this.height = mesh_data[0].length;
    this.depth = 0;
    
   if(typeof hitboxed !== "undefined"){
        for (var i = 0; i < mesh_data.length; i++) {
            for (var j = 0; j < mesh_data[i].length; j++) {
                if (mesh_data[i][j] !== 0) {
                    if (mesh_data[i][j] > this.depth)
                        this.depth = mesh_data[i][j] ;
                    var unitary_mesh = new THREE.Mesh(new THREE.BoxGeometry(unit_size, unit_size, mesh_data[i][j]), new THREE.MeshPhongMaterial());
                    unitary_mesh.position.set(i,j,0);
                    this.add(unitary_mesh);
                }
            }
        }
   }else{
        var totalGeom = new THREE.Geometry();
        for (var i = 0; i < mesh_data.length; i++) {
            for (var j = 0; j < mesh_data[i].length; j++) {
                if (mesh_data[i][j] !== 0) {
                    if (mesh_data[i][j] > this.depth)
                        this.depth = mesh_data[i][j] ;
                    var unitary_mesh = new THREE.Mesh(new THREE.BoxGeometry(unit_size, unit_size, mesh_data[i][j]), new THREE.MeshNormalMaterial());
                    unitary_mesh.position.set(i,j,0);
                    unitary_mesh.updateMatrix();
                    totalGeom.merge( unitary_mesh.geometry, unitary_mesh.matrix );
                }
            }
        }
    this.add(new THREE.Mesh(totalGeom,new THREE.MeshPhongMaterial()));
    hitbox = new THREE.Mesh(new THREE.BoxGeometry(unit_size*this.width,unit_size*this.height,unit_size*this.depth),new THREE.MeshBasicMaterial({visible : false}));
    hitbox.translateX((this.width/2) - (unit_size/2));
    hitbox.translateY((this.height/2)- (unit_size/2));
    this.add(hitbox);
   }
   
//this.castShadow = true;
//this.receiveShadow = true;
};

// Create a Structure3d.prototype object that inherits from Group.prototype
Structure3d.prototype = Object.create(THREE.Group.prototype);
// Set the "constructor" property to refer to Structure3d
Structure3d.prototype.constructor = Structure3d;