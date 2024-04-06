---
title: "Graphs in Rust: An Introduction to Petgraph"
summary: "Discussion and code examples for Rust's most popular graph library."
twitter: true
summary-image: images/posts/20200203/summary.png
published: "2020-02-03T14:00:00Z"
---

Graphs are ubiquitous in science and technology. As such, many software projects use graphs in one form or another. Here I discuss [Petgraph](https://docs.rs/petgraph/0.5.0/petgraph/), a general-purpose graph library written in Rust. The main features of Petgraph are illustrated with short code samples.

# About Petgraph

Started in 2014, Petgraph is Rust's most popular graph library. According to [crates.io](https://crates.io/crates/petgraph), Petgraph has been downloaded over 2.1 million times. [Dozens of projects](https://crates.io/crates/petgraph/reverse_dependencies) use it as a dependency.

Other than [rustdoc](https://docs.rs/petgraph/0.5.0/petgraph/), documentation on Petgraph is thin. There's an especially acute lack of code examples. A notable exception is the two-part series by Timothy Hobbs:

- [petgraph review/tutorial](https://timothy.hobbs.cz/rust-play/petgraph_review.html)
- [petgraph review: internals](https://timothy.hobbs.cz/rust-play/petgraph-internals.html)

# Overview

Petgraph consists of three main components:

1. **Data structures.** Includes four graph implementations representing performance and functionality trade-offs.
2. **Traversals.** Breadth- and depth-first traversals are implemented as Rust iterators.
3. **Graph algorithms.** Includes isomorphism and several variants on connected components.

# Hello, Graph

The most broadly-useful graph implementation is `Graph`, which is backed by an adjacency list. Create a `Graph` like so:

```rust
use petgraph::graph::Graph;

fn main() {
    let mut graph = Graph::<(), ()>::new(); // directed and unlabeled

    graph.extend_with_edges(&[ (0, 1) ]);

    assert_eq!(graph.node_count(), 2);
    assert_eq!(graph.edge_count(), 1);
}
```

This minimal `Graph` is unlabeled, meaning that both nodes and edges are of `Unit` type (`()`). Labels can be typed as follows.

```rust
use petgraph::graph::Graph;

fn main() {
    let mut graph = Graph::new();
    let origin = graph.add_node("Denver");
    let destination_1 = graph.add_node("San Diego");
    let destination_2 = graph.add_node("New York");
    let cost_1 = graph.add_edge(origin, destination_1, 250);
    let cost_2 = graph.add_edge(origin, destination_2, 1099);

    assert_eq!(graph.node_weight(origin).unwrap(), &"Denver");
    assert_eq!(graph[destination_1], "San Diego");
    assert_eq!(graph.edge_weight(cost_1).unwrap(), &250);
    assert_eq!(graph.edge_weight(cost_2).unwrap(), &1099);
}
```

The bracket notation `graph[handle]` returns an unwrapped, cloned node weight. It panics given an unknown node reference, which may not be desirable for production work.

The value returned from `add_node` is of type `NodeIndex`. It can produce a numerical node index on request:

```rust
use petgraph::graph::Graph;

fn main() {
    let mut graph = Graph::<(),()>::new();
    let n0 = graph.add_node(());
    let n1 = graph.add_node(());

    assert_eq!(n0.index(), 0);
    assert_eq!(n1.index(), 1);
}
```

However, this numerical index is not stable with respect to node deletion. If we rely on node indexing to store state external to the `Graph`, that system will fail the moment a preceding node is removed:

```rust
use petgraph::graph::Graph;

fn main() {
    let mut graph = Graph::<(),()>::new();
    let n0 = graph.add_node(());
    let n1 = graph.add_node(());

    assert_eq!(n0.index(), 0);
    assert_eq!(n1.index(), 1);

    graph.remove_node(n0);

    assert_eq!(n1.index(), 1); // watch out, not updated!

    let indexes = graph.node_indices().collect::<Vec<_>>();

    assert_eq!(indexes[0].index(), 1); // FAIL!
}
```

`Graph` is directed by default. An undirected `Graph` can be created with the `new_undirected` method, among others:

```rust
use petgraph::graph::Graph;

fn main() {
    let mut graph = Graph::new_undirected();
    let origin = graph.add_node("Denver");
    let destination_1 = graph.add_node("San Diego");
    let destination_2 = graph.add_node("New York");
    let cost_1 = graph.add_edge(origin, destination_1, 250);
    let cost_2 = graph.add_edge(origin, destination_2, 1099);

    assert_eq!(graph.edge_weight(cost_1).unwrap(), &250);
    assert_eq!(graph.edge_weight(cost_2).unwrap(), &1099);
}
```

It's often useful to depict a graph. Petgraph supports [DOT](https://graphviz.gitlab.io/_pages/doc/info/lang.html), a graph language specification used by many visualization tools including [Graphviz](https://graphviz.orv). An [online viewer (Vis.js)](http://viz-js.com) is available. DOT is also a useful debugging format on its own.

The example above can be updated to print a DOT representation of the graph.

```rust
use petgraph::prelude::Graph;
use petgraph::dot::Dot;

fn main() {
    let mut graph = Graph::<&str, u32>::new();
    let origin = graph.add_node("Denver");
    let destination_1 = graph.add_node("San Diego");
    let destination_2 = graph.add_node("New York");

    graph.extend_with_edges(&[
        (origin, destination_1, 250),
        (origin, destination_2, 1099)
    ]);

    println!("{}", Dot::new(&graph));
}
```

The output from this program can be copied into Vis.js:

```console
digraph {
    0 [label="Denver"]
    1 [label="San Diego"]
    2 [label="New York"]
    0 -> 1 [label="250"]
    0 -> 2 [label="1099"]
}
```

This yields the image:

<figure>
  <img alt="Graph Depiction" src="/images/posts/20200203/graph.png">
  <figcaption>
    <strong>Graph Depiction from Petgraph Dot output.</strong> Similar images can be generated from <a href="http://viz-js.com">Viz.js</a>.
  </figcaption>
</figure>

An alternative, JSON-based debug format is available through the optional [Serde](https://serde.rs) integration. Activate it by adding the following to your `Cargo.toml` file:

```toml
[dependencies]
serde_json = "1.0.45"

[dependencies.petgraph]
version = "0.5.0"
features = ["serde-1"]
```

Then use the `serde_json::to_string_pretty` function.

```rust
use petgraph::graph::Graph;

fn main() {
    let mut graph = Graph::<&str, u32>::new();
    let origin = graph.add_node("Denver");
    let destination_1 = graph.add_node("San Diego");
    let destination_2 = graph.add_node("New York");

    graph.extend_with_edges(&[
        (origin, destination_1, 250),
        (origin, destination_2, 1099)
    ]);

    println!("{}", serde_json::to_string_pretty(&graph).unwrap());
}
```

This program prints:

```json
{
  "nodes": [
    "Denver",
    "San Diego",
    "New York"
  ],
  "node_holes": [],
  "edge_property": "directed",
  "edges": [
    [
      0,
      1,
      250
    ],
    [
      0,
      2,
      1099
    ]
  ]
}
```

# Graph Implementations

Petgraph supports four graph implementations. Their main difference lies in the data structure backing the graph. This can lead to different memory and time performance depending on the situation. As discussed shortly, however, the APIs of these graphs are not necessarily compatible with all uses.

[`Graph`](https://docs.rs/petgraph/0.5.0/petgraph/graph/struct.Graph.html) is backed with an [adjacency list](https://en.wikipedia.org/wiki/Adjacency_list). There is no restriction on node or edge type. Nodes and edges are accessed through `NodeIndex` and `EdgeIndex` values, respectively. These values in turn allow access to an underlying numerical index. As noted previously, these indexes are not stable under removal operations. `Graph` enjoys the most support among Petgraph algorithms.

Like `Graph`, [StableGraph](https://docs.rs/petgraph/0.5.0/petgraph/stable_graph/struct.StableGraph.html) is backed with an adjacency list. Unlike `Graph`, removing nodes or edges from a `StableGraph` will not invalidate existing indexes.

```rust
use petgraph::stable_graph::StableGraph;

fn main() {
    let mut graph = StableGraph::<(),()>::new();
    let n0 = graph.add_node(());
    let n1 = graph.add_node(());

    assert_eq!(n0.index(), 0);
    assert_eq!(n1.index(), 1);

    graph.remove_node(n0);

    assert_eq!(n1.index(), 1); // not updated

    let indexes = graph.node_indices().collect::<Vec<_>>();

    assert_eq!(indexes[0].index(), 1); // PASS!
}
```

The counterintuitively-named [`GraphMap`](https://docs.rs/petgraph/0.5.0/petgraph/graphmap/struct.GraphMap.html) is backed with a Map, using nodes as keys. Nodes must implement `Copy`, `Eq`, `Ord`, and `Hash`. Node membership tests, a feature missing from `Graph` but present in `StableGraph`, execute in constant time.

Unlike the other three graph implementations, `GraphMap` can work directly with with node and edge labels rather than intermediate handles.

```rust
use std::hash::Hash;
use petgraph::graphmap::UnGraphMap;

#[derive(Copy, Clone, Eq, PartialEq, Ord, PartialOrd, Hash)]
struct City {
    population: u32,
    cars: u32
}

fn main() {
    let mut graph = UnGraphMap::<_, ()>::new();
    let bedford_falls = City { population: 1023, cars: 24 };
    let tinsel_town = City { population: 102479, cars: 1231441 };

    graph.add_node(&bedford_falls);
    graph.add_node(&tinsel_town);
    graph.add_edge(&bedford_falls, &tinsel_town, ());

    assert!(graph.contains_node(&bedford_falls));
    assert!(graph.contains_node(&tinsel_town));
    assert!(graph.contains_edge(&bedford_falls, &tinsel_town));
    assert!(graph.contains_edge(&tinsel_town, &bedford_falls));
}
```

[Csr](https://docs.rs/petgraph/0.5.0/petgraph/csr/struct.Csr.html), is the fourth graph implementation supported by Petgraph. Short for *Compressed Sparse Row* (aka [sparse matrix](https://en.wikipedia.org/wiki/Sparse_matrix)), CSR is an efficient method for representing sparse matrix data such as that used in most graphs. This results in reduced memory requirement with fast edge lookup. There are no restrictions on node or edge type. However, the API for `Csr` is the most restricted of all the graph types.

```rust
use petgraph::csr::Csr;

fn main() {
    let mut graph = Csr::<_,_>::new(); // directed
    let a = graph.add_node("a");
    let b = graph.add_node("b");
    let _ = graph.add_edge(a, b, ());

    assert!(graph.contains_edge(a, b));
    assert!(!graph.contains_edge(b, a));
}
```

# Traversal

Three forms of traversal are supported: breadth-first; depth-first; and depth-first post-order. All are implemented as iterators, and all account for edge directionality.

A depth-first traversal can be executed like so:

```rust
use petgraph::Graph;
use petgraph::visit::Dfs;

fn main() {
    let mut graph = Graph::<(),(), petgraph::Undirected>::new_undirected();

    // 0(1)(2)3
    graph.extend_with_edges(&[
        (0, 1), (0, 2), (0, 3)
    ]);

    for start in graph.node_indices() {
        let mut dfs = Dfs::new(&graph, start);

        print!("[{}] ", start.index());

        while let Some(visited) = dfs.next(&graph) {
            print!(" {}", visited.index());
        }

        println!();
    }
}
```

producing the output:

```console
[0]  0 1 2 3
[1]  1 0 2 3
[2]  2 0 1 3
[3]  3 0 1 2
```

We may want a slightly different order of iteration in which the neighbors of a node are first iterated, then the node itself. Petgraph supports such traversals with `DfsPostOrder`. This traversal is invoked identically to `Dfs`:

```rust
use petgraph::Graph;
use petgraph::visit::DfsPostOrder;

fn main() {
    let mut graph = Graph::<(),(), petgraph::Undirected>::new_undirected();

    // 0(1)(2)3
    graph.extend_with_edges(&[
        (0, 1), (0, 2), (0, 3)
    ]);

    for start in graph.node_indices() {
        let mut dfs = DfsPostOrder::new(&graph, start);

        print!("[{}] ", start.index());

        while let Some(visited) = dfs.next(&graph) {
            print!(" {}", visited.index());
        }

        println!();
    }
}
```

The effect is to first traverse neighbors, then the node itself:


```console
[0]  1 2 3 0
[1]  2 3 0 1
[2]  1 3 0 2
[3]  1 2 0 3
```

Breadth-first traversal is supported with `Bfs`, which works analogously to `Dfs` and `DfsPostOrder`:

```rust
use petgraph::Graph;
use petgraph::visit::Bfs;

fn main() {
    let mut graph = Graph::<(),(), petgraph::Undirected>::new_undirected();

    // 0(1)(2)34
    graph.extend_with_edges(&[
        (0, 1), (0, 2), (0, 3), (3, 4)
    ]);

    for start in graph.node_indices() {
        let mut bfs = Bfs::new(&graph, start);

        print!("[{}] ", start.index());

        while let Some(visited) = bfs.next(&graph) {
            print!(" {}", visited.index());
        }

        println!();
    }
}
```

The result is a characteristic breath-first traversal order:

```console
[0]  0 3 2 1 4
[1]  1 0 3 2 4
[2]  2 0 3 1 4
[3]  3 4 0 2 1
[4]  4 3 0 2 1
```

# Algorithms

Petgraph supports a number of graph algorithms, as documented in the [`algo`](https://docs.rs/petgraph/0.5.0/petgraph/algo/index.html) package. A few algorithms will be highlighted here. However, a warning from the documentation should be kept in mind:

> It is a goal to gradually migrate the algorithms to be based on graph traits so that they are generally applicable. For now, some of these still require the Graph type.

[Isomorphism](https://en.wikipedia.org/wiki/Graph_isomorphism) checks can be used to answer questions about graph equivalence and embedding. For this purpose, Petgraph offers the `is_isomorphic` function:

```rust
use petgraph::Graph;
use petgraph::algo;

fn main() {
    let mut g1 = Graph::<(),(), petgraph::Undirected>::new_undirected();
    let mut g2 = Graph::<(),(), petgraph::Undirected>::new_undirected();

    g1.extend_with_edges(&[
        (0, 1), (0, 2), (0, 3)
    ]);

    g2.extend_with_edges(&[
        (0, 1), (0, 2), (0, 3)
    ]);

    assert_eq!(algo::is_isomorphic(&g1, &g2), true);

    g1.extend_with_edges(&[
        (3, 4)
    ]);

    assert_eq!(algo::is_isomorphic(&g1, &g2), false);
}
```

It can be useful to perform isomorphism checks using customized node and edge equivalence conditions. This is available by passing closures to `is_isomorphic_matching`.

```rust
use petgraph::Graph;
use petgraph::algo;

#[derive(Default)] // required by Graph
struct Node {
    value: u8
}

fn main() {
    let mut g1 = Graph::<_,(), petgraph::Undirected>::new_undirected();
    let mut g2 = Graph::<_,(), petgraph::Undirected>::new_undirected();

    let n0 = g1.add_node(Node { value: 43 });
    let n1 = g1.add_node(Node { value: 44 });

    g1.extend_with_edges(&[ (n0, n1, ()) ]);

    let n2 = g2.add_node(Node { value: 2 });
    let n3 = g2.add_node(Node { value: 10 });

    g2.extend_with_edges(&[ (n2, n3, ()) ]);

    let test_nodes = |a: &Node, b: &Node| a.value > 42 && b.value > 42;
    let test_edges = |_: &(), _: &()| true;

    assert!(algo::is_isomorphic_matching(&g1, &g1, test_nodes, test_edges));
    assert!(!algo::is_isomorphic_matching(&g1, &g2, test_nodes, test_edges));
}
```

Here, the closure `test_nodes` passed to `is_isomorphic_matching` fails unless both nodes being compared have `value` properties greater than 42. The test succeeds for the `g1` to `g1` comparison, but fails when comparing `g1` to `g2` because only one node complies the the `value` requirement.

Both `is_isomorphic` and `is_isomorphic_matching` functions require a `Graph` implementation.

[Dijkstra's algorithm](https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm) is a well-known procedure for finding the shortest paths between nodes. The function [`dijkstra`](https://docs.rs/petgraph/0.5.0/petgraph/algo/fn.dijkstra.html) can be used as follows:

```rust
use petgraph::Graph;
use petgraph::algo;

fn main() {
    let mut graph = Graph::<(),()>::new();

    graph.extend_with_edges(&[
        (0, 1), (0, 2), (0, 3), (3, 4)
    ]);

    for start in graph.node_indices() {
        println!("--- {:?} ---", start.index());
        println!("{:?}", algo::dijkstra(&graph, start, None, |_| 1));
    }
}
```

The program prints the following output representing the cost of visiting each node along the shortest path from a fixed starting node:

```console
--- 0 ---
{NodeIndex(3): 1, NodeIndex(0): 0, NodeIndex(1): 1, NodeIndex(2): 1, NodeIndex(4): 2}
--- 1 ---
{NodeIndex(1): 0}
--- 2 ---
{NodeIndex(2): 0}
--- 3 ---
{NodeIndex(3): 0, NodeIndex(4): 1}
--- 4 ---
{NodeIndex(4): 0}
```

In addition to `is_isomorphic`, `is_isomorphic_matching`, and `dijkstra`, the following algorithms are also available:

- **all\_simple\_paths** Returns an iterator over all paths from a given node.
- **astar** Complements `dijkstra` with heuristics to guide traversal through the graph.
- **bellman\_ford** Complements `dijkstra` by supporting negative edge weights.
- **condensation** Condenses every strongly connected component into a single node.
- **connected_components** Returns the number of connected components.
- **has\_path\_connecting** Returns true if two nodes are reachable through some path.
- **is\_cyclic\_directed** Returns true if a graph contains at least one cycle in the directed sense.
- **is\_cyclic\_undirected** Returns true if a graph contains at least one cycle.
- **kosaraju_scc** Returns a vector of strongly connected components using [Kosaraju's algorithm](https://en.wikipedia.org/wiki/Kosaraju%27s_algorithm).
- **min\_spanning\_tree** Returns a tree for each connected component.
- **tarjan\_scc** Returns a vector of strongly connected components using [Tarjan's algorithm](https://en.wikipedia.org/wiki/Kosaraju%27s_algorithm).
- **toposort** Returns a Vector of nodes in topological order.

# Conclusion

Petgraph supports many of the capabilities needed in projects using graphs. There are four graph implementations, breadth- and depth-first traversal, and 14 graph algorithms. The use of iterators for traversals offers great flexibility and power. Unfortunately, the graph implementations lack a common interface, and some algorithms are incompatible with certain graph implementations. Provided that the algorithms of interest are available for the required graph implementation, Petgraph may be a good choice.