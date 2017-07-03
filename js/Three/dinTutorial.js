/**
 * Created by nickhoughton on 6/24/17.
 */

class DinTutorial{

  constructor(){
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 1, 1000);
    this.renderer = new THREE.WebGLRenderer();

    this.renderer.setSize(window.innerWidth/2, window.innerHeight/2);
    this.renderer.setClearColor(0x4c4c4c);
    document.body.appendChild(this.renderer.domElement);

    this.addMesh();
    this.addLight();
    this.addGrid();
    this.controls = new THREE.TrackballControls(this.camera);
    this.controls.rotateSpeed = 1.0;
    this.controls.zoomSpeed = 1.2;
    this.controls.panSpeed = 0.8;
    this.controls.noZoom = false;
    this.controls.noPan = false;
    this.controls.staticMoving = true;
    this.controls.dynamicDampingFactor = 0.3;
    this.controls.keys = [ 65, 83, 68 ];
    this.controls.addEventListener( 'change', this.al.bind(this) );
    this.camera.position.set(55, 5, 20);
    this.render();
  }

  al(){
    console.log("Change");
  }
  addGrid(){
    this.gridHelper = new THREE.GridHelper( 1000, 20 );
    this.scene.add( this.gridHelper );
  }

  addMesh(){
    this.geometry = new THREE.BoxGeometry(5,5,5);
    this.material = new THREE.MeshLambertMaterial({color: 0xf6546a});
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
  }

  addLight(){
    // (color, intensity)
    this.light = new THREE.PointLight(0xffffff, 1.2);
    this.light.position.set(0,0,6);
    this.scene.add(this.light);
  }

  render(){
    requestAnimationFrame(this.render.bind(this));
    this.mesh.rotation.x += 0.01;
    this.mesh.rotation.y += 0.005;
    this.renderer.render(this.scene, this.camera);
    this.controls.update();
  }
}