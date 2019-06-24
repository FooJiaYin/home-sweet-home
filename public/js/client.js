/**
 * Created by Jerome on 03-03-17.
 */

var Client = {};
Client.socket = io.connect();

// Todo 4 : Create Client function "sendClick"
// 1. Use the familiar way like above to create a function(Client.sendClick)
// 2. use Client.socket.emit() send message 'click' and parameter {x: ?, y: ?}
Client.initState = function(state) {
    if(Client.socket.disconnected) Client.socket.connect();
    Client.gameState = state;
    Client.socket.emit('init', state);
    console.log('init', state);
}

Client.movePlayer = function(x, y, animation, facing) {
    Client.socket.emit('movePlayer', {x: x, y: y, animation: animation, facing: facing});
}

Client.generateEnemy = function(id, x, y, type, blood) {
    Client.socket.emit('generateEnemy',  {id: id, x: x, y: y, type: type, blood: blood});
}

Client.moveEnemy = function(id, x, y, blood, animation, frame) {
    Client.socket.emit('moveEnemy', {id: id, x: x, y: y, blood: blood, animation: animation, frame: frame});
    //console.log('moveEnemy', {id: id, x: x, y: y, blood: blood, animation: animation, frame: frame});
}

Client.killEnemy = function(id) {
    Client.socket.emit('killEnemy', id);
    console.log('killEnemy', id);
}

Client.generateBullet = function(x, y, velocityX, velocityY, type) {
    //console.log("generateBullet");
    Client.socket.emit('generateBullet', {x: x, y: y, velocityX: velocityX, velocityY: velocityY, type: type});
    //console.log('generateBullet', {x: x, y: y, velocityX: velocityX, velocityY: velocityY, type: type});
}

Client.killBullet = function(id, reason) {
    if(reason =="hit") Client.socket.emit('killBullet', id);
    else if(reason=="OutOfBounds") Client.socket.emit('outOfBoundsKillBullet', id);
    //console.log("killBullet:", reason);
}

Client.sword = function(weapon) {
    Client.socket.emit('sword', weapon);
    //console.log(weapon);
}

Client.arrow = function() {
    Client.socket.emit('arrow');
}

Client.sendTest = function() {
    Client.socket.emit('test');
    //console.log('test');
};

Client.socket.on('getconnected', function(data) {
    //console.log(data);
});

Client.socket.on('firstSocket', function(data) {
    console.log(data.id1, data.id2);
    if(data.id1 == data.id2) fieldState.firstSocket = true;
    else fieldState.firstSocket = false;
});

Client.socket.on('playerId', function(id) {
    //Client.playerId = id;
    fieldState.setPlayerId(id);
});

Client.socket.on('newplayer', function(data) {
    if(Client.gameState == 'field')
        fieldState.addNewPlayer(data.id, data.x, data.y, data.skin);
    console.log(data.id, data.x, data.y, data.skin);
});

Client.socket.on('allplayers', function(data) {
    if(Client.gameState == 'field') {
        for (var i = 0; i < data.length; i++) 
            fieldState.addNewPlayer(data[i].id, data[i].x, data[i].y, data[i].skin);
    }
    
    Client.socket.on('updatePlayer', function(data) {
        if(Client.gameState == 'field')
            fieldState.updatePlayer(data.id, data.x, data.y, data.animation, data.facing);
    });

    Client.socket.on('removePlayer', function(id) {
        if(Client.gameState == 'field')
            fieldState.removePlayer(id);
    });
});

Client.socket.on('showSword', function(data, weapon) {
    if(Client.gameState == 'field')
        fieldState.showSword(data, weapon);
});

Client.socket.on('createArrow', function(data) {
    if(Client.gameState == 'field')
        fieldState.createArrow(data);
});

Client.socket.on('allEnemies', function(data) {
    if(Client.gameState == 'field') {
        for (var i = 0; i < data.length; i++) 
            if(data[i].isAlive)
                fieldState.addEnemy(data[i].id, data[i].x, data[i].y, data[i].blood/*, data.animation, data.facing*/);
    }
});

Client.socket.on('addEnemy', function(data) {
    //console.log(data);
    if(Client.gameState == 'field')
        fieldState.addEnemy(data.id, data.x, data.y, data.blood);
});

Client.socket.on('updateEnemy', function(data) {
    if(Client.gameState == 'field')
        fieldState.updateEnemy(data.id, data.x, data.y, data.blood/*, data.animation, data.facing*/);
});

Client.socket.on('removeEnemy', function(id) {
    if(Client.gameState == 'field')
        fieldState.removeEnemy(id);
});

Client.socket.on('addBullet', function(data) {
    if(Client.gameState == 'field')
        fieldState.addBullet(data.id, data.x, data.y, data.velocityX, data.velocityY, data.type);
    //console.log("addBullet", data.id);
});

Client.socket.on('removeBullet', function(id) {
    if(Client.gameState == 'field')
        fieldState.removeBullet(id);
});