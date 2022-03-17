
const fs = require("fs");

const LEVEL_FILES_LOC = "../def/levels/"

function parseLevelInfo(data) {
    let info = {};
    // Split the lines to an array
    data = data.split("\n");
    for (let j = 0; j < data.length; j++) {
        data[j] = data[j].replace("\r", "");
    }

    for (let i = 0; i < data.length; i++) {
        let line = data[i];
        if (line == "Name:") {
            i++;
            info.name = data[i]
        }
        else if (line == "Light:") {
            i++;
            info.light = parseInt(data[i]);
        }
        else if (line == "Skybox:") {
            i++;
            info.skybox = data[i]
        }
        else if (line == "WallTextures:") {
            let wallTextures = [];
            while (data[i + 1] !== "WallGrid:") {
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
            while (i < data.length - 1) {
                i++;
                walls.push(data[i]);
            }
            info.walls = walls;
        }
    }

    info.width = info.walls[0].length / 2;
    info.height = info.walls.length;

    let formattedWalls = [];
    for (let k = 0; k < info.walls.length; k++) {
        for (let h = 0; h < info.walls[k].length; h += 2) {
            let line = info.walls[k];
            let value;
            if (line[h] === "0") {
                value = parseInt(line[h + 1]);
            }
            else {
                value = parseInt(line[h] + line[h + 1]);
            }
            formattedWalls.push(value);
        }
    }
    info.walls = formattedWalls;

    return info;
}


class Level {
    constructor(fileName, objects, enemies) {
        const data = fs.readFileSync(LEVEL_FILES_LOC + fileName, "utf8");
        const levelInfo = parseLevelInfo(data);

        this.fileName = fileName;
        this.name = levelInfo.name;
        this.light = levelInfo.light;
        this.skybox = levelInfo.skybox;
        this.wallTextures = levelInfo.wallTextures;
        this.walls = levelInfo.walls;
        this.width = levelInfo.width;
        this.height = levelInfo.height;
    }


    /** Getters */
    getFileName() { return this.fileName; }
    getName() { return this.name; }
    getLight() { return this.light; }
    getSkyBox() { return this.skybox; }
    getWallTextures() { return this.wallTextures; }
    getWalls() { return this.walls; }

    /** Setters */
    setFileName(newFileName) {
        if (newFileName && newFileName.length > 0) { this.fileName = newFileName; }
    }
    setName(newName) {
        if (newName && newName.length > 0) { this.name = newName; }
    }
    setLight(newLight) {
        if (newLight >= 0) { this.light = newLight; }
    }
    setSkyBox(newSkyBox) {
        if (newSkyBox && newSkyBox.length > 0) { this.skybox = newSkyBox; }
    }
    setWallTextures(newWallTextures) {
        if (newWallTextures && newWallTextures.length > 0) { this.wallTextures = newWallTextures; }
    }
    setWalls(newWalls) {
        if (newWalls && newWalls.length > 0) { this.walls = newWalls; }
    }

}

module.exports = Level;
