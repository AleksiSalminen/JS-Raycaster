const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
/* Export the IO-object (for the socket handler) */
module.exports = { io };
/* Require the socket handler, so that it is loaded on start-up */
require("./backend/handler");

let path = require("path");
let favicon = require("serve-favicon");


/* Express-paths */

app.use(favicon(path.join(__dirname, "favicon.ico")));
app.use("/", express.static(path.join(__dirname, "frontend")));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/frontend/index.html");
});


/* Start the application */

const ip = "127.0.0.1";
const port = 3000;

server.listen(port, ip, () => {
  console.log("App listening on " + ip + ":" + port);
});

