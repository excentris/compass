/**
 * Created by nickhoughton on 6/23/17.
 */
/**
 *
 */
var UserProfile = {

  /** */
  UA_ANDROID: 'android',
  UA_IPHONE: 'iphone',
  UA_IPAD: 'ipad',

  isOnline: navigator.onLine,

  isAuthenticated: false,

  /**
   *
   */
  isTouchDevice: function() {
    if (navigator.userAgent.toLowerCase().indexOf(this.UA_ANDROID) != -1 ||
        navigator.userAgent.toLowerCase().indexOf(this.UA_IPHONE) != -1 ||
        navigator.userAgent.toLowerCase().indexOf(this.UA_IPAD) != -1 ) {
      return true;
    }
    else {
      return false;
    }
  },

  /**
   *
   */
  supportsAudio: function() {
    return !this.isTouchDevice();
  },

  /**
   *
   */
  supportsAjax: function() {
    return window.XMLHttpRequest != null && this.isOnline;
  },

  /**
   *
   */
  suportsLocalStorage: function() {
    return ('localStorage' in window) && window['localStorage'] !== null;
  }
};

/**
 * Holds generic AJAX communication functions.
 */
AJAX = {

  /**
   * Triggers an AJAX call using the POST method.
   *
   * @param {String} url The URL to invoke
   * @param {String} parameters Variables to send to the URL
   * @param {Function} success Called if the call succeeds
   * @param {Function} error Called if the call fails
   */
  post: function( url, parameters, success, error ) {
    this.post( url, parameters, success, error, 'POST' );
  },

  /**
   * Triggers an AJAX call using the GET method.
   *
   * @param {String} url The URL to invoke
   * @param {String} parameters Variables to send to the URL
   * @param {Function} success Called if the call succeeds
   * @param {Function} error Called if the call fails
   */
  get: function( url, parameters, success, error ) {
    this.post( url, parameters, success, error, 'GET' );
  },

  /**
   * Triggers an AJAX call using the supplied arguments.
   *
   * @param {String} url The URL to invoke
   * @param {String} parameters Variables to send to the URL
   * @param {Function} success Called if the call succeeds
   * @param {Function} error Called if the call fails
   * @param {String} method Called if the call fails
   */
  send: function( url, parameters, success, error, method ) {
    var request = new XMLHttpRequest();

    request.open(method, url, true);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    if( request ) {
      request.onreadystatechange = function() {
        if (request.readyState == 4) {
          if (request.status == 200) {
            success( request.responseText );
          } else {
            error( request.responseText );
          }
        }
      };

      request.send(parameters);
    }
  }
};

/**
 * Defines a 2D position.
 */
function Point( x, y ) {
  this.position = { x: x || 0, y: y || 0 };
}

Point.prototype.distanceTo = function(p) {
  var dx = p.x-this.position.x;
  var dy = p.y-this.position.y;
  return Math.sqrt(dx*dx + dy*dy);
};

Point.prototype.clonePosition = function() {
  return { x: this.position.x, y: this.position.y };
};

/**
 * Defines of a rectangular region.
 */
function Region() {
  this.left = 999999;
  this.top = 999999;
  this.right = 0;
  this.bottom = 0;
}

Region.prototype.reset = function() {
  this.left = 999999;
  this.top = 999999;
  this.right = 0;
  this.bottom = 0;
};

Region.prototype.inflate = function( x, y ) {
  this.left = Math.min(this.left, x);
  this.top = Math.min(this.top, y);
  this.right = Math.max(this.right, x);
  this.bottom = Math.max(this.bottom, y);
};

Region.prototype.contains = function( x, y ) {
  return x > this.left && x < this.right && y > this.top && y < this.bottom;
};

var p = new Point();
