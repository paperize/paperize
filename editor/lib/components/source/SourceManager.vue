<template lang="pug">
v-card#source-manager
  v-card-title
    .headline Source Manager

  v-card-text
    template(v-if="componentSource")
      dl
        dt Current Source:
        dd {{ componentSource.name }}

      v-btn(small color="alert" @click="unlinkComponentSource(component)")
        v-icon(left) times
        | Change Now...

      v-btn(small @click="createOrUpdateSourceById(componentSource.id)")
        v-icon(left) sync
        | Refresh Now

    template(v-else)
      .small-12.cell
        strong You need to load a component source...

      .small-4.cell
        p ...from Paperize examples?

      .small-4.cell
        p ...from your past sources?

        template(v-if="allSources.length == 0")
          p You have not imported any sources.

        .grid-x(v-else)
          template(v-for="source in allSources")
            .shrink.cell
              ul.menu
                li
                  a.button.tiny.alert.delete-source(@click="confirmDeletion(source)")
                    i.fas.fa-times
                li
                  a.button.tiny.success.set-source(@click="setSource(source)")
                    i.fas.fa-check
            .small-8.cell
              p
                a(@click="setSource(source)") {{ source.name }}

      .small-4.cell
        p ...from Google Sheets?
        .grid-x
          .auto.cell
          .shrink.cell
            a.button(@click="$modal.show('source-explorer')") Browse Google Sheets
            source-explorer
          .auto.cell
        .grid-x
          .auto.cell
          .shrink.cell
            a.button(@click="$modal.show('source-paste-form')") Paste a Link
            source-paste-form
          .auto.cell
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions, } from 'vuex'
import SourcePasteForm from './SourcePasteForm.vue'
import SourceExplorer from './SourceExplorer.vue'

export default {
  props: ["component"],

  components: {
    'source-paste-form': SourcePasteForm,
    'source-explorer': SourceExplorer
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
      this.$modal.hide("Source Manager")
    },

    confirmDeletion(source) {
      this.$modal.show('dialog', {
        title: `Are you sure you want to purge the source "${source.name}" from Paperize?`,
        text: "It is in use in X components across Y games.",
        buttons: [
          {
            title: "No",
            default: true
          }, {
            title: "Yes",
            handler: () => {
              this.destroySource(source)
              this.$modal.hide('dialog')
            }
          }
        ]
      })
    }
  }
}
</script>
