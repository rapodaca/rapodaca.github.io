---
title: The Other Vector Graphics Markup Language
published: "2008-06-06T00:00:00.000Z"
---

[Scalable Vector Graphics](http://en.wikipedia.org/wiki/Scalable_Vector_Graphics) (SVG) is a technology that enables the creation and publication of high quality images that can be scaled to any resolution. SVG is ideally suited for the Web, and all major browsers now support it - except Internet Explorer (IE). This poses a problem: vector graphics are by far superior to raster images for many applications, but the lack of native IE support makes SVG a non-starter for most developers. This article discusses a little known IE capability that might provide a solution.

# Oh Brother, Where Art Thou?

Way back in 1998 a group of companies including Microsoft submitted a proposal for a vector graphics language called [Vector Markup Language](http://www.w3.org/TR/1998/NOTE-VML-19980513) (VML) to the W3C. This set in motion a series of events that culminated in the development of what we know today as SVG. But while use of SVG quickly expanded, VML remained almost exclusively limited to Microsoft products.

Soon after, IE 5 [introduced the ability](http://www.infoloom.com/gcaconfs/WEB/granada99/wu.HTM) to decode and display VML - a capability that exists today in IE 7.

SVG and VML are two vector graphics languages, each designed to do essentially the same thing. For basic shape rendering, their similarities outweigh their differences.

# About VML

To understand why VML never caught on, you need look no further than the documentation - or the lack thereof. The [original VML submission](http://www.w3.org/TR/1998/NOTE-VML-19980513) is a decade old and has not been updated.

For the most part, VML documentation is scattered and incomplete. Nevertheless, there are some useful resources. Here, in no particular order are some of them:

-  [Microsoft Documentation](http://msdn.microsoft.com/en-us/library/bb250524\(VS.85\).aspx) Authoritative, but lacking in examples.
-  [VML, SVG, and Canvas](http://weborama.blogspot.com/2006/01/vml-svg-and-canvas.html) Discusses some of the differences between VML and SVG.
-  [Cum mortuis in lingua mortua](http://www.robweir.com/blog/2006/07/cum-mortuis-in-lingua-mortua.html) Good history of VML.
-  [Examples of the Vector Markup Lanugauge](http://www.sjsu.edu/faculty/watkins/vml.htm) There are far too few of this kind of site.
-  [VectorConverer](http://vitali.web.cs.unibo.it/Progetti/VectorConverter)
A PHP library that uses XSLT to interconvert SVG and VML. Unfortunately, the stylesheet didn't work in my hands under [Xalan](http://vitali.web.cs.unibo.it/Progetti/VectorConverter) or Ruby/xslt - and I know almost nothing about PHP.
-  [Julie Nabong's Masters Thesis](http://www.cs.sjsu.edu/faculty/pollett/masters/Semesters/Fall03/JulieNabong/index.shtml?cs298proposal.html) Julie wrote and documented an SVG/VML XSLT for interconverting the two languages.

# JSDrawing: Interconverting Vector Languages on the Fly

One VML resource deserves special note - [JSDrawing](http://www.kevlindev.com/projects/jsdrawing/index.htm). This library seems to be capable of generating Flash, VML, or SVG from a common vector graphics language precursor. I'm not sure how practical this approach would be, but it does provide some food for thought.

# Why It Matters

Chemistry is in a good position to take advantage of vector graphics. Chemical structures, being closely based on graph theoretical constructs, would seem to be a perfect match for vector languages like SVG and VML, especially on the Web. So far it hasn't happened, primarily for the reasons outlined above.

Currently, if you want to display 2D chemical structures in Web pages you're faced with some tradeoffs:

1.  **Raster Images.** This is by far the most common practice. This option unfortunately makes it very difficult to redesign the layout of a site or support multiple views of the same structure, especially with databases of one million plus compounds becoming commonplace. Even if images are never regenerated, they need to be stored and retrieved, adding to cost and complexity. Images could be dynamically generated, but at the expense of substantial memory and CPU requirements.
2.  **Applets.** This is the approach currently taken by [Chempedia](http://chempedia.com), the free chemical encyclopedia, and gives complete flexibility in page layout and structure appearance. Changing the dimensions of a structure is as simple as changing the size of a div. Unfortunately, some browsers handle multiple applets better than others. Firefox on OS X is very slow at refreshing applets while scrolling, and IE requires a [Javascript trick](/articles/2007/11/02/eolas-and-jactivating-working-around-a-workaround) to remove the 'click to active' message that causes some flashing when in progress.
3.  **Vector Graphics Through Plugins** There are at least two SVG plugins for IE ([one by Adobe](http://www.adobe.com/svg/viewer/install/main.html) and [the other from Examotion](http://www.examotion.com/index.php?id=product_player)). Will all of your users be able to find and install them? Unless the answer to both questions is 'yes', this option is probably best left as a last resort. Another option is to render SVG on IE through the Flash or [Silverlight](http://silverlight.net/) plugins. But as far as I can tell, neither approach is ready for prime-time.
4.  **Native Vector Graphics** Available on all major browsers including Internet Explorer 5/6/7, Firefox 1/2, and Opera 8/9. Combines the flexibility, lossless depiction, inlineability and low data storage/retrieval overhead of applets with the speed of images. Interactivity and other special effects can be achieved through DOM manipulation. All of this depends, of course, on the vector graphics format being compatible with the rendering engine.

In some circumstances, serving VML to IE clients and SVG to everyone else would be a viable option - if it were possible to generate VML.

# Conclusions

Vector graphics have a lot to offer chemistry, especially when used with Web applications. The combination of VML and SVG offers a proven technology platform that's ready today, but only if you can generate VML.
