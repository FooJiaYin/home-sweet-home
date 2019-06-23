var mapState = { 
  preload: function() {
    setUpPlayer();
    loadValues();
  },
  create: function() {
    // Add a background image 
    this.bg = game.add.tileSprite(0, 0, game.width, game.height, 'map');
    this.home = game.add.button(0, 160, 'house', this.toHome, this);
    this.home.inputEnabled = true;
    this.field = game.add.button(580, 100, 'out', this.toField, this);
    this.field.inputEnabled = true;
    this.gohome = game.add.image(280, 120, 'GoHome');
    this.goout = game.add.image(470, 110, 'GoOut');
    this.home.alpha = 0;
    this.field.alpha = 0;
    this.gohome.alpha = 0;    
    this.goout.alpha = 0;
    this.home.onInputOver.add(function(){this.gohome.alpha = 1;}, this);
    this.home.onInputOut.add(function(){this.gohome.alpha = 0;}, this);
    this.field.onInputOver.add(function(){this.goout.alpha = 1;}, this);
    this.field.onInputOut.add(function(){this.goout.alpha = 0;}, this);
  },
  toHome: function() {
    game.fieldBgm.stop();
    game.homeBgm.play();
    game.state.start('home'); 
  },
  toField: function() {
    game.state.start('field');  
  },
}; 