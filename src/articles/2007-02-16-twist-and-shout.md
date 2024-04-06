---
title: Twist and Shout
published: "2007-02-16T00:00:00.000Z"
---

Yet another case of axial chirality in the recent literature comes in the form of ion channel openers described by [Vrudhula et al](http://dx.doi.org/10.1021/jm061093j). A previous Depth-First article illustrated how most popular cheminformatics tools are [incapable of distinguishing](/articles/2007/01/08/the-axial-chirality-problem) axially chiral enantiomers such as those shown above. If your application suddenly needed to do so, could it cope?

![Abstract](/images/posts/20070216/abstract.gif "Abstract")

FlexMol is an XML language designed to solve the molecular representation problems of today and, hopefully, those of tomorrow. Some of its capabilities have already been introduced:

-  [planar chirality](/articles/2007/01/22/a-molecular-language-for-modern-chemistry-flexmol-and-planar-chiral-metacyclophanes)
-  [square-planar isomerism](/articles/2007/01/17/a-molecular-language-for-modern-chemistry-cisplatin-transplatin-and-molecular-configuration)
-  [axially chiral amides](/articles/2007/01/12/flexmol-and-axial-chirality-n-arylacrylanilides)
-  [axially chiral biaryls](/articles/2007/01/09/a-molecular-language-for-modern-chemistry-flexmol-and-axial-chirality)
-  [tetrahedral chirality](/articles/2007/01/25/a-molecular-language-for-modern-chemistry-flexmol-tetrahedral-chirality-and-monolaterol)
-  [alkene geometrical isomerism](/articles/2007/01/02/a-molecular-language-for-modern-chemistry-flexmol-and-alkene-geometrical-isomerism)
-  [multiatom bonding in metallocenes](/articles/2006/12/20/a-molecular-language-for-modern-chemistry-getting-started-with-flexmol)

Given the two previous articles on axial chirality, it should be clear how to represent the <del>two enantiomers</del> <u>enantiomers of the structure</u> shown above using FlexMol. What is far from clear at this point is how to bring this capability to chemists. For example, no 2-D structure editor I'm aware of can systematically encode axial chirality. Likewise, no 2-D rendering toolkit can draw it. FlexMol and languages like it are important first steps to solving these problems, but they are by no means the last.

*Postscript: the two structures depicted above are actually identical! You can prove this to yourself by verifying that the phenol oxygen points into the plane of your screen and the chlorine atom points out of the plane in both structures. Clearly the authors intended for the phenyl ring to be flipped by 180 degrees, but they hand-placed the wedges on the wrong side of the benzene ring. The fact that this error appears in none other than J. Med. Chem. further underscores the need for tools that understand axial chirality.*