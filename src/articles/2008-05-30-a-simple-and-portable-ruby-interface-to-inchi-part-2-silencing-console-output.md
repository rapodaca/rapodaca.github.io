---
title: A Simple and Portable Ruby Interface to InChI Part 2 - Silencing Console Output
published: "2008-05-30T00:00:00.000Z"
---

The previous article in this series described a [simple and portable method](http://depth-first.com/articles/2008/05/29/a-simple-and-portable-ruby-interface-to-inchi) for interfacing Ruby to the cInChI-1 binary. One disadvantage was noisy console output. This article offers a minor modification to disable it.

# The Code

```ruby
module InChI
  def inchi_for molfile
    output = %x[echo "#{molfile}" | cInChI-1 -STDIO 2&gt;/dev/null]

    output.eql?("") ? "" : output.split(/\n/)[1]
  end
end
```

Here, we're taking advantage of the ability to redirect certain output streams to `/dev/null`.

<h4>Testing the Code</h4>

Saving the above in a file called <strong>inchi.rb</strong>, we can test it from IRB. To make things interesting, let's pull a molfile from <a href="http://chempedia.com">Chempedia</a>:

```bash
irb
irb(main):001:0&gt; require 'open-uri'
=&gt; true
irb(main):002:0&gt; require 'inchi'
=&gt; true
irb(main):003:0&gt; include InChI
=&gt; Object
irb(main):004:0&gt; open 'http://chempedia.com/compounds/83490.mol' do |f|
irb(main):005:1*   puts inchi_for(f.read)
irb(main):006:1&gt; end
InChI=1/C15H15NO3S/c17-14(16-18)11-20(19)15(12-7-3-1-4-8-12)13-9-5-2-6-10-13/h1-10,15,18H,11H2,(H,16,17)
=&gt; nil
```

We should be able to run this code unmodified on any UNIX-like system in which the **cInChI-1** binary is on the path. And of course we could take this one step further by allowing [command line options](http://depth-first.com/articles/2007/03/19/customize-inchi-output-with-rino) to be passed in as parameters to the `inchi_for` method.

Simplicity has its advantages.