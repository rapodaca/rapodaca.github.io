---
title: "MX at Work: Building a Pure JavaScript Chemical Structure Editor"
published: "2009-02-16T00:00:00.000Z"
---

[MX](http://metamolecular.com/mx/) is a fast, lightweight cheminformatics toolkit that can be used in many programming environments. Previous articles have shown how easy it is to use MX in [Ruby](/articles/2008/11/24/getting-started-with-mx) and [Python](/articles/2008/12/01/open-source-cheminformatics-in-python-with-mx), but that's just the beginning.

Because MX is written in Java and is both small and self-contained, it can also be [compiled into pure JavaScript](/articles/2009/01/06/javascript-for-cheminformatics-cross-compiling-java-to-javascript-with-gwt-revisited) thanks to the [Google Web Toolkit](http://code.google.com/webtoolkit/).

[Duan Lian](http://chemhack.com/) has taken this idea and run with it, creating a [pure JavaScript chemical structure editor called jsMolEdit](http://chemhack.com/jsmoleditor/).

The [new jsMolEdit demo page](http://chemhack.com/jsmoleditor/) is impressive: it reads molfiles, writes molfiles, and supports interactive drawing features such as moving, editing atoms and bonds, zooming in/out, and atom/bond highlighting.

jsMolEdit doesn't yet support some important features needed by an interactive structure editor, but it's an amazing proof of concept.

My company sells an applet-based [chemical structure editor called ChemWriter](http://metamolecular.com/chemwriter), from which the MX codebase was extracted. Although ChemWriter has been used successfully as a fast-loading, easy-to-use editor on a number of Web sites, one limitation is that users require a properly configured Java plugin for it to work. The possibility of deploying ChemWriter as a pure JavaScript tool is very attractive for this reason.

There are many other ways to apply the basic concept. For example, I recently wrote about JSpecView, a spectrum viewer/editor deployed as an applet.

Based on the jsMolEdit demonstration, it should be clear that this and many other interactive, pure JavaScript tools for chemistry are now well within reach.


