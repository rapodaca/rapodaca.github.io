---
title: The Fundamental Cheminformatics Toolset
published: "2008-01-08T00:00:00.000Z"
---

Imagine you need to create a cheminformatics system that's useful to chemists in their daily work. What tools would you absolutely need, regardless of the specific system you're building?

[![Old Time Cheminformatics](/images/posts/20080108/oldtime.png "Old Time Cheminformatics")](http://dx.doi.org/10.1021/ci00033a003)

The answer to this question is hardly academic. If you're looking for ways to disproportionately improve the state of cheminformatics, improving the performance of one or more of its fundamental tools would seem to be a logical path.

Here, in no particular order, are my picks for the five fundamental cheminformatics tools:

-  **[2D Structure Editor](http://depth-first.com/articles/2007/11/27/chemwriter-chemical-structures-and-the-web).** Ubiquitous yet mostly-ignored, the 2D structure editor is the last mile connecting cheminformaticians with laboratory chemists. Take away the structure editor for data entry and building queries, and most cheminformatics systems become useless to the average chemist.
-  **[2D Structure Renderer](http://depth-first.com/articles/2007/11/27/chemwriter-chemical-structures-and-the-web).** Chemists expect their cheminformatics systems to communicate with them the way that other chemists do - through 2D chemical structures. Rendering software makes this possible. Like the 2D structure editor, structure renderers are a widely-ignored yet critical link between producers and consumers of cheminformatics software. Although the 2D renderer and editor need not necessarily be related, the two technologies are so similar that most 2D editors are based on a related 2D rendering engine.
-  **Structure Query System.** The purpose of the vast majority of cheminformatics systems is to produce a set of chemical structure results based on a structure query. The structure query system makes this possible. As the datasets that chemists deal with become ever larger, the ability to specify query structures at a high level of detail, and retrieve the results efficiently, becomes increasingly important. This is an area ripe for big improvements.
-  **Low-Level Cheminformatics Toolkit.** Most cheminformatics systems involve one or more elements specific to their problem domain. For example, predictive tools may use molecular descriptors. A robust and versatile low-level cheminformatics toolkit makes it possible to build problem-specific cheminformatics libraries. This toolkit may or may not be used in the 2D structure editor and renderer, depending on whether an adequate text-based molecular language is available (see below).
-  **[Text-Based Molecular Language](http://depth-first.com/articles/tag/flexmol).** Cheminformatics systems are frequently built from components developed independently by multiple groups. These systems may be developed in different programming languages, may even run on different operating systems, and may need to communicate over a network connection. A well-specified, open, text-based molecular language makes it possible for these systems to interoperate. Two widely-used examples include MDL's molfile format and Daylight's SMILES, both of which have significant limitations.

One of the reasons I consider this set of cheminformatics tools in particular to be fundamental is the perennial need to use and improve them. Elements of each of these tools can be seen, for example, in the [COUSIN system](http://dx.doi.org/10.1021/ci00033a003) developed by Howe and Hogadone at Upjohn over 25 years ago. Comparison of this system with [PubChem](http://dx.doi.org/10.1021/ci00033a003) shows just how little the basic problems change, despite major changes in underlying technology.

What are your fundamental cheminformatics tools and which of them are you working to improve?
