
import { GAMECAMERA } from './camera.js';

let titleScreen = document.getElementById("titleScreen");
let gameDisplay = document.getElementById('gameDisplay');
let gameCamera = new GAMECAMERA.Camera(gameDisplay, 320, 0.8, 30, 10, 1200);

function updateGraphics(player, players, level, ui) {
  if (titleScreen.style.display !== "none") {
    titleScreen.style.display = "none";
  }
  if (gameDisplay.style.display === "none") {
    gameDisplay.style.display = "block";
  }
  
  // Empty the canvas
  gameDisplay.getContext('2d').clearRect(0, 0, gameDisplay.width, gameDisplay.height);
  // Use the camera to render game view
  gameCamera.render(player, players, level, ui);
}


const GRAPHICS = {
  updateGraphics
};

export {
  GRAPHICS
};
