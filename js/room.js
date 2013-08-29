var Room = function(Game){
    this.game = Game;    
    this.state = {
        _current: 0,
        DEFAULT: 0,
        CHANGE: 1,
        GAMEOVER: 2,
    }
    this.ID = 2;
    this.level = new Level_Class(this.game);
};

Room.prototype.Init = function(ID, startX, startY, xScroll, yScroll){
    this.ID = ID;
    // Set up layers for tilemap i.e. background and foreground.
    var tileset = new Image(),
        layers = [];
    tileset.src = "img/terrain.png";

    layers.push({name: 'foreground', map: rooms[this.ID].map, tileset: tileset});
    this.level.Init(layers);
    
    this.state._current = this.state.DEFAULT;
    this.player.Init(this.level);
    this.player.x = startX;
    this.player.y = startY;
    this.level.scroll.x = xScroll//-((this.player.x + (startX*32)) + this.game.canvas.width)/32;
    this.level.scroll.y = yScroll //(startY) - (this.game.canvas.height/32)//-((this.player.y + (startY*32)) + this.game.canvas.height)/32;
    console.log("MOVING TO:", this.ID, this.level.scroll.x, this.level.scroll.y);
};

Room.prototype.update = function(dt){
//    if(this.ID=='3'){this.player.vy=0, this.player.gravity=0}
    if(this.state._current!== this.state.GAMEOVER){
        this.level.update(dt,0,0);
        this.player.update(dt, this.level.scroll.x, this.level.scroll.y);

        if(this.player.keys['left']){
            this.level.scroll.x -= this.player.vx;
        }
        if(this.player.keys['right']){
            this.level.scroll.x += this.player.vx;
        }

        this.centerY = this.player.y - (this.game.canvas.height/2);
        var offsetY = this.centerY; // Important - keep to put player at bottom left of screen
        this.level.scroll.y = offsetY;
        this.checkRoom(this.ID);
    }
};

Room.prototype.checkRoom = function(ID){
    this.ID = ID;
    // Check doors to rooms and world
    var current_tile = utils.getTileType(this.player.center_tile, this.level.tiletype);
    if(current_tile = 'door'){            
        var roommap = rooms[this.ID].trigger;
        var x = Math.floor((this.player.x+this.level.scroll.x)/32);
        var y = Math.floor((this.player.y+this.level.scroll.y)/32);
        if(x>=0 && y>=0){
        var roomID = roommap[x][y];

        if(roomID>0 && roomID!="W"){
            this.Init(roomID, (this.game.canvas.width/2), 222, -((this.game.canvas.width/2) - 32), 128);
        } else if(roomID=="W"){
            Game.state.Change('world', {player: this.player, level: this.world, x: this.startX, y: this.startY}); 
        }
        }
    }
//                    this.Init(doorCoords.ID, (this.game.canvas.width/2), (this.game.canvas.height/2), -((this.game.canvas.width/2) - 32), -(250-((doorCoords.y*32)+32)));
//                    this.Init(doorCoords.ID, (this.game.canvas.width/2), (this.game.canvas.height/2), -((this.game.canvas.width/2) - 32), -(doorCoords.y * 32));
};

Room.prototype.draw = function(dt, context){
    this.level.draw(dt, context, 0, 0);
    this.player.draw(dt, context, 0, 0);
    this.debug(context, this.player);
};

Room.prototype.OnEnter = function(params){
    if(params){
        this.player = params.player;
        this.world = params.level; // capture previous level scrollx and scrolly settings for return journey.
        this.startX = this.player.x;
        this.startY = this.player.y;
        var coords = params.coords; 
        this.ID = params.doorID;
        this.Init(this.ID, (this.game.canvas.width/2), (this.game.canvas.height/2)-96, -((this.game.canvas.width/2) - 32), 0);
    }
};

Room.prototype.OnExit = function(params){
    
};

Room.prototype.keydown = function(e){
    if(this.state._current == this.state.GAMEOVER){
        this.Init();
    } else {
        this.player.keydown(e);
    }
};

Room.prototype.keyup = function(e){
    this.player.keyup(e);
};


Room.prototype.debug = function(context, entity){
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
    context.fillRect(entity.AABB['bottom'].x, entity.AABB['bottom'].y, size, size);
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
