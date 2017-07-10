/**
 * Created by nickhoughton on 7/4/17.
 */

class Player{
  constructor(params){
    this.height = params.height;
    this.moveSpeed = params.moveSpeed;
    this.rotSpeed = params.rotationSpeed;
    this.controls = new Controls(params);
    this.clock = new THREE.Clock();
    this.attachListeners();
  }

  setGun(g){
    this.gun = g;
  }

  updateGun(){
    const FREQUENCY = 6, AMPLITUDE = 0.01;
    const time = Date.now() * 0.0005;
    const delta = this.clock.getDelta();
    this.gun.position.set(
        this.controls.camera.position.x - Math.sin(this.controls.camera.rotation.y + Math.PI / 10) * 0.6,
        this.controls.camera.position.y - 0.25 + Math.sin(FREQUENCY * time + this.controls.camera.position.x + this.controls.camera.position.z) * AMPLITUDE,
        this.controls.camera.position.z + Math.cos(this.controls.camera.rotation.y + Math.PI / 10) * 0.6
    );

    this.gun.rotation.set(
        this.controls.camera.rotation.x,
        this.controls.camera.rotation.y + Math.PI,
        this.controls.camera.rotation.z,
    );
  }


  update(){
    this.controls.checkInput(this.moveSpeed, this.rotSpeed);
    this.updateGun();
  }

  attachListeners(){
    window.addEventListener('keydown', this.controls.keyDown.bind(this.controls));
    window.addEventListener('keyup', this.controls.keyUp.bind(this.controls));
  }
}