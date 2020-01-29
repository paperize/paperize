<template lang="pug">
v-card
  v-toolbar

    v-toolbar-title.text-xs-center Debugger

  v-card-title File Upload Test
  v-list
    v-list-tile
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'

  export default {
    data: () => {
      return {
        permissionId: null,
        recordId: null
      }
    },

    computed: mapGetters([]),

    methods: {
      ...mapActions([ ]),
    }
  }
</script>
