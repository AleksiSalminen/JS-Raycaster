const { io } = require('./handler');
const { level } = require('./level');
const state = {};
const clientRooms = {};
const FRAME_RATE = 30;

const maxNumberOfPlayers = 4;
const playerHealth = 100;
const playerSpeed = 0.04;
const playerTurnSpeed = Math.PI * 0.04;

module.exports = {

  /**
   * 
   */
  createNewGame(client, params) {
    let roomName = makeid(5);
    clientRooms[client.id] = roomName;
    client.emit("gameCode", roomName);

    state[roomName] = initGame(client.id, params.name);

    client.join(roomName);
    client.number = 1;
    client.emit("init", 1);

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
    client.emit("gameCode", roomName);
    client.number = numClients + 1;
    client.emit("init", numClients + 1);
    
    const playerAmount = state[roomName].players.length;
    state[roomName].players.push({
      client: client.id,
      number: state[roomName].players[playerAmount-1].number + 1,
      name: params.name,
      health: playerHealth,
      gotHit: 0,
      pos: {
        x: 3,
        y: 0,
        rotation: 0
      }
    });
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
      if (character.number === params.number) {
        let newPlayerPos = {
          x: character.pos.x,
          y: character.pos.y,
          rotation: character.pos.rotation
        }

        if (params.dir === "Forward") {
          newPlayerPos.x = character.pos.x + Math.sin(character.pos.rotation + Math.PI / 2) * playerSpeed;
          newPlayerPos.y = character.pos.y - Math.cos(character.pos.rotation + Math.PI / 2) * playerSpeed;
        }
        else if (params.dir === "Back") {
          newPlayerPos.x = character.pos.x + Math.sin(character.pos.rotation - Math.PI / 2) * (playerSpeed/2);
          newPlayerPos.y = character.pos.y - Math.cos(character.pos.rotation - Math.PI / 2) * (playerSpeed/2);
        }
        else if (params.dir === "Left") {
          newPlayerPos.x = character.pos.x + Math.sin(character.pos.rotation) * (playerSpeed/2);
          newPlayerPos.y = character.pos.y - Math.cos(character.pos.rotation) * (playerSpeed/2);
        }
        else if (params.dir === "Right") {
          newPlayerPos.x = character.pos.x - Math.sin(character.pos.rotation) * (playerSpeed/2);
          newPlayerPos.y = character.pos.y + Math.cos(character.pos.rotation) * (playerSpeed/2);
        }
        else if (params.dir === "RotLeft") {
          if (params.movementX) {
            newPlayerPos.rotation = character.pos.rotation + params.movementX/150;
          }
          else {
            newPlayerPos.rotation = character.pos.rotation - playerTurnSpeed;
          }

          if (newPlayerPos.rotation < 0) {
            newPlayerPos.rotation = 2 * Math.PI + newPlayerPos.rotation;
          }
          else if (newPlayerPos.rotation > 2 * Math.PI) {
            newPlayerPos.rotation -= 2 * Math.PI;
          }
        }
        else if (params.dir === "RotRight") {
          if (params.movementX) {
            newPlayerPos.rotation = character.pos.rotation + params.movementX/150;
          }
          else {
            newPlayerPos.rotation = character.pos.rotation + playerTurnSpeed;
          }

          if (newPlayerPos.rotation < 0) {
            newPlayerPos.rotation = 2 * Math.PI + newPlayerPos.rotation;
          }
          else if (newPlayerPos.rotation > 2 * Math.PI) {
            newPlayerPos.rotation -= 2 * Math.PI;
          }
        }

        let hitWall = false;
        let playerTileLoc = Math.floor(character.pos.y) * level.size + Math.floor(character.pos.x);
        if (level.wallGrid[playerTileLoc] !== 0) {
          hitWall = true;
        }

        if (!hitWall) {
          state[roomName].players[i].pos = newPlayerPos;
        }
        i = stateCurrent.players.length;
      }
    }

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

function initGame(clientID, playerName) {
  return {
    level: level,
    players: [
      {
        client: clientID,
        number: 1,
        name: playerName,
        health: playerHealth,
        weaponImg: '../../assets/knife_hand.png',
        gotHit: 0,
        pos: {
          x: 2,
          y: 2,
          rotation: 0
        }
      }
    ]
  };
}

function gameLoop(roomName) {
  if (!state[roomName]) {
    return;
  }

  for (h = 0;h < state[roomName].players.length;h++) {
    let player = state[roomName].players[h];

  }

}

/**
 * Main game loop
 * @param {*} roomName 
 */
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

