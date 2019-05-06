module.exports = {
  siteName: 'Paperize Documentation',
  icon: 'favicon.ico',
  plugins: [
    // Markdown-based Guides
    {
      use: '@gridsome/source-filesystem',
      options: {
        path: 'guides/**/*.md',
        typeName: 'Guide',
        route: '/guides/:slug'
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
