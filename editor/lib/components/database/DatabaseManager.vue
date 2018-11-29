<template lang="pug">
v-card.database-manager
  v-card-title
    .headline Database Manager

  v-card-text
    .subheading Working Directory
    a(:href="workingDirectory.url") {{ workingDirectory.name }}
    .subheading Database File
    a(:href="databaseFile.url") {{ databaseFile.name }}
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
        "workingDirectory",
        "databaseFile"
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
