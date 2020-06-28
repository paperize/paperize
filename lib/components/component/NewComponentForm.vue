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

      template(v-else)
        v-checkbox.component-add-sheet-to-source(v-if="gameHasSource && componentIdToCopy == null" v-model="addSheetToSource" label="Automatically add a Sheet to the main spreadsheet for this component?")

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
        addSheetToSource: true,
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
        "createGameComponentAndDriveArtifacts",
        "copyGameComponent"
      ]),

      submitComponent() {
        if(!this.$refs.componentForm.validate()) { return }

        // Wrap create and copy inside one promise
        return new Promise((resolve) => {
          if(this.copyMode) {
            // Copy Mode
            const copyComponent = {
              ...this.componentToCopy,
              title: this.component.title
            }

            resolve(this.copyGameComponent({ game: this.activeGame, component: copyComponent }))

          } else {
            // Create mode
            resolve(this.createGameComponentAndDriveArtifacts({
              game: this.activeGame,
              component: this.component,
              addSheetToSource: (this.gameHasSource && this.addSheetToSource)
            }))
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
