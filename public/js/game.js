var livingEnemies1 = [];
var livingEnemies2 = [];
function Enemy(config) {

    this.init = function() {
      this.enemys = game.add.group();
      this.enemys.enableBody = true;
      this.enemys.createMultiple(20, config.selfPic);
      this.enemys.setAll('outOfBoundsKill', true);
      this.enemys.setAll('checkWorldBounds', true);

      this.enemyBullets = game.add.group();
      this.enemyBullets.enableBody = true;
      this.enemyBullets.createMultiple(100, config.bulletPic);
      this.enemyBullets.setAll('outOfBoundsKill', true);
      this.enemyBullets.setAll('checkWorldBounds', true);
      this.emitter = game.add.emitter(0, 0, 150); 
      this.emitter.makeParticles('pixel'); 
      this.emitter.setYSpeed(-50, 50); 
      this.emitter.setXSpeed(-50, 50); 
      this.emitter.setScale(2, 0, 2, 0, 800); 
      this.emitter.gravity = 0;

      this.maxWidth = game.width - game.cache.getImage(config.selfPic).width;
      game.time.events.loop(config.selfTimeInterval, this.generateEnemy, this); 
      if(config.selfPic=="enemy2"){
        game.time.events.add(120000, this.generateTeam, this);
      }    
      if(config.selfPic=="enemy3"){
        game.time.events.add(63000, function() {
          game.time.events.loop(config.selfTimeInterval, this.generateEnemy, this);}, this);
      }     

      this.explosions = game.add.group();
      this.explosions.createMultiple(20, config.explodePic);
      this.explosions.forEach(function(explosion) {
        explosion.animations.add(config.explodePic);
      }, this);
    },
    this.generateEnemy = function() {
      var e = this.enemys.getFirstExists(false);
      if(e && game.boss!=1) {
        e.reset(game.rnd.integerInRange(0, this.maxWidth), -game.cache.getImage(config.selfPic).height);
        e.life = config.life;
        e.body.velocity.y = config.velocity;
      }
    }
    this.generateTeam = function() {
      this.d = Math.floor((Math.random() * 100) + 70);
      if(game.boss!=1) {
        game.time.events.add(15000, this.generateTeam, this);
        this.generateTeamMem();
        game.time.events.add(1000, this.generateTeamMem, this);
        game.time.events.add(2000, this.generateTeamMem, this);
        game.time.events.add(3000, this.generateTeamMem, this);
        game.time.events.add(4000, this.generateTeamMem, this);
        game.time.events.add(5000, this.generateTeamMem, this);
      }
    }
    this.generateTeamMem = function() {
      var e;
      e = this.enemys.getFirstExists(false);
      if(e && game.boss!=1) {
        e.reset(180-this.d, -game.cache.getImage(config.selfPic).height);
        e.life = config.life;
        e.body.velocity.y = config.velocity;
      }
      e = this.enemys.getFirstExists(false);
      if(e && game.boss!=1) {
        e.reset(120+this.d, -game.cache.getImage(config.selfPic).height);
        e.life = config.life;
        e.body.velocity.y = config.velocity;
      }
    }
    this.enemyFire = function() {
      this.enemys.forEachExists(function(enemy) {
        var bullet = this.enemyBullets.getFirstExists(false);
        if(bullet) {
          if(game.time.now > (enemy.bulletTime || 0)) {
            bullet.reset(enemy.x + game.cache.getImage(config.selfPic).width/2 -2, enemy.y + game.cache.getImage(config.selfPic).height);
            bullet.body.velocity.y = config.bulletVelocity;
            enemy.bulletTime = game.time.now + config.bulletTimeInterval;
          }
        }
          }, this);
    };
    this.hitEnemy = function(myBullet, enemy) {
      myBullet.kill();
      this.emitter.x = myBullet.x+4; 
      this.emitter.y = myBullet.y+10; 
      this.emitter.start(true, 800, null, 15); 
      enemy.life--;
      if(enemy.life <= 0) {
        game.crash.play();
        enemy.kill();
        var explosion = this.explosions.getFirstExists(false);
        var x = game.cache.getImage(config.selfPic).width/2 - game.cache.getImage(config.explodePic).width/6;
        var y = game.cache.getImage(config.selfPic).height/2 - game.cache.getImage(config.explodePic).height/6;
        explosion.reset(enemy.body.x + x, enemy.body.y + y);
        explosion.play(config.explodePic, 10, false, true);
        game.global.score += config.score;
        config.game.updateText();
      }
    };
    this.hitall = function() {
      this.enemys.forEachExists(function(enemy) {
        enemy.kill();
        var explosion = this.explosions.getFirstExists(false);
        var x = game.cache.getImage(config.selfPic).width/2 - game.cache.getImage(config.explodePic).width/6;
        var y = game.cache.getImage(config.selfPic).height/2 - game.cache.getImage(config.explodePic).height/6;
        explosion.reset(enemy.body.x + x, enemy.body.y + y);
        explosion.play(config.explodePic, 10, false, true);
        game.global.score += config.score;
        config.game.updateText();
      }, this);
    };
  this.enemyAlive = function()
    {
      livingEnemies1 = [];
      //livingEnemies2 = [];
      this.enemys.forEachAlive(function(enemy){
        //if(enemy.body.y < game.height)
          livingEnemies1.push(enemy);
        //console.log(game.width);
      })
      // this.enemies2.forEachAlive(function(enemy){
      //   if(enemy.body.y < game.height)
      //     livingEnemies2.push(enemy);
      //   //console.log(game.width);
      // })
  };
  this.moveEnemy = function()
  {
    
    var i;
    for(i=0;i<livingEnemies1.length;i++)
    {
      if((this.distance(livingEnemies1[i])<1000) && (this.distance(livingEnemies1[i])>800))
      {
        console.log(this.distance(livingEnemies1[i]));
        var dx = this.player.x-livingEnemies1[i].body.x;
        var dy = this.player.y-livingEnemies1[i].body.y;
        dx = dx/Math.abs(dx);
        dy = dy/Math.abs(dy);
        livingEnemies1[i].body.velocity.x = dx*100;
        livingEnemies1[i].body.velocity.y = dy*100;
      }
      else
      {
        livingEnemies1[i].body.velocity.x = 100 * game.rnd.pick([-1, 1]);
        livingEnemies1[i].body.velocity.y = 0;
      }
    }
    // for(i=0;i<livingEnemies2.length;i++)
    // {
    //   if((this.distance(livingEnemies2[i])<800) && (this.distance(livingEnemies1[i])>100))
    //   {
    //     var dx = this.player.x-livingEnemies2[i].body.x;
    //     var dy = this.player.y-livingEnemies2[i].body.y;
    //     dx = dx/Math.abs(dx);
    //     dy = dy/Math.abs(dy);
    //     livingEnemies2[i].body.velocity.x = dx*100;
    //     livingEnemies2[i].body.velocity.y = dy*100;
    //   }
    //   else
    //   {
    //     livingEnemies2[i].body.velocity.x = 100 * game.rnd.pick([-1, 1]);
    //     livingEnemies2[i].body.velocity.y = 0;

    //   }
    // }
  }
}

