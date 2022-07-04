<template lang="pug">
v-menu
  v-btn(text slot="activator") Help

  v-list
    v-list-item(href="https://docs.paperize.io" target="_blank")
      v-list-item-title Documentation

    v-list-item(href="https://discord.gg/9ggkkQp" target="_blank")
      v-list-item-title Join Discord

    v-list-item(:href="bugLink" title="Send a bug report email")
      v-list-item-title Report a Bug

    v-list-item(:href="featureLink" title="Send a feature request email")
      v-list-item-title Request a Feature
</template>

<script>
  export default {
    computed: {
      bugLink() {
        const
          email = "loren+bugs@oilandrope.com",
          subject = "subject=Paperize.io Bug Report",
          body = `body=A good bug report contains 3 things: what I DID, what I EXPECTED to happen, and what ACTUALLY happened...`,
          params = [subject, body].join('&')

        return `mailto:${email}?${params}`
      },

      featureLink() {
        const
          email = "loren+features@oilandrope.com",
          subject = "subject=Paperize.io Feature Request",
          body = "body=Paperize would be even better if it...",
          params = [subject, body].join('&')

        return `mailto:${email}?${params}`
      },
    }
  }
</script>
