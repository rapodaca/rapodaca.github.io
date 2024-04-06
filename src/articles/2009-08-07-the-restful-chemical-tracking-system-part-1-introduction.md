---
title: The RESTful Chemical Tracking System Part 1 - Introduction
published: "2009-08-07T00:00:00.000Z"
---

Chemical and biological laboratories produce information in a large number of forms and for a variety of purposes. This diversity often works against the adoption of one-size-fits-all solutions, and can significantly increase the costs of creating custom systems.

One approach to this problem focuses on creating interoperable components that can be reused in a variety of contexts. Decreasing the amount of effort needed to produce low-level functionality reduces the costs of building high-level user interfaces, at least in theory. The catch is that these components must work well together - something that doesn't always happen.

All Articles in This Series:

1.  The RESTful Chemical Tracking System Part 1: Introduction
2.  [The RESTful Chemical Tracking System Part 2: Resources](/articles/2009/08/14/the-restful-chemical-tracking-system-part-2-resources)
3.  [The RESTful Chemical Tracking System Part 3: Resource Associations](/articles/2009/08/21/the-restful-chemical-tracking-system-part-3-resource-associations)
4.  [The RESTful Chemical Tracking System Part 4: Resources, Representations, Hypertext, and JSON](/articles/2009/08/28/the-restful-chemical-tracking-system-part-4-resources-representations-hypertext-and-json)
5. [The RESTful Chemical Tracking System Part 5: Media Types](/articles/2009/09/10/the-restful-chemical-tracking-system-part-5-media-types)

# REST for Laboratory Information Management Systems

This post, the first in a series, explores the idea that the [REST architectural style](/articles/2009/07/31/restful-web-services-hypermedia-and-robot-scientists) can be used to design loosely-coupled components for use in larger laboratory information management systems. To make things concrete, we'll focus on something almost every chemistry laboratory needs to deal with - chemical tracking.

Chemical tracking is a broad subject that can involve many activities, including chemical inventory, quality control, and electronic laboratory notebook integration. The system we'll be discussing will be general enough to be used in all of these situations, but still limited in scope.

# REST for Chemical Tracking

We won't actually be implementing the RESTful chemical tracking system. Instead, will be looking at the problem from the perspective of REST in preparation for building a system based on what we find.

Why do this? After all, there are at least a few chemical tracking systems out there. What do we gain by creating another - and merely a component at that? That depends on how fundamental you think the problem of chemical tracking is. If you view it merely as something that gets done occasionally and in isolation from other activities in the lab, there's probably not much advantage.

But if you view chemical tracking as central to your lab's activities, then a system designed from the beginning to integrate well with the software you use today and the software you're likely to use in the future can make a lot of sense.

# The Plan

We'll start by cataloging the fundamental units of every RESTful system -- resources. We'll move on to looking for associations between these resources. Next, we'll develop media types to represent these resources. Finally, we'll bring it all together and discuss how other laboratory software and services can make use of our system.