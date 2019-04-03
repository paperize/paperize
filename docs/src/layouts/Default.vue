<template lang="pug">
  v-app#paperize-docs
    v-navigation-drawer(v-model="showDrawer" fixed app)
      v-list(dense)
        v-list-tile(@click="")
          v-list-tile-content
            v-list-tile-title Home

        v-list-tile(@click="")
          v-list-tile-content
            v-list-tile-title Contact

    v-toolbar(fixed app)
      v-toolbar-side-icon(@click.stop="showDrawer = !showDrawer")
      v-toolbar-title  {{ $static.metaData.siteName }}

    v-content
      v-container(fluid)
        slot/

    v-footer(app)
      span(class="white--text") &copy; 2019
</template>

<static-query>
query {
  metaData {
    siteName
  }
}
</static-query>

<script>
  export default {
     data: () => ({
       showDrawer: null
     }),
   }
</script>
