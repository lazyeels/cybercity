var GameOver = function(Game){
    this.game = Game;    
};

GameOver.prototype.Init = function(){
    //$('#canvas').hide();
    var html = '<ul id="mission">';
    html += "<li>You didn't make it!</li>";
    html += '<li><a class="option" onClick=Game.state.Change("Mission")>Try Again?</a></li>';
    html += '<li><a class="option" onClick=Game.state.Change("Title")>Quit?</a></li>'
    html += '</ul>';
    $('#content').html(html);
};

GameOver.prototype.update = function(dt){

};

GameOver.prototype.draw = function(dt, context){

};

GameOver.prototype.OnEnter = function(params){
    $('#content').show();
    $('#canvas').hide();
    this.Init();
};

GameOver.prototype.OnExit = function(params){
    $('#canvas').hide();
};

GameOver.prototype.keydown = function(e){

};

GameOver.prototype.keyup = function(e){
    
};
