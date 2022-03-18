
import { GAMECAMERA } from './camera.js';

let titleScreen = document.getElementById("titleScreen");
let gameDisplay = document.getElementById('gameDisplay');

let initialized = false;
let gameCamera;
let uiSettings;


function initGraphics (settings) {
  /** Hide the main menu, show the game canvas */
  titleScreen.style.display = "none";
  gameDisplay.style.display = "block";

  uiSettings = settings;

  /** Create a new Camera instance */
  const rays = settings.raycaster.initialValues;
  gameCamera = new GAMECAMERA.Camera(
    gameDisplay, 
    rays.resolution, 
    rays.focalLength, 
    rays.range, 
    rays.lightRange, 
    rays.scaleFactor
  );

  initialized = true;
}

function updateGraphics (player, players, level, ui) {
  if (initialized && gameCamera) {
    // Empty the canvas
    gameDisplay.getContext('2d').clearRect(0, 0, gameDisplay.width, gameDisplay.height);
    // Use the camera to render game view
    gameCamera.render(player, players, level, ui);
  }
}


const GRAPHICS = {
  initGraphics,
  updateGraphics
};

export {
  GRAPHICS
};
