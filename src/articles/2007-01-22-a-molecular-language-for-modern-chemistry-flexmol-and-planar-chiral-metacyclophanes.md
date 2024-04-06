---
title: "A Molecular Language for Modern Chemistry: FlexMol and Planar-Chiral Metacyclophanes"
published: "2007-01-22T00:00:00.000Z"
---

![Abstract](/images/posts/20070122/abstract.gif "Abstract")

Previous articles have highlighted FlexMol's ability to represent nearly all forms of molecular chirality, including many that are alien to popular cheminformatics tools. FlexMol provides just a few basic elements and rules for their combination, resulting in a system that is both extensible and systematic. For example, similar elements are used to represent <a href="http://depth-first.com/articles/2007/01/09/a-molecular-language-for-modern-chemistry-flexmol-and-axial-chirality">the axial chirality of biaryls</a>, <a href="http://depth-first.com/articles/2007/01/02/a-molecular-language-for-modern-chemistry-flexmol-and-alkene-geometrical-isomerism">the geometrical isomerism of alkenes</a>, and <a href="http://depth-first.com/articles/2007/01/17/a-molecular-language-for-modern-chemistry-cisplatin-transplatin-and-molecular-configuration">the configuration of square-planar metal complexes</a>. In this article, we'll see how FlexMol can encode an example from the very recent literature: planar-chiral metacyclophanes as described by Tanaka and coworkers.

# Configuration or Conformation?

The question we have to answer is what form of stereochemistry needs to be represented - configuration or conformation. We follow the simple rule that isomers interconvertable through bond rotations are treated as conformations and conclude that to represent a metacyclophane, we'll be dealing with conformation. See the <a href="http://dx.doi.org/10.1021/ci00027a001">original Dietz specification</a> for a more rigorous analysis.

# A FlexMol Representation

![Molecule](/images/posts/20070122/molecule.png "Molecule")

Let's choose a specific molecule to encode in FlexMol (Y,Z=CH<sub>2</sub>) . Using the atom numbering given in the figure above, we can construct [this complete FlexMol representation](/images/posts/20070122/molecule.xml). Rather than reproduce it completely here, I'll just highlight the stereochemically-relevant part:

```xml
<!-- snip -->
<conformation>
  <conformationWheel>
    <gammaSequence source="17" target="8">
      <connections>
        <atomPair source="17" target="8"></atomPair>
      </connections>
    </gammaSequence>
    <halfPlane>
      <lower atom="16"></lower>
    </halfPlane>
    <halfPlane>
      <upper atom="9"></upper>
    </halfPlane>
    <halfPlane></halfPlane>
    <halfPlane>
      <upper atom="7"></upper>
    </halfPlane>
  </conformationWheel>
  <conformationWheel>
    <gammaSequence source="11" target="10">
      <connections>
        <atomPair source="11" target="10"></atomPair>
      </connections>
    </gammaSequence>
    <halfPlane>
      <lower atom="12"></lower>
    </halfPlane>
    <halfPlane>
      <upper atom="2"></upper>
    </halfPlane>
    <halfPlane></halfPlane>
    <halfPlane>
      <upper atom="9"></upper>
    </halfPlane>
  </conformationWheel>
</conformation>
<!-- snip -->
```

This `conformation` contains two `conformationWheels`, each corresponding to one of the two bonds about which rotation is restricted. Notice the similarity of this FlexMol code compared to the examples for <a href="http://depth-first.com/articles/2007/01/09/a-molecular-language-for-modern-chemistry-flexmol-and-axial-chirality">BINOL</a>, and an <a href="http://depth-first.com/articles/2007/01/12/flexmol-and-axial-chirality-n-arylacrylanilides">N-arylacrylanilide</a>. To better visualize the relationships among atoms, axes, and half-planes, consider the following cartoons:

![Conformation Planes](/images/posts/20070122/conformation_planes.png "Conformation Planes")

The enantiomeric representation of our molecule would produce an arrangement of half-planes that was the inverse of those shown here, and distinguishable by manual inspection or software implementation. One such implementation is contained in the open source framework <a href="http://sf.net/projects/octet">Octet</a>.

# Conclusions

As the example in this article demonstrates, FlexMol can fully encode the planar-chirality of the new class of axially-chiral metacyclophanes reported in a recent <em>J. Am. Chem. Soc.</em> article. Exactly the same FlexMol elements were used as in previous examples illustrating axial chirality and alkene geometry. Systematic and extensible methods for encoding diverse forms of chirality are not only feasible - one of them already exists.