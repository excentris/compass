/**
 * Created by nickhoughton on 7/3/17.
 */

class Scene{
  constructor(w, h, cN){
    this.width = w;
    this.height = h;
    this.w_h_ratio = this.width / this.height;
    this.canvasName = cN;
    this.loadingManager = new THREE.LoadingManager();
    this.RESOURCES_LOADED = false;
    this.setResponseMethods();
    this.init();
  }

  init(){
    this.canvas = document.getElementById(this.canvasName);
    this.renderer = new THREE.WebGLRenderer({canvas: this.canvas});
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.BasicShadowMap;
    this.renderer.setSize(this.width, this.height);
  }

  addInfoBox(){
    this.infoBox = document.getElementById("infoBox");
  }
  setResponseMethods(){
    this.loadingManager.onProgress = function(item, loaded, total){
      console.log(item, loaded, total);
    };
    
    this.loadingManager.onLoad = function() {
      console.log("Loaded All Resources");
      this.RESOURCES_LOADED = true;
      this.onResourcesLoaded();
    }.bind(this);
  }

  onResourcesLoaded(){

  }

  loadObjectWithMaterial(objPath, materialPath, callback){
    let mtlLoader = new THREE.MTLLoader(this.loadingManager);
    mtlLoader.load(materialPath, function(mat){
      mat.preload();
      let objL = new THREE.OBJLoader(this.loadingManager);
      objL.setMaterials(mat);
      objL.load(objPath, function(mesh){
        callback(mesh);
      }.bind(this));
    }.bind(this));
  }

  loadOBJWithTexture(path, callback, diff, norm, bump){
    let texLoader = new THREE.TextureLoader(this.loadingManager), texture, bumpMap, normal;
    if(diff) texture = new texLoader.load(diff);
    if(bump) bumpMap = new texLoader.load(bump);
    if(norm) normal = new texLoader.load(norm);
    let loader = new THREE.OBJLoader(this.loadingManager);
    loader.load( path, function( object ) {
      object.traverse( function( child ) {
        if ( child instanceof THREE.Mesh ) {
          if(texture) child.material.map = texture;
          if(bumpMap) child.material.bumpMap = bumpMap;
          if(normal) child.material.normalMap = normal;
          child.castShadow = true;
          child.receiveShadow = true;
        }
      } );
      callback(object);
    }, this.onProgress, this.onError );
  }
  
  loadOBJNoMaterial(path, callback, colour){
    let objLoader = new THREE.OBJLoader(this.loadingManager);
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

  attachListeners(){
    window.addEventListener( 'resize', this.onWindowResize.bind(this), false );
  }
}