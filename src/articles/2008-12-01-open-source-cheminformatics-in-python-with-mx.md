---
title: Open Source Cheminformatics in Python with MX
published: "2008-12-01T00:00:00.000Z"
---

[MX](http://code.google.com/p/mx-java/) is an open source cheminformatics toolkit written in Java. One of the reasons Java was selected as MX's development platform is the [excellent support](http://www.javaworld.com/javaworld/jw-03-2005/jw-0314-scripting.html) now available to [interface the Java Virtual Machine to a variety of scripting languages](http://java-source.net/open-source/scripting-languages). Of the scripting languages used in cheminformatics, Python stands out for its widespread adoption. This article will outline the steps needed to use MX from Python.

# About Jython

[Jython](http://www.jython.org/Project/) is a Java implementation of the Python interpreter. Although specific benchmarking numbers are surprisingly difficult to find around the Web, anecdotal evidence suggests the Jython interpreter is only slightly slower than the C Python interpreter in most areas, but may actually be faster than C Python in others, [such as threading](http://blogs.warwick.ac.uk/dwatkins/entry/benchmarking_parallel_python_1_2/).

Another approach to Java-Python integration is [JPype](http://jpype.sourceforge.net/), which uses the [Java Native Interface](http://en.wikipedia.org/wiki/Java_Native_Interface) (JNI). The advantage is that its not even necessary to switch your Python interpeter to begin using any Java library.

# Creating a Jython Environment

Jython comes complete with a GUI installer that worked flawlessly on my Ubuntu Linux system.

My only gripe about Jython is its lack of readline support out of the box. The symptom consists of getting the following in an interactive jython session after hitting the up-arrow to retrace your command history:

```bash
>>> ^[[A
```

Although there is [some documentation](http://wiki.python.org/jython/ReadlineSetup) on enabling readline support, in my hands it failed.

However, I was successful in installing [Jythonconsole](http://don.freeshell.org/jython/), which I configured to be run from the command line with:

```bash
jipy
```

Jythonconsole offers some nice touches, including dropdown code-completion and, of course, command line history - although the latter isn't persistent across sessions.

# Scripting MX With Python

Before we use MX from Jython, we'll need to specify a location for the MX jarfile. Assuming [mx-0.104.0.jar](http://mx-java.googlecode.com/files/mx-0.104.0.jar) is in our working directory, this can be accomplished with:

```bash
export CLASSPATH='mx-0.104.0.jar'
```

Invoking Jython now gives us access to the complete set of MX functionality.

# Hello, Benzene

We can create a benzene molecule in Python using the following commands:

```bash
Jython Completion Shell
Jython 2.5b0 (trunk:5540, Oct 31 2008, 13:55:41) 
[Java HotSpot(TM) Client VM (Sun Microsystems Inc.)] on java1.5.0_16
>>> from com.metamolecular.mx.io import Molecules
>>> benzene = Molecules.createBenzene()
>>> benzene.countAtoms()
6
```

That's it. We can now access any new feature of MX through Python without writing or debugging a single line of bridge code.

# Other Uses of Jython in Cheminformatics

A few sources discuss the use of Jython to interface Java-based cheminformatics libraries. One of the most prolific is [Noel O'Boyle](http://baoilleach.blogspot.com/), who has written a series of articles on the subject, including [this introduction](http://baoilleach.blogspot.com/2008/03/pybel-as-generic-api-for.html) and [this performance comparison](http://baoilleach.blogspot.com/2008/07/cheminformatics-toolkit-face-off-speed.html). Noel's software project [Cinfony](http://code.google.com/p/cinfony/) uses Python to bridge cheminformatics toolkits written in different languages.

# Conclusions

Scripting languages like Python offer a rapid and immediate way to test and develop software. This article has shown how simple it is to use the Java cheminformatics library MX from Python using Jython.

# Update

It's also possible to import the MX jarfile into Jython using <code>sys.path.append</code>:

```python
import sys
sys.path.append("mx-0.104.0.jar")
from com.metamolecular.mx.io import Molecules
```
