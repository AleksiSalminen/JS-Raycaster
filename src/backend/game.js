const { io } = require('./handler');
const config = require("../../def/config/config.json");
const state = {};
const clientRooms = {};
const helpers = require("./helpers");

const FRAME_RATE = config.framerate;
const maxNumberOfPlayers = config.maxNumberOfPlayers;
const playerHealth = config.playerMaxHealth;
const playerSpeed = config.playerWalkSpeed;
const playerTurnSpeed = Math.PI * config.playerTurnSpeed;

const Player = require("./objects/player");
const Level = require('./objects/level');


module.exports = {

  /**
   * 
   */
  createNewGame(client, params) {
    let roomName = helpers.makeid(5);
    clientRooms[client.id] = roomName;

    const level1 = new Level(
      "test-level.lvl", 
      {}, 
      {}
    );

    const pl1 = new Player(
      client.id, 
      params.name, 
      1, 
      playerHealth, 
      playerHealth,
      playerSpeed,
      playerTurnSpeed,
      {
        x: 2,
        y: 2,
        rotation: 0
      },
      0.7, 
      0.4
    );
  
    state[roomName] = {
      level: level1,
      players: [pl1]
    };

    client.join(roomName);
    client.number = 1;
    client.emit("init", 1, roomName);

    startGameInterval(roomName);
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
    } else if (numClients > maxNumberOfPlayers - 1) {
      client.emit("tooManyPlayers");
      return;
    }

    clientRooms[client.id] = roomName;

    client.join(roomName);
    client.number = numClients + 1;
    client.emit("init", numClients + 1, roomName);

    const playerAmount = state[roomName].players.length;
    const newPlayer = new Player(
      client.id, 
      params.name, 
      state[roomName].players[playerAmount-1].number + 1, 
      playerHealth, 
      playerHealth,
      playerSpeed,
      playerTurnSpeed,
      {
        x: 2,
        y: 2,
        rotation: 0
      },
      0.7, 
      0.4
    );
    
    state[roomName].players.push(newPlayer);
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

    for (let i = 0;i < state[roomName].players.length;i++) {
      let player = state[roomName].players[i];
      if (player.client === client.id) {
        state[roomName].players.splice(i, 1);
        i = state[roomName].players.length;
      }
    }
  },

  /**
   * 
   * @param {*} params 
   */
  movePlayer(client, params) {
    const roomName = clientRooms[client.id];
    if (!roomName) {
      return;
    }

    let stateCurrent = state[roomName];
    for (let i = 0; i < stateCurrent.players.length; i++) {
      let character = stateCurrent.players[i];
      if (character.getNumber() === params.number) {
        let newPlayerPos = JSON.parse(JSON.stringify(character.getPosition()));
        let rotated = false;

        if (params.dir === "Forward") {
          newPlayerPos.x = newPlayerPos.x + Math.sin(newPlayerPos.rotation + Math.PI / 2) * playerSpeed;
          newPlayerPos.y = newPlayerPos.y - Math.cos(newPlayerPos.rotation + Math.PI / 2) * playerSpeed;
        }
        else if (params.dir === "Back") {
          newPlayerPos.x = newPlayerPos.x + Math.sin(newPlayerPos.rotation - Math.PI / 2) * (playerSpeed/2);
          newPlayerPos.y = newPlayerPos.y - Math.cos(newPlayerPos.rotation - Math.PI / 2) * (playerSpeed/2);
        }
        else if (params.dir === "Left") {
          newPlayerPos.x = newPlayerPos.x + Math.sin(character.pos.rotation) * (playerSpeed/2);
          newPlayerPos.y = newPlayerPos.y - Math.cos(character.pos.rotation) * (playerSpeed/2);
        }
        else if (params.dir === "Right") {
          newPlayerPos.x = newPlayerPos.x - Math.sin(character.pos.rotation) * (playerSpeed/2);
          newPlayerPos.y = newPlayerPos.y + Math.cos(character.pos.rotation) * (playerSpeed/2);
        }
        else if (params.dir === "RotLeft") {
          if (params.movementX) {
            newPlayerPos.rotation = newPlayerPos.rotation + params.movementX/150;
          }
          else {
            newPlayerPos.rotation = newPlayerPos.rotation - playerTurnSpeed;
          }

          if (newPlayerPos.rotation < 0) {
            newPlayerPos.rotation = 2 * Math.PI + newPlayerPos.rotation;
          }
          else if (newPlayerPos.rotation > 2 * Math.PI) {
            newPlayerPos.rotation -= 2 * Math.PI;
          }
          rotated = true;
        }
        else if (params.dir === "RotRight") {
          if (params.movementX) {
            newPlayerPos.rotation = newPlayerPos.rotation + params.movementX/150;
          }
          else {
            newPlayerPos.rotation = newPlayerPos.rotation + playerTurnSpeed;
          }

          if (newPlayerPos.rotation < 0) {
            newPlayerPos.rotation = 2 * Math.PI + newPlayerPos.rotation;
          }
          else if (newPlayerPos.rotation > 2 * Math.PI) {
            newPlayerPos.rotation -= 2 * Math.PI;
          }
          rotated = true;
        }

        let hitWall = false;
        let playerTileLoc = Math.floor(newPlayerPos.y) * stateCurrent.level.size + Math.floor(newPlayerPos.x);
        if (stateCurrent.level.getWalls()[playerTileLoc] !== 0) {
          hitWall = true;
        }

        if (!hitWall) {
          if (!rotated) {
            character.moving = true;
          }
          state[roomName].players[i].setPosition(newPlayerPos);
        }
        i = stateCurrent.players.length;
      }
    }

  }

};


function gameLoop(roomName) {
  if (!state[roomName]) {
    return;
  }

  for (h = 0;h < state[roomName].players.length;h++) {
    let player = state[roomName].players[h];
    if (player.moving) {
      player.animation.update();
    }
    else {
      player.animation.reset();
    }
    player.moving = false;
  }
}

function startGameInterval(roomName) {
  const intervalId = setInterval(() => {
    gameLoop(roomName);
    emitGameState(roomName, state[roomName]);
  }, 1000 / FRAME_RATE);
}

function emitGameState(room, gameState) {
  // Send this event to everyone in the room.
  io.sockets.in(room).emit("gameState", JSON.stringify(gameState));
}

