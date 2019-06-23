//var livingForest, livingSnow, livingGrass, livingMine, livingBeach;
var fieldState = { 
  preload: function() {
    game.stage.disableVisibilityChange = true;
  },
  create: function() {
    loadValues();
    Client.initState('field');
    var bag = document.getElementById("bag");
    bag.style.left = "";
    bag.style.display = "none";
    var cra = document.getElementById("craft");
    cra.style.display = "none";
    this.bg = game.add.tileSprite(0, 0, 2000, 2000, 'field');
    game.world.setBounds(0, 0, 2000, 2000);
    this.playing = 1;

    /*this.borderH = 600;
    this.borderV = 600;*/

    //Sound
    this.enemyDieSnd = game.add.audio('enemyDieSnd');
    this.attackSnd = game.add.audio('attackSnd');
    this.shootSnd = game.add.audio('shootSnd');

    /* this.woods = game.add.group();
    this.woods.enableBody = true;
    this.woods.createMultiple(30, 'wood');
    this.woods.forEach(function(w) {
      w.anchor.setTo(0.5, 0.5);
    }, this); */

    var i = 0;
    this.attackCircleList = [];
    this.circles = game.add.group();
    this.circles.enableBody = true;
    this.circles.createMultiple(10, 'attackcircle');
    this.circles.forEach(function(c) {
      c.anchor.setTo(0.5, 0.5);
      c.id = i;
      this.attackCircleList[i++] = c;
      c.kill();
    }, this);
    
    /* Enemies */
    i = 0;
    this.keyB = game.input.keyboard.addKey(Phaser.Keyboard.B);
    this.keyB.onDown.add(this.toMap, this);
    this.keyQ = game.input.keyboard.addKey(Phaser.Keyboard.Q);
    this.keyQ.onDown.add(this.swordA, this);
    this.keyW = game.input.keyboard.addKey(Phaser.Keyboard.W);
    this.keyW.onDown.add(this.arrowA, this);
    this.keyE = game.input.keyboard.addKey(Phaser.Keyboard.E);

    /*this.genW = game.add.text(20, 20, 'W', { font: '40px Microsoft JhengHei', backgroundColor: 'white'});
    this.genW.inputEnabled = true;
    this.genW.fixedToCamera = true;
    this.genW.events.onInputDown.add(this.genWood, this);*/    
    
    //石頭(all)、木材(forest)、冰(snow)、ㄇㄇ蟲(草地)、棉花(evil)、礦(evil)、貝殼(beach) )
    this.stones = game.add.group();
    this.stones.enableBody = true;
    this.stones.createMultiple(30, 'stone');
    this.stones.forEach(function(i) {i.name = "stone";}, this);
    
    this.woods = game.add.group();
    this.woods.enableBody = true;
    this.woods.createMultiple(30, 'wood');
    this.woods.forEach(function(i) {i.name = "wood";}, this);
    
    this.ices = game.add.group();
    this.ices.enableBody = true;
    this.ices.createMultiple(100, 'ice');
    this.ices.forEach(function(i) {i.name = "ice";}, this);
    
    this.caterpillars = game.add.group();
    this.caterpillars.enableBody = true;
    this.caterpillars.createMultiple(100, 'caterpillar');
    this.caterpillars.forEach(function(i) {i.name = "cater";}, this);

    this.irons = game.add.group();
    this.irons.enableBody = true;
    this.irons.createMultiple(30, 'iron');
    this.irons.forEach(function(i) {i.name = "iron";}, this);

    this.shells = game.add.group();
    this.shells.enableBody = true;
    this.shells.createMultiple(30, 'shell');
    this.shells.forEach(function(i) {i.name = "shell";}, this);

    this.growTime = 0;
    this.genEnemyTime = 0;

    //left
    this.forestlefts = game.add.group();
    this.forestlefts.enableBody = true;
    this.forestlefts.createMultiple(30, 'forestleft');
    this.forestlefts.forEach(function(i) {i.name = "coal";}, this);

    this.snowlefts = game.add.group();
    this.snowlefts.enableBody = true;
    this.snowlefts.createMultiple(30, 'snowleft');
    this.snowlefts.forEach(function(i) {i.name = "fur";}, this);

    this.minelefts = game.add.group();
    this.minelefts.enableBody = true;
    this.minelefts.createMultiple(30, 'mineleft');
    this.minelefts.forEach(function(i) {i.name = "cotton";}, this);

    this.grasslefts = game.add.group();
    this.grasslefts.enableBody = true;
    this.grasslefts.createMultiple(30, 'grassleft');
    this.grasslefts.forEach(function(i) {i.name = "meat";}, this);

    this.beachlefts = game.add.group();
    this.beachlefts.enableBody = true;
    this.beachlefts.createMultiple(30, 'beachleft');
    this.beachlefts.forEach(function(i) {i.name = "weed";}, this);
    
    this.enemies = [];

    this.twigs = game.add.group();
    this.twigs.enableBody = true;
    this.twigs.createMultiple(2, 'forestEnemy');
    this.twigs.forEach(function(m) {
      m.id = i;
      m.type = "forest";
      m.anchor.setTo(0.5, 0.5);
      m.scale.setTo(0.5, 0.5);
      m.attack = 0;
      m.isAlive = true;
      //m.label = game.add.text(-20, -20, 'hp: 3', { font: '15px Microsoft JhengHei', backgroundColor: 'white'});
      m.animations.add('walkR', [0, 1], 4, false);
      m.animations.add('walkL', [2, 3], 4, false);
      m.faceL = 1;
      m.blood = 10;//0621
      m.bloodBottom = game.add.image(-20, -20, 'monsterBloodBottom');
      m.bloodBottom.anchor.setTo(0,0);
      m.bloodAbove = game.add.image(-20, -20, 'monsterBloodAll');
      m.bloodAbove.anchor.setTo(0,0);
      fieldState.enemies[i++] = m;
      m.kill();
    }, this);
    
    this.whitewalkers = game.add.group();
    this.whitewalkers.enableBody = true;
    this.whitewalkers.createMultiple(2, 'snowEnemy');
    this.whitewalkers.forEach(function(m) {
      m.id = i;
      m.type = "snow";
      m.anchor.setTo(0.5, 0.5);
      m.scale.setTo(0.4, 0.4);
      m.attack = 0;
      m.isAlive = true;
      m.animations.add('attackL', [0, 1, 2, 3, 4, 5, 6], 14, false);
      m.animations.add('attackR', [7, 8, 9, 10,11,12,13], 14, false);
      m.faceL = 1;
      m.blood = 10;//0621
      m.bloodBottom = game.add.image(-20, -20, 'monsterBloodBottom');
      m.bloodBottom.anchor.setTo(0,0);
      m.bloodAbove = game.add.image(-20, -20, 'monsterBloodAll');
      m.bloodAbove.anchor.setTo(0,0);
      fieldState.enemies[i++] = m;
      m.kill();
      //game.time.events.add(1000, function() {m.notattacked = (m.notattacked==5)?m.notattacked:m.notattacked++;}, this);
      //not attacked in 5 sec means dont attack
    }, this);

    this.barbarians = game.add.group();
    this.barbarians.enableBody = true;
    this.barbarians.createMultiple(2, 'barbarian');
    this.barbarians.forEach(function(m) {
      m.id = i;
      m.type = "grass";
      m.anchor.setTo(0.5, 0.5);
      m.scale.setTo(0.5, 0.5);
      m.attack = 0;
      m.notattacked = 5;
      m.isAlive = true;
      //m.label = game.add.text(-20, -20, 'hp: 3', { font: '15px Microsoft JhengHei', backgroundColor: 'white'});
      m.animations.add('attack', [0, 1, 2, 3, 5, 6, 7, 8, 9, 10, 11], 12, false);
      m.faceL = 1;
      m.blood = 10;
      m.bloodBottom = game.add.image(-20, -20, 'monsterBloodBottom');
      m.bloodBottom.anchor.setTo(0,0);
      m.bloodAbove = game.add.image(-20, -20, 'monsterBloodAll');
      m.bloodAbove.anchor.setTo(0,0);
      fieldState.enemies[i++] = m;
      m.kill();
    }, this);

    this.stonemans = game.add.group();
    this.stonemans.enableBody = true;
    this.stonemans.createMultiple(2, 'mineEnemy');
    this.stonemans.forEach(function(m) {
      m.id = i;
      m.type = "mine";
      m.anchor.setTo(0.5, 0.5);
      m.scale.setTo(0.5, 0.5);
      m.notattacked = 0;
      m.isAlive = true;
      //m.label = game.add.text(-20, -20, 'hp: 3', { font: '15px Microsoft JhengHei', backgroundColor: 'white'});
      m.animations.add('walkL', [0, 1], 4, false);
      m.animations.add('walkR', [2, 3], 4, false);
      m.faceL = 1;
      m.blood = 10;
      m.bloodBottom = game.add.image(-20, -20, 'monsterBloodBottom');
      m.bloodBottom.anchor.setTo(0,0);
      m.bloodAbove = game.add.image(-20, -20, 'monsterBloodAll');
      m.bloodAbove.anchor.setTo(0,0);
      fieldState.enemies[i++] = m;
      m.kill();
    }, this);

    this.fishs = game.add.group();
    this.fishs.enableBody = true;
    this.fishs.createMultiple(2, 'beachEnemy');
    this.fishs.forEach(function(m) {
      m.id = i;
      m.type = "beach";
      m.anchor.setTo(0.5, 0.5);
      m.scale.setTo(0.5, 0.5);
      m.attack = 0;
      m.notattacked = 5;
      m.isAlive = true;
      //m.label = game.add.text(-20, -20, 'hp: 3', { font: '15px Microsoft JhengHei', backgroundColor: 'white'});
      m.animations.add('walkL', [0, 1], 4, false);
      m.animations.add('walkR', [2, 3], 4, false);
      m.faceL = 1;
      m.blood = 3;
      m.bloodBottom = game.add.image(-20, -20, 'monsterBloodBottom');
      m.bloodBottom.anchor.setTo(0,0);
      m.bloodAbove = game.add.image(-20, -20, 'monsterBloodAll');
      m.bloodAbove.anchor.setTo(0,0);
      fieldState.enemies[i++] = m;
      m.kill();
    }, this);

    this.ghosts = game.add.group();		
    this.ghosts.enableBody = true;		
    this.ghosts.createMultiple(10, 'ghost');		
    this.ghosts.forEach(function(g) {		
      g.scale.setTo(0.4, 0.4);		
      g.anchor.setTo(0.5, 0.5);		
    }, this);
    
    this.gostore = game.add.image(320, 1100, 'chooseStore');
    this.gostore.alpha = 0;
    this.store_bd = game.add.sprite(80, 1160, 'bound');
    this.store_bd.scale.setTo(2.7,2.2);
    game.physics.arcade.enable(this.store_bd);
    this.store_bd.body.immovable = true;
    this.store = game.add.button(80, 1160, 'store', this.openStore, this); 
    this.store.onInputOver.add(function(){this.gostore.alpha = 1;}, this);
    this.store.onInputOut.add(function(){this.gostore.alpha = 0;}, this);

    this.swords_b = game.add.group();
    this.swords_b.createMultiple(50, 'sword');
    this.swords_b.enableBody = true;
    this.swords_b.physicsBodyType = Phaser.Physics.ARCADE; 
    this.swords_b.forEach(function(a) {
      a.scale.setTo(0.6, 0.6); 
      a.animations.add('attright', [0, 1, 2], 12, false);
      a.animations.add('attright2', [6, 7, 8], 12, false);
      a.animations.add('attright3', [12, 13, 14], 12, false);
      a.animations.add('attleft', [5, 4, 3], 12, false);
      a.animations.add('attleft2', [11, 10, 9], 12, false);
      a.animations.add('attleft3', [17, 16, 15], 12, false);
      game.physics.arcade.enable(a);
      a.kill();
    }, this); 

    this.bridge = game.add.sprite(30, 1000, 'bridge');
    this.bridge.anchor.setTo(0.5, 0); 
    this.bridge_bd = game.add.sprite(0, 1000, 'bound');
    this.bridge_bd.scale.setTo(1,0.01);
    this.bridge_bd.enableBody = true;
    game.physics.arcade.enable(this.bridge_bd);

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
      a.scale.setTo(0.6, 0.6); 
      a.animations.add('attright', [0, 1, 2], 12, false);
      a.animations.add('attright2', [6, 7, 8], 12, false);
      a.animations.add('attright3', [12, 13, 14], 12, false);
      a.animations.add('attleft', [5, 4, 3], 12, false);
      a.animations.add('attleft2', [11, 10, 9], 12, false);
      a.animations.add('attleft3', [17, 16, 15], 12, false);
      game.physics.arcade.enable(a);
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

    /*this.life = game.add.text(700, 20, 'HP: ' + game.global.hp, { font: '30px Arial'} );
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
    this.bag.events.onInputDown.add(this.openBag, this);*/

    ////enemy by shuling
    //enemy
    this.enemyBulletsList = [];
    //enemies1 bullet
    this.forestBullets= game.add.group();
    this.forestBullets.enableBody = true;
    this.forestBullets.physicsBodyType = Phaser.Physics.ARCADE; 
    this.forestBullets.createMultiple(50, 'forestBullet');
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
    this.snowBullets.createMultiple(50, 'snowBullet');
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

    /* UI */
    this.lifebar = game.add.sprite(10, 10, 'bloodBottom');
    this.life = game.add.sprite(51, 32, 'blood');
    this.lifetext = game.add.text(114, 33, '20/20', { font: '10px Arial', fill: "white"} );
    this.lifebar.fixedToCamera = true;
    this.life.fixedToCamera = true;
    this.lifetext.fixedToCamera = true;

    this.lalala = game.add.image(20, 80, 'lalala');
    this.fast = game.add.image(80, 80, 'fast');
    this.power = game.add.image(140, 80, 'power');
    this.lalala.fixedToCamera = true;
    this.fast.fixedToCamera = true;
    this.power.fixedToCamera = true;
    this.lalala.scale.setTo(0.5, 0.5); 
    this.fast.scale.setTo(0.5, 0.5); 
    this.power.scale.setTo(0.5, 0.5); 
    this.lalala.alpha = 0;
    this.fast.alpha = 0;
    this.power.alpha = 1;

    //loop
    game.time.events.loop(100, this.moveEnemy, this);
    //game.time.events.loop(50, this.enemyAttack, this);
    game.time.events.loop(700, this.enemyShoot, this);
    game.time.events.loop(8000, this.generateEnemy, this);
    game.time.events.loop(3000, this.growElement, this);
  }, 
  
  update: function() {
    if(this.playing && this.player && this.player.body){
      if(!this.player.freeze) this.movePlayer();
      this.playerGroup.sort('y', Phaser.Group.SORT_ASCENDING);
      //this.enemyAlive();
      this.updateEnemyBlood();
      this.bulletBound();
      this.UIControl();
      //this.updateText();
      //this.playerGroup.sort('y', Phaser.Group.SORT_ASCENDING);
      game.physics.arcade.collide(this.player, this.store_bd);
      game.physics.arcade.overlap(this.player, this.bridge_bd, this.toMap, null, this);
      
      game.physics.arcade.overlap(this.arrows, this.twigs, this.attack_f, null, this);
      game.physics.arcade.overlap(this.arrows, this.whitewalkers, this.attack_f, null, this);
      game.physics.arcade.overlap(this.arrows, this.barbarians, this.attack_f, null, this);
      game.physics.arcade.overlap(this.arrows, this.stonemans, this.attack_f, null, this);
      game.physics.arcade.overlap(this.arrows, this.fishs, this.attack_f, null, this);
      
      game.physics.arcade.overlap(this.player, this.circles, this.nearAttack, null, this);
      game.physics.arcade.overlap(this.player, this.forestBullets, this.farAttack, null, this);
      game.physics.arcade.overlap(this.player, this.snowBullets, this.farAttack, null, this);
      game.physics.arcade.overlap(this.player, this.grassBullets, this.farAttack, null, this);
      game.physics.arcade.overlap(this.player, this.mineBullets, this.farAttack, null, this);
      game.physics.arcade.overlap(this.player, this.beachBullets, this.farAttack, null, this);

      game.physics.arcade.overlap(this.player, this.woods, this.pickUp, null, this);
      game.physics.arcade.overlap(this.player, this.stones, this.pickUp, null, this);
      game.physics.arcade.overlap(this.player, this.ices, this.pickUp, null, this);
      game.physics.arcade.overlap(this.player, this.caterpillars, this.pickUp, null, this);
      game.physics.arcade.overlap(this.player, this.irons, this.pickUp, null, this);
      game.physics.arcade.overlap(this.player, this.shells, this.pickUp, null, this);
      game.physics.arcade.overlap(this.player, this.forestlefts, this.pickUp, null, this);
      game.physics.arcade.overlap(this.player, this.snowlefts, this.pickUp, null, this);
      game.physics.arcade.overlap(this.player, this.grasslefts, this.pickUp, null, this);
      game.physics.arcade.overlap(this.player, this.minelefts, this.pickUp, null, this);
      game.physics.arcade.overlap(this.player, this.beachlefts, this.pickUp, null, this);
      
      /*game.physics.arcade.overlap(this.swords, this.twigs, this.attack_c, null, this);
      game.physics.arcade.overlap(this.swords, this.whitewalkers, this.attack_c, null, this);
      game.physics.arcade.overlap(this.swords, this.barbarians, this.attack_c, null, this);
      game.physics.arcade.overlap(this.swords, this.stonemans, this.attack_c, null, this);
      game.physics.arcade.overlap(this.swords, this.fishs, this.attack_c, null, this);

      game.physics.arcade.overlap(this.swords_b, this.twigs, this.attack_c, null, this);
      game.physics.arcade.overlap(this.swords_b, this.whitewalkers, this.attack_c, null, this);
      game.physics.arcade.overlap(this.swords_b, this.barbarians, this.attack_c, null, this);
      game.physics.arcade.overlap(this.swords_b, this.stonemans, this.attack_c, null, this);
      game.physics.arcade.overlap(this.swords_b, this.fishs, this.attack_c, null, this);
      */
    }
  },

  /* Generate Materials */
  /*genWood: function() {
    var w = this.woods.getFirstExists(false);
    if(w) w.reset(game.rnd.integerInRange(this.player.x-200, this.player.x+200), game.rnd.integerInRange(this.player.y-200, this.player.y+200));
  },*/
  UIControl: function() {
    if(game.global.weed) this.lalala.alpha = 1;
      else this.lalala.alpha = 0;
      if(game.global.attup) this.power.alpha = 1;
      else this.power.alpha = 0;
      if(game.global.speup==2) this.fast.alpha = 1;
      else this.fast.alpha = 0;
  },

  growElement: function() {    
    console.log("grow");
    var grow, i, radian=0, posx, posy;
    var xs = [0, 1];
    var ys = [0, 0.5, 1];
    this.growTime++;
    // console.log("growTime = "+this.growTime);
    var stonePos = [{x: 425, y: 463}, {x: 1663, y: 655}, {x: 925, y: 851}, {x: 1471, y: 1397}, {x: 1119, y: 1623}];
    var woodPos = [{x: 307, y: 319}, /*{x: 631, y: 281}, {x: 425, y: 463},
                    {x: 97, y: 591}, {x: 831, y: 503}, */{x: 797, y: 479},
                    {x: 247, y: 741}];
    var icePos = [{x: 1317, y: 295}, /*{x: 1477, y: 479}, {x: 1663, y: 655},
                    {x: 1835, y: 615}, {x: 1219, y: 559}, {x: 1667, y: 659},*/
                    {x: 1895, y: 797}];
    var caterPos = [/*{x: 1065, y: 711}, {x: 601, y: 923}, {x: 925, y: 851},*/
                    {x: 1425, y: 911}, /*{x: 979, y: 1031}, {x: 1441, y: 1107},
                    {x: 659, y: 1191},*/ {x: 995, y: 1231}];                
    var coalPos = [{x: 1743, y: 1055}, /*{x: 1813, y: 1211}, {x: 1471, y: 1397},
                    {x: 1905, y: 1347}, {x: 1651, y: 1469}, */{x: 1917, y: 1557}];
                   
    var shellPos = [{x: 547, y: 1693}, /*{x: 845, y: 1591}, {x: 1119, y: 1623},
                    {x: 1344, y: 1578}, {x: 1663, y: 1705}, */{x: 963, y: 1757}];
                                                          
    for(var j=0;j<6;j++)
    { 
      switch(j) {
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
          grow = this.irons.getFirstExists(false);
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
        case 5:
          grow = this.stones.getFirstExists(false);
          posx = stonePos[this.growTime%(stonePos.length)].x;
          posy = stonePos[this.growTime%(stonePos.length)].y;
        break;
      }
      for(var i=0;i<3;i++) {
        radian = 120*3.14*i/180;
        if(grow) {
          grow.reset(posx + 30*Math.cos(radian), posy + 30*Math.sin(radian));
        }
      }
    }
  },

  /* State transitions */
  toMap: function() {
    var bag = document.getElementById("bag");
    bag.style.display = "none";
    this.closeStore();
    this.player.kill();
    Client.socket.close();
    game.state.start('map'); 
  },
  toHome: function() {
    var bag = document.getElementById("bag");
    bag.style.display = "none"; 
    this.closeStore();
    this.player.kill();
    Client.socket.close();
    game.state.start('home');  
  },
  openBag: function() {
    console.log("open bag");
    var bag = document.getElementById("bag");
    if(bag.style.display == "none"){
      bag.style.display = "block"; 
    }else{
      bag.style.display = "none";
    }
  },
  openStore: function() {
    game.fieldBgm.pause();
    game.time.events.add(5000, function() {game.fieldBgm.resume();}, this);
    game.shopWelcome.play();
    var bag = document.getElementById("bag");
    bag.style.display = "block"; 
    bag.style.left = "30%"; //205
    var store = document.getElementById("store");
    store.style.display = "block"; 
    var x = document.getElementsByClassName("sale");
    var i;
    for (i = 0; i < x.length; i++) {
      x[i].style.display = "inline";
    }
    var x = document.getElementsByClassName("sale_btn");
    var y = document.getElementsByClassName("btn");
    var z = document.getElementsByClassName("buy_btn");
    var i,j,k;
    for (i = 0; i < x.length; i++) {
      x[i].style.display = "inline";
    }
    for (j = 0; j < y.length; j++) {
      y[j].style.display = "none";
    }
    for (k = 0; k < z.length; k++) {
      z[k].disabled = true;
    }
  },
  closeStore: function() {
    console.log("close store");
    money = 0;
    var bag = document.getElementById("bag");
    bag.style.display = "none"; 
    bag.style.left = "-130px";
    var store = document.getElementById("store");
    store.style.display = "none"; 
    var x = document.getElementsByClassName("sale");
    var i;
    for (i = 0; i < x.length; i++) {
      x[i].innerHTML = -0;
      x[i].style.display = "none";
    }
    var x = document.getElementsByClassName("button");
    var y = document.getElementsByClassName("sale_btn");
    var z = document.getElementsByClassName("buy_btn");
    var i,j,k;
    for (i = 0; i < x.length; i++) {
      x[i].style.display = "inline";
    }
    for (j = 0; j < y.length; j++) {
      y[j].style.display = "none";
    }
    for (k = 0; k < z.length; k++) {
      z[k].disabled = true;
    }
    saveState();
  }
}; 