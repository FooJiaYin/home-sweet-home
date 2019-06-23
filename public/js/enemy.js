/* Generate Enemies */

var enemyPos = [{ x: 255, y: 655 }, { x: 631, y: 439 },     //twigPos
                { x: 1751, y: 295 }, { x: 1537, y: 655 },   //whitePos
                { x: 1113, y: 889 }, { x: 757, y: 1119 },   //barPos
                { x: 1919, y: 1139 }, { x: 1507, y: 1385 }, //stonemanPos
                { x: 1663, y: 1939 }, { x: 599, y: 1605 }]; //fishPos

// first socket phaser time loop >> server
fieldState.generateEnemy = function () {
    this.genEnemyTime++;
    for (var i = 0; i < this.enemies.length - 1; i++) {
        if (this.enemies[i] && this.enemies[i].alive == false) {
            Client.generateEnemy(i, enemyPos[i].x, enemyPos[i].y, this.enemies[i].type, 10);
        }
    }
}

// server >> phaser
fieldState.addEnemy = function (id, x, y, blood) {
    if (!this.enemies[id] || this.enemies[id].alive) return;
    this.enemies[id].reset(x, y);
    this.enemies[id].anchor.setTo(0.5, 1);
    this.enemies[id].body.gravity.y = 0;
    this.enemies[id].blood = blood;
    this.enemies[id].bloodAbove.scale.setTo(1, 1);
    this.enemies[id].bloodAbove.visible = true;
    this.enemies[id].bloodBottom.visible = true;
    //this.enemies[id].label = game.add.text(-20, -20, 'hp: 3', { font: '15px Microsoft JhengHei', backgroundColor: 'white' });
    //this.enemies[id].label.visible = true;
    //this.enemies[id].label.x = x - 5;
    //this.enemies[id].label.y = y - 100;
    this.enemies[id].body.velocity.x = 0;
    this.enemies[id].body.velocity.y = 0;
    this.enemies[id].checkWorldBounds = true;
    this.enemies[id].outOfBoundsKill = true;
    if (this.enemies[id].type == 'beach' && this.attackCircleList[id]) { //(id==4||id==5||id==6||id==7)
        console.log("circle", this.enemies[id].type);
        this.attackCircleList[id].reset(x, y);
        this.attackCircleList[id].anchor.setTo(0.5, 0.5);
    }
    if (this.enemies[id].type == 'grass') {
        this.enemies[id].notattacked = 5;
    }
}

/* Update status of Enemies */

// server >> phaser
fieldState.updateEnemy = function (id, x, y, blood, animation, frame) {
    this.enemies[id].x = x;
    this.enemies[id].y = y;
    this.enemies[id].blood = blood;
    if (animation == null) {
        this.enemies[id].animations.stop();
        this.enemies[id].frame = frame;
    }
    else this.enemies[id].animations.play(animation);
}

fieldState.updateEnemyBlood = function () {
    this.twigs.forEachAlive(function (enemy) {
        if(enemy) {
            enemy.bloodBottom.x = enemy.x - 30
            enemy.bloodBottom.y = enemy.y - 140;
            enemy.bloodAbove.x = enemy.x - 30;
            enemy.bloodAbove.y = enemy.y - 140;
            if(enemy.blood>0) enemy.bloodAbove.scale.setTo(enemy.blood * 1.0 / 10.0, 1);
            else enemy.bloodAbove.scale.setTo(0, 1);
        }
    });
    this.fishs.forEachAlive(function (enemy) {
        if(enemy) {
            enemy.bloodBottom.x = enemy.x - 30
            enemy.bloodBottom.y = enemy.y - 150;
            enemy.bloodAbove.x = enemy.x - 30;
            enemy.bloodAbove.y = enemy.y - 150;
            enemy.bloodAbove.scale.setTo(enemy.blood * 1.0 / 10.0, 1);
        }  
    });
    this.barbarians.forEachAlive(function (enemy) {
        if(enemy) {
            enemy.bloodBottom.x = enemy.x - 30
            enemy.bloodBottom.y = enemy.y - 100;
            enemy.bloodAbove.x = enemy.x - 30;
            enemy.bloodAbove.y = enemy.y - 100;
            enemy.bloodAbove.scale.setTo(enemy.blood * 1.0 / 10.0, 1);
        }
    });
    this.stonemans.forEachAlive(function (enemy) {
        if(enemy) {
            enemy.bloodBottom.x = enemy.x - 30
            enemy.bloodBottom.y = enemy.y - 100;
            enemy.bloodAbove.x = enemy.x - 30;
            enemy.bloodAbove.y = enemy.y - 100;
            enemy.bloodAbove.scale.setTo(enemy.blood * 1.0 / 10.0, 1);
        }
    });
    this.whitewalkers.forEachAlive(function (enemy) {
        if(enemy) {
            enemy.bloodBottom.x = enemy.x - 30
            enemy.bloodBottom.y = enemy.y - 120;
            enemy.bloodAbove.x = enemy.x - 30;
            enemy.bloodAbove.y = enemy.y - 120;
            enemy.bloodAbove.scale.setTo(enemy.blood * 1.0 / 10.0, 1);
        }
    });
    for (var i = 0; i < this.enemies.length; i++) {
        if (this.enemies[i] && this.enemies[i].alive) {
            if (this.attackCircleList[i] && this.attackCircleList[i].alive) {
                this.attackCircleList[i].x = this.enemies[i].x;
                this.attackCircleList[i].y = this.enemies[i].y;
            }
        }
    }
}

