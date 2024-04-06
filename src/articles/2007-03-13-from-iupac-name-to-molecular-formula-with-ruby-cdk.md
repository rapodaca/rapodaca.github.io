---
title: From IUPAC Name to Molecular Formula with Ruby CDK
published: "2007-03-13T00:00:00.000Z"
---

Recently, a question was raised on the [Yahoo cheminf group list](http://tech.groups.yahoo.com/group/chemoinf/) regarding the conversion of IUPAC names into molecular formulas. This can be done quickly with Ruby CDK, as this article will show.

# Prerequisites

This tutorial requires [Ruby CDK](http://depth-first.com/articles/2006/10/30/agile-chemical-informatics-development-with-cdk-and-ruby-rcdk-0-3-0), which in turn requires [Ruby Java Bridge](http://rjb.rubyforge.org/) (RJB). A recent Depth-First article described the minimal system configuration required to run [RJB on Linux](http://depth-first.com/articles/2006/08/26/scripting-java-libraries-with-ruby-java-bridge). Another article showed how to install [RJB on Windows](http://depth-first.com/articles/2006/10/12/running-ruby-java-bridge-on-windows).

# A Small Library

The following library will convert IUPAC nomenclature into molecular formulas with Ruby:

```ruby
require 'rubygems'
require_gem 'rcdk'
require 'rcdk'
require 'rcdk/util'

module Formulator
  @@hydrogen_adder = Rjb::import('org.openscience.cdk.tools.HydrogenAdder').new

  def get_formula(iupac_name)
    mol = RCDK::Util::Lang.read_iupac iupac_name
    @@hydrogen_adder.addExplicitHydrogensToSatisfyValency mol
    analyzer = Rjb::import('org.openscience.cdk.tools.MFAnalyser').new(mol)

    analyzer.getMolecularFormula
  end
end
```

Save this code as a file named `formulator.rb` in your working directory.

# Testing the Library

The Formulator library can be tested with the following code:

```ruby
require 'formulator'
include Formulator

get_formula 'benzene' # =&gt; "C6H6"
get_formula '4-(3,4-dichlorophenyl)-N-methyl-1,2,3,4-tetrahydronaphthalen-1-amine' # =&gt; "C17H17NCl2"
```

# Limitations

You may run across classes of structures that are not recognized by Ruby CDK. This is due to limitations of the underlying [OPSIN library](http://depth-first.com/articles/tag/opsin). For example, OPSIN does not yet recognize fused heterocycle names such as 'imidazo[2,1-b][1,3]thiazole'.

# Conclusions

Ruby CDK makes short work of converting IUPAC names into molecular formulas. This is just one example of the kind of conversion that's possible. For example, [a recent article](http://depth-first.com/articles/2006/10/30/agile-chemical-informatics-development-with-cdk-and-ruby-rcdk-0-3-0) discussed the conversion of IUPAC names to color 2-D structures.

Due to Ruby's position as both a highly functional scripting language and as the foundation for the popular Web application framework [Ruby on Rails](http://www.rubyonrails.org/), a variety of IUPAC nomenclature translation applications are just a few lines of code away.