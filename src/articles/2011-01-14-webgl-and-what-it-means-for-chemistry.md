---
title: "WebGL and What It Means for Chemistry"
published: "2011-01-14T00:00:00.000Z"
---

Most chemists have used one or more 3D molecular visualization tools in their careers. They can be valuable assets in understanding structure-function relationships in a range of contexts. [The first 3-D molecular visualization system](/articles/2006/11/02/stone-knives-and-bear-skins/) ([the "Kluge"](http://www.umass.edu/molvis/francoeur/levinthal/lev-index.html)) was built in the mid 1960's by Cyrus Levinthal using a combination of oscilloscope graphics and a dome-like controller. Today these tools are offered in a wide variety of styles and with many different capabilities.

# 3D Visualization, Chemistry, and the Web

Most 3D tools in widespread use have been designed around the desktop. Readers of this blog will recognize a [longstanding thesis](/articles/2006/11/20/unchaining-chemistry-from-the-desktop/): the dominant software development paradigm in chemistry will shift from the desktop to the Web browser. This shift has been years in the making and will likely take a few more years before it becomes widely-recognized and acted on. One challenge is the lack of browser-based data visualization and analysis tools with performance characteristics approaching the capabilities of desktop software.

To be sure, there are web-based in-browser viewers for 3D chemical structures. One of the best-known is [Jmol](http://jmol.sourceforge.net/). But Jmol's technology platform, Java applets, has not held up well over the years. User-side configuration issues, security concerns, long startup times, neglect by Sun Microsystems, and generally poor and inconsistent browser integration are just a few of the problems plaguing this technology. The lack of support for applets on emerging computing platforms such as iPad and Adroid bodes poorly for the long-term viability of the entire concept.

# New Directions

An intriguing new direction in 3D chemical visualization tools is exemplified by [TwirlyMol](https://github.com/baoilleach/twirlymol) and [Jolecule](http://jolecule.appspot.com/). Requiring no plugins and leveraging the ability of SVG/VML vector graphics or the HTML5 canvas tag, these viewers offer an interesting alternative. But unlike desktop-based viewers, these viewers generate 3D graphics from 2D primitives. The approach works, but at a cost.

Desktop software can exploit very powerful 3D graphics rendering frameworks, including OpenGL. What about the browser?

# WebGL

Until very recently, there was no support for 3D rendering in browsers - you rolled your own from 2D graphics, as is done in TwirlyMol and Jolecule. The introduction of [WebGL](http://www.khronos.org/webgl/) may change all of this. From the homepage:

>WebGL is a cross-platform, royalty-free web standard for a low-level 3D graphics API based on OpenGL ES 2.0, exposed through the HTML5 Canvas element as Document Object Model interfaces. Developers familiar with OpenGL ES 2.0 will recognize WebGL as a Shader-based API using GLSL, with constructs that are semantically similar to those of the underlying OpenGL ES 2.0 API. It stays very close to the OpenGL ES 2.0 specification, with some concessions made for what developers expect out of memory-managed languages such as JavaScript.

In other words, WebGL aims to do for the browser what OpenGL did for the desktop. And at least one company, [iChemLabs](http://www.ichemlabs.com/) is now offering [a WebGL-based 3D molecular viewer](http://web.chemdoodle.com/examples/3d-structure-canvases).

# First Step: Get a WebGL Browser

Preview versions of Firefox, Safari, and Chrome have begun to support WebGL, with varying levels of hoop-jumping required by the user. I decided to try out the [Firefox 4 Beta](http://www.mozilla.com/en-US/firefox/beta/) on OS X and found the WebGL support to be: (1) automatically enabled by default without anything else to be done; and (2) very good.

# Second Step: Find Some Demos

1.  [Kronos WebGL Demo Repository](http://www.khronos.org/webgl/wiki/Demo_Repository)
2.  [Google Chrome WebGL Experiments](http://www.chromeexperiments.com/webgl)
3.  [MolGrabber 3D Canvas](http://web.chemdoodle.com/examples/3d-structure-canvases/molgrabber3d-canvas)

# Third Step: Learn WebGL

1.  [Learning WebGL Blog](http://learningwebgl.com/blog/)
2.  [WebGL Public Wiki](http://www.khronos.org/webgl/wiki/Main_Page)

# Fly in the Ointment

Before getting too excited about WebGL, it might be worth considering to what extent Microsoft is likely to support this new technology. The IE9 beta currently lacks WebGL support and [Microsoft's silence on the issue](http://blogs.msdn.com/b/ie/) doesn't inspire confidence. Even more discouraging, Microsoft has a long and well-documented history of going its own way in these matters. 3D graphics acceleration may be coming to IE, but it may take the form of a competitor to WebGL, requiring yet another round of JavaScript facade building.

# Conclusions

Fast 3D graphics are coming soon to all browsers. As this technology continues to evolve, the case for building fully-integrated chemical informatics and visualization suites based exclusively on Web browsers will become ever more compelling.