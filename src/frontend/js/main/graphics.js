
import { GAMECAMERA } from './camera.js';

const MOBILE = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);

let titleScreen = document.getElementById("titleScreen");
let gameDisplay = document.getElementById('gameDisplay');
let gameCamera = new GAMECAMERA.Camera(gameDisplay, MOBILE ? 160 : 320, 0.8);

function updateGraphics(player, players, level) {
  if (titleScreen.style.display !== "none") {
    titleScreen.style.display = "none";
  }
  
  // Empty the canvas
  gameDisplay.getContext('2d').clearRect(0, 0, gameDisplay.width, gameDisplay.height);
  // Use the camera to render game view
  gameCamera.render(player, players, level);
}


const GRAPHICS = {
  updateGraphics
};

export {
  GRAPHICS
};
