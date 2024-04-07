const bs = require('browser-sync').create();
const app = require('../metalsmith');

bs.watch([ 'src', 'views' ]).on('change', (e) => {
  app.build((err) => {
    if (err) {
      throw err;
    } else {
      bs.reload();
    }
  });
})

bs.init({
  server: 'docs'
});