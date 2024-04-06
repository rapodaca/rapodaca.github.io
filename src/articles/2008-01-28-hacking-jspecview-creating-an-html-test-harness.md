---
title: Hacking JSpecView - Creating an HTML Test Harness
published: "2008-01-28T00:00:00.000Z"
---

The [previous article in this series](/articles/2008/01/23/hacking-jspecview-getting-organized-with-ant) discussed the construction of an Ant build environment for [JSpecView](http://jspecview.sourceforge.net/). This article will show how to use Ant to build an HTML harness to test the resulting Applet and jarfile.

# Availability of Source Code

Robert Lancashire, the lead JSpecView developer, has kindly agreed to host the complete source code for this series of tutorials on the [JSpecView SourceForge project page](http://sourceforge.net/project/showfiles.php?group_id=161398&package_id=260592).

# Overview

Our goal for this session is to create an Ant task that will assemble a directory of HTML pages for testing the JSpecView applet. To do this, we'll add a new `demo` task and some supporting files.

# Editing the build.xml File

The main change we'll make is to add the `demo` task itself:

```xml
<target name="demo" depends="jar">
  <mkdir dir="${demo}" />
  <copy todir="${demo}">
    <fileset dir="${resources-html}" />
  </copy>
  <copy file="${build-lib}/${unix-name}-${version}.jar" tofile="${demo}/lib/${unix-name}.jar" />
</target>
```

This task creates a <strong>demo</strong> directory and copies into it the contents of a new <strong>resources/html</strong> directory, along with the jarfile built with the `jar` task.

Other changes to the <strong>build.xml</strong> file are necessary. In the interest of brevity, they have been omitted. Those interested should <a href="http://sourceforge.net/project/showfiles.php?group_id=161398&package_id=260592">download the source package</a> to be available shortly.

# Creating the <strong>resources</strong> Directory

Think of the <strong>resources</strong> directory as a place to hold non-Java files that will get used by our Ant tasks. Our first addition to this directory will be a directory called </strong>html</strong>. Here, we'll create a new directory called <strong>demo1</strong>. It will contain an HTML document with an embedded JSpecView applet (<strong>index.html</strong>), along with a JCAMP-DX file (<strong>netanilineH.jdx</strong>) and the excellent <a href="/articles/2007/11/02/eolas-and-jactivating-working-around-a-workaround">JActivating</a> JavaScript tool.

# Using the `demo` Task

We can run our new `demo` task just like the others:

```bash
ant demo
Buildfile: build.xml

init:
    [mkdir] Created dir: /home/rich/devel/proj/jspecview/build
    [mkdir] Created dir: /home/rich/devel/proj/jspecview/build/classes
    [mkdir] Created dir: /home/rich/devel/proj/jspecview/build/lib

compile:
    [javac] Compiling 48 source files to /home/rich/devel/proj/jspecview/build/classes

jar:
      [jar] Building jar: /home/rich/devel/proj/jspecview/build/lib/jspecview-20080128.jar

demo:
    [mkdir] Created dir: /home/rich/devel/proj/jspecview/demo
     [copy] Copying 3 files to /home/rich/devel/proj/jspecview/demo
     [copy] Copying 1 file to /home/rich/devel/proj/jspecview/demo/lib

BUILD SUCCESSFUL
Total time: 3 seconds
```

If all went well, you should see a new **demo** directory with the following structure:

![Screen](/images/posts/20080128/screen.png "Screen")

# Viewing the Result

You can view the result online [here](/images/posts/20080128/demo/demo1/index.html). The applet loads and displays the JCAMP-DX file `[netanilineH.jdx](/images/posts/20080128/demo/demo1/netanilineH.jdx)`. Notice that the spectrum is interactive; zoom and display properties can be set by right-clicking in the applet Window.

# Conclusions

This tutorial has show how to build a simple HTML test harness for JSpecView. With this important step complete, we can begin to customize JSpecView itself. Future tutorials will show how.