---
title: Reading Large SDfiles in Rust
summary: "Learn the basics of Rust file I/O and Iterators while solving a common cheminformatics problem."
twitter: true
summary-image: images/posts/20200720/summary.jpg
published: "2020-07-22T19:00:00Z"
---

Chemical data analysis pipelines often start with reading [SDfiles](/articles/2020/07/13/the-sdfile-format/), the field's de facto standard for information exchange. Given the growing size of many chemistry data sets, efficient methods for reading SDfiles have become ever more important. As part of a continuing series on [Rust for Cheminformatics](/articles/2020/01/20/cheminformatics-in-rust/), this article takes a hands-on first look at reading arbitrarily large SDfiles in Rust. A recent article by Noel O'Boyle on [reading large SDfiles in Python](https://baoilleach.blogspot.com/2020/05/python-patterns-for-processing-large.html) offers a good comparison.

# Data Set

SDfiles are not hard to find, but large SDfile might be. If you're drawing a blank on where to find SDfiles in the gigabyte range, consider [PubChem](https://pubchem.ncbi.nlm.nih.gov/). Specifically, the [bulk download FTP server](ftp://ftp.ncbi.nlm.nih.gov/pubchem/Compound/CURRENT-Full/SDF/) offers a wide selection of large SDfiles. This tutorial uses the [first Compound file](ftp://ftp.ncbi.nlm.nih.gov/pubchem/Compound/CURRENT-Full/SDF/Compound_000000001_000500000.sdf.gz). For now, unzip it.

# Hello, SDfile: Counting Lines

Before diving into record parsing, let's start with the simpler case of counting lines. Doing so offers insights into some important points.

If you haven't done so already, [install Rust](https://rustup.rs). Next, create a blank project using Cargo, Rust's build system:

```bash
cargo new sdread && cd sdread
```

Your project will contain a source file at `src/main.rs`. Replace its contents with the following:

```rust
// src/main.rs
use std::io::prelude::*;
use std::io::BufReader;
use std::fs::File;

fn main() -> std::io::Result<()> {
    // replace this with the full path to your SDfile
    let name = "/Users/rich/Downloads/Compound_000000001_000500000.sdf";
    let file = File::open(name)?;
    let reader = BufReader::new(file);
    let count = reader.lines().fold(0, |sum, _| sum + 1);

    println!("line count: {}", count);

    Ok(())
}
```

Rust programs start execution at the `main` function. Unlike other languages, `main` requires no arguments or return value. In this example, we've opted to return a value of type `std::io::Result` so that I/O errors will be propagated with the [try operator](https://doc.rust-lang.org/edition-guide/rust-2018/error-handling-and-panics/the-question-mark-operator-for-easier-error-handling.html) (`?`).

`main` begins by opening the file and creating a buffered reader (`BufReader`). The reader implements Rust's [`Iterator` trait](/articles/2020/06/22/returning-rust-iterators/), opening many possibilities. In this case, we use the [`Iterator#fold`](https://doc.rust-lang.org/std/iter/trait.Iterator.html#method.fold) method to count lines. `fold` updates the previous (or initial) value by applying a closure for each element, and then returns the final result. In this case, we start with an initial count of zero and increment the count every time the reader returns another line. Analogous methods can be found in many functional languages.

`BufReader` is a good first choice for those situations in which it's unclear whether a file will fit in memory. Instead of loading all bytes into memory, they're streamed one line at a time.

Next, build the project with Cargo:

```bash
cargo build
```

Execution time on my system clocked in at a rather alarming two minutes. What gives?

```bash
time ./target/debug/sdread
line count: 91736104

real    2m23.095s
user    2m19.330s
sys     0m1.364s
```

# Compile a Release Build When Performance Counts

When a Rust program takes longer than expected to execute, a good first step is to check the compile target. The previous section used a *[debug build](https://users.rust-lang.org/t/why-does-cargo-build-not-optimise-by-default/4150/2)*. Such a build includes overhead that isn't needed during normal execution. Removing it can lead to a substantial reduction in execution time.

Switch to a release build with:

```bash
cargo build --release
```

Running the release build yields a much more reasonable execution time:

```bash
time ./target/release/sdread
line count: 91736104

real    0m14.629s
user    0m14.017s
sys     0m0.593s
```

# Iterate the First Record

Counting lines is instructive, but SDfiles are all about the records. Let's modify the example to return the first record of the SDfile as a `String`. Here we'll introduce a custom `Iterator` implementation. For background, see *[Returning Rust Iterators](/articles/2020/06/22/returning-rust-iterators/)*. Replace the content of `src/main.rs` with the following:

```rust
// src/main.rs
use std::io::Lines;
use std::io::BufRead;
use std::io::BufReader;
use std::fs::File;

struct Records {
    iter: Lines<BufReader<File>>
}

impl Iterator for Records {
    type Item = Vec<String>;

    fn next(&mut self) -> Option<Self::Item> {
        let mut lines = vec![ ];

        loop {
            match self.iter.next() {
                Some(result) => match result {
                    Ok(line) => {
                        if line == "$$$$" {
                            break Some(lines)
                        } else {
                            lines.push(line)
                        }
                    },
                    Err(error) => panic!(error)
                },
                None => break None
            }
        }
    }
}

fn main() -> std::io::Result<()> {
    let name = "/Users/rich/Downloads/Compound_000000001_000500000.sdf";
    let file = File::open(name)?;
    let reader = BufReader::new(file);
    let mut records = Records { iter: reader.lines() };

    if let Some(record) = records.next() {
        println!("record: {:?}", record);
    }

    Ok(())
}
```

The `main` function here resembles the previous version. But this time the reader is wrapped in a custom `Records` iterator. The first record (provided it exists), is then printed through a call to `next`.

The custom `Records` iterator is implemented as follows. Within the `Records` implementation (`impl Iterator for Records`), we declare the type of the item that will be iterated (in this case a vector of `String`). Then, the `next` method is implemented. A functional `Iterator` requires just these two elements.

The `next` method adds lines to a vector buffer until finding the SDfile record terminator (`$$$$`). When that happens the vector of lines is returned.

# Count All Records

The `Records` type serves as a gateway into a vast range of powerful tools open to Rust iterators. But first we begin on a humble note: counting all of the records contained in the SDfile.

```rust
// src/main.rs
use std::io::Lines;
use std::io::BufRead;
use std::io::BufReader;
use std::fs::File;

struct Records {
    iter: Lines<BufReader<File>>
}

impl Iterator for Records {
    type Item = Vec<String>;

    fn next(&mut self) -> Option<Self::Item> {
        let mut lines = vec![ ];

        loop {
            match self.iter.next() {
                Some(result) => match result {
                    Ok(line) => {
                        if line == "$$$$" {
                            break Some(lines)
                        } else {
                            lines.push(line)
                        }
                    },
                    Err(error) => panic!(error)
                },
                None => break None
            }
        }
    }
}

fn main() -> std::io::Result<()> {
    let name = "/Users/rich/Downloads/Compound_000000001_000500000.sdf";
    let file = File::open(name)?;
    let reader = BufReader::new(file);
    let count = (Records { iter: reader.lines() })
        .fold(0, |count, _| count + 1);

    println!("records: {}", count);

    Ok(())
}
```

Here, `Records` hasn't changed, but `main` has. The `fold` method makes another appearance, but instead of counting lines, `fold` is counting records. Compile the release binary (`cargo build --release`) then execute:

```bash
time ./target/release/sdread
records: 442655

real    0m20.696s
user    0m19.598s
sys     0m0.781s
```

The result can be confirmed by counting the number of record terminators (`$$$$`) in the file:

```bash
grep -wc "\$\$\$\$" /Users/rich/Downloads/Compound_000000001_000500000.sdf
442655
```

This is a good time to point out that PubChem periodically culls Compound records and changes the size of its bulk download files. Future records counts may not match the totals presented here.

# Compile Data Fields

The goal of most SDfile parsing is to extract structures and data. We can move one step closer to this goal by capturing Data Items in a `HashMap`. The listing below shows one way.

```rust
// src/main.rs
use std::io::Lines;
use std::io::BufRead;
use std::io::BufReader;
use std::fs::File;
use std::collections::HashMap;

struct Records {
    iter: Lines<BufReader<File>>
}

impl Iterator for Records {
    type Item = HashMap<String, String>;

    fn next(&mut self) -> Option<Self::Item> {
        let mut result = HashMap::new();
        let next = self.iter.next();

        if next.is_none() {
            return None
        }
        
        while next_line(&mut self.iter) != "M  END" { }

        loop {
            let line = next_line(&mut self.iter);

            if line == "$$$$" {
                break Some(result);
            }

            let name = read_name(&line);
            let data = read_data(&mut self.iter);
            
            result.insert(name, data);
        }
    }
}

fn next_line(iter: &mut Lines<BufReader<File>>) -> String {
    match iter.next() {
        Some(line) => {
            line.expect("reading line")
        },
        None => panic!("unexpected EOF")
    }
}

fn read_name(line: &String) -> String {
    let mut characters = line.chars();
    
    if let Some(first) = characters.next() {
        if first != '>' {
            panic!("no leading > on header line");
        }
    } else {
        panic!("unexpected blank line");
    }
    
    let mut result = String::new();
    let mut capture = false;

    for character in characters {
        if capture {
            if character == '>' {
                return result;
            } else {
                result.push(character);
            }
        } else {
            if character == '<' {
                capture = true;
            }
        }
    }

    if capture == true {
        panic!("no closing >");
    } else {
        panic!("no opening <");
    }
}

fn read_data(iter: &mut Lines<BufReader<File>>) -> String {
    let mut result = next_line(iter);

    loop {
        let line = next_line(iter);

        if line.is_empty() {
            break result;
        }

        result.push_str(&line);
    }
}

fn main() -> std::io::Result<()> {
    let name = "/Users/rich/Downloads/Compound_000000001_000500000.sdf";
    let file = File::open(name)?;
    let reader = BufReader::new(file);
    let records = Records { iter: reader.lines() };
    let stop = "5-(5-diazoimidazol-4-yl)-1H-1,2,4-triazole";

    for record in records {
        if let Some(name) = record.get("PUBCHEM_IUPAC_NAME") {
            if name == stop {
                let cid = record.get("PUBCHEM_COMPOUND_CID").expect("CID");

                println!("Found name at CID {}", cid);

                return Ok(());
            }
        }
    }

    println!("name not found");
    
    Ok(())
}
```

The `main` function uses a more complex `Records` iterator for selective capture of fields from an SDfile. It iterates until the target IUPAC name is found (`stop`), then prints the Compound Identifier of the corresponding record. This record was chosen to be the last one in the file so that execution time can be compared to that of the previous examples.

`HashMap` is but one option for capturing Data Items. For example, nothing guarantees the *uniqueness* of a Field Name within the Data Items section. An alternative approach using vector of tuple (`Vec<(String, String)>`) might be better suited for general use.

# Gotchas

When reading lines with the approach presented in this article, the question of newlines might come up. [The spec](/articles/2020/07/13/the-sdfile-format/) says nothing on this topic. It turns out that `BufReader` will work with either [CR or CRLF encoding](https://stackoverflow.com/questions/1552749/difference-between-cr-lf-lf-and-cr-line-break-types), which covers the majority of situation. As noted in the [Rust documentation](https://doc.rust-lang.org/std/io/trait.BufRead.html#method.lines):

> The iterator returned from this function \[`lines`\] will yield instances of io::Result<String>. Each string returned will not have a newline byte (the 0xA byte) or CRLF (0xD, 0xA bytes) at the end.

Speaking of newlines, reading individual lines may not be the most efficient approach. A reader that reads an entire record (up to `$$$$`), then works on the resulting full record string in memory may be more efficient. Ultimately, benchmarking with real data sets would be needed.

# Future Directions

Although the reader described here is already quite functional, there's more to the story. Here are some possible jumping off points:

- support `*.sdf.gz` files (see, for example, [niffler](https://crates.io/crates/niffler))
- support [collections of `*sdf.gz` files](/articles/2010/01/29/pubcouch-streams-arent-just-for-pipeline-pilot/)
- concurrency, especially crates like [Rayon](https://github.com/rayon-rs/rayon) that simplify the job
- better error handling, including validation of Field Names and line number reporting
- support for Data Headers lacking a field name such as "DT13"
- refactor into modules
- unit/integration tests
- consider [re-use vs re-allocation](https://stackoverflow.com/a/45882510) within a `Records` iterator

# Conclusion

This article offers a series of examples building up to a Rust `Iterator` for SDfile records. Iterators are quite powerful in Rust, so building on this foundation unlocks a lot of potential. Additionally, the platform presented here can be extended in several ways. Future articles will highlight some of them.