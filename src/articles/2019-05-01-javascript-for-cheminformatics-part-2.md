---
title: "JavaScript for Cheminformatics, Part 2"
summary: "Once barely regarded as a real programming language, JavaScript's role in chemistry is growing quickly."
twitter: true
disqus: true
summary-image: images/posts/20190501/summary.png
published: "2019-05-01T11:00:00Z"
---

Back in the summer of 2008 I published a post about [JavaScript's current and future roles in chemistry](/articles/2008/07/15/javascript-for-cheminformatics/). In it, I cataloged the then-available smattering of chemistry software that had been written in JavaScript. I also said that despite poor performance and primitive tooling, JavaScript was uniquely positioned as a foundation for important chemistry software.

Since then, *a lot* has happened. This article recaps some highlights. It also speculates about possible future roles for JavaScript in chemistry. A [recent review](https://doi.org/10.1186/s13321-019-0331-1) by another author presents a different perspective.

# Performance Blasts Off

The most notable difference between the JavaScript of 2008 and today's Javascript is performance. A few months after my first post on JavaScript, Google announced the release of its new JavaScript runtime, [V8](/articles/2008/09/05/chrome-and-a-v8-javascript-takes-a-giant-leap-forward). This runtime demonstrated a 10-fold speed improvement over the state of the art. The introduction of V8 and its associated browser, Chrome, fundamentally changed the browser landscape. An intense competition between browser vendors ensued. But unlike the costly and counterproductive browser wars of the 1990s, the goal this time around was to run programs written in a [now-standardized language](https://www.w3schools.com/js/js_versions.asp) *faster* than competitors. The result has been a [nearly continuous sequence of performance improvements](https://v8.dev/blog/10-years) for V8 and the other JavaScript runtimes.

Today it's common for microbenchmarks to reveal a performance deficit of between two- and five-fold for code written in JavaScript versus comparable code written in C/C++.

<div class="videowrapper">
  <iframe src="https://www.youtube.com/embed/UJPdhx5zTaw" allowfullscreen></iframe>
</div>

# Browsers Blossom

The introduction of Chrome was followed by renewed, concerted efforts toward full adoption of existing Web standards by browser vendors, and the creation of new standards. These efforts gained additional momentum through [Apple's refusal](https://www.apple.com/hotnews/thoughts-on-flash/) to integrate either Flash or Java into its mobile products, and its aggressive promotion of standards-based alternatives.

Today's modern browsers support all of these standards. They include:

- **HTML5.** Introduces semantic markup, vastly increased capabilities for CSS, standardizes SVG for vector graphics, introduces the Canvas tag for dynamic raster graphics, adds audio and video elements, and includes other innovations.
- **WebGL.** Supports GPU-accelerated graphics.
- **Web Components.** Enables the creation of developer-defined HTML elements that behave nearly indistinguishably from native ones.

Perhaps the most important innovation introduced by Chrome was auto-update, a system now used by every modern browser. Long gone are the days when Web developers had to wait years before reliably deploying new features. The result was the long overdue [death spiral of Internet Explorer](https://techcommunity.microsoft.com/t5/Windows-IT-Pro-Blog/The-perils-of-using-Internet-Explorer-as-your-default-browser/ba-p/331732), and a much deeper commitment to the timely implementation of standards among browser vendors.

The stability and standards-compliance of today's browsers makes them a much more useful platform on which to build the kinds of rich, graphically-intensive user interfaces required by chemistry.

# Deployment Options Multiply

One year after the release of Chrome, the V8 runtime was re-packaged into a browser-less configuration called [Node.js](https://nodejs.org/en/). Similar repackaging of other JavaScript runtimes such as [JavaScriptCore](https://developer.apple.com/documentation/javascriptcore) (Safari), [SpiderMonkey](https://developer.mozilla.org/en-US/docs/Mozilla/Projects/SpiderMonkey) (Firefox), and [ChakraCore](https://github.com/Microsoft/ChakraCore) (Edge) has led to the penetration of JavaScript into nearly every crevice of the end-user software ecosystem. Noteworthy examples include:

- [Express](https://expressjs.com), a fast and lightweight Web server.
- NoSQL databases including [MongoDB](https://www.mongodb.com) and [CouchDB](http://couchdb.apache.org).
- [PLV8](https://plv8.github.io), a trusted JavaScript language extension for PostgreSQL.
- [Electron](https://electronjs.org), a framework for building native, cross-platform desktop applications.
- [React Native](https://facebook.github.io/react-native/), a framework for building native, cross-platform mobile applications.

These ever-increasing deployment options mean that code originally targeted for the Web browser can be re-purposed for completely different environments including native desktop and mobile applications, databases, and Web servers.

# JavaScript: The Universal Compilation Target

Chemistry applications often require sophisticated interactions with complex data structures such as molecular structures. In 2008, no software for doing so was available. However, a comment left on my original article was the first spark of a fire that continues to this day: cross-compilation.

> I think GWT(Google Web Toolkit) is a good starting point. It has the ability of running "Java code" as javascript generated by a special java2js complier.
> -<cite><a href="http://disq.us/p/grdn6">Duan Lian</a></cite>

Duan [later showed](/articles/2009/01/06/javascript-for-cheminformatics-cross-compiling-java-to-javascript-with-gwt-revisited/) that a lightweight cheminformatics library I had written in Java could be cross-compiled to JavaScript. He even built a simple 2D structure viewer using this approach. Eventually, Duan developed this early work into [jsMolEdit](/articles/2009/02/16/mx-at-work-building-a-pure-javascript-chemical-structure-editor/).

jsMolEdit used Google's [Google Web Toolkit](http://www.gwtproject.org) (GWT), a Java to JavaScript cross-compiler. Since the release of GWT, [many tools](https://github.com/jashkenas/coffeescript/wiki/List-of-languages-that-compile-to-JS#ruby) for transforming source code from a variety of languages into JavaScript have been created. Supported languages now include: Ruby; Python; Erlang; Perl; Scala; C#; Lisp; Haskell; Smalltalk; C; C++; and Go.

Seeing the abundance of cross-compilers capable of producing JavaScript, Scot Hanselman [noted](https://www.hanselman.com/blog/JavaScriptIsAssemblyLanguageForTheWebSematicMarkupIsDeadCleanVsMachinecodedHTML.aspx) that "JavaScript is Assembly Language for the Web," and [he wasn't far off the mark](https://www.hanselman.com/blog/JavaScriptisAssemblyLanguagefortheWebPart2MadnessorjustInsanity.aspx).

# WebAssembly

JavaScript was never designed as an assembly language, but the explosion of transpilers demonstrated an acute need for such functionality. Back in 1995 when Java was the new kid on the block, it was a widely held developer view that Java applets, running within the a browser plugin, could play the role of a universal runtime ("write once, run anywhere" was the slogan). However, years of mismanagement of the Java plugin by Sun then by Oracle made the realization of this vision impossible. JavaScript became by default the only option for a cross-browser, multi-language runtime.

Based on clearly-demonstrated need, a consortium of groups began work on the WebAssembly standard (aka "Wasm") in 2015. The [Mozilla Developer Site](https://developer.mozilla.org/en-US/docs/WebAssembly/Concepts) describes WebAssembly as follows:

> WebAssembly is a low-level assembly-like language with a compact binary format that runs with near-native performance and provides languages with low-level memory models such as C++ and Rust with a compilation target so that they can run on the web. (Note that WebAssembly has the high-level goal of supporting languages with garbage-collected memory models in the future.)

WebAssembly is a relatively new and rapidly-evolving technology. As of November 2017, all major browsers (Safari, Firefox, Edge, Chrome, and Opera) supported WebAssembly by default. Bi-directional interoperability between JavaScript and WebAssembly is possible, as is DOM manipulation, but not natively. Interfacing WebAssembly with the browser environment therefore requires some glue code, the generation of which can fortunately be automated. Rust offers the best support for this tooling through its [wasm-bindgen](https://github.com/rustwasm/wasm-bindgen) and [web-sys](https://rustwasm.github.io/2018/09/26/announcing-web-sys.html) crates, respectively. At least one proposal for a [WebAssembly garbage collector](https://github.com/WebAssembly/gc) is in progress, and would pave the road for JVM language support. Following a now-familiar pattern, [standalone WebAssembly runtimes](https://github.com/appcypher/awesome-wasm-runtimes) have begun to appear, hinting at ubiquitous use of the interpreter as a secure compile target.

# The Language Evolves

Beyond runtime environment upgrades, JavaScript the language has undergone major improvements. The most sweeping of these falls under the umbrella "ECMAScript 6" (ES6). Noteworthy new features of ES6 include:

- **Destructuring.** Greatly simplified syntax for manipulating the properties of both arrays and objects.
- **Arrow Functions.** Simplified function declaration syntax that clarifies the meaning of "this."
- **Class Notation.** Syntax overlay for generating class-like data structures (but see [this caveat](/articles/2019/03/04/class-free-object-oriented-programming/)).

Still more improvements have made their way to all major JavaScript implementations. Vastly improved support for source code composition comes by way of [ES Modules](https://flaviocopes.com/es-modules/). All major browsers currently support this system, and support on Node.js is slowly but surely being finalized. `async`/`await` replaces ["Callback Hell"](https://blog.hellojs.org/asynchronous-javascript-from-callback-hell-to-async-and-await-9b9ceb63c8e8) with notation that looks indistinguishable from traditional code save for two new keywords.

# UI Tooling Proliferates

For years, JavaScript languished as an application development language due to its lack of good high-level UI tooling. This situation has changed dramatically within the last few years with the appearance of many mature frameworks. Paradoxically, this abundance has lead to a backlash known as ["JS Fatigue"](https://dev.to/banesag/javascript-fatigue--bhh).

The noise around competing UI systems can be distracting, but fortunately most frameworks and toolkits are at this point are merely re-working the same handful of ideas. By far, the most influential of these is ["Reactive Programming"](https://gist.github.com/staltz/868e7e9bc2a7b8c1f754), which was popularized by [React](https://reactjs.org). A firm grounding in Reactive Programming will go far in building a fast, functional user interface.

# Developer Tools Abound

In 2008, the state of JavaScript developer tools was for the most part abysmal. The introduction of Chrome changed that. For the first time Web developers had at their fingertips a rich suite of debugging and profiling tools that over time began to rival that of any other language.

In 2015 Microsoft introduced [Visual Studio Code](https://code.visualstudio.com), a multi-language source code editor (written in a superset of JavaScript called [Typescript](https://www.typescriptlang.org)). Among other essential features such as fast startup, smooth response, and a streamlined yet full-featured user interface, it offers a built-in [debugger](https://depth-first.com/articles/2019/01/17/debugging-es-modules-with-mocha-in-vs-code/) for JavaScript running outside the browser.

# Applications Arrive

In early 2011 [my company](https://metamolecular.com) released [ChemWriter&nbsp;2](https://depth-first.com/articles/2011/01/12/ten-reasons-to-use-chemwriter-in-your-next-web-application/), a chemical structure editor written entirely in JavaScript. Our first customer, eMolecules, continues to deploy the software on its [home page](https://emolecules.com).

Started in late 2009, ChemWriter&nbsp;2 was built using tools that can charitably called "awkward." To give an idea of the challenges, consider the default deployment environment. Internet Explorer 6, given its entrenched position in large organizations, was the de facto runtime. Its JavaScript performance was awful, so every new ChemWriter feature needed to be rigorously optimized and tediously tested across the entire sorry lineup of Microsoft browsers. Notorious for quirks in both its [HTML layout and DOM](https://css-tricks.com/ie-css-bugs-thatll-get-you-every-time/), IE set the frustration standard for a generation of Web developers. Its vector graphics system, [VML](https://depth-first.com/articles/2008/06/06/the-other-vector-graphics-markup-language/), barely worked and there was no support for SVG. Google's Closure library and compiler were used to mitigate these inconsistencies. [ChemWriter&nbsp;3](https://chemwriter.com), the current iteration, dropped support for IE6 altogether but continued its use of Google Closure. Today, most of Closure's functionality has been rendered redundant by advances in the Web browser platform.

Other advanced chemistry tools and applications have been released over the years. Noteworthy examples include:

- [JSmol](https://chemapps.stolaf.edu/jmol/jsmol/jsmol.htm) and several other 3D molecular visualization tools
- [ChemDoodle Web Components](https://web.chemdoodle.com)
- [JSME](https://peter-ertl.com/jsme/)
- [Marvin JS](https://chemaxon.com/products/marvin-js)
- [ChemDrawJS](https://www.perkinelmer.com/product/chemdraw-direct-chemdrawdi)
- [WebMolKit](http://molmatinf.com/webmolkit.html)
- [Kekule.js](http://partridgejiang.github.io/Kekule.js/)
- [Ketcher](https://github.com/epam/ketcher)
- [smilesDrawer](https://github.com/reymond-group/smilesDrawer)
- [RDKit.js](https://github.com/rdkit/RDKitjs)
- [InChI.js](http://metamolecular.com/inchi-js)

# A Continuing Unmet Need

In 2008 I noted [crucial lack of cheminformatics tooling written in JavaScript](/articles/2008/07/15/javascript-for-cheminformatics/):

> So, one answer to the question of what would be the most useful JavaScript tool for cheminformatics could be: a low-level cheminformatics toolkit that understands chemical structures and their associated graph operations.

Despite the appearance of several end user chemistry tools, the gap in developer tools accessible from JavaScript continues to this day. Ideally, a broadly-applicable cheminformatics toolkit would have all of the following properties:

- distributed as a collection of ES modules for easy integration and minimum bloat
- fully unit tested for quality control
- ready to run in either Node.js or the browser
- accompanied by full, un-obfuscated source code
- permissive, non-reciprocal (i.e., non-copyleft) licensing
- minimal startup overhead for optimal user experience
- compact distribution enables use on resource-constrained devices
- a minimal, well-documented and supported build process

For various reasons, none of the currently-available JavaScript packages hit all of these points. Most of them were conceived as applications, not developer toolkits. As such their core functionality can only be reused with great effort. The three packages that might serve in this capacity (Kekule.js, RDKit.js, and WebMolKit) miss on one or more points including lack of ES module support, lack of unit tests, slow startup time, convoluted build process, or the use of restrictive licensing terms.

This gap hampers the future development of chemistry applications. Without robust, general-purpose cheminformatics tooling, each application will be forced to invent its own, a daunting prospect in any setting but even more so in the relatively constrained environment of the Web browser.

# The Trouble with Foreign Code

Presented with the lack of a general-purpose, JavaScript-native cheminformatics toolkit, some developers have resorted to cross-compiled foreign code. Examples include:

- [RDKit.js](https://github.com/rdkit/RDKitjs), compiled from [RDKit](https://www.rdkit.org)
- [InChI.js](https://github.com/metamolecular/inchi-js), cross-compiled from [InChI](https://iupac.org/who-we-are/divisions/division-details/inchi/)
- [Cheminfo-to-web](https://partridgejiang.github.io/cheminfo-to-web/demos/items/OpenBabel/openBabelDemo.html), cross-compiled from [Open Babel](http://openbabel.org/wiki/Main_Page)
- [OpenChemLib JS](https://cheminfo.github.io/openchemlib-js/docs/index.html) cross-compiled from [Openchemlib](https://github.com/Actelion/openchemlib)

Node.js enables another mode of interfacing with native code through the [foreign function interface](https://github.com/node-ffi/node-ffi) (FFI). Examples include [Indigo Node](https://github.com/epam/indigo-node) and [OpenBabel Node](https://github.com/mohebifar/openbabel-node). However, this approach won't work for browser JavaScript, which can't interface with native binaries.

If deploying to a browser, one of the most persistent problems with cross-compilation will be performance. In the case of InChI JS, I've noticed performance hit of between two and tenfold. For one-off functions, this is hardly a problem, but at scale, the performance gap can quickly make certain operations impractical. Fixing these problems requires an enormous amount of skill. Memory bugs can be virtually impossible to track down given the lack of good tooling.

The size of the compiled output also quickly leads to problems, a situation I call "the big blob problem". Although internet connections and browsers are fast today, it's not uncommon to load a megabyte or more of JavaScript from a cross-compiled foreign library. On top of everything else a page needs to load, including a sophisticated user interface, the overhead can quickly lead to noticeable performance defects, particularly on handheld devices.

WebAssembly appears able to mitigate the big blob problem through various optimization settings. Perhaps concerted efforts along these lines could bear fruit.

But even if they do, another problem will remain for many application developers. JavaScript is rapidly standardizing on [ES Modules](https://flaviocopes.com/es-modules/) as the single mode of distribution for the browser and anywhere JavaScript runs. Under this system, active code (often broken down to the single function level) is injected into an application. Doing so many times throughout an application creates a dependency graph that can be used to define distribution bundles containing only necessary code. A big library blob, as produced from cross-compilation, typically includes vastly more code than will be used by a given application. Although specialty bundles can be prepared, this represents an imperfect workaround at best.

Even if the big blob problem can be addressed and it eventually becomes possible to compile WebAssembly at the appropriate ES module level of granularity, two more problems will remain. First, JavaScript and any cross-compiled code will be operating at arm's length from each other. Efficiently passing rich objects between the two environments is currently an area of active research, [especially in Rust](https://hacks.mozilla.org/2018/10/calls-between-javascript-and-webassembly-are-finally-fast-🎉/), but there is as yet no good solution to this problem. Second, debugging cross-compiled native code within the context of a running browser application will present challenges for the foreseeable future.

# Predictions

What was considered impossible in 2008, the deployment of rich browser application interfaces for chemistry - without plugins, is now feasible and becoming routine. JavaScript was finally taken seriously and the results are sometimes astounding. This leaves the intriguing question of where all of this is headed. Below I offer some speculations.

## 1. Incremental Innovation

The HTML5/ES platform is now very mature, with a vast installed base, a thriving developer community, and a fortress of implemented standards. Calls for stabilization and optimization will likely dominate discussions in working groups going forward. Laggards and fence-sitters will be jumping in with full force, further motivating a conservative approach to future API changes.

Following a now-familiar "backfill" pattern, new APIs are likely to be introduced only to facilitate those things already being done by many developers through add-on libraries and other workarounds.

## 2. WebAssembly is a Big Deal

Most of the improvements to JavaScript and the browser for the foreseeable future will be driven by the intense interest in WebAssembly. Described by its creators as a "proof-of-concept," the first iteration of WebAssembly has rapidly been embraced as a potential replacement for JavaScript. Given the lengths that some developers will go to avoid writing JavaScript, it seems likely that the next big push will be to bring WebAssembly up to par with JavaScript as a first-class browser citizen capable of full, fast manipulation of the DOM and all other Web APIs. Interoperability between JavaScript and WebAssembly is already emerging as a critically-needed capability.

WebAssembly's ability to run as a securely sandboxed alternative to native compile targets, together with its widespread deployment even at this early stage, hints at a future in which WebAssembly becomes a standard target for most compiled languages.

It seems obvious at this point that within the near-term many groups will attempt to compile critical computational chemistry libraries, many of which are written in Fortran and C, to WebAssembly. This will lead to an abundance of high-powered chemistry functionality with relatively little in the way of user interface to power it.

## 3. Performance Gains

The long history of JavaScript performance gains may show signs of slowing, but not stopping. Whereas early runtime optimizations focused on microbenchmarks, today's benchmarks emphasize whole-page rendering performance. It's difficult to imagine another large performance gain like the one introduced by V8 on the horizon, but this should not be discounted too quickly. For example, the intense research around WebAssembly may lead to fundamentally more efficient ways of implementing the JavaScript runtime.

## 4. Wither Desktop Software?

The dual forces of ever-better Web browser performance and relentless diffusion of the Web technology stack can be expected to exert a major influence on the way chemists use computers. It's still way too early proclaim the death of desktop software, but the time is rapidly approaching when chemists won't be able to tell the difference between using a website and running a thick client.

## 5. New Kinds of Applications

As browser applications begin to reach, and possibly exceed, performance parity with desktop applications, I expect new generes of chemistry software to appear. I don't know exactly what form they'll take or what problems they solve, but I suspect they'll inject an unprecedented level of collaboration and simplification into existing workflows.

Consider the case of [SolidWorks](https://www.solidworks.com) vs. [OnShape](https://www.onshape.com). SolidWorks has been the industry standard for 3D mechanical modeling for years. It's an extremely complicated, computationally-demanding application. In 2015 OnShape released the first public beta of its eponymously-titled browser-based alternative to SolidWorks. Not only does OnShape support the most useful core functionality of SolidWorks, but in most cases it does so far better through a streamlined, carefully constructed interface. Rendering performance is at least as good as that of SolidWorks. However, the biggest reason to use OnShape is not the smooth motion, streamlined interface, or sheer joy of flushing a convoluted, bug-riddled installation procedure. The best part is how OnShape brings collaboration and revision control to a product genre that previously treated it as an afterthought. Whereas teams used to struggle with how to collaborate on designs using SolidWorks, collaboration falls out as a natural consequence of using OnShape.

<div class="videowrapper">
  <iframe src="https://www.youtube.com/embed/pMWnsHpDlQE" allowfullscreen></iframe>
</div>

# Conclusions

Its first release written in a matter of days by a then-obscure company, JavaScript may be the most unlikely success story in all of software. Having emerged from a dark period lasting until the mid-2000s, today's JavaScript is a full-featured programming language wrapped in a rich, mass-deployed environment. Chemistry has been extremely slow to follow the direction charted by the rest of the software industry, but glimpses into the future are everywhere.