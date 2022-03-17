
class Animation {
    constructor (delay) {
        this.count = 0; // Number of game cycles since last frame change
        this.delay = delay; // Number of game cycles to wait until next frame change
        this.frameIndex = 0; // The frame's index in the current animation frame set
        this.step = 1; // 6 steps in total 2-1-2-4-3-4 (frame indexes)
    }
}


module.exports = Animation;
