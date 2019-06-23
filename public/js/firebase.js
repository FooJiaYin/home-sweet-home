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
        weapon: 1,
        cloth: 1,
        weed: 0,
        attup: 0,
        speup: 1
    });
    firebase.database().ref('profile/' + userId + '/home/storage').set({
        tableNo: 1,
        table1No: 1,
        seatNo: 1,
        closetNo: 1,
        closet1No: 1,
        bookshelfNo: 1,
        bookshelf1No: 1,
        bedNo: 1,
        bed1No: 1,
        lightNo: 1,
        flowerNo: 1,
        flower1No: 1,
        flower2No: 1,
    });
    firebase.database().ref('profile/' + userId + '/home/carpetColor').set(0);
    firebase.database().ref('profile/' + userId + '/bag').set({
        potionaNo: 5,
        potionsNo: 5,
        potionhNo: 5,
        strroastNo: 0,
        roastNo: 0,
        weedNo: 5,
        woodNo: 0,
        wood2No: 0,
        stoneNo: 5,
        stone2No: 0,
        cottonNo: 5,
        cotton2No: 0,
        coalNo: 5,
        coal2No: 0,
        ironNo: 5,
        iron2No: 0,
        iceNo: 5,
        ice2No: 0,
        fleshNo: 5,
        flesh2No: 0,
        caterNo: 5,
        cater2No: 0,
        shellNo: 5,
        shell2No: 0,
        skullNo: 5
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
        game.global.cloth = snapshot.val().cloth;
        game.global.weed = snapshot.val().weed;
        game.global.attup = snapshot.val().attup;
        game.global.speup = snapshot.val().speup;
    });
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
    });
    firebase.database().ref('profile/' + userId + '/bag').once('value', function(snapshot) {
        document.getElementById('potiona').innerHTML = snapshot.val().potionaNo;
        document.getElementById('potions').innerHTML = snapshot.val().potionsNo;
        document.getElementById('potionh').innerHTML = snapshot.val().potionhNo;
        document.getElementById('strroast').innerHTML = snapshot.val().strroastNo;
        document.getElementById('roast').innerHTML = snapshot.val().roastNo;
        document.getElementById('weed').innerHTML = snapshot.val().weedNo;
        document.getElementById('wood').innerHTML = snapshot.val().woodNo;
        document.getElementById('wood2').innerHTML = snapshot.val().wood2No;
        document.getElementById('stone').innerHTML = snapshot.val().stoneNo;
        document.getElementById('stone2').innerHTML = snapshot.val().stone2No;
        document.getElementById('cotton').innerHTML = snapshot.val().cottonNo;
        document.getElementById('cotton2').innerHTML = snapshot.val().cotton2No;
        document.getElementById('coal').innerHTML = snapshot.val().coalNo;
        document.getElementById('coal2').innerHTML = snapshot.val().coal2No;
        document.getElementById('iron').innerHTML = snapshot.val().ironNo;
        document.getElementById('iron2').innerHTML = snapshot.val().iron2No;
        document.getElementById('ice').innerHTML = snapshot.val().iceNo;
        document.getElementById('ice2').innerHTML = snapshot.val().ice2No;
        document.getElementById('flesh').innerHTML = snapshot.val().fleshNo;
        document.getElementById('flesh2').innerHTML = snapshot.val().flesh2No;
        document.getElementById('cater').innerHTML = snapshot.val().caterNo;
        document.getElementById('cater2').innerHTML = snapshot.val().cater2No;
        document.getElementById('shell').innerHTML = snapshot.val().shellNo;
        document.getElementById('shell2').innerHTML = snapshot.val().shell2No;
        document.getElementById('skull').innerHTML = snapshot.val().skullNo;
    });
    firebase.database().ref('profile/' + userId + '/home/storage').once('value', function(snapshot) {
        document.getElementById('table').innerHTML = snapshot.val().tableNo;
        document.getElementById('table1').innerHTML = snapshot.val().table1No;
        document.getElementById('seat').innerHTML = snapshot.val().seatNo;
        document.getElementById('closet').innerHTML = snapshot.val().closetNo;
        document.getElementById('closet1').innerHTML = snapshot.val().closet1No;
        document.getElementById('bookshelf').innerHTML = snapshot.val().bookshelfNo;
        document.getElementById('bookshelf1').innerHTML = snapshot.val().bookshelf1No;
        document.getElementById('bed').innerHTML = snapshot.val().bedNo;
        document.getElementById('bed1').innerHTML = snapshot.val().bed1No;
        document.getElementById('light').innerHTML = snapshot.val().lightNo;
        document.getElementById('flower').innerHTML = snapshot.val().flowerNo;
        document.getElementById('flower1').innerHTML = snapshot.val().flower1No;        
        document.getElementById('flower2').innerHTML = snapshot.val().flower2No;
    });
    firebase.database().ref('profile/' + userId + '/home/carpetColor').once('value', function(snapshot) {
        game.global.carpetColor = snapshot.val();
    });
}

