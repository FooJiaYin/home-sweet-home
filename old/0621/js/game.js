// Initialize Phaser 
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'canvas'); 

// Define our global variable 
game.global = { furn: [], score: 0, level: 1, name: "", hp: 20, weapon:"sword_w", attack: 1}; 
// Add all the states 
game.state.add('boot', bootState); 
game.state.add('load', loadState); 
game.state.add('map', mapState);
game.state.add('home', homeState);
game.state.add('field', fieldState); 
// Start the 'boot' state 
//game.state.start('boot');

game.global.furn = [{type:"table",x:80,y:500},{type:"chair",x:230,y:550},{type:"table",x:430,y:500}];
var craft_tb = [
  {name:"table",src:["wood3",1]},
  {name:"chair",src:["wood2",2]},
];


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
      s.innerHTML = Number(s.innerHTML)+craft_tb[a].src[2*i+1];
    }
  }
}
function heal(a) {
  var x = document.getElementById(a);
  if(Number(x.innerHTML)>0&&game.global.hp<20){
    x.innerHTML = Number(x.innerHTML)-1;
    if (a=="meat") game.global.hp = game.global.hp + 1;
    else game.global.hp = 20;
    saveState();
  }
}
function closeStore() {
  var bag = document.getElementById("bag");
  bag.style.display = "none"; 
  bag.style.left = "calc(50% - 100px)";
  var store = document.getElementById("store");
  store.style.display = "none"; 
  var x = document.getElementsByClassName("sale");
  var i;
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";
  }
  saveState();
}
function buy(a) {
  var x = document.getElementById(a);
  x.style.display = "block"; 
}
function use(a) {
  document.getElementById(a).disabled=true;
  document.getElementById(game.global.weapon).disabled=false;
  game.global.weapon = a;
}