---
title: Python Extensions in Pure Rust with PyO3
summary: "Avoid a lot of manual labor when creating Python wrappers."
twitter: true
summary-image: images/posts/20200810/summary.png
published: "2020-08-10T17:00:00Z"
---

The [previous article](/articles/2020/08/03/wrapping-rust-types-as-python-classes/) in this series described a low-level, manual approach to building Python packages from Rust code. Although effective, the procedure involves writing highly repetitive code blocks in both languages. Fortunately, such repetition isn't necessary. This article picks up where the last one left off by showing one way to automate the generation of Python packages from Rust libraries. It also highlights an important but rarely-discussed limitation likely to affect nontrivial projects.

# About PyO3

[PyO3](https://github.com/PyO3/pyo3) is a suite of tools for Rust and Python that, among other things, makes it possible to write Python extensions in pure Rust. The project was forked from [rust-cpython](https://github.com/dgrunwald/rust-cpython). The latter remains somewhat active, but the two projects have [diverged](https://pyo3.rs/master/rust_cpython.html) in both features and focus since the fork.

# Motivation

[ChemCore](/articles/2020/06/01/chemcore-a-cheminformatics-toolkit-for-rust/) is a cheminformatics library written in Rust. It would be helpful if its functionality were usable through a Python interface, given the popularity of that language in scientific computing. A previous article discussed [OxMol](/articles/2020/06/15/oxmol-rust-python-bindings-for-chemcore/), a Python wrapper for ChemCore built with PyO3. The purpose of the current article is different: to illustrate the process of building Python wrappers to simpler Rust libraries. Recently, a [helpful tutorial on using PyO3](https://blog.yossarian.net/2020/08/02/Writing-and-publishing-a-python-module-in-rust) was published. The current article expands on some points not covered in detail there.

# Prerequisites

This tutorial assumes your system has a [Rust compiler](https://rustup.rs) and a Python 3 installation with developer tools.

# Hello, World

In this simple demonstration, we define a Rust struct and then expose it through a Python wrapper written entirely in Rust.

First, create a new Cargo project.

```console
cargo new point --lib && cd point
```

Next, update `Cargo.toml`.

```toml
# Cargo.toml
# ...

[lib]
name = "point"
crate-type = ["cdylib"]

[dependencies.pyo3]
version = "0.11.1"
features = ["extension-module"]
```

Add a Rust type consisting of two fields and a constructor. Applying the macros `pyclass`, `pymethods`, and `new` direct PyO3 to the functionality to be wrapped.

```rust
// src/lib.rs
use pyo3::prelude::*;

#[pyclass]
struct Point {
    #[pyo3(get)]
    x: f64,
    #[pyo3(get)]
    y: f64
}

#[pymethods]
impl Point {
    #[new]
    pub fn new(x: f64, y: f64) -> Self {
        Point { x, y }
    }
}

#[pymodule]
fn point(_: Python, m: &PyModule) -> PyResult<()> {
    m.add_class::<Point>()?;

    Ok(())
}
```

This code will build a Python module called "point" that contains class called `Point`. Two attributes will be accessible on `Point` instances: `x` and `y`. A constructor allows the class to be constructed from Python.

We're going to compile this Rust code using the PyO3 subproject [Maturin](https://github.com/PyO3/maturin). The recommended procedure is to set up a Python 3 [virtual environment](https://docs.python.org/3/tutorial/venv.html). In a nutshell, packages such as Maturin can be installed and used within a virtual environment without affecting the global Python 3 installation.

Create a virtual environment, activate it, and install Maturin with the following.

```console
$ python3 -m venv env
$ source env/bin/activate
(env) $ pip3 install maturin
```

The first command creates a virtual environment within the working directory. The second command activates that virtual environment. The prefix `(env)` on the command prompt notifies us that Python is using the virtual environment called `env`. It can be deactivated with:

```console
(env) $ deactivate # use this to deactivate a virtual environment
$ 
```

For now, don't deactivate the `env` virtual environment.

Instead, compile the `point` project with the following:

```console
(env) $ maturin develop
```

This command produces the binding needed to import and use the `point` module from Python.

```test
(env) $ python3
>>> import point
>>> from point import Point
>>> p = Point(13, 42)
>>> print(p.x, p.y)
13 42
```

This short workflow has demonstrated how to build a Python module entirely in Rust with Maturin. At some point, however, we'll want to distribute it. And this is where things get even better.

# Distribution

The command `maturin develop` creates a Python package that can be used from local virtual environment. This package is not, however, suitable for distribution. To accomplish that, use the `maturin build` command.

```console
(env) $ maturin build
```

Doing so creates a standards-compliant wheel file in the `targets` directory:

```console
ls -l targets/wheels
total 784
drwxr-xr-x  3 rich  staff      96 Aug  8 07:34 .
drwxr-xr-x  6 rich  staff     192 Aug  8 07:33 ..
-rw-r--r--  1 rich  staff  397340 Aug  8 07:34 point-0.1.0-cp37-cp37m-macosx_10_7_x86_64.whl
```

The contents and name of the wheel file will reflect your operating system and Python installation. This raises the question of how to build a cross-platform distribution.

# Cross-Platform Distribution

The Maturin project maintains a [manylinux1-compatible Docker container](https://github.com/pypa/manylinux) that enables the compilation of Linux wheels. After installing and activating Docker, the following one-liner is all it takes:

```console
docker run --rm -v $(pwd):/io konstin2/maturin build
```

As in the previous build, wheels are added to the `target/wheels` directory:

```console
(env) $ ls -l target/wheels
total 17200
drwxr-xr-x  7 rich  staff      224 Aug  8 07:42 .
drwxr-xr-x  6 rich  staff      192 Aug  8 07:33 ..
-rw-r--r--  1 rich  staff  1843179 Aug  8 07:41 point-0.1.0-cp35-cp35m-manylinux1_x86_64.whl
-rw-r--r--  1 rich  staff  1845201 Aug  8 07:41 point-0.1.0-cp36-cp36m-manylinux1_x86_64.whl
-rw-r--r--  1 rich  staff   397340 Aug  8 07:34 point-0.1.0-cp37-cp37m-macosx_10_7_x86_64.whl
-rw-r--r--  1 rich  staff  1846610 Aug  8 07:42 point-0.1.0-cp37-cp37m-manylinux1_x86_64.whl
-rw-r--r--  1 rich  staff  1846067 Aug  8 07:42 point-0.1.0-cp38-cp38-manylinux1_x86_64.whl
```

For details see the [Maturin README](https://github.com/PyO3/maturin).

Compiled wheels can be published to PyPi using the command:

```console
(env) $ maturin publish
```

# Labor-Saving Automation

[The previous article](/articles/2020/08/03/wrapping-rust-types-as-python-classes/) described a manual process for building a Python module from Rust using FFI. With Maturin, it's possible to update that procedure to something much simpler.

Below is the complete listing for a PyO3-based partial wrapper for Rust's `HashSet` type. Clearly, Python already has its own set functionality. The goal here is to demonstrate how to build more complex wrappers.

```rust
// lib.rs
use pyo3::prelude::*;
use pyo3::PyIterProtocol;

#[pyclass]
struct SetIterator {
    iter: std::collections::hash_set::IntoIter<usize>
}

#[pyproto]
impl PyIterProtocol for SetIterator {
    fn __iter__(slf: PyRef<Self>) -> Py<SetIterator> {
        slf.into()
    }

    fn __next__(mut slf: PyRefMut<Self>) -> Option<usize> {
        slf.iter.next()
    }
}

#[pyclass]
struct HashSet {
    inner: std::collections::HashSet<usize>
}

#[pymethods]
impl HashSet {
    #[new]
    pub fn new() -> Self {
        HashSet {
            inner: std::collections::HashSet::new()
        }
    }

    pub fn insert(&mut self, value: usize) {
        self.inner.insert(value);
    }

    pub fn contains(&self, value: usize) -> bool {
        self.inner.contains(&value)
    }

    pub fn len(&mut self) -> usize {
        self.inner.len()
    }

    pub fn iter(slf: PyRef<Self>) -> PyResult<Py<SetIterator>> {
        let iter = SetIterator {
            iter: slf.inner.clone().into_iter()
        };

        Py::new(slf.py(), iter)
    }
}

#[pymodule]
fn hash_set(_: Python, m: &PyModule) -> PyResult<()> {
    m.add_class::<HashSet>()?;

    Ok(())
}
```

This sample can be compiled and run using `maturin develop` as before.

This listing differs in one important respect from the FFI example: the `collect` method has been replaced with `iter`. However, this method is implemented in a decidedly non-idiomatic way. Rather than simply wrapping a Rust Iterator, we clone the entire collection and return a wrapper to its iterator. 

# Limitation: Iterators

Iterators are a powerful and ubiquitous zero-cost Rust abstraction. For this reason, any attempt to wrap a trivial Rust library using PyO3 is likely to eventually need a way to deal with Iterators.

Currently, [PyO3 does not support wrapping Rust structs using a lifetime parameter](https://github.com/PyO3/pyo3/issues/502). This is quite limiting, because the defining characteristic of many Rust iterators is a lifetime parameter. And that lifetime parameter gets inherited by any type owning or borrowing the Iterator.

For example, the preferred method for exposing an iterator in the `HashSet` example above would be to simply wrap the Iterator returned from the standard library's `HashSet#iter` method. We could do that with a struct owning an internal iterator like so:

```rust
// Compile ERROR: #[pyclass] cannot have generic parameters
#[pyclass]
struct Foo<'a> {
    iter: std::collections::hash_set::Iter<'a, usize>
}
```

However, compliation fails with the error `#[pyclass] cannot have generic parameters`. Although there may be workarounds, they are unsafe and nontrivial. For details, see this [GitHub issue](https://github.com/PyO3/pyo3/issues/1085).

Nor is the problem restricted to Iterators. It crops up with any struct holding a borrowed reference. Consider, for example, the following:

```rust
// Compile ERROR: #[pyclass] cannot have generic parameters
#[pyclass]
struct Bar<'a> {
    name: &'a str
}
```

It should be noted that the workaround used in the `HashSet` demo, copying the underlying object containing the Iterator, won't be feasible in many situations.

To be fair, this problem isn't unique to PyO3. It can happen when exposing any Rust type to Python. Consider, for example, how an FFI project would expose a Rust Iterator. Some method for dealing with the dangling lifetime would be required there as well.

Therefore, before using PyO3 for any project I can recommend a thorough analysis of how Iterators and lifetime parameters are used within the Rust library to be wrapped. Workarounds may be feasible in certain cases. In others, the restrictions imposed by PyO3 may prove practically insurmountable.

# Conclusion

PyO3 makes it possible to write, build, and publish Python extensions without writing a line of Python. As such, PyO3 will be an attractive option for many kinds of Rust projects. However, projects relying on nontrivial Rust Iterators or types taking lifetime parameters may run into difficult challenges. This is not so much a problem with PyO3 as with the mismatched memory management models used by Python and Rust.