var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

//  Import files from source folder( css, js, assets)
app.use('/css', express.static(__dirname + '/public/css'));
app.use('/js', express.static(__dirname + '/public/js'));
app.use('/assets', express.static(__dirname + '/public/assets'));


app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});
/*app.get('/signin.html', function(req, res) {
    res.sendFile(__dirname + '/public/signin.html');
});
app.get('/game.html', function(req, res) {
    res.sendFile(__dirname + '/public/game.html');
});*/

//server.firstSocketID = 0;
server.lastSessionID = 0;
server.alive = [];
server.enemies = [];
server.bullets = [];

server.listen(process.env.PORT || 8081, function() {
    console.log('Listening on ' + server.address().port);
});

io.on('connection', function(socket) {
    // Triggered whe new user is in 
    // We can use socket to communicate with clients

    // Add eventlistener to message "newplayer"
    socket.on('init', function(state) {
        socket.gameState = state;
        // When being trigger we create a player and add on socket 
        // Let server to identify this user later
        
        //if(Object.keys(io.sockets.connected)[0])
            setFirstSocket(socket.id);
        //else setFirstSocket(Object.keys(io.sockets.connected)[0]);

        if(state == 'field') {
            for(lastSessionID=0; lastSessionID<server.alive.length; lastSessionID++) {
                if(server.alive[lastSessionID] == false) break;
            }
            server.alive[lastSessionID] == true;
            socket.player = {
                id: lastSessionID++,
                x: 190,
                y: 1040,
                skin: 1,
                animation: null,
                facing: 0
            };
            // socket.emit is used to trigger the designated function to all connection
            // we can send parameter(the value that getAllPlayers() return) along with message
            socket.emit('playerId', socket.player.id);
            socket.emit('allplayers', getAllPlayers());
            socket.emit('allEnemies', server.enemies);
            
            // socket.broadcast.emit is used to trigger the designated function to all connection except itself
            socket.broadcast.emit('newplayer', socket.player);
        }

        // Todo 4 : Add server's eventlistener 
        // 1. Add server's eventlistener to message "click" and deal with parameters => socket.on('click', function(data) {...});
        // 2. Set socket.player.x equals to data.x and socket.player.y equals to data.y
        // 3. Use io.emit() send message 'move' to all the connection client
        // 4. Just like what socket.emit() do, send parameter (socket.player) along with message

        socket.on('movePlayer', function(data) {
            socket.player.x = data.x;
            socket.player.y = data.y;
            socket.player.animation = data.animation;
            socket.player.facing = data.facing;
            socket.broadcast.emit('updatePlayer', socket.player);
        });

        socket.on('disconnect', function() {
            server.alive[socket.player.id] = false;
            io.emit('removePlayer', socket.player.id);
            if(server.firstSocketID == socket.id) {
                if(Object.keys(io.sockets.connected)[0])
                    setFirstSocket(Object.keys(io.sockets.connected)[0]);
                else firstSocketID = 0;
            }
        });
    
        socket.on('sword', function(weapon) {
            socket.broadcast.emit('showSword', socket.player, weapon);
        });

        socket.on('arrow', function() {
            socket.broadcast.emit('createArrow', socket.player);
        });

        socket.on('moveEnemy', function(data) {
            //console.log(data);
            var targetEnemy = server.enemies[data.id]; //use as reference??
            targetEnemy.x = data.x;
            targetEnemy.y = data.y;
            targetEnemy.blood = data.blood;
            targetEnemy.animation = data.animation;
            targetEnemy.frame = data.frame;
            socket.broadcast.emit('updateEnemy', data);
        });

        socket.on('killEnemy', function(id) {
            server.enemies[id].isAlive = false;
            socket.broadcast.emit('removeEnemy', id);
        });

        socket.on('killBullet', function(id) {
            console.log(id, server.bullets);
            server.bullets[id].isAlive = false;
            socket.broadcast.emit('removeBullet', id);
        });
    });

    socket.on('test', function() {
        console.log('test received');
    });
});

// Get all the players which are already in the game
// in order to let new player can update old players data
function getAllPlayers() {
    var players = [];
    Object.keys(io.sockets.connected).forEach(function(socketID) {
        var player = io.sockets.connected[socketID].player;
        if (player) players[player.id] = player;
    });
    return players;
}

function setFirstSocket(id) {
    server.firstSocketID = id;
    var firstSocket = io.sockets.connected[id];
    Object.keys(io.sockets.connected).forEach(function(socketID) {
        io.sockets.connected[socketID].emit('firstSocket', {id1: id, id2: socketID});
    });
    console.log("firstSocket", id);
    // Add eventListener
    firstSocket.on('generateEnemy', function(data) {
        server.enemies[data.id] = {
            id: data.id,
            x: data.x,
            y: data.y,
            type: data.type,
            blood: data.blood, 
            animation: null,
            frame: 0,
            isAlive: true
        };
        io.emit('addEnemy', server.enemies[data.id]);
    });

    firstSocket.on('generateBullet', function(data) {
        var lastBulletID;
        // Find first dead
        for(lastBulletID=0; lastBulletID<server.bullets.length; lastBulletID++) {
            if(server.bullets[lastBulletID].isAlive == false) break;
        }
        //console.log("bullet", lastBulletID);
        if(lastBulletID < 100) {
            server.bullets[lastBulletID] = {
                id: lastBulletID,
                x: data.x,
                y: data.y,
                type: data.type,
                velocityX: data.velocityX,
                velocityY: data.velocityY, 
                isAlive: true
            };
            io.emit('addBullet', server.bullets[lastBulletID]);
            console.log("bullet", lastBulletID);
        }
    });

    firstSocket.on('outOfBoundsKillBullet', function(id) {
        server.bullets[id].isAlive = false;
        firstSocket.broadcast.emit('removeBullet', id);
    });
}

function randomInt(low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}