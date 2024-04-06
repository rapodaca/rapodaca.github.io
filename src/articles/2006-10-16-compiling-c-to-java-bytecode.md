---
title: "Compiling C to Java Bytecode"
published: "2006-10-16T00:00:00.000Z"
---

In the ideal world for many Java developers, all software would be written in Java. The reality is that a great deal of software is written in other languages, one of the most widespread of which is C. This article discusses a unique approach to working with C code from Java, producing 100% pure Java bytecode that runs anywhere Java does.

# JNI - The Standard Solution

The standard solution to working with C code from Java has been the Java Native Interface (JNI). In this approach, the Java Virtual Machine (JVM) is able to treat a native binary library as if it were written in Java. This is a clever solution that does what it claims to.

Unfortunately, JNI introduces a platform dependency - the very thing Java was designed to avoid. Depending on the details of the native library, this platform dependency may effectively banish your software from platforms that it would otherwise run on without modification. The Eclipse team, for example, has had to deal with the platform dependence issues of the Standard Widget Toolkit (SWT) for some time now. Even if a workable solution is developed, deployment is an order of magnitude more complex when native libraries are involved.

It doesn't have to be this way. What if it were possible to compile C source code directly into Java bytecode?

# A Better Way

<a href="http://www.axiomsol.com/">Axiomatic Solutions</a> has an answer to this problem called Axiomatic Multi-Platform C (AMPC). This software can compile C source files directly into Java class files.

Axiomatic offers a free demo version of AMPC, which can be downloaded <a href="http://www.download.com/Axiomatic-Multi-Platform-C/3000-2069-10395882.html?part=dl-Axiomatic&amp;subj=dl&amp;tag=button">here</a>. The demo is rather limited; it expires after fifteen days and lacks certain key features available in the full version, such as multiplication and division.

For those serious about AMPC, the full version can be had for $2999.00. This is a hefty sum. But depending on who you are and what you're trying to do, AMPC may be the most cost-effective solution available.

AMPC is not the only C to Java conversion option. Another program, <a href="http://tech.novosoft-us.com/product_c2j.jsp">C2J</a> is free (as in beer) software from <a href="http://novosoft-us.com/">Novasoft</a> that translates C source into Java source. <a href="http://www.jazillian.com/">Jazillian</a> also converts C source into Java source, with an emphasis on readability. Links to more C to Java solutions are available from <a href="http://www.jazillian.com/competition.html">this page</a>.

# A Simple Demo

To learn more about AMPC, I downloaded and installed the Demo version 1.5.1. It installed without a hitch.

AMPC actually consists of two components - a command-line utility and an IDE. Those of you used to <a href="http://www.eclipse.org/">Eclipse</a> will be somewhat disappointed with AMPC's IDE, which is based on <a href="http://www.scintilla.org/SciTE.html">SciTE</a>. For this reason, I spent most of my time with the command-line utility.

I decided the venerable Hello World application should be my first stop. I saved this version to a file called <strong>hello.c</strong>:

```c
#include <stdio.h>

int main(void)
{
  printf("Hello World - From C!\n");

  return 0;
}
```

From a DOS prompt, I then issued:

```bash
compile hello.c
```

This produced the file <strong>hello.class</strong>. Running this class with Java confirmed that this process does indeed work:

```bash
java hello
Hello World - From C!
```

# A More Complex Demo

One of the key differences between C and Java is that C has pointers and Java does not. So how does AMPC handle a simple program that uses pointers? Very well, it turns out. For this test, I used the following source code, which I lifted from <a href="http://www.gamedev.net/reference/articles/article1697.asp">this tutorial</a>:

```c
#include <stdio.h>

int j, k;
int *ptr;

int main(void)
{
    j = 1;
    k = 2;
    ptr = &k;
    printf("\n");
    printf("j has the value %d and is stored at %p\n", j, (void *)&j);
    printf("k has the value %d and is stored at %p\n", k, (void *)&k);
    printf("ptr has the value %p and is stored at %p\n", ptr, (void *)&ptr);
    printf("The value of the integer pointed to by ptr is %d\n", *ptr);

    return 0;
}
```

Compiling this code and running it analogously to the Hello World example above produced the following output:

```bash
j has the value 1 and is stored at 0x2824
k has the value 2 and is stored at 0x2826
ptr has the value 0x2826 and is stored at 0x2c78
The value of the integer pointed to by ptr is 2
```

# So What?

Libraries written in C are of course quite common in chemical informatics and computational chemistry. Although most of these are legacy libraries developed long ago, some are more recent.

A case in point is the <a href="http://www.iupac.org/inchi/">InChI library</a>, the only implementation of which is written in C. It has been suggested that the best solution to using InChI from Java is JNI. However, for the reasons outlined above, this is not really the solution that Java developers want. I, and others, have argued that a pure Java implementation is the best solution - but porting is an expensive proposition, given the complexity of the InChI code.

Perhaps applying AMPC, C2J, Jazillian, or similar software to the InChI library would offer the best of both worlds. That is, assuming these approaches can be made to work.

A future article will detail my attempts to translate the InChI library to Java with C2J.

# The Final Word

The limited nature of AMPC demo prevents me from evaluating whether the full version can be used to compile real libraries, like InChI, directly into Java bytecode. However, if my experiences with the demo version are predictive, AMPC may well be a viable option for chemical informatics integration efforts.