<template>
  <v-card>
    <v-card-title>Current Game Data</v-card-title>
    <div class="game-info">
      <h4>Old</h4>
      <pre>{{game ? game : ''}}</pre>
      <div class="game-fixed" v-if="fixed">
        <h4>New</h4>
        <pre class="game-revisions">{{fixed ? fixed : ''}}</pre>
      </div>
      <div class="section-complete" v-if="!game">All Games for This Section Have Been Matched!</div>
    </div>
  </v-card>
</template>

<script>
export default {
  name: 'GameInfo',
  props: {
    game: null,
    fixed: null,
    reset: null
  }
};
</script>

<style lang="scss">
.game-info {
  padding: 0 2rem 2rem 2rem;
  pre {
    white-space: pre-wrap;
  }
  .game-fixed {
    margin-top: 1rem;
    .game-revisions {
      color: yellow;
    }
  }
  .section-complete {
    font-weight: bold;
    margin: 1.5rem;
    font-size: 2rem;
  }
}
</style>