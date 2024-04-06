---
title: "Structure Diagram Generation"
published: "2007-04-11T00:00:00.000Z"
---

Given a molecule with no 2D coordinates, how would you render a human-readable view? This problem arises in many situations, but most commonly in the context of interpreting [line notations](http://depth-first.com/articles/tag/linenotation) such as IUPAC nomenclature, SMILES, or InChI. Whatever the solution you come up with, you'll come face-to-face with the structure diagram generation (SDG) problem.

![Difficult Layout](/images/posts/20070411/difficult.png "Difficult Layout")

Generating 2D molecular coordinates is a fundamental (and remarkably difficult) problem in cheminformatics. Discussions in the primary literature [date back](http://dx.doi.org/10.1021/ci60011a015) to at least the 1970s with Chemical Abstract Service's pioneering large-scale efforts. A [recent article](http://dx.doi.org/10.1021/ci050550m) from Chemical Computing Group (CCG) described the design and implementation of an advanced SDG system. To my knowledge, the only open source implementation of an SDG system is found in the [Chemistry Development Kit](http://wiki.cubic.uni-koeln.de/cdknews/index.php/CDKNews/article/view/5), and by extension [Ruby CDK](http://depth-first.com/articles/tag/rubycdk).

The SDG problem plays an important role in the [aesthetics of chemical structure diagrams](http://depth-first.com/articles/2007/03/30/the-aesthetics-of-chemical-structure-diagrams), as mentioned by two readers. To render a molecule aesthetically, 2D coordinates must minimize confusing atom overlaps, unconventional orientations, and unusual bond angles.

The role of SDG in cheminformatics can only continue to increase in importance, especially as more and more structures are automatically generated through mining the primary literature, the Internet, [old PDFs](http://wwmm.ch.cam.ac.uk/blogs/murrayrust/?p=28), and other sources. With all of these new computer-generated structures will come the need to make them readily understandable to a chemist through SDG.