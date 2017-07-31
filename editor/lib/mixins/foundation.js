export default {
  mounted () {
    $(this.$el).foundation()
  },

  destroyed () {
    $(this.$el).foundation().destroy()
  },
}
