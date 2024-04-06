---
title: From C Source Code to Platform-Independent Executable Jarfile - Using NestedVM to Build JInChI
published: "2007-12-03T00:00:00.000Z"
---

A recent series of articles discussed in some detail the process of compiling source code written in C and C++ to pure Java bytecode with [NestedVM](http://nestedvm.ibex.org/). But the full conversion process, starting with source and finishing with an executable jarfile, has to my knowledge never been documented. This article uses the InChI toolkit to illustrate the complete process for converting a real-world C source distribution into a platform-independent, executable jarfile that can be run with any modern Java Virtual Machine (JVM).

# About InChI

The previous article in this series [introduced JInChI](/articles/2007/10/31/jinchi-run-inchi-anywhere-java-runs), the first and only pure Java implementation of the [IUPAC/NIST InChI toolkit](http://www.iupac.org/inchi/). This toolkit is used to convert molecular connection tables encoded in [MDL's SD File format](http://www.mdli.com/downloads/public/ctfile/ctfile.jsp) into ASCII character strings called 'InChIs' that have a [variety of applications in the field of cheminformatics](/articles/2007/09/27/inchi-for-newbies). Although an excellent [JNI-InChI](/articles/2007/10/10/jruby-for-cheminformatics-reading-and-writing-inchis-via-the-java-native-interface) interface is available, JNI won't be a viable option in every situation. Our pure Java implementation nicely complements the JNI-InChI library.

In this tutorial, we'll build version 1.0.2b of the InChI toolkit. This version, among other features, supports the generation of [InChI Keys](/articles/2007/05/09/hashing-inchis).

# Prerequisites

This article assumes you've already [installed NestedVM](http://wiki.brianweb.net/NestedVM/QuickStartGuide) on your system. Building NestedVM required the installation of many dependencies and was a fairly lengthy, but straightforward, process on my Linux system.

# Step 1: Prepare Your Environment

Before building anything, we'll need to set up our environment. NestedVM makes this simple:

```bash
cd /your/path/to/nestedvm/
source env.sh
```

Next, let's create a directory to hold the various components we'll need during the build process:

```bash
cd /your/projects/directory
mkdir jinchi
cd jinchi
```

Next, we'll download and unpack the InChI source distribution:

```bash
wget http://www.iupac.org/inchi/download/inchi102b.zip
unzip inchi102b.zip
```

# Step 2: Cross-Compile InChI

We now have everything we need to begin cross-compiling. NestedVM uses a two-part process in which source code is first cross-compiled to a MIPS binary. That MIPS binary is then translated to Java bytecode. We start by invoking `make` with the appropriate cross-compiler flags (which I found by looking through the InChI **Makefile**):

```bash
make C_COMPILER=mips-unknown-elf-gcc LINKER=mips-unknown-elf-gcc
```

This creates a MIPS binary (`cInChI-1`). Unless you're running on a MIPS machine, this binary won't be executable.

```bash
./cInChI-1
bash: ./cInChI-1: cannot execute binary file
```

We can now translate the MIPS binary into pure Java bytecode:

```bash
java org.ibex.nestedvm.Compiler -outfile JInChI.class JInChI cInChI-1
```

This produces a Java class file:

```bash
ll JInChI.class
-rw-r--r-- 1 rich rich 4372362 Nov 30 08:27 JInChI.class
```

We can verify that the classfile has been compiled correctly by running it:

```bash
java JInChI
InChI ver 1, Software version 1.02-beta August 2007.

Usage:
cInChI-1 inputFile [outputFile [logFile [problemFile]]] [-option[ -option...]]

Options:
  SNon        Exclude stereo (Default: Include Absolute stereo)
  SRel        Relative stereo

-- truncated --
```

We have now done something truly remarkable: we've taken a standard C source code distribution and converted it into an executable Java class file. It runs, but only because the NestedVM runtime is on our classpath (thanks to the `source` command we used at the beginning of the process).

What we really want is a self-contained, executable jarfile that can be run, unmodified, on any system with Java installed.

# Step 3: Build the JInChI Jarfile

We begin by moving up the the root directory of our jinchi project, creating a new directory to hold our java-specific files (the **JInChI.class** file and the NestedVM runtime), and copying them into it:

```bash
cd ../../..
mkdir jinchi-1.0.2b.1
mv InChI-1-software-1-02-beta/cInChI/gcc_makefile/JInChI.class jinchi-1.0.2b.1/
cp -r /your/path/to/nestedvm/build/org/ jinchi-1.0.2b.1
```

An executable jarfile generally needs a manifest to point to the main execution class. One way to do that is to first create a manifest:

```bash
vi jinchi-1.0.2b.1/MANIFEST.MF
```

It's essential that this file end with a newline.

```bash
cat jinchi-1.0.2b.1/MANIFEST.MF
Main-Class: JInChI
```

With everything in place, we can create the jarfile:

```bash
cd jinchi-1.0.2b.1/
ls
JInChI.class  MANIFEST.MF  org/
jar -cfm jinchi-1.0.2b.1.jar MANIFEST.MF *
ls
jinchi-1.0.2b.1.jar  JInChI.class  MANIFEST.MF  org/
```

We've successfully converted standard C source code into a platform independent executable jarfile. But does it work?

# Step 4: Test JInChI

We can confirm that the process has worked by running the jarfile (you should do this in a new shell session to verify that the jarfile is indeed independent of your NestedVM installation).

```bash
java -jar jinchi-1.0.2b.1.jar
InChI ver 1, Software version 1.02-beta August 2007.

Usage:
cInChI-1 inputFile [outputFile [logFile [problemFile]]] [-option[ -option...]]

Options:
  SNon        Exclude stereo (Default: Include Absolute stereo)
  SRel        Relative stereo
```

That's all there is to it! Your shiny new jarfile can be run on any system with a JVM installed. The one created here has been successfully tested on Mac OS X, Linux, and Windows.

If you'd prefer to download the JInChI jarfile, it can be obtained [from SourceForge](http://sourceforge.net/project/showfiles.php?group_id=142870&package_id=250448&release_id=558625).

# Conclusions

This article has illustrated in detail the process of converting a standard C source distribution into a platform-independent executable jarfile. Given the appropriate MIPS cross-compiler (many of which come with the NestedVM distribution), the same process can be repeated with code written in a variety of other languages.

You may be wondering what kind of performance hit you can expect with the approach outlined here. After all, we'd be comparing a native binary to something running on top of two abstraction layers: the NestedVM runtime and a JVM. It's not as bad as you might think, but that's a story for another time.
