---
title: "The First InChIKey Collision"
published: "2009-04-24T00:00:00.000Z"
---

Noel O'Boyle [raises an important question](http://baoilleach.blogspot.com/2009/04/broken-symmetry-can-smiles-and-inchi.html) about the canonicalization algorithms used in [chemical line notations](/articles/2007/03/14/eleven-qualities-of-the-perfect-line-notation-for-the-web) such as SMILES and InChI:

>Can their canonicalisation procedures ensure that two identical molecular graphs result in the same canonical SMILES or InChI?

This isn't merely an academic exercise. One of the best uses for InChI that I've found is as a private primary key in a molecular database. For example, instead of performing a computationally intensive exact [structure search](/articles/2008/10/02/fast-substructure-search-using-open-source-tools-part-1-fingerprints-and-databases) to determine if a newly-submitted molecule already exists as part of a [chemical registration system](/articles/2009/01/15/build-a-restful-chemical-registration-system-from-scratch-part-1-tools-of-the-trade), we can simply convert the molecule into a string with InChI and query an indexed field in the 'molecule' table, using code highly-optimized by our database system.

Not only that, but the way InChIs are generated assures us that some of the trickier problems in creating chemical registration systems, such as stereoisomer identification and tautomer detection, have been addressed at virtually no cost.

If there ever were a failure in a line notation canonicalization algorithm, it would probably be detected by a database maintainer noticing that the system failed to register a molecule that clearly wasn't already present, or registered a molecule that already was present.

In other words, this kind of 'bug' might be difficult to detect.

If it's any consolation, [PubChem](http://pubchem.ncbi.nlm.nih.gov/) maintains the world's largest collection of [freely-downloadable](/articles/2006/09/29/hacking-pubchem-direct-access-with-ftp) InChI-structure correlations (tens of millions), and as far as I know has not encountered a single InChI failure.

Another kind of failure is possible, though highly unlikely, when using InChIKey, which is generated from a [cryptograpic hash](http://en.wikipedia.org/wiki/SHA_hash_functions) of the full InChI. From the [Official InChI site](http://www.iupac.org/inchi/release102.html):

>There is a finite, but very small probability of finding two structures with the same InChIKey. For duplication of only the first block of 14 characters this is 1.3% in 10<sup>9</sup>, equivalent to a single collision in one of 75 databases of 10<sup>9</sup> compounds each. 

Those are pretty slim odds indeed. But they're not zero, either. As far as I know, not one InChI Key collision has been reported to date. But that doesn't mean one won't be found later on today.

If you wanted to create an efficient system for finding InChIKey collisions, how would you go about doing it?