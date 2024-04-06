---
title: "From SMILES to InChI: Rino, CDK, and Ruby Java Bridge"
published: "2006-08-26T00:00:00.000Z"
---

Integrating Ruby and Java is fast and easy with <a href="http://rjb.rubyforge.org/">Ruby Java Bridge</a> (RJB), which was <a href="http://depth-first.com/articles/2006/08/26/scripting-java-libraries-with-ruby-java-bridge">discussed previously</a>. In this article, I'll show how RJB can be used to solve a practical chemical informatics problem - the conversion of SMILES strings into <a href="http://depth-first.com/articles/2006/08/12/inchi-canonicalization-algorithm">InChI</a> identifiers.

# Prerequisites

This tutorial is aimed at Linux users, but you should be able to accomplish the same thing in Windows and Mac OS X, although these systems have not been tested. You'll need to install a few software packages if you haven't done so already: Ruby; Ruby Gems; RJB; CDK; and Rino. After <a href="http://docs.rubygems.org/read/chapter/3">installing RubyGems</a>, RJB and Rino can both be installed from the command line (as root):

```bash
sudo gem install rjb
sudo gem install rino
```

Next, create a working directory, <strong>smi2inchi</strong>. Into this directory, move a copy of the full <a href="http://prdownloads.sourceforge.net/cdk/cdk-20060714.jar?download">CDK-2006714 jarfile</a>. That's it for libraries, so let's move onto the translator itself.

# The Translator

The Translator class consists of a small piece of Ruby code gluing CDK's SmilesParser and MDLWriter with the Ruby InChI library <a href="http://depth-first.com/articles/2006/08/17/ruby-and-inchi-the-rino-library">Rino</a>. Rino is a thin Ruby wrapper around the <a href="http://inchi.sourceforge.net/">IUPAC InChI library</a>, which is in turn written in C.

```ruby
ENV['CLASSPATH'] = './cdk-20060714.jar'

require 'rubygems'
require_gem 'rjb'
require_gem 'rino'
require 'rjb'

StringWriter = Rjb::import 'java.io.StringWriter'

SmilesParser = Rjb::import 'org.openscience.cdk.smiles.SmilesParser'
MDLWriter = Rjb::import 'org.openscience.cdk.io.MDLWriter'

# Converts a SMILES string into an InChI identifier using
# the CDK Library (Java) and the Rino Library (Ruby/C).
class Translator

  def initialize
    @smiles_parser = SmilesParser.new
    @mdl_writer = MDLWriter.new
    @mol2inchi = Rino::MolfileReader.new
  end

  # Returns an InChI identifier from the specified SMILES string.
  # Uses the CDK classes SmilesParser and MDLWriter to generate
  # a molfile from a SMILES string. Then this molfile is
  # parsed by Rino::MolfileReader.
  def translate(smiles)
    mol = @smiles_parser.parseSmiles(smiles)

    sw = StringWriter.new

    @mdl_writer.setWriter(sw)
    @mdl_writer.write(mol)

    @mol2inchi.read(sw.toString)
  end
end
```

Add the above code to a file called <strong>smi2inchi.rb</strong>. The first line points the CLASSPATH environment variable, which is needed by RJB, to the CDK library. Lines 3-6 include the RJB and Rino RubyGems. Lines 8-11 import the built-in Java class StringWriter and the CDK Java classes SmilesParser and MDLWriter using RJB's syntax. The core of the class consists of the <code>translate</code> method, which simply coordinates the pieces.

Using the Translator class consists of creating an instance, and invoking its <code>translate</code> method on a SMILES string:

```ruby
require 'smi2inchi'

translator = Translator.new
inchi = translator.translate 'c1ccccc1'

p inchi # => "InChI=1/C6H6/c1-2-4-6-5-3-1/h1-6H"
```

The above code fragment can be saved to a text file (e.g. <strong>test.rb</strong>) and invoked with the Ruby interpreter:

```bash
ruby test.rb
```

Alternatively, it can be entered interactively with the Interactive Ruby Interpreter (irb):

```bash
irb
irb(main):001:0>
```

With just a few lines of Ruby, we've solved a real problem. This example integrates software from three different programming languages: Ruby, C, and Java. Given the variety of chemical informatics software written in these languages, Ruby Java Bridge offers numerous integration possibilities.