---
title: Octet Fundamentals - Immutable Molecules
published: "2007-02-20T00:00:00.000Z"
---

> The Immutable pattern increases the robustness of objects that share references to the same object and reduces the overhead of concurrent access to an object. It accomplishes this by forbidding any of an object's state information to change after the object is constructed. The Immutable pattern also avoids the need to synchronize multiple threads of execution that share an object.
>
><cite>[Mark Grand](http://www.amazon.com/gp/product/0471258393?ie=UTF8&tag=depthfirst-20&linkCode=as2&camp=1789&creative=9325&creativeASIN=0471258393)</cite>

Peruse the [Octet API Documentation](http://depth-first.com/doc/octet/index.html) and you may find something surprising about the [Molecule](http://depth-first.com/doc/octet/net/sf/octet/model/Molecule.html) interface: it lacks mutator methods. Given that mutators enable the state of an object to change, how can a Molecule ever be created in the first place? Why would anyone even need immutable Molecules?

# Mutable Molecules are Unnecessary

Most cheminformatics tools permit the unfettered modification of molecules after their creation. Octet takes a completely different approach. The Molecule contract says that the state of every Molecule will remain constant over its lifetime. Octet then backs up this promise by deliberately defining only accessor methods in the Molecule interface.

Perhaps the best reason for an immutable Molecule interface is that there are vanishingly few situations in which a Molecule needs to be changed after it's created. The creative use of Design Patterns obviates 80-90% of the perceived need for Molecule mutability.

# The Virtues of Immutability

When clients *know* that a Molecule can never be changed, programming becomes a lot easier and less bug-prone. For example, consider that when a Molecule is immutable:

-  defensive copying of Molecules is unnecessary;
-  a mechanism that reports changes to internal Molecule state (listeners) is unnecessary;
-  memory leaks resulting from failure to disconnect a Molecule listener are eliminated;
-  the <code>clone</code> method, and all of its complexities, are unnecessary;
-  no special precautions need to be taken to achieve robust, thread-safe code;
-  Molecules can safely be used as keys in <code>Hashtables</code>;
-  the Molecule API is greatly simplified because all mutators have been removed.

Octet fully embraces the productivity gains made possible by immutable Molecules. In fact, many of Octet's key interfaces are immutable for precisely the reasons cited above.

# How to Build Immutable Molecules

Immutable Molecules may be a good idea, but how can they get created in the first place? After all, there are no methods such as <code>addAtom</code> though which a Molecule can be built up!

Java inner classes and the [Builder Pattern](http://c2.com/cgi/wiki?BuilderPattern) provide one solution to this problem. Consider the following Java snippet, which is adapted from the Octet source code:

```java
public class BasicMoleculeBuilder implements MoleculeBuilder
{
  private MoleculeImpl molecule;

  public BasicMoleculeBuilder(){
    molecule = new MoleculeImpl();

    // implement the rest
  }

  public void addAtom(IsotopicDistribution distribution){
    AtomImpl atom = new AtomImpl(distribution);

    // changing the molecule!
    molecule.atoms.add(atom);
  }

  public Molecule releaseMolecule(){
    Molecule result = molecule;
    molecule = new MoleculeImpl();

    return result;
  }

  // implement the remaining MoleculeBuilder methods

  private class MoleculeImpl implements Molecule  {
    private List atoms;

    private MoleculeImpl(){
      atoms = new ArrayList();
    }

    // implement the remaining Molecule methods
  }

  private class AtomImpl implements Atom{
    private IsotopicDistribution dist;

    private AtomImpl(IsotopicDistribution dist){
      this.dist = dist;
    }

    // implement the remaining Atom methods
  }
}
```

Notice that the <code>addAtom</code> method changes the state of the Molecule under construction. Strictly speaking, this does violate immutability. In practice, it makes no difference because the changes occur only in the context of <code>BasicMoleculeBuilder</code>, which keeps these changes from propagating to the outside world. Once a client invokes <code>releaseMolecule</code>, <code>BasicMoleculeBuilder</code> loses all contact with the <code>Molecule</code> it created, and so is incapable of further modification.

Although it may not be immediately apparent, Alan Holub's [brilliant series of articles](http://www.javaworld.com/javaworld/jw-07-1999/jw-07-toolbox.html) in [JavaWorld](http://javaworld.com) on user interface design are directly applicable here. If you've never been exposed to rigorous object-oriented design, Holub's claims can seem rather bizarre ("get and set functions are evil"). But if you stick with it, you'll be rewarded with a valuable new appreciation for object-oriented programming in Java.

Although a discussion of the role of the Builder Pattern in the above code is beyond the scope of this article, look to future installments of the "Octet Fundamentals" series for more details.

# Conclusions

Molecule immutability is a core Octet principle that results in cleaner, simpler, and more robust client code. Situations that might appear to require the ability to edit Molecules can usually be handled through the creative application of Design Patterns.