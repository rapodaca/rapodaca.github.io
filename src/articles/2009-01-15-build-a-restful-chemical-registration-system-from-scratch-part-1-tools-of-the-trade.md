---
title: Build a RESTful Chemical Registration System from Scratch Part 1 - Tools of the Trade
published: "2009-01-15T00:00:00.000Z"
---

A chemical registration system forms the core of most database-driven cheminformatics applications. Yet detailed instructions, in the traditional literature or otherwise, on how to create one from free components are surprisingly rare. This article introduces a new Depth-First series aimed a bringing together several tutorials written over the last year to create a RESTful chemical registration system that anyone can build, run, and adapt to their own needs.

# Defining the Problem

Whether you're building or designing a database-driven chemical informatics system, at some point you'll face the problem of getting molecules into and out of your database. This is where chemical registration systems come in. [eMolecules](http://emolecules.com) has created a [summary on the subject](http://www.emolecules.com/doc/cheminformatics-101-chemical-registration.php). It defines the main responsibilities of a chemical registration system as ensuring:

- **Structural novelty** - The same molecule never gets stored twice.
- **Structural normalization** When multiple representations of a molecule are possible (e.g., tautomers and charge-separated forms), only one is used.
- **Structure drawing** Present a chemical structure recognizable to chemists.
- **Consistent relationships among related compounds** The system must decide what to do with various salt forms (or other mixtures) of a particular compound a user might decide to register. There are many options, but they must be applied consistently.
- **Reasonable behavior when a structure is (partially) unknown** Not every compound of interest will have a known chemical structure. Sometimes the structure will only be partially known as in the case of double bond geometry and absolute stereochemistry.
- **Security** [Enough said](http://www.codinghorror.com/blog/archives/001210.html)? There's always more.
- **Reasonable behavior when changes are made to structures** The system must be able to respond well to the inevitable: a user changes their mind about the structure s/he entered.

The system we'll build in this tutorial won't deal with all of these responsibilities, but it will handle most of them. In addition, it will address some other problems as well.

# The Approach

We'll be building a [Web Service](http://en.wikipedia.org/wiki/Web_service), which is [defined](http://www.w3.org/TR/ws-gloss/) by the [W3C](http://www.w3.org/) as "a software system designed to support interoperable machine-to-machine interaction over a network."

The reason is simple: we want our chemical registration system to be addressable from anywhere in the world, and we want to use it as an interchangeable, technology-agnostic, loosely-coupled component to build more complex chemistry Web applications.

We want this system to be as easy to deploy as possible on *any* hardware. Lengthy configuration processes, source code compilation, and exotic dependencies are out. Drag-and-drop deployment, self-contained packaging, convention over configuration, and platform-independent binaries are in.

# REST?

There are currently multiple competing approaches for creating Web Services. One of the most flexible and straightforward to implement is [Representational State Transfer](http://en.wikipedia.org/wiki/Representational_State_Transfer) (REST). In a nutshell, REST leverages the full HTTP protocol for passing messages to and from the server. This simple idea has some powerful implications for the design of the system, which will be explored in articles to come.

# Tools

We will use a number of free, open technologies in the creation of our system:

- **Technology Platform** Java will be used exclusively due to its massive installed base, platform-independence, and high performance.
- **Cheminformatics Toolkit** [MX](http://code.google.com/p/mx-java/) will supply the main interface between chemistry and Java.
- **Unique Identifier** [InChI](http://www.iupac.org/inchi/) will be used to assign unique identifiers to compounds stored in the registry.
- **Server** [Jetty](http://www.mortbay.org/jetty/) will supply basic HTTP functionality.
- **Servlet** [Restlet](http://www.restlet.org/) will simplify the implementation of REST using the servlet specification.
- **Database** [H2](http://www.h2database.com/html/main.html) will provide fast, portable, zero-administration SQL support.
- **Object Persistence** The exact method of persisting Java objects hasn't been settled yet, but [Active Objects](http://www.javalobby.org/articles/activeobjects/) looks quite interesting, especially when [combined with H2](http://www.manskes.de/index.php/2008/10/30/the-simplest-activeobjects-database-provider-for-the-h2-database/).

# Conclusions

Chemical registration systems play a vital role in enabling data-driven chemistry applications. This article introduced the problems registration systems typically solve and outlined a plan for implementing one using only free, open components. The next article in this series will discuss the design of the registry Web Service.
