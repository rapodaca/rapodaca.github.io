---
title: Building the Chemically-Aware Web - TotallySynthetic and InChIMatic
published: "2007-09-24T00:00:00.000Z"
---

Recent D-F articles have discussed InChIMatic, a Web application that lets you search the Web for chemical structures by simply drawing them. InChIMatic takes advantage of [InChI](http://www.iupac.org/inchi/), a system for representing molecular structures as a strings of text, and Google, which indexes these text strings. In this article, I'll show InChIMatic in action as it quickly finds a molecule discussed in a [review](http://totallysynthetic.com/blog/?p=762) of [Overman's Sarain A synthesis](http://dx.doi.org/10.1021/ja074300t) appearing in Paul Docherty's [TotallySynthetic blog](http://totallysynthetic.com/blog).

# You Can Skip this Step

The TotallySynthetic review lists three InChIs at the bottom, but which structures, out of the many discussed, do these represent? We need to know so that we can enter these structures into InChIMatic. This is, of course a step only needed because we're testing the system, not because we're using the system the way it was designed to be used.


A recent D-F article discussed a method for [converting InChIs into 2D structures](http://depth-first.com/articles/2007/09/06/from-inchi-to-image-with-ruby-open-babel-and-ruby-cdk) using Ruby. It has the advantage of being easily adaptable to building chemically-aware Web spiders. And it's 100% Open Source.

![First](/images/posts/20070924/first.png "First")
![Second](/images/posts/20070924/second.png "Second")
![Third](/images/posts/20070924/third.png "Third")

Running this library over TotallySynthetic's InChIs yields the three images above. Notice, we have some problems. The first and third images lack stereochemistry. The second has a trans- double bond instead of the cis- stereochemistry encoded by the InChI. There are good reasons for each of these problems, which I hope to address in later articles. For now, it's sufficient that we can clearly make the connection between the TotallySynthetic InChIs and structures in the Sarain A review.


# Run the Search

We can test this system by pointing our browser to [inchimatic.com](http://inchimatic.com). Entering one of the structures and clicking "Search" takes us directly to a link for the TotallySynthetic site, courtesy of Google. Unfortunately, the link doesn't currently point to [the article itself](http://totallysynthetic.com/blog/?p=762). This issue may resolve itself as the Googlebot continues to index the TotallySynthetic site.

![InChIMatic](/images/posts/20070924/inchimatic.png "InChIMatic")

# A Technical Note

If you spend any time working with InChIs, you'll notice that they're very long. So long, in fact, that they break many Web page layouts. There have been many attempts to [fix the long-InChI problem](http://depth-first.com/articles/2007/03/05/why-the-web-isnt-ready-for-chemistry), but Paul may have found the answer by trying the simplest thing that could possibly work.

If you inspect the HTML source for the TotallySynthetic article, you'll find that Paul has inserted hard returns (<code>br</code> elements) to manually break his InChIs, including <del>the one we just located with InChIMatic (first in the list)</del> the first and last structures above, both of which can be found with InChIMatic:

```html
<p><small>InChI=1/C29H33NO4Si/c1-5-32-28(31)26-25(34-27(30-26)22-15-9-6-10-16-22)21-33-35(29(2,3)4,23-17-11-7-12-18-23)24-19-13-8-14-20-24<br />
/h6-20,25-26H,5,21H2,1-4H3/t25-,26-/m0/s1 InChI=1/C18H25NO6S/c1-14-9-11-15(12-10-14)26(22,23)19(17(21)25-18(2,3)4)13-7-6-8-16(20)24-5/h6,8-12H,7,13H2,1-5H3/b8-6- InChI=1/C47H58N2O10SSi/c1-10-56-43(51)47(36(32-41(50)55-9)30-31-49(44(52)59-45(3,4)5)60(53,54)37-28-26-34(2)27-29-37)40<br />

(58-42(48-47)35-20-14-11-15-21-35)33-57-61(46(6,7)8,38-22-16-12-17-23-38)39-24-18-13-19-25-39/h11-29,36,40H,10,30-33H2,1-9H3<br />
/t36-,40-,47-/m0/s1</small>
</p>
```

In other words, fixing the long InChI/Google indexing problem may be as simple as just inserting <code>br</code> elements when needed. More on this later, though.

# Conclusions

This article has shown a working demonstration that uses free tools to build self-organizing, highly distributed, searchable chemical databases. Although the system is far from perfect, it does provide a glimpse at what can be done right now with relatively little effort. Starting with this basic idea, we can begin to think about a variety of fast, free, user-friendly services that make finding molecules on the Web, and publishing their wherabouts, as easy as using Google and WordPress. But that's a story for another time.


