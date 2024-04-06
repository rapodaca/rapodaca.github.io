---
title: "Rust and WebAssembly from Scratch: Hello World with Strings"
summary: "Bare bones approach to two-way string passing - without wasm-bindgen."
twitter: true
summary-image: images/posts/20200707/summary.png
published: "2020-07-07T04:00:00Z"
---

Like most successful duos, Rust and WebAssembly (Wasm) complement each other. Rust is a typesafe systems language with modern tooling and high-level features. WebAssembly is a portable compilation target/execution environment for the Web browser and beyond. The combination makes it possible to write fast, stable software that runs anywhere without recompilation.

But there's a catch. Wasm only supports numeric types as function arguments, and documentation describing how to transfer strings is scarce. A vast network of tools such as [wasm-bindgen](https://github.com/rustwasm/wasm-bindgen) has sprung up to make two-way data sharing more convenient. An advantage in some situations, these tools complicate understanding what's going on behind the scenes or if such abstraction is even necessary.

This article takes a different approach with a simple Hello World written in Rust that compiles to WebAssembly using minimal tooling. Custom JavaScript executes the compiled Rust. [The complete project](https://github.com/rapodaca/hello_world_rust_wasm) can be downloaded from GitHub. For the first article in this series, see [Compiling Rust to WebAssembly: A Simple Example](/articles/2020/06/29/compiling-rust-to-webassembly-a-simple-example/). That article contains some background information not re-iterated here.

# Prerequisites

Begin by installing the Rust language tools with rustup if you haven't already. Next, install the Wasm toolchain:

```bash
rustup target add wasm32-unknown-unknown
```

Finally, create a test project and change into it:

```bash
cargo new hello --lib

cd hello
```

# Update `Cargo.toml`

The file [`Cargo.toml`](http://web.mit.edu/rust-lang_v1.25/arch/amd64_ubuntu1404/share/doc/rust/html/cargo/reference/manifest.html) (aka "manifest") contains the project's configuration. Leave everything, but append a new block called `[lib]`. The result should look something this:

```toml
# Cargo.toml
[package]
name = "hello"
version = "0.1.0"
authors = ["Richard Apodaca <rich.apodaca@gmail.com>"]
edition = "2018"

[dependencies]

# new material
[lib]
crate-type = ["cdylib"]
```

# A Little About Linear Memory

JavaScript and WebAssembly work together using a feature called [linear memory](http://webassembly.org/docs/semantics/#linear-memory). On the JavaScript side, linear memory is usually represented as a regular [typed array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays) such as `Uint8Array`. On the WebAssembly/Rust side, linear memory looks like regular memory. Both sides can write to linear memory, but they do so in different ways.

# The Rust Side

From Rust we export three functions:

- `alloc` allocates a block of linear memory, returning a pointer to it
- `dealloc` deallocates a previously-allocated block of linear memory given a pointer to it
- `greet` uses a pointer passed to it to read `<name>` from linear memory, and write the greeting "Hello, `<name>`!".

Here's the complete listing:

```rust
// lib.rs
use std::mem;
use std::ffi::{CString, CStr};
use std::os::raw::c_void;

#[no_mangle]
pub extern "C" fn alloc() -> *mut c_void {
    let mut buf = Vec::with_capacity(1024);
    let ptr = buf.as_mut_ptr();

    mem::forget(buf);

    ptr
}

#[no_mangle]
pub unsafe extern "C" fn dealloc(ptr: *mut c_void) {
    let _ = Vec::from_raw_parts(ptr, 0, 1024);
}

#[no_mangle]
pub unsafe extern "C" fn greet(ptr: *mut u8) {
    let str_content = CStr::from_ptr(ptr as *const i8).to_str().unwrap();
    let mut string_content = String::from("Hello, ");

    string_content.push_str(str_content);
    string_content.push_str("!");

    let c_headers = CString::new(string_content).unwrap();

    let bytes = c_headers.as_bytes_with_nul();

    let header_bytes = std::slice::from_raw_parts_mut(ptr, 1024);
    header_bytes[..bytes.len()].copy_from_slice(bytes);
}
```

Nothing in the Rust code couples it to the environment in which it will run. All that's needed is the [FFI](https://doc.rust-lang.org/std/ffi/index.html) module built into the standard library. As such, the same code could be used to create C or Python bindings. Coupling to WebAssembly occurs at compile time.

The project can be compiled with:

```bash
cargo build --target wasm32-unknown-unknown --release
```

# The JavaScript Side

One the JavaScript side, three helper functions are used:

- `createInstance` creates the WebAssembly instance from the compiled wasm file
- `write` writes a string to Wasm linear memory
- `read` reads a string from Wasm linear memory

An anonymous IIFE function orchestrates the action, creating a Wasm instance, writing a name to linearm memory, executing the Wasm function `greet`, then reading the result from linear memory.

Here's a complete listing, including the wrapping HTML boilerplate, which should be saved as `index.html` in your project:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>title</title>
    <script>
      const createInstance = async () => {
        const path = 'target/wasm32-unknown-unknown/release/hello.wasm';
        const response = await fetch(path);
        const bytes = await response.arrayBuffer();
        const { instance } = await WebAssembly.instantiate(bytes, { });

        return instance;
      };

      const write = (string, buffer, pointer) => {
        const view = new Uint8Array(buffer, pointer, 1024);
        const encoder = new TextEncoder();

        view.set(encoder.encode(string));
      }

      const read = (buffer, pointer) => {
        const view = new Uint8Array(buffer, pointer, 1024);
        const length = view.findIndex(byte => byte === 0);
        const decoder = new TextDecoder();

        return decoder.decode(new Uint8Array(buffer, pointer, length));
      };

      (async() => {
        const instance = await createInstance();
        const memory = instance.exports.memory;
        const pointer = instance.exports.alloc();

        write('Satoshi', memory.buffer, pointer);
        instance.exports.greet(pointer);

        console.log('greeting', read(memory.buffer, pointer));
        instance.exports.dealloc(pointer);
      })();
    </script>
  </head>
  <body>
  </body>
</html>
```

# Watch It Run

After starting an HTTP server:

```bash
python -m SimpleHTTPServer
```

browse to [http://localhost:8000](http://localhost:8000). After opening a developer console, you should see the greeting.

<figure>
  <img alt="Hello, World!" src="/images/posts/20200707/hello-world.png">
  <figcaption>
    <strong>Hello, World!</strong> The name is supplied by JavaScript. The greeting is created by Rust compiled to WebAssembly.
  </figcaption>
</figure>

# Working with Wasm Memory

You may have noticed the the call to `dealloc` on the JavaScript side. This call isn't strictly needed because all Wasm memory is deallocated when JavaScript finishes execution. It does, however, illustrate how to free linear memory in case that's needed in your situation.

Adding a second call to `dealloc` after the first results in a memory error. On Safari, it reads: `Unhandled Promise Rejection: Error: Out of bounds memory access (evaluating 'instance.exports.dealloc(pointer)')`. With this message the Rust memory allocator is reporting an attempt to manipulate memory that can no longer be used. This is exactly what we would expect.

# Conclusion

This tutorial illustrates two-way string communication between a WebAssembly instance compiled from Rust on one side, and JavaScript running in a browser on the other. No special tools are needed.