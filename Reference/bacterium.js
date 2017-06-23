/**
 * Created by nickhoughton on 6/23/17.
 */

/**
 * Demo http://lab.hakim.se/bacterium/01/
 */
var BacteriumWorld = new function() {

  // The size that the game will render at on a desktop browser
  var DEFAULT_WIDTH = 900;
  var DEFAULT_HEIGHT = 500;

  // The number of times the game will be redrawn per second
  var FRAMERATE = 60;

  var MAX_TURBINE_RADIUS = 100;

  // The world dimensions, defaults to full screen for touch devices
  var world = {
    x: 0,
    y: 0,
    width: UserProfile.isTouchDevice() ? window.innerWidth : DEFAULT_WIDTH,
    height: UserProfile.isTouchDevice() ? window.innerHeight : DEFAULT_HEIGHT
  };

  var gravity = { x: 0, y: 2 };

  // The canvas and its 2D context
  var canvas;
  var context;

  // The current state of the mouse
  var mouse = { x: 0, y: 2, down: false };

  // The current state of the keyboard
  var key = { spaceDown: false };

  // Contains settings that are saved and restored between sessions
  var settings = {
    gravityEnabled: false,
    depthEnabled: false,
    turbinesEnabled: false,
    infectionEnabled: true
  };

  // Holds all of out Foam and Turbine instances
  var bacteriaPool = [];
  var turbinePool = [];

  var ui = {
    instructions: null,
    options: null,
    gravitySwitch: null,
    gravitySwitchState: null,
    depthSwitch: null,
    depthSwitchState: null,
    turbinesSwitch: null,
    turbinesSwitchState: null,
    infectionSwitch: null,
    infectionSwitchState: null
  };


  /**
   * Initializes the game world and rendering.
   */
  this.initialize = function(){

    // Collect references to all DOM elements being used
    canvas = document.getElementById('world');

    ui.instructions = document.getElementById('instructions');
    ui.options = document.getElementById('options');
    ui.resetButton = document.getElementById('reset-button');
    ui.gravitySwitch = document.getElementById('gravity-switch');
    ui.gravitySwitchState = ui.gravitySwitch.getElementsByTagName( 'span' )[0];
    ui.depthSwitch = document.getElementById('depth-switch');
    ui.depthSwitchState = ui.depthSwitch.getElementsByTagName( 'span' )[0];
    ui.turbinesSwitch = document.getElementById('turbines-switch');
    ui.turbinesSwitchState = ui.turbinesSwitch.getElementsByTagName( 'span' )[0];
    ui.infectionSwitch = document.getElementById('infection-switch');
    ui.infectionSwitchState = ui.infectionSwitch.getElementsByTagName( 'span' )[0];

    // Make sure that the Canvas element is available before continuing
    if (canvas && canvas.getContext) {
      context = canvas.getContext('2d');

      // Register event listeners
      document.addEventListener('mousemove', documentMouseMoveHandler, false);
      canvas.addEventListener('mousedown', documentMouseDownHandler, false);
      document.addEventListener('mouseup', documentMouseUpHandler, false);
      canvas.addEventListener('touchstart', documentTouchStartHandler, false);
      document.addEventListener('touchmove', documentTouchMoveHandler, false);
      document.addEventListener('touchend', documentTouchEndHandler, false);
      document.addEventListener('keydown', documentKeyDownHandler, false);
      document.addEventListener('keyup', documentKeyUpHandler, false);
      window.addEventListener('resize', windowResizeHandler, false);
      ui.resetButton.addEventListener('click', resetButtonClickedHandler, false);
      ui.gravitySwitch.addEventListener('click', gravitySwitchClickedHandler, false);
      ui.depthSwitch.addEventListener('click', depthSwitchClickedHandler, false);
      ui.turbinesSwitch.addEventListener('click', turbinesSwitchClickedHandler, false);
      ui.infectionSwitch.addEventListener('click', infectionSwitchClickedHandler, false);

      // Attempts to restore settings from saved data if there is any
      restoreSettings();

      updateUI();

      // Force an initial resize to make sure the UI is sized correctly
      windowResizeHandler();

      ui.instructions.style.display = 'block';
      ui.options.style.display = 'block';

      // If we are on a touch device, certain elements need to be configured differently
      if( UserProfile.isTouchDevice() ) {
        // TODO: Hide excess UI that does not work on small screens
      }

      // Initiate the main render loop of the game
      setInterval( loop, 1000 / FRAMERATE );

    }
  };

  /**
   * Restores settings from local storage if there are
   * any historical records.
   */
  function restoreSettings() {
    if( UserProfile.suportsLocalStorage() ) {
      var gravityEnabled = localStorage[ 'gravityEnabled' ];
      var depthEnabled = localStorage[ 'depthEnabled' ];
      var turbinesEnabled = localStorage[ 'turbinesEnabled' ];
      var infectionEnabled = localStorage[ 'infectionEnabled' ];

      if( gravityEnabled ) {
        settings.gravityEnabled = gravityEnabled == 'true';
      }

      if( depthEnabled ) {
        settings.depthEnabled = depthEnabled == 'true';
      }

      if( turbinesEnabled ) {
        settings.turbinesEnabled = turbinesEnabled == 'true';
      }

      if( infectionEnabled ) {
        settings.infectionEnabled = infectionEnabled == 'true';
      }
    }
  }

  /**
   * Pushes the current settings to local history.
   */
  function saveSettings() {
    if( UserProfile.suportsLocalStorage() ) {
      localStorage[ 'gravityEnabled' ] = settings.gravityEnabled;
      localStorage[ 'depthEnabled' ] = settings.depthEnabled;
      localStorage[ 'turbinesEnabled' ] = settings.turbinesEnabled;
      localStorage[ 'infectionEnabled' ] = settings.infectionEnabled;
    }
  }

  /**
   *
   */
  function updateUI() {
    if( settings.gravityEnabled ) {
      ui.gravitySwitch.setAttribute( "class", "switch on" );
      ui.gravitySwitchState.innerHTML = "ON";
    }
    else {
      ui.gravitySwitch.setAttribute( "class", "switch" );
      ui.gravitySwitchState.innerHTML = "OFF";
    }

    if( settings.depthEnabled ) {
      ui.depthSwitch.setAttribute( "class", "switch on" );
      ui.depthSwitchState.innerHTML = "ON";
    }
    else {
      ui.depthSwitch.setAttribute( "class", "switch" );
      ui.depthSwitchState.innerHTML = "OFF";
    }

    if( settings.turbinesEnabled ) {
      ui.turbinesSwitch.setAttribute( "class", "switch on" );
      ui.turbinesSwitchState.innerHTML = "ON";
    }
    else {
      ui.turbinesSwitch.setAttribute( "class", "switch" );
      ui.turbinesSwitchState.innerHTML = "OFF";
    }

    if( settings.infectionEnabled ) {
      ui.infectionSwitch.setAttribute( "class", "switch on" );
      ui.infectionSwitchState.innerHTML = "ON";
    }
    else {
      ui.infectionSwitch.setAttribute( "class", "switch" );
      ui.infectionSwitchState.innerHTML = "OFF";
    }
  }

  /**
   *
   */
  function resetButtonClickedHandler( event ) {
    bacteriaPool = [];
    turbinePool = [];

    event.preventDefault();
  }

  /**
   *
   */
  function gravitySwitchClickedHandler( event ) {
    settings.gravityEnabled = !settings.gravityEnabled;

    updateUI();
    saveSettings();

    event.preventDefault();
  }

  /**
   *
   */
  function depthSwitchClickedHandler( event ) {
    settings.depthEnabled = !settings.depthEnabled;

    updateUI();
    saveSettings();

    event.preventDefault();
  }

  /**
   *
   */
  function turbinesSwitchClickedHandler( event ) {
    settings.turbinesEnabled = !settings.turbinesEnabled;

    updateUI();
    saveSettings();

    event.preventDefault();
  }

  /**
   *
   */
  function infectionSwitchClickedHandler( event ) {
    settings.infectionEnabled = !settings.infectionEnabled;

    updateUI();
    saveSettings();

    event.preventDefault();
  }

  /**
   *
   */
  function documentKeyDownHandler(event) {
    switch( event.keyCode ) {
      case 32:
        //canvas.style.cursor = 'crosshair';
        key.spaceDown = true;
        event.preventDefault();
        break;
    }
  }

  /**
   *
   */
  function documentKeyUpHandler(event) {
    switch( event.keyCode ) {
      case 32:
        //canvas.style.cursor = 'default';
        key.spaceDown = false;
        event.preventDefault();
        break;
    }
  }

  /**
   * Event handler for document.onmousemove.
   */
  function documentMouseMoveHandler(event){
    mouse.x = event.clientX - (window.innerWidth - world.width) * 0.5;
    mouse.y = event.clientY - (window.innerHeight - world.height) * 0.5;
  }

  /**
   * Event handler for document.onmousedown.
   */
  function documentMouseDownHandler(event){
    mouse.down = true;

    mouse.x = event.clientX - (window.innerWidth - world.width) * 0.5;
    mouse.y = event.clientY - (window.innerHeight - world.height) * 0.5;

    if (event.target == canvas) {
      if( key.spaceDown ) {
        turbinePool.push( new Turbine( mouse.x, mouse.y ) );
      }

      event.preventDefault();
    }
  }

  /**
   * Event handler for document.onmouseup.
   */
  function documentMouseUpHandler(event) {
    mouse.down = false;

    mouse.x = event.clientX - (window.innerWidth - world.width) * 0.5;
    mouse.y = event.clientY - (window.innerHeight - world.height) * 0.5;
  }

  /**
   * Event handler for document.ontouchstart.
   */
  function documentTouchStartHandler(event) {
    if(event.touches.length == 1) {
      event.preventDefault();

      mouse.x = event.touches[0].pageX - (window.innerWidth - world.width) * 0.5;
      mouse.y = event.touches[0].pageY - (window.innerHeight - world.height) * 0.5;

      mouse.down = true;
    }
  }

  /**
   * Event handler for document.ontouchmove.
   */
  function documentTouchMoveHandler(event) {
    if(event.touches.length == 1) {
      event.preventDefault();

      mouseX = event.touches[0].pageX - (window.innerWidth - world.width) * 0.5 - 60;
      mouseY = event.touches[0].pageY - (window.innerHeight - world.height) * 0.5 - 30;
    }
  }

  /**
   * Event handler for document.ontouchend.
   */
  function documentTouchEndHandler(event) {
    mouse.down = false;
  }

  /**
   * Event handler for window.onresize.
   */
  function windowResizeHandler() {
    // Update the game size
    world.width = UserProfile.isTouchDevice() ? window.innerWidth : DEFAULT_WIDTH;
    world.height = UserProfile.isTouchDevice() ? window.innerHeight : DEFAULT_HEIGHT;

    // Resize the canvas
    canvas.width = world.width;
    canvas.height = world.height;

    // Determine the centered x/y position of the canvas
    var cvx = Math.round( (window.innerWidth - world.width) * 0.5 );
    var cvy = Math.round( (window.innerHeight - world.height) * 0.5 );

    // Move the canvas
    canvas.style.position = 'absolute';
    canvas.style.left = cvx + 'px';
    canvas.style.top = cvy + 'px';

    ui.options.style.position = 'absolute';
    ui.options.style.left = cvx - 2 + 'px';
    ui.options.style.top = cvy - 32 + 'px';

    ui.instructions.style.position = 'absolute';
    ui.instructions.style.top = Math.round( (window.innerHeight - 60) * .5 ) + 'px';
    ui.instructions.style.left = Math.round( (window.innerWidth - world.width) * .5 ) + 'px';
  }

  /**
   *
   */
  function emitFoam( x, y ) {
    var bacteria = new Bacteria( x, y );

    bacteria.velocity.x = (Math.random()*4)-2;
    bacteria.velocity.y = (Math.random()*4)-2;

    bacteriaPool.push( bacteria );

    ui.instructions.style.display = "none";
  }

  /**
   * Called on every frame to update and render the world.
   */
  function loop() {

    if (settings.depthEnabled) {
      var s = 0.997;
      var sx = ((canvas.width * (1 - s)) / 2);
      var sy = ((canvas.height * (1 - s)) / 2);

      context.save();
      context.translate(sx, sy);
      context.scale(s, s);

      context.drawImage(canvas, 0, 0, canvas.width, canvas.height);

      context.restore();
    }

    context.fillStyle = "rgba(0,0,0,0.1)";
    context.fillRect( 0, 0, world.width, world.height );

    update();

  }

  /**
   * Updates the world by stepping forward one frame.
   */
  function update() {

    if ( mouse.down ) {
      var turbine = turbinePool[turbinePool.length-1];

      if( key.spaceDown && turbine ) {
        turbine.radius = Math.min( turbine.radius + 1, MAX_TURBINE_RADIUS );
      } else {
        emitFoam( mouse.x, mouse.y );
      }
    }

    updateFoam();
  }

  /**
   *
   */
  function updateFoam() {
    var intersection = new Region();

    for( var i = 0, len = bacteriaPool.length; i < len; i++ ) {

      var foam = bacteriaPool[i];

      // Collision detection and solving
      for( var j = 0; j < len; j++ ) {

        var opposition = bacteriaPool[j];

        var rc = foam.radius + opposition.radius;

        if( foam !== opposition
            && Math.abs( foam.position.x - opposition.position.x ) < rc
            && Math.abs( foam.position.y - opposition.position.y ) < rc ) {

          intersection.reset();
          intersection.inflate( foam.position.x - foam.radius, foam.position.y - foam.radius );
          intersection.inflate( foam.position.x + foam.radius, foam.position.y + foam.radius );
          intersection.inflate( opposition.position.x - opposition.radius, opposition.position.y - opposition.radius );
          intersection.inflate( opposition.position.x + opposition.radius, opposition.position.y + opposition.radius );

          var overlap = {
            x: Math.max( ( intersection.right - intersection.left ) / rc, 0 ),
            y: Math.max( ( intersection.bottom - intersection.top ) / rc, 0 )
          };

          if( foam.position.x < opposition.position.x ) overlap.x = -overlap.x;
          if( foam.position.y < opposition.position.y ) overlap.y = -overlap.y * ( settings.gravityEnabled ? 4 : 1 );

          foam.velocity.x += overlap.x * 0.1;
          foam.velocity.y += overlap.y * ( settings.gravityEnabled ? 0.2 : 0.1 );

          if (settings.infectionEnabled) {
            foam.colorTarget = opposition.colorTarget;
          }

          continue;

        }

      }

      // Turbines
      for (var k = 0; k < turbinePool.length; k++) {
        var turbine = turbinePool[k];
        var aoe = turbine.radius * 1.1
        var dist = turbine.distanceTo( foam.position );

        if( dist < aoe ) {
          var xf = turbine.force * ( ( foam.position.x - turbine.position.x ) / aoe );
          var yf = turbine.force * ( ( foam.position.y - turbine.position.y ) / aoe );

          foam.velocity.x += settings.turbinesEnabled ? -xf : xf;
          foam.velocity.y += settings.turbinesEnabled ? -yf : yf;

          if (settings.infectionEnabled) {
            foam.colorTarget = turbine.color;
          }
        }
      }

      if (settings.gravityEnabled) {
        foam.velocity.x += gravity.x;
        foam.velocity.y += gravity.y;
      }

      foam.velocity.x *= 0.90;
      foam.velocity.y *= settings.gravityEnabled ? 0.65 : 0.90;

      foam.position.x += foam.velocity.x;
      foam.position.y += foam.velocity.y;

      foam.position.x = Math.min( Math.max( foam.position.x, foam.radius ), world.x + world.width - foam.radius );
      foam.position.y = Math.min( Math.max( foam.position.y, foam.radius ), world.y + world.height - foam.radius );

      foam.color.r += ( foam.colorTarget.r - foam.color.r ) * 0.04;
      foam.color.g += ( foam.colorTarget.g - foam.color.g ) * 0.04;
      foam.color.b += ( foam.colorTarget.b - foam.color.b ) * 0.04;

      context.beginPath();
      context.arc( foam.position.x, foam.position.y, foam.radius * 0.9, 0, Math.PI*2, true );
      context.fillStyle = 'rgba('+Math.round(foam.color.r)+','+Math.round(foam.color.g)+','+Math.round(foam.color.b)+',1.0)';
      context.fill();

    }

    // Turbines
    for (var k = 0; k < turbinePool.length; k++) {
      var turbine = turbinePool[k];

      turbine.pulse += ( turbine.pulseTarget - turbine.pulse ) * 0.2;

      if( turbine.pulse > 0.99 ) {
        turbine.pulseTarget = 0.7;
      }
      else if( turbine.pulse < 0.71 ) {
        turbine.pulseTarget = 1;
      }

      var gradient = context.createRadialGradient( turbine.position.x, turbine.position.y, 0, turbine.position.x, turbine.position.y, turbine.radius );
      gradient.addColorStop(0.1,'rgba('+turbine.color.r+','+turbine.color.g+','+turbine.color.b+',0.0)');
      gradient.addColorStop(0.8,'rgba('+turbine.color.r+','+turbine.color.g+','+turbine.color.b+','+(0.05*turbine.pulse)+')');
      gradient.addColorStop(1.0,'rgba('+turbine.color.r+','+turbine.color.g+','+turbine.color.b+',0.0)');

      context.beginPath();
      context.arc( turbine.position.x, turbine.position.y, turbine.radius, 0, Math.PI*2, true );
      context.fillStyle = gradient;
      context.fill();

      turbine.position.x = Math.min( Math.max( turbine.position.x, turbine.radius + 5 ), world.x + world.width - turbine.radius - 5 );
      turbine.position.y = Math.min( Math.max( turbine.position.y, turbine.radius + 5 ), world.y + world.height - turbine.radius - 5 );
    }
  }

};


