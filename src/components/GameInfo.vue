<template>
  <v-card class="game-info">
    <v-card-title>Current Game Data</v-card-title>
    <pre>{{game ? game : ''}}</pre>
    <div class="section-complete" v-if="!game">All Games for This Section Have Been Matched!</div>
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
.section-complete {
  font-weight: bold;
  margin: 1.5rem;
  font-size: 2rem;
}
</style>