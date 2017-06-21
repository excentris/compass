/**
 * Created by nickhoughton on 6/20/17.
 */


function main(){
  let canvas = document.getElementById("landingPageCanvas");
  let ctx = getContext(canvas, "2d");
  ctx.canvas.width = window.innerWidth;
}


function getContext(CANVAS, ctxType) {
  let context;
  try {
    if (ctxType === null || ctxType === "2d") {
      context = CANVAS.getContext("2d");
    } else if (ctxType === "experimental-webgl") {
      context = CANVAS.getContext("experimental-webgl", {antialias: false});
    } else {
      context = CANVAS.getContext("2d");
    }
    return context;
  } catch (e) {
    console.error("You are not using a browser with WebGL");
    return false;
  }
}
window.onload = main;