---
title: "Visual Representation of Query Structures"
published: "2010-08-31T00:00:00.000Z"
---

As the size of a chemical structure database increases, so does the need for advanced query tools. A common feature of large structure databases is hitset pruning through the use of query atoms and query bonds. But how should the necessary 'query structures' be displayed to chemists?

[![SMARTS Depict](/images/posts/20100831/smarts_depict.png)](http://dx.doi.org/10.1021/ci100209a)

It turns out that different drawing packages use different methods of depiction. For example, two such packages are the [PubChem Sketcher](http://pubchem.ncbi.nlm.nih.gov/edit2/index.html) and [Symyx/Draw](http://www.symyx.com/micro/getdraw/), which you can see above offer different renderings of a sulfonamide-based molecular query structure.

Query structures will be an important new feature of [ChemWriter 2](http://depth-first.com/articles/2010/08/10/building-chemwriter-2-javascript-all-the-way-down), so it's important to provide a display method that's both clear and as expressive as possible. But how should we do this?

A recent paper from [Rarey's group](http://www.zbh.uni-hamburg.de/staff.php?mode=_details&id=rarey&language=en) describing a new method for [the display of query structures](http://dx.doi.org/10.1021/ci100209a) caught my eye. Like IUPAC's [Graphical Representation Standards for Structure Diagrams](http://www.iupac.org/publications/pac/80/2/0277/) from which it draws inspiration, this new study seeks to offer specific guidelines for visual structure representation, but from the perspective of molecular queries.

The authors report an intriguing system for the graphical representation of query structure elements, including those for atoms:

[![Atoms Depict](/images/posts/20100831/atoms_depics.png "Atoms Depict")](http://dx.doi.org/10.1021/ci100209a)

and bonds:

[![Bonds Depict](/images/posts/20100831/bonds_depict.png "Bonds Depict")](http://dx.doi.org/10.1021/ci100209a)

A [SMARTS query viewer](http://smartsview.zbh.uni-hamburg.de/) based on these principles is now available, as are a number of examples - in the paper itself and [online](http://smartsview.zbh.uni-hamburg.de/home/gallery). [The paper's supplementary material](http://pubs.acs.org/doi/suppl/10.1021/ci100209a) contains both graphical legends and examples that help explain the new system.

An open question at this point is to what extent chemists will feel comfortable with the Rarey query display system. Although some motifs such as ring membership will look familiar, others such as red color coding for the "NOT" boolean operator will be less so.

On the other hand, it could be argued that any system that attempts to display query structures in all their detail to chemists will encounter the same problem; the work by Rarey's group simply attempts to provide a standardized way for doing so that harnesses the power of modern computer graphics.
