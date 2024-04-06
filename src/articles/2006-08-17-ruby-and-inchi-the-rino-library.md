---
title: "Ruby and InChI: The Rino Library"
published: "2006-08-17T00:00:00.000Z"
---

Rino is a Ruby library for generating InChI identifiers. Currently, molfile input is supported. The following code illustrates basic usage.

```ruby
reader = Rino::MolfileReader.new
inchi = reader.read(IO.Read('some_molfile.mol'))

puts "The identifier is: #{inchi}"
```

Rino was implemented as an extension of the <a href="http://www.iupac.org/inchi/">IUPAC InChI library</a>, which is written in C. To keep the extension as simple as possible, Rino's point of entry into the IUPAC library is the inchi_main main method. File input is provided with temporary files that are deleted when a MolfileReader is garbage collected. This has the advantage that all options available to the IUPAC InChI console application are also available from within Rino. For example, activating compressed InChI output can be done by simply appending the option to a MolfileReader's options array.

```ruby
reader.options << '-Compress'
```

Rino is available as both a Ruby Gem and as a source package from <a href="http://rubyforge.org/projects/rino">RubyForge</a>. If you're new to Ruby, the RubyGems package is recommended. After <a href="http://docs.rubygems.org/read/chapter/3">installing RubyGems</a>, Rino can be installed with the following shell command (executed as root):

```bash
sudo gem install rino
```

To load Rino, simply execute the following code prior to creating a MolfileReader.

```ruby
require 'rubygems'
require_gem 'rino'
```

The use of the <a href="http://www.chemruby.org">Chemruby</a> library in combination with Rino offers some interesting possibilites for chemical infomatics with Ruby.