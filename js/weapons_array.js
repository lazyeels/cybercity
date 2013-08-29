function Weapon(controller){
    this.controller = controller;
    this.projectiles = []; 
    this.zIndex = 6;
};

Weapon.prototype.update = function(dt){
    this.projectiles = this.projectiles.sort(function(a, b){return a.x - b.x;})
    this.createProjectiles()
    this.updateProjectiles();
    this.removeProjectiles();
}; 

Weapon.prototype.draw = function(dt, context){
    for(var i in this.projectiles) { 
        this.projectiles[i].draw(dt, context); 
    }
}; 

Weapon.prototype.updateProjectiles = function() { 
    for(var i in this.projectiles) { 
        if (this.projectiles[i].x > this.controller.view.canvas.width + 50) {
	    this.projectiles[i].offScreen = true;
            this.projectiles[i].isAlive = false;
            this.projectiles[i].remove_flag = true;
        }
        this.projectiles[i].x += this.projectiles[i].vx;
    } 
}; 

Weapon.prototype.createProjectiles = function() {
    if (this.controller.model.player.fire && this.projectiles.length < 5){ 
        console.log("Player firing")
        var missile = new Missile(this.controller);
        this.projectiles.push(missile);
    }
};

Weapon.prototype.removeProjectiles = function() { 
    // remove dead objects
    for(var i in this.projectiles) { 
        if (this.projectiles[i].remove_flag){
            this.projectiles.pop(this.projectiles[i]);
        } 
    }
};
