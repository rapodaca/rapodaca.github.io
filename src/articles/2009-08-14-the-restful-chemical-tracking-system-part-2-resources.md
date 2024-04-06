---
title: The RESTful Chemical Tracking System Part 2 - Resources
published: "2009-08-14T00:00:00.000Z"
---

Chemical tracking plays a central role in many laboratories today. From enabling remote collaboration via sample management to helping control stockroom costs, the high degree to which chemical tracking intersects with a number of other important lab activities is unmistakable.

This article is part of a series exploring the idea that the REST Web services architectural style can be applied to the problem of creating a flexible chemical tracking system. In this installment, we'll take a look at the fundamental building blocks of every RESTful system - resources.

All Articles in This Series:

1.  [The RESTful Chemical Tracking System Part 1: Introduction](http://depth-first.com/articles/2009/08/07/the-restful-chemical-tracking-system-part-1-introduction)
2.  The RESTful Chemical Tracking System Part 2: Resources
3.  [The RESTful Chemical Tracking System Part 3: Resource Associations](http://depth-first.com/articles/2009/08/21/the-restful-chemical-tracking-system-part-3-resource-associations)
4.  [The RESTful Chemical Tracking System Part 4: Resources, Representations, Hypertext, and JSON](http://depth-first.com/articles/2009/08/28/the-restful-chemical-tracking-system-part-4-resources-representations-hypertext-and-json)
5.  [The RESTful Chemical Tracking System Part 5: Media Types](http://depth-first.com/articles/2009/09/10/the-restful-chemical-tracking-system-part-5-media-types)

# Identifying Resources

What exactly is a resource? A resource is any relevant tangible object or idea in a problem domain.

In the case of a chemical tracking system, our resources will relate to the problem of following a sample as it moves within a laboratory (or through a network of laboratories). To identify resources, we'll need some idea as to how the system will be used.

One of the main purposes of a chemical tracking system is to enable users to find the location of a sample by a variety of criteria. But other purposes may drive our decisions as well. For example, we may want to assemble a history of the locations a sample may have occupied. Or, we may want to prepare an inventory listing all of the samples in any particular location. As the system and the software making use of it evolve, we may think of still other ways to use the information.

As we think of the ways our system is likely to be used, a few key concepts stand out:

-  *Sample*: the physical object we want to keep track of. This might be a vial, a well in a plate, a reagent bottle, or a 20-gallon drum. We'll probably want our system to have some notion of container capacity and type.
-  *Substance*: the molecular entity (or entities) contained in a *Sample*. We'll need to have some way of identifying a *Substance*. Depending on our needs, this identification might take the form of a registry number, a machine-readable structure representation, or even a name.
-  *Location*: the place in which a *Sample* resides (or once resided). The detail with which we want to identify a *Location* can vary. For example, we may only be interested in the building in which a *Sample* resides. Or, we might want to know the specific room within a building. If a room contains an especially large number of *Samples*, we might want to subdivide it still further by workstation, refridgerator, or cabinet.
-  *User*: any entity capable of moving a *Sample* from one *Location* to another. Depending on the equipment involved, a *User* may or may not be a person.
-  *Transfer*: the act of a *User* moving a *Sample* from one *Location* to another. Notice that unlike the other resources on this list, a *Transfer* is not something we can physically interact with.

There may be other resources to consider, but the ones listed will most likely show up in any chemical tracking system.

# Conclusions

It may seem like we haven't done much. After all, we've just come up with a list of resources and descriptions. However, we've also constrained the system in a useful way, and we now have an idea of what not to worry about.

Having identified five main resources that our chemical tracking system will need to expose, we now need to formalize how they relate to each other. The next article in a series will show one way to do this.