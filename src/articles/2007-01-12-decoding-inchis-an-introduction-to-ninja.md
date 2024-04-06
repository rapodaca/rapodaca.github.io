---
title: "Decoding InChIs: An Introduction to Ninja"
published: "2007-01-12T00:00:00.000Z"
---

<a href="http://wwmm.ch.cam.ac.uk/inchifaq/">InChI</a> is both a molecular identifier and a molecular language. As the use of InChIs spreads, there will be an increasing need to convert InChIs to molecular structures. In this article, I'll introduce a software package called "Ninja" that can serve as a foundation for writing InChI parsers in a variety of toolkits and programming languages.

# About Ninja

Ninja is a low-level Java toolkit for parsing InChIs. Its main purpose is to break an InChI into a set of tokens that are then assigned meaning consistent with the InChI specification. Ninja is intended as a platform on which full-fledged InChI parsers can be built. As such, it is both small and portable. Ninja was developed with Sun's JDK-1.4, although earlier versions should also work. The Ninja project is hosted on SourceForge, from which the <a href="http://sourceforge.net/project/showfiles.php?group_id=142870">complete source</a> can be downloaded.

# Printing an InChI Report

Ninja can print a descriptive summary of any InChI from the command line. For example, if the Ninja jarfile (<strong>lib/ninja-0.1.4.jar</strong>) is located on your classpath or in your working directory, the report for benzene's InChI could be printed with:

```bash
java -jar ninja-0.1.4.jar "InChI=1/C6H6/c1-2-4-6-5-3-1/h1-6H"
```

This command produces the following output:

```bash
[Parsing InChI] InChI=1/C6H6/c1-2-4-6-5-3-1/h1-6H
----------------------------------------------------
[Version Name] 1
----------------------------------------------------
[Entity Count] 1
----------------------------------------------------
[Entity (1)]
[Main Layer]
[Formula] C6H6
[Heavy atoms] 6
[Atom(1)] label = C fixed-h-count = 1
[Atom(2)] label = C fixed-h-count = 1
[Atom(3)] label = C fixed-h-count = 1
[Atom(4)] label = C fixed-h-count = 1
[Atom(5)] label = C fixed-h-count = 1
[Atom(6)] label = C fixed-h-count = 1
[Connection table]
    1  2  3  4  5  6
 1     +  +
 2  +        +
 3  +           +
 4     +           +
 5        +        +
 6           +  +
[Mobile Hydrogen Groups] 0
[Charge Layer]
[Charge] 0
[Protonation] 0
[Stereo Layer]
[Bond Stereo Units] 0
[Atom Stereo Units] 0
[Isotopic Layer]
[Isotopes]
[Stereo Layer]
[Bond Stereo Units] 0
[Atom Stereo Units] 0
[Fixed Hydrogen Layer]
```

This report shows that, as expected, the benzene InChI encodes six carbon atoms, each of which has one attached fixed hydrogen. The connections among these carbons are represented by a connection table. The last half of the report refers to elements that are missing in the benzene InChI, but which are nevertheless reportable if present. The readability of this report could be enhanced, particularly for complex InChIs, by indenting items to indicate nesting.

A lot about the InChI language can be understood from reading reports such as the one above. The terms used in both the reports, and the <a href="http://depth-first.com/doc/ninja">Ninja API</a> are taken directly from the <a href="http://downloads.sourceforge.net/ninja/inchi_tech_man-20060511.pdf?use_mirror=osdn">InChI Technical Manual</a>.

# Conclusions

Ninja is a low-level toolkit for decoding InChIs. Although it can be used as a standalone application, its real utility is as a library. Future articles will discuss this topic.