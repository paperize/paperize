<template lang="pug">
v-card.database-manager
  v-card-title
    .headline Database Manager

  v-card-text(v-if="selectedDatabase")
    v-layout(row wrap)
      v-flex(xs12 md12)
        v-btn(@click="selectedDatabase = null") Back...
        v-btn(@click="exportDatabase") Export
        v-btn(@click="showDatabaseClearDialog = true") Clear

        v-dialog(v-model="showDatabaseExportDialog" max-width="500" lazy)
          v-card
            v-card-text
              textarea(@click="$event.target.select()") {{ jsonExport }}

        v-dialog(v-model="showDatabaseClearDialog" max-width="500" lazy)
          v-card.database-clear
            v-card-title Are you sure?
            v-card-actions
              v-btn(@click="showDatabaseClearDialog = false") Cancel
              v-btn(color="red" @click="clearDatabase") Clear Database


      v-flex(xs12 md6)
        .subheading Game Data ({{ selectedDatabaseSize }} bytes)

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

      v-flex(xs12 md6)
        .subheading Game Assets

        dl
          dt Images:
          dd {{ images.length }}

  v-card-text(v-else)
    p
      a(@click="selectedDatabase = true") avid_gamer@example.com
</template>

<script>
  import { mapGetters } from 'vuex'
  import databaseController from '../../services/database_controller'

  export default {
    data() {
      return {
        selectedDatabase: null,
        showDatabaseExportDialog: false,
        showDatabaseClearDialog: false,
        jsonExport: {}
      }
    },

    computed: {
      ...mapGetters([
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
        this.showDatabaseExportDialog = true
      },

      clearDatabase() {
        databaseController.clear()
        this.showDatabaseClearDialog = false
      }
    }
  }
</script>

<style scoped="true">
  textarea {
    height: inherit;
  }
</style>
