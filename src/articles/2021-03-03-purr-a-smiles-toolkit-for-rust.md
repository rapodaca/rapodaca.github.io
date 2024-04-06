---
title: "Purr: A SMILES Toolkit for Rust"
summary: "Pulling back the covers on a new way to work with SMILES."
twitter: true
summary-image: images/posts/20210303/summary.png
published: "2021-03-03T17:00:00Z"
---

Simplified Molecular Input Line Entry System (SMILES) is the de facto standard for compact molecular representation in cheminformatics. Due to this role, users have come to expect SMILES support in the software packages they use. Developers have responded to the demand with a wide range of products capable of reading and writing SMILES. These products form a broad network of tools that can in principle work together through a common language.

Last year, [I speculated](/articles/2020/01/20/cheminformatics-in-rust/) that Rust could play an important role in the future of cheminformatics. SMILES support is an important part of that vision, especially in the short term. Users needing functionality not present in a new platform can get it from older platforms, with SMILES serving as a serialization format.

Lack of functionality is both the biggest weakness and greatest strength of a new platform. There may be few features, but there is also no legacy code to maintain. Users of a new platform tend to be more tolerant of breaking changes, making iterations less disruptive. To the extent that SMILES still has something new to uncover, it's likely to emerge from new cheminformatics platforms.

With these ideas in mind, this article introduces Purr, a suite of tools for reading, writing, and manipulating SMILES in Rust.

# Quickstart