// Initialize Phaser 
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'canvas');

// Define our global variable 
game.global = { furn: [], score: 0, level: 1, name: ""}; 
// Add all the states 
game.state.add('boot', bootState); 
game.state.add('load', loadState); 
game.state.add('map', mapState);
game.state.add('home', homeState);
game.state.add('field', fieldState); 

game.global.furn = [{type:"table",x:80,y:500},{type:"chair",x:230,y:550},{type:"table",x:430,y:500}];
console.log("reset furniture");


function up(a,b) {
  var x = document.getElementById(a);
  var y = document.getElementById(b);
  if(Number(x.innerHTML)>2){
    x.innerHTML = Number(x.innerHTML)-3;
    y.innerHTML = Number(y.innerHTML)+1;
  }
}
function place(a) {
  var x = document.getElementById(a);
  if(Number(x.innerHTML)>0){
    x.innerHTML = Number(x.innerHTML)-1;
    var i = game.items.create(400, 500, a);
    i.type = a;
    i.anchor.setTo(0.5, 1);
    i.inputEnabled = true;
    i.input.enableDrag();
  }
}
function craft(a,b,c) {
  var x = document.getElementById(a);
  var y = document.getElementById(b);
  if(Number(y.innerHTML)>=c){
    x.innerHTML = Number(x.innerHTML)+1;
    y.innerHTML = Number(y.innerHTML)-c;
  }
}
