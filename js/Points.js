/**
 * Created by nickhoughton on 6/21/17.
 */

class Points extends Animation{
  constructor(ctx, can){
    super(ctx, can);
    $(document).bind("mousemove", this.mouseDownHandler );
    this.initShader();
    this.numVertices = this.circleVertices();
    if(this.numVertices < 0){
      console.log("Failed to create circle");
      return;
    }
  }

  getVertexShader(){
    return `
      attribute vec4 aPosition;
      uniform vec2 uScale;
      void main() {
          gl_Position.x = aPosition.x * uScale.x;
          gl_Position.y = aPosition.y * uScale.y;
          gl_Position.z = aPosition.z;
          gl_Position.w = 1.0;
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

    var width = this.CANVAS.getAttribute("width"), height = this.CANVAS.getAttribute("height");
    // Fullscreen if not set
    if (!width || width < 0) {
      this.CANVAS.width = window.innerWidth;
      this.glContext.maxWidth = window.innerWidth;
    }
    if (!height || height < 0) {
      this.CANVAS.height = window.innerHeight;
      this.glContext.maxHeight = window.innerHeight;
    }

    // viewport!
    this.glContext.viewport(0, 0, this.CANVAS.width, this.CANVAS.height);
    this.glContext.clearColor(241/255,238/255,217/255,1);
    this.glContext.clear(this.glContext.COLOR_BUFFER_BIT);
    this.glContext.drawArrays(this.glContext.TRIANGLE_STRIP, 0, this.numVertices);
    var uScale = this.glContext.getUniformLocation(this.shaderProgram, 'uScale');
    this.glContext.uniform2f(uScale, 0.5, 0.5);

  }
}
