---
title: Building Chempedia - A RESTful Web API for Chemical Information
published: "2009-11-04T00:00:00.000Z"
---

In [a 2007 interview](http://readwritetalk.com/2007/09/05/biz-stone-co-founder-twitter/), Biz Stone, cofounder of Twitter, commented on the role Twitter's Web API played in the growth of the now ubiquitous messaging service:

> Yeah. The API has been arguably the most important, or maybe even inarguably, the most important thing we've done with Twitter. ... So, the API which has easily 10 times more traffic than the website, has been really very important to us. ...

Done right, a Web API can add significant value to a website by offering a way for third-party developers to get involved. In other words, a Web API is a prerequisite for creating a Web platform.

One of the goals for [Chempedia](http://chempedia.com) is to deliver an open, high-performance, Web-based platform for creating and consuming chemical information. One of the cornerstones of this plan is a robust Web API.

# A Bit About REST

REST turns out to be very easy to understand when you consider that it's possible for machines to interact with Web services the same way humans interact with websites using a browser - by selecting and following hyperlinks.

The Chempedia Web API is built around this simple principle. For more information on the design of RESTful services and other high-level concepts, see the [Depth-First RESTful chemical tracking series](/articles/2009/08/07/the-restful-chemical-tracking-system-part-1-introduction).

The Chempedia API is based on the [Chemcaster API](http://chemcaster.com/rest), making it straightforward to port tools written for one to the other.

# API Step-By-Step

1. Start at [http://chempedia.com/rest.json](http://chempedia.com/rest.json).
2. Follow the link to Substances at [http://chempedia.com/substances.json](http://chempedia.com/substances.json).
3. View Substance detail by following link to [http://chempedia.com/substances/1-0434-2394-1189.json](http://chempedia.com/substances/1-0434-2394-1189.json)

This is just a subset of what's available; more resources can be discovered by following the links provided in each representation. In this sense, the Chempedia API, like all REST APIs, is self-documenting.

Note: the ".json" extension is a convenience for viewing representations in a browser (be sure to install the [JSONView plugin](/articles/2009/10/01/rest-tip-use-jsonview-for-in-browser-json-syntax-highlighting)). When writing client software for use with the Chempedia API, you must use the URIs given and set the "Accept" header to that given by the "media_type" attribute in each Link.

Also note that no assumptions should be made about URI structure. As with all REST systems, clients follow the links given; [they never create links by themselves](http://roy.gbiv.com/untangled/2008/rest-apis-must-be-hypertext-driven).

# Conclusions

This article has given just a brief introduction of what's possible with the Chempedia API. Future articles will discuss the API in more detail.