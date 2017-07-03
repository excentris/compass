/**
 * Created by nickhoughton on 6/20/17.
 */


function main(){
  let canvas = document.createElement("canvas");
  document.body.appendChild(canvas);
  let ctx = getContext(canvas, "experimental-webgl");
  ctx.canvas.width = window.innerWidth;

  let points = new Points(ctx, canvas);
  window.addEventListener('resize', points.render());
  points.render();
}

// window.onload = main;