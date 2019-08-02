<template>
  <v-card class="search">
    <v-card-title>IGDB Search</v-card-title>
    <div class="search-results"></div>
  </v-card>
</template>

<script>
import JsonData from '../services/jsonData.service';

export default {
  name: 'IgdbSearch',
  data: () => ({}),
  methods: {
    searchIgdb(name) {
      JsonData.search(name)
        .then(result => {})
        .catch(error => {});
    }
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