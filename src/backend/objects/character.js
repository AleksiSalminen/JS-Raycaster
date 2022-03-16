
const Animation = require("./animation");

class CharacterAnimation extends Animation {
    constructor (delay, direction, side) {
        super(delay);
        this.direction = direction;
        this.side = side;
        this.frameSets = {
            "DIR_TOWARDS":    [ 0, 1, 2, 3, 4],
            "DIR_AWAY":       [ 5, 6, 7, 8, 9],
            "DIR_LEFT":       [10,11,12,13,14],
            "DIR_RIGHT":      [15,16,17,18,19],
            "DIR_TOW_LEFT":   [20,21,22,23,24],
            "DIR_TOW_RIGHT":  [25,26,27,28,29],
            "DIR_AWAY_LEFT":  [30,31,32,33,34],
            "DIR_AWAY_RIGHT": [35,36,37,38,39]
        };
        this.frameSet = this.frameSets[direction];
        let spriteIndex = this.frameSet[this.frameIndex];
        this.rowIndex = Math.floor(spriteIndex/5);
    }
}


class Character {
    constructor (name, maxHP, hp, walkSpd, position, height, width) {
        this.name = name;
        this.maxHP = maxHP;
        this.hp = hp;
        this.walkSpd = walkSpd;
        this.pos = position;
        this.height = height;
        this.width = width;
        this.animation = new CharacterAnimation(
            15, "DIR_LEFT", "SIDE_MIDDLE"
        );
    }

    /** Getters */
    getName () { return this.name; }
    getMaxHP () { return this.maxHP; }
    getHP () { return this.hp; }
    getWalkSpd () { return this.walkSpd; }
    getPosition () { return this.pos; }

    /** Setters */
    setName (newName) {
        if (newName && newName.length > 0) { this.name = newName; }
    }
    setMaxHP (newMaxHP) {
        if (newMaxHP > 0) { this.maxHP = newMaxHP; }
    }
    setHP (newHP) {
        if (newHP >= 0) { this.hp = newHP; }
        else { this.hp = 0; }
    }
    setWalkSpd (newWalkSpd) {
        if (newWalkSpd > 0) { this.walkSpd = newWalkSpd; }
    }
    setPosition (newPos) {
        if (newPos) { this.pos = newPos; }
    }
}


module.exports = Character;
