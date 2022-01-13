
const Character = require("./character"); 

class Player extends Character {
    constructor (name, maxHP, hp, walkSpd, turnSpd, position) {
        super(name, maxHP, hp, walkSpd, position);
        this.turnSpd = turnSpd;
    }

    /** Getters */
    getTurnSpd () { return this.turnSpd; }
}

module.exports = Player;
