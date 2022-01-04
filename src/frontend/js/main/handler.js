
import { GRAPHICS } from './graphics.js'
import { KEYBOARD } from './keyboard.js'; 

const serverAddress = "http://localhost:3000";

let playerNumber;
let player;
let level;
let canvas = document.getElementById('display');

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

  player = findPlayer(playerNumber, gameState.players);
  level = gameState.level;
  GRAPHICS.updateGraphics(player, level);
}

canvas.onclick = function () {
  canvas.requestPointerLock();
};
document.addEventListener('pointerlockchange', handlePointerLockChange, false);

function handlePointerLockChange () {
  if(document.pointerLockElement === canvas) {
    document.addEventListener("mousemove", handleMouseMove, false);
  } else {
    document.removeEventListener("mousemove", handleMouseMove, false);
  }
}

function handleMouseMove(e) {
  let movementX = e.movementX ||
      e.mozMovementX          ||
      e.webkitMovementX       ||
      0;

  if (movementX < 0) {
    socket.emit('move', { dir: "RotLeft", number: playerNumber, movementX: movementX });
  }
  else if (movementX > 0) {
    socket.emit('move', { dir: "RotRight", number: playerNumber, movementX: movementX });
  }
}

/**
 * Emit a message to the server to create a new game
 */
function newGame() {
  const name = document.getElementById("name").value;
  
  socket.emit('newGame', { 
    name: name
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

function handleInit (plNumber) {
  playerNumber = plNumber;
}

/**
 * Emits the corresponding messages to the server according to the 
 * keys pressed
 */
function sendKeysPressed () {
  const keysPressed = KEYBOARD.getKeysPressed();
  for (let i = 0; i < keysPressed.length; i++) {
    let key = keysPressed[i];

    if (key === 87) { // W key
      socket.emit('move', { dir: "Forward", number: playerNumber });
    }
    else if (key === 83) { // S key
      socket.emit('move', { dir: "Back", number: playerNumber });
    }
    else if (key === 65) { // A key
      socket.emit('move', { dir: "Left", number: playerNumber });
    }
    else if (key === 68) { // D key
      socket.emit('move', { dir: "Right", number: playerNumber });
    }
    else if (key === 37) { // Left arrow key
      socket.emit('move', { dir: "RotLeft", number: playerNumber });
    }
    else if (key === 39) { // Right arrow key
      socket.emit('move', { dir: "RotRight", number: playerNumber });
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

