/**
 * Created by nickhoughton on 6/21/17.
 */
var context = null;

function getViewport() {

  var viewPortWidth;
  var viewPortHeight;

  // the more standards compliant browsers (mozilla/netscape/opera/IE7) use window.innerWidth and window.innerHeight
  if (typeof window.innerWidth != 'undefined') {
    viewPortWidth = window.innerWidth,
        viewPortHeight = window.innerHeight
  }

// IE6 in standards compliant mode (i.e. with a valid doctype as the first line in the document)
  else if (typeof document.documentElement != 'undefined'
      && typeof document.documentElement.clientWidth !=
      'undefined' && document.documentElement.clientWidth != 0) {
    viewPortWidth = document.documentElement.clientWidth,
        viewPortHeight = document.documentElement.clientHeight
  }

  // older versions of IE
  else {
    viewPortWidth = document.getElementsByTagName('body')[0].clientWidth,
        viewPortHeight = document.getElementsByTagName('body')[0].clientHeight
  }
  return [viewPortWidth, viewPortHeight];
}

function getContext(CANVAS, ctxType) {
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

let PIXEL_RATIO = (function () {
  let ctx = document.createElement("canvas").getContext("2d"),
      dpr = window.devicePixelRatio || 1,
      bsr = ctx.webkitBackingStorePixelRatio ||
          ctx.mozBackingStorePixelRatio ||
          ctx.msBackingStorePixelRatio ||
          ctx.oBackingStorePixelRatio ||
          ctx.backingStorePixelRatio || 1;

  return dpr / bsr;
})();


function createHiDPICanvas(w, h, ratio, ctxType) {
  if (!ratio) {
    ratio = PIXEL_RATIO;
  }
  let oldCanvas = document.getElementById("canvas");
  if (oldCanvas) {
    oldCanvas.remove();
  }
  let can = document.createElement("canvas");
  can.width = w * ratio;
  can.height = h * ratio;
  can.style.width = w + "px";
  can.style.height = h + "px";
  can.id = "canvas";
  let ctx = getContext(can, ctxType);
  if (ctxType === "2d") {
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  }
  return [can, ctx];
}

Element.prototype.remove = function () {
  this.parentElement.removeChild(this);
};

NodeList.prototype.remove = HTMLCollection.prototype.remove = function () {
  for (let i = this.length - 1; i >= 0; i--) {
    if (this[i] && this[i].parentElement) {
      this[i].parentElement.removeChild(this[i]);
    }
  }
};

let LIBS = {
  degToRad: function (angle) {
    return (angle * Math.PI / 180);
  },

  get_projection: function (angle, a, zMin, zMax) {
    const tan = Math.tan(LIBS.degToRad(0.5 * angle)),
        A = -(zMax + zMin) / (zMax - zMin),
        B = (-2 * zMax * zMin) / (zMax - zMin);

    return [
      0.5 / tan, 0, 0, 0,
      0, 0.5 * a / tan, 0, 0,
      0, 0, A, -1,
      0, 0, B, 0
    ];
  }
};