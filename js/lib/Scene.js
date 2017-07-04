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
    this.controls = new Controls({camera: this.camera});
    this.renderer = new THREE.WebGLRenderer();
    this.canvas = this.renderer.domElement;
    this.renderer.setSize(this.width, this.height);
    this.setCameraPosition(0,0,0);
    this.setCameraLookAt(0,0,0);
    this.attachListeners();
  }

  onWindowResize(){
    let size = getViewport();


    this.camera.aspect = size[0] / size[1];
    this.camera.updateProjectionMatrix();
    this.renderer.setSize( 0.5 * size[0], 0.5 * size[1]);
  }

  setCameraPosition(x,y,z){
    this.camera.position.set(x,y,z);
  }

  setCameraLookAt(x,y,z){
    this.camera.lookAt(new THREE.Vector3(x,y,z));
  }

  render(){
    requestAnimationFrame(this.animate.bind(this));
    this.renderer.render(this.scene, this.camera);
    this.controls.checkInput();
  }

  attachListeners(){
    window.addEventListener( 'resize', this.onWindowResize.bind(this), false );
    window.addEventListener('keydown', this.controls.keyDown.bind(this.controls));
    window.addEventListener('keyup', this.controls.keyUp.bind(this.controls));
  }
}