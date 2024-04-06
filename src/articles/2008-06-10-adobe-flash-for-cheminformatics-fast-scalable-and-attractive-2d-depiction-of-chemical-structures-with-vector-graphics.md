---
title: Adobe Flash for Cheminformatics - Fast, Scalable, and Attractive 2D Depiction of Chemical Structures with Vector Graphics
published: "2008-06-10T00:00:00.000Z"
---

The previous article in this series [discussed the use of vector graphics markup languages for cheminformatics](/articles/2008/06/06/the-other-vector-graphics-markup-language), in particular for the display of 2D chemical structures. Although vector graphics are well-suited for creating responsive and appealing cheminformatics Web applications, the lack of universal native browser support makes both [Scalable Vector Graphics](http://en.wikipedia.org/wiki/Scalable_Vector_Graphics) (SVG) and its cousin [Vector Markup Language](http://www.w3.org/TR/1998/NOTE-VML-19980513) (VML) unattractive at this time. This article highlights Adobe Flash as a 2D chemical structure renderer for Web applications, and features a fully-functional proof of concept based on the [ChemWriter](http://metamolecular.com/chemwriter) rendering engine.

# About Adobe Flash

Although Adobe Flash is practically an industry unto itself today, at it's core, Flash is a lightweight vector graphics renderer. Introduced in 1996, the Flash Player can be found on millions of Internet-enable devices today. According to a [study by Adobe](http://www.adobe.com/products/player_census/flashplayer/), the Flash Player was running on nearly 99% of Internet-enabled desktops as of March 2008. The player has also found its way onto a host of handheld devices and phones.

Many technologies have been layered on top of the Flash Player. One of the first was the [ActionScript](http://www.adobe.com/devnet/actionscript/articles/actionscript3_overview.html) scripting language. More recently, Adobe has introduced [Flex]( /articles/2007/05/25/flex-rich-internet-applications-and-cheminformatics), a full-fledged application development framework.

Unlike SVG and other vector graphics systems, Flash is ready today, proven, and about as close to universal as is possible on the Web. If you want to do vector graphics on the Web with the most convenient user and developer experience, Flash is your tool.

But what can Flash do for cheminformatics?

# A Demonstration

The table below is composed of twelve cells, each of which display a chemical structure through the Flash Player.

<style type="text/css">
  .cells a {display: block; text-align: center;}
</style>

[Flash content scrubbed]


Several points are worth mention:

1.  Each of the structures can be zoomed by clicking on its 'zoom' link.
2.  Each cell contains a lightweight embedded "SWF" file, or "ShockWave File," and the zoomed view displays exactly the same file. No matter how the SWF file is resized, it will always be proportionally-scaled to its smallest dimension and centered.
3.  The size of each SWF file ranges from a low of 563 bytes to a high of 8.5 KB, with an average of around 1.5KB. The larger the molecule, the more space is required. A comparable PNG with a resolution of 150x150 pixels would require on average for each structure about 6-8 KB.
4.  Each image was generated from a molfile using a development version of the [ChemWriter](http://metamolecular.com/chemwriter) rendering engine via the open source [Transform SWF](http://www.flagstonesoftware.com/transform/) Java toolkit.
5.  SWF Files, unlike applets, are highly optimized for multiple instance display on all major platforms and browsers. In every case, startup will be nearly instantaneous and scrolling will be smooth. The performance of Flash should be at least as good as, if not better than, raster images.

# The Right Tool for the Job (is Probably not a Raster Image)

One of the first challenges developers of cheminformatics Web applications are faced with is how to render 2D chemical structures. For an overview of the technologies now in use, see the [previous article](/articles/2008/06/06/the-other-vector-graphics-markup-language) in this series. Each option has its own set of trade-offs.

The most widely-used 2D structure rendering option, raster images, is both inflexible and inefficient. Unlike a vector image, a raster image by definition has only one resolution, which is fixed at creation time. If image dimensions need to change, then all structures must be re-imaged. Given the size of many of today's [chemistry databases](/articles/2007/01/24/thirty-two-free-chemistry-databases), such a system-wide re-imaging of structures can involve a non-trivial amount of processor power and bandwidth.

To compensate, many sites store relatively large images, say 300x300 pixel, and then use the HTML <code>&lt;img&gt;</code> tag to shrink it as needed. But this creates problems of its own: both storage and bandwidth requirements are far larger than they need to be, resulting in the need for more powerful server hardware and poorer application scalability. And then there are the application's users, who must wait through a 30KB or higher download for each 2D image.

A significant number of structures in any compound collection will be so large that even a 300x300 pixel image will be insufficient to render the necessary detail. For example, [a recent Depth-First article](/articles/2008/05/19/building-chempedia-resizable-structures-with-chemwriter) discussed a vector graphics solution this problem within the context of [Chempedia](http://chempedia.com), the free chemical encyclopedia. Vector graphics simply eliminate this issue.

Many cheminformatics applications would benefit from being able to show 50 or more structures at a time, with each structure having a zoom view for closer inspection. To a non-chemist, this might seem unnecessary. But for today's chemists dealing with large chemical catalogs and high-throughput screens, it's not only possible, but a routine part of the practice of chemistry. The raster image approach makes it extremely difficult to meet this important need on the Web. Vector graphics, possibly delivered through the Flash Player, offer a much simpler and more efficient way to do it.

2D chemical structures are vectorial in nature; using raster images to depict them is in most cases the more costly and lower quality option.

# Summary

Vector graphics are a near-perfect match for the job of depicting 2D chemical structures on the Web. Although there are many vector graphics platforms to choose from, the Flash Player is by far the most universal option. This article has demonstrated a working example of multiple 2D chemical structures rendered as lightweight vector images via the Adobe Flash Player, the first and only such demonstration of which I'm aware.

The key technologies behind this demonstration are the [ChemWriter](http://metamolecular.com/chemwriter) rendering engine and the open source Flash developer toolkits available from [Flagstone Software](http://www.flagstonesoftware.com/transform/). If you're interested in learning more about how vector graphics and Flash can improve both the user and developer experience in your cheminformatics Web applications, I'd be happy to <a href="http://mailhide.recaptcha.net/d?k=01_5KIPZyZx-bysSnY0HEqIw==&amp;c=9ppCEFFs3OESfeieiRz1LAgTPkQmMhWOQm4RKDRkFI8=" onclick="window.open('http://mailhide.recaptcha.net/d?k=01_5KIPZyZx-bysSnY0HEqIw==&amp;c=9ppCEFFs3OESfeieiRz1LAgTPkQmMhWOQm4RKDRkFI8=', '', 'toolbar=0,scrollbars=0,location=0,statusbar=0,menubar=0,resizable=0,width=500,height=300'); return false;" title="Reveal this e-mail address">hear from you</a>.
