---
title: "CDK, the Ruby Way: RCDK-0.2.0"
published: "2006-09-25T00:00:00.000Z"
---

<a href="http://rubyforge.org/projects/rcdk/">Ruby Chemistry Development Kit</a> (RCDK) version 0.2.0 is <a href="http://rubyforge.org/frs/?group_id=2199">now available</a>. This version adds built-in support for <a href="http://depth-first.com/articles/2006/08/28/drawing-2-d-structures-with-structure-cdk">Structure-CDK</a>, a 2-D rendering framework. Simplifying the use of this library is a convenience layer enabling many common tasks to be accomplished with a single line of Ruby code.

Installing RCDK-0.2.0 is simple. From the command line (as root):

```bash
sudo gem install rcdk
```

Be prepared for a bit of a wait as the large RCDK RubyGem downloads and is installed.

If RCDK-0.1.0 is already installed on your system, version 0.2.0 can peacefully co-exist with it. Ruby will automatically load the most recent version of RCDK, and you can dynamically load the earlier version in your own code. If you'd like to uninstall RCDK-0.1.0 anyway, use the following (also as root):

```bash
sudo gem uninstall rcdk
```

Follow the menu to uninstall RCDK-0.1.0 and you're done.

If you haven't done so already, there is one bit of additional configuration. You'll need to update your <code>LD_LIBRARY_PATH</code> to point to the location of your system's native Java libraries. On Linux with Sun's JDK, this can be done with the following:

```bash
export LD_LIBRARY_PATH=$JAVA_HOME/jre/lib/i386:$LD_LIBRARY_PATH
```

This assumes the <code>JAVA_HOME</code> was already set. If not, it will need to point to your systems Java installation directory.

The whole process can be automated by including the above line at the end of your `.bash_profile` file (or equivalent).

As a simple demonstration, let's say you'd like to depict the 2-D structure encoded by a SMILES string as a 200x200 pixel PNG image. With RCDK-0.2.0, this can be done with the following Ruby code (which can be entered interactively via <code>irb</code>):

```ruby
require 'rubygems'
require_gem 'rcdk'
require 'util'

smiles = 'Oc1ccccc1' #phenol
RCDK::Util::Image.smiles_to_png(smiles, 'phenol.png', 200, 200)
```

This code creates `phenol.png` in your current directory:

Of course, there's much more to RCDK than just SMILES depiction. Future articles will describe some of the many possibilities.