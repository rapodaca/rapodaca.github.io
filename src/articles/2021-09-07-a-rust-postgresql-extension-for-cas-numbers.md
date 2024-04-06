---
title: A Rust PostgreSQL Extension for CAS Numbers
summary: Making domain-specific types first-class citizens in one of the most popular database systems.
twitter: true
summary-image: images/posts/20210907/summary.png
published: "2021-09-07T15:00:00Z"
---

The [previous article](/articles/2021/08/25/postgres-extensions-in-rust/) in this series introduced a simple method for writing PostgreSQL extensions in Rust with the [pgx crate](https://github.com/zombodb/pgx). The example in that article, although a complete extension, only exposed a function. A more interesting extension would define a custom data type that worked correctly with indexes. This article describes such an extension.

# Compiling and Running the Extension

The extension, [cas_number](https://github.com/rapodaca/cas_number) is available on GitHub. Assuming [the dependencies](/articles/2021/08/25/postgres-extensions-in-rust/) are in place, compile as follows.

```bash
cargo pgx run pg13
```

pgs starts a Postgres client after compiling the extension. Install it in the usual way.

```sql
DROP EXTENSION IF EXISTS cas_number cascade; -- allows re-installation later
CREATE EXTENSION cas_number; -- create the extension
```

Having created the extension, we can work with CAS Numbers as if the type were native to Postgres. For example, we can create a table containing CAS Numbers like so.

```sql
CREATE TABLE cas_numbers (id int, cas_number casnumber);
-- CREATE TABLE
```

Here, the type `casnumber` was defined by the `cas_number` extension. Postgres respects the restrictions on this data type just like it would with `string` or `int`.

```sql
INSERT INTO cas_numbers (id, cas_number)
VALUES (1, '111-11-1');
-- ERROR:  invalid CAS Number
-- ...
```

The table can be populated with 100,000 random CAS Numbers.

```sql
INSERT INTO cas_numbers
SELECT generate_series(1, 100000) as id,
       random_cas_number();
-- INSERT 0 100000
```

Queries on tables this large without indexes often perform poorly, which can be easily verified here. The problem can be overcome with an index on the `cas_number` field.

```sql
create index cas_numbers_cas_number on cas_numbers (cas_number);
-- CREATE INDEX
```

Now Postgres will use the index rather than the default sequential scan strategy for many kinds of queries.

```sql
EXPLAIN ANALYZE
SELECT   id, cas_number
FROM     cas_numbers
WHERE    cas_number > '67-64-1'
ORDER BY cas_number
LIMIT    25;
--                                                                     QUERY PLAN                                                                     
-- ---------------------------------------------------------------------------------------------------------------------------------------------------
--  Limit  (cost=0.42..3.04 rows=25 width=36) (actual time=0.791..0.822 rows=25 loops=1)
--    ->  Index Scan using cas_numbers_cas_number on cas_numbers  (cost=0.42..3499.74 rows=33333 width=36) (actual time=0.790..0.817 rows=25 loops=1)
--          Index Cond: (cas_number > '67-64-1'::casnumber)
--  Planning Time: 0.356 ms
--  Execution Time: 0.900 ms
-- (5 rows)
```

# CAS Numbers and Their Validation

The extension defines a custom data type, `casnumber`, that models a [Chemical Abstracts Service Registry Number](https://www.cas.org/cas-data/cas-registry)&reg; (aka "CAS Number"). A CAS Number is a unique identifier for chemical substances managed by the [American Chemical Society](https://www.acs.org). CAS Numbers look vaguely like phone numbers, but work quite differently.

A CAS number is a string composed of three groups of digit characters (`0`-`9`) separated by the dash character (`-`). For example, the CAS Number for water is `7732-18-5`. The leftmost group of characters, which I call the "base," contains between two and seven digits. A leading zero is not allowed, but there are no other restrictions. The middle group contains two digits, which I call the "suffix." The rightmost group contains a single "check" digit.

The following regular expression can be used to validate CAS Numbers:

```console
^[1-9]\d{1,6}-\d{2}-\d$
```

The purpose of the check digit is to prevent data entry errors. It is computed as follows. Read all digits, excluding the check digit, sequentially from right-to-left. Assign the first digit an index `i` of 1, the next an index `i` 2, and so on. A checksum `c` is computed by the summation:

```asciimath
c = sum_(i=1)^n i*V_i
```

where `i` is the one-based, right-to-left index of the digit and ~V_i~ is the value of the digit at index `i`.

The check digit is then computed as the modulo-10 remainder of `c`.

For example, [paclitaxel](https://en.wikipedia.org/wiki/Paclitaxel) ("Taxol") has the CAS Number `33069-62-4`. The check digit is 4, which can be computed as:

```console
(2*1 + 6*2 + 9*3 + 6*4 + 0*5 + 3*6 + 3*7) % 10 = 4
```

The Postgres extension performs this check during the translation of `string` instances.

# Overview of the Extension

The extension itself is comprised of just two Rust source files: `lib.rs` and `cas_number.rs`. The former file just brings the latter into scope and invokes the macro responsible for embedding the Postgres extension signature.

```rust
// lib.rs
use pgx::*;

mod cas_number;

pg_module_magic!();
```

The file `cas_number.rs` defines the custom Postgres type and an exported helper function. The type is just an annotated Rust `struct` following the [newtype](https://doc.rust-lang.org/rust-by-example/generics/new_types.html) pattern:

```rust
// ... macro invocations
pub struct CasNumber(String);
```

`CasNumber` contains a private field of type `String`. This pattern makes it possible to apply various macros and function definitions to `CasNumber`, including those required by pgx. pgx automatically translates the Rust symbol `CasNumber` to `casnumber` in Postgres sessions.

# CAS Number Validation in Rust

The business end of the extension is the `validate` function, which returns `true` given a valid CAS Number `str` encoding or `false` otherwise.

```rust
// cas_number.rs
// ...
fn validate(id: &str) -> bool {
    let re = Regex::new(r"^([1-9])(\d{1,6})-(\d{2})-(\d)$").unwrap();

    let caps = match re.captures(id) {
        Some(caps) => caps,
        None => return false,
    };

    let digits = format!(
        "{}{}{}",
        caps.get(1).unwrap().as_str(),
        caps.get(2).unwrap().as_str(),
        caps.get(3).unwrap().as_str()
    );

    let mut checksum = 0;

    for (n, digit) in digits.chars().rev().enumerate() {
        checksum += (n + 1) as u32 * digit.to_digit(10).unwrap();
    }

    checksum % 10 == caps.get(4).unwrap().as_str().parse::<u32>().unwrap()
}
```

# Generating Random CAS Numbers in Rust

Also included with the extension is the `random_cas_number` function, which generates valid `CasNumber` instances. It can be used to build large tables containing columns of type `casnumber` for mockups and performance testing.

```rust
// cas_number.rs
// ...
fn random_cas_number() -> CasNumber {
    let base = rand::thread_rng().gen_range(4, 9);
    let mut digits = Vec::new();
    let mut checksum: u32 = 0;

    for i in 0..(base + 2) {
        let digit = random_digit(i == 0);
        checksum += (base as u32 + 2 - i as u32) * digit as u32;

        digits.push(digit)
    }

    let mut string = String::new();

    for (i, digit) in digits.into_iter().enumerate() {
        if i == base as usize {
            string.push_str("-");
        }

        string.push_str(&digit.to_string())
    }

    CasNumber(format!("{}-{}", string, checksum % 10))
}

fn random_digit(exclude_zero: bool) -> u8 {
    if exclude_zero {
        rand::thread_rng().gen_range(1, 9)
    } else {
        rand::thread_rng().gen_range(0, 9)
    }
}
```

# Why?

The utility of Postgres extensions like the one described here may not be apparent at first (or second) glance. The primary purpose is to enable Postgres to ensure that custom data types are properly validated before use - just like any other native type. A secondary purpose is to offload domain-specific data management tasks to Postgres that would otherwise take place elsewhere, such as in an application layer. In many situations, it makes sense to keep data manipulation and validation logic within the database itself and within transactional boundaries.

This isn't necessarily an either-or proposition. For example, form validation in Web applications typically occurs in three different places: on the form itself using HTML controls; in the server application layer; and in the database. Each stage of validation serves a different purpose. Postgres extensions such as the one described here make it possible to extend boundary checking patterns commonly used for primitives such as decimals and integers to custom data types like CAS Numbers.

Of course Postgres can be (and often is) used without an application layer at all. In these cases, Postgres is responsible for all data validation. Extensions like the one described here make it possible to use Postgres as if it had native support for domain-specific data types.

Either way, writing Postgres extensions in Rust using pgx brings important benefits. As you can see, most of the work of generating the extension is done by pgx. That leaves the developer with only the task of writing the domain-specific code to control the extension. Given that the language is Rust, all of its features such as high performance, high-level ergonomics, the Cargo package manager, and type safety are at your fingertips. 

# Other Work

The extensions described here is based on a demo extension for phone numbers contained in [this repository](https://github.com/zombodb/postgresconf). In addition to replacing phone numbers for CAS Numbers, my example simplifies the project layout, localizing plugin and validation logic in one file and eliminating other functionality to highlight extension points.

# Conclusion

Extensions make it possible to work with domain-specific data types as if they were native to Postgres. This article describes a non-trivial Postgres extension with both a custom function and a custom data type that works well with indexes. The [project repository](https://github.com/rapodaca/cas_number) can serve as a template for a variety of high-performance extensions supporting domain-specific types and functions.
