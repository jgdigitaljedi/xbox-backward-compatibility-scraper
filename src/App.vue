<template>
  <v-app>
    <v-layout class="app-wrapper">
      <v-container>
        <v-card class="selection-card game-card">
          <v-card-title>List Selection</v-card-title>
          <v-btn
            class="selection-button"
            :color="(selected === 'XbToXb360' ? 'success' : 'primary')"
            @click="changeList('XbToXb360')"
          >Xbox to Xbox 360</v-btn>
          <v-btn
            class="selection-button"
            :color="(selected === 'XbToXbOne' ? 'success' : 'primary')"
            @click="changeList('XbToXbOne')"
          >Xbox to Xbox One</v-btn>
          <v-btn
            :color="(selected === 'Xb360ToXbOne' ? 'success' : 'primary')"
            @click="changeList('Xb360ToXbOne')"
          >Xbox 360 to Xbox One</v-btn>
        </v-card>
        <v-card class="next-and-previous game-card">
          <v-btn color="primary" @click="changeGame(false)" :disabled="currentIndex === 0">
            <v-icon dark left>mdi-arrow-left</v-icon>Previous Game
          </v-btn>
          <v-btn color="primary" @click="changeGame(true)">
            Next Game
            <v-icon dark right>mdi-arrow-right</v-icon>
          </v-btn>
        </v-card>
        <GameInfo :game="currentGame" :fixed="fixedGame" class="game-card" :reset="reset"></GameInfo>
        <IgdbSearch
          :platform="selected"
          v-on:gameData="gameSelected"
          class="game-card"
          :reset="reset"
        ></IgdbSearch>
        <v-card class="save-game">
          <v-btn color="success" @click="saveGame()" :disabled="!fixedGame">
            <v-icon dark left>mdi-content-save</v-icon>Save Game
          </v-btn>
          <v-btn color="warning" @click="clearGame()">
            <v-icon dark left>mdi-close</v-icon>Clear Game Data
          </v-btn>
        </v-card>
      </v-container>
    </v-layout>
  </v-app>
</template>

<script>
import GameInfo from './components/GameInfo';
import IgdbSearch from './components/IgdbSearch';
import JsonData from './services/jsonData.service';
import * as _cloneDeep from 'lodash/cloneDeep';

export default {
  name: 'App',
  components: {
    GameInfo,
    IgdbSearch
  },
  data: () => ({
    selected: null,
    currentList: null,
    currentGame: null,
    fixedGame: null,
    currentIndex: 0,
    reset: 0
  }),
  created() {
    this.selected = 'XbToXb360';
    this.getList('XbToXb360');
  },
  methods: {
    saveGame() {
      JsonData.saveGame(this.currentGame, this.fixedGame, this.selected)
        .then(result => {
          console.log('save result', result);
          this.getList(this.selected);
          // this.currentIndex = 0;
          this.reset++;
        })
        .catch(error => {
          console.warn('ERROR SAVING: ', error);
        });
    },
    clearGame() {
      this.fixedGame = null;
    },
    changeGame(next) {
      if (next) {
        this.currentIndex++;
      } else if (this.currentIndex > 0) {
        this.currentIndex--;
      }
      this.currentGame = this.currentList[this.currentIndex];
    },
    gameSelected(game) {
      const gCopy = _cloneDeep(this.currentGame);
      this.fixedGame = Object.assign(gCopy, game);
    },
    changeList(list) {
      this.selected = list;
      this.getList(list);
      this.currentIndex = 0;
      this.fixedGame = null;
    },
    getList(which) {
      JsonData[which]()
        .then(result => {
          this.currentList = result.data;
          this.currentGame = result.data[this.currentIndex];
          this.fixedGame = null;
        })
        .catch(error => {
          console.warn('ERROR:', error);
        });
    }
  }
};
</script>

<style lang="scss">
.app-wrapper {
  margin: 3rem auto 0;
  display: flex;
  justify-content: center;
  width: 50%;
  .game-card {
    margin-bottom: 2rem;
  }
  .selection-card {
    .selection-button {
      margin-right: 1rem;
    }
  }
  .next-and-previous,
  .save-game {
    display: flex;
    justify-content: space-between;
  }
}
</style>
