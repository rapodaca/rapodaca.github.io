---
title: "Compiling InChI to WebAssembly Part 1: Hello InChI"
summary: "A step-by-step approach to building WebAssembly from an existing C project."
twitter: true
summary-image: images/posts/20190515/summary.png
published: "2019-05-15T13:30:00Z"
---

As noted in a [recent article](/articles/2019/05/01/javascript-for-cheminformatics-part-2/), WebAssembly adds a powerful new suite of tools to the Web development workshop. In particular, WebAssembly clears a path to running software written in arbitrary languages within a Web browser securely, and at near native speeds. Unfortunately, taking advantage of this new potential is non-trivial given that it requires expertise in both Web technologies and traditional build systems.

This article, the first in a series, shows how to compile a real-world C codebase to WebAssembly. Specific problems and general solutions are highlighted. In the end, the entire process will reveal itself to be much simpler than it might appear on the surface.

This first installment will show how to create an HTML page and associated assets that rather boringly runs the `main` InChI function and then promptly exits. Future installments will grow a dedicated library that can be called from a JavaScript running in the browser or Node.js.

# About WebAssembly

The [WebAssembly standard](https://webassembly.org) describes a binary instruction format that has been implemented by all major browsers since 2017. The aim of this standard is to provide a browser-embeddable, universal compile target that executes at native speed.

The idea of a browser-native universal compile target has been around for a long time. In the late 1990s, Java was viewed by many as the obvious choice. A multitude of mistakes, technical and political, rendered this idea unworkable. In 2013, the [first possible replacement](https://johnresig.com/blog/asmjs-javascript-compile-target/) began to take shape the form of [asm.js](http://asmjs.org). Asm.js is an optimizable subset of JavaScript that as the name suggests can be used as a kind of assembly language. Although it executes faster than JavaScript, asm.js suffers from sub-optimal parsing speed and large file size. WebAssembly represents a backward-compatible reformulation of asm.js that can be [parsed and encoded more efficiently](https://pspdfkit.com/blog/2018/a-real-world-webassembly-benchmark/). As such, tooling designed to generate asm.js can be adapted to also produce WebAssembly.

The current iteration of the WebAssembly specification is considered a [minimum viable product](https://webassembly.org/docs/mvp/) (MVP) by its creators. As such, many possible features and improvements have been left out for the sake of correctness. With increased traction and stability of the base system, these features and improvements can be expected to appear in WebAssembly.

# Emscripten

<div class="videowrapper">
  <iframe src="https://www.youtube.com/embed/o52_5qAJhNg" allowfullscreen></iframe>
</div>

[Emscripten](https://emscripten.org) transforms [LLVM](https://llvm.org) compiler output to both asm.js and WebAssembly. LLVM enjoys broad support as a compile target, meaning that any language that can be reduced to LLVM can in principle be further compiled to WebAssembly. A few years ago, I [showed how](http://metamolecular.com/inchi-js) to compile the InChI chemical identifier software to asm.js using Emscripten. With the more recent support of WebAssembly by all major browsers, it's time to update that work with an exhaustive description of how to compile InChI to WebAssembly.

# Goals

I approached this project with four main goals:

1. Don't modify the InChI source files in any way. Leaving the InChI source pristine means that this dependency can be readily swapped out to maintain compatibility with new releases.
2. Build a wrapper API written in C. This wrapper must get everything it needs from the InChI sources and must introduce no external dependencies.
3. Compile the wrapper and InChI dependencies into a single WebAssembly file (`*.wasm`).
4. The final result will be one JavaScript file (`*.js`) and one wasm (`*.wasm`) dependency.

This article focuses on Goal (1), compilation of unmodified InChI source. Subsequent articles will focus on the remaining three goals.

# Prerequisites

The following tutorial assumes you've [installed and activated](https://emscripten.org/docs/getting_started/downloads.html) the latest version of the Emscripten toolchain in your current environment. It also assumes you're running Mac OS, although other unix systems might work as well.

# Compile the Native Executable

Before attempting to compile to WebAssembly, we need to first understand how to compile a native binary. Emscripten replaces your existing compile toolchain with one capable of producing WebAssembly output. As such, it's very helpful to first develop a method to compile natively before attempting to use Emscripten.

My company maintains an unofficial InChI source code repository [here](https://github.com/metamolecular/inchi). Clone and make it your working directory. Alternatively, [download from the InChI site](https://www.inchi-trust.org/downloads/).

```bash
git clone https://github.com/metamolecular/inchi
cd inchi
ls
INCHI_API  INCHI_BASE INCHI_EXE  LICENCE    README.md  readme.txt
```

Two directories contain the source files we'll need: `INCHI_BASE`, and `INCHI_EXE`.

Although the InCHI repository contains makefiles, they're too tightly coupled to be useful for the purpose of cross-compilation. Instead, we'll need to devise a simple way to get the C compiler to build InChI's `main` function.

In the interest of keeping the InChI repository itself clean, create a `build` subdirectory and change into it:

```bash
mkdir build
cd build
```

[Error-driven devlopment](https://halogenandtoast.com/error-driven-development/) is a powerful way to learn new techniques. The idea is to begin with the simplest possible idea, no matter how unlikely to work. Then, using the error messages that result, figure out how to get to the next error. Continue until you either exhaust all errors or paths forward.

The simplest idea would be to invoke the C compiler directly on the file containing InChI's `main` function. It can be found at `INCHI_EXE/inchi-1/src/ichimain.c`. Attempting to compile `ichimain.c` directly gave:

```bash
cc \
  ../INCHI_EXE/inchi-1/src/ichimain.c
../INCHI_EXE/inchi-1/src/ichimain.c:50:10: fatal error: 'conio.h' file not found
#include <conio.h>
         ^~~~~~~~~
1 error generated.
```

`conio.h` is a MS-DOS header. Given that I'm compiling on a MacOS system, the error is to be expected. Searching the source for the text "`conio.h`" offers a clue. Starting on line 48 of the file `INCHI_BASE/src/ichiparm.c`, for example, we find:

```c
#ifndef COMPILE_ANSI_ONLY
#include <conio.h>
#endif
```

This suggests that we can move past the error by setting the `COMPILE_ANSI_ONLY` flag. This can be accomplished by updating the build command:

```bash
cc \
  ../INCHI_EXE/inchi-1/src/ichimain.c \
  -DCOMPILE_ANSI_ONLY
```

Doing so generates the new error:

```bash
../INCHI_EXE/inchi-1/src/ichimain.c:56:10: fatal error: 
      '../../INCHI_BASE/src/mode.h' file not found
#include "../../INCHI_BASE/src/mode.h"
         ^~~~~~~~~~~~~~~~~~~~~~~~~~~~~
```

Now would be a good time to point the compiler to its required headers. Browsing through the `INCHI_BASE/src` directory reveals it to contain many header files. We can include them with:

```bash
cc \
  ../INCHI_EXE/inchi-1/src/ichimain.c \
  -I../INCHI_BASE/src \
  -DCOMPILE_ANSI_ONLY
```

Again a new error. This time we're notified that:

```bash
In file included from ../INCHI_EXE/inchi-1/src/ichimain.c:56:
../INCHI_BASE/src/../../INCHI_BASE/src/mode.h:77:6: error: No build target
      #defined, pls check compiler options...
      (TARGET_EXE_STANDALONE|TARGET_API_LIB|TARGET_EXE_USING_API|TARGET_LIB_FOR_WINCHI)

```

For this build we're targeting an executable. We can let the compiler know about this choice with the following:

```bash
cc \
  ../INCHI_EXE/inchi-1/src/ichimain.c \
  -I../INCHI_BASE/src \
  -DCOMPILE_ANSI_ONLY \
  -DTARGET_EXE_STANDALONE
```

Running the updated command yields another error, but this time more cryptic than before:

```bash
[...]
3 warnings generated.
Undefined symbols for architecture x86_64:
  "_FreeAllINChIArrays", referenced from:
      _ProcessSingleInputFile in ichimain-787c41.o
[...]
```

The warning `Undefined symbols for architecture` means that the compiler failed to locate required functions or data structures. We've already included the header files from `INCH_BASE/src` but we haven't tried to compile any of the implementation files. We can fix that with:

```bash
cc \
  ../INCHI_EXE/inchi-1/src/ichimain.c \
  ../INCHI_BASE/src/*.c \
  -I../INCHI_BASE/src \
  -DCOMPILE_ANSI_ONLY \
  -DTARGET_EXE_STANDALONE
```

No errors! Listing the contents of the working directory yields a new file, `a.out`. This is the binary executable. For now, delete it.

```bash
rm a.out
```

We're almost there. All that remains is to generate a binary with a more descriptive name than `a.out`. This can be accomplished with the following change:

```bash
cc \
  ../INCHI_EXE/inchi-1/src/ichimain.c \
  ../INCHI_BASE/src/*.c \
  -I../INCHI_BASE/src \
  -DCOMPILE_ANSI_ONLY \
  -DTARGET_EXE_STANDALONE \
  -o inchi
```

This produces an executable called `inchi` in the working directory. It can be executed with the command `./inchi`. Verify that it produces the expected output by saving a molfile called `example.mol` to the working directory. Then execute the command:

```bash
./inchi example.mol
InChI version 1, Software v. 1.05 (inchi-1 executable)
Linux Build of May 13 2019 09:38:13
[... more output]
```

My `example.mol` file encoding benzene yielded the following output:

```bash
cat example.mol.txt
* Input_File: "example.mol"
Structure: 1
InChI=1S/C6H6/c1-2-4-6-5-3-1/h1-6H
AuxInfo=1/0/N:1,2,6,3,5,4/E:(1,2,3,4,5,6)/rA:6nCCCCCC/rB:d1;s2;d3;s4;s1d5;/rC:60.6483,-42.3537,0;69.3086,-47.3537,0;77.9689,-42.3537,0;77.9689,-32.3537,0;69.3086,-27.3537,0;60.6483,-32.3537,0;
```

# Compile InChI to WebAssembly

Having developed a command for compiling InChI using using the native compiler puts us in excellent position to cross-compile to WebAssembly. Be sure the Emscripten toolchain is [installed and activated in your current shell](https://emscripten.org/docs/getting_started/downloads.html). Then simply change the command (from `cc` to `emcc`) and destination (`inchi` to `inchi.html`):

```bash
emcc \
  -I../INCHI_BASE/src \
  ../INCHI_BASE/src/*.c \
  ../INCHI_EXE/inchi-1/src/ichimain.c \
  -DCOMPILE_ANSI_ONLY \
  -DTARGET_EXE_STANDALONE \
  -o inchi.html
```

On MacOS you're likely to see the following error:

```bash
../INCHI_BASE/src/util.c:1562:33: error: implicit declaration of function
      '__isascii' is invalid in C99 [-Werror,-Wimplicit-function-declaration]
        for ( i = 0; i < len && __isascii( p[i] ) && isspace( p[i] ); i++ )
```

[`__isascii`](https://docs.microsoft.com/en-us/cpp/c-runtime-library/reference/isascii-isascii-iswascii) is yet another a Windows-only API used by InChI. It's far from clear why the IUPAC team included multiple platform-specific dependencies by default in its build. Fortunately, it also provided workarounds.

Searching the source tree for the text `__isascii` reveals a hint in `INCHI_BASE/src/util.c`. Starting on line 47, we find:

```c
#if defined(COMPILE_ANSI_ONLY) && defined(__APPLE__)
/*    For build under OSX, advice from Burt Leland */
#include "ichicomp.h"    /* Needed for __isascii define */
#endif
```

Adding the `__APPLE__` flag gives the following command:

```bash
emcc \
  -I../INCHI_BASE/src \
  ../INCHI_BASE/src/*.c \
  ../INCHI_EXE/inchi-1/src/ichimain.c \
  -DCOMPILE_ANSI_ONLY \
  -DTARGET_EXE_STANDALONE \
  -D__APPLE__ \
  -o inchi.html
```

Executing this command produces three files: an HTML file that can be run in a browser; a JavaScript bootstrap file; and a wasm file containing the InChI source compiled to WebAssembly.

Success! 

# Testing in a Browser

At this point we're ready to test the generated WebAssembly. If you open the `inchi.html` file into your browser directly, you're likely to be greeted with a hung progress spinner and something like the following error:

```bash
both async and sync fetching of the wasm failed
```

The problem is that security constraints prevent modern browsers from opening resource files from pages loaded with the `file:///` protocol. We can work around this limitation by running a web server. A convenient lightweight server available on most systems is Python's [SimpleHTTPServer](https://docs.python.org/2/library/simplehttpserver.html). Execute it in your working directory with:

```bash
python -m SimpleHTTPServer
```

This server allows us to test the WebAssembly output by opening the `inchi.html` file. For example, if your server runs on localhost:8000, point your browser to [http://localhost:8000/inchi.html](http://localhost:8000/inchi.html). Doing so should yield the following window:

![InChI HTML](/images/posts/20190515/inchi-html.png)

There it is: InChI running in the browser!

But we're still not done yet. Although the `main` function has been called, no arguments were passed and the runtime promptly exited. InChI's help output has been displayed but nothing else. Much more interesting would be to obtain an InChI identifier from an arbitrary molfile interactively from the browser console or a JavaScript program.

# Conclusion

This article presents a step-by-step procedure for cross-compiling a representative C codebase to WebAssembly using Emscripten. Although there are a few small complications to pay attention to, the procedure for generating a native binary looks almost identical to the one for generating WebAssembly. As such, the instructions here should serve as a model for cross-compiling other C codebases.

For the moment, the result isn't much to look at. The next post in this series will show how to create a full-blown JavaScript API that generates InChIs from molfile strings.