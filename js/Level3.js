var Level3 = {

    preload: function () {
        this.game.world.setBounds(0, 0, 3200, 800);
    },

    create: function () {
        //------------Level Rendering-----------------------------------------

        this.game.checkWorldBounds = false;
        this.level3 = this.game.add.tilemap('level3');
        this.game.physics.arcade.TILE_BIAS = 32;

        this.level3.addTilesetImage('bg', 'level3bg');
        this.level3.addTilesetImage('ditch', 'ditch');
        this.level3.addTilesetImage('platform', 'floatPlatforms')

        this.bgLayer = this.level3.createLayer('bg');

        //------------------Train rendering-------------------------------------

        this.createTrain(5, 120)

       this.takeOff=this.level3.createLayer('takeOff');
        this.hole=this.level3.createLayer('hole');
        this.wallLayer=this.level3.createLayer('wall');
        this.floorLayer = this.level3.createLayer('ground');
        this.platformsLayer = this.level3.createLayer('platform')
        this.takeOff.alpha=0
        this.wallLayer.alpha=0
        this.hole.alpha=0

        this.platformsLayer.resizeWorld()
        this.floorLayer.resizeWorld()

        this.level3.setCollisionBetween(1, 10000, true, this.takeOff);
        this.level3.setCollisionBetween(1, 1000, true, this.floorLayer);
        this.level3.setCollisionBetween(1, 10000, true, this.wallLayer);
        this.level3.setCollisionBetween(1, 10000, true, this.platformsLayer);
        this.level3.setCollisionBetween(1, 10000, true, this.hole);
        


        this.lights = this.game.add.group()
        this.lights.enableBody = true

        for (var i = 1; i < 4; i++) {
            this.light = this.lights.create(i * 500, 373, 'lights')

            this.lights.callAll('animations.add', 'animations', 'disturbed', null, 11, true);
        }


        //-------------------------boardSign-------------------------------------
        this.createSignBoards(800, 60)

        //-------------------vending Machine--------------------------------------

        this.createVendingMachine(1000, 172);
        //this.createVendingMachine(2400,172);

        this.createToilet(2700, 595)


        //-------------------player rendering-------------------------------------

        this.createPlayer(300, 450)


        //-------------------enemy-----------------------------------------------

        this.createEnemy(2800, 170)


        //---------------------Health Bar-------------------------------------------

        this.createHealth()

        //---------------------Profile--------------------------------------------
        this.createProfile()

        //--------------------Coins---------------------------------------------
        collectedCoins = this.game.add.group();


        //-----------Floating coins----------------------------------
        this.createCoins(800, 100)
        
        this.game.add.text(700, 10, 'Coins : ', {
            font: '34px Comicbd',
            fill: '#fff'
        }).fixedToCamera = true

        this.coinsAmount = 0

        //---------------------------Pause------------------------------------------- 

        this.pause = this.game.add.button(400, 300 - 240, 'pause', this.pauseGame, this, 1, 0, 1);
        this.pause.anchor.set(0.5, 0.5);
        this.pause.fixedToCamera = true;

        this.game.camera.follow(this.player);

        //--------------------------Music---------------------------

        this.levelSong = new Phaser.Sound(this.game, 'levels', 1, true);
        this.levelSong.play();

        this.gameOverSong = new Phaser.Sound(this.game, 'gameOver', 1, true);
        this.gameOverSong.pause()
        this.winSong = new Phaser.Sound(this.game, 'win', 1, false);
        this.winSong.pause()

        this.relaxSong = new Phaser.Sound(this.game, 'relax', 1, true);
        this.relaxSong.pause()


        this.inPause = false
        this.deadAlready = false;
        this.doneAlready = false
        this.playerDead = false
        this.moving = false
        this.wallLeft=false

        //-------------------cursor settings---------------------------------------

        this.cursors = this.game.input.keyboard.createCursorKeys();
        jumpButton = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
        this.pausebtn = this.game.input.keyboard.addKey(Phaser.Keyboard.ESC);
        this.drink = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
        left = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        right = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);

    },
    update: function () {
        
         this.game.physics.arcade.overlap(this.player, this.hole,this.killPlayer,null,this); this.game.physics.arcade.overlap(this.player, this.takeOff,this.go,null,this);
        this.game.physics.arcade.collide(this.player, this.floorLayer);
        this.game.physics.arcade.collide(this.enemy, this.wallLayer,this.stand,null,this);
        this.game.physics.arcade.collide(this.enemy, this.floorLayer);
        this.game.physics.arcade.collide(this.vending, this.floorLayer);
        this.physics.arcade.collide(this.player, this.platformsLayer);
        this.game.physics.arcade.overlap(this.enemy, this.splipperyWarning, this.enemyJump, null, this);
        this.game.physics.arcade.overlap(this.player, this.platforms, this.setFriction, null, this);

        this.game.physics.arcade.overlap(this.enemy, this.player, this.dead, null, this);
        this.game.physics.arcade.overlap(this.player, this.vending, this.drinkWater, null, this)
        this.game.physics.arcade.overlap(this.player, this.coin, this.collect, null, this)
        this.game.physics.arcade.overlap(this.player, this.toilet, this.relax, null, this)


        if (this.pausebtn.isDown && this.inPause == false) {
            this.pauseGame()

        } else if (this.pausebtn.isDown && this.inPause == true) {
            this.pauseGame()
        }
        //--------------------------------------------- Train takeoff --------------------------------------
      /*  else if (this.game.physics.arcade.distanceToXY(this.player, 744, 510) < 620) {
            this.time.events.add(1000, this.go, this);
        }*/

      /*  //----------------------Fall in the hole------------------
        else if (this.player.position.x == 672 && this.player.positon.y == 768) {
            this.killPlayer()
        }*/

        //---------------------------------Movements---------------------------------        
        else if (state_direction && this.playerDead != true) {

            //---------------------------------Left----------------------------------------------
            // Checks if  LEFT is pressed
            if (left.isDown && this.player.body.blocked.down && this.playerDead == false) {

                this.moving = true;
                this.movingLeft = true
                this.movingRight = false
                // OK, LEFT is pressed, now before deciding what to do, also check for JUMP.
                if (jumpButton.isDown && this.player.body.blocked.down) {
                    // If enters here, then the player is pressing both LEFT and JUMP.
                    // this.popUp2.kill()
                    this.jumpLeft();
                } else {
                    // If enters here, then the player is only pressing LEFT.
                    //    this.popUp2.kill()
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
                    //this.popUp2.kill()
                    this.jumpRight();
                } else {
                    // If enters here, then the player is only pressing RIGHT.
                    this.game.time.events.add(500, this.cropLife, this)
                    this.player.body.velocity.x = 150;
                    this.player.animations.play('right');
                }
            }
            //---------------------------------------------JUMP----------------------------------------------

            // Otherwise, the player is not pressing neither LEFT nor RIGHT, so test for JUMP
            else if (jumpButton.isDown && this.player.body.blocked.down || this.player.body.touching.down && this.playerDead == false) {
                // Ok, JUMP alone is pressed, to a simple jump()
                // this.popUp2.kill()
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
    
    stand:function()
    {
        if(this.wallLeft==false)
            {
        this.enemy.body.velocity.x=-100
        this.enemy.animations.play('run_left')
                this.wallLeft=true
    }
        else if(this.wallLeft==true)
            {
        this.enemy.body.velocity.x=100
        this.enemy.animations.play('run_right') 
            this.wallLeft=false
            }
    },

    relax: function () {
        this.player.kill()
        this.levelSong.pause()
        this.relaxSong.play()
        this.time.events.add(3000, function () {
            this.player.revive(2480, 450)
            this.levelSong.play()
            this.relaxSong.pause()

        }, this)

        //this.player.body.velocity.x=0
        this.enemy.body.velocity.x = 0
        this.enemy.animations.play('idle')
        //Increase thirst
        if (this.widthLife.width <= 130) {
            this.game.add.tween(this.widthLife).to({
                    width: (this.widthLife.width + (this.totalLife / 5))
                },
                200, Phaser.Easing.Linear.None, true);
            this.game.add.tween(this.urineLife).to({
                width: (1)
            }, 200, Phaser.Easing.Linear.None, true);
        }

    },

    dead: function () {
        //--------------------enemy status------------------------
        //----------------------player health -------------------------

        this.player.animations.play('dying');
        this.life.kill()
        this.player.body.velocity.x = 0;
        this.playerDead = true

        //------------------------Song to play---------------------------

        this.levelSong.pause()
        this.gameOverSong.play();

        //--------------------------game state--------------------------
        this.gameOver = this.game.add.sprite(430, 300, 'game_over');
        this.gameOver.anchor.set(0.5, 0.5)
        this.gameOver.fixedToCamera = true;
        //---------------retry button-----------------------------------
        this.retrybutton = this.game.add.button(400, 300 - 150, 'donebtn', this.retry, this, 1, 0, 1);
        this.retrybutton.anchor.set(0.5, 0.5);
        this.retrybutton.fixedToCamera = true;


        if (this.life == null) {
            this.moving = false
            this.enemy.body.velocity.x = 170;
            this.enemy.animations.play('run_right')

        }

    },

    cropLife: function () {
        //console.log("life =" + this.widthLife.width);
        if (this.widthLife.width < 5) {
            //console.log(this.widthLife.width)

            this.player.body.velocity.x = 0
            this.player.animations.play('dying');
            this.playerDead = true

            this.enemy.kill()

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
                    width: (this.widthLife.width - (this.totalLife / 70))
                },
                200, Phaser.Easing.Linear.None, true);

            if (this.urineLife.width < 200) {
                this.game.add.tween(this.urineLife).to({
                        width: (this.urineLife.width + (this.totalUrine / 40))
                    },
                    200, Phaser.Easing.Linear.None, true);
            } else {
                this.player.body.velocity.x = 0
                this.player.animations.play('urine_death');
                this.playerDead = true
                this.enemy.body.velocity.x = 0
                this.enemy.animations.play('idle')
                this.levelSong.pause()
                this.gameOverSong.play()

                this.gameOver = this.game.add.sprite(400, 300 - 150, 'game_over');
                this.gameOver.anchor.set(0.5, 0.5)
                this.gameOver.fixedToCamera = true;
                //this.widthLife.width = this.totalLife;

                this.retrybutton = this.game.add.button(400, 300, 'donebtn', this.retry, this, 1, 0, 1);
                this.retrybutton.anchor.set(0.5, 0.5);
                this.retrybutton.fixedToCamera = true;
            }
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
            this.gameOver.anchor.set(0.5, 0.5)
            this.gameOver.fixedToCamera = true;
            //this.widthLife.width = this.totalLife;

            this.retrybutton = this.game.add.button(400 + 150, 300 + 150, 'donebtn', this.retry, this, 1, 0, 1);
            this.retrybutton.anchor.set(0.5, 0.5);
            this.retrybutton.fixedToCamera = true;
        } else {
            this.game.add.tween(this.widthLife).to({
                    width: (this.widthLife.width - (this.totalLife / 20))
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

    collect: function (player, coin) {
        coin.kill()
        coin.destroy()
        //this.coins.remove(coin)

        this.collectedCoin = collectedCoins.create(700 + (30 * this.coinsAmount), 60, 'coinsCollected');
        this.game.physics.arcade.enable(this.collectedCoin, Phaser.Physics.ARCADE);
        this.collectedCoin.anchor.setTo(0.5, 0.5)
        this.collectedCoin.body.allowGravity = false
        this.collectedCoin.body.immovable = true
        this.collectedCoin.fixedToCamera = true

        //increase the amount of coins
        this.coinsAmount += 1
    },

    createTrain: function (x, y) {
        this.train = this.game.add.sprite(x, y, 'trainLeft');
        this.game.physics.arcade.enable(this.train, Phaser.Physics.ARCADE);
        this.train.animations.add('close', [0, 2], 1, false);
        this.train.animations.add('open', [2, 1], 1, false);
        this.train.animations.play('open');
    },

    createSignBoards: function (x, y) {
        this.signBoards = this.game.add.group();
        this.signBoards.enableBody = true

        for (this.i = 0; this.i < 4; this.i++) {
            this.signBoard = this.signBoards.create(this.i * x, y, 'signBoard')

            this.signBoard.animations.add('anime', null, 40, true)
            this.signBoard.animations.play('anime')
        }

    },
    createVendingMachine: function (x, y) {
        this.vending = this.game.add.sprite(x, y, 'vendingMachine');
        this.game.physics.arcade.enable(this.vending, Phaser.Physics.ARCADE);
        this.vending.collideWorldBounds = true;
        this.vending.animations.add('vendingAnim', null, 12, true)
        this.vending.animations.play('vendingAnim')
    },

    createToilet: function (x, y) {
        this.toilet = this.game.add.sprite(x, y, 'toilet')
        this.game.physics.arcade.enable(this.toilet, Phaser.Physics.ARCADE);
        this.toilet.animations.add('toiletLive', [0, 1, 2, 3, 4, 5, 6, 7], 5, true)
        this.toilet.animations.play('toiletLive')
    },
    createPlayer: function (x, y) {
        this.player = this.game.add.sprite(x, y, 'exitar');
        this.game.physics.arcade.enable(this.player, Phaser.Physics.ARCADE);
        this.player.body.gravity.y = 1400;
        this.player.body.velocity.x = 0
        this.player.body.collideWorldBounds = true;
        this.player.body.checkCollision.up=false

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
        this.player.animations.add('urine_death', [108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120], 10, false)
        this.player.animations.add('still', [50, 51], 2, true);
    },
    createEnemy: function (x, y) {
        this.enemy = this.game.add.sprite(x, y, 'enemy')
        this.game.physics.arcade.enable(this.enemy, Phaser.Physics.ARCADE)
        this.enemy.body.gravity.y = 1400
        this.enemy.body.collideWorldBounds = true;
        this.enemy.body.velocity.x=100

        this.enemy.animations.add('run_right', [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19], 10, true);
        this.enemy.animations.add('run_left', [21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34], 10, true)
        this.enemy.animations.add('jump_right', [0, 1, 2, 3, 4, 5, 6], 7, false)
        this.enemy.animations.add('jump_left', [35, 36, 37, 38, 39, 40, 41], 7, false)
        this.enemy.animations.add('kill', [5, 6], 1, false);
        this.enemy.animations.add('idle', [45, 46], 2, true)
        this.enemy.animations.play('idle')
    },
    createHealth: function () {
        this.health = this.game.add.bitmapData(260, 25);
        this.health.ctx.beginPath();
        this.health.ctx.rect(70, 10, 200, 40);
        this.health.ctx.lineJoin = "round"
        this.health.ctx.lineWidth = 200;
        this.health.ctx.fillStyle = '#00685e'
        this.health.ctx.fill();

        this.hp = this.game.add.sprite(10, 8, this.health);
        this.hp.fixedToCamera = true;

        this.stamina = this.game.add.sprite(10, 28, this.health);
        this.stamina.fixedToCamera = true;

        this.urineLevel = this.game.add.sprite(10, 45, this.health);
        this.urineLevel.fixedToCamera = true;

        //==================Health gauge===============================

        this.healthbar = this.game.add.bitmapData(200, 25);
        this.healthbar.ctx.beginPath();
        this.healthbar.ctx.rect(70, 10, 200, 40);
        this.healthbar.ctx.lineJoin = "round"
        this.healthbar.ctx.lineWidth = 200;
        this.healthbar.ctx.fillStyle = '#FF0000';
        this.healthbar.ctx.fill();


        this.healthLife = new Phaser.Rectangle(70, 10, 200, 18);
        this.totalhealth = this.healthbar.width

        this.life = this.game.add.sprite(70, 15, this.healthbar);
        this.life.cropEnabled = true;
        this.life.crop(this.healthLife);
        this.life.fixedToCamera = true;


        this.game.add.text(280, 15, 'Health', {
            font: '15px Comicbd',
            fill: '#fff'
        }).fixedToCamera = true


        //===============Thirst gauge==============================
        this.thirstbar = this.game.add.bitmapData(200, 25);
        this.thirstbar.ctx.beginPath();
        this.thirstbar.ctx.rect(70, 10, 200, 40);
        this.thirstbar.ctx.lineJoin = "round"
        this.thirstbar.ctx.lineWidth = 200;
        this.thirstbar.ctx.fillStyle = '#35F2DA';
        this.thirstbar.ctx.fill();

        this.widthLife = new Phaser.Rectangle(70, 10, 200, 18);
        this.totalLife = this.thirstbar.width;

        this.thirst = this.game.add.sprite(70, 35, this.thirstbar)
        this.thirst.cropEnabled = true;
        this.thirst.crop(this.widthLife);
        this.thirst.fixedToCamera = true;

        this.game.add.text(280, 35, 'Thirst', {
            font: '15px Comicbd',
            fill: '#fff'
        }).fixedToCamera = true

        //==============Urine Gauge=================================
        this.urinebar = this.game.add.bitmapData(200, 25);
        this.urinebar.ctx.beginPath();
        this.urinebar.ctx.rect(70, 10, 200, 40);
        this.urinebar.ctx.lineJoin = "round"
        this.urinebar.ctx.lineWidth = 200;
        this.urinebar.ctx.fillStyle = '#fff700';
        this.urinebar.ctx.fill();

        this.urineLife = new Phaser.Rectangle(70, 10, 1, 18);
        this.totalUrine = this.urinebar.width;

        this.urine = this.game.add.sprite(70, 53, this.urinebar)
        this.urine.cropEnabled = true;
        this.urine.crop(this.urineLife);
        this.urine.fixedToCamera = true;

        this.game.add.text(280, 55, 'Urine', {
            font: '15px Comicbd',
            fill: '#fff'
        }).fixedToCamera = true

    },
    createProfile: function () {
        this.profile = this.game.add.image(0, 0, 'profile')
        this.profile.fixedToCamera = true
    },
    createCoins: function (x, y) {
        this.coins = this.game.add.group()
        this.coins.enableBody = true
        for (var i = 1; i <= 1; i++) {
            this.coin = this.coins.create(i * x, y, 'coins')
            this.coins.callAll('animations.add', 'animations', 'rotate', [0, 1, 2, 3], 4, true);
            this.coins.callAll('animations.play', 'animations', 'rotate');
        }
    },
    createPlatforms: function () {
        this.platforms = this.game.add.physicsGroup();
        this.splipperyWarning = this.game.add.sprite(1450, 520, 'slipperywarning')
        this.bucket = this.game.add.sprite(1700, 500, 'bucket')

        this.platforms.create(1500, 575, 'splash')
        this.platforms.setAll('body.allowGravity', false);
        this.platforms.setAll('body.immovable', 'true')
    },

    go: function () {
        this.player.alpha=0;
        this.player.position.x-=200
        this.player.kill()
        this.playerDead = true
        this.train.animations.play('close')
        this.enemy.body.velocity.x = 0;
        this.enemy.animations.play('idle')
        this.win()
        this.train.body.velocity.x =-100;
        this.game.time.events.add(4000, this.done, null, this);
    },

    done: function () {
            //console.log("done function")
            this.retrybutton = this.game.add.button(400, 300 - 150, 'donebtn', this.retry, this, 1, 0, 1);
            this.retrybutton.anchor.set(0.5, 0.5);
            this.retrybutton.fixedToCamera = true;

            this.menubutton = this.game.add.button(400, 300 - 20, 'donebtn', this.menu, this, 5, 4, 5);
            this.menubutton.anchor.set(0.5, 0.5);
            this.menubutton.fixedToCamera = true;

            this.nextlevelbutton = this.game.add.button(400, 300 + 130, 'donebtn', this.nextLevel, this, 3, 2, 3);
            this.nextlevelbutton.anchor.set(0.5, 0.5);
            this.nextlevelbutton.fixedToCamera = true;
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


    retry: function () {

        this.game.state.start('Level3')

        this.destroy()
    },

    menu: function () {
        this.levelSong.pause()
        this.winSong.pause()
        this.gameOverSong.pause()
        this.game.state.start('MainMenu')
        this.destroy()
    },

    level: function () {
        this.levelSong.pause()
        this.winSong.pause()
        this.gameOverSong.pause()
        this.game.state.start('levels');
        this.destroy()
    },

    nextLevel: function () {
        this.levelSong.pause()
        this.winSong.pause()
        this.gameOverSong.pause()
        this.game.state.start('Level4');

        this.destroy()
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
        Level3.cache = new Phaser.Cache(Level2)
        Level3.load.reset()
        Level3.load.removeAll()
        //Level2.destroy()
    },


    killText: function () {
        this.broke.alpha = 0
    },
    win: function () {
        this.levelSong.pause()
        this.song = false
        this.time.events.add(1000, this.my_time, this)
        this.winSong.play()
    },
    killPlayer: function () {
        this.player.body.velocity.x = 0
        this.player.animations.play('dying')
        
        this.playerDead = true
this.gameOver = this.game.add.sprite(430, 300, 'game_over');
        this.gameOver.anchor.set(0.5, 0.5)
        this.gameOver.fixedToCamera = true;
        //---------------retry button-----------------------------------
        this.retrybutton = this.game.add.button(400, 300 - 150, 'donebtn', this.retry, this, 1, 0, 1);
        this.retrybutton.anchor.set(0.5, 0.5);
        this.retrybutton.fixedToCamera = true;

    },
/*
    render: function () {
         this.game.debug.text("distance:" + this.game.physics.arcade.distanceToXY(this.player, 744, 510), 32, 32);
     },
*/

};