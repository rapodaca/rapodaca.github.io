---
title: "Compiling C to WebAssembly and Running It - without Emscripten"
summary: "The tools for deploying C code to Web browsers are rapidly evolving. It's now possible to compile complex libraries to WebAssembly with nothing but LLVM."
twitter: true
summary-image: images/posts/20191016/summary.png
published: "2019-10-16T17:00:00Z"
---

I [recently showed](/articles/2019/05/15/compiling-inchi-to-webassembly-part-1/) how to compile a complex C application to WebAssembly using Emscripten. Although effective, this approach comes at the cost of complexity. A lot of JavaScript glue code is produced, and an external tool chain is required. The former obscures the underlying principles, which makes improvement and extension difficult. The latter may not always be possible.

This article shows how to compile C functions to WebAssembly without Emscripten, and then execute the result in a browser. Only a recent LLVM installation is needed. Standard library functions are available with some add-ons.

# Credits

To my knowledge, the full procedure given in this article has never been described before. It was constructed from various articles describing one or more pieces of what you'll find here. Two articles from earlier this year were especially helpful:

- [Compiling C to WebAssembly without Emscripten](https://dassur.ma/things/c-to-webassembly/)
- [Compiling C to WebAssembly using clang/LLVM and WASI](https://00f.net/2019/04/07/compiling-to-webassembly-with-llvm-and-clang/)

# Installing LLVM

Installation of LLVM on most unix systems should be straightforward. Unfortunately, macOS users may need extra steps. Mojave ships with a partial LLVM toolchain, but it's not complete enough to compile WebAssembly. This problem can be solved by the installation of a full, parallel LLVM suite through Homebrew. Using this approach will preserve Mojave's copy of LLVM for internal use, while allowing you to compile C to WebAssembly when needed.

Begin by installing the binaries:

```bash
brew install llvm
```

Activate the installation with:

```bash
export PATH=/usr/local/opt/llvm/bin:$PATH
```

Finally, verify the activation with:

```bash
llc --version
```

This should produce output containing the lines:

```bash
...
    wasm32     - WebAssembly 32-bit
    wasm64     - WebAssembly 64-bit
...
```

# Compiling a Small Library

As a test of what's now possible, consider the following function that returns the sum of two arguments:

```c
// add.c
int add (int first, int second)
{
  return first + second;
}
```

When saved in a file called `add.c`, this function is compiled to WebAssembly using the command:

```bash
clang --target=wasm32 --no-standard-libraries -Wl,--export-all -Wl,--no-entry -o add.wasm add.c
```

The options passed to `clang` are:

- `--target=wasm32` Set the build target to wasm.
- `--no-standard-libraries` Do not use libc (more on this later).
- `-Wl,--export-all` Export all symbols (i.e., `add`) from the compiled wasm file so that they can be used from JavaScript.
- `-Wl,--no-entry` Don't check for a `main` function.
- `-o` Set the output destination.

Options preceded by `-Wl,` are passed from the LLVM compiler to the linker.

Running the `clang` command should produce the 334-byte file `add.wasm` in your working directory. It can be run with the HTML file shown below. Save it into your working directory as `add.html`.

```html
<!DOCTYPE html>
<!-- add.html -->
<html>
  <head></head>
  <body>
    <script type="module">
      (async() => {
        const response = await fetch('add.wasm');
        const bytes = await response.arrayBuffer();
        const { instance } = await WebAssembly.instantiate(bytes);

        console.log('The answer is: ' + instance.exports.add(1, 2));
      })();
    </script>
  </body>
</html>
```

Your browser's developer tools console should print the message: "The answer is: 3".

Your browser will probably complain if you try to load the HTML file directly from disk. Instead, it must be delivered through a Web server. A convenient option is Python's [SimpleHTTPServer](https://docs.python.org/2/library/simplehttpserver.html), which can be invoked with:

```bash
python -m SimpleHTTPServer
```

The page can then be viewed from [localhost:8000/add.html](http://localhost:8000/add.html).

To recap, a single-function library was compiled with `clang` directly to WebAssembly. The result was executed by invoking the function attached to the `exports` property of the WebAssembly instance object.

In principle, any C function, regardless of its complexity, can be compiled and used in the same way. In practice, however, C libraries rarely stand alone. Most require the C standard library (libc), which the simple approach above explicitly excluded.

A working libc is in fact one of the services provided by Emscripten. Because we're not using Emscripten, we'll need to supply our own copy of libc.

This is where WASI comes in.

# WASI

In early 2019, the Mozilla Project announced the [WebAssembly System Interface (WASI)](https://wasi.dev), "a modular system interface for WebAssembly." Its main goal is to support WebAssembly execution outside of the browser. However, WASI provides something useful for in-browser use as well: a well-defined method for including libc.

<div class="videowrapper">
  <iframe src="https://www.youtube.com/embed/fh9WXPu0hw8" allowfullscreen></iframe>
</div>

Recent versions of LLVM now support the WebAssembly/WASI compile target. With it, C source files depending on libc can be compiled directly to WebAssembly, provided that the environment supplies libc as one or more modules.

For browsers, certain kinds of WASI compatibility can be supplied by [Wasmer-JS](https://github.com/wasmerio/wasmer-js/tree/master/packages/wasi). Although not required for the examples presented here, I have encountered more complicated situations calling for this library.

# wasi-libc

As a demonstration of what's now possible, consider the following C function `copy`. It accepts two buffers as arguments, an input and an output, returning the length of the string that was copied from input to output. Two libc functions are used: `strncpy` and `strlen`.

```c
// copy.c
#include <string.h>

int copy(char *input, char *output)
{
    const int length = strlen(input);

    strncpy(output, input, length);

    return length;
}
```

Attempting to compile this source file like we did before will result in an error:

```bash
clang --target=wasm32 --no-standard-libraries -Wl,--export-all -Wl,--no-entry -o copy.wasm copy.c
src/copy.c:2:10: fatal error: 'string.h' file not found
#include <string.h>
         ^~~~~~~~~~
1 error generated.
```

We've specifically disallowed libc with the `--no-standard-libraries` flag. To continue we'll need to replace LLVM's libc with one designed to work with WebAssembly and WASI. This can be accomplished with [wasi-libc](https://github.com/CraneStation/wasi-libc).

Clone the wasi-libc repository into a separate directory and compile it with:

```bash
git clone https://github.com/CraneStation/wasi-libc.git
cd wasi-libc
make install INSTALL_DIR=/tmp/wasi-libc
```

The install directory can be set to any convenient location. On macOS, ensure the correct version of `clang` has been activated prior to using make:

```bash
export PATH=/usr/local/opt/llvm/bin:$PATH
```

We can now try to compile `copy.c` with a slightly modified invocation of clang:

```bash
clang --target=wasm32-unknown-wasi --sysroot /tmp/wasi-libc -nostartfiles -Wl,--import-memory -Wl,--no-entry -Wl,--export-all -o copy.wasm copy.c
```

Unfortunately, this will probably fail with an error similar to:

```bash
wasm-ld: error: cannot open /usr/local/Cellar/llvm/9.0.0/lib/clang/9.0.0/lib/wasi/libclang_rt.builtins-wasm32.a: No such file or directory
clang-9: error: linker command failed with exit code 1 (use -v to see invocation)
```

The problem can be resolved by adding the missing file to the path indicated by the error. It may be necessary to create missing directories. Conveniently, the precompiled WebAssembly binary [libclang_rt.builtins-wasm32.a](https://github.com/jedisct1/libclang_rt.builtins-wasm32.a) can be directly downloaded. This file is itself compiled from the [WASI SDK](https://github.com/CraneStation/wasi-sdk) source.

# Compiling with Standard Library Dependency

Now all the pieces should be in place to successfully compile:

```bash
clang \
--target=wasm32-unknown-wasi \
--sysroot /tmp/wasi-libc \
-nostartfiles \
-Wl,--import-memory \
-Wl,--no-entry \
-Wl,--export-all \
-o copy.wasm \
copy.c
```

Changed or new parameters include:

- `target=wasm32-unknown-wasi` Set the build target to WASI.
- `sysroot` Set the top-level directory for libc.
- `-Wl,--import-memory` Import memory from JavaScript, rather than creating it internally.

After issuing the command, a new 1,409-byte file, `copy.wasm`, should have been created in your working directory.

# WebAssembly, JavaScript, and Memory

The newly-compiled `copy` function can be tested with the following HTML:

```html
<!DOCTYPE html>
<!-- copy.html -->
<html>
  <head></head>
  <body>
    <script type="module">
      // allow use of async/await
      (async () => {
        // Build the WebAssembly instance.
        const memory = new WebAssembly.Memory({ initial: 2 });
        const response = await fetch('./copy.wasm');
        const bytes = await response.arrayBuffer();
        const { instance } = await WebAssembly.instantiate(bytes, {
          env: { memory }
        });

        // Text to copy.
        const text = 'Hello from JavaScript!';

        // Configure shared memory.
        const view = new Uint8Array(memory.buffer);
        const pInput = instance.exports.__heap_base;
        const pOutput = pInput + 1024;

        encode(view, pInput, text);

        // Read the result.
        const bytesCopied = instance.exports.copy(pInput, pOutput, text.length);

        console.log('copy length', bytesCopied);
        console.log('copy', decode(view, pOutput));
      })();

      // Encode string into memory starting at address base.
      const encode = (memory, base, string) => {
        for (let i = 0; i < string.length; i++) {
          memory[base + i] = string.charCodeAt(i);
        }

        memory[base + string.length] = 0;
      };

      // Decode a string from memory starting at address base.
      const decode = (memory, base) => {
        let cursor = base;
        let result = '';

        while (memory[cursor] !== 0) {
          result += String.fromCharCode(memory[cursor++]);
        }

        return result;
      };
    </script>
  </body>
</html>
```

In addition to testing the copy function, the example above illustrates how WebAssembly and JavaScript interact. The focus of this interaction is a block of memory accessible to both environments (called `view` in the example). From the JavaScript side, this memory can be manipulated as a typed array. From the C side, this array looks like regular memory. For details, see this [essential introduction](https://hacks.mozilla.org/2017/07/memory-in-webassembly-and-why-its-safer-than-you-think/) by Mozilla.

I may come as a surprise, but WebAssembly functions only accept integer arguments. This raises the question of how complex data types should be shuttled back and forth. As the example demonstrates, an integer argument can be used as a pointer to a region of shared JavaScript/WebAssembly memory from which strings and more complex data types can be encoded/decoded.

# Memory Allocation

You probably noticed that the previous example cheated somewhat with memory allocation. Every WebAssembly module instance has a property called `__heap_base` that points to the start of the heap. The previous example simply passed this index as the address of the input buffer, and an offset as the address of the output buffer. Conflict could arise should the WebAssembly module and JavaScript compete for the same regions of memory.

Fortunately, a WebAssembly module compiled from C that manages memory with `malloc` and/or `free` will expose these function to the JavaScript environment. Your JavaScript code can then use `malloc` to obtain a safe pointer to WebAssembly shared memory, and `free` to release it.

The following code allows this idea to be tested. It accepts a pointer to a character array as input and returns a pointer to an internally-allocated character array as output.

```c
// malloc_copy.c
#include <string.h>
#include <stdlib.h>

char* malloc_copy(char *input)
{
    char *result = malloc(1024);

    strncpy(result, input, strlen(input));

    return result;
}
```

This source file can be compiled with:

```bash
clang \
--target=wasm32-unknown-wasi \
--sysroot /tmp/wasi-libc \
-nostartfiles \
-Wl,--import-memory \
-Wl,--no-entry \
-Wl,--export-all \
-o malloc_copy.wasm \
malloc_copy.c
```

This should produce a 16 kB wasm file, `malloc_copy.wasm`, which can be executed with the following HTML:

```html
<!DOCTYPE html>
<!-- malloc_copy.html -->
<html>
  <head></head>
  <body>
    <script type="module">
      // allow use of async/await
      (async () => {
        // Build the WebAssembly instance.
        const memory = new WebAssembly.Memory({ initial: 2 });
        const response = await fetch('./malloc_copy.wasm');
        const bytes = await response.arrayBuffer();
        const { instance } = await WebAssembly.instantiate(bytes, {
          env: { memory }
        });

        // Text to copy.
        const text = 'Hello from JavaScript!';

        // Configure shared memory.
        const view1 = new Uint8Array(memory.buffer);
        const pInput = instance.exports.malloc(1024);
        // malloc causes memory to grow, invalidating old view
        const view2 = new Uint8Array(memory.buffer);

        encode(view2, pInput, text);

        const pOutput = instance.exports.malloc_copy(pInput, text.length);

        console.log('copy', decode(view2, pOutput));

        // Should free pOutput and pInput
      })();

      // Encode string into memory starting at address base.
      const encode = (memory, base, string) => {
        for (let i = 0; i < string.length; i++) {
          memory[base + i] = string.charCodeAt(i);
        }

        memory[base + string.length] = 0;
      };

      // Decode a string from memory starting at address base.
      const decode = (memory, base) => {
        let cursor = base;
        let result = '';

        while (memory[cursor] !== 0) {
          result += String.fromCharCode(memory[cursor++]);
        }

        return result;
      };
    </script>
  </body>
</html>
```

The appearance of `view2` deserves explanation. WebAssembly allows an instance's memory to grow during execution. Calling `malloc` from JavaScript triggers a resize, which invalidates `view1`. Any attempt to read or write it will result in the error:

```bash
Unhandled Promise Rejection: TypeError: Underlying ArrayBuffer has been detached from the view
```

The instance's memory can be made readable and writable again by creating a new view, `view2`.

# Conclusion

It's now possible to compile C source files to WebAssembly with a stock LLVM toolchain devoid of Emscripten. With some extra effort, the C standard library can be included. Data can be passed into and out of a WebAssembly instance by treating pointers as indexes into a JavaScript typed array view.

Unlike Emscripten, this approach to compiling WebAssembly introduces no glue JavaScript code. This means paying for only what's used. On the other hand, the approach does require some thought and work to supply the missing integration points. Fortunately, these are not too difficult to implement.