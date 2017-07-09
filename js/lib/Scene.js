/**
 * Created by nickhoughton on 7/3/17.
 */

class Scene{
  constructor(w, h, cW, cN){
    this.width = w;
    this.height = h;
    this.canvasWrapper = cW;
    this.w_h_ratio = this.width / this.height;
    this.canvasName = cN;
    this.init();
  }

  init(){
    this.canvas = document.getElementById(this.canvasName);
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(90, this.width/this.height, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({canvas: this.canvas});
    this.renderer.setSize(this.width, this.height);
    this.addInfoBox();
    this.setCameraPosition_XYZ(0,0,0);
    this.setCameraLookAt_XYZ(0,0,0);
    this.attachListeners();
    this.setResponseMethods();
  }

  addInfoBox(){
    this.infoBox = document.getElementById("infoBox");
  }
  setResponseMethods(){
    this.onProgress = function ( xhr ) {
      if ( xhr.lengthComputable ) {
        var percentComplete = xhr.loaded / xhr.total * 100;
        console.log( Math.round(percentComplete, 2) + '% downloaded' );
      }
    };

    this.onError = function(xhr){

    }
  }

  loadObjectWithMaterial(objPath, materialPath, callback){
    let mtlLoader = new THREE.MTLLoader();
    mtlLoader.load(materialPath, function(mat){
      mat.preload();
      let objL = new THREE.OBJLoader();
      objL.setMaterials(mat);
      objL.load(objPath, function(mesh){
        callback(mesh);
      }.bind(this));
    }.bind(this));
  }

  loadOBJWithTexture(path, callback, diff, norm, bump){
    let texLoader = new THREE.TextureLoader(), texture, bumpMap, normal;
    if(diff) texture = new texLoader.load(diff);
    if(bump) bumpMap = new texLoader.load(bump);
    if(norm) normal = new texLoader.load(norm);
    let loader = new THREE.OBJLoader();
    loader.load( path, function( object ) {
      object.traverse( function( child ) {
        if ( child instanceof THREE.Mesh ) {
          if(texture) child.material.map = texture;
          if(bumpMap) child.material.bumpMap = bumpMap;
          if(normal) child.material.normalMap = normal;
        }
      } );
      callback(object);
    }, this.onProgress, this.onError );
  }
  
  loadOBJNoMaterial(path, callback, colour){
    let objLoader = new THREE.OBJLoader();
    if(!colour){
      colour = 'yellow';
    }
    let material = new THREE.MeshBasicMaterial({color: colour, side: THREE.DoubleSide});
    objLoader.load(path, function (obj) {
      obj.traverse(function (child) {

        if (child instanceof THREE.Mesh) {
          child.material = material;
        }
      });
      callback(obj);
    }.bind(this));
  }

  onWindowResize(){
    let size = getViewport();

    this.camera.aspect = size[0] / size[1];
    this.camera.updateProjectionMatrix();
    this.renderer.setSize( 0.5 * size[0], 0.5 * size[1]);
  }

  setCameraPosition_XYZ(x, y, z){
    this.camera.position.set(x,y,z);
  }

  setCameraPosition_Vec3(vec){
    this.camera.position.set(vec.x,vec.y,vec.z);
  }

  setCameraLookAt_XYZ(x, y, z){
    this.camera.lookAt(new THREE.Vector3(x,y,z));
  }

  setCameraLookAt_Vec3(vec){
    this.camera.lookAt(vec);
  }

  render(){
    requestAnimationFrame(this.animate.bind(this));
    this.renderer.render(this.scene, this.camera);
  }

  attachListeners(){
    window.addEventListener( 'resize', this.onWindowResize.bind(this), false );
  }
}