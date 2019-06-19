var userId = '';

firebase.auth().onAuthStateChanged(async function (user) {
    var menu = document.getElementById('dynamic-menu');
    // Check user login
    if (user) {
        user_email = user.email;
        userId = user.uid;
    }
});

initValues = function(userId) {
    firebase.database().ref('profile/' + userId + '/avatar').set({
        lv: 1,
        hp: 20
    });
    firebase.database().ref('profile/' + userId + '/home/storage').set({
        tableNo: 3,
        chairNo: 2
    });
    firebase.database().ref('profile/' + userId + '/bag').set({
        wood1No: 0,
        wood2No: 0,
        wood3No: 0,
        stoneNo: 0,
        boneNo : 0 
    });
}

loadValues = async function() {
    var user = await firebase.auth().currentUser;
    //if(!user) window.location.href = "signin.html";
    userId = user.uid;
    console.log("hi", userId);
    firebase.database().ref('profile/' + userId + '/avatar').once('value', function(snapshot) {
        document.getElementById('lv').innerHTML = snapshot.val().lv;
        document.getElementById('hp').innerHTML = snapshot.val().hp;
        console.log(document.getElementById('hp').innerHTML);
    });
    firebase.database().ref('profile/' + userId + '/bag').once('value', function(snapshot) {
        document.getElementById('wood' ).innerHTML = snapshot.val().wood1No;
        document.getElementById('wood2').innerHTML = snapshot.val().wood2No;
        document.getElementById('wood3').innerHTML = snapshot.val().wood3No;
        document.getElementById('stone').innerHTML = snapshot.val().stoneNo;
        document.getElementById('bone').innerHTML = snapshot.val().boneNo ;
    });
    firebase.database().ref('profile/' + userId + '/home/storage').once('value', function(snapshot) {
        document.getElementById('table').innerHTML = snapshot.val().tableNo;
        document.getElementById('chair').innerHTML = snapshot.val().chairNo;
    });
    //firebase.database().ref('profile/' + userId + '/home/furniture').once('value', function(snapshot));
}

saveState = async function() {
    var lv = document.getElementById('lv').innerHTML;
    var hp = document.getElementById('hp').innerHTML;
    var wood1No = Number(document.getElementById('wood').innerHTML);
    var wood2No = Number(document.getElementById('wood2').innerHTML);
    var wood3No = Number(document.getElementById('wood3').innerHTML);
    var stoneNo = Number(document.getElementById('stone').innerHTML);
    var boneNo  = Number(document.getElementById('bone' ).innerHTML);
    var tableNo = Number(document.getElementById('table').innerHTML);
    var chairNo = Number(document.getElementById('chair').innerHTML);
    console.log("state saved.", hp);
    firebase.database().ref('profile/' + userId + '/avatar').set({
        lv: lv,
        hp: hp
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
        boneNo : boneNo 
    });
}