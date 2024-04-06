---
title: Getting Started with MX
published: "2008-11-24T00:00:00.000Z"
---

Recently, MX was [introduced](/articles/2008/11/21/introducing-mx-lightweight-and-free-cheminformatics-tools-for-java) as a lightweight and free cheminformatics toolkit written in Java. There's nothing like real code examples for getting up to speed with a new library. Creating those examples in an environment that makes experimentation easy is even better. This article introduces the basics of MX using the popular Java scripting environment [JRuby](http://jruby.codehaus.org/).

# Download and Installing JRuby

If you've never worked with Ruby or JRuby before, you're in for a pleasant surprise; the installation is practically effortless. Here are the steps:

1.  Download the [JRuby binary tarball](http://dist.codehaus.org/jruby/jruby-bin-1.1.5.tar.gz).
2.  Untar the JRuby package.
3.  Set your path to point to the JRuby bin directory.

On Unix-based systems, create and enter a working directory, then execute the following commands:

```bash
wget http://dist.codehaus.org/jruby/jruby-bin-1.1.5.tar.gz
tar xvf jruby-bin-1.1.5.tar.gz
export PATH=$PATH:./jruby-1.1.5/bin/
```

You can test your JRuby installation with:

```bash
jruby -v
jruby 1.1.5 (ruby 1.8.6 patchlevel 114) (2008-11-03 rev 7996) [i386-java]
```

# Download the MX Jarfile

Installing MX consists of just [downloading the jarfile](http://mx-java.googlecode.com/files/mx-0.103.0.jar). If you're on a Unix system and still in your working directory:

```bash
wget http://mx-java.googlecode.com/files/mx-0.103.0.jar
```

# Hello, Benzene

Let's create a benzene molecule using MX:

```bash
jirb
irb(main):001:0> require 'mx-0.103.0.jar'
=> true
irb(main):002:0> import com.metamolecular.mx.io.Molecules
=> Java::ComMetamolecularMxIo::Molecules
irb(main):003:0> benzene = Molecules.createBenzene
=> #&lt;Java::ComMetamolecularMxModel::DefaultMolecule:0x9770a3 @java_object=com.metamolecular.mx.model.DefaultMolecule@1536eec>
irb(main):004:0> benzene.countAtoms
=> 6
```

Here, we've used one of the precompiled molecules available through the static methods of the `Molecules` class.

We can also create a `Molecule` from a molfile in a single line of code using `MoleculeKit`. Let's grab the [fluoxetine molfile](http://pubchem.ncbi.nlm.nih.gov/summary/summary.cgi?cid=3386&loc=ec_rcs) from PubChem and convert it into a molecule:

```bash
jirb
irb(main):001:0> require 'mx-0.103.0.jar'
=> true
irb(main):002:0> import com.metamolecular.mx.model.MoleculeKit
=> Java::ComMetamolecularMxModel::MoleculeKit
irb(main):003:0> require 'open-uri'
=> true
irb(main):004:0> molfile = open('http://pubchem.ncbi.nlm.nih.gov/summary/summary.cgi?cid=3386&disopt=DisplaySDF').read
=> "3386\n  -OEChem-11240812312D\n\n 40 41 ..."
irb(main):005:0> fluoxetine = MoleculeKit.readMolfile molfile, true
=> #&lt;Java::ComMetamolecularMxModel::DefaultMolecule:0x2b1682 @java_object=com.metamolecular.mx.model.DefaultMolecule@b655a>
irb(main):006:0> fluoxetine.countAtoms
=> 22
```

Here, we've used the ability of `MoleculeKit` to remove non-stereogenic explicit hydrogens ('virtualizing' them) by setting the second argument of `readMolfile` to `true`.

# Substructure Search

Substructure searches are done through an instance of a class implementing the `Matcher` interface. Currenly, only one such class exists, `DefaultMatcher`, so we'll use it.

Let's verify that benzene is a substructure of toluene:

```bash
jirb
irb(main):001:0> require 'mx-0.103.0.jar'                     
=> true
irb(main):002:0> import com.metamolecular.mx.io.Molecules     
=> Java::ComMetamolecularMxIo::Molecules
irb(main):003:0> import com.metamolecular.mx.map.DefaultMapper
=> Java::ComMetamolecularMxMap::DefaultMapper
irb(main):004:0> benzene = Molecules.createBenzene            
=> #&lt;Java::ComMetamolecularMxModel::DefaultMolecule:0xee260b @java_object=com.metamolecular.mx.model.DefaultMolecule@1f68272>
irb(main):005:0> toluene = Molecules.createToluene            
=> #&lt;Java::ComMetamolecularMxModel::DefaultMolecule:0xffa6eb @java_object=com.metamolecular.mx.model.DefaultMolecule@1e8c585>
irb(main):006:0> mapper = DefaultMapper.new benzene
=> #&lt;Java::ComMetamolecularMxMap::DefaultMapper:0xf0cb3c @java_object=com.metamolecular.mx.map.DefaultMapper@aefcbb>
irb(main):007:0> mapper.hasMap toluene
=> true
```

It worked as expected.

`Mapper` allows us to answer both simple questions like 'Is A a substructure of B?'. It also allows us to answer more complex questions like 'Give me all the matching substructures of A in B'.
For more information, see [this article](/articles/2008/11/17/substructure-search-from-scratch-in-java-part-1-the-atom-mapping-problem) describing the design of the `Mapper` interface.

# Get Involved

Want to know more? Want to report a bug? Want to add your own must-have feature? Want the latest MX?

You can get involved with MX four ways:

-  By [downloading the source](http://code.google.com/p/mx-java/downloads/list)
-  By joining the [Google group](http://groups.google.com/group/mx-java)
-  By [reporting a bug or feature request](http://code.google.com/p/mx-java/issues/list)
-  By [developing your own fork](http://github.com/rapodaca/mx/tree/master)

# Conclusions

MX was designed to make simple things simple. In this article we've seen how combining MX with JRuby leads to an environment in which the simple MX API can be explored quickly and easily. Future articles will discuss other ways to use the MX/JRuby combination.