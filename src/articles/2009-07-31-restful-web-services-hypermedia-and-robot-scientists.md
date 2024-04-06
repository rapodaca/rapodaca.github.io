---
title: RESTful Web Services, Hypermedia, and (Robot) Scientists
published: "2009-07-31T00:00:00.000Z"
---

Although autonomous [Robot Scientsts](http://www.aber.ac.uk/compsci/Research/bio/robotsci/) will probably not be appearing in quantity for some time to come, many labs already host an impressive array of automated technologies used in connection with chemical research. Much of this equipment consists of an autosampler attached to an instrument such as an NMR spectrometer, a mass spectrometer, a chromatogram, or a preparative chromatography system. At the interface between chemistry and biology, high-throughput robotic screening has become a fundamental component of modern drug discovery.

# The Problem

What all of these systems have in common is the need to communicate with the outside world. Everything from scheduling the next sample to making collected data available to recovering from failure requires a communication medium and a protocol. Increasingly, this communication is being done over computer networks.

An LC-MS system might save its data to a network share drive. An email notification might be available when an NMR sample is done. An [Electronic Laboratory Notebook](/articles/2009/01/02/the-electronic-laboratory-notebook-trap) (ELN) might even be linked to these instruments, reducing the need to manually track and record experiments.

All of this communication, while making chemists more productive, comes at a price: coupling between the systems talking to each other. If, for example, a vendor introduces an upgrade to its LC-MS software using a different method, format, or location for storing data and making notifications, a company's ELN might stop working.

Getting the most out of automation technologies relies on reducing the coupling between components and the systems using them.

# REST

The last fifteen years have seen the evolution of a number of approaches to the problem of client/server architectures. One approach gaining especially wide adoption is [Representational State Transfer](http://www.ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm), or REST. The ideas behind REST have been embraced by numerous consumer-oriented services including [Flickr](http://www.flickr.com/services/api/request.rest.html), [Netflix](http://developer.netflix.com/docs/REST_API_Conventions), and [Twitter](http://apiwiki.twitter.com/Things-Every-Developer-Should-Know). The result has been an explosion of services built on top of these APIs.

# REST is Widely Misunderstood 

But according to [Roy Fielding](http://roy.gbiv.com), author of the [original work on REST](http://www.ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm) and co-author of the HTTP specification, [most systems claiming to be RESTful are in fact not](http://roy.gbiv.com/untangled/2008/rest-apis-must-be-hypertext-driven) because they're too tightly coupled to their clients:

>I am getting frustrated by the number of people calling any HTTP-based interface a REST API. Today's example is the [SocialSite REST API](http://wikis.glassfish.org/socialsite/Wiki.jsp?page=FinalizeRESTAPI) \[broken link\]. That is RPC. It screams RPC. There is so much coupling on display that it should be given an X rating.

# Hypertext: The Hard Part About REST

Hypertext (or more generally hypermedia) is the concept that seems to give the most trouble when building RESTful Web applications. Fielding [defines](http://roy.gbiv.com/untangled/2008/rest-apis-must-be-hypertext-driven#comment-718) "hypertext" as:

>When I say hypertext, I mean the simultaneous presentation of information and controls such that the information becomes the affordance through which the user (or automaton) obtains choices and selects actions. Hypermedia is just an expansion on what text means to include temporal anchors within a media stream; most researchers have dropped the distinction.
>
>Hypertext does not need to be HTML on a browser. Machines can follow links when they understand the data format and relationship types.

The hypertext constraint in REST is often referred to as "Hypermedia as the Engine of Application State" or HATEOAS.

The irony is that even Web noobs get the concept of hypertext: (1) start on a home page; (2) read some text; (3) find a link; (4) click link; (5) get a new page.

REST simply says that what works for humans on the Web should work for machines as well.

# Media Types: Essential Building Blocks of a RESTful System

It's not enough for machines to follow links. They need to have an idea of what's on the other side. This is where media types (think MIME types) come in. A media type communicates to a REST client the semantics of the current page and what's on the other end of its links.

In other words, RESTful Web applications don't serve generic media types like 'application/xml' or 'application/json'. Instead they either use existing media types with well-defined semantics (e.g., [Atom](http://en.wikipedia.org/wiki/Atom_(standard))), or invent new media types - possibly based on a general purpose data representation format such as XHTML or JSON.

In a truly RESTful system, almost all coupling between client and server is reduced to the media types they exchange.

# Signs Your API is not RESTful

The existence of any of these attributes indicates that a Web API is not RESTful:

-  published URI templates, e.g., /courses/{id}/students
-  serving 'application/xml' or 'application/json' media types
-  documentation that doesn't focus on media types

# Examples

The problem with the REST architectural style is that so few examples exist. Abstract concepts without examples usually don't gain much traction.

For one example of an API that comes very close to what a RESTful application should look like, check out the [Sun Cloud API](http://kenai.com/projects/suncloudapis/pages/Home).

# The Chemcaster Web API

[Chemcaster](http://chemcaster.com) is a cheminformatics Web services platform that enables the creation of chemistry-focused Web applications without the need to install or maintain cheminformatics software. It offers resources for the most important cheminformatics capabilities including compound registration, structure imaging, and exact- and substructure search.

The [current Web API](http://chemcaster.com/api), although making use of many concepts from REST, does not implement the HATEOAS constraint, and so is not RESTful.

In particular, notice the tight coupling this API promotes: a change to any of the URIs implemented by the server through renaming, a change of resource primary id, or a change in protocol (e.g., https->http) may result in clients that no longer work with the service. 

Also notice that there's no obvious way to deal with such problems as results pagination or API versioning.

We're currently working on a new, RESTful API that's completely hypertext-driven. A Ruby Chemcaster client is also under development and will be released as open source.

Although still early days, it's already clear that the new Chemcaster API will enable much more evolution of the service without affecting existing client code. Work so far also suggests that given the right set of low-level tools, clients (and servers) for this kind of hypertext-driven API can be developed very efficiently.

# Conclusions

The importance of automated agents such as instruments and systems that interact with them in science will only increase over time. Effective communication among these systems and the people using them is essential to realizing the biggest return on investment. REST offers a powerful approach to the problem of keeping scientific informatics systems and automated agents working together while the underlying components evolve.