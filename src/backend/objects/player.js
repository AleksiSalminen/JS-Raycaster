
const Character = require("./character"); 

class Player extends Character {
    constructor (name, maxHP, hp, walkSpd, turnSpd, position) {
        super(name, maxHP, hp, walkSpd, position);
        this.turnSpd = turnSpd;
    }

    /** Getters */
    getTurnSpd () { return this.turnSpd; }

    /** Setters */
    setTurnSpd (newTurnSpd) {
        if (newTurnSpd > 0) { this.turnSpd = newTurnSpd; }
    }
}

module.exports = Player;
