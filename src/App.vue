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
        <GameInfo :game="currentGame" class="game-card"></GameInfo>
        <IgdbSearch></IgdbSearch>
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
    currentGame: null
  }),
  created() {
    this.selected = 'XbToXb360';
    this.getList('XbToXb360');
  },
  methods: {
    changeList(list) {
      this.selected = list;
      this.getList(list);
    },
    getList(which) {
      JsonData[which]()
        .then(result => {
          this.currentList = result.data;
          this.currentGame = result.data[0];
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
  .game-card {
    margin-bottom: 2rem;
  }
  .selection-card {
    .selection-button {
      margin-right: 1rem;
    }
  }
}
</style>
