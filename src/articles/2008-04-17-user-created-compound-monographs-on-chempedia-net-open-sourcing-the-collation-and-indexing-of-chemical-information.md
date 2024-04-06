---
title: User-Created Compound Monographs on Chempedia.net - Open Sourcing the Collation and Indexing of Chemical Information
published: "2008-04-17T00:00:00.000Z"
---

Printed encyclopedias of chemical information like the [Merck Index](http://www.merckbooks.com/mindex/) suffer from the problem of becoming obsolete on publication. When new compounds are discovered, or when the information about a compound changes, those changes can take many months or years to appear in print form due to the high cost of publication. It doesn't have to be that way. This article introduces a new feature to the free online chemical encyclopedia [Chempedia](http://chempedia.com) that lets working scientists update is contents via [Wikipedia](http://wikipedia.org).

# About Chempedia.net

A [recent article](/articles/2008/04/04/chempedia-net-mashing-up-pubchem-and-wikipedia) introduced [Chempdia](http://chempedia.com), the free online chemical encyclopedia. This service is built on two of the largest [free and open repositories of chemical information](/articles/2007/01/24/thirty-two-free-chemistry-databases) in existence: [Wikipedia](http://wikipedia.org) and [PubChem](http://pubchem.ncbi.nlm.nih.gov/). PubChem supplies low-level chemical information such as connection tables, and Wikipedia supplies free-text descriptions of the properties and uses of certain molecules.

# Which Molecules?

Currently, Chempedia.net only includes [compound monographs](/articles/2008/04/02/wikipedia-for-cheminformatics-a-simple-web-api-for-finding-cas-numbers-in-compound-monographs) for about 1,000 of its over 300,000 molecules. These monographs were located by a manual process in which the titles for all Wikipedia articles were downloaded in alphabetized form; this process clustered titles that represented IUPAC nomenclature due to its use of leading numbers and symbols. IUPAC nomenclature titles were extracted, and then a script was written to extract the chemical information from these titles and combine it with that from PubChem.

This method, although useful for getting a service running, is clearly flawed. The biggest problem is in how to discover new compound monographs.

# Why Not Put Users in Control?

Chempedia users themselves are in the best position to know when an existing Wikipedia compound monograph should appear in Chempedia but doesn't, when an existing monograph needs to be updated, or when a new monograph is written and needs to be linked.

How can the process be [automated](/articles/2006/08/19/history-of-abstracting-at-chemical-abstracts-service)?

As a partial answer to this question, users [now have the ability to notify Chempedia of any changes to a Wikipedia compound monograph](http://chempedia.net/articles/new), and to have those changes immediately reflected in the next viewing of a Chempedia compound monograph.

# An Example

As an example, let's take [anandamide](http://en.wikipedia.org/wiki/anandamide), a compound I've had some experience with during my time as a medicinal chemist. Although the [Chempedia entry for ananandamide](http://chempedia.net/compounds/6030) exists, there is (or as of today - was) no link to the Wikipedia compound monograph. Let's create one.

At the top of [Chempedia's main menu](http://chempedia.com/), you'll see a link titled '[Update](http://chempedia.net/articles/new)'. Choosing this link leads to a form that will ask for two pieces of information: (1) the title of the Wikipedia article to which you want Chempedia to link - in this case '[anandamide](http://en.wikipedia.org/wiki/anandamide)'; and (2) [reCaptcha](/articles/2007/09/18/six-reasons-i-like-recaptcha-or-how-to-build-a-web-service-worth-talking-about) text to keep robots from making mischief.

Submitting this information is all that's needed to create a new or updated link from Chempedia to Wikipedia. Chempedia handles the rest.

# Conclusions

Wikipedia is a vast source of free, high-quality, semi-structured chemical information just waiting to have good chemically-aware interfaces applied to it. Chempedia.net is an attempt to do just that, but it's a bit more as well. Although it may appear that Chempedia is the major beneficiary in this relationship, Wikipedia also benefits. When chemists have a tool that allows them to query and visualize Wikipedia using their native language (the chemical structure) they're in a better position to both use and contribute to Wikipedia itself - something I've started to do.

This positive feedback effect is the real value of exposing Web services. The question is: who in cheminformatics is willing and able to take the risk to discover this simple principle and its benefits?