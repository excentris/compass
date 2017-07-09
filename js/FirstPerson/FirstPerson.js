/**
 * Created by nickhoughton on 7/3/17.
 *
 * Tutorial: https://youtu.be/axGQAMqsxdw?list=PLCTVwBLCNozSGfxhCIiEH26tbJrQ2_Bw3
 */
class FirstPerson extends Scene {
  constructor() {
    let size = getViewport();
    super(0.5 * size[0], 0.5 * size[1], "firstPersonCanvas");
    this.models = {
      tent: {
        obj: '/models/Tent_Poles_01.obj',
        mtl: '/models/Tent_Poles_01.mtl',
        mesh: null
      },
      campfire: {
        obj: 'models/Campfire_01.obj',
        mtl: 'models/Campfire_01.mtl',
        mesh: null
      },
      pirateship: {
        obj: 'models/Pirateship.obj',
        mtl: 'models/Pirateship.mtl',
        mesh: null
      }
    };

    this.initLoadingScreen();
    this.initScene();
    this.animate();
  }

  initLoadingScreen() {
    this.loadingScreen = {
      scene: new THREE.Scene(),
      camera: new THREE.PerspectiveCamera(45, this.width / this.height, 0.1, 1000),
      box: new THREE.Mesh(
          new THREE.BoxGeometry(0.5, 0.5, 0.5),
          new THREE.MeshBasicMaterial({
            color: 0x4444ff
          })
      )
    };
    this.loadingScreen.box.position.set(0, 0, 5);
    this.loadingScreen.camera.lookAt(this.loadingScreen.box.position);
    this.loadingScreen.scene.add(this.loadingScreen.box);
  }


  initScene() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.1, 1000);
    this.addInfoBox();
    this.setCameraPosition_XYZ(0, 0, 0);
    this.setCameraLookAt_XYZ(0, 0, 0);
    this.attachListeners();

    this.addLight();
    this.addBox();
    //this.addCrate();
    this.addFloor();
    this.addLumberJack();

    this.player = new Player({
      camera: this.camera,
      height: 1.8,
      moveSpeed: 0.03,
      rotationSpeed: Math.PI * 0.003
    });
    this.setCameraPosition_XYZ(0, this.player.height, -5);
    this.setCameraLookAt_XYZ(0, this.player.height, 0);
    this.animate();
  }

  addLumberJack() {
    this.loadOBJWithTexture("/models/lumberJack.obj", function(lumberJack) {
      this.lumberJack = lumberJack;
      this.scene.add(lumberJack);
      this.lumberJack.position.y += 1;
      this.lumberJack.castShadow = true;
      this.lumberJack.receiveShadow = true;
      this.lumberJack.position.set(0, 1, 5.35);
      this.lumberJacks = {};
      this.addManyLumberJacks(3);
    }.bind(this), "/models/lumberJack_diffuse.png", "/models/lumberJack_normal.png");
  }

  addManyLumberJacks(num){
    for(let i = 0; i < num; ++i){
      this.lumberJacks[i] = this.lumberJack.clone();
      this.lumberJacks[i].position.set(generateRandomFloatRange(0, 10), 1, generateRandomFloatRange(0, 10));
      this.scene.add(this.lumberJacks[i]);
    }
  }

  addBox() {
    this.mesh = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.MeshPhongMaterial({
          color: 0xdf6677,
          wireframe: false
        })
    );
    this.mesh.position.set(-4, 2, 4);
    this.mesh.receiveShadow = true;
    this.mesh.castShadow = true;
    this.scene.add(this.mesh);
  }

  addFloor() {
    this.floor = new THREE.Mesh(
        new THREE.PlaneGeometry(20, 20, 10, 10),
        new THREE.MeshPhongMaterial({
          color: 0xffffff,
          wireframe: false
        })
    );
    this.floor.rotation.x -= Math.PI / 2;
    this.floor.receiveShadow = true;

    this.scene.add(this.floor);
  }

  addCrate() {
    this.textureLoader = new THREE.TextureLoader(this.loadingManager);
    this.crateTexture = new this.textureLoader.load("/assets/3crates/crate0/crate0_diffuse.png");
    this.crateBumpMap = new this.textureLoader.load("/assets/3crates/crate0/crate0_bump.png");
    this.crateNormal = new this.textureLoader.load("/assets/3crates/crate0/crate0_normal.png");
    this.crate = new THREE.Mesh(
        new THREE.BoxGeometry(3, 3, 3),
        new THREE.MeshPhongMaterial({
          color: 0xffffff,
          map: this.crateTexture,
          bumpMap: this.crateBumpMap,
          normalMap: this.crateNormal
        })
    );
    this.crate.position.set(4.5, 3 / 2, 5.5);
    this.crate.receiveShadow = true;
    this.crate.castShadow = true;
    this.scene.add(this.crate);
  }

  addLight() {
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    this.scene.add(this.ambientLight);
    this.pointLight = new THREE.PointLight(0xffffff, 1.25, 18);
    this.pointLight.position.set(-3, 4, 3.3);
    this.pointLight.castShadow = true;
    this.pointLight.shadow.camera.near = 0.1;
    this.pointLight.shadow.camera.far = 40;
    this.scene.add(this.pointLight);
  }
  animate() {
    if (!this.RESOURCES_LOADED) {
      requestAnimationFrame(this.animate.bind(this));
      this.loadingScreen.box.position.x -= 0.05;
      if (this.loadingScreen.box.position.x < -5) {
        this.loadingScreen.box.position.x = 5;
      }
      this.loadingScreen.box.position.y = Math.sin(this.loadingScreen.box.position.x);
      this.renderer.render(this.loadingScreen.scene, this.loadingScreen.camera);
    } else {
      requestAnimationFrame(this.animate.bind(this));
      this.renderer.render(this.scene, this.camera);
      if (this.infoBox) {
        this.infoBox.innerHTML = "X: " + this.camera.position.x.toFixed(3) + "&nbsp&nbsp&nbsp Z: " + this.camera.position.z.toFixed(3) + "&nbsp&nbsp&nbsp Y: " + this.camera.position.y.toFixed(3);
      }
      if (this.mesh) {
        this.mesh.rotation.x += 0.01;
        this.mesh.rotation.y += 0.00;
      }
      if (this.lumberJack) {
        this.lumberJack.rotation.y += Math.PI / 256;
      }
      this.player.update();
    }


  }
}