After [installed the Rust toolchain](https://www.rust-lang.org/tools/install), create a new project.

```bash
cargo new hello_purr && cd hello_purr
```

Next, edit `Cargo.toml` to look like this:

```toml
[package]
name = "hello_purr"
version = "0.1.0"
authors = ["me <me@example.com>"]
edition = "2018"

[dependencies]
purr = "0.9.0"
```

The template project contains the file `src/main.rs`. All of the examples in this article should be written into it.

Let's start with an example of parsing methanol (`CO`).

```rust
//src/main.rs
use purr::graph::{ Builder, Atom, Bond };
use purr::feature::{ AtomKind, BondKind, Aliphatic };
use purr::read::{ read, Error };

fn main() -> Result<(), Error> {
    let mut builder = Builder::new();

    read("CO", &mut builder, None)?;

    assert_eq!(builder.build(), Ok(vec![
        Atom {
            kind: AtomKind::Aliphatic(Aliphatic::C),
            bonds: vec![
                Bond::new(BondKind::Elided, 1)
            ]
        },
        Atom {
            kind: AtomKind::Aliphatic(Aliphatic::O),
            bonds: vec![
                Bond::new(BondKind::Elided, 0)
            ]
        }
    ]));

    Ok(())
}
```

Run the program with `cargo run`.

```console
$ cargo run
   Compiling purr v0.9.0
   Compiling hello_purr v0.1.0 (/Users/rich/tmp/hello_purr)
    Finished dev [unoptimized + debuginfo] target(s) in 2.88s
     Running `target/debug/hello_purr`
```

The `read` function transforms a SMILES string into instructions for a `Builder` argument. `Builder` transforms the method calls it receives into a representation that can be obtained through its `build` method. There will be more to say about the methods `Builder` implements later. For now, the important idea is that `read` can generate many different output types. The decision of which one will be produced occurs at runtime.

`Builder` returns a vector of atoms (`Vec<Atom>`) from its `build` method. As we'll see later, `Atom` supports data access and methods useful for assigning chemical meaning to the SMILES that was parsed.

To allow errors to be intercepted, `read` and the `build` method of `Builder` return `Result` types. `read` also supports an optional parameter that can be used to relate molecular features to cursors within the original SMILES string.

# Overview

Like all SMILES implementations, Purr speaks a dialect of SMILES. Purr's dialect is based on the one presented in the [OpenSMILES](http://opensmiles.org/opensmiles.html) specification. Although OpenSMILES is the most detailed SMILES specification to date, it has limitations. In cases of contradictory or incomplete OpenSMILES guidance, Purr draws from other sources in roughly this order: Daylight's online documentation; peer-reviewed publications; books; blog posts; mailing list discussions; and personal communications. In rare cases, Purr has introduced some new rules.

By default and by design, Purr enforces only syntax when reading or writing SMILES. The syntax of strings is checked by a hand-crafted [recursive descent parser](/articles/2019/01/22/scanner-driven-parser-development/). The parser is itself based on a [formal grammar](/articles/2020/12/21/smiles-formal-grammar-revisited/) that has undergone several revisions over the years. But sematic errors such as [negative implied valence electron count](/articles/2020/03/16/formal-charge-and-bond-order-are-side-effects/), negative implied neutron count, and mismatched or unbalanced ring closure bonds are not checked by default. Purr does offer the tools needed to perform such checks if desired.

This pay-as-you-go approach is seen throughout Purr. If you don't need a service, you shouldn't have to pay for it &mdash; either with performance or complexity.

The cornerstone of Purr's design is the `Follower` trait. `Follower` defines four methods relating SMILES features to actions: `root`; `extend`; `join`; and `pop`.

```rust
use crate::feature::{ AtomKind, BondKind, Rnum };

/// The actions possible during a depth-first traversal of a SMILES
/// representation.
pub trait Follower {
    /// A root atom has been found. This occurs at the first atom of every
    /// connected component. As such, every use of `Follower` must
    /// begin with at least one call to `root`. But `root` can also be called
    /// after the first atom has been found, as in methane hydrate (`C.O`).
    fn root(&mut self, root: AtomKind);

    /// A bond between the current head atom and the next head atom has
    /// been found. Using this method implies the existence of a head atom,
    /// as in methanol (`C-O` or `CO`).
    /// 
    /// # Panics
    /// 
    /// Panics if headless.
    fn extend(&mut self, bond_kind: BondKind, atom_kind: AtomKind);

    /// A bond between the current head atom and a ring closure digit has
    /// been found. Using this method implies the existence of a head atom,
    /// as in cyclopropane (`C1CC1`).
    /// 
    /// # Panics
    /// 
    /// Panics if headless.
    fn join(&mut self, bond_kind: BondKind, rnum: Rnum);

    /// Pop the stack by the indicated depth. As roots and extensions are
    /// encountered, `Follower` builds a working path. Branching removes
    /// one or more atoms from the head of this path, exposing a new head.
    /// The newly-exposed head will have previously been a head.
    /// 
    /// # Panics
    /// 
    /// Panics given depth exceeds the length of the current path.
    fn pop(&mut self, depth: usize);
}
```

Think of `Follower` as a companion that tags along during the depth-first traversal of a SMILES representation. For example, we can simulate a traversal that would represent acetamide (`CC(=O)N`):

```rust
use purr::walk::Follower;
use purr::feature::{ AtomKind, BondKind, Aliphatic };

// CC(=O)N
fn acetamide<F: Follower>(follower: &mut F) {
    follower.root(AtomKind::Aliphatic(Aliphatic::C));
    follower.extend(BondKind::Elided, AtomKind::Aliphatic(Aliphatic::C));
    follower.extend(BondKind::Double, AtomKind::Aliphatic(Aliphatic::O));
    follower.pop(1);
    follower.extend(BondKind::Elided, AtomKind::Aliphatic(Aliphatic::N));
}
```

`Follower` decouples the traversal of a SMILES representation from the use of the features that are discovered along the way. This means that the same traversal function can yield a variety of different products, and these products can be chosen at runtime. This is how Purr makes good on its pay-as-you-go promise. An example of the flexibility of this approach can be seen when reading SMILES strings.

# Reading SMILES

The `read` function accepts a SMILES string representation and a value of type `Follower`. After the function returns, the product built by the `Follower` can be used. For example, we can count the number of atomic nodes (explicit atoms) in a SMILES string as like so.

```rust
// src/main.rs
use purr::walk::Follower;
use purr::feature::{ AtomKind, BondKind, Rnum };
use purr::read::{ read, Error };

struct Counter {
    count: usize
}

impl Follower for Counter {
    fn root(&mut self, _: AtomKind) {
      self.count += 1
    }

    fn extend(&mut self, _: BondKind, _: AtomKind) {
        self.count += 1
    }

    fn join(&mut self, _: BondKind, _: Rnum) {
        // no-op
    }

    fn pop(&mut self, _: usize) {
        // no-op
    }
}

fn main() -> Result<(), Error> {
    let mut counter = Counter { count: 0 };

    read("c1cc([O-]ccc1", &mut counter, None)?;

    assert_eq!(counter.count, 7);

    Ok(())
}
```

Notice that not all `Follower` methods need to be implemented, nor do they need to be implemented in any particular way. This makes it possible to create highly efficient SMILES analyses targeted to specific applications.

Purr provides two important `Follower` implementations out of the box:

- `Writer`. Yields a string representation.
- `Builder`. Yields an adjacency list implementation.

Because both `Writer` and `Builder` implement `Follower`, they can be used interchangeably in any situation calling for a `Follower`. For example, a SMILES string can be "round tripped" by combining `read` with `Writer`.

```rust
// src/main.rs
use purr::read::{ read, Error };
use purr::write::Writer;

fn main() -> Result<(), Error> {
    let mut writer = Writer::new();

    read("[C@H](F)(Cl)Br", &mut writer, None)?;

    assert_eq!(writer.write(), "[C@H](F)(Cl)Br");

    Ok(())
}
```

Likewise, combining `read` with `Builder` yields an adjacency list representation.

```rust
// src/main.rs
use purr::feature::{
    AtomKind, BondKind, Element, VirtualHydrogen, Configuration,
    Aliphatic, BracketSymbol
};
use purr::read::{ read, Error };
use purr::graph::{ Builder, Atom, Bond };

fn main() -> Result<(), Error> {
    let mut builder = Builder::new();

    read("[C@H](F)(Cl)Br", &mut builder, None)?;

    assert_eq!(builder.build(), Ok(vec![
        Atom {
            kind: AtomKind::Bracket {
                isotope: None,
                symbol: BracketSymbol::Element(Element::C),
                configuration: Some(Configuration::TH1),
                hcount: Some(VirtualHydrogen::H1),
                charge: None,
                map: None
            },
            bonds: vec![
                Bond::new(BondKind::Elided, 1),
                Bond::new(BondKind::Elided, 2),
                Bond::new(BondKind::Elided, 3)
            ]
        },
        Atom {
          kind: AtomKind::Aliphatic(Aliphatic::F),
          bonds: vec![
              Bond::new(BondKind::Elided, 0)
          ]
        },
        Atom {
            kind: AtomKind::Aliphatic(Aliphatic::Cl),
            bonds: vec![
                Bond::new(BondKind::Elided, 0)
            ]
        },
        Atom {
            kind: AtomKind::Aliphatic(Aliphatic::Br),
            bonds: vec![
                Bond::new(BondKind::Elided, 0)
            ]
        }
    ]));

    Ok(())
}
```

Syntax errors detected by `read` come in one of two variants: `read::Error::Character` and `read::Error::EndOfLine`. The former is parameterized with a cursor position (as type `usize`), allowing the precise location of errors to be flagged for users.

```rust
// src/main.rs
use purr::graph::Builder;
use purr::read::{ read, Error };

fn main() {
    let mut builder1 = Builder::new();
    let mut builder2 = Builder::new();

    assert_eq!(read("CC?C", &mut builder1, None), Err(Error::Character(2)));
    assert_eq!(read("CCC[CH2", &mut builder2, None), Err(Error::EndOfLine))
}
```

`read` also supports fine-grained semantic error reporting and feature linking with an optional `Trace` argument. The purpose of `Trace` is to associate SMILES features with cursor positions in the original string. Because it's optional, clients that don't need the functionality of `Trace` also don't need to pay for it.

```rust
// src/main.rs
use purr::read::{ read, Error, Trace };
use purr::graph::Builder;

fn main() -> Result<(), Error> {
    let mut builder = Builder::new();
    let mut trace = Trace::new();
    //    012345678901234567890123 4
    read("C[NH-]c1ccccc1C/C=C(/C)\\C", &mut builder, Some(&mut trace))?;

    assert_eq!(trace.atom(1), Some(1..6));  // [NH-]
    assert_eq!(trace.bond(0, 1), Some(1));  // elided bond between C and [HN-]
    assert_eq!(trace.bond(8, 9), Some(15)); // first up (/) bond

    Ok(())
}
```

# Writing SMILES

Adjacency representations can be obtained in one of three ways:

1. from a `Builder` using `read`, as shown in the previous section;
2. from a `Builder` using ad hoc method calls; and
3. by assembling `Atom`s and `Bond`s manually.

It's often useful to write an adjacency representation as a SMILES string. To do so, combine `Writer` with the `walk` function.

```rust
// src/main.rs
use purr::graph::Builder;
use purr::walk::{ walk, Follower, Error };
use purr::feature::AtomKind;
use purr::write::Writer;

fn main() -> Result<(), Error> {
    let mut builder = Builder::new();

    builder.root(AtomKind::Star);
    builder.root(AtomKind::Star);

    let adjacency = builder.build().expect("adjacency");
    let mut writer = Writer::new();

    walk(adjacency, &mut writer)?;

    assert_eq!(writer.write(), "*.*");

    Ok(())
}
```

Both `read` and `walk` accept a parameter of type `Follower`. This blurs the distinction between reading and writing a SMILES representation. Both processes are just transformations. For example, the `Counter` type from the previous section can be combined with `walk`. When `read` and `walk` are paired with the same `Follower`, string and adjacency SMILES representations become functionally equivalent.

# Using SMILES

It's often important to do more than just read and write SMILES representations. Purr supports sophisticated analyses through the `Atom` and `Bond` types.

`Atom` provides methods to query valence and bonding relationships. For example, [suppressed hydrogen count](/articles/2021/02/10/fast-hydrogen-counting-hydrogens-in-smiles/) can be computed as follows.

```rust
// src/main.rs
use purr::feature::{ AtomKind, BondKind, Aliphatic };
use purr::graph::{ Atom, Bond };

fn main() {
    let atom = Atom {
        kind: AtomKind::Aliphatic(Aliphatic::C),
        bonds: vec![
            Bond::new(BondKind::Elided, 1),
            Bond::new(BondKind::Double, 2)
        ]
    };

    assert_eq!(atom.suppressed_hydrogens(), 1)
}
```

The `subvalence` method of `Atom` makes it possible to prune a π-subgraph, a prerequisite for [kekulization](/articles/2020/02/10/a-comprehensive-treatment-of-aromaticity-in-the-smiles-language/).

```rust
// src/main.rs
use purr::feature::{ AtomKind, BondKind, Aromatic };
use purr::graph::{ Atom, Bond };

fn main() {
    let oxygen = Atom {
        kind: AtomKind::Aromatic(Aromatic::O),
        bonds: vec![
            Bond::new(BondKind::Elided, 1),
            Bond::new(BondKind::Elided, 2)
        ]
    };
    let carbon = Atom {
        kind: AtomKind::Aromatic(Aromatic::C),
        bonds: vec![
            Bond::new(BondKind::Elided, 1),
            Bond::new(BondKind::Elided, 2),
            Bond::new(BondKind::Elided, 3)
        ]
    };

    assert_eq!(oxygen.subvalence(), 0); // prune from π-subgraph
    assert_eq!(carbon.subvalence(), 1)  // don't prune
}
```

`Bond` supports three convenience methods for querying a bond.

```rust
// src/main.rs
use purr::feature::BondKind;
use purr::graph::Bond;

fn main() {
    let bond = Bond::new(BondKind::Double, 0);

    assert_eq!(bond.order(), 2);
    assert_eq!(bond.is_aromatic(), false);
    assert_eq!(bond.is_directional(), false)
}
```

# Other Work

Two other Rust crates support working with SMILES to varying degrees:

- [smiles-parser](https://github.com/hobofan/smiles-parser). Based on the [nom](https://github.com/Geal/nom) parser combinator.
- [acetylene-parser](https://gitlab.com/acetylene/acetylene-parser). Appears to be inactive.

According to the available documentation, neither project is currently as full-featured as Purr.

In addition to these projects, three other dedicated SMILES libraries have been developed over the years.

- [Smiley](https://github.com/timvdm/Smiley). A SMILES/SMARTS parser written in C++. Smiley has been [integrated](https://open-babel.readthedocs.io/en/latest/FileFormats/SMILES_format_using_Smiley_parser.html) into Open Babel.
- [Beam](https://github.com/johnmay/beam). A Java library "dedicated to parsing and generating" SMILES. Beam has been integrated into the [Chemistry Development Kit](https://cdk.github.io).
- [Frowns](http://frowns.sourceforge.net). A Python library written in Python. Frowns has not been active for some time.

# Is This Necessary?

It may seem like overkill for a library to focus just on reading, writing, and manipulating SMILES. After all, SMILES is a simple language and most toolkits offer the ability to work with SMILES anyway.

Not so fast. First, as several articles here and elsewhere have demonstrated, SMILES *syntax* may be simple, but its *semantics* are both extremely complex and incompletely documented. Projects like Smiley, Beam, and Purr that deal exclusively with SMILES shine a spotlight on the numerous subtleties present in the language.

Second, Rust's package manager Cargo makes it trivial to assemble software components like Purr into a cohesive whole. Although most modern languages have package managers, the problem is that there are too many of them (Python, I'm looking at you). Rust is different. Cargo is both ubiquitous and unique. There is no competition in the Rust package manager space. This feature has already been used to integrate Purr with [ChemCore](/articles/2020/06/01/chemcore-a-cheminformatics-toolkit-for-rust/), a cheminformatics toolkit for Rust.

Third, as I'll highlight on this blog from time to time, you can do a lot in cheminformatics without a toolkit. Purr in particular offers enough functionality that it can be used on its own to solve some problems. It's not inconceivable that a set of crates linking directly to Purr (and bypassing ChemCore) might eventually become available. Purr's avoidance of build dependencies makes it a good candidate for projects trying to avoid bloat.

# Conclusion

Purr is a new Rust toolkit that supports reading, writing, and manipulating SMILES. All OpenSMILES language features are supported. Although the most likely path is for Purr to be integrated into a cheminformatics toolkit, it can also be used by itself as a zero-dependency dependency. As such, the design and implementation of Purr may offer useful pointers to what a new cheminformatics platform built on Rust might look like.
