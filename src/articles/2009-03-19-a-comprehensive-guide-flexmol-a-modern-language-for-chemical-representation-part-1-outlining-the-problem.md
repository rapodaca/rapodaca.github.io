---
title: "A Comprehensive Guide FlexMol, A Modern Language for Chemical Representation Part 1: Outlining the Problem"
published: "2009-03-19T00:00:00.000Z"
---

Here's a simple question: what's the best way to draw ferrocene?

This question was [posed](http://metallome.blogspot.com/2009/03/drawing-ferrocene.html) in a recent article on [Metallome](http://metallome.blogspot.com). It turns out there are some differences of opinion.

But this problem isn't limited to 'drawing' ferrocene - it extends to storing, transmitting, and manipulating representations of ferrocene with computers. And it isn't simply limited to ferrocene and multicentered bonding - it extends to stereochemistry as well.

This problem has been brewing for decades. Awareness of it has been heightened by the emergence of numerous [free Web-based chemical databases](http://zusammen.metamolecular.com/2009/03/09/sixty-four-free-chemistry-databases-serialized) over the last few years, and the need to freely exchange chemical information over the Web.

# The Right Level of Simplification

The fundamental problem with 'standard' molecular languages such as [molfile](http://en.wikipedia.org/wiki/MDL_Molfile), [SMILES](http://www.daylight.com/dayhtml/doc/theory/theory.smiles.html), [InChI](http://www.iupac.org/inchi/), and [CML](http://cml.sourceforge.net/) is their simplification of bonding and stereochemistry. Bonding is defined as an association between two atoms using two electrons. Stereochemistry is defined in terms of one or more chiral templates.

It should be noted that this model is sufficient to describe a large amount of known chemistry. If the molecules you work with only have two-centered bonds and tetrahedral chirality, there is no problem at all.

But modern chemistry has moved well beyond these simplistic notions of bonding and stereochemistry. The problem comes when you need to represent one of the fruits of these efforts and your only tools can't do the job.

[Metallocenes](http://en.wikipedia.org/wiki/Metallocene), pi-allyl complexes, piano-stool complexes, and [axially-chiral molecules](/articles/2007/01/08/the-axial-chirality-problem) are no longer mere curiosities - they are important building blocks, catalysts, drug targets, and natural products used in both academia and industry. They are not widespread, but they are used with increasing regularity. At least one of them is on its way to a database near you.

# A Different Approach to a Tough Problem

FlexMol takes a different approach. Bonding is defined in terms of systems of one or more pairs of atoms interacting with the cooperation of zero or more electrons. Stereochemistry is defined in terms planes passing through atom pair axes.

As we shall see, this flexible system enables the faithful, lossless representation of almost any chemical substance consisting of a single, well-defined molecular entity.

But before we do that, we'll take a look at some real-world problem cases in the next installment.

