---
title: "Compiling InChI to WebAssembly Part 2: From Molfile to InChI"
summary: "A comprehensive tutorial with working demos."
twitter: true
summary-image: images/posts/20200302/summary.png
published: "2020-03-02T14:00:00Z"
---

[InChI](https://iupac.org/who-we-are/divisions/division-details/inchi/) is a software package that generates unique chemical identifiers. Although InChI's C source yields executables for many platforms, there are exceptions. For a long time, the Web browser was one of them. A few years ago, I showed how to compile [InChI to JavaScript](https://metamolecular.com/inchi-js/). That solution works, but recent developments, both in browsers and InChI itself, suggest a better approach is possible.

More recently, I described a procedure for [compiling the InChI main function to WebAssembly (aka Wasm)](/articles/2019/05/15/compiling-inchi-to-webassembly-part-1/). The result wasn't very useful because it just printed command line options and immediately exited. What's needed is a robust method for compiling useful InChI libraries to WebAssembly, which can then be exposed through thin JavaScript wrappers.

This article takes the next step by describing how to compile the InChI C source to Wasm, and then link the result through a concise, manually generated JavaScript wrapper. Only an LLVM toolchain is required. Unlike the previous article in this series, Emscripten is neither needed nor used. Beyond solving the specific problem of using InChI, what follows could be considered a blueprint for deploying any C code base to a Web browser.

# Quickstart

Before describing the solution at a technical level, those who are only interested in testing the InChI-Wasm functionality can do so on the [InChI-Wasm page](https://metamolecular.com/inchi-wasm). GitHub hosts a [source code repository](https://github.com/rapodaca/inchi-wasm).

# Compilation

Compilation to Wasm follows the [previously-described system](/articles/2019/10/16/compiling-c-to-webassembly-and-running-it-without-emscripten/). To recap:

1. Install LLVM on your platform. On macOS, that probably means installing through Homebrew.
2. Activate LLVM, if necessary. macOS users will need to append the LLVM `bin` path to the `PATH` environment variable. Something like `export PATH=/usr/local/opt/llvm/bin:$PATH` should work.
3. Verify that LLVM is working with `llc --version`. The output should include `wasm32` and `wasm64`.
4. Clone, compile, and install [wasi-libc](https://github.com/CraneStation/wasi-libc).
5. Copy the file [libclang_rt.builtins-wasm32.a](https://github.com/jedisct1/libclang_rt.builtins-wasm32.a) to your local LLVM `bin/wasi` directory.

With these prerequisites out of the way, InChI-Wasm can be compiled. Clone [the source](https://github.com/rapodaca/inchi-wasm), change into the repo directory, then initialize the inchi submodule.

```console
git clone https://github.com/rapodaca/inchi-wasm
cd inchi-wasm
git submodule init
git submodule update
```

Next, export the location of your `wasi-libc` installation:

```console
export WASI_LIBC_HOME=/path/to/wasi-libc
```

Finally, compile InChI-Wasm with:

```console
bin/build.sh
```

Running this script places the compiled `.wasm` file into the `build` directory.

# Technical Overview

The main advantage of the approach described here over others is simplicity. A stock LLVM 9.0 installation and some libraries are all that's needed. In this respect, the method closely resembles that for compilation of a native binary. Recent updates to LLVM made this new approach feasible.

The structure of the [`inchi-wasm`](https://github.com/rapodaca/inchi-wasm) repository will likely reflect the structure of any project whose aim is to compile C source to Wasm:

1. `lib/wasi.js` A static JavaScript support file borrowed from [wasmer-js project](https://github.com/wasmerio/wasmer-js).
2. `lib/molfile-to-inchi.js` A custom JavaScript bootstrap file that loads the `.wasm` file and defines a wrapper function.
3. `src/molfile_to_inchi.c` A hand-coded wrapper function that converts a molfile string into an InChI string.
4. `web/index.html` Invokes `molfile-to-inchi.js` and builds a test harness.
5. `bin/build.sh` A build script that compiles and links `molfile_to_inchi.c` using LLVM.
6. `inchi` git submodule. The unaltered InChI C source files [hosted on GitHub](https://github.com/metamolecular/inchi).

# `src/molfile_to_inchi.c`

At the core of InChI-Wasm sits sits the function `molfile_to_inchi`, which is contained in the file `molfile_to_inchi.c`. Thanks to the addition of the `MakeINCHIFromMolfileText` function to the latest InChI revision, the requirements for the wrapper function were minimal:

```c
#include <string.h>
#include <time.h>
#include "inchi_api.h"

size_t molfile_to_inchi(char *molfile, char *options, char *result)
{
    inchi_Output output;
    int status = MakeINCHIFromMolfileText(molfile, options, &output);

    if (status == 0 || status == 1) {
      strcpy(result, output.szInChI);
    } else {
      strcpy(result, output.szMessage); // this should work but doesn't
    }

    FreeINCHI(&output);

    return status;
}

// see:
// https://stackoverflow.com/questions/31476632/
// https://stackoverflow.com/a/617606/54426
clock_t __wrap_clock()
{
    return 0;
}
```

The `molfile_to_inchi` function accepts three parameters representing buffers for the input molfile, InChI options, and the InChI result. Invocation of the `MakeINCHIFromMolfileText` is followed by `strcpy` to set the output buffer with the result. After freeing a temporary data structure, an integer status code is returned.

The InChI documentation implies that `MakeINCHIFromMolfileText` places error messages into the `szMessage` field of the `inchi_Output` struct. This technique was previously used to compile InChI to Javascript. However, I have not been able to get such error reporting to work in the current iteration.

I'll have more to say about the second function, `__wrap_clock`, later.

# `lib/molfile-to-inchi.js`

The C function has a counterpart written in JavaScript and hosted at `lib/molfile-to-inchi.js`. 

```javascript
import WASI from './wasi.esm.js';

const wasmPath = '../build/molfile_to_inchi.wasm';
const memory = new WebAssembly.Memory({ initial: 10 });

(async () => {
  const response = await fetch(wasmPath);
  const bytes = await response.arrayBuffer();
  const wasi = new WASI();
  const { instance } = await WebAssembly.instantiate(bytes, {
    env: { memory }, wasi_snapshot_preview1: wasi.wasiImport
  });
  const pMolfile = instance.exports.malloc(1024);
  const pOptions = instance.exports.malloc(1024);
  const pOutput = instance.exports.malloc(20480);

  window.molfileToInChI = (molfile) => {
    const inputView = new Uint8Array(memory.buffer);
    const encoder = new TextEncoder();
  
    inputView.set(encoder.encode(molfile), pMolfile);
    
    const result = instance.exports.molfile_to_inchi(
      pMolfile, pOptions, pOutput
    );

    const outputView = new Uint8Array(memory.buffer);
    const decoder = new TextDecoder();
    const output = decoder.decode(
      outputView.subarray(pOutput, outputView.indexOf(0, pOutput))
    );

    if (result < 0 || result > 1) {
      throw Error("inchi error: " + output);
    }

    return output;
  };

  window.dispatchEvent(new Event('InChIReady'));
})();
```

The file begins by importing `WASI` from the `wasi.esm.js` file. Doing so enables the instantiation of an object with the `wasiImport` property. This property is used to create the WebAssembly `instance`.

The main block uses the asynchronous IIFE pattern [discussed previously](/articles/2019/10/16/compiling-c-to-webassembly-and-running-it-without-emscripten/). Briefly, async/await functionality must be wrapped in a function using the `async` keyword. The asynchronous IIFE pattern is a convenient way to take advantage of async/await operations.

Three memory allocations are made using the Wasm instance's `malloc` function. Each call returns a pointer into [linear memory](https://webassembly.org/docs/semantics/#linear-memory). The pointers are passed into the instance's `molfile_to_inchi` function. The result is an integer response code that can be used for reporting.

If no error codes are returned, the string representation of the buffer holding the InChI is returned.

The penultimate line dispatches a custom `InChIReady` event signaling that the global `molfileToInChI` function can be used. Attempts to access the function before the event is fired will result in an error.

# bin/build.sh

The script located at `bin/build.sh` orchestrates the compilation of `molfile_from_inchi.c` and the InChI source files. Two checks take place before compilation. First, the build script requires that the environment variable `WASI_LIBC_HOME` be set, or an error will result. Second, the operating system is checked. If macOS is detected, the InChI-specific flag `__APPLE__`, is set as [previously described](/2019/05/15/compiling-inchi-to-webassembly-part-1/). After making these checks, a build directory is created if necessary.

```bash
#!/bin/bash

if [ -n "$WASI_LIBC_HOME" ]; then
  echo "Reading libc from $WASI_LIBC_HOME"
else
  echo "Set the libc location with 'export WASI_LIBC_HOME=path/to/wasi-libc'."
  exit 1
fi

if [[ "$OSTYPE" =~ ^darwin ]]; then
  PLATFORM="-D__APPLE__"
  PATH=/usr/local/opt/llvm/bin:$PATH
else
  PLATFORM=""
fi

mkdir -p build

clang \
  --target=wasm32-unknown-wasi \
  --sysroot ${WASI_LIBC_HOME} \
  -Oz \
  -v \
  -Wl,-import-memory \
  -Wl,-wrap,clock \
  -Wl,-export,malloc \
  -Wl,-export,molfile_to_inchi \
  -Wl,-no-entry \
  -DTARGET_API_LIB \
  ${PLATFORM} \
  -Iinchi/INCHI_BASE/src \
  inchi/INCHI_BASE/src/*.c \
  inchi/INCHI_API/libinchi/src/*.c \
  src/molfile_to_inchi.c \
  -o build/molfile_to_inchi.wasm
```

With all checks performed and a `build` directory in place, the build script invokes `clang`. Options are explained as follows:

- `--target=wasm32-unknown-wasi`. Directs compilation using the [WebAssembly System Interface](https://hacks.mozilla.org/2019/03/standardizing-wasi-a-webassembly-system-interface/).
- `--sysroot ${WASI_LIBC_HOME}`. Replaces the standard library with wasi-libc.
- `-Oz`. Aggressive optimization.
- `-v` Verbose output.
- `-Wl,-import-memory`. Require that the Wasm instance be supplied with `WebAssembly.Memory` instance.
- `-Wl,-wrap,clock`. Wraps the `clock` standard library function, for reasons described below. Note the single dash (`-`).
- `-Wl,-export,malloc`. Make `malloc` available to the Wasm instance.
- `-Wl,-export,molfile_to_inchi`. Make `molfile_to_inchi` available to the Wasm instance.
- `-Wl,-no-entry`. Don't check for a `main` function.
- `-DTARGET_API_LIB`. One of four settings required by InChI.
- `${PLATFORM}`. Optionally includes the `-D__APPLE__` InChI flag.
- `-Iinchi/INCHI_BASE/src`. Path to search for InChI headers.
- `inchi/INCHI_BASE/src/*.c`. One path to InChI source files.
- `inchi/INCHI_API/libinchi/src/*.c`. Another path to InChI source files.
- `src/molfile_to_inchi.c`. Path to the file containing the wrapper function.
- `-o build/molfile_to_inchi.wasm`. The path to the compiled wasm file.

Deleting the `-Wl,-wrap,clock` option will result in a JavaScript runtime error. Depending on your browser, you may see:

- Safari. `TypeError: i64 not allowed as return type or argument to an imported function`
- Firefox. `TypeError: cannot pass i64 to or from JS`
- Chrome. `Uncaught TypeError: wasm function signature contains illegal type`

These errors [appear](https://github.com/unoplatform/Uno.Wasm.Bootstrap/issues/128) to trace back to the current [lack of support for 64-bit types](https://webassembly.org/docs/c-and-c++/) in browser-based Wasm implementations. The situation will eventually be corrected, but for now calls dealing with 64-bit types such as `clock` and `times` will require workarounds.

The `wrap` option lets us override the `clock` function - without touching the InChI code base. The tradeoff is that all of the code relying on time will be rendered inoperable. This doesn't affect InChI, at least not the way it's accessed in this article. However, other applications of InChI or other code bases may require more or less work to get past the 64-bit issue on browsers.

# index.html

The HTML file located at `web/index.html` invokes the `molfile-to-inchi.js` script and sets up the test harness. Note the presence of the `type="module"` attribute on the `<script>` tag, which is required.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>InChI WASM Test</title>
    <script type="module" src="../lib/molfile-to-inchi.js"></script>
    <style>
      label {
        font-size: 120%;
        font-weight: bold;
        padding-bottom: 1em;
      }

      #molfile {
        width: 100%;
        height: 400px;
        font-size: 120%;
        font-family: monospace;
        margin-bottom: 1em;
      }

      #inchi {
        width: 100%;
        height: 1.5em;
        font-size: 120%;
        font-family: monospace;
      }
    </style>
  </head>
  <body>
    <label for="molfile">Molfile:</label>
    <textarea id="molfile">

   CWRITER02282009502D
Created with ChemWriter - https://chemwriter.com
  6  6  0  0  0  0  0  0  0  0999 V2000
   75.8435  -39.8212    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
   84.5038  -44.8212    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
   93.1640  -39.8212    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
   93.1640  -29.8212    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
   84.5038  -24.8212    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
   75.8435  -29.8212    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
  1  2  2  0  0  0  0
  2  3  1  0  0  0  0
  3  4  2  0  0  0  0
  4  5  1  0  0  0  0
  5  6  2  0  0  0  0
  6  1  1  0  0  0  0
M  END</textarea>
    <label for="inchi">InChI:</label>
    <textarea id="inchi"></textarea>
    <script>
      const update = (molfile) => {
        let result;

        try {
          result = molfileToInChI(molfile);
        } catch (e) {
          document.querySelector('#inchi').value = 'ERROR';

          return;
        }

        document.querySelector('#inchi').value = result;
      };

      window.addEventListener('InChIReady', () => {
        const molfile = document.querySelector('#molfile');

        update(molfile.value);

        molfile.addEventListener('input', (e) => {
          update(molfile.value);
        });
      });
    </script>
  </body>
</html>
```

After setting up some styles and script invocations in the `<head>` element, the HTML file defines two text areas - one for molfile input and the other for InChI output. a `<script>` coordinates the interaction between the two, invoking the `molfileToInChI` function as needed.

# wasi.js

The file at `lib/wasi.esm.js` was copied verbatim from the  [wasmer-js project](https://github.com/wasmerio/wasmer-js). This file never needs to be changed and so can be used in any Wasm build. Projects not using the Standard C library do not need this file, but should make adjustments to the instantiation of the Wasm instance.

# inchi submodule

The InChI source code is installed as a [Git submodule](https://git-scm.com/book/en/v2/Git-Tools-Submodules) from [an unofficial InChI GitHub repository](https://github.com/metamolecular/inchi).

This method ensures that InChI-Wasm can continue to be compiled as updates to the InChI C source package are made.

# Conclusion

This article describes the first successful compilation of a molfile to InChI function from C to WebAssembly. The underlying library is a non-trivial code base written in C, none of whose files files were modified. This was accomplished using a stock LLVM installation and some support libraries. Emscripten was not used. Supporting files used in this project are compact and follow up-to-date practices.

The same approach outlined here could be applied to any cheminformatics or computational chemistry package written in C or C++. The recent arrival of the LLVM-based [F18 compiler](https://github.com/flang-compiler/f18) may even enable the compilation of older computational chemistry packages written in Fortran to WebAssembly.