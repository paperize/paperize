<template lang="pug">
v-form.component-form(ref="componentForm" @submit.prevent="submitComponent")
  v-card
    v-card-title
      .headline New Component

    v-card-text
      v-text-field.component-title(v-model="component.title" :rules="[rules.required]" label="Title" placeholder="Artifact Cards")

      v-radio-group(v-if="anyComponents" v-model="copyMode")
        v-radio(label="Blank Component" :value="false")
        v-radio(label="Copy Existing Component" :value="true")

      template(v-if="copyMode")
        v-select.component-selector(box label="Select Component to Copy" v-model="componentIdToCopy" :rules="[rules.required]" :items="allComponents" item-value="id" item-text="title")

    v-card-actions
      v-btn(small success @click="submitComponent") {{ actionName }} Component
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'

  export default {
    data() {
      return {
        component: { title: "" },
        copyMode: false,
        componentIdToCopy: null,
        rules: {
          required: value => !!value || 'Required.'
        }
      }
    },

    computed: {
      ...mapGetters([
        "allComponents",
        "findComponent",
        "activeGame"
      ]),

      gameHasSource() {
        return !!this.activeGame.spreadsheetId
      },

      anyComponents() {
        return this.allComponents.length > 0
      },

      componentToCopy() {
        return this.findComponent(this.componentIdToCopy)
      },

      actionName() {
        return this.copyMode ? "Copy" : "Create"
      }
    },

    methods: {
      ...mapActions([
        "copyGameComponent",
        "createGameComponent",
        "createDriveArtifactsForGameComponent",
      ]),

      submitComponent() {
        if(!this.$refs.componentForm.validate()) { return }

        // Wrap create and copy inside one promise
        return Bluebird.try(() => {
          if(this.copyMode) {
            // Copy Mode
            const copyComponent = {
              ...this.componentToCopy,
              title: this.component.title
            }

            return this.copyGameComponent({ game: this.activeGame, component: copyComponent })

          } else {
            // Create mode
            const game = this.activeGame

            return this.createGameComponent({ game, component: this.component })
              .then(componentId => {
                const component = this.findComponent(componentId)
                return this.createDriveArtifactsForGameComponent({ game, component })
                  .then(() => componentId)
              })
          }
        })

          // Clean up regardless of which operation
          .then((componentId) => {
            // stop validating this form
            this.$refs.componentForm.reset()

            // activate the component we created
            this.$store.dispatch("setActiveComponent", componentId)

            this.$emit("close-dialog")
          })
      }
    }
  }
</script>
