<template lang="pug">
v-form.component-form(ref="componentForm" @submit.prevent="submitComponent")
  v-card
    v-card-title
      .headline New Component

    v-card-text
      v-text-field.component-title(v-model="component.title" :rules="[rules.required]" label="Title" placeholder="Artifact Cards")
      v-checkbox.component-add-sheet-to-source(v-if="gameHasSource" v-model="addSheetToSource" label="Automatically add a Sheet to the main spreadsheet for this component?")

    v-card-actions
      v-btn(small success @click="submitComponent") Create Component
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'

  export default {
    data() {
      return {
        component: { title: "" },
        addSheetToSource: true,
        rules: {
          required: value => !!value || 'Required.'
        }
      }
    },

    computed: {
      ...mapGetters(["activeGame"]),

      gameHasSource() {
        return !!this.activeGame.sourceId
      }
    },

    methods: {
      ...mapActions([
        "createGameComponent",
        "createComponentFolder",
        "createComponentImageFolder",
        "createGameComponentAndDriveArtifacts"
      ]),

      submitComponent() {
        if(this.$refs.componentForm.validate()) {
          this.createGameComponentAndDriveArtifacts({
            game: this.activeGame,
            component: this.component,
            addSheetToSource: this.gameHasSource && this.addSheetToSource
          })

          .then((componentId) => {
            // stop validating this form
            this.$refs.componentForm.reset()
            // reset the title
            this.component.title = ""
            // activate the component we created
            this.$store.dispatch("setActiveComponent", componentId)
          })

          this.$emit("close-dialog")
        }
      }
    }
  }
</script>
