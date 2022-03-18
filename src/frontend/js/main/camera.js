
import { RAYCASTING } from './raycasting.js';
import { IMG_PROC } from './img_process.js';
import { ANIMATION } from './animation.js';


class Camera {

  /**
   * 
   * Constructors
   * 
   */

  constructor(canvas, resolution, focalLength, range, lightRange, scaleFactor, newMinimap) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    this.width = canvas.width = window.innerWidth * 0.5;
    this.height = canvas.height = window.innerHeight * 0.5;
    this.resolution = resolution;
    this.spacing = this.width / resolution;
    this.focalLength = focalLength || 0.8;
    this.range = range;
    this.lightRange = lightRange;
    this.scale = (this.width + this.height) / scaleFactor;

    this.minimap = newMinimap;

    this.uiImagePath = '../../images/ui/';
    this.skyboxImagePath = '../../images/skyboxes/';
    this.wallImagePath = '../../images/walls/';
    this.otherPlayerImagePath = '../../images/other_player/';
    this.fpsImagePath = '../../images/fps/';

    this.weaponImg;
    this.skyImg;
    this.wallImages = [];
    this.otherPlayerImageSet = [
      /** Front facing images */
      new IMG_PROC.Bitmap(this.otherPlayerImagePath + 'op-f-1.png', 400, 700),
      new IMG_PROC.Bitmap(this.otherPlayerImagePath + 'op-f-2.png', 400, 700),
      new IMG_PROC.Bitmap(this.otherPlayerImagePath + 'op-f-3.png', 400, 700),
      new IMG_PROC.Bitmap(this.otherPlayerImagePath + 'op-f-4.png', 400, 700),
      new IMG_PROC.Bitmap(this.otherPlayerImagePath + 'op-f-5.png', 400, 700),
      /** Back facing images */
      new IMG_PROC.Bitmap(this.otherPlayerImagePath + 'op-b-1.png', 400, 700),
      new IMG_PROC.Bitmap(this.otherPlayerImagePath + 'op-b-2.png', 400, 700),
      new IMG_PROC.Bitmap(this.otherPlayerImagePath + 'op-b-3.png', 400, 700),
      new IMG_PROC.Bitmap(this.otherPlayerImagePath + 'op-b-4.png', 400, 700),
      new IMG_PROC.Bitmap(this.otherPlayerImagePath + 'op-b-5.png', 400, 700),
      /** Left facing images */
      new IMG_PROC.Bitmap(this.otherPlayerImagePath + 'op-l-1.png', 400, 700),
      new IMG_PROC.Bitmap(this.otherPlayerImagePath + 'op-l-2.png', 400, 700),
      new IMG_PROC.Bitmap(this.otherPlayerImagePath + 'op-l-3.png', 400, 700),
      new IMG_PROC.Bitmap(this.otherPlayerImagePath + 'op-l-4.png', 400, 700),
      new IMG_PROC.Bitmap(this.otherPlayerImagePath + 'op-l-5.png', 400, 700),
      /** Right facing images */
      new IMG_PROC.Bitmap(this.otherPlayerImagePath + 'op-r-1.png', 400, 700),
      new IMG_PROC.Bitmap(this.otherPlayerImagePath + 'op-r-2.png', 400, 700),
      new IMG_PROC.Bitmap(this.otherPlayerImagePath + 'op-r-3.png', 400, 700),
      new IMG_PROC.Bitmap(this.otherPlayerImagePath + 'op-r-4.png', 400, 700),
      new IMG_PROC.Bitmap(this.otherPlayerImagePath + 'op-r-5.png', 400, 700),
      /** Front-left facing images */
      new IMG_PROC.Bitmap(this.otherPlayerImagePath + 'op-fl-1.png', 400, 700),
      new IMG_PROC.Bitmap(this.otherPlayerImagePath + 'op-fl-2.png', 400, 700),
      new IMG_PROC.Bitmap(this.otherPlayerImagePath + 'op-fl-3.png', 400, 700),
      new IMG_PROC.Bitmap(this.otherPlayerImagePath + 'op-fl-4.png', 400, 700),
      new IMG_PROC.Bitmap(this.otherPlayerImagePath + 'op-fl-5.png', 400, 700),
      /** Front-right facing images */
      new IMG_PROC.Bitmap(this.otherPlayerImagePath + 'op-fr-1.png', 400, 700),
      new IMG_PROC.Bitmap(this.otherPlayerImagePath + 'op-fr-2.png', 400, 700),
      new IMG_PROC.Bitmap(this.otherPlayerImagePath + 'op-fr-3.png', 400, 700),
      new IMG_PROC.Bitmap(this.otherPlayerImagePath + 'op-fr-4.png', 400, 700),
      new IMG_PROC.Bitmap(this.otherPlayerImagePath + 'op-fr-5.png', 400, 700),
      /** Back-left facing images */
      new IMG_PROC.Bitmap(this.otherPlayerImagePath + 'op-bl-1.png', 400, 700),
      new IMG_PROC.Bitmap(this.otherPlayerImagePath + 'op-bl-2.png', 400, 700),
      new IMG_PROC.Bitmap(this.otherPlayerImagePath + 'op-bl-3.png', 400, 700),
      new IMG_PROC.Bitmap(this.otherPlayerImagePath + 'op-bl-4.png', 400, 700),
      new IMG_PROC.Bitmap(this.otherPlayerImagePath + 'op-bl-5.png', 400, 700),
      /** Back-right facing images */
      new IMG_PROC.Bitmap(this.otherPlayerImagePath + 'op-br-1.png', 400, 700),
      new IMG_PROC.Bitmap(this.otherPlayerImagePath + 'op-br-2.png', 400, 700),
      new IMG_PROC.Bitmap(this.otherPlayerImagePath + 'op-br-3.png', 400, 700),
      new IMG_PROC.Bitmap(this.otherPlayerImagePath + 'op-br-4.png', 400, 700),
      new IMG_PROC.Bitmap(this.otherPlayerImagePath + 'op-br-5.png', 400, 700)
    ];
  }


  /**
   * 
   * Methods
   * 
   */


  /** The main rendering method */

  render(player, players, level) {
    //this.drawSky(player.pos.rotation, level);
    this.drawColumns(player, players, level);
    this.drawWeapon(player.weaponImg);
    if (this.minimap.show) {
      this.drawMiniMap(player, players, level);
    }
  };

  /** Draw sky */

  drawSky(direction, level) {
    let ctx = this.ctx;

    if (this.skyImg === undefined) {
      this.skyImg = new IMG_PROC.Bitmap(this.skyboxImagePath + level.skybox.fileName, level.skybox.width, level.skybox.height);
    }

    let width = this.skyImg.width * (this.height / this.skyImg.height) * 2;
    let left = (direction / Math.PI * 2) * -width;

    ctx.save();
    ctx.drawImage(this.skyImg.image, left, 0, width, this.height);
    if (left < (width - this.width)) {
      ctx.drawImage(this.skyImg.image, left + width, 0, width, this.height);
    }
    if (level.light > 0) {
      ctx.fillStyle = '#ffffff';
      ctx.globalAlpha = level.light * 0.1;
      ctx.fillRect(0, this.height * 0.5, this.width, this.height * 0.5);
    }
    ctx.restore();
  };

  /** Draw maps */

  drawMiniMap(player, players, level) {
    let ctx = this.ctx;
    let minimap = this.minimap;

    let width = minimap.width;
    let height = minimap.height;
    let stepX = width / level.dimensions.width;
    let stepY = height / level.dimensions.height;

    let coordinates = minimap.getCoordinates(this.width, this.height);
    let startX = coordinates.x;
    let startY = coordinates.y;

    /** Draw background */
    ctx.globalAlpha = 1;
    ctx.fillStyle = minimap.backgroundColor;
    ctx.fillRect(startX, startY, width, height);

    /** Draw walls */
    ctx.fillStyle = minimap.wallColor;
    for (let i = 0; i < level.dimensions.width; i++) {
      for (let j = 0; j < level.dimensions.height; j++) {
        let wall = level.walls[j * level.dimensions.width + i];
        if (wall !== 0) {
          ctx.fillRect(startX + i * stepX, startY + j * stepY, stepX, stepY);
        }
      }
    }

    let plX;
    let plY;

    /** Draw other players */
    ctx.fillStyle = minimap.otherPlayerColor;
    for (let k = 0; k < players.length; k++) {
      const pl = players[k];
      if (pl.number !== player.number) {
        plX = pl.pos.x;
        plY = pl.pos.y;
        ctx.beginPath();
        ctx.arc(startX + plX * stepX, startY + plY * stepY, stepX / 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    /** Draw player */
    plX = player.pos.x;
    plY = player.pos.y;
    ctx.fillStyle = minimap.playerColor;
    ctx.beginPath();
    ctx.arc(startX + plX * stepX, startY + plY * stepY, stepX / 2, 0, Math.PI * 2);
    ctx.fill();
  }

  /** Draw weapon */

  drawWeapon(imgName) {
    let ctx = this.ctx;
    let weaponImg = this.weaponImg;
    let fpsImagePath = this.fpsImagePath;

    if (weaponImg === undefined) {
      weaponImg = new IMG_PROC.Bitmap(fpsImagePath + imgName, 319, 320);
    }

    let left = this.width * 0.66;
    let top = this.height * 0.6;
    ctx.drawImage(weaponImg.image, left, top, weaponImg.width * this.scale, weaponImg.height * this.scale);
  };

  /** Draw columns */

  drawColumns(player, players, level) {
    let ctx = this.ctx;
    let wallImages = this.wallImages;
    let wallImagePath = this.wallImagePath;

    ctx.save();

    if (wallImages.length === 0) {
      let imgID;
      let imgName;
      let texture;
      let width;
      let height;
      for (let imgI = 0; imgI < level.wallTextures.length; imgI++) {
        imgID = level.wallTextures[imgI].id;
        imgName = level.wallTextures[imgI].fileName;
        width = level.wallTextures[imgI].width;
        height = level.wallTextures[imgI].height;
        texture = new IMG_PROC.Bitmap(wallImagePath + imgName, width, height);
        wallImages.push({
          id: imgID,
          texture: texture
        });
      }
    }

    let zBuffer = [];
    for (let column = 0; column < this.resolution; column++) {
      let x = column / this.resolution - 0.5;
      let angle = Math.atan2(x, this.focalLength);
      let ray = RAYCASTING.castRay(level, player.pos, player.pos.rotation + angle, this.range);
      this.drawColumn(column, ray, angle, level, zBuffer);
    }
    this.drawPlayers(player, players, player.pos.rotation, zBuffer);
    ctx.restore();
  };

  drawColumn(column, ray, angle, level, zBuffer) {
    let ctx = this.ctx;
    let left = Math.floor(column * this.spacing);
    let width = Math.ceil(this.spacing);
    let hit = -1;

    while (++hit < ray.length && ray[hit].height <= 0);

    for (let s = ray.length - 1; s >= 0; s--) {
      let step = ray[s];

      if (s === hit) {
        let wallImg = this.getWallImg(step.wall).texture;

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

  getWallImg(wallID) {
    let wallImg;

    if (wallID === 0) {
      return this.wallImages[0];
    }

    let texture;
    let txID;
    for (let imgI = 0; imgI < this.wallImages.length; imgI++) {
      texture = this.wallImages[imgI];
      txID = texture.id;

      if (txID === wallID) {
        wallImg = texture;
        imgI = this.wallImages.length;
      }
    }

    return wallImg;
  }

  wallProject(height, angle, distance) {
    let z = distance * Math.cos(angle);
    let wallHeight = this.height * height / z;
    let bottom = this.height / 2 * (1 + 1 / z);
    return {
      top: bottom - wallHeight,
      height: wallHeight
    };
  };

  /** Draw players */

  drawPlayers(player, players, angle, zBuffer) {
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
        otherPlayerImg = this.otherPlayerImageSet[rowIndex * 5 + otherPlayer.animation.frameIndex];
        this.drawSprite(player, otherPlayer, angle, otherPlayerImg, zBuffer);
        this.drawPlayerName(player, otherPlayer, angle);
      }
    }
  }

  drawPlayerName(player, players, angle) {

  }

  /** Draw sprites */

  drawSprite(player, sprite, angle, texture, zBuffer) {
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

  compareZBuffer(startX, endX, dist, zBuffer) {
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

}



/** Exports */

const GAMECAMERA = {
  Camera
};

export {
  GAMECAMERA
};
