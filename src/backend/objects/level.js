
const helpers = require("../helpers");

const LEVEL_FILES_LOC = "../def/levels/"


class Level {
    constructor (fileName, objects, enemies) {
        const data = helpers.getDataFromFile(LEVEL_FILES_LOC + fileName);
        const levelInfo = helpers.parseLevelInfo(data);
        
        this.fileName = fileName;
        this.name = levelInfo.name;
        this.skybox = levelInfo.skybox;
        this.wallTextures = levelInfo.wallTextures;
        this.walls = levelInfo.walls;
    }
    

    /** Getters */
    getFileName () { return this.fileName; }
    getName () { return this.name; }
    getSkyBox () { return this.skybox; }
    getWallTextures () { return this.wallTextures; }
    getWalls () { return this.walls; }

    /** Setters */ 
    setFileName (newFileName) {
        if (newFileName && newFileName.length > 0) { this.fileName = newFileName; }
    }
    setName (newName) {
        if (newName && newName.length > 0) { this.name = newName; }
    }
    setSkyBox (newSkyBox) {
        if (newSkyBox && newSkyBox.length > 0) { this.skybox = newSkyBox; }
    }
    setWallTextures (newWallTextures) {
        if (newWallTextures && newWallTextures.length > 0) { this.wallTextures = newWallTextures; }
    }
    setWalls (newWalls) {
        if (newWalls && newWalls.length > 0) { this.walls = newWalls; }
    }

}

module.exports = Level;
