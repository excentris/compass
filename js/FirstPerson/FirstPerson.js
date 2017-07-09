/**
 * Created by nickhoughton on 7/3/17.
 *
 * Tutorial: https://youtu.be/axGQAMqsxdw?list=PLCTVwBLCNozSGfxhCIiEH26tbJrQ2_Bw3
 */

class FirstPerson extends Scene{
  constructor(){
    let size = getViewport();
    super(0.5 * size[0], 0.5 * size[1], document.getElementById("canvasWrapper"), "firstPersonCanvas");
    this.player = new Player({camera: this.camera});
    this.RESOURCES_LOADED = false;
    this.initScene();
    this.animate();
  }

  initScene(){
    this.addLight();
    this.addBox();
    this.addCrate();
    this.addFloor();
    this.addLumberJack();
    this.setCameraPosition_XYZ(0, this.player.height,-5);
    this.setCameraLookAt_XYZ(0,this.player.height,0);
    this.animate();
  }

  addLumberJack(){
    this.loadOBJWithTexture("/models/lumberJack.obj", function(lumberJack){
      this.lumberJack = lumberJack;
      this.scene.add(lumberJack);
      this.lumberJack.position.y += 1;
      this.lumberJack.castShadow = true;
      this.lumberJack.receiveShadow = true;
      this.lumberJack.position.set(0, 1, 5.35);
    }.bind(this), "/models/lumberJack_diffuse.png", "/models/lumberJack_normal.png");
  }

  addBox(){
    this.mesh = new THREE.Mesh(
        new THREE.BoxGeometry(1,1,1),
        new THREE.MeshPhongMaterial({color: 0xdf6677, wireframe: false})
    );
    this.mesh.position.set(-4, 2, 4);
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
    this.textureLoader = new THREE.TextureLoader();
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
    this.crate.position.set(4.5, 3/2, 5.5);
    this.crate.receiveShadow = true;
    this.crate.castShadow = true;
    this.scene.add(this.crate);
  }

  addLight(){
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    this.scene.add(this.ambientLight);
    this.pointLight = new THREE.PointLight(0xffffff, 1.25, 18);
    this.pointLight.position.set(-3,4,3.3);
    this.pointLight.castShadow = true;
    this.pointLight.shadow.camera.near = 0.1;
    this.pointLight.shadow.camera.far = 40;
    this.scene.add(this.pointLight);
  }
  animate(){
    requestAnimationFrame(this.animate.bind(this));
    this.renderer.render(this.scene, this.camera);
    if(this.infoBox){
      this.infoBox.innerHTML = "X: " + this.camera.position.x.toFixed(3) + "&nbsp&nbsp&nbsp Z: " + this.camera.position.z.toFixed(3) + "&nbsp&nbsp&nbsp Y: " + this.camera.position.y.toFixed(3);
    }
    if(this.mesh){
      this.mesh.rotation.x += 0.01;
      this.mesh.rotation.y += 0.00;
    }
    this.player.update();

  }
}