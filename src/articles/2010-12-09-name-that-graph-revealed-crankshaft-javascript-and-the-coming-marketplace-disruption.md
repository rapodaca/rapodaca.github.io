---
title: Name That Graph Revealed - Crankshaft, JavaScript and the Coming Marketplace Disruption
published: "2010-12-09T00:00:00.000Z"
---

[![Crankshaft Benchmark](/images/posts/crankshaft-benchmark.png "Crankshaft Benchmark")](http://blog.chromium.org/2010/12/new-crankshaft-for-v8.html)

As some of you have guessed already, [the graph from yesterday](http://depth-first.com/articles/2010/12/08/name-that-graph/) depicted [benchmark data on the Chrome browser's JavaScript engine performance](http://blog.chromium.org/2010/12/new-crankshaft-for-v8.html). The spike at the far-right of the graph is due to a newly added JavaScript compilation infrastructure called 'Crankshaft'.

But to really appreciate what's happening with JavaScript performance, it helps to keep these benchmarks in mind:

[![IE9 Benchmark](/images/posts/ie9-benchmark.png "IE9 Benchmark")](http://blogs.msdn.com/b/ie/archive/2010/03/18/the-new-javascript-engine-in-internet-explorer-9.aspx)

If you've been involved in Web development for more than ten years, the graphs above are nothing short of astounding. JavaScript, a technology long loathed, ignored, and generally disparaged by developers, is now viewed as a serious programming language with significant resource commitment by large software companies.

Now combine this buildup in performance firepower with the acceptance of all browser vendors that [HTML 5 is here to stay](http://ie.microsoft.com/testdrive/). What do we get?

A classic [marketplace disruption](http://en.wikipedia.org/wiki/Disruptive_technology).

Clayton Christensen developed a framework for thinking about why large companies fail by doing the "right thing". He's studied a number of industries where dominant players were overtaken by new entrants riding a disruptive wave. It's important to realize that disruptive innovations enter the market with severe handicaps that prevent them from being useful to the broad marketplace. As a result, prudent business practice demands that they be ignored. As Christensen puts it succinctly in his book, [The Innovators' Dilemma](http://www.amazon.com/Innovators-Dilemma-Revolutionary-Business-Essentials/dp/0060521996):

>Disruptive technologies bring to the market a very different value proposition than had been available previously. Generally, disruptive technologies underperform established products in mainstream markets. But they have other features that a few fringe (and generally new) customers value. Products based on disruptive technologies are typically cheaper, simpler, smaller, and frequently, more convenient to use. ...

If this were all there was to the framework, it wouldn't be very useful, but something strange happens with disruptive technologies:

>... technologies can progress faster than market demand... in their efforts to provide better products than their competitors and earn higher prices and margins, suppliers often "overshoot" their market: They give customers more than they need or ultimately are willing to pay for. And more importantly, it means that disruptive technologies that may underperform today, relative to what users in the market demand, may be fully performance-competitive in that same market tomorrow.

Or to [put it graphically](http://web.mit.edu/6.933/www/Fall2000/teradyne/clay.html):

[![Disruptive](/images/posts/disruptive.jpg "Disruptive")](http://web.mit.edu/6.933/www/Fall2000/teradyne/clay.html)

JavaScript has now found a stable foothold on the lower horizontal line in the above graph - the line defining the least-demanding applications. With impetus from auxiliary technologies like HTML5, universal vector graphics, web storage, and backing from the likes of browser vendors Google, Apple, and Microsoft, JavaScript will steadily progress to the northeast quadrant of the above graph - toward the most demanding applications.

Whether JavaScript makes it to the northeast quadrant is anybody's guess, but it's going to be an exciting ride.