<template lang="pug">
.games-list
  .callout
    .row
      .columns.large-6
        h2 Games

      .columns.large-6
        //- search input drives the cursor
        input(type="search" placeholder="Search (soon)")
    hr
    .row.small-up-3.medium-up-5.large-up-3
      .column.column-block(v-for="game in games")
        .card
          router-link(:to="'/games/' + game.id")
            .card-divider
              h5 {{ game.title }}
            img(:src="game.coverArt")
            .card-section
              p {{ game.description }}

    .row
      .columns.medium-9
        //- pagination controls nudge the cursor
        ul.pagination.text-center(role="navigation" aria-label="Pagination")
          li.pagination-previous
            a(href="#") Previous
          li.pagination-next
            a(href="#") Next

      .columns.medium-3
        a.new-game-button(href="#" data-open="new-game-modal") New Game

  .reveal#new-game-modal(data-reveal="true")
    .row
      .columns.small-12
        h1 New Game
        hr

      .columns.small-6
        input.game-name(v-model="newGame.title" placeholder="Game Title")

      .columns.small-6
        a.button.create-game-button(@click="createGame") Create
</template>

<script>
  import GameRepo from "./game.js"

  let data = {
    games: [],
    gameCursor: GameRepo.mostRecent(),
    newGame: {}
  }

  data.gameCursor.on("data", (newGames) => {
    console.log("caught 'em", newGames)
    data.games = newGames
  })

  export default {
    data: () => {
      return data
    },
    methods: {
      createGame: () => {
        GameRepo.create(data.newGame)
      }
    },
    mounted: () => {
      $('.games-list').foundation();
    }
  }

</script>

<style>
  .card {
    font-size: .8em;
  }

  .card img {
    max-height: 100px;
  }
</style>
