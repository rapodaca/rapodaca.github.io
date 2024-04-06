---
title: Building Chempedia - Resizable Structures With ChemWriter
published: "2008-05-19T00:00:00.000Z"
---

One of the difficulties in viewing 2D chemical structures is that molecules vary in size. In particular, larger molecules become difficult to read when confined to a small section of a screen. This article shows how this problem has been addressed in [Chempedia](http://chempedia.com) using the 2D rendering capabilities of the [ChemWriter](http://metamolecular.com/chemwriter) package.

![Screen](/images/posts/20080519/screen.png)

As an example, consider Chempedia's entry for [Aluminon](http://chempedia.com/monographs/aluminon). Although the summary box at the right shows the structure for Aluminon, it may not be completely readable due to the large size of the molecule.

To solve this problem, Chempedia has implemented a "zoom" link for all monographs containing a chemical structure. Clicking on the zoom link for Aluminon gives a magnified, scaled, stretchable, and resizable view of the molecule.

To implement this feature, Chempedia uses the [ChemWriter](http://metamolecular.com/chemwriter) `PainterApplet`. Simply setting the `width` and `height` attributes of the [`<object>` tag](http://depth-first.com/articles/2008/03/10/demystifying-java-applets-part-2-dry-deployment-with-the-javay-method) to "100%" gives an applet that resizes itself as the surrounding window is resized.

Implementing a resizable 2D structure image window using AJAX and dynamic images is possible, but would be much more difficult to implement. It could also potentially produce a much higher, and unpredictable demand on server memory, CPU cycles, and bandwidth.

ChemWriter makes it possible for the server to delegate resizable image processing to the client, resulting in a much more responsive feature with minimal effect on the server.