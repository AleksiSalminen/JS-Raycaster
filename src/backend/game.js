const { io } = require('./handler');
const RULES = require('./rules');
const COLORS = RULES.COLORS;
let state = {};
const clientRooms = {};


module.exports = {

  /**
   * 
   */
  createNewGame(client, params) {
    let roomName = "";
    if (params.gameCode.length === 0) {
      roomName = makeid(5);
    }
    else {
      roomName = params.gameCode;
    }
    clientRooms[client.id] = roomName;

    state[roomName] = initGame(client.id, params);

    client.join(roomName);
    client.number = 1;
    client.emit("init", client.number, roomName);

    emitGameState(state[roomName]);
  },

  /**
   * 
   * @param {*} roomName 
   */
  joinGame(client, params) {
    const roomName = params.code
    const room = io.sockets.adapter.rooms[roomName];

    let allUsers;
    if (room) {
      allUsers = room.sockets;
    }

    let numClients = 0;
    if (allUsers) {
      numClients = Object.keys(allUsers).length;
    }

    if (numClients === 0) {
      client.emit("unknownCode");
      return;
    } else if (numClients > state[roomName].playersMaxNum - 1) {
      client.emit("tooManyPlayers");
      return;
    } else if (state[roomName].status === "Playing") {
      client.emit("gameHasStarted");
      return
    }

    clientRooms[client.id] = roomName;

    client.join(roomName);
    client.number = numClients + 1;

    const playerAmount = state[roomName].players.length;
    state[roomName].players.push({
      client: client.id,
      number: state[roomName].players[playerAmount - 1].number + 1,
      name: params.name,
      cards: []
    });
    client.emit("init", client.number, roomName);

    emitGameState(state[roomName]);
  },

  /**
   * 
   */
  startGame (client, params) {
    const roomName = clientRooms[client.id];
    state[roomName].status = "Playing";
    divideCards(state[roomName]);
    if (state[roomName].deck.length > 0) {
      if (!checkIfOnlySpecials(state[roomName].deck)) {
        let card = {number:14}
        while (card.number === 10 || card.number === 11
          || card.number === 12 || card.number === 13 || card.number === 14) {
            card = state[roomName].deck.pop();
            state[roomName].discardPile.push(card);
        }
      }
      else {
        state[roomName].discardPile.push(state[roomName].deck.pop());
      }
      
      emitGameState(state[roomName]);
    }
  },

  /**
   * 
   * @param {*} client 
   * @param {*} params 
   */
  removeClient(client, params) {
    const roomName = clientRooms[client.id];
    if (!roomName) {
      return;
    }

    for (let i = 0; i < state[roomName].players.length; i++) {
      let player = state[roomName].players[i];
      if (player.client === client.id) {
        state[roomName].players.splice(i, 1);
        i = state[roomName].players.length;
      }
    }

    emitGameState(state[roomName]);
  },

  /**
   * 
   * @param {*} client 
   * @param {*} card 
   */
  addCard (client, params) {
    const card = JSON.parse(params);
    const roomName = clientRooms[client.id];
    
    if (checkIfUserTurn(client.id, state[roomName])) {
      if (state[roomName].usedNumberCardCombo) {
        if (checkIfValidNumberCombo(card, state[roomName])) {
          makeAPlay(client.id, card, state[roomName]);
        }
        else {
          console.log("Invalid card (Number combo)");
        }
      }
      else if (state[roomName].drewCard) {
        if (checkIfDrawnCard(card, state[roomName].drawnCard)) {
          makeAPlay(client.id, card, state[roomName]);
        }
        else {
          console.log("Invalid card (Drew card)");
        }
      }
      else {
        if (checkIfValidCard(card, state[roomName])) {
          makeAPlay(client.id, card, state[roomName]);
        }
        else {
          console.log("Invalid card");
        }
      }
    }
    else {
      console.log("Not user's turn");
    }

    emitGameState(state[roomName]);
  },

  /**
   * 
   * @param {*} client 
   * @param {*} params 
   */
  drawCard (client, params) {
    const roomName = clientRooms[client.id];
    
    if (checkIfUserTurn(client.id, state[roomName])) {
      if (!state[roomName].usedNumberCardCombo) {
        drawCardForPlayer(client.id, state[roomName]);
      }
      else {
        console.log("Not allowed on number card combo");
      }
    }
    else {
      console.log("Not user's turn");
    }

    emitGameState(state[roomName]);
  },

  /**
   * 
   * @param {*} client 
   * @param {*} params 
   */
  skipTurn (client, params) {
    const roomName = clientRooms[client.id];
    if (state[roomName].usedNumberCardCombo || state[roomName].drewCard) {
      let currentPlayerIndex = findPlayerIndexFromID(client.id, state[roomName]);
      changeTurn(currentPlayerIndex, 1, state[roomName]);
      state[roomName].usedNumberCardCombo = false;
      state[roomName].drewCard = false;
      emitGameState(state[roomName]);
    }
  },

  /**
   * 
   * @param {*} client 
   * @param {*} params 
   */
  callUno (client, params) {
    const roomName = clientRooms[client.id];
    state[roomName].calledUno = true;
    emitGameState(state[roomName]);
  }
};


