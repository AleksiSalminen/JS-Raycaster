const { io } = require("../app");
module.exports = { io };

const { 
  createNewGame,
  joinGame,
  startGame,
  removeClient,
  addCard,
  drawCard,
  skipTurn,
  callUno
} = require("./game");


/* When connection is established */
io.on("connection", (client) => {

  client.on("newGame", handleNewGame);
  function handleNewGame(params) { createNewGame(client, params); }

  client.on("joinGame", handleJoinGame);
  function handleJoinGame(params) { joinGame(client, params); }

  client.on("startGame", handleStartGame);
  function handleStartGame(params) { startGame(client, params) }

  client.on("disconnect", handleDisconnect);
  function handleDisconnect(params) { removeClient(client, params); }

  client.on("addCard", handleAddCard);
  function handleAddCard(params) { addCard(client, params); }

  client.on("drawCard", handleDrawCard);
  function handleDrawCard(params) { drawCard(client, params); }

  client.on("skipTurn", handleSkipTurn);
  function handleSkipTurn(params) { skipTurn(client, params); }

  client.on("callUno", handleCallUno);
  function handleCallUno(params) { callUno(client, params); }

});

