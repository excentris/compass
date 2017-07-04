/**
 * Created by nickhoughton on 7/3/17.
 */

class Scene{
  constructor(w, h, cW){
    this.width = w;
    this.height = h;
    this.canvasWrapper = cW;
    this.w_h_ratio = this.width / this.height;
    this.init();
  }

  init(){
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(90, this.width/this.height, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer();
    this.canvas = this.renderer.domElement;
    this.renderer.setSize(this.width, this.height);
    this.setCameraPosition_XYZ(0,0,0);
    this.setCameraLookAt_XYZ(0,0,0);
    this.attachListeners();
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