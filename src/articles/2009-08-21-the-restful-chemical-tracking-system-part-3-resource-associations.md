---
title: The RESTful Chemical Tracking System Part 3 - Resource Associations
published: "2009-08-21T00:00:00.000Z"
---

Because the tracking of samples plays such a central role in many laboratory activities, it's important that a chemical tracking system work well with a variety of other software. Although there are many ways to achieve interoperability in laboratory information management systems, the REST Web architectural style is one of the most promising. Yet to my knowledge it remains unused.

This article is the third part of a series exploring the idea that the REST Web architectural style can be applied to the creation of laboratory information systems such as chemical tracking systems. In the previous installment, we identified five resources that our system should expose. In this installment we'll look at how these resources can be composed to create a system.

# All Articles in This Series:

1.  [The RESTful Chemical Tracking System Part 1: Introduction](/articles/2009/08/07/the-restful-chemical-tracking-system-part-1-introduction)
2.  [The RESTful Chemical Tracking System Part 2: Resources](/articles/2009/08/14/the-restful-chemical-tracking-system-part-2-resources)
3.  The RESTful Chemical Tracking System Part 3: Resource Associations
4.  [The RESTful Chemical Tracking System Part 4: Resources, Representations, Hypertext, and JSON](/articles/2009/08/28/the-restful-chemical-tracking-system-part-4-resources-representations-hypertext-and-json)
5. [The RESTful Chemical Tracking System Part 5: Media Types](/articles/2009/09/10/the-restful-chemical-tracking-system-part-5-media-types)

# Modelling by Association

After having identified the resources Sample, Substance, Location, User, and Transfer, we need to answer a few questions before implementing our system. One of the most important questions relates to the ways these resources associate with one another.

Associations between resources will appear in database models (probably through an ORM), controllers (through routing), and views (as representations). We'll need to have a good understanding of both the associations themselves and their cardinality.

For example, we know that a Transfer will be associated with one Sample and one User. The relationships among the other resources in our system can be expressed in a similar way. But using prose to describe these relationships is very inefficient.

Wouldn't it be better to express these relationships graphically?

# Notes About Notation

In his book [Analysis Patterns](http://www.amazon.com/Analysis-Patterns-Reusable-Addison-Wesley-Technology/dp/0201895420), [Martin Fowler](http://martinfowler.com/) describes a notation system that turns out to work well in expressing associations (more specifically, unidirectional associations or mappings) between RESTful resources. His graphical system (and the one used here) is summarized below:

![Symbols](/images/posts/20090820/symbols.png "Symbols")

# A Chemical Tracking System Association Diagram

Putting these ideas together, we can propose the following association diagram for our chemical tracking system:

![CTS](/images/posts/20090820/cts.png "CTS")

This diagram provides a convenient way to visualize the components of our RESTful system and how they relate to each other. For example, we can see that a Transfer is composed of three resources: a User; a Location; and a Sample. We can also see that the association between a Sample and a Location is derived from the most recent Transfer. Notice the high connectivity of the Transfer resource; one way to view the system is as one big collection of Transfers.

As we think about the usability and performance implications of these associations, we may decide to change them. The association diagram offers a convenient language to express and examine our ideas about the system, both internally and externally. 

# Conclusions

We've defined a simple chemical tracking system consisting of five resources and their respective associations. This offers a good foundation for defining the data formats through which the clients of this system will be able to manipulate its resources. The next installment will show how.