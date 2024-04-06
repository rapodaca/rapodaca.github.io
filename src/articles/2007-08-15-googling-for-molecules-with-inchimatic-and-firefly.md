---
title: "Googling for Molecules with InChIMatic and Firefly"
published: "2007-08-15T00:00:00.000Z"
---

A series of D-F articles have discussed [InChIMatic](http://inchimatic.com), a Web application that lets you structure-search the Web using popular search engines such as Google. Recent articles have also described Firefly, a lightweight 2D structure editor designed especially for the Web.

![Firefly](/images/posts/20070815/screenshot.png "Firefly")

Today, the first alpha release of Firefly is available for use with [InChIMatic](http://inchimatic.com).

Despite its small size of only 103K, the Firefly applet offers a number of advanced features:

-  **A clean interface with major functionality in plain sight.**
-  **Antialiased rendering.** Pressing the "+" and "-" keys will zoom in and out to reveal rendering detail.
-  **User-overridable bond length and angle constraints.** When dragging a bond, use *Shift* to relax both angle and length constraints, or *Ctrl* to relax only angle constraints.
-  **Automatic inside-outside double bond rendering.** 
-  **Built-in molfile import/export.** Use the File->Import Molfile and File->Export Molfile options to copy/paste a molfile from your system clipboard.
-  **Automatic implicit hydrogen detection.** The quadrant for hydrogen placement is chosen based on the bonds surrounding the atom.
-  **Twenty levels of undo/redo.** The commands can either be issued from the menu, or *Ctrl-Z*/*Ctrl-Y*.
-  **Persistent molecule.** When you visit another page and come back, Firefly remembers the molecule you were working on.
-  **No digital certificate authorization.** Just start using it.

Firefly also incorporates a number of keyboard shortcuts to speed up structure drawing:

-  **<u>1</u>-<u>9</u> keys** Builds a chain with the indicated number of carbons.
-  **<u>a</u> key** Phenyl (<u>a</u>romatic) ring. When hovering over a bond, fuses the ring to the bond. When hovering over an atom, fuses the ring to that atom, if possible, or sprouts the ring.
-  **<u>f</u>, <u>l</u>, <u>r</u>, <u>i</u> keys** The elements <u>F</u>, C<u>l</u>, B<u>r</u>, and <u>I</u>, respectively.
-  **<u>z</u> and <u>t</u> keys** The elements Si and Sn, respectively
-  **<u>b</u>, <u>c</u>, <u>n</u>, <u>o</u>, <u>s</u>, and <u>p</u> keys** The elements B, C, N, O, S, and P, respectively.
-  **[delete] and [backspace] keys** deletes whatever is underneath the cursor.

To use these shortcuts, simply hover the cursor over an atom and press the key on your keyboard.

Being an alpha release, this version of Firefly still has room for improvement. Your feedback is important. Please send questions, comments, and suggestions to the email address found under Firefly's "Help" menu.