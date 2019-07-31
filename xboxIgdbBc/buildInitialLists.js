(function() {
  const chalk = require("chalk");
  const fs = require("fs");
  const path = require("path");
  const apicalypse = require("apicalypse").default;
  const _cloneDeep = require("lodash").cloneDeep;

  const xboxToXboxThreeSixtyOrig = require("../output/XboxToXbox360.json");
  const xboxToXboxThreeSixty = _cloneDeep(xboxToXboxThreeSixtyOrig);

  const xbox360ToXboxOneOrig = require("../output/Xbox360ToXboxOne.json");
  const xbox360ToXboxOne = _cloneDeep(xbox360ToXboxOneOrig);

  const xboxToXboxOneOrig = require("../output/XboxToXboxOne.json");
  const xboxToXboxOne = _cloneDeep(xboxToXboxOneOrig);

  const igdbLookup = async function(name, platformId) {
    const requestOptions = {
      method: "POST",
      baseURL: "https://api-v3.igdb.com",
      headers: {
        Accept: "application/json",
        "user-key": process.env.IGDBV3KEY
      }
    };
    return await apicalypse(requestOptions)
      .fields(`name`)
      .search(name)
      .where(`platforms = [${platformId}]`)
      .request("/games")
      .then(result => {
        console.log("data", result.data);
        return result.data;
      })
      .catch(error => {
        console.log(
          chalk.red.bold("ERROR FETCHING GAME DATA FROM IGDB API!", error)
        );
        return [];
      });
  };

  function formatGame(g) {
    g.name = g.game ? removeOtherRegionNames(g.game) : g.name;
    g.igdbId = null;
    delete g.game;
    return g;
  }

  function stripString(str) {
    return str
      .toLowerCase()
      .trim()
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
      .replace(/ +(?= )/g, "");
  }

  function removeOtherRegionNames(name) {
    const split = name.split("  ");
    if (split.length === 1) {
      return name;
    } else {
      return split
        .filter(s => {
          return !s.endsWith("(JP)") && !s.endsWith("(PAL)");
        })[0]
        .trim();
    }
  }

  function dealWithResults(result, file) {
    return result.map((item, index) => {
      const matched = item
        .map((ig, i) => {
          const oldName = stripString(removeOtherRegionNames(file[index].name));
          const igName = stripString(ig.name);
          if (igName === oldName) {
            return { igdbId: ig.id, name: ig.name, notes: file[index].notes };
          } else if (i === item.length - 1) {
            return null;
          }
        })
        .filter(g => g && g.hasOwnProperty("name"));
      if (matched && matched.length) {
        return matched[0];
      } else {
        console.log(chalk.yellow.bold(`NO EXACT MATCH ON ${file[index].name}`));
        return file[index];
      }
    });
  }

  const xtxts = xboxToXboxThreeSixty.map(g => {
    const game = formatGame(g);
    return igdbLookup(game.name, 11);
  });
  Promise.all(xtxts).then(result => {
    if (result && result.length) {
      const final = dealWithResults(result, xboxToXboxThreeSixty);
      fs.writeFileSync(
        path.join(__dirname, "IGDBoutput/xboxToXboxThreeSixty.json"),
        JSON.stringify(final, null, 4)
      );
    } else {
      console.log(chalk.red.bold("Error writing Xbox to Xbox 360 list!"));
    }
  });

  const xtstxbo = xbox360ToXboxOne.map(g => {
    const game = formatGame(g);
    return igdbLookup(game.name, 12);
  });
  Promise.all(xtstxbo).then(result => {
    if (result && result.length) {
      const final = dealWithResults(result, xbox360ToXboxOne);
      fs.writeFileSync(
        path.join(__dirname, "IGDBoutput/xbox360ToXboxOne.json"),
        JSON.stringify(final, null, 4)
      );
    } else {
      console.log(chalk.red.bold("Error writing Xbox 360 to Xbox One list!"));
    }
  });

  const xtbo = xboxToXboxOne.map(g => {
    const game = formatGame(g);
    return igdbLookup(game.name, 11);
  });
  Promise.all(xtbo).then(result => {
    if (result && result.length) {
      const final = dealWithResults(result, xboxToXboxOne);
      fs.writeFileSync(
        path.join(__dirname, "IGDBoutput/xboxToXboxOne.json"),
        JSON.stringify(final, null, 4)
      );
    } else {
      console.log(chalk.red.bold("Error writing Xbox to Xbox One list!"));
    }
  });
})();
