(function () {
  const cheerio = require('cheerio');
  const request = require('request');
  const chalk = require('chalk');
  const fs = require('fs');
  const path = require('path');

  function makeRequest(url) {
    return new Promise((resolve, reject) => {
      request(
        url,
        (err, response, html) => {
          if (err) {
            reject({ error: true, code: err });
          } else {
            resolve(html);
          }
        }
      )
    });
  }

  function parseRows(rows, fileName, $, notesIndex) {
    let result = [];
    $(rows).each((index, element) => {
      if (index > 0) {
        const rowData = $(element).text().split('\n');
        const game = rowData[1];
        const issues = rowData[notesIndex];

        // create json object turning notes into an array based on the fact that wiki seems to list each issue as a sentence in a string
        const entry = {
          game,
          notes: (!issues || issues === '') ? null : issues.split('.').map(i => i.trim()).filter(i => i !== '' && i[0] !== '[')
        };
        result.push(entry);
      }
    });
    // write to a json file
    fs.writeFile(path.join(__dirname, `output/${fileName}.json`), JSON.stringify(result, null, 2));
    console.log(chalk.green.bold(`SUCCESSFULLY CREATED ${fileName}.json!`));
  }

  // get the Xbox games that run on the Xbox 360
  makeRequest(`https://en.wikipedia.org/wiki/List_of_Xbox_games_compatible_with_Xbox_360`)
    .then(html => {
      const $ = cheerio.load(html);
      const rows = $('.wikitable.sortable').filter(i => i === 0).find('tbody').find('tr');
      parseRows(rows, 'XboxToXbox360', $, 5);
    })
    .catch(error => {
      console.log(chalk.red.bold('ERROR GETTING 360 BC LIST: ', error));
    });

  // get Xbox One backward compatibility lists
  makeRequest(`https://en.wikipedia.org/wiki/List_of_backward_compatible_games_for_Xbox_One`)
    .then(html => {
      const $ = cheerio.load(html);
      const threeSixtyRows = $('.wikitable.sortable').filter(i => i === 0).find('tbody').find('tr');
      const originalRows = $('.wikitable.sortable').filter(i => i === 1).find('tbody').find('tr');
      parseRows(threeSixtyRows, 'Xbox360ToXboxOne', $, 11);
      parseRows(originalRows, 'XboxToXboxOne', $, 7);
    })
    .catch(error => {
      console.log(chalk.red.bold('ERROR GETTING XBOX ONE BC LIST: ', error));
    });
})();