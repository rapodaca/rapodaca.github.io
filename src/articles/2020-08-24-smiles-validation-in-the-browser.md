---
title: SMILES Validation in the Browser
summary: "A Project using Rust and WebAssembly."
twitter: true
summary-image: images/posts/20200824/summary.png
published: "2020-08-24T17:00:00Z"
---

Sometimes Web applications accept molecular input in the form of SMILES strings. For example, a form may allow a list of newline-delimited SMILES to be submitted for processing. Increasingly, users expect realtime validation during these interactions. One option would be an asynchronous HTTP call in which a server validates SMILES strings. But this requires an API to be both available and properly secured. A simpler and more scalable approach would be to validate SMILES in the browser directly. This article describes an open source solution to this problem that takes advantage of a new cheminformatics toolkit and WebAssembly. A [repository](https://github.com/rapodaca/smival) containing the source code is available.

# Alternatives

My company's chemical structure editor and renderer ([ChemWriter](https://chemwriter.com/smiles/)) accepts a SMILES string with the `readSMILES` function, throwing an error if it is invalid. Within certain limitations, this feature can be used for validation as well. Still, some will prefer an open source option.

It might appear that something like [SMIDGE](https://metamolecular.com/smidge/) could work. The main problem is that this and similar tools only validate the [grammar](/articles/2020/04/20/smiles-formal-grammar/) of input strings, not the semantics. Features such as [non-kekulizable aromatics](/articles/2020/02/10/a-comprehensive-treatment-of-aromaticity-in-the-smiles-language/), hypervalence, and invalid isotopes are ignored.

# Smival Project

What could be helpful is a tool that returns a yes or no answer to the question: "is this a valid SMILES, accounting for both syntax and semantics?" This functionality is available from the [Smival project](https://github.com/rapodaca/smival).

# Live Demo

A [live demo](/images/posts/20200824/demo/) is available. Start typing a SMILES into the text input field. As you do, the background alternates between green and red to indicate validity or invalidity, respectively.

<figure>
  <video autoplay>
    <source src="/images/posts/20200824/screen.mp4" type="video/mp4">
  </video>
  <figcaption>
    <strong>Smival Live Demo.</strong> Interactive validation of SMILES in the browser with JavaScript and WebAssembly.
  </figcaption>
</figure>

# High-Level Overview

Smival is comprised of three components working together:

1. A WebAssembly (Wasm) file, compiled from Rust source code.
2. An HTML file containing styles (CSS) and code (JavaScript).
3. A two-way communication channel using strings (JavaScript to Wasm) and integers (Wasm to JavaScript).

On detecting a change to the input field, the JavaScript side allocates memory within the Wasm instance for a string representing the input. After copying the SMILES into the allocated memory, the address is passed to the `read` function function exposed by the Wasm instance. Using the address, the Wasm instance dereferences the string, reads it as a SMILES using the Rust library [ChemCore](https://github.com/rapodaca/chemcore), then returns one of three integer results: 0 (valid); -1 (invalid); or -2 (internal error). This return value is then used to set the background color of the input field.

For background on the overall approach, these articles may be helpful:

- [Rust and WebAssembly from Scratch: Hello World with Strings](/articles/2020/07/07/rust-and-webassembly-from-scratch-hello-world-with-strings/)
- [Compiling Rust to WebAssembly: A Simple Example](/articles/2020/06/29/compiling-rust-to-webassembly-a-simple-example/)
- [First Steps in WebAssembly: Hello World](/articles/2020/01/13/first-steps-in-webassembly-hello-world/)

# JavaScript/HTML/CSS

Two files set up the browser environment: an HTML file and a JavaScript file.

```html
<!DOCTYPE html>
<html>
  <head meta charset="utf-8">
    <title>Cereus Editor</title>
    <style>
      body {
        margin: 2em;
      }
      input {
        font-size: 200%;
        width: 100%;
        padding: 0.1em;
        background-color: #55ff00;
      }
      .invalid {
        background-color: #ff8888;
      }
    </style>
  </head>
  <body>
    <h1>Smival</h1>
    <input placeholder="Enter a SMILES..."></input>
    <script type="module" src="./validate.js"></script>
  </body>
</html>
```

The HTML file (listed above) sets up the UI and invokes the `validate.js` script as an ES6 module. Aside from these two tasks, it's just HTML5 boilerplate.

```javascript
const path = '/target/wasm32-unknown-unknown/release/smival.wasm';

const read_smiles = instance => {
  return smiles => {
    const encoder = new TextEncoder();
    const encoded = encoder.encode(`${smiles}\0`);
    const length = encoded.length;
    const pString = instance.exports.alloc(length);
    const view = new Uint8Array(
      instance.exports.memory.buffer, pString, length
    );

    view.set(encoded);

    return instance.exports.read_smiles(pString);
  };
};

const watch = instance => {
  const read = read_smiles(instance);

  document.querySelector('input').addEventListener('input', e => {
    const { target } = e;

    if (read(target.value) === 0) {
      target.classList.remove('invalid');
    } else {
      target.classList.add('invalid');
    }
  });
}

(async () => {
  const response = await fetch(path);
  const bytes = await response.arrayBuffer();
  const wasm = await WebAssembly.instantiate(bytes, { });

  watch(wasm.instance);
})();
```

The JavaScript file's responsibilities are more involved (`validate.js`, above). The [IIFE](https://en.wikipedia.org/wiki/Immediately_invoked_function_expression) at the bottom kicks the process off by building a Wasm instance from the raw binary. It then watches for changes by invoking the `watch` function.

When `watch` detects a change to the text field input, it invokes `read_smiles`, adding or removing the `invalid` style to the text input as appropriate.

The `read_smiles` function serves as the communication channel into Rust/Wasm. The SMILES obtained from the input field is appended with a null byte, then encoded and written to a pre-allocated section of Wasm linear memory.

# Rust

The Rust project is implemented with Cargo, Rust's default package manager and build system. Like most small projects, the Rust source is contained within a single file (`lib.rs`). Two functions are exposed to the Wasm instance: `alloc` and `read_smiles`. `alloc` allocates memory of the specified length. `read_smiles` accepts a raw pointer that is de-referenced and passed to ChemCore's `daylight::read` function. At the same time, the de-referenced SMILES string is automatically dropped using [Rust's ownership mechanics](/articles/2020/01/27/rust-ownership-by-example/).

```rust
use std::os::raw::{ c_void, c_char };
use std::ffi::CString;
use std::mem;

use chemcore::daylight;

#[no_mangle]
pub extern "C" fn alloc(length: usize) -> *mut c_void {
    let mut buf = Vec::with_capacity(length);
    let ptr = buf.as_mut_ptr();

    mem::forget(buf);

    ptr
}

#[no_mangle]
pub extern "C" fn read_smiles(
    p_smiles: *mut c_char
) -> i8 {
    let smiles = unsafe {
        CString::from_raw(p_smiles)
    };

    match smiles.into_string() {
        Ok(smiles) => {
            match daylight::read(&smiles) {
                Ok(_) => 0,
                Err(_) => -1
            }
        },
        Err(_) => -2
    }
}
```

Compilation of `lib.rs` requires only one other change to the default project. Add a `[lib]` section to `Cargo.toml` to indicate that the project will be built as a dynamic library.

```toml
# ...

[lib]
crate-type = ["cdylib"]
```

After this change, the project can be built with the following call to `cargo`:

```console
cargo build --target wasm32-unknown-unknown --release
```

It may come as a surprise to find a 1.6 MB Wasm file in the `target` directory.

```console
ls -l target/wasm32-unknown-unknown/release/smival.wasm
-rwxr-xr-x   2 rich  staff  1687048 Aug 21 16:47 smival.wasm
```

Fortunately, the compile target can be pared down more than tenfold with [`wasm-gc`](https://github.com/alexcrichton/wasm-gc).

```console
wasm-gc target/wasm32-unknown-unknown/release/smival.wasm
ls -l target/wasm32-unknown-unknown/release/smival.wasm 
-rwxr-xr-x  2 rich  staff  110837 Aug 22 09:20 target/wasm32-unknown-unknown/release/smival.wasm
```

The two versions (pre-`wasm-gc` and post-`wasm-gc`) can be used interchangeably.

# Limitations

The biggest limitation of `smival` is its simple yes/no output. In some applications, it makes sense to inform users of the specific problem to enable correction. Fortunately, this is possible, but at the cost of a more complex `lib.rs` file. [The (unofficial) Rust FFI Guide](https://s3.amazonaws.com/temp.michaelfbryan.com/errors/index.html) offers some good jumping-off points.

A secondary limitation comes from ChemCore. Specifically, the SMILES kekulization algorithm applies a simple greedy procedure, not the full-blown [maximum matching](/articles/2019/04/02/the-maximum-matching-problem/) solution called for in the general case. This means that certain multicyclic odd aromatic systems will be perceived as unkekulizable. Fortunately, such structures are rare in organic chemistry. Future updates to ChemCore based on a matching algorithm already used in [ChemWriter](https://chemwriter.com/smiles/) will eliminate this limitation.

# Conclusion

Realtime client-side SMILES validation can be accomplished with the new software package Smival. Smival is written in Rust using the ChemCore toolkit and compiled to WebAssembly using a standard toolchain. At this stage, Smival only reports whether a SMILES could be read without errors. More sophisticated forms of error reporting are possible with some modification.
