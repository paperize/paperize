<template lang="pug">
  v-app#paperize-docs
    v-navigation-drawer(v-model="showDrawer" fixed app)
      v-list(dense)
        //- Home
        g-link(to="/")
          v-list-tile(@click="" ripple)
            v-list-tile-action
              v-icon(medium) home
            v-list-tile-content
              v-list-tile-title Home

        //- Guides
        v-list-group(prepend-icon="folder" value="true")
          template(v-slot:activator)
            v-list-tile
              v-list-tile-title Guides

          g-link(v-for="guide in guides" :to="guide.to")
            v-list-tile(@click="" ripple)
              v-list-tile-action
              v-list-tile-title {{ guide.name }}

        //- References
        v-list-group(prepend-icon="folder" value="true")
          template(v-slot:activator)
            v-list-tile
              v-list-tile-title References

          g-link(v-for="reference in references" :to="reference.to")
            v-list-tile(@click="" ripple)
              v-list-tile-action
              v-list-tile-title {{ reference.name }}

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
  const
    guides = [
      { name: "Getting Started", to: "/guides/getting-started" },
      { name: "Template Editor", to: "/guides/template-editor" },
      { name: "Google Drive Integration", to: "/guides/google-drive" },
    ],

    references = [
      { name: "Component", to: "/references/component" },
      { name: "Game", to: "/references/game" },
      { name: "Image", to: "/references/image" },
      { name: "Image Layer", to: "/references/image-layer" },
      { name: "Shape Layer", to: "/references/shape-layer" },
      { name: "Spreadsheet", to: "/references/spreadsheet" },
      { name: "Text Layer", to: "/references/text-layer" },
    ]

  export default {
     data: () => ({
       showDrawer: null,
       guides, references
     }),
   }
</script>

<style>
  a {
    text-decoration: none;
  }

  a div {
    color: #666;
  }
</style>