/**
 *
 */
function Bacteria( x, y ) {
  this.position = { x: x || 0, y: y || 0 };
  this.velocity = { x: 0, y: 0 };
  this.radius = 10 + ( Math.random() * 2 );
  this.color = {
    r: 255,
    g: 255,
    b: 255
  };
  this.colorTarget = {
    r: 255,
    g: 255,
    b: 255
  };
}
Bacteria.prototype = new Point();

/**
 *
 */
function Turbine( x, y ) {
  this.position = { x: x || 0, y: y || 0 };
  this.radius = 30;
  this.force = 3;
  this.pulse = 0.8;
  this.pulseTarget = 1;
  this.color = { r: 0, g: 0, b: 0 };

  this.randomizeColor();
}
Turbine.prototype = new Point();
Turbine.prototype.randomizeColor = function() {
  switch( Math.round( Math.random() * 4 ) ) {
    case 0:
      this.color = { r: 230, g: 140, b: 200 };
      break;
    case 1:
      this.color = { r: 100, g: 140, b: 230 };
      break;
    case 2:
      this.color = { r: 100, g: 220, b: 220 };
      break;
    case 3:
      this.color = { r: 220, g: 90, b: 90 };
      break;
    case 4:
      this.color = { r: 100, g: 220, b: 100 };
      break;
  }
}



BacteriumWorld.initialize();


