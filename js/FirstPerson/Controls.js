/**
 * Created by nickhoughton on 7/4/17.
 */

class Controls{
  constructor(params){
    this.camera = params.camera;
    this.keyboard = {};
    this.ROTATION_SPEED = 0.01;
    this.MOVEMENT_SPEED = 0.01;
    this.config = WSAD;
  }

  keyDown(event){
    this.keyboard[event.keyCode] = true;
  }

  keyUp(event){
    this.keyboard[event.keyCode] = false;
  }

  lookLeft(){

    switch(this.config){
      case WSAD:
        if(this.keyboard[Q_KEY]){
          this.camera.rotation.y -= Math.PI * this.ROTATION_SPEED;
        }
        break;
      case ARROW:
        if(this.keyboard[LEFT_ARROW_KEY]){
          this.camera.rotation.y -= Math.PI * this.ROTATION_SPEED;
        }
        break;
      default:

    }
  }
  
  lookRight(){
    switch(this.config){
      case WSAD:
        if(this.keyboard[E_KEY]){
          this.camera.rotation.y += Math.PI * this.ROTATION_SPEED;
        }
        break;
      case ARROW:
        if(this.keyboard[RIGHT_ARROW_KEY]){
          this.camera.rotation.y += Math.PI * this.ROTATION_SPEED;
        }
        break;
      default:

    }
  }

  strafeLeft(){
    if(this.keyboard[A_KEY]){
      this.camera.position.x += Math.cos(this.camera.rotation.y) * this.MOVEMENT_SPEED;
      this.camera.position.z += Math.sin(this.camera.rotation.y) * this.MOVEMENT_SPEED;
    }
  }

  strafeRight(){
    if(this.keyboard[D_KEY]){
      this.camera.position.x -= Math.cos(this.camera.rotation.y) * this.MOVEMENT_SPEED;
      this.camera.position.z -= Math.sin(this.camera.rotation.y) * this.MOVEMENT_SPEED;
    }
  }
  moveForward(){
    if(this.keyboard[W_KEY]){
      this.camera.position.x -= Math.sin(this.camera.rotation.y) * this.MOVEMENT_SPEED;
      this.camera.position.z += Math.cos(this.camera.rotation.y) * this.MOVEMENT_SPEED;
    }
  }

  moveBackward(){
    if(this.keyboard[S_KEY]){
      this.camera.position.x += Math.sin(this.camera.rotation.y) * this.MOVEMENT_SPEED;
      this.camera.position.z -= Math.cos(this.camera.rotation.y) * this.MOVEMENT_SPEED;
    }
  }

  checkInput(moveSpeed, rotSpeed){
    this.MOVEMENT_SPEED = moveSpeed || this.MOVEMENT_SPEED;
    this.ROTATION_SPEED = rotSpeed || this.ROTATION_SPEED;
    this.lookLeft();
    this.lookRight();
    this.moveForward();
    this.moveBackward();
    this.strafeRight();
    this.strafeLeft();
  }
}