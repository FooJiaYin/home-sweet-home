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
    //game.load.image('field_s', 'assets/field_s.png');
    game.load.image('house', 'assets/house.png');
    game.load.image('out', 'assets/out.png');
    game.load.image('GoHome', 'assets/GoHome.png');
    game.load.image('GoOut', 'assets/GoOut.png');
    game.load.image('GoMap', 'assets/GoMap.png');
    game.load.spritesheet('player', 'assets/playerSprite.png', 120, 185);
    game.load.spritesheet('sword', 'assets/playerattack.png', 86, 80);
    game.load.spritesheet('arrow', 'assets/weapon/arrow.png', 32, 32);
    game.load.image('store', 'assets/store.png');
    game.load.image('bound', 'assets/bound.png');
    game.load.image('bridge', 'assets/bridge.png');
    game.load.image('die', 'assets/playerdie.png');
    //game.load.image('gg', 'assets/gg.png');

    ///monsters
    game.load.image('stoneman', 'assets/enemy/stoneman.png');
    //game.load.image('fish', 'assets/enemy/magikarp.png');
    game.load.image('whitewalker', 'assets/enemy/whitewalker.png');
    game.load.image('twig', 'assets/enemy/twig.png');
    //game.load.image('barbarian', 'assets/enemy/barbarian.png');
    game.load.spritesheet('fish', 'assets/enemy/neckMonsterSprite.png',400, 300);
    game.load.image('whitewalker', 'assets/whitewalker.png');
    game.load.image('twig', 'assets/twig.png');
    game.load.spritesheet('barbarian', 'assets/enemy/circleMonsterSprite.png', 275, 165);

    //short attack
    game.load.image('attackcircle', 'assets/enemy/circle_s.png');

    //grow
    game.load.image('wood', 'assets/drops/wood.png');
    game.load.image('stone', 'assets/drops/stone.png');
    game.load.image('ice', 'assets/drops/ice.png');
    //game.load.image('iron', 'assets/drops/iron.png');
    game.load.image('coal', 'assets/drops/coal.png');
    game.load.image('shell', 'assets/drops/shell.png');
    game.load.image('caterpillar', 'assets/drops/caterpillar.png')

    ////left//left is same to bullet
    game.load.image('snowleft', 'assets/drops/skull.png');
    game.load.image('mineleft', 'assets/drops/cotton.png');
    game.load.image('grassleft', 'assets/drops/meat.png');
    game.load.image('forestleft', 'assets/drops/leaf.png');
    game.load.image('beachleft', 'assets/drops/weed.png');
    
    //game.load.image('wood', 'assets/wood.png');
    ///furn
    game.load.image('packing', 'assets/packing.png');
    game.load.image('table', 'assets/furniture/table.png');
    game.load.image('chair', 'assets/furniture/chair.png');
  }, 
  create: function() { 
    game.state.start('map'); 
  } 
}; 
