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
   
    /*Glitch effect */
    this.effects["glitch"] = new Array();
    this.effects["glitch"]["effect"] = new THREE.GlitchPass();
    this.effects["glitch"]["render"] = true;
    this.effects["glitch"]["effect"].goWild = true;
   
    /*Dotscreen effect */
    this.effects["dotscreenshader"] = new Array();
    this.effects["dotscreenshader"]["effect"] = new THREE.ShaderPass( THREE.DotScreenShader);
    this.effects["dotscreenshader"]["render"] = true;
    this.effects["dotscreenshader"]["effect"].uniforms['scale'].value = 4;
   
    /*RGB effect */
    this.effects["rgbshiftshader"] = new Array();
    this.effects["rgbshiftshader"]["effect"] = new THREE.ShaderPass(THREE.RGBShiftShader);
    this.effects["rgbshiftshader"]["render"] = false;
    this.effects["rgbshiftshader"]["effect"].uniforms['amount'].value = 0.0015;
};
 
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
        this.effects[effectName]["effect"].renderToScreen = false;
    }
};
 
 
/**
 * Start rendering a given effect for a the given duration
 * @param {type} effectName
 * @param {type} duration
 */
PostProcessingManager.prototype.startEffect = function (effectName, duration) {
    if (this.effects[effectName] !== undefined) {
        
        this.composer.addPass( this.effects[effectName]["effect"] );
        this.effects[effectName]["effect"].renderToScreen = this.effects[effectName]["render"];
        if (duration > 0) {
            var that = this;    //setTimeOut use the global scope so the keyword this need to be changed
            setTimeout(function () {
                that.stopEffect(effectName);
            }, duration * 1000);
        }
    }
};