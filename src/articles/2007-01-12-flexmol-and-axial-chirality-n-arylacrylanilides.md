---
title: "FlexMol and Axial Chirality: N-Arylacrylanilides"
published: "2007-01-12T00:00:00.000Z"
---

![Heck cyclization](/images/posts/20070112/abstract.gif "Heck cyclization")

Recently, Heck cyclizations of <a href="http://dx.doi.org/10.1021/ja067790i">axially chiral <em>N</em>-arylacrylanilids</a> were reported by Lapierre, Geib, and Curran. Faithfully communicating this kind of chirality in machine-readable form is virtually impossible using today's most popular technologies. A <a href="http://depth-first.com/articles/2007/01/09/a-molecular-language-for-modern-chemistry-flexmol-and-axial-chirality">previous article</a> showed how a new XML-based molecular language, <a href="http://depth-first.com/doc/flexmol">FlexMol</a>, could fully represent the axial chirality of BINOL. This article will apply the same principles to an <em>N</em>-arylacrylanilide.

# The Complete FlexMol Representation

![Acrylanilide](/images/posts/20070112/acrylanilide.png "Acrylanilide")

Given the atom numbering of the above molecule, we can construct a [complete FlexMol representation](/images/posts/20070112/acrylanilide.xml). Rather than reproduce the entire XML document here, I'll just include stereochemically-relevant excerpts.

# Stereochemistry: Chiral Axis

The chiral axis is directed from Atom 11 to Atom 7. Half planes are arranged in clockwise fashion about this axis. To better visualize the placement of atoms into half planes, consider the following diagram:

![Chiral Axis Planes](/images/posts/20070112/chiral_axis_planes.png "Chiral Axis Planes")

This leads to the following FlexMol representation:

```xml
<!-- snip -->
<conformationWheel>
  <gammaSequence source="11" target="7">
    <connections>
      <atomPair source="11" target="7"></atomPair>
    </connections>
  </gammaSequence>
  <halfPlane>
    <lower atom="10"></lower>
  </halfPlane>
  <halfPlane>
    <upper atom="5"></upper>
  </halfPlane>
  <halfPlane>
    <lower atom="12"></lower>
  </halfPlane>
  <halfPlane>
    <upper atom="8"></upper>
  </halfPlane>
</conformationWheel>
<!-- snip -->
```

# Stereochemistry: Olefin Geometry

Assignment of olefin geometry in FlexMol was introduced in a <a href="http://depth-first.com/articles/2007/01/02/a-molecular-language-for-modern-chemistry-flexmol-and-alkene-geometrical-isomerism">previous article</a>. A simple disubstituted olefin was used as an example. Exactly the same principles apply in encoding the trisubstituted olefin geometry of our molecule of interest:

```xml
<!-- snip -->
<conformationWheel>
  <gammaSequence source="3" target="2">
    <connections>
      <atomPair source="3" target="2"></atomPair>
    </connections>
  </gammaSequence>
  <halfPlane>
    <lower atom="4"></lower>
    <upper atom="1"></upper>
  </halfPlane>
  <halfPlane>
    <lower atom="5"></lower>
  </halfPlane>
</conformationWheel>
<!-- snip -->
```

# Conclusions

Axial chirality can be fully represented using FlexMol's simple system of axes and half planes. This system can be applied in novel situations, increasing FlexMol's potential as a self-describing molecular language.