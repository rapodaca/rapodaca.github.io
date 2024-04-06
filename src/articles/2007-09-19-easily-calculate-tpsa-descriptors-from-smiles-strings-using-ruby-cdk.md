---
title: Easily Calculate TPSA Descriptors from SMILES Strings Using Ruby CDK
published: "2007-09-19T00:00:00.000Z"
---

A D-F reader wrote in to ask how to calculate Topological Polar Surface Area (TPSA) using Ruby CDK. TPSA is one of the most widely-used descriptors for predicting membrane permeability and from it other important ADME properties. This article shows how to calculate TPSA with Ruby using Ruby CDK.

# The Library

Our library consists of nothing more than a few method calls to manipulate the underlying [CDK](http://cdk.sf.net) library. The <code>tpsa_for</code> method accepts any SMILES string and returns the calculated TPSA:

```ruby
require 'rubygems'
require_gem 'rcdk'
require 'rcdk/util'

jrequire 'org.openscience.cdk.qsar.descriptors.molecular.TPSADescriptor'

module TPSA
  @@calc = Org::Openscience::Cdk::Qsar::Descriptors::Molecular::TPSADescriptor.new

  def tpsa_for smiles
    mol = RCDK::Util::Lang.read_smiles smiles

    @@calc.calculate(mol).getValue.doubleValue
  end
end
```

# An Interactive Test

Saving the library to a file called <strong>tpsa.rb</strong> lets us test it through interactive Ruby (irb):

```bash
irb
irb(main):001:0> require 'tpsa'
./tpsa.rb:2:Warning: require_gem is obsolete.  Use gem instead.
/usr/local/lib/ruby/gems/1.8/gems/rcdk-0.3.0/lib/rcdk/java.rb:26:Warning: require_gem is obsolete.  Use gem instead.
=> true
irb(main):002:0> include TPSA
=> Object
irb(main):003:0> tpsa_for 'COCCc1ccc(OCC(O)CNC(C)C)cc1' # metoprolol
=> 50.72
irb(main):004:0> tpsa_for 'O=C3Nc1ccc(Cl)cc1C(c2ccccc2)=NC3O' # oxazepam
=> 61.69
```

The results we obtain for metoprolol and oxazepam are 50.72 and 61.69, respectively. These values compare well with those reported by Ertl et al. in the [definitive paper on TPSA](http://dx.doi.org/10.1021/jm000942e) (50.7 and 61.7, respectively).

# Conclusions

It doesn't take much Ruby to command a wide range of cheminformatics functionality - in this case TPSA calculations. But the fun doesn't stop there. The CDK, and by extension Ruby CDK, offer access to a [wide array of descriptor calculations](http://cheminfo.informatics.indiana.edu/~rguha/code/java/nightly/api/org/openscience/cdk/qsar/descriptors/molecular/package-frame.html), each of which follow the same basic pattern outlined here. All of it can be prototyped, debugged, and deployed through one of the most flexible programming languages currently available.