---
title: "How to Find Chemical Information on the Internet: Why Open Source, Open Access, and Open Data Matter"
published: "2007-01-26T00:00:00.000Z"
---

The Web may be the most effective information-delivery platform ever created. Unfortunately, a variety of barriers, both technical and cultural, restrict the use of the Web for chemistry. In the last few years, three powerful forces for change have emerged: <a href="http://opensource.org/">Open Source</a>; <a href="http://en.wikipedia.org/wiki/Open_access">Open Access</a>; and <a href="http://en.wikipedia.org/wiki/Open_Data">Open Data</a>. Most of what's written on these subjects takes a theoretical angle that makes it difficult to visualize real benefits. In this article, I'll discuss these ideas from a much more practical perspective.

# A Thought Experiment

Try this simple thought experiment: using only a browser and the free Internet, find all Web pages pages that have anything scientifically-relevant to say about your favorite molecule. How would you do it?

# It's Trivial

If you were lucky enough to have chosen a molecule with a trivial name such as 'caffeine', you could just try <a href="http://www.google.com/search?hl=en&amp;q=caffeine&amp;btnG=Google+Search">Google</a>. Google's first result would link you to <a href="http://en.wikipedia.org/wiki/Caffeine">the Caffeine Wikipedia article</a>. Wikipedia is an evolving phenomenon that, according to some critics, will never have a place in scientific research. It may not be ready now, but reading the meticulously annotated and cross-referenced entry for caffeine should make anyone who would say "never" at least a little nervous. Many of the citations in Wikipedia's caffeine article point to the primary scientific literature through <a href="http://www.ncbi.nlm.nih.gov/entrez/query.fcgi?DB=pubmed">PubMed</a>.

The remainder of Google's top-50 results are general audience items unlikely to interest a scientist keeping his or her nose to the grindstone: companies that sell caffeinated products; a variety of FAQs; self-help medical articles; and of course, <a href="http://www.energyfiend.com/death-by-caffeine/">this one</a>. We shouldn't be surprised. In the eyes of a massive search engine like Google, chemistry is just one of many niche markets.

Adding terms to our Google search might produce more targeted results. For example, what if we wanted to find a proton NMR spectrum of caffeine? We could type "caffeine proton nmr" into Google. The first result <a href="http://cat.inist.fr/?aModele=afficheN&amp;cpsidt=16701620">links</a>, indirectly, to <a href="http://www.maik.rssi.ru/cgi-bin/search.pl?type=abstract&amp;name=physchem&amp;number=4&amp;year=5&amp;page=573">an article</a> in the subscription-only <a href="http://www.maik.rssi.ru/journals/physchem.htm">Russian Journal of Physical Chemistry A</a>. This does us no good because we have no subscription, limited funds, and no access to the journal at a library. The <a href="http://joi.jlc.jst.go.jp/JST.JSTAGE/analsci/19.1079?from=Google">second link</a> is a direct hit: the proton NMR spectrum of caffeine in water-formic acid. Significantly, the information is contained in a peer-reviewed article (<a href="http://dx.doi.org/10.2116/analsci.19.1079">DOI</a>) published by the Japanese <a href="http://en.wikipedia.org/wiki/Open_access">Open Access</a> journal, <a href="http://www.jsac.or.jp/cgi-bin/analsci/toc/">Analytical Sciences</a>. The fact that <em>Analytical Sciences</em> is an Open Access journal has made a world of difference in our search.

Although this might seem like the perfect solution, recall that the goal of the experiment was to locate <em>all</em> scientifically-relevant online content relating to the molecule. The technique we just used is most likely to succeed when we want specific information about molecules with a single trivial name. Even then, many resources may not cite a trivial name at all.

# The Real World

Our options are even more limited when it comes to comprehensively text-searching even the simplest molecules lacking a widely-used trivial name. For example, consider the molecule represented by the systematic name '3-phenyl-2-methylpropene.'

![Example](/images/posts/20070126/example.png "Example")

If we were using a proprietary system such those offered by <a href="http://www.cas.org/">Chemical Abstracts Services</a> (CAS), we could simply enter the structure into a client and read off our results. This works because CAS isn't matching text when a query is submitted. Instead, it's matching molecular structures that have previously been encoded by both humans and machines.

