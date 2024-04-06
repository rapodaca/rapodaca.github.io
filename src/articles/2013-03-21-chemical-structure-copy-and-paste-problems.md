---
title: "Chemical Structure Copy and Paste Problems"
summary: "Chemical structure editor play a vital role in chemistry today as a bridge between chemists and their software. In particular, written communication taking the form of reports, patents, and publications very often requires both a structure editor (e.g., ChemDraw) and a word processor (e.g., Word)."
disqus: true
published: "2013-03-21T00:00:00.000Z"
---

[Chemical structure editors](http://metamolecular.com/chemwriter/articles/the-chemical-structure-editor-bridging-chemistry-and-cheminformatics/) play a vital role in chemistry today as a bridge between chemists and their software. In particular, written communication taking the form of reports, patents, and publications very often requires both a structure editor (e.g., ChemDraw) and a word processor (e.g., Word).

During preparation of a document, it's essential that the graphical chemistry content be just as editable as the text itself. To make this happen, the structure editor and word processor need to work together, despite not being specifically designed to do so. The process of moving a chemical structure or drawing from a structure editor to a word processor and back is called "round trip editing".

This article is a short compilation of some of the round trip editing problems that have been reported while trying to get structure editors and word processors to play nice together.

# Know Your Software

Three major pieces of software come into play for round trip editing: (1) the structure editor; (2) the word processor; and (3) the operating system (mainly through its system clipboard). Although most widely-used and best-understood system has for years been ChemDraw and Word on Windows, many other combinations have been tried with varying degrees of success.

# ChemDraw and Word on Windows

ChemDraw and Word have a long history together, and it hasn't always been smooth sailing. A small selection of issues includes:

- [Embedded ChemDraw files in MSoffice 2010 Word (2012)](http://pipeline.corante.com/archives/2012/11/26/chemistry_software_questions_here.php#1122372)
- [Receiving error in Word 2010 (2011)](http://forums.cambridgesoft.com/messageview.aspx?catid=12&threadid=1445&l=en)
- [Problems with Microsoft Word (2011)](http://forums.cambridgesoft.com/messageview.aspx?catid=12&threadid=1312&l=en)
- [Can't paste from ChemDraw 12.0.2 to Word 2010 ](http://forums.cambridgesoft.com/messageview.aspx?catid=12&threadid=419)
- [How come when I paste a ChemDraw Object from Word 2010 into ChemDraw I receive an error stating that the object does not fit on the page and is then placed as an image? (2010)](http://www.cambridgesoft.com/support/DesktopSupport/KnowledgeBase/FAQ/details/Default.aspx?TechNote=1127)
- [In my Word document, the embedded ChemDraw structures are disappeared. Instead of ChemDraw structures, it shows {EMBED ChemDraw.Document.6.0}. How can i fix this issue? (2010)](http://www.cambridgesoft.com/support/DesktopSupport/KnowledgeBase/FAQ/details/Default.aspx?TechNote=1114)
- [Chemdraw - Word 2008 integration (2009)](http://forums.cambridgesoft.com/messageview.aspx?catid=12&threadid=23&l=en)
- [Word 2007 crashing when trying to edit chemdraw 12.0 figures (2009)](http://forums.cambridgesoft.com/messageview.aspx?catid=12&threadid=163&l=en)

Although there are indications that subsequent releases of either Word or ChemDraw may have resolved at least some of these reported issues, the cost of upgrading can be significant.

# Mac: Second-Class Citizen

If like many chemists you use a Mac, you've clearly exchanged one software component - the operating system. What may not be clear is that in doing so you've also swapped the drawing package and word processor as well. Although Word and ChemDraw for Mac may appear on the surface to be the same applications, differences large enough to prevent round trip editing have surfaced many times over the years and still perplex users today.

A small selection of online discussions around ChemDraw-Word integration on OS X includes:

-  [The Continuing saga of ChemDraw and MS Office (2012)](http://chemistryandcomputers.wordpress.com/2012/03/15/the-continuing-saga-of-chemdraw-and-ms-office/)
-  [Chemdraw and MS Word Problem (2011)](https://discussions.apple.com/thread/3188692?start=0&tstart=0)
-  [Word 2011 for Mac Doesn't Support ChemDraw Round Trip Editing. Again! (2010)](http://www.macresearch.org/word-2011-mac-doesnt-support-chemdraw-round-trip-editing-again)
-  [A summary of testing and options (2009)](http://forums.cambridgesoft.com/messageview.aspx?catid=12&threadid=176)
-  [No copy-paste between Word 2008 and ChemDraw (2008)](https://groups.google.com/forum/?fromgroups=#!topic/microsoft.public.mac.office/PRw0uPwTgco)

Apparently, round-trip editing of chemical structures on OS X became such a prominent support issue that Microsoft itself saw the need to [make a statement](http://blog.officeformac.com/an-engineering-solution-for-copy-paste-interoperability-between-office-for-mac-and-chemdraw/) in 2010. Although the statement suggested that the issue has resolved, bug reports continue.

Many Mac users avoid Word altogether and use Apple's own [Pages](http://www.apple.com/iwork/pages/). Unfortunately, support for round trip editing in these applications even more spotty than with Word. For example:

- [Pasting from ChemDraw into Pages/Keynote (2009)](https://discussions.apple.com/thread/2150941?start=0&tstart=0)
- [ChemDraw 12.0.1 on Snow Leopard (2009)](http://forums.cambridgesoft.com/messageview.aspx?catid=12&threadid=159)
- [Please complain (2009)](http://www.macinchem.org/blog/files/774bd6dc2171602ed0716b02a54a55a5-419.php)

My own test confirmed that structures pasted from ChemDraw 12.0.3.1216 into Pages 4.3 (1048) on OS X 10.7.5 can not be pasted back into ChemDraw.

![Round Trip Fail](/images/posts/chemdraw-pages-round-trip-fail.png "Round Trip Fail")

# Linux: Not for the Faint of Heart

Linux is the third most widely-used desktop operating system, with its most popular incarnation being [Ubuntu](http://www.ubuntu.com/). The attraction is clear - Ubuntu is free and boasts a huge set of free applications that's evolved over the last several years.

However, Ubuntu appears to be only marginally closer to offering a viable alternative to chemists in 2013 than it did in 2007. A forum post in 2007 titled [Obstacle for chemists to use Ubuntu = ChemDraw](http://ubuntuforums.org/showthread.php?t=411537) generated a discussion that lasted five years, drawing 148 replies along the way.

# Open Office: Broken by Default

Leaving the topic of operating systems aside, there are many options for word processors. [Open Office Writer](http://www.openoffice.org/product/writer.html) is an extremely popular free option that's available on Windows, Mac, and Linux. Nevertheless, round trip editing of chemical structures has apparently never worked on any operating system using ChemDraw and Open Office.

A [2007 Open Office bug report](https://issues.apache.org/ooo/show_bug.cgi?id=81512) described the problem this way:

> When a chemical drawing is copied from ChemDraw onto clipboard, and then pasted into Writer, it get pasted as a low resolution bitmap. In Edit -> Paste Special menu the only option is "bitmap" (source "unknown"). 

This report was subsequently marked as a duplicate of [another bug dating to 2003](https://issues.apache.org/ooo/show_bug.cgi?id=14907).

In my own tests, structures pasted from ChemDraw 12.0.3 into Open Office Writer 3.4.1 on either OS X or Windows resulted in low-resolution images that could not be in turn pasted back into ChemDraw.

<img src="/images/posts/chemdraw-openoffice.png" class="figure">

# Other Drawing Packages

A number of desktop chemical drawing packages have been recommended as replacements for ChemDraw over the years, including:

-  [Marvin Sketch](http://www.chemaxon.com/products/marvin/marvinsketch/)
-  [BKChem](http://bkchem.zirael.org/)
-  [ChemDoodle](http://www.chemdoodle.com/)

However, it's understandably more difficult to find public information on the round-trip editing capabilities of these less-popular programs across numerous combinations of operating systems, word processors, and specific versions of each. The best answer would appear at this point to be: try one and see.

# Conclusions

Round trip editing remains an essential capability for many chemists today. Although sticking within a narrow band of software components generally gives good results, straying outside this configuration can lead to problems quickly.

My current work with [ChemWriter](http://metamolecular.com/chemwriter/) has led me to ask to what extent round-trip editing of chemical content is a problem that still needs fixing. If you'd be interested in sharing your experiences either in the comments section or [via email](http://depth-first.com/about/), I'd be very interested in hearing from you.