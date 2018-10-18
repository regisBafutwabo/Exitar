var levels=
{
        init:function(value)
    {
        this.gobackvalue=value;
    },
    preload:function()
        {
            this.game.world.setBounds(0, 0, 800, 608);
    },
    create:function(){
       this.background=this.game.add.tileSprite(0,0,this.game.width,this.game.height,'lab')
        
        //give it speed in x
        this.background.autoScroll(-20, 0);
        
        this.levelsText=this.game.add.text(game.width/2,50,"Select a level", {font:"30px Arial", fill: "#ffffff"})
        this.levelsText.anchor.set(0.5,0.5);
        
        this.goback=this.game.add.button(this.game.world.centerX -320,this.game.world.centerY -220,'goback',this.MainMenu,this,1,0,1);
        this.goback.anchor.set(0.5,0.5);
        
        this.lvl1=this.game.add.button(this.game.world.centerX -100,this.game.world.centerY ,'levelsbtn',this.level1,this,1,0,1);
        this.lvl1.anchor.set(0.5,0.5);
        
        this.lvl2=this.game.add.button(this.game.world.centerX + 200 ,this.game.world.centerY,'levelsbtn',this.level2,this,3,2,3);
        this.lvl2.anchor.set(0.5,0.5);
        
        this.lvl3=this.game.add.button(this.game.world.centerX + 50 ,this.game.world.centerY +150,'levelsbtn',this.level3,this,5,4,5);
        this.lvl3.anchor.set(0.5,0.5);
        //this.menuSong=new Phaser.Sound(game,'menu',1,true);
        
        //MainMenu.menuSong.play();
        
    },
    
    update:function()
{
},
    MainMenu:function()
    {
        if(this.gobackvalue==0)
            {
                MainMenu.menuSong.pause();
                this.game.state.start('MainMenu',true,false,1)
            }
        else if(this.gobackvalue==1)
            {
                this.game.state.start('Level1',true,false)
            }
        else if(this.gobackvalue==2)
            {
                this.game.state.start('Level2',true,false)
            }
        else if(this.gobackvalue==3)
            {
                this.game.state.start('Level3',true,false)
            }
    },
    
    level1:function()
    {
        
        MainMenu.menuSong.pause();
         this.game.state.start('Level1',true,false);
    },
    
    level2:function()
    {
        MainMenu.menuSong.pause();
         this.game.state.start('Level2');
    },

    
    level3:function()
    {
        MainMenu.menuSong.pause();
         this.game.state.start('Level3',true,false);
    }
};