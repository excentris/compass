/**
 * Created by nickhoughton on 6/21/17.
 */

class Points extends Animation{
  constructor(ctx, can){
    super(ctx, can);
    //document.addEventListener("mousemove", this.mouseDownHandler);
    $(document).bind("mousemove", this.mouseDownHandler );
  }

  getVertexShader(){
    return `
      attribute vec4 aPosition;
      
      void main() {
        gl_Position = aPosition;
      }
    `;
  }

  getFragmentShader(){
    return `
      void main() {
        gl_FragColor = vec4(0.0, 1.0, 1.0, 1.0);
      }
    `;
  }

  circleVertices(){
    let vertices = [], vertCount = 2, vertexBuffer = this.glContext.createBuffer();
    for(let i = 0.0; i <= 360; ++i) {
      let j = i * Math.PI / 180;
      vertices = vertices.concat([Math.sin(j), Math.cos(j)]);
      vertices = vertices.concat([0, 0]);
    }

    this.glContext.bindBuffer(this.glContext.ARRAY_BUFFER, vertexBuffer);
    this.glContext.bufferData(this.glContext.ARRAY_BUFFER, new Float32Array(vertices), this.glContext.STATIC_DRAW);
    let vPosition = this.glContext.getAttribLocation(this.shaderProgram, "aPosition");
    this.glContext.enableVertexAttribArray(vPosition);
    this.glContext.vertexAttribPointer(vPosition, vertCount, this.glContext.FLOAT, false, 0, 0);

    return vertices.length / vertCount;
  }
  initShader(){
    let vertexShader = this.getShader(this.getVertexShader(), this.glContext.VERTEX_SHADER, "VERTEX");
    let fragmentShader = this.getShader(this.getFragmentShader(), this.glContext.FRAGMENT_SHADER, "FRAGMENT");
    this.shaderProgram = this.glContext.createProgram();
    this.glContext.attachShader(this.shaderProgram, vertexShader);
    this.glContext.attachShader(this.shaderProgram, fragmentShader);
    this.glContext.linkProgram(this.shaderProgram);
    if (!this.glContext.getProgramParameter(this.shaderProgram, this.glContext.LINK_STATUS)) {
      console.log('Unable to initialize the shader program: ' + this.glContext.getProgramInfoLog(this.shaderProgram));
    }
    this.glContext.useProgram(this.shaderProgram);
  }

  mouseDownHandler(e, xyz){
    console.log("MouseDown");
  }


  render(){
    this.initShader();
    let n = this.circleVertices();
    if(n < 0){
      console.log("Failed to create circle");
      return;
    }
    this.glContext.clearColor(241/255,238/255,217/255,1);
    this.glContext.clear(this.glContext.COLOR_BUFFER_BIT);
    this.glContext.drawArrays(this.glContext.TRIANGLE_STRIP, 0, n);
  }
}
