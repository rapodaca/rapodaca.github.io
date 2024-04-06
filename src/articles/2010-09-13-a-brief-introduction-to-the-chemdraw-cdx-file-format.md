---
title: "A Brief Introduction to the ChemDraw CDX File Format"
disqus: true
published: "2010-09-13T00:00:00.000Z"
---

Ask just about any chemist which tool they use to create structure drawings that appear in their reports, manuscripts, and patents. The answer is very likely to be [ChemDraw](http://www.cambridgesoft.com/software/ChemDraw/).

ChemDraw is the industry standard tool for generating publication-quality chemical structure graphics. It uses a native file format called "CDX", making CDX files a high-profile player in the world of cheminformatics. The [ChemDraw CDX format](http://www.cambridgesoft.com/services/documentation/sdk/chemdraw/cdx/) is so important that it's one of two file formats accepted and used by the [United States Patent and Trademark Office](http://www.uspto.gov/products/catalog/patent_products/page4.jsp) for chemical structure representation.

This article will give a short introduction to the ChemDraw CDX file format, and serve as a jumping off point for what will (hopefully) become a wider series on this topic.

# A Drawing Format

CDX is far more than a chemical structure representation format. It's is capable of faithfully capturing *everything* that can drawn in ChemDraw, from abstract geometric shapes to free-form text to lines and curves to chemical structures. This stands in contrast to formats such as [molfile](http://depth-first.com/articles/2010/06/28/latest-ctfile-formats-specification-available-now-from-symyx), which only represent chemical structures.

Understanding CDX's wide scope is important because many chemists use free-form drawing techniques to make up for the lack of structured representation in their drawing packages. For example, it is not uncommon for a chemist to indicate unknown (or variable) placement of a ring substituent by drawing a bond *bisecting* the ring bond and perpendicular to it. Another technique is to use a shaded circle attached to a chemical structure to represent a solid support. I've seen many chemists create complex structure-activity and methodology tables, completely in ChemDraw. Other representation techniques are in common use - a topic that could be a discussion unto itself.

The bottom line: chemical structures are but one player in CDX files.

# An Object Format

CDX files store nested object representations, not unlike XML or JSON. CambridgeSoft currently documents [38 object types](http://www.cambridgesoft.com/services/documentation/sdk/chemdraw/cdx/AllCDXObjects.htm), including: [Document](http://www.cambridgesoft.com/services/documentation/sdk/chemdraw/cdx/Document.htm); [Node](http://www.cambridgesoft.com/services/documentation/sdk/chemdraw/cdx/Node.htm); [Bond](http://www.cambridgesoft.com/services/documentation/sdk/chemdraw/cdx/Bond.htm); and [Curve](http://www.cambridgesoft.com/services/documentation/sdk/chemdraw/cdx/Curve.htm). Each of these object can contain other objects, and so on.

# Two Flavors of CDX: Binary and XML

CDX files come in two varieties: [XML](http://www.cambridgesoft.com/services/documentation/sdk/chemdraw/cdx/IntroCDXML.htm) and [binary](http://www.cambridgesoft.com/services/documentation/sdk/chemdraw/cdx/IntroCDX.htm). Both formats use the same concepts and define the same relationships. Interconversion between the two formats is lossless; everything that can be represented as a binary CDX file can also be represented as an XML CDX file.

The binary CDX format uses byte tokens to represent objects and their attributes, and to define nesting relationships.

# CDX on the System Clipboard

ChemDraw and workalike products allow users to transfer drawings to other applications [through the system clipboard](http://www.cambridgesoft.com/services/documentation/sdk/chemdraw/cdx/Clipboard.htm). Executing a copy operation places a naked binary CDX representation of the current contents of the ChemDraw document onto either the Mac or Windows system clipboard.

# CDX in Office Documents

Chemists rarely save CDX files to disk themselves. Instead, ChemDraw content is copied from a drawing tool and pasted into Microsoft Office documents (particularly Word). This embedded CDX then gets saved along with the rest of the document into a single file. Extracting this embedded CDX content requires an Office file API, two free examples of which would be [Apache POI](http://poi.apache.org/) and the [OpenOffice API](http://api.openoffice.org/). Although it's conceptually not difficult to see how to use an Office API together with a CDX reader to extract structured chemical information from Office documents, to my knowledge no examples have been published illustrating exactly how to do so.

# CDX Readers and Writers

A few CDX readers are commercially available. Prices and terms of use can vary considerably among commercial packages. The only alternative I'm aware of for low-cost parsing of CDX files is Open Babel, which offers a [basic CDX file reader](http://openbabel.org/wiki/ChemDraw_CDX).

To my knowledge, no free package exists which can read and make available for further manipulation the complete range of object types supported by CDX. This is somewhat surprising given the importance of CDX as a chemical file format.

# Resources for Working with the Binary Format

CambridgeSoft offers two developer tools that may be helpful in writing third-party CDX readers. The first is a [C++ header file](http://www.cambridgesoft.com/services/documentation/sdk/chemdraw/cdx/CDXConstants.h) with human-readable enumerations of all of the CDX object and property values with human-readable enumerations of all of the CDX object and property values.

The second tool is a Windows program called [CDXHexDumper](http://www.cambridgesoft.com/services/documentation/sdk/chemdraw/cdx/CDXHexDumper.exe), which reveals the structure of a binary CDX file, without semantic interpretation.

# Conclusions

ChemDraw CDX is a [relatively well-documented](http://www.cambridgesoft.com/services/documentation/sdk/chemdraw/cdx/), and extremely important file format in chemistry and commerce. In contrast to most cheminformatics file formats, CDX is a drawing format in which chemical structures may or may not appear. CDX can be found in three main contexts: the system clipboard; Microsoft Office documents; and patent datasets. A few options for reading CDX are available, including one open source package.

With an understanding of these basics, what else is there to know and more importantly what can be done with this knowledge? Future articles will offer some ideas.