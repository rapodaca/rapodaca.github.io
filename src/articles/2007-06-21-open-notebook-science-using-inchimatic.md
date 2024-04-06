---
title: Open Notebook Science Using InChIMatic
published: "2007-06-21T00:00:00.000Z"
---

Have you ever wanted to find a molecule on the Web using your favorite search engine in combination with a 2-D structure editor? [InChIMatic](http://inchimatic.com) is a service that lets you do just that. In this article, I'll show how InChIMatic can be used to look up molecules in the [UsefulChem-Molecules](http://usefulchem-molecules.blogspot.com/) blog.

For those who aren't familiar with it, [UsefulChem-Molecules](http://usefulchem-molecules.blogspot.com/) is a blog operated by [Jean-Claude Bradly's](http://usefulchem.blogspot.com/) research group at Drexel University that publicly archives molecules of interest. Each entry is a single molecule that may be linked to other Web resources.

Let's say you wanted to look up [dithranol](http://pubchem.ncbi.nlm.nih.gov/summary/summary.cgi?cid=2202). This can be done by simply pointing your browser to [inchimatic.com](http://inchimatic.com) and drawing the structure:

![Screenshot](/images/posts/20070621/screenshot.png "Screenshot")

When you're finished, select your search engine of choice (we'll use Google here) and press "Search". You'll be taken to the familiar results page. The second result links to the UsefulChem-Molecules [entry for dithranol](http://usefulchem-molecules.blogspot.com/2007/04/uc0234.html).

![Screenshot](/images/posts/20070621/screenshot2.png "Screenshot")

In performing this simple workflow, I noticed areas for improvement in both UsefulChem and InChIMatic:

-  **UsefulChem** If you look at the [entry for dithranol](http://usefulchem-molecules.blogspot.com/2007/04/uc0234.html), you'll notice there are no linkouts. In essence, the entry is a bookmark without context. Although it's useful to know that the Bradly group is interested in this molecule, it would be even more interesting to know in what context. Each entry should contain at least one link giving the molecule a context.
-  **InChIMatic** Using the back button on the Google results page takes you back to InChIMatic, but your molecule is gone. If you wanted to look for a series of related molecules, you couldn't edit your existing structure. As [Firefly 1.0](/articles/2007/05/02/a-chemical-structure-editor-for-the-web-four-screenshots-of-a-firefly-prototype) nears completion, a top priority will be to incorporate it into InChIMatic and fix the back-button problem.

As you can see, between InChIMatic and UsefulChem-Molecules, we have the makings of a crude laboratory information management system. The problem is we're trying to use existing tools (search engines and blogs) for purposes they are ill-suited for. It can work, but it could also work much better.

What chemistry really needs is open, user-friendly systems specifically designed to archive and search chemical information of the type maintained by the Bradly group. But that's a story for another time.