The minute we step out of the orderly system created by CAS and into the chaos of the Internet, we confront a thorny problem. In practice, there are only two widely-used methods to convert a molecular structure diagram into a form that can be text-searched, and each has major limitations:

- **IUPAC Nomenclature** This method has the advantage of being Open. It suffers from the complexity of its encoding rules, resulting in a variety of nonstandard implementations. As a result, it's possible to find multiple phrasings of the same IUPAC name, reducing its use as a unique identifier.
- **CAS Numbers** This method replaces a standard encoding system with a central registration authority. The advantages are that the <em>representation</em> of the identifier itself is unambiguous. Conversely, the <em>meaning</em> of a CAS Number can only be known by referring to a registration authority. Unfortunately, the <a href="http://info.cas.org/infopolicy.html">current business model</a> for CAS is based on <em>restricting</em> information flow, rather than promoting it.

# Search by IUPAC Name

Let's try searching Google for IUPAC nomenclature. Entering '<a href="http://www.google.com/search?hl=en&amp;q=3-phenyl-2-methylpropene&amp;btnG=Google+Search">3-phenyl-2-methylpropene</a>' produces a results page containing three unique entries. One of them <a href="http://lb.chemie.uni-hamburg.de/static/data/81_rckntdu1.html">links</a> to a <a href="http://lb.chemie.uni-hamburg.de/static/">database</a> run from the University of Hamburg. I gather the purpose of this database, which I was unaware of before doing this search, is to link to <a href="http://www.springer.com/west/home/laboe?SGWID=4-10113-0-0-0">Landolt-B&#246;rnstein Online</a>, a collection of numerical data. Interestingly, a search for data on a single compound turned into the discovery of <a href="http://depth-first.com/articles/2007/01/24/thirty-two-free-chemistry-databases">yet another free chemistry database</a>.

The remaining hits from the Google search linked to two pages (<a href="http://pubs.acs.org/cgi-bin/abstract.cgi/joceah/1982/47/i06/f-pdf/f_jo00345a032.pdf?sessid=6006l3">pdf</a>, <a href="http://pubs.acs.org/cgi-bin/abstract.cgi/jacsat/1962/84/i09/f-pdf/f_ja00868a019.pdf?sessid=6006l3">pdf</a>) from ACS journals. The ACS routinely makes the first page of its articles a free download. It's interesting to note that these were the <em>only</em> ACS hits returned by Google.

We've exhausted the possibilities with our chosen IUPAC name and Google. But before moving on to searching by CAS Number, we need to solve a problem. How do we get the CAS number for our compound?

# Finding a CAS Number: A PubChem Detour

Concisely summarizing what PubChem does can be difficult because different users will emphasize different aspects of its design. For our purposes, PubChem probably contains a Web page describing the compound we've been researching, and on that page may be a CAS number.

Submitting our molecule to <a href="http://pubchem.ncbi.nlm.nih.gov/search/">PubChem's search page</a> produces <a href="http://pubchem.ncbi.nlm.nih.gov/summary/summary.cgi?cid=18687">one result</a>. Fortunately, this page lists our compound's CAS number: 3290-53-7.

# Search by CAS Number

Submitting our CAS number to Google produces sixteen results. The first two link to the Landolt-B&#246;rnstein pages. The next result <a href="http://www.alfa.com/Alf/Product%20Indexes/Alfa_Complete/M20_idx.html">links to</a> a product listing page for a chemical supplier.

The fourth result <a href="http://www.orgsyn.org/orgsyn/prep.asp?prep=cv5p0471">links to</a> a far more interesting page - the <a href="http://www.orgsyn.org/"><em>Organic Syntheses</em></a> website. Fortunately for us, <em>Organic Syntheses</em> makes its contents freely available online. Following the link takes us to a preparation in which one of the reagents can be substituted with our molecule of interest. Further down in this page, we can see that this molecule has been further <a href="http://www.orgsyn.org/orgsyn/chemname.asp?nameID=41708">cross-referenced</a>. Two procedures are listed, <a href="http://www.orgsyn.org/orgsyn/prep.asp?prep=cv6p0722">one of which</a> is new to us. Following the link, we find a complete synthetic procedure with full characterization and primary literature citations. Jackpot.

