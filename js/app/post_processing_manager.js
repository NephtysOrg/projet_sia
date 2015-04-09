/**
 * Post processing manager 
 * @param {type} renderer
 * @param {type} game
 * @returns {PostProcessingManager}
 */
function PostProcessingManager(renderer, game) {
    this.game = game;
    this.composer = new THREE.EffectComposer(renderer);
    this.effects = new Array();


    this.composer.addPass(new THREE.RenderPass(this.game, this.game.current_camera));
    
    this.effects["glitch"] = new THREE.GlitchPass();
    this.effects["glitch"].goWild = true;
    this.composer.addPass(this.effects["glitch"]);
}
;

/**
 * Render post processing
 */
PostProcessingManager.prototype.render = function () {
    this.composer.render();
};

/**
 * Stop rendering given effect
 * @param {type} effectName
 */
PostProcessingManager.prototype.stopEffect = function (effectName) {
    if (this.effects[effectName] !== undefined) {
        this.effects[effectName].renderToScreen = false;
    }
};


/**
 * Start rendering a given effect for a the given duration
 * @param {type} effectName
 * @param {type} duration
 */
PostProcessingManager.prototype.startEffect = function (effectName, duration) {
    if (this.effects[effectName] !== undefined) {
        this.effects[effectName].renderToScreen = true;
        if (duration > 0) {
            var that = this;    //setTimeOut use the global scope so the keyword this need to be changed
            setTimeout(function () {
                that.stopEffect(effectName);
            }, duration * 1000);
        }
    }
};