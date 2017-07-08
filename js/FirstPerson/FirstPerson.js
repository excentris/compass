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

    this.textureLoader = new THREE.TextureLoader();
    this.objLoader = new THREE.ObjectLoader();

    this.addLight();
    this.addBox();
    this.addCrate();
    this.addFloor();
    //this.addCar();
    this.canvasWrapper.appendChild(this.canvas);
    this.setCameraPosition_XYZ(0, this.player.height,-5);
    this.setCameraLookAt_XYZ(0,this.player.height,0);
    this.animate();
  }

  addCar(){
    this.mtlLoader.load("/assets/Car/r8_gt_obj.mtl", function(mat){
      mat.preload();
      let objL = new THREE.ObjectLoader();
      objL.setMaterials(mat);
      objL.load("/assets/Car/r8_gt_obj.obj", function(mesh){
        this.scene.add(mesh);
      }.bind(this));
    }.bind(this));
  }

  loadObjectWithMaterial(objPath, materialPath){
    this.mtlLoader.load(materialPath, function(mat){
      mat.preload();
      let objL = new THREE.ObjectLoader();
      objL.setMaterials(mat);
      objL.load(objPath, function(mesh){
        return mesh;
      }.bind(this));
    }.bind(this));
  }

  addBox(){
    this.mesh = new THREE.Mesh(
        new THREE.BoxGeometry(1,1,1),
        new THREE.MeshPhongMaterial({color: 0xdf6677, wireframe: false})
    );
    this.mesh.position.y += 2;
    this.mesh.receiveShadow = true;
    this.mesh.castShadow = true;
    this.scene.add(this.mesh);
  }
  addFloor(){
    this.floor = new THREE.Mesh(
        new THREE.PlaneGeometry(20, 20, 10, 10),
        new THREE.MeshPhongMaterial({color: 0xffffff, wireframe:false})
    );
    this.floor.rotation.x -= Math.PI / 2;
    this.floor.receiveShadow = true;
    this.scene.add(this.floor);
  }

  addCrate(){
    this.crateTexture = new this.textureLoader.load("/assets/3crates/crate0/crate0_diffuse.png");
    this.crateBumpMap = new this.textureLoader.load("/assets/3crates/crate0/crate0_bump.png");
    this.crateNormal = new this.textureLoader.load("/assets/3crates/crate0/crate0_normal.png");
    this.crate = new THREE.Mesh(
        new THREE.BoxGeometry(3,3,3),
        new THREE.MeshPhongMaterial({
          color: 0xffffff,
          map: this.crateTexture,
          bumpMap: this.crateBumpMap,
          normalMap: this.crateNormal
        })
    );
    this.crate.position.set(2.5, 3/2, 2.5);
    this.crate.receiveShadow = true;
    this.crate.castShadow = true;
    this.scene.add(this.crate);
  }

  addLight(){
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    this.scene.add(this.ambientLight);
    this.pointLight = new THREE.PointLight(0xffffff, 0.8, 18);
    this.pointLight.position.set(-3,6,-3);
    this.pointLight.castShadow = true;
    this.pointLight.shadow.camera.near = 0.1;
    this.pointLight.shadow.camera.far = 25;
    this.scene.add(this.pointLight);
  }
  animate(){
    super.render();
    this.mesh.rotation.x += 0.01;
    this.mesh.rotation.y += 0.00;
    this.player.update();
  }
}