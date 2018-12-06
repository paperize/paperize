<template lang="pug">
v-card#source-manager
  v-card-title
    .headline Source Manager

  v-card-text(v-if="componentSource")
    dl
      dt Current Source:
      dd {{ componentSource.name }}

    v-btn(small color="error" @click="unlinkComponentSource(component)")
      v-icon(left) delete
      | Change Now...

    v-btn(small @click="createOrUpdateSourceById(componentSource.id)")
      v-icon(left) sync
      | Refresh Now

  template(v-else)
    v-card-text
      strong No source set.

      v-list(dense)
        v-list-tile.set-source(v-for="source in allSources" :key="source.name" @click="setSource(source)")
          v-list-tile-content
            v-list-tile-title {{ source.name }}

          v-list-tile-action.delete-source(@click.stop="confirmDeletion(source)")
            v-icon delete

      v-dialog(v-model="showSourceDeleteDialog" max-width="500" lazy)
        v-card
          v-card-title
            .headline Are you sure you want to purge the source "{{ sourceToDelete.name }}" from Paperize?
          v-card-text It is in use in X components across Y games.
          v-card-actions
            v-btn(@click="showSourceDeleteDialog = false") No
            v-btn(@click="deleteSource") Yes

    v-card-actions
      v-btn(@click="showSourceExplorerDialog = true") Browse Google Sheets
      v-dialog(v-model="showSourceExplorerDialog" max-width="500" lazy)
        source-explorer(@close-dialog="showSourceExplorerDialog = false")

      v-btn(@click="showSourcePasteDialog = true") Paste a Link
      v-dialog(v-model="showSourcePasteDialog" max-width="500" lazy)
        source-paste-form(@close-dialog="showSourcePasteDialog = false")
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions, } from 'vuex'
import SourcePasteForm from './SourcePasteForm.vue'
import SourceExplorer from './SourceExplorer.vue'

export default {
  props: ["component"],

  components: { SourcePasteForm, SourceExplorer },

  data() {
    return {
      showSourceExplorerDialog: false,
      showSourcePasteDialog: false,
      showSourceDeleteDialog: false,
      sourceToDelete: {}
    }
  },

  computed: {
    ...mapGetters([
      "findComponentSource",
      "allSources",
      "sourceProperties"
    ]),

    componentSource() { return this.findComponentSource(this.component) }
  },

  methods: {
    ...mapActions([
      "destroySource",
      "linkComponentSource",
      "unlinkComponentSource",
      "createOrUpdateSourceById"
    ]),

    setSource(source) {
      this.linkComponentSource({ component: this.component, source })
      this.$emit('close-dialog')
    },

    confirmDeletion(source) {
      this.sourceToDelete = source
      this.showSourceDeleteDialog = true
    },

    deleteSource() {
      this.destroySource(this.sourceToDelete)
      this.sourceToDelete = {}
      this.showSourceDeleteDialog = false
    }
  }
}
</script>
