---
title: "Chemical Markup Language and Ferrocene Part 1: Chem4Word and Breaking with the Past"
published: "2009-04-09T00:00:00.000Z"
---

[Chemical Markup Language](http://en.wikipedia.org/wiki/Chemical_Markup_Language) (CML) is an XML-based language for chemistry developed by [Peter Murray-Rust](http://wwmm.ch.cam.ac.uk/blogs/murrayrust/), [Henry Rzepa](http://en.wikipedia.org/wiki/Henry_Rzepa) and many other contributors. Designed as a communication medium for chemistry based on open standards, CML aims to provide a uniform, extensible system for representing, storing, and transmitting chemical information. CML enables a range of concepts to be modeled, including molecules, reactions, and chemical metadata. [First described in 1995](http://dx.doi.org/10.1021/ci990052b), CML has become an important component of many chemical information systems, including toolkits, structure editors, and other software.

# Chem4Word

Recently, CML has been applied to creation of a new tool called [Chem4Word](http://research.microsoft.com/en-us/projects/chem4word/) that will enable authoring and rendering of semantically-rich chemistry information in Word 2007 documents. Funded by Microsoft, Chem4Word aims to do some of the same things for chemistry and Word documents that the [Math Type add-in](http://office.microsoft.com/en-us/word/HA012303611033.aspx) was able to do for mathematics.

# State of the Art

The combination of embedded [ChemDraw](http://www.cambridgesoft.com/software/details/?ds=2) objects and Microsoft Word documents has become the de facto standard for chemical document authoring. High-quality chemistry journals routinely issue specific instructions for using this combination of software when submitting manuscripts. Although I'm aware of no numbers on the subject, it's not unreasonable to estimate that nearly every chemistry student completing a post-graduate degree will have used the ChemDraw/Word system at least once, and likely far more than that, by the time they graduate.

There are several reasons for the popularity of the ChemDraw/Word system. One of the most important is that it reduces the number of files that need to be managed during the course of preparing a complex document, such as a manuscript, to one. Every embedded ChemDraw object can be edited and placed back into its host document, greatly simplifying workflows. Another reason is the ubiquity of both Microsoft Word and ChemDraw themselves.

These two features alone mean that a chemist can be confident that they'll only have to worry about keeping track of one file, and that they'll always be able to share that one file with any other chemist.

Even if there were no other benefits to the system, which there are, this would be enough to create a powerful network effect, which is exactly what has happened over the last ten years or so.

# The Price of Ubiquity

The ubiquity of ChemDraw/Word comes at a price: organizations everywhere now have large collections of Word documents containing embedded ChemDraw objects that can't easily be searched in chemically-meaningful ways. Give me all documents on my drive (or my company's 'reports' share drive) containing the structure of pseudoephedrine or the substructure naphthiridine? This is a non-trivial problem, and although solutions do exists, the required software is made more expensive than necessary and less useful than possible because of the format in which data is being stored.

Another important limitation in the ChemDraw/Word system is that there are [many molecules](/articles/2009/03/27/a-comprehensive-guide-flexmol-a-modern-language-for-chemical-representation-part-2-real-world-problems) such as ferrocene being created in ChemDraw that are little more than pictures due to the lack of a sufficiently expressive molecular language. Even if you have the software to extract some molecules, it will more likely than not fail for these problem cases.

# A Possible Alternative

Chem4Word represents a potential alternative to the industry standard ChemDraw/Word combination. One of the things it could do is make it far easier (and cheaper) to create software to mine the chemical information contained in Word documents.

But another thing Chem4Word could do is to offer a richer chemical language than ChemDraw that will enable problem molecules such as ferrocene to be represented not as vector drawings, but as full-fledged machine-readable molecular objects that can be searched by structure, cataloged, and aggregated like most organic molecules.

# Who Cares About Ferrocene?

Although working with ferrocene may not be high on the list of things your cheminformatics tools need to be able to do well, ferrocene does represent a good test case for molecules you may need to work with on short notice. Any molecule consisting of one or more multicenter bonds could be a candidate, a number of real-world examples of which are [summarized here](/articles/2009/03/27/a-comprehensive-guide-flexmol-a-modern-language-for-chemical-representation-part-2-real-world-problems).

In short, if you can work with ferrocene, chances are good you can work with any molecule involving multicentered bonding.

# Opening a Discussion

In response to some questions I posted to Peter Murray-Rust's blog asking about how ferrocene specifically is represented in CML, Peter has responded with a large number of posts, which are summarized below:

-  [Chem4Word + CML representational power](http://wwmm.ch.cam.ac.uk/blogs/murrayrust/?p=1535)
-  [CML - a semantic approach to chemistry](http://wwmm.ch.cam.ac.uk/blogs/murrayrust/?p=1563)
-  [Chem4Word - why semantics are necessary](http://wwmm.ch.cam.ac.uk/blogs/murrayrust/?p=1581)
-  [CML - semantic representation of molecular structure](http://wwmm.ch.cam.ac.uk/blogs/murrayrust/?p=1592)
-  [CML - semantics for pi-bonds](http://wwmm.ch.cam.ac.uk/blogs/murrayrust/?p=1600)
-  [CML - "can your system encode these semantics"](http://wwmm.ch.cam.ac.uk/blogs/murrayrust/?p=1637)

# The Plan

Over the next few weeks, I'll be discussing Peter's responses, and comparing the CML approaches to representing ferrocene to the approaches offered by [FlexMol](/articles/2009/03/19/a-comprehensive-guide-flexmol-a-modern-language-for-chemical-representation-part-1-outlining-the-problem), another XML-based chemical language. The intent is not to slight one or promote the other, but rather to compare each approach and discuss the tradeoffs involved.

Given the general lack of discussion on the topic of cheminformatics' problem molecules, it's entirely possible that the ideal solution consists of system with features in common to both FlexMol and CML. On the other hand, it could be something else altogether.