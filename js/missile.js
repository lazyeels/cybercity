function Missile (Game){
    this.game = Game
    this.x = this.game.player.x;
    this.y = this.game.player.y - (this.game.player.width * 0.3);
    this.vx = 10;
    this.vy = 10;
    this.damage = 2;
    this.remove_flag = false;
    this.isAlive = false;
    this.offScreen = true;
};

// Update Method
Missile.prototype.update = function(dt){

};

Missile.prototype.draw = function(dt, context){
    context.fillStyle = "yellow";
    context.fillRect(this.x, this.y, 3, 3);
};
