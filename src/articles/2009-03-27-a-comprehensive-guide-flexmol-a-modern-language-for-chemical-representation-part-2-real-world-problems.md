---
title: "A Comprehensive Guide FlexMol, A Modern Language for Chemical Representation Part 2: Real-World Problems"
published: "2009-03-27T00:00:00.000Z"
---

The [last installment](http://depth-first.com/articles/2009/03/19/a-comprehensive-guide-flexmol-a-modern-language-for-chemical-representation-part-1-outlining-the-problem) in this series discussed the limitations in today's molecular languages and how FlexMol is designed to overcome them. Although these limitations are clearly present theoretically, what's the practical effect likely to be?

For the last two years, a series of articles highlighting specific examples from the current chemical literature have appeared here. Variously titled "How would your cheminformatics tool do this?", "Can your cheminformatics tool to this?", and "Cheminformatics Puzzler", each entry featured an article from a mainstream chemistry journal in which SMILES, Molfile, CML, and/or InChI would be incapable of faithfully representing a centerpiece structure. The examples are taken from well-read journals in synthetic organic, natural products, and medicinal chemistry.

The purpose was not to bash these languages, but rather point to an important common set of limitations among them - a kind of groupthink if you will. As mentioned before, this may not be a problem at all for the work you're currently doing. But given the rapid exploration by chemists of areas in which cheminformatics' standard simplifying assumptions don't apply, it's possible you'll need a solution sooner than you might think.

The remainder of this article groups these examples by topic.

# Axial Chirality

The literature is replete with examples of axial chirality. None of the molecular languages in common use today can represent this form of chirality. The examples below are but a small selection.

[![Abstract](/images/posts/20070405/abstract.gif "Abstract")](http://dx.doi.org/10.1021/jo0700427)

This example does double-duty as an example of planar chirality.

[![Abstract](/images/posts/20070216/abstract.gif "Abstract")](http://dx.doi.org/10.1021/jm061093j)

*Note: both structures are actually identical - a typographical error*

[![Abstract](/images/posts/20070613/allenes.gif "Abstract")](http://dx.doi.org/10.1021/ol070936d)

[![Abstract](/images/posts/20071002/binol.png "Abstract")](http://dx.doi.org/10.1021/ol071276f)

[![Abstract](/images/posts/20071105/abstract.png "Abstract")](http://dx.doi.org/10.1021/np070337f)

[![Abstract](/images/posts/20071108/abstract.png)](http://dx.doi.org/10.1021/jo701764e)

[![Abstract](/images/posts/20071123/abstract.png)](http://dx.doi.org/10.1021/np070269x)

[![Abstract](/images/posts/20071217/abstract.png)](http://dx.doi.org/10.1016/j.tetlet.2007.09.079)

[![Abstract](/images/posts/20080118/abstract.png)](http://dx.doi.org/10.1021/ol702783v)

[![Abstract](/images/posts/20080205/abstract.png)](http://dx.doi.org/10.1021/ol702952n)

[![Abstract](/images/posts/20080217/abstract.png)](http://dx.doi.org/10.1021/jo702502n)

# Other Forms of Atropisomerism

[![Abstract](/images/posts/20080320/abstract.png)](http://dx.doi.org/10.1002/anie.200705660)

# Planar Chirality

[![Abstract](/images/posts/20080501/abstract.png)](http://dx.doi.org/10.1021/jo800468x)

# Nonstandard Stereocenters

[![Abstract](/images/posts/20071030/abstract.png)](http://dx.doi.org/10.1021/jm070740j)

[![Abstract](/images/posts/20080125/abstract.png)](http://dx.doi.org/10.1021/jo048641q)

# Multicenter Bonding

Once the domain of organometallics chemists, these molecules are making their way into a variety of other applications.

[![Abstract](/images/posts/20071011/abstract.png)](http://dx.doi.org/10.1021/jo0712704)

[![Abstract](/images/posts/20071017/abstract.png)](http://dx.doi.org/10.1021/ol7020143)

[![Abstract](/images/posts/20071101/abstract.png)](http://dx.doi.org/10.1021/jo7014104)

[![Abstract](/images/posts/20071129/abstract.png)](http://dx.doi.org/10.1021/ol702430a)

[![Abstract](/images/posts/20071130/abstract.png)](http://dx.doi.org/10.1021/ol702519f)

[![Abstract](/images/posts/20071205/abstract.png)](http://dx.doi.org/10.1021/ol702541y)

[![Abstract](/images/posts/20071211/abstract.png)](http://dx.doi.org/10.1016/j.tetlet.2007.10.066)

[![Abstract](/images/posts/20080110/abstract.png)](http://dx.doi.org/10.1016/j.tetlet.2007.11.161)