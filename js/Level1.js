//var Exitar=Exitar || {};

var Level1 = {

    preload: function () {
        this.game.world.setBounds(0, 0, 800, 600);
    },
    create: function () {

        //------------Level Rendering-----------------------------------------

        this.game.physics.arcade.checkCollision.down = false;
        this.game.checkWorldBounds = false;
        this.level1 = this.game.add.tilemap('level1');
        this.game.physics.arcade.TILE_BIAS = 32;
        this.level1.addTilesetImage('bg');
        this.level1.addTilesetImage('platform', 'platform');
        this.level1.addTilesetImage('stairs', 'platform');
        //this.level1.addTilesetImage('trash', 'trash');

        this.bgLayer = this.level1.createLayer('bg');
        this.groundLayer = this.level1.createLayer('platform');
        this.stairsLayer = this.level1.createLayer('stairs');

        this.level1.setCollisionBetween(1, 2000, true, this.groundLayer);
        this.level1.setCollisionBetween(1, 2000, true, this.stairsLayer);
        //------------------Train rendering-------------------------------------

        this.train = this.game.add.sprite(400, 345, 'train');
        this.game.physics.arcade.enable(this.train, Phaser.Physics.ARCADE);
        this.train.body.immovable = true;
        //this.train.body.collideWorldBounds=true;
        this.train.body.checkCollision.up = {
            up: false,
            down: false,
            left: false,
            right: false
        }

        this.train.body.checkCollision.down = false;
        this.train.animations.add('close', [0, 2], 1, false);
        this.train.animations.add('open', [2, 1], 1, false);
        this.train.animations.play('open');

        //----------------------------player rendering-------------------------------------

        this.player = this.game.add.sprite(10, 282, 'exitar');
        this.game.physics.arcade.enable(this.player, Phaser.Physics.ARCADE);
        this.player.body.gravity.y = 1400;
        this.player.body.collideWorldBounds = true;
        this.player.anchor.setTo(0, 0);
        this.player.body.setSize(50, 100, 20, 0);
        this.game.camera.follow(this.player);

        this.player.animations.add('left', [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25], 10, true);
        this.player.animations.add('right', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12], 10, true);
        this.player.animations.add('jump_right', [26, 27, 28, 29, 30], 5, false);
        this.player.animations.add('jump_left', [37, 38, 39, 40, 41], 5, false);
        this.player.animations.add('win', [48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65], 10, false);
        this.player.animations.add('damageLeft', [78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89], 10, true)
        this.player.animations.add('damageRight', [66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77], 10, true)
        this.player.animations.add('dying', [90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107], 10, false)
        this.player.animations.add('still', [49, 50, 51], 3, true);

        //----------------Trash-----------------------------------------------------

        this.trash = this.game.add.sprite(544, 511, 'trash');
        this.game.physics.arcade.enable(this.trash, Phaser.Physics.ARCADE);
        this.trash.body.immovable = true;
        this.trash.body.collideWorldBounds = true;
        this.train.body.checkCollision.up = false


        //----------------------Pause---------------------------------------

        this.pause = this.game.add.button(this.game.world.centerX, this.game.world.centerY - 240, 'pause', this.pauseGame, this, 1, 0, 1);
        this.pause.anchor.set(0.5, 0.5);
        this.pause.fixedToCamera = true;

        //---------------------Health Bar-------------------------------------------

        this.health = this.game.add.bitmapData(200, 25);
        this.health.ctx.beginPath();
        this.health.ctx.rect(70, 10, 280, 40);
        this.health.ctx.lineJoin = "round"
        this.health.ctx.lineWidth = 20;
        this.health.ctx.fillStyle = '#00685e'
        this.health.ctx.fill();

        this.hp = this.game.add.sprite(10, 10, this.health);
        this.hp.fixedToCamera = true;

        this.healthbar = this.game.add.bitmapData(280, 40);
        this.healthbar.ctx.beginPath();
        this.healthbar.ctx.rect(70, 10, 200, 40);
        this.healthbar.ctx.lineJoin = "round"
        this.healthbar.ctx.lineWidth = 20;
        this.healthbar.ctx.fillStyle = '#FF0000';
        this.healthbar.ctx.fill();

        this.widthLife = new Phaser.Rectangle(60, 10, 200, 18);
        this.totalLife = this.healthbar.width;

        this.life = this.game.add.sprite(70, 17, this.healthbar);
        this.life.cropEnabled = true;
        this.life.crop(this.widthLife);
        this.life.fixedToCamera = true;


        //---------------------Profile--------------------------------------------

        this.game.add.image(0, 0, 'profile')

        //--------------------Coins---------------------------------------------

        this.coin = this.game.add.sprite(200, 300, 'coins')
        this.game.physics.arcade.enable(this.coin, Phaser.Physics.ARCADE);
        this.coin.body.immovable = true

        this.coin.animations.add('rotate', [0, 1, 2, 3], 2, true)
        this.coin.animations.play('rotate')

        this.collectedCoins = this.game.add.group();
        this.game.add.text(this.game.world.width - 100, 10, 'Coins : ', {
            font: '34px Comicbd',
            fill: '#fff'
        })


        //---------------------Song-----------------------------------------------

        this.levelSong = new Phaser.Sound(this.game, 'levels', 1, true);
        this.levelSong.play();

        this.gameOverSong = new Phaser.Sound(this.game, 'gameOver', 1, true);
        this.winSong = new Phaser.Sound(this.game, 'win', 1, true);
        this.winSong.allowMultiple=false

        //-------------------cursor settings---------------------------------------

        this.cursors = this.game.input.keyboard.createCursorKeys();
        jumpButton = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
        this.pausebtn = this.game.input.keyboard.addKey(Phaser.Keyboard.ESC);
        left = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        right = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);

        //------------------------------------------------------------------------

        this.popUp = this.game.add.sprite(80, 20, 'popUp')
        this.popUp.animations.add('tutorial', [0, 1, 2, 3, 4, 5, 6, 7, 8], 3, false)
        this.popUp.animations.play('tutorial');

        this.coinsAmount = 0
    },
    update: function () {

        this.game.physics.arcade.collide(this.player, this.groundLayer);
        this.game.physics.arcade.collide(this.coin, this.groundLayer);
        this.game.physics.arcade.collide(this.player, this.stairsLayer);
        this.game.physics.arcade.overlap(this.player, this.coin, this.collect, null, this)
        //this.game.physics.arcade.collide(this.player,this.train);
        this.game.physics.arcade.collide(this.player, this.trash)

        console.log(this.player.position.x)

        if (state_direction) {
            // Checks if  LEFT is pressed
            if (left.isDown && this.player.body.blocked.down) {
                // OK, LEFT is pressed, now before deciding what to do, also check for JUMP.
                if (jumpButton.isDown && this.player.body.blocked.down) {
                    // If enters here, then the player is pressing both LEFT and JUMP.
                    this.popUp.kill()
                    this.jumpLeft();
                } else {
                    // If enters here, then the player is only pressing LEFT.
                    this.popUp.kill()
                    this.player.body.velocity.x = -150;
                    this.player.animations.play('left');
                }
            }
            // Otherwise, checks if RIGHT is pressed
            else if (right.isDown && this.player.body.blocked.down) {

                // OK, RIGHT is pressed, now before deciding what to do, also check for JUMP.
                if (jumpButton.isDown && this.player.body.blocked.down) {
                    // If enters here, then the player is pressing both RIGHT and JUMP.
                    this.popUp.kill()
                    this.jumpRight();
                } else {
                    // If enters here, then the player is only pressing RIGHT.
                    this.popUp.kill()
                    this.player.body.velocity.x = 150;
                    this.player.animations.play('right');
                }
            }
            // Otherwise, the player is not pressing neither LEFT nor RIGHT, so test for JUMP
            else if (jumpButton.isDown && this.player.body.blocked.down) {
                // Ok, JUMP alone is pressed, to a simple jump()
                this.popUp.kill()
                this.jump();
            } else if (this.game.physics.arcade.distanceToXY(this.player, 744, 510) < 92) {
                this.player.alpha=0;
                this.player.position.x=600
                this.player.kill()
                this.levelSong.pause()
                //console.log(this.player.body.position.x)
                this.go()
                        
            } else if (this.pausebtn.isDown && this.inPause==false) {
                this.pauseGame()
            } 
            else if(this.pausebtn.isDown && this.inPause==true)
                {
                    this.pauseGame()
                }
            
            else {
                this.player.animations.play('still');
                this.player.body.velocity.x = 0;
            }
        }

    },

    jumpLeft: function () {
        state_direction = false;

        this.player.body.velocity.y = -500;
        this.player.body.velocity.x = -170
        this.time.events.add(1000, this.my_time, this);
        this.player.animations.play('jump_left');
    },

    jumpRight: function () {
        console.log("im here")
        state_direction = false;

        this.player.body.velocity.y = -500;
        this.player.body.velocity.x = 170;
        this.time.events.add(1000, this.my_time, this);
        this.player.animations.play('jump_right');
    },

    jump: function () {
        state_direction = false;

        this.player.body.velocity.y = -150;
        this.time.events.add(1000, this.my_time, this);
    },

    my_time: function () {
        state_direction = true;
        this.player.alpha = 1;
    },
    /* render: function () {
         this.game.debug.text("distance:" + this.game.physics.arcade.distanceToXY(this.player, 744, 510), 32, 32);
     },*/
    go: function () {
        this.train.animations.play('close')
        this.time.events.add(5000,function()
                            {
            this.train.animations.stop();
        },this)
        
        this.train.body.velocity.x = 100;
       // this.player.kill();
        this.levelSong.pause()
        console.log("playing")
        this.doneAlready = true
        this.time.events.add(1000, this.done, this);

    },


    //---------------------------// damaged and dying ------------------------------


    //-----------------------------------Pausing Part--------------------------------------
    pauseGame: function () {
        console.log("pause function")
        if (this.inPause == false) {
            this.game.physics.arcade.isPaused = true
            state_direction=false
            
            this.player.animations.stop()
            this.player.body.velocity.x=0

            this.retrybutton = this.game.add.button(this.game.world.centerX, this.game.world.centerY - 180, 'donebtn', this.retry, this, 1, 0, 1);
            this.retrybutton.anchor.set(0.5, 0.5);
            this.retrybutton.fixedToCamera = true;

            this.menubutton = this.game.add.button(this.game.world.centerX, this.game.world.centerY - 50, 'donebtn', this.menu, this, 5, 4, 5);
            this.menubutton.anchor.set(0.5, 0.5);
            this.menubutton.fixedToCamera = true;

            this.nextlevelbutton = this.game.add.button(this.game.world.centerX, this.game.world.centerY + 100, 'donebtn', this.nextLevel, this, 3, 2, 3);
            this.nextlevelbutton.anchor.set(0.5, 0.5);
            this.nextlevelbutton.fixedToCamera = true;

            this.inPause = true
        }
        else if (this.inPause == true) {

            this.game.physics.arcade.isPaused = false
            state_direction=false

            this.retrybutton.kill();

            this.menubutton.kill();

            this.nextlevelbutton.kill()
               this.levelbutton.kill()

            this.inPause = false
        }


    },


    //----------------------------------Ending Menu----------------------------------------
    done: function () {
        
        if(this.doneAlready==true)
            {
        this.winSong.play();
        
                this.time.events.add(8000,function()
                                    {this.game.state.start('Level2')
                                    this.destroy()},this)
                this.doneAlready=false
            }

    },

    retry: function () {
        this.clearCurrentState()
        this.levelSong.pause()
        this.winSong.pause()
        this.gameOverSong.pause()
        this.game.state.start('Level1');
        this.destroy()
    },
    nextLevel: function () {
        this.levelSong.pause()
        this.winSong.pause()
        this.gameOverSong.pause()
        this.game.state.start('Level2');
        this.destroy()
    },
    menu: function () {
        this.levelSong.pause()
        this.winSong.pause()
        this.gameOverSong.pause()
        this.game.state.start('MainMenu');
        this.destroy()
    },
    collect: function () {
        this.coin.kill()
        this.collectedCoin = this.collectedCoins.create(700 + (30 * this.coinsAmount), 60, 'coinsCollected');
        this.game.physics.arcade.enable(this.collectedCoin, Phaser.Physics.ARCADE);
        this.collectedCoin.anchor.setTo(0.5, 0.5);

        this.collectedCoin.body.allowGravity = false
        this.collectedCoin.body.immovable = true
        this.collectedCoin.fixedToCamera = true

        //increase the amount of coins
        this.coinsAmount += 1

    },

        clearCurrentState: function () {

        if (this.current) {
            if (this.onShutDownCallback) {
                this.onShutDownCallback.call(this.callbackContext, this.game);
            }

            this.game.tweens.removeAll();

            this.game.camera.reset();

            this.game.input.reset(true);

            this.game.physics.clear();

            this.game.time.removeAll();

            this.game.scale.reset(this._clearWorld);

            if (this.game.debug) {
                this.game.debug.reset();
            }

            if (this._clearWorld) {
                this.game.world.shutdown();

                if (this._clearCache === true) {
                    this.game.cache.destroy();
                }
            }
        }

    },

    destroy: function () {

        this.clearCurrentState();

        this.callbackContext = null;

        this.onInitCallback = null;
        this.onShutDownCallback = null;

        this.onPreloadCallback = null;
        this.onLoadRenderCallback = null;
        this.onLoadUpdateCallback = null;
        this.onCreateCallback = null;
        this.onUpdateCallback = null;
        this.onRenderCallback = null;
        this.onPausedCallback = null;
        this.onResumedCallback = null;
        this.onPauseUpdateCallback = null;

        this.game = null;
        this.states = {};
        this._pendingState = null;
        this.current = '';
        this.clearCache();

    },

    clearCache: function () {
        Level1.cache = new Phaser.Cache(Level2)
        Level1.load.reset()
        Level1.load.removeAll()
        //Level2.destroy()
    },
};