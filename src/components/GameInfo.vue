<template>
  <v-card class="game-info">
    <v-card-title>Current Game Data</v-card-title>
    <pre>{{game ? game : ''}}</pre>
  </v-card>
</template>

<script>
export default {
  name: 'GameInfo',
  props: {
    game: null
  }
};
</script>

<style>
pre {
  padding: 0 2rem 2rem 2rem;
}
</style>