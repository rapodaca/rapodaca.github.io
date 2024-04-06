---
title: Writing Aromatic SMILES
summary: "What seems like a simple process oozes complexity below the surface."
twitter: true
summary-image: images/posts/20210630/summary.png
published: "2021-06-30T17:00:00Z"
updated: "2022-07-13T11:00:00Z"
---

SMILES is a de facto standard for chemical structure representation. The core language can be picked up quickly, but just below the surface lie some surprisingly complex concepts. One of the most difficult of these is "aromaticity." A [previous article](/articles/2020/02/10/a-comprehensive-treatment-of-aromaticity-in-the-smiles-language/) described a comprehensive approach to reading aromatic SMILES. The following article details a method for writing aromatic SMILES.

# Aromatic SMILES

SMILES atoms and bonds support a boolean flag designating them as *aromatic*. This flag is set through syntax that will be described below. Setting the aromatic flag on an atom can change the way that [implicit hydrogens](/articles/2020/06/08/hydrogen-suppression-in-smiles/) are computed in non-obvious ways. There is furthermore much confusion around the exact meaning of a bond whose aromatic flag has been set. Assuming that aromatic flags have been set properly, their use can incur computational costs that scale superlinearly with atom count. It's therefore crucial to understand the semantics and performance tradeoffs involved, whether you're writing SMILES software or merely using SMILES.

# Why Aromaticity?

Before considering how to write aromatic SMILES, let's tackle the simpler question of why you might want to do that in the first place. The use of aromaticity incurs non-negligible overhead, both for readers and writers. So it makes sense to ensure that the benefit justifies the cost.

<figure>
  <img alt="Jeff Goldblum on Aromatic SMILES" src="/images/posts/20210630/giphy.mp4">
  <figcaption>
    <strong>Jeff Goldblum on Aromatic SMILES.</strong> Just because you can, doesn't mean you should.
  </figcaption>
</figure>

To be clear, aromaticity in SMILES is an optional feature. Any molecule that can be written using aromatic flags can also be written in *Kekulé form*. Kekulé form expresses the electronic structure of a molecule using bond types having integer formal bond order. Consider 1,2-difluorobenzene. Its Kekulé forms represent the electronic structure of the ring as alternating single and double bonds.

<figure>
  <img alt="1,2-difluorobenzene-kekule-forms" src="/images/posts/20210630/1-2-difluorobenzene-kekule-forms.png">
  <figcaption>
    <strong>1,2-Difluorobenzene Kekulé Forms.</strong> Both forms must be treated as equal, a condition caused by limitations of the valence bond model.
  </figcaption>
</figure>

The aromatic form represents exactly the same molecule, but permits bond *elision*. Bond elision in SMILES is the practice of leaving out bonds without loss of structural information. For example, we can write an aromatic SMILES for 1,2-difluorobenzene in which all bonds are elided. This is possible because the ring atoms have been marked as aromatic with lowercase symbols.

<figure>
  <img alt="Bond Elision" src="/images/posts/20210630/bond-elision.png">
  <figcaption>
    <strong>Bond Elision.</strong> The aromatic form of 1,2-difluorobenzene allows ring bonds to be dropped from encoding.
  </figcaption>
</figure>

