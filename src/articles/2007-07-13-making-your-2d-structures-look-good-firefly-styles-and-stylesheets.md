---
title: "Making Your 2D Structures Look Good: Firefly, Styles and Stylesheets"
published: "2007-07-13T00:00:00.000Z"
---

Chemists can be [very discerning](http://depth-first.com/articles/2007/07/11/waldorf-salad) when it comes to chemical structure aesthetics. This is not surprising, given the [central role](http://depth-first.com/articles/2007/03/30/the-aesthetics-of-chemical-structure-diagrams) played by 2D chemical structures in the day-to-day work of many chemists. For example, consider the [Wikipedia Chemistry/Structure drawing workgroup's ongoing discussion](http://en.wikipedia.org/wiki/Wikipedia_talk:WikiProject_Chemistry/Structure_drawing_workgroup/Archive_Apr_2007) about achieving a consistent look for chemical structures on the online encyclopedia.

Several articles have discussed [Firefly](http://depth-first.com/articles/tag/firefly), a 2D chemical structure editor specifically designed for the Web. With major work on the rendering engine and structure manipulation interface complete, recent efforts have turned toward exposing drawing settings through a graphical user interface. Here I'll provide some screenshots of an interface prototype along with sample structures. I'll also briefly discuss the larger question of making 2D structure drawing styles portable.

Drawing styles are edited through a tabbed dialog containing a live preview window that uses the current structure or a default structure if none is available. The dialog is resizable, enabling users to immediately see the effects of changes on structures of varying sizes. Although this dialog could be bundled and deployed with the editor, its large footprint makes it more appropriate for use as an optional feature or as a standalone configuration tool in a Web application.

![Dialog](/images/posts/20070713/dialog.png "Dialog")

Changes can be rolled back entirely ("Reset"), canceled ("Cancel"), or accepted ("OK").

Let's say we'd like to apply a black background with white bonds, as used in some Power Point presentations:

![Black Background](/images/posts/20070713/black_background.png "Black Background")

After applying this change, we decide that we'd rather not use atom coloring:

![No Colors](/images/posts/20070713/no_colors.png "No Colors")

After looking at this structure for a few seconds, we decide that narrower stereo bonds are needed:

![Thin Stereo](/images/posts/20070713/thin_stereo.png "Thin Stereo")

After some experimentation, we find a more appropriate non-stereo bond width and double bond offset:

![Thin Lines](/images/posts/20070713/thin_lines.png "Thin Lines")

What about a Serif font? No, I don't think so:

![Serif Font](/images/posts/20070713/serif_font.png "Serif Font")

But we could certainly reduce the size of the atom labels:

![Small Labels](/images/posts/20070713/small_labels.png "Small Labels")

On second thought, the original atom sizes were fine, although changing font may require us to reconsider the atom label heights:

![Thin Lines](/images/posts/20070713/thin_lines.png "Thin Lines")

As you can see, the possibilities for customization are nearly endless. In practice, however, most chemists will adopt only two structure drawing styles that they re-use as needed: one for reports and manuscripts; and one for presentations. It will be interesting to see whether a third style makes it's way into the standard repertoire: Web.

Each chemist will want a way to save their styles, possibly share them, and easily apply them. Although a few systems for doing so are feasible, the most practical approach would be a [stylesheet](http://en.wikipedia.org/wiki/Stylesheet_language). Applying a stylesheet to any structure diagram would change its appearance, offering a simple mechanism to achieve a consistent look across documents.

Developing a universal (cross-editor) stylesheet system would be no easy task, given the wildly divergent capabilities of 2D structure rendering software. Despite the technical difficulty, the payoff for users is obvious.