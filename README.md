# xbox-backward-compatibility-scraper

The intent of this script is to scrape 2 lists from the corresponding Wikipedia pages to collect the following data:

- Xbox games that work on the Xbox 360 and their issues
- Xbox and Xbox 360 games that work on the Xbox One and their issues
- Match all entries in the generated lists to an entry in the IGDB API to associate ID's with each game for use in an app using the IGDB API

It's not the most useful data in the world, but I am a retro game collector and wanted access to this data for a little project I'm working on. Rather than copy, paste, and cleanup, this script will allow me to generate the data which will be handy as it is still being updated for the Xbox One.

<b>NOTE: Microsoft stopped adding to the backwards compatibility since the Xbox One is old and the new Xbox will be coming out next year. Once I complete this and get the final lists built, there will be no reason to use the script but, instead, just use the lists I generated in the "finalOutput" directory.</b>

<b>UPDATE: Let me save you the trouble if you only want the backward compatibility lists: the progress I've made so far lives in the "finalOutput" folder. At this point I've managed to get IGDB IDs matched to all but 4 games and they just don't seem to be in the IGDB database. I'm calling it complete for now. Might circle back and set this up to also add other video game IDs in the future.

If you're curious about the code then feel free to continue on. Just know that I am a little fast and loose with this project since the only reason it exists is to generate these lists and, once completed, there will be no need for this codebase.

Also, I might do some things to add other video game database IDs to this since during this process I've learned that IGDB kind of sucks/won't match on many of my searches.</b>

## Setup:

- 1. clone the project
- 2. run `npm i`

## Tasks

### Scrape Backwards Compatibility Pages

```
npm run scrape
```

This scrapes the data from the backwards compatibility pages and creates JSON files of the results in the "output" directory.

---

### Build Initial Lists with IGDB ID's

```
npm run lists
```

This runs all of the scraped lists against the IGDB database to fill in what ID's it can. It is meant to make the lists more useful if using in an app where the IGDB API is also being used. Note that THIS WILL EXHAUST YOUR API KEY VERY QUICKLY if you call this more than a couple of times! It is a necessary step to get the process started and not the last step because IGDB has pretty weak search functionality and a lot of games won't come back with a match. The outputted JSON files got to the "IGDBoutput" directory.

---

### Build JSON Files With Games Missing IGDB Data

```
npm run missing:lists
```

This will take what data has been collected and build JSON files of the games still missing the IGDB ID data. The outputted files will go to the "missingIgdbData" directory.

---

### Serve Simple Web App To Manually Search Games Against IGDB API

```
npm run missing:serve
```

This will serve a little web app that will allow you to manually search IGDB's API for the remaining games missing IGDB ID's. The final result from this will output the files to "finalOutput".

---

### Get Newly Scraped Lists and Compare To Current Lists For Fetching IGDB ID's

```
npm run missing:scraped
```

This will take the newly scraped lists, compare them to what's in "finalOutput", and generate new lists containing any newly added games that need IGDB ID's.
