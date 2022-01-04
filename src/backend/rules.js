
// Define colors
const BLUE = "Blue";
const GREEN = "Green";
const RED = "Red";
const YELLOW = "Yellow";
const BLACK = "Black";

const COLORS = {
    BLUE: BLUE, GREEN: GREEN, RED: RED, YELLOW: YELLOW, BLACK: BLACK
};


/**
 * THE DECK USED IN THE GAME
 * 19 blue, green, red and yellow cards 0-9
 * 8 "+2"-cards (2 of each color)
 * 8 "Reverse direction"-cards (2 of each color)
 * 8 "Skip player"-cards (2 of each color)
 * 4 "Color Joker"-cards
 * 4 "+4 Joker"-cards
 */
const STANDARD_DECK = [

    // BLUE DECK

    { color: BLUE, number: 0 },
    { color: BLUE, number: 1 }, { color: BLUE, number: 1 },
    { color: BLUE, number: 2 }, { color: BLUE, number: 2 },
    { color: BLUE, number: 3 }, { color: BLUE, number: 3 },
    { color: BLUE, number: 4 }, { color: BLUE, number: 4 },
    { color: BLUE, number: 5 }, { color: BLUE, number: 5 },
    { color: BLUE, number: 6 }, { color: BLUE, number: 6 },
    { color: BLUE, number: 7 }, { color: BLUE, number: 7 },
    { color: BLUE, number: 8 }, { color: BLUE, number: 8 },
    { color: BLUE, number: 9 }, { color: BLUE, number: 9 },
    // Take two -cards
    { color: BLUE, number: 10 }, { color: BLUE, number: 10 },
    // Reverse direction -cards
    { color: BLUE, number: 11 }, { color: BLUE, number: 11 },
    // Skip player -cards
    { color: BLUE, number: 12 }, { color: BLUE, number: 12 },

    // GREEN DECK

    { color: GREEN, number: 0 },
    { color: GREEN, number: 1 }, { color: GREEN, number: 1 },
    { color: GREEN, number: 2 }, { color: GREEN, number: 2 },
    { color: GREEN, number: 3 }, { color: GREEN, number: 3 },
    { color: GREEN, number: 4 }, { color: GREEN, number: 4 },
    { color: GREEN, number: 5 }, { color: GREEN, number: 5 },
    { color: GREEN, number: 6 }, { color: GREEN, number: 6 },
    { color: GREEN, number: 7 }, { color: GREEN, number: 7 },
    { color: GREEN, number: 8 }, { color: GREEN, number: 8 },
    { color: GREEN, number: 9 }, { color: GREEN, number: 9 },
    // Take two -cards
    { color: GREEN, number: 10 }, { color: GREEN, number: 10 },
    // Reverse direction -cards
    { color: GREEN, number: 11 }, { color: GREEN, number: 11 },
    // Skip player -cards
    { color: GREEN, number: 12 }, { color: GREEN, number: 12 },

    // RED DECK

    { color: RED, number: 0 },
    { color: RED, number: 1 }, { color: RED, number: 1 },
    { color: RED, number: 2 }, { color: RED, number: 2 },
    { color: RED, number: 3 }, { color: RED, number: 3 },
    { color: RED, number: 4 }, { color: RED, number: 4 },
    { color: RED, number: 5 }, { color: RED, number: 5 },
    { color: RED, number: 6 }, { color: RED, number: 6 },
    { color: RED, number: 7 }, { color: RED, number: 7 },
    { color: RED, number: 8 }, { color: RED, number: 8 },
    { color: RED, number: 9 }, { color: RED, number: 9 },
    // Take two -cards
    { color: RED, number: 10 }, { color: RED, number: 10 },
    // Reverse direction -cards
    { color: RED, number: 11 }, { color: RED, number: 11 },
    // Skip player -cards
    { color: RED, number: 12 }, { color: RED, number: 12 },
    
    // YELLOW DECK

    { color: YELLOW, number: 0 },
    { color: YELLOW, number: 1 }, { color: YELLOW, number: 1 },
    { color: YELLOW, number: 2 }, { color: YELLOW, number: 2 },
    { color: YELLOW, number: 3 }, { color: YELLOW, number: 3 },
    { color: YELLOW, number: 4 }, { color: YELLOW, number: 4 },
    { color: YELLOW, number: 5 }, { color: YELLOW, number: 5 },
    { color: YELLOW, number: 6 }, { color: YELLOW, number: 6 },
    { color: YELLOW, number: 7 }, { color: YELLOW, number: 7 },
    { color: YELLOW, number: 8 }, { color: YELLOW, number: 8 },
    { color: YELLOW, number: 9 }, { color: YELLOW, number: 9 },
    // Draw two -cards
    { color: YELLOW, number: 10 }, { color: YELLOW, number: 10 },
    // Reverse direction -cards
    { color: YELLOW, number: 11 }, { color: YELLOW, number: 11 },
    // Skip player -cards
    { color: YELLOW, number: 12 }, { color: YELLOW, number: 12 },

    // BLACK DECK (Joker cards)

    // Color Joker -cards
    { color: BLACK, number: 13 }, { color: BLACK, number: 13 },
    { color: BLACK, number: 13 }, { color: BLACK, number: 13 },
    // +4 Joker -cards
    { color: BLACK, number: 14 }, { color: BLACK, number: 14 },
    { color: BLACK, number: 14 }, { color: BLACK, number: 14 },
]


module.exports = {
    STANDARD_DECK,
    COLORS
};
