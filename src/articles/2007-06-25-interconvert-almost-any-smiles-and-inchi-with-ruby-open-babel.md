---
title: Interconvert (Almost) Any SMILES and InChI with Ruby Open Babel
published: "2007-06-25T00:00:00.000Z"
---

SMILES and InChI are the two most widely-used [line notations](http://depth-first.com/articles/2007/03/14/eleven-qualities-of-the-perfect-line-notation-for-the-web) in cheminformatics. Not surprisingly, there are many situations in which it's useful to interconvert the two. This article shows a simple method for doing so using [Ruby Open Babel](http://depth-first.com/articles/tag/rubyopenbabel).

# Parsing InChIs

Version 1.01 of the IUPAC/NIST C InChI toolkit introduced the ability to parse InChIs. This capability has subsequently been incorporated into [Open Babel](http://openbabel.sf.net), and by extension, Ruby Open Babel. It's this capability that we'll take advantage of.

# A Simple Library

The following library provides everything we need to convert between SMILES and InChI via Ruby:

```ruby
require 'openbabel'

module InChI
  @@to_smiles = OpenBabel::OBConversion.new
  @@to_inchi = OpenBabel::OBConversion.new
  @@to_smiles.set_in_and_out_formats 'inchi', 'smi'
  @@to_inchi.set_in_and_out_formats 'smi', 'inchi'

  def inchi_to_smiles inchi
    mol = OpenBabel::OBMol.new

    @@to_smiles.read_string(mol, inchi) or raise "Can't parse InChI: #{inchi}."
    @@to_smiles.write_string(mol).strip
  end

  def smiles_to_inchi smiles
    mol = OpenBabel::OBMol.new

    @@to_inchi.read_string(mol, smiles) or raise "Can't parse SMILES #{smiles}."
    @@to_inchi.write_string(mol).strip
  end
end
```

# Testing the Library

After saving the above code to a file named `inchi.rb`, we can interactively convert SMILES and InChIs:

```bash
irb
irb(main):001:0> require 'inchi'
=> true
irb(main):002:0> include InChI
=> Object
irb(main):003:0> smiles = inchi_to_smiles "InChI=1/C14H12/c1-3-7-13(8-4-1)11-12-14-9-5-2-6-10-14/h1-12H/b12-11-"
=> "c1ccc(cc1)C(/[H])=C(/[H])c1ccccc1"
irb(main):004:0> inchi = smiles_to_inchi smiles
=> "InChI=1/C14H12/c1-3-7-13(8-4-1)11-12-14-9-5-2-6-10-14/h1-12H/b12-11-"
```

In the above test, the InChI for *cis*-stilbene is converted into a SMILES string which is then converted back to InChI form with complete fidelity, including alkene geometry. Note that this would not have been possible using the approach that was [previously discussed](http://depth-first.com/articles/2006/09/19/decoding-inchis-with-rino) in which molfiles were used as intermediate datastructures.

What about chiral centers? Here the results are mixed. For example, when the round-trip conversion is applied to propranalol ([PubChem](http://pubchem.ncbi.nlm.nih.gov/summary/summary.cgi?cid=21138), [Video](http://60minutes.yahoo.com/segment/21/memory_drug)), the configuration of the stereocenter is *inverted*.

```bash
irb
irb(main):001:0> require 'inchi'
=> true
irb(main):002:0> include InChI
=> Object
irb(main):003:0> smiles = inchi_to_smiles "InChI=1/C16H21NO2/c1-12(2)17-10-14(18)11-19-16-9-5-7-13-6-3-4-8-15(13)16/h3-9,12,14,17-18H,10-11H2,1-2H3/t14-/m1/s1"
=> "CC(C)NC[C@@H](COc1cccc2ccccc12)O"
irb(main):004:0> inchi = smiles_to_inchi smiles
=> "InChI=1/C16H21NO2/c1-12(2)17-10-14(18)11-19-16-9-5-7-13-6-3-4-8-15(13)16/h3-9,12,14,17-18H,10-11H2,1-2H3/t14-/m0/s1"
```

However, the same round-trip conversion of phenethanol works without inversion of stereochemistry:

```bash
irb
irb(main):001:0> require 'inchi'
=> true
irb(main):002:0> include InChI
=> Object
irb(main):003:0> smiles = inchi_to_smiles " InChI=1/C8H10O/c1-7(9)8-5-3-2-4-6-8/h2-7,9H,1H3/t7-/m0/s1"
=> "C[C@@H](c1ccccc1)O"
irb(main):004:0> inchi = smiles_to_inchi smiles
=> "InChI=1/C8H10O/c1-7(9)8-5-3-2-4-6-8/h2-7,9H,1H3/t7-/m0/s1"
```

The most likely explanation is that under certain conditions, Open Babel incorrectly interprets and/or writes stereo parities.

# One More Gotcha

On my system (Linux Mandriva 2007.1), attempting to perform the round-trip test on glucose resulted (reproducibly) in a segfault:

```bash
irb
irb(main):001:0> require 'inchi'
=> true
irb(main):002:0> include InChI
=> Object
irb(main):003:0> smiles = inchi_to_smiles "InChI=1/C6H12O6/c7-1-2-3(8)4(9)5(10)6(11)12-2/h2-11H,1H2/t2-,3-,4+,5-,6?/m1/s1"
=> "C([C@H]1[C@H]([C@@H]([C@H](C(O)O1)O)O)O)O"
irb(main):004:0> inchi = smiles_to_inchi smiles
./inchi.rb:20: [BUG] Segmentation fault
ruby 1.8.6 (2007-03-13) [i686-linux]

Aborted
```

The same segfault was obtained when using the <code>babel</code> command-line utility:

```bash
babel -ismi -oinchi
C([C@H]1[C@H]([C@@H]([C@H](C(O)O1)O)O)O)O
[Return]
Segmentation fault
```

# Conclusions

As you can see, Ruby Open Babel makes short work of interconverting SMILES and InChIs. Despite problems with stereochemical configuration and segfaults on reading certain SMILES strings, the approach outlined here offers a quick and economical way to interconvert a variety of SMILES and InChIs.

