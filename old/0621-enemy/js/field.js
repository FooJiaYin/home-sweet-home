var livingForest, livingSnow, livingGrass, livingMine, livingBeach;

var fieldState = { 
  create: function() {
    var info = document.getElementById("info");
    info.style.display = "block"; 
    var bag = document.getElementById("bag");
    bag.style.left = "calc(50% - 75px)";
    bag.style.display = "none";
    var cra = document.getElementById("craft");
    cra.style.display = "none";
    this.bg = game.add.tileSprite(0, 0, 2000, 2000, 'field');
    game.world.setBounds(0, 0, 2000, 2000);
    this.playing = 1;


    //sound
    this.enemyDieSnd = game.add.audio('enemyDieSnd');
    this.attackSnd = game.add.audio('attackSnd');
    this.shootSnd = game.add.audio('shootSnd');

    this.circles = game.add.group();
    this.circles.enableBody = true;
    this.circles.createMultiple(30, 'attackcircle');
    this.circles.forEach(function(c) {
      c.anchor.setTo(0.5, 0.5);
    }, this);
    
    this.ghosts = game.add.group();
    this.ghosts.enableBody = true;
    this.ghosts.createMultiple(10, 'ghost');
    this.ghosts.forEach(function(g) {
      g.scale.setTo(0.4, 0.4);
      g.anchor.setTo(0.5, 0.5);
    }, this);

    this.twigs = game.add.group();
    this.twigs.enableBody = true;
    this.twigs.createMultiple(10, 'twig');
    this.twigs.forEach(function(m) {
      m.anchor.setTo(0.5, 0.5);
      m.blood = 3;
      m.attack = 0;
      m.label = game.add.text(-20, -20, 'hp: 3', { font: '15px Microsoft JhengHei', backgroundColor: 'white'});
      m.type = "forest";
      m.notattacked = 5;

    }, this);
    
    this.whitewalkers = game.add.group();
    this.whitewalkers.enableBody = true;
    this.whitewalkers.createMultiple(10, 'whitewalker');
    this.whitewalkers.forEach(function(m) {
      m.anchor.setTo(0.5, 0.5);
      m.blood = 3;
      m.label = game.add.text(-20, -20, 'hp: 3', { font: '15px Microsoft JhengHei', backgroundColor: 'white'});
      m.type = "snow";
      m.notattacked = 5;

      //game.time.events.add(1000, function() {m.notattacked = (m.notattacked==5)?m.notattacked:m.notattacked++;}, this);
      //not attacked in 5 sec means dont attack
    }, this);

    this.barbarians = game.add.group();
    this.barbarians.enableBody = true;
    this.barbarians.createMultiple(10, 'barbarian');
    this.barbarians.forEach(function(m) {

      m.scale.setTo(0.5, 0.5);
      m.animations.add('attack', [0, 1, 2, 3, 5, 6, 7, 8, 9, 10, 11], 12, false);

      m.anchor.setTo(0.5, 0.5);
      m.blood = 3;
      m.attack = 0;
      m.label = game.add.text(-20, -20, 'hp: 3', { font: '15px Microsoft JhengHei', backgroundColor: 'white'});
      m.notattacked = 5;
      m.type = "grass";
    }, this);

    this.stonemans = game.add.group();
    this.stonemans.enableBody = true;
    this.stonemans.createMultiple(10, 'stoneman');
    this.stonemans.forEach(function(m) {
      m.anchor.setTo(0.5, 0.5);
      m.blood = 3;
      m.label = game.add.text(-20, -20, 'hp: 3', { font: '15px Microsoft JhengHei', backgroundColor: 'white'});
      m.type = "mine";
      m.notattacked = 5;

    }, this);

    this.fishs = game.add.group();
    this.fishs.enableBody = true;
    this.fishs.createMultiple(10, 'fish');
    this.fishs.forEach(function(m) {
      m.animations.add('attackL', [0, 1, 2, 3, 4, 5, 6], 14, false);
      m.animations.add('attackR', [7, 8, 9, 10,11,12,13], 14, false);
      m.faceL = 1;
      m.scale.setTo(0.25, 0.25);
      m.anchor.setTo(0.5, 0.5);
      m.blood = 3;
      m.attack = 0;
      m.label = game.add.text(-20, -20, 'hp: 3', { font: '15px Microsoft JhengHei', backgroundColor: 'white'});
      m.type = "beach";
      m.notattacked = 5;

    }, this);

    

    this.sword_b = game.add.sprite(-40, -40, 'sword');
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

    this.sword = game.add.sprite(-40, -40, 'sword');
    this.sword.enableBody = true;
    game.physics.arcade.enable(this.sword_b);
    game.physics.arcade.enable(this.sword);

    this.arrows = game.add.group();
    this.arrows.enableBody = true;
    this.arrows.createMultiple(10, 'arrow');
    this.arrows.setAll('outOfBoundsKill', true);
    this.arrows.setAll('checkWorldBounds', true);
    this.arrows.forEach(function(a) {
      a.anchor.setTo(0.5, 0.5);
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

    //石頭(all)、木材(forest)、冰(snow)、ㄇㄇ蟲(草地)、棉花(evil)、礦(evil)、貝殼(beach) )
    this.coals = game.add.group();
    this.coals.enableBody = true;
    this.coals.createMultiple(30, 'coal');
    this.coals.forEach(function(w) {
      w.anchor.setTo(0.5, 0.5);
    }, this);

    this.ices = game.add.group();
    this.ices.enableBody = true;
    this.ices.createMultiple(100, 'ice');
    
    this.caterpillars = game.add.group();
    this.caterpillars.enableBody = true;
    this.caterpillars.createMultiple(100, 'caterpillar');
    //0620
    this.irons = game.add.group();
    this.irons.enableBody = true;
    this.irons.createMultiple(30, 'iron');

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
    //enemies1 bullet
    this.forestBullets= game.add.group();
    this.forestBullets.enableBody = true;
    this.forestBullets.physicsBodyType = Phaser.Physics.ARCADE; 
    this.forestBullets.createMultiple(100, 'forestleft');
    this.forestBullets.setAll('anchor.x', 0.5);
    this.forestBullets.setAll('anchor.y', 0);
    this.forestBullets.setAll('outOfBoundsKill', true);
    this.forestBullets.setAll('checkWorldBounds', true);
    //enemy2 bullets
    this.snowBullets= game.add.group();
    this.snowBullets.enableBody = true;
    this.snowBullets.physicsBodyType = Phaser.Physics.ARCADE; 
    this.snowBullets.createMultiple(100, 'snowleft');
    this.snowBullets.setAll('anchor.x', 0.5);
    this.snowBullets.setAll('anchor.y', 0);
    this.snowBullets.setAll('outOfBoundsKill', true);
    this.snowBullets.setAll('checkWorldBounds', true);

    this.grassBullets= game.add.group();
    this.grassBullets.enableBody = true;
    this.grassBullets.physicsBodyType = Phaser.Physics.ARCADE; 
    this.grassBullets.createMultiple(100, 'grassleft');
    this.grassBullets.setAll('anchor.x', 0.5);
    this.grassBullets.setAll('anchor.y', 0);
    this.grassBullets.setAll('outOfBoundsKill', true);
    this.grassBullets.setAll('checkWorldBounds', true);

    this.mineBullets= game.add.group();
    this.mineBullets.enableBody = true;
    this.mineBullets.physicsBodyType = Phaser.Physics.ARCADE; 
    this.mineBullets.createMultiple(100, 'mineleft');
    this.mineBullets.setAll('anchor.x', 0.5);
    this.mineBullets.setAll('anchor.y', 0);
    this.mineBullets.setAll('outOfBoundsKill', true);
    this.mineBullets.setAll('checkWorldBounds', true);

    this.beachBullets= game.add.group();
    this.beachBullets.enableBody = true;
    this.beachBullets.physicsBodyType = Phaser.Physics.ARCADE; 
    this.beachBullets.createMultiple(100, 'beachleft');
    this.beachBullets.setAll('anchor.x', 0.5);
    this.beachBullets.setAll('anchor.y', 0);
    this.beachBullets.setAll('outOfBoundsKill', true);
    this.beachBullets.setAll('checkWorldBounds', true);
    //loop
    game.time.events.loop(200, this.enemyMove, this);
    game.time.events.loop(50, this.enemyAttack, this);
    game.time.events.loop(1000, this.enemyShoot, this);
    game.time.events.loop(16000, this.addEnemy, this);
    game.time.events.loop(2000, this.growElement, this);
    


  }, 
  update: function() {
    if(this.playing){
      this.movePlayer();
      this.enemyAlive();
      this.updateEnemyLabel();
      this.bulletBound();
      // this.enemyBound();
      //this.disableEnemyAttack();
      ////after enemy pic get bigger, then circles isnt needed
      game.physics.arcade.overlap(this.player, this.circles, this.hurt, null, this);
      game.physics.arcade.overlap(this.sword, this.twigs, this.attack_c, null, this);
      game.physics.arcade.overlap(this.sword_b, this.twigs, this.attack_c, null, this);
      game.physics.arcade.overlap(this.arrows, this.twigs, this.attack_f, null, this);
      game.physics.arcade.overlap(this.sword, this.whitewalkers, this.attack_c, null, this);
      game.physics.arcade.overlap(this.sword_b, this.whitewalkers, this.attack_c, null, this);
      game.physics.arcade.overlap(this.arrows, this.whitewalkers, this.attack_f, null, this);
      game.physics.arcade.overlap(this.sword, this.barbarians, this.attack_c, null, this);
      game.physics.arcade.overlap(this.sword_b, this.barbarians, this.attack_c, null, this);
      game.physics.arcade.overlap(this.arrows, this.barbarians, this.attack_f, null, this);
      game.physics.arcade.overlap(this.sword, this.stonemans, this.attack_c, null, this);
      game.physics.arcade.overlap(this.sword_b, this.stonemans, this.attack_c, null, this);
      game.physics.arcade.overlap(this.arrows, this.stonemans, this.attack_f, null, this);
      game.physics.arcade.overlap(this.sword, this.fishs, this.attack_c, null, this);
      game.physics.arcade.overlap(this.sword_b, this.fishs, this.attack_c, null, this);
      game.physics.arcade.overlap(this.arrows, this.fishs, this.attack_f, null, this);
      game.physics.arcade.overlap(this.player, this.coals, this.pickUp, null, this);
      game.physics.arcade.overlap(this.player, this.forestBullets, this.hurt, null, this);
      game.physics.arcade.overlap(this.player, this.snowBullets, this.hurt, null, this);
    }
  },
  bulletBound: function()
  {
    for(var j=0;j<5;j++)
    {
      switch(j)
      {
        case 0:
          this.forestBullets.forEachAlive(function(b){
            if(!(b.position.x<1557 && b.position.y<1013 && b.position.y<((-1013*b.position.x/1557)+1013) ))
            {
              b.kill();
            }
          });
        break;
        case 1:
          this.snowBullets.forEachAlive(function(b){
            if(!(b.position.x>1200 && b.position.y<600)&&
            !(b.position.x<2000 && b.position.y>600 && b.position.y<0.5*b.position.x) )
            {
              b.kill();
            }
          });
        break;
        case 2:
          this.grassBullets.forEachAlive(function(b){
            if(!(b.position.y>-0.358*b.position.x+804.5 && b.position.y>0.47*b.position.x+54.3 && b.position.y<-0.57*b.position.x+1920 && b.position.y<0.91*b.position.x+680.25) )
            {
              b.kill();
            }
          });
        break;
        case 3:
        this.mineBullets.forEachAlive(function(b){
          if(!(b.position.y<0.2*b.position.x+1274 && b.position.y>-0.57*b.position.x+1918.09 && b.position.y>0.66*b.position.x-281))
          {
            b.kill();
          }
        });
        break;
        case 4:
        this.beachBullets.forEachAlive(function(b){
          if(!(b.position.y>-0.27*b.position.x && b.position.y>0.2*b.position.x+1276))
          {
            b.kill();
          }
        });
        break;
      }
    }
  },
  enemyBound: function(type, monster)
  {
    switch(type)
    {
      case "forest":
        if(!(this.player.x<1457 && this.player.y<1013 && this.player.y>139 &&
            this.player.y<((-1013*this.player.x/1457)+1013) ))
        {
          return 1;
        }
        else
        {
          return 0;
        }
      break;
      case "snow":
        if(!(this.player.x>1200 && this.player.y<600 && this.player.y>139)&& 
          !(this.player.x<2000 && this.player.y>600 && this.player.y<0.5*this.player.x) )
        {
          return 1;
        }
      break;
      case "grass":
        if(!(this.player.y>-0.358*this.player.x+804.5 && 
            this.player.y>0.47*this.player.x+54.3 && 
            this.player.y<-0.57*this.player.x+1920 && 
            this.player.y<0.91*this.player.x+680.25) ||monster.notattacked==5)
        {
          monster.notattacked = 5;//all related to not attacked are changed
          console.log('na='+monster.notattacked);
          return 1;//dont move
        }
        else
        {
          if(monster.notattacked!=5)
          {
            monster.notattacked+=0.125;
          }
          return 0;
        }
      break;
      case "mine":
        if(!(this.player.y<0.2*this.player.x+1174 && 
          this.player.y>-0.57*this.player.x+1918.09 && 
          this.player.y>0.66*this.player.x-280 ))
        {
          return 1;
        }
        else
        {
          return 0;
        }
      break;
      case "beach":
        if(!(this.player.y>-0.27*this.player.x+1665 && this.player.y>0.2*this.player.x+1276 && this.player.y<1891))
        {
          return 1;
        }
        else
        {
          return 0;
        }
      break;
    }
  
  },
  updateEnemyLabel: function()
  {
    this.twigs.forEachAlive(function(enemy){
      enemy.label.x = enemy.x-5;
      enemy.label.y = enemy.y-100;
      enemy.label.text = "hp: "+enemy.blood;
    });
    this.whitewalkers.forEachAlive(function(enemy){
      enemy.label.x = enemy.x-5;
      enemy.label.y = enemy.y-100;
      enemy.label.text = "hp: "+enemy.blood;
    });
    this.barbarians.forEachAlive(function(enemy){
      enemy.label.x = enemy.x-5;
      enemy.label.y = enemy.y-100;
      enemy.label.text = "hp: "+enemy.blood;
    });
    this.stonemans.forEachAlive(function(enemy){
      enemy.label.x = enemy.x-5;
      enemy.label.y = enemy.y-100;
      enemy.label.text = "hp: "+enemy.blood;
    });
    this.fishs.forEachAlive(function(enemy){
      enemy.label.x = enemy.x-5;
      enemy.label.y = enemy.y-100;
      enemy.label.text = "hp: "+enemy.blood;
    });
  },
  movePlayer: function() { 
    if (this.cursor.left.isDown) { 
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
  },
  
  genWood: function() {
    var w = this.coals.getFirstExists(false);
    if(w) w.reset(game.rnd.integerInRange(this.player.x-200, this.player.x+200), game.rnd.integerInRange(this.player.y-200, this.player.y+200));
  },
  growElement: function()
  {
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
          grow = this.coals.getFirstExists(false);
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
  swordA: function() {
    this.sword.x = -40;
    this.sword.y = -40;
    this.sword_b.x = -40;
    this.sword_b.y = -40;
    if (this.player.facing == 0) { 
      this.sword.frame = 0;
      this.sword.x = this.player.x-10;
      this.sword.y = this.player.y-10;
    }else if (this.player.facing == 1) { 
      this.sword_b.frame = 1;
      this.sword_b.x = this.player.x-32;
      this.sword_b.y = this.player.y-10;
    }else if (this.player.facing == 2) { 
      this.sword.frame = 0;
      this.sword.x = this.player.x;
      this.sword.y = this.player.y-10;
    }else {
      this.sword_b.frame = 1;
      this.sword_b.x = this.player.x-32;
      this.sword_b.y = this.player.y-10;
    }    
    game.time.events.add(500, this.swordB, this);
  },
  swordB: function() {
    this.sword.x = -40;
    this.sword.y = -40;
    this.sword_b.x = -40;
    this.sword_b.y = -40;
  },
  arrowA: function() {
    var a = this.arrows.getFirstExists(false);
    if(a){
      a.reset(game.rnd.integerInRange(this.player.x-200, this.player.x+200), game.rnd.integerInRange(this.player.y-200, this.player.y+200));
      a.frame = this.player.facing;
      if (this.player.facing == 0) {
        a.body.velocity.y = 400;
        a.x = this.player.x;
        a.y = this.player.y+50;
      }else if (this.player.facing == 1) { 
        a.body.velocity.x = -400;
        a.x = this.player.x-40;
        a.y = this.player.y+15;
      }else if (this.player.facing == 2) { 
        a.body.velocity.x = 400;
        a.x = this.player.x+40;
        a.y = this.player.y+15;
      }else {
        a.body.velocity.y = -400;
        a.x = this.player.x;
        a.y = this.player.y-50;
      }   
      game.time.events.add(1000, function() {a.kill();}, this);
    }
  },
  attack_c: function(weapon, monster) {
    
    monster.blood--;
    if(monster.type=="grass")
    {
      monster.notattacked = 0;
    }
    if(monster.blood==0)
    {
      this.monsterDie(monster.x, monster.y, monster.type);
      monster.label.visible = false;
      if(monster.type=="grass")
      {
        monster.notattacked = 5;
        monster.attack = 0;
      }

      monster.kill();
    }
  },
  attack_f: function(weapon, monster) {
    
    weapon.kill();
    monster.blood--;
    if(monster.type=="grass")
    {
      monster.notattacked = 0;
    }
    if(monster.blood==0)
    {
      this.monsterDie(monster.x, monster.y, monster.type);
      monster.label.visible = false;
      if(monster.type=="grass")
      {
        monster.notattacked = 5;
        monster.attack = 0;
      } 

      monster.kill();
    }
  },
  
  monsterDie: function(x, y, type)
  {
    var left,ghost, i, radian=0;
    
    this.enemyDieSnd.play();
    //ghost = this.ghosts.ge
    ghost = this.ghosts.getFirstExists(false);
    ghost.reset(x, y);
    ghost.body.velocity.x = 0;
    ghost.body.velocity.y = -120;
    ghost.alpha = 1;
    game.add.tween(ghost).to( { alpha: 0 }, 1500, "Linear", true);
    

    switch(type)
    {
      case "forest":
        left = this.forestlefts.getFirstExists(false);
      break;
      case "snow" :
        left = this.snowlefts.getFirstExists(false);
        break;
      case "grass":
        left = this.grasslefts.getFirstExists(false);
      break;
      case "mine" :
        left = this.minelefts.getFirstExists(false);
      break;
      case "beach":
        left = this.beachlefts.getFirstExists(false);
      break;
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
  pickUp: function(player, item) {
    item.kill();
    var num_w = document.getElementById("wood");
    num_w.innerHTML = Number(num_w.innerHTML)+1;
  },
  hurt: function(player, bul) {
    this.player.health --;
    this.hp.innerHTML = this.player.health;
    bul.kill();
    if(this.player.health < 1){
      this.hp.innerHTML = 20;
      this.dead();
    }
  },
  dead: function() {
    this.playing = 0;
    var gg = game.add.sprite(this.player.x, this.player.y, 'gg');
    gg.anchor.setTo(0.5, 0.5); 
    var info = document.getElementById("info");
    info.style.display = "none"; 
    this.player.kill();
    game.time.events.add(1000, function() {game.state.start('home');}, this);
  },
  toMap: function() {
    var bag = document.getElementById("bag");
    bag.style.display = "none";
    var info = document.getElementById("info");
    info.style.display = "none";  
    game.state.start('map'); 
  },
  toHome: function() {
    var bag = document.getElementById("bag");
    bag.style.display = "none"; 
    var info = document.getElementById("info");
    info.style.display = "none"; 
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
  addEnemy: function() {
    var enemy, posx, posy;

    var twigPos = [{x: 255, y: 655}, {x: 631, y: 439}];
    var whitePos = [{x: 1751, y: 295}, {x: 1537, y: 655}];
    var barPos = [{x: 1113, y: 889}, {x: 757, y: 1119}];
    var stonemanPos = [{x: 1919, y: 1139}, {x: 1507, y: 1385}];
    var fishPos = [{x: 1663, y: 1939}, {x: 599, y: 1605}];
    this.genEnemyTime++;
    for(var i=0;i<5;i++)
    {
      switch(i)
      {
        case 0:
          enemy = (livingForest.length==2)?null:this.twigs.getFirstDead();   
          posx = twigPos[this.genEnemyTime%twigPos.length].x;
          post = twigPos[this.genEnemyTime%twigPos.length].y;
        break;
        case 1:
          enemy = (livingSnow.length==2)?null:this.whitewalkers.getFirstDead();        
          posx = whitePos[this.genEnemyTime%whitePos.length].x;
          posy = whitePos[this.genEnemyTime%whitePos.length].y;
        break;
        case 2:
          enemy = (livingGrass.length==2)?null:this.barbarians.getFirstDead();        
          posx = barPos[this.genEnemyTime%barPos.length].x;
          posy = barPos[this.genEnemyTime%barPos.length].y;
        break;
        case 3:
          enemy = (livingMine.length==2)?null:this.stonemans.getFirstDead();        
          posx = stonemanPos[this.genEnemyTime%stonemanPos.length].x;
          posy = stonemanPos[this.genEnemyTime%stonemanPos.length].y;          
        break;
        case 4:
          enemy = (livingBeach.length==2)?null:this.fishs.getFirstDead();        
          posx = fishPos[this.genEnemyTime%fishPos.length].x;
          posy = fishPos[this.genEnemyTime%fishPos.length].y;
        break;
      }
      if (enemy) 
      {
        enemy.anchor.setTo(0.5, 1);
        enemy.reset(posx, posy);
        // enemy.body.gravity.y = 10;
        enemy.body.gravity.y = 0;
        enemy.blood = 3;
        enemy.label.visible = true;
        enemy.label.x = enemy.x-5;
        enemy.label.y = enemy.y-100;
        enemy.body.velocity.x = 0;
        enemy.body.velocity.y = 0;
        enemy.checkWorldBounds = true;
        enemy.outOfBoundsKill = true;
      }

    }
 

  },
  
  
  enemyAlive:function()
  {
      livingForest = [];
      livingSnow = [];
      livingGrass=[];
      livingMine = [];
      livingBeach = [];
      this.twigs.forEachAlive(function(enemy){
        //if(enemy.body.y < game.height)
          livingForest.push(enemy);
        //console.log(game.width);
      });
      this.whitewalkers.forEachAlive(function(enemy){
        livingSnow.push(enemy);
      });
      this.barbarians.forEachAlive(function(enemy){
        livingGrass.push(enemy);
      });
      this.stonemans.forEachAlive(function(enemy){
        livingMine.push(enemy);
      });
      this.fishs.forEachAlive(function(enemy){
        livingBeach.push(enemy);
      });
  },
  //add bound check 0620
  enemyMove:function()
  {
    var livingEnemies = [];
    var type = "";
    for(var j=0;j<5;j++)
    {
      switch(j)
      {
        case 0:
          livingEnemies = livingForest;
          type = "forest";
        break;
        case 1:
          livingEnemies = livingSnow;
          type = "snow";

        break;        
        case 2:
          livingEnemies = livingGrass;
          type = "grass";

        break;
        case 3:
          livingEnemies = livingMine;
          type = "mine";

        break;
        case 4:
          livingEnemies = livingBeach;
          type = "beach";

        break;        
      }
      for(var i=0;i<livingEnemies.length;i++)
      {
        if(/*(this.distance(livingEnemies[i])<300) && (this.distance(livingEnemies[i])>150) && */!this.enemyBound(type,livingEnemies[i])&& (this.distance(livingEnemies[i])>50))
        {
          var dx = this.player.x-livingEnemies[i].body.x;
          var dy = this.player.y-livingEnemies[i].body.y;
          dx = dx/Math.abs(dx);
          dy = dy/Math.abs(dy);
          livingEnemies[i].body.velocity.x = dx*100;
          livingEnemies[i].body.velocity.y = dy*100;
          if(type=="beach")//dinosaur
          {
            livingEnemies[i].frame = (dx>0)?7:0;
            livingEnemies[i].faceL = (dx>0)?0:1;
          }
        }
        else
        {
          livingEnemies[i].body.velocity.x = 0;
          livingEnemies[i].body.velocity.y = 0;
        }
      }
    }

  },
  enemyAttack: function()
  {
    var monsters;
    for(var j=0;j<3;j++)
    {
      switch(j)
      {
        case 0:
          monsters = livingForest;
        break;
        case 1:
          monsters = livingGrass;
        break;
        case 2:
          monsters = livingBeach;
        break;
      }
      
      if(monsters)
      {
        for(var i=0;i<monsters.length;i++)
        {
          if((monsters[i].type=="grass" && monsters[i].notattacked==5))
          {

          }
          else if(this.distance(monsters[i])<150 && monsters[i].attack==0)
          {
            this.attackSnd.volumn = 0.8;
            this.attackSnd.play();
            
            if(j!=0)
            {
              if(j==1)//grass
              {
                monsters[i].animations.play('attack');
              }
              else//beach
              {                
                if(monsters[i].faceL==1)
                {
                  monsters[i].animations.play('attackL');
                }
                else
                  monsters[i].animations.play('attackR');

              }
            }
            
            
            monsters[i].attack=1;
            var local_circle = this.circles.getFirstDead(false);
            local_circle.reset(monsters[i].x, monsters[i].y);
            game.time.events.add(800, function(){
              local_circle.kill();
            }, this);
       
          }
          else if(this.distance(monsters[i])>150)
          {
            monsters[i].attack = 0;
          }
          
        }
      }
    }
  },
  //add bound ckeck 0620
  enemyShoot:function()
  {
    var n=0;
    var speedx = [0, 150, -150];
    var enemyBullet, livingEnemies=[];
    // console.log(random);
    for(var j=0;j<5;j++)
    {
      switch(j)
      {
        case 0:
          //enemyBullet = this.forestBullets.getFirstExists(false); 
          enemyBullet = this.forestBullets.getFirstDead(false); 
          livingEnemies = livingForest;
        break;
        case 1:
          //enemyBullet = this.snowBullets.getFirstExists(false); 
          enemyBullet = this.snowBullets.getFirstDead(false); 
          
          livingEnemies = this.livingSnow;
        break;
        case 2:
          enemyBullet = this.grassBullets.getFirstDead(false);
          livingEnemies = livingGrass;
        break;
        case 3:
          enemyBullet = this.mineBullets.getFirstDead(false); 
          livingEnemies = livingMine;
        break;
        case 4:
          enemyBullet = this.beachBullets.getFirstDead(false); 
          livingEnemies = livingBeach;
        break;
      }
      if(livingEnemies&&enemyBullet)
      {
        if(livingEnemies.length > 0) {
          
          random = this.rnd.integerInRange(0, livingEnemies.length - 1);
          var shooter = livingEnemies[random];
          if(shooter&&j==2&&shooter.notattacked==5)
          {
            return ;
          }
          if(shooter&&this.distance(shooter)>200)
          {
            enemyBullet.reset(shooter.body.x, shooter.body.y);
            // console.log('sv+'+enemyBullet.alive);
            // console.log("p: "+enemyBullet.position.x);
            this.shootSnd.volumn = 0.8;
            this.shootSnd.play();
            var dx = this.player.x-shooter.body.x;
            var dy = this.player.y-shooter.body.y;
            dx = dx/this.distance(shooter);
            dy = dy/this.distance(shooter);
            enemyBullet.body.velocity.y = dy*200;
            enemyBullet.body.velocity.x = dx*200;
            // game.time.events.add(500, function(){
            //   console.log('sv1+'+enemyBullet.alive);
            //   enemyBullet.kill();
            // }, this);
            
          }
          
        }
      }

    }
    
  },
  distance: function(shooter)
  {
    if(shooter)
    {
      var dx = shooter.body.x - this.player.x;
      var dy = shooter.body.y - this.player.y;
      return Math.sqrt(dx*dx+dy*dy);
    }
    else
    {
      return 800;
    }
  },
}; 