---
title: "Hashing and the Universal Molecular Identifier"
published: "2009-06-30T00:00:00.000Z"
---

>The impossibility of separating the nomenclature of a science from the science itself, is owing to this, that every branch of physical science must consist of three things; the series of facts which are the objects of the science, the ideas which represent these facts, and the words by which these ideas are expressed. ...
>-<cite>Antoine Lavoisier [Traité Elémentaire de Chimie](http://www.chem.yale.edu/~chem125/125/history99/2Pre1800/Lavoisier/Preface/discours.html)</cite>

The idea of creating a system in which a short sequence of characters can be used in place of a molecular structure traces its roots to the beginnings of modern chemistry. As the Web continues to become the information platform of choice - [even in chemistry](/articles/2009/06/17/beginning-of-the-end-for-acs-journal-print-editions), the need to communicate molecular information in a [Web-ready format](/articles/2007/03/14/eleven-qualities-of-the-perfect-line-notation-for-the-web) increases.

# InChI

Recently, [InChI](http://www.iupac.org/inchi/release102.html) has emerged as a candidate for this position - or more precisely, InChIKey has. For the unfamiliar, InChI is program that converts a variety of molecular structures into a sequence of characters; the same structure always gives the same sequence.

InChI is but one of a very large class of known [line notations in chemistry](/articles/2007/03/14/eleven-qualities-of-the-perfect-line-notation-for-the-web). Unlike most other line notations, it combines the following ideas into one system:

1.  **Normalization.** Many bonding arrangements, such as the nitro group and tautomers can be represented in multiple equivalent forms. InChI is capable of eliminating alternative representations.
2.  **Symmetrization.** InChI views molecules as networks of typed atoms connected by equivalent links. This eliminates the artifical distinction among single and double bonds in aromatic molecules such as benzene.
3.  **Canonicalization.** Each atom in a molecule is assigned a reproducibly unique index, enabling equivalent inputs with different atom numberings to produce identical output.
4.  **Representation.** InChIs are represented as a single line of text through the use of canonical numbering and rules for representing atom types.
5.  **Fixed Length.** Unique to InChI - InChI Key enables very long InChI output to be compressed into a fixed-length string. The process is for all intents and purposes [one-way](/articles/2008/12/02/five-questions-about-the-inchi-resolver).

This was no easy task, and is a remarkable accomplishment in itself.

# InChI Limitations

But like any technology, InChI has limitations. Most importantly, InChI can't uniquely represent several important classes of molecular species, including those possessing axial and planar chirality, organometallics containing multicentered bonds, and polymers.

Extending InChI to encompass these important classes will be no easy task. Unlike the situation when InChI was being developed, many research groups around the world now use InChI - any change that breaks existing InChIs or their Keys would be disruptive, and even possibly ignored by large segments of the community.

The difficulty of the task is compounded by the technical limitations in dealing with line notations. The qualities that tend to make them compact (e.g., unidimensionality) tend to be the same qualities that make them difficult to extend.

# Taking a Step Back

What if we could go back to points 1-5 above and create a system from scratch that addressed them all - and in a way in which all forms of chirality, bonding, and polymers were included? How would we do it?

# No More Line Notations

Our most important decision might be to avoid the use of a line notation altogether. Given (5), we know that anything we come up with, no matter how verbose, can be reduced to a fixed length string that can be readily used in URLs and presented to end users for copy/paste operations and visual comparison.


Combining a full-featured file format with hashing offers a way to reap the benefits of a rich language for describing molecules while retaining a convenient method for using them on the Web. (for an example of a site that makes extensive use of hashes in URLs and on Web pages, see [GitHub](http://github.com)).

# What About Molfile?

Instead of inventing our own 'standard', what if we based our identifier on a file format already in widespread use instead? What about MDL [V2000 molfiles](http://www.symyx.com/downloads/public/ctfile/ctfile.jsp)?

At a minimum, we would need to specify:

- An algorithm that could convert any molfile into canonical form.
- A hashing algorithm, of which there are many good ones to choose some such as plain old [SHA-1](http://en.wikipedia.org/wiki/SHA_hash_functions).

Provided we could find solutions to the problems above, this would be an attractive option. We'd simply be layering additional constraints on a file format with a massive installed base. In fact, we would end up with something possessing nearly equivalent qualities to InChI Key, but with the advantage that we're extending an existing, widely-used standard.

Although we still would have the problem of not being able to deal with multicentered bonding and axial chirality, at least we'd have the possibility to include polymers.

But we'd still be leaving out a large portion of chemical space.

# What About Another File Format?

No publicly-described file format that I'm aware of has all of the qualities needed to serve as a basis for a universal molecular identifier. Although some come close, close is not enough.

Every file format has something to teach. It may be possible to borrow the best elements of each, but this would be neither simple nor risk-free.

# Conclusions

Hashing offers an attractive method for converting detailed, machine-readable descriptions of molecular structure into a fixed-length string suitable for use on the Web. The problem then boils down to identifying, or inventing, the means to create these descriptions.

Whether the tradeoffs in using an identifier that can't be decoded are worth the benefits of one that can be readily encoded and shared is another question altogether.