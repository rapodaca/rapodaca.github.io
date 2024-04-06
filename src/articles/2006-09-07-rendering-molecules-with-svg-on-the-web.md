---
title: "Rendering Molecules with SVG on the Web"
published: "2006-09-07T00:00:00.000Z"
---

<a href="http://www.w3.org/Graphics/SVG/">Scalable Vector Graphics</a> (SVG) is an XML-based language for encoding graphical content. Unlike raster image formats such as PNG, JPEG, and GIF, SVG images can be scaled to any resolution without pixelation. Given that 2-D structure diagrams are essentially line drawings, SVG seems like a natural fit for this type of representation. SVG also boasts several advanced features that make it an especially intriguing choice.

In this first article of a series on SVG and chemical informatics, I'll start by showing some embedded SVG images of molecules (also see <a href="http://www.adobe.com/svg/demos/devtrack/chemical.html">this demo</a>). Later articles will discuss technical details such as writing, reading, animating, scripting, editing, annotating, and distributing 2-D structures encoded as SVG.

# Now, the Bad News

SVG is a work in progress. Browser support and performance can vary widely. If you are using <a href="http://www.mozilla.com/firefox/">Firefox</a> version 1.5 or better, you should be able to see all of the images in this article without doing anything.

Unfortunately for Internet Explorer users, Microsoft's browser lacks built-in SVG support. Still worse, IE 7 appears ready to continue this perplexing tradition. Fortunately, Adobe offers an <a href="http://www.adobe.com/svg/viewer/install/main.html">SVG plugin for IE</a>.

Although this page was tested in both IE 6 (with Adobe's plugin) and Firefox 1.5 (both Windows and Linux), your particular configuration may vary. Please feel free to post your experiences.

# Some Simple SVG Structures

The examples below illustrate how SVG images of molecules can be embedded in an HTML document. These images just scratch the surface of what is possible. If you don't see 2-D structures, your browser may lack SVG support.

![Ascorbic Acid](/images/posts/20060907/ascorbic_acid.svg)

![Alprazolam](/images/posts/20060907/alprazolam.svg)

![Furosemide](/images/posts/20060907/furosemide.svg)

![DDT](/images/posts/20060907/ddt.svg)

*Note: if you're viewing this article in a feed aggregator, the SVG images may have been stripped out. If so, please see the <a href="http://depth-first.com/articles/2006/09/07/rendering-molecules-with-svg-on-the-web">original article</a>.*