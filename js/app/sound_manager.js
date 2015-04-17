function SoundManager() {
    this.musics = new Array();
    this.music_is_on = true;
    
    this.sound_effects = new Array();
    this.effec_is_on = true;
    
    // Init music
    this.musics["stay"] = new buzz.sound("medias/sounds/musics/stay.mp3");
    this.musics["veridis_quo"] = new buzz.sound("medias/sounds/musics/veridis_quo.mp3");
    for(var sound in this.musics){
        this.musics[sound].setVolume(80);
    }
    this.musics["stay"].setVolume(100);
    
    // Init effects
    this.sound_effects["player_shot_swoosh"] = new buzz.sound("medias/sounds/effects/player_shot_swoosh.mp3");
    this.sound_effects["alien_shot_swoosh"] = new buzz.sound("medias/sounds/effects/alien_shot_swoosh.mp3");
    this.sound_effects["metal_impact"] = new buzz.sound("medias/sounds/effects/metal_impact.mp3");
    this.sound_effects["long_swoosh"] = new buzz.sound("medias/sounds/effects/long_swoosh.mp3");
    this.sound_effects["cinematic_impact_1"] = new buzz.sound("medias/sounds/effects/cinematic_impact_1.mp3");
    this.sound_effects["blast_impact"] = new buzz.sound("medias/sounds/effects/blast_impact.mp3");
    this.sound_effects["positive_effect"] = new buzz.sound("medias/sounds/effects/positive_effect.mp3");
    this.sound_effects["game_over"] = new buzz.sound("medias/sounds/effects/game_over.mp3");
    
    for(var sound in this.sound_effects){
        this.sound_effects[sound].setVolume(70);
    }
};

SoundManager.prototype.muteMusics = function(){
    this.music_is_on = ! this.music_is_on;
    var text_on = "<i class=\"fa fa-music\"></i>";
    if(this.music_is_on){
        document.getElementById("music").innerHTML = text_on;
        document.getElementById("music").style.color = "#00BFFF";
    }else{
        document.getElementById("music").innerHTML = text_on;
        document.getElementById("music").style.color = "gray";
    }
    for(var sound in this.musics){
        this.musics[sound].toggleMute();
    }
};

SoundManager.prototype.muteEffects = function (){
    this.effec_is_on = ! this.effec_is_on;
    var text_on = "<i class=\"fa fa-volume-up\"></i>";
    var text_off = "<i class=\"fa fa-volume-off\"></i>";
    if(this.effec_is_on){
        document.getElementById("effect").innerHTML = text_on;
        document.getElementById("effect").style.color = "#00BFFF";
    }else{
        document.getElementById("effect").innerHTML = text_off;
        document.getElementById("effect").style.color = "gray";
    }
    for(var sound in this.sound_effects){
        this.sound_effects[sound].toggleMute();
    }
};
