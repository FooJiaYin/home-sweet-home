/* Status update: server >> phaser */

fieldState.setPlayerId = function (newId) {
    this.playerId = newId;
}

fieldState.addNewPlayer = function (id, x, y, skin) {
    if (skin == 1) this.playersList[id] = game.add.sprite(x, y, 'player');
    this.playersList[id].scale.setTo(0.6, 0.6); 
    this.playersList[id].id = id;
    this.playersList[id].freeze = false;
    this.playersList[id].animations.add('goforward', [20, 21], 4, true);
    this.playersList[id].animations.add('goleft', [0, 1, 2, 3, 4, 5], 8, true);
    this.playersList[id].animations.add('goright', [10, 11, 12, 13, 14, 15], 8, true);
    this.playersList[id].animations.add('gobackward', [18, 19], 4, true);
    this.playerGroup.add(this.playersList[id]);
    game.physics.arcade.enable(this.playersList[id]);
    this.playersList[id].body.collideWorldBounds = true;
    if (id == this.playerId) {
        this.player = this.playersList[id];
        game.camera.follow(this.player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
        this.playersList[id].facing = 0;
        this.playersList[id].inputEnabled = true;
        this.playersList[id].events.onInputDown.add(this.openBag, this);
    }
}

fieldState.updatePlayer = function (id, x, y, animation, facing) {
    this.playersList[id].x = x;
    this.playersList[id].y = y;
    this.playersList[id].facing = facing;
    if (animation == null) {
        this.playersList[id].animations.stop();
        if(facing == 0) this.playersList[id].frame = 7;
        else if(facing == 1) this.playersList[id].frame = 6;
        else if(facing == 2) this.playersList[id].frame = 9;
        else this.playersList[id].frame = 22;
    }
    else this.playersList[id].animations.play(animation);
}

fieldState.removePlayer = function (id) {
    this.playerMap[id].destroy();
    delete this.playerMap[id];
    var deadBody = game.add.sprite(this.playerMap[id].x, this.playerMap[id].y, 'die');
    game.time.events.add(1000, function () { deadBody.destroy(); }, this);
}

/* Action control: phaser input >> server */

fieldState.movePlayer = function () {
    if (this.player.freeze) { //do nothing during attack
    } 
    else if (this.cursor.left.isDown){
        this.player.facing = 1;
        this.player.animations.play('goleft');
        this.closeStore();
    } 
    else if (this.cursor.right.isDown){
        this.player.facing = 2;
        this.player.animations.play('goright');
        this.closeStore();
    } 
    else if (this.cursor.up.isDown){
        this.player.facing = 3;
        this.player.animations.play('gobackward');
        this.closeStore();
    } 
    else if (this.cursor.down.isDown){
        this.player.facing = 0;
        this.player.animations.play('goforward');
        this.closeStore();
    }
  
    if (((!game.global.weed&&this.cursor.left.isDown) || (game.global.weed&&this.cursor.right.isDown))&&this.player.x>100) {
        document.getElementById("bag").style.display = "none";
        this.player.body.velocity.x = -300*game.global.speup;
        this.player.body.velocity.y = 0;
    } 
    else if ((!game.global.weed&&this.cursor.left.isDown) || (game.global.weed&&this.cursor.right.isDown)) { 
        document.getElementById("bag").style.display = "none";
        this.player.x = 100;
        this.player.body.velocity.x = 0;
        this.player.body.velocity.y = 0;
    } 
    else if ((!game.global.weed&&this.cursor.right.isDown) || (game.global.weed&&this.cursor.left.isDown)) { 
        //document.getElementById("bag").style.display = "none";
        this.player.body.velocity.x = 300*game.global.speup;
        this.player.body.velocity.y = 0;
    } 
    else if (((!game.global.weed&&this.cursor.up.isDown) || (game.global.weed&&this.cursor.down.isDown))&&this.player.y>180) { 
        //document.getElementById("bag").style.display = "none";
        this.player.body.velocity.x = 0;
        this.player.body.velocity.y = -300*game.global.speup;
    } 
    else if ((!game.global.weed&&this.cursor.up.isDown) || (game.global.weed&&this.cursor.down.isDown)) { 
        //document.getElementById("bag").style.display = "none";
        this.player.y = 180;      
        this.player.body.velocity.x = 0;
        this.player.body.velocity.y = 0;
    } 
    else if (((!game.global.weed&&this.cursor.down.isDown) || (game.global.weed&&this.cursor.up.isDown))&&this.player.y<1800) { 
        //document.getElementById("bag").style.display = "none";
        this.player.body.velocity.x = 0;
        this.player.body.velocity.y = 300*game.global.speup;
    } 
    else if ((!game.global.weed&&this.cursor.down.isDown) || (game.global.weed&&this.cursor.up.isDown)) { 
        //document.getElementById("bag").style.display = "none";
        this.player.y = 1800;
        this.player.body.velocity.x = 0;
        this.player.body.velocity.y = 0;
    } 
    else {
        this.player.body.velocity.x = 0;
        this.player.body.velocity.y = 0;
        if(this.player.facing == 0) this.player.frame = 7;
        else if(this.player.facing == 1) this.player.frame = 6;
        else if(this.player.facing == 2) this.player.frame = 9;
        else this.player.frame = 22;
        this.player.animations.stop();
    } 
    if (this.player.animations.currentAnim.isPlaying) {
        Client.movePlayer(this.player.x, this.player.y, this.player.animations.currentAnim.name, this.player.facing);
    }
    else Client.movePlayer(this.player.x, this.player.y, null, this.player.facing);
}

fieldState.pickUp = function (player, item) {
    if (this.keyE.isDown) {
        item.kill();
        var num_w = document.getElementById(item_name);
        num_w.innerHTML = Number(num_w.innerHTML) + 1;
        saveState();
    }
}

fieldState.swordA = function () {
    this.showSword(this.player);
    //console.log(this.player.freeze);
    Client.sword(game.global.weapon);
}

fieldState.showSword = function (player, weapon) {
    var sword; 
    if (player.facing == 0 || player.facing == 1) {
        this.playersList[player.id].frame = 17;
        sword = this.swords.getFirstDead();
        //sword.frame = 0;
        sword.reset(player.x - 20, player.y + 28);
        sword.x = player.x - 20;
        sword.y = player.y + 28;
        if(weapon==1) sword.animations.play('attleft');
        else if(weapon==2) sword.animations.play('attleft2');
        else sword.animations.play('attleft3');
    /*} else if (player.facing == 1) {
        this.playersList[player.id].frame = 0;
        sword = this.swords_b.getFirstDead();
        //sword.frame = 1;
        sword.reset(player.x - 43, player.y - 28);
        sword.x = player.x - 43;
        sword.y = player.y - 28;
        sword.animations.play('attleft');
    } else if (player.facing == 2) {
        playersList[player.id].frame = 16;
        sword = this.swords.getFirstDead();
        //sword.frame = 0;
        sword.reset(player.x - 5, player.y - 28);
        sword.x = player.x - 5;
        sword.y = player.y - 28;
        sword.animations.play('attright');
    */} else {
        this.playersList[player.id].frame = 16;
        sword = this.swords_b.getFirstDead();
        sword.reset(player.x + 35, player.y + 28);
        sword.x = player.x + 35;
        sword.y = player.y + 28;
        if(player.weapon==1) sword.animations.play('attright');
        else if(player.weapon==2) sword.animations.play('attright2');
        else sword.animations.play('attright3');
    }
    game.physics.arcade.enable(sword);
    this.playersList[player.id].animations.stop();
    this.playersList[player.id].body.velocity.x = 0;
    this.playersList[player.id].body.velocity.y = 0;
    this.playersList[player.id].freeze = true;
    
    sword.animations.currentAnim.onComplete.add(function () {
        game.physics.arcade.overlap(sword, this.twigs, this.attack_c, null, this);
        game.physics.arcade.overlap(sword, this.whitewalkers, this.attack_c, null, this);
        game.physics.arcade.overlap(sword, this.barbarians, this.attack_c, null, this);
        game.physics.arcade.overlap(sword, this.stonemans, this.attack_c, null, this);
        game.physics.arcade.overlap(sword, this.fishs, this.attack_c, null, this);
        sword.kill();
        this.playersList[player.id].freeze = false;
    }, this);
}

fieldState.arrowA = function () {
    this.createArrow(this.player);
    Client.arrow();
}

fieldState.createArrow = function (player) {
    var a = this.arrows.getFirstExists(false);
    if (a) {
        a.reset(game.rnd.integerInRange(player.x - 200, player.x + 200), game.rnd.integerInRange(player.y - 200, player.y + 200));
        a.frame = player.facing;
        if (player.facing == 0) {
            a.body.velocity.y = 400;
            a.x = player.x;
            a.y = player.y + 50;
        } else if (player.facing == 1) {
            a.body.velocity.x = -400;
            a.x = player.x - 40;
            a.y = player.y + 15;
        } else if (player.facing == 2) {
            a.body.velocity.x = 400;
            a.x = player.x + 40;
            a.y = player.y + 15;
        } else {
            a.body.velocity.y = -400;
            a.x = player.x;
            a.y = player.y - 50;
        }
        game.time.events.add(1000, function () { a.kill(); }, this);
    }
}

/* Event trigger: phaser >> server */

fieldState.nearAttack = function(player, circle) {
    var enemy = this.enemies[circle.id];
    // Near attack is available for the type and the enemy isn't busy
    if(!enemy.currentAnim) {
        this.attackSnd.volumn = 0.8;
        this.attackSnd.play();
        if(enemy.type == 'grass'){
            enemy.animations.play('attack');
        }
        else {                
            if(enemy.faceL==1) enemy.animations.play('attackL');
            else enemy.animations.play('attackR');
        }
        // update animation in local and server
        this.updateEnemy(enemy.id, enemy.x, enemy.y, enemy.blood, enemy.animations.currentAnim.name, enemy.frame);
        Client.moveEnemy(enemy.id, enemy.x, enemy.y, enemy.blood, enemy.animations.currentAnim.name, enemy.frame);
        this.hurt();
        circle.kill();
        // revive circle after 1s
        game.time.events.add(3000, function(){
            if(enemy.alive) circle.reset(enemy.x, enemy.y);
        }, this);
    }
}

fieldState.farAttack = function(player, bul) {
    this.hurt();
    bul.kill();
    Client.killBullet(bul.id, "hit");
}

fieldState.hurt = function () {
    game.global.hp--;
    if (game.global.hp < 1) {
        this.dead();
    }
    //this.life.setText("HP:" + game.global.hp);
    this.lifetext.setText(game.global.hp+"/"+game.global.maxhp);
    this.life.scale.setTo(game.global.hp/game.global.maxhp,1);
    saveState();
}

fieldState.dead = function () {
    this.playing = 0;
    this.player.freeze = true;
    var deadBody = game.add.sprite(this.player.x, this.player.y, 'die');
    deadBody.anchor.setTo(0.5, 0.5);
    deadBody.scale.setTo(0.6, 0.6);
    this.player.kill();
    var x = document.getElementsByClassName("num");
    var i;
    for (i = 0; i < x.length; i++) {
      x[i].innerHTML = Math.floor(x[i].innerHTML/2);
    }
    var w = document.getElementById("weapon");
    var c = document.getElementById("cloth");
    w.innerHTML = "木劍";
    c.innerHTML = "皮革上衣";
    game.global.weapon = 1;
    game.global.attack = 1;
    game.global.cloth = 1;
    game.global.maxhp = 20;
    game.camera.fade(0x000000, 2500);
    game.fieldBgm.stop();
    game.playerDie.play();
    game.time.events.add(2500, function () { 
        Client.socket.close();
        game.state.start('home'); 
    }, this);
}