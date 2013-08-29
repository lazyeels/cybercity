function Sprite(image, offsetX, offsetY, cellWidth, cellHeight, frameCount, description, zIndex){
	this.image = image;
	this.widthofimage = cellWidth;
	this.heightofimage = cellHeight;
	this.description = description; 
	this.zIndex = zIndex;
	this.offsetX = offsetX;
	this.offsetY = offsetY;
        this.x = 0;
        this.y = 0;
	this.frameCount = frameCount;
};



Sprite.prototype.updateAnimation = function(dt, action, fps){
    // Update using function setAnimation(image, offsetX for sequence in spritesheet, offsetY for sequence in spritesheet, frameCount, fps)
    this.animation.state._current = this.animation.state.LOOP;
    this.animation.set(this.animation.action[action], fps);
    this.animation.update(dt);
};

