---
title: Postgres Extensions in Rust
summary: Opening a new path to high-performance, domain-specific database applications.
twitter: true
summary-image: images/posts/20210825/summary.png
published: "2021-08-25T15:00:00Z"
---

[PostgreSQL](https://www.postgresql.org) (aka "Postgres") is a widely-used relational database system. One of the many features making it so popular is extensibility. Postgres [ships with several extensions](https://www.postgresql.org/docs/13/contrib.html), and others are [available from third parties](https://pgxn.org). Underpinning this large body of extended functionality is [a system](https://www.postgresql.org/docs/13/extend.html) for building and deploying extensions.

For flexibility and performance, Postgres supports extensions [written in C](https://www.postgresql.org/docs/13/xfunc-c.html). More recently, and very quietly, Rust has become a first-class language for extension development. This article offers a short introduction to building Postgres extensions in Rust. No previous experience with Rust or Postgres is needed.

# Prerequisites

Following the tutorial requires a Rust tool chain, which can be obtained as described at [Rustup](https://rustup.rs). Installation provides a Rust compiler and the [Cargo](https://doc.rust-lang.org/cargo/) package manager.

# Quickstart

The following short tutorial was tested on macOS Mojave and Rust 1.52.1.

Begin by installing the [pgx crate](https://github.com/zombodb/pgx), a complete suite of tools for building Postgres extensions in Rust.

```bash
cargo install cargo-pgx
cargo pgx init
```

The second command took about 30 minutes on my system. Packaged with the pgx crate are the last four major releases of Postgres, the source for each of which must be downloaded and compiled. These are installed into `~/.pgx`.

Create a new Postgres extension project as follows.

```bash
cargo pgx new my_extension
cd my_extension
```

pgx extends Cargo with a utility for initializing new projects, as done above. The new project so created contains a fully-functional Postgres extension, which can be compiled and tested.

```bash
cargo pgx run pg13
```

The second argument, `pg13` indicates that the extension will run on Postgres 13. Other options would be `pg12`, `pg11` and `pg10`.

After compilation (in my hands about 8 minutes), you'll be dropped into a `psql` shell. Test the extension by calling the `hello_my_extension` function.

```sql
SELECT hello_my_extension() AS test;
--         test         
-- ---------------------
--  Hello, my_extension
-- (1 row)
```

# The Demo Project

The business-end of the extension is contained in the file `src/lib.rs`. It weighs in at all of six lines of code.

```rust
use pgx::*;

pg_module_magic!();

#[pg_extern]
fn hello_my_extension() -> &'static str {
    "Hello, my_extension"
}
```

Everything from this starting point on is pure Rust. pgx takes care of writing all bindings and all of the infrastructure needed to support an extension.

Two lines of the example are noteworthy. The first invokes the `pg_module_magic` function-like macro. Its purpose is to add a signature to the compiled binary designating it as a Postgres extension. The second noteworthy line invokes the `pg_extern` [derive macro](https://doc.rust-lang.org/reference/procedural-macros.html). This line designates the function as one that the extension will make visible when installed, automatically applying all of the additional code to make that happen. Like all derive macros, `pg_extern` accepts arguments (e.g.,  `name`,`immutable`, `schema`, and `parallel_safe`). These flags don't appear to be documented anywhere in the pgx project, but can be found in the [examples directory](https://github.com/zombodb/pgx/tree/master/pgx-examples).

Additional examples are available in [this repo](https://github.com/zombodb/postgresconf).

# Why Extend Postgres?

The current capabilities of Postgres and its available extensions set a very high bar for functionality. Still, there are a number of situations in which a custom extension is the best option.

For example, Postgres's native data types are unlikely to adequately capture many kinds of domain-specific data such as phone numbers and other identifiers, not to mention scientific data types such as [molecules](/articles/2020/04/06/a-minimal-molecule-api/). The inability to manipulate such data types within Postgres forces data manipulation tasks out of the database and into less appropriate places. The end result is data manipulation logic appearing within an application layer, or some other layer where it becomes an integration and maintenance burden. A well-designed extension makes it easy to transport domain-specific concerns with the database.

Another reason to extend Postgres is to support more complex functionality. With a few exceptions, pgx makes it possible to do anything inside of Postgres that is possible within Rust. The vast and rapidly-growing collection of [Rust crates](https://crates.io) is open for use. Likewise, pgx supports most of the Postgres extension API. For example, pgx supports [the Server Programming Interface](https://www.postgresql.org/docs/9.4/spi.html) (SPI). This interface allows extensions to run SQL queries (procedures) inside of custom functions.

# Why Rust?

High performance Postgres extensions have for the most part been written in C. Given that tradition, why start writing them in Rust with pgx? Reasons include:

- **Streamlined workflow.** pgx writes all of the boilerplate code that would otherwise be needed to get an extension running in C.
- **Minimize exposure to Postgres internals.** As the example shows, it's now possible to write fully-functional extension without much knowledge of how Postgres works.
- **Maximize exposure to Postgres internals.** Although functionality is hidden behind some nice abstractions, these can be bypassed.
- **Access Postgres native types and functions.** Tight integration like this makes it possible to seamlessly blend Postgres with new functionality.
- **Memory safety.** This is Rust's best-known feature, and now it's possible to write Postgres extensions that make guarantees about memory safety.
- **Low-level performance, high-level feel.** Many developers who come to Rust for performance are surprised to find how usable the language is.

# More Information

The creator of pgx, [Eric Ridge](https://github.com/eeeebbbbrrrr), recently presented on pgx. The talk highlights some of the material covered here, and describes some other examples in depth.

<div class="videowrapper">
  <iframe src="https://www.youtube.com/embed/RORkgaURcS0" allowfullscreen></iframe>
</div>

# Other Projects

Several other projects enabling the creation Postgres extensions in Rust have been started. Although none appear to be as complete as pgx, they illustrate different approaches to Rust/Postgres integration:

- [pg-extend-rs](https://github.com/bluejekyll/pg-extend-rs). Also uses Cargo macros.
- [rpgffi](https://github.com/posix4e/rpgffi). The state of this project isn't clear from the documentation.
- [postgres-extension.rs](https://github.com/jeff-davis/postgres-extension.rs). No written documentation is available, but the author [presented](https://www.youtube.com/watch?v=7Ra5QO3Cxj4) the work and the [slide deck](https://www.pgcon.org/2019/schedule/attachments/532_RustTalk.pdf) offers some insights into why Rust should be considered for Postgres extensions.
- [Wasmer Postgres](https://github.com/wasmerio/wasmer-postgres). Last but not least, it may be possible to compile Rust to WebAssembly, then use the result as an extension. The [examples](https://github.com/wasmerio/wasmer-postgres/tree/master/examples) directory contains an example.

# Conclusion

The pgx crate offers a full suite of powerful tools for creating Postgres extensions in Rust. Custom functions, custom data types, and tight integration with Postgres are all supported. The author has created several examples, some of which were described in detail in a recent talk. Although other projects aim to provide similar functionality, I'm aware of no other project with the breadth or depth of support currently offered by pgx.