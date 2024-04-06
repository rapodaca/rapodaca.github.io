---
title: Python Extensions in Pure Rust with Rust-CPython
summary: Mixing Python and Rust with a low-level API.
twitter: true
summary-image: images/posts/20220309/summary.png
published: "2022-03-09T18:00:00Z"
---

Python's many advantages come at a cost: execution speed on the "traditional" runtime lags that of other languages by a considerable margin. Python's solution is to expose the runtime to more efficient [extensions](https://docs.python.org/3/extending/index.html) written C and C++. As [noted previously here](/articles/2020/08/10/python-extensions-in-pure-rust-with-pyo3/), Python extensions can also be written in pure Rust through PyO3. But some projects call for greater control. This article describes an alternative that may be useful when a lower-level approach needed.

# Rust-CPython

[Rust-CPython](https://github.com/dgrunwald/rust-cpython) is a set of "Rust bindings for the python interpreter." Created in 2015, Rust-CPython was [the precursor](https://pyo3.rs/v0.6.0/rust-cpython.html) to the [PyO3 project](https://github.com/PyO3/pyo3). The main difference between the two projects is implementation: in Rust-CPython developers define classes and functions using declarative macros whereas in PyO3, [procedural macros](https://doc.rust-lang.org/reference/procedural-macros.html) are used. An important secondary difference relates to ownership. In PyO3, the framework owns Python values, whereas Rust-CPython code owns its own values. This distinction gives Rust-CPython users greater flexibility at the cost of some overhead.

# Source Code/Example Setup

The complete source code for the examples in this article can be found [on GitHub](https://github.com/rapodaca/cpython_test). Each example follows a similar `Cargo.toml` setup:

```toml
# ... package attributes

[lib]
crate-type = ["cdylib"]

[dependencies]
cpython = "0.7"

[features]
default = ["python3"]
python3 = ["cpython/python3-sys", "cpython/extension-module"]
```

# The Simplest Module

The core of Rust-CPython is the `py_module_initializer!` macro. To illustrate its use, consider a module consisting of just a docstring. It can be implemented like so:

```rust
use cpython::py_module_initializer;

py_module_initializer! {
    docstring, |py, module| {
        module.add(py, "__doc__", "This module is implemented in Rust.")?;

        Ok(())
    }
}
```

Note that:

- `docstring` is the name of the Python package when imported from Python.
- `py` is the Global Interpreter Lock (GIL).
- `module` is the module being created.

The block inside the macro adds the attribute `__doc__` to the module with the indicated string value.

Compiling with `cargo build` yields a shared library in `target/debug`. The filename consists of the package name (defined in `Cargo.toml`) prefixed with "lib". The filename extension will be platform specific. On MacOS, it should be "dylib". Compilation on MacOS therefore yields the file `target/debug/libdocstring.dylib`.

Minor changes will be required before using the shared library. On all platforms the "lib" prefix typically needs to be removed, unless a package name like "libdocstring" was used inside `py_module_initializer!`. MacOS users will also need to swap the `.dylib` extension for `.so`. These changes can be accomplished by copying the shared library with a new name and/or extension. On MacOS use:

```bash
cp target/debug/libdocstring.dylib target/debug/docstring.so
```

It is now possible to use the shared library like any other Python module.

```python
# ./run.py
from target.debug import docstring

print(docstring.__doc__)
```

Running this program yields the output "This module is implemented in Rust."

You may receive an error along the lines of "ImportError: dynamic module does not define module export function...". This error occurs when the name of the `so` file does not match the module name provided in the `py_module_initializer` macro. Be sure that both names are identical. In this case, "docstring" should be used.

# Functions

Functions are implemented in a similar manner. Conveniently, ordinary Rust functions are used. However, the first argument must be of type `Python`, and the return type must be `PyResult`. The `py_fn!` macro wraps the function added to the module.

```rust
use cpython::{py_module_initializer, py_fn, PyResult, Python};

fn greet(_: Python, name: String) -> PyResult<String> {
    Ok(format!("Hello, {}!", name))
}

py_module_initializer! {
    function, |py, module| {
        module.add(py, "greet", py_fn!(py, greet(string: String)))?;

        Ok(())
    }
}
```

After building and copying the dynamic library as before, it can be used as an ordinary Python module.

```python
from target.debug.function import greet

print(greet("Smith"))
```

# Classes

Classes are implemented using the `py_class!` macro. Here a hybrid language mixing Rust and Python syntax is used. The following example illustrates a class that exposes an instance method called `greet`.

```rust
use cpython::{py_class, PyResult, py_module_initializer};

py_class!{pub class Class |py| {
    def __new__(_cls) -> PyResult<Class> {
        Class::create_instance(py)
    }

    def greet(&self, name: String) -> PyResult<String> {
        Ok(format!("Hello, {}!", name))
    }
}}

py_module_initializer! {
    klass, |py, module| {
        module.add_class::<Class>(py)?;

        Ok(())
    }
}
```

Compile this extension as before with `cargo build`, then copy the resulting shared library. The module can then be used as follows.

```python
from target.debug.klass import Class

klass = Class()

print(klass.greet("Smith"))
```

# Wrapping Rust Types

The `py_class!` macro can wrap Rust structs containing both accessors and mutators. The following demonstrates the idea based in part on the previous article's [PyO3 example](/articles/2020/08/10/python-extensions-in-pure-rust-with-pyo3/).

```rust
use std::cell::RefCell;

use cpython::{py_class, py_module_initializer, PyClone, PyObject, PyResult};

type Inner = std::collections::HashSet<u32>;

py_class! {pub class SetIterator |py| {
    data iter: RefCell<std::collections::hash_set::IntoIter<u32>>;

    def __iter__(&self) -> PyResult<Self> {
        Ok(self.clone_ref(py))
    }

    def __next__(&self) -> PyResult<Option<u32>> {
        Ok(self.iter(py).borrow_mut().next())
    }
}}

py_class! {pub class HashSet |py| {
    data hash_set: RefCell<Inner>;

    def __new__(_cls) -> PyResult<HashSet> {
        HashSet::create_instance(py, RefCell::new(Inner::new()))
    }

    def __len__(&self) -> PyResult<usize> {
        Ok(self.hash_set(py).borrow().len())
    }

    def __contains__(&self, v: u32) -> PyResult<bool> {
        Ok(self.hash_set(py).borrow().contains(&v))
    }

    def __iter__(&self) -> PyResult<SetIterator> {
        SetIterator::create_instance(
            py,
            RefCell::new(self.hash_set(py).borrow().clone().into_iter())
        )
    }

    def add(&self, v: u32) -> PyResult<PyObject> {
        self.hash_set(py).borrow_mut().insert(v);

        Ok(py.None())
    }
}}

py_module_initializer! {
    wrapper, |py, module| {
        module.add_class::<HashSet>(py)?;

        Ok(())
    }
}
```

In analogy with the previous examples, this one can be compiled into a shared library extension and run from Python.

```python
from target.debug.wrapper import HashSet

set = HashSet()

set.add(1)

print(f"has 0: {0 in set}")
print(f"has 1: {1 in set}")

set.add(2)

for i in set:
    print(f"found {i}")

print(len(set))
```

Most of the functionality resides on `HashSet`. This type uses an internal data store wrapped in a `RefCell`. The reason has to do with "[interior mutability](https://doc.rust-lang.org/book/ch15-05-interior-mutability.html)." In a nutshell, the dynamic environment of the Python runtime breaks Rust's [compile-time memory management model](/articles/2020/01/27/rust-ownership-by-example/). `RefCell` offers a mechanism to re-instate safe, dynamically-checked borrowing for those situations, like a Python extension. Interior mutability has been covered in an excellent video by [Jon Gjengset](https://thesquareplanet.com)

<div class="videowrapper">
  <iframe src="https://www.youtube.com/embed/8O0Nt9qY_vo" allowfullscreen></iframe>
</div>

This example allows values to not only be added and queried, but also iterated. `SetIterator` serves this purpose.

# The Problem with Iterators

The class `HashSet` in the previous example uses a helper class called `SetIterator`. It is produced from a *cloned* backing Rust set. Although expedient, this solution leads to something that is less flexible or efficient than it could be. Sets containing values that can not be cloned or which can only be cloned expensively would incur potentially unacceptable costs. A better solution would be to delegate to an iterator derived from a borrowed set.

The [analogous PyO3 example](/articles/2020/08/10/python-extensions-in-pure-rust-with-pyo3/) suffered from the same limitation. As far as I can tell, PyO3 does not offer the low-level access that would be needed to address the problem. Fortunately, Rust-CPython does allow such access. A follow-up article will provide the details. If you'd like to see how this works before that, check out the [article](https://octobus.net/blog/2019-07-25-rust-cpython-shared-ref.html) by [Raphaël Gomès](https://twitter.com/alphare33).

# Conclusion

Like PyO3, Rust-CPython enables the creation of Python extensions in pure Rust. The main advantage of Rust-CPython is a lower-level API. Use of this API was demonstrated through three simple examples. A fourth example hints at one way to use the greater control afforded by Rust-CPython.
