---
title: Simple CAS Number Lookup with PubChem
published: "2007-05-21T00:00:00.000Z"
---

[CAS Registry Numbers](http://metamolecular.com/cheminformatics/what-is-a-cas-number/) simplify the thorny problem of referring to chemical substances. These short numerical sequences are arguably the most widely-used form of molecular identifier, appearing on reagent bottles, in publications, in patents and patent applications, and MSDS sheets.

During my time as a synthetic organic chemist, I would sometimes run into the problem of finding the structure of a molecule represented by a CAS number. A common case was when an ambiguous, incomprehensible, or blurred IUPAC name was printed on a reagent bottle along with a CAS number. By looking up the CAS number, I could confirm the bottle's contents.

Your first impulse when looking up a CAS number might be to fire up [SciFinder](http://www.cas.org/SCIFINDER/). For years this was the only option. Those days are quickly starting to seem as quaint as when people actually wrote on pieces of paper and dropped them in mailboxes ([dropping DVDs in a mailbox](http://netflix.com) is a different matter).

A little-publicized feature of PubChem makes it an ideal way to quickly find the structure associated with a CAS Number. To use it, you need nothing more than a computer, a browser, and an internet connection.

Browse over to the [PubChem](http://pubchem.ncbi.nlm.nih.gov/) welcome page. At the top you'll find a search box. Enter your CAS number and press "Go." For this example, I'm using the CAS number for 2,5-Pyrazinedicarboxylic acid dihydrate:

![Screenshot](/images/posts/20070521/screenshot.png "Screenshot")

If all goes well, you should see a results screen containing the structure of your compound and a link to its summary page:

![Screenshot](/images/posts/20070521/screenshot2.png "Screenshot")

Does this seem a little too good to be true? Try it for yourself. Pick up a copy of the Aldrich catalog, Merck index, or anything else that lists lots of CAS numbers. Choose several structures at random and see how PubChem performs.

There are limitations to this method. PubChem generally doesn't index large molecules such as polymers and peptides, so they won't be found by this method. Similarly, if a CAS number doesn't point to a distinct molecular entity (e.g. "mineral oil"), PubChem won't find it either. But these are hardly limitations in the vast majority of cases.

With the [recent addition of Sigma-Aldrich](http://www.corporate-ir.net/ireye/ir_site.zhtml?ticker=SIAL&script=410&layout=-6&item_id=984368) as a PubChem compound supplier, it won't be long before smaller companies begin following suit. What we're seeing with PubChem is a classic example of a [network effect](http://en.wikipedia.org/wiki/Network_effect). The end result should come as a surprise to nobody.

*Update: [Chempedia](http://chempedia.com) offers a more detailed [CAS Number Lookup](http://depth-first.com/articles/2008/05/26/simple-cas-number-lookup-and-more-with-chempedia) service.*