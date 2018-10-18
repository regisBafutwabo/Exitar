var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
    preload: preload,
    create: create,
    update: update,
    preloader: preload

});

var player;
var ledgesLayer;
var layer;
var jumpButton;
var groundLayer;
var bgLayer;
var stairsLayer;
var garbage;
var left;
var right;
var level1;
var state_direction=true;


function preload() {
    game.load.image('preloader', 'assets/loader.png');
    game.load.tilemap('level1', 'maps/level1.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('name', 'assets/name.png');
    game.load.image('play_NP', 'assets/play_NP.png');
    game.load.image('help_NP', 'assets/help_NP.png');
    game.load.image('levels_NP', 'assets/levelsNP.png');
    game.load.image('about_NP', 'assets/about_NP.png');
    //game.load.image('bg', 'assets/Background_Lab.png');
    game.load.image('bg', 'assets/subway.png');
    game.load.image('stairs','assets/new6.png');
    game.load.image('platform','assets/new6.png');
    game.load.image('trash','assets/garbage.png');
    game.load.spritesheet('exitar', 'assets/Exitar.png', 100, 100);

}

function create() {
    game.stage.backgroundColor = "#ffffff";
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.scale.refresh();
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.gravity.y = 500;
    
    
    level1=game.add.tilemap('level1');
    level1.addTilesetImage('bg','bg');
    level1.addTilesetImage('platform','platform');
    level1.addTilesetImage('stairs','platform');
    level1.addTilesetImage('trash','trash');
    
    bgLayer=level1.createLayer('bg');
    groundLayer=level1.createLayer('platform');
    stairsLayer=level1.createLayer('stairs');
    garbage=level1.createLayer('trash');
    
    level1.setCollisionBetween(1, 2000, true, groundLayer);
    level1.setCollisionBetween(1, 2000, true, stairsLayer);
    level1.setCollisionBetween(1, 2000, true, garbage);
    level1.alpha=0;
    
    stairsLayer.resizeWorld();
    groundLayer.resizeWorld(); 
    garbage.resizeWorld(); 
    

    player = game.add.sprite(10, 10, 'exitar');
    game.physics.arcade.enable(player, Phaser.Physics.ARCADE);
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;
    player.anchor.setTo(0, 0);
    player.alpha=0;
    game.camera.follow(player);

    player.animations.add('right', [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25], 10, true);
    player.animations.add('left', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12], 10, true);
    player.animations.add('jump_left', [26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36], 10, true);
    player.animations.add('jump_right', [37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47], 10, true);
    player.animations.add('win',[48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65],17,false);
    player.animations.add('still',[48,49],2,true); 



    play = game.add.sprite(game.world.centerX, game.world.centerY - 90, 'play_NP');
    play.anchor.setTo(0.5, 0.5);
    play.inputEnabled = true;
    play.events.onInputDown.add(level1, this);

    levels = game.add.sprite(game.world.centerX, game.world.centerY - 10, 'levels_NP');
    levels.anchor.setTo(0.5, 0.5);
    //levels.inputEnabled=true;
    //levels.events.onInputDown.add(levels,this);
    

    help = game.add.sprite(game.world.centerX, game.world.centerY + 90, 'help_NP');
    help.anchor.setTo(0.5, 0.5);
    //help.inputEnabled=true;
    //help.events.onInputDown.add(help,this);

    about = game.add.sprite(game.world.centerX, game.world.centerY + 192, 'about_NP');
    about.anchor.setTo(0.5, 0.5);
    //about.inputEnabled=true;
    //about.events.onInputDown.add(about,this);


    cursors = game.input.keyboard.createCursorKeys();
    jumpButton=game.input.keyboard.addKey(Phaser.Keyboard.W);
    left=game.input.keyboard.addKey(Phaser.Keyboard.A);
    right=game.input.keyboard.addKey(Phaser.Keyboard.D);
}

