---
title: "An Object-Oriented Framework for Molecular Representation: Getting Started with Octet"
published: "2007-01-30T00:00:00.000Z"
---

> If applications are hard to design and toolkits are harder, then frameworks are hardest of all. A framework designer gambles that one architecture will work for all applications in the domain. Any substantive change to the framework's design would reduce its benefits considerably, since the framework's main contribution to an application is the architecture it defines. Therefore it's imperative to design the framework to be as flexible and extensible as possible.
>
><cite>[Erich Gamma, Richard Helm, Ralph Johnson, and John Vlissides](http://www.assoc-amazon.com/e/ir?t=depthfirst-20&amp;l=as2&amp;o=1&amp;a=0201633612")</cite>

One of the most important considerations when building an application is the choice of framework. As the quote from the <a href="http://en.wikipedia.org/wiki/Design_patterns">Gang of Four</a> implies, there's much more to frameworks than just a collection of re-usable code. At their best, frameworks provide a foundation for thinking about a problem domain and a language for communicating with other developers about it. In this article, I'll introduce <a href="http://sf.net/projects/octet">Octet</a>, an object-oriented framework for molecular representation.

# The Molecular Representation Problem

Isn't molecular representation a solved problem? After all, don't SMILES, Molfile, InChI, and CML adequately represent any molecule the average software developer is likely to see?

As <a href="http://depth-first.com/articles/2006/12/19/ferrocene-and-beyond-a-solution-to-the-molecular-representation-problem">previously discussed</a>, molecular representation technologies have stagnated while the molecules chemists themselves now routinely make and use have continued to become more and more "exotic." Developers are now faced with the thorny problem that a variety of common structural motifs in chemistry can't be adequately represented with industry-standard cheminformatics tools.

This point is so important, I'll repeat it: cheminformatics has fallen behind chemistry in the kinds of molecules it can work with. Quick fixes only allow the problem to fester; what's needed is a comprehensive solution. This is Octet's problem domain.

Every framework is bounded by a specific problem domain. Although the size of the domain can vary, a framework provides a comprehensive solution within it. For complex and poorly standardized domains (such as molecular representation), a good framework can greatly accelerate application development.

A good frameworks stays within its problem domain. One of the most important reasons is to prevent <a href="http://headrush.typepad.com/creating_passionate_users/2005/06/featuritis_vs_t.html">featuritis</a>, the root of much software evil. Keeping a framework focused on its core mission makes it much more likely that it can remain documented, tested, extensible, and efficient.

By intention, a variety of features fall outside Octet's problem domain and so will never be directly supported. For example, rendering 2-D structure diagrams is a common problem in cheminformatics that has nothing to do with solving the molecular representation problem. Similarly, reading and writing SMILES strings and Molfiles are supported by many toolkits, but not by Octet directly. After all, it's the inherent limitations of these languages that Octet is trying to overcome.

Higher-level functionality such as legacy language support and 2-D rendering, although not part of Octet itself, can be developed with Octet as a foundation. For example, two Octet add-on frameworks specifically address these problems. They are called <a href="http://sf.net/projects/rxf/">Rosetta</a> and <a href="http://sf.net/proejects/structure/">Structure</a>, respectively.

# About This Series

This article is the first in a series discussing Octet. Future articles will describe in detail Octet's design, implementation, and use. Although Octet has come a long way, it's far from finished. My motivation for writing these articles is to hear what you have to say about Octet, so please feel free to <a href="http://sourceforge.net/users/r_apodaca/">contact me</a>.

Although Octet is written in Java, code examples discussed here will be written in Ruby. I've taken the same approach in discussing the <a href="http://cdk.sf.net">Chemistry Development Kit</a> (CDK) and <a href="http://depth-first.com/articles/2006/08/28/drawing-2-d-structures-with-structure-cdk">Structure-CDK</a>. Ruby's brevity and comfortable syntax make it ideal for both writing and discussing code.

<a href="http://rubyforge.org/projects/rjb/">Ruby Java Bridge</a> (RJB) is the magic technology that makes this possible. Previous articles have discussed the installation and use of RJB on <a href="http://depth-first.com/articles/2006/10/12/running-ruby-java-bridge-on-windows">Windows</a> and <a href="http://depth-first.com/articles/2006/08/26/scripting-java-libraries-with-ruby-java-bridge">Linux</a>.

# A Simple Test

Assuming you've installed Ruby, RubyGems and Ruby Java Bridge, you can perform a simple demonstration of Octet in Ruby:

```ruby
require 'rubygems'
require_gem 'rjb'
require 'rjb'

BasicMoleculeBuilder = Rjb::import('net.sf.octet.builder.BasicMoleculeBuilder')
RepresentationKit = Rjb::import('net.sf.octet.util.RepresentationKit')
MoleculeKit = Rjb::import('net.sf.octet.util.MoleculeKit')
System = Rjb::import('java.lang.System')


builder = BasicMoleculeBuilder.new


RepresentationKit.buildHexane(builder)


molecule = builder.releaseMolecule
```

The above code generates an Octet representation for n-hexane, and prints the representation to the console. To run this example, save the above code to a file called <strong>test.rb</strong> in your working directory. Then add <strong>octet-0.8.2.jar</strong>, which can be found in the <a href="http://sourceforge.net/project/showfiles.php?group_id=96108&package_id=102647&release_id=378955">Octet-0.8.2 source distribution</a>, to the same directory. The test can then be run with the following sequence of commands:

```bash
export CLASSPATH=./octet-0.8.2.jar
ruby test.rb
**Molecule Properties**

Atom Count: 6, Bonding System Count: 5

Atoms:
atom: C[0] (2nu 0e, 0or, 0.0fc, 1bs, 1n, 4.0val, 3ih )
atom: C[1] (2nu 0e, 0or, 0.0fc, 2bs, 2n, 4.0val, 2ih )
atom: C[2] (2nu 0e, 0or, 0.0fc, 2bs, 2n, 4.0val, 2ih )
atom: C[3] (2nu 0e, 0or, 0.0fc, 2bs, 2n, 4.0val, 2ih )
atom: C[4] (2nu 0e, 0or, 0.0fc, 2bs, 2n, 4.0val, 2ih )
atom: C[5] (2nu 0e, 0or, 0.0fc, 1bs, 1n, 4.0val, 3ih )

No non-natural isotopic distributions specified.

No Orbitals specified.

Bonding Systems:
bonding system:  ( 2be, 0abe, 2a, 1ap ) [ (0, 1) ]
bonding system:  ( 2be, 0abe, 2a, 1ap ) [ (1, 2) ]
bonding system:  ( 2be, 0abe, 2a, 1ap ) [ (2, 3) ]
bonding system:  ( 2be, 0abe, 2a, 1ap ) [ (3, 4) ]
bonding system:  ( 2be, 0abe, 2a, 1ap ) [ (4, 5) ]

Atom Pairs:
atom pair: (0, 1) (1.0 bo)
atom pair: (1, 2) (1.0 bo)
atom pair: (2, 3) (1.0 bo)
atom pair: (3, 4) (1.0 bo)
atom pair: (4, 5) (1.0 bo)

No Atomic Configurations specified.
No Conformation specified.
```

Octet shares the same concepts and vocabulary as <a href="http://depth-first.com/articles/tag/flexmol">FlexMol</a>. We'll drill down into the meaning of the output in later articles. The important thing to remember is that we can print out a report like the one above for any <tt>Molecule</tt>, no matter how complex.

# Conclusions

Octet is an object-oriented framework designed to solve the molecular representation problem and serve as a solid foundation for a variety of cheminformatics applications. Of course, there's much more to Octet than the simple example shown here. Future articles will describe in greater detail the design and use of Octet through illustrative examples.