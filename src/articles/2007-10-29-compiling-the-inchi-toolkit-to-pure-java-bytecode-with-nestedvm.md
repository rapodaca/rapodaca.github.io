---
title: "Compiling the InChI Toolkit to Pure Java Bytecode with NestedVM"
disqus: true
published: "2007-10-29T00:00:00.000Z"
---

Some time ago, a Depth-First article discussed some methods for [compiling C to Java bytecode](/articles/2006/10/16/compiling-c-to-java-bytecode). Many factors make this approach attractive compared to the JNI approach. Some of them include security, portability, and use within applets. Unfortunately, none of the approaches discussed in the earlier article seemed particularly general.

Many cheminformatics libraries are written in C and C++; being able to reliably and automatically port them to Java could potentially save a great deal of effort.

One of the more important cheminformatics C libraries written in recent years is the [InChI toolkit](http://www.iupac.org/inchi/). With no pure Java port of this library, JNI is the [only way](/articles/2007/10/10/jruby-for-cheminformatics-reading-and-writing-inchis-via-the-java-native-interface) to use InChI with Java. In some situations, this approach is either overly complicated or simply unacceptable.

All of this leaves us with the question: how can the InChI toolkit be converted into a pure Java library without writing any new code?

A partial answer to this question came from Evan Jones, who suggested I look at [NestedVM](http://nestedvm.ibex.org/). From the website:

> NestedVM provides binary translation for Java Bytecode. This is done by having GCC compile to a MIPS binary which is then translated to a Java class file. Hence any application written in C, C++, Fortran, or any other language supported by GCC can be run in 100% pure Java with no source changes.

And it worked!

NestedVM was successfully used compile the InChI-API distribution to a Java class file that executed on nothing more than a standard JVM -- and with no JNI code. The InChI classfile and nestedvm runtime jarfile can be [downloaded from SourceForge](http://sourceforge.net/project/showfiles.php?group_id=142870&package_id=250448&release_id=550390). Future articles in this series will describe the compilation, installation, and use of NestedVM, as well as the Java class file that it produced.