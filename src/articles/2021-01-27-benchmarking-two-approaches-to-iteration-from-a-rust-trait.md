---
title: "Benchmarking Iteration from a Rust Trait"
summary: "Quantitating the relative performance of slices and boxed Iterators in graphs."
twitter: true
summary-image: images/posts/20210127/summary.png
published: "2021-01-26T19:00:00Z"
---

Iterators are ubiquitous in Rust and mostly just work. Even so, Rust Iterators carry some noteworthy caveats. For an example, consider the case of returning an Iterator from a method defined on a trait. This article describes the problem and offers evidence supporting a practical and ergonomic solution.

# A Graph Trait

Imagine designing a Rust crate for working with graphs. Here I'm referring to the [mathematical construct](https://en.wikipedia.org/wiki/Graph_(discrete_mathematics)), not a [chart](https://en.wikipedia.org/wiki/Chart). The performance of many graph algorithms depends on the way graphs themselves are implemented. Two well-known extremes are *[adjacency lists](https://en.wikipedia.org/wiki/Adjacency_list)* and *[adjacency matricies](https://en.wikipedia.org/wiki/Adjacency_matrix)*. An adjacency matrix uses a square matrix in which off-diagonal elements represent edges. An adjacency list uses a jagged list in which each element holds an array of neighbors. The two implementation perform exactly the same task, but with different performance tradeoffs. Various optimizations within each approach are known.

