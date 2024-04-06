const moment = require('moment');

const renameArticles = (files, metalsmith, done) => {
  for (const filename of Object.keys(files)) {
    const file = files[filename];

    if (file.collection.includes('articles')) {
      const match = filename.match(/(\d{4})-(\d{2})-(\d{2})-(.*)/);
      const newPath = `articles/${match[1]}/${match[2]}/${match[3]}/${match[4]}`;

      delete files[filename];

      files[newPath] = file;
    }
  }

  done();
};

module.exports = renameArticles;