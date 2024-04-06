---
title: "A Molecular Language for Modern Chemistry: Reading FlexMol Documents with Octet"
published: "2007-01-31T00:00:00.000Z"
---

An XML language is only as useful as the software tools that take advantage of it. <a href="http://depth-first.com/articles/tag/flexmol">Previous articles</a> have discussed how the XML language FlexMol can solve a variety of molecular representation problems ranging from the <a href="http://depth-first.com/articles/2006/12/20/a-molecular-language-for-modern-chemistry-getting-started-with-flexmol">multiatom bonding of metallocenes</a> to the <a href="http://depth-first.com/articles/2006/12/20/a-molecular-language-for-modern-chemistry-getting-started-with-flexmol">axial chirality of biaryls</a>. <a href="http://depth-first.com/articles/2007/01/30/an-object-oriented-framework-for-molecular-representation-getting-started-with-octet">Octet</a> is a framework written in Java that speaks FlexMol natively. In this article, I'll show how Octet can be used to read a sample FlexMol document.

# Prerequisites

For this tutorial, you'll need <a href="http://rubyforge.org/projects/rjb/">Ruby Java Bridge</a> (RJB). Previous articles have discussed the installation and use of RJB on <a href="http://depth-first.com/articles/2006/10/12/running-ruby-java-bridge-on-windows">Windows</a> and <a href="http://depth-first.com/articles/2006/08/26/scripting-java-libraries-with-ruby-java-bridge">Linux</a>.

# A Sample Molecule

![(S)-Monolaterol](/images/posts/20070131/s_monolaterol.png "(S)-Monolaterol")

A <a href="http://depth-first.com/articles/2007/01/25/a-molecular-language-for-modern-chemistry-flexmol-tetrahedral-chirality-and-monolaterol">recent article</a> disused a FlexMol representation of the chiral natural product monolaterol. Using a slightly modified numbering system for this molecule (shown above), we can construct a [complete FlexMol representation](/images/posts/20070131/s_monolaterol.xml). In this case, we simply start numbering at index zero, subtracting one from every index in the previous example to match the zero-based indices used in Octet.

# A Demonstration Package

To illustrate the process of reading a FlexMol document, I've prepared a small package (<strong>demo-20070131.tar.gz</strong>) that can be <a href="https://sourceforge.net/project/showfiles.php?group_id=96108&amp;package_id=220177&amp;release_id=482855">downloaded from SourceForge</a>. In it, you'll find an Octet jarfile (<strong>octet-0.8.2.jar</strong>), a FlexMol representation of monolaterol (<strong>s_monolaterol.xml</strong>), a Ruby library (<strong>reader.rb</strong>), and some Ruby test code (<strong>test.rb</strong>). Inflate this archive and make it your working directory.

# A Simple Test

The following sequence of commands will run the test included with the demonstration package:

```bash
export CLASSPATH=./octet-0.8.2.jar
ruby test.rb
```

You should see several lines of output terminated with the line:

```bash
The exact mass of monolaterol is 276.115029755.
```

You can get more hands-on experience with loading and processing the monolaterol FlexMol document using interactive Ruby (irb). For example:

```bash
irb
irb(main):001:0> require 'reader'
=> true
irb(main):002:0> r=Reader.new
=> #<Reader:0x2b9ab173a1f0 @xml_reader=#<#<Class:0x2b9ab1741680>:0x2b9ab1736690>, @handler=#<#<Class:0x2b9ab1741680>:0x2b9ab1736e10>, @builder=#<#<Class:0x2b9ab1741680>:0x2b9ab1736b90>>
irb(main):003:0> mol=r.read_file 's_monolaterol.xml'
=> #<#<Class:0x2b9ab1741680>:0x2b9ab172cd48>
irb(main):004:0> mol.countAtoms
=> 21
irb(main):005:0> mol.countBondingSystems
=> 24
```

Of course, this is just scratching the surface of what can be done once a FlexMol document has been loaded by Octet.

# Conclusions

Octet makes it possible to convert FlexMol documents into Java object representations that can be accessed through Ruby. With an object representation, the possibilities are limitless. Some simple examples have been provided here. Future articles will illustrate more advanced uses.