---
title: Quick MX Update - Extensible Fingerprints and Hydrogen-Blocked Substructure Queries
published: "2009-06-18T00:00:00.000Z"
---

The [master branch of MX](http://github.com/metamolecular/mx/tree/master) now features support for two very important cheminformatics capabilities:

1.  **Extensible Fingerprints.** Lets you fine-tune the performance of your binary path-based fingerprints. Change path depth, number of bits, and the characters used to generate the fingerprints. The default implementation differentiates cycle paths from non-cycle paths, as well as unsaturated from saturated atom types.
2.  **Hydrogen-Blocked Substructure Queries.** Chemists are accustomed to using a substructure search idiom in which [explicit hydrogen means a blocked position](http://depth-first.com/articles/2009/03/05/substructure-search-idoms-hydrogen-means-block-substitution). MX now has full support for this way of searching chemical databases.

Although it's too late to include these changes into the upcoming 1.0 release of MX, watch for them to appear in 1.1.

[MX](http://metamolecular.com/mx) is a toolkit of essential cheminformatics models and algorithms that emphasizes efficiency, modularity, and readability.
