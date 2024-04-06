---
title: "A Chemical Structure Editor for the Web: Four Screenshots of a Firefly Prototype"
published: "2007-05-02T00:00:00.000Z"
---

The [previous article](http://depth-first.com/articles/2007/04/23/a-chemical-structure-editor-for-the-web-fireflys-two-audiences) in this series discussed the requirements of Firefly, a new 2D chemical structure editor for the Web. Another article discussed [Firefly's design constraints](http://depth-first.com/articles/2007/04/18/a-2d-chemical-structure-editor-for-the-web-embracing-constraints-in-firefly) and the importance of embracing them. Why so much focus on a structure editor? Simply put, the structure editor is the [key link between chemistry and cheminformatics](http://depth-first.com/articles/2007/04/16/the-structure-editor-forgotten-link-between-chemistry-and-cheminformatics). Without the structure editor, there would be no audience for cheminformatics software.

So far the discussion has been rather abstract. To make it less so, the following four screenshots illustrate the user interface and rendering capabilities of a Firefly prototype. All molecules were drawn with the Firefly interface running on Linux. Screenshots were directly captured from the running application.

# Cholesterol

The image below illustrates fused rings and stereo atoms. Also notice that the atom label for oxygen has one implicit hydrogen atom that is properly placed to the left.

![Cholesterol](/images/posts/20070502/cholesterol.png "Cholesterol")

# Doxorubicin

This image illustrates both atom labels and aromatic bonding. Notice the improperly-placed quinone double bond. Refining Firefly's aromaticity perception is currently a top priority.

![Doxorubicen](/images/posts/20070502/doxorubicen.png "Doxorubicen")

# Flunoxaprofen

Firefly comes complete with a developer-overridable atom coloring scheme. Also notice the correct length of the internal carbon-nitrogen double bond line.

![Flunoxaprofen](/images/posts/20070502/flunoxaprofen.png "Flunaxaprofen")

# Uric Acid

One of the more difficult aspects of rendering molecules with implicit hydrogens is placing them in the correct quandrant. In this screenshot of uric acid, notice how the hydrogens occupy three different quadrants relative to their hosting nitrogen atoms. 

![Uric Acid](/images/posts/20070502/uric_acid.png "Uric Acid")