fieldState.updateEnemyLabel = function () {
    for (var i = 0; i < this.enemies.length; i++) {
        if (this.enemies[i] && this.enemies[i].alive) {
            this.enemies[i].label.x = this.enemies[i].x - 5;
            this.enemies[i].label.y = this.enemies[i].y - 100;
            this.enemies[i].label.text = "hp: " + this.enemies[i].blood;
            if (this.attackCircleList[i] && this.attackCircleList[i].alive) {
                this.attackCircleList[i].x = this.enemies[i].x;
                this.attackCircleList[i].y = this.enemies[i].y;
            }
        }
    }
}

// phaser time loop >> phaser & server
fieldState.moveEnemy = function () {
    for (var i = 0; i < this.enemies.length; i++) {
        if (this.enemies[i] && this.enemies[i].alive && !this.enemyBound(this.enemies[i]) && this.distance(this.player, this.enemies[i]) > 50) {//(this.distance(this.player, this.enemies[i]) < 300) && (this.player, this.distance(this.enemies[i]) > 150)) {
            //console.log('move', this.distance(this.enemies[i]));
            var dx = this.player.x - this.enemies[i].body.x;
            var dy = this.player.y - this.enemies[i].body.y;
            var dist = this.distance(this.player, this.enemies[i]);
            dx = dx / dist;
            dy = dy / dist;
            this.enemies[i].body.velocity.x = dx * 150;
            this.enemies[i].body.velocity.y = dy * 150;

            var frame = this.enemies[i].frame;
            var animation = (this.enemies[i].animations.currentAnim) ? this.enemies[i].animations.currentAnim.name : null;
            if (this.enemies[i].type == 'snow') {
                frame = (dx > 0) ? 7 : 0;
                animation = (dx > 0) ? 'attackR' : 'attackL';
            }
            else if (this.enemies[i].type == 'grass' && this.distance(this.player, this.enemies[i]) < 150 && this.enemies[i].notattacked < 5) {
                animation = 'attack';
            }
            else if (dx < 0) animation = 'walkL';
            else animation = 'walkR';
            frame = (dx > 0) ? 2 : 0;

            // update local and server 
            this.updateEnemy(this.enemies[i].id, this.enemies[i].x, this.enemies[i].y, this.enemies[i].blood, animation, frame);
            Client.moveEnemy(this.enemies[i].id, this.enemies[i].x, this.enemies[i].y, this.enemies[i].blood, animation, frame);
        }
        else if (this.enemies[i]) {
            this.enemies[i].body.velocity.x = 0;
            this.enemies[i].body.velocity.y = 0;
        }
    }
}

