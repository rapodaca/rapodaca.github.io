---
title: A Simple Vector Graphics API for Chemical Structure Output Part 1 - In Search of a Simplifying Approach for ChemPhoto
published: "2008-10-31T00:00:00.000Z"
---

One of the main design goals of [ChemPhoto](http://metamolecular.com/chemphoto), the [chemical structure imaging application](/articles/2008/09/08/smarter-cheminformatics-from-sd-file-to-image-collection-with-chemphoto), was to support all Web-relevant image output formats, both vector-based and pixel-based. Like most things in software development, there are far more approaches that add complexity to this problem than there are approaches that remove it. And for some reason, the complexity-reducing methods tend to be the last to be considered. This article, the first in a series, will discuss how ChemPhoto simplifies the problem of supporting multiple chemical structure image output formats from a common representation.

# The Problem in a Nutshell

ChemPhoto uses an internal representation of molecular structure based closely on the industry-standard [MDL molfile format](http://www.mdl.com/downloads/public/ctfile/ctfile.pdf). Given this representation, ChemPhoto needs to be able to write a variety of vector- and raster-based image formats. Raster formats are fortunately limited to PNG and JPG, which are supported directly by the standard Java library.

Vector formats, on the other hand are more diverse and less accessible. Currently, ChemPhoto supports Scalable Vector Graphics (SVG) and Encapsulated PostScript (EPS). Complete support for Adobe Flash (SWF) output is expected soon. Proof of concept for Microsoft's Vector Markup Language (VML) [has already been demonstrated](/articles/2008/07/22/vector-markup-language-for-cheminformatics). Support for Adobe Acrobat format, through the [iText library](http://www.lowagie.com/iText/) is anticipated. Last but not least is Java2D itself for use in Swing components such as [renderers and editors](http://metamolecular.com/chemwriter).

Clearly, supporting all of these formats requires rendering code that is minimally coupled to the underlying display system. But how to do this in practice?

# The Batik Approach: Extend Graphics2D

[Batik](http://xmlgraphics.apache.org/batik/) is a widely-used library for creating and processing SVG in Java. At its core is the [SVGGraphics2D class](http://xmlgraphics.apache.org/batik/using/svg-generator.html) which extends [Graphics2D](http://java.sun.com/j2se/1.4.2/docs/api/java/awt/Graphics2D.html), overriding many of its methods in the process. The idea seems simple enough - create your drawing code using the Java2D API like you normally would. When you want to generate SVG, just pass an instance of <code>SVGGraphics2D</code> and then read out the SVG document using <code>stream</code> method.

The problem with this approach is that every new image output format to be supported needs to extend Graphics2D and essentially re-implement most of its methods. Graphics2D is a large and complex class with many associated helper classes. Just knowing when you've completely covered the API is a major challenge, aside from the even bigger challenge of implementing the overridden methods.

Fine, you might say, given that so many SVG interconverters exist, why not just use SVG (created by Batik) as the universal interconversion format and get a third-party-library to convert SVG into other vector formats?

This approach is appealing in principle, but fails in practice. Many SVG implementations are partial at best - and many lack the documentation that would warn that a problem might exist with the exact form of SVG you're using. For example, in an early iteration of ChemPhoto, Batik was used to create SVG from some representative chemical structures. Unfortunately, the way Batik represented path data was not fully interpreted by any of the SVG->SWF converters that were examined. The result was bumpy instead of smooth curves for atom labels, and other unacceptable abnormalities.

Finally, after spending some time reading J. David Eisenberg's [excellent book about SVG](http://oreilly.com/catalog/9780596002237/toc.html), it became clear that for drawing 2D chemical structures and even reactions and reaction schemes, only a fraction of the SVG specification was relevant.

In this case, Batik, and its approach of extending Graphics2D was simply overkill that made the problem more complex than it needed to be.

# A Better Approach: Create a Custom Vector Graphics Interface

Batik has the right idea: isolate drawing code from the specific format being generated. The problem is that the Graphics2D class wasn't really designed for this purpose. For one thing, it's a concrete class that inherits from another concrete class. And as mentioned before, Graphics2D a very complex class with many dependencies.

How can we create a simple vector graphics API tailored to chemical structure image creation, which is easily re-implemented, and which works with the existing Java2D API?

Part 2 of this series will describe one approach.

# Conclusions

Creating the ChemPhoto rendering engine has been an evolutionary process. It started with the idea of directly using the Graphics2D class in rendering code, but has since moved on to the definition of a vector graphics abstraction layer to simplify the addition of new image formats.
