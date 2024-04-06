---
title: "GitHub for Chemistry: Revision Controlled Datasets?"
published: "2009-01-23T00:00:00.000Z"
---

[The GitHub Blog](http://github.com/blog/) has published [a writeup](http://github.com/blog/317-scripting-bioclipse) about Bioclipse's method for [importing scripts from GitHub](http://chem-bla-ics.blogspot.com/2009/01/bioclipse-and-gist-integration.html).

Although there are obvious security issues with allowing arbitrary code to be run directly from the Web without a sandbox, this approach has some potential.

[GitHub](http://github.com) has many other potential uses for chemistry. One of the most interesting, but as far as I know untested, possibilities is to use GitHub to host **datasets**.

For the unfamiliar, GitHub is a collaborative, Web-based revision control system. It makes is very easy to start and maintain ad-hoc, decentralized collaborations based around one or more editable files. Every document, and even every change to every document, becomes a resource that can be addressed with a URL from anywhere in the world.

Currently, GitHub is mainly used to host source code. But nothing in the design prevents it from hosting data such as SD Files. In fact, this is exactly what has begun to happen with the [cheminformatics benchmark project](/articles/2009/01/22/mx-performance-comparison-3-substructure-search-in-mx-and-cdk) I'm currently working on. In this case, source code is being maintained along with data files. But what would happen if you just hosted data files?

If Bioclipse can import scripts from GitHub, why can't it import data as well? For that matter, why can't Bioclipse *write* data to GitHub?

And why can't your application do the same thing?
