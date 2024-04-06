---
title: Porting MX - CDK-Compatible VF Implementation
published: "2009-06-26T00:00:00.000Z"
---

[Substructure search](/articles/2008/10/02/fast-substructure-search-using-open-source-tools-part-1-fingerprints-and-databases) is a fundamental cheminformatics operation, and an especially important component in chemical structure databases. Although a few algorithms for atom-by-atom comparison of two structures are available, one of the fastest is [VF](/articles/2008/11/17/substructure-search-from-scratch-in-java-part-1-the-atom-mapping-problem), which is implemented in [MX](http://metamolecular.com/mx), a lightweight cheminformatics toolkit.

A recent post discussed the [limitations of directly porting the C++ implementation of VF into Java](/articles/2009/06/16/if-the-wheel-doesnt-work-reinvent-it) and why a Java-centric, de novo implementation was created for MX instead.

I'm now happy to report that [Syed Asad Rahman](http://www.ebi.ac.uk/~asad/Asad.html) of the [European Bioinformatics Institute](http://www.ebi.ac.uk/) has created a [preliminary implementation of VF](http://github.com/asad/VFLib/tree/master) for the Chemistry Development Kit ([CDK](http://cdk.sf.net)) by porting the MX mapping package.

Looking through Asad's work, one of the most striking things is the isolation of CDK-specific code into a few key areas, a trait shared by the original MX implementation. Another is the readability of the code. Both features should greatly simplify further optimization work.

If you've been looking for a fast substructure search engine for your cheminformatics work, I recommend checking out both [MX](http://metamolecular.com/mx) and the [CDK port](http://github.com/asad/VFLib/tree/master).