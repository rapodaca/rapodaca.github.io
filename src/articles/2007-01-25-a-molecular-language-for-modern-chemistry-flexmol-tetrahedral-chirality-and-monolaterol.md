---
title: "A Molecular Language for Modern Chemistry: FlexMol, Tetrahedral Chirality, and Monolaterol"
published: "2007-01-25T00:00:00.000Z"
---

Models of structure and bonding play a critical role in guiding chemical research. These models also define the scope and limitations of any cheminformatics system. Within the last several years, the gap between the structure and bonding models used by chemical information systems and by the chemists who use them has been widening. On this front, chemistry is moving much faster than cheminformatics. Sooner or later the difference must be reconciled.

# A Looming Problem

Models of structure and bonding in cheminformatics, although adequate for organic chemistry in the 1970s, are outdated today. As <a href="http://depth-first.com/articles/2006/12/19/ferrocene-and-beyond-a-solution-to-the-molecular-representation-problem">recently discussed</a>, some of the most interesting molecules in organic chemistry can't be adequately represented by 99% of the available cheminformatics tools. This may not be a problem if your clients never work with these molecules (but they probably are already). It may not be a problem if your system never interacts with the outside world where these molecules are prevalent (but it will eventually). A quick fix is likely to produce even bigger problems down the road. What's needed is a comprehensive solution.

FlexMol is a molecular language designed to solve this problem. For example, recent articles have demonstrated how FlexMol is capable of representing some of today's most difficult structural motifs: <a href="http://depth-first.com/articles/2006/12/20/a-molecular-language-for-modern-chemistry-getting-started-with-flexmol">metallocenes</a>; <a href="http://depth-first.com/articles/2007/01/09/a-molecular-language-for-modern-chemistry-flexmol-and-axial-chirality">biaryl axial chirality</a>; <a href="http://depth-first.com/articles/2007/01/12/flexmol-and-axial-chirality-n-arylacrylanilides">non-biaryl axial chirality</a>; <a href="http://depth-first.com/articles/2007/01/22/a-molecular-language-for-modern-chemistry-flexmol-and-planar-chiral-metacyclophanes">planar chirality</a>; and <a href="http://depth-first.com/articles/2007/01/17/a-molecular-language-for-modern-chemistry-cisplatin-transplatin-and-molecular-configuration">non-tetrahedral stereochemical configuration</a>.

Although FlexMol handles these tough cases, it's not merely a specialty language for "weird" molecules. Rather, FlexMol provides a basic set of elements and principles that can be applied to any molecule, regardless of its peculiarities or lack thereof. For example, FlexMol defines a clean system for the representation for <a href="http://depth-first.com/articles/2007/01/02/a-molecular-language-for-modern-chemistry-flexmol-and-alkene-geometrical-isomerism">alkene geometry</a>. This basic level of functionality is not even provided by the industry-standard Molfile format, which requires 2-D atom coordinates.

In this demonstration, we'll turn our attention to one of the most basic problems in cheminformatics - the representation of tetrahedral chirality. Using an example molecule from the recent literature, we'll see how the principles outlined in previous FlexMol examples also apply to stereogenic carbons.

# Conformation or Configuration?

We need to answer a basic question before we can represent tetrahedral chirality: should we use configuration or conformation? Following the simple principle that isomers interconvertible by bond rotation are conformational isomers and all others are configurational isomers, it's clear that we'll be using configuration. More rigorous definitions are offered by <a href="http://dx.doi.org/10.1021/ci00027a001">Dietz</a>.

# An Example

![Molecule](/images/posts/20070125/molecule.png "Molecule")

A <a href="http://dx.doi.org/10.1021/np060192x">recent paper</a> describes the isolation of the plant natural product Monolaterol and the assignment of its absolute configuration. Using the structure and atom numbering system shown above, we can construct a [complete FlexMol representation](/images/posts/20070125/molecule.xml) of Monolaterol. Rather than reproduce it here, let's just consider the stereochemically-relevant part:

```xml
<!-- snip -->
<configuration>
  <configurationWheel>
    <atomPair source="15" target="16"></atomPair>
    <halfPlane>
      <lower atom="14"></lower>
    </halfPlane>
    <halfPlane></halfPlane>
    <halfPlane></halfPlane>
    <halfPlane>
      <lower atom="12"></lower>
    </halfPlane>
  </configurationWheel>
  <configurationWheel>
    <atomPair source="15" target="12"></atomPair>
    <halfPlane>
      <lower atom="16"></lower>
    </halfPlane>
    <halfPlane></halfPlane>
    <halfPlane></halfPlane>
    <halfPlane>
      <lower atom="14"></lower>
    </halfPlane>
  </configurationWheel>
  <configurationWheel>
    <atomPair source="15" target="14"></atomPair>
    <halfPlane>
      <lower atom="12"></lower>
    </halfPlane>
    <halfPlane></halfPlane>
    <halfPlane></halfPlane>
    <halfPlane>
      <lower atom="16"></lower>
    </halfPlane>
  </configurationWheel>
</configuration>
<!-- snip -->
```

Three `configurationWheels` are defined. As in the case of representing the <a href="http://depth-first.com/articles/2007/01/17/a-molecular-language-for-modern-chemistry-cisplatin-transplatin-and-molecular-configuration">configuration of square-planar species</a>, each substituent of the chiral center is in turn placed along a wheel's axis, giving three wheels in total for Monolaterol. The relationships among atoms, planes, and axes is represented in the following cartoon:

![Configuration](/images/posts/20070125/configuration.png "Configuration")

Notice also that there are two empty half-planes in each `conformationWheel`. Half-planes occur in pairs spaced 180 degrees apart. Given that there are two neighboring atoms to place into half-planes, two half-planes will be empty. We nevertheless must include them as placeholders. Notice that virtual hydrogens (those hydrogens not explicitly defined as part of the `atoms` element) are not placed into half-planes.

It should be clear that the FlexMol representation of Monolaterol's (<em>R</em>)-enantiomer is distinguishable by visual inspection or by software. Each `configurationWheel` would be enantiomeric. As a result, the ordering of half-planes about their respective axes would be inverted.

# So What?

Most cheminformatics tools can represent tetrahedral chirality. In nearly every case, this is accomplished with stereodescriptors, atom parities, or chiral flags. Extending these systems to non-tetrahedral chirality requires more templates - a difficult, if not impossible, task in most cases. Worse still, such systems are often based on poorly-documented conventions, resulting in a great deal of confusion when writing software implementations.

FlexMol takes a completely different approach by actually describing the chiral environment around an atom in terms of a simple system of axes and planes. The rules governing these elements are applied regardless of the kind of chirality being represented. This results in a system that works consistently for known forms of chirality, and which can be extended as new forms of chirality are encountered.

# A Software Implementation

Any new molecular language requires a software implementation. For FlexMol, that implementation is provided by the <a href="http://sf.net/projects/octet">Octet Framework</a>. Octet is open source software written in Java that provides a FlexMol reader, a FlexMol writer, and many tools for working with molecular representations.

# Conclusions

Although not often discussed, models of bonding and structure figure prominently in the ability of cheminformatics software to solve relevant problems. This is especially true in the increasingly important area of molecular chirality. In this area, FlexMol offers a system with unprecedented flexibility; it works just as well with stereogenic carbon as with numerous, less common forms of chirality.