---
title: "Buggotea: The Problem with Abundance"
published: "2007-06-15T00:00:00.000Z"
---

Although [I still don't use](/articles/2007/03/22/why-i-still-dont-use-connotea) it yet, [Connotea](http://connotea.org) is a very useful service for many scientists. Combining aspects of social networking and bibliography management, Connotea offers a glimpse at some of the vast potential for Web 2.0 in the sciences. But the service is not without its thorny technical problems, one of which is discussed in this article.

For those unfamiliar with the service, Connotea lets you organize and share hyperlinks. This, in itself, is nothing remarkable. Many services such as [Digg](http://digg.com), [del.icio.us](http://del.icio.us/), and [Reddit](http://reddit.com/) offer similar capability.

What's unique about Connotea is its emphasis on bookmarking scientific and scholarly content. By taking advantage of the [CrossRef](http://www.crossref.org/) service built on top of the [DOI](http://doi.org/) system, Connotea makes creating a bibliographical reference to a paper as easy as entering a short alphanumeric sequence found on the document itself.

As long as all Connotea users work with DOIs, there is no problem. The DOI organization ensures that every document with a DOI can be accessed via a single, immutable URL. For example, if a paper has a DOI of "10.1021/ol015948s", then the document can be accessed through [this link](http://dx.doi.org/10.1021/ol015948s).

But what happens if a Connotea user either doesn't know about DOI or for some reason prefers not to use it? Instead, they'd rather work with a [publisher's URL](http://pubs.acs.org/cgi-bin/abstract.cgi/orlef7/2001/3/i11/abs/ol015948s.html) directly. This is not as unlikely as it may seem at first. For example, Connotea fails to recognize the title of many ACS papers when they are entered as DOIs, but does recognize them as direct abstract links.

PubMed offers still more ways to refer to the same document. To name a few:

-  [Abstract](http://www.ncbi.nlm.nih.gov/sites/entrez?cmd=Retrieve&db=pubmed&dopt=Abstract&list_uids=11405701)
-  [Abstract Plus](http://www.ncbi.nlm.nih.gov/sites/entrez?cmd=Retrieve&db=pubmed&dopt=AbstractPlus&list_uids=11405701)
-  [Citation](http://www.ncbi.nlm.nih.gov/sites/entrez?cmd=Retrieve&db=pubmed&dopt=Citation&list_uids=11405701)

Without really trying, we've found no fewer than five different URLs that all refer to the same scientific work. If you look under [my user profile](http://www.connotea.org/user/rapodaca), you'll see that Connotea is happy to add all of these references as separate entities. This means that each will receive its own set of tags and its own summary page. If my collection of links grows to a few hundred, I may not realize that I actually have two or three links to the same paper in my collection. And other Connotea users may fail to see my papers because they're using a URL that differs from mine.

After researching this problem a bit, I found that although it doesn't seem to have an immediate solution, at least it has a name: [Buggotea](http://www.nodalpoint.org/2006/12/15/buggotea_redundant_links_in_connotea). It bears a remarkable similarity to the "unique" SMILES problem, which was a major motivation for the development of [InChI](http://www.iupac.org/inchi/).

It wasn't long ago that the ability to access the scientific literature online seemed far-fetched. Today, the Internet as become the only scientific publication medium that matters. This has created a variety of new problems - and [opportunities](/articles/2007/02/14/whats-broken-in-cheminformatics) to solve them.


