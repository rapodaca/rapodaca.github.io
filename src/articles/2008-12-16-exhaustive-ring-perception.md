---
title: "Exhaustive Ring Perception"
published: "2008-12-16T00:00:00.000Z"
---

![pgraph](/images/posts/20081216/pgraph.png "pgraph")

Ring perception in chemical structures is essential for a number higher-level cheminformatics operations such as [Structure Diagram Generation](/articles/2007/04/11/structure-diagram-generation) and [aromaticity perception](/articles/2007/11/28/smiles-and-aromaticity-broken). Several ring perception algorithms have been developed over the last few decades, but many return only a subset of rings. Others are difficult to implement or perform badly.

One algorithm stands out for its ability to perceive all rings in a chemical structure, its efficiency, and its ease of implementation. In 1996, Hanser, Jauffret and Kaufmann published an [algorithm for exhaustive ring perception](http://dx.doi.org/10.1021/ci960322f) which was unfortunately not given a catchy name.

At the center of the Hanser algorithm is a construct called a 'P-Graph' (short for Path Graph). A P-Graph has the useful property of retaining complete ring path information when any arbitrary node is removed. The special properties of the edges in a P-Graph ensure that ring paths are formed automatically by plucking off nodes one by one.

With the Hanser algorithm, the problem of perceiving all rings reduces to the problem of removing nodes from a P-Graph until none are left.

I'm aware of two open source implementations of the Hanser ring perception algorithm: one in the [Chemistry Development Kit](http://cdk.sf.net); and the other in [Octet](http://sf.net/projects/octet).

A third open source implementation of the Hanser algorithm is under construction in [MX](http://code.google.com/p/mx-java/), the lightweight cross-platform cheminformatics toolkit. You can watch the activity in real-time (and participate) by monitoring the [MX 'cycle' branch on GitHub](http://github.com/rapodaca/mx/tree/cycle).