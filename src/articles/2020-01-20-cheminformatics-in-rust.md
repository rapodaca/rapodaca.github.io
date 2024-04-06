---
title: Rust for Cheminformatics
summary: "Lots of potential, but not much in the way of cheminformatics libraries or community yet."
twitter: true
summary-image: images/posts/20200120/summary.png
published: "2020-01-20T18:00:00Z"
---

Few decisions are more important in a software project than programming language. The choice often boils down to four factors: maturity; libraries; platforms; and tooling. For well-established languages, the choice is sometimes easy: JavaScript for client-side web development; Python for machine learning and numerical analysis; C/C++ for embedded systems and operating systems; and Java for enterprise applications. Newer languages are harder to evaluate because platforms, libraries, tooling, and stability take time to evolve.

But every decade or so a language comes along that tempts a critical mass of developers to try something new. These emerging languages can fly under the radar for many years due to the lack of scope and tooling, or due to frequent breaking changes. But at the core lies something innovative and full of potential.

[Rust](https://www.rust-lang.org) is one of those languages. Performance matches C/C++ but with a distinctly modern feature set. Platforms from embedded systems to Web browsers are well within reach. Gone is the garbage collector and runtime, but so is manual memory management. Object-oriented programming is supported, but without classes. Pure functional programming is possible with immutability enforced at compile time. Rust is statically typed, but type inference means you'll omit most type annotations.

This article introduces Rust as a language that, although practically unknown today in cheminformatics, could one day play a role in the field. It concludes by sketching the beginnings of a graph library in Rust.

# Some History

As noted in the [FAQ](https://prev.rust-lang.org/en-US/faq.html):

> Rust started as Graydon Hoare’s part-time side project in 2006 and remained so for over 3 years. Mozilla got involved in 2009 once the language was mature enough to run basic tests and demonstrate its core concepts. ...

Shortly thereafter, [the Mozilla Foundation](https://foundation.mozilla.org/en/) became Rust's main sponsor. The Rust Team uses an [open governance model](https://www.rust-lang.org/governance) implemented through several groups drawing from members employed both inside and outside of Mozilla.

During its fourteen-year history, the Rust language and tooling have undergone many changes. Some of them were backward-incompatible. This state of flux sometimes causes grief for newcomers because out-of-date documentation remains quite easy to find.

Although it will take time for this situation to resolve itself, help is on the way. The [2018 release](https://blog.rust-lang.org/2018/12/06/Rust-1.31-and-rust-2018.html) was a [major milestone](https://hacks.mozilla.org/2018/12/rust-2018-is-here/), particularly from the perspective of stability and backward-compatibility. When reading documentation, be sure to check the date.

# Fast, Safe Systems Programming

Rust has been described as a "fast, safe systems" language. C and C++, although fast systems languages, are not safe. In particular, Rust strives for "type safety," meaning that the compiler enforces well-defined behavior for every Rust program. Unlike C and C++, for example, it's impossible to compile Rust code that will produce a buffer overflow without explicitly opting into unsafe behavior.

"Systems programming" is a somewhat vague and difficult to define term. [According to Wikipedia](https://en.wikipedia.org/wiki/Systems_programming), systems programming can be viewed as the category of software whose main purpose is to provide services to other software, operate in a constrained environment, or both. Cheminformatics toolkits and chemical computations fit this definition.

Beyond speed and safety, Rust offers a number of features to enhance developer productivity.

# Features

Rust's feature set is vast. The following is a subset I find especially interesting for cheminformatics:

- *Speed*. Benchmarks [usually](https://benchmarksgame-team.pages.debian.net/benchmarksgame/fastest/rust.html) put the performance of idiomatic Rust very close to, or better than the performance of idiomatic C or C++. The usual caveats apply.
- *Zero-cost abstractions*. Also known as the ["zero-overhead principle"](https://isocpp.org/wiki/faq/big-picture#zero-overhead-principle) in C++: "What you don’t use, you don’t pay for (in time or space) and further: What you do use, you couldn’t hand code any better." Signs of this design pervade Rust's syntax and structure.
- *Compile time memory management.* Rust's most unusual feature. The steep learning curve here causes a lot of grief for new users. However, the payoff is substantial.
- *No runtime or garbage collector*. One of the payoffs of compile time memory management is that binaries can be deployed without the considerable overhead of other languages.
- *Type safe - or not.* With one exception, it's impossible to compile a Rust program with undefined behavior. Unsafe mode relaxes this constraint, offering bare-knuckle, bare-metal excitement.
- *Thread safe.* The same features that ensure type safety also ensure thread safety. This flattens the concurrency learning curve.
- *Object-oriented programming.* Unlike languages such as Java and C++, Rust does not conflate type with class.
- *Functional programming.* Functions are first-class citizens, and closures are supported.
- *Static typing*. With only a couple of trivial exceptions, Rust will never perform an implicit type conversion.
- *Type inference.* In most cases, types within functions or methods can be omitted. The result is a language that feels much higher-level than it is.
- *Flexible deployment.* By leveraging LLVM, Rust can be complied just as easily to native binary or Web Assembly.
- *Python integration*. A few projects (such as [pyo3](https://github.com/PyO3/pyo3)) enable two-way bindings between Python and Rust.
- *Built-in package management and build system.* [Cargo](https://doc.rust-lang.org/cargo/) is the standard tool for Rust package management and build orchestration.

# State of the Art

As is the case with most modern languages, Rust's package manager, Cargo, pulls from a central repository (located at [crates.io](https://crates.io)). To get a feel for the number of packages targeting chemistry or cheminformatics, I searched for the text "chem." Excluding false positives (e.g., "scheme") and placeholder projects resulted in a single hit:

- [Chemfiles](https://crates.io/crates/chemfiles). A Rust wrapper wrapper for the [C++ library by the same name](http://chemfiles.org). It reads and writes computational chemistry files.

Google searches produced nothing noteworthy, other than articles in which [Peter Murray-Rust](https://en.wikipedia.org/wiki/Peter_Murray-Rust) is mentioned.

Searching GitHub for "rust chem" returned these results:

- [ChemGraphics](https://github.com/David-OConnor/chemgraphics). A graphics engine for "visualizing chemistry."
- [ChemSim](https://github.com/taktoa/chemsim). "An attempt at writing a Lattice Boltzmann CFD simulator in Rust."

Although some tentative steps have been taken in computational chemistry, no public Rust cheminformatics projects were found as of early 2020.

# Getting Started

There are two ways to get started with Rust. The first and easiest is to use the [Rust Playground](https://play.rust-lang.org). This Web interface lets you create and compile Rust code without installing the toolchain. It's a good option for quick experiments and to decide whether Rust is worth pursuing.

The second option is [rustup](https://rustup.rs), a script that installs the Rust compiler and everything needed to begin using it. If you use this option, I can recommend VS Code with the [Rust (rls) plugin](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust). The plugin adds live compiler error reporting, debugging support, and syntax highlighting.

Rust is not an easy language to learn. I found the concepts of ownership, borrowing, lifetimes, and types especially tough going. Whereas you might expect relative proficiency in a language like Python, JavaScript or Go within a week or so, proficiency in Rust will probably take longer.

Rust uses some very unusual concepts that just don't appear in mainstream languages. A good book will flatten your learning curve substantially. [*The Rust Programming Language*](https://doc.rust-lang.org/book/) is one option. This community-driven work is available for free online. However, if you're serious about learning Rust, I'd recommend also checking out [*Programming Rust*](http://shop.oreilly.com/product/0636920040385.do) (aka, "The Crab Book") from O'Reilly. It's one of the best programming books I've read.

# The Graph Trait

Graphs can be found throughout scientific and technical fields. In cheminformatics, graphs serve as the central abstraction. They underpin molecules, and several other object models. As such, most cheminformatics functionality flows through one or more kinds of specialized graph.

I recently described a [minimal graph API](/articles/2020/01/06/a-minimal-graph-api/). Weighing in at just eleven methods, this interface represents the irreducible core required from graph-like objects. I've arrived at this interface through years of experience writing cheminformatics libraries targeting a constrained environment, namely [the web browser](https://chemwriter.com).

How would this graph API be implemented in Rust?

Graphs can and do take many different forms in cheminformatics, so we wouldn't want to lock the `Graph` interface to any specific implementation. Doing so would severely limit our future options with respect to performance and features. Instead, we'd want to define `Graph` as a general interface. Rust supports exactly this use case with *traits*. A trait is similar to the concept of "interface" found in Java.

We can specify a `Graph` trait that satisfies the requirements of the minimum Graph API like so:

```rust
#[derive(Debug, PartialEq)]
pub enum Error {
    UnknownNode,
    DuplicateNode,
    DuplicateEdge
}

pub trait Graph<N, W> {
    /// Returns true if there are no nodes, or false otherwise.
    fn is_empty(&self) -> bool;

    /// Returns the number of nodes in this graph.
    fn order(&self) -> usize;

    /// Returns the number of edges in this graph.
    fn size(&self) -> usize;

    /// Iterates the nodes of this graph
    fn nodes(&self) -> Box<dyn Iterator<Item=&N> + '_>;

    /// Returns true if node is a member, or false otherwise. 
    fn has_node(&self, node: &N) -> bool;

    /// Iterates the neighbors of node.
    fn neighbors(
        &self, node: &N
    ) -> Result<Box<dyn Iterator<Item=&N> + '_>, Error>;
    
    /// Returns the number of neighbors connected to node.
    fn degree(&self, node: &N) -> Result<usize, Error>;

    /// Iterates the edges of this graph.
    fn edges(&self) -> Box<dyn Iterator<Item=(&N, &N, Option<&W>)> + '_>;

    /// Returns true if an edge exists between source and target.
    fn has_edge(&self, source: &N, target: &N) -> Result<bool, Error>;

    /// Returns the weight of the edge between source and target.
    fn weight(&self, source: &N, target: &N) -> Result<Option<&W>, Error>;
}
```

There's a lot of Rust syntax to take in here. For the moment, however, the most important thing to notice is that the `Graph` trait defines all eleven methods needed to work with graphs in the general sense, and cheminformatics in particular. As such, it offers a foundation for building a graph library in Rust, and from there a cheminformatics toolkit.

Also notice the use of type parameters (aka "generics"). This `Graph` interface places no constraints whatsoever on the node (`N`) or edge weight (`W`) types. This means that `Graph` can be used to not only define a `Molecule` interface, but also general graphs, molecular feature graphs, reaction graphs, and many other kinds of graphs. Application-agnostic graph functions can be written and tested once, then re-used with any object implementing the `Graph` trait.

You can confirm that the `Graph` trait compiles by plugging it into the [Rust Playground](https://play.rust-lang.org). Copy the full example code, and paste it into the window. Then click the "Build" button. You should see a message indicating success. You'll be notified that there is no `main` function. There isn't much to see because nothing will actually be executed.

A future article will introduce a library I've been working on that implements and uses the `Graph` trait defined here.

# Conclusion

Rust is a fast, safe language for systems development. In its current state, Rust offers the technical ingredients needed to eventually support a robust cheminformatics platform. A handful of tentative efforts using Rust in computational chemistry have appeared, but no project demonstrating the suitability of Rust for cheminformatics exists. This article takes a small step in that direction. Future articles will explore the idea further.
