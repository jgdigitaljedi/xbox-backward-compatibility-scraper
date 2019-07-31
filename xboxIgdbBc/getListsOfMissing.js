const fs = require("fs");
const path = require("path");
const chalk = require("chalk");

function getMissing(filePathStr, outFileName) {
  const fullPath = path.join(__dirname, filePathStr);
  const fileContent = require(fullPath);

  const missing = fileContent.filter(f => !f.igdbId);
  fs.writeFile(
    path.join(__dirname, `missingIgdbData/${outFileName}`),
    JSON.stringify(missing, null, 2),
    "utf-8",
    error => {
      if (error) {
        console.log(chalk.red.bold("Error writing missing:", error));
      } else {
        console.log(chalk.cyan("Wrote file: ", outFileName));
      }
    }
  );
}

module.exports = {
  getMissingXbTo360: function() {
    getMissing("./IGDBoutput/XboxToXbox360.json", "XboxToXbox360.json");
  },
  getMissingXbToOne: function() {
    getMissing("./IGDBoutput/XboxToXboxOne.json", "XboxToXboxOne.json");
  },
  getMissing360ToOne: function() {
    getMissing("./IGDBoutput/Xbox360ToXboxOne.json", "Xbox360ToXboxOne.json");
  }
};
