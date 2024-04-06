---
title: JavaScript for Cheminformatics - Atom Typing with Prototype and Iterators
published: "2008-08-28T00:00:00.000Z"
---

The previous article in this series discussed the use of [Prototype to build a simple cheminformatics model](http://depth-first.com/articles/2008/08/26/javascript-for-cheminformatics-using-the-prototype-framework). But there's much more to [Prototype](http://www.prototypejs.org/) than an improved class-like syntax. This article discusses one specific way that Prototype enhances JavaScript collections through iterators.

# The Problem

Let's say we have an instance of `Molecule`, as defined in [the previous article](http://depth-first.com/articles/2008/08/26/javascript-for-cheminformatics-using-the-prototype-framework), and we'd like to group the carbon atoms separately from the heteroatoms. In many languages, including Java, we'd have to write a for-loop complete with logic for comparing atoms and then placing them into bins. Prototype makes possible a more modular approach with iterators.

# Functional Programming and Iterators

JavaScript is a multi-paradigm programming language that offers tools for both object-oriented and [functional programming](http://www.joelonsoftware.com/items/2006/08/01.html) approaches. In practical terms, this simply means that even functions in JavaScript behave as objects: they can be created dynamically and passed as parameters. Prototype takes advantage of this to extend collections instances such as `Arrays` with built-in iterators that are analogous to iterators found in languages such as Ruby.

# A Simple Test

The JavaScript below builds a pyridine molecule:

```js
function createPyridine(){
  var pyridine = new Molecule();
  var c1 = pyridine.addAtom("C");
  var c2 = pyridine.addAtom("C");
  var c3 = pyridine.addAtom("C");
  var c4 = pyridine.addAtom("C");
  var c5 = pyridine.addAtom("C");
  var n6 = pyridine.addAtom("N");

  pyridine.connect(c1, c2, 1);
  pyridine.connect(c2, c3, 2);
  pyridine.connect(c3, c4, 1);
  pyridine.connect(c4, c5, 2);
  pyridine.connect(c5, n6, 1);
  pyridine.connect(n6, c1, 2);

  return pyridine;
}
```

Saving this code in a file called <strong>molecules.js</strong>, we can use Firefox with Firebug to test it with the following HTML:

```html
<html>
  <head>
    <script type="text/javascript" src="prototype.js"></script>
    <script type="text/javascript" src="chem.js"></script>
    <script type="text/javascript" src="molecules.js"></script>
  </head>
  <body></body>
</html>
```

With the Firebug console, we create a `Molecule` of pyridine:

```bash
>>> m = createPyridine();
```

To separate carbons from heteroatoms, we use the Prototype `partition` iterator:

```bash
>>> m=createPyridine();
Object atoms=[6] bonds=[6]
>>> m.atoms.partition(function(atom){return atom.label == "C"});
[[Object label=C neighbors=[2] bonds=[2], Object label=C neighbors=[2] bonds=[2], Object label=C neighbors=[2] bonds=[2], 2 more...], [Object label=N neighbors=[2] bonds=[2]]]
```

The `partition` iterator accepts a function as a parameter and returns an array containing two sub-arrays: the first contains the elements for which the function evaluated to `true` (carbons) and the second contains the elements for which the function evaluated to `false` (heteroatoms).

# Conclusions

Although the example shown here is rather simple, it's possible to extend the general principle to more complex atom typing systems. By creating a single function that evaluated atom type, we could pass it as a parameter to any number of collection iterator functions.