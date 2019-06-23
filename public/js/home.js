var homeState = { 
  preload: function() {
    loadValues();
  },
  create: function() {
    if(game.global.hp < 1) {
      game.global.hp = 20;
      saveState();
    }
    game.world.setBounds(0, 0, 800, 600);

    var sto = document.getElementById("sto");
    sto.style.display = "none";
    var bag = document.getElementById("bag");
    bag.style.display = "none";
    bag.style.left = "calc(50% - 260px)";
    this.decorating = 0;

    this.bg = game.add.tileSprite(0, 0, game.width, game.height, 'home');
    /*this.packing = game.add.sprite(10, 10, 'packing');
    this.packing.visible = false;*/

    this.map = game.add.button(330, 110, 'GoMap', this.toMap, this);
    this.map.alpha = 0;
    game.carpet = game.add.sprite(84, 312, 'carpet');

    this.lifebar = game.add.sprite(10, 10, 'bloodBottom');
    this.life = game.add.sprite(51, 32, 'blood');
    this.lifetext = game.add.text(114, 33, '20/20', { font: '10px Arial', fill: "white"} );
    this.crafts = game.add.button(700, 20, 'crafting', this.openCraft, this);
    this.crafts.scale.setTo(0.8, 0.8); 
    this.storage = game.add.button(700, 100, 'storage', this.openStorage, this);
    this.storage.scale.setTo(0.8, 0.8); 
    game.items = game.add.group();
    game.items.enableBody = true;

    firebase.database().ref('profile/' + userId + '/home/furniture').once('value', function(snapshot) {
      console.log("load furniture");
      var i = 0;
      snapshot.forEach(function(childSnapshot) {
        game.global.furn[i] = {
          x: childSnapshot.val().x,
          y: childSnapshot.val().y,
          type: childSnapshot.val().type
        };
        i++;
      });
      //game.global.furn = snapshot.val();
      console.log(game.global.furn);
    }).then(function() {
      console.log("put furniture");
      for (var i = 0; i < game.global.furn.length; i++){
        x = game.items.create(game.global.furn[i].x, game.global.furn[i].y, game.global.furn[i].type);
        x.type = game.global.furn[i].type;
        game.physics.arcade.enable(x);
      }
      game.items.forEach(function(i) {
        i.anchor.setTo(0, 1);
      }, this);
    });

    this.player = game.items.create(400, 460, 'player');
    this.player.anchor.setTo(0.5, 1); 
    this.player.scale.setTo(0.6, 0.6); 
    this.player.type = "player";
    this.player.facing = 0;
    this.player.animations.add('goforward', [20, 21], 4, true);
    this.player.animations.add('goleft', [0, 1, 2, 3, 4, 5], 8, true);
    this.player.animations.add('goright', [10, 11, 12, 13, 14, 15], 8, true);
    this.player.animations.add('gobackward', [18, 19], 4, true);
    game.physics.arcade.enable(this.player);
    game.physics.arcade.overlap(this.player, game.items, this.bound, null, this);
    this.player.body.collideWorldBounds = true;

    this.cursor = game.input.keyboard.createCursorKeys();

    /*this.life = game.add.text(700, 20, 'HP:20', { font: '30px Arial'} );
    this.field = game.add.text(700, 340, '冒險', { font: '40px Microsoft JhengHei', backgroundColor: 'white'});
    this.field.inputEnabled = true;
    this.field.events.onInputDown.add(this.toField, this);
    this.map = game.add.text(700, 400, '地圖', { font: '40px Microsoft JhengHei', backgroundColor: 'white'});
    this.map.inputEnabled = true;
    this.map.events.onInputDown.add(this.toMap, this);
    this.crafts = game.add.text(700, 80, '合成', { font: '40px Microsoft JhengHei', backgroundColor: 'white'});
    this.crafts.inputEnabled = true;
    this.crafts.events.onInputDown.add(this.openCraft, this);
    this.storage = game.add.text(700, 140, '倉庫', { font: '40px Microsoft JhengHei', backgroundColor: 'white'});
    this.storage.inputEnabled = true;
    this.storage.events.onInputDown.add(this.openStorage, this);
    */
  }, 
  update: function() {
    if(this.decorating==0) this.movePlayer();
    this.updateText();
    //game.physics.arcade.overlap(this.packing, game.items, this.store, null, this);
    game.items.sort('y', Phaser.Group.SORT_ASCENDING);
  },
  bound: function(player,item) {
    if(item.y-20<player.y && player.y<item.y){
      this.up = 1;
      this.down = 0;      
    }else if(item.y<player.y && player.y<item.y+20){
      this.up = 0;
      this.down = 1; 
    }else{
      this.up = 1;
      this.down = 1; 
    }
  },
  movePlayer: function() {  
    game.physics.arcade.overlap(this.player, game.items, this.bound, null, this);
    if (this.cursor.left.isDown&&this.player.y>-3*this.player.x+720) {
      this.player.body.velocity.x = -300;
      this.player.body.velocity.y = 0;
      this.player.facing = 1;
      this.player.animations.play('goleft');
    }else if (this.cursor.left.isDown) { 
      this.player.x = (720-this.player.y)/3;
      this.player.body.velocity.x = 0;
      this.player.body.velocity.y = 0;
      this.player.facing = 1;
      this.player.animations.play('goleft');
    }else if (this.cursor.right.isDown&&this.player.y>3*this.player.x-1680) { 
      this.player.body.velocity.x = 300;
      this.player.body.velocity.y = 0;
      this.player.facing = 2;
      this.player.animations.play('goright');
    }else if (this.cursor.right.isDown) { 
      this.player.x = (this.player.y+1680)/3;
      this.player.body.velocity.x = 0;
      this.player.body.velocity.y = 0;
      this.player.facing = 2;
      this.player.animations.play('goright');
    }else if (this.cursor.up.isDown&&this.player.y>280&&this.player.y>-3*this.player.x+720&&this.player.y>3*this.player.x-1680) { 
      this.player.body.velocity.x = 0;
      if(this.up) this.player.body.velocity.y = -300;
      else this.player.body.velocity.y = 0;
      this.player.facing = 3;
      this.player.animations.play('gobackward');
    }else if (this.cursor.up.isDown) { 
      if(this.player.y<=3*this.player.x-1680) this.player.y = 3*this.player.x-1680;
      else if(this.player.y<=-3*this.player.x+720) this.player.y = -3*this.player.x+720;
      else this.player.y = 280;      
      this.player.body.velocity.x = 0;
      this.player.body.velocity.y = 0;
      this.player.facing = 3;
      this.player.animations.play('gobackward');
    }else if (this.cursor.down.isDown) { 
      this.player.body.velocity.x = 0;
      if(this.down) this.player.body.velocity.y = 300;
      else this.player.body.velocity.y = 0;
      this.player.facing = 0;
      this.player.animations.play('goforward');
    }else{
      this.player.body.velocity.x = 0;
      this.player.body.velocity.y = 0;
      if(this.player.facing == 0) this.player.frame = 7;
      else if(this.player.facing == 1) this.player.frame = 6;
      else if(this.player.facing == 2) this.player.frame = 9;
      else this.player.frame = 22;
      this.player.animations.stop();
    }
    this.up = 1;
    this.down = 1;
  },
  updateText: function() {
    //this.life.setText("HP:" + game.global.hp);
    this.lifetext.setText(game.global.hp+"/"+game.global.maxhp);
    this.life.scale.setTo(game.global.hp/game.global.maxhp,1);
  },
  check: async function() {
    game.global.furn = [];
    game.items.forEachExists(function(i) {
      if(i.type!="player"){
        if(i.y>280 && i.y>-3*i.x+650 && i.y>3*(i.x+game.cache.getImage(i).height)-1620){
          i.inputEnabled = false;
          game.global.furn.push({type:i.type, x:i.x, y:i.y});
        }else{
          var x = document.getElementById(i.type);
          x.innerHTML = Number(x.innerHTML)+1;
          i.kill();
        }
      }
    }, this);
    saveState();
  },
  onDragStop: function(item, pointer) {
    if (700 < pointer.x && pointer.x < 780 && pointer.x > 120 && pointer.y < 180){
      var x = document.getElementById(item.type);
      x.innerHTML = Number(x.innerHTML)+1;
      item.kill();
    }
  },
  toMap: function() {
    //this.packing.visible = false;
    var sto = document.getElementById("sto");
    sto.style.display = "none";
    var bag = document.getElementById("bag");
    bag.style.display = "none";
    var cra = document.getElementById("craft");
    cra.style.display = "none";
    this.check();
    game.state.start('map'); 
  },
  /*toField: function() {
    this.packing.visible = false;
    var sto = document.getElementById("sto");
    sto.style.display = "none";
    var bag = document.getElementById("bag");
    bag.style.display = "none";
    var cra = document.getElementById("craft");
    cra.style.display = "none";
    this.check();
    game.state.start('field');  
  },*/
  openStorage: function() {
    var sto = document.getElementById("sto");
    if(sto.style.display == "none"){
      sto.style.display = "block"; 
      this.storage.frame = 1; 
      this.player.visible = false;
      //this.packing.visible = true;
      this.decorating = 1;
      game.items.forEachExists(function(i) {
        if(i.type!="player"){
          i.inputEnabled = true;
          i.input.enableDrag();
          i.events.onDragStop.add(this.onDragStop, this);
        }        
      }, this);
    }else{
      sto.style.display = "none";
      this.player.visible = true;
      //this.packing.visible = false;
      this.decorating = 0;
      this.check();
    }
  },
  openCraft: function() {
    var bag = document.getElementById("bag");
    var cra = document.getElementById("craft");
    if(bag.style.display == "none"){
      bag.style.display = "block"; 
      cra.style.display = "block"; 
    }else{
      bag.style.display = "none"; 
      cra.style.display = "none"; 
      saveState();
    }
  },
}; 