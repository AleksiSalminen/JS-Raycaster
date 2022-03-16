
class Character {
    constructor (name, maxHP, hp, walkSpd, position, height, width) {
        this.name = name;
        this.maxHP = maxHP;
        this.hp = hp;
        this.walkSpd = walkSpd;
        this.pos = position;
        this.height = height;
        this.width = width;
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
