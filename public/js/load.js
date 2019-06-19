var loadState = {
  preload: function() {
    var loadingLabel = game.add.text(game.width/2, 150, 'loading...', { font: '30px Arial', fill: '#ffffff' }); 
    loadingLabel.anchor.setTo(0.5, 0.5);
    
    var progressBar = game.add.sprite(game.width/2, 200, 'progressBar'); 
    progressBar.anchor.setTo(0.5, 0.5); 
    game.load.setPreloadSprite(progressBar);
    
    
    game.load.image('login', 'assets/login.png');
    game.load.image('map', 'assets/map.png');
    game.load.image('home', 'assets/home.png');
    game.load.image('field', 'assets/field.png');
    game.load.image('field_s', 'assets/field_s.png');
    game.load.spritesheet('player', 'assets/player.png', 80, 80);
    game.load.spritesheet('sword', 'assets/sword.png', 32, 32);
    game.load.spritesheet('arrow', 'assets/arrow.png', 32, 32);
    game.load.image('gg', 'assets/gg.png');
    game.load.image('monster', 'assets/monster.png');
    game.load.image('monster2', 'assets/whitewalker.png');
    game.load.image('twig', 'assets/twig.png');
    game.load.image('barbarian', 'assets/barbarian.png');

    //grow
    game.load.image('stone', 'assets/stone.png');
    game.load.image('ice', 'assets/ice.png');
    game.load.image('coal', 'assets/ice.png');
    game.load.image('shell', 'assets/shell.png');
    



    ////left
    game.load.image('bone', 'assets/bone.png');
    game.load.image('fur', 'assets/fur.png');
    game.load.image('meat', 'assets/meat.png');
    game.load.image('weed', 'assets/weed.png');



    
    game.load.image('enemyBullet2', 'assets/skull.png');
    game.load.image('enemyBullet', 'assets/pupu.png');
    game.load.image('leaf', 'assets/leaf.png');
    game.load.image('wood', 'assets/wood.png');

    game.load.image('trash', 'assets/trash.png');
    game.load.image('table', 'assets/table.png');
    game.load.image('chair', 'assets/chair.png');
  }, 
  create: function() { 
    game.state.start('home'); 
  } 
}; 
