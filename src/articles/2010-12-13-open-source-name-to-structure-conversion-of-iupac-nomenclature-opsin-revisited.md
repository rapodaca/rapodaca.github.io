---
title: Open Source Name To Structure Conversion of IUPAC Nomenclature - OPSIN Revisited
published: "2010-12-13T00:00:00.000Z"
---

Way back in 2006, I [took a look at OPSIN](/articles/2006/10/14/decoding-iupac-names-with-opsin/), an open source IUPAC nomenclature parser. Some good things have been happening with OPSIN, and I thought it was worth taking another look at this software. This article, the first in a series, will show how you can start using OPSIN right now through a convenient Web interface.

# The OPSIN Web Interface

[The OPSIN Web interface](http://opsin.ch.cam.ac.uk/) lets you easily test the scope and limitations of nomenclature parsing. Simply enter any IUPAC name and it returns the InChI and a 2-D chemical structure image.

In my previous work with OPSIN, one area I found lacking was the parsing of fused heterocycle names. Heterocycles play a central role in the chemical patent literature, particularly in pharmaceuticals. To work with patents as a [large-scale, free corpus of chemical information](/articles/2010/06/03/gigabytes-of-chemical-information---now-free-for-download/) requires robust interpretation of heterocycle nomenclature.

A convenient source of heterocycle names with locants and correct structure assignments is IUPAC's [NOMENCLATURE OF FUSED AND BRIDGED FUSED RING SYSTEMS](http://www.iupac.org/publications/pac/1998/pdf/7001x0143.pdf). Picking a few examples at random reveals a stunning level of accuracy and scope:

pyrano\[2',3':4,5\]cyclohepta\[1,2-g\]quinoline (Page 148):

![Figure](/images/posts/opsin-1/example-1.png "Figure")

2H-furo[2,3-d][1,3]dioxole (Page 157):

![Example](/images/posts/opsin-1/example-2.png "Example")

diquinolizino[3,4,5,6,7-defg:3',4',5',6',7'-klmn]phenazine (Page 183):

![Example](/images/posts/opsin-1/example-3.png "Example")

2H-[1,2]oxazolo[5,4-c][1,3]oxazolo[3,2-a]pyridine (Page 168):

![Example](/images/posts/opsin-1/example-4.png "Example")

OPSIN even seems to be getting substituent locants correct, as in 3-ethyl-1H-imidazo[5,1-c][1,2,4]triazole (Page 174):

![Example](/images/posts/opsin-1/example-5.png "Example")

Of course, there's more to OPSIN than just parsing heterocycle names. [OPSIN is capable of handling a wide range of IUPAC nomenclature](/articles/2006/10/17/from-iupac-nomenclature-to-2-d-structures-with-opsin/), as was outlined in an earlier article.

# Failures

I did run into a couple of failures in parsing heterocycle nomenclature. For example, 6H-1,7-dioxacyclopenta[cd]indene (Page 204) failed to generate a structure. There were other examples as well, but at least 80% of the heterocycle frameworks I checked could be parsed accurately by OPSIN.

# OPSIN is Open

Failure to parse is an extremely important condition. Imagine you're processing a body of work (a group of patents or dissertations, for example) and you consistently hit a problem processing a particular kind of structure name. If OPSIN were a closed-source product, your only option would be to contact the vendor and hope that producing a patch fits with their priorities - and then wait.

OPSIN is open source, meaning that you can dive into the code and fix what needs to be fixed. If you decide to contribute your changes back to the OPSIN team, then OPSIN has the potential to handle more and more edge cases gracefully.

The next article in this series will show how to set up an environment that will make it possible for you to get OPSIN to handle the names it doesn't yet handle, and make those changes available to the OPSIN community.