
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
                    id: data.slice(0, 2),
                    texture: data.slice(4, data.length)
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

    return info;
}

class Level {
    constructor (fileName, objects, enemies) {
        this.fileName = fileName;
        const data = helpers.getDataFromFile(LEVEL_FILES_LOC + fileName);
        const levelInfo = parseLevelInfo(data);
        console.log(levelInfo);
    }
}

module.exports = Level;
