---
title: "Goodbye Subversion, Hello Git and GitHub"
published: "2008-11-25T00:00:00.000Z"
---

<div class="videowrapper">
  <iframe src="https://www.youtube.com/embed/4XpnKHJAok8" allowfullscreen></iframe>
</div>

A source code version control system is an essential ingredient of software development. But it's just low-level technology that doesn't change the way you think about creating software and so can safely be ignored. At least that's what I thought a couple of months ago before I started looking into [Git](http://git.or.cz/), the version control system co-developed by Linus Torvalds.

# About Git

If you've only used CVS or Subversion, Git may seem like a radical departure from sanity. For starters, Git does away with the idea of a central code repository. Instead, each contributor maintains their own repository. Authority is determined the way humans have always done it - through a chain of trust.

Forking, long thought of as a symptom of bad project management, becomes part of the normal workflow in Git. The key to making this system work was to make merging actually work.

# About GitHub

[GitHub](https://github.com/) uses Git as a core technology while extending its basic ideas into the direction of social networking and publication. Everything you do with your source code on GitHub becomes a Web resource, complete with its own URL. For public projects, these URLs are world-readable. Imagine the possibilities...

# Specific Example: GitHub and MX

Let's say you're curious to see how difficult it would be to use [MX](http://code.google.com/p/mx-java/) to implement a cheminformatics feature you must have - a SMILES parser. If MX were using Subversion, you'd probably consider contacting me to negotiate write access to the 'central repository.' The other committers and I may be busy or on vacation, or otherwise not able to get back to you for some time. When we do, you may have moved onto other things. Considering this possible sequence of events, you may decide not to take the first step.

Something that should be spontaneous, simple and fast isn't that way at all.

With GitHub, you'd, you simply go to [my MX repository homepage](https://github.com/rapodaca/mx/tree) and [fork it](http://github.com/rapodaca/mx/fork), creating your own independent repository. I'd get a notification that you had forked and your fork would show up in your public profile. We could then both automatically keep up-to-date on what the other was doing through a variety of tools such as [RSS feeds](http://github.com/feeds/rapodaca/commits/mx/master).

If at some point you felt your SMILES parser had become something that should be included in MX, you'd send me a pull request. If the code passed standards I may have set such as copyright notice, compilability, and test coverage, I'd then be in a position to merge it back into the MX code base.

If there were significant changes that might be needed to get our respective repositories in synch, I'd have the choice of either making them myself or asking if you'd make them on your own repository. The latter would be the smart choice for both of us since you know your SMILES parser a lot better than I do.

The same kind of process can also be applied by me with my own repository. For example, I currently have [an open branch aimed at building a depth-first traverser for MX](http://github.com/rapodaca/mx/tree/depth-first) to be used in SMILES writers, substructure search tools and the like.

# Not Just a New Tool?

Any technology that can change the way people interact is more than just a tool. Although it's still early days, Git and GitHub might fall into that category. Only time will tell.