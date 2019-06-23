// Initialize Phaser 
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'canvas'); 

// Define our global variable 
game.global = { furn: [], carpetColor: 0, hp: 20, weapon: 1, attack: 1, cloth: 1, maxhp: 20, weed: 0, attup: 0, speup: 1}; 
// Add all the states 
game.state.add('boot', bootState); 
game.state.add('load', loadState); 
game.state.add('map', mapState);
game.state.add('home', homeState);
game.state.add('field', fieldState); 
// Start the 'boot' state 
//game.state.start('boot');

game.global.furn = [{type:"table",x:327,y:450},{type:"seat",x:300,y:500}];
var craft_tb = [
  {name:"potiona",src:["ice2",1,"iron",2,"weed",3]},
  {name:"potions",src:["ice2",1,"shell",2,"cater",3]},
  {name:"potionh",src:["cater2",1,"skull",2,"ice2",3,"weed",4]},
  {name:"strroast",src:["cater",2,"coal2",1]},
  {name:"roast",src:["flesh2",1,"coal2",2]},

  {name:"table",src:["wood2",2]},
  {name:"table1",src:["iron2",2]},
  {name:"seat",src:["cotton",6]},
  {name:"seat1",src:["shell2",2]},
  {name:"closet",src:["wood2",2,"shell",2]},
  {name:"closet1",src:["stone2",2,"skull",2]},
  {name:"bookshelf",src:["wood2",4]},
  {name:"bookshelf1",src:["stone2",4]},
  {name:"bed",src:["wood",6,"cotton2",2]},
  {name:"bed1",src:["skull",6,"cotton2",2]},
  {name:"light",src:["iron2",2,"ice",4]},
  {name:"flower",src:["wood",4,"coal",2]},
  {name:"flower1",src:["wood",4,"iron",2]},
  {name:"flower2",src:["wood",4,"ice",2]}
];
var items_tb = ["potiona","potions","potionh","strroast","roast","weed",
  "wood","stone","cotton","coal","iron","ice","flesh","cater","shell","skull",
  "wood2","stone2","cotton2","coal2","iron2","ice2","flesh2","cater2","shell2"
];

var clr = 0;
var money = 0;

function setUpPlayer() {
  var w = document.getElementById("weapon");
  var c = document.getElementById("cloth");
  if(game.global.weapon==1){
    w.innerHTML = "木劍";
    game.global.attack = 1;
  }else if(game.global.weapon==2){
    w.innerHTML = "鐵劍";
    game.global.attack = 2;
  }else if(game.global.weapon==3){
    w.innerHTML = "鑽劍";
    game.global.attack = 3;
  }
  if(game.global.cloth==1){
    c.innerHTML = "皮革上衣";
    game.global.maxhp = 20;
  }else if(game.global.cloth==2){
    c.innerHTML = "鐵製護甲";
    game.global.maxhp = 25;
  }else if(game.global.cloth==3){
    c.innerHTML = "鑽石鎧甲";
    game.global.maxhp = 30;
  }
};

