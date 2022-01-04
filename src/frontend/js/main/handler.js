
import { GRAPHICS } from './graphics.js'
import { KEYBOARD } from './keyboard.js'; 

const serverAddress = "http://localhost:3000";

let playerNumber;

/* Establish socket connection with the server backend */
const socket = io(serverAddress);

/* Set the socket message listeners */
socket.on("init", handleInit);
socket.on("gameState", handleGameState);
socket.on('unknownCode', handleUnknownCode);
socket.on('tooManyPlayers', handleTooManyPlayers);

/**
 * Finds a certain player from a list of players
 * @param {*} plNumber 
 * @param {*} players 
 */
function findPlayer(plNumber, players) {
  for (let i = 0; i < players.length; i++) {
      let pl = players[i];
      if (pl.number === plNumber) {
          return pl;
      }
  }
}

function updateGame(playerNumber, gameState) {
  console.log(gameState);
  GRAPHICS.updateGraphics();
}

/**
 * Emit a message to the server to create a new game
 */
function newGame() {
  const name = document.getElementById("name").value;
  const gameCode = document.getElementById("newGameCodeInput").value;
  
  socket.emit('newGame', { 
    name: name,
    gameCode: gameCode
  });
}
document.getElementById('newGameButton').addEventListener('click', newGame);

/**
 * Emit a message to the server to join to a game
 */
function joinGame() {
  const code = document.getElementById('gameCodeInput').value;
  const name = document.getElementById("name").value;
  socket.emit('joinGame', { code: code, name: name });
}
document.getElementById('joinGameButton').addEventListener('click', joinGame);

/**
 * Emit a message to the server to start the game
 */
function startGame() {
  socket.emit('startGame', {});
}
document.getElementById('startGameButton').addEventListener('click', startGame);

/**
 * Update the game according to the game state
 * @param {*} gameState the current game state
 */
function handleGameState(gameState) {
  gameState = JSON.parse(gameState);
  // Send the corresponding messages according to keys pressed
  sendKeysPressed();
  // Update the game according to the game state
  updateGame(playerNumber, gameState);
}

function handleInit (plNumber, code) {
  playerNumber = plNumber;
  gameCode = code;
}

/**
 * Emits the corresponding messages to the server according to the 
 * keys pressed
 */
function sendKeysPressed () {
  const keysPressed = KEYBOARD.getKeysPressed();
  for (let i = 0; i < keysPressed.length; i++) {
    let key = keysPressed[i];

    // Just an example for now
    if (key === 87) { // W key
      //socket.emit('move', { number: playerNumber });
    }
  }
}

/**
 * If the player gave an unknown game code
 */
function handleUnknownCode() {
  playerNumber = null;
  alert('Tuntematon pelikoodi')
}

/**
 * If the requested game room is full
 */
function handleTooManyPlayers() {
  playerNumber = null;
  alert('Pelihuone on täynnä');
}

