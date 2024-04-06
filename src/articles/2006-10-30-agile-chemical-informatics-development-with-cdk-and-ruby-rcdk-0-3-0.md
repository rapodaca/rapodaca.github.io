---
title: "Agile Chemical Informatics Development with CDK and Ruby: RCDK-0.3.0"
published: "2006-10-30T00:00:00.000Z"
---

Ruby Chemistry Development Kit (RCDK) version 0.3.0 is now available from RubyForge. <a href="http://depth-first.com/articles/2006/09/25/cdk-the-ruby-way-rcdk-0-2-0">RCDK</a> enables the complete CDK API to be accessed from Ruby. This release adds support for <a href="http://depth-first.com/articles/2006/10/17/from-iupac-nomenclature-to-2-d-structures-with-opsin">IUPAC nomenclature translation</a>  and <a href="http://depth-first.com/articles/2006/10/24/metaprogramming-with-ruby-mapping-java-packages-onto-ruby-modules">tighter Java integration</a>.

# Dependencies

RCDK requires Ruby, the Ruby developer libraries, a working build toolchain, and <a href="http://rjb.rubyforge.org">Ruby Java Bridge</a> (RJB). This latter dependency can be satisfied during the RCDK installation process if the RubyGems method is used (see 'Installation').

# Installation

RCDK can be conveniently installed using the <a href="http://rubygems.org/">RubyGems</a> packaging mechanism:

```bash
sudo gem install rcdk
```

Alternatively, the source package and RubyGem can be downloaded <a href="http://rubyforge.org/frs/?group_id=2199">here</a>.

# Tighter Java Integration

RCDK-0.3.0 introduces a previously-described <a href="http://depth-first.com/articles/2006/10/24/metaprogramming-with-ruby-mapping-java-packages-onto-ruby-modules">Java package to Ruby module mapping mechanism</a>. For example, if you'd like to create a Java <code>ArrayList</code>, it can be done through the new <code>jrequire</code> command:

```ruby
require 'rubygems'
require_gem 'rcdk'
jrequire 'java.util.ArrayList'

list = Java::Util::ArrayList.new

list.size # => 0
```

# IUPAC Nomenclature Translation

RCDK's most important new chemical informatics feature is made possible by <a href="http://wwmm.ch.cam.ac.uk/blogs/corbett/">Peter Corbett's</a> excellent IUPAC nomenclature translation library <a href="http://depth-first.com/articles/2006/10/17/from-iupac-nomenclature-to-2-d-structures-with-opsin">OPSIN</a>. It can either be used directly with <code>jrequire</code>, or indirectly through RCDK's convenience library <code>RCDK::Util</code>:

```ruby
require 'rubygems'
require_gem 'rcdk'
require 'rcdk/util'

mol = RCDK::Util::Lang.read_iupac 'quinoline'
mol.getAtomCount # => 10
```

There are two things to notice here. First, no <code>jrequire</code> statement is needed when using the <code>RCDK::Util</code> library. Second, there is a multisecond delay after <code>read_iupac</code> is invoked. OPSIN itself introduces this delay during the <code>NameToStructure</code> constructor call, and RCDK inherits this behavior. However, after the first invocation of <code>read_iupac</code>, subsequent calls to this method are very fast.

Let's decorate the quinoline nucleus with some substituents and render a 2-D image of the result. Execute the following code, either through the Ruby interpreter (<code>ruby</code>) or through Interactive Ruby (<code>irb</code>):

```ruby
require 'rubygems'
require_gem 'rcdk'
require 'rcdk/util'

RCDK::Util::Image.iupac_to_png('3-chloro-4-(2-aminopropyl)-6-mercapto-8-(2-hydroxyphenyl)-quinoline-2-carboxylic acid', 'test.png', 300, 300)
```

Running this code produces the following image in your working directory:

![Test](/images/posts/20061030/test.png)

# Be Agile

RCDK marries the <a href="http://www.martinfowler.com/articles/newMethodology.html">agility</a> of the Ruby language with the functionality of three Open Source chemical informatics libraries: <a href="http://cdk.sf.net">CDK</a>; <a href="http://depth-first.com/articles/2006/10/14/decoding-iupac-names-with-opsin">OPSIN</a>; and <a href="http://depth-first.com/articles/2006/08/28/drawing-2-d-structures-with-structure-cdk">Structure-CDK</a>. Future articles will discuss some simple applications of this powerful combination.