---
title: Chemistry, The Web, and Netflix
published: "2008-06-11T00:00:00.000Z"
---

If you've ever rented movies from [Netflix](http://netflix.com), you've probably noticed the information box that pops up when you hover over a movie image. If you just want a quick peek at what a movie is all about, this simple feature can save a great deal of time and effort in mousing around, clicking, and general navigation annoyance. It turns out that chemical compounds have a lot in common with movies in that they both can be referred to through one or more identifiers and they both have a lot of interesting metadata linked to them. This article shows that what works for Netflix can also work for chemistry.

# The Problem

Interpreting IUPAC nomenclature and references to compound numbers is a major chore when working with chemistry experimental sections. When paper documents are used, this typically involves flipping pages back and forth many times between the narrative and the experimental section. With Web documents, this is usually either impossible or very inconvenient, and so the PDF is printed to paper.

# A Demonstration

The following text is an edited and re-formatted passage taken from [the experimental section](http://www.beilstein-journals.org/bjoc/content/supplementary/1860-5397-4-5-S1.doc) of [a paper](http://dx.doi.org/10.1186/1860-5397-4-5) published in [*Beilstein Journal of Organic Chemistry*](http://www.beilstein-journals.org/bjoc/home/home.htm). If you hover over any hyperlink for half a second or more, a balloon will pop up showing you the chemical structure of the substance being referred to. Mousing away from the link hides the balloon.

\[Demo Scrubbed\]

This demo has been tested on Internet Explorer 6/7, Firefox 2, and Safari 3.

# Technologies

Although this demonstration is built on numerous Web technologies, two are at the top of the stack: the vector graphics rendering engine of [ChemWriter](http://metamolecular.com/chemwriter) and the open source Javascript library [Balloon.js](http://www.gmod.org/wiki/index.php/Popup_Balloons).

Chemical structures are displayed as lightweight Adobe Flash SWF files, as described in a [previous Depth-First article](/articles/2008/06/10/adobe-flash-for-cheminformatics-fast-scalable-and-attractive-2d-depiction-of-chemical-structures-with-vector-graphics). Software based on ChemWriter converts a molecular connection table into vector graphics commands for the Flash runtime with the help of the open source [Transform SWF](http://www.flagstonesoftware.com/transform/) library.

# Playing to the Web's Strengths

The Web is a new medium with a completely different set of rules compared to print media. One of its biggest strengths is interactivity: the ability to see something of interest and to immediately be able to find out more about it. One of its biggest weaknesses, even today, is technology standards. It's not enough to create interactivity; that interactivity must also fit within the technical constraints imposed by a medium that is still a work in progress.

As journal publishers and others grapple with [how to approach](/articles/2008/05/08/building-a-unique-chemistry-journal-responses-to-questions-from-nature-chemistry) the inevitable transition to purely Web-based scientific communication, it's important to keep both the strengths and limitations of the Web in mind. To date, nearly all attempts to create Web-based versions of chemistry journals have simply tried to duplicate the form of the print medium. This has resulted, if anything, on an even greater reliance on paper, resulting in valuable information being used well below its full potential.

# Conclusions

This article has demonstrated a simple labor-saving technique in which chemical structures can be visualized by hovering the cursor over specially-designated chemical identifiers. There's quite a bit more that can be done with chemical vector graphics, chemical information, and Web technologies commonly used in consumer services like Netflix. Future articles will discuss some possibilities.

[Flash content scrubbed]
