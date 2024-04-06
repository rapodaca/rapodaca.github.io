---
title: Exhaustive Cycle Enumeration in Rust
id: df-0028
requires:
  - Hanser implementation
enables:
  - df-0027
summary: "Generating the set of all cycles for undirected graphs."
twitter: true
summary-image: images/posts/20230126/summary.png
published: "2023-01-26T15:30:00Z"
---

Enumeration of all cycles is a useful graph operation. This is especially true in cheminformatics, where the set of all cycles is required in tasks ranging from 2D structure layout to electronic characterization and descriptor calculation. Although restricted cycle sets are suitable for some applications, others require exhaustive enumeration. This article introduces a Rust crate for doing that.

# Introducing Ciclo

[Ciclo](http://github.com/metamolecular/ciclo/) (cì·clo, Italian for "cycle") offers a suite of tools for working with cycles, including a function for exhaustive cycle enumeration (`all_cycles`). Graphs can currently be encoded in [edge list](https://en.wikipedia.org/wiki/Edge_list) form. Nodes can be any type implementing the `Eq`, `Hash`, `Clone`, and `Debug` traits. Ciclo can be installed from [crates.io](https://crates.io/crates/ciclo). For now, Ciclo's scope is limited to exhaustive graph enumeration, but additional cycle utilities might be added later.

The following illustrates the construction of a graph and the enumeration of its cycles.

```rust
use ciclo::Graph;
use ciclo::all_cycles;

fn test() {
    let graph = Graph::from_edges(vec![
        (0, 1),
        (1, 2),
        (2, 0),
    ]).unwrap();

    println!(all_cycles(graph));
}
```

More examples can be found in the project's unit test suite.

# Comparing Cycle Sets

If you run the code snippet in the preceding section you may notice run-to-run variations. All reported cycles should all be equivalent, but they may not be strictly equal. This results from `Graph`'s use of `HashMap`, whose key iteration order is non-deterministic.

It's inconvenient to work with cycle sets that may not be strictly equal to each other, especially during development and testing. To solve this problem, Ciclo includes the `Cycle` type. `Cycle` can be added to hash maps and sets, allowing the direct comparison of cycle sets, regardless of the manner in which they were generated.

```rust
use std::collections::HashSet;
use ciclo::Graph;

fn test() {
    let left = Cycle::new(vec![0, 1, 2]);
    let right = Cycle::new(vec![2, 0, 1]);

    assert_eq!(left, right)

    let mut set = HashSet::new();

    set.insert(left);

    assert!(set.contains(&right))
}
```

`BTreeMap` might look like an option here, but it's not. The order in which cycles are iterated and expressed linearly depends on the implementations of `Graph` and `all_cycles`. A hashable `Cycle` type prevents test suites from failing under future optimization.

# About the Algorithm

Ciclo's `all_cycles` function is based on an algorithm described in [*A New Algorithm for Exhaustive Ring Perception in a Molecular Graph*](https://doi.org/10.1021/ci960322f). The foundation of this algorithm is the iterative removal of nodes from a *path graph*. A path graph is an undirected graph where each edge is labeled with a sequence of nodes representing a path.

Removing a node results in the update of all affected edges through *path reduction*. Path reduction removes a node between two other nodes, updating the respective edges accordingly.

<figure>
  <img alt="path-graph-reduction" src="/images/posts/20230126/path-graph-reduction.png">
  <figcaption>
    <strong>Path Graph Reduction.</strong> Cycles are exposed through iterative node removal from a path graph. [<a href="https://doi.org/10.1021/ci960322f">source</a>].
  </figcaption>
</figure>

In some cases, path reduction leads to pseudocycles, as below. Such cycles are not reported.

<figure>
  <img alt="pseudocycle" src="/images/posts/20230126/pseudocycle.png">
  <figcaption>
    <strong>Pseudocycle.</strong> Reduction can generate path graph cycles, but these are not reported. [<a href="https://doi.org/10.1021/ci960322f">source</a>].
  </figcaption>
</figure>

If the node removed from a path graph bears a loop (source and target nodes are identical), a cycle has been detected. The set of all such loops comprises the reported cycle enumeration. The algorithm finishes with the removal of the last node.

<figure>
  <img alt="loop" src="/images/posts/20230126/loop.png">
  <figcaption>
    <strong>Exposing a loop.</strong> A loop is exposed through removal of the penultimate node in a cycle. This cycle is reported when the last remaining node in the cycle is removed. [<a href="https://doi.org/10.1021/ci960322f">source</a>].
  </figcaption>
</figure>

# Conclusion

Applications in cheminformatics and graph theory more broadly may require access to a graph's set of all cycles. This article introduces a Rust implementation of an algorithm capable of doing so.
