---
title: "18 SMILES Problems as Seen through Twitter Polls"
summary: "Understanding the problem is the first step toward solving it."
twitter: true
summary-image: images/posts/20220615/summary.png
published: "2022-06-15T16:30:00Z"
---

SMILES is a de facto standard for chemical data exchange. It's routinely found in public-facing databases, supported by most widely-used cheminformatics toolkits, and for the last few years has even appeared in the context of machine learning. The problem is that the language was never completely specified.

The claim that one of chemistry's most important data formats is incompletely specified may seem extraordinary. As Carl Sagan so famously put it, extraordinary claims require extraordinary evidence. [A paper I'm working on](https://github.com/rapodaca/dialect) presents this evidence, outlines some implications, and offers practical solution. But there's another way to understand the breadth and depth of the problem: the social dimension.

Those who read [my Tweets](https://twitter.com/rapodaca) have probably noticed a series of polls I've been running since 2020. In this series I pose multiple-choice question about SMILES. I've posted 18 of them, each typically receiving from a handful to 30 responses. I've noticed some patterns in doing this and thought it might be interesting to collect everything in a single place through this post. My comments sometimes use the phrase "the documentation," which refers to the documentation published by Daylight and Weininger. There's more [here](/articles/2022/06/01/protosmiles/).

To be clear I don't view these polls as necessarily representative of the wider chemistry community's views on SMILES. For one thing, sample size is small. For another, I'm not sure who my followers are, their level of expertise, or how many bots are answering these polls. I do, however, note some recurring patterns in the responses that might warrant further exploration. Most importantly, though, several of these surveys generated discussions which are worth reading. Finally, the examples I chose resulted from actual problems I faced in writing a [manuscript](https://github.com/rapodaca/dialect) and a [reference implementation](https://github.com/rapodaca/dialect.rs) for a path forward. Each poll therefore reflect an area where the documentation is especially weak.

# Chemical Elements

What chemical elements does SMILES allow? The answer might surprise you. Consider this question from earlier this year:

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">The IUPAC-recognized element symbol &quot;Ts&quot; is valid in SMILES. <a href="https://twitter.com/hashtag/cheminformatics?src=hash&amp;ref_src=twsrc%5Etfw">#cheminformatics</a></p>&mdash; Rich Apodaca (@rapodaca) <a href="https://twitter.com/rapodaca/status/1488532868330631172?ref_src=twsrc%5Etfw">February 1, 2022</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

"Ts" is of course the symbol for the element [tennessine](https://en.wikipedia.org/wiki/Tennessine). Its addition to the periodic table by IUPAC occurred many years after everything written by Weininger or Daylight about SMILES had been published. As such, it raises the question of how SMILES should evolve. The survey reveals not just a split in opinions, but clear uncertainty on the topic.

Next, consider [hahnium](https://en.wikipedia.org/wiki/Hassium). Haven't heard of it? Neither had I until I started really digging into the documentation. Weininger appears to have been unaware that IUPAC resolved the long-running controversy over the naming of element 105 by replacing the symbol "Ha" with "Db" (dubnium). A periodic table he presents in one document uses the old element symbol, implying that Ha is a valid SMILES element symbol. Responders were divided.

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">&quot;Ha&quot; is a valid element symbol in SMILES: <a href="https://twitter.com/hashtag/cheminformatics?src=hash&amp;ref_src=twsrc%5Etfw">#cheminformatics</a></p>&mdash; Rich Apodaca (@rapodaca) <a href="https://twitter.com/rapodaca/status/1496656470019960832?ref_src=twsrc%5Etfw">February 24, 2022</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

# Aromaticity

SMILES supports a concept Weininger called "aromaticity." It confusingly has little relationship to the concept of the same name in organic chemistry. Worse, aromaticity is one of the things that's hardest to nail down in SMILES.

Let's start with something easy first: what atoms can be marked as "aromatic?" Something that just about everyone knows about SMILES is that lower case atoms are "aromatic." But which atoms can be marked in this way?

Respondents were split on the question when it comes to silicon.

<blockquote class="twitter-tweet"><p lang="in" dir="ltr">The SMILES string &quot;[siH]1ccccc1&quot; is: <a href="https://twitter.com/hashtag/cheminformatics?src=hash&amp;ref_src=twsrc%5Etfw">#cheminformatics</a></p>&mdash; Rich Apodaca (@rapodaca) <a href="https://twitter.com/rapodaca/status/1535004983447261184?ref_src=twsrc%5Etfw">June 9, 2022</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

They were, however, more convinced that tellurium qualifies as an aromatic atom.

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">The SMILES [te]1cccc1 is:</p>&mdash; Rich Apodaca (@rapodaca) <a href="https://twitter.com/rapodaca/status/1312109333526634497?ref_src=twsrc%5Etfw">October 2, 2020</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

The problem is that the documentation never says unambiguously *which* atoms can be marked aromatic. So it should come as no surprise that different people will have different ideas on the topic.

The star atom ("*") may seem familiar and reasonable. It denotes an atom whose element is unknown. What happens when this atom appears in a SMILES aromatic ring?

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">The SMILES string &quot;*1ccccc1&quot; is best characterized by which statement? <a href="https://twitter.com/hashtag/cheminformatics?src=hash&amp;ref_src=twsrc%5Etfw">#cheminformatics</a></p>&mdash; Rich Apodaca (@rapodaca) <a href="https://twitter.com/rapodaca/status/1508902687101710337?ref_src=twsrc%5Etfw">March 29, 2022</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

About half said that the resulting SMILES is invalid. Nothing in the documentation speaks to this notion, so I have to give the popcorn people points on this one.

On the other hand, strange questions arise when you really start thinking about the meaning of the star atom in aromatic systems. Consider this one.

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">The SMILES *1*****1 could be kekulized as:</p>&mdash; Rich Apodaca (@rapodaca) <a href="https://twitter.com/rapodaca/status/1347314008475357184?ref_src=twsrc%5Etfw">January 7, 2021</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

Only two people voted on this one, something I think might be due to [a recent event](https://en.wikipedia.org/wiki/2021_United_States_Capitol_attack) that blew Twitter up for some time.

The aromatic bond (":") seems straightforward enough on the surface. But appearances can be deceiving. Although the documentation states that the bond type exists, no actual effect of its presence was offered. It's hard to read a lot into the survey below given the low turnout (even by the standards of the other surveys), but the first option is completely incompatible with the others, and the second two options may or may not be compatible depending on the application.

<blockquote class="twitter-tweet"><p lang="fr" dir="ltr">The SMILES C:1:C:C:C:C:C1 represents</p>&mdash; Rich Apodaca (@rapodaca) <a href="https://twitter.com/rapodaca/status/1344132922912120832?ref_src=twsrc%5Etfw">December 30, 2020</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

What are the precise steps for converting an aromatic structure to a "kekulized" form (alternating single- and double-bonds)? The documentation says very little on the topic. This leads to a lot of confusion around what happens to existing bonds. Take the following for example.

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">The correct hydrogen count for the leftmost atom in the SMILES &quot;c1=ccccc1&quot; is:</p>&mdash; Rich Apodaca (@rapodaca) <a href="https://twitter.com/rapodaca/status/1334513184452046855?ref_src=twsrc%5Etfw">December 3, 2020</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

The correct assignment of bond orders is no trivial matter. Get it wrong and everything about the molecule could be wrong, from the formula to the molecular weight to almost every chemical property. The majority are saying that kekulization does not promote a double bond to a triple bond. The problem is that the documentation says nothing on this issue.

What are the implications for molecules like [benzyne](https://en.wikipedia.org/wiki/Aryne). How should such species be represented in SMILES using aromatic notation, if at all? Consider the following.

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Now for a slightly different question: the correct hydrogen count for the leftmost atom in the SMILES &quot;c1#ccccc1&quot; is:</p>&mdash; Rich Apodaca (@rapodaca) <a href="https://twitter.com/rapodaca/status/1334905296859267072?ref_src=twsrc%5Etfw">December 4, 2020</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

The low response rate makes it harder to draw conclusions, but the majority response on this one is inconsistent with the previous one. Again, the documentation is silent on this important issue and so there will be disagreements.

However the aromatic form is kekulized, the procedure should be internally consistent. So what happens when a six membered ring has all aromatic atoms and explicit single bonds between each one?

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">On encountering the SMILES c1-c-c-c-c-c-1, a program should:</p>&mdash; Rich Apodaca (@rapodaca) <a href="https://twitter.com/rapodaca/status/1225548644000190472?ref_src=twsrc%5Etfw">February 6, 2020</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

The majority says the species is an error. Oddly, no other question showed such high degree of consensus despite the results appearing at least superficially to contradict the previous two surveys. Nevertheless, nothing in the existing documentation states (or even implies) the majority view.

# Hydrogen Suppression

[Hydrogen suppression](/articles/2020/06/08/hydrogen-suppression-in-smiles/) in SMILES takes two forms: virtual hydrogen and implicit hydrogen. The former associates an integer hydrogen count with an atom as an attribute and the latter computes an integer hydrogen count.

A recurring limitation in the documentation is that integer quantities lack upper and lower bounds. Virtual hydrogen count is one such property. Is a zero virtual hydrogen count allowed? If the attribute is missing it defaults to zero (e.g, "[C]"), but the documentation is silent on whether "H0" is allowed.

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">The string &quot;[CH0]&quot; (&quot;0&quot; the digit) is a valid SMILES encoding: <a href="https://twitter.com/hashtag/cheminformatics?src=hash&amp;ref_src=twsrc%5Etfw">#cheminformatics</a></p>&mdash; Rich Apodaca (@rapodaca) <a href="https://twitter.com/rapodaca/status/1528485108654624768?ref_src=twsrc%5Etfw">May 22, 2022</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

The special case of a virtual hydrogen count on hydrogen itself is ambiguously treated in the documentation. The majority says it is allowed, but it's not hard to interpret the documentation as saying the opposite, as noted in the comments for the following survey.

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">[HH] is a valid SMILES string. <a href="https://twitter.com/hashtag/cheminformatics?src=hash&amp;ref_src=twsrc%5Etfw">#cheminformatics</a></p>&mdash; Rich Apodaca (@rapodaca) <a href="https://twitter.com/rapodaca/status/1504961161657151493?ref_src=twsrc%5Etfw">March 18, 2022</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

What happens when virtual hydrogen count is less than an atom's default valence? Respondents were not in agreement for the survey below. For its part, the documentation says nothing, so I give the "do nothing special" responders credit. The third response is demonstrably against the documentation.

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">A program reading SMILES encounters C[CH]C, in which the second atom is subvalent (3). The program should:</p>&mdash; Rich Apodaca (@rapodaca) <a href="https://twitter.com/rapodaca/status/1173738116592492546?ref_src=twsrc%5Etfw">September 16, 2019</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

# Stereochemistry

SMILES supports stereochemical configuration for the simple case of tetrahedrally-arranged substituents. But what happens when a stereocenter is possible but configuration is not set? The documentation says nothing, and not surprisingly the respondents are split.

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">A SMILES with a stereocenter whose configuration is not set (i.e., no @ or @@) should be interpreted as... <a href="https://twitter.com/hashtag/cheminformatics?src=hash&amp;ref_src=twsrc%5Etfw">#cheminformatics</a></p>&mdash; Rich Apodaca (@rapodaca) <a href="https://twitter.com/rapodaca/status/1489371871581589508?ref_src=twsrc%5Etfw">February 3, 2022</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

Double bond conformation is supported through a most cumbersome mechanism of partial parity bonds. Without getting into the details, using this feature gets very difficult when combined with bridging over ring-closure bonds. The survey below is a case in point. My reading says that the response most consistent with the documentation is the first one.

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">The SMILES consistent with cis-cyclooctene is:</p>&mdash; Rich Apodaca (@rapodaca) <a href="https://twitter.com/rapodaca/status/1447653572527607808?ref_src=twsrc%5Etfw">October 11, 2021</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

The documentation does not consider the possibility that *three* substituents might appear on a double bond terminal. As such, the response to the survey below is not surprisingly split.

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">The SMILES &quot;C/N=P(/F)(\Cl)Br&quot; places Br:</p>&mdash; Rich Apodaca (@rapodaca) <a href="https://twitter.com/rapodaca/status/1340087119436378112?ref_src=twsrc%5Etfw">December 19, 2020</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

[OpenSMILES](http://opensmiles.org) was an initiative to, at least in part, address the ambiguities in the available SMILES documentation. Even so, nailing down double bond conformation is no easy task. What happens when only one of two necessary partial parity bonds are used? OpenSMILES gives no clear answer, and the responses were mixed.

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Under OpenSMILES, what can be said about SMILES A and B?<br><br>A. CC=C/C<br>B. CC=C/C=C\CCC</p>&mdash; Rich Apodaca (@rapodaca) <a href="https://twitter.com/rapodaca/status/1224773640320770048?ref_src=twsrc%5Etfw">February 4, 2020</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

# Conclusion

What can be learned from this ongoing experiment so far? The main lesson I draw is that there are even today a lot of conflicting views about SMILES syntax and semantics. This should be unsettling given the important role SMILES has assumed in the modern practice of chemistry. How many [FAIR principles](https://www.go-fair.org/fair-principles/) are at risk because the chemistry community can't agree on what strings purporting to be SMILES mean? [Noel O'Boyle](https://baoilleach.blogspot.com/) has made a start with the [SMILES Reading Benchmark](https://baoilleach.blogspot.com/2020/10/the-smiles-reading-benchmark-two-years.html), but I think more work is justified.

From time to time calls for the standardization of SMILES pop up. It may be too late for that. Many decades have elapsed since SMILES was introduced. Vendors have implemented idiosyncratic behavior, and their customers have come to rely on it. Too much of the authoritative documentation created by Weininger and Daylight is ambiguous or even self-contradictory. Too little attention has been paid to interoperability along the way. With that I'll end with a final survey:

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">SMILES is: <a href="https://twitter.com/hashtag/cheminformatics?src=hash&amp;ref_src=twsrc%5Etfw">#cheminformatics</a></p>&mdash; Rich Apodaca (@rapodaca) <a href="https://twitter.com/rapodaca/status/1499900219592380419?ref_src=twsrc%5Etfw">March 5, 2022</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

