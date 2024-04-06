---
title: Five Open Tools for 2D Structure Layout (aka Structure Diagram Generation)
published: "2008-03-26T00:00:00.000Z"
---

Given a molecular representation without 2D coordinates, how would you display a human-readable view?

This problem can arise in many situations, one of the most common of which is the parsing of [line notations](/articles/tag/linenotation) such as [IUPAC nomenclature](/articles/2007/10/19/easily-convert-iupac-nomenclature-to-smiles-inchi-or-molfile-with-rubidium), SMILES, or [InChI](/articles/2007/10/15/an-introduction-to-the-rubidium-cheminforamtics-toolkit-interconvert-smiles-inchi-and-molfile-with-an-open-babel-like-interface).

And then there are the cases when you have 2D coordinates, but they're [not very aesthetically pleasing](/articles/2008/02/12/the-art-and-science-of-chemical-structure-diagrams-double-trouble). Maybe the coordinates were created by people either in a hurry or working with low quality editors, or maybe they were generated as distorted 2D projections of 3D coordinates. Whatever the reason, simply having 2D coordinates may not be the same as having *good* 2D coordinates.

Last year, a Depth-First article [discussed the Structure Diagram Generation (SDG) problem](/articles/2007/04/11/structure-diagram-generation) and how it can be solved with Open Source software. Given that nearly a year has passed, it seemed appropriate to revisit the topic.

The good news is that there are at least four independent Open Source implementations of SDG algorithms, and one potential open database approach. They are, in no particular order:

-  [MCDL](http://sourceforge.net/projects/mcdl) Written in Java, the emphasis of this software appears to be facilitating the use of [Modular Chemical Descriptor Language](/articles/2006/08/19/a-first-look-at-modular-chemical-descriptor-language-mcdl). Unfortunately, no new releases of this intriguing software package have been made in the last year.
-  [Chemistry Development Kit (CDK)](http://sf.net/projects/cdk) This useful package handles about 70-80% of a typical assortment of chemical structures well. The large amount of activity on the CDK project in general makes this a particularly good SDG system to contribute to, especially in the areas of refactoring and handling special cases. See also [Christoph Steinbeck's overview of CDK's layout system](http://www.steinbeck-molecular.de/steinblog/index.php/2007/08/14/structure-diagram-generation-sdg-2d-layout-in-the-chemistry-development-kit-part-1/).
-  [BKChem](http://bkchem.zirael.org/) A 2D structure editor written in Python. Give it an InChI and it will display the structure, courtesy of SDG. The system worked remarkably well with the molecules I tested. BKChem has also been reported to work in [batch mode](http://bkchem.zirael.org/batch_mode_en.html).
-  [RDKit](http://www.rdkit.org/) Written in Python and C++, this package is the newest of the bunch. Although [I haven't had much luck compiling RDKit](http://sourceforge.net/mailarchive/message.php?msg_id=360844.35824.qm%40web34206.mail.mud.yahoo.com), it still looks quite promising. Any chance of switching to [make](http://www.gnu.org/software/make/) as a build system?
-  [PubChem](http://pubchem.ncbi.nlm.nih.gov/) PubChem? Maybe. With a database of small molecules now numbering well over ten million, there's a good chance that the molecule for which you need to assign coordinates is already in PubChem. And if it's in PubChem, 2D coordinates have already been assigned. Use an InChI as a hash key, and voila - instant SDG without much software. Given the novelty of large, publicly-available databases of small molecules such as PubChem, this approach may have a great deal of untapped potential.

SDG is one of those issues that can stay off the radar for some only to become an instant, nagging problem with no clear way out. The tools cited here offer an excellent place to begin working toward a comprehensive solution.
