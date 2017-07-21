/**
 * Created by nickhoughton on 6/20/17.
 */
var cloudField;
var game, size;
function main() {
  size = getViewport();
  game = new Phaser.Game(size[0], size[1], Phaser.CANVAS, 'body', null, true);

  game.state.add('mainState', mainState);
  game.state.start('mainState');
}

function randomFloat(min, max, pre){
  if(pre === 0){
    return Math.round(Math.random() * (min - max) + max);
  }else{
  return (Math.random() * (min - max) + max).toFixed(pre || 2);
  }
}

var mainState = {
  preload: function(){
    game.load.image('cloud', '/images/coud1.png');
  },
  create: function(){
    // let clouds = [];
    // for(let i = 0; i < 5; ++i){
    //   clouds[i] = game.add.sprite(randomFloat(size[0], size[1]), randomFloat(size[0], size[1]), 'cloud');
    //   game.physics.enable(clouds[i], Phaser.Physics.ARCADE);
    //   clouds[i].body.velocity.x = randomFloat(45, 55);
    //   clouds[i].scale.setTo(randomFloat(0.1, 0.4), randomFloat(0.1, 0.4));
    // }

    var x = randomFloat(size[0], size[1], 0);
    var y = randomFloat(0, game.height, 0);
    var dx = randomFloat(45, 55, 0);
    var sx = randomFloat(0.1, 0.4, 2);
    var sy = randomFloat(0.1, 0.4, 2)
    cloudField = game.add.sprite(x, y, 'cloud');
    cloudField.position.y = y;
    cloudField.position.x = 0;
    game.physics.enable(cloudField, Phaser.Physics.ARCADE);
    cloudField.body.velocity.x = dx;
    //cloudField.scale.setTo(sx, sy);

  },
  update:function(){
    //console.log("Cloud Pos: " + cloudField.position.x + "   " + game.width + "      " + cloudField.width);
    if(cloudField.position.x > game.width){
      cloudField.position.x = -cloudField.width;
    }
  }
}

window.onload = main;