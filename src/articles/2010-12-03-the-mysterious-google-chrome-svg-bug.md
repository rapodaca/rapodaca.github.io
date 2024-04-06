---
title: The Mysterious Google Chrome SVG Bug
published: "2010-12-03T00:00:00.000Z"
---

A number of people have taken the time to try [ChemWriter 2](http://chemwriter.com/signups/new) and offer detailed feedback about their experience. To my surprise, the most common issue reported has to do with atom and bond hovering on Google Chrome. Simply put, it doesn't work. Our goal has been from the beginning to make ChemWriter 2 work consistently on *all* modern browsers, so when reports like this come up, we want to get to the bottom of it. This post describes how we were able to demonstrate that the problem reported with ChemWriter 2 was actually a problem in certain Google Chrome builds.

# The Bug

For the unfamiliar, [ChemWriter](http://chemwriter.com) is a chemical structure drawing tool that my company is porting from Java to JavaScript. ChemWriter uses a system of 'Handles' that give visual feedback when an atom or bond is being hovered by the mouse cursor. Hovered status indicates that an atom or bond can be edited either by typing a key on the keyboard or by clicking the mouse:

![ChemWriter Hover](/images/posts/chemwriter-hover.png "ChemWriter Hover")

When hovering doesn't work, ChemWriter is pretty much useless.

ChemWriter adds transparent handles whenever a new atom or bond appears. Hovering these handles changes the fill to semi-transparent green.

The funny thing is that handle hovering works perfectly in Chrome on Mac Snow Leopard, the OS I use for development. Surprisingly, hovering behavior fails on both Linux and Windows builds of Chrome (version 8.0.552.215). My presumption was that all Chrome builds of the same version number could be expected to work equivalently. This is clearly not the case. In addition, every other modern browser we've tested ChemWriter 2 on can hover elements just fine, including: Windows (Firefox, IE 9 beta); Linux (Firefox); OS X (Safari, Firefox, Chrome).

So it seemed possible that Chrome itself was the cause of the bug. The problem was how to prove it.

We're not trying to lay blame, but rather ensure that if a browser bug prevents ChemWriter from running correctly, we do everything we can to make certain that the bug is resolved quickly.

# Finding the Culprit

Although I suspected Chrome as the source of the problem, I wanted to find out which of the many ChemWriter source code commits introduced the problem on Chrome. After a few guesses, I found it - a commit about six weeks ago that introduced SVG coordinate transformations. Before this commit, hovering worked great on Chrome on Win/Linux. After the commit, hovering didn't work on that browser/platform combination.

# Coordinate Transformations

ChemWriter works with two different coordinate systems. 'Document' coordinates represent [molfile](/articles/2010/06/28/latest-ctfile-formats-specification-available-now-from-symyx/) coordinates in which the y-axis increases in the upward direction and in which each unit corresponds roughly to one bond length. 'View' coordinates represent the screen in which the y-axis increases in the downward direction and each unit corresponds roughly to one pixel by default.

An affine transform, applied to the root SVG graphics element, handles the conversion between the two coordinate systems.

# Dots: An SVG Testbed

I could have just filed a Chrome bug report saying that ChemWriter 2 itself doesn't work on Windows and Linux, but did work on Mac. But this seemed unlikely to produce any results given the complexity of the ChemWriter codebase.

Fortunately, [the last time I needed to report a Chrome SVG rendering bug](http://code.google.com/p/chromium/issues/detail?id=61343), I created '[Dots](https://github.com/metamolecular/dots)', a test harness written in [Google Closure](/articles/2010/11/22/google-closure-building-complex-applications-with-javascript/). If you're curious about using vector graphics in the browser with JavaScript and Closure, Dots might be a good example project to get you started.

Dots draws a red circle wherever you click a mouse. I thought it could be extended to change the color of a drawn circle to green on hovering with the mouse. This would model the problem we were seeing with ChemWriter on Chrome.

# Zeroing In

I decided to take a two-pronged approach: (1) extend Dots to try to mimic the effects of the changes made in the ChemWriter commit; and (2) strip out functionality in ChemWriter until the demo worked in Chrome.

After stripping a lot of functionality from ChemWriter, the Chrome/Linux test was still failing to hover handles, although the handles were clearly being drawn. On a whim, I decided to try drawing some SVG ellipses right after showing the blank canvas. To my surprise, they captured mouseover events, but the atom and bond handles still did not.

It turns out I used an atom radius of one for these new ellipses, but 0.43 for the handle ellipses. This seemingly minor change was enough to prevent events from firing.

After some minor changes to Dots, [I had code that faithfully replicated the behavior in the ChemWriter demo](https://github.com/metamolecular/dots): circles could be drawn, but they reported no mouseover events. In case this repo has evolved in the time since this article was written, the commit to use is [cc766](https://github.com/metamolecular/dots/commit/cc766f439223d898a0906c900c85f7f37c504faa).

# The Bug Revealed

To summarize, [Google Chrome 8.0.552.215 on Linux and Windows lacks the ability to report mouseover events on SVG ellipses drawn with a radius less than 0.5](http://code.google.com/p/chromium/issues/detail?id=65238).

This bug is likely to affect any program using SVG in Chrome on Windows or Linux in which ellipses (and possibly other shapes) are drawn with subunity dimensions and enlarged through the use of coordinate transformation.

**Update 12/6/2010:** [A simplified demonstration of the Chrome SVG event bug](/demos/chrome-bug-65238/chrome-on-linux-windows-svg-event-bug.xhtml) is now available. This demo shows that the issue is not limited to ellipses; a rectangle with a subunity width also fails to report mouseover events.