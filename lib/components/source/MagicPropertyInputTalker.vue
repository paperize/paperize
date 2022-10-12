<template lang="pug">
v-tooltip(top)
  P Magic Property: <pre>{{ magicProperty }}</pre>
  | {{ statusMessage }}
  template(v-slot:activator="{ on }")
    v-icon(v-on="on" :color="statusColor" @click="dialogOpen = true") mdi-table-search

  v-dialog(v-model="dialogOpen" max-width="500")
    v-card
      v-card-title
        h2 Magic Properties

      v-card-text
        template(v-if="!columnMatched")
          p No magic column defined
        template(v-else-if="!propertySet")
          p Magic column defined, this item does not override
        template(v-else)
          p Magic column defined, this item sets "{{ propertyValue }}"
</template>

<script>
import { find, isEmpty } from 'lodash'
import { mapGetters } from 'vuex'

export default {
  props: ["layer", "attributeName"],

  data() {
    return {
      dialogOpen: false
    }
  },

  computed: {
    ...mapGetters(["activeItem"]),

    magicProperty() { return `${this.layer.name}:${this.attributeName}` },

    statusColor() {
      let color = "rgb(200, 200, 200)"

      if(this.propertySet) {
        color = "green"
      } else if(this.columnMatched) {
        color = "gray"
      } else if(this.propertyInvalid) {
        color = "red"
      }

      return color
    },

    statusMessage() {
      let message = "Unmatched"

      if(this.propertySet) {
        message = `Set: "${this.propertyValue}"`
      } else if(this.columnMatched) {
        message = `Unset`
      } else if(this.propertyInvalid) {
        message = `Invalid: "${this.propertyValue}"`
      }

      return message
    },

    columnMatched() {
      return this.activeItem && !!find(this.activeItem, { key: this.magicProperty })
    },

    propertySet() {
      return !isEmpty(this.propertyValue)
    },

    propertyInvalid() {
      return false
    },

    propertyValue() {
      return this.columnMatched && find(this.activeItem, { key: this.magicProperty }).value
    }
  },

  methods: {

  }
}
</script>
