var Map = function(Game){
    this.game = Game;
    this.particles = [];
    this.createParticles(20);      
    this.Init();
};

Map.prototype.Init = function(){
    
};

Map.prototype.update = function(dt, xScroll, yScroll){
    for(var i in this.particles){ 
        var part = this.particles[i];
        part = this.checkCollision(this.mouse, part, xScroll, yScroll);
    }
};

Map.prototype.checkCollision = function(mouse, part, xScroll, yScroll){
    var coll = utils.distanceFrom(mouse, part, 0, 0);
    // check for hover
    if(coll.dist < mouse.radius && part.id!='you'){
        part.color = '#F00';
        // check if selected
        if(mouse.clicked){
            // Set level ID for map 
            this.game.state.Change('planet', [part.id, 50, 50]);
        };
    } else {
        // Else set original color based on type
        if(part.id != 'you'){
            part.color = '#FFF';
        } else {
            part.color = '#FF0';
        }
    }
    return part;
};

Map.prototype.draw = function(dt, context, xScroll, yScroll){ 
    context.save();
    for(var i in this.particles){ 
        var part = this.particles[i]; 
        context.fillStyle = part.color; 
        context.beginPath(); 
        context.arc(part.x,part.y, part.radius, 0, Math.PI*2); 
        context.closePath(); 
	context.fill(); 
    } 
    context.restore();
};

Map.prototype.OnEnter = function(params){
    this.mouse = this.game.mouse;
};

Map.prototype.OnExit = function(params){

};

Map.prototype.createParticles = function(limit) { 
    //add particle if fewer than 100 
    for(var i=0; i<limit; i++) { 
        this.particles.push({ 
            id: i,
            x: 50+Math.random() * (this.game.canvas.width - 100), //between 0 and canvas width 
            y: 50+Math.random() * (this.game.canvas.height - 100), 
            opacity: Math.random()/1,
            speed: Math.random() * 20, 
            radius: 1+Math.random() * 3,
            color: '#F00',
        }); 
    } 

    this.particles.push({ 
        id: 'you',
        x: Math.random() * (this.game.canvas.width), //between 0 and canvas width 
        y: Math.random() * (this.game.canvas.height), 
        radius: 5,
        color: '#FF0',
    }); 

};

