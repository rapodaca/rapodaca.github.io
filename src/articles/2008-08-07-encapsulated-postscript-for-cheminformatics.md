---
title: "Encapsulated PostScript for Cheminformatics"
published: "2008-08-07T00:00:00.000Z"
---

Previous articles have discussed ways to display chemical structures in a variety of vector graphics formats, including [Scalable Vector Graphics](/articles/2006/09/09/generating-and-serving-2-d-molecular-svgs) (SVG), [Vector Markup Language](/articles/2008/07/22/vector-markup-language-for-cheminformatics) (VML), and [Shockwave Flash](/articles/2008/06/10/adobe-flash-for-cheminformatics-fast-scalable-and-attractive-2d-depiction-of-chemical-structures-with-vector-graphics) (SWF, or "Flash"). There is one other vector graphics format still in common use that has so far not been discussed: [Encapsulated PostScript](http://en.wikipedia.org/wiki/Encapsulated_PostScript) (EPS).

EPS is a vector graphics format developed by Adobe Systems specifically for desktop publishing. Apparently, the last revision to the EPS Specification, Version 3.0, was [published](http://partners.adobe.com/public/developer/en/ps/5002.EPSF_Spec.pdf) in 1992. Although ancient as technologies go, EPS can still be found in use today. Like the other vector graphics formats discussed here, EPS has all of the features necessary to create high-quality 2D images of chemical structures.

To demonstrate, a development version of [ChemWriter](http://metamolecular.com/chemwriter) was used to convert a molfile representing [rosuvastatin](http://chempedia.com/monographs/rosuvastatin) (Crestor) into the corresponding color EPS file. The result can be [downloaded here](/images/posts/20080807/rosuvistatin.eps).

An open source library, [jlibeps](http://jlibeps.sourceforge.net/), can be used to encode EPS in Java. The business end of the library is an EPS encoding class that extends Graphics2D, enabling most Java2D rendering to be converted into EPS. If you've worked with the [Batik](http://xmlgraphics.apache.org/batik/) SVG toolkit, the concept is similar.

Although jlibeps is a good solution, EPS shares enough similarities to other vector graphics languages that directly encoding EPS output is also a viable option, and the one that was used in the rosuvastatin example above.
