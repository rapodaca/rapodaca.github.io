---
title: ProtoSMILES
summary: "Searching for the common ancestor of all SMILES dialects."
twitter: true
summary-image: images/posts/20220601/summary.png
published: "2022-06-01T20:00:00Z"
---

SMILES is a de facto standard for chemical information exchange. Although there may be broad agreement on the technical underpinnings of SMILES, many important details have been left to individual interpretation. The lack of specificity offers a shaky foundation on which to build desperately-needed data standardization efforts. This article talks about the problem, and offers one possible path forward.

# What is SMILES?

Using SMILES as a serialization format within quality-controlled environments demands an answer to a simple question: "What is SMILES?"

Many cite [Weininger's 1988 paper](https://doi.org/10.1021/ci00057a005), at least as a starting point. This useful introduction to SMILES is nevertheless by its own admission incomplete. Although the author describes SMILES as a "language," its syntax and and semantics are reported only casually and even then incompletely. The detail needed to deploy SMILES across organizational boundaries, independently of any single software vendor, is simply absent.

As evidence for lack of consensus, consider two later documentation efforts, [OpenSMILES](http://opensmiles.org) and [SMILES+](https://iupac.org/projects/project-details/?project_nr=2019-002-2-024), each of which cite lack of detail in the available documentation as a primary motivating factor. Unfortunately, both efforts introduce their own extensions to the language, thereby complicating an already complex situation.

I first became aware of the scope of this problem while attempting to write my own high performance SMILES reader and writer. Having seen point after point that was addressed not at all, partially, or even inconsistently helped me realize that my situation could not possibly be unique. *Every* software project using SMILES faces the same problem. The deficiencies of the SMILES specification can only be filled with best guesses. And everyone faced with the problem guesses a little differently. The result is a family of software implementations that, although branding themselves as SMILES-compatible, nevertheless differ in important ways.

There is a path forward, but to get there requires a major step backward.

# Proto-Language

SMILES is often described as a single language, but it is more accurately viewed as a language family. Each software implementation spawns a new member of this family. At present there are perhaps a dozen or so members of the SMILES language family in common use. Linguists have developed a useful concept for dealing with situations like this: the *proto-language*.

According to [Wikipedia](https://en.wikipedia.org/wiki/Proto-language), a proto-language is "a postulated ancestral language from which a number of attested languages are believed to have descended by evolution, forming a language family." The term "attested language" refers to a language documented through direct evidence to have been used. A proto-language may be unattested or only partially attested.

Instead of trying to twist the documentation into a single shared language, maybe the documentation can be used to identify a SMILES proto-language. As the ancestor of all SMILES dialects, this proto-language could serve as a small yet solid foundation for future standardization efforts.

# Sources

Although there are many sources of SMILES documentation, only a handful are authoritative. David Weininger was the creator of SMILES, so his written works on the topic are by definition authoritative. Likewise Weininger's company, Daylight, produced and published authoritative SMILES documentation and software. Written works and software from other sources are not authoritative, no matter how well-conceived or executed. Taking this perspective narrows the range of sources to consider. Can it be narrowed even further?

I can identify four major sources of authoritative SMILES documentation:

- [*SMILES, a Chemical Language and Information System. 1. Introduction to Methodology and Encoding Rules*](https://doi.org/10.1021/ci00057a005). The 1988 paper by David Weininger ("The Paper").
- [*SMILES - A Language for Molecules and Reactions*](http://doi.wiley.com/10.1002/9783527618279.ch5). A book chapter by David Weininger published in 2003 ("The Chapter").
- [SMILES - A Simplified Chemical Language](https://www.daylight.com/dayhtml/doc/theory/theory.smiles.html). Part of the "Daylight Theory Manual" created and maintained by Daylight Chemical Information Systems, Inc. ("The Manual").
- [The Daylight Toolkit](https://www.daylight.com/products/toolkit.html). A software implementation of SMILES ("The Toolkit").

Collectively, The Paper, The Chapter, The Manual, and the Toolkit comprise the totality of all authoritative SMILES documentation I have been able to locate.

The Toolkit is a problematic source for two reasons. First, it is distributed under a [commercial license](https://www.daylight.com/sales/index.html), which restricts access. As a result, claims made about The Toolkit's behavior are difficult to verify. Daylight compounded the problem by decommissioning the public SMILES test page it operated for many years. But more importantly, The Toolkit's source code is not available for inspection. The Toolkit can therefore only be used in the reverse-engineering sense. Such a source should only be considered as a last resort.

This leaves three written works: The Paper; The Chapter; and the Manual. However, close inspection of each reveals the Chapter to be a superset of the the other two. In other words, all of the information found within The Paper and The Manual also appears in The Chapter. Moreover, The Chapter contains additional information found nowhere else.

Perhaps surprisingly, The Paper is cited far more often than The Chapter. According to Google Scholar, at the time of this writing the ratio of citations is 380:1 in favor of The Paper. But even a cursory comparison reveals The Chapter to be a far more detailed description of SMILES. And as a superset of The Paper, the The Chapter makes a much better starting point platform for defining the proto-language.

Out of the totality of SMILES documentation, we're left with just one source: The Chapter. From this source, we can extract a proto-language.

# ProtoSMILES

ProtoSMILES is the language defined by David Weininger in his 2003 book chapter titled [*SMILES - A Language for Molecules and Reactions*](http://doi.wiley.com/10.1002/9783527618279.ch5). This language will be instantly familiar to anyone who works with SMILES. ProtoSMILES is likely to be readable and writable, at least partially, by any modern SMILES software implementation. At the same time, Weininger's description is far from perfect or even usable as-is. Nevertheless, I believe ProtoSMILES to be the best foundation on which to base future standardization efforts.

ProtoSMILES is the basis for a work in progress that I'm currently calling "[Dialect](https://github.com/rapodaca/dialect)." Dialect is a molecular serialization format and a subset of ProtoSMILES. Dialect's purpose is to bridge the gap between what Weininger described and a specification suitable for future software development efforts.

As a language subset, Dialect is subtractive. It removes features of ProtoSMILES without adding any of its own. In most cases this can be done unambiguously. For example, ProtoSMILES places no upper or lower bound on quantities such as atomic mass or hydrogen count, but Dialect does. In other cases, ProtoSMILES itself is ambiguous. For example, it's not clear whether or not non-elided bonds can be promoted when converting from "aromatic" and kekulized forms. Dialect prohibits this. In still other cases, Weininger clearly made a mistake. For example, his grammar defining the two atomic stereodescriptors "@" and "@@" is written in The Chapter as: `chiral: '@'|chiral'@';`. This left-recursive grammar allows strings including "@@@@@@@" and others &mdash; with no upper bound on length. Dialect prohibits them and replaces Weininger's left-recursive grammar with its non-recursive equivalent. Finally, some ProtoSMILES features are expensive but relatively useless. One of them is non-tetrahedral stereochemical templates ("@OH1," "@BP2," etc). Dialect retires this feature, which adds considerable complexity without solving the underlying problem.

# Conclusion

Standardizing SMILES itself is by this point may be impossible. The language's imprecise origins and explosive growth has led to a proliferation of dialects. There may be a high level of mutual intelligibility among them, but the differences are substantial enough to undermine data standardization efforts for years to come. This essay introduces an alternative path forward, a SMILES proto-language called ProtoSMILES. ProtoSMILES has been constructed from a subset of authoritative SMILES documentation. Further refinement is underway with [Dialect](https://github.com/rapodaca/dialect), a strict subset of ProtoSMILES. Dialect eliminates obvious mistakes, retires problematic features, and resolves ambiguous descriptions. The goal is to whittle down SMILES to a representative and specific core suitable for use as a starting point for future software development efforts.
