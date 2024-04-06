---
title: Smarter Cheminformatics - From SD File to Image Collection with ChemPhoto
published: "2008-09-08T00:00:00.000Z"
---

The old adage says time is money. Unfortunately, working chemists are often forced to spend a remarkable amount of valuable time and mental effort on menial chemical information processing tasks. These are things that could be done faster and with better quality by the right software, if it were available. Most importantly, these tasks take resources away from much more valuable work that *can't* be automated.

# The Problem in a Nutshell

As a case in point, consider the creation of 2D chemical structure images. If you maintain a compound collection of any kind, sooner or later you may end up asking yourself how you can create a set of images depicting the chemical structures in your collection.

# A Specific Example: Chemical Suppliers

For example, you might work for a chemical supplier that maintains a Web-based eCommerce site, one or more PDF catalogs, or printed brochures. Your customers are chemists and they expect to see chemical structures in your product listings. How can you make this happen?

If you look around for software that automates this job, you'll more likely than not come up empty-handed. The software that solves this problem well simply doesn't exist yet.

# Doing it the Hard Way

In the absence of software to solve the problem, the only way to get the job done is to buckle down and do it manually. Most chemical structure editors allow you to save output as a raster image. Provided that this output matches your requirements, your system might consist of the following steps:

1. For every product in your catalog, create a single molfile or its machine-readable equivalent.
2. Load one file into your editor.
3. Save the file as a raster image, being careful to make sure all of the drawing settings and image size parameters are identical to the rest of your images.
4. Repeat Steps (2)-(3) until you have all of your images.

There are many problems with this approach. For example, if your images ever need to be made larger (or smaller), you'll have to create all of your images over again (which can easily number in the thousands). Similarly, if for some reason you want to change the appearance of the images such as background, atom label coloring, or line thicknesses, you'll be forced into a lot of manual work. Finally, this system requires you to keep track of structures that have been imaged and those that haven't, which can in itself be nontrivial and error-prone, especially for thousands of products.

With the right software, this problem would disappear.

# One Solution: Customized Imaging Service

My company, [Metamolecular](http://metamolecular.com), has recently provided custom imaging services to a few chemical suppliers wanting thousands of good-looking structure images rendered automatically. The service made use of the versatile [ChemWriter](http://metamolecular.com/chemwriter) rendering engine together with some custom code written in Ruby.

Although the imaging service works very well as a one-off solution, it's less than optimal in the longer term. Any changes to the image collection must be processed by Metamolecular, and then sent back to the client. A cheaper and faster solution would be to offer software that implements the functionality of the service.

# A Better Solution: Chemical Structure Imaging Software

Wouldn't it be great if easy-to-use software existed that could automatically generate thousands of chemical structure images with the press of a button?

In particular, the software should:

-  Run on any modern platform (Windows, Mac OS X, Linux).
-  Read industry-standard Structure Data Files (SD Files).
-  Be capable of working with tens of thousands of chemical structures at a time even on older machines.
-  Store fully-customizable drawing settings in a format that could be used over and over again for a consistent and professional look.
-  Allow the output to be previewed exactly as it will appear in the generated images ("what you see is what you get").
-  Output to a variety of image formats, including: Portable Network Graphics (PNG image); JPG image; [Flash](http://depth-first.com/articles/2008/06/10/adobe-flash-for-cheminformatics-fast-scalable-and-attractive-2d-depiction-of-chemical-structures-with-vector-graphics) (SWF file); [Scalable Vector Graphics](http://depth-first.com/articles/2006/09/09/generating-and-serving-2-d-molecular-svgs) (SVG); and [Encapsulated PostScript](http://depth-first.com/articles/2008/08/07/encapsulated-postscript-for-cheminformatics) (EPS file).

# Introducing ChemPhoto

ChemPhoto is designed to solve the problem of consistently creating large numbers of high-quality 2D chemical structure images. Currently in development, the first versions of ChemPhoto will be available for review within the next two weeks.

ChemPhoto consists of a lightweight and intuitive user interface layer built on top of the ChemWriter rendering engine. ChemPhoto focuses on doing one thing very well, so it wouldn't be useful for creating or editing SD Files (a task for which many tools already exist). The software is specifically designed to work well with large SD Files, such as the 25,000-structure sets that can be obtained from [PubChem](http://pubchem.ncbi.nlm.nih.gov/). Written in Java, ChemPhoto runs on Windows, Mac OS X, and Linux. Future articles will discuss ChemPhoto's design and implementation.

If you're interested in evaluating ChemPhoto, feel free to <a href="http://mailhide.recaptcha.net/d?k=01R9bxyP6XNdc0duoUCzBBHA==&amp;c=vZ7R0VDctRzIRzbSs1-LZwDzjTjAnfCS4KONqGHxY9I=" onclick="window.open('http://mailhide.recaptcha.net/d?k=01R9bxyP6XNdc0duoUCzBBHA==&amp;c=vZ7R0VDctRzIRzbSs1-LZwDzjTjAnfCS4KONqGHxY9I=', '', 'toolbar=0,scrollbars=0,location=0,statusbar=0,menubar=0,resizable=0,width=500,height=300'); return false;" title="Reveal this e-mail address">drop me a line</a>.