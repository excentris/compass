/**
 * Created by nickhoughton on 6/21/17.
 */
var points = [];

class Points extends Animation{
  constructor(ctx, can){
    super(ctx, can);
  }

  getVertexShader(){
    return `
      attribute vec3 _xy;
      void main(){
        gl_Position = vec4(_xy, 1.0);
        gl_PointSize = 20.0;
      }
    `;
  }

  getFragmentShader(){
    return `
      precision mediump float;
      void main(){
        float d = distance(gl_PointCoord, vec2(0.5, 0.5));
        if(d < 0.5){
          gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
        }
        else{
          discard;
        }
      }
    `;
  }

  initShader(){
    let vertexShader = this.getShader(this.getVertexShader(), this.glContext.VERTEX_SHADER, "VERTEX");
    let fragmentShader = this.getShader(this.getFragmentShader(), this.glContext.FRAGMENT_SHADER, "FRAGMENT");
    this.shaderProgram = this.glContext.createProgram();
    this.glContext.attachShader(this.shaderProgram, vertexShader);
    this.glContext.attachShader(this.shaderProgram, fragmentShader);
    this.glContext.linkProgram(this.shaderProgram);
  }
  mouseDownHandler(e, xyz){
    let xClick = e.clientX;
    let yClick = e.clientY;

    let x = (xClick / this.CANVAS.width);
    let y = (yClick / this.CANVAS.height);

    points.push([x,y]);

    for(var i = 0; i < points.length; i++){
      this.glContext.vertexAttrib3f(xyz, points[i][0], points[i][1], 0.0);
      this.glContext.drawArrays(this.glContext.POINTS, 0, 1);
    }
  }

  drawCircle(x, y, xy){
    points.push([x,y]);

    for(var i = 0; i < points.length; i++){
      this.glContext.vertexAttrib3f(xy, points[i][0], points[i][1], 0.0);
      this.glContext.drawArrays(this.glContext.POINTS, 0, 1);
    }
  }

  render(){
    this.initShader();
    let xy = this.glContext.getAttribLocation(this.shaderProgram, "_xy");
    this.drawCircle(0.5, 0.5, xy);
  }
}
