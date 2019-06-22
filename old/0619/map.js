var mapState = { 
  create: function() {
    // Add a background image 
    this.bg = game.add.tileSprite(0, 0, game.width, game.height, 'map');
    this.home = game.add.button(150, 250, 'home', this.toHome, this);
    this.home.scale.setTo(0.25, 0.25);
    this.field = game.add.button(450, 250, 'field_s', this.toField, this);
    this.field.scale.setTo(0.25, 0.25);
  },
  toHome: function() {
    game.state.start('home'); 
  },
  toField: function() {
    game.state.start('field');  
  },
}; 