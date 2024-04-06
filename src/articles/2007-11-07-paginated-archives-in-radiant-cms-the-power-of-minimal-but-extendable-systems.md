---
title: "Paginated Archives in Radiant CMS: The Power of Minimal But Extendable Systems"
published: "2007-11-07T00:00:00.000Z"
---

If you've ever needed to build a Website hosting mostly static content, you've probably tried out a few Content Management Systems. The problem is not finding them - there must be hundreds. The problem is finding one that successfully walks the fine line between being minimal (so that you can do things your way) and powerful (so that it can grow with your needs).

[Radiant CMS](http://radiantcms.org) is one of those systems. As an added bonus, it's written in Ruby and built on [Rails](http://rubyonrails.org). Radiant succeeds by focusing on the management of pages while providing a powerful extension mechanism.

The Website for my company, [Metamolecular](http://metamolecular.com), will consist of content produced infrequently (product descriptions and documentation) intermingled with more frequently created blog-like content (updates, tutorials, responses to user questions). Traditionally, the CMS has handled the former, with blogging software handling the latter. But we needed a system that handled both well.

One of the distinguishing characteristics of blogs, as opposed to other kinds of websites, is the unusually large number of similar pages. Handling this kind of content requires pagination - the ability to break an archive up into a series of pages containing a smaller subset of the archive.

Although Radiant doesn't have the ability to paginate its content, it does have a wonderful system for creating extensions. I thought I'd give it a try.

The result is the Paginated Archive extension. It works as a drop-in replacement for Radiant's existing Archive Page. After placing the extension into your PROJECT_HOME/vendor/extensions directory, you'll be able to create and configure Paginated Archives for use with blogs and other kinds of sites generating large numbers of pages. The extension requires Bruce Williams' excellent [Paginator](http://rubyforge.org/projects/paginator) gem.

You can get started by downloading the extension [here](/images/posts/20071107/paginated_archive.tar.gz).