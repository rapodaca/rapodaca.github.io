---
title: "CDK, the Ruby Way"
published: "2006-09-14T00:00:00.000Z"
---

<a href="http://depth-first.com/articles/2006/09/11/visualizing-iupac-names-with-chemnomparse">Previous articles</a> have discussed how the <a href="http://cdk.sf.net">Chemistry Development Kit</a> (CDK) can interface with Ruby using the <a href="http://depth-first.com/articles/2006/08/26/scripting-java-libraries-with-ruby-java-bridge">Ruby Java Bridge</a> (RJB). However, each of these articles included a repetitive setup in which the CDK jarfile needed to be copied and the `CLASSPATH` variable needed to be set. In writing, as in programming, <a href="http://en.wikipedia.org/wiki/Don't_repeat_yourself">repeating yourself</a> is a sure sign that something needs to be refactored.

My solution is the <a href="http://rubyforge.org/projects/rcdk">Ruby Chemistry Development Kit</a> (RCDK), a lightweight Ruby wrapper around the CDK. RCDK hides the boring details of interfacing CDK with Ruby, letting you get on to the more interesting things like doing a quick descriptor calculation, running a test, interfacing CDK with C/C++ or Ruby libraries, or building your <a href="http://www.rubyonrails.org/">Ruby on Rails</a> CDK application.

RCDK is available as a <a href="http://www.rubygems.org/">RubyGem</a>. One of the advantages of RubyGems compared to jarfiles is that the system automatically manages dependencies. For example, RCDK depends on RJB. If you haven't yet installed RJB, this will be taken care of for you as you install RCDK with the following command (run as root):

```bash
sudo gem install rcdk
```

During the interactive session that follows, you'll be asked which version of RJB should be installed. There are currently two Windows versions and two unix versions. Be prepared for a bit of a wait as the 10 Mb RCDK Gem installs itself.

After installing the RCDK RubyGem, there is one additional step you'll need to take. Update your bash profile or equivalent to point to your system's native Java libraries. On Linux with Sun's JDK, this consists of adding the following to `.bash_profile`, usually in your home directory:

```bash
export LD_LIBRARY_PATH=$JAVA_HOME/jre/lib/i386:$LD_LIBRARY_PATH
```

This step is needed due to the way that RJB is currently implemented. If `$JAVA_HOME` was not already set, it should point to your system's Java installation. Future versions of RJB may find a way to avoid this manual configuration step.

After RCDK has been installed and your `LD_LIBRARY_PATH` has been set, using RCDK is straightforward (notice the shortened `import` statement):

```ruby
require 'rubygems'
require_gem 'rcdk'

SmilesParser = import 'org.openscience.cdk.smiles.SmilesParser'

parser = SmilesParser.new
smiles = 'c1ccccc1'
mol = parser.parseSmiles(smiles)

puts mol.getAtomCount # =>6
```

A local jarfile (say, foo-0.1.1.jar) can be added to your classpath with the following:

```ruby
Java::Classpath.add('foo-0.1.1.jar')
```

This approach to using the CDK has the added advantage that a Ruby-specific convenience layer could be introduced in a transparent way. For example, a very common chemical informatics task is to interconvert molfiles and SMILES strings. In the future, RCDK may introduce methods that will do these kinds of common tasks automatically, without the need to refer to CDK classes.

I don't know of <a href="http://www.ruby-forum.com/topic/81021#new">any other attempts</a> to package Java jarfiles as RubyGems for use with the C implementation of Ruby. It's a very simple approach that may be applicable to other Java libraries, especially as more Java programmers turn to Ruby. I have tested RCDK on Mandriva Linux 2006. Other operating systems may have their own configuration issues.

RCDK offers many opportunities to experiment with chemical informatics and Ruby, and Ruby-Java integration. Future articles will discuss some of the possibilities.