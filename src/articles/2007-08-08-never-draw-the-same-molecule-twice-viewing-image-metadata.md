---
title: "Never Draw the Same Molecule Twice: Viewing Image Metadata"
published: "2007-08-08T00:00:00.000Z"
---

Chemists are accustomed to embedding live molecular objects in their documents with Microsoft Word/ChemDraw. These objects can then be reprocessed and embedded into other documents, such as PowerPoint presentations, saving enormous amounts of time. What if the same feature were available with Web documents?

![Rosiglitazone](/images/posts/20070801/rosiglitazone.png "Rosiglitazone")

A [recent D-F article](/articles/2007/08/01/never-draw-the-same-molecule-twice-image-metadata-for-cheminformatics) proposed a method to encode molecular structure data within commonly-used Web image formats such as PNG. That article contained an embedded image of GlaxoSmithKline's diabetes treatment rosiglitazone (Avandia) encoded by a rendering toolkit built with [Firefly](/articles/tag/firefly). I claimed that this image contained the complete connection table and atom coordinates as embedded metadata. In this article, I'll show a simple method to read this metadata.

Metadata is a standard part of the PNG specification; to read it requires nothing more than software capable of recognizing it. I recently found a Web-based, cross-platform method for doing so. The [Image Metadata Viewer](http://www.fileformat.info/convert/image/metadata.htm) by [FileFormat.info](http://www.fileformat.info/index.htm) accepts an uploaded image file and returns that image's metadata. Let's try it with the image of rosiglitazone.

After saving the image to my hard drive, uploading it to FileFormat.info and pressing start, I can see that the image contains metadata:

![Screenshot](/images/posts/20070808-2/screenshot.png "Screenshot")

The metadata can be viewed either as XML or as plain text. Choosing plain text (second option) gives me the complete molfile, stored as a key/value hash (molfile=[molfile]).

Clearly, reading metadata is not a problem given the right software. But this leaves the question of how metadata is encoded in the first place - especially in a programming language such as Java. Like everything else, it's not difficult when you know how. Stay tuned for the answer.