---
title: RESTful Substructure Search
published: "2009-06-03T00:00:00.000Z"
---

[REST](http://en.wikipedia.org/wiki/Representational_State_Transfer) is an architectural style for Web applications that emphasizes regularity and discoverability. Unlike most other approaches, REST exploits the full power of HTTP, both in terms of expression and performance optimization. This article explores REST from the perspective of cheminformatics Web services, using the specific example of substructure search.

# REST and Chemical Information Services

Chemical information systems have a lot to gain from using RESTful architectures. As the number of [free chemistry databases](http://zusammen.metamolecular.com/2009/03/09/sixty-four-free-chemistry-databases-serialized) continues to increase, interoperability can serve as a potent tool in counteracting confusion and fatigue on the part of end users. REST offers a low-energy pathway to achieve interoperability among the growing number independent chemical information services.

# RESTful Substructure Search

Let's say we run a chemical database that offers programmatic access to substructure search. How should the API to this feature be designed?

We could start by thinking of a substructure search as being a kind of resource:

>The key abstraction of information in REST is a resource. Any information that can be named can be a resource: a document or image, a temporal service (e.g. "today's weather in Los Angeles"), a collection of other resources, a non-virtual object (e.g. a person), and so on. In other words, any concept that might be the target of an author's hypertext reference must fit within the definition of a resource. A resource is a conceptual mapping to a set of entities, not the entity that corresponds to the mapping at any particular point in time.
>
><cite>Roy Fielding [PhD Dissertation](http://www.ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm)</cite>

We might call our substructure search resource "Query." Using four HTTP verbs, we could create (POST), read (GET), update (PUT), and destroy (DELETE) queries:

```bash
POST   /queries      # create a new Query
GET    /queries/{id} # read the results of a Query
PUT    /queries/{id} # edit a previously-created Query
DELETE /queries/{id} # delete a Query 
```

Notice that all four basic HTTP verbs are used. Also notice that specific parameters of a new query are encoded in a formatted payload within the body of a POST request - not in the URL itself.

A POST request against /queries returns a response body containing the Query {id} that would be the key to future use of the results. It may also contain the full content of the Query results, depending on our goals for the system.

A Query results set would consist of an array of Structure identifiers. Because Structures are also resources, we operate on them the same way we operate on Queries:

```bash
POST   /structures      # create a new Structure
GET    /structures/{id} # display a Structure
PUT    /structures/{id} # edit a previously-created Structure
DELETE /structures/{id} # delete a Structure 
```

Workflows in such a system become quite easy to understand and implement. For example, how would we delete all Structures containing a naphthalene ring? The answer should be apparent even with the limited discussion presented here.

Building our Web API entirely out of resources and the four verbs that act on them results in a system that's easier to maintain, document, understand, and use.

# Implications

Defining Query as a full-fledged resource in our system offers some intriguing possibilities for better serving our users.

For example, Joe might be especially interested in the quinoxalines contained in our heterocycle synthetic methods database. Whenever a new method for preparing quinoxalines appears, he wants to know about it immediately.

Using our RESTful architecture, Joe can create his query, and then build a custom RSS feed from it:

```bash
GET  /queries/1234.rss #Query results in RSS format
```

Now, whenever a new quinoxaline preparation appears, Joe gets instant, unobtrusive notification in his feed reader. Our system may also allow Queries to be shared among users, creating opportunities for users with no previous contact to discover other chemists who share their interest in a particular structural motif.

Still more interesting possibilities exist for users of our Web API. Our RESTful architecture will be easily understandable by other developers, so the barrier to interoperating will be reduced. A marine natural products database ("AquaBase") may decide to link its structure collection to ours. Whenever a new natural product is added that contains an interesting heterocyclic ring system, AquaBase uses our Web API to find possible syntheses for display to its users.

# Examples

[Chemcaster](http://chemcaster.com), the cheminformatics Web services platform, has implemented a [RESTful substructure search API](http://products.metamolecular.com/2009/05/26/substructure-search-with-the-chemcaster-web-api) that works as described here. Users maintain collections of Structures, against which Queries can be run. Queries can be stored and re-used. One application could be a chemical supplier catalog in which the goal is to automatically create and maintain product categories based on substructure, for example: "indoles"; "imidazoles"; "pyrroles"; and "pyrimidines."

PubChem's [Power User Gateway](http://pubchem.ncbi.nlm.nih.gov/pug_soap/pug_soap_help.html) (PUG) is a cheminformatics Web API that allows substructure searches and is based on SOAP. Even a cursory reading of the documentation will reveal differences with the approach described here. As such, PUG affords an opportunity to assess the tradeoffs between SOAP and REST in cheminformatics.

# Conclusions

Disconnected chemical databases live life well below their potential. By designing services with RESTful APIs, the utility of these services can be extended significantly. Even concepts as abstract as "substructure search" can be modeled as resources for use in RESTful systems.