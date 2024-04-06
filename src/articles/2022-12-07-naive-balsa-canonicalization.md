---
title: Naive Balsa Canonicalization
genre: Big Idea
summary: "A ground-up approach to unique molecular naming."
twitter: true
summary-image: images/posts/20221207/summary.png
published: "2022-12-07T15:00:00Z"
---

The comparison of molecules for equivalence is a computationally complex process whose efficiency can be improved through canonicalization. Canonicalization deterministically chooses one molecular representation from all candidates. The technique applies whenever collections of unique molecules are assembled or generated, which turns out to be a lot of situations. Many works describe canonicalization, but few do so from first principles and even fewer wholistically. This article outlines a naive canonicalization algorithm that is complete, conceptually, simple, and correct. Given time and some effort, it may develop into something practical.

# Balsa

The input to a canonicalization procedure is a data structure representing a molecule. There are many possible representation systems to choose from, but the one I'll use here is [Balsa](https://doi.org/10.26434/chemrxiv-2022-01ltp). Balsa was created as a language subset of SMILES. As such, Balsa looks and acts a lot like SMILES. All Balsa strings can be read by SMILES software, and a subset of SMILES strings can be read by Balsa software.

Balsa's data model is unusual in that it's based on the *molecular tree*. A molecular tree is a representation based on the graph theoretical concept of a [directed rooted tree](https://en.wikipedia.org/wiki/Tree_(graph_theory)#Rooted_tree), or more specifically an arborescence. Molecular graphs are far more common. The difference is subtle but important for the discussion that follows.

# The Algorithm

Given a molecular encoding, the simplest canonicalization algorithm consists of just two steps:

1. Enumerate all possible Balsa trees.
2. Choose the minimal (or maximal) Balsa tree.

This algorithm is guaranteed to yield the same result for all equivalent representations given a sufficiently precise tree ordering. It's also the simplest algorithm that can possibly work.

More importantly, some version of this algorithm is required regardless of how canonicalization is performed. In a [broad treatment of canonicalization](https://doi.org/10.1002/9783527618279.ch7a), Ivanciuc refers to this procedure more generally as "canonical code generation by automorphism permutation" (CCAP). A number of reported canonicalization procedures omit this crucial step and are therefore incomplete.

In practice, a *normalization* step would be performed at some point. Normalization in this context is the process of consistently applying representation conventions. For example, Balsa allows atoms to be represented either in shortcut or bracket form (e.g., "C" or "\[CH4\]", respectively). Normalization ensures that the features of an input molecule are consistently represented. One normalization might therefore transform any atom capable of being encoded as a shortcut into that form (e.g., "\[CH4\]" into "C"). Another normalization might unify atom selection. And so on. Normalization is not strictly necessary but does simplify the canonicalization problem.

Even including normalization, the algorithm seems too simple to work. So what's the catch?

# Counting Balsa Trees

Reducing the naive algorithm to practice requires a way to generate the set of all possible trees. Before going to the trouble, we might want to estimate the size of that set. Intuition suggests it could be impractically large at least in some cases, but how large exactly?

A Balsa tree roughly maps to the graph theoretical concept of the *spanning tree*. [Wikipedia](https://en.wikipedia.org/wiki/Spanning_tree) offers this concise definition:

> ... A spanning tree of a connected graph G can also be defined as a maximal set of edges of G that contains no cycle, or as a minimal set of edges that connect all vertices.

An upper bound on the number of spanning trees for a molecular graph is available through [Cayley's formula](https://en.wikipedia.org/wiki/Cayley%27s_formula): (*n*<sup>(*n* - 2)</sup>). This formula is easy to apply. Consider cyclopropane with its three atoms (*n* = 3). Using the formula, the number of spanning trees in cyclopropane is three (3<sup>3 - 2</sup>). Complete graphs are (fortunately) rare in chemistry, so we can expect the actual number of spanning trees to be less than the value computed by Cayley's formula.

A precise spanning tree count for arbitrary graphs is available from [Kirchhoff's theorem](https://en.wikipedia.org/wiki/Kirchhoff's_theorem). The count is computed as the determinant of a modified adjacency matrix. Many descriptions of this procedure can be found online because the problem has been so well studied.

<div class="videowrapper">
  <iframe src="https://www.youtube.com/embed/HlcpVDCAZFM" allowfullscreen></iframe>
</div>

Unfortunately, Kirchhoff's theorem can't be generalized over simple graph descriptors like size or order. Even so, the number of spanning trees declines with atom connectivity. The video above works through the example of the [diamond graph](https://en.wikipedia.org/wiki/Diamond_graph) (e.g., "bicyclo[1.1.0]butane"), whose spanning tree count is 8. This is considerably fewer than the *K*<sub>4</sub> graph (16, or 4<sup>2</sup> via Cayley's formula). The spanning tree count for a more relevant representatively-connected graph such as toluene is six, compared to the 16,807 spanning trees for the complete graph on seven vertexes (7<sup>5</sup>).

Balsa trees are rooted, meaning that one atom serves as the ancestor of all other nodes. Any estimate of the Balsa tree count must therefore include the effects of rooting. If *t* is the number trees found from Kirchhoff's theorem and *n* is the number atoms in any one of them, then the upper bound on the number of uniquely-rooted spanning trees is *n*⨉*t*.

Yet another factor is child order. The order of children in a tree is generally considered irrelevant, but in the context of Balsa canonicalization it matters. For example, the two string representations for ethanol rooted at the branched carbon ("C(C)O" and "C(O)C") are distinguishable. Each non-root branch multiplies the number of Balsa trees by (*d* - 1)!, where *d* is the degree of the branching atom.

On the other hand, symmetry can reduce the number of possible trees. Both Kirchhoff's theorem and Cayley's formula consider nodes to be unique, but in Balsa trees they may or may not be. Consider cyclopropane. Although its tree count is three by Cayley's formula, the number of Balsa trees is just one because each atom is considered equivalent to the others.

Another factor that tends to suppress Balsa tree counts is chemical valence and molecular size. The maximum degree of an atom in an organic molecule rarely exceeds four. Likewise, heavy atom counts exceeding 25 are less common.

I'm unaware of any analysis offering a more exact estimation of the number of Balsa strings. What's clear is that the multiplicative effects of rooting and branching drive up the number of possible Balsa trees. At the same time the rules of chemical valence and atom count suppress the tree count.

To summarize, the exhaustive enumeration of Balsa trees appears to lie in a grey zone of practicality, with the multiplicative effects of branching and rooting offset by the limiting effects of maximum degree and node count, respectively.

# Exhaustive Tree Enumeration

Several approaches to exhaustive Balsa tree enumeration are conceivable. Relevant work includes several well-studied, exhaustive spanning tree enumeration algorithms, including [the one developed by Char](https://doi.org/10.1109/TCT.1968.1082817). For the time being, these options will be set aside to consider the problem from first principles.

The goal is to enumerate every possible Balsa tree. These trees are constructed from depth-first traversal of a molecular graph. Therefore, a reasonable place to begin looking for a way to enumerate all rooted trees is with depth-first traversal.

The [Balsa reference implementation](/articles/2022/11/23/balsa-reference-implementation/) includes a construct that may come in handy. `Follower` and `walk` are a Rust trait and function, respectively, that decouple depth-first traversal from processing. By implementing `Follower`, an instance can process the result of a traversal independently of traversal mechanics.

The idea is very general. For example, `tree::Builder` is a `Follower` that constructs a tree representation whereas `graph::Builder` constructs a graph representation. `Writer` is a `Follower` that produces a Balsa string. The nature of what a `Follower` builds is completely dependent on the implementation.

Returning to the problem of exhaustive tree generation, it's possible to implement `Follower` in such a way as to construct multiple trees simultaneously. Each tree would be rooted at the same atom. Using some basic properties of Balsa trees, it should be possible to build all possible trees rooted at a given atom using a single walk of either a tree or graph.

Setting aside the issue of implementation, the `Follower` might look something like this:

```rust
struct BranchingBuilder {
    // private values
}

impl Follower for BranchingBuilder {
    // TODO: implement the root, extend, bridge, push, and pop methods
    // to construct an exhaustive set of trees rooted at the same atom
}

impl BranchingBuilder {
    pub fn build(mut self) -> Vec<Atom> {
        // final processing and return the root atom for each tree
        // under construction
        todo!()
    }
}
```

Consider the traversal of the tree represented by the string "\*(C)O". Extension from the star atom to carbon creates a single chain. Executing `pop` resets the head to the root atom ("*"). Extension with the oxygen atom occurs at an already extended atom (the root), triggering a deep clone of the tree under construction. The original tree is extended by placing the oxygen atom after the existing child. The cloned tree is extended by placing the oxygen atom before the existing child. `BranchingBuilder` now contains two trees under construction ("\*(C)O" and "\*(O)C"), with oxygen being the head atom in both cases.

An alternative approach would be to modify the depth-first traversal itself. It may be possible to do this within the context of the reference implementation's `walk` and `Follower` architecture. One way to do this would be for each branch to spawn a new follower, treating the branch as a root and permuting children. The result from each permutation could then be added to a cloned subtree. And so on.

As an aside, the (exhaustive) enumeration of molecular trees has applications beyond canonicalization. For example, it has been used for [augmentation](https://doi.org/10.48550/arXiv.1703.07076) in machine learning. The approach is apparently flexible, with benefits resulting from [just partial enumeration](https://doi.org/10.1186/s13321-019-0393-0).

Fortunately, exhaustive enumeration can likely be avoided in all but a few worst cases as we'll see later.

# Comparing Trees

Given a method for exhaustive tree enumeration, what remains is a basis for comparison. Given two arbitrary trees, it should be possible to establish a [partial order](https://en.wikipedia.org/wiki/Total_order) such that trees can be compared as "greater than," "less than," "and equal to" each other. At least two approaches are possible:

- Direct comparison. Compare the data structures directly available from exhaustive enumeration.
- String comparison. If enumeration yields a data structure other than string, convert it to string, then use standard string comparator functionality built into all programming languages.

Should direct comparison be chosen, it may be helpful to arrange for its ordering to nevertheless equal that obtained from string comparison. This way, the validity of comparisons can conveniently be evaluated as simple string comparison during testing and development. Artifacts related to one- and two-character element symbols can be avoided through the assignment of a single-character symbol for debugging and testing.

For example, exhaustive enumeration of propane would yield two Balsa trees whose string representations are "CCC" and "C(C)C". Based on ASCII ordering, the lesser tree is the one rooted at the secondary carbon ("C(C)C" precedes "CCC" lexicographically). Translating this ordering to a tree-based data structure could be accomplished by valuing branching more highly than elemental ordering.

# Optimizations

Given a correct naive canonicalization procedure, a number of optimizations are possible. Their goal would be to shrink the search space by "pruning" enumerations that can't possibly yield the minimal tree.

A simple optimization would be to abort enumeration of a tree whose root atom is greater than one previously seen. For example, methanol contains two kinds of atoms (carbon and oxygen). If a tree rooted at carbon were enumerated, and this were followed by an oxygen root, the latter enumeration and all of its permutations could be ignored. Doing so would shrink the search space by half. Similar optimizations are possible at each branch point. The optimization could be extended to take atom degree into account, and so on. Using this approach the number of active trees can be reduced, all the while maintaining correctness, testability, and comprehensibility of the reported result.

# Related Work

Three canonicalization studies specifically targeting SMILES have been reported:

- [Weininger et al., 1988](https://doi.org/10.1021/ci00062a008). This work divides SMILES canonicalization into two subroutines: one that generates unique numbering for each atom; and another that generates a canonical SMILES based on the unique numbering. Certain aspects of the process are not detailed including normalization and handling stereodescriptors.
- [O'Boyle, 2012](https://doi.org/10.1186/1758-2946-4-22). Introduces a method for uniquely numbering atoms based on InChI, and specifically applies it to SMILES.
- [Schneider et al.](https://doi.org/10.1021/acs.jcim.5b00543). Replaces the [Penny code](/articles/2022/01/12/penny-codes/) approach used by Weininger with one based on stable sorting. The approach was integrated into RDKit.

Whereas the first study specifically targets SMILES output, aspects of the latter two approaches could be applied to any form of representation.

A helpful [overview of molecular canonicalization](https://doi.org/10.1002/9783527618279.ch7a) was published by Ivanciuc in 2003. Some time later, I [summarized it](/articles/2021/10/06/molecular-graph-canonicalization/), and [applied it to a different representation system](/articles/2022/05/04/tucan-canonicalization-revisited/).

The approach presented here borrows from all of these works, but mainly from that of Ivanciuc.

# Conclusion

This article sketches a naive Balsa canonicalization procedure based on two steps: (1) exhaustive tree enumeration; and (2) sorting the resulting trees. Although rigorously correct, implementations may not be practical due to high computational complexity. Optimizations are, however, feasible. More complex optimizations than those presented here may eventually deliver an efficient, correct, and conceptually simple canonicalization procedure useful in a variety of cheminformatics and computational chemistry applications.
