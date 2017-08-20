export default {
  destroyed() {
    $(this.$el).remove()
  },

  methods: {
    closeModal() {
      $(this.$el, "#source-paste-form").foundation('close')
    }
  }
}
