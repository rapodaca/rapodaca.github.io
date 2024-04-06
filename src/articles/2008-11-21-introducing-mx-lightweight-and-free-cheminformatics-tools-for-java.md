---
title: Introducing MX - Lightweight and Free Cheminformatics Tools for Java
published: "2008-11-21T00:00:00.000Z"
---

If you want to build cheminformatics software of any kind, you'll need a basic toolkit. Ideally, this toolkit contains all of the low-level functionality used over and over in your projects. Tools for building an in-memory molecular representation, exact- and substructure comparison, and reading/writing molfiles all fall into this category. Also ideally, this toolkit should be free. Not free in the sense of free to use if you work at a university, free to try, or even free to use provided that you make your changes public when you redistribute the toolkit. But free in the sense of "do whatever you want with it and all you have to do is include a copyright notice."

This article introduces MX, a suite of lightweight and free cheminformatics tools for Java designed to fill these needs.

# Download

A [Google Code page](http://code.google.com/p/mx-java/) has been set up for MX. Both a [source distribution](http://mx-java.googlecode.com/files/mx-0.103.0-src.tar.gz) and [compiled jarfile](http://mx-java.googlecode.com/files/mx-0.103.0.jar) representing MX in its current state can be downloaded.

A subsequent article will show how to get started with MX.

# Origins: A Chemical Structure Editor for Web Applications

In 2007 my company, [Metamolecular](http://metamolecular.com), set out to build a lightweight and easy-to-use chemical structure editor for Web applications. Realizing the increasing importance the Web would play as a chemical communication medium in the next decade, a truly Web-based, platform-independent alternative to ChemDraw and ISIS/Draw seemed to be a good direction to pursue. The resulting product became known as [ChemWriter](http://metamolecular.com/chemwriter).

Minimizing deployment footprint was a key consideration with ChemWriter; the last thing a chemist using a Web site wants to spend his or her time doing is waiting around for a large applet to download. With many chemical structure editor applets available today, download times on the order of one minute or longer are not uncommon. This is simply unacceptable.

To create ChemWriter, an ultra-lightweight cheminformatics toolkit was need. How lightweight? We were targeting 100 KB for the complete editor. A good chemical structure editor is a fairly complex piece of UI software involving multiple drawing tools with state-dependent behavior, not to mention some fairly sophisticated [vector graphics rendering](/articles/2008/10/31/a-simple-vector-graphics-api-for-chemical-structure-output-part-1-in-search-of-a-simplifying-approach-for-chemphoto) and molfile input/output. The only way we could reach our 100 KB target for ChemWriter is if the basic cheminformatics toolkit were 20 KB or smaller.

At the time, there was no cheminformatics toolkit, free or otherwise, that could fill the need.

So it was created from scratch.

# High Performance in ChemPhoto

Eventually, the same cheminformatics toolkit used in ChemWriter was adapted for [ChemPhoto](http://metamolecular.com/chemphoto), the [chemical structure imaging application](/articles/2008/09/08/smarter-cheminformatics-from-sd-file-to-image-collection-with-chemphoto).

ChemPhoto was designed to dynamically display 100,000 or more 2D chemical structures in a grid-like GUI using minimal memory. Rather than pre-loading all 100,000 molecule objects into memory, which would not be feasible on most systems, ChemPhoto uses a lazy approach in which an in-memory index of the target SD file is built. Every time a new structure needs to be displayed to the user during a scrolling event, it's created from scratch: the molfile text is loaded from disk, a molecule object is created, the molecule is rendered, and then the entire construct is thrown away.

The performance of ChemPhoto was so good, even though everything was being created on demand and immediately thrown away, that it appeared the cheminformatics toolkit being used had potential in high-performance situations as well.

# Substructure Search and Mapping

Recently, [Rajarshi Guha](http://rguha.wordpress.com/) reported [his port of the VF library to Java](http://rguha.wordpress.com/2008/09/19/faster-substructure-search-in-the-cdk) for use with the Chemistry Development Kit (CDK). This began a thought process starting with "how can it be improved" and leading to the conclusion that the creation of [flexible, Java-centric substructure search utilities](/articles/2008/11/13/one-of-these-things-is-not-like-the-other) would offer the most bang for the buck. [A subsequent article](/articles/2008/11/17/substructure-search-from-scratch-in-java-part-1-the-atom-mapping-problem) described a simple strategy that could be used to get there.

To implement this idea, a cheminformatics toolkit was needed. The one used successfully in ChemWriter and ChemPhoto was an ideal candidate.

The result, a complete substructure search and mapping utility built from scratch, is available in MX under the package <code>com.metamolecular.mx.map</code>.

# Free to Use Anytime, Anyplace - No Strings Attached

Licenses can be a problem with nearly all open source cheminformatics toolkits. If your work is mostly done in an academic environment for free, you're likely to experience no problem at all. However, if you run a company that sells licenses to software containing code you'd rather not reveal to the world, the [reciprocity provisions](/articles/2006/12/29/dispelling-open-source-confusion-an-introduction-to-licenses) in licenses such as those in the GPL, Mozilla (MPL), and IBM (CPL) families lead to major problems.

The problem isn't so much the open source license itself - it's the fact that the original copyright owners either won't give their permission to dual-license their contributions, or in many cases, can't even be tracked down to ask.

This is an unacceptable position for a software distributor wanting to use open source as a cost-effective means to boost their developer productivity.

To address these issues, MX is being distributed under the extremely permissive [MIT License](http://www.opensource.org/licenses/mit-license.php). In a nutshell it says you are free to modify and incorporate MX into any software you distribute without any obligation to release a line of your own source code. It also says if MX doesn't do the job, you're on your own. And that's about all it says. Your only obligation is to include the original copyright notice on all copies or substantial portions of the software.

To my knowledge, only one major cheminformatics toolkit is licensed under an academic-style open source license - [RDKit](http://www.rdkit.org/), which is licensed under the [New BSD License](http://www.opensource.org/licenses/bsd-license.php).

# Conclusions

A basic cheminformatics toolkit is a vital component of most chemistry-related software. For maximal cost-effectiveness as a software distributor, a free toolkit licensed under a permissive open source license is ideal. MX is a free and lightweight cheminformatics toolkit written in Java that has been used successfully in two commercial products.

Future articles will describe the many ways MX can be used and extended.