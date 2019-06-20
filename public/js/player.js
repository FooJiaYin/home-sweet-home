/* Status update: server >> phaser */

fieldState.setPlayerId = function (newId) {
    this.playerId = newId;
}

fieldState.addNewPlayer = function (id, x, y, skin) {
    if (skin == 1) this.playersList[id] = game.add.sprite(x, y, 'player');
    this.playersList[id].id = id;
    this.playersList[id].freeze = false;
    this.playerGroup.add(this.playersList[id]);
    game.physics.arcade.enable(this.playersList[id]);
    this.playersList[id].body.collideWorldBounds = true;
    this.playersList[id].animations.add('goforward', [0, 1, 2, 3], 8, true);
    this.playersList[id].animations.add('goleft', [4, 5, 6, 7], 8, true);
    this.playersList[id].animations.add('goright', [8, 9, 10, 11], 8, true);
    this.playersList[id].animations.add('gobackward', [12, 13, 14, 15], 8, true);
    if (id == this.playerId) {
        this.player = this.playersList[id];
        game.camera.follow(this.player);
        this.player.facing = 0;
    }
}

fieldState.updatePlayer = function (id, x, y, animation, facing) {
    this.playersList[id].x = x;
    this.playersList[id].y = y;
    if (animation == null) {
        this.playersList[id].animations.stop();
        this.playersList[id].frame = facing * 4;
    }
    else this.playersList[id].animations.play(animation);
}

fieldState.removePlayer = function (id) {
    this.playerMap[id].destroy();
    delete this.playerMap[id];
    var gg = game.add.sprite(this.playerMap[id].x, this.playerMap[id].y, 'gg');
    game.time.events.add(1000, function () { gg.destroy(); }, this);
}

/* Action control: phaser input >> server */

fieldState.movePlayer = function () {
    if (this.player.freeze) {
        this.player.body.velocity.x = 0;
        this.player.body.velocity.y = 0;
        this.player.frame = this.player.facing * 4;
        this.player.animations.stop();
    } else if (this.cursor.left.isDown) {
        this.player.body.velocity.x = -200;
        this.player.body.velocity.y = 0;
        this.player.facing = 1;
        this.player.animations.play('goleft');
    } else if (this.cursor.right.isDown) {
        this.player.body.velocity.x = 200;
        this.player.body.velocity.y = 0;
        this.player.facing = 2;
        this.player.animations.play('goright');
    } else if (this.cursor.up.isDown) {
        this.player.body.velocity.x = 0;
        this.player.body.velocity.y = -200;
        this.player.facing = 3;
        this.player.animations.play('gobackward');
    } else if (this.cursor.down.isDown) {
        this.player.body.velocity.x = 0;
        this.player.body.velocity.y = 200;
        this.player.facing = 0;
        this.player.animations.play('goforward');
    } else {
        this.player.body.velocity.x = 0;
        this.player.body.velocity.y = 0;
        this.player.frame = this.player.facing * 4;
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
        var num_w = document.getElementById("wood");
        num_w.innerHTML = Number(num_w.innerHTML) + 1;
        saveState();
    }
}

fieldState.swordA = function () {
    this.showSword(this.player);
    //console.log(this.player.freeze);
    Client.attack('sword');
}

fieldState.showSword = function (player) {
    var sword = this.swords.getFirstDead();
    sword.x = -40;
    sword.y = -40;
    sword.x = -40;
    sword.y = -40;
    if (player.facing == 0) {
        sword.frame = 0;
        sword.reset(player.x - 10, player.y - 10);
    } else if (player.facing == 1) {
        sword.frame = 1;
        sword.reset(player.x - 32, player.y - 10);
        sword.x = player.x - 32;
        sword.y = player.y - 10;
    } else if (player.facing == 2) {
        sword.frame = 0;
        sword.reset(player.x, player.y - 10);
        sword.x = player.x;
        sword.y = player.y - 10;
    } else {
        sword.frame = 1;
        sword.reset(player.x - 32, player.y - 10);
    }
    this.playersList[player.id].freeze = true;
    game.time.events.add(500, function () {
        sword.kill();
        this.player.freeze = false;
    }, this);
}

fieldState.arrowA = function () {
    this.createArrow(this.player);
    Client.attack('arrow');
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

fieldState.hurt = function (player, bul) {
    game.global.hp--;
    bul.kill();
    Client.killBullet(bul.id, "hit");
    if (game.global.hp < 1) {
        game.global.hp = 20;
        this.dead();
    }
    this.life.setText("HP:" + game.global.hp);
    saveState();
}

fieldState.dead = function () {
    this.playing = 0;
    var gg = game.add.sprite(this.player.x, this.player.y, 'gg');
    gg.anchor.setTo(0.5, 0.5);
    this.player.kill();
    Client.socket.close();
    game.time.events.add(1000, function () { game.state.start('home'); }, this);
}