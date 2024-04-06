---
title: "Cheminformatics in Rust: Implementing a Minimal Molecule API"
summary: "Laying the foundation for a new cheminformatics toolkit."
twitter: true
summary-image: images/posts/20200511/summary.png
published: "2020-05-11T14:00:00Z"
---

A cheminformatics toolkit, like most software, is made of layers. The bottom layer deals with graphs and their manipulation. Above that sits a tightly coupled layer dedicated to the representation of molecular objects. All of a toolkit's strengths and limitations ultimately evolve from these two layers.

Previous articles have described minimal APIs for [Graph](/articles/2020/01/06/a-minimal-graph-api/) and [Molecule](/articles/2020/04/06/a-minimal-molecule-api/). This article moves the discussion one step further &mdash; into the realm of implementation. Tying together [yet another thread](/articles/2020/01/20/cheminformatics-in-rust/), the language I'll be using is Rust.

# The Code

A repository containing the code discussed in this post can be found on [GitHub](https://github.com/rapodaca/molecule.rs). Using it will require a [Rust installation](https://rustup.rs).

Clone the repository and run its test suite with the following commands:

```bash
git clone https://github.com/rapodaca/molecule.rs
cd molecule.rs
cargo test
```

The remainder of this article describes the design and implementation of the molecule.rs repository. 

# Molecule Trait

The focal point of molecule.rs is the `Molecule` trait. This trait extends the `Graph` trait from [Gamma](/articles/2020/02/17/graphs-in-rust-introducting-graphcore/), a Rust graph library. Eight new methods are contained within the `Molecule` trait, and excerpt of which appears below.

```rust
// imports

pub trait Molecule<'a, N: 'a>: Graph<'a, usize> {
    fn element(&self, id: &usize) -> Result<Element, Error>;

    fn isotope(&self, id: &usize) -> Result<Option<u16>, Error>;

    fn electrons(&self, id: &usize) -> Result<u8, Error>;

    fn hydrogens(&self, id: &usize) -> Result<u8, Error>;

    fn charge(&self, id: &usize) -> Result<i8, Error>;

    fn atom_parity(&self, id: &usize) -> Result<Option<Parity>, Error>;

    fn bond_order(&self, sid: &usize, tid: &usize) -> Result<u8, Error>;
    
    fn bond_parity(
        &self, sid: &usize, tid: &usize
    ) -> Result<Option<Parity>, Error>;
}
```

These methods trace their origins to a previously-presented [minimal molecule API](/articles/2020/04/06/a-minimal-molecule-api/). The main idea is that the smaller this API can be made, the simpler it will be to learn, implement, and use. Accordingly, the methods found in `Molecule` represent an irreducible core for a cheminformatics toolkit. All of them expose metadata associated with either the nodes or edges of an underlying graph.

Having already addressed the most difficult questions about design, implementation becomes a matter of satisfying unit tests and the Rust compiler.

# The Invisible Atom Pattern

There will be many ways to implement the `Molecule` trait. The approach used in `molecule.rs` is something I call *the invisible atom pattern*.

The invisible atom pattern relies on objects of type `Atom` to perform most of the heavy lifting behind the `Molecule` trait. For example, `Atom` has a method called `#electrons` that returns a valence electron count. A `Molecule` implementation delegates method calls to `Atom#electrons`. The remaining methods in the `Molecule` interface are implemented similarly.

```rust
// imports

pub struct Atom {
    element: Element,
    nonbonding_electrons: u8,
    bonding_electrons: u8,
    hydrogens: u8,
    isotope: Option<u16>,
    parity: Option<Parity>,
    bonds: Vec<Bond>,
    neighbors: Vec<usize>
}

impl<'a> Atom {
    pub fn build(spec: spec::Atom) -> Result<Self, Error> {
      // Use the specification object spec to construct the initial internal
      // state of the Atom
    }

    pub fn element(&self) -> Element {
        self.element
    }

    // other instance methods providing Graph and Molecule services
}
```

`Atom` is invisible in the sense that it lives in a private package invisible to the outside world. Why this approach? The main reason is that `Atom` is an implementation detail. Recall that the `Molecule` API requires no handles to an atom-like object, nor does it expose any. Instead, atomic attributes and behaviors are accessed through opaque numerical indexes (type `usize`). This approach happens to work well given Rust's [ownership model](/articles/2020/01/27/rust-ownership-by-example/). It also translates to other languages.

The `build` function associated with `Atom` uses a parameter called `spec`. I'll have more to say about this technique later.

# Molecule Implementation

The `Molecule` trait is implemented by `DefaultMolecule` (found in `default_molecule.rs`). Only three pieces of data are needed: an array of atoms; an array of atom indexes; and an array of edges. From these data structures, all of the methods of both `Graph` and `Molecule` are implemented.

```rust
// imports

pub struct DefaultMolecule {
    atoms: Vec<Atom>,
    indices: Vec<usize>,
    edges: Vec<(usize, usize)>
}

impl DefaultMolecule {
    pub fn build(spec: spec::Molecule) -> Result<Self, Error> {
      // Use the specification object spec to initialize the internal state
      // of a DefaultMolecule
    }
}

// ...

impl<'a> Graph<'a, usize> for DefaultMolecule {
    // ... required iterator definitions
    // implement Graph methods in terms of the DefaultMolecule struct
    fn is_empty(&self) -> bool {
        self.atoms.is_empty()
    }

    // remaining Graph methods
}

impl<'a> Molecule<'a, usize> for DefaultMolecule {
  // implement Molecule methods in terms of the DefaultMolecule struct
    fn element(&self, id: &usize) -> Result<Element, GraphError> {
        match self.atoms.get(*id) {
            Some(node) => Ok(node.element()),
            None => Err(GraphError::UnknownNode)
        }
    }

    // remaining Molecule methods
}
```

Like the `Graph` trait, the `Molecule` trait has no mutator methods. This fits well with Rust, where mutators can quickly lead to unwanted complications.

Given there are no mutators, how does a `Molecule` ever get built? The answer lies with the `build` function associated with `DefaultMolecule`. It accepts a specification object (`spec`) as an argument, using its attributes to build an internal `Molecule` state. `build` returns an error value when inconsistent state is detected.

# Specification Objects

`Atom` and `DefaultMolecule` are constructed with the help of *specification objects*. A specification object is a dumb data structure encoding the state of some object to be constructed. By "dumb" I mean that no methods are defined - just attributes. As such, specification objects are lightweight precursors to more complex object. They can be created, copied, stored, and passed efficiently. Think of a specification object as something that can be directly translated to JSON.

Specification objects are versatile and inexpensive. Using them helps keep method signatures small. Coupled with Rust's static typing system, specification objects make the construction of new `Molecule` objects reliable and unsurprising.

# Rust Iterators are Tricky

The most difficult part of implementing `Molecule` was getting its `Iterator`s to work correctly. Because `Molecule` implements the `Graph` trait, `DefaultMolecule` must define three `Iterator` types: one over all nodes; another for a node's neighbors; and a third for all edges. Rust's famously strict type system and ownership model joined forces here to make what should have been straightforward job difficult.

My original plan for `DefaultMolecule#nodes` was to return an `Iterator` over the indices of the underlying `Vec` of atoms. Surprisingly, however, this does not seem to be possible. To solve this problem, a separate array, `indices` is maintained. `DefaultMolecule#nodes` returns an iterator over this vector's elements.

`DefaultMolecule#neighbors` followed a similar pattern. The method returns an `Iterator` over the indexes of an atom's neighbors. As with other atom-specific tasks, this one is delegated to `Atom`. `Atom#neighbors` in turn returns an `Iterator` over the elements of its `neighbors` vector. An alternative approach in which neighbor indices were dynamically iterated via a call to `map` hit a [problem](https://stackoverflow.com/a/27648199/54426) that apparently has no solution.

In contrast, `DefaultMolecule#edges` uses a custom iterator (`EdgeIterator`) to iterate edges. On the surface, it appeared as if returning an iterator over the `edges` vector should have sufficed. However, this iterator generates tuples of indices, not tuples of index references. `EdgeIterator` provides the necessary translation.


```rust
pub struct EdgeIterator<'a> {
    cursor: usize,
    edges: &'a Vec<(usize, usize)>
}

impl<'a> EdgeIterator<'a> {
    pub fn new(edges: &'a Vec<(usize, usize)>) -> Self {
        EdgeIterator { cursor: 0, edges }
    }
}

impl<'a> Iterator for EdgeIterator<'a> {
    type Item = (&'a usize, &'a usize);

    fn next(&mut self) -> Option<(&'a usize, &'a usize)> {
        if let Some((sid, tid)) = self.edges.get(self.cursor) {
            self.cursor += 1;

            Some((&sid, &tid))
        } else {
            None
        }
    }
}
```

Attempts to replace `DefaultMolecule`'s `edges` vector with one using the correct form failed. This failure resulted from the return of borrowed references to data (indices) owned by the `build` function. I suspect that a simpler approach eliminating the need for `EdgeIterator` is possible.

# What Next?

`DefaultMolecule` implements all services defined by the minimum molecule API. As such, it should be feasible to build a cheminformatics toolkit of arbitrary complexity based on `DefaultMolecule`.

A useful first step on that path would be to implement a SMILES reader and writer. The use of specification objects is simple but verbose. A function that could return `Molecule` implementations given valid SMILES strings would be a big step forward, as would a function that could write SMILES given a `Molecule`.

# Conclusion

Previous posts introduced the concept of the minimum Molecule API. This post presents an implementation in Rust. No insurmountable restrictions were found, although Rust's ownership model did present some challenges not likely to found in other languages. A repository with all source and a complete suite of unit tests is available from GitHub.
