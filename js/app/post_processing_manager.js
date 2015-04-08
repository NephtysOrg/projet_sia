function PostProcessingManager (renderer,game){
        this.game = game;
        this.composer = new THREE.EffectComposer( renderer );
        this.composer.addPass( new THREE.RenderPass( this.game, this.game.current_camera ) );
        this.effects = new Array();

        
        this.effects["glitch"] = new THREE.GlitchPass();
        this.effects["glitch"].goWild = true;
        this.composer.addPass( this.effects["glitch"] );
};

PostProcessingManager.prototype.render = function(){
    this.composer.render();
};

PostProcessingManager.prototype.stopEffect = function (effectName){
    if(this.effects[effectName]!== undefined){
        this.effects[effectName].renderToScreen = false;
    }
};

PostProcessingManager.prototype.startEffect = function (effectName, duration){
    if(this.effects[effectName]!== undefined){
        this.effects[effectName].renderToScreen = true;
        if(duration > 0){
            var that = this;    //setTimeOut use the global scope so the keyword this need to be changed
            setTimeout(function () {
                that.stopEffect(effectName);
            }, duration *1000);
        }
    }
};