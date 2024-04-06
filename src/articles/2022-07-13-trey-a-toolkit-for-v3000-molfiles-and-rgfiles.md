---
title: "Trey: A Toolkit for V3000 Molfiles and RGfiles"
summary: "Building a suite of power tools for CTfile manipulation."
twitter: true
summary-image: images/posts/20220713/summary.png
published: "2022-07-13T21:40:00Z"
---

The CTfile (aka "molfile") format can be found throughout cheminformatics and computational chemistry. Two versions are available: V2000 and V3000 (aka "V2K" and "V3K," respectively). The former is widely supported but lacks features that can make it difficult to use in modern settings. The latter supports these features but lacks widespread, robust tooling due in part to more complex semantics and syntax. To bridge this divide a new suite of tools for the low-level manipulation of V3000 molfiles is under construction. This article lifts the covers on it.

# Introducing Trey

Trey is standalone software library for reading, writing, and otherwise manipulating V3000 CTfiles. The name derives from [English word](https://en.wikipedia.org/wiki/Trey) meaning "three" in various contexts. As the name suggests, Trey will focus exclusively on V3000 CTfiles. In other words, support for V2000 molfiles is out of scope. A preview of Trey previously appeared [here](/articles/2022/05/23/a-dedicated-library-for-reading-and-writing-v3000-ctfiles/).

Trey is implemented in [Rust](/articles/2020/01/20/cheminformatics-in-rust/), a language that has been covered from [several angles](/articles/) on this blog. To recap, Rust is type safe systems programming language. Like C and C++, memory is managed manually. Unlike those other languages, Rust guarantees code written in it to be free of several classes of pernicious memory errors. Rust's tooling is highly developed, boasting a modern package manager, [Cargo](https://doc.rust-lang.org/cargo/), among many other ergonomic comforts. The Rust community is smaller than that for C and C++ but growing rapidly, with several large organizations now involved including: the Mozilla Foundation; Microsoft; Dropbox; the GNU Compiler Collection; and Linux.

Trey's source code is [available on GitHub](https://github.com/metamolecular/trey/), can installed through [Crates.io](https://crates.io/crates/trey/), and is licensed under the business-friendly [MIT License](https://opensource.org/licenses/MIT). Trey was factored out of a production software package created by [my company](https://metamolecular.com) that translates [ChemDraw CDXML](/articles/2021/04/07/an-introduction-to-the-chemdraw-cdxml-format/) to V3000 CTfiles.

# Features

Trey can currently write correctly-formatted V3000 CTfiles. Both Molfile and RGfile (Rgroup file) formats are supported. The following snippet illustrates how to write a blank connection table.

```rust
use trey::ctab::ConnectionTable;
use trey::write::connection_table as write;

fn main() {
    let ctab = ConnectionTable::default();

    assert_eq!(
        write(&ctab),
        [
            "M  V30 BEGIN CTAB",
            "M  V30 COUNTS 0 0 0 0 0",
            "M  V30 END CTAB",
        ]
    )
}
```

This support comes courtesy of a suite of data structures specifically designed to work with V3000 CTfiles. Part of this design is type safety, meaning that Trey makes it difficult, if not impossible, to represent invalid states. Consider the definition for `Atom`.

```rust
pub struct Atom {
    pub index: Index,
    pub kind: AtomKind,
    pub charge: Charge,
    pub coordinate: Coordinate,
    pub atom_atom_mapping: Option<Index>,
    pub valence: Option<usize>,
    pub mass: Option<usize>,
    pub attachment_point: Option<AttachmentPoint>,
}
```

An instance of `Atom` is guaranteed to be valid, regardless of its source, because all of its member values have the same guarantee and these members have been composed in such a way to make invalid states impossible. 

Take `Index`, for example, which represents the V3000 concept of a unique identifier assigned to atoms and other entities. It's an integer value greater than zero, but without an upper bound. Thanks to the Rust [newtype](https://doc.rust-lang.org/rust-by-example/generics/new_types.html) idiom, it's impossible to create an index out of range.

```rust
pub struct Index(String);

impl Index {
    pub fn new(id: usize) -> Self {
        id.to_string().try_into().unwrap()
    }
}
```

Similarly, the `atom_kind` attribute renders invalid data combinations impossible to express. Each variant of `AtomKind` possesses a different mix of attributes, a Rust capability that figures prominently throughout Trey. In essence, errors that would otherwise be expressed at runtime (or not) are instead caught at compile time. Used consistently, this approach can improve data quality. It's a central theme found throughout Trey's data structures.

```rust
pub enum AtomKind {
    Element(Element),
    PolymerBead,
    Any,
    Rgroup(IndexList),
    ElementList(ElementList),
}
```

# Applications

When complete, Trey will fully support the lossless reading and writing of V3000 CTfiles. It's reasonable to ask what applications might exist for such a standalone library dedicated to a single serialization format.

Normally, the functionality embodied by Trey would be part of a larger cheminformatics toolkit. Although this is one possible application (see, for example [ChemCore](/articles/2020/06/01/chemcore-a-cheminformatics-toolkit-for-rust/)), I think this an unnecessarily restrictive view. There are a few clear applications for standalone molecular (de)serialization tools, and I suspect others would become apparent if cheminformatics were presented with high quality, modular tools.

Lossless translators offer one opportunity. Consider the problem of translating some serialization format such as [Balsa](/articles/2022/06/29/introducing-balsa/) into V3000 Molfile. When implemented within a cheminformatics toolkit, this translation is likely to proceed through the toolkit's native molecular representation. This may or may not be a superset of both formats. If not, needless information loss may be unavoidable. In contrast, lossless end-to-end translation would pair a Balsa reader with Trey's lossless V3000 writer. Incompatible features would necessarily be dropped, but not due to the limitations of any intermediate representation.

There are also a few situations in which a cheminformatics toolkit is overkill. For example, we might want to merely renumber atom or bond indexes, or otherwise normalize a V3000 representation. Such applications benefit from lean code dedicated to a specific task, especially if done at scale. Likewise, simple calculations like empirical formula, exact molecular mass, and potentially even certain fingerprints could be computed directly and efficiently on native Trey data structures.

# Conclusion

Trey is a new dedicated library for the reading, writing, and manipulation of V3000 CTfiles. It currently support high-quality output. Together with [Balsa](/articles/2022/06/29/introducing-balsa/), Trey expands on the idea of format-specific serialization tools loosely coupled through standard language infrastructure.