Therefore, one reason to write aromatic SMILES is convenience. Eliding bonds simplifies manual encoding of SMILES, [something that you can test for yourself](https://chemwriter.com/smiles/). The idea is that this shortcut leads to faster and less error-prone data entry in interactive environments such as a REPL or notebook.

Although convenience during manual entry might justify the need for software that reads aromatic SMILES, it doesn't justify the need for software that writes aromatic SMILES.

Another reason to write aromatic SMILES is tradition. Many toolkits default to aromatic output and so this form has become familiar. But familiarity is subjective, and [as noted before](/articles/2009/10/14/the-smiles-antipattern/), presenting SMILES to end users can be be considered an anti-pattern.

Some sources mention the ability of aromatic SMILES to carry chemical meaning. However, the SMILES documentation is clear: no chemical meaning can be ascribed to aromatic SMILES. As [noted](http://doi.org/10.1002/9783527618279.ch5) by Dave Weininger, creator of SMILES:

> “Aromatic” means “it smells nice”. No kidding, that is the only defensible definition. There is no single rigorous definition of aromaticity in chemistry. To a synthetic chemist, aromaticity implies something about reactivity; to a thermodynamicist, about heat of formation; to a spectroscopist, about NMR ring current; to a molecular modeler, about geometrical planarity; to a cosmetic chemist, it probably means “smells nice”. The SMILES definition of aromaticity has nothing to do with the other definitions, except that we would all agree that benzene is “aromatic”.

Despite the misappropriation of a name dripping with chemical history and controversy, aromaticity in SMILES is purely a language construct, with no physical significance whatsoever. Applications that export aromatic SMILES for the purpose of conveying chemical meaning run the very real risk of being misinterpreted.

This brings us to the original and still best reason for a software implementation to encode aromatic SMILES: to yield a unique molecular identifier for applications such as constant-time lookup (aka "canonicalization," as described in the next section). But as we'll soon see, aromatic SMILES is unnecessary even in this context.

More recently, a secondary motivation for writing aromatic SMILES has come into play: machine learning. Numerous papers report the direct use of SMILES strings in machine learning projects. For leading references, see [DeepSMILES](https://doi.org/10.26434/chemrxiv.7097960.v1) and [SELFIES](https://doi.org/10.1088/2632-2153/aba947). Most studies use aromatic SMILES but to my knowledge the effect, if any, of doing so has never been addressed.

When it comes down to it, the justification for using aromatic SMILES in many situations is rather flimsy. Nevertheless, aromatic SMILES are ubiquitous.

# Canonicalization

By itself SMILES is not suitable as a unique molecular identifier. A SMILES string encodes a depth-first traversal over a molecular graph. The specific form this string takes reflects both representational details and the relative ordering of atoms. For example, propane can be represented by two different SMILES strings depending on whether the ordering places the secondary carbon before or after the primary carbons.

<figure>
  <img alt="Propane SMILES" src="/images/posts/20210630/propane-smiles.png">
  <figcaption>
    <strong>Propane SMILES.</strong> These equivalent forms result from different depth-first traversals.
  </figcaption>
</figure>

Given a unique atom ordering, SMILES can be used as a unique molecular identifier. This can be accomplished through [*canonicalization*](https://en.wikipedia.org/wiki/Canonicalization). In computer science, canonicalization is the process of choosing one representation out of more than one possibility. A molecular graph is canonicalized through the application of a deterministic system for encoding features, and a deterministic ordering of nodes.

A complicating factor is [*delocalization-induced molecular equality*](/articles/2021/06/17/delocalization-induced-molecular-equality/) (DIME). DIME occurs when a molecule can be represented by two or more unequal graphs ("contributing graphs") that must nevertheless be considered equal. For example, it's easy to identify two unequal contributing graphs for 1,2-difluorobenzene. Even if we develop a unique atom ordering for this molecule, there will be two contributing graphs and therefore two SMILES.

<figure>
  <img alt="Contributing Graphs" src="/images/posts/20210630/contributing-graphs.png">
  <figcaption>
    <strong>Contributing Graphs.</strong> Two unequal molecular graphs are nevertheless treated as equals.
  </figcaption>
</figure>

As [explained](http://doi.org/10.1002/9783527618279.ch5) by Weininger, the main purpose of aromaticity in SMILES is to enable canonicalization through the elimination of contributing graphs:

> The SMILES language was specifically designed to be “canonicalizable”, i.e. not only to provide an unambiguous chemical nomenclature but also be able to express a single, unique SMILES for every structure in the same language. This implies a fundamental requirement to express the symmetry of a molecule correctly. Consider the problem of generating a unique SMILES for OclccccclF ortho-fluorophenol, but without aromatic bonds. There are two ways to write it, OCl=CC=CC=ClF (with the substituted carbons joined by a single bond) and OCl=C(F)C=CC=Cl (with the substituted carbons joined by a double bond). These are two different molecular graphs: the SMILES for these will always differ. For purposes of unique nomenclature, it is not acceptable to have two different “unique SMILES” for the same molecule. SMILES language provides an “aromatic” concept to avoid this conundrum.

One option, not considered by Weininger, is to refine the canonicalization procedure to set the position of double bonds capable of delocalization. In other words, we can pick one contributing graph over the other. This approach doesn't require the aromaticity flag at all.

Another approach is to use the aromaticity features of SMILES to elide bonds, as Weininger notes. Because double bonds are no longer being written, they can no longer give rise to multiple contributing graphs.

Notice, however, that regardless of the approach (using the aromatic flag or picking a contributing graph), exactly the same work must be done to identify contributing graphs. Aromatic SMILES does not absolve a canonicalizer of the responsibility to detect DIME. It merely eliminates the problem of picking a canonical form.

Nor is aromatic SMILES a complete solution to DIME. For example, your application may or may not consider cyclobutadiene contributing graphs to be equal. For its part, [the experimental evidence](https://doi.org/10.1021/ja01049a043) suggests that cyclobutadiene contributing graphs should not be considered equal. Aromatic SMILES can only offer a tool to express contributing graph equality if desired. It does not absolve you of the need to decide whether doing so is appropriate. Moreover, many forms of DIME, such as tautomerism, can't be addressed through aromatic notation. Your application will need to discriminate contributing graphs anyway.

# Delocalization Subgraph

SMILES aromaticity revolves around an implicit construct I call the *delocalization subgraph* (DS). The DS is a possibly empty set of atoms and bonds (i.e., a "subgraph") that represent a delocalized electron system. Every SMILES is associated with a single DS, which may contain disconnected components. Any bond contained within the DS can be elided. This yields representations that eliminates certain forms of DME.

Consider 1,2-difluorobenzene. Its DS includes all of the atoms and all of the bonds in the six-membered ring.

<figure>
  <img alt="Delocalization Subgraph" src="/images/posts/20210630/delocalization-subgraph.png">
  <figcaption>
    <strong>Delocalization Subgraph.</strong> A subgraph over the nodes and edges of a molecular graph. Every SMILES encodes one DS, which may be empty and may contain disconnected components. A DS is populated by invoking aromatic atom syntax.
  </figcaption>
</figure>

A SMILES containing a DS makes a very specific promise to readers: the DS will have a *perfect matching*. As [explained previously](/articles/2019/04/02/the-maximum-matching-problem/), a matching is a subgraph in which no two edges share a common node. A perfect matching covers all nodes of the parent graph. Put another way, a SMILES will only be valid if a perfect matching over its DS exists. For monocyclic systems, two equivalent perfect matchings will exist, and each will correspond to a contributing graph.

<figure>
  <img alt="Perfect Matching" src="/images/posts/20210630/perfect-matching.png">
  <figcaption>
    <strong>Perfect Matching.</strong> A matching is a subgraph in which each node has degree one. Maximal and maximum matchings cover only some nodes in the parent graph. A perfect matching covers all nodes of the parent graph. Perfect matching is the basis for interpreting a delocalization subgraph.
  </figcaption>
</figure>

For example, the following DS for 1,2-difluorobenzene is valid because a perfect matching over its DS exists.

<figure>
  <img alt="Valid Delocalization Subgraph" src="/images/posts/20210630/valid-delocalization-subgraph.png">
  <figcaption>
    <strong>Valid Delocalization Subgraph.</strong> The DS is valid because it supports a perfect matching.
  </figcaption>
</figure>

An invalid SMILES results when a DS without a perfect matching is created. Consider, the cyclopentadienyl radical. Adding every atom and every bond to the DS results in a graph without a perfect matching. Therefore, the corresponding SMILES is invalid.

<figure>
  <img alt="Invalid Delocalization Subgraph" src="/images/posts/20210630/invalid-delocalization-subgraph.png">
  <figcaption>
    <strong>Invalid Delocalization Subraph.</strong> The DS is invalid because no perfect matching exists. Perfect matching does not account for node identity, so this result holds for any molecule with an isolated five-membered ring, and many other molecular graphs.
  </figcaption>
</figure>

A DS must have a perfect matching because this is the way that an aromatic representation is *Kekulized*. Kekulization is the transformation of a SMILES representation that uses aromatic notation into one that does not. The first step of kekulization is to obtain a perfect matching over the DS. Then, elided bonds are replaced by with double bonds for each edge in the matching.

<figure>
  <img alt="From Perfect Matching to Kekulé Form" src="/images/posts/20210630/from-perfect-matching-to-kekule-form.png">
  <figcaption>
    <strong>From Perfect Matching to Kekulé Form.</strong> Every edge in the perfect matching becomes a double bond in the Kekulé form.
  </figcaption>
</figure>

Although a perfect matching must exist for a DS to be valid, there are many ways to satisfy this requirement. Consider hexatriene, which can be represented using aromatic notation by adding all carbons and the bonds between them to the DS. A perfect matching over the DS exists (exactly one!). The SMILES is therefore valid.

<figure>
  <img alt="No Cycle Necessary" src="/images/posts/20210630/no-cycle-necessary.png">
  <figcaption>
    <strong>No Cycle Necessary.</strong> Encoding a DS for hexatriene violates no rules, but it is useless for kekulization.
  </figcaption>
</figure>

Of course, representing hexatriene in this way is unnecessary because there is only one contributing graph. However, it turns out that many uses of SMILES aromatic flags are unnecessary, even in cases purportedly trying to eliminate DIME.

# Gratuitous Aromaticity and Pruning

If a writer fails to identify DIME before generating a SMILES, the result can be *gratuitous aromaticity*. Gratuitous aromaticity occurs when aromatic flags are set on features that don't induce contributing graphs. Gratuitous aromaticity, like gratuitous sex in the media, is not illegal, may appeal for reasons that are hard to put into words, and is rather widespread.

Consider 2,3-difluoropyrrole. Only one contributing graph exists, but the corresponding SMILES can be written without regard for this fact. Adding all cyclic atoms and the bonds between them to the DS yields a subgraph without a perfect matching.

<figure>
  <img alt="Gratuitous Aromaticity" src="/images/posts/20210630/gratuitous-aromaticity.png">
  <figcaption>
    <strong>Gratuitous Aromaticity.</strong> Only one contributing graph exists, so aromaticity for the sake of canonicalization is not needed.
  </figcaption>
</figure>

To resolve this issue, SMILES readers supporting kekulization must be capable of a procedure I'll call *pruning*. As [noted previously](/articles/2020/02/10/a-comprehensive-treatment-of-aromaticity-in-the-smiles-language/), pruning removes those atoms from a DS that are incapable of forming a double bond without introducing a radical or charge. The defining characteristic of atoms that will be pruned is a valence that equals a [normal valence](/articles/2020/06/08/hydrogen-suppression-in-smiles/). This rule applies to both bracketed and unbracketed atoms. Pruning ensures that kekulization will generate no radicals or charges.

<figure>
  <img alt="Pruning a Delocalization Subgraph" src="/images/posts/20210630/pruning-a-delocalization-subgraph.png">
  <figcaption>
    <strong>Pruning a Delocalization Subgraph.</strong> The heteroatoms of furan and pyrrole are pruned from a DS because they will never be attached to double bonds. The heteroatoms of pyridine and pyridine-N-oxide are not pruned because they can be attached to double bonds.
  </figcaption>
</figure>

Although pruning offers a simple solution to a tricky problem for readers, it does nothing to address the root problem: 2,3-difluoropyrrole and many similar molecules don't require aromatic flags because their Kekulé forms do not lead to DIME.

This perspective simplifies a number of otherwise awkward issues. For example, some SMILES users advocate increasing the set of elements whose atoms can be marked as aromatic. Tellurium is a sometimes-cited example. But unless the goal is to support the canonicalization of tellurium analogs of pyridine, there's no need. [Mere tellurophenes](https://en.wikipedia.org/wiki/Tellurophenes) can't lead to DIME any more than furans can. So the need for aromatic tellurium can hardly be justified on the grounds of canonicalization.

Finally, it should be noted that gratuitous aromaticity can arise through symmetry. Consider fluorobenzene. The corresponding molecular graph does not exhibit DIME due to symmetry. Marking the ring atoms in this molecule as aromatic leads to gratuitous aromaticity.

<figure>
  <img alt="Gratuitous Aromaticity through Symmetry" src="/images/posts/20210630/gratuitous-aromaticity-through-symmetry.png">
  <figcaption>
    <strong>Gratuitous Aromaticity through Symmetry.</strong> The symmetry of fluorobenzene inhibits DIME.
  </figcaption>
</figure>

# Syntax

An atom's aromatic flag can be set by replacing the first letter of its element symbol with its lower case counterpart. For example, aromatic carbon is encoded by the element symbol "C" (`c`), nitrogen uses lowercase "N" (`n`), and so on. However, not every atom is eligible for this treatment.

Only those atoms associated with certain atomic symbols can accept the aromatic designation. Membership of the set is driven by the need to later kekulize without introducing charges or radicals. This allows us to place some requirements on the symbols of atoms that can be aromatized:

1. *The star, or wildcard symbol (`*`)*. Regardless of its current valence, another double bond can always be made to a star atom without changing its other properties.
2. *One or more "normal valences" are defined for the element*. A normal valence is the number of hydrogens that can be attached to an isolated atom. Multiple normal valences are possible for some elements due to their support for an expanded octet. Normal valence is required information because only atoms with an unused valence can form a double bond during kekulization without introducing a charge or radical.

In practice, the halogens are excluded even though all are assigned normal valences. The reason seems to be that these elements rarely display valences beyond one, whereas a double bond requires at least divalence.

A bond is marked aromatic by using the colon symbol (`:`). The restrictions on its use are simple to state: there are none. The aromatic flag can be set on any bond because it will be ignored wherever it appears. In other words, the aromatic bond symbol is synonymous with bond elision. To maintain backward compatibility, readers must be able to read the the colon bond symbol. But writers should consider it deprecated in favor of bond elision.

# Electron Cycles

Atoms and bonds are added to a DS by detecting a molecular feature I call an *electron cycle*. An electron cycle is a cycle whose bond overlay contains an uninterrupted, alternating pattern of single and double bonds. When present, an electron cycle can induce multiple contributing graphs and therefore DIME.

The key to this phenomenon is *inversion*. Inversion toggles the order of the bonds in an electron cycle. More concretely, single bonds are replaced by double bonds and double bonds are replaced by single bonds. An inverted electron cycle is indistinguishable from the original except through the placement of double bonds. Neither atom connectivity nor hydrogen counts are affected.

For example, 1,2-difluorobenzene contains one electron cycle. Its inversion partitions the space of molecular graphs, leading to DIME.

<figure>
  <img alt="Electron Cycle" src="/images/posts/20210630/electron-cycles.png">
  <figcaption>
    <strong>Electron Cycle.</strong> A Kekulé form of 1,2-difluorobenzene contains an electron cycle. Its inversion yields a contributing graph.
  </figcaption>
</figure>

A given molecule's electron cycles can vary depending on the contributing graph being used. For example, one contributing graph for 2-fluorobiphenylene has a single electron cycle of size 12. Another contributing graph has two electron cycles of size six and one of size four.

<figure>
  <img alt="Electron Cycles Depend on Kekulé Form" src="/images/posts/20210630/electron-cycles-depend-on-kekule-form.png">
  <figcaption>
    <strong>Electron Cycles Depend on Kekulé Form.</strong> Whether or not a molecular graph presents a given electron cycle set can depend on which contributing graph is used. The four-membered cycle for the contributing graph on the right may or may not be detected, but this won't affect the DS.
  </figcaption>
</figure>

# Intermission: Huckel, Huckel, Toil and Trouble

The definition of electron cycle presented in the previous section is the narrowest one required for canonicalized output. However, some applications may require aromatic SMILES output for cosmetic reasons, to promote manual convenience, or aesthetics. Such uses can be accommodated by relaxing the definition of electron cycle, but at a price.

We can redefine the term "electron cycle" to mean a cycle whose bond overlay contains an alternating pattern of single and double bonds optionally interrupted by uncharged, isolated atoms possessing a nonbonding electron pair or electron hole. Under this definition, the concept of inversion disappears. In its place we might substitute a required electron count of 4*n* + 2, where *n* is a positive integer. A hole contributes zero electrons, a nonbonding pair contributes two. A double bond would contribute two electrons. This is similar to Hückel's often stated but poorly understood rule.

The main problem with this approach is that it excludes 4*n* systems such as cyclobutadienes, cyclooctatetraenes, pentalenes, and the like. This may or may not be desired or expected. On the positive, side, electron cycles such as the one in borepin would be detected.

<figure>
  <img alt="When Hückel Fails" src="/images/posts/20210630/when-hueckel-fails.png">
  <figcaption>
    <strong>When Hückel Fails.</strong> Cyclobutadienes, cyclooctatetraenes, cyclopenta[d]imidazoles, and many other cycles fail the 4<em>n</em>+2 test. Borepin passes.
  </figcaption>
</figure>

A secondary problem is that SMILES has no concept of nonbonding electron pairs or electron holes, although some documentation may misleadingly imply its existence. Normal valences have no role to play here because they say nothing about electron holes or nonbonding pairs.

We could correct this situation by tabulating every aromatizable atom type in every possible valence state together with a contributing electron count. When iterating electron cycle candidates, we perform a test. If an atom is not bound to another atom in the cycle through a double bond, we ask two questions:

1. Is the atom adjacent to another atom within the cycle lacking an internal double bond?
2. Is the atom's environment missing from the table?

If the answer to either question is "yes," then the candidate electron cycle is rejected.

The table itself might contain entries like the following:

<table>
  <thead>
    <tr>
      <th>Symbol</th><th>Valence</th><th>Electron Count</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>B</td><td>2</td><td>1</td>
    </tr>
    <tr>
      <td>B</td><td>3</td><td>0</td>
    </tr>
    <tr>
      <td>C</td><td>2</td><td>2</td>
    </tr>
    <tr>
      <td>C</td><td>3</td><td>1</td>
    </tr>
    <tr>
      <td>C</td><td>4</td><td>0</td>
    </tr>
    <tr>
      <td>N</td><td>2</td><td>3</td>
    </tr>
    <tr>
      <td>N</td><td>3</td><td>2</td>
    </tr>
    <tr>
      <td>N</td><td>4</td><td>1</td>
    </tr>
    <tr>
      <td>O</td><td>2</td><td>2</td>
    </tr>
    <tr>
      <td>P</td><td>2</td><td>1</td>
    </tr>
    <tr>
      <td>P</td><td>3</td><td>2</td>
    </tr>
    <tr>
      <td>S</td><td>2</td><td>2</td>
    </tr>
    <tr>
      <td>S</td><td>4</td><td>1</td>
    </tr>
  </tbody>
</table>

# Finding Electron Cycles

Electron cycles lead to the only form of DIME that aromatic SMILES was designed to address. Therefore, a SMILES writer capable of setting the aromatic flag on a kekulized molecular graph requires a reliable method for the exhaustive detection of electron cycles.

The following is such a method based on a directed depth-first traversal of a molecular graph (`molecule`).

1. Create the empty sets `cycles` and `atoms`.
2. Pick an atom (`root`) from `molecule` not in `atoms`. If none exists, return `cycles`.
3. Perform a directed DFS starting at `root`. Follow an alternating single-double path.
4. On encountering a bond to `root`, create a cycle (`cycle`) from the current path. Add the atoms of `cycle` to `atoms`. Add `cycle` to `cycles`. Continue traversal.
5. If traversal ends without the detection of an electron cycle, add `root` to `atoms`.
6. GOTO 2.

As an example, consider one of the 2-fluoropentalene contributing graphs. If atom 1 is chosen as `root`, directed traversal can proceed in the order 1-2-6-7-8-3-4-5-(1). This cycle is then added to `cycles`, and all of its atoms are added to `atoms`. Then the only atom not in `atoms` is 13. However, the only depth-first traversal open to it does not lead to a cycle. Atom 13 is then added to `atoms`. All of the molecule's atoms are now contained in `atoms`, so `cycles` is returned.

<figure>
  <img alt="Finding an Electron Cycle" src="/images/posts/20210630/finding-an-electron-cycle.png">
  <figcaption>
    <strong>Finding an Electron Cycle.</strong> Directed depth-first traversal over 2-fluorobiphenylene can find cycle 1-2-3-6-7-8-3-4-5-1, but it can also terminate nonproductively with path 1-2-3-8-7-6. 
  </figcaption>
</figure>

Notice however that depth-first traversal can just as easily uncover the nonproductive path 1-2-3-8-7-6. Therefore, the traversal must recognize such a situation and ensure the 2-6 branch is traversed regardless. Depending on the graph, this check can add considerable computational cost.

Alternatively, the set of all cycles can be generated using an algorithm like the one developed by [Hanser](/articles/2008/12/16/exhaustive-ring-perception/). Each member of this set is then tested for the presence of an alternating overlay of single and double bonds. To accommodate uses beyond canonicalization, a less restrictive electron cycle definition could be used.

It's important to realize that we can't use [a smallest set of smallest rings (SSSR) or the set of relevant cycles](/articles/2020/08/31/a-smallest-set-of-smallest-rings/) it find electron cycles. To see why, consider 2-fluoronapthalene. SSSR and the set of relevant cycles contain the smaller six- and four-membered rings but exclude the enveloping twelve-membered ring defining the electron cycle.

<figure>
  <img alt="Cycle Basis Fail" src="/images/posts/20210630/cycle-basis-fail.png">
  <figcaption>
    <strong>Cycle Basis Fail.</strong> SSSR and the set of relevant cycles exclude a valid electron cycle.
  </figcaption>
</figure>

Regardless of whether or not aromaticity is encoded, a canonical SMILES writer must compute the set of electron cycles. Aromatic SMILES writers will use electron cycles to build a DS. Writers not using aromaticity will invert the electron cycles to find a canonical representation.

# Building and Using a Delocalization Subgraph

It's now possible to formalize the requirements for the atoms and bonds in a DS. The DS contains all of the atoms found in at least one electron cycle. The DS also contains all of the bonds joining two DS member atoms. In other words, a DS is an edge-induced subgraph over those atoms belonging to one or more electron cycles.

The steps to build a DS from a molecule (`molecule`) for canonicalization purposes can be summarized as follows:

1. Create an empty delocalization subgraph `ds`.
2. Find all electron cycles (`cycles`).
3. Add an atom to DS if it belongs to at least one cycle in `cycles`.
4. For each bond (`bond`) in `molecule`, add `bond` to `ds` if both of its terminals are in `ds`.

Unless steps are taken to address it, the set in Step (2) may contain cycles capable of inducing gratuitous aromaticity through symmetry. These can be eliminated prior to the use of `cycles` by finding the set of all automorphisms for `molecule`. A cycle in which at least one atom maps to another atom within the cycle can be pruned. Automorphism is a potentially expensive operation. However, canonicalization algorithms generally require this step (or one like it) anyway so its use in writing aromatic SMILES may not incur additional cost.

<div class="videowrapper">
  <iframe src="https://www.youtube.com/embed/X4_4Bqj6EdA" allowfullscreen></iframe>
</div>

# Conclusion

Aromaticity offers an optional way to encode bonding relationships in SMILES. Every aromatic SMILES can be transformed into a fully-equivalent kekulized counterpart. This property leads to several important constraints on SMILES writers. A complete treatment of writing aromatic SMILES, suitable for both canonicalization and other applications, is presented. The procedure is based on two implicit concepts that are discussed explicitly here: "delocalization subgraph" and "electron cycle." Both may have utility outside of SMILES.
