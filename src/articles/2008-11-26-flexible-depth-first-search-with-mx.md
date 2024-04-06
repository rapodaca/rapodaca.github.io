---
title: Flexible Depth-First Search With MX
disqus: true
published: "2008-11-26T00:00:00.000Z"
---

Graph theory is an essential component of cheminformatics, if you dig deeply enough. [MX](http://code.google.com/p/mx-java/) is a lightweight cheminformatics toolkit written in Java with a major goal of exposing the most important cheminformatics graph manipulations in a flexible, Java-centric way. Previous releases have focused on implementing [subgraph monomorphism](/articles/2008/11/17/substructure-search-from-scratch-in-java-part-1-the-atom-mapping-problem) functionality for use in substructure search. The new MX release, [0.104.0](http://code.google.com/p/mx-java/downloads/list), introduces support for depth-first traversal. This article will give a simple example using this feature.

# Downloading MX

MX can be downloaded in source or binary form:

-  [mx-0.104.0.jar](http://code.google.com/p/mx-java/downloads/detail?name=mx-0.104.0.jar&can=2&q=) Platform-independent bytecode.
-  [mx-0.104.0-src.tar.gz](http://code.google.com/p/mx-java/downloads/detail?name=mx-0.104.0-src.tar.gz&can=2&q=) Source code and regression tests.

# Scripting MX with JRuby

A [previous article](/articles/2008/11/24/getting-started-with-mx) outlined the simple steps needed to install JRuby on unix-based systems for scripting MX.

# Finding All Paths From a Given Atom

A fundamental graph operation in cheminformatics is finding all paths through a molecule from a starting atom. MX makes this easy with the `com.metamolecular.mx.path.PathFinder` class. Depth-first traversal is used in creating [molecular fingerprints](/articles/2008/10/02/fast-substructure-search-using-open-source-tools-part-1-fingerprints-and-databases). Another use is in creating [SMILES strings](http://www.daylight.com/dayhtml/doc/theory/theory.smiles.html), although a limited form of depth-first traversal is used in which each atom in a molecule is traversed only once.

We can create a short library to print out all of the paths through a molecule in JRuby:

```ruby
require 'mx-0.104.0.jar'
import 'com.metamolecular.mx.path.PathFinder'

class PathPrinter
  def initialize
    @finder = PathFinder.new
  end

  def print_paths atom
    paths = @finder.find_all_paths atom

    puts "printing all paths through the molecule"

    paths.each do |path|
      print_path path
    end
  end

  private

  def print_path path
    path.each do |atom|
      print atom.get_index
      print '-' unless path.get(path.length - 1).equals(atom)
    end

    puts
  end
end
```

Saving the above code in a file called `pathprinter.rb`, we can test it from interactive JRuby:

```bash
jirb
irb(main):001:0> require 'pathprinter'                   
=> true
irb(main):002:0> import com.metamolecular.mx.io.Molecules
=> Java::ComMetamolecularMxIo::Molecules
irb(main):003:0> benzene=Molecules.create_benzene        
=> #&lt;Java::ComMetamolecularMxModel::DefaultMolecule:0x43da1b @java_object=com.metamolecular.mx.model.DefaultMolecule@8a2023>
irb(main):004:0> p=PathPrinter.new                       
=> #&lt;PathPrinter:0x19ed7e @finder=#&lt;Java::ComMetamolecularMxPath::PathFinder:0x3727c5 @java_object=com.metamolecular.mx.path.PathFinder@1140709>
irb(main):005:0> p.print_paths benzene.get_atom(0)       
printing all paths through the molecule
0-5-4-3-2-1
0-1-2-3-4-5
=> nil
```

# How It Works

Two classes collaborate in this traversal: [`com.metamolecular.mx.path.PathFinder`](http://github.com/rapodaca/mx/tree/master/src%2Fcom%2Fmetamolecular%2Fmx%2Fpath%2FPathFinder.java) and [`com.metamolecular.mx.path.DefaultStep`](http://github.com/rapodaca/mx/tree/master/src%2Fcom%2Fmetamolecular%2Fmx%2Fpath%2FDefaultStep.java).

Creating a depth-first traversal of your own is as simple as creating a `DefaultStep` from an `Atom` and implementing a `walk` method similar to the one shown below:

```java
public void walk(Step step)
{
  if (!step.hasNextBranch())
  {
    // do something with the completed branch
    
    return;
  }
    
  while(step.hasNextBranch())
  {
    Atom next = step.nextBranch();
    
    if (step.isBranchFeasible(next))
    {
      walk(step.nextStep(next));
      
      step.backTrack();
    }
  }
}
```

# Conclusions

Depth-first traversal is an important tool in any cheminformatics library. MX offers an implementation of this traversal strategy that can be easily customized.