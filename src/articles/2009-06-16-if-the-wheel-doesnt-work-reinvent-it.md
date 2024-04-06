---
title: "If the Wheel Doesn't Work, Reinvent it"
published: "2009-06-16T00:00:00.000Z"
---

[Chris Steinbeck](http://www.steinbeck-molecular.de/steinblog) has an interesting post on the [CDK code review process that discusses a new VF implementation](http://www.steinbeck-molecular.de/steinblog/index.php/2009/06/16/reviewing-the-cdk-vflib-patch/). In it, he notes:

>I checked it out and looked at the code, which looked horrible because it was a 1:1 translation of a horrible looking C code. Clearly,  a decent naming of the variables would greatly improve the code but I remember a statement that the translator himself could not make sense out of this, so the original author is to blame :-) . I do not get the impression that this problem can be rectified quickly. In fact, it took Mark a few days to debug this code by adding a rich collection of debug messages. I’m not sure that this is how it should be. The code is essentially unreadable.

For the unfamiliar, VF is a subgraph matching algorithm that has been shown to [perform better](amalfi.dis.unina.it/people/vento/lavori/gbr01bm.pdf) than [Ullmann](http://doi.acm.org/10.1145/321921.321925) for small graphs, and much better than Ullmann for large graphs.

Faced with essentially the same problem of implementing VF in Java for [MX](http://metamolecular.com/mx), I abandoned my early efforts to port the [VFlib C++ implementation](http://amalfi.dis.unina.it/graph/db/vflib-2.0/doc/vflib.html). The C++ implementation may make sense to a C++ programmer, but directly porting it to Java was judged as not being a good long-term move.

The problem was maintenance.

Although opinions on the subject vary, maintainable Java code to me has a few easily-identifiable characteristics. Among them are:

1.  Descriptive variable and method names.
2.  Limited use of deep nesting (> 3 levels) within methods.
3.  Stateful objects.
4.  Use of collections over primitives.
5.  Few methods over ten lines long.

The VF Java port that I created failed on just about every count - and failed consistently.

It turned out that [a short description of the VF algorithm](amalfi.dis.unina.it/graph/db/papers/vf-algorithm.pdf) was remarkably clear, lending itself well to a [Java-centric, object-oriented implementation](/articles/2008/11/17/substructure-search-from-scratch-in-java-part-1-the-atom-mapping-problem) that was [successfully integrated into MX](/articles/2008/11/21/introducing-mx-lightweight-and-free-cheminformatics-tools-for-java).

As a bonus, because test-driven development was used from the start for the MX implementation of VF, not only is the code maintainable, but it can be refactored and recasted with higher confidence due to the tests that are now present. This was used to great effect during a recent large-scale refactoring of the MX code to support arbitrary Query Atoms.

Would you consider bolting a bicycle wheel onto your new Kawasaki? Of course not. Why do the same with your software?

Reuse whenever it's consistent with your goals. When it's not, then reinvent.