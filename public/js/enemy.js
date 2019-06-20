/* Generate Enemies */

var enemyPos = [{ x: 255, y: 655 }, { x: 631, y: 439 },     //twigPos
                { x: 1751, y: 295 }, { x: 1537, y: 655 },   //whitePos
                { x: 1113, y: 889 }, { x: 757, y: 1119 },   //barPos
                { x: 1919, y: 1139 }, { x: 1507, y: 1385 }, //stonemanPos
                { x: 1663, y: 1939 }, { x: 599, y: 1605 }]; //fishPos

// phaser time loop >> server
fieldState.generateEnemy = function () {
    this.genEnemyTime++;
    for (var i = 0; i < this.enemies.length - 1; i++) {
        if (this.enemies[i] && this.enemies[i].alive == false) {
            Client.generateEnemy(i, enemyPos[i].x, enemyPos[i].y, this.enemies[i].type, 3);
        }
    }
}

// server >> phaser
fieldState.addEnemy = function (id, x, y, blood) {
    if(!this.enemies[id] || this.enemies[id].alive) return;
    this.enemies[id].reset(x, y);
    this.enemies[id].anchor.setTo(0.5, 1);
    this.enemies[id].label = game.add.text(-20, -20, 'hp: 3', { font: '15px Microsoft JhengHei', backgroundColor: 'white' });
    this.enemies[id].body.gravity.y = 0;
    this.enemies[id].blood = blood;
    this.enemies[id].label.visible = true;
    this.enemies[id].label.x = x - 5;
    this.enemies[id].label.y = y - 100;
    this.enemies[id].body.velocity.x = 0;
    this.enemies[id].body.velocity.y = 0;
    this.enemies[id].checkWorldBounds = true;
    this.enemies[id].outOfBoundsKill = true;
}


/* Update status of Enemies */

// server >> phaser
fieldState.updateEnemy = function (id, x, y, blood/*, animation, facing*/) {
    this.enemies[id].x = x;
    this.enemies[id].y = y;
    this.enemies[id].blood = blood;
    /*if(animation == null) {
      this.enemies[id].animations.stop();
      this.enemies[id].frame = facing*4;
    }
    else this.enemies[id].animations.play(animation);*/
}

fieldState.updateEnemyLabel = function () {
    for(var i = 0; i < this.enemies.length; i++) {
        if(this.enemies[i] && this.enemies[i].alive) {      
            this.enemies[i].label.x = this.enemies[i].x - 5;
            this.enemies[i].label.y = this.enemies[i].y - 100;
            this.enemies[i].label.text = "hp: " + this.enemies[i].blood;
        }
    }
}

// phaser time loop >> phaser & server
fieldState.moveEnemy = function () {
    for (var i = 0; i < this.enemies.length; i++) {
        if (this.enemies[i] && this.enemies[i].alive && (this.distance(this.player, this.enemies[i]) < 300) && (this.player, this.distance(this.enemies[i]) > 150)) {
            console.log('move', this.distance(this.enemies[i]));
            var dx = this.player.x - this.enemies[i].body.x;
            var dy = this.player.y - this.enemies[i].body.y;
            dx = dx / Math.abs(dx);
            dy = dy / Math.abs(dy);
            this.enemies[i].body.velocity.x = dx * 100;
            this.enemies[i].body.velocity.y = dy * 100;
            Client.moveEnemy(this.enemies[i].id, this.enemies[i].x, this.enemies[i].y, this.enemies[i].blood/*, this.enemies1[i].animations.currentAnim.name, this.enemies1[i].facing*/);
        }
        else if(this.enemies[i]) {
            this.enemies[i].body.velocity.x = 0;
            this.enemies[i].body.velocity.y = 0;
        }
    }
}

/* Control attack action */
/*
fieldState.enemyAttack = function () {
    var monsters;
    for (var j = 0; j < 3; j++) {
        switch (j) {
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

        if (monsters) {
            for (var i = 0; i < monsters.length; i++) {
                if (this.distance(monsters[i]) < 150 && monsters[i].attack == 0) {
                    monsters[i].attack = 1;
                    var local_circle = this.circles.getFirstDead(false);
                    local_circle.reset(monsters[i].x, monsters[i].y);
                    monsters.circle = local_circle;
                    console.log('p');
                    game.time.events.add(800, function () {
                        local_circle.kill();
                        //monsters[i].attack = 0;
                    }, this);

                }
                else if (this.distance(monsters[i]) > 150) {
                    monsters[i].attack = 0;
                    console.log('d:' + this.distance(monsters[i]));
                }
                else {
                    console.log("dist = " + this.distance(monsters[i]));
                }
            }
        }
    }
}*/

// phaser >> server
fieldState.enemyShoot = function () {
    var n = 0, range = 300;
    var random;

    // choose a random enemy that is alive
    var livingEnemiesId = [];
    for (var i = 0; i < this.enemies.length; i++) {
        if (this.enemies[i] && this.enemies[i].alive) livingEnemiesId.push(i);
    }
    random = this.rnd.integerInRange(0, livingEnemiesId.length - 1);
    var shooter = this.enemies[livingEnemiesId[random]];

    // aim a random player in its range
    var playersInRange = [];
    if(this.distance(this.player, shooter)<range) playersInRange.push(this.player);
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
    this.enemyBulletsList[id].body.velocity.x = velocityX;
    this.enemyBulletsList[id].body.velocity.y = velocityY;
    this.enemyBulletsList[id].events.onOutOfBounds.add(function () {
        //console.log("OutOfBounds");
        Client.killBullet(id, "OutOfBounds");
    }, this);
}

// server >> phaser
fieldState.removeBullet = function (id) {
    this.bullets[id].kill();
}

/* Attacked and Killed */

//attacked
fieldState.attack_c = function (weapon, monster) {
    monster.blood--;
    console.log('blood', monster.blood);
    if (monster.type == "snow") {
        monster.notattacked = 0;
    }
    if (monster.blood <= 0) {
        this.monsterDie(monster.x, monster.y, monster.type);
        Client.killEnemy(monster.id);
    }
    else Client.moveEnemy(monster.id, monster.x, monster.y, monster.blood/*, monster.animations.currentAnim.name, monster.facing*/);
}
fieldState.attack_f = function (weapon, monster) {
    weapon.kill();
    monster.blood--;
    console.log('blood', monster.blood);
    if (monster.type == "snow") {
        monster.notattacked = 0;
    }
    if (monster.blood <= 0) {
        this.monsterDie(monster.x, monster.y, monster.type);
        Client.killEnemy(monster.id);
    }
    else Client.moveEnemy(monster.id, monster.x, monster.y, monster.blood/*, monster.animations.currentAnim.name, monster.facing*/);
}

// generate awards
fieldState.monsterDie = function (x, y, type) {
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
    this.enemies[id].label.visible = false;
    this.enemies[id].kill();
}