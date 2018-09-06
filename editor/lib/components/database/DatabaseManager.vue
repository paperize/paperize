<template lang="pug">
modal(name="Database Manager" :pivotY="0.1" :scrollable="true" height="auto")
  .grid-x.grid-padding-x
    .small-12.cell
      h2 Database Manager
      hr

    .small-12.cell
      a.button Export
      a.button Import
      a.button.alert(@click="clearDatabaseConfirm") Clear

    .small-12.medium-6.cell
      h3 Game Data
      dl
        dt Games:
        dd.games-total {{ allGames.length }}
        dt Components:
        dd {{ allComponents.length }}
        dt Sources:
        dd {{ allSources.length }}
        dt Templates:
        dd {{ allTemplates.length }}
        dt Layers:
        dd {{ allLayers.length }}
        dt Dimensions:
        dd {{ allDimensions.length }}

    .small-12.medium-6.cell
      h3 Game Assets
      dl
        dt Images:
        dd {{ images.length }}
</template>

<script>
  import { mapGetters } from 'vuex'
  import databaseController from '../../services/database_controller'

  export default {
    computed: mapGetters([
      "allGames",
      "allComponents",
      "allSources",
      "allTemplates",
      "allLayers",
      "allDimensions",
      "images",
    ]),

    methods: {
      clearDatabaseConfirm() {
        // this.$modal.show("Confirmation")
        this.$modal.show('dialog', {
          title: "Are you sure?",
          buttons: [
            {
              title: "Cancel",
              default: true
            }, {
              title: "Yes",
              handler: this.clearDatabase
            }
          ]
        })
      },

      clearDatabase() {
        this.$modal.hide('dialog')
        databaseController.clear()
      }
    }
  }
</script>
