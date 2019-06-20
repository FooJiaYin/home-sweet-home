//var livingForest, livingSnow, livingGrass, livingMine, livingBeach;
var fieldState = { 
  preload: function() {
    game.stage.disableVisibilityChange = true;
  },
  create: function() {
    loadValues();
    Client.initState('field');
    var bag = document.getElementById("bag");
    bag.style.left = "calc(50% - 75px)";
    bag.style.display = "none";
    var cra = document.getElementById("craft");
    cra.style.display = "none";
    this.bg = game.add.tileSprite(0, 0, 2000, 2000, 'field');
    game.world.setBounds(0, 0, 2000, 2000);
    this.playing = 1;

    this.borderH = 600;
    this.borderV = 600;

    this.woods = game.add.group();
    this.woods.enableBody = true;
    this.woods.createMultiple(30, 'wood');
    this.woods.forEach(function(w) {
      w.anchor.setTo(0.5, 0.5);
    }, this);
    this.circles = game.add.group();
    this.circles.enableBody = true;
    this.circles.createMultiple(30, 'attackcircle');
    this.circles.forEach(function(c) {
      c.anchor.setTo(0.5, 0.5);
    }, this);
    
    /* Enemies */
    var i = 0;
    this.enemies = [];

    this.twigs = game.add.group();
    this.twigs.enableBody = true;
    this.twigs.createMultiple(2, 'twig');
    this.twigs.forEach(function(m) {
      m.anchor.setTo(0.5, 0.5);
      m.blood = 3;
      m.attack = 0;
      m.label = game.add.text(-20, -20, 'hp: 3', { font: '15px Microsoft JhengHei', backgroundColor: 'white'});
      m.type = "forest";
      m.id = i;
      m.isAlive = true;
      fieldState.enemies[i++] = m;
      m.kill();
    }, this);
    
    this.whitewalkers = game.add.group();
    this.whitewalkers.enableBody = true;
    this.whitewalkers.createMultiple(2, 'whitewalker');
    this.whitewalkers.forEach(function(m) {
      m.anchor.setTo(0.5, 0.5);
      m.blood = 3;
      m.label = game.add.text(-20, -20, 'hp: 3', { font: '15px Microsoft JhengHei', backgroundColor: 'white'});
      m.notattacked = 5;
      m.type = "snow";
      m.id = i;
      m.isAlive = true;
      fieldState.enemies[i++] = m;
      m.kill();
      //game.time.events.add(1000, function() {m.notattacked = (m.notattacked==5)?m.notattacked:m.notattacked++;}, this);
      //not attacked in 5 sec means dont attack
    }, this);

    this.barbarians = game.add.group();
    this.barbarians.enableBody = true;
    this.barbarians.createMultiple(2, 'barbarian');
    this.barbarians.forEach(function(m) {
      m.anchor.setTo(0.5, 0.5);
      m.blood = 3;
      m.attack = 0;
      m.label = game.add.text(-20, -20, 'hp: 3', { font: '15px Microsoft JhengHei', backgroundColor: 'white'});
      m.notattacked = 5;
      m.type = "grass";
      m.id = i;
      m.isAlive = true;
      fieldState.enemies[i++] = m;
      m.kill();
    }, this);

    this.stonemans = game.add.group();
    this.stonemans.enableBody = true;
    this.stonemans.createMultiple(2, 'stoneman');
    this.stonemans.forEach(function(m) {
      m.anchor.setTo(0.5, 0.5);
      m.blood = 3;
      m.label = game.add.text(-20, -20, 'hp: 3', { font: '15px Microsoft JhengHei', backgroundColor: 'white'});
      m.notattacked = 5;
      m.type = "mine";
      m.id = i;
      m.isAlive = true;
      fieldState.enemies[i++] = m;
      m.kill();
    }, this);

    this.fishs = game.add.group();
    this.fishs.enableBody = true;
    this.fishs.createMultiple(2, 'fish');
    this.fishs.forEach(function(m) {
      m.anchor.setTo(0.5, 0.5);
      m.blood = 3;
      m.attack = 0;
      m.label = game.add.text(-20, -20, 'hp: 3', { font: '15px Microsoft JhengHei', backgroundColor: 'white'});
      m.notattacked = 5;
      m.type = "beach";
      m.id = i;
      m.isAlive = true;
      fieldState.enemies[i++] = m;
      m.kill();
    }, this);

    this.store = game.add.sprite(600, 1100, 'store');
    this.store.inputEnabled = true;
    this.store.events.onInputDown.add(this.openStore, this);
    game.physics.arcade.enable(this.store);
    this.store.body.immovable = true;

    this.playersList = [];
    this.playerGroup = game.add.group();
    this.playerGroup.setAll('anchor.x', 0.5);
    this.playerGroup.setAll('anchor.y', 0.5);
    this.playerGroup.setAll('body.collideWorldBounds', true);
    game.physics.arcade.enable(this.playerGroup);
    
    this.swords = game.add.group();
    this.swords.createMultiple(50, 'sword');
    this.swords.enableBody = true;
    this.swords.physicsBodyType = Phaser.Physics.ARCADE; 
    this.swords.forEach(function(a) {
      a.kill();
    }, this); 

    this.arrows = game.add.group();
    this.arrows.enableBody = true;
    this.arrows.createMultiple(100, 'arrow');
    this.arrows.setAll('outOfBoundsKill', true);
    this.arrows.setAll('checkWorldBounds', true);
    this.arrows.setAll('checkWorldBounds', true);
    this.arrows.forEach(function(a) {
      a.anchor.setTo(0.5, 0.5);
      a.kill();
    }, this);
    this.cursor = game.input.keyboard.createCursorKeys();

    this.life = game.add.text(700, 20, 'HP: ' + game.global.hp, { font: '30px Arial'} );
    this.life.fixedToCamera = true;
    this.map = game.add.text(700, 400, '地圖', { font: '40px Microsoft JhengHei', backgroundColor: 'white'});
    this.map.inputEnabled = true;
    this.map.fixedToCamera = true;
    this.map.events.onInputDown.add(this.toMap, this);
    this.home = game.add.text(700, 460, '回家', { font: '40px Microsoft JhengHei', backgroundColor: 'white'});
    this.home.inputEnabled = true;
    this.home.fixedToCamera = true;
    this.home.events.onInputDown.add(this.toHome, this);
    this.bag = game.add.text(700, 520, '背包', { font: '40px Microsoft JhengHei', backgroundColor: 'white'});
    this.bag.inputEnabled = true;
    this.bag.fixedToCamera = true;
    this.bag.events.onInputDown.add(this.openBag, this);

    this.keyQ = game.input.keyboard.addKey(Phaser.Keyboard.Q);
    this.keyQ.onDown.add(this.swordA, this);
    this.keyW = game.input.keyboard.addKey(Phaser.Keyboard.W);
    this.keyW.onDown.add(this.arrowA, this);
    this.keyE = game.input.keyboard.addKey(Phaser.Keyboard.E);

    this.genW = game.add.text(20, 20, 'W', { font: '40px Microsoft JhengHei', backgroundColor: 'white'});
    this.genW.inputEnabled = true;
    this.genW.fixedToCamera = true;
    this.genW.events.onInputDown.add(this.genWood, this);
    
    this.stones = game.add.group();
    this.stones.enableBody = true;
    this.stones.createMultiple(30, 'stone');

    //石頭(all)、木材(forest)、冰(snow)、ㄇㄇ蟲(草地)、棉花(evil)、礦(evil)、貝殼(beach) )
    this.ices = game.add.group();
    this.ices.enableBody = true;
    this.ices.createMultiple(100, 'ice');
    
    this.caterpillars = game.add.group();
    this.caterpillars.enableBody = true;
    this.caterpillars.createMultiple(100, 'caterpillar');

    this.coals = game.add.group();
    this.coals.enableBody = true;
    this.coals.createMultiple(30, 'coal');

    this.shells = game.add.group();
    this.shells.enableBody = true;
    this.shells.createMultiple(30, 'shell');

    this.growTime = 0;
    this.genEnemyTime = 0;
    //left
    this.forestlefts = game.add.group();
    this.forestlefts.enableBody = true;
    this.forestlefts.createMultiple(30, 'forestleft');

    this.snowlefts = game.add.group();
    this.snowlefts.enableBody = true;
    this.snowlefts.createMultiple(30, 'snowleft');

    this.minelefts = game.add.group();
    this.minelefts.enableBody = true;
    this.minelefts.createMultiple(30, 'mineleft');

    this.grasslefts = game.add.group();
    this.grasslefts.enableBody = true;
    this.grasslefts.createMultiple(30, 'grassleft');

    this.beachlefts = game.add.group();
    this.beachlefts.enableBody = true;
    this.beachlefts.createMultiple(30, 'beachleft');

    
    ////enemy by shuling
    //enemy
    this.enemyBulletsList = [];
    //enemies1 bullet
    this.forestBullets= game.add.group();
    this.forestBullets.enableBody = true;
    this.forestBullets.physicsBodyType = Phaser.Physics.ARCADE; 
    this.forestBullets.createMultiple(50, 'forestleft');
    this.forestBullets.setAll('anchor.x', 0.5);
    this.forestBullets.setAll('anchor.y', 0);
    this.forestBullets.setAll('outOfBoundsKill', true);
    this.forestBullets.setAll('checkWorldBounds', true);
    this.forestBullets.forEach(function (b) {
      b.id = i;
      b.type = "forest";
      this.enemyBulletsList[i++] = b;
      b.kill();
    }, this);
    //enemy2 bullets
    this.snowBullets= game.add.group();
    this.snowBullets.enableBody = true;
    this.snowBullets.physicsBodyType = Phaser.Physics.ARCADE; 
    this.snowBullets.createMultiple(50, 'snowleft');
    this.snowBullets.setAll('anchor.x', 0.5);
    this.snowBullets.setAll('anchor.y', 0);
    this.snowBullets.setAll('outOfBoundsKill', true);
    this.snowBullets.setAll('checkWorldBounds', true);
    this.snowBullets.forEach(function (b) {
      b.id = i;
      b.type = "snow";
      this.enemyBulletsList[i++] = b;
      b.kill();
    }, this);

    this.grassBullets= game.add.group();
    this.grassBullets.enableBody = true;
    this.grassBullets.physicsBodyType = Phaser.Physics.ARCADE; 
    this.grassBullets.createMultiple(50, 'grassleft');
    this.grassBullets.setAll('anchor.x', 0.5);
    this.grassBullets.setAll('anchor.y', 0);
    this.grassBullets.setAll('outOfBoundsKill', true);
    this.grassBullets.setAll('checkWorldBounds', true);
    this.grassBullets.forEach(function (b) {
      b.id = i;
      b.type = "grass";
      this.enemyBulletsList[i++] = b;
      b.kill();
    }, this);

    this.mineBullets= game.add.group();
    this.mineBullets.enableBody = true;
    this.mineBullets.physicsBodyType = Phaser.Physics.ARCADE; 
    this.mineBullets.createMultiple(50, 'mineleft');
    this.mineBullets.setAll('anchor.x', 0.5);
    this.mineBullets.setAll('anchor.y', 0);
    this.mineBullets.setAll('outOfBoundsKill', true);
    this.mineBullets.setAll('checkWorldBounds', true);
    this.mineBullets.forEach(function (b) {
      b.id = i;
      b.type = "mine";
      this.enemyBulletsList[i++] = b;
      b.kill();
    }, this);

    this.beachBullets= game.add.group();
    this.beachBullets.enableBody = true;
    this.beachBullets.physicsBodyType = Phaser.Physics.ARCADE; 
    this.beachBullets.createMultiple(50, 'beachleft');
    this.beachBullets.setAll('anchor.x', 0.5);
    this.beachBullets.setAll('anchor.y', 0);
    this.beachBullets.setAll('outOfBoundsKill', true);
    this.beachBullets.setAll('checkWorldBounds', true);
    this.beachBullets.forEach(function (b) {
      b.id = i;
      b.type = "beach";
      this.enemyBulletsList[i++] = b;
      b.kill();
    }, this);

    //loop
    game.time.events.loop(200, this.moveEnemy, this);
    game.time.events.loop(50, this.enemyAttack, this);
    game.time.events.loop(1000, this.enemyShoot, this);
    game.time.events.loop(16000, this.generateEnemy, this);
    game.time.events.loop(2000, this.growElement, this);

  }, 
  update: function() {
    if(this.playing && this.player && this.player.body){
      this.movePlayer();
      this.playerGroup.sort('y', Phaser.Group.SORT_ASCENDING);
      //this.enemyAlive();
      this.updateEnemyLabel();
      //this.updateText();
      //this.playerGroup.sort('y', Phaser.Group.SORT_ASCENDING);
      game.physics.arcade.collide(this.player, this.store);
      game.physics.arcade.overlap(this.player, this.circles, this.hurt, null, this);
      game.physics.arcade.overlap(this.swords, this.twigs, this.attack_c, null, this);
      //game.physics.arcade.overlap(this.sword_b, this.twigs, this.attack_c, null, this);
      game.physics.arcade.overlap(this.arrows, this.twigs, this.attack_f, null, this);
      game.physics.arcade.overlap(this.swords, this.whitewalkers, this.attack_c, null, this);
      //game.physics.arcade.overlap(this.sword_b, this.whitewalkers, this.attack_c, null, this);
      game.physics.arcade.overlap(this.arrows, this.whitewalkers, this.attack_f, null, this);
      game.physics.arcade.overlap(this.swords, this.barbarians, this.attack_c, null, this);
      //game.physics.arcade.overlap(this.sword_b, this.barbarians, this.attack_c, null, this);
      game.physics.arcade.overlap(this.arrows, this.barbarians, this.attack_f, null, this);
      game.physics.arcade.overlap(this.swords, this.stonemans, this.attack_c, null, this);
      //game.physics.arcade.overlap(this.sword_b, this.stonemans, this.attack_c, null, this);
      game.physics.arcade.overlap(this.arrows, this.stonemans, this.attack_f, null, this);
      game.physics.arcade.overlap(this.swords, this.fishs, this.attack_c, null, this);
      //game.physics.arcade.overlap(this.sword_b, this.fishs, this.attack_c, null, this);
      game.physics.arcade.overlap(this.arrows, this.fishs, this.attack_f, null, this);
      game.physics.arcade.overlap(this.player, this.woods, this.pickUp, null, this);
      game.physics.arcade.overlap(this.player, this.forestBullets, this.hurt, null, this);
      game.physics.arcade.overlap(this.player, this.snowBullets, this.hurt, null, this);
      game.physics.arcade.overlap(this.player, this.grassBullets, this.hurt, null, this);
      game.physics.arcade.overlap(this.player, this.mineBullets, this.hurt, null, this);
      game.physics.arcade.overlap(this.player, this.beachBullets, this.hurt, null, this);
    }
  },

  /* Generate Materials */
  genWood: function() {
    var w = this.woods.getFirstExists(false);
    if(w) w.reset(game.rnd.integerInRange(this.player.x-200, this.player.x+200), game.rnd.integerInRange(this.player.y-200, this.player.y+200));
  },
  growElement: function()
  {    
    console.log("grow");
    var grow, i, radian=0, posx, posy;
    var xs = [0, 1];
    var ys = [0, 0.5, 1];
    this.growTime++;
    // console.log("growTime = "+this.growTime);
    var woodPos = [{x: 307, y: 319}, {x: 631, y: 281}, {x: 425, y: 463},
                    {x: 97, y: 591}, {x: 831, y: 503}, {x: 797, y: 479},
                    {x: 247, y: 741}];
    var icePos = [{x: 1317, y: 295}, {x: 1477, y: 479}, {x: 1663, y: 655},
                    {x: 1835, y: 615}, {x: 1219, y: 559}, {x: 1667, y: 659},
                    {x: 1895, y: 797}];
    var caterPos = [{x: 1065, y: 711}, {x: 601, y: 923}, {x: 925, y: 851},
                    {x: 1425, y: 911}, {x: 979, y: 1031}, {x: 1441, y: 1107},
                    {x: 659, y: 1191}, {x: 995, y: 1231}];                
    var coalPos = [{x: 1743, y: 1055}, {x: 1813, y: 1211}, {x: 1471, y: 1397},
                    {x: 1905, y: 1347}, {x: 1651, y: 1469}, {x: 1917, y: 1557}];
                   
    var shellPos = [{x: 547, y: 1693}, {x: 845, y: 1591}, {x: 1119, y: 1623},
                    {x: 1344, y: 1578}, {x: 1663, y: 1705}, {x: 963, y: 1757}];
                                                          
    for(var j=0;j<5;j++)
    { 
      switch(j)
      {
        case 0:
          grow = this.woods.getFirstExists(false);
          posx = woodPos[this.growTime%(woodPos.length)].x;
          posy = woodPos[this.growTime%(woodPos.length)].y;
          break;
        case 1:
          grow = this.ices.getFirstExists(false);
          posx = icePos[this.growTime%(icePos.length)].x;
          posy = icePos[this.growTime%(icePos.length)].y;
          break;
        case 2: 
          grow = this.coals.getFirstExists(false);
          posx = coalPos[this.growTime%(coalPos.length)].x;
          posy = coalPos[this.growTime%(coalPos.length)].y;
          break;
        case 3:
          grow = this.shells.getFirstExists(false);
          posx = shellPos[this.growTime%(shellPos.length)].x;
          posy = shellPos[this.growTime%(shellPos.length)].y;
          break;
        case 4:
          grow = this.caterpillars.getFirstExists(false);
          posx = caterPos[this.growTime%(caterPos.length)].x;
          posy = caterPos[this.growTime%(caterPos.length)].y;
        break;
      }
      for(var i=0;i<3;i++)
      {
        radian = 120*3.14*i/180;
        if(grow)
        {
          
          grow.reset(posx + 30*Math.cos(radian), posy + 30*Math.sin(radian));
          // console.log("x = " + posx);
          // console.log("y = " + posy);
        }
        // else
        // {
        //   i--;
        // }
      }

    }
  },

  /* State transitions */
  toMap: function() {
    var bag = document.getElementById("bag");
    bag.style.display = "none";
    Client.socket.close();
    game.state.start('map'); 
  },
  toHome: function() {
    var bag = document.getElementById("bag");
    bag.style.display = "none"; 
    Client.socket.close();
    game.state.start('home');  
  },
  openBag: function() {
    var bag = document.getElementById("bag");
    if(bag.style.display == "none"){
      bag.style.display = "block"; 
    }else{
      bag.style.display = "none";
    }
  },
  openStore: function() {
    var bag = document.getElementById("bag");
    bag.style.display = "block"; 
    bag.style.left = "calc(50% - 205px)";
    var store = document.getElementById("store");
    store.style.display = "block"; 
    var x = document.getElementsByClassName("sale");
    var i;
    for (i = 0; i < x.length; i++) {
      x[i].style.display = "inline";
    }
  }
}; 