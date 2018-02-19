<template lang="pug">
#source-manager
  .grid-x.grid-padding-x
    .small-12.cell
      h2 Source Manager

      hr

    template(v-if="componentSource")
      .shrink.cell
        dl
          dt Current Source:
          dd {{ componentSource.name }}

      .auto.cell
        a.button.small.alert(@click="unlinkComponentSource(component)")
          i.fas.fa-times
          |  Change Now...

      .small-12.cell
        dl
          dt From:
          dd Google Spreadsheets

      .shrink.cell
        dl
          dt Last Updated:
          dd a few minutes ago

      .auto.cell
        a.button.small(@click="createOrUpdateSourceById(componentSource.id)")
          i.fas.fa-sync
          |  Refresh Now

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
                  a.button.tiny.alert(@click="confirmDeletion(source)")
                    i.fas.fa-times
                li
                  a.button.tiny.success(@click="setSource(source)")
                    i.fas.fa-check
            .small-8.cell
              p {{ source.name }}

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
