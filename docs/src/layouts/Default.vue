<template lang="pug">
  v-app#paperize-docs
    v-navigation-drawer(v-model="showDrawer" fixed app)
      v-card(min-height="200")
        v-card-text Recognized Patrons

      v-list(dense subheader)
        //- Home
        v-list-tile(ripple to="/" @click="")
          v-list-tile-action
            v-icon(medium) home
          v-list-tile-content
            v-list-tile-title Home

        //- Guides
        v-subheader(inset) Guides
        v-divider

        v-list-tile(ripple v-for="guide in guides" :to="guide.to" :key="guide.name" @click="" )
          v-list-tile-action
          v-list-tile-title {{ guide.name }}

        //- References
        v-subheader(inset) References
        v-divider

        v-list-tile(ripple v-for="reference in references" :to="reference.to" :key="reference.name" @click="")
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
      { name: "Google Authorization", to: "/references/google-authorization" },
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
  .v-subheader {
    text-transform: uppercase;
  }

  a {
    text-decoration: none;
  }

  a div {
    color: inherit;
  }
</style>
