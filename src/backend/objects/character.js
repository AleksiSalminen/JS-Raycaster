
class Character {
    constructor (name, maxHP, hp, walkSpd, position) {
        this.name = name;
        this.maxHP = maxHP;
        this.hp = hp;
        this.walkSpd = walkSpd;
        this.position = position;
    }

    /** Getters */
    getName () { return this.name; }
    getMaxHP () { return this.maxHP; }
    getHP () { return this.hp; }
    getWalkSpd () { return this.walkSpd; }
    getPosition () { return this.position; }
}

module.exports = Character;
