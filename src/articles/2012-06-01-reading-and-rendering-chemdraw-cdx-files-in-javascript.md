---
title: "Reading (and Rendering) ChemDraw CDX Files in JavaScript"
published: "2012-06-01T00:00:00.000Z"
---

About four years ago I speculated that [JavaScript may be capable of filling some important holes in chemistry software](/articles/2008/07/15/javascript-for-cheminformatics/). Since then, a number of important events have taken place to move JavaScript onto center stage as a programming language, including the [release of Chrome](/articles/2008/09/05/chrome-and-a-v8-javascript-takes-a-giant-leap-forward/) with its huge JavaScript performance increases and rocket trajectory to overtake IE as the most popular browser, the runaway success of iOS as a computing platform free of browser plugins, the renaissance of server-side JavaScript through [Node.js](/articles/2010/10/02/node-js/) and other frameworks, and a dazzling array of languages like [CoffeeScript](http://coffeescript.org/) that compile to JavaScript.

JavaScript for cheminformatics has started to look a lot less improbable as well. In late 2010, my company began distributing the first copies of its chemical structure editor [ChemWriter](http://metamolecular.com/chemwriter/) - a complete rewrite of the original Java applet in JavaScript. Following this, we released the plugin- and server-free chemical structure rendering package [ChemVector](http://metamolecular.com/chemvector/). Other companies now offer products in this space as well, with indications that big players are now starting to take notice.

This article highlights a small part of some work I'm now doing that demonstrates the readiness of JavaScript to solve difficult cheminformatics problems.

# Demo: Read a ChemDraw File

Given an arbitrary binary ChemDraw CDX file, it's now possible to print out the encoded object graph in a JavaScript console. For example, [this file](/images/posts/benzene.cdxx) generates this output:

```bash
Document 0 [0x0000]
  Creation Program:ChemDraw 12.0.3.1216
  Name:benzene.cdx
  Font Table:Windows fonts: Font[id:20, characterSet: 10000, name: Times],Font[id:21, characterSet: 10000, name: Helvetica]
  Bounding Box:(10444645t, 6456556r, 14452480b, 9927443l)
  Color Table:Color[red: 65535, green: 65535, blue: 65535],Color[red: 0, green: 0, blue: 0],Color[red: 65535, green: 0, blue: 0],Color[red: 65535, green: 65535, blue: 0],Color[red: 0, green: 65535, blue: 0],Color[red: 0, green: 65535, blue: 65535],Color[red: 0, green: 0, blue: 65535],Color[red: 65535, green: 0, blue: 65535]
  Foreground Color:0
  Background Color:1
  Atom Show Query:true
  Atom Show Stereo:false
  Atom Show Atom Number:false
  Atom Show Terminal Carbon Labels:true
  Atom Show Non-Terminal Carbon Labels:true
  Atom Hide Implicit Hydrogens:true
  Atom Show Enhanced Stereo:true
  Bond Show Query:true
  Bond Show Stereo:false
  Bond Show Reaction:true
  Interpret Chemically:true
  Mac Print Info:0,3,0,0,2,208,2,208,0,0,0,0,29,254,22,246,255,134,255,136,30,118,23,112,3,103,5,40,3,252,0,2,0,0,0,72,0,72,0,0,0,0,2,216,2,40,0,1,0,0,0,100,0,0,0,1,0,3,3,3,0,0,0,1,39,15,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,104,0,0,25,1,144,0,0,0,0,0,32,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
  Print Margins:(2359296t, 2359296r, 2359296b, 2359296l)
  Chain Angle:7864320
  Bond Spacing:120
  Bond Length:1966080
  Bold Width:262144
  Line Width:65536
  Margin Width:131072
  Hash Spacing:176896
  Label Style:Font Style [id: 21 type: 96 size: 200 color: 3]
  Caption Style:Font Style [id: 20 type: 0 size: 240 color: 3]
  Caption Justification:0
  Fractional Widths:true
  Label Justification:5
  ? [828]: unknown
  ? [829]: unknown
  ? [82a]: unknown
  Window is Zoomed:true
  Window Position:(3997696, 4915200)
  Window Size:(38731776, 50528256)
  Page 43 [0x002b]
    Bounding Box:(0t, 0r, 47179366b, 35389440l)
    Width Pages:1
    Height Pages:1
    Header Position:2359296
    Footer Position:2359296
    Print Trim Marks:true
    Fragment 27 [0x001b]
      Bounding Box:(10444645t, 6456556r, 14452480b, 9927443l)
      Node 24 [0x0018]
        Z Order:1
        Position 2D:(6489324, 11465523)
        Atom CIP Stereochemistry:1
      Node End
      Node 26 [0x001a]
        Z Order:3
        Position 2D:(6489324, 13431603)
        Atom CIP Stereochemistry:1
      Node End
      Node 28 [0x001c]
        Z Order:5
        Position 2D:(8192000, 14414643)
        Atom CIP Stereochemistry:1
      Node End
      Node 30 [0x001e]
        Z Order:7
        Position 2D:(9894675, 13431603)
        Atom CIP Stereochemistry:1
      Node End
      Node 32 [0x0020]
        Z Order:9
        Position 2D:(9894675, 11465523)
        Atom CIP Stereochemistry:1
      Node End
      Node 34 [0x0022]
        Z Order:11
        Position 2D:(8192000, 10482483)
        Atom CIP Stereochemistry:1
      Node End
      Bond 36 [0x0024]
        Z Order:13
        Bond Order:2
        Bond Double Position:1
        Bond Begin:24
        Bond End:26
        Bond Bond Ordering:41,0,0,37
      Bond End
      Bond 37 [0x0025]
        Z Order:14
        Bond Begin:26
        Bond End:28
        Bond CIP Stereochemistry:1
      Bond End
      Bond 38 [0x0026]
        Z Order:15
        Bond Order:2
        Bond Double Position:1
        Bond Begin:28
        Bond End:30
        Bond Bond Ordering:37,0,0,39
      Bond End
      Bond 39 [0x0027]
        Z Order:16
        Bond Begin:30
        Bond End:32
        Bond CIP Stereochemistry:1
      Bond End
      Bond 40 [0x0028]
        Z Order:17
        Bond Order:2
        Bond Double Position:1
        Bond Begin:32
        Bond End:34
        Bond Bond Ordering:39,0,0,41
      Bond End
      Bond 41 [0x0029]
        Z Order:18
        Bond Begin:34
        Bond End:24
        Bond CIP Stereochemistry:1
      Bond End
    Fragment End
  Page End
Document End
```

For background, see previous D-F articles on the [ChemDraw CDX file format](/articles/2010/09/13/a-brief-introduction-to-the-chemdraw-cdx-file-format/) and the [CDX HexDumper utility](/articles/2010/09/21/making-sense-of-the-chemdraw-cdx-file-format-with-cdxhexdumper/).

Being able to visualize the contents of arbitrary CDX files this way is an important aid to debugging and a prerequisite to developing full-featured graphical display capability.

# Why Read ChemDraw Files in JavaScript?

It's a pretty safe bet that any organic chemist who has written a report, submitted a journal manuscript, or filed a patent has used ChemDraw. As a result, ChemDraw files are everywhere in chemistry.

If you've spent any time watching how chemists work, the need to manipulate CDX files may be obvious. Even so, I'd like to offer a specific example taken from a recent project that illustrates that the need to work with CDX files can come from some unlikely places.

[Reagents](/articles/2012/05/21/why-organic-chemistry-is-like-facebook/) is iOS Organic Chemistry reference app that I co-developed with [James Ashenhurst](http://masterorganicchemistry.com/). It makes heavy use of ChemDraw CDX files to display structures and reaction schemes.

These structures and reactions schemes are automatically pre-rendered through [AppleScript automation of the ChemDraw application](http://metamolecular.com/blog/2011/07/18/chembot-convert-chemdraw-cdx-files-into-png-images-using-applescript/). Although this works, it's far from optimal. For example, Reagents runs on iPad 3 (retina) displays. To prevent pixellation, our horizontal resolution measures in the thousands of pixels. The large size of the resulting images means more storage space and longer download times. But the biggest problem lies in the fact that every time we make changes to these ChemDraw files, we must regenerate the corresponding raster image.

It would be so much better to dynamically render these ChemDraw files inside an iOS UI element such as [UIWebView](http://developer.apple.com/library/ios/#documentation/uikit/reference/UIWebView_Class/Reference/Reference.html).

We'd also like to do interesting things with the ChemDraw files themselves. I won't spill the beans here, but suffice it to say that if we're successful you'll be seeing one or more new iOS apps that repurpose the Reagents content in some interesting ways.

Yet another use case for a pure JavaScript CDX reader and display component would be in interfacing the system clipboard with a paste target in a Web page. [ChemWriter](http://metamolecular.com/blog/2012/05/29/ie9-error-when-pasting-from-chemdraw-to-chemwriter-and-a-fix/) currently supports this capability on Windows, but there's much more we could do.

# Larger Vision

JavaScript has established a strong foothold in every area of modern computing: tablets; mobile; web browser; and server. But at the same time, there is no full-featured cheminformatics platform, commercial or otherwise, for building chemistry software in JavaScript.

We have many of the components for such a platform, but they're spread over different products and applications. Having been developed over the course of a couple of years, the code itself show signs of needing a refresher. A unified, well-designed JavaScript platform centralizing core cheminformatics functionality would be a valuable asset in the continued development of useful tools and applications.

Given the centrality of the CDX file format in chemistry, we're starting there first.