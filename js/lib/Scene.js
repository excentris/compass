/**
 * Created by nickhoughton on 7/3/17.
 */

class Scene{
  constructor(w, h){
    this.width = w;
    this.height = h;
    this.w_h_ratio = this.width / this.height;
    this.init();
  }

  init(){
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(90, this.width/this.height, 0.1, 1000);

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(this.width, this.height);
    this.setCameraPosition(0,0,0);
    this.setCameraLookAt(0,0,0);
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
  }
}