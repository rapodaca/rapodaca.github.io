---
title: "Let's Build a SMILES Parser in Rust"
summary: "Toward a suite of toolkit-agnostic utilities for the SMILES language."
twitter: true
summary-image: images/posts/20200525/summary.png
published: "2020-05-25T16:00:00Z"
updated: "2020-06-01T16:30:00Z"
---

SMILES is a widely-used language for chemical structure exchange. As such, no cheminformatics toolkit today would be complete without a SMILES reader and writer. This article describes the design and initial implementation of [Purr](https://github.com/rapodaca/purr), a toolkit-agnostic library for working with SMILES in Rust. In its current form, Purr can parse most of the SMILES language.

Previous articles from this blog may be helpful in understanding Purr's purpose and design. [Rust makes a compelling language choice](/articles/2020/01/20/cheminformatics-in-rust/) for several reasons. The [SMILES grammar](/articles/2020/04/20/smiles-formal-grammar/) is woven deeply into Purr. [Stereochemistry and atom parity](/articles/2020/05/04/stereochemistry-and-atom-parity-in-smiles/) played a crucial role in Purr's approach to bonding representation. Purr follows the release of a [foundational layer](/articles/2020/05/11/cheminformatics-in-rust-implementing-a-minimal-molecule-api/) of a Rust cheminformatics toolkit. That work was in turn based on a [minimal Molecule API](/articles/2020/01/06/a-minimal-graph-api/) which itself builds on a somewhat unusual take on [graphs in Rust](/articles/2020/02/17/graphs-in-rust-introducting-graphcore/).

# The Code

The Purr repository is hosted on [GitHub](https://github.com/rapodaca/purr). Using it will require a [Rust installation](https://rustup.rs).

Clone the repository and run its test suite with the following commands:

```console
git clone https://github.com/rapodaca/purr
cd purr
cargo test
```

The remainder of this article describes the design and implementation of Purr.

# Data Structures

Purr is organized around the `Mol` data structure which exposes two public attributes &mdash; one representing a list of `Atom`s and the other representing a list of `Bond`s. This design follows from the observation that SMILES encodes a molecular graph. It seems reasonable that the output of a SMILES parser would be a graph-like object. To this end, Purr defines a total of four flat data structures that closely align with the related concepts in the SMILES language.

```rust
// simplified listing

pub struct Mol {
    pub atoms: Vec<Atom>,
    pub bonds: Vec<Vec<Bond>>
}

pub struct Atom {
    pub element: Element,
    pub aromatic: bool,
    pub isotope: Option<u16>,
    pub hcount: Option<u8>,
    pub charge: Option<i8>,
    pub parity: Option<Parity>,
    pub map: Option<u8>,
}

pub struct Bond {
    pub tid: usize,
    pub style: Option<Style>
}

pub enum Style {
    Single,
    Double,
    Triple,
    Quadruple,
    Up,
    Down,
    Aromatic
}
```

The `bonds` attribute of `Mol` deserves some attention. This jagged 2D array represents an [adjacency list](https://en.wikipedia.org/wiki/Adjacency_list) graph representation. In other words, `bonds` indexes the list of bonds associated with a given atomic ID. For example, to find the list of bonds at atomic ID 0, use `bonds[0]`, and so on.

```rust
let mol = get_mol(); // get_mol is defined somewhere else

println!("Bond list at ID 1: {:#?}", mol.bonds.get(1).unwrap());
```

Also note that `Bond` defines only two attributes: the ID of the target atom (`tid`) and an optional bond `Style`. A source atom ID would be redundant, so it isn't used. The `style` attribute represents one of the seven valid SMILES bond types. Dot (`.`) is not a bond type and so it is not included within the `Style` enum.

An adjacency list may seem like overkill. Why not use an [edge list](https://en.wikipedia.org/wiki/Edge_list) instead? This could be accomplished with an `edges` attribute represented by a flat `Vec<Bond>`. The reason relates to the interplay between atom parity and rings.

As noted in a previous article, [atom parity in SMILES](/articles/2020/05/04/stereochemistry-and-atom-parity-in-smiles/) depends on the *order* in which neighboring atoms are added. A ring in SMILES is represented as a cut in which the target atom is only revealed after parsing progresses to the right. A parser must therefore record the exact order of substituent addition for each atom independently. An adjacency list fulfils this requirement, but an edge list does not.

# Scanner

Parsing follows the [Scanner-driven parser development](/articles/2019/01/22/scanner-driven-parser-development/) method previously outlined on this blog. To recap, this method features an object of type `Scanner`. A `Scanner` moves a cursor from left to right over a string. The next character can be "peeked" (reversibly examined), or "popped" (irreversibly examined). Popping the scanner advances the cursor by one characters. The cursor can only be incremented, so moving backward is impossible. This simplicity of operation and lack of backtracking makes recursive descent parsing efficient.

# SMILES Grammar

As described previously, [the SMILES formal grammar can be cast into LL(1) form](/articles/2020/04/20/smiles-formal-grammar/). Doing so offers important advantages. For one, numerous automated parser generators operate over LL(1) grammars, vastly simplifying grammar development and testing. Secondly, an LL(1) grammar makes an excellent blueprint for a hand-crafted recursive-descent parser. This is the approach used in Purr.

A similar approach to the one described here has been successfully used in the JavaScript-based cheminformatics toolkit within [ChemWriter](https://chemwriter.com/smiles/).

# Builder

Before tackling parsing itself, there's one more piece of business we need to consider. A recursive descent parser needs to build some kind of representation of the contents being parsed. This representation is sometimes called a "parse tree." In Purr, the result of a parse is a `Mol` object.

Keeping track of the state required to build a `Mol` is non-trivial. I've found it much easier to separate the creation of the state object from parsing. My solution is a `Builder`.

`Builder` provides a simple API for building a `Mol`. All methods except one are mutators reflecting the kinds of actions taken when reading a SMILES string from left to right: creation from a root atom; setting a bond style; connecting a new atom to the root; opening or closing a ring; opening or closing a branch; and beginning a new root.

```rust
// simplified listing

pub struct Builder {
    atoms: Vec<Atom>,      // atoms to be added
    bonds: Vec<Vec<Bond>>, // adjacency list
    style: Option<Style>,  // the current bond style
    stack: Vec<usize>,     // used for opening/closing branches
    root: usize,           // id of atom to be extended
    cuts: HashMap<u8, Cut> // rnum to Cut mapping
}

impl Builder {
    pub fn new(root: Atom) -> Self {
        // Returns a Builder struct, adding root to atoms and setting
        // self.root to 0
    }

    pub fn root(&mut self, atom: Atom) {
        // Begins a new root when dot (.) bond found
    }

    pub fn extend(&mut self, atom: Atom) {
        // Create a bond between current root and atom
    }

    pub fn bond(&mut self, style: Style) {
        // Sets the current bond style
    }

    pub fn open(&mut self) {
        // Opens a branch
    }

    pub fn close(&mut self) {
        // Closes a branch
    }

    pub fn cut(&mut self, rnum: u8) -> Result<(), Error> {
        // Opens or closes a ring identified by rnum.
        // Returns an error if the left/right bond styles are
        // incompatible.
    }

    pub fn to_mol(self) -> Result<Mol, Error> {
        // Consumes this Builder and returns the Mol under construction,
        // or an error given invalid state (open rings or branches).
    }
}

struct Cut {
    id: usize,
    index: usize
}
```

Having instantiated a `Builder`, a parser can maintain singular focus on translating SMILES tokens into `Builder` API calls.

# The `smiles_to_mol` Function

Having discussed data structures and helpers, we're now in a position to consider the `smiles_to_mol` function itself. This function accepts a [string slice](https://doc.rust-lang.org/book/ch04-03-slices.html#string-slices). If it represents a valid SMILES, the corresponding `Mol` is returned. Otherwise an `Error` is returned.

```rust
pub fn smiles_to_mol(text: &str) -> Result<Mol, Error> {
    let mut scanner = Scanner::new(text);

    if scanner.done() {
        return Err(Error::EndOfLine);
    }
    
    if let Some(atom) = bare_atom(&mut scanner)? {
        let mut state = State {
            scanner: scanner,
            builder: Builder::new(atom),
            dot: false
        };

        loop {
            if !chain(&mut state)? && !branch(&mut state)? {
                if !state.scanner.done() {
                    break Err(Error::InvalidCharacter(state.scanner.cursor()))
                }

                break match state.builder.to_mol() {
                    Ok(molecule) => Ok(molecule),
                    Err(_) => {
                        unimplemented!()
                    }
                }
            }
        }
    } else {
        Err(Error::InvalidCharacter(0))
    }
}
```

The top-level function creates a `Scanner` from the string slice. If the scanner is done, then the function exits early with a `false` result. Otherwise, the `bare_atom` helper is called to parse the root atom. If that fails, an error is returned. Otherwise, a private `State` struct is created. `State` combines a `Scanner`, a `Builder`, and a boolean flag indicating whether or not a dot (`.`) token was recently seen. Then, a loop reads chains and branches until an error is encountered (via the `?` operator), the scanner terminates, or no new tokens can be read.

If you haven't done so already, this would be a good time to review the [SMILES formal grammar](/articles/2020/04/20/smiles-formal-grammar/). Close correlation between both the structure and names of the helper functions in `smiles_to_mol` and the grammar will be seen throughout `smiles_to_mol`.

Rather than discuss all of the helper functions, here I'll just highlight a few that illustrate the main points.

The `chain` helper function greedily parses a sequence of atoms, returning when no more progress is possible. Notice the correlation between the production rule `<chain>` and the layout of the function.

```rust
// <chain> ::= ( <dot> <atom> | <bond>? ( <atom> | <rnum>) )+
fn chain(state: &mut State) -> Result<bool, Error> {
    let mut result = false;

    loop {
        if dot(state)? {
            if !atom(state)? {
                break Err(Error::InvalidCharacter(state.scanner.cursor()))
            }
        } else if bond(state)? {
            if !atom(state)? && !rnum(state)? {
                break Err(Error::InvalidCharacter(state.scanner.cursor()))
            }
        } else {
            if !atom(state)? && !rnum(state)? {
                break Ok(result)
            }
        }

        result = true;
    }
}
```

The `branch` helper greedily parses a branch enclosed by opening and closing parentheses (`(` and `)`, respectively). After popping an open parentheses (`(`), a loop is entered. It terminates if the `Scanner` is done or if a close parentheses (`)`) is found. An `Error` will be triggered by failure to find a closing `)` or failure to find a `<line>` construct within the branch. The `open` and `close` methods of `Builder` keep track of practically unlimited levels of nesting.

```rust
// <branch> ::= "(" ( <bond>? <line> )+ ")"
fn branch(state: &mut State) -> Result<bool, Error> {
    if let Some('(') = state.scanner.peek() {
        state.scanner.pop();
    } else {
        return Ok(false);
    }

    state.builder.open();

    while !state.scanner.done() {
        bond(state)?;

        if !line(state)? {
            return Err(Error::InvalidCharacter(state.scanner.cursor()));
        }

        if let Some(')') = state.scanner.peek() {
            break;
        }
    }

    state.builder.close();

    match state.scanner.pop() {
        Some(')') => Ok(true),
        Some(_) => Err(Error::InvalidCharacter(state.scanner.cursor())),
        None => Err(Error::EndOfLine)
    }
}
```

# Conclusion

Purr is a low-level Rust library for working with SMILES. It currently includes a parser capable of correctly processing all language elements. A SMILES writer should be straightforward to implement given a depth-first traversal and existing Purr data structures. The combination of a low-level `Molecule` implementation as already described, and a Purr reader/writer would create a solid foundation for a future cheminformatics toolkit in Rust.
