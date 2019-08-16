module.exports = {
  siteName: 'Paperize Documentation',
  icon: 'favicon.ico',
  plugins: [
    // Markdown-based Guides
    {
      use: '~/vue-remark',
      options: {
        typeName: 'Guide',
        baseDir: './guides',
        route: '/guides/:slug',
        component: "src/templates/Guide.vue"
      }
    },
    // Markdown-based Reference pages
    {
      use: '~/vue-remark',
      options: {
        typeName: 'Reference',
        baseDir: './references',
        route: '/references/:slug',
        component: "src/templates/Reference.vue"
      }
    }
  ],
  chainWebpack: config => {
    // Pug support
    config.module
      .rule('pug')
      .test(/\.pug$/)
      .use('pug-plain-loader')
      .loader('pug-plain-loader')
  }
}
