---
title: Interactive Ruby Open Babel
published: "2007-05-16T00:00:00.000Z"
---

One of my favorite features of Ruby is the [Interactive Ruby](http://tryruby.hobix.com/) (irb) shell. For those who haven't used it, irb lets you interactively create Ruby programs. Are you not exactly sure how to use that new library? Do you want to be able to "play" with an object to see how it works? Then irb is the perfect tool.

One of the new features contained in [Open Babel 2.1](http://sourceforge.net/project/showfiles.php?group_id=40728&package_id=32894&release_id=499413) is a [Ruby interface](http://depth-first.com/articles/2007/04/09/painless-installation-of-ruby-open-babel). The power and convenience of irb makes it an excellent tool for exploring Open Babel. With some minor customizations, it can be even better.

# Customizing irb

Your irb sessions can be customized by creating and editing the **.irbrc** file located in your home directory. This file, containing standard Ruby, is loaded prior to the start of your irb session.

# Tab Completion

Code completion is one of those things that, once you've used it, you wonder how you ever got by without. Although it tends not to be activated by default, irb fully supports code completion with the "Tab" key.

To activate this feature, add the following line to your **.irbrc** file:

```ruby
require 'irb/completion'
```

As an example, let's say you'd like to use irb to understand how `OpenBabel::OBMol` objects work. Entering the following code gets you there:

```bash
irb
irb(main):001:0> require 'openbabel'
=> true
irb(main):002:0> mol=OpenBabel::OBMol.new
=> #&lt;OpenBabel::OBMol:0xb7cd30a4&gt;
```

What exactly can this OBMol do? Let's start with the "get" methods. Entering `mol.get` followed by the Tab key gives the following:

```bash
irb(main):003:0> mol.get
mol.get_angle                    mol.get_gidvector
mol.get_atom                     mol.get_givector
mol.get_bond                     mol.get_gtdvector
mol.get_conformer                mol.get_internal_coord
mol.get_conformers               mol.get_mod
mol.get_coordinates              mol.get_mol_wt
mol.get_data                     mol.get_residue
mol.get_dimension                mol.get_spaced_formula
mol.get_energy                   mol.get_sssr
mol.get_exact_mass               mol.get_title
mol.get_first_atom               mol.get_torsion
mol.get_flags                    mol.get_total_charge
mol.get_formula                  mol.get_total_spin_multiplicity
irb(main):003:0> mol.get_
```

If you were interested in molecular weight, you'd see the `mol.get\_mol\_wt` method, which you could fully enter by typing `mol.get\_mol` followed by the Tab key.

Tab completion also works with module names. What are the complete contents of the `OpenBabel` module? Just type `OpenBabel::` followed by the Tab key. There are over 400 possibilities, so you might want to narrow it down a bit. For example, `OpenBabel::OBM` followed by the Tab key gives:

```bash
irb(main):003:0> OpenBabel::OBM
OpenBabel::OBMessageHandler  OpenBabel::OBMolAtomDFSIter  OpenBabel::OBMolRingIter
OpenBabel::OBMol             OpenBabel::OBMolAtomIter     OpenBabel::OBMolTorsionIter
OpenBabel::OBMolAngleIter    OpenBabel::OBMolBondIter
OpenBabel::OBMolAtomBFSIter  OpenBabel::OBMolPairIter
irb(main):003:0> OpenBabel::OBM 
```

# Persistent Command History

Just like other shell environments, irb supports a command line history through the up and down arrows. Like Tab completion, it's one of those things you can't work without.

As you use irb, you'll find yourself exiting and re-entering frequently. By default, irb doesn't support persistent command histories. This means your previous commands are lost every time you exit. What a pain.

Luckily, it's easy to create a persistent command history. Fire up your text editor and make the following changes to **.irbrc**:

```ruby
require 'irb/completion'
require 'irb/ext/save-history'

ARGV.concat [ "--readline", "--prompt-mode", "simple" ]
IRB.conf[:SAVE_HISTORY] = 100
IRB.conf[:HISTORY_FILE] = "#{ENV['HOME']}/.irb-save-history"
```

From now on, your last 100 irb commands will be just a single key away, regardless of how many sessions ago they were entered.

One caveat: if you compile Ruby from source, you may notice that the command history doesn't work. Instead, pressing the up-arrow displays "[[A".

I found the fix in <a href="http://blade.nagaokaut.ac.jp/cgi-bin/scat.rb/ruby/ruby-core/5118">this list posting</a>. In your Ruby source distribution directory, execute the following commands:

```bash
cd ext/readline
ruby extconf.rb
make
sudo make install
```

Why this extension doesn't compile by default is beyond me, but at least the solution is simple.

# Other Customizations

You can customize irb in many other ways. For some ideas, see [The Pickaxe Book](http://www.rubycentral.com/book/irb.html) and [RubyGarden](http://wiki.rubygarden.org/Ruby/page/show/Irb/TipsAndTricks).