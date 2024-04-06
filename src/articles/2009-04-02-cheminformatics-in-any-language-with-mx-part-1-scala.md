---
title: Cheminformatics in Any Language with MX Part 1 - Scala
published: "2009-04-02T00:00:00.000Z"
---

One of the best ways to keep current with new developments in programming is to try new languages. Fortunately, there are so many to choose from that finding an unfamiliar language is less of a problem than finding one that's interesting enough to make the effort worthwhile.

In this new series of articles, we'll explore many of the most interesting programming languages through the lense of cheminformatics. Our test subject will be [MX](http://code.google.com/p/mx-java/), the lightweight, cross-platform, cross-language cheminformatics toolkit written in Java. These tutorials are not designed to teach you a new language. Instead, they will focus on quickly getting you to the point of being able to perform basic cheminformatics operations within the target language.

# Why Scala?

Scala is a general purpose programming language [developed](http://www.artima.com/weblogs/viewpost.jsp?thread=163733) by Martin Odersky and first released in 2003. It was designed to ebrace two important programming paradigms: object-oriented programming and functional programming. Scala, like many other languages, has been implemented on the Java Virtual Machine (JVM), positioning it to take full advantage of a rich selection of useful libraries.

For Web developers, Scala comes complete with a few interesting frameworks, the most popular of which appears to be [Lift](http://liftweb.net/). Because the entire framework runs on a standard JVM, there's no need to change the way you've come to rely on deploying Java-based web applications. Apparently, Twitter is finding Scala to be [very useful](http://www.slideshare.net/al3x/why-scala-presentation) as a platform for creating Web applications that scale.

As will be true of most of the languages in this series, my knowledge of Scala is extremely limited and pieced together from Web resources assembled on the spur of the moment and in great haste. Your comments, corrections, and suggestions are welcome.

# Getting Started

Scala can be installed by [downloading the current version](http://www.scala-lang.org/downloads) and following [these instructions](http://www.scala-lang.org/node/166). Make sure to update your environment variables. On my Ubuntu Linux system, the installation worked without a hitch. [This tutorial](http://www.scala-lang.org/node/166) will guide you through the basics of the language and its toolset.

# Working With MX

Let's begin by creating a molecule with Scala using MX. To do this, we'll need to let Scala know where to find the MX library. Download the current [MX jarfile](http://mx-java.googlecode.com/files/mx-0.108.1.jar) and place it in your working directory. We can then invoke an interactive Scala shell with MX support through:

```bash
scala -classpath mx-0.108.1.jar
```

We can now load benzene and verify that it has the correct number of atoms.

```bash
scala> import com.metamolecular.mx.io.Molecules         
import com.metamolecular.mx.io.Molecules

scala> val benzene = Molecules.createBenzene            
benzene: com.metamolecular.mx.model.Molecule = com.metamolecular.mx.model.DefaultMolecule@2d5534

scala> benzene.countBonds                               
res0: Int = 6
```

We can also determine that benzene has one ring, as expected:

```bash
scala> import com.metamolecular.mx.io.Molecules         
import com.metamolecular.mx.io.Molecules

scala> val benzene = Molecules.createBenzene            
benzene: com.metamolecular.mx.model.Molecule = com.metamolecular.mx.model.DefaultMolecule@117b450

scala> import com.metamolecular.mx.ring.HanserRingFinder
import com.metamolecular.mx.ring.HanserRingFinder

scala> val finder = new HanserRingFinder                
finder: com.metamolecular.mx.ring.HanserRingFinder = com.metamolecular.mx.ring.HanserRingFinder@1c0cb76

scala> val rings = finder.findRings(benzene)            
rings: java.util.Collection[java.util.List[com.metamolecular.mx.model.Atom]] = [[com.metamolecular.mx.model.DefaultMolecule$AtomImpl@fe087b, com.metamolecular.mx.model.DefaultMolecule$AtomImpl@1def3f5, com.metamolecular.mx.model.DefaultMolecule$AtomImpl@62974e, com.metamolecular.mx.model.DefaultMolecule$AtomImpl@bbaa16, com.metamolecular.mx.model.DefaultMolecule$AtomImpl@9ba045, com.m...
scala> rings.size
res0: Int = 1
```

# Conclusions

Scala is a neat little language with a lot to offer. With MX and interactive Scala, it's possible to quickly explore ways this new language can be used in cheminformatics.

*Credit: thanks to [Rajarshi Guha](http://blog.rguha.net/) for [inspiration](http://blog.rguha.net/?p=133) for this series.*