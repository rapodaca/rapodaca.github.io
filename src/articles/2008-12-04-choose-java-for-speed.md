---
title: "Choose Java for Speed"
disqus: true
published: "2008-12-04T00:00:00.000Z"
---

![Table](/images/posts/20081204/table.png "Table")

O'Boyle and Hutchison offer [some interesting comparisons between Open Source cheminformatics toolkits](http://www.journal.chemistrycentral.com/content/2/1/24) in a recent *Chemistry Central* article. One of them is contained in the table above, in which the Java cheminformatics library CDK outperforms both the natively-compiled libraries [Open Babel](http://openbabel.org) and [RDKit](http://rdkit.org).

Interestingly, according to [Egon Willighagen](http://chem-bla-ics.blogspot.com), a founder of the CDK project, "CDK is hardly optimized for speed" \([article](http://chem-bla-ics.blogspot.com/2008/12/who-says-java-is-not-fast.html)\).

Benchmarks are always a tricky topic, but at least in this case the measurments come from real tasks likely to be done frequently by users of the respective toolkits: performing a simple molecular weight calculation and iterating over an SD file.