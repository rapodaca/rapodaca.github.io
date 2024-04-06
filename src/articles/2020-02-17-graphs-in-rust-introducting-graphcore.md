---
title: "Graphs in Rust: Introducing Gamma"
summary: "A new library for applied graph theory."
twitter: true
summary-image: images/posts/20200217/summary.jpg
published: "2020-02-17T14:00:00Z"
updated:   "2020-03-13T01:15:00Z"
---

Graphs pervade science and technology. As such, many kinds of software projects rely on a graph library. This article introduces [Gamma](https://crates.io/crates/gamma), a new graph library written in Rust.

# Motivation

Graphs are used heavily within *cheminformatics*, a field concerned with the collection, storage, and retrieval of information about substances. Most cheminformatics systems use a library for manipulating molecular structures. Such a library is known as a "cheminformatics toolkit" or just "toolkit."  At the core of every cheminformatics toolkit, whether explicitly acknowledged or not, sits a graph library.

A cheminformatics toolkit uses graph representations to solve chemical information problems. For the most part, nodes map to atoms and edges map to bonds. Graphs of this kind are undirected. Numerical edge weights sometimes represent [bond orders](https://en.wikipedia.org/wiki/Bond_order).

A number of graph algorithms are used in cheminformatics. To name three: [subgraph isomorphism](/articles/2008/11/13/one-of-these-things-is-not-like-the-other/); [matching](/articles/2019/04/02/the-maximum-matching-problem/); and cycle perception. Isomorphism finds embeddings and atom/bond mappings between two molecules. Matching is used for [kekulization](/articles/2020/02/10/a-comprehensive-treatment-of-aromaticity-in-the-smiles-language/), or the assignment of alternating single/double bonds in certain classes of molecule. Many important molecules in medicine and commerce contain one or more cycles, so cycle perception is essential for many molecular analyses.

Most cheminformatics applications deal with *small organic molecules*. Graph representations of such molecules contain fewer than 50 nodes, with the degree of any node rarely exceeding four. A graph library used in cheminformatics must therefore be capable of efficient manipulation of small, sparsely-connected graphs.

Other applications for graphs are possible. One application is *feature graphs*. In a feature graph, a node represent a molecular subgraph and an edge represents a bond between them. One especially useful feature graph uses relevant cycles for nodes.

Graph can also represent relationships between molecules. For example, a *reaction graph* maps nodes to molecules and edges to reactions. Traversing such a graph yields information about feasible [multistep chemical transformations](/articles/2013/04/23/planes-trains-and-organic-syntheses/), a cornerstone of the modern world economy.

Although these parameters apply specifically to cheminformatics, they also apply to many other fields. By factoring the graph manipulation aspect into a a separate library, it's hoped that Gamma can serve not only its intended domain, but others as well.

No [Rust cheminformatics toolkit](/articles/2020/01/20/cheminformatics-in-rust/) exists to my knowledge as of yet.

# Requirements

A graph library suitable for cheminformatics in Rust should meet several criteria, including:

- A `Graph` trait defining a minimal API. Several implementations offer tradeoffs in functionality, convenience, and performance will be required in cheminformatics applications.
- At least one `Graph` reference implementation. This implementation can serve as a key primitive when designing graphs (such as molecules) with custom behavior.
- Traversal and analysis functions that accept `Graph` trait objects, not concrete implementations.
- Common Rust idioms should be used whenever possible. Synthetic node references, reference counting, interior mutability, and `unsafe` should all be avoided. Gamma should be as unsurprising as possible.
- A suite of up-to-date unit tests.

# Graph Trait

The center of Gamma is the `Graph` trait, which defines the following methods:

```rust
use crate::graph::Error;

pub trait Graph<'a, N: 'a> {
    type NodeIterator: Iterator<Item=&'a N>;
    type NeighborIterator: Iterator<Item=&'a N>;
    type EdgeIterator: Iterator<Item=(&'a N, &'a N)>;

    /// Returns true if there are no nodes, or false otherwise.
    fn is_empty(&self) -> bool;

    /// Returns the number of nodes in this graph.
    fn order(&self) -> usize;

    /// Returns the number of edges in this graph.
    fn size(&self) -> usize;

    /// Iterates the nodes of this graph
    fn nodes(&'a self) -> Self::NodeIterator;

    /// Returns true if node is a member, or false otherwise. 
    fn has_node(&self, node: &N) -> bool;

    /// Iterates the neighbors of node.
    fn neighbors(&'a self, node: &N) -> Result<Self::NeighborIterator, Error>;

    /// Returns the number of neighbors connected to node.
    fn degree(&self, node: &N) -> Result<usize, Error>;

    /// Iterates the edges of this graph.
    fn edges(&'a self) -> Self::EdgeIterator;
    
    /// Returns true if an edge exists between source and target.
    fn has_edge(&self, source: &N, target: &N) -> Result<bool, Error>;
}
```

This API was chosen to satisfy two opposing goals: utility and brevity. On the one hand, `Graph` should provide a rich API because it alone defines the features available to all graph traversals and analyses. On the other hand, the number of methods must be kept low to avoid burdening implementors with unnecessary work. A previous post offers some thoughts on [the minimal Graph API](/articles/2020/01/06/a-minimal-graph-api/) used here.

The choice of [associated types](https://github.com/rust-lang/rfcs/blob/master/text/0195-associated-items.md) for node and edge iterators deserves some explanation. I considered an alternative `Graph` trait that returned boxed iterators, as given at the bottom of [this article](/articles/2020/01/20/cheminformatics-in-rust/). However, the requirement for boxed iterators seemed limiting. Although trait objects such as `Iterator` can be returned from bare functions, they [must be boxed](https://stackoverflow.com/questions/27535289/what-is-the-correct-way-to-return-an-iterator-or-any-other-trait/27535594) if returned from functions that are themselves defined on traits. This requirement seemed a step up in complexity with poorly-defined performance tradeoffs. For this reason, associated types were chosen for the first releases of Gamma.

Should edge weights be required, the `WeightedGraph` trait is available.

```rust
use crate::graph::Error;
use crate::graph::Graph;

pub trait WeightedGraph<'a, N:'a, E> : Graph<'a, N> {
    /// Returns the weight between source and target.
    fn weight(&self, source: &'a N, target: &'a N) -> Result<Option<&E>, Error>;
}
```

# HashGraph

`HashGraph` provides a versatile default implementation of `Graph` and `WeightedGraph`. Unlike the traits it implements, `HashGraph` supplies the mutators for building a graph in a stepwise fashion. Behind the scenes, `HashGraph` is implemented as a `IndexMap` of `Vec`, in which nodes themselves serve as keys. The use of both data structures ensures that node and edge ordering will be stable to iteration.

The `build` function allows for declarative construction of a `HashGraph`:

```rust
use gamma::graph::HashGraph;

fn main() {
    let mut graph = HashGraph::build(vec![ 0, 1, 2 ], vec![
        (&0, &1, ()),
        (&1, &2, ())
    ]).unwrap();

    assert_eq!(graph.is_empty(), false);
}
```

Alternatively, mutator methods can be used to accomplish the same result:

```rust
use gamma::graph::HashGraph;

fn main() {
    let mut graph = HashGraph::<_,()>::new();

    graph.add_node(0).unwrap();
    graph.add_node(1).unwrap();
    graph.add_node(2).unwrap();
    graph.add_edge(&0, &1).unwrap();
    graph.add_edge(&1, &2).unwrap();

    assert_eq!(graph.has_edge(&1, &0).unwrap(), true);
}
```

Custom node types can be used directly with `HashGraph`. Unlike many graph libraries, Gamma lets you work directly with your own node references, rather than node references returned to you by the library. This vastly simplifies the use of custom node types. The only constraint on a node is that it must implement `std::hash::Hash` and `std::cmp::Eq`.

```rust
use gamma::graph::HashGraph;

#[derive(Eq, Hash, PartialEq, Debug)]
struct Node {
    value: u8
}

impl Node {
    fn new(value: u8) -> Self {
        Node { value }
    }
}

fn main() {
    let n0 = &Node::new(0);
    let n1 = &Node::new(1);
    let graph = HashGraph::<_, ()>::build(
        vec![ n0, n1 ], vec![ (&n0, &n1, ()) ]
    ).unwrap();

    assert_eq!(graph.has_edge(&n0, &n1).unwrap(), true);
}
```

`HashGraph` supports the `WeightedGraph` trait by allowing any type to be used as a weight. For example, the following example shows how to use strings as weights.

```rust
use gamma::graph::HashGraph;

fn main() {
    let mut graph = HashGraph::build(vec![ 0, 1, 2 ], vec![
        (&0, &1, "a"),
        (&1, &2, "b")
    ]).unwrap();

    assert_eq!(graph.weight(&0, &1).unwrap(), Some(&"a"));
}
```

# Traversal with Iterators

Two types of traversal are included: breadth-first and depth-first. Both traversals are implemented as edge `Iterator`s. Taking this approach combines the broad applicability of these traversals with the vast array of transformations supported by Rust's `Iterator` trait.

The edges returned by either traversal `Iterator` are represented as tuples of three values: two nodes, and a boolean. When true, the last value indicates that the edge produces a cut between two nodes in a cyclic graph.

```rust
use gamma::graph::HashGraph;
use gamma::traversal::depth_first;

fn main() {
    let graph = HashGraph::build(vec![ 0, 1, 2 ], vec![
        (&0, &1, ()),
        (&1, &2, ()),
        (&2, &0, ()),
    ]).unwrap();
    let traversal = depth_first(&graph, &0).unwrap();

    assert_eq!(traversal.collect::<Vec<_>>(), vec![
        (&0, &1, false),
        (&1, &2, false),
        (&2, &0, true)
    ]);
}
```

The above example uses the `#collect` transformation to create a `Vec` of edges, but much more is possible. For example, we can filter everything but cycle cut edges:

```rust
use gamma::graph::HashGraph;
use gamma:traversal::breadth_first;

fn main() {
    let graph = HashGraph::build(vec![ 0, 1, 2 ], vec![
        (&0, &1, ()),
        (&1, &2, ()),
        (&2, &0, ()),
    ]).unwrap();
    let traversal = depth_first(&graph, &0).unwrap();
    let cuts = traversal.filter(|edge| edge.2);

    assert_eq!(cuts.collect::<Vec<_>>(), vec![
        (&2, &0, true)
    ]);
}
```

Breath-first traversal works in exactly the same way:

```rust
use gamma::graph::HashGraph;
use gamma::traversal::breadth_first;

fn main() {
    let graph = HashGraph::build(vec![ 0, 1, 2 ], vec![
        (&0, &1, ()),
        (&1, &2, ()),
        (&2, &0, ()),
    ]).unwrap();
    let traversal = breadth_first(&graph, &0).unwrap();

    assert_eq!(traversal.collect::<Vec<_>>(), vec![
        (&0, &1, false),
        (&0, &2, false),
        (&1, &2, true)
    ]);
}
```

# Other Work

I recently [reviewed](/articles/2020/02/03/graphs-in-rust-an-introduction-to-petgraph/) Rust's most widely-used graph crate, [Petgraph](https://docs.rs/petgraph/0.5.0/petgraph/). Aside from being much less mature, Gamma differs in other important ways:

- Petgraph has no `Graph` trait.
- Petgraph's graph types use opaque node pointers rather than the direct node manipulation offered by Gamma.
- Petgraph has four not-quite-interchangeable graph types.
- Some Petgraph functions will not work across all graph types.

These limitations made Petgraph less than ideal for the cheminformatics applications I'm planning.

[Graphlib](https://github.com/purpleprotocol/graphlib/tree/master/src) offers another take on the Rust graph library. Unfortunately it too organizes itself around a concrete implementation of graph, rather than a trait.

A handful of miscellaneous graph crates can also be found on [crates.io](https://crates.io).

Gamma's design parts company with things that have been previously written about graphs in Rust. For example, *[Idiomatic tree and graph like structures in Rust](https://rust-leipzig.github.io/architecture/2016/12/20/idiomatic-trees-in-rust/)* leads the discussion with a more complicated model involving reference counting and nodes that maintain references to neighbors. That model *could* be used with Gamma, but there wouldn't be much point. Other [discussion](https://stackoverflow.com/q/34747464/54426) suggests starting with a [Typed Arena](https://libraries.io/cargo/typed-arena). Similar advice appears in [this document](https://github.com/nrc/r4cppp/blob/master/graphs/README.md). However, Gamma proves this approach to be unnecessary, at least within the scope of its requirements. Gamma likewise demonstrates [vector indices](http://smallcultfollowing.com/babysteps/blog/2015/04/06/modeling-graphs-in-rust-using-vector-indices/) to be unnecessary. Gamma brings the full power of the Rust compiler to bear for every use of `Graph`.

# Future Work

Future work on Gamma will focus on two goals:

1. Refinement of the `Graph` trait. It should be easy to implement graphs with a variety of different internal representations. Whether or not the current design achieves that goal remains to be seen.
2. Implementation of graph algorithms, specifically: matching; subgraph isomorphism; and [relevant cycle](https://www.combinatorics.org/ojs/index.php/eljc/article/view/v4i1r9) perception.

# Conclusions

Gamma is a new graph library for Rust based around a streamlined, flexible `Graph` trait. The Gamma crate includes a reference `Graph` implementation along with two `Iterator`-based traversals. Future work will focus on adding graph algorithms useful for cheminformatics applications.