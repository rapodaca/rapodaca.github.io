---
title: "Substructure Search Idoms: Hydrogen Means Block Substitution"
published: "2009-03-05T00:00:00.000Z"
---

As you can see from the [GitHub log](http://github.com/rapodaca.atom), work on [MX](http://metamolecular.com/mx/), the cross-platform, cross-language cheminformatics toolkit, is currently centered around adding support for complex structure queries with query atoms and query bonds. Although this is not a [SMARTS](http://www.daylight.com/dayhtml/doc/theory/theory.smarts.html) system, the net result would the same - more control over structure queries.

The reason for this focus has to do with a commonly used, but not always implemented substructure searching idiom. Chemists using a substructure search system, like that to be included in [ChemVendor](http://chemvendor.com/), will want to "block" substitution on an atom by adding explicit hydrogens to arrive at the desired valence. So, for example, if Joe draws benzaldehyde with a hydrogen attached to the carbonyl carbon and submits a substructure search, he expects to see benzaldehydes, but not benzamides or benzoate esters.

[SSS](/images/posts/20090305/sss.png "SSS")

Given the right pre-processing of the submitted query structure, this kind of simplifying yet powerful substructure searching idom would be supported through MX.