
const helpers = require("../helpers");

const LEVEL_FILES_LOC = "../def/levels/"


function parseLevelInfo (data) {
    let info = {};
    // Split the lines to an array
    data = data.split("\n");
    for (let j = 0;j < data.length;j++) {
        data[j] = data[j].replace("\r", "");
    }
    
    for (let i = 0;i < data.length;i++) {
        let line = data[i];
        if (line == "Name:") {
            i++;
            info.name = data[i]
        }
        else if (line == "Skybox:") {
            i++;
            info.skybox = data[i]
        }
        else if (line == "WallTextures:") {
            let wallTextures = [];
            while (data[i+1] !== "WallGrid:") {
                i++;
                wallTextures.push({
                    id: data[i].slice(0, 2),
                    texture: data[i].slice(4, data[i].length)
                });
            }
            info.wallTextures = wallTextures;
        }
        else if (line == "WallGrid:") {
            let walls = [];
            while (i < data.length-1) {
                i++;
                walls.push(data[i]);
            }
            info.walls = walls;
        }
    }

    let formattedWalls = [];
    for (let k = 0;k < info.walls.length;k++) {
        for (let h = 0;h < info.walls[k].length;h+=2) {
            let line = info.walls[k];
            let value;
            if (line[h] === "0") {
                value = parseInt(line[h+1]);
            }
            else {
                value = parseInt(line[h] + line[h+1]);
            }
            formattedWalls.push(value);
        }
    }
    info.walls = formattedWalls;

    return info;
}

class Level {
    constructor (fileName, objects, enemies) {
        const data = helpers.getDataFromFile(LEVEL_FILES_LOC + fileName);
        const levelInfo = parseLevelInfo(data);
        
        this.fileName = fileName;
        this.name = levelInfo.name;
        this.skybox = levelInfo.skybox;
        this.wallTextures = levelInfo.wallTextures;
        this.walls = levelInfo.walls;
    }
}

module.exports = Level;
