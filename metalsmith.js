const metalsmith = require('metalsmith');
// const markdown = require('metalsmith-markdown');
const markdown = require('./lib/markdown');
const collections = require('metalsmith-collections');
const metadata = require('metalsmith-collection-metadata');
const permalinks = require('metalsmith-permalinks');
// const hjs = require('highlightjs');
const renameArticles = require('./lib/rename-articles');
const handlebars = require('./lib/handlebars');

const app = metalsmith(__dirname)
  .source('src')
  .destination('docs')
  .use(collections({
    articles: {
      pattern: 'articles/*.md',
      sortBy: (a, b) => Date.parse(b.published) - Date.parse(a.published)
    },
    recentArticles: {
      pattern: 'articles/*.md',
      sortBy: (a, b) => Date.parse(b.published) - Date.parse(a.published),
      limit: 25
    },
    htmlAssets: {
      pattern: 'images/**/*.html'
    }
  }))
  .use(metadata({
    'collections.articles': {
      layout: 'article.hbs'
    },
    // prevent permalinks on html assets
    'collections.htmlAssets': {
      permalink: false
    }
  }))
  .use(markdown({ }))
  // .use(markdown({
  //   gfp: true,
  //   tables: true,
  //   highlight: (code, name) => {
  //     return hjs.highlight(name, code).value;
  //   }
  // }))
  .use(renameArticles)
  .use(permalinks({
    relative: false
  }))
  .use(handlebars({
    partials: 'views/partials',
    layouts: 'views/layouts'
  }));

if (module.parent) {
  module.exports = app;
} else {
  app.build((err) => {
    if (err) {
      throw err;
    }
  });
}

