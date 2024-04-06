---
title: "Abstract Syntax Trees for SMILES"
summary: "Designing a suite of power tools for SMILES manipulation in Rust."
twitter: true
summary-image: images/posts/20201214/summary.png
published: "2020-12-14T21:00:00Z"
---

SMILES is the de facto standard for information exchange in cheminformatics. But despite this language's prominent role, low-level tools and documentation remain sparse and incomplete. Recent articles here have highlighted the development of [a SMILES grammar](/articles/2020/04/20/smiles-formal-grammar/) and [a parser implementation in Rust](/articles/2020/05/25/lets-build-a-smiles-parser-in-rust/). This article extends that theme by introducing another powerful tool for the analysis and manipulation of SMILES using Rust.

# Blazingly Fast SMILES Processing

Strings offer a convenient format in which to encode SMILES, but this convenience comes at a cost. Reading and writing SMILES requires nontrivial string manipulation, validation, and interpretation steps. One option is to reach for a cheminformatics toolkit. But this general-purpose approach necessarily incurs overhead, and potentially a great deal of it. Sometimes the performance hit won't matter. But sometimes it will. When it does, it's nice to have options.

Andrew Dalke discusses this problem in *[Fun with SMILES I: Does an element exist?](http://www.dalkescientific.com/writings/diary/archive/2016/03/28/find_element_in_smiles.html)*. There he explores the ways that valid SMILES strings can be directly manipulated. The emphasis on raw strings necessarily limits the range of possible applications to atom/bond screening. For example, we can test whether a particular atom or set of atoms is found within a SMILES string. But that still leaves a lot of problems on the table, including: semantic validation; hydrogen counting; stereochemical analysis; and so on.

Between raw string manipulation and a full-blown cheminformatics toolkit lies a set of tools that I think has gone mostly ignored. And the advantages of working at that level extend beyond performance boosts.

# Abstract Syntax Trees

We can bridge the gap between raw strings and powerful in-memory representations with an *abstract syntax tree* (AST). An AST is a treelike data structure that captures the ways that a language's elements relate to each other, while ignoring syntactic details. The tree contains three kinds of nodes, which are characterized by the presence or absence of parents and children:

- **Root Node**. No parent and zero or more children.
- **Interior Node**. One parent and one or more children.
- **Leaf Node**. One parent and zero children.

The overall structure of an AST is recursive. An interior node can be detached from its parent to yield the root of a new tree. The process is reversible. This means that iteration and/or recursion can be used to assemble complex ASTs from simpler fragments.

Abstract syntax trees stand in contrast to concrete syntax trees (aka "parse trees"). The main difference is focus. Whereas a parse tree encodes relationships between tokens, an AST focuses on the relationship between language elements. For example, SMILES requires certain atoms to be wrapped in square brackets (`[` and `]`). A parse tree would include the brackets, but an AST would not.

For more on abstract syntax trees, see *[Let’s Build A Simple Interpreter. Part 7: Abstract Syntax Trees](https://ruslanspivak.com/lsbasi-part7/)*.

# Rust as an Abstract Syntax Tree Design Language

Rust lends itself remarkably well to the formulation of abstract syntax trees. For one thing, static typing provides rigorous validation at compile time at no cost. If implemented with care, an AST offers the valuable property of *infallibility*; it will literally be impossible to construct a syntactically invalid AST. This constraint eliminates complexity and inefficiency that would otherwise occur through runtime checks.

But beyond static typing, Rust supports a highly refined type system. In particular, Rust includes [algebraic types](https://doc.rust-lang.org/std/keyword.enum.html) out of the box. Although they're called "enums," they go far beyond the enums found in most other languages. For one thing, Rust's enums can hold data either as tuples, or as structs.

Better still, Rust supports these custom enum types through a a rich syntax that includes the `match` keyword. Among other benefits, these constructs enable efficient branching, early return, and safe unwrapping of tuple and struct enums. The examples that follow later illustrate some of the possibilities.

In a nutshell, Rust's type system makes it possible to represent any valid SMILES string as a compiler-validated live data structure. The next few sections make the idea more concrete by presenting parts of a SMILES AST individually. We start with some simple leaf nodes, working our way up to interior/root nodes.

A [project containing the full source](https://github.com/rapodaca/smiles_ast) is available.

# The Chemical Elements

Consider the ways in which a SMILES aliphatic atom might be represented. An aliphatic atom conforms to a set of [valence rules](/articles/2020/06/08/hydrogen-suppression-in-smiles/), can be written without brackets, and must derive from an element found in the set: "B"; "C"; "N"; "O"; "S"; "P"; "F"; "Cl"; "Br"; "I"; "At"; and "Ts."

Rust's [`String`](https://doc.rust-lang.org/std/string/struct.String.html) type is one candidate, but there are two problems. First, a `String` is expensive relative the purpose it would serve, namely identification. Second, `String` can't constrain its values to just the aliphatic subset elements. We'd constantly find ourselves checking for membership at runtime, defeating the goals of blazingly fast SMILES processing and clarifying syntax. We need something better.

Enter `enum`, with which the set of aliphatic atom kinds can be represented as:

```rust
pub enum Aliphatic {
    B, C, N, O, S, P, F, Cl, Br, I, At, Ts
}
```

To obtain a particular variant, we select it as follows:

```rust
let carbon = Aliphatic::C;
```

Testing for the presence of specific aliphatic atoms can be done with `match`:

```rust
fn handle_aliphatic(aliphatic: Aliphatic) {
    match aliphatic {
        Aliphatic::B => unimplemented!(), // do something boron-specific
        Aliphatic::C => unimplemented!(), // do something carbon-specific
        Aliphatic::N => unimplemented!(), // do something nitrogen-specific
        _ => unimplemented!()             // ... and so on
    }
}
```

Using a similar approach, we can define enums for `Aromatic`, `BracketAromatic`, and `Element` types:

```rust
pub enum Aromatic {
    B, C, N, O, S, P
}

pub enum BracketAromatic {
    B, C, N, O, S, P, Se, As
}

pub enum Element {
    //  0   1   2   3   4   5   6   7   8   9
            H,  He, Li, Be, B,  C,  N,  O,  F,  // 0
        Ne, Na, Mg, Al, Si, P,  S,  Cl, Ar, K,  // 1
        Ca, Sc, Ti, V,  Cr, Mn, Fe, Co, Ni, Cu, // 2
        Zn, Ga, Ge, As, Se, Br, Kr, Rb, Sr, Y,  // 3
        Zr, Nb, Mo, Tc, Ru, Rh, Pd, Ag, Cd, In, // 4
        Sn, Sb, Te, I,  Xe, Cs, Ba, La, Ce, Pr, // 5
        Nd, Pm, Sm, Eu, Gd, Tb, Dy, Ho, Er, Tm, // 6
        Yb, Lu, Hf, Ta, W,  Re, Os, Ir, Pt, Au, // 7
        Hg, Tl, Pb, Bi, Po, At, Rn, Fr, Ra, Ac, // 8
        Th, Pa, U,  Np, Pu, Am, Cm, Bk, Cf, Es, // 9
        Fm, Md, No, Lr, Rf, Db, Sg, Bh, Hs, Mt, // 10
        Ds, Rg, Cn, Nh, Fl, Mc, Lv, Ts, Og      // 11
}
```

`BracketAromatic` appears to be a superset of `Aromatic`, so it might be tempting to capture this relationship with some kind of "is-a" relationship. However, this makes little sense semantically. Other than a superficial resemblance, `BracketAromatic` and `Aromatic` mean very different things and occur in completely different contexts.

Dividing atom kinds into separate `Aromatic` and `Aliphatic` enums may seem wasteful. Why not use an aromatic boolean flag instead? It may not be obvious, but this would actually be a step backward because it would allow the expression of invalid states. For example, we might set the aromaticity flag to `true` on an atom kind of fluorine. SMILES specifically disallows this state. Once again we'd be forced to use runtime checks, exactly the approach we're trying to avoid. By defining separate aromatic and aliphatic atom kinds, it becomes impossible to ever express the illegal state in the first place.

# Bond Kinds

The set of possible SMILES bond kinds can be represented by the following enum:

```rust
pub enum BondKind {
    Elided,
    Single,
    Double,
    Triple,
    Quadruple,
    Aromatic,
    Up,
    Down
}
```

This is mostly straightforward. The expected bond orders are all there: `Single`; `Double`; `Triple`; and `Quadruple`. Also present is the `Aromatic` bond kind, which has [additional semantics](/articles/2020/02/10/a-comprehensive-treatment-of-aromaticity-in-the-smiles-language/). `Up` and `Down` correspond to the SMILES directional bonds used in double bond conformation. In strings they are encoded by the forward slash ('/') and backslash ('\\') characters, respectively.

The presence of an `Elided` bond kind might be more surprising because it never appears in a SMILES string. For example, the bond between the two carbons in `CC` is elided, but the one in `C-C` is not. It may seem that an optional `BondKind` (i.e., `Option<BondKind>`) would be appropriate here, but there are two reasons to avoid it. First, it complicates the processing of bonds by requiring an additional Some/None check. More importantly, it makes little sense semantically. An elided bond is most certainly there, just not explicitly.

Notice the absence of a `Dot` variant, which is what an optional bond kind of `None` would actually imply: literally no bond. We'll come back to this point later.

# BracketSymbol

The enums `Aromatic` and `Aliphatic` fully specify an atomic identity. As such, these leaf nodes can be used without further qualification. However, SMILES allows for customization of properties such as isotope, charge, and hydrogen count. For that we'll need an interior node.

Wrapping an element symbol in bracket characters (`[` and `]`) in a SMILES string signals intent to customize one or more atomic properties. This makes a much wider range of atomic symbols and properties possible. To represent these choices, we introduce `BracketSymbol`. SMILES support three distinct kinds of bracket symbol: star (unknown); element (a chemical element symbol); and aromatic. The following enum captures the relationships between these language elements:

```rust
pub enum BracketSymbol {
    Star,
    Element(Element),
    Aromatic(BracketAromatic)
}
```

Notice that both `Element` and `Aromatic` variants are tuples holding data (an `Element` and `BracketAromatic` respectively). They can be used as in the following example.

```rust
fn handle_bracket_symbol(symbol: BracketSymbol) {
    match symbol {
        Star => unimplemented!(),                   // handle [*]
        Element(element) => match element {
            Element::N => unimplemented!(),         // handle [N]
            _ => unimplemented!()                   // ... and so on
        },
        Aromatic(bracket_aromatic) => match bracket_aromatic {
            BracketAromatic::N => unimplemented!(), // handle [n]
            _ => unimplemented!()                   // ... and so on
        }
    }
}
```

The `Star` variant is used when some atomic properties are defined, but the element is not. In SMILES strings, it would appear as `[*]`. It might seem like a good idea to instead represent the `Star` variant as an optional `BracketSymbol` (i.e., `Option<BracketSymbol>`). Although this would be semantically consistent, it would increase the complexity of using `BracketSymbol`. For this reason, the simpler approach of defining a `BracketAtom::Star` variant is used.

# AtomKind

SMILES supports four distinct kinds of atom: a bare star (`*`); aliphatic (e.g., `N`); aromatic: (e.g., `n`); and bracket (e.g., `[N]` or `[n]`). These are all captured by the `AtomKind` type:

```rust
pub enum AtomKind {
    Star,
    Aliphatic(Aliphatic),
    Aromatic(Aromatic),
    Bracket {
        isotope: Option<u16>,
        symbol: BracketSymbol,
        parity: Option<Parity>,
        hcount: Option<u8>,
        charge: Option<i8>,
        map: Option<u16>
    }
}
```

Rust offers some powerful tools for working with complex algebraic types like `AtomKind`. For example, a function that only needs to process the isotope found within a bracket atom would look something like this:

```rust
fn handle_isotope(kind: AtomKind) {
    let isotope = match kind {
        AtomKind::Bracket { isotope, .. } => isotope,
        _ => return // early return
    };

    // handle isotope
}
```

The `AtomKind::Bracket` variant supports an optional field of type `Parity`. This is a leaf node enum with two variants, representing the two forms of tetrahedral stereo parity:

```rust
pub enum Parity {
    Clockwise,
    Counterclockwise
}
```

A function can select for only those SMILES atoms with a stereocenter like so:

```rust
fn handle_stereo(kind: AtomKind) {
    let parity = match kind {
        Bracket { parity, .. } => match parity {
            Some(parity) => parity,
            None => return
        },
        _ => return
    };

    match parity {
        Parity::Clockwise => unimplemented!(), // handle @@ parity,
        Parity::Counterclockwise => unimplemented!() // @ parity
    }
}
```

# Atom

Having defined the properties of an atom, it's possible to specify `Atom` itself with the following struct:

```rust
pub struct Atom {
    pub kind: AtomKind,
    pub links: Vec<Link>
}
```

This formulation requires every SMILES atom to have exactly one `AtomKind`, which itself must be selected from one of exactly four choices: star; aliphatic; aromatic; or bracket. It's impossible to construct or even encounter an invalid atom because it's impossible to make invalid versions of its two required components `AtomKind` and `Link`.

By itself, `Atom` acts like a root node in that it has no parent. However, an Atom can become an interior node through association with a `Link`, as described in the next section.

# Link

A SMILES `Atom` connects to its children through the `Link` enum. This enum allows for two variants: (1) parent and child are connected through a bond (`Link::Bond`); and (2) parent and child are disconnected with no bond between them (`Link::Split`).

```rust
pub enum Link {
    Bond {  // e.g., CC, C-C, C=C, etc
        kind: BondKind,
        target: Target
    },
    Split(Atom) // e.g., C.C
}
```

The `Link::Bond` variant allows two `Atom`s to be connected through a bond. It has two properties: `kind` and `target`. `kind` is one of the SMILES bond kinds enumerated previously. `target` is itself an enum that can be present in one of two variants: `Target::Join` and `Target::Atom`. The former represents a ring closure and the latter is used to connect two `Atom`s. The `Target::Join` variant holds a `u16` value representing a ring closure number (aka "rnum"). The `Target::Atom` variant holds an `Atom` enum, which was defined in the previous section.

```rust
pub enum Target {
    Join(u16),
    Atom(Atom)
}
```

Consider ethane, encoded by the string `CC`. This SMILES can be represented with the following data structure:

```rust
let ethane = Atom {
    kind: AtomKind::Aliphatic(Aliphatic::C),
    links: vec![
        Link::Bond {
            kind: BondKind::Elided,
            target: Target::Atom(Atom {
                kind: AtomKind::Aliphatic(Aliphatic::C),
                links: vec![ ]
            })
        }
    ]
};

assert_eq!(ethane.kind, AtomKind::Aliphatic(Aliphatic::C));
```

Notice how we reference the entire tree through its root node only. We can traverse the tree any way we'd like, but random access of nodes is not possible without first indexing them. We'll come back to this point later.

In addition to explicit parent-child relationships through bonds, SMILES also supports disconnections. In SMILES strings, this is accomplished with the dot character (e.g., `C.C`). The AST supports this relationship with the `Link::Split` variant. Its presence means that a parent and child atom are not connected. `Link::Split` solves the problem of representing multiple disconnected components found in the same molecular graph, but there are more advanced uses that don't result in disconnected components (e.g., `C1.CC1`).

Consider a SMILES string representing two isolated methane molecules (`C.C`). An AST representation would be:

```rust
let methanes = Atom {
    kind: AtomKind::Aliphatic(Aliphatic::C),
    links: vec![
        Link::Split(Atom {
            kind: AtomKind::Aliphatic(Aliphatic::C),
            links: vec![ ]
        })
    ]
};
```

Notice how the Rust compiler enforces the rules of SMILES syntax. For example, the string `C.1CC1` is [not a valid SMILES](http://opensmiles.org/opensmiles.html#_disconnected_structures) because the dot character may not separate an atom and an rnum. There is no way to compile a Rust program with the corresponding AST because `Link::Split` takes a value of type `Atom` only.

# Uses of a SMILES Abstract Syntax Tree

An AST offers a high-level view of a language that's difficult to obtain any other way. Omitting minor syntactic details brings fundamental relationships between language elements into sharp focus. This perspective clarifies the language, which can be seen from a perspective unburdened by low-level concerns over character selection and placement.

But this is just a start. With an AST implemented in a type safe language, flexible processing becomes possible. We can, for example implement readers and writers for new SMILES syntaxes. A case in point is [DeepSMILES](/articles/2019/03/19/chemical-line-notations-for-deep-learning-deepsmiles-and-beyond/), which modifies SMILES syntax while retaining its semantics. Another would be [SELFIES](https://arxiv.org/ct?url=https%3A%2F%2Fdx.doi.org%2F10.1088%2F2632-2153%2Faba947&v=cd51ce2f) and similar approaches. Developing readers and writers for such SMILES variants becomes easier given an AST.

One form of SMILES customization that has received a lot of attention is canonicalization. Without an AST, the ordering of atoms must take place at the level of the cheminformatics toolkit, which may or may not share the same set of features as SMILES. Given an AST, canonicalization can take place on a data structure that will by definition be directly writable as a string.

ASTs can also help improve the quality of readers and writers. On one hand, they provide a clean boundary between semantics and syntax. This kind of segregation makes implementations easier to write, test, and reason about. On the other hand, an AST makes it possible to create a data structure that's guaranteed to be syntactically valid. That guarantee comes from [making it impossible to represent invalid states](https://neilmadden.blog/2020/11/25/parse-dont-type-check/).

Useful though they may be, ASTs have their limits &mdash; especially for SMILES. Trees can be unwieldy for some operations compared to graphs. The AST presented here, for example, gives an `Atom` knowledge of its children only. It has has no information about its parent or even whether one exists. Even simple molecular property determinations such as valence require walking the entire tree to build secondary state. For some applications this will be no problem at all. For others, a somewhat higher level representation would be better.

On option would be to introduce an *intermediate representation*. An intermediate representation transforms an AST in one or more useful ways. In the case of a SMILES, an IR might provide a more graph-like API. This could offer a stepping-stone toward a full molecular graph as found in a cheminformatics toolkit, but without the overhead.

A more flexible approach would be to support customizable traversal followers. The follower would accumulate state as the AST is traversed. Traversal could occur in depth-first or breadth-first order, and could use pre-order or post-order processing to generate more sophisticated representations in linear time complexity. Separating AST traversal and analysis in this way would then support a wide range of analyses.

# Other Work

Low-level tools for SMILES manipulation are not common, but some examples have appeared over the years:

- [Beam](https://github.com/johnmay/beam). As noted by the README, the purpose of the library is "... to elegantly handle the SMILES™ syntax and as fast as possible." Both input and output are supported. Beam is written in Java and has been integrated into the [Chemistry Development Kit](https://github.com/cdk/cdk).
- [Smiley](https://github.com/timvdm/Smiley). A C++ library that parses SMILES and SMARTS.
- [pysmiles](https://pypi.org/project/pysmiles/). A SMILES reader/writer combination written in Python.
- [Purr](https://crates.io/crates/purr). A Rust crate for reading SMILES written by yours truly.
- [OpenSMILES.jl](https://github.com/caseykneale/OpenSMILES.jl). A more recent parser written in Julia.

None of these projects defines or uses a type safe abstract syntax tree of the kind described in this article.

# Conclusion

The SMILES language is much more complex that it might appear at first glance. This complexity makes direct string manipulation useful in only a handful of cases. Cheminformatics toolkits offer a wide range of functionality, but at the cost of suboptimal performance. Abstract syntax trees implemented in fast, type safe languages such as Rust address a problem area that has not been widely explored to date: efficient low-level tools for SMILES manipulation. More than this, a well-crafted abstract syntax tree can capture and reveal subtle language concepts that are difficult to convey through examples or even grammars.