---
title: "The Structure Editor: (Forgotten) Link Between Chemistry and Cheminformatics"
published: "2007-04-16T00:00:00.000Z"
---

Of the many cheminformatics technologies developed over the last fifty years, which ones can no bench chemist function without today? There are many possibilities to choose from: molecular databases, fast substructure searching, the SD/Molfile format, SMILES and other line notations, a variety of molecular descriptors and in silico property calculations, and QSAR, to name a few. Throw in molecular modeling and 3-D visualization if you'd like.

I would propose that the lowly structure editor is more important to the daily activities of most chemists than any of these other technologies combined. Try this experiment: ask some practicing bench chemists what application you absolutely couldn't take away from them. More likely than not, the answer will either be a structure editor ([ChemDraw](http://www.cambridgesoft.com/software/ChemDraw/)) or something that intensively uses one ([SciFinder](http://www.cas.org/support/scifi/index.html)).

No other kind of software gets as much "face time" with chemists as a 2D structure editor. This means that the user experience with the editor plays a disproportionate role in forming opinions about the application as a whole. In other words: if you make your editor suck a little bit less, your whole application will seem to suck a lot less.

Structure editors play a pivotal role in the end user experience. Strangely, understanding what makes a good structure editor, and putting this knowledge into practice, has not been given the time and effort it deserves. There have been plenty of [attempts to build better editors](/articles/2006/08/21/four-free-2-d-structure-editors-for-web-applications), but very little analysis of the user experience with them.

In the series of articles to follow, I'll describe the design of a new 2D structure editor. Codenamed "Firefly", its purpose is to make the drawing of 2D chemical structures as intuitive and easy as it can be, and to do so seamlessly on the cheminformatics platform of the future - the Internet.