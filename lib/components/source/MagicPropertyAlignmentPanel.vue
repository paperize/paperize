<template lang="pug">
.magic-properties
  .subtitle-1 Magical Properties
  ul.source-properties
    li(v-for="magicProperty in magicPropertiesWithMatches")
      v-icon() {{ magicProperty.layerMatchIcon }}
      strong  {{ magicProperty.layerName }}:
      v-icon() {{ magicProperty.attributeMatchIcon }}
      em  {{ magicProperty.layerAttributeName }}
</template>

<script>
import { includes, keys, map } from 'lodash'
import { mapGetters } from 'vuex'

export default {
  props: [
    "magicProperties",
    "template"
  ],

  computed: {
    ...mapGetters(["searchLayers"]),

    magicPropertiesWithMatches() {
      return map(this.magicProperties, (property) => {
        return {
          ...property,
          layerMatchIcon: this.matchLayer(property.layerName) ? "check" : "cancel",
          attributeMatchIcon: this.matchAttribute(property) ? "check" : "cancel"
        }
      })
    },

    matchLayer: () => function(layerName) {
      return this.searchLayers({ name: layerName })[0]
    },

    matchAttribute: () => function(property) {
      const matchedLayer = this.matchLayer(property.layerName)
      if(!matchedLayer) {
        return null
      }

      return includes(keys(matchedLayer), property.layerAttributeName)
    },
  }
}
</script>
