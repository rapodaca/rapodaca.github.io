---
title: A Minimal Graph API
summary: "An attempt to define the essential behaviors of graph-like objects."
twitter: true
summary-image: images/posts/20200106/summary.png
published: "2020-01-06T17:00:00Z"
---

Graphs are ubiquitous data structures in computing, appearing in domains ranging from networks to logistics to chemistry. Despite these diverse applications, relatively little has been said about the irreducible elements of graph-like behavior. This article introduces a minimal application programming interface (API) for graphs that I've developed over the last several years. Later articles will illustrate some implementations and uses in Rust, JavaScript, and possibly other languages.

# Methods

A graph can be defined as any object supporting the following 11 methods:

1. **nodes** Iterates all nodes.
2. **order** Returns the number of nodes.
3. **hasNode** Takes one parameter, returning true if it's a member, or false otherwise.
4. **degree** Takes one parameter, returning its count of outbound edges.
5. **neighbors** Takes one parameter, iterating the nodes connected to it by an outbound edge.
6. **size** Returns the number of edges.
7. **edges** Iterates all edges.
8. **hasEdge** Takes two parameters, returning true if an edge exists from the first to the second, or false otherwise.
9. **weight** Returns the optional weight associated with the edge from source to target.
10. **isEmpty** Returns true if the graph order is zero.
11. **debug** Returns an object representing the internal state of the graph.

These methods can be grouped into three broad categories: node operations (1-5); edge operations (6-9); and global operations (10-11). This API offers several high-level advantages and trade-offs, as described below.

# Immutability

The `Graph` interface exposes no mutators. As a result, clients can only interact with immutable `Graph` objects. This offers two advantages:

1. Simplicity of implementation. Public mutators are optional, reducing the surface area of required functionality.
2. Simplicity of use. Defensive copying and/or locking are unnecessary because clients can never change `Graph` state.

Without mutators, how will a `Graph` be created? There are two options: (1) a `build` function or public constructor; and (2) a Builder interface.

A `build` function accepts a template data structure argument, returning a fully-constructed `Graph` in response. The data structure can take a number of forms. One of the simplest would consist of two arrays &mdash; one holding references to nodes and the other holding tuples of nodes and weights to be used as edges.

In contrast, a Builder interface exposes methods that clients can use to assemble a `Graph` incrementally. A minimal Builder interface would include the following methods:

1. **addNode** Accepts one parameter representing a node to be added.
2. **addEdge** Accepts two parameters, one a reference to a source node and the other a reference to a destination node for a new edge.
3. **graph** Returns the graph under construction.

Depending on the application, methods for removing nodes and edges might also be included.

# Minimal Node Interface

Some approaches to modeling graphs require nodes to support an interface returning neighbors or parent graph. No such node interface is required here. In practice, some constraints may be imposed by the programming language. For example, Rust requires objects that will be used as keys in hash tables to explicitly declare "equals" and "hash" methods. If a `Graph` internally inserts nodes as keys, this detail will leak into the interface. But even in the unlikely event that such constraints are imposed, they represent at best a minor narrowing of node API.

The minimal interface also simplifies node implementation. Furthermore, the same node can be used by multiple graphs simultaneously. In subgraph isomorphism, for example, an embedding of one graph in another is computed. Reporting this embedding as a subgraph composed of the same nodes as the parent graph simplifies working with the result.

# Implicit Edges

Edges do not exist explicitly in this API. Rather, their presence is implied by the `degree`, `neighbors`, `size`, `hasEdge`, and `weight` methods. More explicit representation can be found in the `edges` and `debug` methods. Most languages allow edges to be conveyed as simple data structures such as arrays or tuples.

Some approaches to Graph APIs invoke an explicit "edge" interface supporting such operations as "source," "target," "mate," and "parent." Eliminating explicit edges allows greater flexibility in representing the connections between nodes. However, the cases in which this is really needed are rare in my experience. In most situations, it be of no use to explicitly refer to edges.

# Many Kinds of Graphs are Supported

Node- and edge-specific methods can be re-interpreted to support various kinds of specialized graphs. For example, directed graphs can be supported by making the order of arguments in the `hasEdge` method significant. Likewise, unweighted graphs can be supported by always returning a null value from `weight`. The `build` function of a simple graph would yield an error on attempting to connect a node with itself, whereas a graph supporting loops would allow it. In a multigraph, `edges` may iterate multiple edges between the same two nodes. And so on.

Various performance optimizations are possible based on what a type of graph will allow. For example, a "dyad" is a graph consisting of two nodes with an edge between them. A dyad need not hold an array or hash map for nodes; just its two member nodes will suffice. `nodes` iterates them. `hasNode` checks that the argument is one or the other. `degree` returns 1 if passed a member. And so on.

One graph type not directly supported by the API is "hypergraph," a generalized graph in which an edge can join two or more nodes. However, such behavior can be simulated by layering a subgraph onto a parent graph. The subgraph plays the role of a hyperedge, supporting two or more connections between nodes through pairwise relationships. The same node can belong to both the parent graph and the associated subgraph. I'll give details on this approach in a subsequent article dealing with multi-center bonding in molecules based on the Graph API presented here.

# Debug Output

The `debug` method allows the internal state of a Graph to be inspected without breaking encapsulation. This can be useful when writing automated tests, for example.

Beyond testing, the output from `debug` can also be used to interconvert graph representations. Combining `debug` and `build` makes it possible to either copy a graph or convert one graph representation into another.

# Error Handling

`Graph` implementations should strive to return a consistent set of errors. For example, calling `hasEdge` with a non-member node may signal an error condition. The same consideration applies to `weight`. If an error is produced with one of these methods, it should be produced for both of them. A consistent pattern of error generation should hold across Graph implementations as well.

# Iterators

The methods `nodes`, `neighbors`, and `edges` return iterators, not internal data structures. This approach promotes encapsulation. Tooling around the efficient creation and use of iterators is common in modern programming languages.

Working exclusively with iterators might seem limiting. For example, it's sometimes convenient to refer to nodes by their zero-based index. If such uses are common, one solution might be to use numerical indexes themselves as nodes. Alternatively, a mapping of node to index can be created inexpensively and re-used. In my experience, however, iterators are sufficient, and node indexing is rarely needed.

# Conclusion

This article describes a minimal and general API for graph-like objects. Eleven methods are defined by an immutable `Graph` interface. No specific interface is required by nodes. Edges are mostly implicit. A streamlined, read-only graph API simplifies implementations optimized for performance and/or requiring special behavior.