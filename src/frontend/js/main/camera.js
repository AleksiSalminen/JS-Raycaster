
import { RAYCASTING } from './raycasting.js';
import { IMG_PROC } from './img_process.js';
import { ANIMATION } from './animation.js';


/**
 * Constants, attributes
 */

const CIRCLE = Math.PI * 2;
const MOBILE = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);

let weaponImg = new IMG_PROC.Bitmap('../../images/knife_hand.png', 319, 320);
let skyImg = new IMG_PROC.Bitmap('../../images/deathvalley_panorama.jpg', 2000, 750);
let wallImg = new IMG_PROC.Bitmap('../../images/wall_texture.jpg', 1024, 1024);
let otherPlayerImageSet = [
  /** Front facing images */
  new IMG_PROC.Bitmap('../../images/other_player/op-f-1.png', 400, 700),
  new IMG_PROC.Bitmap('../../images/other_player/op-f-2.png', 400, 700),
  new IMG_PROC.Bitmap('../../images/other_player/op-f-3.png', 400, 700),
  new IMG_PROC.Bitmap('../../images/other_player/op-f-4.png', 400, 700),
  new IMG_PROC.Bitmap('../../images/other_player/op-f-5.png', 400, 700),
  /** Back facing images */
  new IMG_PROC.Bitmap('../../images/other_player/op-b-1.png', 400, 700),
  new IMG_PROC.Bitmap('../../images/other_player/op-b-2.png', 400, 700),
  new IMG_PROC.Bitmap('../../images/other_player/op-b-3.png', 400, 700),
  new IMG_PROC.Bitmap('../../images/other_player/op-b-4.png', 400, 700),
  new IMG_PROC.Bitmap('../../images/other_player/op-b-5.png', 400, 700),
  /** Left facing images */
  new IMG_PROC.Bitmap('../../images/other_player/op-l-1.png', 400, 700),
  new IMG_PROC.Bitmap('../../images/other_player/op-l-2.png', 400, 700),
  new IMG_PROC.Bitmap('../../images/other_player/op-l-3.png', 400, 700),
  new IMG_PROC.Bitmap('../../images/other_player/op-l-4.png', 400, 700),
  new IMG_PROC.Bitmap('../../images/other_player/op-l-5.png', 400, 700),
  /** Right facing images */
  new IMG_PROC.Bitmap('../../images/other_player/op-r-1.png', 400, 700),
  new IMG_PROC.Bitmap('../../images/other_player/op-r-2.png', 400, 700),
  new IMG_PROC.Bitmap('../../images/other_player/op-r-3.png', 400, 700),
  new IMG_PROC.Bitmap('../../images/other_player/op-r-4.png', 400, 700),
  new IMG_PROC.Bitmap('../../images/other_player/op-r-5.png', 400, 700),
  /** Front-left facing images */
  new IMG_PROC.Bitmap('../../images/other_player/op-fl-1.png', 400, 700),
  new IMG_PROC.Bitmap('../../images/other_player/op-fl-2.png', 400, 700),
  new IMG_PROC.Bitmap('../../images/other_player/op-fl-3.png', 400, 700),
  new IMG_PROC.Bitmap('../../images/other_player/op-fl-4.png', 400, 700),
  new IMG_PROC.Bitmap('../../images/other_player/op-fl-5.png', 400, 700),
  /** Front-right facing images */
  new IMG_PROC.Bitmap('../../images/other_player/op-fr-1.png', 400, 700),
  new IMG_PROC.Bitmap('../../images/other_player/op-fr-2.png', 400, 700),
  new IMG_PROC.Bitmap('../../images/other_player/op-fr-3.png', 400, 700),
  new IMG_PROC.Bitmap('../../images/other_player/op-fr-4.png', 400, 700),
  new IMG_PROC.Bitmap('../../images/other_player/op-fr-5.png', 400, 700),
  /** Back-left facing images */
  new IMG_PROC.Bitmap('../../images/other_player/op-bl-1.png', 400, 700),
  new IMG_PROC.Bitmap('../../images/other_player/op-bl-2.png', 400, 700),
  new IMG_PROC.Bitmap('../../images/other_player/op-bl-3.png', 400, 700),
  new IMG_PROC.Bitmap('../../images/other_player/op-bl-4.png', 400, 700),
  new IMG_PROC.Bitmap('../../images/other_player/op-bl-5.png', 400, 700),
  /** Back-right facing images */
  new IMG_PROC.Bitmap('../../images/other_player/op-br-1.png', 400, 700),
  new IMG_PROC.Bitmap('../../images/other_player/op-br-2.png', 400, 700),
  new IMG_PROC.Bitmap('../../images/other_player/op-br-3.png', 400, 700),
  new IMG_PROC.Bitmap('../../images/other_player/op-br-4.png', 400, 700),
  new IMG_PROC.Bitmap('../../images/other_player/op-br-5.png', 400, 700),
];


/** 
 * Constructors 
 */

/**
 * 
 * @param {*} canvas 
 * @param {*} resolution 
 * @param {*} focalLength 
 */
