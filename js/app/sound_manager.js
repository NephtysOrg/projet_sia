function SoundManager() {
    this.musics = new Array();
    this.sound_effects = new Array();
    
    // Init music
    this.musics["stay"] = new buzz.sound("medias/sounds/musics/stay.mp3");
    this.musics["veridis_quo"] = new buzz.sound("medias/sounds/musics/veridis_quo.mp3");
    for(var sound in this.musics){
        this.musics[sound].setVolume(80);
    }
    
    // Init effects
    this.sound_effects["player_shot_swoosh"] = new buzz.sound("medias/sounds/effects/player_shot_swoosh.mp3");
    this.sound_effects["alien_shot_swoosh"] = new buzz.sound("medias/sounds/effects/alien_shot_swoosh.mp3");
    this.sound_effects["metal_impact"] = new buzz.sound("medias/sounds/effects/metal_impact.mp3");
    this.sound_effects["long_swoosh"] = new buzz.sound("medias/sounds/effects/long_swoosh.mp3");
    this.sound_effects["cinematic_impact_1"] = new buzz.sound("medias/sounds/effects/cinematic_impact_1.mp3");
    this.sound_effects["blast_impact"] = new buzz.sound("medias/sounds/effects/blast_impact.mp3");
    this.sound_effects["positive_effect"] = new buzz.sound("medias/sounds/effects/positive_effect.mp3");
    
    for(var sound in this.sound_effects){
        this.sound_effects[sound].setVolume(70);
    }
}   


