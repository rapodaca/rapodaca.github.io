const fs = require('fs');

const stamp = async () => {
  const items = await fs.promises.readdir('./src/articles');
  const files = { };
  
  for (const item of items) {
    const file = await fs.promises.readFile(`./src/articles/${item}`, 'utf-8');
    let match = file.match(/(---.*?---)/s);

    if (!match) {
      throw Error(item);
    }

    const frontMatter = match[1];
    match = frontMatter.match(/title\:(.*)/);

    if (!match) {
      throw Error(item);
    }

    const title = match[1].trim();
    match = item.match(/(\d{4}-\d{2}-\d{2})/);

    if (!match) {
      throw Error(item);
    }

    const published = new Date(match[1]);
    const newFrontMatter = `---\ntitle: ${title}\npublished: "${published.toISOString()}"\n---`

    files[item] = file.replace(/\r\n/g, '\n').replace(frontMatter, newFrontMatter);
  }

  for (const name of Object.keys(files)) {
    await fs.promises.writeFile(`./src/articles/${name}`, files[name], 'utf-8');
  }
};

stamp();

// fs.readdir('./src/articles', (err, items) => {
//   if (err) {
//     throw err;
//   }

//   items.sort();

//   for (const item of items) {
//     fs.readFile(`./src/articles/${item}`, 'utf-8', (err, file) => {
//       if (err) {
//         throw err;
//       }

//       let match = file.match(/(---.*?---)/s);

//       if (!match) {
//         throw Error(item);
//       }

//       const frontMatter = match[1];
//       match = frontMatter.match(/title\:(.*)/);

//       if (!match) {
//         throw Error(item);
//       }

//       const title = match[1].trim();

//       match = item.match(/(\d{4}-\d{2}-\d{2})/);

//       if (!match) {
//         throw Error(item);
//       }

//       const published = match[1];
//       const newFrontMatter = `---\ntitle: ${title}\npublished: ${published}\n---`

//       console.log(file.replace(frontMatter, newFrontMatter));
//     });

//     // fs.readFile(`./src/articles/${item}`, 'utf-8', (err, file) => {
//     //   if (err) {
//     //     throw err;
//     //   }

//     //   const match = file.match(/---(.*)---/s);

//     //   if (match) {
//     //     console.log(item);
//     //   } else {
//     //     // console.log(item);
//     //   }
//     // });
//   }
// });