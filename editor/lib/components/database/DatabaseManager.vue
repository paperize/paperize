<template lang="pug">
modal(name="Database Manager" :scrollable="true" height="auto")
  h2 Database Manager
  hr

  dl
    dt Games:
    dd {{ allGames.length }}
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
    dt Images:
    dd {{ images.length }}
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    computed: mapGetters([
      "allGames",
      "allComponents",
      "allSources",
      "allTemplates",
      "allLayers",
      "allDimensions",
      "images",
    ])
  }
</script>
