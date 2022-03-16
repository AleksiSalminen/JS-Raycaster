
const fs = require("fs");

module.exports = {

    makeid (length) {
        let result = "";
        let characters =
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    },

    getDataFromFile (fileName) {
      return fs.readFileSync(fileName, "utf8");
  },

};
