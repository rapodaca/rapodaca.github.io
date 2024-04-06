---
title: Parsing SD Files with Ruby and Rubidium
published: "2007-11-12T00:00:00.000Z"
---

Reading SD files is a bread-and-butter cheminformatics operation. At a minimum, a cheminformatics toolkit needs to parse the individual entries of an SD file, and provide access to the embedded molfile and data hash for each.

Recent articles have introduced [Rubidium](http://rbtk.rubyforge.org), a Ruby cheminformatics scripting environment. The Rubidium team now announces the release of [Rubidium-0.1.1](http://rubyforge.org/frs/?group_id=4671), which, among other features, introduces the ability to parse SD files.

# Prerequisites

Rubidium is designed to run on [JRuby](http://jruby.codehaus.org/). Installing JRuby is straightforward on unix-like systems. First, download the [JRuby-1.1b1 binary release](http://dist.codehaus.org/jruby/jruby-bin-1.1b1.tar.gz). Then, unpack the archive to your directory of choice. Set `$JRUBY\_HOME` and `$JAVA\_HOME`. Finally, add `$JRUBY_HOME/bin` to your path.

# Installing Rubidium-0.1.1

Generally speaking, it should be possible to install Rubidium with a one-line command to RubyGems:

```bash
jruby -S gem install rbtk
```

Unfortunately at the time of this writing, I was receiving the mysterious [RubyGems 404 error](http://www.google.com/search?q=rubygems+%22ERROR:++While+executing+gem+...+OpenURI::HTTPError%22&hl=en&pwst=1&start=0&sa=N) with the RubyForge remote repository:

```bash
jruby -S gem install rbtk
Select which gem to install for your platform (java)
 1. rbtk 0.1.1 (java)
 2. rbtk 0.1.0 (java)
 3. Skip this gem
 4. Cancel installation
> 1
ERROR:  While executing gem ... (OpenURI::HTTPError)
    404 Not Found
```

This appears to affect only certain RubyGems on RubyForge - possibly only those with multiple versions. It seems to be an error on the RubyForge server that occasionally appears and then disappears.

As a workaround, you can [download the Rubidium gem](http://rubyforge.org/frs/download.php/27819/rbtk-0.1.1-jruby.gem) and install it manually:

```bash
$ jruby -S gem install tmp/rbtk-0.1.1-jruby.gem
```

Because Rubidium-0.1.1 introduces an [Active Support](http://rubyforge.org/projects/activesupport/) dependency, you will need to install that library before installing Rubidium:

```bash
jruby -S gem install tmp/rbtk-0.1.1-jruby.gem
ERROR:  While executing gem ... (RuntimeError)
    Error instaling tmp/rbtk-0.1.1-jruby.gem:
        rbtk requires activesupport >= 1.4.2
$ jruby -S gem install activesupport
Successfully installed activesupport-1.4.4
Installing ri documentation for activesupport-1.4.4...
Installing RDoc documentation for activesupport-1.4.4...
$ jruby -S gem install tmp/rbtk-0.1.1-jruby.gem
Successfully installed rbtk, version 0.1.1
Installing ri documentation for rbtk-0.1.1-jruby...
Installing RDoc documentation for rbtk-0.1.1-jruby...
```

It's possible that the RubyForge 404 issue will be resolved by the time you read this article, so `jruby -S gem install rbtk` should be tried first.

# Parsing an SD File

Let's say we'd like to extract all InChIs from a PubChem dataset. If you don't have one handy, a compilation of about 2000 PubChem benzodiazepines has been [deposited on RubyForge](http://rubyforge.org/frs/download.php/27768/pubchem_benzodiazepine_20071110.sdf.gz).

With our unzipped datafile in our working directory, we can now test the SD File parser by saving the following library to a file called **parse.rb**:

```ruby
require 'rubygems'
gem 'rbtk'
require 'rubidium/sdf'

def parse_sd filename
  p = Rubidium::SDF::Parser.new File.new(filename)

  p.each do |entry|
    puts "InChI: #{entry['PUBCHEM_NIST_INCHI']}"
  end
end
```

which can be tested with `jirb`:

```bash
jirb
irb(main):001:0> require 'parse'
=> true
irb(main):002:0> parse_sd 'pubchem_benzodiazepine_20071110.sdf'
InChI: InChI=1/C16H12Cl2N2O/c1-20-14-7-6-12(18)8-13(14)16(19-9-15(20)21)10-2-4-11(17)5-3-10/h2-8H,9H2,1H3

[truncated]
```

# RSpec and Behavior-Driven Development

If you [check out the Rubidium source distribution](http://rubyforge.org/frs/download.php/27820/rbtk-0.1.1.tar.gz), you'll notice that the SD parser library is tested with [RSpec](http://rspec.rubyforge.org/), the [BDD](http://en.wikipedia.org/wiki/Behavior_driven_development) framework for Ruby. Ultimately, all components of Rubidium will be tested and documented this way.

# Acknowledgments

Rubidium's new SD file parser was written by [Moses Hohman](http://www.moseshohman.com/). It was kindly donated by [Collaborative Drug Discovery](http://www.collaborativedrug.com/), who have built their drug discovery application using [Ruby on Rails](http://rubyonrails.com).

# Future Directions

One problem in working with SD files is pinpointing encoding errors. A parser should not only raise an exception, but point to a line number and identify offending text to aid debugging. Rubidium's SD parser will eventually incorporate these enhancements.

Because Rubidium runs on JRuby, performance gains may be achievable by re-writing select portions in Java.

Parsing SD files is only the beginning of the story. Many cheminformatics applications need a convenient, fast, and robust method for *writing* molfiles. This is also something Rubidium will attempt to provide.

If your company or organization is curious about Ruby and cheminforamatics, give Rubidium a try. Rubidium is licensed under the permissive [MIT License](http://www.opensource.org/licenses/mit-license.php) to make collaboration as simple as possible.