//var Exitar=Exitar || {};

var Boot = {
    init: function () {
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.game.scale.pageAlignHorizontally = true;
        this.game.scale.pageAlignVertically = true;
        this.game.scale.refresh();
    },

    preload: function () {
        //load splashscreen and loader bar
        this.load.image('splashScreen', 'assets/exitar_logo.png');
        this.load.image('preloadBar', 'assets/loader.png')
    },

    create: function () {
        this.game.stage.backgroundColor = '#fff';
        this.state.start('Preload');
    }
};