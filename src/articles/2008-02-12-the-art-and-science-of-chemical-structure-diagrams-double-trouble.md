---
title: "The Art and Science of Chemical Structure Diagrams: Double Trouble"
disqus: true
published: "2008-02-12T00:00:00.000Z"
---

Two-dimensional chemical structure diagrams are part of a language with both [grammar and aesthetics](/articles/2007/03/30/the-aesthetics-of-chemical-structure-diagrams). Both aspects play a role in determining scientific usability, and both deserve careful consideration when designing cheminformatics systems. This article, the first of a series, will discuss one aspect of 2D chemical structure diagrams that is only [sparsely documented](http://www.iupac.org/reports/provisional/abstract07/brecher_300607.html) and yet instantly recognizable when done wrong: the layout of double bonds.

Consider one of the most common substructures in chemistry, the benzene ring. The two depictions below are grammatically both correct, yet one of them is incorrect in that it fails to follow an important aesthetic convention.

![Benzene Comparison](/images/posts/20080212/benzene_comparison.png "Benzene Comparison")

The structure on the left is the one most chemists would instantly recognize as the standard depiction. All carbon vertices are connected with a line path and all double bonds are offset from that line. Even more important, the double bonds are offset toward the center of the ring and shortened on either end.

The structure on the right is clearly irregular; one of the double bonds is *outside* of the ring, but the others are inside. Seeing such a structure is not just distracting - it's departure from the standard depiction style can lead reactions ranging from [mild irritation](/articles/2007/07/11/waldorf-salad) to doubt over what exactly is being communicated.

Creating the correct representation for benzene's double bonds introduces a number of complexities. Before any implementation can be tried, some key questions about the placement of the second double bond line need to be answered:

-  How will the side on which the second line appears be determined?
-  By what distance will the second line be offset?
-  By how much will the second line be shortened on each side?

To avoid the complexities introduced by these questions (and their numerous edge cases), some tools eliminate the problem by representing all double bonds using the same pattern:

![Alt Benzene](/images/posts/20080212/alt_benzene.png "Alt Benzene")

This approach, while solving a developer problem, creates a user problem in that the resulting structure is much more visually demanding. Notice how carbon verticies no longer are connected by a continuous line. This results in a structure whose carbon backbone is much more tedious to trace. The problem is compounded when fused rings and substituents are added to the mix:

![Aminonaphthol Comparison](/images/posts/20080212/aminonaphthol_comparison.png "Aminonaphthol Comparison")

The questions posed above may not seem that hard. On the surface, they're not. What makes the problem hard are the edge cases that most chemists are aware of, but which are quite difficult to reduce to working software. These edge cases can crop up in the most unexpected places.

Take tetralin for example:

![Tetralin Comparison](/images/posts/20080212/tetralin_comparison.png "Tetralin Comparison")

The structure on the left lays out the double bond properly (grouped with benzene substructure), while the structure on the right does not.

So in addition to some form of ring perception, software needs to recognize that the second double bond line goes "inside" an aromatic ring.

Here's another example, in which the aromatic ring contains five atoms:

![Pyrrole Comparison](/images/posts/20080212/pyrrole_comparison.png "Pyrrole Comparison")

Recently, the rendering capability of my company's chemical structure editor, [ChemWriter](http://metamolecular.com/products/chemwriter), was upgraded to address a similar issue:

![ChemWriter Comparison](/images/posts/20080212/chemwriter_comparison.png "ChemWriter Comparison")

The previous version of ChemWriter used a ring perception algorithm that was misled when certain kinds of tetrasubstituted bonds were located within rings, like the one shown above. The most recent version, 1.1.2, [solves the problem](http://metamolecular.com/blog/2008/02/12/chemwritertrade-1-1-2-improves-rendering-for-tetrasubstituted-double-bonds/) by using a more robust (and efficient) ring perception algorithm. You can [download a free ChemWriter Starter Package](http://metamolecular.com/downloads) containing the upgrade from Metamolecular, or [test it directly online](http://metamolecular.com/products/chemwriter).

Double bond rendering is a surprisingly deep problem raising a number of issues: ring perception, aromaticity detection, vector graphic manipulation, and numerous 2D geometry topics, to name a few. But double bond placement is just one of many issues to address when rendering aesthetically-pleasing and chemically-correct 2D chemical structures. Future articles will discuss some of them.
