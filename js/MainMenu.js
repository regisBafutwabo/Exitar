var MainMenu=
{
    
     init:function(value)
    {
        this.playSong=value;
    },
        
    preload:function()
        {
            this.game.world.setBounds(0, 0, 800, 600);
    },
    create:function(){
        this.background=this.game.add.tileSprite(0,0,this.game.width,this.game.height,'lab')
        
        //give it speed in x
        this.background.autoScroll(-20, 0);
        
        this.sound=this.game.add.sprite(730,10,'mute');
        //this.game.physics.arcade.enable(this.sound, Phaser.Physics.ARCADE);
        this.sound.inputEnabled=true;
        this.sound.events.onInputDown.add(this.mute,this)
        this.sound.animations.add('play',[0],1,false)
        this.sound.animations.add('stop',[1],1,false)
        
        
        this.play=this.game.add.button(this.game.world.centerX,this.game.world.centerY -180,'buttons',this.level1,this,1,0,1);
        this.play.anchor.set(0.5,0.5);
        
        this.lvls=this.game.add.button(this.game.world.centerX,this.game.world.centerY + -50,'buttons',this.levels,this,3,2,3);
        this.lvls.anchor.set(0.5,0.5);
        
        this.hlp=this.game.add.button(this.game.world.centerX,this.game.world.centerY + 85,'buttons',this.help,this,5,4,5);
        this.hlp.anchor.set(0.5,0.5);
        
        this.abt=this.game.add.button(this.game.world.centerX,this.game.world.centerY + 220,'about',this.about,this,0,1,0);
        this.abt.anchor.set(0.5,0.5);
        this.muteSong=false;
        
        this.menuSong=new Phaser.Sound(game,'menu',1,true);
        this.menuSong.play();
        
    },
    update:function()
    {
        
    },
    
    level1:function()
    {
        this.menuSong.pause();
        this.game.state.start('Level1',true,false);
    },
    levels:function()
    {
        //this.menuSong.pause();
        this.game.state.start('levels',true,false,0);
    },
    help:function()
    {
        //this.menuSong.pause()
        this.game.state.start('help',true,false);
    },
    about:function()
    {
        //this.menuSong.pause()
        this.game.state.start('about',true,false);
    },
    mute:function()
    {
        console.log("clicked")
        if(this.muteSong==false)
            {
                this.sound.animations.play('play')
                this.menuSong.pause()
                this.muteSong=true
            }
        else if(this.muteSong==true){
            this.sound.animations.play('stop')
            this.menuSong.play()
            this.muteSong=false
        }
       
        
    }

};