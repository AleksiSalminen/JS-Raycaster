
import { GAMECAMERA } from './camera.js';
import { MAPS } from './maps.js';

let titleScreen = document.getElementById("titleScreen");
let lobbyScreen = document.getElementById("gameLobby");
let gameDisplay = document.getElementById('gameDisplay');

let initialized = false;
let gameCamera;
let uiSettings;


function initGraphics(settings) {
  console.log("A");
  /** Hide the main menu and game lobby, show the game canvas */
  titleScreen.style.display = "none";
  lobbyScreen.style.display = "none";
  gameDisplay.style.display = "block";

  uiSettings = settings;

  /** Create a new minimap */
  let minimap = new MAPS.Minimap(settings.minimap);

  /** Create a new Camera instance */
  const rays = settings.raycaster.initialValues;
  gameCamera = new GAMECAMERA.Camera(
    gameDisplay,
    rays.resolution,
    rays.focalLength,
    rays.range,
    rays.lightRange,
    rays.scaleFactor,
    settings.images.paths,
    settings.images.animation,
    minimap
  );

  initialized = true;
}

function updateGraphics(player, players, level) {
  if (initialized && gameCamera) {
    // Empty the canvas
    gameDisplay.getContext('2d').clearRect(0, 0, gameDisplay.width, gameDisplay.height);
    // Use the camera to render game view
    gameCamera.render(player, players, level);
  }
}

function initLobby(player, players, gameCode) {
  /** Hide main menu and game display, show game lobby */
  titleScreen.style.display = "none";
  gameDisplay.style.display = "none";
  lobbyScreen.style.display = "block";

  document.getElementById("gameCodeText").innerHTML = "Gamecode: " + gameCode;

  let playersList = document.getElementById("playersList");
  let playersListString = "<ul id='playersList' style='list-style-position: inside; padding-left: 0;'>";
  for (let i = 0;i < players.length;i++) {
    if (players[i].number !== player.number) {
      playersListString += "<li>" + players[i].name + "</li>";
    }
    else {
      playersListString += "<li><b>" + players[i].name + "</b></li>";
    }
  }
  playersListString += "</ul>"
  playersList.innerHTML = playersListString;
}


const GRAPHICS = {
  initGraphics,
  updateGraphics,
  initLobby
};

export {
  GRAPHICS
};
