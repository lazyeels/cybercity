/* Class Entity. */
function Entity(name, startX, startY, sprites) {
    this.name = name;
    this.x = startX || 0;
    this.y = startY || 0;
    this.speed = 5;
    this.width = 16;
    this.height = 32;
    this.radius = 16;
    this.color = "pink";
    this.eye_color = "black"; 
    this.blink = 0;
    // Physics variables
    this.vx = 0;
    this.vy = 0;

    // Key detection
    this.right = false;
    this.left = false;
    this.up = false;
    this.down = false;
    this.facingleft = false;
    this.facingright = false;
    this.idle = true;

    this.sprite = sprites || {};

    this.inventory = [];
    this.update_required = true;
    this.friction = 0.1;
    this.gravity = -6;
    this.sprite.set(this.sprite.action['idle'], 1);

    this.state = {
        _current: 0,
        ALIVE: 0,
        DEAD: 1,
    }
    // Collision
    var size = 5;
    this.AABB = {}
    this.AABB['center'] = {x: 0, y: 0};
    this.AABB['left'] = {x: 0 - (this.sprite.widthofimage/2) + (size/2), y: 0};
    this.AABB['right'] = {x: 0 + (this.sprite.widthofimage/2) - (size), y: 0};
    this.AABB['top'] = {x: 0, y: 0 - (this.sprite.heightofimage/2) + (size/2)+8};
    this.AABB['bottom'] = {x: 0, y: 0 - (this.sprite.heightofimage/2) - (size/2)};

    console.log('Creating:', this.name, 'at', this.x, this.y);
};

Entity.prototype.Init = function(tilemap, startX, startY){
    this.current_level = tilemap;
    this.x = startX || this.x;
    this.y = startY || this.y;
    this.state._current = this.state.ALIVE;
    console.log('Initiating:', this.name, this.current_level);
};

Entity.prototype.checkCollisions = function(dt){    

};

Entity.prototype.Move = function(vx, vy) {
    this.x += vx;
    this.y += vy;
};

Entity.prototype.update = function(dt, xScroll, yScroll){    
    this.updateAnimation();
    this.getBoundingBox(this.current_level.map, xScroll, yScroll);
    this.checkCollisions(this.current_level.tiletype);
};

Entity.prototype.updateAnimation = function(){
    // Update using function setAnimation(image, offsetX for sequence in spritesheet, offsetY for sequence in spritesheet, frameCount, fps)
    if (this.state._current == this.state.DEAD){
        this.sprite.state._current = this.sprite.state.PLAYONCE;
        this.sprite.set(this.sprite.action['die'], 30);
    } else if(this.idle){
        if(this.facingleft){
            this.sprite.state._current = this.sprite.state.LOOP;
            this.sprite.set(this.sprite.action['look_left'], 30);
        } else if(!this.facingleft){
            this.sprite.state._current = this.sprite.state.LOOP;
            this.sprite.set(this.sprite.action['look_right'], 30);
        } else {
            this.sprite.state._current = this.sprite.state.LOOP;
            this.sprite.set(this.sprite.action['idle'], 30);
        }
    } else if (this.right || this.keys['right']){
        this.sprite.state._current = this.sprite.state.LOOP;
        this.sprite.set(this.sprite.action['move_right'], 30);
    } else if (this.left || this.keys['left']){
        this.sprite.state._current = this.sprite.state.LOOP;
        this.sprite.set(this.sprite.action['move_left'], 30);
    } else if (this.up){
        if(this.climbing){
        this.sprite.state._current = this.sprite.state.LOOP;
        this.sprite.set(this.sprite.action['move_up'], 30);
        } else
        if(this.facingleft){
            this.sprite.state._current = this.sprite.state.LOOP;
            this.sprite.set(this.sprite.action['move_left'], 30);
        } else if(!this.facingleft){
            this.sprite.state._current = this.sprite.state.LOOP;
            this.sprite.set(this.sprite.action['move_right'], 30);
        } 
    } 
    if (this.down){
        if(!this.climbing){
            this.sprite.state._current = this.sprite.state.LOOP;
            this.sprite.set(this.sprite.action['move_down'], 30);
        } 
        if(this.climbing){
            this.sprite.state._current = this.sprite.state.LOOP;
            this.sprite.set(this.sprite.action['move_up'], 30);
        }
    }
    this.update_required = true;
};

Entity.prototype.Fire = function(dt){
    this.rifle.update(dt, this.target);
    this.fire = false;
};


Entity.prototype.draw = function(dt, context, xScroll, yScroll){
    if(this.update_required){
//        context.save();
//        context.translate(this.x + this.sprite.widthofimage/2 - xScroll, this.y - yScroll);
//        this.sprite.Play(context);
//        context.restore();

    context.save();
    context.translate((this.x), (this.y - (this.height/2)+6));

    // Draw Player
    context.strokeRect(0, 0, this.width, this.height);
    context.fillStyle = this.color;
    context.fillRect(0, 0, this.width, this.height);

    context.fillStyle = "grey";
    context.fillRect(0, 20, this.width, 4);

    context.fillStyle = "red";
    context.fillRect(6, 20, 4, 4);


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
        if(this.blink<30){
            context.fillStyle = this.eye_color;
            context.fillRect(2, 5, 5, 5);
            context.fillRect(9, 5, 5, 5);
        } else {
            this.blink = 0;

        }
    }
    this.blink += (dt *10);

    //this.drawPath(context, xScroll, yScroll);
   // this.debug(context);
    context.restore();

    this.update_required = false;
    }
    if(this.rifle){
        this.rifle.draw(dt, context);
    }
};

Entity.prototype.getBoundingBox = function(tilemap, xScroll, yScroll, width, height){
    var size = 5, xOffset = 8, yOffset = 8;
    this.newposition = {x: this.x + this.vx, y: this.y + this.vy};
    this.AABB['center'] = {x: this.x + (this.sprite.widthofimage/2), y: this.newposition.y + this.vy + yOffset};
    this.AABB['left'] = {x: this.x + xOffset, y: (this.newposition.y + (this.sprite.heightofimage/2) - yOffset)};
    this.AABB['right'] = {x: this.x + this.sprite.widthofimage-xOffset, y: (this.newposition.y + (this.sprite.heightofimage/2) - yOffset) + this.vy};
    this.AABB['top'] = {x: this.x + (this.sprite.widthofimage/2), y: (this.newposition.y - (this.sprite.heightofimage/2) + yOffset) - this.vy};    
    this.AABB['bottom'] = {x: this.x + (this.sprite.widthofimage/2), y: (this.newposition.y + (this.sprite.heightofimage/2)-2) + this.vy};

    this.top_tile = utils.getTile(this.AABB['top'], tilemap, xScroll, yScroll, width, height);
    this.center_tile = utils.getTile(this.AABB['center'], tilemap, xScroll, yScroll, width, height);
    this.bottom_tile = utils.getTile(this.AABB['bottom'], tilemap, xScroll, yScroll, width, height);
    this.left_tile = utils.getTile(this.AABB['left'], tilemap, xScroll, yScroll, width, height);
    this.right_tile = utils.getTile(this.AABB['right'], tilemap, xScroll, yScroll, width, height);

 //   console.log(tilemap[Math.floor(this.y/32)], this.top_tile, this.center_tile, this.bottom_tile, this.left_tile, this.right_tile)
};


