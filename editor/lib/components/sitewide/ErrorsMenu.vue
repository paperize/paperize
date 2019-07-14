<template lang="pug">
v-btn(v-if="anyErrors" flat @click="revealErrorExplorer")
  v-badge.error-count(color="red")
    | Errors

    template(v-if="unreadErrorCount > 0" slot="badge")
      span.error-count-badge {{ unreadErrorCount }}

  v-dialog.errors-explorer(v-model="showErrorExplorer" @close-dialog="showErrorExplorer = false" max-width="600" lazy)
    v-card
      v-card-title Recent Errors
      v-card-text
        v-expansion-panel#errors-explorer(popout)
          v-expansion-panel-content(v-for="error in allErrors" :key="error.id")
            div(slot="header") {{ error.name }}
            v-card
              v-card-text
                v-tooltip(top)
                  | Copy Error Message to Clipboard
                  v-btn(slot="activator" flat icon color="primary" large)
                    v-icon(@click="copyToClipboard(error)") mdi-clipboard-plus
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
      ...mapActions(["clearUnreadErrors"]),

      revealErrorExplorer() {
        this.showErrorExplorer = true
        this.clearUnreadErrors()
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
