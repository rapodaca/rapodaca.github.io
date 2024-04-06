---
title: Exhaustive Ring Perception With MX
published: "2009-01-08T00:00:00.000Z"
---

The [latest release](http://code.google.com/p/mx-java/downloads/detail?name=mx-0.108.1-src.tar.gz&can=2&q=#makechanges) of [MX](http://metamolecular.com/mx/) now supports exhaustive ring perception. Both a [platform-independent jarfile](http://mx-java.googlecode.com/files/mx-0.108.1.jar) and [source distribution](http://mx-java.googlecode.com/files/mx-0.108.1-src.tar.gz) can be downloaded.

# Background

The ability to perceive all rings in a chemical structure is essential for a number of important cheminformatics capabilities including [Structure Diagram Generation](/articles/2007/04/11/structure-diagram-generation), [aromaticity detection](/articles/2007/11/28/smiles-and-aromaticity-broken), and [binary fingerprint generation](/articles/2008/10/02/fast-substructure-search-using-open-source-tools-part-1-fingerprints-and-databases).

A recent Depth-First article described a [ring-perception algorithm](/articles/2008/12/16/exhaustive-ring-perception) that efficiently returns the set of all rings for any molecule. The algorithm, developed by Hanser and coworkers has now been implemented in MX.

[MX](http://code.google.com/p/mx-java/) is a platform-independent, cross-language cheminformatics toolkit written in Java and made available to the cheminformatics community by [Metamolecular, LLC](http://metamolecular.com).

# Examples

Ring perception can be tested conveniently using either [JRuby](/articles/2008/11/24/getting-started-with-mx) or [Jython](/articles/2008/12/01/open-source-cheminformatics-in-python-with-mx). In these examples, we'll use JRuby.

To find all rings in benzene, we'd use something like:

```bash
jirb
irb(main):001:0> require 'mx-0.108.1.jar'                         
=> true
irb(main):002:0> import com.metamolecular.mx.ring.HanserRingFinder
=> Java::ComMetamolecularMxRing::HanserRingFinder
irb(main):003:0> import com.metamolecular.mx.io.Molecules         
=> Java::ComMetamolecularMxIo::Molecules
irb(main):004:0> benzene = Molecules.create_benzene               
=> #&lt;Java::ComMetamolecularMxModel::DefaultMolecule:0x1971eb3 @java_object=com.metamolecular.mx.model.DefaultMolecule@126ba64>
irb(main):005:0> finder = HanserRingFinder.new                    
=> #&lt;Java::ComMetamolecularMxRing::HanserRingFinder:0x76f2e8 @java_object=com.metamolecular.mx.ring.HanserRingFinder@1458dcb>
irb(main):006:0> rings = finder.find_rings benzene                
=> #&lt;Java::JavaUtil::ArrayList:0x1b83048 @java_object=[[com.metamolecular.mx.model.DefaultMolecule$AtomImpl@169dd64, com.metamolecular.mx.model.DefaultMolecule$AtomImpl@145f5e3, com.metamolecular.mx.model.DefaultMolecule$AtomImpl@122d9c, com.metamolecular.mx.model.DefaultMolecule$AtomImpl@170984c, com.metamolecular.mx.model.DefaultMolecule$AtomImpl@11ed166, com.metamolecular.mx.model.DefaultMolecule$AtomImpl@45aa2c, com.metamolecular.mx.model.DefaultMolecule$AtomImpl@169dd64]]>
irb(main):007:0> rings[0].collect{|atom| atom.get_index}.join("-")
=> "5-0-1-2-3-4-5"
irb(main):008:0> rings.size
=> 1
```

Here, we're taking advantage of the Ruby <a href="http://www.ruby-doc.org/core/classes/Array.html#M002205"><code>Array.join</code></a> function to place a dash between each atom index.

To really push the system, we could find all rings in cubane:

```bash
jirb
irb(main):001:0&gt; require 'mx-0.108.1.jar'                         
=&gt; true
irb(main):002:0&gt; import com.metamolecular.mx.ring.HanserRingFinder
=&gt; Java::ComMetamolecularMxRing::HanserRingFinder
irb(main):003:0&gt; import com.metamolecular.mx.io.Molecules         
=&gt; Java::ComMetamolecularMxIo::Molecules
irb(main):004:0&gt; cubane = Molecules.create_cubane                 
=&gt; #&lt;Java::ComMetamolecularMxModel::DefaultMolecule:0xe391c4 @java_object=com.metamolecular.mx.model.DefaultMolecule@182a033&gt;
irb(main):005:0&gt; finder = HanserRingFinder.new                    
=&gt; #&lt;Java::ComMetamolecularMxRing::HanserRingFinder:0x1458dcb @java_object=com.metamolecular.mx.ring.HanserRingFinder@1603522&gt;
irb(main):006:0&gt; rings = finder.find_rings cubane                 
=&gt; #collection with many objects
irb(main):007:0&gt; rings.size                                       
=&gt; 28
irb(main):008:0&gt; rings[0].collect{|atom| atom.get_index}.join("-")
=&gt; "3-0-1-2-3"
```

# Other Improvements

The MX-0.108.1 release includes some other changes as well.

- Fixes a bug in which multiline SD file data was not read.
- Adds a resources directory containing atomic_system.xml so that the source distribution can compile and all tests will pass.

# Conclusions

This first implementation of the Hanser algorithm focuses on correctness, readability, and test coverage over performance. Future releases will address performance in the context of a [open, multi-toolkit cheminformatics benchmark suite](/articles/2008/12/05/open-benchmarks-for-cheminformatics).