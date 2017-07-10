/**
 * Created by nickhoughton on 7/4/17.
 */

class Player{
  constructor(params){
    this.height = params.height;
    this.moveSpeed = params.moveSpeed;
    this.rotSpeed = params.rotationSpeed;
    this.controls = new Controls(params);
    this.attachListeners();
  }

  setGun(g){
    this.gun = g;
  }

  updateGun(){
    this.gun.position.set(
        this.controls.camera.position.x - Math.sin(this.controls.camera.rotation.y) * 0.5,
        this.controls.camera.position.y - 0.25,
        this.controls.camera.position.z + Math.cos(this.controls.camera.rotation.y) * 0.5
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