This situation, in which the same set of methods have multiple useful implementations, suggests the use of *[trait](https://doc.rust-lang.org/book/ch10-02-traits.html)*. A Rust trait is a collection of method signatures that can be implemented by any type &mdash; now or in the future. Other languages use different names for the same concept. Java has "interfaces." C++ has "abstract classes." Duck-typed languages such as Ruby or JavaScript have nothing, but that's another story.

What should a `Graph` trait look like? A [previous article](/articles/2020/01/06/a-minimal-graph-api/) examined this question in detail. To recap, only eleven methods are required. Three of them iterate values:

- `ids`. Iterates the node IDs for the graph. Also known as `nodes`.
- `neighbors`. Iterates the node IDs for the neighbors of a node identified by its ID
- `edges`. Iterates edges as a pair of node identifiers.

The minimal graph API is straightforward to implement in other languages using readily-available primitives such as maps and arrays. In Rust, however, things aren't so clear-cut. Those three methods above raise some difficult issues.

# The Problem

A [Rust iterator](https://doc.rust-lang.org/book/ch13-02-iterators.html) is a value that implements the `Iterator` trait and its single method `next`. Rust takes this approach for the same reason that a `Graph` trait is desirable: there are many possible implementations, but it's more convenient for clients to work with a single type.

Returning an iterator from a method is easy. Consider, for example, a struct that owns a collection of integers. The goal is to provide a method for iterating them without revealing the underlying implementation. The code below is one way to do that. For details on the anonymous lifetime near the end of the method declaration (`'_`), see [this](https://blog.katona.me/2019/12/29/Rust-Lifetimes-and-Iterators/).

```rust
struct Owner {
    ids: Vec<usize>
}

impl Owner {
    fn ids(&self) -> impl Iterator<Item=usize> + '_ {
        self.ids.iter().cloned()
    }
}

#[test]
fn test() {
    let owner = Owner { ids: vec![ 0, 1, 2 ] };

    assert_eq!(owner.ids().collect::<Vec<_>>(), [ 0, 1, 2 ])
}
```

Notice that the private field `ids` could just as easily be replaced with a `Set`, a `HashSet`, or any other type that can produce an `Iterator`. In no case does a client need to know which `Iterator` implementation it receives. Moreover, the standard library makes several powerful iterator methods available for free. This is, of course, the power of Rust traits.

But there's a problem. Adding the `ids` method to a trait leads to an error:

```rust
trait Owner {
    // ERROR💥: "`impl Trait` not allowed outside of function and inherent method return types rustc(E0562)"
    fn ids(&self) -> impl Iterator<Item=usize> + '_;
}
```

The [documentation for error E0562](https://doc.rust-lang.org/error-index.html#E0562) informs us that: 

> Abstract return types (written `impl Trait` for some trait Trait) are only allowed as function and inherent impl return types.

In other words, returning a bare trait object from a trait method is not allowed. [A previous article](/articles/2020/06/22/returning-rust-iterators/) discussed this situation in detail. To reiterate the conclusion, the best option for returning an iterator from a trait method: a boxed trait object.

```rust
trait Owner {
  // NO ERROR!
    fn ids(&self) -> Box<dyn Iterator<Item=usize> + '_>;
}

struct MyOwner {
    ids: Vec<usize>
}

impl Owner for MyOwner {
    fn ids(&self) -> Box<dyn Iterator<Item=usize> + '_> {
        Box::new(self.ids.iter().cloned())
    }
}

#[test]
fn test() {
    let owner = MyOwner { ids: vec![ 0, 1, 2 ] };

    assert_eq!(owner.ids().collect::<Vec<_>>(), [ 0, 1, 2 ])
}
```

[`Box`](https://doc.rust-lang.org/std/boxed/struct.Box.html) is a heap-allocated pointer that automatically delegates the methods of the value it owns. As such, the return value can be used in exactly the same way as a concrete type. This is illustrated in the `test` function, which uses the `Iterator#collect` method as if it were defined on `Box`.

As discussed previously, it's technically possible to use associated types here as well. The `Owner` trait could, for example, be defined with an associated type `ItemIterator`. The main feature of this approach is that it does not require a `Box`. An `Iterator` can be returned directly from the `items` method by the implementor. And that could improve performance.

```rust
trait Owner2 {
    type ItemIterator: Iterator<Item=usize>;

    fn items(&self) -> Self::ItemIterator;
}
```

Unfortunately, all of my attempts to implement the `Owner2` trait have ultimately resulted in the introduction of a lifetime parameter. A way around this problem will have to await [generic associated types](https://stackoverflow.com/questions/54161441/). Suffice it to say that a library with a foundational type carrying a lifetime parameter (e.g., `Graph<'a>`) is going to be very hard to use.

Boxed iterators uniquely solve the problem today without introducing a lifetime parameter. But what about performance?

# Boxed Iterator Performance

To my knowledge, no 1:1 comparison of the performance of boxed iterators and an alternative has ever been published. A few hypotheses have been put forward, as can be seen in:

- [What are the actual runtime performance costs of dynamic dispatch?](https://stackoverflow.com/questions/28621980/)
- [Performance implications of Box&lt;Trait&gt; vs enum delegation](https://users.rust-lang.org/t/performance-implications-of-box-trait-vs-enum-delegation/11957)
- [trait objects: 22x slower than static dispatch?](https://www.reddit.com/r/rust/comments/74llky/trait_objects_22x_slower_than_static_dispatch/)

That third thread in particular raises a red flag. The last thing a trait should do is saddle its implementors with an extreme performance liability. Benchmarking might offer a way to dispel doubt.

# Slice-Based Iteration

At least one alternative to returning an iterator exists: return a slice instead. Clients can use exactly the same iteration pattern, while incurring none of the uncertainty of returning iterators from trait methods.

```rust
trait Owner {
    // slice 🍕, not Iterator 
    fn ids(&self) -> &[usize];
}

struct MyOwner {
    ids: Vec<usize>
}

impl Owner for MyOwner {
    fn ids(&self) -> &[usize] {
        &self.ids
    }
}

#[test]
fn test() {
    let owner = MyOwner { ids: vec![ 0, 1, 2 ] };

    assert_eq!(owner.ids().iter().collect::<Vec<_>>(), [ &0, &1, &2 ])
}
```

The main problem with this approach is inflexibility. What if `MyOwner` were backed by a `HashSet`, `HashMap`, or another data structure that could not return a slice of values? Returning a slice from the `ids` method leaks a detail that constrains implementations. This undermines the very reasons to use a trait in the first place.

# Two Graph Interfaces

[Gamma](https://crates.io/crates/gamma) is a Rust crate for working with graphs. It supports the minimal graph API through its `Graph` trait. Currently (v0.9.0), that trait uses the boxed Iterator pattern for its three iteration methods:

```rust
pub trait Graph {
    /// Returns true if there are no nodes, or false otherwise.
    fn is_empty(&self) -> bool;

    /// Returns the number of nodes in this graph.
    fn order(&self) -> usize;

    /// Returns the number of edges in this graph.
    fn size(&self) -> usize;

    /// Returns an Iterator over node identifiers.
    fn ids(&self) -> Box<dyn Iterator<Item=usize> + '_>;

    /// Returns an iterator over node identifiers for the neighbors at id,
    /// or Error if not found.
    fn neighbors(
        &self, id: usize
    ) -> Result<Box<dyn Iterator<Item=usize> + '_>, Error>;
    
    /// Returns true if id is a member, or false otherwise.
    fn has_id(&self, id: usize) -> bool;

    /// Returns the count of neighbors at id, or Error if id not found.
    fn degree(&self, id: usize) -> Result<usize, Error>;

    /// Returns an iterator over the edges of this graph.
    fn edges(&self) -> Box<dyn Iterator<Item=(usize, usize)> + '_>;

    /// Returns true if the edge (sid, tid) exists, or false otherwise.
    /// Returns Error if either sid or tid are not found.
    fn has_edge(&self, sid: usize, tid: usize) -> Result<bool, Error>;
}
```

More recently (v0.8.1), Gamma supported iteration with slices:

```rust
pub trait Graph {
    /// Returns true if there are no nodes, or false otherwise.
    fn is_empty(&self) -> bool;

    /// Returns the number of nodes in this graph.
    fn order(&self) -> usize;

    /// Returns the number of edges in this graph.
    fn size(&self) -> usize;

    /// Returns the nodes of this graph.
    fn nodes(&self) -> &[usize];

    /// Iterates the neighbors of the node.
    /// Returns an error if id not found.
    fn neighbors(&self, id: usize) -> Result<&[usize], Error>;
    
    /// Returns true if node is a member, or false otherwise.
    fn has_node(&self, id: usize) -> bool;

    /// Returns the count of neighbors at node. REturns an error if id not
    /// found.
    fn degree(&self, id: usize) -> Result<usize, Error>;

    /// Returns the edges of this graph.
    fn edges(&self) -> &[(usize, usize)];

    /// Returns true if the edge (sid, tid) exists, or false otherwise.
    /// Returns MissingNode if either sid or tid are not members.
    fn has_edge(&self, sid: usize, tid: usize) -> Result<bool, Error>;
}
```

Both versions support the same feature set, making it possible to benchmark them in a realistic setting.

# Cargo Bench

Cargo comes complete with its own benchmarking facility, Bencher. Unfortunately, it currently can only be used on [nightly](https://rust-lang.github.io/rustup/concepts/channels.html). Fortunately, installing nightly is simple, and once that's done Bencher is quite easy to use. Consider this example comparing `Vec` and `HashMap` as backing stores.

```rust
// benches/bench.rs
#![feature(test)]

extern crate test;
use test::Bencher;

#[cfg(test)]
mod vec {
    use super::*;
    #[bench]
    fn test(b: &mut Bencher) {
        b.iter(|| {
            let mut vec = Vec::new();

            for i in 0..1000 {
                vec.push(i as f32 * 3.5)
            }
        })
    }
}

#[cfg(test)]
mod hash_map {
    use std::collections::HashMap;
    use super::*;
    
    #[bench]
    fn test(b: &mut Bencher) {
        b.iter(|| {
            let mut map = HashMap::new();

            for i in 0..1000 {
                map.insert(i, i as f32 * 3.5);
            }
        })
    }
}
```

Assuming that the above code has been saved in a Cargo project at `benches/bench.rs`, the benchmark can be run like so:

```console
$ cargo +nightly bench
   Compiling bench_test v0.1.0 (/Users/rich/src/rust/bench_test)
    Finished bench [optimized] target(s) in 0.86s
     Running target/release/deps/bench_test-e50a864c98302e3c

running 0 tests

test result: ok. 0 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s

     Running target/release/deps/bench-3a4fcd802d8df8d5

running 2 tests
test hash_map::test ... bench:      63,369 ns/iter (+/- 9,784)
test vec::test      ... bench:       3,064 ns/iter (+/- 418)

test result: ok. 0 passed; 0 failed; 0 ignored; 2 measured; 0 filtered out; finished in 8.93s
```

Bencher reports two values for each test: an execution time in nanoseconds, and a range in nanoseconds representing the difference between the maximum and minimum values. In my hands, ranges of 15-40% are seen regularly. For details, see [this StackOverflow thread](https://stackoverflow.com/questions/48323487/how-do-i-interpret-the-output-of-cargo-bench).

# Benchmarks

Gamma is a young library and as such currently supports a small set of graph algorithms. Fortunately, two are available which represent opposite extremes in complexity: depth-first traversal and [maximum matching](https://stackoverflow.com/questions/48323487/how-do-i-interpret-the-output-of-cargo-bench). These two tasks were chosen for some simple benchmarks.

The benchmark project itself is [available on GitHub](https://github.com/rapodaca/gamma_bench_itervslice). A graph composed of three fused cycles, corresponding to the [fluorene molecular skeleton](https://en.wikipedia.org/wiki/Fluorene) was selected for traversal and maximum matching. The benchmark consists of two separate test suites, each performing a depth-first traversal and maximum matching on this graph but using different iteration techniques.

On my system, the results are as follows.

```console
$ cargo +nightly bench
    Finished bench [optimized] target(s) in 0.00s
     Running target/release/deps/bench-4a9b532fcd509670

running 0 tests

test result: ok. 0 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s

     Running target/release/deps/iter-11c609cfc9e969b8

running 2 tests
test iter::dfs      ... bench:       5,399 ns/iter (+/- 766)
test iter::matching ... bench:      54,178 ns/iter (+/- 19,450)

test result: ok. 0 passed; 0 failed; 0 ignored; 2 measured; 0 filtered out; finished in 6.57s

     Running target/release/deps/slice-c34b3389d0e977f6

running 2 tests
test slice::dfs      ... bench:       3,465 ns/iter (+/- 1,398)
test slice::matching ... bench:      46,862 ns/iter (+/- 19,335)

test result: ok. 0 passed; 0 failed; 0 ignored; 2 measured; 0 filtered out; finished in 0.72s
```

Absolute values differ from run to run, but in every case slice-based iteration outperforms boxed iterators. The difference is always most pronounced with depth-first traversal (about 50%), and less see with maximum matching (about 15%), although the latter are typically within the high/low range.

One other difference might be relevant. The boxed iterator used here clones its values, but the slice does not. To test the idea that cloning could play a role, a fork of the boxed iterator version (0.9.0) was created in which iterators return shared references (`Iterator<Item=&usize>`). Benchmarks showed no difference in execution time.

The greater effect for depth-first traversal might be explained by the high relative share of iteration in that algorithm compared to maximum matching. When iteration accounts for a greater proportion of overall CPU activity, it can be expected to make a higher relative contribution to the execution time.

# Conclusion

Exposing iterators from Rust traits presents a set of unique problems. Two viable options are discussed in the context of a `Graph` trait: boxed Iterator trait objects and slice-based iteration. In two benchmarks, slice-based iteration outperformed boxed Iterator traits. However, the difference in execution time was most pronounced with the simpler function (about 50% vs 15%). Given more complex functions of the kind likely to be seen in real-world applications, the runtime performance gap could narrow further.