---
title: A Molecular Language for Modern Chemistry - Cisplatin, Transplatin, and Molecular Configuration
published: "2007-01-17T00:00:00.000Z"
---

Recent articles have discussed FlexMol as a new language capable of representing many of today's most difficult molecules: <a href="http://depth-first.com/articles/2006/12/20/a-molecular-language-for-modern-chemistry-getting-started-with-flexmol">metallocenes</a>; <a href="http://depth-first.com/articles/2007/01/09/a-molecular-language-for-modern-chemistry-flexmol-and-axial-chirality">axially-chiral biaryls</a>; and <a href="http://depth-first.com/articles/2007/01/12/flexmol-and-axial-chirality-n-arylacrylanilides">other forms of axial chirality</a>. FlexMol can also encode more common molecular features such as <a href="http://depth-first.com/articles/2007/01/02/a-molecular-language-for-modern-chemistry-flexmol-and-alkene-geometrical-isomerism">E/Z alkene geometrical isomerism</a>. So far, discussions of stereochemistry have been limited to molecular <em>conformation</em>. In this article, I'll demonstrate how FlexMol encodes molecular <em>configuration</em>, using cisplatin and transplatin as examples.

# The Difference Between Configuration and Conformation

FlexMol's distinction between configuration and conformation is a simple one: if two isomers can't be interconverted by bond rotations, then configuration is used to describe them. Otherwise, conformation is used. The geometrical isomers of dichlorodiamino platinum fall into the former category. For more rigorous definitions, see Dietz' <a href="http://dx.doi.org/10.1021/ci00027a001">original specification</a> on which FlexMol is built.

# Cisplatin

![Cisplatin](/images/posts/20070117/cisplatin.png "Cisplatin")

Cisplatin consists of a central platinum atom surrounded by two chloro ligands and two ammonia ligands arranged at the corners of a square. Using the numbering system present in the structure above, we can construct a [complete FlexMol representation](/images/posts/20070117/cisplatin.xml). Rather than reproduce the entire document here, I'll just highlight the stereochemical aspects. In contrast to the other FlexMol examples covered on Depth-First to date, this example contains a `configuration` element:

```xml
<!-- snip -->
<configuration>
  <configurationWheel>
    <atomPair source="Pt0" target="N4"></atomPair>
    <halfPlane>
      <center atom="Cl2"></center>
    </halfPlane>
    <halfPlane>
      <center atom="N3"></center>
    </halfPlane>
  </configurationWheel>
  <configurationWheel>
    <atomPair source="Pt0" target="N3"></atomPair>
    <halfPlane>
      <center atom="N4"></center>
    </halfPlane>
    <halfPlane>
      <center atom="Cl1"></center>
    </halfPlane>
  </configurationWheel>
  <configurationWheel>
    <atomPair source="Pt0" target="Cl1"></atomPair>
    <halfPlane>
      <center atom="N3"></center>
    </halfPlane>
    <halfPlane>
      <center atom="Cl2"></center>
    </halfPlane>
  </configurationWheel>
  <configurationWheel>
    <atomPair source="Pt0" target="Cl2"></atomPair>
    <halfPlane>
      <center atom="Cl1"></center>
    </halfPlane>
    <halfPlane>
      <center atom="N4"></center>
    </halfPlane>
  </configurationWheel>
</configuration>
<!-- snip -->
```

Notice that the most of the subelements of cisplatin's `configuration` were also used in the context of conformation. The three main differences are:

- The element `configurationWheel` is used in place of `conformationWheel`;
- Instead of a `gammaSequence` each chiral axis is described by an `atomPair` only;
- There are as many `configurationWheels` as neighbors on a configurational atom. In this case, platinum is the configurational atom. It has four neighbors, and so four `configurationWheels` appear. Each neighbor is in turn placed at the `target` of the chiral axis.

To better visualize cisplatin's configuration, consider the four diagrams below, each of which represents one `configurationalWheel`. Given the cisplatin's square-planar geometry, each "wheel" in this case consists of only two opposing `halfPlanes`.

![Cisplatin Planes](/images/posts/20070117/cisplatin_planes.png "Cisplatin Planes")

There are a few things to notice. First, each configurational `halfPlane` is divided into three sections: `lower`; `upper`; and `center`. A `center` designation means that an atom sits precisely on the line bisecting a given half-plane. As with conformational half-planes, `upper` means the part of the half-plane closest to the axis endpoint; `lower` means the part of the half-plane furthest from this atom. Second, notice that an atom oriented 180 degrees from the direction of the chiral axis is not assigned to a `halfPlane` because it occupies none. As we shall see, this is not a limitation.

# Transplatin

![Transplatin](/images/posts/20070117/transplatin.png "Transplatin")

How does this system allow us to distinguish cisplatin from transplatin? Given the atom numbering as shown above, we can construct the [complete FlexMol representation](/images/posts/20070117/transplatin.xml). The `configuration` element is shown below:

```xml
<!-- snip -->
<configuration>
  <configurationWheel>
    <atomPair source="Pt0" target="Cl2"></atomPair>
    <halfPlane>
      <center atom="N3"></center>
    </halfPlane>
    <halfPlane>
      <center atom="N4"></center>
    </halfPlane>
  </configurationWheel>
  <configurationWheel>
    <atomPair source="Pt0" target="N3"></atomPair>
    <halfPlane>
      <center atom="Cl1"></center>
    </halfPlane>
    <halfPlane>
      <center atom="Cl2"></center>
    </halfPlane>
  </configurationWheel>
  <configurationWheel>
    <atomPair source="Pt0" target="Cl1"></atomPair>
    <halfPlane>
      <center atom="N3"></center>
    </halfPlane>
    <halfPlane>
      <center atom="N4"></center>
    </halfPlane>
  </configurationWheel>
  <configurationWheel>
    <atomPair source="Pt0" target="N4"></atomPair>
    <halfPlane>
      <center atom="Cl1"></center>
    </halfPlane>
    <halfPlane>
      <center atom="Cl2"></center>
    </halfPlane>
  </configurationWheel>
</configuration>
<!-- snip -->
```

The arrangement of planes can be represented by the diagram below:

![Transplatin Planes](/images/posts/20070117/transplatin_planes.png "Transplatin Planes")

As you can see, the cisplatin and transplatin configurations are clearly distinguishable by inspection. Notice that we have not resorted to chiral flags, atom parities, or any form of stereochemical template. When a new atom geometry is desired, for example trigonal bipyramidal, octahedral, t-shaped, or otherwise, exactly the same rules apply.

# A Software Implementation

It's not difficult to write software designed to compare stereochemical configurations in the same way as it is done manually. For example, this has been fully implemented in <a href="http://sf.net/projects/octet">Octet</a>.

# So What?

At least one other language shares FlexMol's ability to encode square planar stereochemistry: <a href="http://www.daylight.com/dayhtml/doc/theory/theory.smiles.html">SMILES</a>. The difference is that FlexMol uses no templates, resulting in a rule-based, extensible language. SMILES, on the other hand, uses chiral templates. If your molecule doesn't fit one of these pre-defined templates, you can't encode its stereochemistry with SMILES and expect a third party to be able to understand it. This is the unavoidable consequence of a template-based stereochemistry encoding system such as the one used by SMILES.

# Conclusions

FlexMol offers a completely new way to think about encoding stereochemistry with computers. The method is both flexible and systematic. It does away with the need for inherently confusing and limited constructs such as atom parities, chiral flags, and stereochemical templates in favor of actually describing the stereochemical environment of atoms in a molecule. One stop remains on this introductory tour of FlexMol and stereochemistry: tetrahedral chirality.