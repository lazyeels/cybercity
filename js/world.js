var World = function(Game){
    this.game = Game;    
    this.friction = 0.1;
    this.gravity = -6;
    this.canvas = this.game.canvas;
    this.player = new Player(this);
    this.particles = new ParticleSys(this.game, this.player);
    this.particles.Init(undefined, 'red'); 
    this.npc = new NPC(this);
    this.sky = new Image();
    this.sky.src = 'img/sky.png';

    this.state = {
        _current: 0,
        DEFAULT: 0,
        CHANGE: 1,
        GAMEOVER: 2,
    }

    // Set up layers for tilemap i.e. background and foreground.
    var tileset = new Image(),
        objects = new Image(),
        layers = [];

    tileset.src = "img/terrain.png";
    objects.src = "img/foreground.png";

    layers.push({name: 'foreground', map: world.map[2], tileset: tileset});
    layers.push({name: 'objects', map: world.map[3], tileset: objects});

    this.level = new Level_Class(this.game);
    this.level.Init(layers);

    this.Init();
};

World.prototype.Init = function(){
    this.npc.Init(this.level, this.level.npc.x, this.level.npc.y);
    this.npc.color_clothes = this.game.npc_color;
    this.player.Init(this.level);
    this.player.state._current == this.player.state.IDLE;
    this.state._current = this.state.DEFAULT;
    this.time = 0;    
};

World.prototype.update = function(dt){
    if(this.state._current!= this.state.GAMEOVER){
        this.level.update(dt,0,0);
        this.npc.update(dt, this.level.scroll.x, this.level.scroll.y);
        this.player.update(dt, this.level.scroll.x, this.level.scroll.y);

        if(this.player.keys['left']){
            this.level.scroll.x -= this.player.vx;
        }
        if(this.player.keys['right']){
            this.level.scroll.x += this.player.vx;
        }

        this.level.scroll.y += this.player.vy;
        this.Timer(dt);


        if(this.time==10 && this.player.state._current!=this.player.state.DEAD){
            this.player.state._current = this.player.state.DEAD;
        }

        if(this.player.y>3000){
            this.player.state._current == this.player.state.DEAD
        }

        if(this.player.state._current == this.player.state.DEAD){
            if(this.particles.pxs.length == 0){
                this.state._current = this.state.GAMEOVER;
            } else {
                this.particles.update(dt, 0, 0);
            }
        }

    } else {
        Game.state.Change('GameOver');
    }
};

World.prototype.draw = function(dt, context){
    context.drawImage(this.sky, 0, 0, this.game.canvas.width, 250);
    this.level.draw(dt, context, 0, 0);
    this.npc.draw(dt, context, this.level.scroll.x, this.level.scroll.y);
    this.player.draw(dt, context, 0, 0);
    $('#timer').html("Time: " + parseInt(this.time) + " secs");
    if(this.player.state._current == this.player.state.DEAD){
        this.particles.draw(dt, context, this.level.scroll.x, this.level.scroll.y);
    }
};

World.prototype.OnEnter = function(params){
    $('#content').html('');
    $('#canvas').css('background-color', '#2898d8');
    $('#timer').show();
    this.Init();
    this.player = new Player(this);
    this.player.Init(this.level);
    // Set up layers for tilemap i.e. background and foreground.
    var tileset = new Image(),
        objects = new Image(),
        layers = [];

    tileset.src = "img/terrain.png";
    objects.src = "img/foreground.png";

    layers.push({name: 'foreground', map: world.map[2], tileset: tileset});
    layers.push({name: 'objects', map: world.map[3], tileset: objects});

    this.level = new Level_Class(this.game);
    this.level.Init(layers);

};

World.prototype.OnExit = function(params){
    $('#timer').hide();
    this.player.bullets = [];
};

World.prototype.keydown = function(e){
    if(this.state._current == this.state.GAMEOVER){
        this.Init();
    } else {
        this.player.keydown(e);
    }
};

World.prototype.keyup = function(e){
    this.player.keyup(e);
};


World.prototype.debug = function(context, entity){
    context.fillStyle="red"
    var size = 5;
    // Middle
    context.fillRect(entity.AABB['center'].x, entity.AABB['center'].y, size, size)
    // Left
    context.fillRect(entity.AABB['left'].x, entity.AABB['left'].y, size, size);
    // Right
    context.fillRect(entity.AABB['right'].x, entity.AABB['right'].y, size, size);
    // Top
    context.fillRect(entity.AABB['top'].x, entity.AABB['top'].y, size, size);
    // Bottom
    context.fillText("Top: "+utils.getTileType(entity.top_tile, this.level.tiletype), 220, 50);
    context.fillText("center: "+utils.getTileType(entity.center_tile, this.level.tiletype), 220,100);
    context.fillText("Left: " + utils.getTileType(entity.left_tile, this.level.tiletype), 150,100);
    context.fillText("Right: "+utils.getTileType(entity.right_tile, this.level.tiletype), 290,100);
    context.fillText("Bottom: "+utils.getTileType(entity.bottom_tile, this.level.tiletype), 220,150);
    context.fillText("x: "+this.player.x, 10,10);
    context.fillText("y: "+this.player.y, 10,20);
    context.fillText("Tilex: "+Math.floor(this.player.x/32), 10,30);
    context.fillText("Tiley: "+Math.floor(this.player.y/32), 10,40);
    context.fillText("xScroll: "+this.level.scroll.x, 10,50);
    context.fillText("yScroll: "+this.level.scroll.y, 10,60);

};

World.prototype.Timer = function(dt){
    if (this.time >= 10) {
        this.player.state._current = this.player.state.DEAD; 
    } else {
        this.time += dt;
    }
};
