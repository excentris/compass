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

var mainState = {
  preload: function(){
    game.load.image('cloud', '/images/coud1.png');
  },
  create: function(){
    cloudField = game.add.tileSprite(0,0,size[0], size[1], 'cloud');
    // cloudField.scale.x = 0.25;
    // cloudField.scale.y = 0.25;
  },
  update:function(){
    cloudField.tilePosition.x += 1;
  }
}

window.onload = main;