function Level_Class(Game){
    this.game = Game;
    this.layers = [];
    this.tiletype = {
        0: 'air',
        1: 'ground',
        2: 'ground',
        3: 'ground',
        4: 'ground',
        5: 'ground',
        6: 'ground',
        8: 'ladder',
        9: 'door',
        10: 'ground', 
    };
};

Level_Class.prototype.Init = function(layers){

    this.layers = this.Load(layers, 32, 32);
    this.map = this.layers[0].map;
    this.tilemap = this.layers[0].map;

    this.width = this.tilemap[0].length;
    this.height = this.tilemap.length;

    this.tile = {
     	width: 32,
    	height: 32
    }

    this.grid = {
	    width: this.tilemap[0].length,
	    height: this.tilemap.length
    }

    this.scroll = {
	    x: -this.grid.width/2,
	    y: 0
    }  
};

Level_Class.prototype.Load = function(layers, width, height) {
    this.npc = {};
    for (var layer = 0; layer < layers.length; layer++){
        var temp = utils.GetEmptyArray(width, height);
        var row = 0;
        var col = 0;
        var map = layers[layer].map;
        for(var i=0; i < width;i++){
            for(var j=0;j < height;j++){
                temp[j][i] = map[(j*width) + i];
           }     
        } 
        layers[layer].map = temp;
    }

    // Spawn
    for(var y = 0; y < 100; y++){
        this.Spawn_Enemy(width, height, layers[0].map);
    } 

    return layers;
};

Level_Class.prototype.Spawn_Enemy = function(width, height, tilemap){
    var x = Math.floor(1+Math.random() * width-1);
    var y = Math.floor(1+Math.random() * height-1);
    if(tilemap[y][x]==10 && tilemap[y-1][x]!=10){
        this.npc.x = x*32;
        this.npc.y = ((y-1)*32)+8;
    }
};


Level_Class.prototype.update = function(dt, xScroll, yScroll) {

};

Level_Class.prototype.draw = function(dt, context, xScroll, yScroll) {
    this.startRow = Math.floor(this.scroll.y / this.tile.height);
    this.startCol = Math.floor(this.scroll.x / this.tile.width);
    this.rowCount = this.startRow + Math.floor((this.game.canvas.height+this.tile.height)/this.tile.height)+1;
    this.colCount = this.startCol + Math.floor((this.game.canvas.width+this.tile.width)/this.tile.width)+1;
    for (var row = this.startRow; row < this.rowCount; row++) {
        for (var col = this.startCol; col < this.colCount; col++) {
            var tilePositionX = (this.tile.width * col);
  	        var tilePositionY = (this.tile.height * row);
            
            tilePositionX -= this.scroll.x;
    	    tilePositionY -= this.scroll.y;
             
            // Draw Layers
            for(var zIndex = 0; zIndex<this.layers.length; zIndex++){
                this.tilemap = this.layers[zIndex].map; 
                if(this.tilemap[row] && this.tilemap[row][col]){ 
                    var tileID = this.tilemap[row][col];
                    
                    context.drawImage(
                        this.layers[zIndex].tileset, 
                        tileID * this.tile.width, 
                        0, 
                        this.tile.width, 
                        this.tile.height, 
                        tilePositionX, 
                        tilePositionY,
                        this.tile.width, 
                        this.tile.height
                    );
                }
            }
        }
    }
};
