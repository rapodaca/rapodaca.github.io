---
title: Never Draw the Same Molecule Twice - Writing PNG Image Metadata with Python
published: "2007-08-29T00:00:00.000Z"
---

A [recent D-F article](/articles/2007/08/08/never-draw-the-same-molecule-twice-viewing-image-metadata) discussed a method for encoding machine-readable molecular structure information as image metadata. This article generated some interest among developers. For example, [Noel O'Boyle](http://baoilleach.blogspot.com) posted code for [reading PNG image metadata with Python](http://baoilleach.blogspot.com/2007/08/access-embedded-molecular-information.html). The popularity of Python in cheminformatics makes this approach especially attractive.

But how would you write PNG image metadata with Python? The obvious answer of using `Image.info` followed by `Image.write` doesn't appear to work. Given my limited knowledge of Python, the answer must come from elsewhere.

Fortunately, [Nick Galbreath](http://blog.modp.com/) wrote in to offer a solution. Using Python, [PIL](http://www.pythonware.com/products/pil/), and an undocumented class, Nick has developed [a small wrapper function](http://blog.modp.com/2007/08/python-pil-and-png-metadata-take-2.html) that writes metadata for PNG images. In fact, Nick is [fast on his way](http://blog.modp.com/2007/08/png-metadata-from-command-line-again.html) to becoming a PNG metadata expert, if reluctantly so. His blog is worth checking out and contains several useful techniques for image manipulation.