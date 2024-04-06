---
title: Working With OPSIN - Using Netbeans for a Maven Project
published: "2010-12-16T00:00:00.000Z"
---

The previous article in this series showed how to use the popular version control system [Git with OPSIN](/articles/2010/12/14/plugging-into-opsin-how-to-synchronize-git-and-mercurial-repositories/). For the unfamiliar, [OPSIN](http://opsin.ch.cam.ac.uk/) is the open source IUPAC nomenclature parser. [First reviewed here in 2006](/articles/2006/10/14/decoding-iupac-names-with-opsin/), OPSIN has continued to evolve and now parses a remarkable range of nomenclature including [fused hetereocycles](/articles/2010/12/13/open-source-name-to-structure-conversion-of-iupac-nomenclature-opsin-revisited/).

But having raw source code is not the same as being able to do something useful with it. For example, both a build system and some form of dependency management are essential. This article will show an easy way to begin working with the OPSIN source code using free tools.

# Maven

OPSIN uses [Maven](http://maven.apache.org/) to manage project builds and dependencies. My experience with Java dates all the way back to the time when your shell was the build system. Ant soon followed and most developers standardized on it, including me. I've had very little experience with Maven and was especially discouraged by the apparent complexity of the system compared to Ant.

In fact, my first thought when seeing that OPSIN used Maven was to write an Ant build file. I'm glad I didn't.

# Netbeans and Maven = Nice

It turns out that [Netbeans](http://netbeans.org/) has quite good support for working with Maven projects. There's no need to actually import the project files - the root folder can simply be opened.

Start by cloning the [OPSIN git repository](https://github.com/metamolecular/opsin):

```bash
git clone git://github.com/metamolecular/opsin.git
```

Or, if you prefer Mercurial:

```bash
hg clone https://bitbucket.org/dan2097/opsin
```

To begin using and modifying the OPSIN source, open the project folder with Netbeans (File -> Open Project, then select the 'opsin' directory). You'll end up with a project folder:

![OPSIN Netbeans](/images/posts/opsin-netbeans-main.png "OPSIN Netbeans")

OPSIN is composed of two modules, OPSIN Core and OPSIN\_InChI\_Support. To begin browsing the OPSIN Core source, open the 'Modules' folder, and then double-click on 'OPSIN Core'. You'll then have a new project called 'OPSIN core':

![OPSIN Core](/images/posts/opsin-core.png "OPSIN Core")

# Trust, But Verify

You can run the OPSIN JUnit test suite by right-clicking on the OPSIN Core project and selecting Test. All tests should pass. As of this writing, the number of tests is 295.

# Loose Ends

Still on my list of things to figure out are how to generate a runnable jarfile using Netbeans. It may be that this is only possible through the command line.

# Conclusions

All of the prerequisites for forking OPSIN and contributing changes back to the main project are now in place: a distributed version control system (Git or Mercurial); a build and dependency management system (Maven); and a test suite (JUnit). What remains is to decide exactly what to do. Future articles will discuss some specific directions.