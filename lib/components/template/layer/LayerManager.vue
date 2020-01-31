<template lang="pug">
v-layout(column)
  v-flex
    v-layout.subheading
      v-flex(xs4)
        | Layers

        v-btn(small fab color="primary" @click="showNewLayerDialog = true")
          v-icon library_add
      v-flex(xs8)
        v-checkbox(label="Highlight Selected Layer?" v-model="layerHighlighting" id="highlight-layer")

    v-dialog(v-model="showNewLayerDialog" max-width="500" lazy)
      v-card
        v-card-title
          .headline Add what type of Layer?
        v-card-actions
          v-btn(flat @click="showNewLayerDialog = false") Cancel
          v-btn(flat @click="createLayer('text')") Text
          v-btn(flat @click="createLayer('image')") Image
          v-btn(flat @click="createLayer('shape')") Shape


  draggable(v-model="templateLayers" tag="v-list" class="layer-list")
    v-list-tile(avatar v-for="layer in templateLayers" :key="layer.id" @click="setActiveLayer({ layer })" :class="{ 'selected': isActive(layer) }")
      v-list-tile-avatar
        v-avatar(color="primary" size="36")
          span.white--text.headline.text-capitalize {{ layer.type[0] }}

      v-list-tile-content
        v-list-tile-title {{ layer.name }}

      v-list-tile-action
        v-btn(fab small @click="toggleLayer(layer)")
          v-icon(v-if="layer.visible") mdi-eye
          v-icon(v-else) mdi-eye-off

      v-list-tile-action
        v-btn(fab small @click="confirmDeleteLayer(layer)")
          v-icon delete

  v-dialog(v-model="showDeleteLayerDialog" max-width="500" lazy)
    v-card
      v-card-title
        .headline Are you sure?
      v-card-actions
        v-btn(@click="showDeleteLayerDialog = false") No
        v-btn(@click="deleteLayer(layerToDelete)") Yes
</template>

<script>
  import { mapGetters, mapActions, mapMutations } from 'vuex'

  import draggable from 'vuedraggable'

  export default {
    props: ["template"],

    components: { draggable },

    data() {
      return {
        showNewLayerDialog: false,
        showDeleteLayerDialog: false,
        editingVar: null
      }
    },

    computed: {
      ...mapGetters([
        "findAllTemplateLayers",
        "activeLayer",
      ]),

      layerHighlighting: {
        get() {
          return this.$store.getters["layerHighlighting"]
        },

        set(newSetting) {
          this.$store.commit("setLayerHighlighting", newSetting)
        }
      },

      editing: {
        get() {
          return this.editingVar
        },

        set(newEditing) {
          if(this.editingVar = newEditing) {
            this.$nextTick(() => {
              this.$refs.editingInput[0].select()
            })
          }
        }
      },

      templateLayers: {
        get() {
          return this.findAllTemplateLayers(this.template) || []
        },

        set(newLayers) {
          this.setLayersRenderOrder(newLayers)
        }
      }
    },

    methods: {
      ...mapActions(["createTemplateLayer", "destroyTemplateLayer", "setLayersRenderOrder", "toggleLayer"]),
      ...mapMutations(["setActiveLayer"]),

      isActive(layer) {
        return this.activeLayer === layer
      },

      createLayer(layerType) {
        this.createTemplateLayer({ template: this.template, layerType })
        this.showNewLayerDialog = false
      },

      confirmDeleteLayer(layer) {
        this.showDeleteLayerDialog = true
        this.layerToDelete = layer
      },

      deleteLayer() {
        this.destroyTemplateLayer({ template: this.template, layer: this.layerToDelete })
        this.showDeleteLayerDialog = false
      },
    }
  }
</script>

<style scoped>
  .selected {
    background-color: lightgray;
  }
</style>