<em>Organic Syntheses</em> permits free public access, but is it <a href="http://en.wikipedia.org/wiki/Open_access">Open Access</a>? Many would say not, due to the fact that it retains full copyright to its works and doesn't permit free redistribution. The distinction mainly matters to those seeking to create <a href="http://en.wikipedia.org/wiki/Open_Data">Open Data</a> repositories based on the contents of periodicals such as <em>Organic Syntheses</em>. To an end user, however, the distinction matters little in the short run.

The remaining results from our Google search are interesting, but mainly consist of chemical supplier catalogs. It should, however, be noted that **all of the results** returned by a Google search of our CAS number **were relevant** to our molecule of interest.

# InChI

In an effort to overcome the limitations of CAS Registry Numbers and IUPAC systematic nomenclature as unique molecular identifiers, a new system has recently been introduced, the <a href="http://www.iupac.org/inchi/">IUPAC International Chemical Identifier</a> (InChI). In contrast to a CAS number, an InChI can be assigned independently of a central authority. Like systematic nomenclature, an InChI can be <a href="http://depth-first.com/articles/2006/09/26/looking-at-inchis">decoded to a molecular representation</a>. Unlike IUPAC systematic nomenclature, an InChI is generated by a <a href="http://depth-first.com/articles/2006/08/12/inchi-canonicalization-algorithm">computer algorithm</a> far too complicated for human use. The developers of the InChI software have released their work under an <a href="http://www.opensource.org/">Open Source</a> license, promoting its widespread use by ensuring that services like PubChem will have no difficulties integrating InChI with their software infrastructures. Unlike either CAS Numbers or IUPAC names, InChIs are not yet in widespread use, a point which currently limits their utility.

The PubChem page for our search molecule listed an InChI, as do all PubChem Compound Summary pages. As shown by <a href="http://video.google.com/videoplay?docid=-6653695245776470969">Peter Murray-Rust and others</a>, it is perfectly feasible to use Google to search for InChIs. Let's try.

Submitting our <a href="http://www.google.com/search?hl=en&amp;lr=&amp;q=InChI%3D1%2FC10H12%2Fc1-9%282%298-10-6-4-3-5-7-10%2Fh3-7H%2C1%2C8H2%2C2H3&amp;btnG=Search">InChI query to Google</a> gives no results. Leaving off the leading 'InChI=' text, <a href="http://video.google.com/videoplay?docid=-6653695245776470969">as briefly mentioned here</a>, also results in no hits. This tells us that Google has found no instances of our InChI, and that Google still does not crawl PubChem Compound Summary pages.

# Use a Free Database

Numerous free chemistry databases are now running on the Internet. For example, a recent article highlighted <a href="http://depth-first.com/articles/2007/01/24/thirty-two-free-chemistry-databases">thirty-two of them</a>. Would one of them be useful to our search? We need to ask ourselves if we really want to perform more than thirty individual searches. What if we were looking for data on several molecules? Nothing would prevent us from doing this in theory, but in practice, this is too much work.

What we'd really like is to submit a structure query to a single service that will query all of these free databases for us. While such services do exist in name, their breadth is restricted. A more comprehensive solution would be very helpful indeed.

# Conclusions

The Web's convenience and ubiquity have prompted many calls for greater Web accessibility to public chemical information. As hinted at by the examples in this article, Open Source, Open Data, and Open Access are three interrelated forces that can make this vision a reality. Open Access journals lower the economic barriers to compiling Open Data sources. Making these Open Data sources useful to scientists in a cost-effective way requires Open Source software. The availability of good Open Source software stimulates the creative combination of Open Data sources. And so on.

A lot needs to be done before this positive feedback loop can replace the status quo. But even with the chaotic, balkanized system that now exists, the benefits are plain to see. With even a small amount of coordination among Open Source software developers, Open Data providers, and scientific publishers, the most amazing things could happen.