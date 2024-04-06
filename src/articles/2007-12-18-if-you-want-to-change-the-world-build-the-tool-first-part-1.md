---
title: "If You Want to Change the World, Build the Tool First - Part 1"
disqus: true
published: "2007-12-18T00:00:00.000Z"
---

Breakthroughs in technologies for managing and exchanging information always precede explosions in information exchange. From a safe distance, this principle seems completely [obvious](/articles/2007/10/03/designing-the-obvious-permalinks-and-paradigms). Yet, like most obvious things, it's all too easy to forget in the heat of battle.

Recently, Peter Murray-Rust discussed [the appalling state of data capture, dissemination, preservation and curation](http://wwmm.ch.cam.ac.uk/blogs/murrayrust/?p=869). His comments were prompted by [an article written by Nico Adams](http://wwmm.ch.cam.ac.uk/blogs/adams/?p=43). In it, Nico discusses his initial excitement by the publication of a large spectroscopic dataset, followed by his frustration in finding that the "data" really consisted of nothing more than flat images stored in PDF format.

The article in question is titled *[Preparation and Infrared/Raman Classification of 630 Spectroscopically Encoded Styrene Copolymers](http://dx.doi.org/10.1021/cc7001292)*. Not having a subscription to the ASAP contents of this particular journal, I can only go by what appears in the abstract. From the abstract and title, it's clear that the dataset is the centerpiece of this article:

> The barcoded resins (BCRs) were introduced recently as a platform for encoded combinatorial chemistry. One of the main challenges yet to be overcome is the demonstration that a large number of BCRs could be generated and classified with high confidence. Here, we describe the synthesis and classification of 630 polystyrene-based copolymers prepared from the combinatorial association of 15 spectroscopically active styrene monomers. Each of the 630 copolymers displayed a unique vibrational fingerprint (infrared and Raman), which was converted into a spectral vector. ...

Apparently, the technique enables polymer beads to be encoded with a spectroscopically-readable tag for use in identifying attached compounds at the end of a split-pool synthesis. Yet the [supplementary material for the article](http://pubs3.acs.org/acs/journals/supporting_information.page?in_manuscript=cc7001292) consists of nothing more than static images like the one below:

![spectrum](/images/posts/20071218/spectrum.png "spectrum")

For researchers hoping to build on the experiments described in the paper, and for those hoping to model or compile the results, static images like the one shown above are practically useless.

Why did this happen and why do incidents like it play out with bewildering regularity in chemistry?

Nico looks to scientists and publishers, whereas Peter focuses on the publishers as the root cause.

I understand the reasoning and share their concern about the problem, but I disagree about the cause.

The cause of this problem is neither the policies of publishers nor the lack of understanding of the problem by scientists - those are just symptoms. The root cause is a failure of cheminformatics itself. Simply put, cheminformatics has failed to deliver an inexpensive, robust, and truly usable solution to the problem of compiling, managing, and sharing spectral data for scientists of average computer skills.

The tool hasn't been built yet. No tool means that both scientists and publishers will continue to use the only tools they have any faith in, despite their obvious flaws. No tool leads to more of the same, from both scientists and publishers. No tool also means [an enormous opportunity](/articles/2007/02/14/whats-broken-in-cheminformatics) for the group that develops it.

Read Part 2 to find out why.
