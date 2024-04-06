---
title: Predicting Synthetic Accessibility
disqus: true
published: "2010-10-28T00:00:00.000Z"
---

After screening a panel of substances for activity, one of the most important questions to answer revolves around the relative *synthetic accessibility* of the most interesting hits. Synthetic accessibility is critical in both re-synthesis of hits and in preparing analogs around a hit of interest. Although synthetic accessibility isn't the only factor to consider when prioritizing hits for follow-up, it's one of the most important and figures decisively in the success or failure of many lead optimization efforts.

# Why Synthetic Accessibility Matters

Given the choice between starting a program with hits possessing undesirable logP or low synthetic accessibility, most experienced medicinal chemists would choose undesirable logP. The reason is simple: a synthetically accessible target affords the opportunity to formulate and test multiple hypotheses in designing your way around undesirable properties - to conduct a real scientific study in other words. A target with low synthetic accessibility is a crapshoot - take your best guess and then move on because you'll be out of bullets after preparing only a few analogs.

# Where's the Software?

Still, there are dozens of ways to cheaply calculate logP and other properties that play a minor role in the early phases of an optimization effort, and almost none to calculate synthetic accessibility.

What makes an accessible synthetic target and how should synthetic accessibility be quantified? A recent paper by Peter Ertl and Ansgar Schuffenhauer attempts to answer these questions: [Estimation of synthetic accessibility score of drug-like molecules
based on molecular complexity and fragment contributions](http://dx.doi.org/10.1186/1758-2946-1-8).

# SA Score

The Ertl and Schuffenhauer paper is noteworthy for two main reasons: (1) it uses a fragment-based approach to derive a synthetic accessibility (SA) score; and (2) the SA score was independently validated against the estimation of experienced medicinal chemists.

The way SA scores were derived is quite clever. A subset of one million structures from PubChem was fragmented. Fragments were scored according to their frequency of occurrence, with most common fragments receiving higher scores.

The idea behind the fragment component of SA is that PubChem primarily represents a collection of substances that have actually been made, tested in an assay, or sold commercially. When a fragment appears repeatedly in PubChem across multiple entries, it suggests that this fragment is relatively easy to come by.

Other factors besides this fragment contribution were taken into account when assigning SA, such as ring complexity. At the end of the process, a system capable assigning an SA score (on a scale of 1 to 10) to any structure had been created.

# Proof of the Pudding

Great - Ertl and Schuffenhauer can rank structures by synthetic accessibility - but how well do they actually predict synthetic accessibility?

To answer this question, a selection of 40 PubChem structures not in the SA training set were included in a Web-based survey and this survey was administered to nine experienced medicinal chemists at Novartis. The chemists were asked to rank each structure on a scale of 1 to 10 for synthetic accessibility. 

The results are shown below:

[![Synthetic Accessibility](/images/posts/synthetic-accessibility.png "Synthetic Accessibility")](http://dx.doi.org/10.1186/1758-2946-1-8)

Red circles are automatically-generated SA scores and blue circles are SA scores as determined by the nine Novartis medicinal chemists. The error bars reveal significant disagreement among the medicinal chemists on the SA of several structures.

Overall agreement was reasonably good between the two methods, given the variability of chemist responses and the novelty of of the SA algorithm. The authors note two important outliers (marked "A" and "B"). "A" is a structure that the SA algorithm predicted lower synthetic accessibility for, but the medicinal chemists correctly determined would be easy to make based on its symmetry. "B" is a structure of high synthetic accessibility due to the commercial availability of an advanced precursor, a point the medicinal chemists failed to recognize. (The ring system was present in over 39,000 PubChem structures).

# Conclusions

The approach described in this paper on synthetic accessibility is important because of its simplicity and low cost compared to previous attempts. Using nothing more than a free public dataset and some simple calculations, a predictor of synthetic accessibility was derived that performed well against a panel of trained medicinal chemists. The basic approach should lend itself well to further experimentation and refinement.