fieldState.enemyBound = function (monster) {
    switch (monster.type) {
        case "forest":
            if (!(this.player.x < 1457 && this.player.y < 1013 && this.player.y > 139 &&
                this.player.y < ((-1013 * this.player.x / 1457) + 1013)))
                return 1;
            else return 0;
            break;
        case "snow":
            if (!(this.player.x > 1200 && this.player.y < 600 && this.player.y > 139) &&
                !(this.player.x < 2000 && this.player.y > 600 && this.player.y < 0.5 * this.player.x))
                return 1;
            else return 0;
            break;
        case "grass":
            if (!(this.player.y > -0.358 * this.player.x + 804.5 &&
                this.player.y > 0.47 * this.player.x + 54.3 &&
                this.player.y < -0.57 * this.player.x + 1920 &&
                this.player.y < 0.91 * this.player.x + 680.25) || monster.notattacked == 5) {
                monster.notattacked = 5;//all related to not attacked are changed
                this.attackCircleList[monster.id].kill();
                //console.log('na='+monster.notattacked);
                return 1;//dont move
            }
            else {
                if (monster.notattacked != 5) monster.notattacked += 0.125;
                return 0;
            }
            break;
        case "mine":
            if (!(this.player.y < 0.2 * this.player.x + 1174 &&
                this.player.y > -0.57 * this.player.x + 1918.09 &&
                this.player.y > 0.66 * this.player.x - 280))
                return 1;
            else return 0;
            break;
        case "beach":
            if (!(this.player.y > -0.27 * this.player.x + 1665 && this.player.y > 0.2 * this.player.x + 1276 && this.player.y < 1891))
                return 1;
            else return 0;
            break;
    }
}

