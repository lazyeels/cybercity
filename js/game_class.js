// Game Objects
function Game(fps){
    this.canvas = document.getElementById('canvas'); 
    this.context = this.canvas.getContext('2d'); 
    this.state = new StateMachine();
    // Initialise Game
    this.Init(fps);
};

Game.prototype.Init = function(fps){
    this.fps = fps;
    this.timeSinceLastFrame = new Date().getTime();
    this.timeBetweenFrames = 1/fps;
    this.AddEventListener();

    // Reset score
    this.score = 0;

    this.state.Add("world", new EmptyState(new World(this)));
    this.state.Add("Title", new EmptyState(new Title(this)));
    this.state.Add("Mission", new EmptyState(new Mission(this)));
    this.state.Add("GameOver", new EmptyState(new GameOver(this)));
    this.state.Add("Success", new EmptyState(new Success(this)));
    this.state.Change("Title");
};

Game.prototype.AddEventListener = function(){
    var self = this;
    this.mouse = utils.captureMouse(this.canvas);
};

Game.prototype.keydown = function(e){
    this.state.keydown(e);
};

Game.prototype.keyup = function(e){
    this.state.keyup(e);
};

Game.prototype.update = function(){
    // Calculate the time since the last frame
    var thisFrame = new Date().getTime();
    this.dt = (thisFrame - this.timeSinceLastFrame)/1000;
    this.timeSinceLastFrame = thisFrame;
    this.state.update(this.dt);
};

Game.prototype.draw = function(timer){
//    this.dt = timer;
    this.state.draw(this.dt, this.context);
};
