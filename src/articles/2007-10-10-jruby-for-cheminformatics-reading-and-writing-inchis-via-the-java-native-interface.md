---
title: JRuby for Cheminformatics - Reading and Writing InChIs Via the Java Native Interface
published: "2007-10-10T00:00:00.000Z"
---

The increased use of the [InChI identifier](/articles/2007/09/27/inchi-for-newbies) is making the reading and writing of InChIs a standard cheminformatics capability. Recent articles have discussed the advantages of JRuby for cheminformatics. One disadvantage of JRuby is that code written in C can't be directly used. The presents a potential problem for libraries, such as the InChI toolkit, that are written in C. Fortunately, the solution is simple. Today's tutorial will demonstrate how InChIs can be both read and written using the C-InChI toolkit via JRuby and the excellent [JNI-InChI library](http://jni-inchi.sourceforge.net/).

# About JNI-InChI

The [JNI-InChI](http://jni-inchi.sourceforge.net/) library, written by Jim Downing and Sam Adams, wraps the [C InChI toolkit](http://www.iupac.org/inchi/) in a Java Native Interface. This low-level toolkit is suitable for building more complex software, but lacks many features present in the C InChI toolkit. For example, JNI-InChI doesn't directly interconvert SMILES or molfile with InChI. For that you'd need to build a support library. If you're building a toolkit from scratch, this lightweight approach can be a significant advantage.

The JNI-InChI binary distribution jarfile includes the compiled native InChI library. In this sense it's virtually indistinguishable from any other Java library. This simplified packaging makes it exceptionally easy to use JNI-InChI from JRuby, as we'll see below.

# Installation

JRuby [can be installed](/articles/2007/10/09/jruby-for-cheminformatics-parsing-smiles-simply) as described previously. To install the JNI-InChI library for JRuby, simply copy the [current release jarfile](http://sourceforge.net/project/showfiles.php?group_id=173262) into the <code>lib</code> directory of your JRuby installation. That's all there is to it.

# A Simple Library

We can now write a simple library to read InChIs via JRuby:

```ruby
require 'java'

include_class 'net.sf.jniinchi.JniInchiInput'
include_class 'net.sf.jniinchi.JniInchiInputInchi'
include_class 'net.sf.jniinchi.JniInchiWrapper'

module IUPAC
  def read_inchi inchi
    input = JniInchiInputInchi.new inchi

    JniInchiWrapper.getStructureFromInchi input
  end
end
```

# Testing the Library

By saving the above library to a file called <strong>iupac.rb</strong>, we can parse InChIs via JRuby:

```bash
jirb
irb(main):001:0> require 'iupac'
=> true
irb(main):002:0> include IUPAC
=> Object
irb(main):003:0> output = read_inchi 'InChI=1/C14H10/c1-3-7-13-11(5-1)9-10-12-6-2-4-8-14(12)13/h1-10H'
=> #<Java::NetSfJniinchi::JniInchiOutputStructure:0x1ed5459 @java_object=net.sf.jniinchi.JniInchiOutputStructure@313170>
irb(main):004:0> output.num_atoms
=> 14
irb(main):005:0> output.num_bonds
=> 16
```

# Writing InChIs

Because JNI-InChI is a low-level toolkit, writing InChIs is feasible, but not trivial. We must first construct a representation, and then get the InChI for it. For example, we could get the InChI for methane as follows:

```bash
jirb
irb(main):001:0> require 'java'
=> true
irb(main):002:0> include_class 'net.sf.jniinchi.JniInchiInput'
=> ["net.sf.jniinchi.JniInchiInput"]
irb(main):003:0> include_class 'net.sf.jniinchi.JniInchiAtom'
=> ["net.sf.jniinchi.JniInchiAtom"]
irb(main):004:0> include_class 'net.sf.jniinchi.JniInchiWrapper'
=> ["net.sf.jniinchi.JniInchiWrapper"]
irb(main):005:0> input = JniInchiInput.new
=> #<Java::NetSfJniinchi::JniInchiInput:0x2f2295 @java_object=net.sf.jniinchi.JniInchiInput@15b0333>
irb(main):006:0> a1 = input.add_atom JniInchiAtom.new(0,0,0, "C")
=> #<Java::NetSfJniinchi::JniInchiAtom:0x1b22920 @java_object=net.sf.jniinchi.JniInchiAtom@2f356f>
irb(main):007:0> a1.set_implicit_h(4)
=> nil
irb(main):008:0> output = JniInchiWrapper.get_inchi input
=> #<Java::NetSfJniinchi::JniInchiOutput:0xf894ce @java_object=net.sf.jniinchi.JniInchiOutput@132ae7>
irb(main):009:0> output.get_inchi
=> "InChI=1/CH4/h1H4"
```

Fortunately, we don't have to work that hard. The [Chemistry Development Kit](http://cdk.sf.net), through JNI-InChI, supports reading and writing of InChIs via a variety of molecular languages, including SMILES and molfile. More on that later, though.

# Conclusions

Provided that a Java Native Interface exists for a C library, it can be used from JRuby. Future articles will discuss the use of other cheminformatics libraries written in either C or C++ from JRuby, and their integration with pure Java and Ruby libraries.
