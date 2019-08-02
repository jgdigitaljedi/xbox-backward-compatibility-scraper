<template>
  <v-app>
    <v-layout class="app-wrapper">
      <v-container>
        <v-card class="selection-card">
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
            :color="(selected === 'xb360ToXbOne' ? 'success' : 'primary')"
            @click="changeList('Xb360ToXbOne')"
          >Xbox 360 to Xbox One</v-btn>
        </v-card>
        <GameInfo :game="currentGame"></GameInfo>
      </v-container>
    </v-layout>
  </v-app>
</template>

<script>
import GameInfo from './components/GameInfo';

import XbToXboxOne from './static/XboxToXboxOne.json';
import XbToXbox360 from './static/XboxToXbox360.json';
import Xb360ToXboxOne from './static/Xbox360ToXboxOne.json';

import * as _cloneDeep from 'lodash/cloneDeep';

export default {
  name: 'App',
  components: {
    GameInfo
  },
  data: () => ({
    remainingXbToOne: XbToXboxOne,
    remainingXbTo360: XbToXbox360,
    remaining360ToOne: Xb360ToXboxOne,
    selected: null,
    currentList: null,
    currentGame: null
  }),
  created() {
    console.log('aijsdufoh', this.remainingXbTo360);
    this.selected = 'XbToXb360';
    this.currentList = _cloneDeep(this.remainingXbTo360);
    this.currentGame = this.currentList[0];
  },
  methods: {
    changeList(list) {
      this.selected = list;
      switch (list) {
        case 'XbToXb360':
          this.currentList = this.remainingXbTo360;
          this.currentGame = this.remainingXbTo360[0];
          break;
        case 'XbToXbOne':
          this.currentList = this.remainingXbToOne;
          this.currentGame = this.remainingXbToOne[0];
          break;
        case 'Xb360ToXbOne':
          this.currentList = this.remaining360ToOne;
          this.currentGame = this.remaining360ToOne[0];
          break;
      }
    }
  }
};
</script>

<style lang="scss">
.app-wrapper {
  margin: 4rem auto 0;
  display: flex;
  justify-content: center;
  .selection-card {
    margin-bottom: 2rem;
    .selection-button {
      margin-right: 1rem;
    }
  }
}
</style>
