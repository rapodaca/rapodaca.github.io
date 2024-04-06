---
title: Returning Rust Iterators
summary: "Some simple tricks go a long way when dealing with iterators as return values."
twitter: true
summary-image: images/posts/20200622/summary.png
published: "2020-06-22T17:00:00Z"
---

Rust iterators are fundamental to the language and can be found in a variety of contexts. Consuming iterators returned from functions in the standard library and crates is straightforward. Eventually, however, you'll want to return iterators from your own functions. This article discusses the major approaches to this surprisingly complex problem. It's based in part on answers to [this question](https://stackoverflow.com/questions/27535289/what-is-the-correct-way-to-return-an-iterator-or-any-other-trait).

# Returning an Iterator

The simplest scenario is one in which an iterator is obtained and returned without further modification. Consider a container that owns a `Vec<u8>`. We'd like the container to implement a method `values` that returns an iterator over the members of the list.

```rust
struct Container {
    items: Vec<u8>
}

impl Container {
    // TODO: add a #values method that returns an iterator over items
}
```

`Vec` is perfectly capable of returning an iterator, so it seems logical to use it. But what's the type? [The documentation](https://doc.rust-lang.org/std/vec/struct.Vec.html#method.iter) informs us that it's [`std::slice::Iter`](https://doc.rust-lang.org/std/slice/struct.Iter.html).

Here's an even easier way: ask the compiler. Begin by writing a method that declares the unit primitive (`()`) as the return type while actually returning the iterator.

```rust
struct Container {
    items: Vec<u8>
}

impl Container {
  fn values(&self) -> () {
      // Use the error to find the return type that should be declared
      self.items.iter()
  }
}
```

The compiler produces an error. VS Code running a Rust plugin displays it in real time. Alternatively the compiler prints the error when the build system runs.

<figure>
  <img alt="Ask the Compiler" src="/images/posts/20200622/ask-the-compiler.png">
  <figcaption>
    <strong>Ask the Compiler.</strong> The the return type of a method isn't clear, leave it out and the compiler will tell you.
  </figcaption>
</figure>

The type is contained within the error message, from which it can be copied. Replace the dummy unit primitive with the value on the clipboard. In this case, the type can be used as-is. Situations with declared lifetimes will, however, require some adjustments.

```rust
pub struct Container {
    items: Vec<u8>
}

impl Container {
  fn values(&self) -> std::slice::Iter<'_, u8> {
      self.items.iter()
  }
}
```

# Intercepting an Iterator

Things get more complicated if more processing is needed. Consider a container with an `items` list, but this time holding a struct. Our goal is to iterate, not the structs, but borrowed references to the values they contain.

```rust
pub struct Wrapper {
    value: u8
}

pub struct Container {
    items: Vec<Wrapper>
}

impl Container {
    // TODO: add a method that iterates over Wrapper.value
}
```

The `items` list can produce a perfectly suitable iterator for `Wrapper` values, but the goal here is to iterate the `u8` value each one holds. How can we expose them?

# Mapping an Iterator

It's tempting to bring out [`Iterator#map`](https://doc.rust-lang.org/std/iter/trait.Iterator.html#method.map). This method works like JavaScript's `Array#map` method, allowing a stream of input values to be transformed 1:1 into a stream of output values. Unlike JavaScript's `Array#map`, Rust's `Iterator#map` applies to an iterator and as such is more flexible.

The first task is to obtain the return value by declaring a unit return type.

```rust
struct Wrapper {
    value: u8
}

struct Container {
    items: Vec<Wrapper>
}

impl Container {
    // COMPILER ERROR
    fn values(&self) -> () {
        self.items.iter().map(|wrapper| wrapper.value)
    }
}
```

As expected, the compiler issues a warning. Unexpectedly, the required return type looks odd: `std::iter::Map<std::slice::Iter<'_, Wrapper>, [closure@src/lib.rs:11:31: 11:54]>` (your error will vary depending on the exact source file). I haven't found much documentation on exactly what's going on. Even so, it [appears](https://stackoverflow.com/a/30641982) to be impossible to use this technique directly. Fortunately, there's a workaround.


# `impl Trait`

All of Rust's iterators implement the `Iterator` trait. Instead of declaring a concrete iterator type, can a trait be declared as the type of a return value? The answer is "yes," but with some caveats. The code below does the job.

```rust
struct Wrapper {
    value: u8
}

struct Container {
    items: Vec<Wrapper>
}

impl Container {
    fn values(&self) -> impl Iterator<Item=u8> + '_ {
        self.items.iter().map(|wrapper| wrapper.value)
    }
}
```

The keyword [`impl`](https://doc.rust-lang.org/beta/std/keyword.impl.html) signals that the return type is a trait. Misleadingly, omission of the `impl` keyword yields the error: "trait objects without an explicit `dyn` are deprecated." The fix here is to use `impl`, not `dyn`. We'll see when to apply the latter keyword shortly. Omitting `dyn` also produces a second error: "doesn't have a size known at compile-time." The error occurs because by default the compiler expects a return value to be allocated on the stack, which in turn requires a size known at compile time. Using the `impl` keyword allows the compiler to relax this restriction.

The reasons behind the lifetime notation `+ '_` are interesting, but not relevant here. For details, see: *[Rust Lifetimes and Iterators](https://blog.katona.me/2019/12/29/Rust-Lifetimes-and-Iterators/)*.

[The Rust Book](https://doc.rust-lang.org/beta/book/ch10-02-traits.html#returning-types-that-implement-traits) has this to say on what `impl Trait` actually does:

> The ability to return a type that is only specified by the trait it implements is especially useful in the context of closures and iterators ... [which] create types that only the compiler knows or types that are very long to specify. The impl Trait syntax lets you concisely specify that a function returns some type that implements the Iterator trait without needing to write out a very long type.

The book goes on to note that `impl Trait` can only be used to return a single type. In other words, think of the construct as a convenient shorthand for an otherwise cumbersome or inaccessible type.

A more important restriction in my experience is that `impl Trait` can't be returned from a method defined on a trait. Attempting to do so will yield the error "`impl Trait` not allowed outside of function and inherent method return types."

```rust
trait Foo {
    // ERROR: `impl Trait` not allowed outside of function and inherent
    // method return types
    fn foo(&self) -> impl Iterator<Item=u8> + '_;
}
```

# Associated Type

It's often useful to bundle behavior into traits. But as we've seen, returning iterators from traits with `impl Type` doesn't work. Fortunately, Rust offers a workaround in the form of *[associated types](https://doc.rust-lang.org/stable/rust-by-example/generics/assoc_items/types.html)*.

An associated type uses the keyword `type` within the body of a trait. Associated types can be identified through the notation `<Name=type>`. You may have noticed that the `Iterator` trait uses an associated type called `Item`.

We can apply associated types to the problem of returning an iterator from a method on a trait.

```rust
trait Container<'a> {
    type ItemIterator: Iterator<Item=&'a u8>;

    fn items(&'a self) -> Self::ItemIterator;
}
```

The `Container` method `items` requires a return type of `ItemIterator`. Concrete types can choose any `Iterator` implementation, provided that it produces a sequence of `u8` references. These criteria can be met with the following implementation:

```rust
struct VecContainer {
    items: Vec<u8>
}

impl<'a> Container<'a> for VecContainer {
    type ItemIterator = std::slice::Iter<'a, u8>;

    fn items(&'a self) -> Self::ItemIterator {
        self.items.iter()
    }
}
```

Unlike previous examples, lifetimes require some attention here.

Unfortunately, associated types won't do much good when an implementation tries to return a mapped iterator. The same old problem from before rears its head, namely that we can't specify the type of an iterator involving closures.

```rust
struct VecContainer {
    items: Vec<u8>
}

impl<'a> Container<'a> for VecContainer {
    type ItemIterator = ();

    fn items(&'a self) -> Self::ItemIterator {
        // ERROR: expected std::iter::Map<std::slice::Iter<'_, u8>,
        // [closure@src/lib.rs:15:31: 15:47]
        self.items.iter().map(|item| *item + 1)
    }
}
```

# Trait Objects

One way to break out of the restrictions imposed on return types from trait methods is a *[trait object](https://tratt.net/laurie/blog/entries/a_quick_look_at_trait_objects_in_rust.html)*. According to the [Rust Book](https://doc.rust-lang.org/reference/types/trait-object.html), a trait object "is an opaque value of another type that implements a set of traits." A trait object can be identified through the use of the construct `dyn Trait`.

We can solve the problem of mapped iterators being returned from trait methods as follows.

```rust
struct Wrapper {
    value: u8
}

trait Container {
    fn items(&self) -> Box<dyn Iterator<Item=&u8> + '_>;
}

struct VecContainer {
    items: Vec<Wrapper>
}

impl Container for VecContainer {
    fn items(&self) -> Box<dyn Iterator<Item=&u8> + '_> {
        Box::new(self.items.iter().map(|wrapper| &wrapper.value))
    }
}
```

We previously saw how a type with an unknown size can't be returned from a method. Trait objects are dynamically sized, raising the question of why the above code compiles. The answer is that the return value is boxed. By default, Rust values are allocated on the stack. `Box` allocates its contained value on the heap instead, retaining a fixed-size pointer. As a result, a `Box` containing any variable-sized type can be returned from any method or function.

What are the performance tradeoffs of such an approach? Unfortunately, the answer isn't clear. I've found more questions asked on this topic than actionable answers. For example:

- [What are the actual runtime performance costs of dynamic dispatch?](https://stackoverflow.com/questions/28621980/)
- [Performance implications of `Box<Trait>` vs `enum` delegation](https://users.rust-lang.org/t/performance-implications-of-box-trait-vs-enum-delegation/11957)
- [trait objects: 22x slower than static dispatch?](https://www.reddit.com/r/rust/comments/74llky/trait_objects_22x_slower_than_static_dispatch/)

Aside from performance, two points about trait objects as return values are clear:

1. They're rare in the standard library API.
2. They're uncommon in Rust crate APIs.

The more used the function call, the less appetizing `Iterator` trait objects look purely on a design basis. Should performance prove to become a bottleneck, a costly round of changes could result.

# Simple Iterator Delegation

Fortunately, we can have our cake and eat it, too. We can stay on the happy path of static dispatch and stack allocation while at the same time returning iterators that perform inline processing.

We begin with an example using unproductive `Iterator` delegation.

```rust
struct Container {
    items: Vec<u8>
}

impl Container {
  fn values(&self) -> Repeater {
      Repeater { iter: self.items.iter() }
  }
}

struct Repeater<'a> {
    iter: std::slice::Iter<'a, u8>
}

impl<'a> Iterator for Repeater<'a> {
    type Item = &'a u8;

    fn next(&mut self) -> Option<Self::Item> {
        self.iter.next()
    }
}
```

In the above example, `values` returns the custom `Iterator` implementation `Repeater`. But rather than starting from scratch, that implementation delegates to the private field `iter`. Whatever it iterates is returned verbatim.

# Complex Iterator Delegation

Delegation makes it possible to construct sophisticated iterators from simple primitives. Consider once again the problem of iterating over one or more fields borrowed from the members of a `Vec`. To solve it, `Repeater` can be tweaked to return a borrowed field from a wrapper struct.

```rust
struct Wrapper {
    value: u8
}

struct Container {
    items: Vec<Wrapper>
}

impl Container {
    fn values(&self) -> Inspector {
        Inspector { iter: self.items.iter() }
    }
}

struct Inspector<'a> {
    iter: std::slice::Iter<'a, Wrapper>
}

impl<'a> Iterator for Inspector<'a> {
    type Item = &'a u8;

    fn next(&mut self) -> Option<Self::Item> {
        self.iter.next().map(|wrapper| &wrapper.value)
    }
}
```

`Inspector` uses the [`Option#map`](https://doc.rust-lang.org/std/option/enum.Option.html#method.map) method together with a closure to iterate, not `Wrapper`s, but borrowed references to the `value` contained within them.

To avoid leaking private data, if `Container#values` is public then `InspectingIterator` must also be public. This, coupled with the need to implement custom iterators may make the approach unsuitable in some situations. At the same time, iterator delegation is the only solution in some cases such as returning an inaccessible iterator from a trait method without boxing.

Several examples combining `Iterator` delegation with inspection can be found in [Gamma](https://crates.io/crates/gamma), a crate providing primitives for working with graphs. In particular, see [the implementors of `Graph`](https://docs.rs/gamma/0.5.0/gamma/graph/trait.Graph.html#implementors).

# Conclusion

Iterators are ubiquitous in Rust and extremely versatile. Many problems can be solved by simply returning an iterator produced elsewhere. But sometimes getting this to work will require more. The approaches presented here cover most commonly-encountered cases.