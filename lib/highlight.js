const createBlocks = require('gfm-code-blocks');
const hjs = require('highlight.js');

const highlight = (text) => {
  const blocks = createBlocks(text);
  const fragments = [ ];
  let last = 0;

  for (const block of blocks) {
    fragments.push(text.substring(last, block.start));
    fragments.push(`<pre><code class="hljs ${block.lang}">`);
    fragments.push(hjs.highlight(block.lang, block.code).value.trim());
    fragments.push('</code></pre>');

    last = block.end;
  }

  fragments.push(text.substring(last));

  return fragments.join('');
};

module.exports = highlight;