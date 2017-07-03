/**
 * Created by nickhoughton on 7/3/17.
 *
 * Tutorial: https://youtu.be/axGQAMqsxdw?list=PLCTVwBLCNozSGfxhCIiEH26tbJrQ2_Bw3
 */

class FirstPerson{
  constructor(){
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(90, 1280/720, 0.1, 1000);
    this.mesh = new THREE.Mesh(
        new THREE.BoxGeometry(1,1,1),
        new THREE.MeshBasicMaterial({color: 0xdf6677, wireframe: true})
    );

    this.scene.add(this.mesh);

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(1280, 720);
    document.body.appendChild(this.renderer.domElement);
    this.camera.position.set(0,0,-5);
    this.camera.lookAt(new THREE.Vector3(0,0,0));
    this.animate();
  }

  animate(){
    requestAnimationFrame(this.animate.bind(this));
    this.mesh.rotation.x += 0.01;
    this.mesh.rotation.y += 0.01;
    this.renderer.render(this.scene, this.camera);
  }
}

window.onload = function(){
  new FirstPerson();
};