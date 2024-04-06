---
title: From InChI to Image with Ruby Open Babel and Ruby CDK
published: "2007-09-06T00:00:00.000Z"
---

Like SMILES, InChI is a line notation that can be used to encode and store chemical information relatively efficiently. Although there are a number of scenarios where this strategy is used, what many of them have in common is the need to eventually convert an InChI into a human-readable form. In most cases, this form will be a 2D chemical structure. This article will show how a small Ruby library can convert InChI strings into color PNG images with the help of [Ruby Open Babel](http://depth-first.com/articles/tag/rubyopenbabel) and [Ruby CDK](http://depth-first.com/articles/tag/rcdk).

# The Library

Our library accepts an InChI as input and produces a scaled PNG image as output. It re-uses part of a [previously-discussed](http://depth-first.com/articles/2007/06/25/interconvert-almost-any-smiles-and-inchi-with-ruby-open-babel) library for the interconversion of SMILES and InChI.

```ruby
require 'rubygems'
require 'openbabel'
require_gem 'rcdk'
require 'rcdk/util'

module InChI
  @@to_smiles = OpenBabel::OBConversion.new
  @@to_smiles.set_in_and_out_formats 'inchi', 'smi'

  def inchi_to_png inchi, path_to_png, width, height
    smiles = inchi_to_smiles inchi

    RCDK::Util::Image.smiles_to_png smiles, path_to_png, width, height
  end

  private

    def inchi_to_smiles inchi
      mol = OpenBabel::OBMol.new

      @@to_smiles.read_string(mol, inchi) or raise "Can't parse InChI: #{inchi}."
      @@to_smiles.write_string(mol).strip
    end
end
```

# Testing

Our library can be tested by saving it to a file called <strong>inchi.rb</strong> and using interactive Ruby (the warning can safely be ignored for now):

```bash
irb
irb(main):001:0> require 'inchi'
./inchi.rb:3:Warning: require_gem is obsolete.  Use gem instead.
/usr/local/lib/ruby/gems/1.8/gems/rcdk-0.3.0/lib/rcdk/java.rb:26:Warning: require_gem is obsolete.  Use gem instead.
i=> true
irb(main):002:0> include InChI
=> Object
irb(main):003:0> inchi='InChI=1/C23H27FN4O2/c1-15-18(23(29)28-10-3-2-4-21(28)25-15)9-13-27-11-7-16(8-12-27)22-19-6-5-17(24)14-20(19)30-26-22/h5-6,14,16H,2-4,7-13H2,1H3' #risperidone
=> "InChI=1/C23H27FN4O2/c1-15-18(23(29)28-10-3-2-4-21(28)25-15)9-13-27-11-7-16(8-12-27)22-19-6-5-17(24)14-20(19)30-26-22/h5-6,14,16H,2-4,7-13H2,1H3"
irb(main):004:0> inchi_to_png inchi, 'risperidone.png', 300, 300
=> nil
```

This code produces the following image:

[![Risperidone](/images/posts/20070906/risperidone.png "Risperidone")](http://pubchem.ncbi.nlm.nih.gov/summary/summary.cgi?cid=5073)

Our library can also be used on more complicated molecules, for example Brevetoxin:

```bash
irb
irb(main):001:0> require 'inchi'
./inchi.rb:3:Warning: require_gem is obsolete.  Use gem instead.
/usr/local/lib/ruby/gems/1.8/gems/rcdk-0.3.0/lib/rcdk/java.rb:26:Warning: require_gem is obsolete.  Use gem instead.
=> true
irb(main):002:0> include InChI
=> Object
irb(main):003:0> inchi='InChI=1/C49H70O13/c1-26-17-36-39(22-45(52)58-36)57-44-21-38-40(62-48(44,4)23-26)18-28(3)46-35(55-38)11-7-6-10-31-32(59-46)12-8-14-34-33(54-31)13-9-15-43-49(5,61-34)24-42-37(56-43)20-41-47(60-42)30(51)19-29(53-41)16-27(2)25-50/h6-8,14,25-26,28-44,46-47,51H,2,9-13,15-24H2,1,3-5H3/b7-6-,14-8-' #brevetoxin a
=> "InChI=1/C49H70O13/c1-26-17-36-39(22-45(52)58-36)57-44-21-38-40(62-48(44,4)23-26)18-28(3)46-35(55-38)11-7-6-10-31-32(59-46)12-8-14-34-33(54-31)13-9-15-43-49(5,61-34)24-42-37(56-43)20-41-47(60-42)30(51)19-29(53-41)16-27(2)25-50/h6-8,14,25-26,28-44,46-47,51H,2,9-13,15-24H2,1,3-5H3/b7-6-,14-8-"
irb(main):004:0> inchi_to_png inchi, 'brevetoxin.png', 300, 200
=> nil
```

This produces the following image:

[![Brevitoxin](/images/posts/20070906/brevetoxin.png "Brevitoxin")](http://pubchem.ncbi.nlm.nih.gov/summary/summary.cgi?cid=6437089)

# Conclusions

While our library could certainly be improved, it solves what otherwise would be a very difficult problem conveniently. Areas for further work include error handling and improving the appearance of the images (the latter is the aim of [Firefly](http://depth-first.com/articles/tag/firefly)). Despite the fact that three programming languages are used (Ruby, C++, and Java), this complexity is neatly encapsulated behind a simple Ruby interface.