function Player(World){
    // Init
    this.world = World;
    this.game = this.world.game;
    this.mouse = utils.captureMouse(this.world.canvas);
    this.rifle = new Bullet(this);  
    this.state = {
        _current: 0,
        ALIVE: 0,
        DEAD: 1,
    };  
    // Keyboard Variables
    this.keys = {};
    this.leftKey = 65;
    this.upKey = 87;
    this.rightKey = 68;
    this.downKey = 83;
    this.fireKey = 32;
    this.pauseKey = 80;  //Pause button 'p'

    var startX = 250;
    var startY = 0;

    // Animation
    var image = new Image();
    image.src = 'img/character.png';

    var offsetY = 48,
        width = 32,
        height = 48;

    // image, sourceX, sourceY, sourceWidth, sourceHeight, frameCount, description, zIndex.
    var sprites = new Animation(this.game);
    sprites.action['look_left'] = new Sprite(image, 0, offsetY*1, width, height, 1, "face_left", this.zIndex);
    sprites.action['look_right'] = new Sprite(image, 0, offsetY*2, width, height, 1, "face_right", this.zIndex);
    sprites.action['move_left'] = new Sprite(image, 0, offsetY*1, width, height, 3, "walk_left", this.zIndex);
    sprites.action['move_right'] = new Sprite(image, 0, offsetY*2, width, height, 3, "walk_right", this.zIndex);
    sprites.action['move_up'] = new Sprite(image, 0, offsetY*3, width, height, 3, "walk_up", this.zIndex);
    sprites.action['move_down'] = new Sprite(image, 0, 0, width, height, 3, "walk_down", this.zIndex);
    sprites.action['idle'] = new Sprite(image, 0, 0, width, height, 1, "idle", this.zIndex);

    Player.superclass.constructor.call(this, 'Player', startX, startY, sprites);
};
extend(Player, Entity);

// Update Method
Player.prototype.update = function(dt, xScroll, yScroll){
    if(this.state._current!=this.state.DEAD){
        this.updateAnimation();
        this.getBoundingBox(this.current_level.map, xScroll, yScroll, 32, 32);
        this.checkCollisions(this.current_level.tiletype);
//        this.Friction(dt);
        this.Gravity(dt);
        this.Fire(dt, xScroll, yScroll);
    }
//    console.log(this.current_l//evel.tiletype)
//    console.log(this.speed)
};

Player.prototype.keydown = function (event) {
   // console.log('Pressing', event.keyCode);
    switch (event.keyCode) {
        case this.leftKey: //left
            this.idle = false;
            this.left = true;
            this.facingleft = true;
            this.keys['left'] = true;
            break;          
        case this.rightKey: //right
            this.idle = false;
            this.right = true;
            this.facingleft = false;
            this.keys['right'] = true;
            break;
        case this.upKey: //up
            this.idle = false;
            this.up = true;
            if(this.up && !this.keys['jump']){
                this.keys['jump'] = true;
                this.vy = this.gravity;
            } else if(this.up && this.climbing){
                this.vy = this.speed;
            }
            break;
       case this.downKey: //down
            this.down = true;
            break;
    }
};

Player.prototype.keyup = function (event) {
    switch (event.keyCode) {
        case this.leftKey: //left
            this.left = false;
            this.idle = true;
            this.facingleft = true;
            this.keys['left'] = false;
            break;
        case this.rightKey: //right
            this.right = false;
            this.idle = true;
            this.facingleft = false;
            this.keys['right'] = false;
            break;
        case this.upKey: //up
            this.up = false;
            if(this.climbing){
                this.vy = 0;
            }
            break;
       case this.downKey: //down
            this.down = false;
            break;
    }
};

Player.prototype.checkCollisions = function(tiletype){
    if(utils.getTileType(this.bottom_tile, tiletype) == 'air' || this.bottom_tile == undefined){
        this.vy += 0.5;
    } else if(this.vy != this.gravity){
        this.up = false;
        this.keys['jump'] = false;
        this.vy = 0;
    } else if(this.up && !this.keys['jump'] && !this.climbing){
        this.keys['jump'] = true;
        this.vy = this.gravity;
    } 

    if(this.left && utils.getTileType(this.left_tile, tiletype) != 'ground'|| this.right && utils.getTileType(this.right_tile, tiletype) != 'ground'){
        this.vx = this.speed;
    } else {
        this.vx = 0;
    }

    if(utils.getTileType(this.top_tile, tiletype) == 'ground' && utils.getTileType(this.bottom_tile, tiletype) == 'air'){
        this.vy += 0.1;
        this.newposition.y = this.y;
    }

    if(utils.getTileType(this.top_tile, tiletype) == 'ground' && utils.getTileType(this.bottom_tile, tiletype) == 'ground'){
        this.vy = 0;
        this.newposition.y = this.y;
    } else

    if(utils.getTileType(this.center_tile, tiletype) == 'ground'){
        this.vy += 1;
    } else
    if(utils.getTileType(this.left_tile, tiletype) == 'ground' && utils.getTileType(this.right_tile, tiletype) == 'ground' && utils.getTileType(this.bottom_tile, tiletype) == 'ground'){
        this.vy += 1;
    }

    if(this.up && utils.getTileType(this.center_tile, tiletype) == 'ladder'){
        this.climbing = true;
    } else if(this.down && utils.getTileType(this.bottom_tile, tiletype) == 'ladder' && utils.getTileType(this.bottom_tile, tiletype) != 'ground'){
        this.climbing = true;
        this.vy = 2;
    } 
    if(this.down && utils.getTileType(this.center_tile, tiletype) == 'ladder' && utils.getTileType(this.bottom_tile, tiletype) == 'ground'){
        this.climbing = false;
        this.vy = 0;
    }
    
    // Check for falling off map and restart if so.
//    if(this.y > 3000){
//        this.game.Init();
//    }

    this.update_required = true;  
};

Player.prototype.Fire = function(dt, xScroll, yScroll){
    this.rifle.update(dt, this.world.npc, this.current_level.map, xScroll, yScroll);
    this.fire = false;
};

Player.prototype.Gravity = function(dt){
    this.y += this.vy;
};

Player.prototype.Friction = function(dt){
    if (this.speed > this.friction) {
        this.speed -= this.friction;
    } else {
        this.speed = 0;
    }
    if(this.vy > 0){
        this.speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        this.angle = Math.atan2(this.vy, this.vx);
        this.vx = Math.cos(this.angle) * this.speed;
        this.vy = Math.sin(this.angle) * this.speed;
    } else {
        this.speed = 5;
    }
};


