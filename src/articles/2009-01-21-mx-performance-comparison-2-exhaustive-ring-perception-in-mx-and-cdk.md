---
title: "MX Performance Comparison #2: Exhaustive Ring Perception in MX and CDK "
published: "2009-01-21T00:00:00.000Z"
---

Benchmarking can be a useful first step in optimizing the performance of software. Recently a group of developers including myself [began creating an open suite of benchmarks for cheminformatics](/articles/2009/01/14/open-benchmarks-for-cheminformatics-working-with-japex). Currently, two open source cheminformatics toolkits are included: [MX](http://metamolecular.com/mx/) and [CDK](http://cdk.sf.net).

Ring perception is the foundation of many cheminformatics algorithms, so performance is an important issue. How do MX and CDK compare? See for yourself:

![Benchmark](/images/posts/20090121/benchmark/testcase0.jpg "Benchmark")

This benchmark [finds all rings](/articles/2009/01/08/exhaustive-ring-perception-with-mx) in a [collection of 416 substituted benzenes](http://github.com/rapodaca/cheminfbenchmark/blob/40b31fe4dc135e6acb11131a222d4048fc4f1add/data/pubchem_416_benzenes.sdf) created from [a PubChem query](http://github.com/rapodaca/cheminfbenchmark/blob/40b31fe4dc135e6acb11131a222d4048fc4f1add/resources/pubchem_416_benzenes_query.xml). Timing starts after an in-memory collection of hydrogen-suppressed molecules has been created to avoid differences in IO performance.  As you can see, MX is about 44% faster than CDK. Both toolkits find the same number of total rings in the dataset (2,179).

To run the benchmark yourself, [use the GitHub repository](http://github.com/rapodaca/cheminfbenchmark/tree/20090121-1).

One anecdotal observation: The number of iterations (10 warmup, 5 test) is lower than usual because CDK appeared to run slower and slower with each iteration. By the time 18 iterations had been made, my system was at a standstill. The cause is not clear. The setup as run avoids this behavior.

Both CDK and MX implement the [Hanser Algorithm](/articles/2008/12/16/exhaustive-ring-perception), although even a quick glance at the respective sources will reveal big differences in implementation. The MX implementation was optimized for readability and correctness, but not performance. As such, there may be some low hanging fruit to be had from the simplest of optimizations.

For more details, see [the full report](/images/posts/20090121/benchmark/index.html).