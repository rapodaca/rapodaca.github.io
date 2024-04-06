---
title: Substructure Search From Scratch in Java Part 1 - The Atom Mapping Problem
published: "2008-11-17T00:00:00.000Z"
---

One of the most important capabilities in cheminformatics is mapping the atoms of a *query structure* onto the atoms of a *target structure*. Although useful in itself, the main value of atom mapping comes from the software that gets built on top of it: exact structure comparators, [substructure search systems](/articles/2008/10/02/fast-substructure-search-using-open-source-tools-part-1-fingerprints-and-databases), and query atom/bond search systems such as [SMARTS](http://www.daylight.com/dayhtml/doc/theory/theory.smarts.html). The fundamental nature of atom mapping means that correctness, efficiency and adaptability are essential features of a good mapping implementation. Recently, a D-F article made the case that atom mapping software written in Java [needs to be Java-centric](/articles/2008/11/13/one-of-these-things-is-not-like-the-other) to achieve these goals. This article, the first in a series that describes a complete substructure search system written in Java, takes the first step by offering some simple interface definitions and code for the atom mapping problem.

# The Problem

Given a query molecule (`query`) and a target molecule (`target`), our atom mapping software needs to find ways to match the atoms of `query` onto `target` such that the mapping describes a substructure embedded in `target`. The software might stop at one mapping, continue on to find all of them, or stop at some point in the middle. It all depends on the specific cheminformatics problem we're trying to solve.

# The Recursive Function

Our implementation will gradually build up an atom mapping by traversing the atoms of `query` in depth-first order and trying to map each found atom onto an atom in `target`. At each step in the process, we will have a partial atom map that maps some of the atoms in `query` onto `target`. That map, and any other information needed to complete the analysis will be kept in an instance of a class implementing the `State` interface.

A `State` will be manipulated by a recursive method, `mapFirst` that returns when the first atom map is found:

```java
// create a list to hold atom maps
List<Map<Atom, Atom>> maps = new ArrayList<Map<Atom, Atom>>();

// create initial state
State state = ...; 

boolean mapFirst(State state)
{
  if (state.isDead())
  {
    return false;
  }

  if (state.isGoal())
  {
    maps.add(state.getMap());

    return true;
  }

  boolean found = false;

  while (!found && state.hasNextCandidate())
  {
    Match candidate = state.nextCandidate();

    if (state.isMatchFeasible(candidate))
    {
      State nextState = state.nextState(candidate);
      found = mapFirst(nextState);

      nextState.backTrack();
    }
  }

  return found;
}
```

Comparison of the `mapFirst` method to the pseudocode [VF algorithm `Match` procedure given in the previous article](/articles/2008/11/13/one-of-these-things-is-not-like-the-other) shows some similarities. In fact, something similar to the `mapFirst` method forms the basis of many atom mappers in use today.

Although it may be clear from the code, it's worth re-iterating that each time `mapFirst` is recursively called, an attempt is made to branch off a new `State` that maps an additional pair of atoms from `query` to `target`. If that branch leads to a possible solution, it's followed. Otherwise the next possible mapping is explored.

# The `State` Interface

The recursive `mapFirst` method determines all of the methods the `State` interface needs to define:

```java
public interface State
{
  /**
   * Returns the current mapping of query atoms onto target atoms.
   * This map is shared among all states obtained through nextState.
   */
  public Map&lt;Atom, Atom&gt; getMap();

  /**
   * Returns true if another candidate match can be found or
   * false otherwise.
   */
  public boolean hasNextCandidate();

  /**
   * Returns the next candidate match.
   */
  public Match nextCandidate();
  
  /**
   * Returns true if the given match will work with the current
   * map, or false otherwise.
   */
  public boolean isMatchFeasible(Match match);
  
  /**
   * Returns true if all atoms in the query molecule have been
   * mapped.
   */
  public boolean isGoal();
  
  /**
   * Returns true if no match will come from this State.
   */
  public boolean isDead();
  
  /**
   * Returns a state in which the atoms in match have been
   * added to the current mapping.
   */
  public State nextState(Match match);
  
  /**
   * Returns this State's atom map to its original condition.
   */
  public void backTrack();
}
```

Finally, `State` uses an instance of the `Match` class:

```java
public class Match
{
  private Atom query;
  private Atom target;

  public Match(Atom query, Atom target)
  {
    this.query = query;
    this.target = target;
  }

  public Atom getQueryAtom()
  {
    return query;
  }

  public Atom getTargetAtom()
  {
    return target;
  }
}
```

# Conclusions

With just a few lines of Java, we've managed to reduce the fundamental cheminformatics problem of atom mapping to the far simpler problem of implementing the `State` interface.

How many ways are there to implement the `State` interface? Probably as many as there are subgraph isomorphism algorithms. Notice that the way we've set up the problem lets us use the same recursive method to test all `State` implementations, an essential prerequisite for benchmarking and optimization.

Future articles in this series will describe one way to implement the `State` interface.
