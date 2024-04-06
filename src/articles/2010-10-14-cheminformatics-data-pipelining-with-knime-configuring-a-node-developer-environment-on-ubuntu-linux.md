---
title: Cheminformatics Data Pipelining with KNIME - Configuring a Node Developer Environment on Ubuntu Linux
published: "2010-10-14T00:00:00.000Z"
---

The previous article in this series [introduced KNIME as a data pipelining engine for cheminformatics](http://localhost:4000/articles/2010/10/11/cheminformatics-data-pipelining-with-knime-getting-started). One of the conclusions from that article was that the possibilities for doing interesting things with an out-of-the-box KNIME installation were somewhat limited. This article briefly describes how to set up a KNIME developer environment in preparation for creating our own custom KNIME cheminformatics nodes.

# The System

Although the KNIME workbench is offered as a Mac OS X version, the KNIME SDK is only offered on Windows and Linux. Given that I only run Macs for development, this presents a problem. The solution in my case was to install Ubuntu on [VirtualBox](http://www.virtualbox.org/).

Having used one other virtualization product for OS X, I can say that VirtualBox is a joy to work with. And if you do any serious Web development work, having the ability to test your code across browsers and operating systems on your local development machine is a real plus. I highly recommend VirtualBox.

For the purpose of developing with KNIME, I found it sufficient to install the latest Ubuntu release (10.4) on a stock VirtualBox installation.

To download the KNIME SDK, follow [this link](http://www.knime.org/downloads/overview), and scroll to the bottom. Follow the links for your system.

After unpacking, change into the SDK directory. That's it for installation.

# Start Eclipse

The KNIME SDK is based on [Eclipse](http://www.eclipse.org/) and requires a number of dependencies. Fortunately the distribution you just downloaded packages almost all of them into a single download. Start Eclipse with:

```bash
$ ./eclipse
```

And... it doesn't work. The Eclipse splash screen comes up and everything seems to be loading, then this empty dialog appears:

![Eclipse Fail](/images/posts/eclipse-fail.png "Eclipse Fail")

Fortunately, the fix is simple. Open up **eclipse.ini** in a text editor and add the following to the last line:

```bash
-Dorg.eclipse.swt.browser.XULRunnerPath=/usr/lib/foobar
```

The path you choose is unimportant, but it must not actually exist on your system. We're trying to prevent Eclipse from loading the <code>xulrunner 1.9.2</code> libraries, which are incompatible with the KNIME SDK. Special thanks to [wiswedel on the KNIME support forums for answering this question for me](http://tech.knime.org/forum/knime-developers/blank-window-on-launching-eclipse-knime-222-for-linux#comment-22948). This workaround may lead to not being able to view html content within Eclipse, but so far I haven't noticed any limitations.

# Create a New Node Project

With the KNIME SDK Eclipse environment up and running, we can create our first node. File->New->Project pulls up a dialog. Scrolling down we can see one of the options as "KNIME", and under it, "Create a new KNIME Node-Extenstion":

![New Knime Node](/images/posts/new-knime-node.png "New Knime Node")

Filling in the blanks on the subsequent form gives a complete KNIME project, ready to compile:

![Blank Knime Project](/images/posts/blank-knime-project.png "Blank Knime Project")

# Conclusions

After a minor speedbump, we've created a developer environment capable of generating new KNIME nodes. And by using VirtualBox, exactly the same developer environment can be created on any computer. We can now begin to endow KNIME with new behaviors and new capabilities. As a bonus, we're using familiar, free tools to do so - including Java, Ant, and Eclipse. As you might have gathered from the screenshot above, I plan on creating an InChI node. But I'm getting ahead of myself.
