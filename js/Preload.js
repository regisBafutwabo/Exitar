// if it exists create a new one
//var Exitar=Exitar || {};

var Preload = {
    preload: function () {

        //show splashscreen
        this.game.world.setBounds(0, 0, 800, 600);
        this.splashscreen = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'splashScreen');
        this.splashscreen.anchor.set(0.5, 0.5);

        this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY + 250, 'preloadBar');
        this.preloadBar.anchor.set(0.5, 0.5);
        this.load.setPreloadSprite(this.preloadBar);

        this.game.load.image('bg', 'assets/subway.png');
        this.game.load.image('level2bg', 'assets/level2bg-sheet.png');
        this.game.load.image('level3bg','assets/level3bg.png')
        this.load.tilemap('level1', 'maps/level1.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.tilemap('level2', 'maps/level2.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.tilemap('level3', 'maps/level3.json', null, Phaser.Tilemap.TILED_JSON);

        this.game.load.spritesheet('buttons', "assets/Buttons.png", 328, 106);
        this.game.load.spritesheet('levelsbtn', "assets/levelsbtn.png", 100, 100);
        this.load.image('floor', "assets/level2tiles.png");
        this.load.image('guide', 'assets/level2guide-sheet.png');
        this.game.load.spritesheet('about', "assets/about.png", 326, 105);
        this.load.image('trash', 'assets/garbage.png', 32, 34);
        this.load.spritesheet('exitar', 'assets/Exitar.png', 100, 100);
        this.load.image('stairs', 'assets/new6.png', 32, 32);
        this.load.spritesheet('train', 'assets/train.png', 400, 200);
           this.load.spritesheet('trainLeft', 'assets/trainLeft.png', 400, 200);
        this.load.image('lab', 'assets/Background_Lab.png');
        this.load.image('platform', 'assets/new6.png');
        this.load.spritesheet('goback', 'assets/goBack.png', 128, 128);
        this.load.spritesheet('enemy', 'assets/enemy.png', 100, 100);
        this.load.image('game_over', 'assets/gameOver.png', 328, 68);
        this.load.spritesheet('level1Tut', 'assets/level1Pop-up.png', 400, 200)
        this.load.spritesheet('pause', 'assets/pause.png', 32, 32);
        this.load.spritesheet('donebtn', 'assets/doneButtons.png', 100, 66)
        this.game.load.spritesheet('mute', 'assets/sound.png', 64, 64);
        this.game.load.image('profile', 'assets/profil.png')
        this.game.load.spritesheet('popUp', 'assets/level1Pop-up.png', 400, 200)
        this.game.load.spritesheet('level2Ins', 'assets/level2Inst.png', 500, 200)
        this.game.load.spritesheet('signBoard', 'assets/SignBoard.png', 128, 64)
        this.game.load.image('controls', 'assets/Controls.png');
        this.game.load.image('instructions', 'assets/instructions.png');
        this.game.load.spritesheet('levelBtn', 'assets/levelBtn.png', 100, 65)
        this.game.load.image('slipperywarning', 'assets/SlipperyWarning.png')
        this.game.load.image('bottle', 'assets/waterBottle.png')
        this.game.load.image('bucket', 'assets/Brush.png')
        this.game.load.spritesheet('coins', 'assets/Coin.png', 64, 64)
        this.game.load.image('coinsCollected', 'assets/coins.png')
        this.game.load.image('splash', 'assets/splash.png')
        this.game.load.spritesheet('vendingMachine', 'assets/vendingMachine.png', 180, 150)
        this.game.load.image('ditch','assets/ditch.png')
        this.game.load.spritesheet('toilet','assets/Toilet.png',130,140)
        this.game.load.image('floatPlatform2','assets/Floating_Platform2.png')
        this.game.load.image('floatPlatforms','assets/Floating_Platforms.png')
        this.game.load.spritesheet('urine_death','assets/URINE_DEATH.png',100,100)
        
        this.game.load.spritesheet('lights','assets/Lights.png',130,30)
        this.game.load.audio('menu', 'sound/Exitar.m4a');
        this.game.load.audio('levels', 'sound/Levels.m4a');
        this.game.load.audio('gameOver', 'sound/GameOver.m4a');
        this.game.load.audio('win', 'sound/Win.m4a');
        this.game.load.audio('relax','sound/Relax.m4a')
    },
    create: function () {
        this.game.time.events.add(Phaser.Timer.SECOND * 2, this.start, this);
    },

    start: function () {
        this.game.state.start('MainMenu');
    }

};

//Preload.prototype={
//};