var livingEnemies1, livingEnemies2;

var fieldState = { 
  preload: function() {
    game.stage.disableVisibilityChange = true;
  },
  create: function() {
    loadValues();
    Client.initState('field');
    var info = document.getElementById("info");
    info.style.display = "block"; 
    var bag = document.getElementById("bag");
    bag.style.left = "calc(50% - 75px)";
    bag.style.display = "none";
    var cra = document.getElementById("craft");
    cra.style.display = "none";
    this.bg = game.add.tileSprite(0, 0, 2000, 1500, 'field');
    game.world.setBounds(0, 0, 2000, 1500);
    this.playing = 1;

    this.borderH = 2000/2;
    this.borderV = 1500/2;

    this.woods = game.add.group();
    this.woods.enableBody = true;
    this.woods.createMultiple(30, 'wood');
    this.woods.forEach(function(w) {
      w.anchor.setTo(0.5, 0.5);
    }, this);

    this.enemies = [];
    this.monsters = game.add.group();
    this.monsters.enableBody = true;
    var i = 0;
    this.monsters.createMultiple(10, 'monster');
    this.monsters.forEach(function(m) {
      m.id = i;
      m.anchor.setTo(0.5, 0.5);
      m.blood = 3;
      m.label = game.add.text(-20, -20, 'hp: 3', { font: '15px Microsoft JhengHei', backgroundColor: 'white'});
      m.type = "forest";
      this.enemies[i++] = m;
      m.kill();
    }, this);
    
    this.monsters2 = game.add.group();
    this.monsters2.enableBody = true;
    this.monsters2.createMultiple(10, 'monster2');
    this.monsters2.forEach(function(m) {
      m.id = i;
      m.anchor.setTo(0.5, 0.5);
      m.blood = 3;
      m.label = game.add.text(-20, -20, 'hp: 3', { font: '15px Microsoft JhengHei', backgroundColor: 'white'});
      m.notattacked = 5;
      m.type = "snow";
      game.time.events.add(1000, function() {m.notattacked = (m.notattacked==5)?m.notattacked:m.notattacked++;}, this);
      //not attacked in 5 sec means dont attack  
      this.enemies[i++] = m;
      m.kill();
    }, this);

    this.playerGroup = game.add.group();
    this.playerGroup.setAll('anchor.x', 0.5);
    this.playerGroup.setAll('anchor.y', 0.5);
    this.playerGroup.setAll('body.collideWorldBounds', true);
    game.physics.arcade.enable(this.playerGroup);
    /*this.playerGroup.callAll('animations.add', 'animations', 'goforward', [0, 1, 2, 3], 8, true);
    this.playerGroup.callAll('animations.add', 'animations', 'goleft', [4, 5, 6, 7], 8, true);
    this.playerGroup.callAll('animations.add', 'animations', 'goright', [8, 9, 10, 11], 8, true);
    this.playerGroup.callAll('animations.add', 'animations', 'gobackward', [12, 13, 14, 15], 8, true);*/
    this.playersList = [];
    /*
    this.player = game.add.sprite(400, 300, 'player');
    this.player.anchor.setTo(0.5, 0.5); 
    this.player.facing = 0;
    this.player.animations.add('goforward', [0, 1, 2, 3], 8, true);
    this.player.animations.add('goleft', [4, 5, 6, 7], 8, true);
    this.player.animations.add('goright', [8, 9, 10, 11], 8, true);
    this.player.animations.add('gobackward', [12, 13, 14, 15], 8, true);
    game.physics.arcade.enable(this.player);
    game.camera.follow(this.player);
    this.player.body.collideWorldBounds = true;
    this.hp = document.getElementById("hp");
    this.player.health = this.hp.innerHTML; 
    */
    this.swords = game.add.group();
    this.swords_b = game.add.group();
    this.swords_b.createMultiple(50, 'sword');
    this.swords.createMultiple(50, 'sword');
    this.swords.enableBody = true;
    this.swords.physicsBodyType = Phaser.Physics.ARCADE; 
    this.swords_b.physicsBodyType = Phaser.Physics.ARCADE;
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

    this.closeA = game.add.text(20, 460, '近戰', { font: '40px Microsoft JhengHei', backgroundColor: 'white'});
    this.closeA.inputEnabled = true;
    this.closeA.fixedToCamera = true;
    this.closeA.events.onInputDown.add(this.swordA, this);
    this.farA = game.add.text(20, 520, '遠程', { font: '40px Microsoft JhengHei', backgroundColor: 'white'});
    this.farA.inputEnabled = true;
    this.farA.fixedToCamera = true;
    this.farA.events.onInputDown.add(this.arrowA, this);

    this.genW = game.add.text(20, 20, 'W', { font: '40px Microsoft JhengHei', backgroundColor: 'white'});
    this.genW.inputEnabled = true;
    this.genW.fixedToCamera = true;
    this.genW.events.onInputDown.add(this.genWood, this);
    
    this.stones = game.add.group();
    this.stones.enableBody = true;
    this.stones.createMultiple(30, 'stone');

    this.bones = game.add.group();
    this.bones.enableBody = true;
    this.bones.createMultiple(30, 'bone');
    ////enemy by shuling
    //enemy
    //enemies1 bullet
    this.enemyBulletsList = [];
    this.enemyBullets= game.add.group();
    this.enemyBullets.enableBody = true;
    this.enemyBullets.physicsBodyType = Phaser.Physics.ARCADE; 
    this.enemyBullets.createMultiple(100, 'enemyBullet');
    this.enemyBullets.setAll('anchor.x', 0.5);
    this.enemyBullets.setAll('anchor.y', 0);
    this.enemyBullets.setAll('outOfBoundsKill', true);
    this.enemyBullets.setAll('checkWorldBounds', true);
    i = 0;
    this.enemyBullets.forEach(function(b) {
      b.id = i;
      b.type = "forest";
      this.enemyBulletsList[i++] = b;
      b.kill();
    }, this);
    //enemy2 bullets
    this.enemyBullets2= game.add.group();
    this.enemyBullets2.enableBody = true;
    this.enemyBullets2.physicsBodyType = Phaser.Physics.ARCADE; 
    this.enemyBullets2.createMultiple(100, 'enemyBullet2');
    this.enemyBullets2.setAll('anchor.x', 0.5);
    this.enemyBullets2.setAll('anchor.y', 0);
    this.enemyBullets2.setAll('outOfBoundsKill', true);
    this.enemyBullets2.setAll('checkWorldBounds', true);
    this.enemyBullets2.forEach(function(b) {
      b.id = i;
      b.type = "snow";
      this.enemyBulletsList[i++] = b;
      b.kill();
    }, this);
    //loop
    game.time.events.loop(200, this.moveEnemy, this);
    game.time.events.loop(5000, this.enemy1Shoot, this);
    game.time.events.loop(5000, this.enemy2Shoot, this);
    game.time.events.loop(3000, this.generateEnemy, this);
    game.time.events.loop(4000, this.generateEnemy2, this);

  }, 
  update: function() {
    if(this.playing) {
      if(this.player && this.player.body) this.movePlayer();
      this.enemyAlive();
      this.updateEnemyLabel();
      this.playerGroup.sort('y', Phaser.Group.SORT_ASCENDING);
      game.physics.arcade.overlap(this.swords, this.monsters, this.attack_c, null, this);
      game.physics.arcade.overlap(this.sword_b, this.monsters, this.attack_c, null, this);
      game.physics.arcade.overlap(this.arrows, this.monsters, this.attack_f, null, this);
      game.physics.arcade.overlap(this.swords, this.monsters2, this.attack_c, null, this);
      game.physics.arcade.overlap(this.sword_b, this.monsters2, this.attack_c, null, this);
      game.physics.arcade.overlap(this.arrows, this.monsters2, this.attack_f, null, this);
      game.physics.arcade.overlap(this.player, this.woods, this.pickUp, null, this);
      game.physics.arcade.overlap(this.player, this.enemyBullets, this.hurt, null, this);
      game.physics.arcade.overlap(this.player, this.enemyBullets2, this.hurt, null, this);
    }
  },
  setPlayerId: function(newId) {
    this.playerId = newId;
  },
  addNewPlayer: function(id, x, y, skin) {
      if(skin==1) this.playersList[id] = game.add.sprite(x, y, 'player');
      this.playersList[id].id = id;
      this.playersList[id].freeze = false;
      this.playerGroup.add(this.playersList[id]);
      game.physics.arcade.enable(this.playersList[id]);
      this.playersList[id].body.collideWorldBounds = true;
      this.playersList[id].animations.add('goforward', [0, 1, 2, 3], 8, true);
      this.playersList[id].animations.add('goleft', [4, 5, 6, 7], 8, true);
      this.playersList[id].animations.add('goright', [8, 9, 10, 11], 8, true);
      this.playersList[id].animations.add('gobackward', [12, 13, 14, 15], 8, true);
      if(id == this.playerId) {
        this.player = this.playersList[id];
        game.camera.follow(this.player);
        this.player.facing = 0;
        this.hp = document.getElementById("hp");
        this.player.health = this.hp.innerHTML;
      }
  },
  updatePlayer: function(id, x, y, animation, facing) {
    this.playersList[id].x = x;
    this.playersList[id].y = y;
    if(animation == null) {
      this.playersList[id].animations.stop();
      this.playersList[id].frame = facing*4;
    }
    else this.playersList[id].animations.play(animation);
  },
  removePlayer: function(id) {
    this.playersList[id].destroy();
    delete this.playersList[id];
  },
  addEnemy: function(id, x, y, type, blood) {
    console.log(this.enemies);
    var enemy;
    if(type == "forest") {
      enemy = this.monsters.getFirstDead();  
      this.enemies[id] = this.monsters.getFirstDead();  
    }  
    else if(type == "snow") {
      enemy = this.monsters2.getFirstDead();   
      this.enemies[id] = this.monsters2.getFirstDead();
    } 
    if (!enemy) return;
    //this.enemies[id] = enemy;
    this.enemies[id].id = id;
    this.enemies[id].anchor.setTo(0.5, 0.5);
    this.enemies[id].reset(x, y);
    this.enemies[id].label = game.add.text(-20, -20, 'hp: 3', { font: '15px Microsoft JhengHei', backgroundColor: 'white'});
    this.enemies[id].type = type;
    this.enemies[id].body.gravity.y = 0;
    this.enemies[id].blood = 3;
    this.enemies[id].label.visible = true;
    this.enemies[id].label.x = enemy.x-5;
    this.enemies[id].label.y = enemy.y-100;
    this.enemies[id].body.velocity.x = 0;
    this.enemies[id].checkWorldBounds = true;
    this.enemies[id].outOfBoundsKill = true;
  },
  updateEnemy: function(id, x, y, blood/*, animation, facing*/) {
    this.enemies[id].x = x;
    this.enemies[id].y = y;
    this.enemies[id].blood = blood;
    /*if(animation == null) {
      this.enemies[id].animations.stop();
      this.enemies[id].frame = facing*4;
    }
    else this.enemies[id].animations.play(animation);*/
  },
  removeEnemy: function(id) {
    this.enemies[id].label.visible = false;
    this.enemies[id].kill();
  },
  updateEnemyLabel: function()
  {
    this.monsters.forEachAlive(function(enemy){
      enemy.label.x = enemy.x-5;
      enemy.label.y = enemy.y-100;
      enemy.label.text = "hp: "+enemy.blood;
    });
    this.monsters2.forEachAlive(function(enemy){
      enemy.label.x = enemy.x-5;
      enemy.label.y = enemy.y-100;
      enemy.label.text = "hp: "+enemy.blood;
    });
  },
  addBullet: function(id, x, y, velocityX, velocityY, type) {
    console.log("addBullet", id);
    if(type=="forest") this.enemyBulletsList[id] = this.enemyBullets.getFirstExists(false); 
    else if(type=="snow") this.enemyBulletsList[id] = this.enemyBullets2.getFirstExists(false); 
    this.enemyBulletsList[id].id = id;
    this.enemyBulletsList[id].reset(x, y);
    this.enemyBulletsList[id].body.velocity.x = velocityX;
    this.enemyBulletsList[id].body.velocity.y = velocityY;
    this.enemyBulletsList[id].events.onOutOfBounds.add(function() { 
      //console.log("OutOfBounds");
      Client.killBullet(id, "OutOfBounds");
    }, this);

  },
  removeBullet: function(id) {
    this.bullets[id].kill();
  },
  movePlayer: function() { 
    if(this.player.freeze){
      this.player.body.velocity.x = 0;
      this.player.body.velocity.y = 0;
      this.player.frame = this.player.facing*4;
      this.player.animations.stop();
    }else if (this.cursor.left.isDown) { 
      this.player.body.velocity.x = -200;
      this.player.body.velocity.y = 0;
      this.player.facing = 1;
      this.player.animations.play('goleft');
    }else if (this.cursor.right.isDown) { 
      this.player.body.velocity.x = 200;
      this.player.body.velocity.y = 0;
      this.player.facing = 2;
      this.player.animations.play('goright');
    }else if (this.cursor.up.isDown) { 
      this.player.body.velocity.x = 0;
      this.player.body.velocity.y = -200;
      this.player.facing = 3;
      this.player.animations.play('gobackward');
    }else if (this.cursor.down.isDown) { 
      this.player.body.velocity.x = 0;
      this.player.body.velocity.y = 200;
      this.player.facing = 0;
      this.player.animations.play('goforward');
    }else {
      this.player.body.velocity.x = 0;
      this.player.body.velocity.y = 0;
      this.player.frame = this.player.facing*4;
      this.player.animations.stop();
    }    
    if(this.player.animations.currentAnim.isPlaying) {
      Client.movePlayer(this.player.x, this.player.y, this.player.animations.currentAnim.name, this.player.facing);
    }
    else Client.movePlayer(this.player.x, this.player.y, null, this.player.facing);
  },
  genWood: function() {
    var w = this.woods.getFirstExists(false);
    if(w) w.reset(game.rnd.integerInRange(this.player.x-200, this.player.x+200), game.rnd.integerInRange(this.player.y-200, this.player.y+200));
  },
  swordA: function() {
    this.showSword(this.player);
    //console.log(this.player.freeze);
    Client.attack('sword');
  },
  showSword: function(player) {
    var sword = this.swords.getFirstDead();
    sword.x = -40;
    sword.y = -40;
    sword.x = -40;
    sword.y = -40;
    sword.lifeS
    if (player.facing == 0) { 
      sword.frame = 0;
      sword.reset(player.x-10, player.y-10);
    }else if (player.facing == 1) { 
      sword.frame = 1;
      sword.reset(player.x-32, player.y-10);
      sword.x = player.x-32;
      sword.y = player.y-10;
    }else if (player.facing == 2) { 
      sword.frame = 0;
      sword.reset(player.x, player.y-10);
      sword.x = player.x;
      sword.y = player.y-10;
    }else {
      sword.frame = 1;
      sword.reset(player.x-32, player.y-10);
    }    
    this.playersList[player.id].freeze = true;
    game.time.events.add(500, function() {
      sword.kill();
      this.player.freeze = false;
    }, this);
  },
  arrowA: function() {
    this.createArrow(this.player);
    Client.attack('arrow');
  },
  createArrow: function(player) {
    var a = this.arrows.getFirstExists(false);
    if(a){
      a.reset(game.rnd.integerInRange(player.x-200, player.x+200), game.rnd.integerInRange(player.y-200, player.y+200));
      a.frame = player.facing;
      if (player.facing == 0) {
        a.body.velocity.y = 400;
        a.x = player.x;
        a.y = player.y+50;
      }else if (player.facing == 1) { 
        a.body.velocity.x = -400;
        a.x = player.x-40;
        a.y = player.y+15;
      }else if (player.facing == 2) { 
        a.body.velocity.x = 400;
        a.x = player.x+40;
        a.y = player.y+15;
      }else {
        a.body.velocity.y = -400;
        a.x = player.x;
        a.y = player.y-50;
      }   
      game.time.events.add(1000, function() {a.kill();}, this);
    }
  },
  attack_c: function(weapon, monster) {
    
    monster.blood--;
    if(monster.type=="snow")
    {
      monster.notattacked = 0;
    }
    if(monster.blood<=0)
    {
      this.monsterDie(monster.x, monster.y, monster.type);
      //console.log(monster.id);
      Client.killEnemy(monster.id);
    }
    else Client.moveEnemy(monster.id, monster.x, monster.y, monster.blood/*, monster.animations.currentAnim.name, monster.facing*/);
  },
  attack_f: function(weapon, monster) {
    
    weapon.kill();
    monster.blood--;
    if(monster.type=="snow")
    {
      monster.notattacked = 0;
    }
    if(monster.blood<=0)
    {
      this.monsterDie(monster.x, monster.y, monster.type);
      Client.killEnemy(monster.id);
    }
    else Client.moveEnemy(monster.id, monster.x, monster.y, monster.blood/*, monster.animations.currentAnim.name, monster.facing*/);
  },
  
  monsterDie: function(x, y, type)
  {
    var left, i, radian=0;
    switch(type)
    {
      case "forest":
        left = this.stones.getFirstExists(false);
      break;
      case "snow" :
        left = this.bones.getFirstExists(false);
    }
    for(i=0;i<3;i++)
    {
      //stone = this.stones.getFirstExists(false);
      radian = 120*3.14*i/180;
      if(left)
      {
        left.reset(x+15*Math.cos(radian), y+15*Math.sin(radian));
      }
    }

  },
  growElement: function()
  {
    
  },
  pickUp: function(player, item) {
    item.kill();
    var num_w = document.getElementById("wood");
    num_w.innerHTML = Number(num_w.innerHTML)+1;
    saveState();
  },
  hurt: function(player, bul) {
    this.player.health --;
    this.hp.innerHTML = this.player.health;
    bul.kill();
    console.log(bul.id);
    Client.killBullet(bul.id, "hit");
    if(this.player.health < 1){
      this.hp.innerHTML = 20;
      this.dead();
    }
    saveState();
  },
  dead: function() {
    this.playing = 0;
    var gg = game.add.sprite(this.player.x, this.player.y, 'gg');
    gg.anchor.setTo(0.5, 0.5); 
    var info = document.getElementById("info");
    info.style.display = "none"; 
    this.player.kill();
    Client.socket.close();
    game.time.events.add(1000, function() {game.state.start('home');}, this);
  },
  toMap: function() {
    var bag = document.getElementById("bag");
    bag.style.display = "none";
    var info = document.getElementById("info");
    info.style.display = "none";  
    Client.socket.close();
    game.state.start('map'); 
  },
  toHome: function() {
    var bag = document.getElementById("bag");
    bag.style.display = "none"; 
    var info = document.getElementById("info");
    info.style.display = "none"; 
    Client.socket.close();
    game.state.start('home');  
  },
  openBag: function() {
    var bag = document.getElementById("bag");
    if(bag.style.display == "none"){
      bag.style.display = "block"; 
    }else{
      saveState();
      bag.style.display = "none";
    }
  },
  generateEnemy: function() {
    Client.generateEnemy(game.rnd.pick([0, 1])*this.borderH, game.rnd.pick([0, 1])*this.borderV, "forest", 3);
  },
  generateEnemy2: function() {
      Client.generateEnemy(game.rnd.pick([0, 1])*this.borderH, game.rnd.pick([0, 1])*game.height, "snow", 3);
  },
  enemyAlive:function()
  {
      livingEnemies1 = [];
      livingEnemies2 = [];
      this.monsters.forEachAlive(function(enemy){
        //if(enemy.body.y < game.height)
          livingEnemies1.push(enemy);
        //console.log(game.width);
      });
      this.monsters2.forEachAlive(function(enemy){
        //if(enemy.body.y < game.height)
          livingEnemies2.push(enemy);
        //console.log(game.width);
      });
  },
  moveEnemy:function()
  {
    var i;
    for(i=0;i<livingEnemies1.length;i++)
    {
      if((this.distance(this.player, livingEnemies1[i])<300) && (this.distance(this.player, livingEnemies1[i])>150))
      {
        //console.log(this.distance(livingEnemies1[i]));
        var dx = this.player.x-livingEnemies1[i].body.x;
        var dy = this.player.y-livingEnemies1[i].body.y;
        dx = dx/Math.abs(dx);
        dy = dy/Math.abs(dy);
        livingEnemies1[i].body.velocity.x = dx*100;
        livingEnemies1[i].body.velocity.y = dy*100;
        Client.moveEnemy(livingEnemies1[i].id, livingEnemies1[i].x, livingEnemies1[i].y, livingEnemies1[i].blood/*, livingEnemies1[i].animations.currentAnim.name, livingEnemies1[i].facing*/);
      }
      else
      {
        livingEnemies1[i].body.velocity.x = 0;
        livingEnemies1[i].body.velocity.y = 0;
      }
    }
    for(i=0;i<livingEnemies2.length;i++)
    {
      if((this.distance(this.player, livingEnemies2[i])<300) && (this.distance(this.player, livingEnemies2[i])>150) && livingEnemies2[i].notattacked!=5)
      {
        var dx = this.player.x-livingEnemies2[i].body.x;
        var dy = this.player.y-livingEnemies2[i].body.y;
        dx = dx/Math.abs(dx);
        dy = dy/Math.abs(dy);
        livingEnemies2[i].body.velocity.x = dx*150;
        livingEnemies2[i].body.velocity.y = dy*150;
        Client.moveEnemy(livingEnemies2[i].id, livingEnemies2[i].x, livingEnemies2[i].y, livingEnemies2[i].blood/*, livingEnemies1[i].animations.currentAnim.name, livingEnemies1[i].facing*/);
      }
      else
      {
        livingEnemies2[i].body.velocity.x = 0;
        livingEnemies2[i].body.velocity.y = 0;
        //console.log(livingEnemies2[i].notattacked);
      }
    }
  },
  enemy1Shoot:function()
  {
    var delayTime = 0;
    if(livingEnemies1.length > 0) {
      livingEnemies1.forEach(function(shooter) {
        game.time.events.add(delayTime, function() {
          if(shooter.alive) fieldState.detectPlayer(shooter, 300, "forest");
        }, this);
        delayTime += 750;
      });
    }
  },
  enemy2Shoot:function()
  {
    var delayTime = 0;
    if(livingEnemies2.length > 0) {
      livingEnemies2.forEach(function(shooter) {
        game.time.events.add(delayTime, function() {
          if(shooter.alive) fieldState.detectPlayer(shooter, 300, "snow");
        }, this);
        delayTime += 750;
      });
    }
  },
  detectPlayer: function(shooter, range, type) {
    /* Pick a target randomly from whom in range */
    var playersInRange = [];
    if(this.distance(this.player, shooter)<range) playersInRange.push(this.player);
    for(var i=0; i<this.playersList.length; i++) {
      if(this.playersList[i] &&　this.distance(this.playersList[i], shooter)<range) {
        playersInRange.push(this.playersList[i]);
        console.log("inrange", shooter.id, i);
      }
    }
    if(playersInRange.length > 0) {
      var random = this.rnd.integerInRange(0, playersInRange.length - 1);
      var target = playersInRange[random];
      var dx = target.x-shooter.body.x;
      var dy = target.y-shooter.body.y;
      dx = dx/this.distance(target, shooter);
      dy = dy/this.distance(target, shooter);
      console.log("shoot", shooter.id, shooter.x, shooter.y, dx*200, dy*200, type);
      Client.generateBullet(shooter.x, shooter.y, dx*200, dy*200, type);
    }
  },
  distance: function(target, shooter)
  {
    if(shooter)
    {
      var dx = shooter.body.x - target.x;
      var dy = shooter.body.y - target.y;
      return Math.sqrt(dx*dx+dy*dy);
    }
    else
    {
      return 800;
    }
  },
}; 