function Camera(canvas, resolution, focalLength) {
  this.canvas = canvas;
  this.ctx = canvas.getContext('2d');
  this.width = canvas.width = window.innerWidth * 0.5;
  this.height = canvas.height = window.innerHeight * 0.5;
  this.resolution = resolution;
  this.spacing = this.width / resolution;
  this.focalLength = focalLength || 0.8;
  this.range = MOBILE ? 20 : 30;
  this.lightRange = 10;
  this.scale = (this.width + this.height) / 1200;
}


/**
 * Methods
 */

/** The main rendering method */

Camera.prototype.render = function (player, players, level) {
  this.drawSky(player.pos.rotation, level.light);
  this.drawColumns(player, players, level);
  this.drawWeapon();
  this.drawMiniMap(player, players, level);
};

/** Draw sky */

Camera.prototype.drawSky = function (direction, ambient) {
  let width = skyImg.width * (this.height / skyImg.height) * 2;
  let left = (direction / CIRCLE) * -width;

  this.ctx.save();
  this.ctx.drawImage(skyImg.image, left, 0, width, this.height);
  if (left < width - this.width) {
    this.ctx.drawImage(skyImg.image, left + width, 0, width, this.height);
  }
  if (ambient > 0) {
    this.ctx.fillStyle = '#ffffff';
    this.ctx.globalAlpha = ambient * 0.1;
    this.ctx.fillRect(0, this.height * 0.5, this.width, this.height * 0.5);
  }
  this.ctx.restore();
};

/** Draw maps */

Camera.prototype.drawMiniMap = function (player, players, level) {
  let ctx = this.ctx;

  let startX = 0;
  let startY = 0;
  let width = 50;
  let height = 50;
  let stepX = width / level.size;
  let stepY = height / level.size;

  ctx.globalAlpha = 1;
  ctx.fillStyle = "#000000"
  ctx.fillRect(startX, startY, width, height);
  ctx.fillStyle = "#808080";

  /** Draw walls */
  for (let i = 0;i < level.size;i++) {
    for (let j = 0;j < level.size;j++) {
      let wall = level.walls[j*level.size + i];
      if (wall !== 0) {
        ctx.fillRect(i*stepX, j*stepY, stepX, stepY);
      }
    }
  }

  let plX;
  let plY;
  /** Draw other players */
  ctx.fillStyle = "#0000FF";
  for (let k = 0;k < players.length;k++) {
    const pl = players[k];
    if (pl.number !== player.number) {
      plX = pl.pos.x;
      plY = pl.pos.y;
      ctx.beginPath();
      ctx.arc(plX*stepX, plY*stepY, stepX/2, 0, Math.PI*2);
      ctx.fill();
    }
  }

  /** Draw player */
  plX = player.pos.x;
  plY = player.pos.y;
  ctx.fillStyle = "#008000";
  ctx.beginPath();
  ctx.arc(plX*stepX, plY*stepY, stepX/2, 0, Math.PI*2);
  ctx.fill();
}

/** Draw weapon */

Camera.prototype.drawWeapon = function () {
  let left = this.width * 0.66;
  let top = this.height * 0.6;
  this.ctx.drawImage(weaponImg.image, left, top, weaponImg.width * this.scale, weaponImg.height * this.scale);
};

/** Draw columns */

Camera.prototype.drawColumns = function (player, players, level) {
  this.ctx.save();
  let zBuffer = [];
  for (let column = 0; column < this.resolution; column++) {
    let x = column / this.resolution - 0.5;
    let angle = Math.atan2(x, this.focalLength);
    let ray = RAYCASTING.castRay(level, player, players, player.pos, player.pos.rotation + angle, this.range);
    this.drawColumn(column, ray, angle, level, player, players, zBuffer);
  }
  this.drawPlayers(player, players, player.pos.rotation, zBuffer);
  this.ctx.restore();
};

Camera.prototype.drawColumn = function (column, ray, angle, level, player, players, zBuffer) {
  let ctx = this.ctx;
  let left = Math.floor(column * this.spacing);
  let width = Math.ceil(this.spacing);
  let hit = -1;

  while (++hit < ray.length && ray[hit].height <= 0);

  for (let s = ray.length - 1; s >= 0; s--) {
    let step = ray[s];

    if (s === hit) {
      let textureX = Math.floor(wallImg.width * step.offset);
      let wallProj = this.wallProject(step.height, angle, step.distance);
      
      ctx.globalAlpha = 1;
      ctx.drawImage(wallImg.image, textureX, 0, 1, wallImg.height, left, wallProj.top, width, wallProj.height);

      ctx.fillStyle = '#000000';
      ctx.globalAlpha = Math.max((step.distance + step.shading) / this.lightRange - level.light, 0);
      ctx.fillRect(left, wallProj.top, width, wallProj.height);

      zBuffer.push(step.distance);
      s = -1;
    }
  }
};

Camera.prototype.wallProject = function (height, angle, distance) {
  let z = distance * Math.cos(angle);
  let wallHeight = this.height * height / z;
  let bottom = this.height / 2 * (1 + 1 / z);
  return {
    top: bottom - wallHeight,
    height: wallHeight
  };
};

