---
title: The RESTful Chemical Tracking System Part 4 - Resources, Representations, Hypertext, and JSON
published: "2009-08-28T00:00:00.000Z"
---

RESTful Web services offer significant advantages in solving today's laboratory information management problems. By exposing narrow functionality using a uniform interface, complex laboratory information management systems can be built up from fundamental RESTful components.

This article is the fourth in a series exploring the idea that the REST architectural style can be applied to the creation of chemistry-specific laboratory Web services, specifically for use in chemical tracking. In the previous installment, we defined the associations between five resources exposed by a hypothetical chemical tracking system. This installment will introduce one technique for exposing the states of these resources through representations.

# All Articles in This Series:

1.  [The RESTful Chemical Tracking System Part 1: Introduction](http://depth-first.com/articles/2009/08/07/the-restful-chemical-tracking-system-part-1-introduction)
2.  [The RESTful Chemical Tracking System Part 2: Resources](http://depth-first.com/articles/2009/08/14/the-restful-chemical-tracking-system-part-2-resources)
3.  [The RESTful Chemical Tracking System Part 3: Resource Associations](http://depth-first.com/articles/2009/08/21/the-restful-chemical-tracking-system-part-3-resource-associations)
4.  The RESTful Chemical Tracking System Part 4: Resources, Representations, Hypertext, and JSON
5.  [The RESTful Chemical Tracking System Part 5: Media Types](http://depth-first.com/articles/2009/09/10/the-restful-chemical-tracking-system-part-5-media-types)

# Previously: A Chemical Tracking System Association Diagram

The following association diagram shows the resources for our system in relation to each other:

![CTS](/images/posts/20090820/cts.png)

# A Media Type For Every Resource

Our chemical tracking system will enable clients to manipulate the state of its resources through a uniform interface. RESTful systems make this possible by transporting representations, which embody the current state of a resource, between client and server.

A representation is simply a data format that completely specifies the state of a resource through a media type (or MIME type). The state of each resource in our system will be completely definable in terms of a custom media type. Clients for our chemical tracking system will be composed of several smaller clients, each of which understand a specific media type encoding a particular resource.

What does a custom media type look like? We have complete freedom in answering this question provided that we adhere to all REST constraints. One approach might be to invent a media type from scratch.

A better approach would be to piggy-back on a standard media type such as XML or JSON.

# JSON: The Low-Fat Data Format

The chemical tracking system we describe here will use [JSON](http://www.json.org/) as the base format for all representations. JSON enjoys the significant advantages over XML of being very lightweight and easy to understand: the entire format can be described [in one Web page](http://www.json.org/). Additionally, JSON is both readable and writable in every major programming language.

# Defining a Media Type

Although JSON will define the syntax of the system's representations, by itself it does nothing to define semantics. For clients to read and write our media types, the system needs to specify the meaning of the elements contained within requests and responses.

We'll define several media types based on JSON, including:

1.  Location [application/vnd.com.metamolecular.cts.Location+json]
2.  Transfer [application/vnd.com.metamolecular.cts.Transfer+json]
3.  User [application/vnd.com.metamolecular.cts.User+json]
4.  Sample [application/vnd.com.metamolcular.cts.Sample+json]
5.  Substance [application.vnd.com.metamolecular.cts.Substace+json]
6.  Index [application/vnd.com.metamolecular.cts.Index+json]

The last media type, Index, is one we'll use to represent resource collections of a single type, such as those appearing in has-many relationships in the system's association diagram.

Each one of these media types will require its own client. This may seem like a big burden to place on developers. However, we can eliminate much of the extra work by following some simple conventions in our media type definitions.

# Hypertext-Driven APIs: Decoupling Clients From Servers

Designing a client-server system is a constant balancing act to find the right level of coupling - too much coupling and both server and client become brittle and stagnate; too little coupling and the system becomes overly complex.

RESTful systems deal with this problem by permitting one and only one point of coupling - media types. In other words, everything a client needs to know regarding the manipulation of a resource and transition to the next state will be packaged into its media type.

One consequence of this constraint is that simply supplying raw data in representations does not suffice for a RESTful system; client-server interactions must be [hypertext-driven](http://roy.gbiv.com/untangled/2008/rest-apis-must-be-hypertext-driven), with the server supplying options to the client in the form of hyperlinks that can be used as levers of state.

If this sounds like the way people use Web sites through their browsers, this is no coincidence; REST simply extends the idea to machine-machine interaction.

The media types for our chemical tracking system will inform clients which options they have available to them by presenting hyperlinks. In this sense the API will work less like a map and more like a GPS.

# Conclusions

This article has laid the groundwork for defining a set of media types for a RESTful chemical tracking system. The next article in this series will show one way to specify these media types and offer some example representations.