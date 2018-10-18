var help = {

    preload: function () {
        this.game.world.setBounds(0, 0, 800, 600);
    },
    create: function () {
        this.background = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'lab')

        this.background.autoScroll(-20, 0);

        this.instructions = this.game.add.image(this.game.world.centerX, this.game.world.centerY - 100, 'instructions')
        this.instructions.anchor.set(0.5, 0.5);
        this.controls = this.game.add.image(this.game.world.centerX, this.game.world.centerY + 100, 'controls')
        this.controls.anchor.set(0.5, 0.5);

        this.goback = this.game.add.button(this.game.world.centerX - 320, this.game.world.centerY - 220, 'goback', this.MainMenu, this, 1, 0, 1);
        this.goback.anchor.set(0.5, 0.5);


    },

    update: function () {},
    MainMenu: function () {
        MainMenu.menuSong.pause()
        this.game.state.start('MainMenu')
    },
};