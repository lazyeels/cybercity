var ParticleSys = function(Game, entity){
    this.entity = entity;
    this.game = Game;
};

ParticleSys.prototype.Init = function(entity, color){
    this.pxs = new Array();
    this.entity = entity || {x: 250, y: 250};
    if(this.pxs.length < 5 ){
        for(var i = 0; i < 50; i++) {
  	        var part = new Circle();
	        part.reset(this.entity.x, this.entity.y, color, Math.random());
            this.pxs.push(part);   
        } 
    }
};

ParticleSys.prototype.update = function(dt){
    for(var i = 0; i < this.pxs.length; i++) {
        if(this.pxs[i].fadetime > 4){
            this.pxs.splice(i, 1);
        } else {
            this.pxs[i].move(dt);
        }
    }
};


ParticleSys.prototype.draw = function(dt, context, xScroll, yScroll){
    for(var i = 0; i < this.pxs.length; i++) {
        this.pxs[i].draw(dt, context, xScroll, yScroll);
    }
};

function Circle() {
    this.reset = function(x, y, color, size) {
		this.x = x;
		this.y = y;
        this.color = color || 'red';
        this.fadetime = 0;
        this.friction = {x: 100, y: 0};
		this.vel = {x: Math.random()*1, y: 2};
        this.lifetime = 2;
        this.size = 64 * size || 64;
        this.maxVel = {x: 1, y: 1};
        this.image = new Image();
        this.image.src = "img/blossom.png";
        this.choice = choice([0,1,2,3]);
        this.Init();
    }

    this.Init = function(){
        this.vel.x = (Math.random() * 20) * this.vel.x;
        this.vel.y = (Math.random() * 10 -1) * this.vel.y;
        this.alpha = (Math.random() * 1);
    };

    this.draw = function(dt, context, xScroll, yScroll) {
        //var size = Math.random();
        context.save();
        context.globalAlpha = this.alpha;
        context.drawImage(
            this.image,
            64 * this.choice,
            0,
            64,
            64,
            this.x + (xScroll/32),
            this.y + (yScroll/32),
            this.size,
            this.size
        )
        context.restore();
    };
 
    this.move = function(dt) {
        this.fadetime += dt;
        this.vel.x += dt*Math.random()*2;
        this.vel.y -= 2*dt;
        this.x += this.vel.x;
        this.y += this.vel.y;
    };
};

function choice(array) {
    return array[Math.floor(Math.random()*array.length)];
};
