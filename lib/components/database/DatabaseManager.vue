<template lang="pug">
v-card.database-manager
  v-card-title
    .headline Database Manager

  v-card-text
    p Paperize stores all of its data in a location YOU control, currently Google Drive. It creates a folder in your Drive (called a "working directory"), and stores its database as a .json file inside. The locations of the working directory and database file are listed below. Games, components, and images may further create their own folders inside of the working directory.

    .subheading Working Directory
    a(:href="workingDirectory.url") {{ workingDirectory.name }}

    .subheading Database File
    a(:href="databaseFile.url") {{ databaseFile.name }}

  v-divider

  v-container(grid-list-md)
    v-layout(row wrap)
      v-flex(xs12)
        .subheading Caches
        p Paperize limits its API calls to other services by caching heavy assets locally in your browser. Here you can see how many things are cached right now, and clear the cache if desired.

      v-flex(xs4)
        v-card
          v-card-title {{ imageCount }} Images
          v-card-text
            v-btn(small @click="clearImages") Clear
      v-flex(xs4)
        v-card
          v-card-title {{ sheetCount }} Sheets
          v-card-text
            v-btn(small @click="clearSheets") Clear
      v-flex(xs4)
        v-card
          v-card-title {{ fontCount }} Fonts
          v-card-text
            v-btn(small @click="clearFonts") Clear
</template>

<script>
  import { mapGetters } from 'vuex'
  import imageCache from '../../services/image_cache'
  import sheetCache from '../../services/sheet_cache'
  import fontCache from '../../services/font_cache'
  import databaseController from '../../services/database_controller'

  export default {
    mounted() {
      this.updateCacheCounts()
    },

    data() {
      return {
        selectedDatabase: null,
        showDatabaseExportDialog: false,
        showDatabaseClearDialog: false,
        jsonExport: {},
        imageCount: 0,
        sheetCount: 0,
        fontCount: 0,
      }
    },

    computed: {
      ...mapGetters([
        "allGames",
        "allComponents",
        "allSpreadsheets",
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
      },

      updateCacheCounts() {
        return Promise.all([
          imageCache.count(),
          sheetCache.count(),
          fontCache.count(),
        ]).then(([newImageCount, newSheetCount, newFontCount]) => {
          this.imageCount = newImageCount
          this.sheetCount = newSheetCount
          this.fontCount = newFontCount
        })
      },

      clearImages() {
        return imageCache.clear().then(() => {
          this.updateCacheCounts()
        })
      },

      clearSheets() {
        return sheetCache.clear().then(() => {
          this.updateCacheCounts()
        })
      },

      clearFonts() {
        return fontCache.clear().then(() => {
          this.updateCacheCounts()
        })
      },
    }
  }
</script>

<style scoped="true">
  textarea {
    height: inherit;
  }
</style>
