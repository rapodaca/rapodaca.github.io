---
title: Compiling Open Babel to Pure Java Bytecode with NestedVM - Building A Runnable Classfile that Almost Works
published: "2007-11-26T00:00:00.000Z"
---

Previously, I described an [unsuccessful first attempt](/articles/2007/11/19/compiling-open-babel-to-pure-java-bytecode-with-nestedvm-an-unsuccessful-first-attempt#comment-268) to compile the popular cheminformatics C/C++ library [Open Babel](http://openbabel.sf.net) to pure Java bytecode using [NestedVM](http://nestedvm.ibex.org/). This article follows that topic one step further, and shows how to obtain a runnable Java classfile. Although major functionality is missing, the principle of compiling arbitrary C/C++ code to both Java source code and Java bytecode is illustrated.

# Getting Started

This articles assumes that you've [installed NestedVM and downloaded Open Babel](/articles/2007/11/19/compiling-open-babel-to-pure-java-bytecode-with-nestedvm-an-unsuccessful-first-attempt#comment-268) on your system. You'll then need to set up your environment (from the nestedvm installation directory):

```bash
source env.sh
```

# Run the Configure Script

The configure script we used last time didn't attempt to statically compile the binary utilities in the **tools** directory. This time, we'll add flags to allow this:

```bash
./configure --disable-dynamic-modules --enable-static=yes --enable-shared=no --enable-inchi --host=mips-unknown-elf
make
```

*Note: leaving out the static compile directives does not produce a fully-functioning classfile either.*

Next, we'll attempt to directly create the <code>babel</code> binary in Java classfile format, as we did last time:

```bash
cd tools
java org.ibex.nestedvm.Compiler -outfile Babel.class Babel babel
Exception in thread "main" java.lang.IllegalStateException: unresolved phantom target
        at org.ibex.classgen.MethodGen.resolveTarget(MethodGen.java:555)
        at org.ibex.classgen.MethodGen._generateCode(MethodGen.java:664)
        at org.ibex.classgen.MethodGen.generateCode(MethodGen.java:618)
        at org.ibex.classgen.MethodGen.dump(MethodGen.java:888)
        at org.ibex.classgen.ClassFile._dump(ClassFile.java:193)
        at org.ibex.classgen.ClassFile.dump(ClassFile.java:160)
        at org.ibex.nestedvm.ClassFileCompiler.__go(ClassFileCompiler.java:380)
        at org.ibex.nestedvm.ClassFileCompiler._go(ClassFileCompiler.java:72)
        at org.ibex.nestedvm.Compiler.go(Compiler.java:259)
        at org.ibex.nestedvm.Compiler.main(Compiler.java:183)
```

We're getting the same error as before. Although, an [announcement of a bugfix](http://groups.google.com/group/nestedvm/browse_thread/thread/b5d114a20a6b672b) was posted to the NestedVM list, in my hands the new version of NestedVM caused the same error.

As a workaround, we can compile to Java sourcecode first:

```bash
java org.ibex.nestedvm.Compiler -outformat java -outfile Babel.java Babel babel
```

We now have a Java source file encoding the **babel** program. Does it compile?

```bash
javac Babel.java
The system is out of resources.
Consult the following stack trace for details.
java.lang.OutOfMemoryError: Java heap space
        at com.sun.tools.javac.util.Position$LineMapImpl.build(Position.java:139)
        at com.sun.tools.javac.util.Position.makeLineMap(Position.java:63)
        at com.sun.tools.javac.parser.Scanner.getLineMap(Scanner.java:1105)
        at com.sun.tools.javac.main.JavaCompiler.parse(JavaCompiler.java:512)
        at com.sun.tools.javac.main.JavaCompiler.parse(JavaCompiler.java:550)
        at com.sun.tools.javac.main.JavaCompiler.parseFiles(JavaCompiler.java:801)
        at com.sun.tools.javac.main.JavaCompiler.compile(JavaCompiler.java:727)
        at com.sun.tools.javac.main.Main.compile(Main.java:353)
        at com.sun.tools.javac.main.Main.compile(Main.java:279)
        at com.sun.tools.javac.main.Main.compile(Main.java:270)
        at com.sun.tools.javac.Main.compile(Main.java:69)
        at com.sun.tools.javac.Main.main(Main.java:54)
```

Not exactly. But this is a massive source file, so we'll need to increase the Java compiler's memory allowance:

```bash
javac Babel.java -J-Xms256m -J-Xmx256m
Note: Babel.java uses unchecked or unsafe operations.
Note: Recompile with -Xlint:unchecked for details.
```

This seems to have worked. Can we run the classfile?

```bash
java Babel -H
Open Babel converts chemical structures from one file format to another

Usage: Babel &lt;input spe&gt; &lt;output spec&gt; [Options]

Each spec can be a file whose extension decides the format.
Optionally the format can be specified by preceding the file by
-i&lt;format-type&gt; e.g. -icml, for input and -o<format-type> for output

--truncated--
```

Success! But before we get too excited, let's make sure Open Babel's file formats are recognized by testing for "SMILES":

```bash
java Babel -Hsmi
Format type: smi was not recognized
```

As you can see, we have successfully converted the <code>babel</code> program to an executable classfile, but this classfile is missing most of the features of the native binary.

This may seem hopeless, but consider that natively compiling Open Babel using the above <code>configure</code> flags also produces a binary that doesn't know about SMILES or any other format.

So, it's very likely that if we can produce a native, statically compiled, self contained <code>babel</code> executable, then we will have solved the problem of running Open Babel entirely on a JVM.

This doesn't seem like a difficult problem, [but apparently it is](http://sourceforge.net/mailarchive/forum.php?thread_name=819391.60947.qm%40web34201.mail.mud.yahoo.com&forum_name=openbabel-discuss).