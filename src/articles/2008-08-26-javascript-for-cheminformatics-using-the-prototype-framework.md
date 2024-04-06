---
title: JavaScript for Cheminformatics - Using the Prototype Framework
published: "2008-08-26T00:00:00.000Z"
---

If you want to do the kind of cheminformatics that involves manipulating atoms, bonds, and molecules, object-oriented programming works well as a development paradigm. Although perhaps not readily apparent, JavaScript [offers everything](http://depth-first.com/articles/2008/07/15/javascript-for-cheminformatics) needed to create object-oriented models just as intricate at those written in languages like C++ and Java. This article discusses one approach that makes use of the [Prototype Framework](http://www.prototypejs.org/).

# About Prototype

Prototype is a set of extensions to the JavaScript language that make developing in it less painful. Some of the extensions relate to DOM manipulation. Other have to do with the way Strings and Arrays behave. For the purposes of this article, we'll be using Prototype's syntax support for classes and inheritance.

# Atoms, Bonds, and Molecules

To start, we'll need classes that define the basic behavior of atoms, bonds, and molecules. Although we may ultimately need to consider issues such as [multicentered bonding](http://depth-first.com/articles/2006/12/19/ferrocene-and-beyond-a-solution-to-the-molecular-representation-problem), for now, we'll stick to a simplified view of chemistry that has bonds connecting two and only two atoms.

# Creating the Classes

We could use JavaScript's built-in method for creating objects from class-like structures, but Prototype's approach is cleaner.

In the following library, we define a Molecule as a collection of Atoms and Bonds with useful relationships:

```js
var Molecule = Class.create({
  initialize: function(){
    this.atoms = [];
    this.bonds = [];
  },

  addAtom: function(label){
    var atom = new Atom(label);

    this.atoms.push(atom);

    return atom;
  },

  connect: function(sourceAtom, targetAtom, bondType){
    var bond = new Bond(sourceAtom, targetAtom, bondType);

    sourceAtom.neighbors.push(targetAtom);
    sourceAtom.bonds.push(bond);
    targetAtom.neighbors.push(sourceAtom);
    targetAtom.bonds.push(bond);

    this.bonds.push(bond);

    return bond;
  }
});

var Atom = Class.create({
  initialize: function(label){
    this.label = label;
    this.neighbors = [];
    this.bonds = [];
  }
});

var Bond= Class.create({
  initialize: function(source, target, type){
    this.source = source;
    this.target = target;
    this.type = type;
  },

  getMate: function(atom){
    if (atom == this.source) return this.target;
    if (atom == this.target) return this.source;

    return null;
  },

  contains: function(atom){
    return (atom == this.source || atom == this.target);
  }
});
```

# Testing the Library

We can test the library interactively by saving it in a file called <strong>chem.js</strong> and creating some simple HTML:

```html
<html>
  <head>
    <script type="text/javascript" src="prototype.js"></script>
    <script type="text/javascript" src="chem.js"></script>
  </head>
  <body></body>
</html>
</pre>
```

We can then use the <a href="http://addons.mozilla.org/en-US/firefox/addon/1843">Firebug console</a> to test the library interactively:

```bash
>>> m = new Molecule();
Object atoms=[0] bonds=[0]
>>> c = m.addAtom("C");
Object label=C neighbors=[0] bonds=[0]
>>>n = m.addAtom("N");
Object label=N neighbors=[0] bonds=[0]
>>> m.connect(c, n, 3);
>>> c.neighbors.size()
1
```

# Conclusions

Although the cheminformatics library discussed here is far from being useful, it's not difficult to see how to extend it. Prototype offers a several possibilities for doing so.