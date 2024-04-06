---
title: Ruby CDK One-Liners - Create a Molfile With 2D Atom Coordinates From Arbitrary SMILES Strings
published: "2007-09-20T00:00:00.000Z"
---

A very common operation in cheminformatics is the interconversion of molfiles and SMILES strings. Usually, converting from SMILES gives a molfile in which all atoms have coordinates of (0,0,0). Sometimes you just need more than that. The following Ruby CDK code will accept an arbitrary SMILES string and return a molfile with fully-assigned 2D atom coordinates:

```ruby
require 'rubygems'
require 'rcdk'
require 'rcdk/util'
include RCDK::Util

XY.coordinate_molfile Lang.smiles_to_molfile('c1ccccc1')
```

Looking at it this way, those four lines of require/include statements seem pretty darn verbose.