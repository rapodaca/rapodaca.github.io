---
title: "ChemRuby First Look"
published: "2006-08-13T00:00:00.000Z"
---

[Ruby](http://ruby-lang.org/en) is a dynamic object oriented scripting language. First released in 1995 by a Japanese programmer, it has recently begun to attract a worldwide audience.

The use of Ruby in chemical informatics, although currenly rare, can be expected to increase. One especially interesting project is <a href="http://chemruby.org">ChemRuby</a>. Although the website is written in Japanese, there is enough English to get a feel for what ChemRuby is all about.

I was unsuccessful in installing the 1.0 source due to a failed dependency on the Ruby library "dbm". I was, however, able to install version 0.9.3 via RubyGems (`sudo gem install chemruby`).

The code snippet below creates cyclohexane from the corresponding SMILES string, and then prints out the the number of atoms and molecular weight.

```ruby
require 'rubygems'
require_gem 'chemruby'

mol = SMILES('C1CCCCC1')

puts mol.nodes.size
puts mol.molecular_weight
```

Browsing the API documentation shows some interesting functionality, including ring perception, cannonical SMILES, and isomorphism detection.</p>