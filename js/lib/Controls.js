/**
 * Created by nickhoughton on 7/4/17.
 */

class Controls{
  constructor(params){
    this.camera = params.camera;
    this.keyboard = {};
    this.ROTATION_SPEED = 0.01;
  }

  keyDown(event){
    this.keyboard[event.keyCode] = true;
  }

  keyUp(event){
    this.keyboard[event.keyCode] = false;
  }

  lookLeft(){
    if(this.keyboard[37]){
      this.camera.rotation.y -= Math.PI * this.ROTATION_SPEED;
    }
  }
  
  lookRight(){
    if(this.keyboard[39]){
      this.camera.rotation.y += Math.PI * this.ROTATION_SPEED;
    }
  }

  checkInput(){
    this.lookLeft();
    this.lookRight();
  }
}