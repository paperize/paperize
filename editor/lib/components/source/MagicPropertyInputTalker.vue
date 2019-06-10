<template lang="pug">
  v-tooltip(top)
    P Magic Property: {{ magicProperty }}
    | {{ statusMessage }}
    v-icon(slot="activator" :color="statusColor" @click="dialogOpen = true") mdi-table-search

    v-dialog(v-model="dialogOpen")
      v-card
        v-card-title Moar Infarmation!
</template>

<script>
  export default {
    props: ["layer", "attributeName"],

    data() {
      return {
        dialogOpen: false
      }
    },

    computed: {
      magicProperty() { return `${this.layer.name}:${this.attributeName}` },
      statusColor() { return "rgb(200, 200, 200)" },
      statusMessage() { return "(Click to learn more)"}
    },

    methods: {

    }
  }
</script>
