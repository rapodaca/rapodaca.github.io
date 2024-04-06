---
title: "Why Organic Chemistry is Like Facebook"
disqus: true
published: "2012-05-21T00:00:00.000Z"
---

Last week's news was dominated by the initial public offering of Facebook. Although it's unlikely that many investors understood exactly what they were buying, much of the company's value derives from the massive [social graph](http://en.wikipedia.org/wiki/Social_graph) created within the last few years, and tools for exploiting it commercially.

# Graphs: Social and Chemical

One of the most practical (and profitable) ways to think of organic chemistry is from the perspective of [functional group](http://en.wikipedia.org/wiki/Functional_group) transformations. One functional group can be converted to another using one or more reagents under a given set of conditions. This is represented below, where "Fg" is a functional group and the arrow represents a single reaction:

![Reaction Graph Section](/images/posts/reaction-graph-section.png "Reaction Graph Section")

Just as Facebook only became interesting after many people had joined and friended each other, organic chemistry only becomes interesting after many functional groups are connected to each other through reactions:

![Reaction Graph](/images/posts/reaction-graph.png "Reaction Graph")

This representation is called a [graph](http://en.wikipedia.org/wiki/Graph_%28mathematics%29), where the circles represent "nodes" and the arrows represent "edges." Many real-world situations can be modeled as graphs, including both Facebook and organic synthesis.

The analyses applied to a graph modeling one situation can often be usefully applied to graphs modeling a completely different situation. For example, a listing of all the people your friends know and what they like can help you discover people and interests you didn't know about before. Likewise, a listing all of the transformation a functional group can undergo can help you find new substances easily accessible from substances you already have.

# Reaction Maps

One of the most familiar kinds of graph is a roadmap linking destinations through roads. For this reason, the idea of linking functional groups through reactions is also called a "reaction map." Reaction maps are usually discussed in the context of teaching and learning organic chemistry, but they are not at all limited to this use. For more, see:

-  [Organic Chemistry Study Tips: Reaction Maps](http://masterorganicchemistry.com/2012/05/07/organic-chemistry-study-tips-reaction-maps/)
-  [Organic Chemistry Reactions Mind Map](http://www.chemistry-blog.com/2011/08/05/organic-chemistry-reactions-mind-map/)
-  [Using Concept Maps in Teaching Organic Chemical Reactions](http://acta.chem-soc.si/52/52-4-471.pdf)
-  [Reaction-Map of Organic Chemistry](http://dx.doi.org/10.1021/ed084p1224)

Whether using the term "graph" or "map" to describe the model that results from connecting known functional groups through known reactions, the concepts remain the same.

# A GPS for Organic Synthesis

Although the value of a network increases with the number of nodes, so does the difficulty of navigation. The nearly 200 years during which chemists have been building the organic synthesis graph have seen the development of a very complex web of knowledge that can be utterly confusing without the right tools.

As part of a collaboration with [James Ashenhurst](http://masterorganicchemistry.com/), I've been looking at how to make organic synthesis more accessible to students. The tool we've developed, [Reagents](http://itunes.apple.com/us/app/reagents/id453336174?mt=8), is an app that runs on iPhone and iPad devices.

Until recently, Reagents was simply a listing of organic synthesis reagents. Although useful in its own right, we thought we could do better.

![Reagents](/images/posts/reaction-graph-reagents.png "Reagents")

That's why the most recent version of Reagents introduced two powerful new features: "Synthesis" and "Retrosynthesis". Given any of the functional groups commonly used in Organic 1/2 level courses, it's now possible to find reactions that the group will participate in ("Synthesis") or which will generate the functional group ("Retrosynthesis"). From there, the necessary reagents can be found.

Exposing this view of the organic synthesis graph was not conceptually difficult, but did require quite a few changes to both the Reagents source code and data format.

# Conclusions

When viewed as a graph or map, organic chemistry can become become both very approachable and very useful.

The key is using the right tools. Up until recently, books were the primary means for researchers and students alike to navigate the organic synthesis graph. As a comparison between Facebook and the old White Pages should make clear, books provide a suboptimal user interface to graph data.

New devices like iPad offer fundamentally new ways of learning and using the organic synthesis graph. Reagents offers a new perspective on this old problem.