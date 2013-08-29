var ParticleSys = function(Game, entity){
    this.entity = entity;
    this.game = Game;
    this.pxs = new Array();
};

ParticleSys.prototype.Init = function(entity, color){
    this.entity = entity;
    for(var i = 0; i < 25; i++) {
  	    this.pxs[i] = new Circle(color);
	    this.pxs[i].reset(entity.x, entity.y);
    } 
    console.log("Init particles", this.pxs.length)
};

ParticleSys.prototype.update = function(dt){
    if(this.entity.state._current == this.entity.state.DEAD){
  	    var part = new Circle();
	    part.reset(this.entity.x, this.entity.y);
        this.pxs.push(part);   
    }
//    console.log("updating particles", this.pxs.length);
};


ParticleSys.prototype.draw = function(dt, context, xScroll, yScroll){
    for(var i = 0; i < this.pxs.length; i++) {
        if(this.pxs[i].fadetime > 0.5){
            this.pxs.splice(i, 1);
        } else {
            this.pxs[i].move(dt);
   	        this.pxs[i].draw(dt, context, 0, 0);
        }
    }
};

function Circle() {
    this.reset = function(x, y, color) {
		this.x = x;
		this.y = y;
        this.color = color;
        this.fadetime = 0;
        this.friction = {x: 100, y: 0};
		this.r = 5;
		this.vel = {x: Math.random()*2, y: 5};
        this.lifetime = 2;
        this.maxVel = {x: 1, y: 1};
        this.Init();
    }

    this.muls = function(n) { return this.x*n, this.y*n},
    this.imuls = function(n) { this.x *= n; this.y *= n; return this; },
    this.mul = function(v) { return this.x*v.x, this.y*v.y; },
    this.imul = function(v) { this.x *= v.x; this.y *= v.y; return this; },

    this.Init = function(){
        this.vel.x = (Math.random() * 2 +1) * this.vel.x;
        this.vel.y = (Math.random() * 2 +1) * this.vel.y;
        this.alpha = (Math.random() * 1);
    };

    this.draw = function(dt, context, xScroll, yScroll) {
		context.fillStyle = "red";	
		context.fillRect(this.x, this.y, this.r, this.r);
    };

    this.move = function(dt) {
        this.fadetime += dt;
        this.vel.x += dt*Math.random()*50;
        this.vel.y += 50*dt;
        this.x += this.vel.x;
        this.y += this.vel.y;
    };
};

function fuzzy(range, base){
    return (base||0) + (Math.random()-0.5)*range*2;
}

function choice(array) {
    return array[Math.floor(Math.random()*array.length)];
};


function gravity(particle, td){
    particle.vel.y += 50*td;
};

function dampingf(damping){
    return function(particle, td){
        particle.vel.imuls(damping);
    }
};

var drag = dampingf(0.97);
function wind(particle, td){
    particle.vel.x += td*Math.random()*50;
};


