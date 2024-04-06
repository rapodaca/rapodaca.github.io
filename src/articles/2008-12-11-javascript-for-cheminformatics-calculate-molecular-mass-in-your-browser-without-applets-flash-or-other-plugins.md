---
title: JavaScript for Cheminformatics - Calculate Molecular Mass in Your Browser Without Applets, Flash, or Other Plugins
published: "2008-12-11T00:00:00.000Z"
---

Recently, [Duan Lian](http://chemhack.com/) raised the very interesting possibility of using the [Google Web Toolkit](http://code.google.com/webtoolkit/) to [cross-compile Java to JavaScript rather than bytecode](/articles/2008/12/09/javascript-for-cheminformatics-cross-compiling-java-to-javascript-with-gwt). I suggested that [MX](http://code.google.com/p/mx-java/), the lightweight cheminformatics toolkit, might be a good target due its small size, modular design, and lack of external dependencies.

Today Duan blew me away by posting [this link to a working demonstration](http://chemhack.com/mx-gwt/) of what he calls "MX-GWT".

Duan's demonstration accepts a molfile and calculates the corresponding molecular mass after you click a button.

"Big deal," you might say, but consider:

-  The page uses no applets or Flash.
-  No Java bytecode is involved.
-  No remote call is made to a server.
-  MX-GWT builds a highly-functional, in-memory representation of a chemical structure that can be used for a variety of other purposes.
-  Duan's code is currently the **only** way to do this that I'm aware of.
-  MX-GWT developers can take full advantage of the awesome array of Java development tools.

You might ask "why do this?" The answer is simple: JavaScript may well be the most widely-distributed runtime on the planet. For this reason, the user experience with a pure HTML/JavaScript site can be far smoother than a site using Java applets, Silverlight, or even Flash.

Building interactive chemically-driven websites with HTML/JavaScript has the potential to make life a lot easier for both chemists and developers.

There are some technical points to work out. For example, regular expression support is somewhat limited with GWT. As MX-GWT progresses, other areas needing attention will no doubt come to light. After all, GWT only partially implements the Java core API.

Nevertheless, this proof of concept clearly demonstrates that you don't need applets or other browser plugins to do cheminformatics on the Web client. MX-Java's [brisk addition of new features](http://github.com/rapodaca/mx/) and forking ([here](http://github.com/chemhack/mx) and [here](http://github.com/giorgil/mx-dsl)) even at this early stage suggests that there will be no shortage of easy-to-use Web-based cheminformatics applications made possible through MX-GWT and the [ever-improving performance of JavaScript](/articles/2008/09/05/chrome-and-a-v8-javascript-takes-a-giant-leap-forward).

