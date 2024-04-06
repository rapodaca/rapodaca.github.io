---
title: "Simple CAS Number Lookup (and More) with Chempedia"
published: "2008-05-26T00:00:00.000Z"
---

Despite many ingenious and energetic attempts, CAS Registry Numbers&reg; remain chemistry's only universal method for referencing chemical structures and substances. They're so woven into the fabric of chemistry and trade that the [US Patent and Trademark Office discusses them](http://www.uspto.gov/main/profiles/otherid.htm) in the same context as Domain Names, Drivers License Numbers, ZIP Codes, and UPC Barcodes. But for all of the system's advantages, it suffers from a significant limitation: without access to the CAS Registry database, it can be difficult if not impossible to link a chemical structure with a CAS Number. This article discusses a unique approach to this problem.

# Finding CAS Numbers on Chempedia

Let's say you've found the CAS Number **\[58-08-2\]** and needed to look up the chemical structure it refers to. How would you do it?

We can use [Chempedia](http://chempedia.com) to find the answer. Entering "58-08-2" into the [text query](http://chempedia.com/queries/new) box takes us to the corresponding [Registry Number Summary](http://chempedia.com/registry_numbers/58-08-2).

Under the heading "Compound Monographs", this page tells us that one [Compound Monograph](http://chempedia.com/monographs/caffeine) referencing the CAS Number **\[58-08-2\]** exists. We can easily see that both the name and chemical structure are consistent with [Caffeine](http://chempedia.com/monographs/caffeine).

![Caffeine](/images/posts/20080526/caffeine.png "Caffeine")

However, the section under the heading "Compounds" gives us something unique. Rather than simply telling us that the structure of Caffeine is linked to CAS Number **\[58-08-2\]**, Chempedia tells us how it arrived at this conclusion. As you can see, there are over a dozen references matching CAS Number **\[58-08-2\]** with a single chemical structure.

More than that, Chempedia give us links to the organizations making these assertions and the actual Web pages recording them.

Rather than just giving the answer, Chempedia says how it found the answer.

# Authority, Confidence, and the Electronic Paper Trail

By definition, the only authority on CAS Registry Numbers is [Chemical Abstracts Service](http://www.cas.org/) itself. But for many, many organizations, full-time access to the CAS Registry database is hopelessly out of reach, and access of the form required to incorporate the CAS Registry system into third-party products is a non-starter.

In other words, there is a widespread need to work with CAS Numbers independently of the CAS Registry System, but any such attempt is inherently non-authoritative. How can we work within this constraint?

What's lacking is the concept of confidence.

To illustrate, let's try to find the structure associated with the CAS Number **\[480-41-1\]**. In contrast to our earlier search, this one takes us to a [summary page](http://chempedia.com/registry_numbers/480-41-1) with three different structures! (see below)

![480-41-1](/images/posts/20080526/naringenin.png "480-41-1")

Each of these three structures share the same connectivity, but different stereochemistry. The first structure (presumably) represents a racemate, the second represents the (*S*) enantiomer, and the third represents the (*R*) enantiomer.

At this point, we need to decide whether we've really found the structure for the CAS Number **\[480-41-1\]**. And we could use Chempedia's electronic paper trail to guide our thinking. Both the racemate and (*S*) enantiomer have five references linking structure and CAS number, whereas the (*R*) enantiomer only lists one.

We can also see that the racemate and and pure (*S*) enantiomer each are associated with yet another CAS Registry Number, [\[67604-48-2\]](http://chempedia.com/registry_numbers/67604-48-2). Examination of this record shows that two structures are cited, the same two structures we were originally considering.

Clearly, there's some confusion regarding the exact identity of the structure represented by CAS Number **\[480-41-1\]**. Nevertheless, we can guess that the Registry Numbers [\[67604-48-2\]](http://chempedia.com/registry_numbers/67604-48-2) and [\[480-41-1\]](http://chempedia.com/registry_numbers/480-41-1) refer to the racemate and (*S*) enantiomer of the flavinoid [Naringenin](http://chempedia.com/monographs/naringenin), although we don't know which is which.

For some applications this answer would be sufficient. For others, however, it wouldn't. The key point is that Chempedia has enabled us to arrive at this conclusion by exposing the electronic paper trail of third-party CAS Registry Number assignments.

Chempedia offers a way to debug CAS Registry Numbers.

Chempedia currently contains just over 380,000 unique CAS Numbers. To browse through the entire set, ten at a time, you can [begin with this page](http://chempedia.com/registry_numbers). Notice how [RESTful URLs](/articles/2007/05/30/restful-cheminformatics) are used throughout.

# Web 2.0 and All That

Those who have spent time using or developing "Web 2.0" applications may recognize a potentially powerful analogy between CAS Registry Numbers and the concept of [tagging](http://en.wikipedia.org/wiki/Tag_%28metadata%29). A tag is an alphanumeric string associated with some resource of interest, for example, [a photo](http://flickr.com/photos/tags/chemistry/clusters/), [a scientific paper](http://www.connotea.org/tag/chemistry), [a URL](http://del.icio.us/tag/chemistry), or a blog post.

Although originally designed to uniquely identify a chemical substance or structure, when used in the wild, CAS Registry Numbers sometimes more closely resemble the fuzzy semantics of tagging.

Chemical information system that use CAS Numbers processed by third parties need to take this reality into account or run the risk of misleading users. Chempedia offers one method for doing so.

# Conclusions

Chempedia currently contains just over 380,000 CAS registry numbers. Although this is a minuscule fraction of the total CAS Registry, Chempedia's collection comprises some of the most widely used and most important substances known. More importantly, Chempedia now offers a tool for understanding the often complex associations between chemical structure and CAS Registry numbers that exist in real-world chemical information sources.

In this sense, Chempedia could be a useful tool for small organizations to double check their CAS Number assignments and for individuals to quickly look up the chemical structure of a given CAS number and understand ambiguities.

Chempedia also lays bare both the confusion and consensus around CAS Registry Numbers used in the real world. If CAS Numbers in the wild are more like tags than unique identifiers, what can we do with this insight? Future articles will describe some possibilities.