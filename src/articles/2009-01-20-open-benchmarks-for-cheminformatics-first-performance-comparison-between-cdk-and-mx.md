---
title: "Open Benchmarks for Cheminformatics: First Performance Comparison Between CDK and MX"
published: "2009-01-20T00:00:00.000Z"
---

The previous article in this series discussed [Japex in the context of creating open cheminformatics benchmarks](/articles/2009/01/14/open-benchmarks-for-cheminformatics-working-with-japex). If you're not familiar with it, [Japex](https://japex.dev.java.net/) is a microbenchmarking framework written in Java that does for benchmarking what Ant does for building projects. Among its many interesting features is the ability to generate bar charts for performance comparisions.

Recently I finished building [the first direct performance comparison](http://github.com/rapodaca/cheminfbenchmark/commit/106b561b9f7df7316bf31a3f25ef619e845d3efd) between [CDK](http://cdk.sf.net) and [MX](http://metamolecular.com/mx/), two open source cheminformatics toolkits. The chart below summarizes the test.

![Benchmark](/images/posts/20090119/benchmark/testcase0.jpg "Benchmark")

You can [read the full report for yourself here](/images/posts/20090119/benchmark/index.html). This test compares the relative speed of loading [a 33-record SD file](http://github.com/rapodaca/cheminfbenchmark/raw/9e7915b35c8da460ed6efed4f931ede6751d5baf/data/pubchem_sample_33.sdf) and summing the calculated molecular masses from each record. As you can see, CDK is about 19% faster than MX on the system I looked at.

It should be pointed out that I'm no expert with Japex, so it's possible that I've introduced a source of error into this comparison that could affect the outcome.

Benchmarking is clearly a process, not an endpoint. In the months ahead, expect to see many more benchmarking comparisons, both between MX and other toolkits, and within MX itself.