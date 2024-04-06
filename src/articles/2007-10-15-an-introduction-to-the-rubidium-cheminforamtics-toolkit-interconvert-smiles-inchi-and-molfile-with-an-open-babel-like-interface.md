---
title: An Introduction to the Rubidium Cheminforamtics Toolkit - Interconvert SMILES, InChI, and Molfile with an Open Babel-Like Interface
published: "2007-10-15T00:00:00.000Z"
---

Interconverting molecular languages is a very common operation in cheminformatics, so convenient conversion tools are desirable. Recent articles have discussed JRuby as a [functional cheminformatics scripting environement](http://depth-first.com/articles/tag/ruby). In this article, we'll see how this functionality can be combined with convenience for molecular language conversions.

In addition to illustrating a technique, this article is the first in a series aimed at documenting a new cheminformatics toolkit for Ruby called "Rubidium". Rubidium will provide a unified set of Ruby APIs for working with diverse Open Source cheminformatics tools.

Rubidium will be distributed under the highly permissive [MIT License](http://www.opensource.org/licenses/mit-license.php).

# Prerequisites

This Rubidium library requires [JRuby](http://jruby.codehaus.org/) and the [Chemistry Development Kit](http://cdk.sf.net) (CDK). Copying the [CDK jarfile](http://downloads.sourceforge.net/cdk/cdk-1.0.1.jar?modtime=1182877138&big_mirror=0) into your JRuby <code>lib</code> directory is all that's needed.

# The Library

The goal of this library is to provide a simple, yet flexible way to interconvert SMILES, InChI, and molfile formats. It was inspired the [Open Babel](http://openbabel.sf.net) library, in which an <code>OBConversion</code> object is configured with input and output formats prior to performing one or more conversions. In today's library, a similar Ruby interface is created for the CDK. Because of it's length, it won't be presented in its entirety. Instead, it can be [downloaded here](/images/posts/20071015/cdk.rb).

# Testing the Library

The library can be tested by saving it as a file called **cdk.rb** and invoking <code>jirb</code>. We can then convert a SMILES for benzene into the InChI for benzene:

```bash
jirb
irb(main):001:0> require 'cdk'
=> true
irb(main):002:0> c=CDK::Conversion.new
=> #&lt;CDK::Conversion:0x4c6320 ... &gt;
irb(main):003:0> c.set_formats 'smi', 'inchi'
=> "inchi"
irb(main):004:0> c.convert 'c1ccccc1'
=> "InChI=1/C6H6/c1-2-4-6-5-3-1/h1-6H"
```

Upcoming articles will show more examples of interconversions using this library, and discuss some of its limitations.

# An Aside

It might be useful for Rubidium to support multiple <code>Conversions</code>, each using its own cheminformatics toolkit. For example, a recent article discussed [SMILES and InChI interconversion with Ruby Open Babel](http://depth-first.com/articles/2007/06/25/interconvert-almost-any-smiles-and-inchi-with-ruby-open-babel). With a little tweaking, the Ruby Open Babel <code>OBConversion</code> interface could be make identical to the Ruby interface used in today's tutorial. We could also configure [JOELib](http://joelib.sf.net) and [Rosetta](http://sf.net/projects/rosetta) <code>Conversions</code> in an analogous fashion.

Rubidium would then offer a family of molecular language converters, each of which used exactly the same API. We could then pick the best converter based on the situation at hand.

# Conclusions

With just a little Ruby code, we've created a convenient Ruby interface for interconverting SMILES, InChI, and molfile formats. JRuby supports even more interconversions through the CDK as well as other Java and Java Native Interface libraries. Future articles will discuss some of the possibilities.