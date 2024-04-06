const basename = require('path').basename;
const extname = require('path').extname;
const showdown = require('showdown');
const highlight = require('./highlight');
const showdownKatex = require('showdown-katex');
const showdownHighlight = require('showdown-highlight');

const markdown = (options) => {
  const converter = new showdown.Converter({
    extensions: [
      showdownKatex({ }),
      showdownHighlight
    ]
  });

  converter.setOption('headerLevelStart', 2);

  return (files, metalsmith, done) => {
    for (const name of Object.keys(files)) {
      if (!name.endsWith('.md')) {
        continue;
      }
      
      const file = files[name];
      const contents = file.contents.toString();
      const markup = converter.makeHtml(contents);

      file.contents = markup;

      delete files[name];
      files[basename(name, extname(name)) + '.html'] = file;
    }

    done();
  };
};

module.exports = markdown;