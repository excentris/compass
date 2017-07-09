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

  update(){
    this.controls.checkInput(this.moveSpeed, this.rotSpeed);
  }

  attachListeners(){
    window.addEventListener('keydown', this.controls.keyDown.bind(this.controls));
    window.addEventListener('keyup', this.controls.keyUp.bind(this.controls));
  }
}