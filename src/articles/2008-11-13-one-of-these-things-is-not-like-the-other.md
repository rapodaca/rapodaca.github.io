---
title: One of These Things is Not Like The Others
disqus: true
published: "2008-11-13T00:00:00.000Z"
---

You can't get very far in cheminformatics without the ability to compare one molecule to another to find either an exact structure or substructure match. For example, if you want to build [chemical databases](/articles/2007/01/24/thirty-two-free-chemistry-databases), a good substructure matcher [comes in very handy](/articles/2008/10/02/fast-substructure-search-using-open-source-tools-part-1-fingerprints-and-databases). As luck would have it, the substructure match problem (a variant of the [subgraph isomorphism problem](http://en.wikipedia.org/wiki/Subgraph_isomorphism_problem)) is both [computationally expensive](http://en.wikipedia.org/wiki/NP-complete) and difficult implement. This article discusses one approach to the problem.

# Background

Recently, [Rajarshi Guha](http://rguha.wordpress.com/) described some [benchmarking studies](http://rguha.wordpress.com/2008/09/19/faster-substructure-search-in-the-cdk) suggesting that it was possible to greatly improve the speed of the [Chemistry Development Kit](http:/cdk.sf.net) (CDK) substructure matching code. His code employed the widely-used [Ullmann algorithm](http://portal.acm.org/citation.cfm?id=321925).

There's just one problem: the Ullmann algorithm detects edge-induced isomporphisms. This means, for example, that if your query molecule is propane and your test molecule is cyclopropane, you won't find a match with an Ullmann-backed tool. I'm still not sure if it's possible to modify an Ullmann implementation to make its matches node-induced. Based on the implementations I've seen, the answer appears to be "no."

For substructure matching, we need an atom-induced isomorphism algorithm.

# What's Wrong with Existing Implementations?

To begin with, it must be pointed out that working isomorphism code is valuable and hard-won.

Having said that, many Java implementations are written in a way that makes optimization difficult at best. Some start out as C code that then gets ported, mostly verbatim. Other are written with an understandable emphasis on speed over readability. For developers used to working with classes, objects, shallow loops, and short methods with expressive names, the impedance mismatch can be jarring to say the least.

Here's an example, taken from the CDK, that while functional, would take a great deal of time to understand well enough to change:

```java
public static List makeAtomsMapOfBondsMap(List l, IAtomContainer g1, IAtomContainer g2) {
  if(l==null)
    return(l);
  List result = new ArrayList();
  for (int i = 0; i &lt; l.size(); i++) {
    IBond bond1 = g1.getBond(((RMap) l.get(i)).getId1());
    IBond bond2 = g2.getBond(((RMap) l.get(i)).getId2());
    IAtom[] atom1 = BondManipulator.getAtomArray(bond1);
    IAtom[] atom2 = BondManipulator.getAtomArray(bond2);
    for (int j = 0; j &lt; 2; j++) {
      List bondsConnectedToAtom1j = g1.getConnectedBondsList(atom1[j]);
      for (int k = 0; k &lt; bondsConnectedToAtom1j.size(); k++) {
        if (bondsConnectedToAtom1j.get(k) != bond1) {
          IBond testBond = (IBond)bondsConnectedToAtom1j.get(k);
            for (int m = 0; m &lt; l.size(); m++) {
              IBond testBond2;
              if (((RMap) l.get(m)).getId1() == g1.getBondNumber(testBond)) {
                testBond2 = g2.getBond(((RMap) l.get(m)).getId2());
                for (int n = 0; n &lt; 2; n++) {
                  List bondsToTest = g2.getConnectedBondsList(atom2[n]);
                  if (bondsToTest.contains(testBond2)) {
                    RMap map;
                    if (j == n) {
                      map = new RMap(g1.getAtomNumber(atom1[0]), g2.getAtomNumber(atom2[0]));
                    } else {
                      map = new RMap(g1.getAtomNumber(atom1[1]), g2.getAtomNumber(atom2[0]));
                    }
                    if (!result.contains(map)) {
                      result.add(map);
                    }
                    RMap map2;
                    if (j == n) {
                      map2 = new RMap(g1.getAtomNumber(atom1[1]), g2.getAtomNumber(atom2[1]));
                    } else {
                      map2 = new RMap(g1.getAtomNumber(atom1[0]), g2.getAtomNumber(atom2[1]));
                    }
                    if (!result.contains(map2)) {
                      result.add(map2);
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  return (result);
}
```

# VFLib

Rajarshi's implementation of substructure search was based on a Java port of the [VFLib](http://amalfi.dis.unina.it/graph/db/vflib-2.0/doc/vflib.html) C++ library. VFLib was developed by an Italian group to compare the performance of the VF algorithm with that of Ullmann.

VFLib defines a single interface ([State](http://amalfi.dis.unina.it/graph/db/vflib-2.0/doc/vflib-7.html)) that a variety of subgraph isomorphism matchers can implement in order to work interchangeably.

What makes this so interesting is that when you can boil a software problem down to implementing an interface, it can become orders of magnitude simpler. But more on that later.

Another interesting aspect of VFLib is that the code can be easily converted from an edge-induced implementation to a node-induced implementation. In other words, if we had a Java port of the VFLib2 code, we could begin to build families of Java-based substructure matchers that could be easily compared and optimized.

# The View from 10,000 Feet

One of the difficult aspects of implementing subgraph isomorphism algorithms is dividing the process up into understandable chunks. One way forward might be to look for commonalities among all of the approaches currently used. What might those be? Here are some possibilities:

- **Recursion.** At the heart of any implementation typically lives a method that repeatedly calls itself (without creating a stack overflow).
- **Gradual accumulation of state.**  What's that recursive method doing? Building up a map of the atoms from a query structure to a target structure, one pair of atoms at a time. Sometimes it fails and needs to go back to the last successful match. Sometimes it succeeds and needs to report that information to avoid accessing an out-of-bounds index. At every stage, the accumulated state must be sufficient to finish the mapping attempt.
- **Mapping comes for free.** The implementation typically uses an internal map to keep track of what it's done, so getting one mapping (or more) of the query structure onto the target tends to be as easy as simply detecting that a match exists.
- **Optimization heuristics.** Where to begin, what order to compare structural features, and what features should be compared anyway? The possibilities for taking advantage of simple optimization rules are significant. It should, therefore, be easy to run many implementations side-by-side in performance tests.

A [paper](http://amalfi.dis.unina.it/graph/db/papers/vf-algorithm.pdf) describing the VF algorithm, and the way VFLib implements it is freely available.

In it, a high-level overview of the VF algorithm is presented:

```bash
PROCEDURE Match(s)
  INPUT: an intermediate state s; the initial state s0 has M(s0)=∅
  OUTPUT: the mappings between the two graphs
  IF M(s) covers all the nodes of G2 THEN
    OUTPUT M(s)
  ELSE
    Compute the set P(s) of the pairs candidate for inclusion in M(s)
    FOREACH (n, m)∈ P(s)
      IF F(s, n, m) THEN
        Compute the state s' obtained by adding (n, m) to M(s)
        CALL Match(s')
      END IF
    END FOREACH
     Restore data structures
  END IF
END PROCEDURE
```

The `Match(s)` procedure plays the role of recursive function, while `s` and `s'` play the dual roles of state accumulators and feature comparators.

VFLib, together with the paper describing it, does a good job of breaking the process up into manageable chunks from which unit tests, interface definitions, and ultimately working code can created in a variety of languages.

# Conclusions

Substructure matching is one of the most difficult and most useful cheminformatics tasks. Although many Java cheminformatics toolkits support substructure search, their implementations can be difficult to understand, modify, and optimize. VFLib has some interesting features that could help to change that.
