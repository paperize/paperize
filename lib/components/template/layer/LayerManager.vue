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


  v-card(v-if="noLayers")
    v-card-title
      .headline Empty Template

    v-card-text
      v-list
        v-list-tile
          v-list-tile-content To get started:
          v-list-tile-action
            v-btn(small color="primary" @click="showNewLayerDialog = true") Add a Layer

        v-list-tile
          v-list-tile-content
            p Or copy an entire Template:

        v-list-tile
          v-list-tile-content
            v-select.template-selector(box label="Select a Template" v-model="componentIdToCopy" :items="copyableComponents" item-value="id" item-text="title")
          v-list-tile-action
            v-btn(small color="primary" @click="copyTemplate(componentIdToCopy)" :disabled="!componentIdToCopy") Copy

  draggable(v-model="templateLayers" tag="v-list" class="layer-list")
    v-list-tile(avatar v-for="layer in templateLayers" :key="layer.id" @click="setActiveLayer(layer)" :class="{ 'selected': isActive(layer) }")
      v-list-tile-avatar
        v-avatar(color="primary" size="36")
          span.white--text.headline.text-capitalize {{ layer.type[0] }}

      v-list-tile-content
        v-list-tile-title {{ layer.name }}

      template(v-if="isActive(layer)")
        v-list-tile-action
          v-btn(fab small v-on:click.stop="copyLayer(layer)")
            v-icon mdi-content-copy

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
  import { filter } from 'lodash'
  import { mapGetters, mapActions } from 'vuex'
  import draggable from 'vuedraggable'

  export default {
    props: {
      template: {
        required: true
      }
    },

    components: { draggable },

    data() {
      return {
        showNewLayerDialog: false,
        showDeleteLayerDialog: false,
        editingVar: null,
        componentIdToCopy: null
      }
    },

    computed: {
      ...mapGetters([
        "findAllTemplateLayers",
        "findComponent",
        "findComponentTemplate",
        "activeLayer",
        "activeComponent",
        "allComponents",
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
      },

      noLayers() {
        return this.templateLayers.length == 0
      },

      copyableComponents() {
        return filter(this.allComponents, (component) => {
          const notThisComponent = (component.templateId != this.template.id)

          return notThisComponent && this.hasLayers(component)
        })
      },
    },

    methods: {
      ...mapActions([
        "copyComponentTemplate",
        "createTemplateLayer",
        "copyTemplateLayer",
        "destroyTemplateLayer",
        "setLayersRenderOrder",
        "toggleLayer",
        "setActiveLayer",
      ]),

      hasLayers(component) {
        const
          template = this.findComponentTemplate(component),
          layers = template && template.layerIds,
          count = layers && layers.length || 0

        return count > 0
      },

      isActive(layer) {
        return this.activeLayer === layer
      },

      createLayer(layerType) {
        this.createTemplateLayer({ template: this.template, layerType })
        this.showNewLayerDialog = false
      },

      copyLayer(layer) {
        this.copyTemplateLayer({ template: this.template, layer })
      },

      copyTemplate() {
        const
          componentSource = this.findComponent(this.componentIdToCopy),
          templateToCopy = this.findComponentTemplate(componentSource)

        this.copyComponentTemplate({ component: this.activeComponent, template: templateToCopy })
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
