<template lang="pug">
v-form.component-form(ref="componentForm" @submit.prevent="submitComponent")
  v-card
    v-card-title
      .headline New Component


    v-card-text
      v-text-field.component-title(v-model="component.title" :rules="[rules.required]" label="Title" placeholder="Artifact Cards")
      v-checkbox.component-add-sheet-to-source(v-if="gameHasSource && componentIdToCopy == null" v-model="addSheetToSource" label="Automatically add a Sheet to the main spreadsheet for this component?")

      v-radio-group(v-if="anyComponents" v-model="copyMode")
        v-radio(label="Blank Component" :value="false")
        v-radio(label="Copy Existing Component" :value="true")

      template(v-if="copyMode")
        v-select.component-selector(box label="Select Component to Copy" v-model="componentIdToCopy" :items="allComponents" item-value="id" item-text="title")

    v-card-actions
      v-btn(small success @click="submitComponent") Create Component
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'

  export default {
    data() {
      return {
        component: { title: "" },
        componentIdToCopy: null,
        addSheetToSource: true,
        copyMode: false,
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
      }
    },

    methods: {
      ...mapActions([
        "createGameComponent",
        "createComponentFolder",
        "createComponentImageFolder",
        "createGameComponentAndDriveArtifacts",
        "copyGameComponent"
      ]),

      submitComponent() {
        if(this.$refs.componentForm.validate()) {
          let componentToCreate = this.component
          let action = "create"
          if (this.componentIdToCopy !== null) {
            componentToCreate = { ...this.findComponent(this.componentIdToCopy),
              title: this.component.title
            }
            action = "copy"
          }
          this.createGameComponentAndDriveArtifacts({
              action: action,
              game: this.activeGame,
              component: componentToCreate,
              addSheetToSource: this.gameHasSource && this.addSheetToSource
              && this.componentIdToCopy == null
            }).then((componentId) => {
            // stop validating this form
            this.$refs.componentForm.reset()
            // reset the title
            this.component.title = ""
            this.componentIdToCopy = null
            // activate the component we created
            this.$store.dispatch("setActiveComponent", componentId)

            this.$emit("close-dialog")
            })

        }
      }
    }
  }
</script>
