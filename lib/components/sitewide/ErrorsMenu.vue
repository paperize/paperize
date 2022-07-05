<template lang="pug">
v-btn(v-if="anyErrors" text @click="revealErrorExplorer")
  v-badge.error-count(color="red")
    | Errors

    template(v-if="unreadErrorCount > 0" slot="badge")
      span.error-count-badge {{ unreadErrorCount }}

  v-dialog.errors-explorer(v-model="showErrorExplorer" @close-dialog="showErrorExplorer = false" max-width="600")
    v-card
      v-card-title
        | Recent Errors
        v-spacer
        v-btn(@click="clearAndClose") Clear All
      v-card-text
        p This menu helps you see when Paperize is breaking, and why. You can look at the errors yourself, or copy-and-paste them to the dev team on Discord.
        v-expansion-panels#errors-explorer(popout)
          v-expansion-panel(v-for="error in allErrors" :key="error.id")
            v-expansion-panel-header
              v-tooltip(top)
                | Clear
                template(v-slot:activator="{ on }")
                  v-btn(v-on="on" text icon color="primary")
                    v-icon(@click.stop="destroyError(error)") mdi-close-circle
              v-tooltip(top)
                | Copy Error Message to Clipboard
                template(v-slot:activator="{ on }")
                  v-btn(v-on="on" text icon color="primary")
                    v-icon(@click.stop="copyToClipboard(error)") mdi-clipboard-plus
              | {{ error.name }}
            v-expansion-panel-content
              v-card
                v-card-text
                  .message {{ error.message }}
                  pre.details {{ error.details }}
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'

  export default {
    data() {
      return {
        showErrorExplorer: false
      }
    },

    computed: {
      ...mapGetters([
        "allErrors",
        "errorCount",
        "unreadErrorCount"
      ]),

      anyErrors() { return this.errorCount > 0 },
    },

    methods: {
      ...mapActions([
        "clearUnreadErrors",
        "destroyError",
        "clearAllErrors"
      ]),

      revealErrorExplorer() {
        this.showErrorExplorer = true
        this.clearUnreadErrors()
      },

      clearAndClose() {
        this.showErrorExplorer = false
        this.clearAllErrors()
      },

      copyToClipboard(error={}) {
        navigator.clipboard.writeText(error.details).then(
          () => {}, // success
          (error) => { // failure
            console.warn(`Failed to copy error clipboard: ${error}`)
          }
        )
      }
    }
  }
</script>

<style>
.error-count .v-badge__badge {
  font-size: 11px !important;
  width: 18px !important;
  height: 18px !important;
  right: -14px !important;
  top: -9px !important;
}
</style>
