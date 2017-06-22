/**
 * Created by nickhoughton on 6/21/17.
 */
class Animation {

  constructor(ctx, can) {
    this.glContext = ctx;
    this.CANVAS = can;
  }

  getShader(source, type, typeString) {
    let shader = this.glContext.createShader(type);
    this.glContext.shaderSource(shader, source);
    this.glContext.compileShader(shader);

    if (!this.glContext.getShaderParameter(shader, this.glContext.COMPILE_STATUS)) {
      console.error("ERROR In " + typeString + " SHADER: " + this.glContext.getShaderInfoLog(shader));
      return false;
    }
    return shader;
  }
}