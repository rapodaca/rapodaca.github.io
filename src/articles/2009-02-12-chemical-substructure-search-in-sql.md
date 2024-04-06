---
title: "Chemical Substructure Search in SQL"
published: "2009-02-12T00:00:00.000Z"
---

Earlier this year, Golovin and Henrick published a novel technique for performing [substructure search on large databases using SQL](http://dx.doi.org/10.1021/ci8003013). What makes this approach unique is that it takes advantage of the built-in breadth-first search capabilities of most database engines to do structure matching. At least three public-facing sites now use the system, including [this one at EMBL-EBI](http://www.ebi.ac.uk/msd-srv/chemsearch/). 

Very recently, [Charlie Zhu](http://blog.charliezhu.com/) released an implementation of the idea called [sqlmol](http://code.google.com/p/sqlmol/). As you can see, [the source](http://code.google.com/p/sqlmol/source/browse/#svn/trunk) consists of sql files.

I'm not skilled enough with SQL to know how to use sqlmol. Questions in my mind at this point mainly revolve around performance and the ability to do [SMARTS](http://www.daylight.com/dayhtml/doc/theory/theory.smarts.html) queries. The Golovin and Henrick paper does make some mention of performance, but my sense is there's more to look at here.

With an open source implementation apparently now being developed, it should be possible to answer these and many other questions.