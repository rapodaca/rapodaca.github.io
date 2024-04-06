---
title: RESTful Cheminformatics
published: "2007-05-30T00:00:00.000Z"
---

Names are powerful. For example, if you work in a field that has a well-recognized title, it's easy to talk to non-experts about what you do. Doctors, lawyers, NASCAR drivers, actors, and airline pilots all fall into this category. If, on the other hand, you're a medicinal chemist - well, you've got your work cut out for you.

Names are especially important in software design. Many of the toughest design problems occur because we fail to see an underlying concept and name it. Unfortunately, our natural impulse in these situations is to get busy creating complexity (or just give up). But if we allow ourselves to take a few steps back, more often than not we find a central concept waiting to be named.

[Representational State Transfer](http://www.ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm) (REST) has received a lot of attention lately, and for good reason. REST is fundamentally about discovering, naming, and exposing the elements of a problem domain. Object-Oriented designers have been doing this for decades. With REST it's possible to do the same thing with Internet resources, and achieve many of the same benefits.

To draw an analogy between REST and Object-Oriented design, **resources** are to the Internet what **objects** are to software. Resources have names. They have capabilities and well-defined behavior. They can be nested, extended, created, queried, and destroyed. They act as nouns upon which a limited number of verbs can act. Most importantly, resources have consistent and discoverable behavior.

REST's "big idea" is that the HTTP protocol already provides all the verbs necessary to operate on resources: GET, PUT, POST, and DELETE. If you're willing to accept the notion that (almost) everything in the world can be modeled as resources being acted on by those four verbs, your life as a Web developer suddenly gets much simpler.

The technical aspects of REST have been covered in many excellent blogs, articles, and talks. In particular, the release of Ruby on Rails 1.2 has lead to a flood of excellent material. Two works I've found especially helpful are:

-  [David Heinemeier Hanson's 2006 Rails Conf Presentation](http://www.scribemedia.org/2006/07/09/dhh/):  The [slide deck](http://media.rubyonrails.org/presentations/worldofresources.pdf) for this presentation is essential.
-  [RESTFul Rails Development](http://www.b-simple.de/documents):  Written by Ralf Wirdemann and Thomas Baustert, this free booklet describes REST and Rails in much more detail than the [Agile Book](http://www.pragmaticprogrammer.com/titles/rails2/).
What does REST have to do with Cheminformatics? Quite a lot. As more and more free chemistry services, including [free databases](http://depth-first.com/articles/2007/01/24/thirty-two-free-chemistry-databases), become available online, lack of interoperability will start to become very painful - not just to developers, but to chemists themselves. There are many valid approaches to solving this problem. REST may well be the most workable.
