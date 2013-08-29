var Title = function(Game){
    this.game = Game;    
    $('#canvas').hide();

    this.particles = new ParticleSys(this.game, this.player);
    this.particles.Init(this.player, 'red'); 

//    this.particles = new ParticleSys(this.game, {x: -50, y: -50});
//    console.log(this.particles)
};

Title.prototype.Init = function(){
    var html = "<ul id='mission'>";
    html += "<li style='font-size: 28px; line-height: 28px;'>Cyber Sh*tty 10 Secs</li>";
    html += "<li><a href='/about'>About</a></li>";
    html += "<li><a href='/controls'>Controls</a></li>";
    html += '<li><a class="option" onClick=Game.state.Change("Mission")>Play Me </a></li></ul>';
    $('#content').html(html);
    
};

Title.prototype.update = function(dt){
    if(this.particles.pxs.length == 0){
        this.particles.Init({x: 0, y: 0}, 'red');
    } else {
        this.particles.update(dt, 0, 0);
    }
};

Title.prototype.draw = function(dt, context){
    this.particles.draw(dt, context, 0, 0);
};

Title.prototype.OnEnter = function(params){
    $('#canvas').show();

    this.Init();
};

Title.prototype.OnExit = function(params){
    $('#content').hide();
//    $('#canvas').show();
};

Title.prototype.keydown = function(e){
    this.Init();
};

Title.prototype.keyup = function(e){
    
};
