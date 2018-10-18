//var Exitar=Exitar || {};

var game=new Phaser.Game(800,600,Phaser.AUTO, ' ');
game.state.add('Boot',Boot);
game.state.add('Preload',Preload);
game.state.add('MainMenu',MainMenu);
game.state.add('Level1',Level1);
game.state.add('Level2',Level2);
game.state.add('Level3',Level3);
game.state.add('levels',levels);
game.state.add('help',help);
game.state.add('about',about);

this.state_direction=true;
this.jumpButton;
this.left;
this.right;
this.jumpCount=0;
this.menuSong;
this.train;
this.player;
this.columns=2;
this.rows=2;
this.thumbheight=100;
this.thumbWidth=100;
this.spacing=20;
this.menuSong;
this.moving=false;
this.right=false;
this.left=false;
this.muteSong=false;
this.clicked=0
this.doneAlready=false
this.playerDead=false
this.collectedCoins
this.pressed=false
this.broke=null
this.state_isDown=false
this.gameOver
this.retrybutton
this.retrybtn
this.menubtn
 this.menubutton 
this.nextLevelbtn
 this.nextlevelbutton
game.state.start('Boot');



