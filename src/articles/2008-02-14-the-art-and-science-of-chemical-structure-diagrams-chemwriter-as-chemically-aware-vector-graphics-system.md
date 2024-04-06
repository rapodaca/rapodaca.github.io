---
title: The Art and Science of Chemical Structure Diagrams - ChemWriter as Chemically-Aware Vector Graphics System
disqus: true
published: "2008-02-14T00:00:00.000Z"
---

Of the many problems to be solved when [building software to view and manipulate 2D chemical structures](/articles/2008/02/12/the-art-and-science-of-chemical-structure-diagrams-double-trouble), one of the trickiest is getting all features to scale proportionally. This problem is widespread because it can seldom be predicted at which resolution a chemical structure will be viewed.

This article describes some ways in which this problem was addressed in the Web-based chemical structure editor [ChemWriter](http://metamolecular.com/products/chemwriter).

# Chemically-Aware Vector Graphics

ChemWriter is at its a core chemically-aware vector graphics system. It was designed with the belief that chemical structures should remain readable regardless of size.

The ability to scale 2D chemical structures to any resolution and retain readability is essential when creating cheminformatics systems because magnification factors are so varied. For example, in many cases, structures are user-resizable. In others, the size of the structure is statically set by the developer. In others, the bond length needs to remain fixed and the overall image size needs to adapt accordingly. Even when a chemical structure display context may seem static, future design constraints may force a change.

A robust chemical structure graphics system needs to gracefully enable the resizing of its output.

# A Demonstration

The live applet \[not\] shown above lets you scale a chemical structure using the ">" and "<" keys, or the View->Zoom In and View->Zoom Out menu items.

Note: if you haven't installed and activated [Java](http://www.java.com/en/download/index.jsp) in your browser, you'll need to do so before viewing the above demonstration.

# Scaling Chemical Structure Features

Properly scaling 2D chemical structure diagrams may not seem that difficult, but consider some of the properties involved:

-  **Atom Label Size.** Hardcoding font sizes is simply not an option.
-  **Atom Label Padding.** The empty space around a heteroatom bond label prevents bonds from making direct contact with the atoms they connect.
-  **Line Thickness.** Lines have variable absolute thickness that ensure they're visible at lower magnification and not too thin at higher magnification.
-  **Multiple Bond Offset Distance.** Double and triple bonds contain lines that are offset from the center bond line.
-  **Stereo Bond Maximum Width** Wedge and hash bonds have a maximum thickness.

To retain readability, each of these properties must proportionally scale when a chemical structure is reduced or enlarged.

# The ChemWriter System

What does it mean to resize a chemical structure?

The dimensions of a structure are determined by its underlying atom coordinates. Resizing a chemical structure scales these coordinates. It's convenient to think of this process as a proportional change in the absolute length of the bonds between atoms; relative bond lengths, and relative atom positions remain fixed.

Given that only bond lengths change during scaling, it's useful to adopt bond length as a yardstick. Although not all bonds in a molecule will have the same length, for the most part these values will be tightly clustered around a median.

For this reason, a molecule's median bond length is the standard unit of measurement in ChemWriter.

As an example, setting atom label height can be done by calling ChemWriter's `setAtomLabelHeight` method (or using the `atomLabelHeight` [parameter](http://metamolecular.com/products/chemwriter/documentation/developer-guide/#parameters)). The double-precision value represents a fraction of the median bond length. To make atom labels appear half as high as the median bond length, use a value of 0.5. To make them appear smaller by half, use a value of 0.25.

The demonstration \[not\] above shows the effect of each of these settings.

# Conclusions

ChemWriter uses a vector graphics system that can create consistent, readable output for a wide range of image sizes. This flexibility is essential in creating cheminformatics systems that work well across a [broad range of platforms and output formats](/articles/2007/11/27/chemwriter-chemical-structures-and-the-web).
