---
title: Why the Web Isn't Ready for Chemistry
published: "2007-03-05T00:00:00.000Z"
---

Wouldn't it be wonderful if chemical structure searching were as easy as using Google? Draw your molecule, press a button and get the good stuff first. That day may well arrive, but without the creation of some key technologies, the wait will be very long. This article describes an unsuccessful attempt to bring the chemically-aware Web closer to reality.

Recently, I [introduced](/articles/2007/02/28/googling-for-molecules-new-and-improved-inchimatic) a small Web application called [InChIMatic](http://inchimatic.com). It lets you draw a structure and search for it though one of a number of popular search engines.

InChIMatic turns a molecular query into text, which is then searched. This magic is made possible through the [IUPAC International Chemical Identifier](http://en.wikipedia.org/wiki/International_Chemical_Identifier) (InChI). InChI has enormous potential for enabling chemical Web searches, but several barriers must be overcome first.

For example, if you run even the most trivial of queries with [InChIMatic](http://inchimatic.com), you'll quickly see that search engines have only indexed a small number of InChIs. One reason is that InChIs are not yet widely-used by Web authors. But the deeper problem is that many pages containing InChIs are not indexed by search engines. For example, [PubChem's](http://pubchem.ncbi.nlm.nih.gov/) vast collection of InChIs is apparently invisible to Google.

Compounding the problems of using InChIs to index chemical content on the Web is the lack of a standard, unobtrusive method for embedding the identifier into Web pages. Understandably, no author wants to invest valuable time and effort on an indexing system that doesn't work with their content and page layout. This problem is the subject of the current article.

# Materials and Methods

The [InChIMatic article](/articles/2007/02/28/googling-for-molecules-new-and-improved-inchimatic) contained a test for how well Google and "invisible" InChIs might work together. If you mouse over the word "1-bromonaphthalene" in the first paragraph of that article, you'll see a small popup window containing the InChI. I accomplished this effect with the following HTML:

```html
<span title="InChI=1/C10H7Br/c11-10-7-3-5-8-4-1-2-6-9(8)10/h1-7H">
  1-bromonaphthalene
</span>
```

My goal wasn't the popup effect. Instead, I wanted to test the <code>title</code> attribute as an unobtrusive vector for getting InChIs indexed by Google. This excellent idea was [a suggestion](https://www2.blogger.com/comment.g?blogID=17889588&postID=9068626890097011632) made by Oliver Koepler in response to [Egon Willighagen's](http://chem-bla-ics.blogspot.com/) article on [invisible InChIs](http://chem-bla-ics.blogspot.com/2007/02/invisible-inchis.html).

The idea is simple: InChIs are to be read by machines, not humans. InChIs consist of long strings of text that contain no widely-recognized wrappable characters. As a result, displaying InChIs in Web pages can break page layouts. Even if a wrapping mechanism is used, such as with the <code>overflow</code> attribute, I find InChIs unpleasant to look at and just plain distracting. There's [no good reason](/articles/2006/09/13/the-chemically-aware-web-are-we-there-yet) why any chemist should have to look at them.

Chemists themselves are, understandably, [reluctant](http://kinasepro.wordpress.com/2006/12/05/monday-night-ot-2/) to invest in ad hoc methods to index their molecular content - they need a real solution. It needs to be simple, it needs to be robust, it needs to be easy to apply retroactively, and it needs to be ready today.

# Results

After about two days, Google had indexed [the article](/articles/2007/02/28/googling-for-molecules-new-and-improved-inchimatic) containing the hidden InChI for 1-bromonaphthalene. Using InchIMatic, I [searched Google](http://www.google.com/search?q=%22InChI%3D1%2FC10H7Br%2Fc11-10-7-3-5-8-4-1-2-6-9%288%2910%2Fh1-7H%22) for the InChI, but only found the same [NMRShiftDB](http://nmrshiftdb.org) item returned in previous queries.

A few days later, a new Depth-First link appeared in Google. It pointed to the main XML Atom feed for Depth-First. This is a step in the right direction, but a far cry from the solution chemists need.

None of the other major search engines supported by InChIMatic returned a link to the Depth-First article containing the hidden InChI. The only new result was retrieved by [Search.com](http://search.com). Like Google's result, this new link pointed to Depth-First's main XML feed.

# Conclusions

Google doesn't index the contents of the <code>title</code> attribute and may never do so. This should not be surprising. Google has made a fortune in part by staying [one step ahead of Search Engine Optimization (SEO) tricksters](/articles/2007/02/28/inchi-spam). By ignoring the contents of the <code>title</code> attribute, Google and other search engines eliminate a real threat that could corrupt the search results that drive their business.

What about other methods for concealing InChIs? One study suggests that none of them will work, either. [A two-year old experiment](http://www.youcansleepwhenyouredead.com/archives/2004/12/testing_search_1.html) on SEO techniques compared ten different methods to conceal a text string from human viewers. Methods ranged from applying the <code>display:none</code> attribute, to using matched font and background color, to concealing the text in a hidden frame. Although some of these methods may have initially been successful in getting content into Google, none of them work now.

[KinasePro](http://kinasepro.wordpress.com/) recently described a [failed attempt](http://kinasepro.wordpress.com/2006/12/12/monday-night-ot-3/) to get Google to index a SMILES string hidden in the <code>alt</code> attribute of the <code>img</code> element. Although [Technorati](http://technorati.com) did index this content, a [Technorati search](http://www.technorati.com/search/InChI%3D1%2FC10H7Br%2Fc11-10-7-3-5-8-4-1-2-6-9%288%2910%2Fh1-7H) for the 1-bromonaphthalene InChI returned no hits. [A Technorati search](http://www.technorati.com/search/inchimatic) for the article containing the hidden InChI did work, suggesting that Technorati also ignores the <code>title</code> attribute.

# Why it Matters

Google and other search engines are in a perpetual state of war with SEO tricksters, and rightly so. At stake are search results that make up some of most valuable intellectual property in the world. Any attempt to make InChIs appear invisible to humans is likely to be interpreted by major search engines as spam and treated accordingly. It seems very unlikely that this stance will ever change, regardless of how legitimate the motivation might be.

This leaves us with the fundamental problem of how to build a workable, Web-based chemical indexing system. The CAS registry system has served chemistry as the de facto standard for decades, but for a variety of reasons it is unworkable as an open technology for the Web. The more modern approach of combining InChI and standard search engines has major limitations, as outlined in this article.

If anything in cheminformatics is [broken](/articles/2007/02/14/whats-broken-in-cheminformatics), it's the indexing and retrieval of molecular information on the Web. For those interested in solving a tough problem that really matters, this is a golden opportunity.

