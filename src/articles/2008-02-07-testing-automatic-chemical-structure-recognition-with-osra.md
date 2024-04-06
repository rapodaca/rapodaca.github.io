---
title: "Testing Automatic Chemical Structure Recognition with OSRA"
disqus: true
published: "2008-02-07T00:00:00.000Z"
---

Countless chemical structures exist only in a raster image format such as JPG, GIF, BMP, or on a printed page or PDF. While perfectly readable to humans, they are very difficult for machines to read. Given the sheer number of these structures that have been produced over the last few decades, the only hope of excavating them from their current [data tombs](http://depth-first.com/articles/2008/02/04/raiding-chemistrys-data-tombs) is with computer recognition of some kind. This article discusses [OSRA](http://cactus.nci.nih.gov/osra/), an open source software package designed to do for chemical structures what Optical Character Recognition did for the printed word.

An [online version of OSRA](http://cactus.nci.nih.gov/cgi-bin/osra/index.cgi) was used to read PNG images of chemical structures produced by an application based on [ChemWriter](http://depth-first.com/articles/2007/11/27/chemwriter-chemical-structures-and-the-web). Both aliased and antialiased images were used and atom coloring was disabled:

![OSRA](/images/posts/20080207/image_no_antialias.png "OSRA")

Structure interpretation failed for the antialiased image at both 300 and 72 DPI resolution. [This](http://www.daylight.com/daycgi/depict?4343434328432943284f2943363d432843353d43434328434331434328434343293d43432843432943344328433129434328433343432843432943323d4343434343324333293d4343344329433d4335294343434336) was the SMILES that was produced at 72 DPI; the one produced at the 300 DPI setting was not much more encouraging.

However, using the aliased imaged at 72 DPI produced the correct structure.

Could the failure to recognize the antialiased image be due to a problem with the ChemWriter application's rasterization method? Apparently, not. When a screen capture utility was used to produce the image from the ChemWriter application window, the wrong structure was again produced. Here, the PNG encoding was not through a Java program but rather the underlying operating system (Linux) using a standard screen capture utility.

To test the idea that line thickness might play a role in determining the quality of OSRA's interpretation, the antialiased image below was submitted:

![Thin Lines](/images/posts/20080207/image_thin_lines.png "Thin Lines")

Still, the [incorrect structure](http://www.daylight.com/daycgi/depict?43434343363d4328432943333d43284329433d432843323d434343313d4328433d43433d4331294328432943324329433d4333434328434343353d43433d432843343d432843283d4f294e283d4f293d4f29433d43433d433429433d4335294336) was produced.

Apparently, images of 2D structures in which antialiasing has been applied cause difficulties for OSRA.

Fortunately, the ChemWriter-based application [embedded the full connection table of the molecule into all of its images as metadata](http://depth-first.com/articles/2007/08/01/never-draw-the-same-molecule-twice-image-metadata-for-cheminformatics), so an optical recognition step is unnecessary.

Provided that no antialiasing has been applied to images, OSRA would seem to be a capable tool for converting rasterized 2D chemical structures into machine-readable format.

