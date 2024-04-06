---
title: Easily Convert IUPAC Nomenclature to SMILES, InChI, or Molfile with Rubidium
published: "2007-10-19T00:00:00.000Z"
---

A recent article [introduced Rubidium](/articles/2007/10/15/an-introduction-to-the-rubidium-cheminforamtics-toolkit-interconvert-smiles-inchi-and-molfile-with-an-open-babel-like-interface), a cheminformatics toolkit written in Ruby. One of Ruby's strengths is the speed with which it enables disparate pieces of code to be glued together - even if they're written in different programming languages. In this article, we'll see how Rubidium can be extended to provide support for converting IUPAC nomenclature into SMILES, InChI, or Molfile formats.

# About Rubidium

Rubidium is a cheminformatics toolkit written in Ruby. Rubidium is currently configured to run on [JRuby](http://jruby.codehaus.org/), although future versions may also work with [Matz' Ruby Implementation](http://en.wikipedia.org/wiki/Ruby_(programming_language)) (MRI) via [Ruby Java Bridge](http://rjb.rubyforge.org/).

Rubidium will eventually be packaged as a [RubyGem](http://www.rubygems.org/) and hosted on [RubyForge](http://rubyforge.org). For now, the toolkit consists of a running library that will updated and documented on this blog.

# The Library

The library extends the CDK module presented in the [previous article in this series](/articles/2007/10/15/an-introduction-to-the-rubidium-cheminforamtics-toolkit-interconvert-smiles-inchi-and-molfile-with-an-open-babel-like-interface). The main change is the addition of an <code>IUPACReader</code> class, based on Peter Corbett's excellent [OPSIN library](/articles/2007/10/12/jruby-for-cheminformatics-parsing-iupac-nomenclature-with-opsin):

```ruby
class IUPACReader
  import 'java.io.StringReader'
  import 'uk.ac.cam.ch.wwmm.opsin.NameToStructure'
  import 'org.openscience.cdk.io.CMLReader'
  import 'org.openscience.cdk.ChemFile'

  def initialize
    @iupac_reader = NameToStructure.new
    @cml_reader = CMLReader.new
  end

  def read name
    cml = @iupac_reader.parse_to_cml(name)

    raise "Could not parse '#{name}'." unless cml

    @cml_reader.set_reader StringReader.new(cml.to_xml)

    chem_file = @cml_reader.read ChemFile.new

    chem_file.chem_sequence(0).chem_model(0).molecule_set.molecule(0)
  end
end
```

Using this additional functionality requires nothing more than copying the <a href="http://prdownloads.sourceforge.net/oscar3-chem/opsin-big-0.1.0.jar?download">OPSIN jarfile</a> into the <strong>lib</strong> directory of your JRuby installation. You'll also need to place the <a href="http://downloads.sourceforge.net/cdk/cdk-1.0.1.jar?modtime=1182877138&big_mirror=0">CDK jarfile</a> in this directory if you haven't done so already.

The complete Rubidium library can be [downloaded here](/images/posts/20071019/cdk.rb).

# A Test

We can test Rubidium's IUPAC nomenclature parsing abilities with <code>jirb</code>. For example, to convert from name to SMILES:

```bash
jirb
irb(main):001:0> require 'cdk'
=> true
irb(main):002:0> c=CDK::Conversion.new
=> #&lt;CDK::Conversion:0x46ca65 ... &gt;
irb(main):003:0> c.set_formats 'iupac', 'smi'
=> "smi"
irb(main):004:0> c.convert '1,4-dichlorobenzene'
=> "C=1C=C(C=CC=1Cl)Cl"
```

To convert from name to InChI (in the same <code>jirb</code> session):

```bash
irb(main):005:0> c.set_out_format 'inchi'
=> "inchi"
irb(main):006:0> c.convert '1,4-dichlorobenzene'
=> "InChI=1/C6H4Cl2/c7-5-1-2-6(8)4-3-5/h1-4H"
```

And to convert from name to Molfile (also in the same <code>jirb</code> session):

```bash
irb(main):007:0> c.set_out_format 'mol'
=> "mol"
irb(main):008:0> c.convert '1,4-dichlorobenzene'
=> "\n  CDK    10/19/07,7:59\n\n  8  8  0  0  0  0  0  0  0  0999 V2000\n    0.0000    0.0000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    0.0000    0.0000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    0.0000    0.0000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    0.0000    0.0000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    0.0000    0.0000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    0.0000    0.0000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    0.0000    0.0000    0.0000 Cl  0  0  0  0  0  0  0  0  0  0  0  0\n    0.0000    0.0000    0.0000 Cl  0  0  0  0  0  0  0  0  0  0  0  0\n  1  2  2  0  0  0  0 \n  2  3  1  0  0  0  0 \n  3  4  2  0  0  0  0 \n  4  5  1  0  0  0  0 \n  5  6  2  0  0  0  0 \n  6  1  1  0  0  0  0 \n  7  1  1  0  0  0  0 \n  8  4  1  0  0  0  0 \nM  END\n"
```

# Conclusions

By re-using a simple conversion API together with another Java library, we've given Rubidium the ability to translate IUPAC nomenclature into other molecular languages. The additional code was both easy to write and easy to test. Future articles will discuss the packaging, distribution, and further elaboration of Rubidium.