function carpet() {
  game.global.carpetColor = (game.global.carpetColor+1)%4;
  game.carpet.frame = game.global.carpetColor;
}

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
    i.anchor.setTo(0, 1);
    i.inputEnabled = true;
    i.input.enableDrag();
    i.events.onDragStop.add(onDragStop, this);
  }
}
function craft(a) {
  var x = document.getElementById(craft_tb[a].name);
  var l = craft_tb[a].src.length;
  var valid = 1;
  var i;
  for(i=0;i<l/2;i++){
    var s = document.getElementById(craft_tb[a].src[2*i]);
    if(Number(s.innerHTML)-craft_tb[a].src[2*i+1]<0){
      valid = 0;
      break;
    }
  }
  if(valid){
    var x = document.getElementById(craft_tb[a].name);
    x.innerHTML = Number(x.innerHTML)+1;
    for(i=0;i<l/2;i++){
      var s = document.getElementById(craft_tb[a].src[2*i]);
      s.innerHTML = Number(s.innerHTML)-craft_tb[a].src[2*i+1];
    }    
    game.homeBgm.pause();
    game.time.events.add(2000, function() {game.homeBgm.resume();}, this);
    game.craftsound.play();
  }
}
function separ(a) {
  var x = document.getElementById(craft_tb[a].name);
  if(Number(x.innerHTML)>0){
    x.innerHTML = Number(x.innerHTML)-1;
    var l = craft_tb[a].src.length;
    var i;
    for(i=0;i<l/2;i++){
      var s = document.getElementById(craft_tb[a].src[2*i]);
      s.innerHTML = Number(s.innerHTML)+craft_tb[a].src[2*i+1]/2;
    }
  }
}
function onDragStop(item, pointer) {
  if (700 < pointer.x && pointer.x < 780 && pointer.x > 100 && pointer.y < 180){
    var x = document.getElementById(item.type);
    x.innerHTML = Number(x.innerHTML)+1;
    item.kill();
  }
}
function heal(a,b) {
  var x = document.getElementById(a);
  if(Number(x.innerHTML)>0){
    x.innerHTML = Number(x.innerHTML)-1;
    if(a=="weed"){
      game.fieldBgm.pause();
      game.time.events.add(24500, function() {game.fieldBgm.resume();}, this);
      game.weedBgm.play();
      document.getElementById(a+"_btn").disabled=true;
      game.global.weed = 1;
      closeBag();
      window.setTimeout(function(){
        game.global.weed = 0;
        document.getElementById(a+"_btn").disabled=false;
      },24500);
    }
    if (game.global.hp+b < game.global.maxhp) game.global.hp = game.global.hp + b;
    else game.global.hp = game.global.maxhp;
  }
}
function use(a) {
  if(a==0){
    var x = document.getElementById("potiona");
    x.innerHTML = Number(x.innerHTML)-1;
    game.global.attup = 1;
    window.setTimeout(function(){game.global.attup = 0;},10000);
  }else if(a==1){
    var x = document.getElementById("potions");
    x.innerHTML = Number(x.innerHTML)-1;
    game.global.speup = 2;
    window.setTimeout(function(){game.global.speup = 1;},10000);
  }else if(a==2){
    var x = document.getElementById("potionh");
    x.innerHTML = Number(x.innerHTML)-1;
    game.global.hp = game.global.maxhp;
  } 
}
function closeBag() {
  document.getElementById("bag").style.display = "none";
}
function closeStore() {
  money = 0;
  var bag = document.getElementById("bag");
  bag.style.display = "none"; 
  bag.style.left = "";
  var store = document.getElementById("store");
  store.style.display = "none"; 
  var x = document.getElementsByClassName("sale");
  var i;
  for (i = 0; i < x.length; i++) {
    x[i].innerHTML = -0;
    x[i].style.display = "none";
  }
  var x = document.getElementsByClassName("btn");
  var y = document.getElementsByClassName("sale_btn");
  var z = document.getElementsByClassName("buy_btn");
  var i,j,k;
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "inline";
  }
  for (j = 0; j < y.length; j++) {
    y[j].style.display = "none";
  }
  for (k = 0; k < z.length; k++) {
    z[k].disabled = true;
  }
  saveState();
}
function buy(a) {
  money = 0;
  var w = document.getElementById("weapon");
  var c = document.getElementById("cloth");
  if(a=='weapon2'){
    w.innerHTML = "鐵劍";
    game.global.weapon = 2;
    game.global.attack = 4;
  }else if(a=='weapon3'){
    w.innerHTML = "鑽劍";
    game.global.weapon = 3;
    game.global.attack = 8;
  }else if(a=='cloth2'){
    c.innerHTML = "鐵製護甲";
    game.global.cloth = 2;
    game.global.maxhp = 30;
  }else if(a=='cloth3'){
    c.innerHTML = "鑽石鎧甲";
    game.global.cloth = 3;
    game.global.maxhp = 40;
  }
  var i;
  for(i=0;i<items_tb.length;i++){
    var x = document.getElementById(items_tb[i]);
    var y = document.getElementById(items_tb[i]+"s");
    x.innerHTML = Number(x.innerHTML)+Number(y.innerHTML);
    y.innerHTML = 0;
  }
  var z = document.getElementsByClassName("buy_btn");
  var k;
  for (k = 0; k < z.length; k++) {
    z[k].disabled = true;
  }
  game.fieldBgm.pause();
  game.time.events.add(2000, function() {game.fieldBgm.resume();}, this);
  game.buysound.play();
  saveState();
  closeStore();
}
function sale(a,b) {
  var x = document.getElementById(a);
  var y = document.getElementById(a+"s");
  if(Number(x.innerHTML)+Number(y.innerHTML)>0){
    y.innerHTML = Number(y.innerHTML) - 1;
    money = money + b;
    if(game.global.weapon<2&&money>=25) document.getElementById("weapon2").disabled=false;
    if(game.global.weapon<3&&money>=(60-game.global.weapon*10)) document.getElementById("weapon3").disabled=false;
    if(game.global.cloth<2&&money>=20) document.getElementById("cloth2").disabled=false;
    if(game.global.cloth<3&&money>=(50-game.global.cloth*10)) document.getElementById("cloth3").disabled=false;
  }
}
function notsale(a,b) {
  var x = document.getElementById(a+"s");
  if(Number(x.innerHTML)<0){
    x.innerHTML = Number(x.innerHTML) + 1;
    money = money - b;
    if(game.global.weapon>1||money<25) document.getElementById("weapon2").disabled=true;
    if(game.global.weapon>2||money<(60-game.global.weapon*5)) document.getElementById("weapon3").disabled=true;
    if(game.global.cloth>1||money<20) document.getElementById("cloth2").disabled=true;
    if(game.global.cloth>2||money<(50-game.global.cloth*5)) document.getElementById("cloth3").disabled=true;
  }
  console.log(money);
}