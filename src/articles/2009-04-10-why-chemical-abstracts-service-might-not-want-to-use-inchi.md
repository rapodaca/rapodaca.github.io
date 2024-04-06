---
title: Why Chemical Abstracts Service Might Not Want To Use InChI
published: "2009-04-10T00:00:00.000Z"
---

In late March a company called [Outsell](http://www.outsellinc.com/) published an article on [InChI](http://www.iupac.org/inchi/) by Daniel Pollock that has created a bit of a stir. The article, titled [Chemical Bonding InChI by InChI](http://www.outsellinc.com/store/insights/4038) was retracted by Outsell, who write:

>On March 30th we published an Insights piece titled "Chemical Bonding InChI by InChI." We have removed it from our archives. We pride ourselves on publishing independent, fact-based research that provides strong, substantiated analysis and recommendations about key market dynamics. In the Important Details section of the piece, we did a good job of explaining details about The International Chemical Identifier as an emerging industry standard used to describe chemical substances. However, in the Implications section we published information about Chemical Abstract Service's highly-regarded SciFinder product that was incorrect, and we did not cite a sufficiently balanced set of references in developing our argument.
>
>Further, it is our practice to avoid speculating about an organization's stance on a topic without reaching out to the organization for on-the-record research briefings. Overall, the tone of the piece could be taken to single out CAS as being late in responding to the trends, and in our view the research and analysis did not support it.
>
>We regret that this piece didn't hold up to our internal standards and that it was not caught in our internal peer-review process before it was published. Even more, we regret that it didn't live up to the high standards you are accustomed to expecting from us. We apologize for the circumstances leading up to this.

The reasons for retraction seem to revolve around statements made about SciFinder and speculations made in the article about the Chemical Abstracts Service (CAS) response to InChI.

[The original article](http://209.85.229.132/search?q=cache:KyH1sY187YYJ:www.outsellinc.com/store/insights/4038+http://www.outsellinc.com/store/insights/4038&cd=1&hl=en&ct=clnk&gl=uk&client=firefox-a) is available through Google's cache.

The statements about SciFinder and the CAS response to InChI appear to have been made in two paragraphs:

>The current gold standard for identifying chemical substances are proprietary Chemical Abstracts Service (CAS) Registry Numbers, owned and operated by the American Society of Chemistry \[sic\] (ACS). We do not yet know if CAS plans to map its database to InChI. However, given that CAS has been criticised for its proprietary approach in the past, and took until April 2008 to release a web based version of its flagship SciFinder database, in Outsell’s opinion we may have to wait a while yet.
>
>However, we do hope that this is not the case since it is important that information providers do not Balkanize their information if they are not to get lost in the web (see Insights 18 July 2008, Nature Publishing Group Sets the Cat Amongst the Pigeons of Open Access, But Maybe We’re All Missing the Point). The point here is that open standards can benefit all by making information (products) easier to discover, and this speaks to one of the core demands of the networked environment. So, for example, CAS’s index of 40 million substances is not threatened by open standards and, in fact, our view is that mapping CAS numbers to an \[sic\] standard such as InChI can only help to make it more accessible. And with over 20 million substances now indexed by ChemSpider, the InChI could emerge as a - if not the - industry standard index of chemical substances on the web.


The retraction has prompted at least <strike>three</strike> four reactions so far:

-  [The Sceptical Chymist](http://blogs.nature.com/thescepticalchymist/2009/04/outsell_and_inchis.html) asks "Outsell now say that the original article wasn’t balanced and that the ‘tone of the piece could be taken to single out CAS as being late in responding to the trends’. Surely readers could make that judgement for themselves?"
-  [Antony Williams](http://www.chemspider.com/blog/conspiracy-theories-and-inchis-why-was-the-article-removed.html) notes that "Conspiracy theories are already moving around the community."
-  [Peter Murray Rust](http://wwmm.ch.cam.ac.uk/blogs/murrayrust/?p=1655) suspects "In short the best guess is that CAS see InChIs as a threat (I’ll discuss the foolishness of this below) and that they put pressure on Outsell to retract."
-  Activity on the CHMINF-L list.

For what it's worth, there are legitimate technical and legal arguments for why CAS many not want to "embrace" InChI just yet. Among them:

-  [no specification](/articles/2008/12/10/mr-inchi-tear-down-this-wall) that would enable the creation of an independent implementation;
-  single implementation with an [open source license](http://opensource.org/licenses/lgpl-2.1.php) that has come under [legitimate criticism](http://rosenlaw.com/oslbook.htm);
-  fails to generate unique identifier for many [molecules likely present in CAS Registry](/articles/2009/03/27/a-comprehensive-guide-flexmol-a-modern-language-for-chemical-representation-part-2-real-world-problems) (e.g., ferrocene, (R)- and (S)- BINAP);
-  InChI itself is [problematically long](/articles/2007/05/17/my-inchi-runneth-over) (breaks HTML layouts, for example) for even medium-sized molecules;
-  InChIKey has no mechanism for backward-compatibility with newer versions that may fix bugs or add features to the existing implementation;
-  the "final" version has only [very recently been available](http://www.iupac.org/inchi/release102final.html).

I have no idea whether any of these factors are important to CAS now or in the future. I also don't know why the Outsell article was retracted beyond what's available on their site.

What I can say is that it's inaccurate to portray InChI as anything but a technology with some potential at this point. The Outsell article painted a picture of something a bit more, and this may explain, in part, the retraction.

*Update: it now appears that the retraction on the Outsell site has been shortened to: "On March 30th we published an Insights piece titled "Chemical Bonding InChI by InChI." We have removed it from our archives."*