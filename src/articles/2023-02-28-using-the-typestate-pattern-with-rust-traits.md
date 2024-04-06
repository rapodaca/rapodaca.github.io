---
title: Using the Typestate Pattern with Rust Traits
id: df-0032
enables:
  - df-0030
summary: "Improving code quality by moving bugs from run time to compile time."
twitter: true
summary-image: images/posts/20230228/summary.png
published: "2023-02-28T15:30:00Z"
---

Changes to the state of a value can set the stage for later errors. Sometimes these errors occur during subsequent method calls. Other times, the method call itself is the source of the error. Good type systems can make it possible to move these kinds of state bugs from run time to compile time. Indeed, the [typestate pattern](https://docs.rust-embedded.org/book/static-guarantees/typestate-programming.html) is often cited a solution, especially for Rust. Unfortunately, most discussions of the typestate pattern assume concrete types. But what if typestate needs to extend over a *family* of types? Traits are an obvious choice, but this more complex variation is rarely documented. This article illustrates the use of trait-based typestates in Rust through a simple example.

# The Problem: Builder

[One of my projects](/articles/2022/11/09/reading-ctfiles-with-ctcore/) uses a `Builder` to construct values through sequential one-character instruction pushes. The starting state of `Builder` and the character being pushed determine the transition. When the Done state is reached, the product is returned. Transition to Done can occur either as a result of a push or client-induced finish.  The states and their relationships are captured in the following state diagram.

<figure>
  <img alt="" src="/images/posts/20230228/builder-state-diagram.png">
  <figcaption>
    <strong>Builder State Diagram.</strong> A Builder can exist in one of two states: Building and Done. It should not be possible to continue using the Builder after the Builder is done.
  </figcaption>
</figure>

# First Pass with Concrete Types

A simple approach would be to model `Builder` on a struct with two mutable methods, `push` and `finish`. The former would accept a `char` argument, causing mutation of the product under construction; the latter would return the completed product without mutation. The optional return type of `push` allows `Builder` to finish after reaching some pre-determined internal state. Similarly, clients can request the product, if available, by calling `finish`.

```rust
struct Builder;
struct Foo;

impl Builder {
    pub fn push(&mut self, char: char) -> Option<Foo> {
        // 💥 Runtime error if this is called after error
        todo!()
    }

    pub fn finish(&mut self) -> Option<Foo>{
        // 💥 Should further pushes be allowed after an error or a previous
        // finish?
        todo!()
    }
}
```

Although simple, this approach raises some hard questions:

- Should calls to `push` after an erroneous previous push be allowed, and if so which errors qualify?
- Should calling `finish` after an erroneous `push` be allowed?
- Should calling `finish` after a previous call to `finish` be allowed?

We could make the answers to these questions part of the documentation for the crate. Unfortunately, this would fail if clients didn't read the documentation, or changes to the code rendered the documentation incorrect.

A sturdier approach would eliminate the possibility of misusing `Builder` altogether. For example, the mutable borrow in `finish` could be replaced with a move. The compiler now prevents any use of `Builder`, mutable or otherwise, after `finish` is called. Entering the "finished" state destroys the `Builder`.

```rust
struct Builder;
struct Foo;

impl Builder {
    // None indicates that the 
    pub fn push(&mut self, char: char) -> Option<Foo> {
        // 💥 this can still be called after a previous error
        todo!()
    }

    pub fn finish(self) -> Option<Foo> {
        // 👍 Typestate: use after finish is no longer possible
        todo!()
    }
}
```

But this leaves the headache of dealing with calls to `push` after an error. This problem too can be eliminated by replacing the mutable borrow with a move. But to support that, we need to replace the return type of `push`. If `Builder` is in fact not done, clients need a way to keep pushing. That can be accomplished with a return type of `Target`. Builders that are done return the `Target::Product` variant, or the `Target::Builder` variant otherwise.

```rust
struct Builder;
struct Foo;

impl Builder {
    pub fn push(self, char: char) -> Target {
        // 👍 Typestate: push can never be called twice.
        todo!()
    }

    pub fn finish(self) -> Option<Foo> {
        // 👍 Typestate: use after finish is no longer possible
        todo!()
    }
}

enum Target {
    Builder(Builder),
    Product(Foo)
}
```

This small bit of infrastructure enables something very useful: the clean separation between the construction of a product and the management of the character stream that directs it. No matter how complex the process of managing the flow of characters becomes, `Builder` remains completely decoupled from it.

```rust
enum Error {
    NotDone
}

fn build(target: Target) -> Result<Foo, Error> {
    // in production, char comes from an iterator
    let char = Some('#');

    match target {
        Target::Builder(builder) => {
            if let Some(char) = char {
                build(builder.push(char))
            } else {
                Ok(builder.finish().ok_or(Error::NotDone)?)
            }
        }
        Target::Product(product) => Ok(product)
    }
}
``` 

This design is certainly viable, and this is where most discussions of the typestate pattern end. But what happens if we want `build` to control more than just the production of values of type `Foo`?

# The Builder Trait

One way to generalize the construction of products would be to replace the `Builder` struct with a `Builder` trait.

```rust
trait Builder {
    fn push(self, char: char) -> Target;

    fn finish(self) -> Option<Foo>;
}
```

Unfortunately, making this change is not going to be simple. We need a way to deal with the problem that values associated with enum variants must have concrete types. Bare traits are not allowed. Attempting to associate an enum variant with a bare trait yields the compiler error: "trait objects must include the `dyn` keyword rustc([E0782](https://doc.rust-lang.org/error_codes/E0782.html))".

```rust
enum Target {
    // 💥 dyn keyword, but how?
    Builder(Builder),
    Product(Foo)
}
```

This error and the proposed solution, "add `dyn` keyword before this trait", are nevertheless quite misleading. Just prefixing `Builder` with the `dyn` keyword won't work. There is one and only one way to take the compiler's advice, and that is to replace `Builder` with `Box<dyn Builder>`.

# Boxed Trait Object

The following example shows how to associate a ["boxed trait object"](https://bennett.dev/dont-use-boxed-trait-objects-for-struct-internals/) with an enum variant.

```rust
  struct Foo;

trait Builder {
    fn push(self, char: char) -> Target;

    fn finish(self) -> Option<Foo>;
}

enum Target {
    // 💥 This won't ultimately work.
    Builder(Box<dyn Builder>),
    Product(Foo)
}

```

But this solution is doomed to failure. Although compilation finishes without error, it's no longer possible to use `Target` as before in the `build` function.

```rust
struct Foo;

trait Builder {
    fn push(self, char: char) -> Target;
}

enum Target {
    Builder(Box<dyn Builder>),
    Product(Foo)
}

enum Error {
    NotDone
}

fn build(target: Target) -> Result<Foo, Error> {
    // in production, this comes from an iterator
    let char = Some('#');

    match target {
        Target::Builder(builder) => {
            if let Some(char) = char {
                build(builder.push(char))
            } else {
                // 💥 method 'done' not found on Box<dyn Builder>
                Ok(builder.done().ok_or(Error::NotDone)?)
            }
        }
        Target::Product(product) => Ok(product)
    }
}
```

The `push` method no longer works because it's not defined on `Box<dyn Builder>`. We could satisfy the compiler by adding an implementation of `Builder` to `Box<dyn Builder>`, but actually implementing the resulting method is impossible. Although methods can be called on boxed trait objects (the `self` parameter here), it's impossible to access any attributes from them. 


```rust
impl Builder for Box<dyn Builder> {
    fn push(self, char: char) -> Target {
        // 💥 How to implement this?
        todo!()
    }
}
```

The problems don't end there. Once boxed, a value can never be unboxed. Even if we could somehow cobble together a way to give `push` the data it needs, moving `self` as required by the `build` function is impossible.

# Trait Type Parameter

Boxed trait objects are clearly a dead end. Fortunately, Rust offers another way to associate a trait with an enum variant: type parameters. The following example shows how.

```rust
trait Builder {
    fn push(self, char: char) -> Target<Builder>;

    fn finish(self) -> Foo
}

enum Target<B: Builder> {
    Builder(B),
    Product(Foo)
}
```

Adding the type parameter `B` makes it possible to use `Target` with `build` to get very close to a workable solution.

```rust
struct Foo;

enum Error {
    NotDone
}

fn build<B: Builder>(target: Target<B>) -> Result<Foo, Error> {
    // in production, this comes from an iterator
    let char = Some('#');

    match target {
        Target::Builder(builder) => {
            if let Some(char) = char {
                build(builder.push(char))
            } else {
                Ok(builder.done().ok_or(Error::NotDone)?)
            }
        }
        Target::Product(product) => Ok(product)
    }
}
```

Although the above listing compiles and will dutifully produce values of type `Foo` given the right implementations, `build` can't produce values of any other type. What's needed is a way to abstract the kind of product that `Builder` returns.

# Abstracting Product Type

Type parameters can also be used with traits. The following listing illustrates how to do this with `Builder` to abstract the type of product constructed.

```rust
struct FooBuilder;

trait Builder<P>: Sized {
    fn push(self, char: char) -> Target<P, Self>;

    fn done(self) -> Option<P>;
}

enum Target<T, B: Builder<T>> {
    Builder(B),
    Product(T)
}

enum Error {
    NotDone
}

struct Product;

fn build<P, B: Builder<P>>(target: Target<P, B>) -> Result<P, Error> {
    // in production, this comes from an iterator
    let char = Some('#');

    match target {
        Target::Builder(builder) => {
            if let Some(char) = char {
                build(builder.push(char))
            } else {
                Ok(builder.done().ok_or(Error::NotDone)?)
            }
        }
        Target::Product(product) => Ok(product)
    }
}
```

To get this solution to work, `Builder` itself now needs a type parameter. And because that parameter refers to `Self`, `Builder` must be bound to the `Sized` trait. [The documentation](https://doc.rust-lang.org/std/marker/trait.Sized.html) notes that:

> All type parameters have an implicit bound of Sized. The special syntax ?Sized can be used to remove this bound if it’s not appropriate.
> 
> The one exception is the implicit Self type of a trait. A trait does not have an implicit Sized bound as this is incompatible with trait objects where, by definition, the trait needs to work with all possible implementors, and thus could be any size.

One consequence of binding to `Sized` is that borrowing is no longer possible. But that's of no concern here because the point was to prevent borrowing in the first place.

The new `Builder<P>` trait works until we try to actually *implement* `Builder`:

```rust
struct FooBuilder;

trait Builder<P>: Sized {
    fn push(self, char: char) -> Target<P, Self>;

    fn done(self) -> Option<P>;
}

enum Target<T, B: Builder<T>> {
    Builder(B),
    Product(T)
}

enum Error {
    NotDone
}

impl<P> Builder<P> for FooBuilder {
    fn push(self, char: char) -> Target<P, Self> {
        todo!()
    }

    fn done(self) -> Option<P> {
        // 💥 How to implement this method?
        // We need to return a type parameter, not a value!
        todo!()
    }
}

fn build<P, B: Builder<P>>(target: Target<P, B>) -> Result<P, Error> {
    // in production, this comes from an iterator
    let char = Some('#');

    match target {
        Target::Builder(builder) => {
            if let Some(char) = char {
                build(builder.push(char))
            } else {
                Ok(builder.done().ok_or(Error::NotDone)?)
            }
        }
        Target::Product(product) => Ok(product)
    }
}
```

We solve this problem by replacing the type parameter `P`, with the actual type being built:

```rust
trait Builder<P>: Sized {
    fn push(self, char: char) -> Target<P, Self>;

    fn done(self) -> Option<P>;
}

enum Target<T, B: Builder<T>> {
    Builder(B),
    Product(T)
}

enum Error {
    NotDone
}

struct Foo;
struct Bar;

struct FooBuilder;
struct BarBuilder;

impl Builder<Foo> for FooBuilder {
    fn push(self, char: char) -> Target<Foo, Self> {
        Target::Product(Foo)
    }

    fn done(self) -> Option<Foo> {
        Some(Foo)
    }
}

impl Builder<Bar> for BarBuilder {
    fn push(self, char: char) -> Target<Bar, Self> {
        Target::Product(Bar)
    }

    fn done(self) -> Option<Bar> {
        Some(Bar)
    }
}

fn test() {
    let foo_builder = FooBuilder;
    let foo = build(Target::Builder(foo_builder));
    let bar_builder = BarBuilder;
    let bar = build(Target::Builder(bar_builder));
}

fn build<P, B: Builder<P>>(target: Target<P, B>) -> Result<P, Error> {
    // in production, this comes from an iterator
    let char = Some('#');

    match target {
        Target::Builder(builder) => {
            if let Some(char) = char {
                build(builder.push(char))
            } else {
                Ok(builder.done().ok_or(Error::NotDone)?)
            }
        }
        Target::Product(product) => Ok(product)
    }
}
```

# More Typestate?

How much further should the idea of typestate be taken with this example? It's possible to call `finish` when a `Builder` isn't actually finished, ultimately yielding a runtime error. Maybe this can be avoided by splitting the `Builder` trait further:

```rust
trait Push<T, B: Branch<T, Self>>: Sized {
    fn push(self, char: char) -> Target<T, Self, B>;
}

trait Branch<T, P: Push<T, Self>>: Sized {
    fn push(self, char: char) -> Target<T, P, Self>;

    fn finish(self) -> T;
}

enum Target<T, P: Push<T, B>, B: Branch<T, P>> {
    Push(P),
    Branch(B),
    Product(T)
}
```

This two-trait approach would make it impossible to call `finish` until the previous state permits it by retuning a `Target::Branch` variant. This seems safer, but at what cost? The design becomes more complex, with two traits rather than one. The type parameter signature is also busier. But the main reason to take this no further is that doing so does not solve the problem of runtime errors. A client expecting a branch state but receiving a push state will still generate a runtime error. Vanishing returns suggest we're done &mdash; for now at least.

# Conclusion

The typestate pattern is a powerful tool that is especially well-suited to Rust's type system. Applying the pattern to struct-based states is relatively straightforward, but limited. Defining states as traits allows more flexibility, but at the cost of diverging from most documentation on the topic. This article showed one specific approach to using the typestate pattern with traits, overcoming some pitfalls along the way.
