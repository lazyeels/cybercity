var Success = function(Game){
    this.game = Game;    
    this.years = 320;
};

Success.prototype.Init = function(){
    //$('#canvas').hide();
    var html = '<ul id="mission">';
    html += "<li style='text-align: left;'>Well done!<br>You saved your neck this time!<br>I'm knocking 10 years off your sentence!</li>";
    html += "<li style='text-align: left;'>Remaining sentence<br>"+this.years+"</li>";
    html += '<li><a class="option" onClick=Game.state.Change("Mission")>Next</a></li>';
    html += '</ul>';

    if(this.years <=0){
        var html = '<ul id="mission">';
        html += "<li style='text-align: left;'>Well, well, well... <br>You reduced your term.<br></li>";
        html += "<li style='text-align: left;'>Looks like we can let you go. <br>Enjoy your freedom!</li>";
        html += '<li><a class="option" onClick=Game.state.Change("Title")>Thanks!</a></li>';
        html += '</ul>';

    }

    $('#content').html(html);
};

Success.prototype.update = function(dt){

};

Success.prototype.draw = function(dt, context){

};

Success.prototype.OnEnter = function(params){
    $('#content').show();
    $('#canvas').hide();

    this.Init();

};

Success.prototype.OnExit = function(params){
    $('#canvas').hide();
    this.years -= 10;
};

Success.prototype.keydown = function(e){

};

Success.prototype.keyup = function(e){
    
};
