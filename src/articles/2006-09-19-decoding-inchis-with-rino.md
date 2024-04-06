---
title: "Decoding InChIs with Rino"
published: "2006-09-19T00:00:00.000Z"
---

<a href="http://wwmm.ch.cam.ac.uk/inchifaq/">InChI identifiers</a> are unique, ASCII-based molecular identifiers well-suited for chemical informatics on the Web. But they are also much more than that. Encoded in every InChI is all of the information needed to reconstruct a valid, machine-readable molecular representation. This tutorial shows how Open Source tools can be used to construct a molfile representation from an InChI identifier with the help of new features in the <a href="http://depth-first.com/articles/2006/08/17/ruby-and-inchi-the-rino-library">Rino</a> toolkit for Ruby. The ability of Rino to <a href="http://depth-first.com/articles/2006/08/17/ruby-and-inchi-the-rino-library">produce InChI identifiers</a> from molfile input has already been discussed.

# Credits

What follows was in part inspired by <a href="http://sourceforge.net/mailarchive/forum.php?thread_id=30378782&amp;forum_id=45166">helpful comments</a> posted by Sam Adams, author of the <a href="http://sourceforge.net/projects/jni-inchi">JNI InChI Wrapper</a>, and Dmitrii Tchekhovskoi, co-author of the InChI software.

# A Demo with cInChI

The newest release of the IUPAC <a href="http://www.iupac.org/inchi/">InChI-API</a> toolkit can now translate an InChI identifier into a molfile. This consists of a two-step process:

- Convert a simple InChI into a full InChI with Auxiliary Information (AuxInfo).
- Convert the full InChI into a molfile.

You can get a feel for how this process works by using the cInChI command-line program. Create a file called `test.txt` containing the following InChI (for benzene):

`InChI=1/C6H6/c1-2-4-6-5-3-1/h1-6H`

Now, run cInChI:

```bash
touch temp.txt
./cInChI-1 test.txt temp.txt -InChI2Struct
```

The first line creates an empty temporary file, `temp.txt`. Into this file is written the full InChI as output. The <code>-InChI2Struct</code> parameter tells InChI to generate an InChI with Auxiliary Information.

Now, create an empty file, `benzene.mol` and run cInChI with the `-OutputSDF` option:

```bash
touch benzene.mol
./cInChI-1 temp.txt benzene.mol -OutputSDF
```

If everything worked, you should now have a molfile called `benzene.mol`, describing benzene, in your working directory. All atom coordinates will be zero, because coordinate generation is outside the scope of the InChI project. This has important implications or stereochemistry (see below). Of course, <a href="http://depth-first.com/articles/2006/09/02/humanizing-line-notations">other free libraries</a> can generate aesthetically-pleasing 2-D molecular coordinates.

# Hello, Rino

<a href="http://rubyforge.org/projects/rino">Rino</a> is a thin Ruby wrapper around the InChI-API toolkit, which is written in C. An <a href="http://depth-first.com/articles/2006/09/16/taking-a-swig-of-inchi">earlier article</a> described the use of the automatic wrapper generator <a href="http://www.swig.org/">SWIG</a> to write the C glue code that Rino interfaces with. The current version of Rino (v0.2.0) uses this approach to Ruby interface generation.

The current version of Rino can conveniently be installed by executing the following (as root):

```bash
sudo gem install rino
```

Earlier today, I got "404 Not Found" errors for this command, but not recently. The source is not clear, but seems to occur within the 24 hours after the Gem is uploaded. If you run into problems, the Rino RubyGem can also be <a href="http://rubyforge.org/frs/download.php/13261/rino-0.2.0.gem">downloaded</a> and installed locally.

If you've already installed Rino-0.1.0, the new version can happily cohabitate with it. <a href="http://www.rubygems.org/">RubyGems</a> by default installs the most recent version of Rino unless you specify otherwise. If you'd like to uninstall Rino-0.1.0 do the following (as root):


```bash
sudo gem uninstall rino
```

You should get a menu of Rino version to uninstall.

# A Ruby Demo

The following Ruby code demonstrates the use of Rino to translate an InChI identifier into a molfile:

```ruby
require 'rubygems'
require_gem 'rino'

inchi = 'InChI=1/C6H6/c1-2-4-6-5-3-1/h1-6H' # benzene
reader = Rino::InChIReader.new
molfile = reader.read(inchi)

p molfile # => prints the molfile for benzene
```

If you'd like even more control, you can directly access the InChI <code>run</code> method, which provides all of the capabilities of running cInChI from the command line:

```ruby
require 'rubygems'
require_gem 'rino'

input = 'input.txt'   # a valid file in your working dir
output = 'output.txt' # also a valid file

Rino::InChI.run(['', input, output])
```

# Limitations

The InChI->molfile implementation in the InChI-API toolkit does not reproduce stereochemical information. For example, passing an InChI of a molecule containing a single tetrahedral stereocenter results in a molfile lacking stereo parities. Further, an explicit hydrogen atom is added to the sterogenic atom in the molfile output. Being based entirely on the InChI-API, Rino inherits these behaviors.

Rino is based on a very simple interface into InChI's <code>main</code> method. This has the advantage that anything that can be done with the cInChI command line application can also be done with Rino. It carries the disadvantage that the convenience classes <code>InChIReader</code> and <code>MolfileReader</code> use a less than elegant system of temporary disk files for input-output. Future versions of Rino should address this issue, a task that may be simplified by SWIG.

# Other InChI Parsers

To my knowledge, three Open Source InChI parsers, besides the InChI-API and Rino, exist. They are:

- <a href="http://sourceforge.net/projects/ninja">Ninja</a>. A Java library that performs low-level InChI parsing, and is designed as a platform for more sophisticated parsers. While it does not create molfiles from InChIs, it can be used as a foundation for software that does. Ninja is used in the molecular language framework, <a href="http://sf.net/projects/rxf">Rosetta</a>, although this work is far from complete.
- <a href="http://bkchem.zirael.org/">BKChem</a>. Beda Kosata's 2-D structure editor, which is written in Python. The similarities between Ruby and Python make this codebase a potentially useful starting point for a pure Ruby InChI parser.
- <a href="http://sourceforge.net/projects/jni-inchi">JNI InChI Wrapper</a>. Also a wrapper for the InChI-API. When used in combination with the <a href="http://cdk.sf.net">Chemistry Development Kit</a>, this package <a href="http://sourceforge.net/mailarchive/forum.php?thread_id=30378782&amp;forum_id=45166">has been reported</a> to produce molfiles from InChI identifiers.


More information on InChI software capabilities can be found at Beda Kosata's <a href="http://inchi.info/software_en.html">InChI info</a> site.

# Wrapping Up

The translation of InChI identifiers into other molecular representation systems will become more important as InChI gains traction. Mashups involving InChI translation offer many tantalizing opportunities for innovative chemical informatics applications. Future articles will discuss some of them.