module.exports = {
  siteName: 'Paperize Documentation',
  plugins: [
    // Markdown-based Guides
    {
      use: '@gridsome/source-filesystem',
      options: {
        path: 'guides/**/*.md',
        typeName: 'Guide',
        route: '/guides/:slug'
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
