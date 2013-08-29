var Death = function(Game, entity){
    this.entity = entity;
    this.game = Game;
    this.pxs = new Array();
};

Death.prototype.Init = function(fps){
    for(var i = 0; i < 25; i++) {
  	    this.pxs[i] = new Circle();
	    this.pxs[i].reset(this.entity.x, this.entity.y);
    } 
};

Death.prototype.draw = function(dt, context){
    for(var i = 0; i < this.pxs.length; i++) {
        if(this.pxs[i].fadetime > 0.1){
            this.pxs.slice(i, 1);
        } else {
            this.pxs[i].move(dt);
   	        this.pxs[i].draw(dt, context, this.game.xScroll, this.game.yScroll);
        }
    }
};

function Circle() {
    this.reset = function(x, y) {
		this.x = x;
		this.y = y;
        this.fadetime = 0;
        this.friction = {x: 100, y: 0};
		this.r = 2
		this.vel = {x: 2, y: -5};
        this.lifetime = 2;
        this.maxVel = {x: 5, y: 5};
        this.Init();
    }

    this.Init = function(){
        this.vel.x = (Math.random() * 2 +1) * this.vel.x;
        this.vel.y = (Math.random() * 2 +1) * this.vel.y;
        this.alpha = (Math.random() * 1);
    };

    this.draw = function(dt, context, xScroll, yScroll) {
		context.fillStyle = 'rgba(255,0,0,'+this.alpha+')';	
		context.fillRect(this.x - xScroll, this.y - yScroll, this.r, this.r);
    };

    this.move = function(dt) {
        this.fadetime += dt;
        this.x += this.vel.x;
        this.y += this.vel.y;
    };
};
