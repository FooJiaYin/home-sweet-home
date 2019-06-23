var loadState = {
  preload: function() {
    var loadingLabel = game.add.text(game.width/2, 150, 'loading...', { font: '30px Arial', fill: '#ffffff' }); 
    loadingLabel.anchor.setTo(0.5, 0.5);
    
    var progressBar = game.add.sprite(game.width/2, 200, 'progressBar'); 
    progressBar.anchor.setTo(0.5, 0.5); 
    game.load.setPreloadSprite(progressBar);
    
    game.load.image('map', 'assets/map.png');
    game.load.image('home', 'assets/home.png');
    game.load.image('field', 'assets/field.png');
    game.load.image('bound', 'assets/bound.png');
    game.load.image('bridge', 'assets/bridge.png');
    
    game.load.image('lalala', 'assets/UI/lalala.png');
    game.load.image('fast', 'assets/UI/fast.png');
    game.load.image('power', 'assets/UI/power.png');
    game.load.image('house', 'assets/UI/house.png');
    game.load.image('out', 'assets/UI/out.png');
    game.load.image('GoHome', 'assets/UI/GoHome.png');
    game.load.image('GoOut', 'assets/UI/GoOut.png');
    game.load.image('GoMap', 'assets/UI/GoMap.png');
    game.load.image('bloodBottom', 'assets/UI/bloodBottom.png');
    game.load.image('blood', 'assets/UI/blood.png');
    game.load.image('crafting', 'assets/UI/crafting.png');
    game.load.image('store', 'assets/UI/store.png');
    game.load.image('chooseStore', 'assets/UI/chooseStore.png');
    game.load.spritesheet('storage', 'assets/UI/storage.png', 100, 100);

    game.load.spritesheet('player', 'assets/player/playerSprite.png', 120, 185);
    game.load.spritesheet('sword', 'assets/player/playerattack.png', 86, 80);
    game.load.spritesheet('arrow', 'assets/player/arrowSprite.png', 50, 50);
    game.load.image('die', 'assets/player/playerdie.png');
    //game.load.image('gg', 'assets/gg.png');

    ///furn650*246
    game.load.spritesheet('carpet', 'assets/furniture/carpetSprite.png', 650, 246);
    game.load.image('bed', 'assets/furniture/bed.png');
    game.load.image('bookshelf', 'assets/furniture/bookshelf.png');
    game.load.image('closet', 'assets/furniture/closet.png');
    game.load.image('table', 'assets/furniture/table.png');
    game.load.image('seat', 'assets/furniture/seat.png');
    game.load.image('bed1', 'assets/furniture/bed1.png');
    game.load.image('bookshelf1', 'assets/furniture/bookshelf1.png');
    game.load.image('closet1', 'assets/furniture/closet1.png');
    game.load.image('table1', 'assets/furniture/table1.png');
    game.load.image('seat1', 'assets/furniture/seat1.png');
    game.load.image('light', 'assets/furniture/light.png');
    game.load.image('flower', 'assets/furniture/flower.png');
    game.load.image('flower1', 'assets/furniture/flower1.png');
    game.load.image('flower2', 'assets/furniture/flower2.png');

    ///monsters
    game.load.spritesheet('forestEnemy', 'assets/enemy/treeMonsterSprite.png',195, 235);
    game.load.spritesheet('mineEnemy', 'assets/enemy/evilMonsterSprite.png',300, 165);
    game.load.spritesheet('snowEnemy', 'assets/enemy/neckMonsterSprite.png',400, 300);
    game.load.spritesheet('beachEnemy', 'assets/enemy/fishSprite.png',145,255);
    game.load.spritesheet('barbarian', 'assets/enemy/circleMonsterSprite.png', 275, 165);

    game.load.image('stoneman', 'assets/enemy/stoneman.png');
    game.load.spritesheet('fish', 'assets/enemy/neckMonsterSprite.png',400, 300);
    game.load.image('whitewalker', 'assets/enemy/whitewalker.png');
    game.load.image('twig', 'assets/enemy/twig.png');
    game.load.image('ghost', 'assets/enemy/ghost.png');

    //short attack
    game.load.image('attackcircle', 'assets/enemy/circle_s.png');

    //hp bar
    game.load.image('monsterBloodAll', 'assets/enemy/monsterBloodAll.png');
    game.load.image('monsterBloodBottom', 'assets/enemy/monsterBloodBottom.png');

    //grow
    game.load.image('wood', 'assets/drops/wood.png');
    game.load.image('stone', 'assets/drops/stone.png');
    game.load.image('ice', 'assets/drops/ice.png');
    game.load.image('iron', 'assets/drops/iron.png');
    game.load.image('shell', 'assets/drops/shell.png');
    game.load.image('caterpillar', 'assets/drops/worm.png')

    ////left//left is same to bullet
    game.load.image('snowBullet', 'assets/drops/skull.png');
    game.load.image('forestBullet', 'assets/drops/wood_bullet.png');
    game.load.image('grassBullet', 'assets/drops/meat.png');
    game.load.image('mineBullet', 'assets/drops/cotton.png');//0621
    game.load.image('beachBullet', 'assets/drops/weed.png');
    game.load.image('snowleft', 'assets/drops/skull.png');
    game.load.image('forestleft', 'assets/drops/coal.png');
    game.load.image('mineleft', 'assets/drops/cotton.png');//0621
    game.load.image('grassleft', 'assets/drops/meat.png');
    game.load.image('beachleft', 'assets/drops/weed.png');

    //sound effects
    game.load.audio('enemyDieSnd', 'assets/soundEffect/enemyDie.mp3');
    game.load.audio('shootSnd', 'assets/soundEffect/shoot.mp3');
    game.load.audio('attackSnd', 'assets/soundEffect/shortAttack.mp3');

    game.load.audio('fieldBgm', 'assets/soundEffect/fieldBgm.mp3');
    game.load.audio('homeBgm', 'assets/soundEffect/homeBgm.mp3');
    game.load.audio('weedBgm', 'assets/soundEffect/weedBgm.mp3');
    game.load.audio('shopWelcome', 'assets/soundEffect/shopWelcome.mp3');
    game.load.audio('playerDie', 'assets/soundEffect/playerDie.mp3');
    game.load.audio('cashier', 'assets/soundEffect/cashier.mp3');
    game.load.audio('craft', 'assets/soundEffect/makeWeapon.mp3');
  }, 
  create: function() { 
    game.shopWelcome = game.add.audio('shopWelcome', 0.4, false);
    game.playerDie = game.add.audio('playerDie', 0.6, false);
    game.weedBgm = game.add.audio('weedBgm', 0.5, false);
    game.buysound = game.add.audio('cashier', 0.8, false);
    game.craftsound = game.add.audio('craft', 0.8, false);
    game.homeBgm = game.add.audio('homeBgm', 0.5, true);
    game.fieldBgm = game.add.audio('fieldBgm', 0.5, true);
    game.fieldBgm.play();
    game.state.start('map'); 
  } 
}; 
