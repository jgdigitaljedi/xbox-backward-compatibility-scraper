<template>
  <v-card class="search">
    <v-card-title>IGDB Search</v-card-title>
    <div class="search-results">
      <v-autocomplete
        label="Search Game Here"
        v-model="model"
        :items="games"
        :loading="isLoading"
        :search-input.sync="search"
        item-text="name"
        color="white"
        hide-no-data
        return-object
      ></v-autocomplete>
      <v-btn
        class="select-btn"
        @click="selectionMade()"
        color="primary"
        :disabled="!model"
      >Select Game</v-btn>
    </div>
  </v-card>
</template>

<script>
import JsonData from '../services/jsonData.service';
import * as _debounce from 'lodash/debounce';

export default {
  name: 'IgdbSearch',
  props: {
    platform: null
  },
  data: () => ({
    games: null,
    isLoading: false,
    search: null,
    model: null
  }),
  methods: {
    selectionMade() {
      console.log('selection', this.model);
      const cleaned = {
        id: this.model.id,
        name: this.model.name
      };
      this.$emit('gameData', cleaned);
    },
    searchIgdb(name, platform) {
      this.isLoading = true;
      JsonData.search(name, platform)
        .then(result => {
          console.log('results', result.data);
          this.games = result.data;
          this.isLoading = false;
        })
        .catch(error => {
          this.isLoading = false;
          console.warn('ERROR searching: ', error);
        });
    }
  },
  watch: {
    search: _debounce(function(val) {
      console.log('search', val);
      this.searchIgdb(val, this.platform);
    }, 800)
  }
};
</script>

<style lang="scss">
.search {
  .search-results {
    padding: 2rem;
  }
}
</style>