/** Draw players */

Camera.prototype.drawPlayers = function (player, players, angle, zBuffer) {
  let otherPlayer;

  // Calculate other players' distances from the player
  for (let plI = 0; plI < players.length; plI++) {
    otherPlayer = players[plI];
    players[plI].dist = Math.sqrt(Math.pow((player.pos.x - otherPlayer.pos.x), 2) + Math.pow((player.pos.y - otherPlayer.pos.y), 2));
  }

  // Sort the other players to descending order 
  // according to distance from the player
  players.sort(function (a, b) {
    return b.dist - a.dist
  });

  let rowIndex;
  let otherPlayerImg;
  for (let plI = 0; plI < players.length; plI++) {
    otherPlayer = players[plI];
    if (otherPlayer.number !== player.number) {
      rowIndex = ANIMATION.getSpriteRowIndex(player.pos, otherPlayer.pos);
      otherPlayerImg = otherPlayerImageSet[rowIndex*5 + otherPlayer.animation.frameIndex];
      this.drawSprite(player, otherPlayer, angle, otherPlayerImg, zBuffer);
      this.drawPlayerName(player, otherPlayer, angle);
    }
  }
}

Camera.prototype.drawPlayerName = function (player, players, angle) {

}

/** Draw sprites */

Camera.prototype.drawSprite = function (player, sprite, angle, texture, zBuffer) {
  let ctx = this.ctx;
  // Player rotation to degrees
  angle = angle * (180 / Math.PI);

  // Find the distances between sprite and player
  let xDist = sprite.pos.x - player.pos.x;
  let yDist = sprite.pos.y - player.pos.y;
  let dist = Math.sqrt(Math.pow((player.pos.x - sprite.pos.x), 2) + Math.pow((player.pos.y - sprite.pos.y), 2));

  // Angle between sprite and player
  let spritePlayerAngle = Math.atan2(yDist, xDist);
  spritePlayerAngle *= (180 / Math.PI);
  if (spritePlayerAngle < 0) spritePlayerAngle += 360;

  // Get the angle difference
  let angleDiff = spritePlayerAngle - angle;
  if (spritePlayerAngle > 270 && angle < 90) angleDiff -= 360;
  if (angle > 270 && spritePlayerAngle < 90) angleDiff += 360;

  // Get the drawn sprite measures
  let height = this.height * sprite.height / dist;
  let bottom = this.height / 2 * (1 + 1 / dist);
  let width = height / sprite.height * sprite.width;

  // Some magic
  let magicNumber = 1.5;

  // Base X- and Y-coordinates of the sprite
  let yTmp = bottom - height;
  let xTmp = angleDiff * this.width / (this.focalLength * (180 / Math.PI) * magicNumber) + this.width / 2 - width / 2;

  // Starting and ending ray positions for drawing the sprite
  let startX = Math.floor(xTmp / this.spacing);
  let endX = Math.floor((xTmp + width) / this.spacing);

  // Z-Buffer comparisons
  let zBufferedLocs = this.compareZBuffer(startX, endX, dist, zBuffer);

  // Update the starting and ending
  startX = zBufferedLocs.startX * this.spacing;
  endX = zBufferedLocs.endX * this.spacing;

  // Get the texture clipping information
  let clipStart = 0;
  let clipEnd = 0;
  if (zBufferedLocs.wallAtBeginning) {
    clipStart = texture.width - ((endX - startX) / width * texture.width);
    clipEnd = texture.width - clipStart;
  }
  else {
    clipStart = 0;
    clipEnd = (endX - startX) / width * texture.width;
  }

  // Set the brightness according to distance
  let distShading = 100 / dist * this.lightRange / 4;
  distShading = distShading > 100 ? 100 : distShading;
  ctx.filter = "brightness(" + distShading + "%)";

  // Draw the sprite
  ctx.globalAlpha = 1;
  ctx.drawImage(
    texture.image,
    clipStart, 0, clipEnd, texture.height,
    startX, yTmp, endX - startX, height
  );

  // Set brightness back to normal
  ctx.filter = "brightness(100%)";
}

Camera.prototype.compareZBuffer = function (startX, endX, dist, zBuffer) {
  // Value gap for the Z-Buffer comparison
  let depthCheckStart = startX;
  let depthCheckEnd = endX;

  // Z-Buffer comparisons
  let wallAtBeginning = false;
  for (let col = depthCheckStart; col <= depthCheckEnd; col++) {
    // Check if compared value is outside draw distance
    if (!zBuffer[col]) {
      
    }
    // See if there are walls in front of the sprite
    else if (zBuffer[col] < dist) {
      if (col === depthCheckStart) {
        wallAtBeginning = true;
      }

      if (wallAtBeginning) {
        startX = col;
      }
      else {
        endX = col - 1;
        col = depthCheckEnd;
      }
    }
  }

  return { startX: startX, endX: endX, wallAtBeginning: wallAtBeginning };
}


/** Exports */

const GAMECAMERA = {
  Camera
};

export {
  GAMECAMERA
};
