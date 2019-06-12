(function () {
  const cheerio = require('cheerio');
  const request = require('request');
  const chalk = require('chalk');
  const fs = require('fs');

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

  // get the Xbox games that run on the Xbox 360
  makeRequest(`https://en.wikipedia.org/wiki/List_of_Xbox_games_compatible_with_Xbox_360`)
    .then(html => {
      const $ = cheerio.load(html);
      const rows = $('.wikitable.sortable').filter(i => i === 0).find('tbody').find('tr');
      // parse the table rows
      let result = [];
      $(rows).each((index, element) => {
        if (index > 0) {
          const rowData = $(element).text().split('\n');
          const game = rowData[1];
          const issues = rowData[5];
          // create json object turning issues into an array based on the fact that wiki seems to list each issue as a sentence in a string
          const entry = {
            game,
            problems: issues === '' ? null : issues.split('.').map(i => i.trim()).filter(i => i !== '')
          };
          console.log('entry', entry);
          result.push(entry);
        }
      });
      // write to a json file

    })
    .catch(error => {
      console.log(chalk.red.bold('ERROR GETTING 360 BC LIST: ', error));
    });

})();