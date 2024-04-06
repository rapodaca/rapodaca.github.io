---
title: "Painless Source Code Highlighting with Prettify"
published: "2009-05-28T00:00:00.000Z"
---

If you've ever created Web documents containing source code, you may have wondered how to easily add syntax highlighting. Over at the [Metamolecular Products Blog](http://products.metamolecular.com), we needed source code highlighting and decided to find the best solution available.

[Depth-First](http://depth-first.com) uses a highlighter that's installed as a server-side plugin. This is inconvenient because language support is limited (for example, there's no Java or JavaScript support), and upgrades require a time-consuming deployment and integration step. The other problem is that enabling syntax highlighting requires the use of plugin-specific syntax within each post.

It turns out that another solution is much easier to use and aware of more languages. [Prettify.js](http://code.google.com/p/google-code-prettify/) is an unobtrusive JavaScript library that automatically applies colored syntax highlighting to source code fragments. Among the many languages supported are Ruby, Python, Java, JavaScript, and XML. Customization of font weight, size, style, and color are all possible by editing your site's stylesheet. There's no need to specify a language; Prettify can handle that for you if you'd prefer. Prettify is also widely used, with one of the biggest installations being [StackOverflow](http://stackoverflow.com).

Installing Prettify.js was a simple matter of copying the Javascript file to the server and applying the correct &lt;script&gt; tag in the page template head element. [Detailed instructions](http://google-code-prettify.googlecode.com/svn/trunk/README.html) are available on the Prettify.js site.

For an example using XML, see [this post](http://products.metamolecular.com/2009/05/26/substructure-search-with-the-chemcaster-web-api).