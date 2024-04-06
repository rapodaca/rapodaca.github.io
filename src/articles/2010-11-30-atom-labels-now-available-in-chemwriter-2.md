---
title: Atom Labels Now Available in ChemWriter 2
published: "2010-11-30T00:00:00.000Z"
---

![ChemWriter Atom Labels](/images/posts/chemwriter-atom-labels.png "ChemWriter Atom Labels")

Correctly scaling and placing atom labels is one of the most difficult parts of writing a chemical structure editor. With its [latest preview release](http://chemwriter.com/signups/new), ChemWriter 2 has crossed this barrier.

For the unfamiliar, ChemWriter 2 is a pure JavaScript chemical structure editor that can be embedded in web pages without any browser plugins. ChemWriter 2 runs on all major modern browsers and a number of legacy browsers as well, including Internet Explorer 7/8.

Unlike Java, which has a vast array of utilities for manipulating fonts and glyphs, JavaScript's support for this kind of thing is extremely limited. [The Closure Library](/articles/2010/11/22/google-closure-building-complex-applications-with-javascript/) offers low-level support in the form of abstract shape operations, but little in the way of manipulating characters in a graphical context. The way we addressed this limitation may be the subject of future posts.

As  you can see from the screenshot, we've got a lot of the functionality in place now, but there's still some work to do. For example, implicit hydrogens and charges are not displayed. And if you look carefully, you'll notice that atom labels are slightly off-center, to the right, along the x-axis. Fortunately, we have a lightweight, fully-functional chemical structure editor written in Java ([ChemWriter 1.x](http://chemwriter.com)) from which to port additional features and refinements.

If you've [signed up for the demo](http://chemwriter.com/signups/new), atom labels can be added by hovering over an atom of interest and [using the same element keyboard shortcuts introduced in ChemWriter 1.x](http://chemwriter.com/articles/keyboard-shortcuts). We'll be introducing the ability to add elements from the rest of the periodic table shortly.

If you're looking for a Web-based structure editor designed for the future but runnable today, I'd like to [hear from you](http://metamolecular.com/contact).