---
title: Types without TypeScript
summary: "Build type-safety into JavaScript projects without sacrificing language or tooling."
twitter: true
summary-image: images/posts/20211020/summary.png
published: "2021-10-21T02:30:00Z"
updated: "2021-10-21T14:20:00Z"
---

An oft-cited element of JavaScript's success is dynamic typing. The language's minimal type system means that type errors are reported at runtime. This flexibility can be liberating during early work lacking a clear design. But like any technology, there are tradeoffs. A project that grows in size, complexity, or developer count can expose the true costs of dynamic typing. This article takes a look at the problem and offers a detailed solution that works without transpilers, new languages, or unusual tooling.

# QuickStart

The discussion that follows uses the source code and configurations found in [this repository](https://github.com/rapodaca/typed-javascript). To start using types with JavaScript, clone the repo, run the `tsc` task, and replace the source code with your own.

<figure>
  <img alt="Types in JavaScript" src="/images/posts/20211020/demo.mp4">
  <figcaption>
    <strong>Types in JavaScript.</strong> Applying JavaScript type hints through JSDoc tags. The result is valid JavaScript, but with annotations that allow the detection of type errors prior to runtime.
  </figcaption>
</figure>

# Why Not TypeScript?

One method of adding types to JavaScript is [TypeScript](https://www.typescriptlang.org). TypeScript is a statically-typed language that compiles to JavaScript. Unlike languages such as Java or Rust, types are optional in TypeScript. In other words, TypeScript lets you pay as you go. Like many statically typed languages, TypeScript supports type inference so that needless type information can be elided, while retaining all of the benefits of typed values.

Since its introduction in 2012 by Microsoft, the tooling and popularity of TypeScript have grown considerably. The 2021 [StackOverflow Developer Survey](https://insights.stackoverflow.com/survey/2021) placed Typescript as the sixth most commonly used programming language and the third "most loved" language. 

Given the activity around TypeScript, why not just use it? There are several reasons:

- *TypeScript is not JavaScript.* Claims that TypeScript is a "superset" of JavaScript, are [questionable at best](https://stackoverflow.com/questions/29918324/). A more accurate model would consider TypeScript and JavaScript to be mutually exclusive languages with a common ancestry. In other words, it's possible to create programs in one language that are incompatible with the other.
- *TypeScript must be compiled.* None of the most prevalent runtimes, either browser-based or Node.js, support TypeScript directly. The only way to use TypeScript programs on these platforms is to transpile it to JavaScript. This dependency can set up a cascade of events that may pose serious challenges for a project. For example, with a compiler comes a [compile time](https://dev.to/alekseiberezkin/typescript-is-slow-what-can-we-do-about-it-30hm) that can in extreme cases interfere with development itself. This interference may not be clear until a project is well underway.
- *All-or-Nothing.* Although many things can change during a project, the programming language is the least likely to do so given its all-encompassing nature. Backing out of a TypeScript experiment gone wrong could be expensive.
- *Future JavaScript compatibility.* Although TypeScript and JavaScript may be close cousins, they are separate languages. Each feature added to either language raises the possibility of mutual incompatibility down the road. For example, if syntax-level type annotations (à la Python 3) ever make it into JavaScript, there's no guarantee that they would be compatible with TypeScript.
- *Maintainability.* The more TypeScript and JavaScript diverge, the more difficult it will be to cross-train developers on each language. After a number of years, the current main advantage of TypeScript, close syntactic similarity to JavaScript, could fade. This could cause problems with a TypeScript project's long-term maintenance.
- *Existing projects must be ported.* The mutual incompatibility of the two languages in the general sense means that adopting TypeScript on an existing project guarantees some form of rewrite. The benefits may not justify the costs.

What if there were a low-risk path from JavaScript to JavaScript with types?

# JSDoc

[JSDoc](https://jsdoc.app) is JavaScript's documentation markup system. One of its most valuable uses is type annotation. A system of tags, preceded by the at symbol (`@`), makes it possible to describe the shape of data within a JavaScript program at high resolution. Consider the following simple example:

```javascript
/**
 * @param {number} i
 * @param {string} j
 * @returns {number}
 */
const add = (i, j) => {
  return i + parseFloat(j);
};
```

Changing the `add` function in a way that's incompatible with the JSDoc type annotations causes VS Code to complain noticeably and actionably.

<figure>
  <img alt="Type Error" src="/images/posts/20211020/type-error.png">
  <figcaption>
    <strong>Types Error.</strong> VS Code detects an attempt to add a number to a string. Without type information, this error may not be apparent.
  </figcaption>
</figure>

Although JSDoc's original purpose was documentation, it is increasingly being used as a detachable type system for JavaScript. I say "detachable" because the type information itself is cleanly separable from the code, unlike TypeScript. Detachable typing has been driven by two major forces over the last dozen years or so:

- [Closure Tools](https://developers.google.com/closure) (aka "Closure"). Two components, a compiler and a comprehensive standard library, use JSDoc type annotations extensively. Although Closure's importance has waned over the years, it was the first large-scale effort to implement a type system on top of JavaScript. 
- TypeScript. In many respects, TypeScript has picked up where Closure left off. There are two factors at play. First, VS Code has for some time provided type hints based on JSDoc. Second, most of TypeScript's type system has been ported to JSDoc.

The combination of VS Code and JSDoc type annotation tags means that developers can get most of the advantages of statically typed languages without having to sacrifice the tooling, universal deployability, or developer expertise of JavaScript.

# Typed JavaScript

The use of JSDoc as a lightweight typing system for JavaScript yields something I call *Typed JavaScript*. Typed JavaScript is a system of tooling and conventions that exposes type hints and type errors before a program is run. JavaScript lacks a mandatory compile step, so it doesn't make much sense to talk about [static typing](https://en.wikipedia.org/wiki/Type_system). But Typed JavaScript offers the same main advantage as a compiled, statically typed language.

The benefits of pre-execution type checking in dynamically-typed languages are worth considering. Unit tests can only address some of the errors that code may be exposed to. Used together with a good test suite, typed JavaScript can make most bugs more visible, and sooner, than would otherwise be possible.

Developers using Python 3 have come to similar conclusions. For example, the [urllib3](https://github.com/urllib3/urllib3) team completed a retrofit of type hints onto the most downloaded package on the Python Package Index. The lead maintainer, [Seth Larson](https://sethmlarson.dev/), recently wrote in detail about the experience, [concluding](https://sethmlarson.dev/blog/2021-10-18/tests-arent-enough-case-study-after-adding-types-to-urllib3):

> Adding type hints to urllib3 was clearly a huge amount of work, hundreds of engineer hours across several months. What we once thought would be a purely developer-facing change ended up making the codebase more robust than ever. Several non-trivial logic errors were fixed and our team is more confident reviewing and merging PRs. This is a big win for our users and a very worthy investment.

JavaScript may lack language support for types in the Python 3 sense, but this can be simulated with Typed JavaScript.

# Using Typed JavaScript

"Typed JavaScript" is a name I made up to describe a loose collection of practices around detachable types in JavaScript. The history and extent of these practices is currently murky. What's clear is that the approach has a following, as evidenced by this [Question](https://stackoverflow.com/questions/45836847/) and many like it. In 2019, Stefan Baumgartner described some of the same conventions described here in an article titled *[TypeScript without TypeScript -- JSDoc superpowers](https://fettblog.eu/typescript-jsdoc-superpowers/)*. Developers are using detachable types, but understanding how is hampered by the lack of a label under which to bring all of the documentation.

This amorphous quality leads to the main challenge when using Typed JavaScript, lack of documentation. It can be seen most clearly along two axes: syntax and tooling. Syntax is challenging because JSDoc bears the marks of many different influences over many years. As a result, not all type formulations will work with all tools. A lot of documentation is therefore of limited value. 

This brings us to tooling. Typed JavaScript as I'll document it here is powered by [Microsoft Visual Studio Code](https://code.visualstudio.com) ("VS Code"). This is the pre-eminent IDE for TypeScript. As a result, it's not hard to find a lot of current, good documentation around using VS Code and TypeScript together. What's much harder is finding good documentation on the alternative approach involving JSDoc comments.

As I've worked with Typed JavaScript in my current project, one of the biggest gaps I've found is how to formulate JSDoc type tags in a way that VS Code can translate to useful JavaScript type information.

# Common Tag Patterns

Wikipedia notes that a ["Design Pattern"](https://en.wikipedia.org/wiki/Software_design_pattern) embodies a "reusable solution to a commonly occurring problem within a given context of software design." While working with Typed JavaScript, I've found it helpful to compile patterns of common use.

The following examples stick with the convention I've found handy &mdash; use JSDoc annotations exclusively, rather than mixed JSDoc/JavaScript. By mixed JSDoc/JavaScript, I mean something like the following:

```javascript
// Mixed JS/JSDoc style is not recommended.
const Product = class {
  /**
   * @param {Region} region
   * @returns {Currency}
   **/
  price (region) { throw new Error('unimplemented'); }
};
```

For reasons I won't get into now, I find it cleaner and easier to avoid the above style and instead define complex types entirely within JSDoc.

Microsoft has published a [JSDoc Reference](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html), which is useful for understanding specific syntax. However, this reference lacks higher-level principles for composing tags. What follows is a small start on that.

## Optional Value

One of the most useful tag patterns is also the simplest. When a value may be of some type or `null`, a shortcut can be used.

```javascript
/**
 * @param {string} first
 * @param {string} last
 * @param {string?} middle
 */
const printName = (first, last, middle) => {
  return `${first} ${middle === null ? '' : middle} ${last}`;
};
```

The question mark (`?`) after the `string` type means that the value of `middle` is "nullable." Attempting to pass anything other than a `string` or `null` results in an error.

```javascript
// ERROR: Argument of type 'undefined' is not assignable to parameter of type 'string | null'.ts(2345)
printName('John', 'Public', undefined);
```

A different kind of type restriction may be desired. For example, to restrict a value to `string` or `undefined`, use the following syntax:

```javascript
/**
 * @param {string} first
 * @param {string} last
 * @param {string|undefined} middle
 */
const printName2 = (first, last, middle) => {
  return `${first} ${middle === null ? '' : middle} ${last}`;
};

// No error.
printName2('John', 'Public', undefined);
```

## Struct

Many languages have the concept of a bag of values or "struct." JavaScript has object literals, but values can assume any type by default. To constrain values, use the [`@typedef`](https://jsdoc.app/tags-typedef.html) tag:

```javascript
/**
 * @typedef {object} User
 * @property {string} first_name
 * @property {string} last_name
 * @property {number} id
 */
```

The following would assign a value of type `User`:

```javascript
const user = { first_name: 'Alice', last_name: 'Smith', id: 123 };
```

## Union Type

It's sometimes helpful to designate a data structure as satisfying more than one type constraint. The idea is somewhat analogous to multiple inheritance. This can be accomplished through a union type:

```javascript
/**
 * @typedef {object} Foo
 * @property {string} name
 *
 * @typedef {object} Bar
 * @typedef {number} age
 *
 * @typedef {Foo & Bar} FooBar
 */
```

Object literals like the one below would satisfy `Foo` type constraints, and would be usable wherever a `Foo` or a `Bar` is required:

```javascript
const foobar = { name: 'John', age: 42 };

/** 
 * @param {Foo} foo 
 * @returns {string}
 */
const checkFoo = (foo) => foo.name;

/** 
 * @param {Bar} bar 
 * @returns {string}
 */
const checkBar = (bar) => bar.name;

checkFoo(foobar);
checkBar(foobar);
```

## Generics

In statically typed languages, we think of generics as broadening the range of possible types a value may assume. In JavaScript, however, it makes more sense to view generics as *constraining* the allowed types of a value. Consider a generic `Range` data structure, for example:

```javascript
/**
 * @template T
 * @typedef {object} Range
 * @property {T} start
 * @property {T} end
 */
```

A range comprised of two different types makes little sense. So the type parameter `T` constrains the allowed values of `start` and `end`. Whatever type we use for one property must match the other. The following object literal satisfies the constraints of `Range` because `start` and `end` properties are of the same type (`number`):

```javascript
const alphabet = {
  start: 13,
  end: 42
};
```

Passing type parameters narrows the range of types even further. For example, a function can restrict itself to only numerical ranges as follows:

```javascript
/**
 * @param {Range<number>}
 * @returns {number}
 */
const distance = range => {
  // find distance implied by range
  throw new Error('not implemented');
};
```

Later we may decide that `distance` should only work with types whose values conform to a `Comparable` interface. In that case, the range of allowed types can be restricted by a type parameter of type `Comparable`:

```javascript
/**
 * @typedef {object} Comparable
 * @property {function(Comparable): number} compare
 */

/**
 * @template {Comparable} T
 * @param {Range<T>} first
 * @param {Range<T>} second 
 * @returns {number}
 */
const distance2 = (first, second) => {
  if (first.start.compare(second.start) > 0) {
    // first precedes second
  } else {
    // second precedes first
  }

  throw new Error('not implemented');
};
```

## Function

Because functions can be passed as parameters, it makes sense to restrict the parameters associated with them. This comes up, for example, in [higher-order functions](https://en.wikipedia.org/wiki/Higher-order_function). The types associated with a function can be constrained using the [`@callback`](https://jsdoc.app/tags-callback.html) tag. It might seem as if [`@function`](https://jsdoc.app/tags-function.html) would be a better choice, but it is currently not recognized by VS Code:

```javascript
/**
 * @callback add
 * @param {number} i
 * @param {string} j
 * @returns {number}
 */
```

The following would satisfy the restrictions for `add`:

```javascript
/**
 * @type {add}
 */
const myAdd = (i, j) => i + parseFloat(j);
```

Alternatively, a function parameter or return type can be specified inline.

```javascript
/**
 * @param {number} attenuation
 * @returns {function(number, number): number}
 */
const createAdder = attenuation => {
  return (i, j) => attenuation * (i + j);
};
```

## Enum

Sometimes we want to restrict the range of specific values a particular type may assume. This can be accomplished with enums.

```javascript
/**
 * @typedef {object} Car
 * @property {'GM'|'Ford'|'Chrysler'|'Tesla'|'Toyota'} make
 */
```

The following object literal would satisfy the `Car` type constraint:

```javascript
const car = { make: 'Tesla' };
```

## Record

Some situations call for a dictionary-like data structure with values of the same type. For example, a web application may extract query parameters from a URL. If all values of are the same type (e.g., `string`), a `Record` can be used.

```javascript
/**
 * @param {Record<'first_name'|'last_name', string?>} query
 */
const handle = query => {
  const { first_name, last_name } = query;
};
```

`Record` is an example of TypeScript's built-in [utility types](https://www.typescriptlang.org/docs/handbook/utility-types.html).

## Utility Types

One of TypeScript's best features is utility types. As [documented by Microsoft](https://www.typescriptlang.org/docs/handbook/utility-types.html), utility types "facilitate common type transformations."

Consider a situation in which we want to ensure the immutability of a value passed to a function. This can be accomplished with the `Readonly` utility type:

```javascript
/**
 * @typedef {object} Person
 * @property {number} experience (in years)
 * 
 * @param {Readonly<Array<Person>>} people
 */
const cumulativeExperience = people => {
  people.pop(); // ERROR: Property 'pop' does not exist on type 'readonly Person[]'.ts(2339)

  return people.reduce((total, person) => total + person.experience, 0);
};
```

Several other utility types are available.

## Interface

An interface is a collection of methods associated with the same value. Although JavaScript lacks the concept of interface, it can be simulated as a `typedef`.

```javascript
/**
 * @typedef {object} Animal
 * @property {function(string): string} talk
 * @property {function(): string} walk
 */

/** @type Animal */
const duck = {
  talk: name => `Quack quack, ${name}`,
  walk: () => 'Waddle, waddle.'
};
```

## Async/Await

JavaScript implements async/await on top of [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise). This legacy shows through in the type signature for async functions (`@returns {Promise<T>}`).

```javascript
/**
 * @typedef {object} Employee
 * @property {number} wage
 * 
 * @typedef {object} Database
 * @property {function(number): Employee} getEmployeeById
 * 
 * @param {number} id
 * @param {Database} db
 * @returns {Promise<number>}
 */
const wage = async (id, db) => {
  return await db.getEmployeeById(id).wage
};
```

# Imports

It's common practice to define a type in one JavaScript file and use it in another. Two procedures are available, both of which use the `import` directive.

But before getting to the syntax, a crucial point must be understood. Types will be assigned to a global namespace unless they reside in a module. To add a type to a module, ensure that it is defined within a file that uses the `export` keyword. Every Typed JavaScript type definition should reside in a module.

The following illustrates a minimal type definition and export:

```javascript
/** @typedef {object} Foo */

export { }
```

Given that a type is defined within a module, it can be imported with:

```javascript
// ./point.js
/**
 * @typedef {object} Point
 * @property {number} x
 * @property {number} y
 */

export { }

// ./functions/x-distance.js
/**
 * @param {import('../point.js').Point} point
 * @param {number} x
 * @returns {number}
 */
const xDistance = (point, x) => {
  return x - point.x
};

export { }
```

Alternatively, types can be imported using an ES6 module style as follows:

```javascript
/** @typedef {import('../point.js').Point} Point */

/**
 * @param {Point} point
 * @param {number} x
 * @returns {number}
 */
const xDistance = (point, x) => {
  return x - point.x
};

export { }
```

I favor the latter style because it better parallels the structure of most ES6 code. JSDoc `import` directives can be placed at the top of a file, just after the ES6 imports.

# Using TypeScript Libraries

JavaScript runtimes expose various objects that can be used without instantiation or explicit import. Out of the box, VS Code won't know which of these objects can be referenced safely. For example, the `console` object exists both in browsers and Node.js contexts.

However, using `console` will generate a VS Code error by default:

```javascript
console.log('Wat?'); // ERROR: Cannot find name 'console'. Do you need to change your target library? Try changing the 'lib' compiler option to include 'dom'.ts(2584)
```

Unfortunately, the error message's suggestion is misleading. The way to resolve the error is to add "@types/node" to your NPM dev dependencies, followed by invocation of `npm i`:

```json
{
  "type": "module",
  "devDependencies": {
    "typescript": "4.4.4",
    "@types/node": "16.11.1"
  }
}
```

The line containing "@types/node" points to the [Types NPM Package](https://www.npmjs.com/package/@types/npm). This is a suite of TypeScript type definitions that can be used from VS Code to silence errors and provide useful type information &mdash; not only for Node.js but many NPM packages.

# VS Code

So far this article has mentioned VS Code as a context through which type errors will manifest themselves, without describing how to get this working in practice. Although the process is not complicated, it is also not well-documented. Here are the steps I used.

First, create a blank VS Code project and open it. The project should be devoid of files.

Next, add the following as `./package.json`:

```json
{
  "type": "module",
  "devDependencies": {
    "typescript": "4.4.4",
    "@types/node": "16.11.1"
  }
}
```

Create the file `./.vscode/tasks.json` (notice the dot preceding "vscode") and add the following content to it:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "tsc",
      "type": "shell",
      "command": "./node_modules/typescript/bin/tsc",
      "presentation": {
        "echo": true,
        "reveal": "never",
        "focus": false,
        "panel": "shared",
        "showReuseMessage": true,
        "clear": false
      },
      "args": ["--noEmit", "--watch"],
      "problemMatcher": [
        "$tsc-watch"
      ],
      "isBackground": true
    }
  ]
}
```

Finally, create the file `./tsconfig.json` with the following content:

```json
{
  "compilerOptions": {
    "outDir": "./dummy",
    "target": "ES6",
    "lib": ["ES6"],
    "checkJs": true,
    "allowJs": true,
    "skipLibCheck": true,
    "moduleResolution": "node",
    "strictNullChecks": true,
    "allowSyntheticDefaultImports": true
  },
  "exclude": [
      "node_modules"
  ],
  "include": [
    "index.js",
    "lib/**/*.js",
    "test/**/*.js"
  ]
}
```

The purposes of the three configuration files are as follows:

- `./package.json` Installs the TypeScript package, preventing a host of inscrutable errors that will arise if it is absent.
- `./tsconfig.json` Instructs the TypeScript compiler on where to find source files, what to exclude, and how to process the files it finds. Comprehensive documentation on this file can be found [here](https://www.typescriptlang.org/tsconfig).
- `./.vscode/tasks.json` Adds a new task to VS Code (tsc) that detects type errors while running in the background.

Alternatively, you can clone the [Typed JavaScript Project](), which includes everything needed to get started.

With all files in place, it's time to install the NPM dependencies:

```bash
npm i
```

Before starting with Typed JavaScript, there's one final step. In VS Code, select the `Terminal` menu, then choose the `Run Task` option. Type `tsc` into the search bar and press enter. This runs the `tsc` (TypeScript compiler) task defined by the file at `./.vscode/tasks.json`.

The `tsc` task is a workaround to a [longstanding VS Code issue](https://github.com/microsoft/TypeScript/issues/21435). Although VS Code checks types in opened files, it does not check types in closed files. This means that if editing the current file leads to errors in other closed files, those errors will not show up in the Explorer panel. Many language have this feature, so its absence from TypeScript makes using Typed JavaScript harder that it needs to be. The task I provide synthesizes various workarounds reported on the GitHub page for the issue.

# Observations

I've been using Typed JavaScript, as described here, for about a month on a no-framework web application project. Prior to that I dabbled with JSDoc type hints in VS Code. Years before that I built [a complex JavaScript project](https://chemwriter.com) using Closure Tools. With this background in mind, I make the following miscellaneous observations:

- Avoid using [`*.d.ts`](https://www.typescriptlang.org/docs/handbook/declaration-files/templates/module-d-ts.html) files. These files are intended for external consumers of your libraries. I have run into hard-to-diagnose problems when trying to repurpose these files for internal use.
- Typed JavaScript types work in the VS Code debugger.
- A `typedef` without properties equals the any (`*`) type. This can be confusing because it looks like the `typedef` was not found. Be sure to give a `typedef` at least one property to make sure it's working.
- Type hints in Typed JavaScript are much more syntactically verbose than in TypeScript. However, there are ways to cut down on the clutter. For example, a type hint can be tucked between a variable declaration keyword and its name (e.g., `let /** @type{string} */ myString;`)
- VS Code can infer many types without type annotations. Learn where this applies to avoid cluttering your code with useless definitions.
- Many languages will alert you to types that go unused, but Typed JavaScript will not.
- There is no "go to/open definition" navigation in VS Code running Typed JavaScript. Although you can hover the name of a value to see its type, you can't navigate to its definition.
- Error messages can be verbose. This applies most noticeably to `typedef` errors, where an entire struct is replicated in the error, causing considerable clutter.

# Conclusion

Typed JavaScript offers many of the benefits of TypeScript, but without the disruption caused by a change of language. Implemented through JSDoc type tags and Visual Studio Code, Typed JavaScript requires no breaking syntax changes or unusual tools. As such, Typed JavaScript could offer an alternative for those cases in which TypeScript's costs are too high. Although Typed JavaScript is not new, it has so far lacked a name, comprehensive documentation, and a set of conventions for use. This article is a first attempt at addressing that problem.