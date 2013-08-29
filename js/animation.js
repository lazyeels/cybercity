var Animation = function(Game){
    this.game = Game
    this.currentFrame = 0;
    this.timeBetweenFrames = 0;
    this.frameWidth = 0;
    this.frameCount = 0;
    this.image = undefined;
    this.dt = 0;
    this.timeSinceLastFrame = 0;
    this.action = {};

    this.state = {
        _current: 2,
        PLAYONCE: 0,
        LOOP: 1,
        STOP: 2,
    };
};

Animation.prototype.stop = function(){
    this.state._current = this.state.STOP;
};

Animation.prototype.update = function(dt){
//    this.dt = dt;
};

Animation.prototype.set = function(sprite, fps){
    var fps = 25;
    if(this.state._current != this.state.STOP){
        if (sprite.frameCount <= 0) throw "framecount can not be <= 0";
        if (fps <= 0) throw "fps can not be <= 0"
        this.image = sprite.image;
        this.image.width = sprite.frameCount * (sprite.widthofimage);

        this.widthofimage = sprite.widthofimage;
        this.heightofimage = sprite.heightofimage;

        this.offsetX = sprite.offsetX;
        this.offsetY = sprite.offsetY;

        this.frameCount = sprite.frameCount;
        this.timeBetweenFrames = 3000;
        this.timeSinceLastFrame = this.timeBetweenFrames * this.dt;
        this.frameWidth = this.image.width / sprite.frameCount;
    }
};

Animation.prototype.Play = function(context){
    context.save();
    if(this.state._current == this.state.PLAYONCE){
        if(this.frameCount > 1 && (this.currentFrame+1) == this.frameCount){
            this.stop();
        } else {
            var sourceX = this.frameWidth * this.currentFrame;
            context.drawImage(this.image, 
                sourceX + this.offsetX, 
                this.offsetY, 
                this.frameWidth, 
                this.heightofimage, 
                0 - this.widthofimage/2, 
                0 - this.heightofimage/2, 
                this.frameWidth, 
                this.heightofimage
            );
        this.Tick();
        }
    } 
    if(this.state._current == this.state.LOOP){
        var sourceX = this.frameWidth * this.currentFrame;
        context.drawImage(this.image, 
              sourceX + this.offsetX, 
              this.offsetY, 
              this.frameWidth, 
              this.heightofimage, 
              0 - this.widthofimage/2, 
              0 - this.heightofimage/2, 
              this.frameWidth, 
              this.heightofimage
        );
    this.Tick();
    }
    context.restore();
};

Animation.prototype.Tick = function(){
    //console.log(this.dt, this.currentFrame, this.timeSinceLastFrame, this.timeBetweenFrames)
    var thisFrame = new Date().getTime();
    this.dt = (thisFrame - this.timeSinceLastFrame)/1000;
    this.timeSinceLastFrame = thisFrame;
    this.timeSinceLastFrame -= this.dt;
    if(this.timeSinceLastFrame <= 0){
       this.timeSinceLastFrame = this.timeBetweenFrames;
       ++ this.currentFrame;
       this.currentFrame %= this.frameCount;
    }
};
