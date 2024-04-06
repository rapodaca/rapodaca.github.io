---
title: JRuby for Cheminformatics - Parsing SMILES Simply
published: "2007-10-09T00:00:00.000Z"
---

The previous article in this series outlined some [reasons to consider JRuby for cheminformatics](/articles/2007/10/08/five-reasons-to-start-using-jruby-now). Now I'll show how easy it is to get started by describing how to parse SMILES strings with the help of the [Chemistry Development Kit](http://cdk.sf.net) (CDK).

# What About Ruby CDK?

A number of Depth-First articles have discussed [Ruby CDK](/articles/2007/10/04/ruby-cdk-for-newbies). This library runs on top of C-Ruby, otherwise known as Matz' Ruby Implementation (MRI). [Ruby Java Bridge](http://rjb.rubyforge.org/) connects MRI to a Java Virtual Machine under Ruby CDK.

This article, and the others to follow, will instead discuss the use of the CDK and other Java libraries from JRuby. In contrast to MRI, JRuby is a pure Java implementation of the Ruby language. This approach offers some important advantages which will be highlighted along the way.

# Installing JRuby

JRuby is not difficult to install. On Linux, the steps are:

1.  Install [JDK Version 1.4 or higher](http://java.sun.com).
2.  Download and unpack the most recent JRuby release - at the time of this writing, [version 1.0.1](http://dist.codehaus.org/jruby).
3.  Add the JRuby `bin` directory to your path.
4.  There is no Step 4. ;-)

# Installing CDK for JRuby

Installing CDK so that it works on JRuby is similarly quite simple:

1.  Download the most recent CDK jarfile - at the time of this writing, [version 1.0.1](http://downloads.sourceforge.net/cdk/cdk-1.0.1.jar?modtime=1182877138&big_mirror=0).
2.  Move the CDK jarfile to your JRuby `lib` directory.

# Testing CDK for JRuby

You can verify that your new CDK for JRuby installation works with `jirb`:

```bash
jirb
irb(main):001:0> require 'java'
=> true
irb(main):002:0> include_class 'org.openscience.cdk.smiles.SmilesParser'
=> ["org.openscience.cdk.smiles.SmilesParser"]
```

You should notice that `jirb` takes a few seconds to initialize the JVM, whereas `irb` starts almost instantly.

# A Library to Read SMILES

We can write a short library to read SMILES strings using the CDK:

```ruby
require 'java'
include_class 'org.openscience.cdk.smiles.SmilesParser'

module Daylight
  @@smiles_parser = SmilesParser.new

  def read_smiles smiles
    @@smiles_parser.parse_smiles smiles
  end
end
```

Notice the use of the Rubyesque method name `parse_smiles` rather than `parseSmiles`. This is just one of the built-in conveniences offered by JRuby.

# Testing the Library

Saving the library as a file called <strong>daylight.rb</strong> lets us test it using interactive JRuby:

```bash
jirb
irb(main):001:0> require 'daylight'
=> true
irb(main):002:0> include Daylight
=> Object
irb(main):003:0> mol = read_smiles 'c1ccccc1'
=> #<Java::OrgOpenscienceCdk:: [truncated] ...>
irb(main):004:0> mol.atom_count
=> 6
```

As you can see, the benzene SMILES has been parsed correctly. Again, notice the use of the Rubyesque method name `atom_count`, rather than the CDK Java bean convention method name `getAtomCount`. This feature makes it easy to ignore the fact you're using a Java library and get on with writing your Ruby code. Brilliant!

# Conclusions

This article has shown how to install JRuby and begin to write some simple cheminformatics programs with a distinctive Ruby flavor. Although the focus was on SMILES parsing, there's much more functionality to be found within the CDK and other cheminformatics libraries written in Java. Future articles will outline some of the possibilities.