---
title: Mr. InChI - Tear Down This Wall
published: "2008-12-10T00:00:00.000Z"
---

InChI, useful as it may be, has some important limitations. One of the biggest relates to portability. The InChI source code is written in C, meaning that developers in other languages need to jump through hoops of varying degrees of difficulty to get InChI to work with their development platform of choice. Compounding the problem is the near-total lack of documentation that would guide third-party implementers in creating their own de-novo InChI generators.

Like it or not, if you do InChI and you don't develop in C or C++, you'll eventually face the gnarly problem of how to integrate this oddball native library into your code base and maintain it.

But, you may argue, InChI is written in C and C source is portable across platforms. What's the big deal?

True enough, but C binaries most definitely are not portable. That means that your application or library needs to become aware of differences in its target platforms - in most cases far too aware.

If you're working in a platform-independent language like Java, Python, or Ruby, this can drive you nuts. If not for the single InChI library dependency, you could distribute one version of your application or library and be done with it.

With InChI in the mix, you'll need to worry about all kinds of things you shouldn't have to. Linux, Windows, or OS X? 32-bit or 64-bit? Intel or Power PC? 

It's not like there aren't various solutions to the problem. Several articles have appeared on Depth-First describing some workarounds, but each introduces its own limitations:

-  [From C Source Code to Platform-Independent Executable Jarfile: Using NestedVM to Build JInChI](/articles/2007/12/03/from-c-source-code-to-platform-independent-executable-jarfile-using-nestedvm-to-build-jinchi)
-  [JInChI: Run InChI Anywhere Java Runs](/articles/2007/10/31/jinchi-run-inchi-anywhere-java-runs)
-  [A Simple and Portable Ruby Interface to InChI - Part 2: Silencing Console Output](/articles/2008/05/30/a-simple-and-portable-ruby-interface-to-inchi-part-2-silencing-console-output)
-  [Customize InChI Output with Rino](/articles/2007/03/19/customize-inchi-output-with-rino)
-  [Taking a SWIG of InChI](/articles/2006/09/16/taking-a-swig-of-inchi)

Another option for Java is to use [Java Native Interface InChI Wrapper](http://jni-inchi.sourceforge.net/). This library, written by Sam Adams and [Jim Downing](http://wwmm.ch.cam.ac.uk/blogs/downing/) is distributed with precompiled InChI binaries, which makes integration a little easier.

But for one small example of the kinds of limitations even this seemingly good solution brings, and the kind of valuable time that gets wasted on the C InChI dependency, consider this JRuby console output:

```bash
jirb
irb(main):001:0> require 'jniinchi-0.5-jar-with-dependencies.jar'
=> true
irb(main):002:0> import 'net.sf.jniinchi.JniInchiWrapper'        
=> ["net.sf.jniinchi.JniInchiWrapper"]
irb(main):003:0> JniInchiWrapper.loadLibrary                     
ERROR net.sf.jnati.deploy.NativeLibraryLoader - Error loading native library: /home/rich/.jnati/repo/jniinchi/1.6/LINUX-X86/libJniInchi-1.6-LINUX-X86.so
java.lang.UnsatisfiedLinkError: /home/rich/.jnati/repo/jniinchi/1.6/LINUX-X86/libJniInchi-1.6-LINUX-X86.so: libstdc++.so.5: cannot open shared object file: No such file or directory
```

Something that should be [easy as pie](/articles/2008/11/24/getting-started-with-mx) is anything but.

By the way, the shared object in question was alive and well on my filesystem. A similar error occurs with [Jython](/articles/2008/12/01/open-source-cheminformatics-in-python-with-mx).

There may or may not be a solution to this problem. But let's not lose sight of the bigger question - why does the problem exist in the first place and repeat itself with frustrating regularity?

If the InChI team want InChI and InChIKey to become a truly universal identifier, a clearly-written specification, documented C source code, and a validation suite are essential. Until then we'll have to keep dodging bullets on our way around Checkpoint Charlie.