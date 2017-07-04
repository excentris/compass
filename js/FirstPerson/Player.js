/**
 * Created by nickhoughton on 7/4/17.
 */

class Player{
  constructor(params){
    this.height = 1.8;
    this.moveSpeed = 0.01;
    this.controls = new Controls(params);
    this.attachListeners();
  }

  update(){
    this.controls.checkInput();
  }

  attachListeners(){
    window.addEventListener('keydown', this.controls.keyDown.bind(this.controls));
    window.addEventListener('keyup', this.controls.keyUp.bind(this.controls));
  }
}