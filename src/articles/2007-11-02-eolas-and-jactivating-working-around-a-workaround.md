---
title: Eolas and jActivating - Working Around a Workaround
published: "2007-11-02T00:00:00.000Z"
---

If you've spent any time using Java applets, you may have run across an annoying little "feature" of Internet Explorer 6/7. Before interacting with an applet, it's outlined in gray and displays the mouseover message "Click to activate and use this control."

This may not seem like much of an inconvenience, but it seems wrong to waste precious time explaining this kind of thing away to hundreds of perplexed users. Web applications should work intuitively; clicking to activate something is just counterintuitive.

Earlier versions of IE lacked this feature. It was added as the result of a patent lawsuit that Microsoft lost (and I was actually rooting for them that time!). The suit was filed by a company called [Eolas](http://www.eolas.com/) who were granted patent number 5,838,906 in 1998 for the invention of:

> A system allowing a user of a browser program on a computer connected to an open distributed hypermedia system to access and execute an embedded program object."

In other words, browser plugins.

As a result of [losing the Eolas suit](http://en.wikipedia.org/wiki/EOLAS), Microsoft was forced to cripple IE with the bizarre "click to activate" workaround.

Regardless of your thoughts on the validity or utility of software patents, the Eolas case has very real effects for Web developers everywhere.

Fortunately, there are a variety of workarounds to this problem. Two of the most effective are:

1.  Replace all `<applet>` or `<object>` tags with JavaScript calls to `document.write`. This function must be called from a file separate from the HTML file itself.
2.  Use the excellent [jActivating](http://jactivating.sf.net) library.

While both solutions work, jActivating does so without requiring you to touch your HTML markup. Simply include a small JavaScript file in your `<head>` tag and be done with it.

Behind the scenes, jActivating strips out your `<applet>` and `<object>` tags, replacing them with dynamically-generated tags that apparently fall outside the scope of the Eolas Patent.

Let's hear it for workarounds!