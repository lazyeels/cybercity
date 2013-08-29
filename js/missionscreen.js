var Mission = function(Game){
    this.game = Game;    
    this.current_mission = 0;
    this.missions = [
        ["kill Mr Blue... <br>He's currently held up in a hotel<br> Get the job done, and you'll get some<br> time off your sentence. <br><br>Fail,... and I'll blow <br>your sorry head off!", "blue"],
        ["assassinate Mr Red!", "red"],
        ["murder Mr Green in the study!", "green"],
        ["take that low down dirty b*stard out!", "brown"],
    ]
};

Mission.prototype.Init = function(){
    var html = '<ul id="mission">';
    html += "<li style='text-align: left;'>Your mission is to "+this.missions[this.current_mission][0]+"</p></li>";
    html += '<li><a class="option" onClick=Game.state.Change("world")>Accept</a></li>';
    html += '</ul>';
    $('#content').html(html);
};

Mission.prototype.update = function(dt){
    if(this.current_mission == 4){
        this.current_mission = 0;
        this.Init(); 
    }
};

Mission.prototype.draw = function(dt, context){

};

Mission.prototype.OnEnter = function(params){
    $('#canvas').hide();
    $('#content').show();
    this.Init();
};

Mission.prototype.OnExit = function(params){
    this.game.npc_color = this.missions[this.current_mission][1];
    $('#canvas').show();
    $('#content').hide();
    this.current_mission+=1;
};

Mission.prototype.keydown = function(e){
    this.Init();
};

Mission.prototype.keyup = function(e){
    
};
