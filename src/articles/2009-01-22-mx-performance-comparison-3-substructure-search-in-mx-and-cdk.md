---
title: "MX Performance Comparison #3: Substructure Search in MX and CDK"
published: "2009-01-22T00:00:00.000Z"
---

[Substructure search](/articles/2008/11/13/one-of-these-things-is-not-like-the-other) is a fundamental cheminformatics operation. [MX](http://metamolecular.com/mx/), the open source cheminformatics toolkit, contains an implementation [based on](/articles/2008/11/17/substructure-search-from-scratch-in-java-part-1-the-atom-mapping-problem) the [VF monomorphism algorithm](/articles/2008/11/13/one-of-these-things-is-not-like-the-other). How fast is it? Let's compare it to CDK's [UniversalIsomorphismTester](http://cheminfo.informatics.indiana.edu/~rguha/code/java/nightly/api/org/openscience/cdk/isomorphism/UniversalIsomorphismTester.html).

![Benchmark](/images/posts/20090122/benchmark/testcase0.jpg "Benchmark")

The full report is available [here](/images/posts/20090122/benchmark/index.html). [The full source code](http://github.com/rapodaca/cheminfbenchmark/tree/20090122) can be found on [GitHub](http://github.com/).

This test reads the molecules contained in a [416-record SD file](http://github.com/rapodaca/cheminfbenchmark/blob/c2d7d926381e1bcf0f365777861f71ff563d8ae7/data/pubchem_416_benzenes.sdf) into memory during setup. Then, during the test phase, each of these molecules is compared for a substructure relationship to a benzene molecule. As you can see, MX ran this test nearly five times faster than CDK.

MX and CDK differ in the algorithms used for substructure match. Whereas MX uses a variant of VF, CDK uses a variant of Ullmann. As noted by the VF creators, these two algorithms have [very different performance characteristics](http://amalfi.dis.unina.it/people/vento/lavori/gbr01bm.pdf), with VF always outperforming Ullmann. The performance gap increases quickly with increasing graph size.

CDK will soon have a new substructure matcher [based on Rajarshi Guha's implementation](http://rguha.wordpress.com/2008/11/18/java-port-of-vflib-works-and-its-blazing/). It will be interesting to directly compare this new CDK matcher to the one used by MX.

As is the case with the [MX/CDK ring perception comparison](/articles/2009/01/21/mx-performance-comparison-2-exhaustive-ring-perception-in-mx-and-cdk), it should be noted that the MX substructure matcher implementation is optimized for readability and correctness, but not performance. A number of interesting opportunities exist for increasing the performance of the MX substructure matcher.

One point to note: MX and CDK differed in the number of hits found, with MX detecting all 416 and CDK finding 412. This is most likely due to the presence of isotopically-labelled benzenes in the dataset. Depending on your interpretation of a substructure match, either CDK or MX could be returning the "correct" answer.