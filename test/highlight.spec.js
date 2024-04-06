const expect = require('chai').expect;

const highlight = require('../lib/highlight');

describe('#highlight', () => {
  it('returns string given no blocks', () => {
    expect(
      highlight('nothing to see here')
    ).to.equal('nothing to see here');
  });

  it('returns string given one block', () => {
    expect(
      highlight('usage\n```js\nvar qux = 123;\n```\nxyz')
    ).to.equal(
      'usage\n<pre><code class="hljs js"><span class="hljs-keyword">var</span> qux = <span class="hljs-number">123</span>;</code></pre>\nxyz'
    );
  });

  it('returns string given two blocks', () => {
    expect(
      highlight(
        'block 1:\n```js\nvar i = 1;\n```\nabc\nblock2:\n```js\nvar j = 2;\n```\ndef'
      )
    ).to.equal(
      'block 1:\n<pre><code class="hljs js"><span class="hljs-keyword">var</span> i = <span class="hljs-number">1</span>;</code></pre>\nabc\nblock2:\n<pre><code class="hljs js"><span class="hljs-keyword">var</span> j = <span class="hljs-number">2</span>;</code></pre>\ndef'
    )
  });
});