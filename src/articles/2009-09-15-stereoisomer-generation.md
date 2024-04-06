---
title: "Stereoisomer Generation"
published: "2009-09-15T00:00:00.000Z"
---

The ability to identify and generate of all possible stereoisomers from a graph molecular representation is useful in many areas of cheminformatics. My own interest in this subject comes from ongoing work to create a robust chemical substance registration system as part of the [Chemcaster](http://chemcaster.com) platform. The idea is that users may submit a molecule bearing unspecified stereocenters and the system needs to decide what action to take in response. In some cases, for example, that action will be to auto-generate and register one or more stereoisomers (or a subset of them).

Recently, [Tim Vandermeersch](http://timvdm.blogspot.com/) kicked off a series of articles on stereoisomer perception in Open Babel:

1. [Symmetry classes: How to get them and what to do with them](http://timvdm.blogspot.com/2009/09/symmetry-classes-how-to-get-them-and.html)
2. [Untitled](http://timvdm.blogspot.com/2009/09/as-promised-here-are-some-molecules.html)

Tim cites a [key paper by Razinger et al.](http://dx.doi.org/10.1021/ci00016a003) ([free reprint](http://www.mcs.csueastbay.edu/~kbalasub/reprints/282.pdf)) that details how a working stereoisomer generation system can be designed.

Two aspects of this problem make it hard: (1) the differentiation of atoms that might be stereocenters from those that will never be; and (2) the exclusion of stereoisomers that are equivalent because of higher molecular symmetry properties (think cis/trans 4-methylcyclohexanol, which has only two steroisomers, not four, neither of which are chiral).

A key feature of the Razinger approach is the use of molecular *automorphism groups*. An automorphism group is composed of all mappings of atoms in the same molecule that don't make or break any of the original bonds.

How to determine autmorphism groups? One approach would be through a [VF implementation](/articles/2008/11/17/substructure-search-from-scratch-in-java-part-1-the-atom-mapping-problem), such as the one found in [Mx](http://metamolecular.com/mx).

If you needed to generate all stereoisomers of a molecule, which tools and/or approaches would you use?