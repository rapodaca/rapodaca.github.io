---
title: Run Babel Anywhere Java Runs with JBabel
disqus: true
published: "2007-12-10T00:00:00.000Z"
---

A recent series of D-F articles have discussed the use of [NestedVM](http://nestedvm.ibex.org/) to compile cheminformatics programs written in C/C++ to pure java binaries that can be run on any system with a JVM. More specifically, an attempt to compile [OpenBabel's](http://openbabel.sf.net) `babel` program to bytecode was only [partially successful](/articles/2007/11/26/compiling-open-babel-to-pure-java-bytecode-with-nestedvm-building-a-runnable-classfile-that-almost-works). With the [help of Geoff Hutchison](http://sourceforge.net/mailarchive/forum.php?thread_name=819391.60947.qm%40web34201.mail.mud.yahoo.com&forum_name=openbabel-discuss), the problem was resolved. This article introduces JBabel, a platform-independent, pure Java implementation of OpenBabel's `babel` program.

# A Little About JBabel

JBabel was compiled from the [Open Babel 2.1.1 source release](http://sourceforge.net/project/showfiles.php?group_id=40728&package_id=32894&release_id=521581) and can be [downloaded from SourceForge](http://sourceforge.net/project/showfiles.php?group_id=144794&package_id=255103). The same jarfile was successfully tested on Linux, Windows and Mac OS X. You can verify JBabel works on your platform with the following command:

```bash
java -jar jbabel-20071209.jar -Hsmi
smi  SMILES format
A linear text format which can describe the connectivity
and chirality of a molecule
Write Options e.g. -xt
  n no molecule name
  t molecule name only
  r radicals lower case eg ethyl is Cc
```

This version of JBabel was compiled with support for three formats:

- SMILES (smi). Non-canonical SMILES.
- MDL (mol). Molfiles and SD Files.
- Canonical SMILES (can). Canonical SMILES implementation [donated by eMolecules](/articles/2006/11/06/stone-soup).

I'll discuss exactly how support for these formats was added in a subsequent post. More formats will be added in the future. For now, let's just try JBabel out.

# Testing JBabel

One way to use JBabel is interactively from the command line - just leave out an input or output file parameter. For example, if you wanted to get the eMolecules canonical SMILES for [sertraline](http://pubchem.ncbi.nlm.nih.gov/summary/summary.cgi?cid=68617), you might do something like this (be sure to use two returns to begin processing):

```bash
java -jar jbabel-20071209.jar -ismi -ocan
CN[C@H]1CC[C@H](C2=CC=CC=C12)C3=CC(=C(C=C3)Cl)Cl

CN[C@H]1CC[C@H](c2ccc(Cl)c(Cl)c2)c2ccccc12
1 molecule converted
34 audit log messages
```

This canonical SMILES can be converted into a molfile with the following:

```bash
$ java -jar jbabel-20071209.jar -ismi -omol
CN[C@H]1CC[C@H](c2ccc(Cl)c(Cl)c2)c2ccccc12


 OpenBabel12090723182D

 22 24  0  0  0  0  0  0  0  0999 V2000
    0.0000    0.0000    0.0000 C   0  0  0  0  0

...
```

To convert using input and output files, we could use a medium-sized dataset such as the [PubChem benzodiazepine dataset](http://rubyforge.org/frs/download.php/27768/pubchem_benzodiazepine_20071110.sdf.gz) prepared for [Rubidium](http://rbtk.rubyforge.org/):

```bash
java -jar jbabel-20071209.jar -imol pubchem_benzodiazepine_20071110.sdf -ocan pubchem_benzodiazepine_20071110.smi
==============================
*** Open Babel Warning  in ReadMolecule
  WARNING: Problems reading a MDL file
Cannot read title line

2117 molecules converted
```

This test, which parses 2117 records, required four minutes forty-five seconds on my system. For comparison, the natively compiled binary did the same thing in about thirteen seconds. Clearly, the JBabel performance hit is substantial.

# Uses

Although it's very unlikely that JBabel will ever be useful in performance-critical situations, its portability makes it attractive for other uses. Examples include:

-  application development in heterogeneous computing environments;
-  use on systems in which native compilation may be difficult, such as those with unusual configurations or operating systems;
-  cases in which native binaries work poorly or not at all, such as in applets and Java applications;
-  situations in which performance is a minor consideration, such as in end-user applications that process only a few molecules at a time, or during application prototyping

# Conclusions

This article has described JBabel, the first portable binary version of OpenBabel's `babel` molecular file format interconversion program. The next article in this series will describe in detail the steps that were used to compile it.