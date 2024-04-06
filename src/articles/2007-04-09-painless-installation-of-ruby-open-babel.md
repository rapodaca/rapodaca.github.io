---
title: Painless Installation of Ruby Open Babel
published: "2007-04-09T00:00:00.000Z"
---

[Open Babel](http://openbabel.sf.net) 2.1.0 has just been [released](http://downloads.sourceforge.net/openbabel/openbabel-2.1.0.tar.gz?modtime=1175958364&big_mirror=0). Among its new features is a Ruby interface containing most of the functionality of the C++ library. Installation is quick and easy, as shown in this article.

# Prerequisites

In addition to a working build system, you'll need [Ruby](http://www.ruby-lang.org/en/) and the Ruby development libraries. Although any recent version should do, this tutorial was written with version 1.8.5.

# Step 0: Compile and Install Open Babel

Given the right tools on your system, compiling and and installing Open Babel from source is trivial. [This page](http://openbabel.sourceforge.net/wiki/Get_Open_Babel) gives instructions for doing so on Linux, Windows, and Mac OS X.

# Step 1: Create the Wrapper's Makefile

After unpacking, compiling, and installing Open Babel, change into the **scripts/ruby** directory of your source distribution. Next, run the **extconf.rb** script:

```bash
ruby extconf.rb
checking for main() in -lopenbabel... yes
creating Makefile
```

As you've probably guessed, the purpose of this script is to generate a Makefile specific to your platform. This script uses the standard Ruby library [mkmf](http://www.ruby-doc.org/stdlib/libdoc/mkmf/rdoc/index.html).

# Step 2: Compile the Wrapper

After creating a Makefile, we're ready to compile the C++ Ruby wrapper, contained in **openbabel_ruby.cpp**:

```bash
make
g++ -I. -I. -I/usr/lib/ruby/1.8/x86_64-linux-gnu -I. -I../../include  -fPIC -O2 -g -pipe -Wp,-D_FORTIFY_SOURCE=2 -fexceptions -Wall  -fPIC   -c openbabel_ruby.cpp
```

This output will be followed by other lines as the compiler builds the wrapper library.

# Step 3: Install the Wrapper

After compiling the wrapper, we're ready to install it. You can probably guess that the next command will be (as root):

```bash
make install
/usr/bin/install -c -m 0755 openbabel.so /usr/lib/ruby/site_ruby/1.8/x86_64-linux-gnu
```

Your install directory is chosen by Ruby to be appropriate for your platform and Ruby version.

# Hello, Benzene!

Congratulations, you've installed Ruby Open Babel! You can verify that your new library works with interactive Ruby (irb):

```bash
irb
irb(main):001:0> require 'openbabel'
=> true
irb(main):002:0> c=OpenBabel::OBConversion.new
=> #&lt;OpenBabel::OBConversion:0x2acedbadd020&gt;
irb(main):003:0> c.set_in_format 'smi'
=> true
irb(main):004:0> benzene=OpenBabel::OBMol.new
=> #&lt;OpenBabel::OBMol:0x2acedbacfa10&gt;
irb(main):005:0> c.read_string benzene, 'c1ccccc1'
=> true
irb(main):006:0> benzene.num_atoms
=> 6
```