saveState = async function() {
    var hp = game.global.hp;
    var weapon = game.global.weapon;
    var cloth = game.global.cloth;
    var weed = game.global.weed;
    var attup = game.global.attup;
    var speup = game.global.speup;
    var carpetColor = game.global.carpetColor;
    var potionaNo = Number(document.getElementById('potiona').innerHTML);
    var potionsNo = Number(document.getElementById('potions').innerHTML);
    var potionhNo = Number(document.getElementById('potionh').innerHTML);
    var strroastNo = Number(document.getElementById('strroast').innerHTML);
    var roastNo = Number(document.getElementById('roast').innerHTML);
    var weedNo = Number(document.getElementById('weed').innerHTML);
    var woodNo = Number(document.getElementById('wood').innerHTML);
    var wood2No = Number(document.getElementById('wood2').innerHTML);
    var stoneNo = Number(document.getElementById('stone').innerHTML);
    var stone2No = Number(document.getElementById('stone2').innerHTML);
    var cottonNo = Number(document.getElementById('cotton').innerHTML);
    var cotton2No = Number(document.getElementById('cotton2').innerHTML);
    var coalNo = Number(document.getElementById('coal').innerHTML);
    var coal2No = Number(document.getElementById('coal2').innerHTML);
    var ironNo = Number(document.getElementById('iron').innerHTML);
    var iron2No = Number(document.getElementById('iron2').innerHTML);
    var iceNo = Number(document.getElementById('ice').innerHTML);
    var ice2No = Number(document.getElementById('ice2').innerHTML);
    var fleshNo = Number(document.getElementById('flesh').innerHTML);
    var flesh2No = Number(document.getElementById('flesh2').innerHTML);
    var caterNo = Number(document.getElementById('cater').innerHTML);
    var cater2No = Number(document.getElementById('cater2').innerHTML);
    var shellNo = Number(document.getElementById('shell').innerHTML);
    var shell2No = Number(document.getElementById('shell2').innerHTML);
    var skullNo = Number(document.getElementById('skull').innerHTML);
    var tableNo = Number(document.getElementById('table').innerHTML);
    var table1No = Number(document.getElementById('table1').innerHTML);
    var seatNo = Number(document.getElementById('seat').innerHTML);
    var closetNo = Number(document.getElementById('closet').innerHTML);
    var closet1No = Number(document.getElementById('closet1').innerHTML);
    var bookshelfNo = Number(document.getElementById('bookshelf').innerHTML);
    var bookshelf1No = Number(document.getElementById('bookshelf1').innerHTML);
    var bedNo = Number(document.getElementById('bed').innerHTML);
    var bed1No = Number(document.getElementById('bed1').innerHTML);
    var lightNo = Number(document.getElementById('light').innerHTML);
    var flowerNo = Number(document.getElementById('flower').innerHTML);
    var flower1No = Number(document.getElementById('flower1').innerHTML);
    var flower2No = Number(document.getElementById('flower2').innerHTML);
    console.log("state saved.", hp);
    firebase.database().ref('profile/' + userId + '/avatar').set({
        hp: hp,
        weapon: weapon,
        cloth: cloth,
        weed: weed,
        attup: attup,
        speup: speup
    });
    console.log("furn", game.global.furn);
    await firebase.database().ref('profile/' + userId + '/home/furniture').set(game.global.furn);
    firebase.database().ref('profile/' + userId + '/home/storage').set({
        tableNo: tableNo,
        table1No: table1No,
        seatNo: seatNo,
        closetNo: closetNo,
        closet1No: closet1No,
        bookshelfNo: bookshelfNo,
        bookshelf1No: bookshelf1No,
        bedNo: bedNo,
        bed1No: bed1No,
        lightNo: lightNo,
        flowerNo: flowerNo,
        flower1No: flower1No,
        flower2No: flower2No
    });
    firebase.database().ref('profile/' + userId + '/home/carpetColor').set(game.global.carpetColor);
    firebase.database().ref('profile/' + userId + '/bag').set({
        potionaNo: potionaNo,
        potionsNo: potionsNo,
        potionhNo: potionhNo,
        strroastNo: strroastNo,
        roastNo: roastNo,
        weedNo: weedNo,
        woodNo: woodNo,
        wood2No: wood2No,
        stoneNo: stoneNo,
        stone2No: stone2No,
        cottonNo: cottonNo,
        cotton2No: cotton2No,
        coalNo: coalNo,
        coal2No: coal2No,
        ironNo: ironNo,
        iron2No: iron2No,
        iceNo: iceNo,
        ice2No: ice2No,
        fleshNo: fleshNo,
        flesh2No: flesh2No,
        caterNo: caterNo,
        cater2No: cater2No,
        shellNo: shellNo,
        shell2No: shell2No,
        skullNo: skullNo
    });
}