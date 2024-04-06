---
title: JInChI - Run InChI Anywhere Java Runs
disqus: true
published: "2007-10-31T00:00:00.000Z"
---

Regardless of your views on Java the Programming Language, Java the Platform has a lot going for it. The ability to run the same executable on any system with a Java Virtual Machine (JVM), without recompilation, is a significant advantage in today's heterogeneous computing environment. Combine that with Java the Platform's battle-tested security model, stability and performance, and you have some compelling reasons to actually prefer that code execute on a JVM rather than bare metal.

Cheminformatics has many useful libraries, legacy and otherwise, that don't yet run on a JVM. Many of these can trace their roots back to the 1960s and 1970s and FORTRAN; others were written in C or C++ more recently. What they all have in common is that they're compiled to native binaries rather than Java bytecode.

Wouldn't it be great if this software could be easily compiled to Java bytecode instead?

A recent Depth-First article described how the [InChI toolkit](http://www.iupac.org/inchi/), an open source C library distributed by IUPAC, [was successfully compiled to a Java classfile](/articles/2007/10/29/compiling-the-inchi-toolkit-to-pure-java-bytecode-with-nestedvm) with the remarkable [NestedVM](http://nestedvm.ibex.org/) library. This article describes the creation and use of a new platform-independent jarfile that runs the InChI program.

The procedure was not difficult. The two files previously released ( [JInChI.class](http://downloads.sourceforge.net/ninja/JInChI.class?modtime=1193672654&big_mirror=0) and [nestedvm.jar](http://downloads.sourceforge.net/ninja/nestedvm.jar?modtime=1193673646&big_mirror=0)) were combined into a single executable jarfile with a Manifest pointing to the JInChI classfile as the Main class.

The full cInChI jarfile can be [downloaded here](http://sourceforge.net/project/showfiles.php?group_id=142870&package_id=250448&release_id=550857).

The `jinchi.jar` file can be tested from the command line:

```bash
$ java -jar jinchi.jar
InChI ver 1, Software version 1.01 release 07/21/2006.

Usage:
cInChI-1 inputFile [outputFile [logFile [problemFile]]] [-option[ -option...]]

Options:
  SNon        Exclude stereo (Default: Include Absolute stereo)
  SRel        Relative stereo
  SRac        Racemic stereo

[truncated]
```

If we wanted to process a molfile representing toluene, we'd use something like the following:

```bash
java -jar jinchi.jar test/toluene.mol
InChI version 1, Software version 1.01 release 07/21/2006
Opened log file 'test/toluene.mol.log'
Opened input file 'test/toluene.mol'
Opened output file 'test/toluene.mol.txt'
Opened problem file 'test/toluene.mol.prb'
Options: Mobile H Perception ON
Isotopic ON, Absolute Stereo ON
Omit undefined/unknown stereogenic centers and bonds
Full Aux. info
Input format: MOLfile
Output format: Plain text
Timeout per structure: 60.000 sec; Up to 1024 atoms per structure
End of file detected after structure #1.
Finished processing 1 structure: 0 errors, processing time 0:00:00.00
```

This command would produce the following output file, just like the cInChI program:

```bash
cat test/toluene.mol.txt
* Input_File: "test/toluene.mol"
Structure: 1
InChI=1/C7H8/c1-7-5-3-2-4-6-7/h2-6H,1H3
AuxInfo=1/0/N:1,2,3,4,5,6,7/E:(3,4)(5,6)/rA:7nCCCCCCC/rB:;d2;s2;s3;d4;s1d5s6;/rC:3.6373,2.8,0;0,.7,0;0,2.1,0;1.2124,0,0;1.2124,2.8,0;2.4249,.7,0;2.4249,2.1,0;
```

We can also convert InChIs into molfiles (command line options work the same as in cInChI):

```bash
java -jar jinchi.jar test/toluene.mol.txt -OutputSDF
InChI version 1, Software version 1.01 release 07/21/2006
Opened log file 'test/toluene.mol.txt.log'
Opened input file 'test/toluene.mol.txt'
Opened output file 'test/toluene.mol.txt.txt'
Opened problem file 'test/toluene.mol.txt.prb'
Options: Output SDfile only
End of file detected after structure #1.
Finished processing 1 structure: 0 errors, processing time 0:00:00.00
```

In this case the output is:

```bash
cat test/toluene.mol.txt.txt
Structure #1
  InChI v1 SDfile Output

  7  7  0  0  0  0  0  0  0  0  1 V2000
    3.6373    2.8000    0.0000 C   0  0  0     0  0  0  0  0  0
    0.0000    0.7000    0.0000 C   0  0  0     0  0  0  0  0  0
    0.0000    2.1000    0.0000 C   0  0  0     0  0  0  0  0  0
    1.2124    0.0000    0.0000 C   0  0  0     0  0  0  0  0  0
    1.2124    2.8000    0.0000 C   0  0  0     0  0  0  0  0  0
    2.4249    0.7000    0.0000 C   0  0  0     0  0  0  0  0  0
    2.4249    2.1000    0.0000 C   0  0  0     0  0  0  0  0  0
  1  7  1  0  0  0  0
  2  3  2  0  0  0  0
  2  4  1  0  0  0  0
  3  5  1  0  0  0  0
  4  6  2  0  0  0  0
  5  7  2  0  0  0  0
  6  7  1  0  0  0  0
M  END
$$$$
```

Similar tests worked on both Linux and Windows using the same jarfile.

There are still some issues to be addressed with this approach. For example, various reports indicate that NestedVM code runs about four to ten times slower than native execution. Benchmarking may be useful at this point.

Another issue is how to go about making a Java InChI library with NestedVM. If you decompile the **jinchi.jar** file, you'll find that the **JInChI.class** file is a large and complex beast in which almost all methods are named as hex numbers. It may be possible to create a library by renaming certain methods and breaking the code into smaller classfiles, but the NestedVM documentation seems sparse on this subject.

Despite these difficulties, this article demonstrates the power of NestedVM and describes the first (and currently only) example of a 100% Java InChI implementation.
