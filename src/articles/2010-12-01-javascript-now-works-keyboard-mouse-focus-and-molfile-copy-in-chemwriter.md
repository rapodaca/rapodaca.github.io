---
title: JavaScript Now Works - Keyboard, Mouse Focus, and Molfile Copy in ChemWriter
published: "2010-12-01T00:00:00.000Z"
---

Paul Graham probably said it best when parsing the meaning of the term "Ajax": [JavaScript Now Works](http://www.paulgraham.com/web20.html). In the five years since he made that statement, the performance of JavaScript has continued to improve. This is one of those developments that was easy to miss because it: (a) required the reversal of long-held negative perceptions; and (b) has unfolded at such as slow pace.

For many years, the only options for building highly interactive Web components were Java applets and Flash. Although both plugin technologies have much to offer, one of their weakest qualities is browser integration. Event focus and text copy are two cases in point.

# Focus, Events, and Applets

ChemWriter is a chemical structure drawing tool, first released as a Java applet, that makes extensive use of keyboard shortcuts to speed the drawing of complex structures. For these shortcuts to work, the applet must be able to capture keyboard and mouse focus.

On many platform/browser/JVM configurations, keyboard and mouse focus capture works quite well. Internet Explorer on Windows is one of these system configurations. Simply hovering the mouse cursor over a ChemWriter instance is enough to capture keyboard focus. On other system configurations, keyboard focus doesn't work well at all. For example, Safari on Mac requires a click inside the editor to begin capturing keyboard events. And for unknown reasons this mechanism periodically fails even on system configurations that generally work well otherwise.

But the issue isn't just limited to keyboard events - it applies to mouse events as well. This means that the only way to begin editing an existing structure without clicking on the drawing area and generating an unwanted drawing element (a not-too-uncommon situation) is to find a 'dead' place on the editor to click (say, one of the scrollbars).

# Keyboard/Mouse Focus Now Works Everywhere

[My company](http://metamolecular.com) has been [rewriting ChemWriter](http://depth-first.com/articles/2010/11/22/google-closure-building-complex-applications-with-javascript/) as a plugin-free, pure JavaScript component. There have been many pleasant surprises along the way, and one of them has been the way that keyboard and mouse focus just work across all browsers we've tested. To [add atom labels](http://depth-first.com/articles/2010/11/30/atom-labels-now-available-in-chemwriter-2/), simply hover over a vertex and type a [single-character keyboard shortcut](http://chemwriter.com/articles/keyboard-shortcuts). Both keyboard and mouse events are captured, regardless of what other page components may have been focused beforehand.

# Molfile Copy Now Works Everywhere

Another problem area has been copying molfiles from ChemWriter to the system clipboard. Like event focus, this functionality works well on some platforms, but not at all on others. For example, all Mac-based browsers appear to be incapable of copying text from a Java popup to the system clipboard, but this feature works great on Windows.

![ChemWriter Molfile Copy](/images/posts/chemwriter-molfile-copy.png "ChemWriter Molfile Copy")

In our JavaScript rewrite, molfile copy to the system clipboard works flawlessly on all browsers tested.

# Try It for Yourself

We've set up a [ChemWriter demo site](http://chemwriter.com/signups/new) to encourage those who might be interested in trying the most recent development version against the browser of their choice.

