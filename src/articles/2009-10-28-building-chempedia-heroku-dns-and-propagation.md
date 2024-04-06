---
title: "Building Chempedia: Heroku, DNS, and Propagation"
published: "2009-10-28T00:00:00.000Z"
---

In preparation for the re-launch of [Chempedia](http://chempedia.com), I've been spending some "quality time" with the [Heroku DNS documentation](http://docs.heroku.com/custom-domains).

Getting Chempedia to work on chempedia.com and www.chempedia.com through Heroku required a crash course on DNS and in particular [CNAME Records](http://en.wikipedia.org/wiki/CNAME_record).

One of the things that made this more difficult than is should have been is the latency of [DNS propagation](http://en.wikipedia.org/wiki/Domain_Name_System). You can make a change in your settings, but it will take some time for that change to be made visible worldwide.

Fortunately, I found a nifty little tool that made life a lot easer - [whatsmydns.net](http://www.whatsmydns.net/). With it, you can watch as your DNS changes propagate out in real time, which offers the opportunity to fix mistakes without waiting hours until the changes reach your own network.