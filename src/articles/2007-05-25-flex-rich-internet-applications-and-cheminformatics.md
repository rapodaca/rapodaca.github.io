---
title: Flex, Rich Internet Applications, and Cheminformatics
published: "2007-05-25T00:00:00.000Z"
---

![Flash](/images/posts/20070525/flash.png "Flash")

Building [Rich Internet Applications](http://en.wikipedia.org/wiki/Rich_Internet_application) (RIAs) is no easy task. The technologies are all there, but twelve years after the release of Netscape Navigator, Web developers are still hacking around browser idiosyncrasies.

From JavaScript to HTML, to CSS, browser quirks are still a fact of life. Browsers tend to disagree the most on the more advanced features, but examples of less advanced features requiring cross-browser work-arounds continue to suck up large amounts of developer time.

Even Java applets get in on the act. The interface between applets and the browser is the most poorly-defined aspect of the technology. Particularly with respect to [keyboard focus](http://bugs.sun.com/bugdatabase/view_bug.do?bug_id=4984794), [persisting applet state](http://forum.java.sun.com/thread.jspa?threadID=348710&messageID=2031874), and even [initial activation](http://java.sun.com/developer/technicalArticles/J2SE/Desktop/ieappletguide/), it's "write once, test everywhere."

Recently, I saw a presentation by [James Ward](http://www.jamesward.org/wordpress/) on a technology called [Flex](http://www.adobe.com/products/flex/) that's aimed squarely at solving the Rich Internet Application problem.

Flex is a platform for building software that runs on the Flash multimedia player. If you've developed Java applets, you already know a lot about how Flex works. Here are some of the key points James brought up:

-  Flex applications are written in ECMAScript (aka JavaScript) and run on the Flash 9 runtime. The language offers, among other features, variable typing. This stands in contrast to the non-typed form of JavaScript typically used in browsers.
-  Sometime in 2007, Flex will be open sourced. The [developer kit](http://www.adobe.com/products/flex/downloads/) is currently a free download.
-  A desktop-native runtime for Flex called [Apollo](http://labs.adobe.com/technologies/apollo/) is nearing release.
-  A variety of eye-popping examples of Flex in action are available. My favorites so far: [FlexBook](http://demo.quietlyscheming.com/book/Anatomy.html) and [Picnik](http://picnik.com).

![Flash Book](/images/posts/20070525/flashbook.png "Flash Book")

Adobe is clearly trying to position Flash/Flex as the successor to Java applets. By ensuring that Flash works the same way in all browsers, has a rich API for interacting with the browser, and is available on all platforms, they just might succeed.

Adobe claims that Flash is the most widely-installed multimedia browser plug-in. According to a [recent study](http://www.adobe.com/products/player_census/flashplayer/), nearly 99% of browsers have some version of Flash installed (congratulations to [Rajarshi Guha](http://cheminfo.informatics.indiana.edu/~rguha/) for almost immediately getting the [Name that Graph](http://depth-first.com/articles/2007/05/23/name-that-graph)). Adoption of Flash 9, the latest version and the one required to run Flex applications, [is significantly lower](http://www.adobe.com/products/player_census/flashplayer/version_penetration.html). My guess is that these numbers will rise quickly given the availability of Flash 9 for Linux and the mere 1.5 MB download footprint.

If Flex has anything going against it, it's probably the small footprint of the Flash player. One of the first things you'll notice about many feature-rich Flex applications is how long they take to download relative to comparable Java applets. What the Flash runtime lacks, your application may well have to supply on deployment.

I'm unaware of a single use of Flex/Flash in cheminformatics. This is really quite surprising given the highly visual nature of cheminformatics and the refined graphics capabilities of the Flash player. Even with it's limitations, Flex may offer solutions to a variety of difficult problems in developing Rich Internet Applications for chemistry.