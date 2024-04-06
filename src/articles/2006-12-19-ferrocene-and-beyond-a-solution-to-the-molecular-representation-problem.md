---
title: "Ferrocene and Beyond: A Solution to the Molecular Representation Problem"
published: "2006-12-19T00:00:00.000Z"
---

>The representation of molecular structure decisively determines the scope of a chemical computer program. Our goal is to provide a versatile computer-oriented molecular structure representation for chemical information storage and retrieval as well as for computer-assisted synthesis design. Structural formulas describe molecular structure on the proper level of abstraction for these applications. ... It is therefore desirable that the computer-oriented representation of molecular structure be as expressive as the structural formulas.
>
><cite>[Andreas Dietz](http://dx.doi.org/10.1021/ci00027a001)</cite>

<a href="http://depth-first.com/articles/2006/12/12/the-problem-with-ferrocene">A recent Depth-First article</a> highlighted the difficulty that existing molecular languages have in communicating the generalized, multi-atom bonding present in metallocenes such a ferrocene. For software and Web services that do not interact with the outside world, the Ferrocene Problem may not be a big deal. But for the growing number that do, the Ferrocene Problem is but the tip of a very large iceberg.

# Today's Weird-Looking Molecule is Tomorrow's Molecule of the Month

Consider the problem of axial chirality, such as that present in certain biaryls. None of the molecular languages currently in widespread use (InChI, SMILES, Molfile, or CML) provide a mechanism to faithfully represent and communicate this structural motif. In the 1980s, axial chirality was a novelty. Today it is ubiquitous. Consider <a href="http://dx.doi.org/10.1021/ol062499t">this graphical abstract</a> from the current issue of <em>Organic Letters</em>:

[![Binol](/images/posts/20061219/binol_ga.gif "Binol")](http://dx.doi.org/10.1021/ol062499t)

If you were asked to create an application capable of distinguishing substituted (R) and (S) binol enantiomers, could you do it? If your system needed to reliably interact with the outside world, could it do so? If you're working with any of the cheminformatics tools currently in widespread use, chances are good that the answers to these questions would be "no".

Do you still think of metallocenes as curiosities studied by a handful of organometallic chemists? Consider <a href="http://dx.doi.org/10.1021/ol062806v">this <em>J. Org. Chem.</em> ASAP contents article</a> describing one of the most fundamental transformations in organic chemistry:

[![Metallocene](/images/posts/20061219/irridium_matallocene_ga.gif "Metallocene")](http://dx.doi.org/10.1021/ol062806v)

The problem only gets worse as concepts like axial and planar chirality are increasingly co-mingled with multi-atom bonding. For example, consider <a href="http://dx.doi.org/10.1021/jo061360t">the following graphical abstract</a>, taken from <em>J. Org. Chem.</em> ASAP contents:

[![Ferrocene](/images/posts/20061219/ferrocene_ga.gif "Ferrocene")](http://dx.doi.org/10.1021/jo061360t)

These molecules, and many others like them, were used in the context of <em>organic chemistry</em>. Moreover, the papers describing their use were published in widely-respected journals specializing in <em>organic chemistry</em>. Yet dozens of popular cheminformatics tools specifically designed for use with <em>organic chemisty</em> are incapable of faithfully representing the most interesting features of these molecules. In other words, the problem is both real and immediate.

Chemistry relentlessly marches forward, revealing even greater molecular information problems on the horizon. For software to remain relevant, it must be based on tools that are up to the challenge.

# A Solution

<a href="http://dx.doi.org/10.1021/ci00027a001">The system proposed by Dietz </a> offers a solution to nearly all of the bonding and stereochemistry problems of existing molecular languages. As a tradeoff, Dietz's system is significantly more complicated to implement. This places an increased burden on software to make the system as simple and understandable as possible.

# Java and XML Implementations

Any specification, if it is to become more than just an academic exercise, requires a software implementation. Fortunately, for Dietz's system both a software implementation and an XML Schema have been developed and are freely-available.

The software implementation can be found in the Java framework <a href="http://sf.net/projects/octet">Octet</a>. In addition to fully-implementing Dietz's specification, Octet enables ring perception, substructure and query structure matching, breadth-first traversal, and of course, depth-first traversal. Add-on libraries are available for <a href="http://sf.net/projects/structure">2-D structure depiction</a>, and <a href="http://sf.net/projects/rxf">Molfile and SMILES input and output</a>. <a href="http://almost.cubic.uni-koeln.de/cdk/cdk_top/cdk_news/archive/cdknews2.2.article18.pdf">A CDK News article</a> discusses <a href="http://sf.net/projects/cdktools">CDKTools</a>, a bridge to the <a href="http://cdk.sf.net">Chemistry Development Kit</a>. Octet remains, to my knowledge, the first and only implementation of the Dietz system.

The first, and to my knowledge only, XML implementation of the Dietz molecular representation system is FlexMol (Flexible Molecular Object Language). A commented W3C schema is distributed with Octet. Browser-ready HTML documentation can be found <a href="http://depth-first.com/doc/flexmol">here</a>, or from the sidebar links under "APIs and Schema Documentation." Octet is able to read and write FlexMol documents, providing an open, end-to-end solution to the problem of representing and transmitting molecules containing "nonstandard" bonding and stereochemistry.

# Conclusions

Both FlexMol and Octet are convenient tools for working with the Dietz molecular representation system. Future articles in this series will show how they can be used to solve current, real-world molecular representation problems.