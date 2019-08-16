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
      use: '@gridsome/source-filesystem',
      options: {
        path: 'references/**/*.md',
        typeName: 'Reference',
        route: '/references/:slug'
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
