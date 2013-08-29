var aStar = function(tileMap, worldObjects, grid, src, dest, tiletypes, createPositions){
    this.openList = new NodeList(true, 'F');
    this.closedList = new NodeList();
    this.path = new NodeList();
    this.src = src;
    this.dest = dest;
    this.createPositions = (createPositions === undefined) ? true: createPositions;
    this.currentNode = null;
    var grid = {rows: grid.width, cols: grid.height};
    
    this.openList.add(new Node(null, this.src));
    while(!this.openList.isEmpty()){
        this.currentNode = this.openList.get(0);
        this.currentNode.visited = true;
        if(this.checkDifference(this.currentNode, this.dest)){
            // destination reached!
            break; 
        }

        this.closedList.add(this.currentNode);
        this.openList.remove(0);
        // check neighbours
        
        var nstart = {
            x: (((this.currentNode.x - 1) >= 1) ? this.currentNode.x - 1: 1),
            y: (((this.currentNode.y - 1) >= 1) ? this.currentNode.y - 1: 1),
        } 
        var nstop = {
            x: (((this.currentNode.x + 1) <= grid.rows) ? this.currentNode.x + 1: grid.rows),
            y: (((this.currentNode.y + 1) <= grid.cols) ? this.currentNode.y + 1: grid.cols),
        } 
        for(var row = nstart.x; row <= nstop.x; row++){
            for(var col = nstart.y; col <= nstop.y; col++){
                // The row is not available should we keep going?
                if(tileMap[row] === undefined){
                    if(!this.createPositions){
                        continue;
                    }
                }
                // Check for walls and obstructions
                if(worldObjects[row] !==undefined){
                   for (world in tiletypes){
                       for(tile in tiletypes[world]){   
                           if(tileMap[row][col] == tiletypes[world][tile] || worldObjects[row][col] == tiletypes[world][tile]){
                               continue;
                           }
                       }
                   } 
                }

                var element = this.closedList.getByXY(row, col);
                if(element !== null){
                    // Element already in closedList 
                    continue;  
                } else {
                    element = this.openList.getByXY(row, col);
                    if(element !== null){
                        // Element already in openList 
                        continue;  
                    }
                }
                // Not present in anylists, keep going
                var n = new Node(this.currentNode, {x: row, y: col});
                n.G = this.currentNode.G + 1;
                n.H = this.getDistance(this.currentNode, n);
                n.F = n.G + n.H;

                this.openList.add(n);
            }
        }
    }

    while (this.currentNode.parentNode !== null){
        this.path.add(this.currentNode);
        this.currentNode = this.currentNode.parentNode;
    }
//    postMessage(this.path.list);
    return this.path.list;

};

aStar.prototype.checkDifference = function(src, dest){
    return (src.x === dest.x && src.y === dest.y);
};

aStar.prototype.getDistance = function(src, dest){
    return Math.abs(src.x - dest.x) + Math.abs(src.y - dest.y);
};


var Node = function(parentNode, src){
    this.parentNode = parentNode;
    this.x = src.x;
    this.y = src.y;
    this.F = 0;
    this.G = 0;
    this.H = 0;
    this.dist = 0;
};

var NodeList = function(sorted, sortParam){
    this.sort = (sorted === undefined) ? false: sorted;
    this.sortParam = (sortParam === undefined) ? 'F': sortParam;
    this.list = [];
    this.coordMatrix = [];
};

NodeList.prototype.add = function(element){
    this.list.push(element);
    if(this.coordMatrix[element.x] === undefined){
        this.coordMatrix[element.x] = [];
    }
    this.coordMatrix[element.x][element.y] = element;
    if(this.sort){
        var sortBy = this.sortParam;
        this.list.sort(function(o1, o2){return o1[sortBy] - o2[sortBy]; });
    }
};

NodeList.prototype.remove = function(pos){
    this.list.splice(pos, 1);
};

NodeList.prototype.get = function(pos){
    return this.list[pos];
};

NodeList.prototype.size = function(){
    return this.list.length;
};

NodeList.prototype.isEmpty = function(){
    return (this.list.length == 0);
};

NodeList.prototype.getByXY = function(x, y){
    if(this.coordMatrix[x] === undefined){
        return null;
    } else {
        var obj = this.coordMatrix[x][y];
        if(obj == undefined){
            return null;
        } else {
            return obj;
        }
    }
};

NodeList.prototype.print = function(){
    for(var i = 0, len = this.list.length; i < len; i++){
        console.log(this.list[i].x + ' ' + this.list[i].y);
    }
};

