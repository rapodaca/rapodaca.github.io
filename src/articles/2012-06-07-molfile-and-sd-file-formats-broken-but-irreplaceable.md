---
title: "Molfile and SD File Formats: Broken But Irreplaceable?"
published: "2012-06-07T00:00:00.000Z"
---

Compared to many areas of computer science, cheminforamtics is a backwater. Consider our "standard" file formats Molfile and SD File. These formats, collectively referred to as "[CTfile Formats](http://accelrys.com/products/informatics/cheminformatics/ctfile-formats/no-fee.php)" were first described in the peer review literature in [1992](http://pubs.acs.org/doi/abs/10.1021/ci00007a012), and had been in use for years prior to that. CTfile is an 80-character, line-based text file format that bears little resemblance to the standard information interchange formats XML and JSON in wide use everywhere else.

But make no mistake. This quaint but [broken](http://molmatinf.com/whynotmolsdf.html) method of moving data around is just as relevant today as it was in 1992 - likely more so.

Why do we in cheminformatics continue to use CTfile formats to the exclusion of all others? This was the question [posed to me](https://twitter.com/itdaniher/status/210397975741079552) by Ian Daniher ([@itdaniher](https://twitter.com/#!/itdaniher)) of [Nonolith Labs](http://www.nonolithlabs.com/). Ian has developed [PyChEBI](https://github.com/itdaniher/PyChEBI) - "a Python script to convert the quasi-obsolete SDF file format into a sane (Pythonic) datastructure."

I've come up with these reasons why CTfile remains the go-to data format in chemistry:

1.  **CTfile is good enough.** The CTfile format offers enough functionality to solve most problems involving data exchange in chemistry.
2.  **CTfile is relatively well-documented.** [A single PDF](http://accelrys.com/products/informatics/cheminformatics/ctfile-formats/no-fee.php) contains everything you'll need to implement a CTfile reader and writer. The documentation has been updated regularly for many years now.
3.  **CTfile is easy to understand.** Although the specification has grown a number of odd whiskers over time, the core concepts remain very easy to understand and implement.
2.  **Lack of compelling alternatives.** [Chemical Markup Language](http://www.xml-cml.org/) (CML), an XML-based format, has been in development for many years. Yet it still fails to attract attention outside of a limited audience in cheminformatics. Lack of good [documentation](http://www.xml-cml.org/documentation/index.html) coupled with constantly-evolving schema and tooling are two reasons, but this list is evidence of many others.
3.  **Lack of a competing standard used by must-have software.** CTfile formats were developed by [MDL Information Systems](http://en.wikipedia.org/wiki/MDL_Information_Systems) for use with its suite of user-focused chemistry tools. MDL recognized that CTfile was key to making its business work - and so dedicated the resources necessary to develop and document it. Similar statements apply to the [ChemDraw CDX format](/articles/2010/09/13/a-brief-introduction-to-the-chemdraw-cdx-file-format/).
4.  **Open Standard.** Software that reads and writes CTfiles can be created without paying license fees to MDL or its successor companies. Combined with freely-available documentation, this is about as close as we get in cheminformatics to an open standard.
5.  **Databases rule.** Demand for chemical information interchange formats is driven in large part by [chemical databases](/articles/2011/10/12/sixty-four-free-chemistry-databases/), free and otherwise. When these databases offer the ability to perform mass downloads, they generally use a CTfile format. CTfile is the only format these services can rely on their users being able to open.
6.  **Software.** Molfile and SD File are the only file formats for which stable, well-tested readers and writers have been universally implemented. No other file format enjoys such privilege and this is unlikely to change anytime soon.
7.  **[Worse is better.](http://www.codinghorror.com/blog/2004/08/worse-is-better.html)** Enough said.  

Will CTfile ever be replaced by another standard? Of course. I suspect that the replacement will address one or more of the points above. The replacement for CTfile will also likely start out by gaining a foothold at the periphery of chemistry/cheminformatics and will be ignored by the mainstream for some time. Given the seeming insurmountability of the task, I further suspect that the standard that replaces CTfile will be developed by a group of relative outsiders - they would be the only ones who would think such a thing is even possible.

So, Ian, I salute your initiative. You may be onto something.
