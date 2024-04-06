---
title: Building a Unique Chemistry Journal - Responses to Questions from Nature Chemistry
published: "2008-05-08T00:00:00.000Z"
---

[Neil Withers](http://blogs.nature.com/thescepticalchymist/author/neil_withers/) of the soon-to-be-launched chemistry journal [*Nature Chemistry*](http://www.nature.com/nchem/index.html) has [asked for feedback](http://blogs.nature.com/thescepticalchymist/2008/05/jj_day_98_service_with_a_simpl.html) to some questions about the best ways to display chemistry research papers on the Web. Here are some responses:

> (1) HTML vs PDF: does anyone read the HTML articles? Do you read the PDF on-screen or print it out?

I've used PDFs both for offline archiving and sharing of especially important articles as well as one-off printing of a paper I'm interested in. I rarely read a paper on-screen if I can avoid it.

Typical workflow: (1) download PDF; (2) print it out; (3); let paper sit while I go do something in the lab that can't wait (or bring it with me); (4) put paper onto a rather large stack of papers just like it; (5) pull paper out of stack from time to time as needed; (6) (optional) file paper in an increasingly chaotic system of folders or recycle it.

This system is bad, and [I cursed it weekly during my time as a research chemist](/articles/2007/03/22/why-i-still-dont-use-connotea). Most of my colleagues had similar experiences.

There are plenty of opportunities to address pain points with the Web. Some ideas:

-  Make it *very* easy to find papers on the *Nature Chemistry* site. If I know a paper is trivial to find, I'm less likely to print it out in the first place. Good search may not be enough (see question 3).
-  Make the online version as readable as it can be. Minimize fluff like menus, ads and general clutter. Maximize things that promote readability like reasonable column-widths, appropriate fonts, and attractive and readable images.
-  Add conveniences that make it easier to read the paper online such as hover-popups that display 2D chemical structures for trivial names and IUPAC nomenclature (see below).

Paper is portable but Web documents are alive. Both can be readable - for example, I never print out a blog posting to read it.

> (2) Big vs little graphics: what does everyone else think about the tiny size of the graphics in ACS html articles?

Graphics should be sized appropriately. ACS HTML articles are a good example of failing to [design the obvious](/articles/2007/09/28/designing-the-obvious). You'd never read a blog post that looked like those articles, so it's not surprising everyone prints out the PDF.

Another problem is over-wide columns. It's puzzling why journal publishers would ignore all of their hard-won design experience just because a document appears as a Web page. If the ACS used a narrower column width, the Web version would be more readable. For example, check out [this article](http://www.beilstein-journals.org/bjoc/single/articleFullText.htm?vt=f&publicId=1860-5397-4-2&bpn=latest&dos=0) from [*Beilstein Journal of Organic Chemistry*](http://www.beilstein-journals.org/bjoc). The only thing I'd change is to make the font larger.

Both problems are correctable using the right software and techniques.

> (3) Tagging/’semantic web’: what do you think about the toys on the RSC’s Project Prospect? What kind of things would you like to see tagged/linked to other content in Nature Chemistry? For instance, Steve would love to do something with named reactions.

If by tagging, you mean giving users the ability to tag articles like [Flickr](http://flickr.com) allows photos to be tagged, and for other users to make use of those tags while searching, I think it's [long overdue and could be a game-changer](/articles/2007/01/18/collective-intelligence-and-the-dumbness-of-crowds). It would clearly play to the strength of the Web as a medium.

I must confess that I'm not a fan of the implementation of [Project Prospect](http://www.rsc.org/Publishing/Journals/ProjectProspect/FAQ.asp), although the idea has a lot going for it. There's too much bling and a lot of it fails on my Linux/Firefox 2 system.

The one Prospect feature well worth adapting would be the one that lets you get a 2D structure by clicking on a trivial name or IUPAC name. But there's a much better way to implement it:

-  Turn it on by default and get rid of the floating right-hand menu.
-  Make the structure appear, without clicking, by simply hovering the mouse over the trivial name or IUPAC nomenclature. Be sure the delay is set right so that it's not popping up unintentionally.

That's all there is to it. It needn't be complex, just usable.

Another possibility: harvest all of the 2D molecular structures appearing in articles over a given period of time to be displayed in a dense, hyperlinked [graphical abstract format](/articles/2006/12/11/hacking-molbank-creating-a-graphical-table-of-contents) ideal for quick browsing.

> (4) 3D molecular structures: do these help your understanding of a paper?

Rarely, and in many cases they just add clutter. For almost all small molecules, a properly laid-out and well-drawn 2D chemical structure is more useful. If a central point of discussion in a paper is a 3D structure, then that *would* be a good use of the technology.

> (5) How useful to you are InChIs and SMILES?

Not very. Research chemists rarely care about this kind of technology. They'd much rather have [a good-looking 2D chemical structure](/articles/2008/02/12/the-art-and-science-of-chemical-structure-diagrams-double-trouble). InChIs and SMILES, if available, should be [hidden away and only brought out when requested](/articles/2006/09/05/the-automatic-encoding-of-chemical-structures). A more basic problem is [neither system will be able to encode all of the molecules](/articles/tag/flexmol) your journal's authors are likely to discuss.

> (6) Forward linking: the RSC and Elsevier/Science Direct offer this - do you use it? Would you use an RSS feed that alerted you to new citations of a particular paper.

It could be useful provided that clutter could be kept to a minimum. It's essentially a form of linkback (see below).

An RSS feed that published linkback activity might be useful, but many of the chemists I know still don't know what RSS is. On the other hand, a page (or email service) that could keep an interested reader updated on linkback activity on all of their papers of interest simultaneously could be very useful.

>( 7) Would you actually comment on papers if there was a comments box at the end?

[Like Egon Willighagen](http://chem-bla-ics.blogspot.com/2008/05/re-what-should-nature-chemistry-paper.html), I'd probably use [my blog]() to do it.

However, most chemists don't maintain blogs or other websites and for them I can see how the ability to post comments would be useful.

Both kinds of users could be accommodated through a combination of comments and [linkbacks](http://en.wikipedia.org/wiki/Linkback). Provided that a good spam filtration system were used, this two-pronged approach might be very useful to readers.

Blogs are just the tip of the iceberg, though. Web publication technologies are creating all kinds of opportunities for creating [highly focused, constantly evolving, collaborative mini-reviews on special topics](/articles/2008/05/07/1908-and-all-that-the-long-tail-and-chemistry). Linkbacks would create value for both readers and authors of these mini-reviews as well as forward-thinking scientific publications that embrace them.

> (8) We really like the Biochemical Society's HTML article style ([sample one here](http://www.biochemj.org/bj/ev/381/0329/bj3810329_ev.htm)) - do you?

No. Frames makes that site very difficult to navigate.

It will be very interesting to see how Nature Publishing Group takes advantage of its opportunity to create something unique among chemistry publications. Asking the kinds of questions they're asking now, and doing so in the way they're doing it, shows they're at least on the right track.