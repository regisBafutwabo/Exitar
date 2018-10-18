//var Exitar=Exitar || {};

var Level2 = {

    preload: function () {
        this.game.world.setBounds(0, 0, 3200, 608);
    },
    create: function () {

        //------------Level Rendering-----------------------------------------

        this.game.checkWorldBounds = false;
        this.level2 = this.game.add.tilemap('level2');
        this.game.physics.arcade.TILE_BIAS = 32;

        this.level2.addTilesetImage('bg', 'level2bg');
        this.level2.addTilesetImage('ground', 'floor');
        this.level2.addTilesetImage('guide', 'guide');

        this.bgLayer = this.level2.createLayer('bg');
        this.floorLayer = this.level2.createLayer('ground');
        this.mapLayer = this.level2.createLayer('guide');

        this.level2.setCollisionBetween(1, 2000, true, this.floorLayer);
        this.level2.setCollisionBetween(1, 2000, true, this.mapLayer);


        //------------------Train rendering-------------------------------------

        this.train = this.game.add.sprite(2800, 380, 'train');
        this.game.physics.arcade.enable(this.train, Phaser.Physics.ARCADE);
        this.train.animations.add('close', [0, 2], 1, false);
        this.train.animations.add('open', [2, 1], 1, false);
        this.train.animations.play('open');

        //-------------------------boardSign-------------------------------------
        this.signBoards = this.game.add.group();
        this.signBoards.enableBody = true
        for (this.i = 0; this.i < 4; this.i++) {
            this.signBoard = this.signBoards.create(this.i * 800, 60, 'signBoard')

            this.signBoard.animations.add('anime', null, 40, true)
            this.signBoard.animations.play('anime')
        }

        //-------------------vending Machine--------------------------------------

        this.createVendingMachine(2000, 430);


        //-------------------player rendering-------------------------------------

        this.createPlayer(250, 350)


        //-------------------enemy-----------------------------------------------

        this.createEnemy(20, 400)


        //---------------------Health Bar-------------------------------------------

        this.createHealth()

        //---------------------Profile--------------------------------------------

        this.profile = this.game.add.image(0, 0, 'profile')
        this.profile.fixedToCamera = true

        //--------------------Coins---------------------------------------------
        //-----------Floating coins----------------------------------
        this.createCoins(400, 300)

        collectedCoins = this.game.add.group();

        //---------collected coins--------------------------------
        this.game.add.text(700, 10, 'Coins : ', {
            font: '34px Comicbd',
            fill: '#fff'
        }).fixedToCamera = true

        this.coinsAmount = 0

        //------------------------Slippery--------------------------------------

        this.platforms = this.game.add.physicsGroup();
        this.splipperyWarning = this.game.add.sprite(1450, 520, 'slipperywarning')
        this.bucket = this.game.add.sprite(1700, 500, 'bucket')

        this.platforms.create(1500, 575, 'splash')
        this.platforms.setAll('body.allowGravity', false);
        this.platforms.setAll('body.immovable', 'true')

        //-------------------cursor settings---------------------------------------

        this.cursors = this.game.input.keyboard.createCursorKeys();
        jumpButton = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
        this.pausebtn = this.game.input.keyboard.addKey(Phaser.Keyboard.ESC);
        this.drink = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
        left = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        right = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);

        //--------------------------Music-------------------------


        this.levelSong = new Phaser.Sound(this.game, 'levels', 1, true);
        this.levelSong.play();

        this.gameOverSong = new Phaser.Sound(this.game, 'gameOver', 1, true);
        this.gameOverSong.pause()
        this.winSong = new Phaser.Sound(this.game, 'win', 1, true);
        this.winSong.pause()

        //---------------------------Pause------------------------------------------- 

        this.pause = this.game.add.button(400, 300 - 240, 'pause', this.pauseGame, this, 1, 0, 1);
        this.pause.anchor.set(0.5, 0.5);
        this.pause.fixedToCamera = true;

        //-------------------------Instructions-------------------------------

        this.popUp2 = this.game.add.sprite(80, 20, 'level2Ins')
        this.popUp2.animations.add('tutorial', [0, 1, 2, 3, 4, 5], 1, false)
        this.popUp2.animations.play('tutorial');

        //---------------------camera------------------------------------------

        this.game.camera.follow(this.player);

        //====================Status===========================================
        this.inPause = false
        this.deadAlready = false;
        this.doneAlready = false
        this.playerDead = false
        this.moving = false
        this.onTheTrain = false
        //============================================================
    },
    update: function () {
        // console.log("coins" + this.rich)
        //console.log("life " + this.widthLife.width)
        //console.log(this.player.position.x - this.enemy.position.x)


        this.game.physics.arcade.collide(this.player, this.floorLayer);
        this.game.physics.arcade.collide(this.enemy, this.floorLayer);
        this.game.physics.arcade.collide(this.vending, this.floorLayer);
        this.game.physics.arcade.overlap(this.enemy, this.splipperyWarning, this.enemyJump, null, this);
        this.game.physics.arcade.overlap(this.player, this.platforms, this.setFriction, null, this);

        this.game.physics.arcade.overlap(this.enemy, this.player, this.dead, null, this);
        this.game.physics.arcade.overlap(this.player, this.vending, this.drinkWater, null, this)
        this.game.physics.arcade.overlap(this.player, this.coins, this.collect, null, this)

        if (this.pausebtn.isDown && this.inPause == false) {
            this.pauseGame()

        } else if (this.pausebtn.isDown && this.inPause == true) {
            this.pauseGame()
        }
        //--------------------------------------------- Train takeoff --------------------------------------
        else if (this.game.physics.arcade.distanceToXY(this.player, 744, 510) > 2250) {
            this.player.alpha = 0;
            this.player.position.x -= 200
            this.player.kill()
            this.playerDead = true
            this.train.animations.play('close')
            this.enemy.body.velocity.x = 0;
            this.enemy.animations.play('idle')
            this.time.events.add(1000, this.go, this);
        } else if (this.game.physics.arcade.distanceToXY(this.enemy, 744, 510) > 2250) {
            this.enemy.destroy();
            this.playerDead = true
            this.train.animations.play('close')
            this.time.events.add(1000, this.go2, this);
        }

        //---------------------------------Movements---------------------------------        
        else if (state_direction && this.playerDead != true) {

            //------------------------------------ AI --------------------------------------------
            if (this.player.position.x - this.enemy.position.x < 0 && this.moving == true) {
                this.enemy.body.velocity.x = -150
                this.enemy.animations.play('run_left')
            } else if (this.player.position.x - this.enemy.position.x > 0 && this.moving == true) {
                this.enemy.body.velocity.x = 100
                this.enemy.animations.play('run_right')
            }

            //---------------------------------Left----------------------------------------------
            // Checks if  LEFT is pressed
            if (left.isDown && this.player.body.blocked.down && this.playerDead == false) {

                this.moving = true;
                this.movingLeft = true
                this.movingRight = false
                // OK, LEFT is pressed, now before deciding what to do, also check for JUMP.
                if (jumpButton.isDown && this.player.body.blocked.down) {
                    // If enters here, then the player is pressing both LEFT and JUMP.
                    this.popUp2.kill()
                    this.jumpLeft();
                } else {
                    // If enters here, then the player is only pressing LEFT.
                    this.popUp2.kill()
                    this.game.time.events.add(500, this.cropLife, this)
                    this.player.body.velocity.x = -150;
                    this.player.animations.play('left');
                }
            }

            //--------------------------------Right----------------------------------------------------

            // Otherwise, checks if RIGHT is pressed
            else if (right.isDown && this.player.body.blocked.down && this.playerDead == false) {

                this.moving = true
                this.movingLeft = false
                this.movingRight = true
                // OK, RIGHT is pressed, now before deciding what to do, also check for JUMP.
                if (jumpButton.isDown && this.player.body.blocked.down) {
                    // If enters here, then the player is pressing both RIGHT and JUMP.
                    this.popUp2.kill()
                    this.jumpRight();
                } else {
                    // If enters here, then the player is only pressing RIGHT.
                    this.popUp2.kill()
                    this.game.time.events.add(500, this.cropLife, this)
                    this.player.body.velocity.x = 150;
                    this.player.animations.play('right');
                }
            }
            //---------------------------------------------JUMP----------------------------------------------

            // Otherwise, the player is not pressing neither LEFT nor RIGHT, so test for JUMP
            else if (jumpButton.isDown && this.player.body.blocked.down && this.playerDead == false) {
                // Ok, JUMP alone is pressed, to a simple jump()
                this.popUp2.kill()
                this.moving = true;
                this.time.events.add(500, this.cropLife, this)
                this.jump();
            } else if (!left.isDown && !right.isDown && !jumpButton.isDown) {
                //console.log("Running at: " + this.player.body.velocity.x)
                this.player.body.velocity.x = 0;
                this.player.animations.play('still')
            }



            //---------------------------------------PAUSE-----------------------------------------------------
            else if (this.pause.isDown && this.game.paused) {
                //console.log("unpause")
                this.game.paused = false;
            } else if (this.pause.isDown && !this.gamePause) {
                this.pauseGame()

            }
        }
    },

    jumpLeft: function () {
        state_direction = false;

        this.player.body.velocity.y = -750;
        this.player.body.velocity.x = -150
        this.time.events.add(1000, this.my_time, this);
        this.player.animations.play('jump_left');
        this.cropBiggerLife()
        //state_direction = true;
    },

    jumpRight: function () {
        state_direction = false;

        this.player.body.velocity.y = -750;
        this.player.body.velocity.x = 150;
        this.time.events.add(1000, this.my_time, this);
        this.player.animations.play('jump_right');
        this.cropBiggerLife()
        //state_direction = true;
    },

    jump: function () {
        state_direction = false;
        this.player.body.velocity.y = -650;
        this.time.events.add(1000, this.my_time, this);
    },

    my_time: function () {
        state_direction = true;
    },
    go: function () {
        this.train.animations.stop();
        this.playerDead = true
        this.train.body.velocity.x = 100;
        this.levelSong.pause()
        this.winSong.play()
        this.onTheTrain = true
        this.doneAlready = true
        this.time.events.add(8000, this.done, null, this);
    },
    go2: function () {
        this.train.animations.stop();
        //this.player.destroy();
        this.playerDead = true
        this.train.body.velocity.x = 100;
    },

    done: function () {
        //console.log("done function")
        this.game.state.start('Level3')
        //this.destroy()
    },

    pauseGame: function () {
        // console.log("pause function")
        if (this.inPause == false) {
            this.game.physics.arcade.isPaused = true
            state_direction = false
            this.enemy.body.velocity.x = 0
            this.enemy.animations.stop()
            this.player.body.velocity.x = 0
            this.player.animations.stop()


            this.retrybutton = this.game.add.button(400, 300 - 150, 'donebtn', this.retry, this, 1, 0, 1);
            this.retrybutton.anchor.set(0.5, 0.5);
            this.retrybutton.fixedToCamera = true;

            this.menubutton = this.game.add.button(400, 300 - 20, 'donebtn', this.menu, this, 5, 4, 5);
            this.menubutton.anchor.set(0.5, 0.5);
            this.menubutton.fixedToCamera = true;

            this.nextlevelbutton = this.game.add.button(400, 300 + 130, 'donebtn', this.nextLevel, this, 3, 2, 3);
            this.nextlevelbutton.anchor.set(0.5, 0.5);
            this.nextlevelbutton.fixedToCamera = true;

            this.levelbutton = this.game.add.button(400, 300 + 230, 'levelBtn', this.level, this, 1, 0, 1);
            this.levelbutton.anchor.set(0.5, 0.5);
            this.levelbutton.fixedToCamera = true;

            this.inPause = true

        } else if (this.inPause == true) {

            this.game.physics.arcade.isPaused = false
            state_direction = true
            this.retrybutton.kill();

            this.menubutton.kill();

            this.nextlevelbutton.kill()

            this.levelbutton.kill()

            this.inPause = false
        }

    },

    dead: function () {

        if (this.playerDead != true && this.onTheTrain == false) {
            //----------------------player health -------------------------

            this.player.animations.play('dying');
            this.life.kill()
            this.player.body.velocity.x = 0;
            this.playerDead = true

            //------------------------Song to play---------------------------

            this.levelSong.pause()
            this.gameOverSong.play();

            //--------------------------game state--------------------------
            /*this.gameOver = this.game.add.sprite(430, 300, 'game_over');
            this.gameOver.anchor.set(0.5, 0.5)
            this.gameOver.fixedToCamera = true;*/
            //---------------retry button-----------------------------------
            this.retrybutton = this.game.add.button(400, 300 - 150, 'donebtn', this.retry, this, 1, 0, 1);
            this.retrybutton.anchor.set(0.5, 0.5);
            this.retrybutton.fixedToCamera = true;
        } else if (this.life == null) {
            this.moving = false
            this.enemy.body.velocity.x = 170;
            this.enemy.animations.play('run_right')

        }

    },

    retry: function () {
        //this.clearCurrentState()
        this.levelSong.pause()
        this.winSong.pause()
        this.gameOverSong.pause()
        this.game.state.start('Level2');
        this.destroy()
    },


    nextLevel: function () {
        this.levelSong.pause()
        this.winSong.pause()
        this.gameOverSong.pause()
        this.game.state.start('Level3');
        
    },

    menu: function () {
        this.clearCurrentState()
        this.levelSong.pause()
        this.winSong.pause()
        this.gameOverSong.pause()
        this.game.state.start('MainMenu');

        this.destroy()
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


    level: function () {
        this.levelSong.pause()
        this.winSong.pause()
        this.gameOverSong.pause()
        this.game.state.start('levels');
        this.destroy()
    },

    cropLife: function () {
        //console.log("life =" + this.widthLife.width);
        if (this.widthLife.width < 5 && this.doneAlready == false) {
            //console.log(this.widthLife.width)

            this.player.body.velocity.x = 0
            this.player.animations.play('dying');
            this.playerDead = true
            //this.doneAlready=false

            this.enemy.kill()

            this.winSong.pause()
            this.levelSong.pause()
            this.gameOverSong.play();

            this.gameOver = this.game.add.sprite(400, 300 - 150, 'game_over');
            this.gameOver.anchor.set(0.5, 0.5)
            this.gameOver.fixedToCamera = true;
            //this.widthLife.width = this.totalLife;

            this.retrybutton = this.game.add.button(400, 300, 'donebtn', this.retry, this, 1, 0, 1);
            this.retrybutton.anchor.set(0.5, 0.5);
            this.retrybutton.fixedToCamera = true;
        } else {
            this.game.add.tween(this.widthLife).to({
                    width: (this.widthLife.width - (this.totalLife / 48))
                },
                200, Phaser.Easing.Linear.None, true);
        }
    },

    cropBiggerLife: function () {
        if (this.widthLife.width < 2) {
            //console.log(this.widthLife.width)

            this.player.body.velocity.x = 0
            this.player.animations.play('dying');
            this.playerDead = true

            this.enemy.body.velocity.x = 0
            this.enemy.animations.play('idle');

            this.levelSong.pause()
            this.gameOverSong.play();

            this.gameOver = this.game.add.sprite(400, 300 - 150, 'game_over');
            this.gameOver.fixedToCamera = true;
            //this.widthLife.width = this.totalLife;

            this.retrybutton = this.game.add.button(400 + 150, 300 + 150, 'donebtn', this.retry, this, 1, 0, 1);
            this.retrybutton.anchor.set(0.5, 0.5);
            this.retrybutton.fixedToCamera = true;
        } else {
            this.game.add.tween(this.widthLife).to({
                    width: (this.widthLife.width - (this.totalLife / 10))
                },
                200, Phaser.Easing.Linear.None, true);
        }
    },

    drinkWater: function () {


        if (this.drink.isDown && this.widthLife.width > 1 && this.widthLife.width <= 200 && this.coinsAmount != 0) {
            //   this.rich.kill()
            if (state_direction) {
                if (this.drink.isDown) {
                    state_direction = false
                    this.player.body.velocity.x = 0
                    this.player.animations.play('still');
                    this.time.events.add(1200, this.my_time, this);
                    this.coinsAmount -= 1
                    collectedCoins.getFirstAlive().kill();
                    this.game.add.tween(this.widthLife).to({
                            width: (this.widthLife.width + (this.totalLife / 5))
                        },
                        200, Phaser.Easing.Linear.None, true);
                } else if (this.drink.isDown && this.coinsAmount == 0) {
                    state_direction = false
                    this.broke = this.game.add.text(400, 300, 'You are broke, get some coins!!!', {
                        font: '48px Comicbd',
                        fill: '#fff'
                    })
                    this.broke.fixedToCamera = true
                    this.time.events.add(2000, function () {
                        this.broke.alpha = 0
                    }, this)
                }
            }
        }
    },

    render: function () {
        this.showDebug = true;
        if (this.showDebug) {
            this.game.debug.bodyInfo(this.coins, 32, 32)
            this.game.debug.body(this.coins)

        }
    },
    clearCache: function () {
        Level2.cache = new Phaser.Cache(Level2)
        Level2.load.reset()
        Level2.load.removeAll()
        //Level2.destroy()
    },
    collect: function (player, coin) {
        coin.kill()
        this.coins.remove(coin)

        this.collectedCoin = collectedCoins.create(700 + (30 * this.coinsAmount), 60, 'coinsCollected');
        this.game.physics.arcade.enable(this.collectedCoin, Phaser.Physics.ARCADE);
        this.collectedCoin.anchor.setTo(0.5, 0.5)
        this.collectedCoin.body.allowGravity = false
        this.collectedCoin.body.immovable = true
        this.collectedCoin.fixedToCamera = true

        //increase the amount of coins
        this.coinsAmount += 1
    },

    createPlayer: function (x, y) {
        this.player = this.game.add.sprite(x, y, 'exitar');
        this.game.physics.arcade.enable(this.player, Phaser.Physics.ARCADE);
        this.player.body.gravity.y = 1400;
        this.player.body.velocity.x = 0
        this.player.body.collideWorldBounds = true;

        this.player.anchor.setTo(0, 0);
        this.player.body.setSize(50, 100, 20, 0);


        this.player.animations.add('left', [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25], 10, true);
        this.player.animations.add('right', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12], 10, true);
        this.player.animations.add('jump_right', [26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36], 5, false);
        this.player.animations.add('jump_left', [37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47], 5, false);
        this.player.animations.add('win', [48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65], 10, false);
        this.player.animations.add('damageLeft', [78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89], 10, true)
        this.player.animations.add('damageRight', [66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77], 10, true)
        this.player.animations.add('dying', [90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107], 10, false)
        this.player.animations.add('still', [50, 51], 2, true);
    },

    createEnemy: function (x, y) {
        this.enemy = this.game.add.sprite(x, y, 'enemy')
        this.game.physics.arcade.enable(this.enemy, Phaser.Physics.ARCADE)
        this.enemy.body.gravity.y = 1400
        this.enemy.body.collideWorldBounds = true;

        this.enemy.animations.add('run_right', [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19], 10, true);
        this.enemy.animations.add('run_left', [21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34], 10, true)
        this.enemy.animations.add('jump_right', [0, 1, 2, 3, 4, 5, 6], 7, false)
        this.enemy.animations.add('jump_left', [35, 36, 37, 38, 39, 40, 41], 7, false)
        this.enemy.animations.add('kill', [5, 6], 1, false);
        this.enemy.animations.add('idle', [45, 46], 2, true)
        this.enemy.animations.play('idle')
    },

    enemyJump: function () {
        this.enemy.body.velocity.y = -650
        this.enemy.body.velocity.x = 170
        this.enemy.animations.play('jump_right')
    },

    createCoins: function (x, y) {
        this.coins = this.game.add.group()
        this.coins.enableBody = true
        for (var i = 1; i < 4; i++) {
            this.coin = this.coins.create(i * x, y, 'coins')
            this.coins.callAll('animations.add', 'animations', 'rotate', [0, 1, 2, 3], 4, true);
            this.coins.callAll('animations.play', 'animations', 'rotate');
            console.log("coins left:" + this.coins.countLiving())
        }
    },


    createHealth: function () {
        this.health = this.game.add.bitmapData(260, 25);
        this.health.ctx.beginPath();
        this.health.ctx.rect(70, 10, 200, 40);
        this.health.ctx.lineJoin = "round"
        this.health.ctx.lineWidth = 200;
        this.health.ctx.fillStyle = '#00685e'
        this.health.ctx.fill();



        //===============Thirst gauge==============================
        this.thirstbar = this.game.add.bitmapData(200, 25);
        this.thirstbar.ctx.beginPath();
        this.thirstbar.ctx.rect(70, 10, 200, 40);
        this.thirstbar.ctx.lineJoin = "round"
        this.thirstbar.ctx.lineWidth = 200;
        this.thirstbar.ctx.fillStyle = '#35F2DA';
        this.thirstbar.ctx.fill();

        this.stamina = this.game.add.sprite(10, 40, this.health);
        this.stamina.fixedToCamera = true;

        this.widthLife = new Phaser.Rectangle(70, 10, 200, 18);
        this.totalLife = this.thirstbar.width;

        this.thirst = this.game.add.sprite(70, 50, this.thirstbar)
        this.thirst.cropEnabled = true;
        this.thirst.crop(this.widthLife);
        this.thirst.fixedToCamera = true;

        this.game.add.text(280, 15, 'Health', {
            font: '15px Comicbd',
            fill: '#fff'
        }).fixedToCamera = true

        //==================Health gauge===============================

        this.healthbar = this.game.add.bitmapData(200, 25);
        this.healthbar.ctx.beginPath();
        this.healthbar.ctx.rect(70, 10, 200, 40);
        this.healthbar.ctx.lineJoin = "round"
        this.healthbar.ctx.lineWidth = 200;
        this.healthbar.ctx.fillStyle = '#FF0000';
        this.healthbar.ctx.fill();

        this.hp = this.game.add.sprite(10, 10, this.health);
        this.hp.fixedToCamera = true;


        this.healthLife = new Phaser.Rectangle(70, 10, 200, 18);
        this.totalhealth = this.healthbar.width

        this.life = this.game.add.sprite(70, 17, this.healthbar);
        this.life.cropEnabled = true;
        this.life.crop(this.healthLife);
        this.life.fixedToCamera = true;

        this.game.add.text(280, 50, 'Thirst', {
            font: '15px Comicbd',
            fill: '#fff'
        }).fixedToCamera = true
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
    //creates the vending machine
    createVendingMachine: function (x, y) {
        this.vending = this.game.add.sprite(x, y, 'vendingMachine');
        this.game.physics.arcade.enable(this.vending, Phaser.Physics.ARCADE);
        this.vending.collideWorldBounds = true;
        this.vending.animations.add('vendingAnim', null, 12, true)
        this.vending.animations.play('vendingAnim')
    },

    killText: function () {
        this.broke.alpha = 0
    },
    setFriction: function () {
        if (this.movingLeft == true) {
            this.player.animations.play('damageLeft')
            this.player.friction = 1
            this.game.add.tween(this.widthLife).to({
                    width: (this.widthLife.width - (this.totalLife / 5))
                },
                200, Phaser.Easing.Linear.None, true);
        } else if (this.movingRight == true) {
            this.player.animations.play('damageRight')
            this.player.friction = -1
            this.widthLife.width / 2;
            this.game.add.tween(this.widthLife).to({
                    width: (this.widthLife.width - (this.totalLife / 5))
                },
                200, Phaser.Easing.Linear.None, true);
        }

    },
};