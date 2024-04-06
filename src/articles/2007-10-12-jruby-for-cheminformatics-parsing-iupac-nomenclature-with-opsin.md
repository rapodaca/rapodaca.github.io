---
title: JRuby for Cheminformatics - Parsing IUPAC Nomenclature with OPSIN
published: "2007-10-12T00:00:00.000Z"
---

Recent articles have discussed the use of [JRuby for cheminformatics](/articles/tag/rubidium). We've seen how to [parse SMILES strings](/articles/2007/10/09/jruby-for-cheminformatics-parsing-smiles-simply), and [read or write InChIs](/articles/2007/10/10/jruby-for-cheminformatics-reading-and-writing-inchis-via-the-java-native-interface). In this article, we'll see how easy it is to parse IUPAC nomenclature from JRuby using Peter Corbett's [OPSIN library](/articles/2006/10/14/decoding-iupac-names-with-opsin).

# Installation

After [installing JRuby](/articles/2007/10/09/jruby-for-cheminformatics-parsing-smiles-simply), simply [download the OPSIN jarfile](http://prdownloads.sourceforge.net/oscar3-chem/opsin-big-0.1.0.jar?download) and copy it to your JRuby `lib` directory. You're done.

# A Simple Library

We can write a simple library to convert an IUPAC name into a CML document:

```ruby
require 'jruby'

import 'uk.ac.cam.ch.wwmm.opsin.NameToStructure'

module IUPAC
  @@nts = NameToStructure.new

  def read_name name
    cml = @@nts.parse_to_cml(name)

    raise "Could not parse '#{name}'." unless cml

    cml.to_xml
  end
end
```

The `read_name` method accepts an iupac name as a string and returns a CML document as a string. If the input can't be parsed, an exception is raised.

# Testing the Library

We can test the library by saving it as a file called <strong>iupac.rb</strong> and invoking `jirb`:

```bash
$ jirb
irb(main):001:0> require 'iupac'
=> true
irb(main):002:0> include IUPAC
=> Object
irb(main):003:0> read_name('4-iodobenzoic acid')
```

This returns the XML shown below, which has been re-formatted for clarity:

```xml
<cml xmlns="http://www.xml-cml.org/schema">
  <molecule id="m1">
    <atomArray>
      <atom id="a1" elementType="C">
        <label value="1" />
      </atom>
      <atom id="a2" elementType="C">
        <label value="2" />
      </atom>
      <atom id="a3" elementType="C">
        <label value="3" />
      </atom>
      <atom id="a4" elementType="C">
        <label value="4" />
      </atom>
      <atom id="a5" elementType="C">
        <label value="5" />
      </atom>
      <atom id="a6" elementType="C">
        <label value="6" />
      </atom>
      <atom id="a7" elementType="C" />
      <atom id="a8" elementType="O" />
      <atom id="a9" elementType="O" />
      <atom id="a10" elementType="I">
        <label value="1" />
      </atom>
    </atomArray>
    <bondArray>
      <bond atomRefs2="a1 a2" order="2" />
      <bond atomRefs2="a2 a3" order="1" />
      <bond atomRefs2="a3 a4" order="2" />
      <bond atomRefs2="a4 a5" order="1" />
      <bond atomRefs2="a5 a6" order="2" />
      <bond atomRefs2="a6 a1" order="1" />
      <bond atomRefs2="a7 a1" order="1" />
      <bond atomRefs2="a7 a8" order="2" />
      <bond atomRefs2="a7 a9" order="1" />
      <bond atomRefs2="a10 a4" order="1" />
    </bondArray>
  </molecule>
</cml>
```

This simple Ruby library has parsed the name '4-iodobenzoic acid' and has returned a string containing the CML representation for the molecule. If we had wanted the `read_name` method to return a traversable XML object model, we could have enabled that as well.

# Conclusions

One of the objections raised whenever the issue of "new" programming languages comes up, regardless of their merit, is the age-old refrain "Yeah, but where's the software?" With JRuby, we bypass this question altogether. We can leverage the full scope of the massive Java development effort over the last ten years, which includes several excellent cheminformatics libraries. With virtually no effort, we have a working cheminformatics platform based on a widely-used, versatile and dynamic object-oriented scripting language. Future articles will discuss extensions to this platform and some applications.