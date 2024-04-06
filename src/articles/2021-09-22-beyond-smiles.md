---
title: "Beyond SMILES"
summary: Charting a new course for an old language.
twitter: true
summary-image: images/posts/20210922/summary.png
published: "2021-09-22T17:30:00Z"
updated: "2021-09-23T22:30:00Z"
---

Since its first public description in 1988, SMILES has become one of chemistry's most widely-used information exchange formats. All major toolkits support it. A lot of user-facing software reads and writes it. Many public databases include it. More recently it's become a popular input/output format for machine learning.

But despite this widespread adoption, SMILES is remarkably under-specified. For example, [Weininger's original 1988 paper](https://dx.doi.org/10.1021/ci00057a005) left many topics as an exercise for the reader. The word "stereochemistry" appears not once. The syntax for this "language" was only described anecdotally. Some semantic considerations such as hydrogen counting and aromaticity were only partially addressed.

Since then, various sources have filled in some gaps. [The Daylight Theory Manual](https://www.daylight.com/dayhtml/doc/theory/) introduced stereochemistry and a more explicit valence model. A [subsequent publication](https://doi.org/10.1002/9783527618279.ch5) by Weininger added a partial formal grammar. OpenSMILES produced a more complete, but [limited](/articles/2020/12/21/smiles-formal-grammar-revisited/) grammar, vastly expanded on non-tetrahedral stereochemistry, and addressed a number of other issues. [SMILES+](https://github.com/IUPAC/IUPAC_SMILES_plus), an [IUPAC initiative](https://iupac.org/projects/project-details/?project_nr=2019-002-2-024), looked as if it were positioning itself to pick up where OpenSMILES left off, but has so far not done so. These efforts have certainly improved the situation to a degree, but I'm not sure that's enough.

I started to become acutely aware of the limitations of SMILES documentation as I was writing [Purr](https://crates.io/crates/purr). Purr is a low-level toolkit for reading and writing SMILES. Think of it as a library that a cheminformatics toolkit would use to deal with SMILES. Some of the many problems I encountered made their way into blog posts, including:

- [Writing Aromatic SMILES](/articles/2021/06/30/writing-aromatic-smiles/)
- [Fast Hydrogen Counting in SMILES](/articles/2021/02/10/fast-hydrogen-counting-hydrogens-in-smiles/)
- [SMILES Formal Grammar Revisited](/articles/2020/12/21/smiles-formal-grammar-revisited/)
- [Abstract Syntax Trees for SMILES](/articles/2020/12/14/an-abstract-syntatx-tree-for-smiles/)
- [Running a SMILES Validation Benchmark](/articles/2020/10/05/running-a-smiles-validation-benchmark/)
- [Hydrogen Suppression in SMILES](/articles/2020/06/08/hydrogen-suppression-in-smiles/)
- [Stereochemistry and Atom Parity in SMILES](/articles/2020/05/04/stereochemistry-and-atom-parity-in-smiles/)
- [A Comprehensive Treatment of Aromaticity in the SMILES Language](/articles/2020/02/10/a-comprehensive-treatment-of-aromaticity-in-the-smiles-language/)

A programmer implementing a specification should not need to make things up. Unfortunately, that's exactly what I found myself doing when writing Purr. All the while I couldn't shake the thought that somewhere, at some time, another programmer had done the same thing, but guessed differently. And in the future, another programmer will make yet a different set of guesses.

This is no way to build an industry standard for data sharing. It's clearly possible to do better, but how to proceed? I can think of three possibilities.

Option One would be to create a new language. Now, [I've been down this road before](/articles/2009/03/19/a-comprehensive-guide-flexmol-a-modern-language-for-chemical-representation-part-1-outlining-the-problem/) and it's a bumpy ride. A new language may address all kinds of problems, but without users it won't amount to much. Chemistry is already fragmented with respect to software, so throwing yet another "standard" onto the pile hardly seems productive at this point.

<figure>
  <img alt="Standards" src="https://imgs.xkcd.com/comics/standards.png">
  <figcaption>
    <strong>Standards.</strong> Like <a href="https://dawnchorusgroup.com/2021/02/17/a-useless-history-of-the-frameworks-are-like-toothbrushes-quote/">toothbrushes</a>, everybody wants one but nobody wants to use anybody else's. But what happens when a standard is incomplete, fragmented, or both? [<a href="https://xkcd.com/927/">image source</a>]
  </figcaption>
</figure>

Option Two would be to fix the problems with existing SMILES documentation. [OpenSMILES](http://opensmiles.org) presents itself as a community effort focused on documenting SMILES. Unfortunately, involvement [has remained low](https://github.com/opensmiles/OpenSMILES/commits/master) over the years, major points (like [this one](http://opensmiles.org/opensmiles.html#_extended_hueckel_8217_s_rule)) have remained unresolved, and the mechanism for adopting nontrivial changes is far from clear. I'm unaware of any software implementation that both claims and demonstrates full OpenSMILES compatibility. But the larger problem is that many of the issues I see are cross-cutting. These aren't issues that can be fixed with a few pull requests.

Option Three combines elements of Options One and Two. Define a language based on SMILES, then document it to the degree needed to build fully-compliant readers and writers without guesswork. As a separate language, it can be specified without lugging around any of the baggage that came before (I'm looking at you, ["aromaticity"](/articles/2007/11/28/smiles-and-aromaticity-broken/) and [Hückel](/articles/2021/07/14/the-trouble-with-huckel/)). But as a backward-compatible refinement to SMILES, the language would be readable and writable by existing software.

The main problem with Option Three is that there is no "SMILES language" on which to base a backward compatible effort. There are only a dozen or so SMILES dialects, some of which are better documented and/or used than others. The Daylight implementation itself falls into this category, mainly because of the waning accessibility of the Daylight Toolkit. So backward-compatibility would be a tough goal, not due to any technical challenge, but rather incomplete documentation. One way to address the issue would be to narrow the feature set of the new language to a lowest common denominator. This is a game of subtraction, not addition. Subtracting features can be far more difficult than adding them because each one has at least one user on the other end who can't bear to lose it.

Despite the challenges involved, Option Three appears to offer the most bang for the buck.

So with that introduction, I present [Dialect](https://github.com/rapodaca/dialect), a work-in-progress molecular language designed to be backward-compatible with SMILES-as-practiced. Dialect will be introduced with a comprehensive paper detailing its design, syntax, semantics, and implementation. That paper is being written in the open on GitHub. As you can see, the manuscript is not yet very far along. [Purr](https://crates.io/crates/purr) will be an open source reference implementation for Dialect, but hopefully not the only one. If any of this sounds interesting, I invite you to check out what's there, file issues, ask questions, and of course make pull requests.
