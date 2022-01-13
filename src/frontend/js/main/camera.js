
import { RAYCASTING } from './raycasting.js';
import { IMG_PROC } from './img_process.js';


/**
 * Constants, attributes
 */

const CIRCLE = Math.PI * 2;
const MOBILE = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);

let weaponImg = new IMG_PROC.Bitmap('../../images/knife_hand.png', 319, 320);
let skyImg = new IMG_PROC.Bitmap('../../images/deathvalley_panorama.jpg', 2000, 750);
let wallImg = new IMG_PROC.Bitmap('../../images/wall_texture.jpg', 1024, 1024);
let otherPlayerImg = new IMG_PROC.Bitmap('../../images/other_player/op_d_2.png', 21, 29);


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
  this.range = MOBILE ? 8 : 14;
  this.lightRange = 10;
  this.scale = (this.width + this.height) / 1200;
}


/**
 * Methods
 */

/** The main rendering method */

Camera.prototype.render = function (player, players, level) {
  this.updatePlayerDistances(player, players);
  this.drawSky(player.pos.rotation, level.light);
  this.drawColumns(player, players, level);
  this.drawWeapon();
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
  let player2;

  for (let plI = 0; plI < players.length; plI++) {
    player2 = players[plI];
    if (player2.number !== player.number) {
      this.drawSprite(player, player2, angle, otherPlayerImg, zBuffer);
      this.drawPlayerName(player, player2, angle);
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

  // Draw the sprite
  ctx.globalAlpha = 1;
  ctx.drawImage(
    texture.image,
    clipStart, 0, clipEnd, texture.height,
    startX, yTmp, endX - startX, height
  );
}

Camera.prototype.compareZBuffer = function (startX, endX, dist, zBuffer) {
  // Value gap for the Z-Buffer comparison
  let depthCheckStart = startX;
  let depthCheckEnd = endX;

  // Z-Buffer comparisons
  let wallAtBeginning = false;
  for (let col = depthCheckStart; col <= depthCheckEnd; col++) {
    // See if there are walls in front of the sprite
    if (zBuffer[col] < dist) {
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

Camera.prototype.objectProject = function (height, angle, distance) {
  let z = distance;
  let wallHeight = this.height * height / z;
  let bottom = this.height / 2 * (1 + 1 / z);
  return {
    top: bottom - wallHeight,
    height: wallHeight
  };
};

/** Player distance calculations */

Camera.prototype.updatePlayerDistances = function (player, players) {
  const plPos = player.pos;
  let pl2Pos = { x: 0, y: 0 };
  const angle = plPos.rotation;

  // Geometric variables
  let lineF = {};
  let distanceFromPlayer = 0;
  let distanceFromLine = 0;
  let lineLength = 0;
  let lineToP2Angle = 0;

  /** Calculate the line function */

  // Create an example position
  const linePos = {
    x: Math.cos(angle) * 1,
    y: Math.sin(angle) * 1
  };

  // Define the line function
  lineF.slope = (plPos.y - linePos.y) / (plPos.x - linePos.x);
  lineF.stdTerm = plPos.y - lineF.slope * plPos.x;

  /** Calculate and update (other) players' distance info */
  for (let plI = 0; plI < players.length; plI++) {
    if (players[plI].number !== player.number) {
      pl2Pos = players[plI].pos;

      // Distance from the player
      distanceFromPlayer = Math.sqrt(
        (Math.pow(pl2Pos.x - plPos.x, 2)) +
        (Math.pow(pl2Pos.y - plPos.y, 2))
      );

      // Distance from the player line
      distanceFromLine =
        Math.abs(lineF.slope * pl2Pos.x + pl2Pos.y + lineF.stdTerm)
        /
        Math.sqrt(Math.pow(lineF.slope, 2) + 1)
        ;

      // Line length
      lineLength = Math.sqrt(Math.abs(
        Math.pow(distanceFromPlayer, 2) -
        Math.pow(distanceFromLine, 2)
      ));

      // The angle between the player line and player 2
      lineToP2Angle = Math.atan(distanceFromLine / lineLength);

      // Update distances information
      pl2Pos.distances = {
        fromPlayer: distanceFromPlayer,
        fromLine: distanceFromLine,
        lineLength: lineLength,
        lineToP2Angle: lineToP2Angle
      };

    }
  }
}


/** Exports */

const GAMECAMERA = {
  Camera
};

export {
  GAMECAMERA
};
