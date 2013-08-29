function NPC(World){
    // Init
    this.world = World;
    this.game = World.game;
    this.player = this.world.player;
    this.rifle = new Bullet(this);  
    this.speed = 5;
    this.width = 16;
    this.height = 32;
    this.radius = 16;
    this.color = "pink";
    this.eye_color = "black"; 
    this.color_clothes = "blue";
    this.blink = 0;    
    var startX = 100;
    var startY = 100;
    this.x = startX;
    this.y = startY

    this.health = 100;
    // Animation
    var image = new Image();
    image.src = 'img/NPC.png';
    this.state = {
        _current: 0,
        ALIVE: 0,
        DEAD: 1,
    }
 
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
    this.sprite = sprites;

    // Collision
    var size = 5;
    this.AABB = {}
    this.AABB['center'] = {x: 0, y: 0};
    this.AABB['left'] = {x: 0 - (this.sprite.widthofimage/2) + (size/2), y: 0};
    this.AABB['right'] = {x: 0 + (this.sprite.widthofimage/2) - (size), y: 0};
    this.AABB['top'] = {x: 0, y: 0 - (this.sprite.heightofimage/2) + (size/2)+8};
    this.AABB['bottom'] = {x: 0, y: 0 - (this.sprite.heightofimage/2) - (size/2)};
    this.idle = true
    NPC.superclass.constructor.call(this, 'NPC', startX, startY, sprites);
};
extend(NPC, Entity);

NPC.prototype.checkCollisions = function(xScroll, yScroll){
    var distance = Math.abs(this.game.player.x - (this.x));
    console.log(this.x, distance, this.facingright, this.facingleft)
};

NPC.prototype.Init = function(tilemap, startX, startY){
    this.current_level = tilemap;
    this.x = startX || this.x;
    this.y = startY || this.y;
    console.log('Initiating:', this.name, this.current_level);
    this.state._current = this.state.ALIVE;
};

NPC.prototype.update = function(dt, xScroll, yScroll){    
    if(this.state._current != this.state.DEAD){
        this.updateAnimation();
    } else {
        Game.state.Change('Success');
    }
};


NPC.prototype.draw = function(dt, context, xScroll, yScroll){
    if(this.update_required){
        context.save();
//        context.translate(this.x + this.sprite.widthofimage/2 - xScroll, this.y - yScroll);
//        this.sprite.Play(context);
    // Draw Player
    context.translate(((this.x - this.width/2)-xScroll), (this.y - (this.height/2)+6)-yScroll);
    context.strokeRect(0, 0, this.width, this.height);
    context.fillStyle = this.color;
    context.fillRect(0, 0, this.width, this.height);
    context.fillStyle = this.color_clothes;
    context.fillRect(0, this.height/2, this.width, this.height/2);

    // Looking right
    if(this.right){
        context.fillStyle = this.eye_color;
        context.fillRect(this.width - 6, 5, 5, 5);
    } else 
    // Looking left
    if(this.left){
        context.fillStyle = this.eye_color;
        context.fillRect(1, 5, 5, 5);
    } else
    // Looking forward
    if(this.down){
        context.fillStyle = this.eye_color;
        context.fillRect(2, 5, 5, 5);
        context.fillRect(9, 5, 5, 5);
    } else if(this.up){

    } else {
        if(this.blink<32){
            context.fillStyle = this.eye_color;
            context.fillRect(2, 5, 5, 5);
            context.fillRect(9, 5, 5, 5);
        } else {
            this.blink = 0;
        }
    }
    this.blink += (dt *10);

        context.restore();
        this.update_required = false;
    }
    context.restore();
};

