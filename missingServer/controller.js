/** 
 * Cutting corners, this only needs to be used until the lists are built. At that point I'll just use the lists created.
 * No error handling. Fast and loose.
 * */

const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

/* Getters */

function xbTo360() {
  return fs.readFileSync(path.join(__dirname, 'static/XboxToXbox360.json'), 'utf-8');
}
function xbToOne() {
  return fs.readFileSync(path.join(__dirname, 'static/XboxToXboxOne.json'), 'utf-8');
}
function xb360ToOne() {
  return fs.readFileSync(path.join(__dirname, 'static/Xbox360ToXboxOne.json'), 'utf-8');
}

router.get('/xbto360', async (req, res) => {
  const list = await xbTo360();
  res.json(JSON.parse(list));
});

router.get('/xbtoone', async (req, res) => {
  const list = await xbToOne();
  res.json(JSON.parse(list));
});

router.get('/xb360toone', async (req, res) => {
  const list = await xb360ToOne();
  res.json(JSON.parse(list));
});

/* Setters */

function removeFromList(which, data) {
  return new Promise((resolve, reject) => {
    const masterList = fs.readFileSync(path.join(__dirname, `../xboxIgdbBc/missingIgdbData/${which}.json`), 'utf-8');
    const parsed = JSON.parse(masterList);
    const names = parsed.map(p => p.name);
    const index = names.indexOf(data.name);
    const withRemoved = parsed.splice(index, 1);
    // write file here
  });
}

function addToList(which, data) {
  return new Promise((resolve, reject) => {
    const masterList = fs.readFileSync(path.join(__dirname, `../xboxIgdbBc/IGDBoutput/${which}.json`), 'utf-8');
    const parsed = JSON.parse(masterList);
    const names = parsed.map(p => p.name);
    const index = names.indexOf(data.name);
    parsed[index].igdbId = data.igdbId;
    parsed[index].name = data.newName;
    resolve(parsed);
  });
}

router.post('/xbto360', async (req, res) => {
  const add = await addToList('XboxToXbox360', req.body.game);
  const removed = await removeFromList('XboxToXbox360', req.body.game);
  res.json(JSON.parse(add));
});


module.exports = router;