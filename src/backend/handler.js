
const { io } = require("../app");
module.exports = { io };

const { 
  createNewGame,
  joinGame,
  removeClient,
  movePlayer
} = require("./game");


/* When connection is established */
io.on("connection", (client) => {

  client.on("newGame", handleNewGame);
  function handleNewGame(params) { createNewGame(client, params); }

  client.on("joinGame", handleJoinGame);
  function handleJoinGame(params) { joinGame(client, params); }

  client.on("move", handleMovePlayer);
  function handleMovePlayer(params) { movePlayer(client, params); }

  client.on("disconnect", handleDisconnect);
  function handleDisconnect(params) { removeClient(client, params); }
  
});

