const path = require('path');
const fs = require('fs');
const hbs = require('handlebars');
const walk = require('walk');
const moment = require('moment');

const handlebars = (options={}) => {
  return async (files, metalsmith, done) => {
    const layouts = await registerLayouts(metalsmith, options);

    await registerPartials(metalsmith, options);
    processFiles(files, layouts, metalsmith.metadata(), options);
    done();
  };
};

const registerLayouts = async (metalsmith, options) => {
  const layoutsPath = path.join(
    metalsmith._directory, options.layouts || 'layouts'
  );
  const walker = walk.walk(layoutsPath);
  const result = { };

  return new Promise((resolve, reject) => {
    walker.on('file', (root, stat, next) => {
      const layoutPath = path.join(root, stat.name);

      fs.readFile(layoutPath, 'utf-8', (err, data) => {
        if (!err) {
          result[path.relative(layoutsPath, layoutPath)] = data;
        }

        next(err);
      });
    });

    walker.on('error', reject);
    walker.on('end', () => resolve(result));
  });
};

const registerPartials = async (metalsmith, options) => {
  const partialsPath = path.join(
    metalsmith._directory, options.partials || 'partials'
  );
  const walker = walk.walk(partialsPath);

  return new Promise((resolve, reject) => {
    walker.on('file', (root, stat, next) => {
      const partialPath = path.join(root, stat.name);

      fs.readFile(partialPath, 'utf-8', (err, data) => {
        if (!err) {
          const extension = path.extname(stat.name);
          const partialName = path.relative(partialsPath, partialPath);

          hbs.registerPartial(partialName.replace(extension, ''), data);
        }

        next(err);
      });
    });

    walker.on('error', reject);
    walker.on('end', resolve);
  });
};

const processFiles = (files, layouts, metadata, options) => {
  const globals = options.globals || { };

  for (const filename of Object.keys(files)) {
    const file = files[filename];
    const now = moment().toISOString();
    const browserTitle = file.title ? `${file.title} | Depth-First` : 'Depth-First';

    if (file.layout === 'inline') {
      const layout = hbs.compile(file.contents.toString());
      const context = { ...globals, ...file, ...metadata, now };

      file.contents = layout(context);
    } else if (file.layout) {
      const layout = hbs.compile(layouts[file.layout]);
      const context = { ... globals, ...file, ...metadata, now, browserTitle };
  
      file.contents = layout(context);
    } else {
      // do nothing
    }
  }
};

module.exports = handlebars;