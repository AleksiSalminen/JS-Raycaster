
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
  this.drawSky(player.pos.rotation, level.light);
  this.drawColumns(player, level);
  this.drawPlayers(players);
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

/** Draw (other) players */

Camera.prototype.drawPlayers = function (players) {
  
}

/** Draw columns */

Camera.prototype.drawColumns = function (player, level) {
  this.ctx.save();
  for (let column = 0; column < this.resolution; column++) {
    let x = column / this.resolution - 0.5;
    let angle = Math.atan2(x, this.focalLength);
    let ray = RAYCASTING.raycastMap(level, player.pos, player.pos.rotation + angle, this.range);
    this.drawColumn(column, ray, angle, level);
  }
  this.ctx.restore();
};

Camera.prototype.drawColumn = function (column, ray, angle, level) {
  let ctx = this.ctx;
  let texture = wallImg;
  let left = Math.floor(column * this.spacing);
  let width = Math.ceil(this.spacing);
  let hit = -1;

  while (++hit < ray.length && ray[hit].height <= 0);

  for (let s = ray.length - 1; s >= 0; s--) {
    let step = ray[s];

    if (s === hit) {
      let textureX = Math.floor(texture.width * step.offset);
      let wall = this.project(step.height, angle, step.distance);

      ctx.globalAlpha = 1;
      ctx.drawImage(texture.image, textureX, 0, 1, texture.height, left, wall.top, width, wall.height);

      ctx.fillStyle = '#000000';
      ctx.globalAlpha = Math.max((step.distance + step.shading) / this.lightRange - level.light, 0);
      ctx.fillRect(left, wall.top, width, wall.height);
    }
  }
};

Camera.prototype.project = function (height, angle, distance) {
  let z = distance * Math.cos(angle);
  let wallHeight = this.height * height / z;
  let bottom = this.height / 2 * (1 + 1 / z);
  return {
    top: bottom - wallHeight,
    height: wallHeight
  };
};



/** Exports */

const GAMECAMERA = {
  Camera
};

export {
  GAMECAMERA
};
