var loginState = { 
  create: function() {
    var bg = game.add.tileSprite(0, 0, game.width, game.height, 'login');
    var downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN); 
    downKey.onDown.add(this.start, this); 
  }, 
  start: function() { 
    game.state.start('map'); 
  }, 
}; 