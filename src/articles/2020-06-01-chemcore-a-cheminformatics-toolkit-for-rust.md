---
title: "ChemCore: A Cheminformatics Toolkit for Rust"
summary: "Design, implementation, and future prospects."
twitter: true
summary-image: images/posts/20200601/summary.png
published: "2020-06-01T16:00:00Z"
---

Chemistry imposes formidable requirements on application developers. One of the toughest is the manipulation of chemical structures as first-class data structures. General purpose programming language don't fulfil this requirement, so the responsibility falls to a peculiar layer of software. That layer goes by various names, but is usually called a "cheminformatics toolkit." This article introduces ChemCore, a new cheminformatics toolkit written in Rust.

# The Code

The ChemCore repository is hosted on [GitHub](https://github.com/rapodaca/chemcore). Using it will require a [Rust installation](https://rustup.rs).

Clone the repository and run its test suite with the following commands:

```console
git clone https://github.com/rapodaca/chemcore
cd chemcore
cargo test
```

Use ChemCore as a dependency in your project by adding this to your `Cargo.toml`:

```toml
[dependencies]
chemcore = "0.1"
```

# Examples

ChemCore should be considered a proof-of-concept at this point. The following examples illustrate the scope of the current capabilities.

```rust
use gamma::graph::Graph;
use chemcore::molecule::DefaultMolecule;

// build a Molecule using a specification object
fn main() {
    let ethanol = DefaultMolecule::build(spec::Molecule {
        atoms: vec![
            spec::Atom {
                element: Element::O, hydrogens: 1, ..Default::default()
            },
            spec::Atom {
                element: Element::C, hydrogens: 2, ..Default::default()
            },
            spec::Atom {
                element: Element::C, hydrogens: 3, ..Default::default()
            }
        ],
        bonds: vec![
            spec::Bond { sid: 0, tid: 1, ..Default::default() },
            spec::Bond { sid: 1, tid: 2, ..Default::default() }
        ]
    }).unwrap();

    assert_eq!(ethane.element(&0), Element::O);
    assert_eq!(ethane.degree(&1), Ok(2));
}
```

The above example builds a molecule using the ChemCore native method `DefaultMolecule::build`. The result inherits the traits `Graph` (from [Gamma]()) and `Molecule` (from ChemCore).

```rust
use gamma::graph::Graph;
use chemcore::daylight::Molecule;

fn main() {
    // build a molecule from SMILES
    let ethanol = Molecule::build(&"OCC").unwrap();

    assert_eq!(ethane.element(&0), Element::O);
    assert_eq!(ethane.degree(&1), Ok(2));
}
```

ChemCore supports reading SMILES through the `build` method of `daylight::Molecule`. The result is a ChemCore `Molecule` and so can be treated identically to a `Molecule` built natively (listing above).

```rust
use chemcore::daylight::Molecule;
use gamma::traversal::depth_first;

fn main() {
    // build a molecule from SMILES and traverse it in depth-first order
    let molecule = daylight::Molecule::build(&"C1CC1").unwrap();
    let traversal = depth_first(&molecule, &0).unwrap();
    
    assert_eq!(traversal.collect::<Vec<_>>(), vec![
        (&0, &2, false),
        (&2, &1, false),
        (&1, &0, true)
    ]);
}
```

Because the `Molecule` trait extends the `Graph` trait, all Gamma traversals are available to `Molecules` as well. In the listing above, cyclopropane is traversed in depth-first order.

```rust
use chemcore::daylight::Molecule;
use gamma::traversal::breadth_first;

fn main() {
    // build a molecule from SMILES and traverse it in breadth-first order
    let molecule = Molecule::build(&"C1CC1").unwrap();
    let traversal = breadth_first(&molecule, &0).unwrap();
    
    assert_eq!(traversal.collect::<Vec<_>>(), vec![
        (&0, &2, false),
        (&0, &1, false),
        (&2, &1, true)
    ]);
}
```

Breadth-first traversal is also supported (listing above). `Molecule` will work out of the box with all current and future functions taking a `Graph`.

# Yet Another Toolkit?

Before getting into details, it's reasonable to ask why and whether the world needs another cheminformatics toolkit. After all, Wikipedia lists [two dozen of them](https://en.wikipedia.org/wiki/Cheminformatics_toolkits). Given this abundance, why not just use something that already exists?

Many of the existing toolkits work well for the problems they were designed to solve. However, each has been designed to address a specific set of needs for a particular audience. As a result, every toolkit has committed itself to certain decisions that may not suit every project.

The most important of these decisions is language. An obvious constraint that follows is deployment platform. A toolkit written in Java would be a suboptimal choice for applications targeting iOS or the Web browser. Likewise, a toolkit written in C or C++ would be a suboptimal choice for applications targeting a Web server. It's not that such things can't be made to happen so much as the difficulties programmers will endure along the way.

The consequences of language choice extend beyond syntax and deployment. A programming language occupies the center of its own universe of tooling in the form of: package managers; debugging; concurrency; compilers; IDE support; build systems; and runtime environment. Moreover, the community around a language plays a pivotal role in supporting development efforts.

Performance also follows from language choice. Both speed and memory usage are important axes here. Sometimes, all that's needed to turn a slow language into a fast one is time (e.g., Java and JavaScript). Some languages such as Python make up for poor runtime performance through native extensions. Python has become such a popular language in cheminformatics that a toolkit written in any other language should have a clear path to Python support.

Most of the currently-available cheminformatics toolkits are written in one of three languages: C; C++; or Java. The newest of these, Java, was first released almost 25 years ago. A lot has been learned about programming languages in the intervening time, so it makes sense to explore what newer languages bring to the table.

Beyond language, the most important decision a toolkit commits to is the Molecule layer. Ultimately, all of a toolkit's functionality and ergonomics flow from this source. The more expressive the Molecule layer, the wider the scope of known chemistry that will become accessible to application developers. The simpler this layer, the easier it will be to learn and extend.

Recent posts on this blog have covered the topic of `Molecule` API at length. Available toolkits tend to favor wide APIs with lots of methods. I have come to the opposite conclusion: [the Molecule API should be narrow](/articles/2020/04/06/a-minimal-molecule-api/). The API should in particular not hinder extension to [multi-atom bonding](/articles/2020/04/27/multi-atom-bonding-in-cheminformatics/) or multiple implementation. Moreover, the Molecule API should be based on an [equally minimal Graph API](/articles/2020/01/06/a-minimal-graph-api/). A toolkit embracing this approach would offer developers a powerful set of options that don't currently exist.

In addition to APIs, each cheminformatics toolkit brings a design aesthetic. One of the most basic decisions is what to include and what to leave out. Many of the twenty-odd existing cheminformatics toolkits have adopted a "big tent" approach that includes functionality well beyond the creation and low-level manipulation of molecular graphs. An alternative approach would be to restrict the toolkit to the creation and manipulation of molecular graphs only. Higher-level functionality could then be added through semi-independent modules. There are no right or wrong approaches here &mdash; merely choices and tradeoffs.

Beyond technology lies the sometimes heated topic of licensing. Fortunately, many of the cheminformatics toolkits Wikipedia lists are distributed under Open Source license. But these license vary greatly in what users can do with their own modifications and other works using the toolkits. More permissive open source licensing is a clear trend here that should be supported whenever possible.

# Rust as a Language for Cheminformatics

ChemCore is implemented in Rust. An earlier article on this blog explored the idea of using [Rust as a language for cheminformatics](/articles/2020/01/20/cheminformatics-in-rust/). To recap, Rust offers a number of attractive features, a small selection of which includes:

- *Speed.* Benchmarks [usually](https://benchmarksgame-team.pages.debian.net/benchmarksgame/fastest/rust.html) put the performance of idiomatic Rust very close to, or better than the performance of idiomatic C or C++. The usual caveats apply.
- *Minimal runtime and no garbage collector.* Rust uses compile time memory management, a powerful feature unique to this language.
- *Type safety.* Unless specifically opted out of, the Rust compiler prevents the compilation of any program with undefined behavior.
- *Thread safety.* Takes advantage of the same features that allow type safety.
- *Functional and Object Paradigms.* Unlike other languages, Rust does not conflate type with class.
- *Type Inference.* Types can often be elided, giving Rust a distinctly high-level feel.
- *Package Management and Build System.* [Cargo](https://doc.rust-lang.org/cargo/) performs both tasks.

# Python

A few projects focus on enabling tight integration between Rust code and a Python interpreter. A popular choice is [pyo3](https://github.com/PyO3/pyo3). [Python bindings](https://github.com/thesketh/oxmol) for ChemCore's precursor, [Molecule.rs](https://github.com/rapodaca/molecule.rs) have been released. The success of this project suggests a clear path to adding similar Python bindings to ChemCore.

# WebAssembly

WebAssembly's 1.0 proof-of-concept gives the Web browser its first new first-class language since the 1990s. It's very likely that 1.0 will be followed by a series of releases integrating WebAssembly ever more tightly into the browser. At the same time, the [WebAssembly System Interface (WASI)](https://wasi.dev) can offer a safe execution environment outside the browser. Several posts on this blog have highlighted the use of WebAssembly for cheminformatics ([example](/articles/2020/03/02/compiling-inchi-to-webassembly-part-2-from-molfile-to-inchi/)).

[wasm-bindgen](https://github.com/rustwasm/wasm-bindgen) gives Rust a powerful suite of tools for compilation to WebAssembly. Auto-generated two-way bindings of both objects and functions are available.

# Minimal Molecule API

ChemCore's `Molecule` trait is based on a [minimal Molecule API](/articles/2020/04/06/a-minimal-molecule-api/), which itself is based on a [minimal Graph API](/articles/2020/01/06/a-minimal-graph-api/). The main takeaway is that a fully functional `Molecule` can be implemented with just 19 simple methods. ChemCore includes two `Molecule` implementations, one in the `molecule` package and the other in the `daylight` package. Although restricted to two-atom bonding at this stage, the minimal Molecule API was designed to be compatible with [multi-atom bonding](/articles/2020/04/27/multi-atom-bonding-in-cheminformatics/) extensions.

# Hydrogen Suppression

[Hydrogen suppression](/articles/2020/05/18/hydrogen-suppression-in-cheminformatics/) is a surprisingly complex topic that leads to enormous confusion. Most of it results form the conflation of two related but distinct forms of hydrogen suppression: implicit hydrogen and [virtual hydrogen](/articles/2019/11/06/virtual-hydrogens/). ChemCore simplifies the situation by using virtual hydrogen exclusively. This approach allows interchange formats used by ChemCore to support readers and writers that operate with 100% fidelity.

# SMILES

ChemCore's `Molecule` should be compatible with both SMILES and Molfile. Currently, ChemCore only supports SMILES input through the `daylight::Molecule.build` method. [Kekulization](/articles/2020/02/10/a-comprehensive-treatment-of-aromaticity-in-the-smiles-language/) is not yet supported, so SMILES encoding aromaticity features result in panic. Given [maximum Graph matching](/articles/2019/04/02/the-maximum-matching-problem/) support, it should be straightforward to add kekulization to the SMILES reader.

# Modules, Not Monoliths

ChemCore has adopted a core module approach, meaning that it will focus on an essential set of cheminformatics functionality related to creating `Molecule` objects and manipulating them as graphs. Rust's package manager, Cargo, will enable ChemCore to both depend on low-level functionality and become a dependency for higher-level crates. For examples of the former kind of composition, see the [Gamma](https://crates.io/crates/gamma) and [Purr](https://crates.io/crates/purr) crates. Gamma is a graph library that defines a `Graph` trait and functions operating over it. Purr is a SMILES/SMARTS library focused on low-level i/o and supporting data structures. For an example of what a crate using ChemCore as a dependency might look like, see [oxmol](https://github.com/thesketh/oxmol), Python bindings for ChemCore's precursor.

# Roadmap

Even at this proof-of-concept stage, ChemCore offers the outlines of a unique cheminformatics platform. The next several releases will focus on putting in place robust support for cheminformatics' two standard input/output formats SMILES and Molfile. After that, ChemCore will begin to offer capabilities to support application-level features including 2D substructure search; coordinate generation; fingerprints; and molecular descriptors.

Along the way, it's very likely that APIs will break and things could get chaotic for a time. If that kind of thing isn't a problem and you'd like to try using ChemCore to build a pet project, I'd be happy to help get you up to speed.

# Conclusion

ChemCore is a new cheminformatics toolkit for Rust. The software was created to fill a need for a compact, fast, easy-to-build, easy-to-deploy, permissively-licensed toolkit that works well in many application scenarios. Integrating several new ideas about molecule and graph APIs, ChemCore's focus is forward-looking. ChemCore can currently read SMILES without aromatic features, and will support input/output with both SMILES and Molfile. Further releases will focus on supporting higher-level cheminformatics functionality with an eye toward advanced desktop and Web applications.