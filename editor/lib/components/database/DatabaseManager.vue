<template lang="pug">
modal(name="Database Manager" :pivotY="0.1" :scrollable="true" height="auto")
  .grid-x.grid-padding-x
    .small-12.cell
      h2 Database Manager
      hr

  .grid-x.grid-padding-x(v-if="selectedDatabase")
    .small-12.cell
      a(@click="selectedDatabase = null") Back...
      a.button(@click="exportDatabase") Export
      a.button.alert(@click="clearDatabaseConfirm") Clear

    .small-12.medium-6.cell
      h3 Game Data ({{ selectedDatabaseSize }} bytes)
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

  .grid-x.grid-padding-x(v-else)
    .small-12.cell
      p
        a(@click="selectedDatabase = true") avid_gamer@example.com

  modal(name="JSON Export" height="100%" :pivotY="0.1" :scrollable="true")
    textarea(@click="$event.target.select()") {{ jsonExport }}
</template>

<script>
  import { mapGetters } from 'vuex'
  import databaseController from '../../services/database_controller'

  export default {
    data() {
      return {
        selectedDatabase: null,
        jsonExport: {}
      }
    },

    computed: { ...mapGetters([
      "allGames",
      "allComponents",
      "allSources",
      "allTemplates",
      "allLayers",
      "allDimensions",
      "images",
      ]),

      selectedDatabaseSize() {
        // return this.selectedDatabased.length
        return databaseController.getJSON().length
      }
    },

    methods: {
      exportDatabase() {
        // get the JSON of the db
        this.jsonExport = databaseController.getJSON()
        this.$modal.show("JSON Export")
      },

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

<style scoped="true">
  textarea {
    height: inherit;
  }
</style>
