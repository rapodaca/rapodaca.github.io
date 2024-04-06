---
title: "Class-Free Object-Oriented Programming"
summary: "Like the GOTO statement of yore, has the notion of class outlived its original purpose in object-oriented programming?"
twitter: true
summary-image: images/posts/20190304/summary.png
published: "2019-03-04T09:00:00.000Z"
---

Back in 1968, Edsger Dijkstra published his well-known "go to statement considered harmful" letter advocating the abolition of the `GOTO` statement from high-level programming languages:

> For a number of years I have been familiar with the observation that the quality of programmers is a decreasing function of the density of go to statements in the programs they produce. More recently I discovered why the use of the go to statement should be abolished from all "higher level" programming languages (i.e. everything except, perhaps, plain machine code). ...
>
><cite>[Edsger Dijkstra](https://doi.org/10.1145/362929.362947)</cite>

At the time, `GOTO` was well-regarded and widely-used, as evidence by the [controversy](http://david.tribble.com/text/goto.html) surrounding Dijkstra's letter and the length of time it took languages supporting `GOTO`, or its [use in languages that sill support it](http://www.drdobbs.com/architecture-and-design/is-goto-still-considered-harmful/240166595), to decline.

Like the `GOTO` statement of yore, could class-based object-oriented programming (OOP) become yet another casualty of the relentless action of Moore's Law? This article first discusses the idea that classes in OOP may have outlived their original purpose, and concludes with a class-free OOP example in the form of a small graph manipulation library in JavaScript.

# Objects without Classes in JavaScript

The unique qualities of OOP are often introduced by referencing its three pillars:

- **encapsulation** functions and data are hidden by default and only deliberately exposed
- **polymorphism** two objects can differ in their implementation while sharing a common interface
- **inheritance** an object can assume the behavior of another object

Notice, however, that nothing about OOP requires classes specifically. A form of OOP can even be [implemented in C](https://www.cs.rit.edu/~ats/books/ooc.pdf) through the adoption of certain conventions. Classes are but one path to OOP's promise of reusability.

<div class="videowrapper">
  <iframe src="https://www.youtube.com/embed/TMuno5RZNeE?start=2265" allowfullscreen></iframe>
</div>

JavaScript was the first widely-used language to directly support OOP without classes. For two decades, JavaScript developers created and used objects &mdash; with no support for classes whatsoever. What JavaScript offered instead of classes was [prototypal OOP](https://alistapart.com/article/prototypal-object-oriented-programming-using-javascript), which can be invoked in several ways. For example, the following style is known as "pseudoclassical":

```js
// pseudoclassical OOP
const Foo = function (value) {
  this._value = value; // privacy by convention
};

// public interface
Foo.prototype.add = function (number) {
  return number + this._value;
};

const foo = new Foo(42);

foo.add(1); // => 43
```

Driven by the widespread use of this pattern and general confusion surrounding prototypal OOP, JavaScript was updated in 2015 to support `class` declarations. The analogous definition from above can be recast as a JavaScript class, as shown below:

```js
// class declaration
const Foo = class {
  constructor (value) {
    this._value = value; // privacy by convention
  }

  // public interface
  add (number) {
    return number + this._value;
  }
};

const foo = new Foo(42);

foo.add(1); // => 43
```

Aside from the `class` declaration's cleaner syntax, both forms of OOP use the same underlying prototypal mechanism. They enjoy exactly the same benefits (e.g., flexibility and performance) and suffer from the same liabilities (e.g., "fake" privacy and sometimes surprising behavior).

Douglas Crockford, a pioneer for advocating JavaScript's application to complex problems, noted the confusion around prototypal inheritance. In his book, *JavaScript: The Good Parts*, he developed the following alternative &mdash; a kind of [factory function](https://stackoverflow.com/questions/8698726/). He called this creation pattern "functional" and showed how it supports inheritance among other features:

```js
const createFoo = (spec) => {
  const value = spec.value; // real privacy
  const result = {
    add: (number) => number + value
  };

  return result;
};

const foo = createFoo({ value: 42 });

foo.add(1); // => 43
foo.value; // => undefined
```

Recently, Crockford revisited the functional object creation pattern. The video below begins with his explanation of "Class Free" OOP. However, the context makes it clear that Crockford's interest in this pattern extends beyond JavaScript. He's describing what the next major programming language will look like, and it ditches classes.

<div class="videowrapper">
  <iframe src="https://www.youtube.com/embed/DxnYQRuLX7Q?start=2734" allowfullscreen></iframe>
</div>

Crockford's description of class-free OOP can be summarized in the pattern below, which takes advantage of [object destructuring](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) to selectively capture properties from the `spec` object:

```js
/**
 * @param {Object} spec a specification object
 * @return {Object}
 */
const createFoo = (spec) => {
  // private state
  let { value } = spec; // selectively read from spec

  // public, immutable interface
  return Object.freeze({
    add: (number) => number + value
  });
};

const foo = createFoo({ value: 42 });

foo.add(1);
```

The top of the function contains everything that will remain hidden from the surrounding context. The bottom of the function, beginning with the `return` statement, contains only those functions that the newly-created object will expose to clients. Interestingly, this pattern divides objects into two broad categories: those exposing only properties (e.g., `spec`); and those exposing only functions (e.g., the return value from `createFoo`). Freezing the returned object makes it impervious to property assignment, deletion, or edits. Whereas JavaScript supports this style of OOP, Crockford hints at a language that would enforce its use in the same way that Java enforces the use of classes.

![Classy Enough](/images/posts/20190304/classy-enough.jpg "Classy Enough")

# Requirements for a Graph Library

Having established the basic pattern of object creation, let's apply it to a real problem.

Graphs are ubiquitous data structures in computer science. Although they appear in numerous applications, my interest in graphs stems from chemistry and its well-established adoption of graphs as molecular representations.

Although the functionality needed by a graph varies by application, we might aim for the following minimal feature set:

- enumerate nodes and edges
- enumerate a node's neighbors
- test a node or edge for membership
- obtain the weight of an edge
- obtain node and edge counts

Molecular graphs are often constructed in a stepwise manner because node and edge properties can only be assigned with a global view of the graph. For example, an atom's hydrogen count will depend on bonding to its neighbors, which can only be known after the entire graph framework has been assembled. After assembly, however, molecular graphs are rarely changed. As such, they should be closed to later modification.

Molecular graph libraries often try to accommodate both uses with an API that combines graph assembly with graph traversal in the same object. I think this is a mistake for a few reasons, one of them being complexity. Molecular graphs must support a wide range of features for traversal and analysis. Throwing construction features into the mix can lead to unwieldy APIs. Separation of concerns with respect to graph construction and traversal should be the goal.

A better approach is to support a builder object. The builder exposes a rich API for graph creation. It also supports one more function granting access to the graph under construction. The graph itself only supports accessors for traversal and analysis, exposing nothing that allows state change.

# Graph Builder

A primitive graph builder can be obtained from the `createGraphBuilder` function given below. The return value, a graph builder, exposes no API for traversing the graph. For that, a client must call the `#graph` function, which returns a graph instance. That instance in turn provides accessors but no mutators. The graph itself is implemented with an [ES6 `Map` instance](http://2ality.com/2015/01/es6-maps-sets.html), although a variety of alternative implementations would also be possible.

```js
const createGraphBuilder = () => {
  const map = new Map();
  const edges = [ ];

  const graph = {
    edges: () => edges.values(),
    hasEdge: (source, target) => map.get(source).has(target),
    hasNode: (node) => map.has(node),
    neighbors: (node) => map.get(node).keys(),
    nodes: () => map.keys(),
    order: () => map.size,
    size: () => edges.length,
    weight: (source, target) => map.get(source).get(target)
  };

  return {
    addNode: (node) => map.set(node, new Map()),
    addEdge: (source, target, weight) => {
      map.get(source).set(target, weight);
      map.get(target).set(source, weight);
      edges.push([ source, target, weight ]);
    },
    graph: () => graph
  };
};

export default createGraphBuilder
```

`createGraphBuilder` is implemented as an ES6 module. This means that functions (and objects) appearing outside the scope of the exported function will be invisible to the rest of the environment. We can use this feature to create as many fully private helper functions and objects as needed.

The builder can be created and used like this:

```js
const builder = createGraphBuilder();

builder.addNode(0);
builder.addNode(1);
builder.addEdge(0, 1, 'a');

const graph = builder.graph();

graph.hasNode(0); // => true
graph.hasNode(3); // => false
graph.weight(0, 1); // => 'a'
graph.weight(1, 0); // => 'a' (undirected graph)
```

# Extending Graph

Some graph traversal functions will be used for both molecular graphs and other kinds of graphs. For example, an isomorphism detection function compares two graphs. In one mode of operation, they both could be molecules. But in another mode of operation, a generalized query graph will be matched against a molecule. It seems wasteful to rewrite the same function to accommodate slight interface differences between a graph and molecule. A better solution is to ensure that a molecule (and any graph-like object) inherits the graph interface. That way, any graph analysis can be performed against a graph or molecule without modification.

Graph can be conveniently extended using the [object spread](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax) operator. Inside a `createMoleculeBuilder` function, this operator will be used to give the molecule under construction all the functionality of the graph that's also being constructed.

This pattern demonstrates one way to achieve object composition that's as simple to use as object inheritance:

```js
import createGraphBuilder from './create-graph-builder.js';

const createMoleculeBuilder = () => {
  const builder = createGraphBuilder();
  const atoms = new Map(); // atom->properties
  const bonds = [ ]; // bond array

  const molecule = {
    // molecule will have all graph functions
    ...builder.graph(),
    // add molecule-specific functions and graph
    // overrides here
  };

  return {
    addAtom: (spec) => addAtom(spec, atoms, builder),
    addBond: (source, target, order) => addBond(source, target, builder, atoms, bonds),
    // other molecule-specific builder functions
    molecule: () => molecule
  };
};

const addAtom = (spec, atoms, builder) => {
  // TODO
};

const addBond = (source, target, builder, atoms, bonds) => {
  // TODO
};

export default createMoleculeBuilder
```

Clients using `createMoleculeBuilder` have no clue as to how the graph/molecule is-a relationship is implemented:

```js
const builder = createGraphBuilder();

const a1 = builder.addAtom({ symbol: 'C' });
const a2 = builder.addAtom({ symbol: 'C' });

builder.addBond(a1, a2, 2); // double bond

builder.molecule().order(); // => 2
builder.molecule().size(); // => 1
a1.symbol(); // => 'C'
```

# Interfaces

Class-free OOP introduces a documentation problem within languages that don't directly support it. Whereas the "shape" of any object can be defined by referencing its class definition, class-free OOP offers no such feature. One approach is to provide special no-op interface classes that today's documentation generators will be able to understand.

For example, [JSDoc](http://usejsdoc.org) supports the `@interface` tag. Its purpose is to designate a class declaration as an interface. Using this capability, we might document the `Graph` interface as follows.

```js
/**
 * @interface
 */
const Graph = class {
  /**
   * @return {number} the number of nodes
   */
  order () { }

  /**
   * @return {number} the number of edges
   */
  size () { }

  // ... remaining methods
};

export default Graph
```

The key point is that `Graph` would never be instantiated or "extended." It exists merely as a convenience for documenting a group of functions applicable to an object supporting the `Graph` interface.

# Classes Considered Harmful?

The point behind class-free OOP may not be obvious. Yes, two decades of JavaScript use have proven beyond doubt that classes are unnecessary for OOP. And the patterns presented here show how to achieve the most desirable features of OOP in a class-free way. But if classes aren't in themselves harmful, why abandon them? Consider these points:

- **Classes are a fiction in JavaScript.** Programmers assuming that class expressions work like the classes from languages they're familiar with could introduce insidious, avoidable bugs.
- **The `new` keyword leaks an implementation detail.** Both prototypal and classical OOP force clients to use `new` when instantiating objects. This leaks unnecessary information about how objects are implemented. Refactoring toward factory functions as described above introduces a breaking API change.
- **Classes encourage inheritance over composition.** Deep inheritance hierarchies make code brittle and hard to understand. Avoiding classes forces internal and external development efforts to focus on the more flexible practice of [object composition](https://en.wikipedia.org/wiki/Composition_over_inheritance).
- **Classes encourage `instanceof` programming.** Class and type are tightly coupled in languages such as Java. But as we've seen, JavaScript has no concept of class. Regardless, the presence of [`instanceof`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/instanceof) tempts everyone involved to reach for it in a pinch rather than polymorphism, thereby racking up technical debt.
- **Classes break encapsulation.** Class expressions and pseudoclassical OOP in JavaScript provide no privacy, breaking encapsulation. The effects range from annoying (pollution of object properties with private values during debugging sessions) to structural (clients may come to depend on private data).
- **Classes are unnecessary.**  Good constraints make intractable problems solvable. A programming language offering multiple options for fundamental processes like object creation and inheritance risks confusion and misuse. Although not always practical, language features that are no longer necessary should be retired.

# Performance

The one compelling reason to use classes might be performance. Whereas prototypal inheritance adds a single overridable property to the prototype chain for many objects, functional inheritance adds a separate property to each object instance. Depending on the application, this can lead to significantly increased memory requirements.

Two factors should be considered here. The first is that memory is vastly more abundant now than it was 20 years ago. The second is that applications requiring large numbers of objects, held in memory simultaneously, are rare. In practice, objects such as molecular graphs will be created, used, and then thrown away. The practical effect of greater memory consumption will be offset by the work of an efficient garbage collector.

If profiling does reveal bottlenecks due to class-free OOP, then they can be addressed through selective use of prototypal OOP hidden behind factory functions. However, there's little reason for prototypal OOP or exported JavaScript classes to be the default position. Correct, clean code should be the primary goal. Only having met this goal should performance enter the picture, and even then only given clear evidence for bottlenecks.

Benchmarks, open as they are to misapplication and misinterpretation, offer one way to identify possible performance problems before full-scale implementation. They may offer even more useful insights in a language like JavaScript, with its highly-tuned and rapidly-evolving runtime. One benchmark pointing to higher memory use with factories compared to constructors was presented in 2017 by [Marek Piechut](https://reallifeprogramming.com/will-chrome-optimize-your-object-factories-76f3fc331145). His study created 1 million objects in memory. A factory functions required about ten times the memory as the comparable constructor function.

One of the problems with benchmarks is setting up a realistic scenario. In my mind, there are very few situations that call for keeping hundreds of thousands of graphs in memory. As such, Piechut's results might best be thought of as a worst-case scenario.

A more realistic situation would be the creation of a million or so graphs that are immediately traversed and then promptly left to the garbage collector. As such, a well-tuned garbage collector would minimize the difference between factories and constructors. That leaves execution time as the main parameter of interest.

As a first approach to benchmarking, I set up the [ES6 Graph](https://github.com/metamolecular/es6-graph) project. It features two factory functions that create work-alike graph instances. One uses class-free OOP ("classless") whereas the other uses pseudoclassical OOP ("classy"). Running on my modest system with Node 11.6, these benchmarks show only about 10% difference between the execution times (favoring pseudoclassical) of the two implementations. Browser tests on the same system show no difference in memory usage as reported by Chrome. Both Chrome and Safari (Mac OS) showed a similar 10% advantage in execution time for the pseudoclassical approach.

The minuscule differences in execution time and memory consumption seen in these benchmarks support the position that performance should take a back seat to good OOP design. Choose the model that will best support encapsulation, polymorphism, and aggregation over inheritance.

# Conclusion

Classes are but one path to OOP. Although classes may have once served a vital optimization role on resource-strapped computers and within languages with primitive OOP tooling, their potential for harm should not be ignored. It may not be time just yet to abolish classes, but it's pretty clear that the reasons to keep them around are dwindling.