function makeid(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function divideCards (state) {
  let deck = state.deck;
  // Go through the rounds of dividing the cards
  for (let round = 1;round <= state.startCardsNum;round++) {
    // Give one card to each player
    for (let plI = 0;plI < state.players.length;plI++) {
      let player = state.players[plI];
      player.cards.push(deck.pop());
    }
  }
}

function checkIfUserTurn (clientID, state) {
  let userTurn = false;
  
  let clientPlayerNum = -1;
  for (let plI = 0;plI < state.players.length;plI++) {
    const player = state.players[plI];
    if (player.client === clientID) {
      clientPlayerNum = player.number;
      plI = state.players.length;
    }
  }

  if (clientPlayerNum === state.currentPlayer) {
    userTurn = true;
  }

  return userTurn;
}

function checkIfOnlySpecials (deck) {
  let card;
  for (let i = 0;i < deck.length;i++) {
    card = deck[i];
    if (card.number < 10) {
      return false;
    }
  }
  return true;
}

function checkIfValidCard(card, state) {
  let isValidCard = false;

  const discardTop = state.discardPile[state.discardPile.length-1];
  if (card.number === 13 || card.number === 14) {
    isValidCard = true;
  }
  else if (card.color === discardTop.color) {
    isValidCard = true;
  }
  else if (card.number === discardTop.number) {
    isValidCard = true;
  }

  return isValidCard;
}

function checkIfValidNumberCombo(card, state) {
  let isValidCard = false;

  const discardTop = state.discardPile[state.discardPile.length-1];
  if (card.number === discardTop.number) {
    isValidCard = true;
  }

  return isValidCard;
}

function checkIfDrawnCard(card, drawnCard) {
  if ((card.number === 13 || card.number === 14) 
  && card.number === drawnCard.number) {
    return true;
  }
  else if (card.number === drawnCard.number && card.color === drawnCard.color) {
    return true;
  }
  else {
    return false;
  }
}

function findPlayerIndexFromID (clientID, state) {
  let currentPlayerIndex = -1;

  for (let plI = 0;plI < state.players.length;plI++) {
    const player = state.players[plI];
    if (player.client === clientID) {
      currentPlayerIndex = plI;
      plI = state.players.length;
    }
  }

  return currentPlayerIndex;
}

function makeAPlay(clientID, card, state) {
  let currentPlayerIndex = findPlayerIndexFromID(clientID, state);
  let currentPlayer = state.players[currentPlayerIndex];

  for (let cardIndex = 0;cardIndex < currentPlayer.cards.length;cardIndex++) {
    let curCard = currentPlayer.cards[cardIndex];
    // Check for Color Joker -card
    if (card.number === 13 && curCard.number === card.number) {
      // Remove the played card
      currentPlayer.cards.splice(cardIndex, 1);
      cardIndex = currentPlayer.cards.length;
    }
    // Check for +4 Joker -card
    else if (card.number === 14 && curCard.number === card.number) {
      // Remove the played card
      currentPlayer.cards.splice(cardIndex, 1);
      cardIndex = currentPlayer.cards.length;
    }
    // Check for every other type of card
    else if (curCard.color == card.color && curCard.number == card.number) {
      // Remove the played card
      currentPlayer.cards.splice(cardIndex, 1);
      cardIndex = currentPlayer.cards.length;
    }
  }

  // Add the card to the top of the discard pile
  state.discardPile.push(card);

  // Handle the UNO case
  if (currentPlayer.cards.length === 1 && !state.calledUno) {
    // Force the player to draw two cards
    drawCardForPlayer(clientID, state);
    drawCardForPlayer(clientID, state);
  }
  state.calledUno = false;

  // Check for special cards
  const wasSpecialCard = handleSpecialCards(currentPlayerIndex, card, state);

  // Change the turn here (if no special card)
  if (!wasSpecialCard) {
    changeTurn(currentPlayerIndex, 1, state);
  }

  // Check if the game ends
  if (currentPlayer.cards.length === 0) {
    handleGameEnd(currentPlayer, state);
  }

  // If number card combo is activated, check if other
  // valid cards
  if (state.numberCardCombo) {
    state.usedNumberCardCombo = false;
    handleNumberCardCombo(currentPlayerIndex, state);
  }

  state.drewCard = false;
}

function handleNumberCardCombo(plIndex, state) {
  const player = state.players[plIndex];
  const discardTop = state.discardPile[state.discardPile.length-1];
  const cards = player.cards;

  let foundNumberMatch = false;
  for (let i = 0;i < cards.length;i++) {
    const card = cards[i];
    if (card.number < 10 && card.number === discardTop.number) {
      foundNumberMatch = true;
      i = cards.length;
    }
  }

  if (foundNumberMatch) {
    let prevPlayerIndex = -1;
    if (state.direction === "Normal") {
      prevPlayerIndex = plIndex-1;
    }
    else if (state.direction === "Reversed") {
      prevPlayerIndex = plIndex+1;
    }
    changeTurn(prevPlayerIndex, 1, state);
    state.usedNumberCardCombo = true;
  }
}

function changeTurn (currentPlayerIndex, rounds, state) {
  for (let round = 0;round < rounds;round++) {
    if (state.direction === "Normal") {
      if (currentPlayerIndex+2 <= state.players.length) {
        state.currentPlayer = state.players[currentPlayerIndex+1].number;
        currentPlayerIndex += 1
      }
      else {
        state.currentPlayer = state.players[0].number;
        currentPlayerIndex = 0;
      }
    }
    else if (state.direction === "Reversed") {
      if (currentPlayerIndex-1 >= 0) {
        state.currentPlayer = state.players[currentPlayerIndex-1].number;
        currentPlayerIndex -= 1;
      }
      else {
        state.currentPlayer = state.players[state.players.length-1].number;
        currentPlayerIndex = state.players.length-1;
      }
    }
  }

  return currentPlayerIndex;
}

function handleGameEnd(currentPlayer, state) {
  state.status = "GameEnd";
  state.winner = currentPlayer.name;
  state.standings = calculateStandings(state);
}

function handleSpecialCards(currentPlayerIndex, card, state) {
  let wasSpecialCard = false;

  // Color Joker -card
  if (card.number === 13) {
    wasSpecialCard = true;
    // Change turn
    changeTurn(currentPlayerIndex, 1, state);
  }
  // +4 Joker -card
  else if (card.number === 14) {
    wasSpecialCard = true;
    // Change turn to the next player
    currentPlayerIndex = changeTurn(currentPlayerIndex, 1, state);
    // Make the next player draw four cards
    let currentPlayerClientID = state.players[currentPlayerIndex].client;
    drawCardForPlayer(currentPlayerClientID, state);
    drawCardForPlayer(currentPlayerClientID, state);
    drawCardForPlayer(currentPlayerClientID, state);
    drawCardForPlayer(currentPlayerClientID, state);
    // Change turn to the next player
    currentPlayerIndex = changeTurn(currentPlayerIndex, 1, state);
  }
  // Draw two -card
  else if (card.number === 10) {
    wasSpecialCard = true;
    // Change turn to the next player
    currentPlayerIndex = changeTurn(currentPlayerIndex, 1, state);
    // Make the next player draw two cards
    let currentPlayerClientID = state.players[currentPlayerIndex].client;
    drawCardForPlayer(currentPlayerClientID, state);
    drawCardForPlayer(currentPlayerClientID, state);
    // Change turn to the next player
    currentPlayerIndex = changeTurn(currentPlayerIndex, 1, state);
  }
  // Reverse direction -card
  else if (card.number === 11) {
    wasSpecialCard = true;
    // Reverse the direction
    if (state.direction === "Normal") {
      state.direction = "Reversed";
    }
    else {
      state.direction = "Normal";
    }
    // Change the turn
    changeTurn(currentPlayerIndex, 1, state);
  }
  // Skip player -card
  else if (card.number === 12) {
    wasSpecialCard = true;
    // Skip the next player
    changeTurn(currentPlayerIndex, 2, state);
  }

  return wasSpecialCard;
}

function drawCardForPlayer(clientID, state) {
  let currentPlayer = {};
  let currentPlayerIndex = -1;
  for (let plI = 0;plI < state.players.length;plI++) {
    const player = state.players[plI];
    if (player.client === clientID) {
      currentPlayer = player;
      currentPlayerIndex = plI;
      plI = state.players.length;
    }
  }

  // Draw card for player
  const newCard = state.deck.pop();
  currentPlayer.cards.push(newCard);

  // If deck is empty
  if (state.deck.length === 0) {
    const discardTop = state.discardPile.pop();
    resetJokerCards(state);
    state.deck = shuffleDeck(JSON.parse(JSON.stringify(state.discardPile)));
    state.discardPile = [discardTop];
  }

  const validCard = checkIfValidCard(newCard, state);
  // If draw card skip is enabled and new card is invalid
  if (state.drawCardSkip && !validCard) {
    changeTurn(currentPlayerIndex, 1, state);
  }
  // If draw card skip is enabled and new card is valid
  else if (state.drawCardSkip && validCard) {
    state.drewCard = true;
    state.drawnCard = newCard;
  }
}

function resetJokerCards(state) {
  const discardPile = state.discardPile;
  for (let i = 0;i < discardPile.length;i++) {
    const card = discardPile[i];
    if (card.number === 13 || card.number === 14) {
      card.color = COLORS.BLACK;
    }
  }
}

function calculateStandings(state) {
  let standings = [];

  for (let plI = 0;plI < state.players.length;plI++) {
    const player = state.players[plI];
    const cards = player.cards;

    let points = 0;
    for (let cardI = 0;cardI < cards.length;cardI++) {
      const card = cards[cardI];
      points += getCardPoints(card);
    }

    standings.push({
      name: player.name,
      points: points
    });
  }

  standings.sort(function (a, b) {
    return a.points - b.points
  });

  return standings;
}

function getCardPoints(card) {
  let points = 0;

  if (card.number < 10) {
    points = card.number;
  }
  else if (card.number === 10 || card.number === 11 || card.number === 12) {
    points = 20;
  }
  else if (card.number === 13 || card.number === 14) {
    points = 50;
  }

  return points;
}

function shuffleDeck(deck) {
  let shuffledDeck = [];
  let chosenCardIndex = -1;

  while (deck.length > 0) {
    chosenCardIndex = Math.floor(Math.random() * (deck.length-1));
    shuffledDeck.push(deck[chosenCardIndex]);
    deck.splice(chosenCardIndex, 1);
  }

  return shuffledDeck;
}

function censorGamestate (plNumber, gameState) {
  let censoredState = {
    status: gameState.status,
    winner: gameState.winner,
    standings: gameState.standings,
    deckSize: gameState.deck.length,
    discardTop: gameState.discardPile[gameState.discardPile.length-1],
    currentPlayer: gameState.currentPlayer,
    playersMaxNum: gameState.playersMaxNum,
    players: []
  };

  if (plNumber === gameState.currentPlayer) {
    censoredState.usedNumberCardCombo = gameState.usedNumberCardCombo;
    censoredState.drewCard = gameState.drewCard;
    censoredState.drawnCard = gameState.drawnCard;
  }

  let players = gameState.players;
  for (let plI = 0;plI < players.length;plI++) {
    let player = players[plI];
    if (player.number === plNumber) {
      censoredState.players.push({
        number: player.number,
        name: player.name,
        cards: player.cards
      });
    }
    else {
      censoredState.players.push({
        number: player.number,
        name: player.name,
        cards: player.cards.length
      });
    }
  }

  return censoredState;
}

function createDeck(deckSettings) {
  let deck = [];
  let color;

  for (let colorI = 0;colorI < Object.keys(COLORS).length;colorI++) {
    color = COLORS[Object.keys(COLORS)[colorI]];
    if (color !== COLORS.BLACK) {
      // All cards for one color
      for (let number = 0;number < 13;number++) {
        // How many of the same number
        for (let copy = 1; copy <= deckSettings[number].count;copy++) {
          deck.push({
            color: color,
            number: number
          });
        }
      }
    }
    else {
      // Color Jokers
      for (let joker1I = 0;joker1I < deckSettings[13].count;joker1I++) {
        deck.push({
          color: color,
          number: 13
        });
      }
      // +4 Jokers
      for (let joker2I = 0;joker2I < deckSettings[14].count;joker2I++) {
        deck.push({
          color: color,
          number: 14
        });
      }
    }
  }

  return deck;
}

function initGame(clientID, params) {
  const gameDeck = createDeck(params.deckSettings);
  const shuffledDeck = shuffleDeck(gameDeck);
  
  return {
    status: "Lobby",
    deck: shuffledDeck,
    discardPile: [],
    currentPlayer: 1,
    direction: "Normal",
    unoCalled: false,
    drawCardSkip: params.drawCardSkip,
    drewCard: false,
    drawnCard: undefined,
    numberCardCombo: params.numberCardCombo,
    usedNumberCardCombo: false,
    startCardsNum: params.startCardsNum,
    playersMaxNum: params.playersMaxNum,
    players: [
      {
        client: clientID,
        number: 1,
        name: params.name,
        cards: []
      }
    ]
  };
}

function emitGameState(gameState) {
  let players = gameState.players;
  for (let plI = 0;plI < players.length;plI++) {
    let player = players[plI];
    const censoredState = censorGamestate(player.number, gameState);
    io.to(player.client).emit("gameState", JSON.stringify(censoredState));
  }
}

