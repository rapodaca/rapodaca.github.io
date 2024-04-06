---
title: Google Closure - Building Complex Applications with JavaScript
published: "2010-11-22T00:00:00.000Z"
---

Many years ago, JavaScript was considered a toy language suited only for implementing button rollovers and annoying modal dialogs. Those days are long gone. A key enabler of HTML5 and the astonishing levels of multimedia interactivity becoming widely-available within browsers, JavaScript will only increase in importance in coming years. And projects like [Node.js](http://nodejs.org/) are demonstrating that JavaScript is a serious contender on the server side as well.

Today, JavaScript is being used to create software of increasing complexity and scale. This article, the first in a series, introduces [Google Closure](http://code.google.com/closure/), an especially effective tool for building client-side JavaScript applications that scale.

This will be no theoretical discussion. At the beginning of this year [my company](http://metamolecular.com) committed itself to re-writing its flagship product [ChemWriter](http://chemwriter.com), a chemical structure drawing tool, in JavaScript using Closure. We've been working with it since - a lot. In this series, I'd like to share some of our experiences.

# All Articles in this Series

1.  Google Closure - Building Complex Applications with JavaScript
2.  [Synchronize the Closure Library SVN Using a Git Submodule](/articles/2010/11/29/synchronize-the-closure-library-svn-using-a-git-submodule/)

# Who This Series is for

If you're considering writing (or re-writing) an interactive client, the combination of JavaScript and browsers has a lot to offer as a platform - even if you're targeting mobile uses. But unless your resources are unlimited, you're going to need a JavaScript framework to do the grunt work for you. Browsers are too inconsistent and lack higher-level interfaces to unlock their full functionality, and JavaScript the language has too many rough edges. A JavaScript framework solves these problems for you.

We considered many options for a JavaScript framework before starting. Closure was the one that best suited our needs, including:

-  Proven cross-browser capabilities, particularly event handling, dom manipulation, and graphics.
-  Clear object-oriented structure.
-  Well-written documentation.
-  Cross-browser support for vector graphics, including IE7/8.
-  Support for complex manipulation of geometrical shapes, including [affine transformations](http://en.wikipedia.org/wiki/Affine_transformation).
-  Maintained by a dedicated team with significant resources and vested interest in success.
-  Source code minification and obfuscation with the option to run code in its original form at any time.
-  Emphasis on high performance.
-  Open sourced under an [academic-style license](/articles/2006/12/29/dispelling-open-source-confusion-an-introduction-to-licenses/).
-  Capable of working with BDD-style testing frameworks such as [Screw.Unit](/articles/2009/11/23/javascript-survival-screw-unit/).

Your needs may differ, but if they overlap with ours, you might want to consider Closure.

# Stop Right Now and Get This Book

One of our requirements, well-written documentation, was only partially met by Closure at the time we started using it. That situation has since changed for the better. [Closure: The Definitive Guide](http://oreilly.com/catalog/0636920001416) is essential reading for anyone interested in using Google Closure.

In case you're new to JavaScript, I can also highly recommend [JavaScript: The Good Parts](http://oreilly.com/catalog/9780596517748).

These two books should be enough background to start any project using Closure.

# Where To?

Although a lot of good Closure documentation exists, we've found a few situations in which a concise discussion of a specific Closure problem and a workable solution would have come in handy. The articles to follow will reveal solutions to some problems in using Closure effectively.