// first socket phaser >> server
fieldState.enemyShoot = function () {
    var range = 350;
    var random;

    // choose a random enemy that is alive
    var livingEnemiesId = [];
    for (var i = 0; i < this.enemies.length; i++) {
        if (this.enemies[i] && this.enemies[i].alive) livingEnemiesId.push(i);
    }
    random = this.rnd.integerInRange(0, livingEnemiesId.length - 1);
    var shooter = this.enemies[livingEnemiesId[random]];
    if (shooter && shooter.type == 'grass' && shooter.notattacked == 5) return;

    // aim a random player in its range
    var playersInRange = [];
    if (this.distance(this.player, shooter) < range) playersInRange.push(this.player);
    for (var i = 0; i < this.playersList.length; i++) {
        if (this.playersList[i] && this.distance(this.playersList[i], shooter) < range) {
            playersInRange.push(this.playersList[i]);
            //console.log("inrange", shooter.id, i);
        }
    }
    if (playersInRange.length > 0) {
        var random = this.rnd.integerInRange(0, playersInRange.length - 1);
        var target = playersInRange[random];
        var dx = target.x - shooter.body.x;
        var dy = target.y - shooter.body.y;
        dx = dx / this.distance(target, shooter);
        dy = dy / this.distance(target, shooter);
        console.log("shoot", shooter.id, shooter.x, shooter.y, dx * 200, dy * 200, shooter.type);
        Client.generateBullet(shooter.x, shooter.y, dx * 200, dy * 200, shooter.type);
    }
}
fieldState.distance = function (target, shooter) {
    if (shooter) {
        var dx = shooter.body.x - target.x;
        var dy = shooter.body.y - target.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
    else {
        return 800;
    }
}

// server >> phaser
fieldState.addBullet = function (id, x, y, velocityX, velocityY, type) {
    console.log("addBullet", id);
    switch (type) {
        case 'forest':
            this.enemyBulletsList[id] = this.forestBullets.getFirstExists(false);
            break;
        case 'snow':
            this.enemyBulletsList[id] = this.snowBullets.getFirstExists(false);
            break;
        case 'grass':
            this.enemyBulletsList[id] = this.grassBullets.getFirstExists(false);
            break;
        case 'mine':
            this.enemyBulletsList[id] = this.mineBullets.getFirstExists(false);
            break;
        case 'beach':
            this.enemyBulletsList[id] = this.beachBullets.getFirstExists(false);
            break;
    }
    this.enemyBulletsList[id].id = id;
    this.enemyBulletsList[id].reset(x, y);
    if(Math.abs(this.player.x - x) > 200 || Math.abs(this.player.y - y) > 200) {
        this.shootSnd.volumn = 0.8;
        this.shootSnd.play();
    }
    this.enemyBulletsList[id].body.velocity.x = velocityX;
    this.enemyBulletsList[id].body.velocity.y = velocityY;
    this.enemyBulletsList[id].events.onOutOfBounds.add(function () {
        //console.log("OutOfBounds");
        Client.killBullet(id, "OutOfBounds");
    }, this);
}

fieldState.bulletBound = function () {
    this.forestBullets.forEachAlive(function (b) {
        if (!(b.position.x < 1557 && b.position.y < 1013 && b.position.y < ((-1013 * b.position.x / 1557) + 1013)))
            b.kill();
    });
    this.snowBullets.forEachAlive(function (b) {
        if (!(b.position.x > 1200 && b.position.y < 600) &&
            !(b.position.x < 2000 && b.position.y > 600 && b.position.y < 0.5 * b.position.x))
            b.kill();
    });
    this.grassBullets.forEachAlive(function (b) {
        if (!(b.position.y > -0.358 * b.position.x + 804.5 && b.position.y > 0.47 * b.position.x + 54.3 && b.position.y < -0.57 * b.position.x + 1920 && b.position.y < 0.91 * b.position.x + 680.25))
            b.kill();
    });
    this.mineBullets.forEachAlive(function (b) {
        if (!(b.position.y < 0.2 * b.position.x + 1274 && b.position.y > -0.57 * b.position.x + 1918.09 && b.position.y > 0.66 * b.position.x - 281))
            b.kill();
    });
    this.beachBullets.forEachAlive(function (b) {
        if (!(b.position.y > -0.27 * b.position.x && b.position.y > 0.2 * b.position.x + 1276))
            b.kill();
    });
}

// server >> phaser
fieldState.removeBullet = function (id) {
    this.bullets[id].kill();
}

/* Attacked and Killed */

//attacked
fieldState.attack_c = function (weapon, monster) {
    monster.blood = monster.blood - game.global.attack - game.global.attup;;
    console.log('blood', monster.blood);
    if (monster.type == "grass") {
        monster.notattacked = 0;
        this.attackCircleList[monster.id].reset(monster.x, monster.y);
        this.attackCircleList[monster.id].anchor.setTo(0.5, 0.5);
    }
    if (monster.blood <= 0) {
        this.monsterDie(monster.x, monster.y, monster.type);
        this.removeEnemy(monster.id);
        Client.killEnemy(monster.id);
    }
    else Client.moveEnemy(monster.id, monster.x, monster.y, monster.blood/*, monster.animations.currentAnim.name, monster.facing*/);
}
fieldState.attack_f = function (weapon, monster) {
    weapon.kill();
    monster.blood--;
    console.log('blood', monster.blood);
    if (monster.type == "grass") {
        monster.notattacked = 0;
        this.attackCircleList[monster.id].reset(monster.x, monster.y);
        this.attackCircleList[monster.id].anchor.setTo(0.5, 0.5);
    }
    if (monster.blood <= 0) {
        this.monsterDie(monster.x, monster.y, monster.type);
        this.removeEnemy(monster.id);
        Client.killEnemy(monster.id);
    }
    else Client.moveEnemy(monster.id, monster.x, monster.y, monster.blood/*, monster.animations.currentAnim.name, monster.facing*/);
}

// generate awards
fieldState.monsterDie = function (x, y, type) {
    this.enemyDieSnd.play();
    var ghost = this.ghosts.getFirstExists(false);
    ghost.reset(x, y);
    ghost.body.velocity.x = 0;
    ghost.body.velocity.y = -120;
    ghost.alpha = 1;
    game.add.tween(ghost).to({ alpha: 0 }, 1500, "Linear", true);
    game.time.events.add(4000, function() {ghost.kill();}, this);

    var left, i, radian = 0;
    switch (type) {
        case "forest":
            left = this.forestlefts.getFirstExists(false);
            break;
        case "snow":
            left = this.snowlefts.getFirstExists(false);
            break;
        case "grass":
            left = this.grasslefts.getFirstExists(false);
            break;
        case "mine":
            left = this.minelefts.getFirstExists(false);
            break;
        case "beach":
            left = this.beachlefts.getFirstExists(false);
            break;
    }
    for (i = 0; i < 3; i++) {
        //stone = this.stones.getFirstExists(false);
        radian = 120 * 3.14 * i / 180;
        if (left) {
            left.reset(x + 15 * Math.cos(radian), y + 15 * Math.sin(radian));
        }
    }
}

// triggered by server
fieldState.removeEnemy = function (id) {
    //this.enemies[id].label.visible = false;
    this.enemies[id].bloodAbove.visible = false;
    this.enemies[id].bloodBottom.visible = false;
    this.enemies[id].kill();
    this.attackCircleList[id].kill();
}