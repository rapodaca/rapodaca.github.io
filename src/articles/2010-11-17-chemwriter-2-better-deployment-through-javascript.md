---
title: ChemWriter 2 - Better Structure Editor Deployment Through JavaScript
published: "2010-11-17T00:00:00.000Z"
---

Chemistry poses many unique information technology challenges - one of the most important comes from the need to support its graphical language for chemical structures. A chemical structure editor plays the pivotal role of allowing a chemist to communicate with a cheminformatics back-end using this graphical language. In this article, I'll discuss how ChemWriter 2, a structure editor under development by [my company](http://metamolecular.com), can help simplify the creation of compelling chemistry Web applications.

# Optimizing the Web for Chemistry

The overwhelming majority of chemistry software is designed with a desktop environment in mind. But a number of factors are bringing the advantages of the Web and lightweight browser clients into focus, particularly in the areas of cost reduction and collaboration, both inside and across organizations. To date, very few tools have been created with the goal of solving the unique challenges that chemistry on the Web presents.

# Java Applets: A Mixed Bag

[ChemWriter 1](http://chemwriter.com) was an attempt to fill this need. Unlike other products, it was focussed on two things: (1) speeding up the drawing of structures through an ergonomic design; and (2) minimizing page load times through a small deployment footprint. We focused on delivering only the most critical structure editor features with the best possible user interface.

But no matter what we did to improve ChemWriter, we could never escape the fact that our software ran inside the Java Plugin. This single requirement, although providing a great measure of consistency across browsers and operating systems, also leads to some tradeoffs:

-  A misconfigured (or missing) Java Plugin on a user's system leads to a spectrum of serious problems that are beyond the developer's control. This might not be so bad if the situation generated an automatic error report, but it typically does not. When the Java plugin fails, most users simply leave and never report the problem.
-  Even with [applet-fu](https://github.com/metamolecular/applet-fu), deployment of applets can be tricky, especially for the inexperienced.
-  Java plugin startup times can vary greatly across Java version and operating system. One of the slowest Java plugin startup times happens on OS X, which has significant penetration in the education market. Again, this is a factor that's totally outside the control of the developer.
-  Emerging touch computing platforms such as Android and iOS have abandoned Java entirely in favor of HTML5.

# Deploying ChemWriter 2

ChemWriter 2 will require no browser plugins of any kind, eliminating all of the above problems. Although it's been a significant investment for us to re-write ChemWriter in JavaScript and do it right, we think this will enable a much easier and more reliable deployment method. ChemWriter 2 can be deployed with these elements:

1.  &lt;stylesheet&gt; containing the ChemWriter stylesheet.
2.  &lt;script&gt; loading a single JavaScript file from your server.
3.  &lt;meta&gt; to enable the correct Internet Explorer behavior (more about this later).
4.  &lt;script&gt; placing an instance of the editor into the HTML element of your choice.

As we've continued to develop ChemWriter 2, one of the surprises has been just how fast it starts up. Startup is so fast that it can at first seem like the editor is not actually interactive, but just an image or static markup.

We plan for ChemWriter 2 to take full advantage of the unique capabilities of touch computing platforms. I'll be giving a better idea of what this means in future articles.

Best of all, the only thing your users will need to view your pages is a Web browser - any current version from a major vendor will do (Internet Explorer fans, yes, that means you, too).

# Learn More

If any of this sounds useful or interesting, I encourage you to [try a live version of ChemWriter 2 for yourself](http://chemwriter.com/signups/new). I'm especially interested in hearing from developers who are now building a chemistry Web application that needs a fast-loading and ergonomic structure editor.