function update() {
    
    game.physics.arcade.collide(player, stairsLayer);
    game.physics.arcade.collide(player, groundLayer);
    game.physics.arcade.collide(garbage, groundLayer);
    game.physics.arcade.collide(player, garbage);
    player.body.velocity.x=0;
    player.animations.play('still');
        if(left.isDown)
            {
                player.body.velocity.x = -350;
                player.animations.play('left');
            }
        else if(left.isDown && player.body.blocked.down && jumpButton.isDown)
            {
               jumpLeft();
            }

        else if(right.isDown)
            {
                player.body.velocity.x = 350;
                player.animations.play('right');
            }
         else if(right.isDown && player.body.blocked.down && jumpButton.isDown)
            {
                jumpRight();
            }

        else if(jumpButton.isDown && player.body.blocked.down)
            {
                player.body.velocity.y=-800;
                player.animations.play('left');
            }
        else{
            player.animations.play('still');
            player.body.velocity.x=0;
        }
    
}

function time() {
    state_direction = true;
    player.alpha = 1;
}

function jumpLeft() {
    state_direction = false;

    player.body.velocity.y = -800;
    player.body.velocity.x = -300
    game.time.events.add(1900, time, this);
    player.animations.play('jump_left');
}

function jumpRight() {
    state_direction = false;

    player.body.velocity.y = -800;
    player.body.velocity.x = 300
    game.time.events.add(1900, time, this);

    player.animations.play('jump_right');
}

function left() {
    player.body.velocity.x = -350;
    player.animations.play('left');
}

function right() {
    player.body.velocity.x = 350;
    player.animations.play('right');
}

function level1() {
    play.kill();
    help.kill();
    about.kill();
    levels.kill();
    player.kill();


    level1=game.add.tilemap('level1');
    level1.addTilesetImage('bg','bg');
    level1.addTilesetImage('platform','platform');
    level1.addTilesetImage('stairs','platform');
    level1.addTilesetImage('trash','trash');
    
    bgLayer=level1.createLayer('bg');
    groundLayer=level1.createLayer('platform');
    stairsLayer=level1.createLayer('stairs');
    garbage=level1.createLayer('trash');
    
    level1.setCollisionBetween(1, 2000, true, groundLayer);
    level1.setCollisionBetween(1, 10000, true, stairsLayer);
    level1.setCollisionBetween(1, 2000, true, garbage);
    
    stairsLayer.resizeWorld();
    groundLayer.resizeWorld(); 
    garbage.resizeWorld();  
    
    player = game.add.sprite(10, 10, 'exitar');
    game.physics.arcade.enable(player, Phaser.Physics.ARCADE);
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;
    player.anchor.setTo(0, 0);
    game.camera.follow(player);

    player.animations.add('right', [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25], 10, true);
    player.animations.add('left', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12], 10, true);
    player.animations.add('jump_left', [26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36], 10, true);
    player.animations.add('jump_right', [37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47], 10, true);
    player.animations.add('win',[48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65],17,false);
    player.animations.add('still',[48,49],2,true);  

}

function level2() {
    play.kill();
    help.kill();
    about.kill();
    levels.kill();
    player.kill();


    game.add.sprite(0, 0, 'bg');
    player = game.add.sprite(10, 10, 'exitar');
    game.physics.arcade.enable(player, Phaser.Physics.ARCADE);
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;
    player.anchor.setTo(0, 0);
    player.body.velocity.x=0;
    player.animations.play('still');
    game.camera.follow(player);

    player.animations.add('right', [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25], 10, false);
    player.animations.add('left', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12], 10, false);
    player.animations.add('jump_left', [26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36], 10, false);
    player.animations.add('jump_right', [37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47], 10, false);
    player.animations.add('idle',[48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65],17,false);
    player.animations.add('idle',[48,49],2,true); 

}

function level3() {

}

function levels() {
}

function about() {
}

function help() {
}