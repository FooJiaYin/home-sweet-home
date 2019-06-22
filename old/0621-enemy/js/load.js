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
    game.load.image('field', 'assets/map.png');
    game.load.image('field_s', 'assets/field_s.png');
    game.load.spritesheet('player', 'assets/player.png', 80, 80);
    game.load.spritesheet('sword', 'assets/sword.png', 32, 32);
    game.load.spritesheet('arrow', 'assets/arrow.png', 32, 32);
    game.load.image('gg', 'assets/gg.png');
    //monsters
    //game.load.image('monster', 'assets/monster.png');


    ///monsters
    game.load.image('stoneman', 'assets/stoneman.png');
    game.load.spritesheet('fish', 'assets/neckMonsterSprite.png',400, 300);
    game.load.image('whitewalker', 'assets/whitewalker.png');
    game.load.image('twig', 'assets/twig.png');
    game.load.spritesheet('barbarian', 'assets/circleMonsterSprite.png', 275, 165);
    game.load.image('ghost', 'assets/ghost.png');
  
    //grow
    game.load.image('coal', 'assets/coal.png');
    game.load.image('stone', 'assets/stone.png');
    game.load.image('ice', 'assets/ice.png');
    game.load.image('shell', 'assets/shell.png');
    game.load.image('caterpillar', 'assets/caterpillar.png')
    //0620
    game.load.image('iron', 'assets/iron.png');

    ////left//left is same to bullet
    game.load.image('snowleft', 'assets/skull.png');
    game.load.image('mineleft', 'assets/cotton.png');
    game.load.image('grassleft', 'assets/meat.png');
    game.load.image('forestleft', 'assets/leaf.png');
    game.load.image('beachleft', 'assets/weed.png');

    //short attack
    game.load.image('attackcircle', 'assets/circle_s.png');
    // game.load.image('attackcircle', 'assets/circle.png');

    //sound effect
    game.load.audio('enemyDieSnd', 'soundEffect/enemyDie.mp3');
    game.load.audio('shootSnd', 'soundEffect/shoot.mp3');
    game.load.audio('attackSnd', 'soundEffect/shortAttack.mp3');






    

    

    game.load.image('trash', 'assets/trash.png');
    game.load.image('table', 'assets/table.png');
    game.load.image('chair', 'assets/chair.png');
  }, 
  create: function() { 
    game.state.start('home'); 
  } 
}; 
