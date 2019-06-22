var userId = '';

firebase.auth().onAuthStateChanged(async function (user) {
    var menu = document.getElementById('dynamic-menu');
    // Check user login
    if (user) {
        user_email = user.email;
        userId = user.uid;
    }
});

initValues = async function() {
    var userId = await firebase.auth().currentUser.uid;
    firebase.database().ref('profile/' + userId + '/avatar').set({
        hp: 20,
        weapon: "sword_w",
    });
    firebase.database().ref('profile/' + userId + '/home/storage').set({
        tableNo: 3,
        chairNo: 2
    });
    firebase.database().ref('profile/' + userId + '/bag').set({
        meatNo: 10,
        potionNo: 10,
        wood1No: 0,
        wood2No: 0,
        wood3No: 0,
        stoneNo: 0,
        stone2No: 0,
        stone3No: 0,
        boneNo: 0, 
        bone2No: 0, 
        bone3No: 0 
    });
    firebase.database().ref('profile/' + userId + '/bag/weapon').set({
        sword_w: true,
        sword_i: true,
        sword_d: true,
    });
}

loadValues = async function() {
    var user = await firebase.auth().currentUser;
    //if(!user) window.location.href = "signin.html";
    userId = user.uid;
    console.log("hi", userId);
    firebase.database().ref('profile/' + userId + '/avatar').once('value', function(snapshot) {
        game.global.hp = snapshot.val().hp;
        game.global.weapon = snapshot.val().weapon;
    });
    firebase.database().ref('profile/' + userId + '/bag').once('value', function(snapshot) {
        document.getElementById('wood' ).innerHTML = snapshot.val().wood1No;
        document.getElementById('wood2').innerHTML = snapshot.val().wood2No;
        document.getElementById('wood3').innerHTML = snapshot.val().wood3No;
        document.getElementById('stone').innerHTML = snapshot.val().stoneNo;
        document.getElementById('stone2').innerHTML = snapshot.val().stone2No;
        document.getElementById('stone3').innerHTML = snapshot.val().stone3No;
        document.getElementById('bone').innerHTML = snapshot.val().boneNo ;
        document.getElementById('bone2').innerHTML = snapshot.val().bone2No ;
        document.getElementById('bone3').innerHTML = snapshot.val().bone3No ;
    });
    firebase.database().ref('profile/' + userId + '/home/storage').once('value', function(snapshot) {
        document.getElementById('table').innerHTML = snapshot.val().tableNo;
        document.getElementById('chair').innerHTML = snapshot.val().chairNo;
    });
    //firebase.database().ref('profile/' + userId + '/home/furniture').once('value', function(snapshot));
}

saveState = async function() {
    var hp = game.global.hp;
    var weapon = game.global.weapon;
    var wood1No = Number(document.getElementById('wood').innerHTML);
    var wood2No = Number(document.getElementById('wood2').innerHTML);
    var wood3No = Number(document.getElementById('wood3').innerHTML);
    var stoneNo = Number(document.getElementById('stone').innerHTML);
    var stone2No = Number(document.getElementById('stone2').innerHTML);
    var stone3No = Number(document.getElementById('stone3').innerHTML);
    var boneNo  = Number(document.getElementById('bone' ).innerHTML);
    var bone2No  = Number(document.getElementById('bone2' ).innerHTML);
    var bone3No  = Number(document.getElementById('bone3' ).innerHTML);
    var tableNo = Number(document.getElementById('table').innerHTML);
    var chairNo = Number(document.getElementById('chair').innerHTML);
    console.log("state saved.", hp);
    firebase.database().ref('profile/' + userId + '/avatar').set({
        hp: hp,
        weapon: weapon
    });
    console.log("furn", game.global.furn);
    await firebase.database().ref('profile/' + userId + '/home/furniture').set(game.global.furn);
    firebase.database().ref('profile/' + userId + '/home/storage').set({
        tableNo: tableNo,
        chairNo: chairNo
    });
    firebase.database().ref('profile/' + userId + '/bag').set({
        wood1No: wood1No,
        wood2No: wood2No,
        wood3No: wood3No,
        stoneNo: stoneNo,
        stone2No: stone2No,
        stone3No: stone3No,
        boneNo : boneNo,
        bone2No : bone2No,
        bone3No : bone3No 
    });
}