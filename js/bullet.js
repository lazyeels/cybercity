var Bullet = function(Player){
   this.player = Player;
   this.charge = 100;
   this.speed = 10;
   this.bullets = [];
   this.accuracy = 0.0;
   this.radius = 5;
   
   this.state = {
        _current: 0,
        CHARGED: 0,
        NOCHARGE: 1,
    };
};

Bullet.prototype.update = function(dt, enemy, tilemap, xScroll, yScroll){
    if(this.player.mouse && this.player.mouse.clicked){
        var projectile = {}
        var position = this.player.mouse;
	    projectile.x = this.player.x;
	    projectile.y = this.player.y;
        projectile.targetX = position.x;
        projectile.targetY = position.y;
        projectile.speed = this.speed;
	    projectile.radius = this.radius;

        projectile.angRadian = Math.atan2(position.y - this.player.y, position.x - this.player.x);
  //      if(this.player.state.CANFIRE){
            this.bullets.push(projectile);
  //      }
    }
    for(var i = 0; i < this.bullets.length; i++){
        var distance = utils.distanceFrom(this.bullets[i], enemy, xScroll, yScroll).dist;
        if(distance <= 10){
            enemy.state._current = enemy.state.DEAD;            
        } 
        this.tileID = utils.getTile(this.bullets[i], tilemap, xScroll, yScroll, 32, 32);

        if (this.bullets[i].x == this.bullets[i].targetX && this.bullets[i].y == this.bullets[i].targetY 
                || this.tileID == 10
                || this.bullets[i].x < this.player.x - 100 
                || this.bullets[i].x > this.player.x + 100
                || this.bullets[i].y < this.player.y - 100 
                || this.bullets[i].y > this.player.y + 100
                || this.distance <= 0
        ){
            this.bullets.splice(i, 1);                
        } else {
            this.bullets[i].x += this.bullets[i].speed * Math.cos(this.bullets[i].angRadian);  
            this.bullets[i].y += this.bullets[i].speed * Math.sin(this.bullets[i].angRadian);
        }
    }
};

Bullet.prototype.draw = function(dt, context, xScroll, yScroll){
    context.fillStyle = "white";
    for(var i = 0; i < this.bullets.length; i++){
        context.fillRect(
            this.bullets[i].x, 
            this.bullets[i].y,
            this.radius, 
            this.radius
        );
    }
};
