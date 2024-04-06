---
title: JavaScript for Cheminformatics - Cross-Compiling Java to JavaScript with GWT Revisited
published: "2009-01-06T00:00:00.000Z"
---

Wouldn't it be great to be able to cross-compile your Java cheminformatics source code to plain old JavaScript files to be used in your Web applications without plugins? JavaScript is the most widely-deployed runtime environment in existence; on today's Web it's one of the few things you can count on being there. Java is one of the most advanced programming languages in existence, with a mountain of developer tools and libraries.

All of which makes the [development of software in Java and its deployment via JavaScript](/articles/2008/12/09/javascript-for-cheminformatics-cross-compiling-java-to-javascript-with-gwt) an attractive option. Until recently, very few examples of [using JavaScript for low-level cheminformatics functionality](/articles/2008/07/15/javascript-for-cheminformatics) were available. This is starting to change.

# Demonstrations

Last month, [Duan Lian](http://chemhack.com/) showed that cross-compiling Java cheminformatics libraries to JavaScript is indeed now possible. His two proofs of concept give hints as to what may soon become routine:

-  [MX-GWT](http://code.google.com/p/mx-gwt/) An [online demo](http://chemhack.com/mx-gwt/) shows that molecular weight can be calculated from a molfile without any plugins.
-  [Demo Molecule Structure Rendering](http://chemhack.com/mx-gwt/demo-molecule-structure-rendering/) This remarkable online demo uses a pure-JavaScript cheminformatics toolkit to render color 2D chemical structures from molfiles independent of a Java runtime.

Both of these demos make use of [MX](http://code.google.com/p/mx-java/), the lightweight, platform-independent, cross-language ([link](/articles/2008/11/24/getting-started-with-mx), [link](/articles/2008/12/01/open-source-cheminformatics-in-python-with-mx)) cheminformatics toolkit. Using the [Google Web Toolkit](http://code.google.com/webtoolkit/) (GWT), Duan compiled MX into pure JavaScript that can be run in a browser without any plugins.

# Still More Demonstrations

Recently, [Noel O'Boyle](http://baoilleach.blogspot.com/) upped the ante by demonstrating a [spinning 3D molecular model created in pure JavaScript](http://www.redbrick.dcu.ie/~noel/blog/molecproc/). His demonstration doesn't yet parse a molfile but rather manually creates the graphical representation.

In a [comment](https://www.blogger.com/comment.g?blogID=7844526396210378482&postID=4314630511708329016) on Noel's work, Richard Hall announced a [simple 2D molecular renderer in pure JavaScript](http://gist.github.com/43774).

What all of these demonstrations could benefit from is a robust, low-level, pure-JavaScript cheminformatics toolkit.

# The Problem: Simple Java to JavaScript Cross-Compilation

When used in its most popular mode, GWT isn't just a Java to JavaScript cross-compiler; it's a full-blown method for developing Web sites complete with GUI APIs, HTML and JavaScript output, and a complete project structure.

In other words, GWT is overkill for the job at hand, which is simply to convert a Java library consisting of a set of source files into one or more JavaScript files.

I've been trying to understand how to access GWT's low-level JavaScript cross-compiler functionality without the rest of the GWT, with mixed success. The good news is this appears to be one of the ways the creators of GWT envisioned it to be used; the bad news is I've found no documentation describing exactly how to do it.

Surprisingly, getting this seemingly obvious use case to work is anything but [obvious](http://rhjr.net/dto/). Most documentation dives right into using GWT to build fancy websites. What's needed here is far more basic.

What would be most helpful would be a step-by-step procedure for compiling a simple HelloWorld.java class into a HelloWorld.js JavaScript file, preferably using only command-line tools:

```java
public class HelloWorld
{
  public String sayHello()
  {
    return "hello";
  }
}
```

The result could then be used in client-side JavaScript by including the **HelloWorld.js** file and invoking the <code>HelloWorld.sayHello</code> method.

If you have any experience in this area, I'd be very interested to hear about it. If no guides to solving this simple problem exist, then the first may appear here!

# Conclusions

A reliable method for cross-compiling Java libraries into JavaScript libraries with GWT would open many new avenues for cheminformatics Web applications. Future articles may detail how this can be accomplished.

