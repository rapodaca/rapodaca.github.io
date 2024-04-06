---
title: "A Molecular Language for Modern Chemistry: FlexMol and Alkene Geometrical Isomerism"
published: "2007-01-02T00:00:00.000Z"
---

> The fundamental idea behind our representation of stereochemistry is to really describe the relative spatial arrangements of the atoms of a chemical structure. For a given constitution, we obtain a unique and unambiguous stereochemical representation. No limitation to predefined types or steregenic units exits; any conceivable relative spatial arrangement of atoms may be uniformly represented by one universally applicable formalism. ...
>
><cite>[Andreas Dietz](http://dx.doi.org/10.1021/ci00027a001)</cite>

A recent article <a href="http://depth-first.com/articles/2006/12/20/a-molecular-language-for-modern-chemistry-getting-started-with-flexmol">introduced FlexMol</a>, a molecular language designed to encode the multi-atom bonding arrangements present in molecules being increasingly made and used by today's chemists. But FlexMol was designed with much more than bonding in mind. Of all of the difficult areas in molecular representation, perhaps none are more daunting than stereochemistry. This article will introduce the basic ideas behind FlexMol's stereochemistry capabilities using the geometrical isomers of 2-butene as an example.

# The Difference Between Configuration and Conformation

FlexMol distinguishes between two complementary stereochemical concepts - conformation and configuration.  The difference between the two lies in whether isomers can be interconverted through bond rotations. To paraphrase Dietz:

- **Conformation.** Two molecules with identical atom connectivities and bonding differ with respect to their conformation if if they possess different relative spatial arrangements of atoms that can be interconverted by rotations about bonds.
- **Configuration.** Two molecules with identical atom connectivities and bonding differ with respect to their configuration if they possess different relative spatial arrangements of atoms that can not be interconverted by rotations about bonds.

Notice that these definitions say nothing about whether a bond rotation is likely to occur; they simply refer to the possibility of isomer interconversion through bond rotation. Clearly, double bond geometrical isomerism arises from restricted bond rotation. So we'll be relying on FlexMol's support for conformational stereochemistry.

# Encoding Cis/Trans Isomerism: 2-Butene

Consider the two isomers of 2-butene. The cis isomer can be encoded in FlexMol as follows:

```xml
<!-- cis-2-butane -->
<?xml version="1.0" standalone="yes"?>

<molecule>
  <constitution>
    <atoms>
      <atom id="C0" symbol="C" hydrogens="3" ionization="4"></atom>
      <atom id="C1" symbol="C" hydrogens="1" ionization="4"></atom>
      <atom id="C2" symbol="C" hydrogens="1" ionization="4"></atom>
      <atom id="C3" symbol="C" hydrogens="3" ionization="4"></atom>
    </atoms>
    <bonding>
      <bond source="C0" target="C1" bondingElectrons="2"></bond>
      <bond source="C1" target="C2" bondingElectrons="4"></bond>
      <bond source="C2" target="C3" bondingElectrons="2"></bond>
      <bond source="C3" target="C4" bondingElectrons="2"></bond>
    </bonding>
  </constitution>
  <conformation>
    <conformationWheel>
      <gammaSequence source="C1" target="C2">
        <connections>
          <atomPair source="C1" target="C2"></atomPair>
        </connections>
      </gammaSequence>
      <halfPlane></halfPlane>
      <halfPlane>
        <lower atom="C0"></lower>
        <upper atom="C3"></upper>
      </halfPlane>
    </conformationWheel>
  </conformation>
</molecule>
```
  
In contrast to previous FlexMol examples, this representation contains a `conformation` element, which in turn contains a `conformationWeel` subelement. The `conformationWheel` is composed of a `gammaSequence` and two `halfPlanes`. The relationship among these elements can be seen in the diagram below.

![Cis-2-butene](/images/posts/20070102/cis_2_butene.png "Cis-2-butene")

Stereochemical representation in FlexMol boils down to placing atoms into a set of half-planes intersecting a given axis (Dietz refers to this arrangement as a "pencil of planes"). In the case of cis-2-butene, this axis, or gamma sequence, is the atom pair between atoms `C1` and `C2`. A gamma sequence can consist of two or more atoms, a very useful feature for representing allene stereochemistry, for example. Half planes are specified in clockwise order about this axis. Because half planes always occur in pairs separated by 180 degrees about their common axis, the number of half planes will always be even. Each conformational half plane is further subdivided into two regions labeled appropriately enough "upper" and "lower".

A conformation wheel will always have an equivalent, but opposite representation. For example, cis-2-butene could also be represented with an axis of opposite orientation (C2->C1), opposite ordering of half planes (in this case the same ordering because there are only two half planes), and inverted upper/lower designations. FlexMol only requires that one of these two equivalent arrangements be specified.

In a similar fashion, we can generate a FlexMol representation for trans-2-butene:

```xml
<!-- trans-2-butane -->
<?xml version="1.0" standalone="yes"?>

<molecule>
  <constitution>
    <atoms>
      <atom id="C0" symbol="C" hydrogens="3" ionization="4"></atom>
      <atom id="C1" symbol="C" hydrogens="1" ionization="4"></atom>
      <atom id="C2" symbol="C" hydrogens="1" ionization="4"></atom>
      <atom id="C3" symbol="C" hydrogens="3" ionization="4"></atom>
    </atoms>
    <bonding>
      <bond source="C0" target="C1" bondingElectrons="2"></bond>
      <bond source="C1" target="C2" bondingElectrons="4"></bond>
      <bond source="C2" target="C3" bondingElectrons="2"></bond>
      <bond source="C3" target="C4" bondingElectrons="2"></bond>
    </bonding>
  </constitution>
  <conformation>
    <conformationWheel>
      <gammaSequence source="C1" target="C2">
        <connections>
          <atomPair source="C1" target="C2"></atomPair>
        </connections>
      </gammaSequence>
      <halfPlane>
        <upper atom="C3"></upper>
      </halfPlane>
      <halfPlane>
        <lower atom="C0"></lower>
      </halfPlane>
    </conformationWheel>
  </conformation>
</molecule>
```

This representation contains a `conformationWheel` with two filled half planes containing the atoms `C3` and `C0`, respectively. The arrangement among the conformational elements can be better seen in the following diagram:

![Trans-2-butene](/images/posts/20070102/trans_2_butene.png "Trans-2-butene")

# So What?

There are many ways to represent alkene geometrical isomerism, most of which are far simpler than the one outlined here. So what does this additional complexity buy us? In FlexMol, we can use exactly the same formalisms we used for 2-butene isomers to represent the stereochemistries of molecules that simply can not be represented in other systems. Two specific examples include the axial chirality of allenes and biaryls. If you'd like some hints on how to accomplish this, see the allene and binaphthyl FlexMol examples contained in the <strong>flexmol</strong> directory of the <a href="http://sourceforge.net/project/showfiles.php?group_id=96108&amp;package_id=102647">Octet source distribution</a>.

Notice how FlexMol does away with the need to define conformation in terms of sterochemical descriptors, which are quite limited. Instead, FlexMol provides a small set of modular concepts that, when used together, actually describe the underlying conformational features of a molecule. Of course, (E) and (Z) descriptors (and a host of others as well) can be derived from a FlexMol representation given the right software.

# Conclusions

We've covered the essentials for conformational representation in FlexMol, and we've seen how to differentiate double bond geometrical isomers. The same principles described here are also used in encoding stereochemical configuration, which will be the subject of a future tutorial.