---
title: Fast Substructure Search Using Open Source Tools Part 4 - Creating Fingerprints from Chemical Structures
published: "2008-10-15T00:00:00.000Z"
---

The previous articles in this series have detailed the steps needed to build a working fingerprint screening system using nothing more than the open source tools [MySQL](http://www.mysql.com/), [Ruby](http://ruby-lang.org), and [ActiveRecord](http://ar.rubyonrails.org/). With this system we can create, read, update, and destroy fingerprints in persistent storage. Although the system meets all of the requirements of a fingerprint screening system, it isn't a substructure search system - yet. For that, we need a way to convert chemical structure representations into fingerprints. This article describes a very simple method for doing so.

All Articles in this Series:

- [Part 1: Fingerprints and Databases](/articles/2008/10/02/fast-substructure-search-using-open-source-tools-part-1-fingerprints-and-databases)
- [Part 2: Fingerprint Screen With SQL](/articles/2008/10/03/fast-substructure-search-using-open-source-tools-part-2-fingerprint-screen-with-sql)
- [Part 3: A CRUD API for Fingerprints in Ruby](/articles/2008/10/06/fast-substructure-search-using-open-source-tools-part-3-a-crud-api-for-fingerprints-in-ruby)
- Part 4: Creating Fingerprints from Chemical Structures
- [Part 5: Relating Molecules to Fingerprints with SQL](/articles/2008/10/21/fast-substructure-search-using-open-source-tools-part-5-relating-molecules-to-fingerprints-with-sql)
- [Part 6: Modelling a One-To-Many Relationship Between Fingerprints and Compounds in Ruby](/articles/2008/10/29/fast-substructure-search-using-open-source-tools-part-6-modelling-a-one-to-many-relationship-between-fingerprints-and-compounds-in-ruby)

# A Ruby Fingerprinter in Eight Lines

Let's create a `Fingerprinter` class that's capable of converting a SMILES string into a `Fingerprint` that can be stored and queried. The Ruby code below makes use of Open Babel's [`babel`](http://openbabel.org/wiki/Babel) command-line utility:

```ruby
require 'fingerprint'

class Fingerprinter  
  def fingerprint_smiles smiles
    raw = %x[echo '#{smiles}' | babel -ismi -ofpt 2>;/dev/null]
    bytes = raw.gsub(/>;.*?\n/, '').gsub(/\n/, '').split

    Fingerprint.new.fill_bytes{|i| "#{bytes[2*i]}#{bytes[2*i+1]}".hex}
  end
end
```

This class takes advantage of Ruby's ability to interface directly with the command line through the `%x` operator in a way similar to that previously described for the <a href="/articles/2008/05/30/a-simple-and-portable-ruby-interface-to-inchi-part-2-silencing-console-output">cInChI command line tool</a>. The `babel` output is then converted into a form suitable for use with our <a href="/articles/2008/10/06/fast-substructure-search-using-open-source-tools-part-3-a-crud-api-for-fingerprints-in-ruby">previously-defined</a> `Fingerprint` class.

Although quite easy to implement, this approach may not work in every situation. For example, the `fingerprint_smiles` method opens the possibility that a malicious user could attempt to execute arbitrary shell commands by creating a mis-formed SMILES string. Windows users may need to adapt the code. But for trusted SMILES on Unix machines, this implementation works well and can be used in many different programming environments.

# Testing the Fingerprinter

We can test the Fingerprinter through interactive Ruby (irb):

```bash
irb
irb(main):001:0>; require 'lib/fingerprinter'
=>; true
irb(main):002:0>; fp=Fingerprinter.new
=>; #&lt;Fingerprinter:0xb7498038>;
irb(main):003:0>; f=fp.fingerprint_smiles 'c1ccccc1'
=>; #&lt;Fingerprint id: nil, byte0: 0, byte1: 512, byte2: 0, byte3: 0, byte4: 2112, byte5: 32768, byte6: 0, byte7: 0, byte8: 0, byte9: 0, byte10: 134217728, byte11: 0, byte12: 0, byte13: 0, byte14: 131072, byte15: 0, hex: nil>;
irb(main):004:0>; f.cardinality
=>; 6
irb(main):005:0>; f.bitstring
=>; "0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000100000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000000000000"
```

As we previously saw, any `Fingerprint` we create can be stored and later retrieved from a MySQL database. If we've already stored the fingerprint for benzene it can be found with the following:

```bash
irb
irb(main):001:0>; require 'lib/fingerprinter'
=>; true
irb(main):002:0>; fp=Fingerprinter.new
=>; #&lt;Fingerprinter:0xb74ae284>;
irb(main):003:0>; f=fp.fingerprint_smiles 'c1ccccc1'
=>; #&lt;Fingerprint id: nil, byte0: 0, byte1: 512, byte2: 0, byte3: 0, byte4: 2112, byte5: 32768, byte6: 0, byte7: 0, byte8: 0, byte9: 0, byte10: 134217728, byte11: 0, byte12: 0, byte13: 0, byte14: 131072, byte15: 0, hex: nil>;
irb(main):004:0>; Fingerprint.find_by_fingerprint f
=>; #&lt;Fingerprint id: 12687, byte0: 0, byte1: 512, byte2: 0, byte3: 0, byte4: 2112, byte5: 32768, byte6: 0, byte7: 0, byte8: 0, byte9: 0, byte10: 134217728, byte11: 0, byte12: 0, byte13: 0, byte14: 131072, byte15: 0, hex: "000000000000000000000000000002000000000000000000000...">;
```

# Conclusions

We now have the ability to create, store, and query fingerprints created from arbitrary SMILES strings. If there were a 1:1 relationship between molecules and fingerprints, we'd be nearly done. But things are not quite that simple. The next article in this series will show how to relate molecules to fingerprints.