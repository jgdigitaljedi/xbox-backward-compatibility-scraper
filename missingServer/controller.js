/**
 * Cutting corners, this only needs to be used until the lists are built. At that point I'll just use the lists created.
 * No error handling. Fast and loose.
 * */

const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const apicalypse = require('apicalypse').default;

const listObj = {
  XbToXb360: 'XboxToXbox360',
  XbToXbOne: 'XboxToXboxOne',
  Xb360ToXbOne: 'Xbox360ToXboxOne'
};

/* IGDB Search */

function apiSearch(name, platform) {
  const requestOptions = {
    method: 'POST',
    baseURL: 'https://api-v3.igdb.com',
    headers: {
      Accept: 'application/json',
      'user-key': process.env.IGDBV3KEY
    }
  };
  return apicalypse(requestOptions)
    .fields(`name,id`)
    .search(name)
    .where(`platforms = [${platform}]`)
    .request('/games');
}

function getPlatform(str) {
  if (str === 'Xb360ToXbOne') {
    return 12;
  }
  return 11;
}

router.post('/search', async (req, res) => {
  if (req.body.name && req.body.platform) {
    const platform = getPlatform(req.body.platform);
    const apiResults = await apiSearch(req.body.name, platform);
    res.json(apiResults.data);
  } else {
    res.status(500).json({ error: true, message: 'You must send a name and a platform!' });
  }
});

/* Getters */

function xbTo360() {
  return fs.readFileSync(
    path.join(__dirname, '../xboxIgdbBc/missingIgdbData/XboxToXbox360.json'),
    'utf-8'
  );
}
function xbToOne() {
  return fs.readFileSync(
    path.join(__dirname, '../xboxIgdbBc/missingIgdbData/XboxToXboxOne.json'),
    'utf-8'
  );
}
function xb360ToOne() {
  return fs.readFileSync(
    path.join(__dirname, '../xboxIgdbBc/missingIgdbData/Xbox360ToXboxOne.json'),
    'utf-8'
  );
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
    const masterList = fs.readFileSync(
      path.join(__dirname, `../xboxIgdbBc/missingIgdbData/${which}.json`),
      'utf-8'
    );
    const parsed = JSON.parse(masterList);
    const names = parsed.map(p => p.name);
    const index = names.indexOf(data.name);
    parsed.splice(index, 1);
    fs.writeFile(
      path.join(__dirname, `../xboxIgdbBc/missingIgdbData/${which}.json`),
      JSON.stringify(parsed, null, 2),
      error => {
        if (error) {
          reject({ error: true });
        } else {
          resolve(parsed);
        }
      }
    );
  });
}

function addToList(which, oldData, newData) {
  return new Promise((resolve, reject) => {
    const masterList = fs.readFileSync(
      path.join(__dirname, `../finalOutput/${which}.json`),
      'utf-8'
    );
    const parsed = JSON.parse(masterList);
    const names = parsed.map(p => p.name);
    console.log('names', names);
    const index = names.indexOf(oldData.name);
    console.log('oldData', oldData);
    console.log('index', index);
    parsed[index].igdbId = newData.igdbId;
    parsed[index].name = newData.name;
    fs.writeFile(
      path.join(__dirname, `../finalOutput/${which}.json`),
      JSON.stringify(parsed, null, 2),
      error => {
        if (error) {
          reject({ error: true });
        } else {
          resolve(parsed);
        }
      }
    );
  });
}

router.post('/savegame', async (req, res) => {
  const { oldData, newData, list } = req.body;
  if (oldData && newData && list) {
    const listFull = listObj[list];
    const add = await addToList(listFull, oldData, newData);
    const removed = await removeFromList(listFull, oldData);
    if (add.error || removed.error) {
      res
        .status(500)
        .json({ error: true, message: 'ERROR: SOMETHING WENT WRONG WITH THE FILE OPERATIONS!' });
    } else {
      res.json(add);
    }
  } else {
    res.status(500).json({ error: true, message: 'ERROR: INCOMPLETE REQUEST!' });
  }
});

module.exports = router;
