/**
 * Created by nickhoughton on 7/3/17.
 *
 * Tutorial: https://youtu.be/axGQAMqsxdw?list=PLCTVwBLCNozSGfxhCIiEH26tbJrQ2_Bw3
 */

class FirstPerson extends Scene{
  constructor(){
    let size = getViewport();
    super(0.5 * size[0], 0.5 * size[1], document.getElementById("canvasWrapper"));
    this.player = new Player({camera: this.camera});
    this.initScene();
    this.animate();
  }

  initScene(){
    this.mesh = new THREE.Mesh(
        new THREE.BoxGeometry(1,1,1),
        new THREE.MeshBasicMaterial({color: 0xdf6677, wireframe: true})
    );

    this.floor = new THREE.Mesh(
        new THREE.PlaneGeometry(10, 10, 10, 10),
        new THREE.MeshBasicMaterial({color: 0xffffff, wireframe:true})
    );
    this.floor.rotation.x -= Math.PI / 2;
    this.scene.add(this.mesh);
    this.scene.add(this.floor);
    this.canvasWrapper.appendChild(this.canvas);
    this.setCameraPosition_XYZ(0, this.player.height,-5);
    this.setCameraLookAt_XYZ(0,this.player.height,0);
    this.animate();
  }

  animate(){
    super.render();
    this.mesh.rotation.x += 0.01;
    this.mesh.rotation.y += 0.00;
    this.player.update();
  }
}