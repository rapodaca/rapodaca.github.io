---
title: Software Downsizing
published: "2010-10-07T00:00:00.000Z"
---

You may have noticed some changes to Depth-First recently. This post highlights some of these changes, particularly in the parts you can't see.

# What's Wrong With Blogging Software?

In its four-year history, Depth-First has run off of two blogging systems. The first was an ancient, lovable beast called [Typo](http://blog.typosphere.org/). The second was a custom-built replacement called [Hubbub](http://depth-first.com/articles/2010/01/05/out-with-the-old-or-at-least-the-stuff-that-prevents-progress/) that I wrote, partly to teach myself about some newer technologies.

There are probably hundreds, if not thousands of blogging systems in existence, with Wordpress and Movable Type being two popular choices. They all work in more or less the same way - you post your articles through an admin interface to a Web application running on a server.

Hubbub also had an admin interface. However, I wasn't using it for anything other than a convenient mechanism to paste in a title, some tags, and a pre-written chunk of [Markdown](http://daringfireball.net/projects/markdown/) into a form.

Since early this year, I've been writing my posts in a text editor ([TextMate](http://macromates.com/)), and keeping them under revision control with git. TextMate's Markdown preview feature meant that I never had to guess how the content would look when published. The problem was that every so often, I'd need to change something in a published post. Where did I go to make the change? Being lazy, I used the admin interface - bypassing the purpose of revision control!

Why couldn't I just write/distribute my articles the same way I write/distribute my open source software - with nothing more than a text editor, a build system, and an SCM tool?

But there was another problem. Blogging software creates a separation between your articles and how the site works. I wanted a unified way to manage both layout/appearance and content. I also wanted a way to easily fix things that were broken.

# Hello, Octopress and Jekyll

[Jekyll](http://jekyllrb.com/) is a tool for building static sites. Although I had seen it before, the idea of starting out with a totally blank directory didn't seem like something I could afford.

Then I found [Octopress](http://github.com/imathis/octopress), which does for Jekyll what themes do for Wordpress. Clone the Octopress repository and you're all set to go - just add your articles. Octopress uses Rake to build the site and comes complete with a task to deploy using [rsyc](http://www.samba.org/rsync/).

# My New Workflow

Here's how it works for me:

```bash
rake post
```

Edit the post using Markdown and TextMate. Preview locally to make sure everything looks ok.

```bash
git commit
rake generate
rake deploy
```

# Enabling Technologies

The idea of publishing a blog by uploading static files to a server might seem anachronistic. I'll admit that the idea seemed pretty bad to me at first.

But it turns out that the things most blogging software are doing just aren't necessary anymore:

- **Search**. [Google does search better](http://www.google.com/cse/) than your blogging software ever will. Get over it.
- **Comments**. [Disqus does them better](http://disqus.com/overview/) than your blogging software. Stop fighting it.
- **Dynamic Page Layout**. Think about it - you post your article and maybe change it three or four times in its lifetime. Why is a full, heavy stack of Web application software necessary to serve what are essentially static pages?
- **Admin Interface**. Without comments to moderate or dynamic pages to render, there's little reason to have an admin interface. Unix systems already provide a great admin mechanism called ssh. Just use it.

# Wrapup

So there you have it. I've done a 180 from running blogging software to writing it myself to publishing with static files. Like a lot of organizational downsizing, this change was catalyzed by the appearance of new technologies in a form that was convenient to use.