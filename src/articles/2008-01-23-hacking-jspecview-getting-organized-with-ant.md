---
title: Hacking JSpecView - Getting Organized with Ant
published: "2008-01-23T00:00:00.000Z"
---

[JSpecView](http://jspecview.sourceforge.net/) is a general-purpose X-Y data viewer suitable for Web applications. The [previous article in this series](/articles/2008/01/22/an-introduction-to-jspecview) introduced JSpecView and discussed the importance of this kind of software in building rich, chemically-aware Web applications. This article will illustrate one way to set up the JSpecView build environment to easily enable extensions and modifications to be outlined in articles that will follow.

# Prerequisites

This tutorial will use [Apache Ant](http://ant.apache.org/). For those unfamiliar with it, Ant is a platform-independent build tool like [make](http://www.gnu.org/software/make/). It automates the drudgery of compiling software and building its accessories such as documentation, jar files, and so on. Although far from perfect, Ant is the most widely-used Java build tool.

# Configure Your Build Directory

Download and unpack [the most recent version of the JSpecView source distribution](http://downloads.sourceforge.net/jspecview/JSVSsrc_2008Jan13.zip?modtime=1200256938&big_mirror=0) ("2008Jan13" as of this writing) into a directory of your choice. When finished, you should end up with a directory structure like this:

![Dirs Initial](/images/posts/20080123/dirs_initial.png "Dirs Initial")

Now, re-arrange the files and directories:

-  Create a new directory called `src` to hold source files and `lib` to hold external libraries.
-  Move `jspecview`, `mdidesktop`, and `test` into the new `src` directory.
-  Delete `META-INF`
-  Add an empty file called `build.xml`

When finished, your new directory structure should look like this:

![Dirs Final](/images/posts/20080123/dirs_final.png "Dirs Final")

# Adding External Libraries

Compiling JSpecView in its current form requires two external libraries - let's add them now.

The first library is the LiveConnect JavaScript library named **plugin.jar**. It can be found in your Java Developer Kit. It's typically located under the **jre/lib** directory. Copy this file into your JSpecView **lib** directory.

The second library we'll need is [Velocity](http://velocity.apache.org/). Copy the [Velocity-1.5 jarfile](http://apache.mirrors.redwire.net/velocity/engine/1.5/velocity-1.5.tar.gz) into your JSpecView **lib** directory.

# Create build.xml

All that remains is to create an Ant **build.xml** file. There are many ways to do this; the file presented below is but one of them:

```xml
<?xml version="1.0"?>

<project name="JSpecView" default="compile" basedir=".">
  <description>
    A JCamp-DX Viewer
  </description>
  <property name="full-name" value="JSpecView" />
  <property name="short-name" value="JSpecView" />
  <property name="unix-name" value="jspecview" />
  <property name="version" value="20080113" />
  <property name="img" location="icons" />
  <property name="src" location="src" />
  <property name="lib" location="lib" />
  <property name="build" location="build" />
  <property name="build-classes" location="build/classes" />
  <property name="build-lib" location="build/lib" />
  <property name="doc" location="doc" />
  <property name="dist" location="dist" />
  <property name="bin-dist" location="${dist}/bin" />
  <property name="src-dist" location="${dist}/src" />

  <target name="compile" depends="init" description="compile the source">
    <javac srcdir="${src}" destdir="${build-classes}" debug="on" source="1.5" target="1.5">
      <classpath>
        <fileset dir="${lib}">
          <include name="**/*.jar" />
        </fileset>
      </classpath>
    </javac>
  </target>

  <target name="jar" depends="compile">
    <jar jarfile="${build-lib}/${unix-name}-${version}.jar" basedir="${build-classes}" >
    </jar>
  </target>

  <target name="init">
    <mkdir dir="${build}" />
    <mkdir dir="${build-classes}" />
    <mkdir dir="${build-lib}" />
  </target>

  <target name="doc" depends="compile" description="create the full api documentation">
    <javadoc sourcepath="${src}" packagenames="*" destdir="${doc}" windowtitle="${short-name} API">
      <doctitle>${full-name} v${version}</doctitle>
        <header>${full-name} v${version}</header>
      <classpath>
        <fileset dir="${lib}">
          <include name="**/*.jar" />
        </fileset>
      </classpath>
    </javadoc>
  </target>

  <target name="clean" description="remove dist, doc, and build directories">
    <delete dir="${build}" />
    <delete dir="${dist}" />
    <delete dir="${doc}" />
  </target>
</project>
```

The purpose of this file is to create five general-purpose scripts: `compile`, `jar`, `init`, `doc`, and `clean`.

<h4>Compiling the Jarfile and Documentation</h4>

The <strong>build.xml</strong> file can be tested by using it to compile the JSpecView source:

```bash
ant
Buildfile: build.xml

init:
    [mkdir] Created dir: /home/rich/devel/proj/jspecview/build
    [mkdir] Created dir: /home/rich/devel/proj/jspecview/build/classes
    [mkdir] Created dir: /home/rich/devel/proj/jspecview/build/lib

compile:
    [javac] Compiling 48 source files to /home/rich/devel/proj/jspecview/build/classes

BUILD SUCCESSFUL
Total time: 3 seconds
```

If you don't get this result, make sure your libraries are installed in the `lib` directory and that you've moved all Java sourcecode directories into the `src` directory.

We can build a JSpecView jarfile just as easily:

```bash
ant jar
Buildfile: build.xml

init:

compile:

jar:
      [jar] Building jar: /home/rich/devel/proj/jspecview/build/lib/jspecview-20080113.jar

BUILD SUCCESSFUL
Total time: 1 second
```

As you can see from the output, the jarfile has been placed into the **build/lib** directory.

We can also create JavaDoc documentation:

```bash
ant doc
Buildfile: build.xml

init:

compile:

doc:
  [javadoc] Generating Javadoc
  [javadoc] Javadoc execution
  [javadoc] Creating destination directory: "/home/rich/devel/proj/jspecview/doc/"
  [javadoc] Loading source files for package jspecview.applet...
  [javadoc] Loading source files for package jspecview.application...
  [javadoc] Loading source files for package jspecview.common...
  [javadoc] Loading source files for package jspecview.exception...
  [javadoc] Loading source files for package jspecview.util...
  [javadoc] Loading source files for package jspecview.xml...
  [javadoc] Loading source files for package mdidesktop...
  [javadoc] Loading source files for package test...
  [javadoc] Constructing Javadoc information...
  [javadoc] /home/rich/devel/proj/jspecview/src/jspecview/util/DisplaySchemesProcessor.java:31: package org.apache.xerces.parsers does not exist
  [javadoc] import org.apache.xerces.parsers.DOMParser;
  [javadoc]                                 ^
  [javadoc] Standard Doclet version 1.6.0_01
  [javadoc] Building tree for all the packages and classes...
  [javadoc] Building index for all the packages and classes...
  [javadoc] Building index for all classes...
  [javadoc] Generating /home/rich/devel/proj/jspecview/doc/stylesheet.css...
  [javadoc] 1 warning

BUILD SUCCESSFUL
Total time: 10 seconds
```

The result is placed into a new **doc** directory. As you can see from the output above, there was a problem finding the Xerces **DOMParser**, a library we may need to include in the **lib** directory for future iterations.

To clean up the directories our script created, we simply use:

```bash
ant clean
Buildfile: build.xml

clean:
   [delete] Deleting directory /home/rich/devel/proj/jspecview/build
   [delete] Deleting directory /home/rich/devel/proj/jspecview/doc

BUILD SUCCESSFUL
Total time: 0 seconds
```

# Conclusions

With a build environment configured and working, we can move on to building a test harness and making modifications. But that's a story for another time.